WidgetMetadata = {
  id: "subhd.subtitle",
  title: "SubHD 字幕",
  version: "1.2.1",
  requiredVersion: "0.0.1",
  description: "通过 SubHD搜索并下载字幕 - 自动识别 SVG 验证码、支持 ZIP 季包解压匹配",
  author: "EL",
  site: "https://subhd.one",
  globalParams: [
    {
      name: "rootUrl",
      title: "SubHD 地址",
      type: "input",
      value: "https://subhd.one",
      placeholders: [
        { title: "subhd.one / subhd.me / subhd.tv", value: "https://subhd.one" },
      ],
    },
  ],
  modules: [
    {
      id: "loadSubtitle",
      title: "加载字幕",
      functionName: "loadSubtitle",
      type: "subtitle",
      cacheDuration: 180,
      params: [],
    },
  ],
};

// ============================================================
// 常量
// ============================================================
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36";

// ============================================================
// SVG 验证码求解器 — 移植自 MoviePilot-Plugins SubHDSvgCaptchaSolver
// 通过 SVG path 的字符串长度映射到字符，碰撞时用几何特征分辨
// ============================================================
const CAPTCHA_LENGTH_MAP = {
  986: "I", 998: "1", 1068: "I", 1081: "1", 1082: "v", 1130: "Y", 1134: "Y",
  1172: "v", 1224: "Y", 1274: "L", 1298: "V", 1311: "V", 1360: "i", 1380: "L",
  1406: "V", 1473: "i", 1478: "T", 1491: "r", 1598: "N", 1601: "T", 1604: "X",
  1610: "J", 1613: "x", 1614: "N", 1615: "N", 1616: "N", 1617: "N", 1618: "N",
  1634: "k", 1637: "k", 1694: "t", 1706: "K", 1709: "K", 1731: "N", 1744: "J",
  1754: "F", 1770: "k", 1835: "t", 1838: "u", 1840: "A", 1844: "A", 1848: "K",
  1850: "Z", 1853: "Z", 1886: "h", 1900: "F", 1922: "H", 1928: "H", 1960: "P",
  1991: "u", 1993: "A", 1996: "D", 2004: "Z", 2018: "w", 2035: "w", 2042: "7",
  2043: "h", 2080: "j", 2082: "H", 2104: "R", 2107: "R", 2123: "P", 2140: "4",
  2162: "D", 2164: "O", 2183: "w", 2198: "C", 2199: "C", 2200: "C", 2201: "C",
  2202: "C", 2210: "f", 2212: "7", 2246: "E", 2253: "j", 2260: "o", 2272: "d",
  2279: "M", 2282: "M", 2294: "U", 2301: "U", 2310: "W", 2318: "4", 2321: "M",
  2332: "a", 2344: "O", 2345: "W", 2346: "W", 2366: "s", 2380: "b", 2381: "C",
  2382: "0", 2394: "f", 2433: "E", 2448: "o", 2461: "d", 2464: "p", 2466: "M",
  2485: "U", 2498: "c", 2501: "e", 2503: "W", 2512: "q", 2526: "a", 2546: "2",
  2563: "s", 2578: "b", 2580: "0", 2606: "5", 2632: "6", 2669: "p", 2706: "c",
  2709: "e", 2721: "q", 2758: "2", 2800: "9", 2823: "5", 2851: "6", 3033: "9",
  3038: "S", 3054: "B", 3160: "g", 3244: "Q", 3254: "Q", 3266: "G", 3291: "S",
  3308: "B", 3414: "8", 3423: "g", 3514: "Q", 3538: "G", 3663: "m", 3667: "m",
  3698: "8", 3878: "3", 3968: "m", 4201: "3",
};

function solveSvgCaptcha(svgContent) {
  if (!svgContent) return "";
  const candidates = [];
  const pathRe = /d=["']([^"']+)["']/g;
  let m;
  while ((m = pathRe.exec(svgContent)) !== null) {
    const path = m[1];
    if (path.length <= 500) continue;
    const xMatch = path.match(/(\d+(?:\.\d*)?)/);
    const xVal = xMatch ? parseFloat(xMatch[1]) : 0;
    candidates.push({ x: xVal, path });
  }
  candidates.sort((a, b) => a.x - b.x);
  let result = "";
  for (const { path } of candidates) {
    result += resolveCollision(path.length, path) || CAPTCHA_LENGTH_MAP[path.length] || "";
  }
  return result;
}

