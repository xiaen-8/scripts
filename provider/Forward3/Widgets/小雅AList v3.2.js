// @name 小雅AList
// @description 小雅AList Forward 模块：聚合搜索、目录浏览和播放
// @version 3.2

var DEFAULT_SERVER = "http://yourip:5678";
var REQUEST_TIMEOUT = 20000;
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36";

var VIDEO_EXTENSIONS = /\.(mp4|mkv|avi|rmvb|flv|wmv|mov|ts|m4v|mpg|mpeg|webm|vob|m2ts|3gp|asf|m3u8|rm|ram|swf|ogv|f4v|divx|xvid)$/i;
var SUBTITLE_EXTENSIONS = /\.(srt|ass|ssa|vtt)$/i;
// 已知非视频文件（元数据/图片/字幕/iso 镜像/等），双保险排除，避免被误判为可播放视频
var NON_VIDEO_EXTENSIONS = /\.(nfo|jpg|jpeg|png|gif|bmp|webp|txt|srt|ass|ssa|vtt|sub|idx|smi|sfv|torrent|url|iso)$/i;
var DEFAULT_POSTER = "http://img.xiaoya.pro/xiaoya.jpg";

function logInfo(message, data) {
  if (data !== undefined) console.log("[小雅AList] " + message + ": " + safeStringify(data));
  else console.log("[小雅AList] " + message);
}

function logError(message, error) {
  console.error("[小雅AList] " + message + ": " + (error && error.message ? error.message : safeStringify(error)));
}

function safeStringify(value) {
  if (typeof value === "string") return value;
  try { return JSON.stringify(value); } catch (e) { return String(value); }
}

function trimSlash(value) {
  return String(value || "").replace(/\/+$/, "");
}

function getServer(params) {
  var server = params && (params.Server || params.server) ? (params.Server || params.server) : DEFAULT_SERVER;
  return trimSlash(server || DEFAULT_SERVER);
}

// ==================== 账号密码 / 鉴权 ====================
// 提取账号密码；未配置时返回空账号，调用方会自动退化为匿名访问（保持原行为）
function getAuth(params) {
  params = params || {};
  return {
    username: params.Username || params.username || "",
    password: params.Password || params.password || ""
  };
}

function authStorageKey(server) {
  return "xiaoya.auth:" + serverOf({ Server: server });
}

function serverOf(params) {
  return trimSlash(getServer(params)).replace(/\/dav$/i, "");
}

// 缓存账号密码，供 loadDetail（只拿到 link 字符串，没有 params）回查
function rememberAuth(params) {
  params = params || {};
  var server = getServer(params);
  var auth = getAuth(params);
  if (Widget.storage && Widget.storage.set && auth.username) {
    Widget.storage.set(authStorageKey(server), safeStringify(auth));
  }
  return { server: server, auth: auth };
}

function rememberedAuth(server) {
  if (!Widget.storage || !Widget.storage.get) return { username: "", password: "" };
  var raw = Widget.storage.get(authStorageKey(server));
  if (!raw) return { username: "", password: "" };
  try {
    var auth = typeof raw === "string" ? JSON.parse(raw) : raw;
    return { username: auth.username || "", password: auth.password || "" };
  } catch (e) {
    return { username: "", password: "" };
  }
}

function base64Encode(value) {
  if (typeof btoa === "function") return btoa(value);
  if (Widget.base64 && Widget.base64.encode) return Widget.base64.encode(value);
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var str = encodeURIComponent(value).replace(/%([0-9A-F]{2})/g, function(_, hex) {
    return String.fromCharCode(parseInt(hex, 16));
  });
  var output = "";
  for (var block = 0, charCode, idx = 0, map = chars; str.charAt(idx | 0) || (map = "=", idx % 1); output += map.charAt(63 & block >> 8 - idx % 1 * 8)) {
    charCode = str.charCodeAt(idx += 3 / 4);
    block = block << 8 | charCode;
  }
  return output;
}

function basicAuthHeader(auth) {
  if (!auth || !auth.username) return "";
  return "Basic " + base64Encode(auth.username + ":" + (auth.password || ""));
}

function tokenStorageKey(server, auth) {
  return "xiaoya.token:" + server + ":" + (auth && auth.username ? auth.username : "");
}

// 登录换取 token；匿名（无用户名）时返回空字符串，沿用匿名调用
async function fetchAlistToken(server, auth, refresh) {
  if (!auth || !auth.username) return "";
  var key = tokenStorageKey(server, auth);
  if (!refresh && Widget.storage && Widget.storage.get) {
    var cached = Widget.storage.get(key);
    if (cached) return cached;
  }
  try {
    var res = await Widget.http.post(server + "/api/auth/login", JSON.stringify({ username: auth.username, password: auth.password || "" }), {
      headers: buildHeaders("application/json"),
      timeout: REQUEST_TIMEOUT
    });
    var data = res && res.data !== undefined ? res.data : res;
    if (typeof data === "string") { try { data = JSON.parse(data); } catch (e) { data = null; } }
    var token = data && data.code === 200 && data.data && data.data.token ? data.data.token : "";
    if (token && Widget.storage && Widget.storage.set) Widget.storage.set(key, token);
    return token;
  } catch (error) {
    logError("AList 登录失败", error);
    return "";
  }
}

function invalidateToken(server, auth) {
  if (Widget.storage && Widget.storage.set && auth && auth.username) {
    Widget.storage.set(tokenStorageKey(server, auth), "");
  }
}

function isVideoFile(name) {
  return VIDEO_EXTENSIONS.test(name || "");
}

function isSubtitleFile(name) {
  return SUBTITLE_EXTENSIONS.test(name || "");
}

