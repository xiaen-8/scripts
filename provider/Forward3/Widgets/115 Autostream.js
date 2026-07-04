// ==================== 电影电视剧 115 自动匹配模块 v1.0 ====================
// 功能：
//   1. 作为 Stream Source，在电影/剧集详情页下方自动匹配 115 网盘文件
//   2. 从文件名提取影片信息（标题+年份 / 季+集），匹配 115 文件提供 HLS 播放
//   3. 文件名仅有季集（如 s01e01.mkv）时，回溯上级文件夹名获取剧名
//   4. TMDB 辅助补全规范标题，提高 115 搜索命中率
//   5. 多分辨率播放源：BD(4K) / UD(1080P) / HD(720P)
//
// 设计原则：
//   - 纯 stream source，不包含列表/详情页模块
//   - 不搜索磁力链，不提交离线下载
//   - 未匹配到文件时返回空数组，不阻塞宿主 App
//   - 所有 API 调用失败都静默降级
//
// 底层 API：
//   - 搜索文件：      GET webapi.115.com/files/search
//   - 浏览文件夹：    GET webapi.115.com/files?cid=xxx
//   - 文件夹信息：    GET webapi.115.com/files/get_info?cid=xxx
//   - Master m3u8:   GET https://115.com/api/video/m3u8/{pickcode}.m3u8
//   - TMDB 搜索：     Widget.tmdb.get("search/movie", ...)
//                     Widget.tmdb.get("search/tv", ...)
//
// 授权方式：手动输入 Cookie（115.com 域下的登录态 Cookie）

// ==================== 元数据定义 ====================
WidgetMetadata = {
  id: "movie_tv_115",
  title: "115-Auto",
  description: "在电影/剧集详情页自动匹配 115 网盘文件，提供 HLS 播放源",
  author: "EL|Eric",
  version: "1.1.0",
  requiredVersion: "0.0.1",
  site: "https://115.com",
  detailCacheDuration: 60,

  globalParams: [
    {
      name: "cookie",
      title: "115 Cookie",
      type: "input",
      value: "",
      placeholder: "填入 115.com 登录后的完整 Cookie"
    }
  ],

  modules: [
    {
      id: "loadResource",
      title: "电影电视剧",
      description: "匹配 115 网盘文件，提供 HLS 播放源",
      functionName: "loadResource",
      type: "stream",
      cacheDuration: 30,
      params: []
    }
  ]
};

console.log("[movie-tv] version: " + WidgetMetadata.version);

// ==================== 全局状态 ====================
var COOKIE_115 = "";

// ==================== 常量 ====================
var API_115 = "https://115.com";
var WEB_API_115 = "https://webapi.115.com";
var TIMEOUT = 15000;

var BASE_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
  "Referer": "https://115.com/",
  "Origin": "https://115.com"
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

// ==================== 噪声词表 ====================

var NOISE_WORDS = [
  // 分辨率
  "2160p", "1080p", "720p", "480p", "360p", "4k", "2k", "8k",
  // 编码
  "x264", "x265", "h264", "h265", "hevc", "avc", "av1", "vp9",
  // 来源
  "bluray", "blu-ray", "web-dl", "webdl", "webrip", "hdtv", "dvdrip",
  "bdrip", "brrip", "dvdscr", "hdrip", "tvrip", "h264", "h265",
  // 标签
  "proper", "repack", "internal", "readnfo", "nfox", "remux",
  "complete", "subbed", "multi", "dual", "hardcoded",
  // 色彩/HDR
  "hdr", "sdr", "dolby", "vision", "dv", "hlg", "10bit", "8bit",
  // 音频
  "aac", "ac3", "dts", "flac", "mp3", "truehd", "atmos", "5.1", "7.1",
  // 通用
  "www", "com", "hd", "fhd", "uhd"
];

var NOISE_REGEX = new RegExp("\\b(?:" + NOISE_WORDS.join("|") + ")\\b", "gi");

// ==================== 工具函数 ====================

function getText(value) {
  return String(value || "").trim();
}