function resolveCollision(length, path) {
  const minY = calcMinY(path);
  const moveY = calcMoveY(path);
  const width = calcWidth(path);
  const collisions = {
    986:   (v) => v > 13 ? "I" : "l",
    1068:  (v) => v > 13 ? "I" : "l",
    1274:  (v) => calcMoveY(path) > 30 ? "y" : "L",
    1380:  (v) => calcMoveY(path) > 30 ? "y" : "L",
    1610:  (v) => v > 19 ? "x" : "J",
    1744:  (v) => v > 19 ? "x" : "J",
    1615:  (v) => v > 18 ? "r" : "N",
    2198:  (v) => v > 19 ? "n" : "C",
    2381:  (v) => v > 19 ? "n" : "C",
    2318:  (v) => width > 30 ? "W" : "4",
    1598:  (v) => v > 13 ? "X" : "N",
    1731:  (v) => v > 13 ? "X" : "N",
    1694:  (v) => v > 22 ? "z" : "t",
    1835:  (v) => v > 22 ? "z" : "t",
    2279:  (v) => v > 13 ? "R" : "M",
  };
  const fn = collisions[length];
  return fn ? fn(minY) : "";
}

function numbersFromPath(path) {
  return (path.match(/(\d+(?:\.\d*)?)/g) || []).map(Number);
}
function calcMinY(path) {
  const nums = numbersFromPath(path);
  const ys = nums.filter((_, i) => i % 2 === 1);
  return ys.length ? Math.min(...ys) : 0;
}
function calcMoveY(path) {
  const m2 = path.match(/M(\d+(?:\.\d*)?)\s+(\d+(?:\.\d*)?)/);
  return m2 ? parseFloat(m2[2]) : 0;
}
function calcWidth(path) {
  const nums = numbersFromPath(path);
  const xs = nums.filter((_, i) => i % 2 === 0);
  return xs.length ? Math.max(...xs) - Math.min(...xs) : 0;
}

// ============================================================
// 语言识别
// ============================================================
function getLangHint(text) {
  const t = (text || "").toLowerCase();
  if (!t) return "other";
  if (/\b(chs&eng|cht&eng|chs\+eng|cht\+eng)\b/i.test(t) ||
      /双语|中英|简英|繁英|简体&英文|繁体&英文/.test(t)) {
    if (/cht&eng|繁英|繁体&英文/.test(t)) return "cht&eng";
    return "chs&eng";
  }
  if (/双语文/.test(t)) return "chs&eng";
  if (/\bchs\b/i.test(t) || /简中|简体|简[体]/.test(t) ||
      /chinese simplified|simplified chinese|zh-hans|\bsc\b/i.test(t)) return "chs";
  if (/\bcht\b/i.test(t) || /繁中|繁体|繁[体]/.test(t) ||
      /chinese traditional|traditional chinese|zh-hant|\btc\b/i.test(t)) return "cht";
  if (/\beng\b/i.test(t) || /英文|英语/.test(t)) return "eng";
  if (/\bjp\b|\bjpn\b/i.test(t) || /日文|日语/.test(t)) return "jpn";
  if (/\bkor?\b/i.test(t) || /韩文|韩语/.test(t)) return "kor";
  if (/\bfr\b|\bfra\b/i.test(t) || /法文|法语/.test(t)) return "fr";
  return "other";
}

function getLangTag(text) {
  const hint = getLangHint(text || "");
  if (hint === "chs&eng") return "【简·双语】";
  if (hint === "cht&eng") return "【繁·双语】";
  if (hint === "chs") return "【简中】";
  if (hint === "cht") return "【繁中】";
  if (hint === "eng") return "【英文】";
  if (hint === "jpn") return "【日文】";
  if (hint === "kor") return "【韩文】";
  if (hint === "fr") return "【法文】";
  return "【字幕】";
}

function getLangPriority(text) {
  const hint = getLangHint(text || "");
  if (hint === "chs&eng" || hint === "cht&eng") return 1;
  if (hint === "chs") return 2;
  if (hint === "cht") return 3;
  return 99;
}

function isChineseRelated(text) {
  const hint = getLangHint(text || "");
  return hint === "chs" || hint === "cht" || hint === "chs&eng" || hint === "cht&eng";
}