function cleanFileName(name) {
  return String(name || "").replace(VIDEO_EXTENSIONS, "").replace(/[._]+/g, " ").trim();
}

function formatEpisodeTitle(name) {
  var cleaned = cleanFileName(name);
  if (/^\d{1,4}$/.test(cleaned)) return "第" + parseInt(cleaned, 10) + "集";
  return cleaned;
}

// 从路径向上查找有意义的文件夹名（含中文、非纯技术字符）作为显示标题
// 如 /影视/绵羊侦探团/2026.2160p.xxx.mkv → "绵羊侦探团"
function titleFromPath(path) {
  var parts = normalizePath(String(path || "")).split("/").filter(Boolean);
  for (var i = parts.length - 1; i >= 0; i--) {
    var name = parts[i];
    // 跳过纯文件名（带视频扩展名）
    if (VIDEO_EXTENSIONS.test(name.toLowerCase())) continue;
    // 跳过纯数字文件夹（如 "2026"）
    if (/^\d+$/.test(name)) continue;
    // 跳过纯技术标签（全英文+数字+标点，无中文且短）
    var stripped = name.replace(/[.\-_\s]/g, "");
    if (stripped && !/[\u4e00-\u9fa5]/.test(stripped) && /^[\w]+$/.test(stripped)) continue;
    return cleanFileName(name);
  }
  // 兜底：取倒数第二个非文件段
  for (var j = parts.length - 2; j >= 0; j--) {
    return cleanFileName(parts[j]);
  }
  return "";
}

// 检查文件名是否为纯技术信息（无中文、无有意义的标题文字）
function isTechnicalFileName(name) {
  var cleaned = String(name || "").replace(VIDEO_EXTENSIONS, "").replace(/[.\-_\s]+/g, "");
  if (!cleaned) return true;
  // 有中文说明有标题信息
  if (/[\u4e00-\u9fa5]/.test(cleaned)) return false;
  // 纯数字（如 "2026"）视为无标题
  if (/^\d+$/.test(cleaned)) return true;
  return false;
}

function joinPath(base, name) {
  base = base || "/";
  if (base === "/") return "/" + name;
  return base.replace(/\/+$/, "") + "/" + name;
}

function normalizePath(path) {
  path = decodeURIComponent(String(path || "/"));
  if (!path) return "/";
  if (path.charAt(0) !== "/") path = "/" + path;
  return path.replace(/\/{2,}/g, "/");
}

function formatFileSize(bytes) {
  bytes = Number(bytes || 0);
  if (!bytes) return "";
  var units = ["B", "KB", "MB", "GB", "TB"];
  var i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes = bytes / 1024;
    i++;
  }
  return bytes.toFixed(i ? 1 : 0) + " " + units[i];
}

function encodePathForUrl(path) {
  return encodeURI(normalizePath(path)).replace(/#/g, "%23").replace(/\?/g, "%3F");
}

function encodeLinkParams(params) {
  var parts = [];
  for (var key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key) && params[key] !== undefined && params[key] !== null) {
      parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(String(params[key])));
    }
  }
  return parts.join("&");
}

function parseLinkParams(link) {
  var result = {};
  var query = String(link || "").split("?")[1] || "";
  var pairs = query.split("&");
  for (var i = 0; i < pairs.length; i++) {
    if (!pairs[i]) continue;
    var index = pairs[i].indexOf("=");
    var key = index >= 0 ? pairs[i].slice(0, index) : pairs[i];
    var value = index >= 0 ? pairs[i].slice(index + 1) : "";
    result[decodeURIComponent(key)] = decodeURIComponent(value);
  }
  return result;
}

function makeXiaoyaLink(kind, params) {
  return "xiaoya://" + kind + "?" + encodeLinkParams(params);
}

function buildHeaders(contentType) {
  var headers = {
    "User-Agent": UA,
    "Accept": "application/json, text/plain, */*"
  };
  if (contentType) headers["Content-Type"] = contentType;
  return headers;
}

async function httpGet(url) {
  try {
    var res = await Widget.http.get(url, { headers: buildHeaders(), timeout: REQUEST_TIMEOUT });
    return res && res.data !== undefined ? res.data : res;
  } catch (error) {
    logError("GET 请求失败 " + url, error);
    return null;
  }
}

async function httpPostJson(url, body) {
  try {
    var res = await Widget.http.post(url, JSON.stringify(body || {}), {
      headers: buildHeaders("application/json"),
      timeout: REQUEST_TIMEOUT
    });
    var data = res && res.data !== undefined ? res.data : res;
    if (typeof data === "string") {
      try { data = JSON.parse(data); } catch (e) { return null; }
    }
    return data;
  } catch (error) {
    logError("POST 请求失败 " + url, error);
    return null;
  }
}

// 带账号密码的 POST（AList API）：优先用 token，token 失效自动刷新一次
// auth 为空（匿名）时等价于 httpPostJson，保持原行为
async function authedPost(server, apiPath, body, auth, retry) {
  if (!auth || !auth.username) return httpPostJson(trimSlash(server) + apiPath, body);
  try {
    var token = await fetchAlistToken(server, auth, retry);
    var headers = buildHeaders("application/json");
    if (token) headers["Authorization"] = token;
    var res = await Widget.http.post(trimSlash(server) + apiPath, JSON.stringify(body || {}), {
      headers: headers,
      timeout: REQUEST_TIMEOUT
    });
    var data = res && res.data !== undefined ? res.data : res;
    if (typeof data === "string") { try { data = JSON.parse(data); } catch (e) { data = null; } }
    // 鉴权失败且未重试过：清掉 token 重试一次
    if (data && data.code && data.code !== 200 && !retry) {
      invalidateToken(server, auth);
      return authedPost(server, apiPath, body, auth, true);
    }
    return data;
  } catch (error) {
    if (!retry) {
      invalidateToken(server, auth);
      return authedPost(server, apiPath, body, auth, true);
    }
    logError("AList API 失败 " + apiPath, error);
    return null;
  }
}