function isVideoFile(filename) {
  var ext = String(filename || "").split(".").pop().toLowerCase();
  return VIDEO_EXTS.has(ext);
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

function guessQualityFromResolution(width, height) {
  var h = Number(height || 0);
  if (h >= 2160) return { quality: "BD", label: "4K", priority: 4 };
  if (h >= 1080) return { quality: "UD", label: "1080P", priority: 3 };
  if (h >= 720)  return { quality: "HD", label: "720P", priority: 2 };
  if (h >= 480)  return { quality: "SD", label: "480P", priority: 1 };
  if (h >= 360)  return { quality: "LD", label: "360P", priority: 0 };
  return { quality: "", label: h ? (h + "P") : "", priority: -1 };
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

// ==================== 中文数字转换 ====================

/**
 * 中文数字转整数。"一"→1, "十二"→12, "二十一"→21, "一百"→100
 */
function chineseNumToInt(str) {
  var s = String(str || "").trim();
  // 如果已经是阿拉伯数字，直接转
  if (/^\d+$/.test(s)) return parseInt(s, 10);

  var chnNumChar = {
    零: 0, 一: 1, 二: 2, 三: 3, 四: 4,
    五: 5, 六: 6, 七: 7, 八: 8, 九: 9
  };
  var chnUnit = {
    十: 10, 百: 100, 千: 1000
  };

  var result = 0;
  var current = 0;
  for (var ci = 0; ci < s.length; ci++) {
    var ch = s[ci];
    if (chnNumChar[ch] !== undefined) {
      current = chnNumChar[ch];
    } else if (chnUnit[ch]) {
      if (current === 0) current = 1; // 十一 = 11 (十前面没数字时默认1)
      result += current * chnUnit[ch];
      current = 0;
    }
  }
  result += current;
  return result || 0;
}

// ==================== 文件名解析 ====================

/**
 * 从文件名或标题中提取影片/剧集关键信息。
 * 返回 { type, title, year, season, episode } 或 null。
 *
 * 支持的格式：
 *   电影:  "The.Matrix.1999.1080p.mkv" → { type:"movie", title:"The Matrix", year:1999 }
 *   剧集:  "Game.of.Thrones.S01E01.1080p.mkv" → { type:"tv", title:"Game of Thrones", season:1, episode:1 }
 *   纯季集: "s01e01.mkv" → { type:"tv", season:1, episode:1 } (无 title)
 *   剧集变体: "Breaking.Bad.1x01.mkv"、"Stranger Things S01E01"
 *   年份电影: "Inception.2010.mkv" → { type:"movie", title:"Inception", year:2010 }
 */
function extractMovieTVKey(text) {
  var s = getText(text);
  if (!s) return null;

  // 去掉扩展名
  s = s.replace(/\.[a-zA-Z0-9]{2,4}$/, "");

  // 替换常见分隔符为空格，方便正则匹配
  var normalized = s.replace(/[_.]/g, " ").replace(/\s+/g, " ").trim();

  // -------------------- TV 剧集模式 --------------------

  // 模式1: S01E01 / S01E01E02 / S01E01-E02 (标准格式)
  var seasonEpMatch = normalized.match(
    /\bS(\d{1,2})\s*E(\d{1,3})(?:\s*[E-]\s*(\d{1,3}))?\b/i
  );
  if (seasonEpMatch) {
    var tvSeason = parseInt(seasonEpMatch[1], 10);
    var tvEpisode = parseInt(seasonEpMatch[2], 10);
    // 提取标题：去掉季集部分及尾部残余
    var titleFrom = normalized.replace(
      /\s*S\d{1,2}\s*E\d{1,3}(?:\s*[E-]\s*\d{1,3})?\s*/i, " "
    ).trim();
    // 去噪声词
    titleFrom = removeNoise(titleFrom).trim();
    // 去尾部残余分隔符和纯数字/年份
    titleFrom = titleFrom.replace(/[-–—]\s*$/, "").trim();
    titleFrom = titleFrom.replace(/\s+\d{4}\s*$/, "").trim();

    var result = { type: "tv", season: tvSeason, episode: tvEpisode };
    if (titleFrom && titleFrom.length > 0) {
      result.title = titleFrom;
    }
    console.log("[movie-tv/extractMovieTVKey] TV S01E01:", JSON.stringify(result));
    return result;
  }

  // 模式2: 1x01 / 01x01 (欧洲格式)
  var xFormatMatch = normalized.match(
    /\b(\d{1,2})\s*x\s*(\d{1,3})(?:\s*[E-]\s*(\d{1,3}))?\b/i
  );
  if (xFormatMatch) {
    var xSeason = parseInt(xFormatMatch[1], 10);
    var xEpisode = parseInt(xFormatMatch[2], 10);
    var titleFromX = normalized.replace(
      /\s*\d{1,2}\s*x\s*\d{1,3}(?:\s*[E-]\s*\d{1,3})?\s*/i, " "
    ).trim();
    titleFromX = removeNoise(titleFromX).trim();
    titleFromX = titleFromX.replace(/[-–—]\s*$/, "").trim();
    titleFromX = titleFromX.replace(/\s+\d{4}\s*$/, "").trim();

    var resultX = { type: "tv", season: xSeason, episode: xEpisode };
    if (titleFromX && titleFromX.length > 0) {
      resultX.title = titleFromX;
    }
    console.log("[movie-tv/extractMovieTVKey] TV 1x01:", JSON.stringify(resultX));
    return resultX;
  }

  // 模式3: 中文 "第N季第N集" / "第N季N集" / "第N集"（N 支持中文数字 一二三）
  var cnNum = "[\\d一二三四五六七八九十百]+";
  var cnSeasonEpRegex = new RegExp("第(" + cnNum + ")[季](?:第?)\\s*(" + cnNum + ")[集话]?");
  var cnSeasonEpMatch = normalized.match(cnSeasonEpRegex);
  if (cnSeasonEpMatch) {
    var cnSeason = chineseNumToInt(cnSeasonEpMatch[1]);
    var cnEpisode = chineseNumToInt(cnSeasonEpMatch[2]);
    if (cnSeason > 0 && cnEpisode > 0) {
      var titleFromCn = normalized.replace(/第\d*[一二三四五六七八九十百]*季第\d*[一二三四五六七八九十百]*[集话]?/, "").trim();
      titleFromCn = titleFromCn.replace(/第\d*[一二三四五六七八九十百]*[集话]/, "").trim();
      titleFromCn = removeNoise(titleFromCn).trim();
      titleFromCn = titleFromCn.replace(/[-–—]\s*$/, "").trim();
      var resultCn = { type: "tv", season: cnSeason, episode: cnEpisode };
      if (titleFromCn && titleFromCn.length > 0) {
        resultCn.title = titleFromCn;
      }
      console.log("[movie-tv/extractMovieTVKey] Chinese TV 第N季第N集:", JSON.stringify(resultCn));
      return resultCn;
    }
  }

  // 模式4: 纯 S01 / Season 1 (无集数)— 先不处理，等有了剧名再说
  // 模式5: 纯 s01e01 / 1x01 (无剧名)
  var bareSeasonEp = normalized.match(/^s(\d{1,2})\s*e(\d{1,3})$/i);
  if (bareSeasonEp) {
    console.log("[movie-tv/extractMovieTVKey] bare S01E01 (no title):", bareSeasonEp[1], bareSeasonEp[2]);
    return {
      type: "tv",
      season: parseInt(bareSeasonEp[1], 10),
      episode: parseInt(bareSeasonEp[2], 10)
    };
  }

  var bareX = normalized.match(/^(\d{1,2})\s*x\s*(\d{1,3})$/i);
  if (bareX) {
    console.log("[movie-tv/extractMovieTVKey] bare 1x01 (no title):", bareX[1], bareX[2]);
    return {
      type: "tv",
      season: parseInt(bareX[1], 10),
      episode: parseInt(bareX[2], 10)
    };
  }

  // -------------------- 电影模式 --------------------

  // 去噪声词后，找 "标题.年份" 模式
  var cleaned = removeNoise(normalized).replace(/\s+/g, " ").trim();

  // 模式5: "Title YYYY" 结尾
  var movieYearMatch = cleaned.match(/^(.+?)\s+(\d{4})\s*$/);
  if (movieYearMatch) {
    var movieTitle = movieYearMatch[1].trim();
    var year = parseInt(movieYearMatch[2], 10);
    // 年份在合理范围内
    if (year >= 1900 && year <= 2100 && movieTitle.length >= 2) {
      console.log("[movie-tv/extractMovieTVKey] movie (Title Year):", movieTitle, year);
      return { type: "movie", title: movieTitle, year: year };
    }
  }

  // 如果没有年份，但去掉噪声词后还有有意义的文字，当作片名候选
  if (cleaned.length >= 3) {
    console.log("[movie-tv/extractMovieTVKey] raw title candidate:", cleaned);
    return { type: "movie", title: cleaned };
  }

  console.log("[movie-tv/extractMovieTVKey] no match for:", text);
  return null;
}

/**
 * 从字符串中移除常见的噪声词（分辨率、编码、来源等）
 */
function removeNoise(text) {
  var s = getText(text);
  if (!s) return "";
  // 先去掉域名前缀: hhd800.com@ 等
  s = s.replace(/^[A-Za-z0-9]+(?:\.[A-Za-z0-9]+)+@/, "");
  // 去掉噪声词
  s = s.replace(NOISE_REGEX, "");
  // 去尾部残余分隔符
  s = s.replace(/[-–—]\s*$/, "").trim();
  s = s.replace(/^[-–—]\s*/, "").trim();
  // 合并空格
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

/**
 * 去掉标题中的括号内容（年份、备注等）和季集标记。
 * 用于匹配时获得纯片名。
 * "Game of Thrones (2024) [WEB-DL]" → "Game of Thrones"
 * "琅琊榜（2024）第1季" → "琅琊榜"
 */
function stripMeta(title) {
  var t = String(title || "");
  // 去掉中英文括号及其内容
  t = t.replace(/[\(（\[][^)）\]\]]*[\)）\]\]]/g, "");
  // 去掉季集标记: 第1季, 第01集, S01, Season 1 等
  t = t.replace(/第[\d一二三四五六七八九十百]+[季集话期]/g, "");
  t = t.replace(/\b[Ss]eason\s*\d+/g, "");
  t = t.replace(/\b[Ss]\d{1,2}\b/g, "");
  // 去掉尾部残余
  t = t.replace(/\s+[-–—]\s*$/, "").trim();
  t = t.replace(/^[-–—]\s+/, "").trim();
  return t;
}