// ============================================================
// 字幕格式识别
// ============================================================
function getFormat(text) {
  const t = (text || "").toLowerCase();
  if (/\bass\b/.test(t)) return "ASS";
  if (/\bssa\b/.test(t)) return "SSA";
  if (/\bsrt\b/.test(t)) return "SRT";
  if (/\bsup\b/.test(t)) return "SUP";
  if (/\bvtt\b/.test(t)) return "VTT";
  if (/\bsbv\b/.test(t)) return "SBV";
  if (/\bsub\b/.test(t)) return "SUB";
  return "";
}

function getExt(name) {
  if (!name) return "";
  const s = String(name).toLowerCase();
  if (s.endsWith(".srt")) return ".srt";
  if (s.endsWith(".ass")) return ".ass";
  if (s.endsWith(".ssa")) return ".ssa";
  if (s.endsWith(".sup")) return ".sup";
  if (s.endsWith(".vtt")) return ".vtt";
  if (s.endsWith(".zip")) return ".zip";
  if (s.endsWith(".rar")) return ".rar";
  if (s.endsWith(".7z")) return ".7z";
  return "";
}

// ============================================================
// 工具函数
// ============================================================
function getText(val) {
  return String(val || "").trim();
}

function shortenName(name, maxLen) {
  return shortenNameSimple(name, maxLen);
}

function formatDownload(n) {
  const num = Number(n) || 0;
  if (num >= 10000) return (num / 10000).toFixed(1) + "w";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num;
}

