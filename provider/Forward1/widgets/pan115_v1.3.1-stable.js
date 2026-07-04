// ==================== 115 Forward Module v1.3.1 ====================
// 功能：
//   1. 浏览 115 网盘文件夹，展示视频文件列表，点击进入详情页聚合播放
//   2. 作为 Stream Source，在番号详情页下方匹配 115 文件，提供 HLS 播放源
//   3. 在详情页 episodeItems 区域显示 Sukebei 磁力候选，用户点击确认后提交 115 离线
//   4. 115detail:// pickcode 直播放，不依赖番号 / extractNumber / searchFiles
//   5. 多分辨率播放源：BD(4K) / UD(1080P) / HD(720P)，无番号文件也能返回所有清晰度
//   6. (NEW v1.3.1) 欧美 Scene 弱匹配聚合：deeper.19.04.19 / vixen.20.08.14 (studio + date)
//   7. (NEW v1.3.1) extractMatchKey 三层调度：JAV → Western(强) → WesternDate(弱)
//   8. (NEW v1.3.1) scoreWesternFile 评分选片：排除 trailer/sample/preview，大文件优先
//
// 设计原则：
//   - link 只放路由 + 纯 ASCII 番号（聚合触发信号），不编码中文/日文
//   - 完整标题/封面/文件名走 PICKCODE_FILE_MAP 内存缓存
//   - loadDetail 路由：115detail:// → 正常详情页 | offline-submit:// → 离线提交
//   - loadResource 路由：offline-submit:// → 离线提交 | 115detail:// → 直放 | 其他 → 番号搜索
//   - 磁力搜索是读操作，自动发生；115 离线提交是写操作，只在用户点击后发生
//   - 播放源统一走 loadResource → buildStreamSources → parseStreams
//
// 底层 API：
//   - 搜索文件：      GET webapi.115.com/files/search
//   - 浏览文件夹：    GET webapi.115.com/files?cid=xxx
//   - Master m3u8:   GET https://115.com/api/video/m3u8/{pickcode}.m3u8
//   - 磁力搜索：     Sukebei (HTML 抓取)
//   - 元数据补充：   MissAV 搜索
//   - 离线提交：     POST 115.com/web/lixian/?ct=lixian&ac=add_task_url
//
// 授权方式：手动输入 Cookie（115.com 域下的登录态 Cookie）
//
// 播放形式：
//   1. 用 Cookie 请求 master m3u8 API
//   2. parseStreams 解析所有 #EXT-X-STREAM-INF 子流（NAME + RESOLUTION 双通道识别）
//   3. 子流 URL 已内嵌 CDN 签名参数，播放器无需额外 Cookie
//   4. 需在 customHeaders 中携带 Referer + User-Agent（CDN 校验用）

// ==================== 元数据定义 ====================
var WidgetMetadata = {
  id: "pan115_v1",
  title: "115 网盘",
  description: "浏览 115 网盘视频文件，提供番号匹配播放源；详情页展示 Sukebei 磁力候选，用户点击确认提交 115 离线",
  author: "forward-user",
  version: "1.3.1",
  requiredVersion: "0.0.1",
  site: "https://115.com",
  detailCacheDuration: 300,

  globalParams: [
    {
      name: "cookie",
      title: "115 Cookie",
      type: "input",
      value: "",
      placeholder: "填入 115.com 登录后的完整 Cookie"
    }
  ],

  search: {
    title: "搜索 115 文件",
    functionName: "searchPan115",
    params: [
      { name: "keyword", title: "关键词", type: "input", value: "" },
      { name: "page", title: "页码", type: "page", value: "1" }
    ]
  },

  modules: [
    {
      title: "浏览文件夹",
      description: "浏览 115 网盘视频文件列表",
      functionName: "loadFolder",
      requiresWebView: false,
      cacheDuration: 300,
      params: [
        {
          name: "cid",
          title: "目录 ID",
          type: "input",
          value: "0",
          placeholder: "0=根目录，或其他文件夹 ID"
        },
        {
          name: "page",
          title: "页码",
          type: "page",
          value: "1"
        }
      ]
    },
    {
      id: "loadResource",
      title: "115 网盘",
      description: "匹配 115 网盘文件，提供 HLS 播放源",
      functionName: "loadResource",
      type: "stream",
      params: []
    }
  ]
};

console.log("[pan115] version: " + WidgetMetadata.version);

// ==================== 全局状态 ====================
var COOKIE_115 = "";
var PICKCODE_FILE_MAP = {};

// ==================== 常量 ====================
var API_115 = "https://115.com";
var WEB_API_115 = "https://webapi.115.com";
var MISS_AV = "https://missav.ai";
var TIMEOUT = 15000;
var SUKEBEI_BASE = "https://sukebei.nyaa.si";
var MAGNET_CACHE_TTL = 3600 * 1000;  // 1 小时

var BASE_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
  "Referer": "https://115.com/",
  "Origin": "https://115.com"
};

var MISS_AV_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
  "Referer": "https://missav.ai/"
};

var VIDEO_EXTS = new Set([
  "mp4", "mkv", "avi", "wmv", "mov", "m4v",
  "ts", "flv", "rmvb", "webm", "3gp"
]);

var QUALITY_MAP = {
  BD: { label: "4K",    priority: 4 },
  UD: { label: "1080P", priority: 3 },
  HD: { label: "720P",  priority: 2 },
  SD: { label: "480P",  priority: 1 },
  LD: { label: "360P",  priority: 0 }
};

// ==================== 工具函数 ====================

function guessQualityFromResolution(width, height) {
  var h = Number(height || 0);
  if (h >= 2160) return { quality: "BD", label: "4K", priority: 4 };
  if (h >= 1080) return { quality: "UD", label: "1080P", priority: 3 };
  if (h >= 720)  return { quality: "HD", label: "720P", priority: 2 };
  if (h >= 480)  return { quality: "SD", label: "480P", priority: 1 };
  if (h >= 360)  return { quality: "LD", label: "360P", priority: 0 };
  return { quality: "", label: h ? (h + "P") : "", priority: -1 };
}

function getText(value) {
  return String(value || "").trim();
}

function formatSize(bytes) {
  if (!bytes && bytes !== 0) return "";
  var n = Number(bytes);
  if (isNaN(n) || n < 0) return "";
  if (n === 0) return "0 B";
  var units = ["B", "KB", "MB", "GB", "TB"];
  var i = Math.min(Math.floor(Math.log(n) / Math.log(1024)), units.length - 1);
  var v = (n / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0);
  return v + " " + units[i];
}

function isVideoFile(filename) {
  var ext = String(filename || "").split(".").pop().toLowerCase();
  return VIDEO_EXTS.has(ext);
}

function extractNumber(text) {
  var s = getText(text).toUpperCase();
  if (!s) return "";

  // 1. 去掉域名前缀: hhd800.com@, hhb800.com@, xxx.yyy@
  s = s.replace(/^[A-Z0-9]+(?:\.[A-Z0-9]+)+@/, "");

  // 2. 去掉已知资源站脏前缀(域名无@后缀时): HHD800, HHB800
  s = s.replace(/^(?:HHD800|HHB800)[_\-@.\s]?/, "");

  var normalized = s.replace(/_/g, "-").replace(/\s+/g, " ").trim();

  var patterns = [
    /\bFC2(?:[- ]?PPV)?[- ]?(\d{5,8})\b/,
    /\bCARIB[- ]?(\d{6,8})\b/,
    /\b1PONDO[- ]?(\d{6,8})\b/,
    /\bHEYZO[- ]?(\d{3,6})\b/,
    /\bT28[- ]?(\d{6,8})\b/,
    /\b([A-Z]{2,15})[- ]?(\d{2,10})\b/,
    /\b(\d{6}[-_]\d{2,3})\b/,
  ];

  for (var i = 0; i < patterns.length; i++) {
    var match = normalized.match(patterns[i]);
    if (match) {
      if (match[1] && match[2]) {
        var result = match[1] + "-" + match[2];
        console.log("[pan115/extractNumber] input:", text,
                    "cleaned:", s, "result:", result);
        return result;
      }
      if (match[1]) {
        console.log("[pan115/extractNumber] input:", text,
                    "cleaned:", s, "result:", match[1].replace(/\s+/g, ""));
        return match[1].replace(/\s+/g, "");
      }
    }
  }

  console.log("[pan115/extractNumber] input:", text,
              "cleaned:", s, "result: (none)");
  return "";
}