/**
 * 归一化为匹配用字符串：去重音符号 + 去全部分隔符 + 转小写。
 * "Game of Thrones" → "gameofthrones"
 * "Amélie" → "amelie"
 * "Joséé" → "josee"
 */
function normalizeForMatch(title) {
  return String(title || "")
    .toLowerCase()
    // 去重音符号（é→e, ü→u 等）
    .replace(/[àáâãäåāăą]/g, "a")
    .replace(/[èéêëēĕėę]/g, "e")
    .replace(/[ìíîïĩīĭį]/g, "i")
    .replace(/[òóôõöōŏő]/g, "o")
    .replace(/[ùúûüũūŭů]/g, "u")
    .replace(/[ñńņňŉŋ]/g, "n")
    .replace(/[çĉčć]/g, "c")
    .replace(/[ğ]/g, "g")
    .replace(/[ř]/g, "r")
    .replace(/[šśşš]/g, "s")
    .replace(/[žźż]/g, "z")
    .replace(/[ýÿ]/g, "y")
    .replace(/[ðþ]/g, "th")
    .replace(/[æ]/g, "ae")
    .replace(/[œ]/g, "oe")
    // 去全部分隔符
    .replace(/[\s・\-\.!?\/_,:;~@#$%^&*+=<>'"]/g, "");
}

/**
 * 标题相似度评分（借鉴 PPnix 三级匹配）。
 *   exact (100) — 完全一致
 *   contains (75) — 一方包含另一方
 *   char-coverage (0-40) — 字符重叠比例 * 40
 * @param {string} normSearch - 搜索目标（已归一化）
 * @param {string} normItem - 候选标题（已归一化）
 * @returns {number} 0-100 的匹配分
 */
function matchScore(normSearch, normItem) {
  if (!normSearch || !normItem) return 0;
  if (normItem === normSearch) return 100;
  if (normItem.indexOf(normSearch) !== -1 || normSearch.indexOf(normItem) !== -1) return 75;
  var count = 0;
  for (var mi = 0; mi < normSearch.length; mi++) {
    if (normItem.indexOf(normSearch[mi]) !== -1) count++;
  }
  return Math.round((count / normSearch.length) * 40);
}

/**
 * 规范化影片标题：将分隔符统一为空格，去噪声，去元数据。
 */
function normalizeMovieTitle(raw) {
  var s = getText(raw);
  if (!s) return "";
  // 先去扩展名（在分隔符替换前做，保留 . 作为分隔标记）
  s = s.replace(/\.[a-zA-Z0-9]{2,4}$/, "");
  // 去域名前缀: hhd800.com@, hhb800.com@ 等
  s = s.replace(/^[A-Za-z0-9]+(?:\.[A-Za-z0-9]+)+@/, "");
  // 分隔符统一
  s = s.replace(/[_.]/g, " ").replace(/\s+/g, " ").trim();
  // 去噪声
  s = removeNoise(s);
  // 去括号元数据
  s = stripMeta(s);
  return s;
}

// ==================== TMDB 辅助 ====================

/**
 * 通过 TMDB 搜索获取规范化的标题和元数据。
 * @param {string} keyword - 搜索关键词（取自 params.title 或文件名解析结果）
 * @param {string} mediaType - "movie" 或 "tv"
 * @returns {object|null} { title, originalTitle, year, seasonCount } 或 null
 */
async function lookupTMDB(keyword, mediaType) {
  var q = getText(keyword);
  if (!q || q.length < 2) return null;

  try {
    var apiPath = mediaType === "tv" ? "search/tv" : "search/movie";
    var res = await Widget.tmdb.get(apiPath, {
      params: { query: q, language: "zh-CN" }
    });

    // Widget.tmdb.get 直接返回 TMDB body（不是 .data）
    var results = res && res.results;
    if (!results || results.length === 0) return null;

    var first = results[0];
    var result = {
      title: first.title || first.name || first.original_title || first.original_name || "",
      originalTitle: first.original_title || first.original_name || "",
      year: "",
      overview: first.overview || ""
    };

    if (mediaType === "tv") {
      result.title = first.name || first.original_name || "";
      result.originalTitle = first.original_name || "";
      result.seasonCount = first.number_of_seasons || 0;
      // TV 取 first_air_date 的年份
      if (first.first_air_date) {
        result.year = String(first.first_air_date).slice(0, 4);
      }
    } else {
      result.title = first.title || first.original_title || "";
      result.originalTitle = first.original_title || "";
      // 电影取 release_date 的年份
      if (first.release_date) {
        result.year = String(first.release_date).slice(0, 4);
      }
    }

    console.log("[movie-tv/lookupTMDB] mediaType:", mediaType,
                "keyword:", keyword, "→ title:", result.title,
                "originalTitle:", result.originalTitle, "year:", result.year);
    return result;
  } catch (e) {
    console.warn("[movie-tv/lookupTMDB] failed:", e && e.message || e);
    return null;
  }
}

// ==================== 115 文件搜索（含 CID） ====================

/**
 * 搜索 115 文件，返回带 cid（上级文件夹 ID）的结果。
 * 比原始 searchFiles 多返回 cid 字段。
 */
async function searchFilesWithPath(cookie, keyword) {
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
      cid: item.cid || item.fid || item.pid || ""   // ← 关键：上级文件夹 ID
    };
  }).filter(function (item) { return item.pickcode && item.filename; });
}