// 带账号密码的 GET（/whatsnew /sou 等页面）：匿名时等价于 httpGet
async function authedGet(server, path, auth) {
  if (!auth || !auth.username) return httpGet(trimSlash(server) + path);
  try {
    var res = await Widget.http.get(trimSlash(server) + path, {
      headers: buildAuthHeaders(null, auth),
      timeout: REQUEST_TIMEOUT
    });
    return res && res.data !== undefined ? res.data : res;
  } catch (error) {
    logError("页面请求失败 " + path, error);
    return null;
  }
}

// 在标准 headers 上追加 Basic 鉴权头
function buildAuthHeaders(contentType, auth) {
  var headers = buildHeaders(contentType);
  var authValue = basicAuthHeader(auth);
  if (authValue) headers["Authorization"] = authValue;
  return headers;
}

async function alistListDir(server, path, page, perPage, auth) {
  var res = await authedPost(server, "/api/fs/list", {
    path: normalizePath(path),
    password: "",
    page: page || 1,
    per_page: perPage || 200,
    refresh: false
  }, auth);
  if (!res || res.code !== 200 || !res.data) return { content: [], total: 0 };
  return res.data;
}

async function alistSearchApi(server, keyword, page, perPage, auth) {
  var res = await authedPost(server, "/api/fs/search", {
    parent: "/",
    keywords: keyword,
    password: "",
    page: page || 1,
    per_page: perPage || 100
  }, auth);
  if (!res || res.code !== 200 || !res.data) return { content: [], total: 0 };
  return res.data;
}

function getItemIsDir(item) {
  return item && (item.is_dir === true || item.type === 1);
}

function getItemIsVideo(item) {
  if (!item || getItemIsDir(item)) return false;
  // 双保险：显式排除 nfo/jpg/字幕等元数据文件（这些 type 常为 0）
  if (NON_VIDEO_EXTENSIONS.test(item.name || "")) return false;
  // 以视频扩展名为权威依据；不再把 type===0（"其他文件"）兜底为视频，
  // 否则 nfo/txt 等会被误判成可播放视频，顶掉真正的多集剧集
  return isVideoFile(item.name);
}

function buildPlayUrl(server, path) {
  server = trimSlash(server);
  path = normalizePath(path);
  return server + "/d" + encodePathForUrl(path);
}

function makeListItemFromPath(server, title, path, poster, description, isFile) {
  var link = makeXiaoyaLink(isFile ? "file" : "dir", {
    server: server,
    path: normalizePath(path)
  });
  return {
    id: link,
    type: "link",
    title: title,
    posterPath: poster || "",
    backdropPath: poster || "",
    description: description || "",
    mediaType: "movie",
    link: link
  };
}

function emptyItem(title, description) {
  return [{ id: "empty", type: "text", title: title, description: description || "" }];
}

function sortByNaturalName(a, b) {
  return String(a.name || a.title || "").localeCompare(String(b.name || b.title || ""), "zh-CN", { numeric: true });
}

async function loadDirectory(params) {
  rememberAuth(params);
  var server = getServer(params);
  var auth = getAuth(params);
  var path = params && params.path ? params.path : "/";
  var data = await alistListDir(server, path, params && params.page ? Number(params.page) : 1, 200, auth);
  var content = (data.content || []).slice().sort(sortByNaturalName);
  var items = [];
  for (var i = 0; i < content.length; i++) {
    var item = content[i];
    var itemPath = joinPath(path, item.name);
    if (getItemIsDir(item)) {
      items.push(makeListItemFromPath(server, item.name, itemPath, item.thumb || "", "目录", false));
    } else if (getItemIsVideo(item)) {
      items.push(makeListItemFromPath(server, cleanFileName(item.name), itemPath, item.thumb || "", formatFileSize(item.size), true));
    }
  }
  return items.length ? items : emptyItem("目录为空", normalizePath(path));
}

async function collectVideos(server, path, maxDepth, currentDepth, maxCount, auth) {
  currentDepth = currentDepth || 0;
  maxDepth = maxDepth || 2;
  maxCount = maxCount || 120;
  if (currentDepth > maxDepth) return [];

  var indent = Array(currentDepth + 1).join("  ");
  var data = await alistListDir(server, path, 1, 200, auth);
  var content = (data.content || []).slice().sort(sortByNaturalName);
  var pageTotal = data.total || 0;

  logInfo(indent + "[collectVideos] depth=" + currentDepth + " path=" + normalizePath(path) +
    " pageContent=" + content.length + " totalServer=" + pageTotal);

  var videos = [];
  var folders = [];
  var subtitles = [];
  var skippedTypes = {};
  var skippedOther = [];

  for (var i = 0; i < content.length; i++) {
    var item = content[i];
    var itemPath = joinPath(path, item.name);
    if (getItemIsDir(item)) {
      folders.push(itemPath);
    } else if (getItemIsVideo(item)) {
      videos.push({ name: item.name, path: itemPath, size: item.size, thumb: item.thumb || "" });
    } else if (isSubtitleFile(item.name)) {
      subtitles.push({ name: item.name, path: itemPath });
    } else {
      var t = item.type !== undefined ? item.type : "undefined";
      skippedTypes[t] = (skippedTypes[t] || 0) + 1;
      if (skippedOther.length < 5) skippedOther.push(item.name);
    }
    if (videos.length >= maxCount) break;
  }

  logInfo(indent + "[collectVideos] 结果: videos=" + videos.length + " folders=" + folders.length +
    " subtitles=" + subtitles.length + " skippedTypes=" + safeStringify(skippedTypes) +
    (skippedOther.length ? " skipped例=" + safeStringify(skippedOther) : ""));

  if (pageTotal > content.length && videos.length === 0) {
    logInfo(indent + "[collectVideos] ⚠ 总条目" + pageTotal + "超过本页" + content.length +
      "，视频可能在第2页，当前页无视频！");
  }

  if (videos.length < maxCount && currentDepth < maxDepth) {
    for (var f = 0; f < folders.length && videos.length < maxCount; f++) {
      var subVideos = await collectVideos(server, folders[f], maxDepth, currentDepth + 1, maxCount - videos.length, auth);
      videos = videos.concat(subVideos);
    }
  }

  logInfo(indent + "[collectVideos] 合计(depth=" + currentDepth + " path=" + normalizePath(path) + ") videos=" + videos.length);
  return videos.slice(0, maxCount);
}