function cleanText(val) {
  return (val || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function extractNumber(text) {
  const m = String(text || "").match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

// ============================================================
// 搜索关键词构建 — 参考 SHOOTER 模块
// ============================================================
function buildSearchKeys(params) {
  const title = getText(params.title || params.seriesName);
  if (!title) return [];

  const origName = getText(params.originalTitle || params.originalName ||
    (params.tmdbInfo && (params.tmdbInfo.originalTitle || params.tmdbInfo.originalName)));
  const altNames = (origName && origName.toLowerCase() !== title.toLowerCase()) ? [origName] : [];
  const names = [title, ...altNames];

  const season = Number(params.season);
  const episode = Number(params.episode);
  const hasSeason = !isNaN(season) && season > 0;
  const hasEpisode = !isNaN(episode) && episode > 0;
  const mediaType = (params.type || params.mediaType || "").toLowerCase();

  if (mediaType === "tv" || hasSeason || hasEpisode) {
    const keys = [];
    // 中文数字（1-10 用汉字，>10 用阿拉伯数字）
    const cnNums = ["","一","二","三","四","五","六","七","八","九","十"];
    const cnSeasonStr = hasSeason ? (season >= 1 && season <= 10 ? cnNums[season] : String(season)) : "";
    const cnEpisodeStr = hasEpisode ? (episode >= 1 && episode <= 10 ? cnNums[episode] : String(episode)) : "";

    for (const name of names) {
      // 英文格式
      if (hasSeason && hasEpisode) {
        keys.push(`${name} S${String(season).padStart(2, "0")}E${String(episode).padStart(2, "0")}`);
        keys.push(`${name} ${season}x${episode}`);
      } else if (hasEpisode) {
        keys.push(`${name} E${String(episode).padStart(2, "0")}`);
      }
      if (hasSeason) keys.push(`${name} S${String(season).padStart(2, "0")}`);

      // 中文格式："皮囊 第二季"、"皮囊 第二季 第五集"
      if (cnSeasonStr && cnEpisodeStr) {
        keys.push(`${name} 第${cnSeasonStr}季 第${cnEpisodeStr}集`);
        keys.push(`${name} 第${cnSeasonStr}季 第${cnEpisodeStr}话`);
      }
      if (cnSeasonStr) {
        keys.push(`${name} 第${cnSeasonStr}季`);
      }
      if (cnEpisodeStr && !hasSeason) {
        keys.push(`${name} 第${cnEpisodeStr}集`);
        keys.push(`${name} 第${cnEpisodeStr}话`);
      }

      keys.push(name);
    }
    return keys.filter(k => k.length >= 2);
  }

  return names.filter(k => k.length >= 2);
}

// ============================================================
// 基于标题文本的匹配评分
// ============================================================
function calcScore(titleText, params) {
  if (!titleText) return 0;
  const text = titleText.toLowerCase();
  const title = getText(params.title || params.seriesName).toLowerCase();
  const origTitle = getText(params.originalTitle || params.originalName ||
    (params.tmdbInfo && (params.tmdbInfo.originalTitle || params.tmdbInfo.originalName))).toLowerCase();
  const season = Number(params.season);
  const episode = Number(params.episode);
  const sStr = !isNaN(season) && season > 0 ? String(season).padStart(2, "0") : "";
  const eStr = !isNaN(episode) && episode > 0 ? String(episode).padStart(2, "0") : "";
  const movieYear = Number(params.year);
  const hasMovieYear = !isNaN(movieYear) && movieYear >= 1900;
  let score = 0;

  if (sStr && eStr) {
    if (new RegExp(`S${sStr}E${eStr}`, "i").test(text)) score += 100000;
    else if (new RegExp(`${sStr}x${eStr}`, "i").test(text)) score += 90000;
    else if (new RegExp(`S${sStr}(?!E)`, "i").test(text)) score += 50000;
    else if (title && text.includes(title)) score += 10000;
    else if (origTitle && text.includes(origTitle)) score += 5000;
  } else if (title && text.includes(title)) {
    score += 10000;
  } else if (origTitle && text.includes(origTitle)) {
    score += 5000;
  }

  const langHint = getLangHint(titleText);
  if (langHint === "chs&eng" || langHint === "cht&eng") score += 3000;
  else if (langHint === "chs" || langHint === "cht") score += 1000;

  if (hasMovieYear) {
    const yearMatches = text.match(/(?:19|20)\d{2}/g) || [];
    const years = yearMatches.map(Number).filter(y => !isNaN(y));
    if (years.length > 0) {
      const bestDiff = Math.min(...years.map(y => Math.abs(y - movieYear)));
      if (bestDiff === 0) score += 30000;
      else if (bestDiff === 1) score += 18000;
      else if (bestDiff === 2) score += 8000;
      else score -= Math.min(bestDiff * 300, 6000);
    } else {
      score -= 1000;
    }
  }

  return score;
}

// ============================================================
// SubHD 页面请求
// ============================================================
async function fetchText(url, rootUrl) {
  const res = await Widget.http.get(url, {
    headers: {
      "User-Agent": UA,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      "Referer": rootUrl,
    },
    timeout: 15000,
  });
  return (res && res.data) || "";
}

async function postJson(url, payload, referer) {
  const res = await Widget.http.post(url, JSON.stringify(payload), {
    headers: {
      "User-Agent": UA,
      "Accept": "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      "Referer": referer,
    },
    timeout: 15000,
  });
  let data = res && res.data;
  if (typeof data === "string") {
    try { data = JSON.parse(data); } catch (e) { data = {}; }
  }
  return data || {};
}

// ============================================================
// 搜索页解析（Cheerio + 正则兜底）
// 解析 /search/{keyword} 返回的 HTML，提取所有字幕条目
// ============================================================
function parseSearchResults(html, rootUrl) {
  const $ = Widget.html.load(html);
  const items = [];

  // 找所有 /a/{sid} 链接
  $('a[href^="/a/"]').each((i, el) => {
    const href = $(el).attr("href") || "";
    const m = href.match(/^\/a\/([A-Za-z0-9_-]+)$/);
    if (!m) return;
    const sid = m[1];

    // 获取链接所在的条目容器
    let $container = $(el).closest("li, tr, .item, .card, .media, .row, td, [class*=col]");
    if (!$container.length) $container = $(el).parent();
    if (!$container.text().match(/发布人/) && $container.parent().length && !$container.parent().is("body,html")) {
      $container = $container.parent();
    }
    const fullText = $container.text().replace(/\s+/g, " ").trim();
    if (!fullText) return;

    // 标题：链接文本
    const title = cleanText($(el).text());
    if (!title) return;

    // 过滤侧边栏非搜索结果：容器文本必须含 "发布人"
    if (!/发布人/.test(fullText)) return;

    // 去重：同 sid 时保留文字更长的（通常是含文件名/季集信息的那个）
    const existing = items.find(it => it.sid === sid);
    if (existing) {
      if (title.length > existing.title.length) {
        existing.title = title;
        existing.fullText = fullText;
      }
      return;
    }

    // 类别：官方字幕 / 转载精修 / 原创翻译
    let category = "";
    if (/官方字幕/.test(fullText)) category = "官方";
    else if (/原创翻译/.test(fullText)) category = "原创";
    else if (/转载精修/.test(fullText)) category = "精修";
    // AI 翻/润色
    if (!category && /AI[翻润色译]|[Aa][Ii]\s*[翻润色译]|AI-translated|machine.translate/i.test(fullText)) {
      category = "AI";
    }

    // 上传者
    let uploader = "";
    const upMatch = fullText.match(/发布人\s*(\S+)/);
    if (upMatch) uploader = upMatch[1];

    // 语言
    const langHint = getLangHint(fullText);

    // 下载次数：找 "文件大小(k) + 下载数 + 日期" 模式
    // 日期可能是 MM-DD (06-12) 或 M-D (9-6) 或 YYYY-M-D (2025-9-6)
    let downCount = 0;
    const dlMatch = fullText.match(/(\d+)k\s+(\d{1,6})\s+(?:\d{1,4}-)?\d{1,2}-\d{1,2}/);
    if (dlMatch) downCount = parseInt(dlMatch[2], 10);

    items.push({
      sid,
      title,
      fullText,
      category,
      uploader,
      langHint,
      downCount,
      pageUrl: `${rootUrl}/a/${sid}`,
    });
  });

  return items;
}

// ============================================================
// 从 /a/{sid} 页面提取下载链接的完整 href
// ============================================================
function extractDownloadHref(html) {
  const $ = Widget.html.load(html);
  const downLink = $(`a[href*="/down/"]`).first().attr("href");
  return downLink || "";
}

// ============================================================
// 从 API 响应中递归提取下载 URL
// ============================================================
function extractUrlFromResponse(data) {
  if (typeof data === "string") {
    const t = data.trim().replace(/&amp;/g, "&");
    if (!t) return "";
    if (t.startsWith("http://") || t.startsWith("https://") || t.startsWith("/")) return t;
    if (t.startsWith("{") || t.startsWith("[")) {
      try { return extractUrlFromResponse(JSON.parse(t)); } catch (e) { return ""; }
    }
    // 纯 URL 字符串
    if (/^https?:\/\//.test(t)) return t;
    return "";
  }
  if (Array.isArray(data)) {
    for (const item of data) {
      const found = extractUrlFromResponse(item);
      if (found) return found;
    }
    return "";
  }
  if (typeof data !== "object" || !data) return "";
  const keyPriority = [
    "url", "download_url", "downloadUrl", "down_url", "downUrl",
    "file_url", "fileUrl", "link", "href", "path", "location", "redirect",
  ];
  for (const key of keyPriority) {
    const found = extractUrlFromResponse(data[key]);
    if (found) return found;
  }
  const objKeys = ["data", "result", "sub", "subtitle", "file", "download", "resource"];
  for (const key of objKeys) {
    const found = extractUrlFromResponse(data[key]);
    if (found) return found;
  }
  for (const val of Object.values(data)) {
    const found = extractUrlFromResponse(val);
    if (found) return found;
  }
  return "";
}

// ============================================================
// 解析一条字幕的显示名
// ============================================================
function makeSubtitleTitle(item) {
  // 优先用 fullText 中的文件名部分，它通常含季集信息
  let name = item.title || "SubHD 字幕";

  // 尝试从 fullText 中提取更完整的描述（跳过语言标签等前缀）
  if (item.fullText) {
    // 去掉语言/类别标签前缀后的第一个长句
    const lines = item.fullText.split(/发布人/)[0].trim();
    // 找文件名特征：包含 . 或 S\d+E\d+ 或 - 的片段（贪心匹配尽量取完整）
    const fileMatch = lines.match(/[A-Za-z0-9\u4e00-\u9fff][\w.\-（）()【】\[\]_\u4e00-\u9fff]{10,}?(?:\.(?:srt|ass|ssa|zip|rar|7z))?/);
    if (fileMatch && fileMatch[0].length > name.length) {
      name = fileMatch[0];
    }
  }

  name = name.replace(/\.(srt|ass|ssa|zip|rar|7z)$/i, "");

  const langTag = getLangTag(item.fullText || item.title || "");
  const downText = formatDownload(item.downCount);

  // 类别标签
  const catTag = item.category ? item.category + "·" : "";

  // 季集标签：从名称或原始文本中提取，前置确保小屏可见
  let epTag = "";
  const epRe = /\b(S\d{1,2}E\d{1,3}|S\d{1,2}(?:\s*-\s*\d{1,2})?|E\d{1,3})\b/i;
  const epMatch = (name + " " + (item.fullText || "")).match(epRe);
  if (epMatch) {
    epTag = epMatch[1].toUpperCase() + "·";
    // 从 name 中移除季集信息，避免后续截断时丢失
    name = name.replace(epRe, "").trim();
  }

  // 文件名简短截断
  const displayName = shortenNameSimple(name, 22);

  return `${langTag}${catTag}${epTag}${displayName} | ${downText}次`;
}

// 简单头尾截断
function shortenNameSimple(name, maxLen) {
  const text = getText(name);
  if (!text || text.length <= (maxLen || 22)) return text;
  const headLen = Math.max(6, Math.floor(((maxLen || 22) - 3) * 0.6));
  const tailLen = Math.max(6, (maxLen || 22) - headLen - 3);
  return text.slice(0, headLen) + "…" + text.slice(-tailLen);
}

// ============================================================
// 解决一条字幕的下载 URL（带缓存）
// 返回 { url, files? }，files 为 ZIP 包内匹配的字幕文件列表
// ============================================================
async function resolveDownloadUrl(item, rootUrl) {
  const cacheKey = `subhd_dl_${item.sid}`;
  try {
    const cached = Widget.storage.get(cacheKey);
    if (cached && typeof cached === "string") {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.url) return parsed;
    }
  } catch (e) {}

  // 1. 获取 /a/{sid} 页面，提取 /down/{sid} 链接
  const pageHtml = await fetchText(item.pageUrl, rootUrl);
  if (!pageHtml) return null;
  const downHref = extractDownloadHref(pageHtml);
  if (!downHref) return null;
  const downUrl = downHref.startsWith("http") ? downHref : `${rootUrl}${downHref.startsWith("/") ? "" : "/"}${downHref}`;
  const downSid = downHref.match(/\/down\/([A-Za-z0-9_-]+)/);
  const sid = downSid ? downSid[1] : "";
  if (!sid) return null;

  // 2. GET /down/{sid} — 建立 session（必需步骤，设置 Cookie）
  const downHtml = await fetchText(downUrl, item.pageUrl);

  // 3. POST /api/sub/down 获取下载链接
  let data = await postJson(`${rootUrl}/api/sub/down`, { sid, cap: "" }, downUrl);

  // 4. 如果触发验证码，解析 SVG 后重试
  if (data && data.pass === false && data.msg) {
    const cap = solveSvgCaptcha(String(data.msg));
    if (cap) {
      data = await postJson(`${rootUrl}/api/sub/down`, { sid, cap }, downUrl);
    }
  }

  if (!data || !data.success) {
    if (downHtml) {
      const fallbackLinks = extractAllDownloadLinks(downHtml);
      for (const link of fallbackLinks) {
        const testUrl = link.startsWith("http") ? link : `${rootUrl}${link.startsWith("/") ? "" : "/"}${link}`;
        return { url: testUrl };
      }
    }
    return null;
  }

  let fileUrl = extractUrlFromResponse(data);

  if (!fileUrl && downHtml) {
    const fallbackLinks = extractAllDownloadLinks(downHtml);
    for (const link of fallbackLinks) {
      const testUrl = link.startsWith("http") ? link : `${rootUrl}${link.startsWith("/") ? "" : "/"}${link}`;
      fileUrl = testUrl;
      break;
    }
  }

  if (!fileUrl) return null;

  const resolved = fileUrl.startsWith("http") ? fileUrl : `${rootUrl}${fileUrl.startsWith("/") ? "" : "/"}${fileUrl}`;

  // 播放器不支持 rar/7z，排除
  if (/\.(rar|7z)$/i.test(resolved)) {
    // 尝试从页面 HTML 中找 .zip 或其他可用链接兜底
    if (downHtml) {
      const fallbackLinks = extractAllDownloadLinks(downHtml);
      for (const link of fallbackLinks) {
        const testUrl = link.startsWith("http") ? link : `${rootUrl}${link.startsWith("/") ? "" : "/"}${link}`;
        if (/\.(zip|srt|ass|ssa|sub|vtt)$/i.test(testUrl)) return { url: testUrl };
      }
    }
    return null;
  }

  // 缓存 10 分钟
  try {
    Widget.storage.set(cacheKey, JSON.stringify({ url: resolved }), 600);
  } catch (e) {}

  return { url: resolved };
}

// ============================================================
// 从 HTML 中提取所有可能的下载链接
function extractAllDownloadLinks(html) {
  const links = [];
  const $ = Widget.html.load(html);
  $('a[href]').each((i, el) => {
    const h = $(el).attr("href") || "";
    if (/\.(zip|rar|7z|srt|ass|ssa|sub|vtt)$/i.test(h) || h.includes("/down/")) {
      links.push(h);
    }
  });
  return links;
}

// ============================================================
// 压缩包处理：App 下载并解压 ZIP/RAR/7z 后调用此函数，
// 传入解压后的文件列表，返回最佳匹配文件的相对路径
// ============================================================
function parseArchiveFileList(value) {
  try {
    var files = JSON.parse(value || "[]");
    return Array.isArray(files) ? files : [];
  } catch (e) {
    return [];
  }
}

function archiveSubtitleScore(file, params) {
  var name = String(file.name || file.path || "").toLowerCase();
  var score = 0;
  if (params.season && params.episode) {
    var s = String(params.season).padStart(2, "0");
    var e = String(params.episode).padStart(2, "0");
    var patterns = ["s" + s + "e" + e, params.season + "x" + e, params.season + "x" + params.episode];
    for (var i = 0; i < patterns.length; i++) {
      if (name.indexOf(patterns[i]) >= 0) { score += 100; break; }
    }
    // 也匹配 E05 / .E05. / _E05_ 等格式（无 S 前缀），降低权重避免跨季误配
    if (score === 0 && name.indexOf("e" + e) >= 0) {
      // 检查是否有其他季的 SxxExx 标记，有则可能是不同季
      var otherSeasonRe = /\bs\d{2}e\d{2}\b/;
      var otherMatch = name.match(otherSeasonRe);
      if (!otherMatch || otherMatch[0] === "s" + s + "e" + e) {
        score += 60;
      }
    }
  }
  if (name.indexOf("chs") >= 0 || name.indexOf("zh") >= 0 || name.indexOf("简体") >= 0 || name.indexOf("中文") >= 0) score += 10;
  if (name.indexOf("cht") >= 0 || name.indexOf("繁体") >= 0) score += 8;
  return score;
}

async function resolveSubtitleArchive(params) {
  var files = parseArchiveFileList(params.subtitleFiles || params.files);
  if (files.length === 0) return null;
  var best = files[0], bestScore = archiveSubtitleScore(best, params);
  for (var i = 1; i < files.length; i++) {
    var file = files[i];
    var score = archiveSubtitleScore(file, params);
    if (score > bestScore) { best = file; bestScore = score; }
  }
  return best.path;
}

// ============================================================
// 主函数 loadSubtitle
// ============================================================
async function loadSubtitle(params) {
  const rootUrl = getText(params.rootUrl || "https://subhd.one").replace(/\/+$/, "");
  const searchKeys = buildSearchKeys(params);
  if (searchKeys.length === 0) return [];

  // 1. 搜索
  let allItems = [];
  let usedCache = false;

  const searchCacheKey = `subhd_search_${searchKeys[0].toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
  try {
    const cached = Widget.storage.get(searchCacheKey);
    if (cached && typeof cached === "string") {
      allItems = JSON.parse(cached);
      usedCache = true;
    }
  } catch (e) {}

  if (!usedCache) {
    const seenSids = new Set();
    for (const keyword of searchKeys) {
      const searchUrl = `${rootUrl}/search/${encodeURIComponent(keyword)}`;
      try {
        const html = await fetchText(searchUrl, rootUrl);
        if (!html) continue;
        const items = parseSearchResults(html, rootUrl);
        if (items.length === 0) continue;
        // 累积合并，去重
        for (const item of items) {
          if (!seenSids.has(item.sid)) {
            seenSids.add(item.sid);
            allItems.push(item);
          }
        }
        // 已经累积足够多就不用继续搜了
        if (allItems.length >= 20) break;
      } catch (e) {
        console.warn(`[SubHD] search "${keyword}" error:`, e.message || e);
      }
    }

    // 缓存搜索结果（5 分钟）
    if (allItems.length > 0) {
      try {
        Widget.storage.set(searchCacheKey, JSON.stringify(allItems), 300);
      } catch (e) {}
    }
  }

  if (allItems.length === 0) return [];

  // 2. 评分 + 语言过滤
  for (const item of allItems) {
    item.score = calcScore(item.fullText || item.title, params);
  }
  allItems.sort((a, b) => b.score - a.score);

  // 英文原名过滤：仅当中文标题较短（≤4字）或可能混淆时启用，
  // 排除不含英文原名的结果（如"皮囊"匹配到"皮囊之下"）
  const origTitle = getText(params.originalTitle || params.originalName ||
    (params.tmdbInfo && (params.tmdbInfo.originalTitle || params.tmdbInfo.originalName)));
  const cnTitle = getText(params.title || params.seriesName);
  // 中文名短（≤4字）且英文原名存在且为拉丁文字时启用
  const needsOrigFilter = origTitle && /^[a-zA-Z]/.test(origTitle) && origTitle.length >= 3 &&
    cnTitle.length <= 4 && /[\u4e00-\u9fff]/.test(cnTitle);
  if (needsOrigFilter) {
    const origLower = origTitle.toLowerCase();
    const kept = allItems.filter(item => {
      const text = (item.fullText || item.title || "").toLowerCase();
      return item.score >= 50000 || text.includes(origLower);
    });
    if (kept.length > 0) allItems = kept;
  }

  // 剧集过滤：排除明确匹配错误季/集的字幕
  const season = Number(params.season);
  const episode = Number(params.episode);
  const hasSeason = !isNaN(season) && season > 0;
  const hasEpisode = !isNaN(episode) && episode > 0;
  if (hasSeason) {
    const sStr = String(season).padStart(2, "0");
    allItems = allItems.filter(item => {
      const text = item.fullText || item.title || "";
      // 同季不同集（当指定了具体集数时）
      if (hasEpisode) {
        const eStr = String(episode).padStart(2, "0");
        const wrongEpRe = new RegExp(`\\bS${sStr}E(?!${eStr}\\b)\\d{2}\\b`, "i");
        if (wrongEpRe.test(text)) return false;
      }
      // 不同季：条目中出现的所有 Sxx 都 ≠ 目标季 则排除
      const seasonRe = /\bS(\d{2})\b/g;
      const seenSeasons = [];
      let sm;
      while ((sm = seasonRe.exec(text)) !== null) {
        seenSeasons.push(sm[1]);
      }
      if (seenSeasons.length > 0 && seenSeasons.every(s => s !== sStr)) return false;
      return true;
    });
  }

  // 优先保留中文相关字幕
  const hasChinese = allItems.some(item => isChineseRelated(item.fullText || item.title));
  let candidates = allItems;
  if (hasChinese) {
    const chineseItems = allItems.filter(item => isChineseRelated(item.fullText || item.title));
    if (chineseItems.length > 0) candidates = chineseItems;
  }

  // 只处理 top 10
  const topCandidates = candidates.slice(0, 10);

  // 3. 对每个候选解析下载 URL
  const results = [];
  for (const item of topCandidates) {
    try {
      const dlResult = await resolveDownloadUrl(item, rootUrl);
      if (!dlResult || !dlResult.url) continue;
      const langBase = item.langHint || getLangHint(item.fullText || item.title) || "";
      results.push({
        id: `subhd-${item.sid}`,
        title: makeSubtitleTitle(item),
        lang: langBase,
        count: item.score || item.downCount || 0,
        url: dlResult.url,
        category: item.category || "",
        uploader: item.uploader || "",
      });
    } catch (e) {
      console.warn(`[SubHD] resolve download failed sid=${item.sid}:`, e.message || e);
    }
  }

  // 如果不足 6 条，从剩余候选中补
  if (results.length < 6 && candidates.length > topCandidates.length) {
    const remaining = candidates.slice(10).filter(item => !topCandidates.includes(item));
    for (const item of remaining) {
      if (results.length >= 10) break;
      try {
        const dlResult = await resolveDownloadUrl(item, rootUrl);
        if (!dlResult || !dlResult.url) continue;
        const langBase2 = item.langHint || getLangHint(item.fullText || item.title) || "";
        results.push({
          id: `subhd-${item.sid}`,
          title: makeSubtitleTitle(item),
          lang: langBase2,
          count: item.score || item.downCount || 0,
          url: dlResult.url,
          category: item.category || "",
          uploader: item.uploader || "",
        });
      } catch (e) {
        console.warn(`[SubHD] resolve download failed sid=${item.sid}:`, e.message || e);
      }
    }
  }

  return results;
}