// ==================== 文件夹信息查询 ====================

/**
 * 获取文件夹的名称。利用 files/get_info 接口或 listFolder 降级。
 * 先尝试 get_info 接口（直接获取文件夹名），失败则用 listFolder 查找父文件夹中该 cid 的条目。
 */
async function getFolderName(cookie, cid) {
  if (!cid) return "";

  // 方式 1: 尝试 get_info 接口
  try {
    var infoUrl = WEB_API_115 + "/files/get_info?cid=" + encodeURIComponent(cid);
    var raw = await httpGet(infoUrl, { headers: cookieHeader(cookie) });
    var info = typeof raw === "string" ? JSON.parse(raw) : raw;
    // 可能有多种返回结构
    var folderName = (info && (info.name || info.folder_name || info.path || info.folderName))
      || (info.data && (info.data.name || info.data.folder_name))
      || "";
    if (folderName) {
      console.log("[movie-tv/getFolderName] via get_info, cid:", cid, "name:", folderName);
      return String(folderName).trim();
    }
  } catch (e) {
    console.warn("[movie-tv/getFolderName] get_info failed for cid:", cid, e && e.message || e);
  }

  // 方式 2: 从父文件夹中查找本文件夹的条目
  // listFolder 返回的文件列表含 isdir=true 的文件夹条目，其 filename 就是文件夹名
  // 但我们需要知道父 cid — 我们不知道。降级返回空。
  console.warn("[movie-tv/getFolderName] unable to resolve cid:", cid);
  return "";
}

/**
 * 根据 cid 向上回溯，获取完整的文件夹路径（从根到当前文件夹）。
 * 例如 cid = "S01的cid" → 返回 ["游戏文件夹", "Season 1"]
 * 不断向上查询父文件夹的父文件夹，直到根（cid = "0"）。
 *
 * 注意：files/get_info 可能返回上一级 cid（parent_id），以此递归。
 */
async function getFolderHierarchy(cookie, cid) {
  var pathParts = [];
  var currentCid = cid;
  var maxDepth = 10;
  var visited = {};

  while (currentCid && currentCid !== "0" && maxDepth > 0) {
    if (visited[currentCid]) break; // 防循环
    visited[currentCid] = true;

    maxDepth--;
    try {
      var infoUrl = WEB_API_115 + "/files/get_info?cid=" + encodeURIComponent(currentCid);
      var raw = await httpGet(infoUrl, { headers: cookieHeader(cookie) });
      var info = typeof raw === "string" ? JSON.parse(raw) : raw;

      var name = (info && (info.name || info.folder_name))
        || (info.data && (info.data.name || info.data.folder_name))
        || "";
      var parentId = (info && info.parent_id)
        || (info.data && info.data.parent_id)
        || "";

      if (name) {
        pathParts.unshift(String(name).trim());
      }

      // 向上递归
      if (parentId && parentId !== "0" && parentId !== currentCid) {
        currentCid = parentId;
      } else {
        break;
      }
    } catch (e) {
      console.warn("[movie-tv/getFolderHierarchy] failed for cid:", currentCid, e && e.message || e);
      break;
    }
  }

  console.log("[movie-tv/getFolderHierarchy] cid:", cid, "→ path:", pathParts.join(" / "));
  return pathParts;
}