// ==================== 播放列表构建（核心修改） ====================
// selectedIndex: 根据选集参数匹配视频，放到第一位作为默认播放项
// 所有 episode item 都生成各自的 videoUrl，保证切换剧集时播放正确文件
// parentPath: 视频所在父目录路径，用于在文件名无中文时取文件夹名做标题
async function buildEpisodeItems(server, videos, selectedIndex, parentPath) {
  selectedIndex = selectedIndex !== undefined ? Number(selectedIndex) : 0;
  if (selectedIndex < 0 || selectedIndex >= videos.length) selectedIndex = 0;

  // 从父目录路径提取文件夹名（如 /影视/绵羊侦探团 → "绵羊侦探团"）
  var folderTitle = titleFromPath(parentPath || "");

  // 将选中的视频移到第一位，其余保持原有顺序
  var orderedVideos = videos.slice();
  if (selectedIndex > 0) {
    var selected = orderedVideos.splice(selectedIndex, 1)[0];
    orderedVideos.unshift(selected);
  }

  var episodeItems = [];
  var playItem = null;
  for (var i = 0; i < orderedVideos.length; i++) {
    var video = orderedVideos[i];
    var videoUrl = buildPlayUrl(server, video.path);
    if (!videoUrl) continue;

    var fileLink = makeXiaoyaLink("file", {
      server: server,
      path: normalizePath(video.path)
    });

    // 文件名无中文（纯技术信息）时，用文件夹名 + 完整画质标签做标题
    var qLabel = qualityLabelOf(video.path);
    var epTitle;
    if (folderTitle && isTechnicalFileName(video.name)) {
      epTitle = folderTitle + (qLabel ? " " + qLabel : "");
    } else {
      epTitle = formatEpisodeTitle(video.name) || ("第" + (i + 1) + "集");
      if (qLabel) epTitle = epTitle + " " + qLabel;
    }
    var item = {
      id: fileLink,
      type: "url",
      title: epTitle,
      videoUrl: videoUrl,
      mediaType: "episode"
    };

    if (i === 0) {
      playItem = {
        id: "play_first_" + encodeURIComponent(video.path),
        title: epTitle,
        description: formatFileSize(video.size) + (qLabel ? " | " + qLabel : ""),
        videoUrl: videoUrl
      };
    }

    episodeItems.push(item);
  }
  return { playItem: playItem, episodeItems: episodeItems };
}

async function loadDetail(params) {
  var link = "";
  if (typeof params === "string") link = params;
  else if (params) link = params.link || params.id || "";
  if (!link) throw new Error("无效的详情请求");

  if (link.indexOf("xiaoya://dir") === 0) return loadDirDetail(link);
  if (link.indexOf("xiaoya://file") === 0) return loadFileDetail(link);

  return {
    id: link,
    type: "url",
    title: "播放",
    mediaType: "movie",
    videoUrl: link,
    playerType: "system"
  };
}