function displayTitleFromFile(filename) {
  var number = extractNumber(filename);
  if (number) return number;
  var name = String(filename || "").replace(/\.[^.]+$/, "");
  return name.length > 50 ? name.slice(0, 50) + "..." : name;
}

// ==================== 欧美 Scene Key 提取 ====================

var WESTERN_NOISE = /\b(?:xxx|1080p|2160p|4k|mp4|mkv|x264|x265|hevc|web-dl|webdl|ktr|n1c)\b/gi;

function extractWesternSceneKey(text) {
  var s = getText(text).toLowerCase();
  if (!s) return null;

  // 1. 过滤噪音词
  s = s.replace(WESTERN_NOISE, "");

  // 2. 分隔符归一化：空白/下划线/冒号 → 点号，合并连续点号
  var clean = s.replace(/[_\s:]+/g, ".").replace(/\.+/g, ".").replace(/^\.|\.$/g, "").trim();
  if (!clean) return null;

  // 3. 找日期模式 YY.MM.DD
  var dateMatch = clean.match(/(\d{2})[-.](\d{2})[-.](\d{2})/);
  if (!dateMatch) return null;

  var dateStr = dateMatch[0];
  var dateIndex = dateMatch.index;
  if (dateIndex === undefined) return null;

  // 4. 日期之前 → 取紧邻日期前的一个 token 作为 studio（忽略前置噪声）
  var beforeRaw = clean.slice(0, dateIndex).replace(/\.+$/, "").replace(/^\.+/, "");
  var beforeParts = beforeRaw.split(".").filter(Boolean);
  var studio = beforeParts.length > 0 ? beforeParts[beforeParts.length - 1] : "";

  // 5. 日期之后 → performer
  var afterRaw = clean.slice(dateIndex + dateStr.length).replace(/^\.+/, "").replace(/\.+$/, "");
  var performerParts = afterRaw.split(".").filter(Boolean);

  // 6. 校验：至少需要 studio + performer
  if (!studio || !performerParts.length) return null;

  var performerJoined = performerParts.join(".");
  var key = studio + "." + dateStr + "." + performerJoined;
  var searchText = studio;
  var strictTarget = (studio + dateStr.replace(/\./g, "") + performerJoined).replace(/[^a-z0-9]/g, "");

  console.log("[pan115/extractWesternSceneKey] key:", key,
              "searchText:", searchText,
              "strictTarget:", strictTarget);

  return {
    key: key,
    searchText: searchText,
    strictTarget: strictTarget
  };
}

function extractWesternDateKey(text) {
  var s = getText(text).toLowerCase();
  if (!s) return null;

  // 1. 过滤噪音词
  s = s.replace(WESTERN_NOISE, "");

  // 2. 分隔符归一化（含冒号）
  var clean = s.replace(/[_\s:]+/g, ".").replace(/\.+/g, ".").replace(/^\.|\.$/g, "").trim();
  if (!clean) return null;

  // 3. 找日期模式 YY.MM.DD
  var dateMatch = clean.match(/(\d{2})[-.](\d{2})[-.](\d{2})/);
  if (!dateMatch) return null;

  var dateStr = dateMatch[0];
  var dateIndex = dateMatch.index;
  if (dateIndex === undefined) return null;

  // 4. 日期之前 → 取紧邻日期前的一个 token 作为 studio（忽略前置噪声）
  var beforeRaw = clean.slice(0, dateIndex).replace(/\.+$/, "").replace(/^\.+/, "");
  var beforeParts = beforeRaw.split(".").filter(Boolean);
  var studio = beforeParts.length > 0 ? beforeParts[beforeParts.length - 1] : "";

  // 5. 只要求 studio + date（不要求 performer）
  if (!studio) return null;

  var key = studio + " " + dateStr;
  var searchText = studio;
  var strictTarget = (studio + dateStr.replace(/\./g, "")).replace(/[^a-z0-9]/g, "");
  var displayTitle = studio.charAt(0).toUpperCase() + studio.slice(1) + " " + dateStr;

  console.log("[pan115/extractWesternDateKey] extracted scene: \"" + (beforeParts.length > 1 ? beforeParts.slice(-2).join(".") : studio + "." + dateStr) + "\"  studio: \"" + studio + "\"  date: \"" + dateStr + "\"");
  console.log("[pan115/extractWesternDateKey] key:", key,
              "searchText:", searchText,
              "strictTarget:", strictTarget,
              "displayTitle:", displayTitle);

  return {
    type: "western_date",
    key: key,
    searchText: searchText,
    strictTarget: strictTarget,
    displayTitle: displayTitle,
    weak: true
  };
}

// ==================== Western 文件评分 ====================

var WESTERN_BAD_WORDS = ["trailer", "sample", "preview", "behind", "bts"];

function scoreWesternFile(file) {
  var fn = String(file.filename || "").toLowerCase();
  var score = 0;

  // 扣分：非正片关键词
  for (var wi = 0; wi < WESTERN_BAD_WORDS.length; wi++) {
    if (fn.indexOf(WESTERN_BAD_WORDS[wi]) !== -1) score -= 50;
  }

  // 大小加分/扣分
  var size = Number(file.size || 0);
  if (size >= 2 * 1024 * 1024 * 1024) score += 30;
  else if (size >= 1024 * 1024 * 1024) score += 20;
  else if (size >= 500 * 1024 * 1024) score += 10;
  else if (size > 0 && size < 100 * 1024 * 1024) score -= 20;

  // 文件名越长越可能是完整 scene
  if (fn.length > 30) score += 5;

  return score;
}

function extractMatchKey(text) {
  // 1) 先试 JAV 番号
  var number = extractNumber(text);
  if (number) {
    var searchText = number.toLowerCase().replace(/^fc2-/, "");
    var result = { type: "jav", key: number, searchText: searchText };
    console.log("[pan115/extractMatchKey] type: jav, key:", number);
    return result;
  }

  // 2) 再试 Western scene（强匹配：需要 performer）
  var western = extractWesternSceneKey(text);
  if (western) {
    var result = {
      type: "western",
      key: western.key,
      searchText: western.searchText,
      strictTarget: western.strictTarget
    };
    console.log("[pan115/extractMatchKey] type: western, key:", result.key);
    return result;
  }

  // 3) 最后试 Western date（弱匹配：只需要 studio + date）
  var dateKey = extractWesternDateKey(text);
  if (dateKey) {
    console.log("[pan115/extractMatchKey] type: western_date, key:", dateKey.key);
    return dateKey;
  }

  console.log("[pan115/extractMatchKey] no match");
  return null;
}

// ==================== HTTP 封装 ====================

async function httpGet(url, options) {
  options = options || {};
  var finalOptions = {
    headers: Object.assign({}, BASE_HEADERS, options.headers || {}),
    timeout: options.timeout || TIMEOUT
  };

  var resp = await Widget.http.get(url, finalOptions);
  if (!resp || resp.statusCode !== 200) {
    throw new Error("HTTP " + (resp && resp.statusCode || "unknown") + ": " + url.slice(0, 80));
  }
  return resp.data;
}

function cookieHeader(cookie) {
  if (!cookie) return {};
  return { "Cookie": cookie };
}

// ==================== 115 API 核心 ====================