// ==================== 剧名解析（含文件夹回溯） ====================

/**
 * 核心匹配逻辑：从 115 文件的文件名 + 上级文件夹路径中解析剧名/片名。
 *
 * 步骤：
 *   1. 优先从文件名提取（含剧名的完整文件名）
 *   2. 文件名只有 s01e01（无剧名）→ 回溯文件夹名
 *   3. 文件夹名可能只是 S01/Season 1 → 再往上一级
 *   4. 最终得到完整信息
 *
 * @param {string} cookie - 115 Cookie
 * @param {object} file - { filename, cid, pickcode, size }
 * @param {object} contextFromParams - 来自宿主 params 的上下文
 * @returns {object|null} { type, title, year, season, episode, source }
 */
async function resolveShowTitle(cookie, file, contextFromParams) {
  contextFromParams = contextFromParams || {};
  var filename = file.filename || "";

  // ---- 第 1 步：从文件名提取 ----
  var fromFile = extractMovieTVKey(filename);

  // 如果文件名已含完整剧名，直接返回
  if (fromFile && fromFile.type === "tv" && fromFile.title) {
    console.log("[movie-tv/resolveShowTitle] title from filename:", fromFile.title);
    return fromFile;
  }
  if (fromFile && fromFile.type === "movie" && fromFile.title) {
    console.log("[movie-tv/resolveShowTitle] movie from filename:", fromFile.title);
    return fromFile;
  }

  // ---- 第 2 步：文件名只有季集（无剧名），回溯文件夹 ----
  var folderTitle = "";
  if (fromFile && fromFile.type === "tv" && !fromFile.title) {
    // 需要从上级文件夹获取剧名
    if (file.cid) {
      var hierarchy = await getFolderHierarchy(cookie, file.cid);
      // hierarchy = ["剧名顶级文件夹", "Season 1"] 或 ["剧名"]
      // 过滤掉 "Season X" / "S01" 之类的季文件夹
      for (var hi = 0; hi < hierarchy.length; hi++) {
        var part = hierarchy[hi];
        // 如果是纯季文件夹名，跳过
        if (/^(?:Season|Saison|Stagione|Temporada)?\s*\d{1,2}$/i.test(part)) continue;
        if (/^S\d{1,2}$/i.test(part)) continue;
        folderTitle = part;
        break;
      }
      // 如果全部是季文件夹，拿最后一个
      if (!folderTitle && hierarchy.length > 0) {
        folderTitle = hierarchy[hierarchy.length - 1];
      }
    }

    if (folderTitle) {
      // 从文件夹名提取规范化标题
      var folderClean = normalizeMovieTitle(folderTitle);
      if (folderClean.length >= 2) {
        console.log("[movie-tv/resolveShowTitle] title from parent folder:", folderClean);
        return {
          type: "tv",
          title: folderClean,
          season: fromFile.season,
          episode: fromFile.episode,
          source: "folder"
        };
      }
    }
  }

  // ---- 第 3 步：仍然没找到剧名，用宿主 params 提供的上下文 ----
  // 检查 params 中的 title / seriesName / tmdbInfo
  var contextTitle = contextFromParams.title || contextFromParams.seriesName || "";
  if (contextTitle && filename) {
    var fileKey = extractMovieTVKey(filename);
    if (fileKey && fileKey.type === "tv") {
      // 用 params 的剧名 + 文件名的季集
      console.log("[movie-tv/resolveShowTitle] title from params context:", contextTitle);
      return {
        type: "tv",
        title: normalizeMovieTitle(contextTitle),
        season: fileKey.season,
        episode: fileKey.episode,
        source: "params"
      };
    }
    if (fileKey && fileKey.type === "movie") {
      return {
        type: "movie",
        title: normalizeMovieTitle(contextTitle),
        source: "params"
      };
    }
  }

  // ---- 第 4 步：尝试用文件名去噪后作为电影名 ----
  var cleanedFilename = normalizeMovieTitle(filename);
  if (cleanedFilename.length >= 3) {
    console.log("[movie-tv/resolveShowTitle] fallback to cleaned filename:", cleanedFilename);
    return { type: "movie", title: cleanedFilename };
  }

  console.log("[movie-tv/resolveShowTitle] unable to resolve for:", filename);
  return null;
}

// ==================== 文件评分 ====================

var BAD_FILENAME_WORDS = ["sample", "trailer", "preview", "behind", "bts", "extra", "featurette"];

// 合辑/合集关键词 — 匹配到就扣分（用户想要单部影片）
var COLLECTION_WORDS = ["collection", "complete", "box.set", "boxset", "全集", "合集", "合辑", "套装", "pack"];

// 画质格式加分 — BluRay / WEB-DL 优先于 HDTV / CAM
var FORMAT_QUALITY = {
  bluray: 10, "blu-ray": 10, "blu.ray": 10,
  "web-dl": 8, webdl: 8, "web.dl": 8, webrip: 5,
  remux: 8,
  hdtv: 0, tvrip: 0, dvdrip: -5, dvdscr: -10, cam: -20, hdcam: -20
};

/**
 * 对候选文件评分，选出最匹配的播放源。
 * 加分项：标题匹配、目标季集命中、年份吻合、画质格式、大小适中
 * 减分项：sample/trailer/合集、季集不匹配、文件过小或过大、标题弱匹配
 *
 * 设计原则：标题匹配度决定其他加分的"天花板"——弱匹配的文件无法靠体积取胜。
 *
 * @param {object} file - 候选文件 { filename, size }
 * @param {object} showInfo - 解析出的影片信息 { type, title, season, episode }
 * @param {number|null} targetSeason - 目标季（宿主传入，null 表示不限制）
 * @param {number|null} targetEpisode - 目标集（宿主传入，null 表示不限制）
 */