// ==================== 目录详情（核心修改） ====================
// 支持 index (0-based) 和 episode (剧集号) 参数指定默认播放项
async function loadDirDetail(link) {
  var p = parseLinkParams(link);
  var server = trimSlash(p.server || DEFAULT_SERVER);
  // loadDetail 只拿到 link 字符串，从存储里回查账号密码（之前 any loader/search 已缓存）
  var auth = rememberedAuth(server);
  var path = normalizePath(p.path || "/");
  var title = path.split("/").filter(Boolean).pop() || "小雅AList";

  var videos = await collectVideos(server, path, 2, 0, 120, auth);
  videos.sort(sortByNaturalName);

  // 解析选集参数，确定默认播放的视频索引
  // 支持 season + episode 联合匹配，文件名无季信息时从目录名推断
  var selectIndex = 0;
  if (p.index !== undefined) {
    selectIndex = Number(p.index);
  } else if (p.episode !== undefined || p.season !== undefined) {
    var targetSeason = p.season !== undefined ? Number(p.season) : null;
    var targetEp = p.episode !== undefined ? Number(p.episode) : null;
    var pathSeason = extractSeasonFromPath(path);
    // 优先用参数季号，否则用目录季号，再否则不限季
    var effectiveSeason = targetSeason !== null ? targetSeason : pathSeason;

    var bestMatch = -1, bestScore = -1;
    for (var i = 0; i < videos.length; i++) {
      var se = extractSeasonEpisode(videos[i].name);
      // 文件季号优先文件名，否则用目录季号
      var fileSeason = se.season !== null ? se.season : pathSeason;
      var fileEp = se.episode;
      var score = 0;

      // 季匹配：effectiveSeason 存在时，季不匹配的跳过
      if (effectiveSeason !== null && fileSeason !== null && fileSeason !== effectiveSeason) continue;
      if (fileSeason !== null) score += 100;

      // 集匹配
      if (targetEp !== null) {
        if (fileEp === targetEp) score += 10;
        else continue;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = i;
      }
    }

    if (bestMatch >= 0) selectIndex = bestMatch;
    else if (targetEp !== null && targetEp > 0) selectIndex = targetEp - 1;
  }

  if (!videos.length) {
    var children = await loadDirectory({ Server: server, path: path });
    return {
      id: link,
      type: "link",
      title: title,
      description: "未找到可播放视频，可继续浏览子目录",
      mediaType: "tv",
      link: link,
      childItems: children
    };
  }

  var videoResult = await buildEpisodeItems(server, videos, selectIndex, path);

  logInfo("[loadDirDetail] 最终视频数=" + videos.length + " selectIndex=" + selectIndex +
    " 前5个=" + safeStringify(videos.slice(0, 5).map(function(v) { return v.name; })));
  if (!videoResult.playItem) {
    return {
      id: link,
      type: "url",
      title: title,
      description: "无法获取播放地址",
      mediaType: "movie",
      videoUrl: ""
    };
  }

  var isTV = videoResult.episodeItems.length > 1;

  return {
    id: link,
    type: "url",
    title: title,
    description: isTV ? ("共 " + videoResult.episodeItems.length + " 集，默认：" + videoResult.playItem.title) : videoResult.playItem.description,
    mediaType: isTV ? "tv" : "movie",
    episode: isTV ? videoResult.episodeItems.length : undefined,
    episodeItems: isTV ? videoResult.episodeItems : [],
    videoUrl: isTV ? null : videoResult.playItem.videoUrl,
    playerType: "system"
  };
}

async function loadFileDetail(link) {
  var p = parseLinkParams(link);
  var server = trimSlash(p.server || DEFAULT_SERVER);
  var path = normalizePath(p.path || "");
  var fileName = path.split("/").pop() || "播放";
  var videoUrl = buildPlayUrl(server, path);

  // 文件名无中文（纯技术信息如 2026.2160p.AMZN.WEB-DL...mkv），用父文件夹名做标题
  var displayTitle;
  if (isTechnicalFileName(fileName)) {
    var folderName = titleFromPath(path);
    displayTitle = folderName || formatEpisodeTitle(fileName) || fileName;
  } else {
    displayTitle = formatEpisodeTitle(fileName) || fileName;
  }

  return {
    id: link,
    type: "url",
    title: displayTitle,
    description: "",
    mediaType: "movie",
    videoUrl: videoUrl,
    playerType: "system"
  };
}

async function searchBySouPage(server, keyword, page, auth) {
  var encoded = encodeURIComponent(keyword);
  var path = page && Number(page) > 1
    ? "/sou?box=&type=video&url="
    : "/sou?box=" + encoded + "&type=video&url=";
  var html = await authedGet(server, path, auth);
  if (!html || typeof html !== "string") return [];

  var $ = Widget.html.load(html);
  var items = [];
  $("body > div > ul > a").each(function(_, e) {
    var href = ($(e).attr("href") || $(e).text() || "").trim();
    if (!href) return;
    var parts = href.split("#");
    var filePath = parts[0] || "";
    var name = parts[1] || filePath.split("/").filter(Boolean).pop() || filePath;
    var score = parts[3] || "";
    var poster = parts[4] || "";
    if (!filePath) return;
    // 搜索结果是视频文件路径时，提升为父目录路径
    // 这样 loadDetail 会走 loadDirDetail，列出目录内所有视频文件
    // 如 /影视/绵羊侦探团/2026.2160p.xxx.mkv → /影视/绵羊侦探团
    var dirPath = filePath;
    var isFile = isVideoFile(filePath);
    if (isFile) {
      dirPath = filePath.substring(0, filePath.lastIndexOf("/")) || "/";
      dirPath = normalizePath(dirPath);
      if (dirPath === "/") dirPath = filePath; // 安全兜底：根目录不提升
    }
    items.push(makeListItemFromPath(
      server,
      name,
      dirPath,
      poster || DEFAULT_POSTER,
      score ? "豆瓣 " + score : normalizePath(dirPath),
      false  // 提升后始终作为目录处理
    ));
  });
  return items;
}

async function searchByApi(server, keyword, page, auth) {
  var data = await alistSearchApi(server, keyword, page, 100, auth);
  var content = data.content || [];
  var items = [];
  for (var i = 0; i < content.length; i++) {
    var item = content[i];
    var parent = item.parent || "/";
    var path = joinPath(parent, item.name);
    if (getItemIsDir(item)) {
      items.push(makeListItemFromPath(server, item.name, path, item.thumb || DEFAULT_POSTER, normalizePath(parent), false));
    } else if (getItemIsVideo(item)) {
      // 视频文件提升为父目录，让 loadDetail 走 loadDirDetail 列出所有视频
      items.push(makeListItemFromPath(server, item.name, normalizePath(parent), item.thumb || DEFAULT_POSTER, formatFileSize(item.size), false));
    }
  }
  return items;
}

