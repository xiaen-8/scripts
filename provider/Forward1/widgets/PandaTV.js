/**
 * PandaTV 直播模块 (v5.7.0)
 * ==========================================
 * 参照 Angel Live Panda 插件实现，支持所有主播（含密码保护/隐藏内容）。
 * v5.7: 19+ 栏按观看人数从高到低排序。
 * v5.6: 去掉 loadDetail 的 videoUrl — App 直接播放 videoUrl 不带 Origin 导致 403。
 * v5.5: sessKey 编码到 link 中 — 解决 App 不传递 globalParams 的问题。
 * v5.1: _getCookie 增加三级 fallback，loadResource 增加 cookie 失败重试。头，
 *       解决 App globalParams 传递不稳定的问题。
 * v4.2: 新增 "19+" 独立分类模块，强制显示成人内容直播间。
 * v4.1: 修复 cookie 传递链路 — 列表 handler 缓存 cookie 到 storage，
 *       loadDetail/loadResource 通过 storage 获取，解决 App 端 19+ 不显示问题。
 *
 * 使用方法:
 *   1. 在浏览器打开 https://www.pandalive.co.kr 并登录
 *   2. 从 Cookie 中找到 sessKey 的值（如 45a82b9c-8e4f-4770-b3ba-ad8b76f5bbd3）
 *   3. 粘贴到模块的 "sessKey" 输入框
 *   4. 登录后可查看密码保护/19+隐藏内容
 */

WidgetMetadata = {
  id: "forward.pandatv",
  title: "PandaTV",
  icon: "https://cdn.pandalive.co.kr/public/img/bottom_tab/bottom_tab_home.png",
  version: "5.7.0",
  requiredVersion: "0.0.1",
  description: "韩国 PandaTV 直播（含隐藏内容，需登录）",
  author: "Forward",
  site: "https://github.com/InchStudio/ForwardWidgets",
  detailCacheDuration: 30,
  globalParams: [
    {
      name: "sessKey",
      title: "sessKey（登录后从 Cookie 中复制 sessKey 的值）",
      type: "input",
    },
  ],
  modules: [
    {
      id: "loadHot",
      title: "热门",
      functionName: "loadHot",
      cacheDuration: 60,
      params: [
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "loadNew",
      title: "最新",
      functionName: "loadNew",
      cacheDuration: 60,
      params: [
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "loadNewBj",
      title: "NEW BJ",
      functionName: "loadNewBj",
      cacheDuration: 60,
      params: [
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "loadAdult",
      title: "19+",
      functionName: "loadAdult",
      cacheDuration: 60,
      params: [
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "loadResource",
      title: "加载直播流",
      functionName: "loadResource",
      type: "stream",
      params: [],
    },
  ],
  search: {
    title: "搜索主播",
    functionName: "search",
    params: [
      { name: "keyword", title: "关键词", type: "input" },
      { name: "page", title: "页码", type: "page" },
    ],
  },
};

// ============================================================
// 常量
// ============================================================

var API_BASE = "https://api.pandalive.co.kr";
var WEB_BASE = "https://www.pandalive.co.kr";
var PAGE_SIZE = 24;

// ============================================================
// 请求头构建
// ============================================================

function _buildHeaders(cookie) {
  var h = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    "Origin": WEB_BASE,
  };
  if (cookie) {
    h["Cookie"] = cookie;
  }
  return h;
}

function _buildStreamHeaders(cookie, referer) {
  // AWS IVS 严格验证：只允许单独的 Origin 头
  // Origin + Referer 组合 → 403
  // Origin + Cookie 组合 → 403
  // 只带 Origin → 200
  return {
    "Origin": WEB_BASE,
  };
}

// ============================================================
// 工具函数
// ============================================================

function _str(v) { return v === null || v === undefined ? "" : String(v); }
function _num(v, fb) { var n = Number(v); return Number.isFinite(n) ? n : fb; }

function _formBody(params) {
  var pairs = [];
  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      var value = params[key];
      if (value !== null && value !== undefined) {
        pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(String(value)));
      }
    }
  }
  return pairs.join("&");
}