function scoreFile(file, showInfo, targetSeason, targetEpisode) {
  var fn = String(file.filename || "").toLowerCase();
  var score = 0;
  var titleMatchQuality = 0;  // 0-100，用于控制其他加成上限

  // =========================
  // 1. 非正片关键词扣分（强惩罚）
  // =========================
  for (var wi = 0; wi < BAD_FILENAME_WORDS.length; wi++) {
    if (fn.indexOf(BAD_FILENAME_WORDS[wi]) !== -1) score -= 80;
  }

  // =========================
  // 2. 合辑/合集扣分
  // =========================
  for (var ci = 0; ci < COLLECTION_WORDS.length; ci++) {
    if (fn.indexOf(COLLECTION_WORDS[ci]) !== -1) score -= 40;
  }

  // =========================
  // 3. 目标季集比对
  // =========================
  if (targetSeason != null && targetEpisode != null) {
    var fileSeason = showInfo ? showInfo.season : undefined;
    var fileEpisode = showInfo ? showInfo.episode : undefined;
    if (fileSeason !== undefined && fileEpisode !== undefined) {
      if (fileSeason === targetSeason && fileEpisode === targetEpisode) {
        score += 50;
        console.log("[movie-tv/score] exact episode match: S" + targetSeason + "E" + targetEpisode);
      } else {
        score -= 30;
      }
    }
  } else if (targetSeason != null && targetEpisode == null) {
    if (showInfo && showInfo.season !== undefined && showInfo.season !== targetSeason) {
      score -= 20;
    }
  }

  // =========================
  // 4. 标题匹配度（核心评分项）
  // =========================
  if (showInfo && showInfo.title) {
    var fnClean = stripMeta(String(file.filename || ""));
    fnClean = normalizeForMatch(fnClean);
    var titleNorm = normalizeForMatch(showInfo.title);
    var simScore = matchScore(titleNorm, fnClean);
    titleMatchQuality = simScore;

    if (simScore >= 75) {
      // 包含/精确匹配：正常加分
      score += Math.round(simScore * 0.4) + 10;
    } else if (simScore >= 30) {
      // 部分匹配：给分但要打折
      score += Math.round(simScore * 0.3);
    } else {
      // 弱匹配（< 30）：惩罚，防止大体积无关文件靠体积取胜
      score -= 25;
    }
  }

  // =========================
  // 5. 年份加分（仅当标题匹配度够高时给满分）
  // =========================
  if (showInfo && showInfo.year && titleMatchQuality >= 30) {
    var yearStr = String(showInfo.year);
    if (fn.indexOf(yearStr) !== -1) score += 10;
  }

  // =========================
  // 6. 季集在文件名中匹配加分
  // =========================
  if (showInfo && showInfo.season !== undefined && showInfo.episode !== undefined) {
    // 仅当标题匹配度够高时才给季集加分（防止跨剧集误匹配）
    if (titleMatchQuality >= 30) {
      var epPattern = "s" + String(showInfo.season).padStart(2, "0") + "e" + String(showInfo.episode).padStart(2, "0");
      if (fn.indexOf(epPattern) !== -1) score += 20;
      var xPattern = showInfo.season + "x" + String(showInfo.episode).padStart(2, "0");
      if (fn.indexOf(xPattern) !== -1) score += 20;
    }
  }

  // =========================
  // 7. 画质格式加分
  // =========================
  for (var fmt in FORMAT_QUALITY) {
    if (fn.indexOf(fmt) !== -1) {
      score += FORMAT_QUALITY[fmt];
      break;
    }
  }

  // =========================
  // 8. 大小加分（受标题匹配度约束）
  // =========================
  // 标题弱匹配时，大小加分打折 — 防止大体积无关文件碾压
  var sizeMultiplier = titleMatchQuality >= 50 ? 1.0
    : titleMatchQuality >= 25 ? 0.5
    : 0.25;

  var size = Number(file.size || 0);
  if (size >= 4 * 1024 * 1024 * 1024) score += Math.round(40 * sizeMultiplier);
  else if (size >= 2 * 1024 * 1024 * 1024) score += Math.round(30 * sizeMultiplier);
  else if (size >= 1024 * 1024 * 1024) score += Math.round(20 * sizeMultiplier);
  else if (size >= 500 * 1024 * 1024) score += Math.round(10 * sizeMultiplier);
  else if (size > 0 && size < 50 * 1024 * 1024) score -= 20;

  // =========================
  // 9. 分辨率加分
  // =========================
  if (fn.indexOf("2160") !== -1 || fn.indexOf("4k") !== -1) score += 15;
  else if (fn.indexOf("1080") !== -1) score += 10;
  else if (fn.indexOf("720") !== -1) score += 5;

  // =========================
  // 10. 额外标记词加分
  // =========================
  if (fn.indexOf("remux") !== -1) score += 5;  // 无损保留
  if (fn.indexOf("proper") !== -1) score += 3;   // 修正版

  return score;
}

// ==================== HLS 流解析 ====================

/**
 * 获取 115 文件 HLS 播放列表
 */
async function getMasterM3u8Text(cookie, pickcode) {
  var url = API_115 + "/api/video/m3u8/" + encodeURIComponent(pickcode) + ".m3u8";
  var data = await httpGet(url, { headers: cookieHeader(cookie) });
  return String(data || "");
}

/**
 * 解析 m3u8 master playlist，返回各分辨率子流
 */