async function searchXiaoya(params) {
  params = params || {};
  rememberAuth(params);
  var server = getServer(params);
  var auth = getAuth(params);
  var keyword = params.wd || params.keyword || params.text || "";
  var page = Number(params.pg || params.page || 1);
  if (!String(keyword).trim()) return emptyItem("请输入搜索关键词");

  var items = await searchBySouPage(server, keyword, page, auth);
  if (!items.length) items = await searchByApi(server, keyword, page, auth);
  return items.length ? items : emptyItem("未找到：" + keyword);
}

function normalizeTitle(title) {
  return String(title || "").toLowerCase().replace(/[^\u4e00-\u9fa5a-z0-9]/g, "");
}

// 根据资源所在路径判断来源（小雅 AList 目录里通常含来源关键词）
// 返回 "115" | "aliyun" | "quark" | "unknown"
function sourceOfPath(path) {
  var text = String(path || "").toLowerCase();
  if (text.indexOf("115") >= 0) return "115";
  // 非 115 的全部归为阿里
  return "aliyun";
}

// 来源中文标签（用于资源名后缀）
function sourceLabel(source) {
  if (source === "115") return "115";
  return "阿里";
}

// 从文件路径/文件名提取分辨率标签：4K / 1080P / 720P
function resolutionOf(path) {
  var text = String(path || "");
  if (/(2160p|2016p|4k|uhd)/i.test(text)) return "4K";
  if (/(1080p|fhd)/i.test(text)) return "1080P";
  if (/(720p|hd(?:rv)?)/i.test(text)) return "720P";
  return "";
}

// 提取画质/音质增强标签：DV、HDR、HDR10+、Atmos、SDR、SDR 等
// 匹配文件名里的独立标签词（前后以 . 或边界分隔），避免误伤普通单词
function qualityTagsOf(path) {
  var text = "." + String(path || "").replace(/[ _\-]/g, ".") + ".";
  var tags = [];
  // 杜比视界：DV / Dolby.Vision
  if (/\.dv\b/i.test(path) || /dolby[._]vision/i.test(text)) tags.push("DV");
  // HDR 系列
  if (/\.hdr10plus\b/i.test(path) || /hdr[._]10[._]plus/i.test(text)) tags.push("HDR10+");
  else if (/\.hdr10\b/i.test(path) || /hdr[._]10\b/i.test(text)) tags.push("HDR10");
  else if (/\.hdr\b/i.test(path)) tags.push("HDR");
  // 杜比全景声：Atmos
  if (/\.atmos\b/i.test(path)) tags.push("Atmos");
  // HLG
  if (/\.hlg\b/i.test(path)) tags.push("HLG");
  // SDR
  if (/\.sdr\b/i.test(path)) tags.push("SDR");
  return tags;
}

// 综合画质标签：分辨率 + 增强标签，如 "4K DV HDR Atmos"
// 用于资源名后缀，让 App 能据此归类到对应清晰度分组（不再显示"其他"）
function qualityLabelOf(path) {
  var parts = [];
  var res = resolutionOf(path);
  if (res) parts.push(res);
  var tags = qualityTagsOf(path);
  for (var i = 0; i < tags.length; i++) parts.push(tags[i]);
  return parts.join(" ");
}

// 从播放直链（/d/路径）反解出真实文件路径，用于判断分辨率
// 形如 http://ip:5678/d/影视/电影/2026.2160p.DV.HDR.H.265.mkv → /影视/电影/2026.2160p.DV.HDR.H.265.mkv
function pathFromPlayUrl(playUrl) {
  if (!playUrl) return "";
  var idx = String(playUrl).indexOf("/d/");
  if (idx < 0) return "";
  var path = String(playUrl).substring(idx + 3); // 去掉 "/d/"
  try { return decodeURIComponent(path); } catch (e) { return path; }
}

// 统一拼资源名：小雅AList - 来源 - 画质
// 画质标签放在末尾，便于 App 按清晰度关键词（4K/1080P/DV 等）归类
function resourceLabel(source, qualityLabel) {
  var parts = ["小雅AList"];
  var sl = sourceLabel(source);
  if (sl) parts.push(sl);
  if (qualityLabel) parts.push(qualityLabel);
  return parts.join(" - ");
}

// 从文件名提取季和集信息，返回 { season: number|null, episode: number|null }
function extractSeasonEpisode(name) {
  var text = String(name || "");
  var season = null;
  var episode = null;

  // S05E03 / s5e3 / S5 EP03 / Season 5 Episode 3
  var seMatch = text.match(/[Ss](?:eason\s*)?(\d{1,3})\s*[Ee](?:p(?:isode)?\s*)?(\d{1,4})/i);
  if (seMatch) return { season: Number(seMatch[1]), episode: Number(seMatch[2]) };

  // 第5季第03集
  var chSeMatch = text.match(/第\s*(\d{1,3})\s*季\s*第\s*(\d{1,4})\s*[集话期]/);
  if (chSeMatch) return { season: Number(chSeMatch[1]), episode: Number(chSeMatch[2]) };

  // 纯 episode: E03 / EP03
  var eMatch = text.match(/[Ee][Pp]?\s*(\d{1,4})/);
  if (eMatch) return { season: null, episode: Number(eMatch[1]) };

  // 第03集
  var chEpMatch = text.match(/第\s*(\d{1,4})\s*[集话期]/);
  if (chEpMatch) return { season: null, episode: Number(chEpMatch[1]) };

  // 三位数回退: 503 → S5E03, 101 → S1E01
  var numMatch = text.match(/(?:^|[^\d])(\d{2,4})(?:[^\d]|$)/);
  if (numMatch && !/^(480|720|1080|2160|4)$/i.test(numMatch[1])) {
    var num = Number(numMatch[1]);
    if (num >= 100 && num <= 9999) {
      var s = Math.floor(num / 100);
      var ep = num % 100;
      if (s > 0 && ep > 0 && ep <= 99) return { season: s, episode: ep };
    }
    return { season: null, episode: num };
  }

  return { season: null, episode: null };
}