async function listFolder(cookie, cid, page) {
  var limit = 30;
  var offset = ((page || 1) - 1) * limit;
  var url = WEB_API_115 + "/files?cid=" + encodeURIComponent(cid)
    + "&offset=" + offset + "&limit=" + limit
    + "&show_dir=1&type=&star=&is_share=&format=json";

  var data = await httpGet(url, { headers: cookieHeader(cookie) });

  var parsed = null;
  try { parsed = typeof data === "string" ? JSON.parse(data) : data; } catch (e) {}

  var allLists = [
    parsed && parsed.data,
    parsed && parsed.data && parsed.data.list,
    parsed && parsed.list,
    parsed && parsed.data && parsed.data.files,
  ];

  var files = [];
  for (var ci = 0; ci < allLists.length; ci++) {
    if (Array.isArray(allLists[ci])) { files = allLists[ci]; break; }
  }

  return files.map(function (item) {
    return {
      fid: item.fid || item.id || "",
      pickcode: item.pc || item.pickcode || "",
      filename: item.n || item.name || "",
      size: item.s || item.size || 0,
      isdir: !item.pc && !item.pickcode,
      cid: item.cid || item.fid || "",
    };
  }).filter(function (item) { return item.pickcode || item.isdir; });
}

async function searchFiles(cookie, keyword) {
  var url = WEB_API_115 + "/files/search?search_value=" + encodeURIComponent(keyword)
    + "&limit=30&offset=0";

  var data = await httpGet(url, { headers: cookieHeader(cookie) });

  var parsed = null;
  try { parsed = typeof data === "string" ? JSON.parse(data) : data; } catch (e) {}

  var lists = [
    parsed && parsed.data,
    parsed && parsed.data && parsed.data.list,
    parsed && parsed.data && parsed.data.files,
    parsed && parsed.data && parsed.data.items,
    parsed && parsed.files,
    parsed && parsed.list,
  ];

  var files = [];
  for (var i = 0; i < lists.length; i++) {
    if (Array.isArray(lists[i])) { files = lists[i]; break; }
  }

  return files.map(function (item) {
    return {
      pickcode: item.pc || item.pickcode || item.pick_code || item.pickCode || "",
      filename: item.n || item.name || item.file_name || item.filename || "",
      size: item.s || item.size || 0,
    };
  }).filter(function (item) { return item.pickcode && item.filename; });
}

async function getMasterM3u8Text(cookie, pickcode) {
  var url = API_115 + "/api/video/m3u8/" + encodeURIComponent(pickcode) + ".m3u8";
  var data = await httpGet(url, { headers: cookieHeader(cookie) });
  return String(data || "");
}

function parseStreams(masterText) {
  if (!masterText || masterText.indexOf("#EXTM3U") !== 0) return [];

  var lines = masterText.split("\n");
  var streams = [];

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line.indexOf("#EXT-X-STREAM-INF") === -1) continue;

    var nameMatch = line.match(/NAME="([^"]+)"/);
    var resolutionMatch = line.match(/RESOLUTION=(\d+)x(\d+)/);
    var bandwidthMatch = line.match(/BANDWIDTH=(\d+)/);

    var name = nameMatch ? nameMatch[1].toUpperCase() : "";
    var width = resolutionMatch ? Number(resolutionMatch[1]) : 0;
    var height = resolutionMatch ? Number(resolutionMatch[2]) : 0;

    // 优先 NAME 匹配，NAME 未识别时用 RESOLUTION 猜
    var quality = QUALITY_MAP[name];
    if (!quality) {
      quality = guessQualityFromResolution(width, height);
    }

    var urlLine = "";
    for (var j = i + 1; j < lines.length; j++) {
      var trimmed = lines[j].trim();
      if (trimmed && trimmed.charAt(0) !== "#") {
        urlLine = trimmed;
        break;
      }
    }

    urlLine = urlLine.replace(/^https:\s*\/\//i, "https://");
    if (!urlLine || urlLine.indexOf("http") !== 0) continue;

    var label = quality.label || (height ? height + "P" : "");
    streams.push({
      url: urlLine,
      quality: name || quality.quality || "",
      label: label,
      priority: quality.priority >= 0 ? quality.priority : -1,
      resolution: resolutionMatch ? width + "x" + height : "",
      bandwidth: bandwidthMatch ? Number(bandwidthMatch[1]) : 0
    });
  }

  // 按 priority 降序 → bandwidth 降序
  streams.sort(function (a, b) {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return (b.bandwidth || 0) - (a.bandwidth || 0);
  });

  console.log("[pan115/parseStreams] count:", streams.length);
  for (var si = 0; si < streams.length; si++) {
    var s = streams[si];
    console.log("[pan115/parseStreams]  #" + si, "label:", s.label,
                "resolution:", s.resolution,
                "url:", (s.url || "").slice(0, 80));
  }

  return streams;
}

// ==================== MissAV 元数据补充 ====================

async function enrichViaMissav(number) {
  if (!number) return null;

  try {
    var url = MISS_AV + "/cn/search/" + encodeURIComponent(number);
    var html = await httpGet(url, { headers: MISS_AV_HEADERS, timeout: 8000 });
    var $ = Widget.html.load(html);

    var group = $("div.group").first();
    if (!group || !group.length) return null;

    var link = group.find("a.text-secondary");
    var href = link.attr("href");
    var title = link.text().trim();
    if (!href) return null;

    var videoId = href.split('/').pop()
      .replace(/-uncensored-leak|-chinese-subtitle/g, '')
      .toUpperCase();

    var coverUrl = "https://fourhoi.com/" + videoId.toLowerCase() + "/cover-t.jpg";
    var img = group.find("img");
    var fallbackCover = img.attr("data-src") || img.attr("src") || "";

    return {
      title: title,
      coverUrl: coverUrl,
      fallbackCover: fallbackCover,
      videoId: videoId,
      missavLink: href.indexOf("http") === 0 ? href : MISS_AV + href,
      source: "missav"
    };
  } catch (err) {
    console.warn("[pan115] MissAV 元数据失败:", err && err.message ? err.message : err);
    return null;
  }
}

// ==================== Cookie 同步 ====================

function resolveCookie(params) {
  return getText(params && params.cookie ? params.cookie : COOKIE_115);
}

function syncCookie(cookie) {
  COOKIE_115 = cookie || "";
}

// ==================== 构建函数 ====================

/**
 * buildFallbackBrowseItem — 纯本地 fallback 浏览卡片
 * 不依赖任何网络调用，确保合法视频文件至少显示一张卡片
 */
function buildFallbackBrowseItem(file) {
  var number = extractNumber(file.filename);
  var title = displayTitleFromFile(file.filename);
  var backdropPath = "";

  var descParts = [];
  if (number) descParts.push("番号: " + number);
  descParts.push("原文件: " + file.filename);
  if (formatSize(file.size)) descParts.push("大小: " + formatSize(file.size));
  var description = descParts.filter(Boolean).join(" · ");

  PICKCODE_FILE_MAP[file.pickcode] = {
    title: title,
    filename: file.filename,
    size: file.size,
    number: number,
    backdropPath: backdropPath,
    description: description
  };

  var link = "115detail://" + file.pickcode;
  if (number) {
    link += "?title=" + encodeURIComponent(number);
  }

  var itemId = number || ("115_" + file.pickcode);

  console.log("[pan115] [FALLBACK] filename:", file.filename,
              "number:", number, "title:", title);

  return {
    id: itemId,
    vod_id: itemId,
    type: "url",
    title: title,
    name: title,
    originalTitle: number || title,
    backdropPath: backdropPath,
    coverUrl: backdropPath,
    posterPath: backdropPath,
    mediaType: "movie",
    link: link,
    description: description
  };
}