function parseStreams(masterText) {
  if (!masterText || masterText.indexOf("#EXTM3U") !== 0) return [];

  var lines = masterText.split("\n");
  var streams = [];

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line.indexOf("#EXT-X-STREAM-INF") === -1) continue;

    var url = "";
    if (i + 1 < lines.length) {
      url = lines[i + 1].trim();
    }

    // 从 #EXT-X-STREAM-INF 提取分辨率信息
    // #EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=5000000,RESOLUTION=1920x1080,NAME="BD"
    var width = 0; var height = 0; var name = "";
    var resMatch = line.match(/RESOLUTION\s*=\s*(\d+)x(\d+)/i);
    if (resMatch) {
      width = parseInt(resMatch[1], 10);
      height = parseInt(resMatch[2], 10);
    }
    var nameMatch = line.match(/NAME\s*=\s*"([^"]+)"/i);
    if (nameMatch) {
      name = nameMatch[1];
    }

    var quality = guessQualityFromResolution(width, height);

    // NAME 有值优先用 NAME，否则用分辨率推断
    var label = name || quality.label || (height ? height + "P" : "");

    streams.push({
      url: url,
      quality: quality.quality || "",
      label: label,
      width: width,
      height: height,
      priority: quality.priority
    });
  }

  // 按清晰度降序排列（4K 优先）
  streams.sort(function (a, b) {
    return (b.priority || 0) - (a.priority || 0);
  });

  console.log("[movie-tv/parseStreams] count:", streams.length);
  for (var si = 0; si < streams.length; si++) {
    var s = streams[si];
    console.log("[movie-tv/parseStreams]  ", s.label, "→", (s.url || "").slice(0, 60));
  }

  return streams;
}

/**
 * 构建 stream source 数组（Forward Widget 标准格式）
 */
async function buildStreamSources(cookie, file) {
  if (!file || !file.pickcode) return [];

  try {
    var masterText = await getMasterM3u8Text(cookie, file.pickcode);
    var streams = parseStreams(masterText);
    if (!streams.length) return [];

    var filename = file.filename || "115-video";

    return streams.map(function (s) {
      var sizeLabel = "";
      if (file.size) {
        sizeLabel = " [" + formatSize(file.size) + "]";
      }
      return {
        name: filename,
        description: "115" + sizeLabel,
        url: s.url,
        customHeaders: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
          "Referer": "https://115.com/"
        }
      };
    });
  } catch (e) {
    console.warn("[movie-tv/buildStreamSources] failed for:", file.filename, e && e.message || e);
    return [];
  }
}

// ==================== loadResource（主入口） ====================

/**
 * Stream Source 主入口。
 * 被 Forward App 在播放/详情页触发。
 *
 * @param {object} params - 来自宿主 App 的参数
 *   - params.title - 标题（电影名/剧名）
 *   - params.seriesName - 剧集名（TV 专用）
 *   - params.season - 季数（TV 专用）
 *   - params.episode - 集数（TV 专用）
 *   - params.link - 详情页链接
 *   - params.tmdbInfo - TMDB 元数据对象（如有）
 *   - params.keyword - 搜索关键词（兜底）
 * @returns {Array} stream sources 数组，或空数组
 */