function _resolveURL(baseURL, uri) {
  var value = _str(uri).trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  var base = _str(baseURL).trim();
  var scheme = (base.match(/^(https?):\/\//i) || [])[1] || "https";
  if (value.indexOf("//") === 0) return scheme + ":" + value;
  var origin = (base.match(/^(https?:\/\/[^/?#]+)/i) || [])[1] || "";
  if (value.charAt(0) === "/") return origin + value;
  var cleanBase = base.split("#")[0].split("?")[0];
  var basePath = origin && cleanBase.indexOf(origin) === 0 ? cleanBase.slice(origin.length) : cleanBase;
  var slash = basePath.lastIndexOf("/");
  var dir = slash >= 0 ? basePath.slice(0, slash + 1) : "/";
  return origin + dir + value;
}

// ============================================================
// API 请求
// ============================================================

async function _post(path, params, cookie, referer) {
  var url = API_BASE + path;
  var body = _formBody(params || {});
  var headers = _buildHeaders(cookie);
  headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
  headers["Referer"] = referer || WEB_BASE;

  var res = await Widget.http.post(url, body, { headers: headers });
  var data = res.data || {};
  if (typeof data === "string") {
    try { data = JSON.parse(data); } catch (e) {}
  }
  return data;
}

async function _requestText(url, cookie, referer) {
  var headers = _buildStreamHeaders(cookie, referer);
  var res = await Widget.http.get(url, { headers: headers });
  return _str(res.data || "");
}

// ============================================================
// 列表 / 搜索
// ============================================================

async function _fetchLiveList(categoryId, page, cookie) {
  var id = _str(categoryId || "hot");
  var limit = PAGE_SIZE;
  var offset = (Math.max(1, page) - 1) * limit;

  var params = { limit: limit, offset: offset };
  if (id === "hot") { params.onlyNewBj = "N"; params.orderBy = "hot"; }
  else if (id === "new") { params.onlyNewBj = "N"; params.orderBy = "new"; }
  else if (id === "newbj") { params.onlyNewBj = "Y"; params.orderBy = "user"; }
  else if (id === "adult") { params.onlyNewBj = "N"; params.orderBy = "hot"; }
  else { params.onlyNewBj = "N"; params.orderBy = "user"; }

  var obj = await _post("/v1/live/index", params, cookie, WEB_BASE + "/live");
  if (!obj || obj.result === false || !Array.isArray(obj.list)) {
    throw new Error(_str(obj && obj.message) || "获取列表失败");
  }
  return obj.list;
}

async function _searchBJ(keyword, page, cookie) {
  var limit = 20;
  var offset = (Math.max(1, page) - 1) * limit;
  var obj = await _post("/v1/live/bj_list", {
    searchVal: _str(keyword),
    limit: limit,
    offset: offset,
  }, cookie, WEB_BASE + "/live");
  if (!obj || obj.result === false || !Array.isArray(obj.list)) {
    throw new Error(_str(obj && obj.message) || "搜索失败");
  }
  return obj.list;
}

// ============================================================
// 会员信息 / 播放信息
// ============================================================

async function _fetchMember(userId, cookie) {
  var obj = await _post("/v1/member/bj", { userId: _str(userId) }, cookie, WEB_BASE + "/play/" + encodeURIComponent(_str(userId)));
  if (!obj || obj.result === false || !obj.bjInfo) {
    return null;
  }
  return obj;
}

async function _fetchPlay(userIdx, userId, cookie) {
  var refererId = _str(userId || userIdx);
  var obj = await _post("/v1/live/play", {
    action: "watch",
    userId: _str(userIdx),
  }, cookie, WEB_BASE + "/play/" + encodeURIComponent(refererId));
  return obj;
}

// ============================================================
// HLS Master Playlist 解析
// ============================================================

function _parseHLSAttributes(line) {
  var attrs = {};
  var pattern = /([A-Z0-9-]+)=("[^"]*"|[^,]*)/gi;
  var match;
  while ((match = pattern.exec(_str(line)))) {
    var key = _str(match[1]).toUpperCase();
    var value = _str(match[2]).trim();
    if (value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
      value = value.slice(1, -1);
    }
    attrs[key] = value;
  }
  return attrs;
}

function _variantHeight(attrs) {
  var resolution = _str(attrs && attrs.RESOLUTION);
  var match = resolution.match(/x(\d{2,4})/i);
  return match ? _num(match[1], 0) : 0;
}

function _variantTitle(attrs) {
  var name = _str(attrs && attrs.NAME).trim();
  if (name && !/^auto$/i.test(name) && name !== "자동") return name;
  var height = _variantHeight(attrs);
  return height > 0 ? height + "p" : "Auto";
}

function _parseMasterPlaylist(text, baseURL) {
  var lines = _str(text).split(/\r?\n/);
  var variants = [];
  var seen = {};
  for (var i = 0; i < lines.length; i++) {
    var line = _str(lines[i]).trim();
    if (line.indexOf("#EXT-X-STREAM-INF:") !== 0) continue;
    var attrs = _parseHLSAttributes(line);
    var uri = "";
    for (var j = i + 1; j < lines.length; j++) {
      var candidate = _str(lines[j]).trim();
      if (!candidate) continue;
      if (candidate.charAt(0) === "#") break;
      uri = candidate;
      break;
    }
    if (!uri) continue;
    var height = _variantHeight(attrs);
    var url = _resolveURL(baseURL, uri);
    if (!url || seen[url]) continue;
    seen[url] = true;
    variants.push({
      title: _variantTitle(attrs),
      qn: height,
      bandwidth: _num(attrs && attrs.BANDWIDTH, 0),
      url: url,
    });
  }
  variants.sort(function(a, b) {
    if (b.qn !== a.qn) return b.qn - a.qn;
    return b.bandwidth - a.bandwidth;
  });
  return variants;
}

// ============================================================
// 格式化 VideoItem
// ============================================================

function _formatRoomModel(item, sessKey) {
  var currentSessKey = sessKey || "";
  var media = item && item.media ? item.media : item;
  var userId = _str(media && media.userId ? media.userId : item && item.userId);
  var userIdx = _str(media && media.userIdx ? media.userIdx : item && item.userIdx);
  var userNick = _str(media && media.userNick ? media.userNick : item && item.userNick);
  var title = _str(media && media.title ? media.title : item && item.channelTitle);
  var cover = _str(
    (media && (media.thumbUrl || media.thumbUrlOrigin || media.ivsThumbnail || media.userImg)) ||
    (item && (item.thumbUrl || item.thumbUrlOrigin || item.userImg)) || ""
  );
  var isLive = media && media.isLive ? true : false;
  var isPw = media && media.isPw ? true : false;
  var isAdult = media && media.isAdult ? true : false;
  var watchCount = _str((media && (media.user || media.playCnt)) || (item && item.userCnt) || "");

  var tags = [];
  if (isPw) tags.push({ id: "pw", title: "🔒密码保护" });
  if (isAdult) tags.push({ id: "adult", title: "🔞19+" });
  if (!isLive) tags.push({ id: "offline", title: "离线" });

  var desc = userNick;
  if (watchCount) desc += " 👀" + watchCount;

  return {
    id: "pd_" + (userIdx || userId),
    type: "url",
    title: title || userNick || "",
    posterPath: cover,
    backdropPath: cover,
    description: desc,
    genreItems: tags,
    link: "pandatv:" + userId + ":" + userIdx + ":" + (currentSessKey || ""),
    playerType: "system",
  };
}

function _formatSearchModel(item) {
  return {
    id: "pd_" + _str(item && item.userIdx),
    type: "url",
    title: _str(item && item.userNick),
    posterPath: _str(item && item.thumbUrl),
    backdropPath: _str(item && item.thumbUrl),
    description: _str(item && (item.scoreMonth || item.scoreWeek || "")),
    genreItems: [],
    link: "pandatv:" + _str(item && item.userId) + ":" + _str(item && item.userIdx),
    playerType: "system",
  };
}

// ============================================================
// 模块处理函数
// ============================================================

/**
 * 获取 sessKey（多来源 fallback）
 * 优先级: params.sessKey > Widget.storage("sessKey")
 * 然后自动构建完整 Cookie 头
 */
function _getCookie(params) {
  // 1. 从 params.sessKey 获取（App 注入 globalParams）
  var sessKey = (params && params.sessKey) || "";
  // 2. 从 storage 获取（App 可能存到 storage）
  if (!sessKey) sessKey = Widget.storage.get("sessKey") || "";
  // 3. 从 pd_cookie 获取（列表 handler 缓存的完整 cookie 字符串）
  var cached = Widget.storage.get("pd_cookie") || "";
  if (sessKey) {
    var built = "sessKey=" + sessKey + "; partner=pandatv; userLoginYN=Y";
    if (cached && cached.indexOf("sessKey=" + sessKey) !== -1) return cached;
    return built;
  }
  // 4. 如果没有 sessKey 但有缓存的完整 cookie，直接用
  if (cached) return cached;
  return "";
}

function _extractSessKey(params) {
  var sk = (params && params.sessKey) || Widget.storage.get("sessKey") || "";
  if (sk) return sk;
  var cached = Widget.storage.get("pd_cookie") || "";
  if (!cached) return "";
  var m = cached.match(/sessKey=([^;]+)/);
  return m ? m[1] : "";
}

async function loadHot(params) {
  try {
    var page = params.page || 1;
    var cookie = _getCookie(params);
    if (cookie) Widget.storage.set("pd_cookie", cookie);
    var sk = _extractSessKey(params);
    var list = await _fetchLiveList("hot", page, cookie);
    return list.map(function(item) { return _formatRoomModel(item, sk); });
  } catch (error) {
    console.error("[loadHot] 失败:", error.message || error);
    throw error;
  }
}

async function loadNew(params) {
  try {
    var page = params.page || 1;
    var cookie = _getCookie(params);
    if (cookie) Widget.storage.set("pd_cookie", cookie);
    var sk = _extractSessKey(params);
    var list = await _fetchLiveList("new", page, cookie);
    return list.map(function(item) { return _formatRoomModel(item, sk); });
  } catch (error) {
    console.error("[loadNew] 失败:", error.message || error);
    throw error;
  }
}

async function loadNewBj(params) {
  try {
    var page = params.page || 1;
    var cookie = _getCookie(params);
    if (cookie) Widget.storage.set("pd_cookie", cookie);
    var sk = _extractSessKey(params);
    var list = await _fetchLiveList("newbj", page, cookie);
    return list.map(function(item) { return _formatRoomModel(item, sk); });
  } catch (error) {
    console.error("[loadNewBj] 失败:", error.message || error);
    throw error;
  }
}

async function loadAdult(params) {
  try {
    var page = params.page || 1;
    var cookie = _getCookie(params);
    if (cookie) Widget.storage.set("pd_cookie", cookie);
    var sk = _extractSessKey(params);
    var list = await _fetchLiveList("adult", page, cookie);
    return list
      .filter(function(item) {
        var media = item && item.media ? item.media : item;
        return media && media.isAdult;
      })
      .map(function(item) { return _formatRoomModel(item, sk); });
  } catch (error) {
    console.error("[loadAdult] 失败:", error.message || error);
    throw error;
  }
}

async function loadDetail(link) {
  try {
    var linkStr = String(link);
    if (linkStr.indexOf("pandatv:") !== 0) return null;

    var linkContent = linkStr.substring("pandatv:".length);
    var parts = linkContent.split(":");
    var userId = parts[0];
    var userIdx = parts.length >= 2 ? parts[1] : "";
    // 第3段是 sessKey（由列表 handler 编码到 link 中）
    var linkSessKey = parts.length >= 3 ? parts[2] : "";

    // sessKey 获取优先级：link 中编码的 > storage 中的
    var sessKey = linkSessKey || Widget.storage.get("sessKey") || "";
    var cookie = sessKey ? "sessKey=" + sessKey + "; partner=pandatv; userLoginYN=Y" : "";

    // 获取会员信息
    var member = await _fetchMember(userId, cookie);
    var info = member && member.bjInfo ? member.bjInfo : {};

    // 获取播放信息
    var play = null;
    var idx = _str(info.idx || userIdx || "");
    if (idx) {
      var playObj = await _fetchPlay(idx, info.id || userId, cookie);
      if (playObj && playObj.result !== false) {
        play = playObj;
      }
    }

    var media = play && play.media ? play.media : null;
    var isLive = media && media.isLive ? true : false;
    var isPw = media && media.isPw ? true : false;
    var isAdult = media && media.isAdult ? true : false;

    var cover = _str(
      (media && (media.thumbUrl || media.ivsThumbnail || media.userImg)) ||
      info.channelBannerUrl || info.thumbUrl || ""
    );
    var title = _str(
      (media && media.title) || info.channelTitle || info.channelDesc || info.nick || userId
    );
    var nick = _str((media && media.userNick) || info.nick || userId);
    var watchCount = _str((media && (media.user || media.playCnt)) || info.scoreWatch || "");

    var tags = [];
    if (isPw) tags.push({ id: "pw", title: "🔒密码保护" });
    if (isAdult) tags.push({ id: "adult", title: "🔞19+" });
    if (!isLive && media) tags.push({ id: "offline", title: "离线" });
    if (info.fanCnt) tags.push({ id: "fans", title: "粉丝:" + info.fanCnt });
    if (info.rank) tags.push({ id: "rank", title: "排名:#" + info.rank });

    var desc = nick;
    if (watchCount) desc += " 👀" + watchCount;
    if (info.channelDesc) desc += "\n" + info.channelDesc;

    // 提取播放 URL（仅用于判断是否有可用源）
    var hasPlayUrl = false;
    if (play && play.PlayList) {
      var playlist = play.PlayList;
      var hlsKeys = ["hls3", "hls2", "hls"];
      for (var hi = 0; hi < hlsKeys.length; hi++) {
        var hlsList = playlist[hlsKeys[hi]];
        if (Array.isArray(hlsList) && hlsList.length > 0) {
          var m3u8Url = _str(hlsList[0] && hlsList[0].url);
          if (m3u8Url) {
            hasPlayUrl = true;
            break;
          }
        }
      }
    }

    var result = {
      id: "pd_" + (info.idx || userIdx || userId),
      type: "url",
      title: title,
      posterPath: cover,
      backdropPath: info.channelBannerUrl || cover,
      description: desc,
      genreItems: tags,
      link: linkStr,
      playerType: "system",
    };

    // 不设置 videoUrl/previewUrl — App 播放 videoUrl 时不带 Origin 导致 AWS IVS 403
    // 必须通过 loadResource 返回带 Origin header 的资源才能播放

    return result;
  } catch (error) {
    console.error("[loadDetail] 失败:", error.message || error);
    return null;
  }
}

async function loadResource(params) {
  try {
    var userId = "";
    var userIdx = "";
    var linkStr = params.link || "";
    var cookie = _getCookie(params);

    console.log("[loadResource] link:", linkStr, "cookie:", cookie ? "有" : "无");

    var linkSessKey = "";
    if (linkStr.indexOf("pandatv:") === 0) {
      var linkContent = linkStr.substring("pandatv:".length);
      var parts = linkContent.split(":");
      if (parts.length >= 2) {
        userId = parts[0];
        userIdx = parts[1];
        // 第3段是 sessKey（由列表 handler 编码到 link 中）
        if (parts.length >= 3 && parts[2]) {
          linkSessKey = parts[2];
        }
      }
    }

    // 如果 params 中没有 cookie 但 link 中有 sessKey，用 link 中的构建 cookie
    if (!cookie && linkSessKey) {
      cookie = "sessKey=" + linkSessKey + "; partner=pandatv; userLoginYN=Y";
      console.log("[loadResource] 从 link 中提取 sessKey 构建 cookie");
    }

    if (!userId) {
      console.log("[loadResource] 无法解析 userId");
      return [];
    }

    // 获取会员信息以确认 idx
    var member = await _fetchMember(userId, cookie);
    var info = member && member.bjInfo ? member.bjInfo : {};
    var idx = _str(info.idx || userIdx || "");

    if (!idx) {
      console.log("[loadResource] 无法获取 idx, userId:", userId);
      return [];
    }

    // 获取播放信息
    var play = await _fetchPlay(idx, info.id || userId, cookie);

    if (!play || play.result === false) {
      console.log("[loadResource] play API 返回:", play ? play.message : "empty");
      // 如果带 cookie 失败，尝试不带 cookie
      if (cookie) {
        console.log("[loadResource] 尝试不带 cookie 重新请求...");
        play = await _fetchPlay(idx, info.id || userId, "");
        if (play && play.result !== false) {
          console.log("[loadResource] 无 cookie 请求成功");
        }
      }
      if (!play || play.result === false) return [];
    }

    // 提取播放列表（hls3 > hls2 > hls）
    var playlist = play.PlayList || {};
    var playlistItems = [];
    var seen = {};
    var keys = ["hls3", "hls2", "hls"];
    for (var ki = 0; ki < keys.length; ki++) {
      var list = playlist[keys[ki]];
      if (!Array.isArray(list) || list.length === 0) continue;
      var first = list[0];
      var url = _str(first && first.url);
      if (!url || seen[url]) continue;
      seen[url] = true;
      playlistItems.push({
        key: keys[ki],
        title: _str(first && first.name) || "自动",
        url: url,
      });
    }

    if (playlistItems.length === 0) {
      console.log("[loadResource] 无可用播放列表");
      return [];
    }

    // 解析 master playlist 获取多画质
    var resources = [];
    var resolvedRoomId = _str(info.id || userId);
    var referer = WEB_BASE + "/play/" + encodeURIComponent(resolvedRoomId);

    for (var pi = 0; pi < playlistItems.length; pi++) {
      var pItem = playlistItems[pi];

      // 请求 m3u8（必须带 Origin 和 Referer，否则 403）
      var masterText = await _requestText(pItem.url, cookie, referer);
      var variants = _parseMasterPlaylist(masterText, pItem.url);

      if (variants.length > 0) {
        for (var vi = 0; vi < variants.length; vi++) {
          resources.push({
            name: variants[vi].title + " 直播流",
            description: "HLS 直播流",
            url: variants[vi].url,
            headers: {
              "Origin": WEB_BASE,
            },
          });
        }
      }

      // 保留自动画质作为兜底
      resources.push({
        name: pItem.title + " 直播流",
        description: "HLS 直播流",
        url: pItem.url,
        headers: {
          "Origin": WEB_BASE,
        },
      });
    }

    return resources;
  } catch (error) {
    console.error("[loadResource] 失败:", error.message || error);
    return [];
  }
}

async function search(params) {
  try {
    var keyword = params.keyword || "";
    var page = params.page || 1;
    var cookie = _getCookie(params);
    if (cookie) Widget.storage.set("pd_cookie", cookie);
    if (!keyword) return [];

    var list = await _searchBJ(keyword, page, cookie);
    return list.map(_formatSearchModel);
  } catch (error) {
    console.error("[search] 失败:", error.message || error);
    throw error;
  }
}