async function buildBrowseItem(cookie, file) {
  if (!file.pickcode || !file.filename || !isVideoFile(file.filename)) return null;

  console.log("[pan115/buildBrowseItem] filename:", file.filename,
              "pickcode:", file.pickcode);

  try {
    var number = extractNumber(file.filename);
    var displayTitle = displayTitleFromFile(file.filename);
    console.log("[pan115/buildBrowseItem] number:", number,
                "displayTitle:", displayTitle);

    var meta = null;
    if (number) {
      meta = await enrichViaMissav(number);
    }

    var title = (meta && meta.title) ? meta.title : displayTitle;
    var backdropPath = (meta && meta.coverUrl) ? meta.coverUrl
                    : (meta && meta.fallbackCover) ? meta.fallbackCover
                    : "";

    console.log("[pan115/buildBrowseItem] metaHit:", !!meta,
                "title:", title,
                "backdropPath:", !!backdropPath);

    var descParts = [];
    if (number) descParts.push("番号: " + number);
    descParts.push("原文件: " + file.filename);
    if (formatSize(file.size)) descParts.push("大小: " + formatSize(file.size));
    if (meta && meta.source) descParts.push("元数据: " + meta.source);
    var description = descParts.filter(Boolean).join(" · ");

    PICKCODE_FILE_MAP[file.pickcode] = {
      title: title,
      filename: file.filename,
      size: file.size,
      number: number,
      backdropPath: backdropPath,
      description: description
    };

    var link = "115detail://" + file.pickcode;
    if (number) {
      link += "?title=" + encodeURIComponent(number);
    }

    var itemId = number || ("115_" + file.pickcode);

    return {
      id: itemId,
      vod_id: itemId,
      type: "url",
      title: title,
      name: title,
      originalTitle: number || title,
      backdropPath: backdropPath,
      coverUrl: backdropPath,
      posterPath: backdropPath,
      mediaType: "movie",
      link: link,
      description: description
    };
  } catch (err) {
    console.warn("[pan115/buildBrowseItem] 异常, 使用 fallback —",
                 file.filename,
                 err && err.message ? err.message : err);
    return buildFallbackBrowseItem(file);
  }
}

async function buildStreamSources(cookie, file) {
  if (!file.pickcode || !file.filename || !isVideoFile(file.filename)) return [];

  var number = extractNumber(file.filename);
  var displayTitle = number || displayTitleFromFile(file.filename);

  var masterText = await getMasterM3u8Text(cookie, file.pickcode);
  var streams = parseStreams(masterText);
  if (!streams.length) return [];

  var result = streams.map(function (s) {
    var label = s.label || s.quality || "";
    return {
      name: "115 网盘" + (label ? " (" + label + ")" : ""),
      description: (number ? "番号: " : "标题: ") + displayTitle +
                   "\n文件: " + file.filename +
                   (s.resolution ? "\n分辨率: " + s.resolution : ""),
      url: s.url,
      customHeaders: {
        "Referer": "https://115.com/",
        "User-Agent": BASE_HEADERS["User-Agent"]
      }
    };
  });

  console.log("[pan115/buildStreamSources] count:", result.length);
  return result;
}

// 兼容包装：单 stream 版本
async function buildStreamSource(cookie, file) {
  var streams = await buildStreamSources(cookie, file);
  return streams.length ? streams[0] : null;
}

/**
 * parse115DetailLink — 解析 115detail://{pickcode}[?title=xxx] 链接
 */
function parse115DetailLink(link) {
  var cleanLink = String(link || "");
  var pathPart = cleanLink.slice("115detail://".length);
  var qIndex = pathPart.indexOf("?");
  return {
    pickcode: qIndex >= 0 ? pathPart.slice(0, qIndex) : pathPart,
    query: qIndex >= 0 ? pathPart.slice(qIndex + 1) : ""
  };
}

/**
 * handleDirectPickcodeResource — 115detail:// 直播放路径
 * 不依赖番号，不用 searchFiles，直接用 pickcode 获取 115 播放源
 */
async function handleDirectPickcodeResource(params, link) {
  var cookie = resolveCookie(params);
  syncCookie(cookie);
  if (!cookie) return [];

  var parsed = parse115DetailLink(link);
  var pickcode = parsed.pickcode;
  if (!pickcode) return [];

  var cached = PICKCODE_FILE_MAP[pickcode] || {};
  var filename = cached.filename || params.title || params.name || "115-video.mp4";
  var file = {
    pickcode: pickcode,
    filename: filename,
    size: cached.size || 0
  };

  var sources = await buildStreamSources(cookie, file);
  console.log("[pan115/directPickcode] pickcode:", pickcode, "filename:", filename, "streams:", sources.length);
  return sources;
}

// ==================== 入口函数 ====================

async function loadFolder(params) {
  var cookie = resolveCookie(params);
  syncCookie(cookie);

  var cid = getText(params.cid) || "0";
  var page = parseInt(params.page || "1", 10) || 1;

  if (!cookie) {
    return [{
      id: "no-cookie",
      type: "url",
      title: "需要 115 Cookie",
      backdropPath: "",
      mediaType: "movie",
      link: "",
      description: "请在参数或全局设置中填入 115 Cookie"
    }];
  }

  try {
    var files = await listFolder(cookie, cid, page);
    var folders = [];
    var videoFiles = [];
    for (var fi = 0; fi < files.length; fi++) {
      if (files[fi].isdir) folders.push(files[fi]);
      else if (isVideoFile(files[fi].filename)) videoFiles.push(files[fi]);
    }

    var results = [];
    for (var di = 0; di < folders.length; di++) {
      results.push({
        id: "https://115.com/dir/" + folders[di].cid,
        type: "url",
        title: "\u{1F4C1} " + folders[di].filename,
        backdropPath: "",
        mediaType: "movie",
        link: "",
        description: "子文件夹（当前版本暂不支持递归浏览）"
      });
    }

    if (!videoFiles.length) {
      return folders.length ? results : [{
        id: "empty", type: "url", title: "空文件夹",
        backdropPath: "", mediaType: "movie", link: "",
        description: "该目录下没有内容"
      }];
    }

    var itemPromises = videoFiles.map(function (f) {
      return buildBrowseItem(cookie, f)["catch"](function (err) {
        console.warn("[pan115/loadFolder] buildBrowseItem 未捕获异常(不应发生):",
                     f.filename, err && err.message ? err.message : err);
        return buildFallbackBrowseItem(f);
      });
    });
    var items = await Promise.all(itemPromises);
    for (var ii = 0; ii < items.length; ii++) {
      if (items[ii]) results.push(items[ii]);
    }

    return results.length ? results : [{
      id: "no-video", type: "url", title: "无可用视频",
      backdropPath: "", mediaType: "movie", link: "",
      description: "未能解析到可播放的视频文件"
    }];
  } catch (err) {
    console.error("[pan115] loadFolder:", err && err.message ? err.message : err);
    return [{
      id: "error", type: "url", title: "加载失败",
      backdropPath: "", mediaType: "movie", link: "",
      description: err && err.message ? err.message : "请检查 Cookie 或目录 ID 是否正确"
    }];
  }
}

// --- loadDetail (v1.2.0: 路由拆分) ---
async function loadDetail(link) {
  link = String(link || "");
  try {
    if (link.indexOf("offline-submit://") === 0) {
      return await handleOfflineSubmit(link);
    }
    if (link.indexOf("115detail://") === 0) {
      return await handleNormalDetail(link);
    }
    return null;
  } catch (err) {
    // loadDetail 不应 throw，任何异常都返回回执页
    return {
      id: link,
      type: "url",
      title: "加载失败",
      description: String(err && err.message || err),
      link: link
    };
  }
}