async function loadResource(params) {
  console.log("[movie-tv/stream] === loadResource entry ===");

  try {
    // ============ 1. 提取 Cookie ============
    var cookie = COOKIE_115 || (params && params.cookie) || "";
    if (!cookie) {
      console.log("[movie-tv/stream] no cookie, abort");
      return [];
    }
    COOKIE_115 = cookie;

    // ============ 2. 从 params 提取搜索关键词 ============
    // 优先级: tmdbInfo > link > seriesName/title > keyword > 其他
    var searchKeyword = "";
    var contextForMatch = {};

    // tmdbInfo 最优先（已规范化）
    if (params.tmdbInfo) {
      searchKeyword = params.tmdbInfo.title || params.tmdbInfo.name
        || params.tmdbInfo.originalTitle || params.tmdbInfo.originalName || "";
      contextForMatch.title = searchKeyword;
      contextForMatch.tmdbInfo = params.tmdbInfo;
      console.log("[movie-tv/stream] keyword from tmdbInfo:", searchKeyword);
    }

    if (!searchKeyword) {
      // 从 link 中提取（可能包含番号类标识）
      var link = getText(params.link);
      if (link) {
        var fromLink = extractMovieTVKey(link);
        if (fromLink && fromLink.title) {
          searchKeyword = fromLink.title;
          contextForMatch.title = searchKeyword;
          if (fromLink.type) contextForMatch.type = fromLink.type;
          console.log("[movie-tv/stream] keyword from link:", searchKeyword);
        }
      }
    }

    if (!searchKeyword) {
      searchKeyword = params.seriesName || params.title || params.name || "";
      contextForMatch.title = searchKeyword;
      if (params.seriesName) contextForMatch.seriesName = params.seriesName;
      console.log("[movie-tv/stream] keyword from title/seriesName:", searchKeyword);
    }

    if (!searchKeyword) {
      searchKeyword = params.keyword || "";
      console.log("[movie-tv/stream] keyword fallback:", searchKeyword);
    }

    // 提取目标季集（宿主 App 传入，如详情页点击某集时）
    var targetSeason = params.season !== undefined && params.season !== null && params.season !== ""
      ? parseInt(params.season, 10) : null;
    var targetEpisode = params.episode !== undefined && params.episode !== null && params.episode !== ""
      ? parseInt(params.episode, 10) : null;
    console.log("[movie-tv/stream] target season:", targetSeason, "episode:", targetEpisode);

    // ============ 3. TMDB 补充规范化标题 ============
    // 构建多语言搜索词列表，解决中文名(播放器) ↔ 英文名(115文件) 不匹配问题
    var effectiveMediaType = params.tmdbInfo
      ? (params.tmdbInfo.mediaType || "movie")
      : (contextForMatch.type || "movie");
    var tmdbResult = null;

    if (!params.tmdbInfo && searchKeyword.length >= 2) {
      tmdbResult = await lookupTMDB(searchKeyword, effectiveMediaType);
      // 如果指定类型没搜到，试试另一种（电影⇄剧集互查）
      if (!tmdbResult) {
        var altType = effectiveMediaType === "tv" ? "movie" : "tv";
        tmdbResult = await lookupTMDB(searchKeyword, altType);
        if (tmdbResult) effectiveMediaType = altType;
      }
    }

    // 构建搜索关键词列表，按优先级排列
    var searchKeywords = [];
    // 1) TMDB 中文章名（from lookupTMDB 或 params.tmdbInfo）
    var tmdbTitle = "";
    var tmdbOriginalTitle = "";
    if (params.tmdbInfo) {
      tmdbTitle = params.tmdbInfo.title || params.tmdbInfo.name || "";
      tmdbOriginalTitle = params.tmdbInfo.originalTitle || params.tmdbInfo.originalName || "";
    } else if (tmdbResult) {
      tmdbTitle = tmdbResult.title || "";
      tmdbOriginalTitle = tmdbResult.originalTitle || "";
    }
    if (tmdbTitle) searchKeywords.push(tmdbTitle);
    if (tmdbOriginalTitle && tmdbOriginalTitle !== tmdbTitle) searchKeywords.push(tmdbOriginalTitle);
    // 3) 原始搜索词（播放器传来的原文）
    if (searchKeyword && searchKeywords.indexOf(searchKeyword) === -1) searchKeywords.push(searchKeyword);

    // 4) 带年份的搜索词（更精准）
    var tmdbYear = "";
    if (params.tmdbInfo) {
      tmdbYear = params.tmdbInfo.year || "";
    } else if (tmdbResult) {
      tmdbYear = tmdbResult.year || "";
    }
    if (tmdbYear) {
      // 在已有词后面追加年份
      var withYear = [];
      for (var ski = 0; ski < searchKeywords.length; ski++) {
        var kwYear = searchKeywords[ski] + " " + tmdbYear;
        if (searchKeywords.indexOf(kwYear) === -1 && withYear.indexOf(kwYear) === -1) {
          withYear.push(kwYear);
        }
      }
      searchKeywords = searchKeywords.concat(withYear);
    }

    console.log("[movie-tv/stream] search keywords:", JSON.stringify(searchKeywords));

    if (searchKeywords.length === 0) {
      console.log("[movie-tv/stream] no valid search keyword, abort");
      return [];
    }

    // ============ 4. 搜索 115 文件（多关键词轮询） ============
    // 用不同的关键词搜索，取第一个有结果的
    var files = [];
    var usedKeyword = "";
    for (var ski = 0; ski < searchKeywords.length; ski++) {
      var kw = searchKeywords[ski];
      if (!kw || kw.length < 1) continue;
      console.log("[movie-tv/stream] searching 115 for:", kw);
      try {
        var result = await searchFilesWithPath(cookie, kw);
        if (result && result.length > 0) {
          files = result;
          usedKeyword = kw;
          console.log("[movie-tv/stream] keyword '" + kw + "' found", result.length, "files");
          break;
        } else {
          console.log("[movie-tv/stream] keyword '" + kw + "' no results");
        }
      } catch (e) {
        console.warn("[movie-tv/stream] searchFilesWithPath failed for '" + kw + "':", e && e.message || e);
      }
    }

    if (!files || files.length === 0) {
      console.log("[movie-tv/stream] no files found for any keyword");
      return [];
    }

    // ============ 5. 对每个候选文件解析剧名/片名 + 评分 ============
    var scored = [];

    for (var fi = 0; fi < files.length; fi++) {
      var file = files[fi];
      if (!isVideoFile(file.filename)) continue;

      // 解析该文件的剧名/片名（含文件夹回溯）
      var showInfo = await resolveShowTitle(cookie, file, contextForMatch);
      if (!showInfo || !showInfo.title) {
        // 实在解析不出，用文件名去噪后作为兜底
        var cleaned = normalizeMovieTitle(file.filename);
        if (cleaned.length >= 2) {
          showInfo = { type: "movie", title: cleaned };
        } else {
          continue;
        }
      }

      var score = scoreFile(file, showInfo, targetSeason, targetEpisode);
      scored.push({
        file: file,
        showInfo: showInfo,
        score: score
      });
    }

    // 按评分降序排列
    scored.sort(function (a, b) { return b.score - a.score; });

    console.log("[movie-tv/stream] scored candidates:");
    for (var si = 0; si < Math.min(scored.length, 5); si++) {
      console.log("  ", scored[si].showInfo.title,
                  "|", scored[si].file.filename,
                  "| score:", scored[si].score,
                  "| size:", formatSize(scored[si].file.size));
    }

    // ============ 6. 取最高分（>= 0 为正片） ============
    var best = null;
    for (var bi = 0; bi < scored.length; bi++) {
      if (scored[bi].score >= 0) {
        best = scored[bi];
        break;
      }
    }

    if (!best) {
      // 全部负分（只有 sample/trailer），取最高分那个
      if (scored.length > 0) {
        best = scored[0];
        console.log("[movie-tv/stream] all candidates have negative scores, picking best of worst");
      } else {
        console.log("[movie-tv/stream] no valid candidates");
        return [];
      }
    }

    console.log("[movie-tv/stream] best match:", best.file.filename,
                "(score:", best.score, ")");

    // ============ 7. 构建 stream sources ============
    var sources = await buildStreamSources(cookie, best.file);
    console.log("[movie-tv/stream] returning", sources.length, "stream source(s)");
    return sources;

  } catch (e) {
    console.error("[movie-tv/stream] loadResource error:", e && e.message ? e.message : e);
    return [];
  }
}