// 从目录路径向上查找季信息（如 Season5 / S5 / 第5季）
function extractSeasonFromPath(path) {
  var parts = normalizePath(String(path || "")).split("/").filter(Boolean);
  for (var i = parts.length - 1; i >= 0; i--) {
    var folder = parts[i];
    var match = folder.match(/[Ss](?:eason\s*)?(\d{1,3})/i);
    if (match) return Number(match[1]);
    match = folder.match(/第\s*(\d{1,3})\s*季/);
    if (match) return Number(match[1]);
  }
  return null;
}

// 兼容旧调用：只返回 episode 数字（内部走 extractSeasonEpisode）
function extractEpisodeNumber(name) {
  return extractSeasonEpisode(name).episode;
}

// 为单个搜索结果构建一个片源 resource（含剧集/电影分支、画质标签、来源标签）
// 返回 resource 对象，或 null（该结果无可播放内容）
// 多个这样的 resource 叠加，App 详情页就能用 ‹ › 片源切换器在多片源间切换
async function buildResourceFromResult(result, ctx) {
  var detailLink = result.link || "";
  if (!detailLink) return null;
  if (ctx.episode !== null) detailLink = detailLink + "&episode=" + ctx.episode;
  if (ctx.season !== null) detailLink = detailLink + "&season=" + ctx.season;

  var detail = await loadDetail(detailLink);

  // 兜底：detail 只返回单文件（无 episodeItems）时，提升为父目录重新加载
  var hasEps = detail && detail.episodeItems && detail.episodeItems.length > 0;
  if (!hasEps && detail && detail.id && String(detail.id).indexOf("xiaoya://file") === 0) {
    var fileP = parseLinkParams(String(detail.id));
    var rawFilePath = normalizePath(fileP.path || "");
    if (rawFilePath && rawFilePath !== "/") {
      var parentDir = rawFilePath.substring(0, rawFilePath.lastIndexOf("/")) || "/";
      parentDir = normalizePath(parentDir);
      if (parentDir !== "/" && parentDir !== rawFilePath) {
        var retryLink = makeXiaoyaLink("dir", { server: ctx.server, path: parentDir });
        if (ctx.episode !== null) retryLink = retryLink + "&episode=" + ctx.episode;
        if (ctx.season !== null) retryLink = retryLink + "&season=" + ctx.season;
        var retryDetail = await loadDetail(retryLink);
        if (retryDetail && retryDetail.episodeItems && retryDetail.episodeItems.length > 0) detail = retryDetail;
      }
    }
  }

  // 该结果的来源（115 / 阿里）和画质
  var sourcePath = "";
  if (result.link) {
    sourcePath = decodeURIComponent(result.link).split("path=")[1] || "";
    sourcePath = sourcePath.split("&")[0] || "";
  }
  var source = sourceOfPath(sourcePath);

  // ====== 剧集：整季全集作为一个片源，播放列表里可供选集 ======
  var eps = (detail && detail.episodeItems) || [];
  if (ctx.type !== "movie" && eps.length > 1) {
    var seasonEps = [];
    for (var i = 0; i < eps.length; i++) {
      if (!eps[i].videoUrl) continue;
      var se = extractSeasonEpisode(eps[i].title);
      var seasonMatch = (ctx.season === null || se.season === null || se.season === ctx.season);
      if (seasonMatch) seasonEps.push(eps[i]);
    }
    if (!seasonEps.length) seasonEps = eps.filter(function (e) { return e.videoUrl; });

    // 用户指定的 episode 顶到第一位作为默认播放
    if (ctx.episode !== null && seasonEps.length) {
      var defaultIdx = -1;
      for (var j = 0; j < seasonEps.length; j++) {
        var sj = extractSeasonEpisode(seasonEps[j].title);
        if (sj.episode === ctx.episode) { defaultIdx = j; break; }
      }
      if (defaultIdx > 0) {
        var moved = seasonEps.splice(defaultIdx, 1)[0];
        seasonEps.unshift(moved);
      }
    }

    var firstPlayPath = pathFromPlayUrl(seasonEps[0].videoUrl) || sourcePath;
    var qLabel = qualityLabelOf(firstPlayPath);
    return {
      id: "xiaoya_src_" + source + "_" + ctx.rid,
      source: source,
      name: resourceLabel(source, qLabel),
      type: ctx.type,
      description: ctx.seriesName + "（共 " + seasonEps.length + " 集，可在播放列表选集）" + (qLabel ? " · " + qLabel : ""),
      url: seasonEps[0].videoUrl,
      episodeItems: seasonEps.map(function (e) { return { title: e.title, videoUrl: e.videoUrl }; })
    };
  }

  // ====== 电影或单集：取首个可用视频作为一个片源 ======
  var playUrl = "";
  if (detail && detail.videoUrl) playUrl = detail.videoUrl;
  if (!playUrl) {
    var childEps = (detail && (detail.episodeItems || detail.childItems)) || [];
    for (var k = 0; k < childEps.length; k++) {
      if (!childEps[k].videoUrl) continue;
      playUrl = childEps[k].videoUrl;
      break;
    }
  }
  if (!playUrl) return null;

  var itemPath = pathFromPlayUrl(playUrl) || sourcePath;
  var qLabel = qualityLabelOf(itemPath);
  return {
    id: "xiaoya_src_" + source + "_" + ctx.rid,
    source: source,
    name: resourceLabel(source, qLabel),
    type: ctx.type,
    description: (detail && detail.title || ctx.seriesName) + (qLabel ? " · " + qLabel : ""),
    url: playUrl
  };
}