// --- loadResource (v1.2.0: 移除 testOfflineMagnet 自动提交) ---
async function loadResource(params) {
  console.log("[pan115/stream] === loadResource entry ===");
  var link = String(params && params.link || "");

  // 1. 离线候选卡片点击
  if (link.indexOf("offline-submit://") === 0) {
    console.log("[pan115/stream] offline-submit detected:", link);
    return await handleOfflineSubmitFromResource(params, link);
  }

  // 2. 115 浏览页本地文件：直接按 pickcode 播放（不依赖番号/搜索）
  if (link.indexOf("115detail://") === 0) {
    console.log("[pan115/stream] 115detail detected:", link);
    return await handleDirectPickcodeResource(params, link);
  }

  // 3. 外部详情页聚合：需要番号搜索（JAV）或欧美 scene key 搜索
  console.log("[pan115/stream] params keys:", JSON.stringify(Object.keys(params)));
  try {
    var cookie = resolveCookie(params);
    syncCookie(cookie);
    console.log("[pan115/stream] cookie length:", (cookie || "").length, "| has value:", !!cookie);
    if (!cookie) { console.log("[pan115/stream] cookie empty, abort"); return []; }

    var texts = [];
    if (params.title) texts.push(params.title);
    if (params.name) texts.push(params.name);
    if (params.originalTitle) texts.push(params.originalTitle);
    if (params.id) texts.push(params.id);
    if (params.vod_id) texts.push(params.vod_id);
    if (params.link) texts.push(params.link);
    if (params.description) texts.push(params.description);
    if (params.episodeName) texts.push(params.episodeName);
    if (params.airDate) texts.push(params.airDate);
    var combined = texts.join(" ");
    console.log("[pan115/stream] combined text:", combined.slice(0, 120));

    var matchKey = extractMatchKey(combined);
    console.log("[pan115/stream] matchKey:", JSON.stringify(matchKey));
    if (!matchKey) { console.log("[pan115/stream] no match key, abort"); return []; }

    console.log("[pan115/stream] searchFiles keyword:", matchKey.searchText);
    var files = await searchFiles(cookie, matchKey.searchText);

    console.log("[pan115/stream] searchFiles result count:", files.length);
    if (!files.length) {
      console.log("[pan115/stream] no files found (auto offline disabled in v1.2.0)");
      return [];
    }

    var matched = [];
    if (matchKey.type === "jav") {
      // JAV：维持原有严格匹配逻辑
      var normalizedTarget = matchKey.key.replace(/[^a-z0-9]/gi, "").toLowerCase();
      for (var mi = 0; mi < files.length; mi++) {
        var fn = String(files[mi].filename).replace(/[^a-z0-9]/gi, "").toLowerCase();
        if (fn.indexOf(normalizedTarget) !== -1) matched.push(files[mi]);
      }
      console.log("[pan115/stream] JAV matched count:", matched.length);
    } else if (matchKey.type === "western") {
      // Western：用 strictTarget 做 normalized contains 匹配
      var strictTarget = matchKey.strictTarget;
      console.log("[pan115/stream] western strictTarget:", strictTarget);
      for (var mi = 0; mi < files.length; mi++) {
        var fn = String(files[mi].filename).replace(/[^a-z0-9]/gi, "").toLowerCase();
        if (fn.indexOf(strictTarget) !== -1) matched.push(files[mi]);
      }
      console.log("[pan115/stream] western matched count:", matched.length);
    } else if (matchKey.type === "western_date") {
      // Western date 弱匹配：筛选候选后再评分
      var strictTarget = matchKey.strictTarget;
      console.log("[pan115/stream] western_date strictTarget:", strictTarget, "displayTitle:", matchKey.displayTitle);
      var candidates = [];
      for (var mi = 0; mi < files.length; mi++) {
        var fn = String(files[mi].filename).replace(/[^a-z0-9]/gi, "").toLowerCase();
        if (fn.indexOf(strictTarget) !== -1) candidates.push(files[mi]);
      }
      console.log("[pan115/stream] western_date candidates count:", candidates.length);
      if (candidates.length === 1) {
        matched = candidates;
        console.log("[pan115/stream] western_date [WEAK] exact match:", candidates[0].filename);
      } else if (candidates.length > 1) {
        // 评分排序：排除 trailer/sample/preview，大文件优先
        candidates.sort(function (a, b) {
          return scoreWesternFile(b) - scoreWesternFile(a);
        });
        // 过滤负分文件（明显不是正片的）
        var filtered = candidates.filter(function (f) { return scoreWesternFile(f) >= 0; });
        if (filtered.length === 0) {
          // 全部负分，取最不坏的
          matched = [candidates[0]];
          console.log("[pan115/stream] western_date [WEAK] all bad, best of worst:", candidates[0].filename);
        } else if (filtered.length === 1) {
          matched = filtered;
          console.log("[pan115/stream] western_date [WEAK] best candidate:", filtered[0].filename);
        } else {
          // 多个候选，取评分最高的
          matched = [filtered[0]];
          console.log("[pan115/stream] western_date [WEAK] top scored:", filtered[0].filename,
                      "skipped", filtered.length - 1, "others");
        }
      }
    }

    console.log("[pan115/stream] matched count:", matched.length, "| files total:", files.length);
    if (!matched.length) {
      console.log("[pan115/stream] no match among", files.length, "files (auto offline disabled in v1.2.0)");
      return [];
    }

    var promises = matched.map(function (f) {
      return buildStreamSources(cookie, f)["catch"](function (err) {
        console.warn("[pan115/stream] buildStreamSources failed:", f && f.filename, err && err.message || err);
        return [];
      });
    });
    var nested = await Promise.all(promises);
    var streams = [];
    for (var si = 0; si < nested.length; si++) {
      if (nested[si] && nested[si].length) {
        streams = streams.concat(nested[si]);
      }
    }
    return streams;
  } catch (err) {
    console.error("[pan115/stream] loadResource:", err && err.message ? err.message : err);
    return [];
  }
}

// --- searchPan115 ---
async function searchPan115(params) {
  var cookie = resolveCookie(params);
  syncCookie(cookie);
  if (!cookie) {
    return [{
      id: "no-cookie", type: "url", title: "需要 115 Cookie",
      backdropPath: "", mediaType: "movie", link: "",
      description: "请在参数或全局设置中填入 115 Cookie"
    }];
  }

  var keyword = getText(params.keyword);
  if (!keyword) return [];

  try {
    var files = await searchFiles(cookie, keyword);
    var videoFiles = files.filter(function (f) { return isVideoFile(f.filename); });

    var promises = videoFiles.map(function (f) {
      return buildBrowseItem(cookie, f)["catch"](function () { return null; });
    });
    var items = await Promise.all(promises);
    return items.filter(Boolean);
  } catch (err) {
    console.error("[pan115] searchPan115:", err && err.message ? err.message : err);
    return [];
  }
}

// ==================== 115 离线下载函数 ====================

/**
 * 从 Cookie 首段提取 UID
 * Cookie 格式通常为: UID=xxx; CID=...; SEID=...; ...
 */
function extractUidFromCookie(cookie) {
  var first = String(cookie || "").split(";")[0].trim();
  var idx = first.indexOf("=");
  return idx >= 0 ? first.slice(idx + 1) : "";
}

/**
 * 获取 115 离线 token (sign + time)
 * GET https://115.com/?ct=offline&ac=space
 * 返回: { sign, time, size, limit }
 * 需要 Cookie 处于登录态
 */
async function getOfflineSpaceToken(cookie) {
  console.log("[pan115/offline] === getOfflineSpaceToken ===");
  var url = "https://115.com/?ct=offline&ac=space&_=" + Date.now();
  try {
    var raw = await httpGet(url, { headers: cookieHeader(cookie) });
    console.log("[pan115/offline] space raw type:", typeof raw);

    var json = null;
    if (typeof raw === "string") {
      console.log("[pan115/offline] space raw preview:", raw.slice(0, 200));
      json = JSON.parse(raw);
    } else if (raw && typeof raw === "object") {
      console.log("[pan115/offline] space raw object keys:", JSON.stringify(Object.keys(raw)));
      json = raw;
    } else {
      throw new Error("space 返回格式异常: " + String(raw));
    }

    console.log("[pan115/offline] space response state:", json.state, "| has sign:", !!json.sign, "| has time:", !!json.time);
    if (json.state !== true) {
      throw new Error("space 获取失败: " + (json.error || json.error_msg || JSON.stringify(json)));
    }
    return {
      sign: json.sign,
      time: json.time,
      size: json.size,
      limit: json.limit
    };
  } catch (err) {
    console.error("[pan115/offline] space 请求异常:", err && err.message ? err.message : err);
    throw err;
  }
}

/**
 * 提交一条磁力链离线任务
 * POST https://115.com/web/lixian/?ct=lixian&ac=add_task_url
 * @param {string} cookie - 115 登录 Cookie
 * @param {string} magnet - 磁力链接
 * @param {{ sign: string, time: string|number, uid?: string }} tokenObj - 离线授权参数
 * @returns {{ state: boolean, info_hash?: string, error?: string }}
 */
async function submitOfflineTask(cookie, magnet, tokenObj) {
  console.log("[pan115/offline] === submitOfflineTask ===");
  var maglink = String(magnet || "").trim();
  var uid = tokenObj.uid || extractUidFromCookie(cookie);
  var body = "url=" + encodeURIComponent(maglink)
           + "&uid=" + encodeURIComponent(uid)
           + "&sign=" + encodeURIComponent(tokenObj.sign)
           + "&time=" + encodeURIComponent(tokenObj.time);

  console.log("[pan115/offline] POST url:", maglink.slice(0, 50));
  console.log("[pan115/offline] uid:", uid);
  console.log("[pan115/offline] body preview:", body.slice(0, 100) + "...");

  try {
    var raw = await Widget.http.post(
      "https://115.com/web/lixian/?ct=lixian&ac=add_task_url",
      body,
      {
        headers: Object.assign({}, BASE_HEADERS, cookieHeader(cookie), {
          "Content-Type": "application/x-www-form-urlencoded",
          "Referer": "https://115.com/",
          "Origin": "https://115.com"
        }),
        timeout: 20000
      }
    );

    var data = raw && raw.data;
    console.log("[pan115/offline] POST raw.data type:", typeof data);

    var json = null;
    if (typeof data === "string") {
      console.log("[pan115/offline] POST response:", data.slice(0, 200));
      json = JSON.parse(data);
    } else if (data && typeof data === "object") {
      console.log("[pan115/offline] POST response object keys:", JSON.stringify(Object.keys(data)));
      json = data;
    } else {
      throw new Error("POST 返回格式异常: " + String(data));
    }

    if (json.state === true) {
      console.log("[pan115/offline] success, info_hash:", json.info_hash);
      return { state: true, info_hash: json.info_hash || "" };
    }
    var errMsg = json.errcode === "911"
      ? "账号使用异常，请手工验证"
      : (json.error_msg || json.error || "未知错误");
    console.warn("[pan115/offline] task failed:", errMsg, "| full:", JSON.stringify(json));
    return {
      state: false,
      error: errMsg,
      errcode: json.errcode,
    };
  } catch (err) {
    console.error("[pan115/offline] POST 请求异常:", err && err.message ? err.message : err);
    throw err;
  }
}

/**
 * 一键离线：space token → 提交任务
 * @param {string} cookie - 115 登录 Cookie
 * @param {string} magnet - 磁力链接
 * @param {{ uid?: string }} [opts] - 可选参数，不传则自动从 cookie 提取 uid
 * @returns {{ state: boolean, info_hash?: string, error?: string }}
 */
async function offlineOneClick(cookie, magnet, opts) {
  console.log("[pan115/offline] === offlineOneClick ===");
  console.log("[pan115/offline] cookie length:", (cookie || "").length);
  console.log("[pan115/offline] magnet:", String(magnet || "").slice(0, 80));
  opts = opts || {};
  var token = await getOfflineSpaceToken(cookie);
  console.log("[pan115/offline] space token ok, sign:", token.sign, "| time:", token.time);
  var result = await submitOfflineTask(cookie, magnet, {
    sign: token.sign,
    time: token.time,
    uid: opts.uid || "",
  });
  console.log("[pan115/offline] result:", JSON.stringify(result));
  return result;
}

// ==================== v1.2.0: 存储工具函数 ====================

function storeGetJSON(key, fallback) {
  try {
    var raw = Widget.storage.get(key);
    if (!raw) return fallback;
    if (typeof raw === "string") return JSON.parse(raw);
    return raw;
  } catch (_) {
    return fallback;
  }
}

function storeSetJSON(key, value) {
  try {
    Widget.storage.set(key, JSON.stringify(value));
  } catch (e) {
    console.error("[storage] set failed:", e && e.message || e);
  }
}

// ==================== v1.2.0: Sukebei 磁力引擎 ====================

/**
 * 从磁力链接中提取 infoHash
 */
function extractInfoHash(maglink) {
  var m = String(maglink).match(/btih:([a-f0-9]{40})/i);
  return m ? m[1].toLowerCase() : "";
}

/**
 * 简单的字符串哈希（作为 infoHash 缺失时的 fallback）
 */