async function loadResource(params) {
  params = params || {};
  rememberAuth(params);
  var server = getServer(params);
  var auth = getAuth(params);
  var seriesName = params.seriesName || params.title || params.name || params.keyword || params.TestTitle || "";
  var type = params.type === "movie" ? "movie" : "tv";
  var episode = params.episode ? Number(params.episode) : null;
  var season = params.season ? Number(params.season) : null;
  if (!seriesName) return [];

  var results = await searchBySouPage(server, seriesName, 1, auth);
  if (!results.length) results = await searchByApi(server, seriesName, 1, auth);
  if (!results.length) return [];

  var target = normalizeTitle(seriesName);
  results.sort(function(a, b) {
    // 同时比较 item.title 和路径上的文件夹名，解决文件名无中文时匹配失败的问题
    var aPathTitle = normalizeTitle(titleFromPath(a.link || ""));
    var bPathTitle = normalizeTitle(titleFromPath(b.link || ""));
    var aTitle = normalizeTitle(a.title) + " " + aPathTitle;
    var bTitle = normalizeTitle(b.title) + " " + bPathTitle;
    var aScore = aTitle.indexOf(target) >= 0 ? 100 : (target.indexOf(normalizeTitle(a.title)) >= 0 || aPathTitle === target ? 80 : 0);
    var bScore = bTitle.indexOf(target) >= 0 ? 100 : (target.indexOf(normalizeTitle(b.title)) >= 0 || bPathTitle === target ? 80 : 0);
    return bScore - aScore;
  });

  // 只保留标题匹配的结果，避免把无关目录当成片源
  var matched = [];
  for (var m = 0; m < results.length; m++) {
    var mPathTitle = normalizeTitle(titleFromPath(results[m].link || ""));
    var mTitle = normalizeTitle(results[m].title) + " " + mPathTitle;
    if (mTitle.indexOf(target) >= 0 || target.indexOf(normalizeTitle(results[m].title)) >= 0 || mPathTitle === target) {
      matched.push(results[m]);
    }
  }
  if (!matched.length) matched = [results[0]];

  var ctx = { server: server, type: type, episode: episode, season: season, seriesName: seriesName };
  var MAX_SOURCES = 6;   // 探测上限，避免搜索结果过多时请求爆炸

  // 限制探测数量（取前 MAX_SOURCES 个匹配结果）
  var toProbe = matched.slice(0, MAX_SOURCES);

  // 并发探测：所有片源同时取，总耗时≈最慢一个，而非串行相加
  var probed = await Promise.all(toProbe.map(function (result, idx) {
    var localCtx = {
      server: ctx.server, type: ctx.type, episode: ctx.episode,
      season: ctx.season, seriesName: ctx.seriesName, rid: idx
    };
    return buildResourceFromResult(result, localCtx).catch(function (e) {
      logError("构建片源失败", e);
      return null;
    });
  }));

  // 同来源不去重（用户需求：同一来源的片源都显示，用 ‹ › 切换）；
  // 仅按 url 去重，过滤掉完全相同的重复片源
  var resources = [];
  var seenUrls = {};
  for (var p = 0; p < probed.length; p++) {
    var res = probed[p];
    if (!res || !res.url) continue;
    if (seenUrls[res.url]) continue;
    seenUrls[res.url] = true;
    resources.push(res);
  }

  // 去掉内部 source 字段，返回 App 期望的 resource 形状
  return resources.map(function (res) {
    return {
      id: res.id,
      name: res.name,
      type: res.type,
      description: res.description,
      url: res.url,
      episodeItems: res.episodeItems
    };
  });
}

WidgetMetadata = {
  id: "xiaoya.alist",
  title: "小雅AList",
  icon: DEFAULT_POSTER,
  version: "3.2",
  requiredVersion: "0.0.1",
  description: "小雅AList：聚合搜索、目录浏览和播放",
  author: "Johnny",
  detailCacheDuration: 60,

  globalParams: [
    { name: "Server", title: "小雅AList地址", type: "input", value: DEFAULT_SERVER, description: "示例：http://yourip::5678；不要填 /dav" },
    { name: "Username", title: "AList用户名", type: "input", value: "", description: "可选；小雅AList 启用登录验证时填写" },
    { name: "Password", title: "AList密码", type: "input", value: "", description: "可选；对应用户名的密码" }
  ],
  search: {
    title: "搜索",
    functionName: "searchXiaoya",
    params: [
      { name: "wd", title: "关键词", type: "input", value: "" },
      { name: "pg", title: "页码", type: "page", value: "1" }
    ]
  },
  modules: [
    { id: "xy_search", title: "搜索", functionName: "searchXiaoya", type: "video", cacheDuration: 300, params: [
      { name: "wd", title: "关键词", type: "input", value: "" },
      { name: "pg", title: "页码", type: "page", value: "1" }
    ] },
    { id: "loadDetail", title: "加载详情", functionName: "loadDetail", type: "video", cacheDuration: 60, params: [] },
    { id: "loadResource", title: "智能匹配", functionName: "loadResource", type: "stream", cacheDuration: 300, params: [
      { name: "TestTitle", title: "测试片名", type: "input", value: "" }
    ] },
    { id: "xy_browse", title: "目录浏览", functionName: "loadDirectory", type: "video", cacheDuration: 300, params: [
      { name: "path", title: "目录路径", type: "input", value: "/" },
      { name: "page", title: "页码", type: "page", value: "1" }
    ] }
  ]
};