function simpleHash(s) {
  var hash = 0;
  var str = String(s);
  for (var i = 0; i < str.length; i++) {
    var chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return "h" + Math.abs(hash).toString(36);
}

/**
 * 从磁力标题中提取标签
 * @returns {string[]} tags 数组，如 ["cnsub", "hd", "4k"]
 */
function extractTags(title) {
  var t = String(title || "");
  var tags = [];
  if (/(?:[^A-Za-z]|^)FHDC|[-_]CH?(?:[^A-Za-z]|$)|中字|中文/i.test(t)) tags.push("cnsub");
  if (/\bHD\b/i.test(t)) tags.push("hd");
  if (/\b4K\b/i.test(t)) tags.push("4k");
  return tags;
}

/**
 * 将大小文本（如 "2.3 GiB"）解析为字节数
 */
function parseSizeBytes(s) {
  var m = String(s || "").replace(/,/g, "").match(/([\d.]+)\s*(GiB|MiB|KiB|GB|MB|KB|B)?/i);
  if (!m) return 0;
  var n = parseFloat(m[1]);
  var u = (m[2] || "B").toUpperCase();
  var map = {
    GIB: 1 << 30, MIB: 1 << 20, KIB: 1 << 10,
    GB: 1 << 30, MB: 1 << 20, KB: 1 << 10, B: 1
  };
  return n * (map[u] || 1);
}

/**
 * 字节数 → 可读大小标签
 */
function formatSizeLabel(bytes) {
  if (!bytes || bytes <= 0) return "";
  var gb = bytes / (1 << 30);
  if (gb >= 1) return gb.toFixed(gb >= 10 ? 1 : 2) + " GB";
  var mb = bytes / (1 << 20);
  if (mb >= 1) return Math.round(mb) + " MB";
  return Math.round(bytes / (1 << 10)) + " KB";
}

/**
 * 磁力候选评分排序
 * 中字优先 > 高清优先 > 合理大小优先 > 大合集降权
 */
function scoreCandidate(c) {
  var score = 0;
  if (c.tags && c.tags.indexOf("cnsub") >= 0) score += 100;
  if (c.tags && c.tags.indexOf("hd") >= 0)    score += 20;
  if (c.tags && c.tags.indexOf("4k") >= 0)    score += 10;
  if (c.sizeBytes) {
    var gb = c.sizeBytes / (1 << 30);
    if (gb >= 0.3 && gb <= 15) score += 20;   // 合理大小范围
    if (gb > 30) score -= 50;                  // 超大合集降权
  }
  return score;
}

/**
 * 从 Sukebei 搜索磁力链接
 * GET https://sukebei.nyaa.si/?f=0&c=0_0&q={kw}
 * 解析 HTML 表格获取磁力行，按评分排序后返回
 */
async function searchMagnetSukebei(kw) {
  var url = SUKEBEI_BASE + "/?f=0&c=0_0&q=" + encodeURIComponent(kw);
  console.log("[magnet:sukebei] url:", url);
  var resp = await Widget.http.get(url, { timeout: 8000 });
  if (!resp || !resp.data) {
    console.log("[magnet:sukebei] no response");
    return [];
  }
  console.log("[magnet:sukebei] html length:", String(resp.data).length);

  var $ = Widget.html.load(resp.data);
  var items = [];

  $("tr.default, tr.success").each(function () {
    var titleEl = $(this).find("td:nth-child(2) > a:nth-child(1)");
    var magEl   = $(this).find("td:nth-child(3) > a:last-child");
    var sizeEl  = $(this).find("td:nth-child(4)");

    var title  = String(titleEl.attr("title") || titleEl.text()).trim();
    var maglink = String(magEl.attr("href") || "").trim();
    var size   = String(sizeEl.text()).trim();

    if (!title || !maglink) return;

    var infoHash = extractInfoHash(maglink);
    var tags = extractTags(title);
    var sizeBytes = parseSizeBytes(size);

    items.push({
      title: title,
      maglink: maglink,
      size: size,
      sizeBytes: sizeBytes,
      infoHash: infoHash || simpleHash(maglink),
      source: "sukebei",
      tags: tags
    });
  });

  items.sort(function (a, b) { return scoreCandidate(b) - scoreCandidate(a); });
  console.log("[magnet:sukebei] result count:", items.length);
  return items;
}

// ==================== v1.2.0: 磁力候选管理与 episodeItems ====================

/**
 * 获取磁力候选（缓存优先）
 * - 缓存命中且未过期 → 直接构建 episodeItems
 * - 缓存未命中 → 搜索 → 写缓存 → 构建
 * - 任何异常返回空数组，不阻塞详情页
 */
async function getMagnetCandidatesWithCache(number) {
  var dvdId = (number || "").trim().toLowerCase();
  if (!dvdId) return [];

  // 1. 读缓存
  var cached = storeGetJSON("magnet-candidates:" + dvdId, null);
  if (cached && Date.now() - cached.time < MAGNET_CACHE_TTL) {
    console.log("[magnet] cache hit:", dvdId, (cached.items || []).length);
    return buildEpisodeItems(dvdId, cached.items);
  }

  // 2. 搜索 Sukebei（超时由 Widget.http.get 的 timeout 参数保障）
  console.log("[magnet] search start:", dvdId);
  var items = [];
  try {
    items = await searchMagnetSukebei(dvdId);
    console.log("[magnet] search done:", dvdId, items.length);
  } catch (e) {
    console.error("[magnet] search failed:", e && e.message || e);
    items = [];
  }

  // 3. 写缓存
  if (items.length > 0) {
    storeSetJSON("magnet-candidates:" + dvdId, { time: Date.now(), items: items });
  } else {
    console.log("[magnet] no candidates, skip empty cache:", dvdId);
  }

  // 4. 构建 episodeItems（含提交状态）
  return buildEpisodeItems(dvdId, items);
}

/**
 * 将磁力候选列表构建为 episodeItems
 * 每条候选是一个 type:"url" 的 VideoItem，禁止设置 videoUrl
 * 提交状态从 storage 读取：✅ 已提交 / ⬇️ 未提交 / ⬇️ 失败可重试
 */
function buildEpisodeItems(dvdId, candidates) {
  if (!candidates || !candidates.length) return [];

  return candidates.map(function (c, idx) {
    var candidateId = c.infoHash || ("idx_" + idx);
    var submitted = storeGetJSON("offline-submitted:" + dvdId + ":" + candidateId, null);

    var sizeLabel = formatSizeLabel(c.sizeBytes) || c.size || "";
    var tagText = "";
    if (c.tags) {
      if (c.tags.indexOf("cnsub") >= 0) tagText += "｜中文字幕";
      if (c.tags.indexOf("hd") >= 0)    tagText += "｜高清";
      if (c.tags.indexOf("4k") >= 0)    tagText += "｜4K";
    }
    var sourceLabel = "Sukebei";
    var title = "";
    var desc = "";

    if (submitted && submitted.ok) {
      title = "✅ 已提交到115" + (sizeLabel ? "｜" + sizeLabel : "") + tagText;
      desc = "已提交到 115。请返回原详情页刷新，等待资源匹配。";
    } else if (submitted && !submitted.ok) {
      title = "⚠️ 上次提交失败｜" + sizeLabel;
      desc = "点击可重试 · 来源: " + sourceLabel;
    } else {
      title = "⬇️ 115离线｜点击提交｜" + (sizeLabel ? sizeLabel + tagText : "");
      desc = "来源: " + sourceLabel + " · 打开此卡片会提交到 115 离线";
    }

    return {
      id: "offline:" + dvdId + ":" + candidateId,
      type: "url",
      title: title,
      description: desc,
      link: "offline-submit://" + dvdId + "?cid=" + candidateId
      // 不设置 videoUrl / previewUrl / playerType
    };
  });
}

// ==================== v1.2.0: handleNormalDetail 详情页 + 磁力候选区 ====================

/**
 * 处理 115detail:// 正常详情页
 * - 解析 pickcode，构建基础详情
 * - 搜索 115 文件（失败不阻断）
 * - 搜索磁力候选（失败不阻断）
 * - 返回携带 episodeItems 的完整 VideoItem
 */
async function handleNormalDetail(link) {
  var cleanLink = getText(link);

  // 解析 pickcode
  var pathPart = cleanLink.slice("115detail://".length);
  var qIndex = pathPart.indexOf("?");
  var pickcode = qIndex >= 0 ? pathPart.slice(0, qIndex) : pathPart;
  if (!pickcode) return null;

  // 读取元数据缓存
  var cached = PICKCODE_FILE_MAP[pickcode] || {};
  var filename = cached.filename || "";
  var number = cached.number || extractNumber(filename);

  // 兜底解析 query 中的 title
  if (!number && qIndex >= 0) {
    var pairs = pathPart.slice(qIndex + 1).split("&");
    for (var i = 0; i < pairs.length; i++) {
      var kv = pairs[i].split("=");
      if (kv[0] === "title" && kv[1] !== undefined) {
        number = extractNumber(decodeURIComponent(kv[1]));
        break;
      }
    }
  }

  // 构建基础详情（同 v1.1.0 逻辑）
  var title = cached.title || number || displayTitleFromFile(filename) || "115 视频";
  var descParts = [];
  if (number) descParts.push("番号: " + number);
  if (filename) descParts.push("原文件: " + filename);
  if (cached.size && formatSize(cached.size)) descParts.push("大小: " + formatSize(cached.size));
  var description = descParts.join("\n") || cached.description || "";
  var itemId = number || ("115_" + pickcode);

  var item = {
    id: itemId,
    vod_id: itemId,
    type: "detail",
    title: title,
    name: title,
    originalTitle: number || title,
    description: description,
    backdropPath: cached.backdropPath || "",
    coverUrl: cached.backdropPath || "",
    posterPath: cached.backdropPath || "",
    mediaType: "movie",
    link: cleanLink,
    episodeItems: []    // 占位，后续填充
  };

  // 尝试搜索 115 文件（失败不阻断）
  try {
    var cookie = COOKIE_115 || "";
    if (cookie && number) {
      var searchText = number.toLowerCase().replace(/^fc2-/, "");
      await searchFiles(cookie, searchText);
    }
  } catch (e) {
    console.error("[pan115] searchFiles (non-blocking):", e && e.message || e);
  }

  // 搜索磁力候选（失败不阻断）
  var candidates = [];
  if (number) {
    candidates = await getMagnetCandidatesWithCache(number);
  }
  // episodeItems 不放入磁力候选（避免污染详情页标题/分集状态）
  item.episodeItems = [];

  // 离线候选放入 relatedItems，卡片会触发 loadResource → handleOfflineSubmitFromResource
  item.relatedItems = candidates.map(function (c) {
    return {
      id: c.id,
      type: "url",
      title: c.title,
      description: c.description,
      link: c.link
    };
  });
  console.log("[pan115/detail] relatedItems count:", item.relatedItems.length);

  return item;
}

// ==================== v1.2.0: handleOfflineSubmit 离线提交 + 操作回执 ====================

/**
 * 构建操作回执页
 * type:"url" + 不包含 videoUrl，仅展示结果
 */
function buildReceipt(link, ok, title, message) {
  return {
    id: link,
    type: "url",
    title: title,
    description: message,
    link: link
  };
}

/**
 * 处理 offline-submit:// 提交请求
 * - 解析番号和候选 ID
 * - 防重复提交（已成功的候选不再重复提交）
 * - 从缓存中读取磁力候选
 * - 提交 115 离线任务
 * - 写入提交状态缓存
 * - 返回操作回执页
 */
async function handleOfflineSubmit(link) {
  // 1. 解析参数
  var rest = link.slice("offline-submit://".length);
  var qIdx = rest.indexOf("?");
  var dvdId = qIdx >= 0 ? rest.slice(0, qIdx) : rest;
  var cidStr = qIdx >= 0 ? rest.slice(qIdx + 1) : "";
  var candidateId = "";

  cidStr.split("&").forEach(function (pair) {
    var kv = pair.split("=");
    if (kv[0] === "cid") candidateId = decodeURIComponent(kv[1] || "");
  });

  if (!dvdId || !candidateId) {
    return buildReceipt(link, false, "提交失败", "未找到有效的番号和候选标识");
  }

  // 2. 防重复提交
  var submitted = storeGetJSON("offline-submitted:" + dvdId + ":" + candidateId, null);
  if (submitted && submitted.ok) {
    return buildReceipt(link, true, "此前已提交",
      "这条磁力已提交到 115。请返回原详情页并刷新，等待资源匹配。");
  }

  // 3. 从缓存读取磁力候选
  var cached = storeGetJSON("magnet-candidates:" + dvdId, null);
  var candidates = (cached && cached.items) || [];
  var candidate = null;
  for (var i = 0; i < candidates.length; i++) {
    var cid = candidates[i].infoHash || ("idx_" + i);
    if (cid === candidateId) { candidate = candidates[i]; break; }
  }

  if (!candidate) {
    return buildReceipt(link, false, "提交失败",
      "未找到对应的磁力候选，请返回原详情页刷新后重试。");
  }

  // 4. 获取 cookie
  var cookie = COOKIE_115 || "";
  if (!cookie) {
    return buildReceipt(link, false, "提交失败",
      "请先在全局设置或参数中填入 115 Cookie。");
  }

  // 5. 提交 115 离线任务
  var result;
  try {
    result = await offlineOneClick(cookie, candidate.maglink);
  } catch (e) {
    result = { state: false, error: String(e && e.message || e) };
  }

  // 6. 写入提交状态
  storeSetJSON("offline-submitted:" + dvdId + ":" + candidateId, {
    ok: result && result.state === true,
    time: Date.now(),
    title: candidate.title,
    sizeText: formatSizeLabel(candidate.sizeBytes) || candidate.size || ""
  });

  // 7. 返回回执页
  if (result && result.state === true) {
    return buildReceipt(link, true, "已提交到 115 离线下载",
      "任务已提交。请返回原详情页并刷新，等待 115 资源匹配。");
  }

  return buildReceipt(link, false, "提交失败",
    (result && result.error) || "115 返回失败，请稍后重试。");
}



// ==================== v1.2.0: handleOfflineSubmitFromResource (通过 loadResource 触发离线提交) ====================

/**
 * 当 loadResource 检测到 params.link 以 offline-submit:// 开头时调用。
 * 提交 115 离线任务，不返回任何 stream 资源。
 * 两层防重复：submitted ok 检查 + pending 5 分钟检查。
 */
async function handleOfflineSubmitFromResource(params, link) {
  // 1. 解析参数
  var rest = link.slice("offline-submit://".length);
  var qIdx = rest.indexOf("?");
  var dvdId = qIdx >= 0 ? rest.slice(0, qIdx) : rest;
  var cidStr = qIdx >= 0 ? rest.slice(qIdx + 1) : "";
  var candidateId = "";
  cidStr.split("&").forEach(function (pair) {
    var kv = pair.split("=");
    if (kv[0] === "cid") candidateId = decodeURIComponent(kv[1] || "");
  });

  if (!dvdId || !candidateId) {
    console.error("[pan115/stream] offline-submit parse failed:", link);
    return [];
  }
  console.log("[pan115/stream] offline parsed dvdId:", dvdId, "candidateId:", candidateId);

  // 2. 防重复：检查已提交状态
  var submittedKey = "offline-submitted:" + dvdId + ":" + candidateId;
  var submitted = storeGetJSON(submittedKey, null);
  if (submitted && submitted.ok) {
    console.log("[pan115/stream] offline already submitted, skip:", submittedKey);
    return [];
  }

  // 3. 防重复：检查 pending（5 分钟内不重复）
  var pendingKey = "offline-pending:" + dvdId + ":" + candidateId;
  var pending = storeGetJSON(pendingKey, null);
  if (pending && pending.time && Date.now() - pending.time < 5 * 60 * 1000) {
    console.log("[pan115/stream] offline pending, skip duplicate:", pendingKey);
    return [];
  }

  // 4. 写 pending
  storeSetJSON(pendingKey, { time: Date.now() });

  // 5. 从缓存读取磁力候选
  var cached = storeGetJSON("magnet-candidates:" + dvdId, null);
  var candidates = (cached && cached.items) || [];
  var candidate = null;
  for (var i = 0; i < candidates.length; i++) {
    var cid = candidates[i].infoHash || ("idx_" + i);
    if (cid === candidateId) { candidate = candidates[i]; break; }
  }

  if (!candidate) {
    console.error("[pan115/stream] offline candidate not found for:", candidateId);
    storeSetJSON(submittedKey, { ok: false, time: Date.now(), error: "candidate not found" });
    storeSetJSON(pendingKey, { time: 0, done: true });
    return [];
  }
  console.log("[pan115/stream] offline candidate found:", candidate.title);

  // 6. 获取 cookie
  var cookie = resolveCookie(params) || COOKIE_115 || "";
  syncCookie(cookie);
  console.log("[pan115/stream] offline cookie length:", cookie.length);
  if (!cookie) {
    console.error("[pan115/stream] offline submit failed: no cookie");
    storeSetJSON(submittedKey, { ok: false, time: Date.now(), error: "no cookie" });
    storeSetJSON(pendingKey, { time: 0, done: true });
    return [];
  }

  // 7. 提交 115 离线任务
  console.log("[pan115/stream] offline submit start");
  var result;
  try {
    result = await offlineOneClick(cookie, candidate.maglink);
    console.log("[pan115/stream] offline submit result:", JSON.stringify(result));
  } catch (e) {
    var errMsg = e && e.message || String(e);
    console.error("[pan115/stream] offline submit failed:", errMsg);
    result = { state: false, error: errMsg };
  }

  // 8. 写入提交状态
  storeSetJSON(submittedKey, {
    ok: result && result.state === true,
    time: Date.now(),
    title: candidate.title,
    sizeText: formatSizeLabel(candidate.sizeBytes) || candidate.size || "",
    message: result && result.error || ""
  });

  // 9. 清除 pending
  storeSetJSON(pendingKey, { time: 0, done: true });

  // 10. 返回空数组（不提供 stream 资源）
  return [];
}