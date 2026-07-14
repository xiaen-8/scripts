WidgetMetadata = {
  id: "xunlei.subtitle",
  title: "迅雷看看 字幕",
  version: "1.1.0",
  requiredVersion: "0.0.1",
  description: "基于迅雷看看接口的字幕搜索 - 仅支持按片名搜索",
  author: "EL",
  site: "https://www.xunlei.com/",
  globalParams: [],
  modules: [
    {
      id: "loadSubtitle",
      title: "加载字幕",
      functionName: "loadSubtitle",
      type: "subtitle",
      params: [],
    },
  ],
};

const API_BASE = "https://api-shoulei-ssl.xunlei.com";

function getText(value) {
  return String(value || "").trim();
}

function getLangTag(langStr) {
  if (!langStr) return "【其他】";
  const t = String(langStr).toLowerCase();
  if (t.includes("简") || t.includes("chs") || t.includes("zho") || t.includes("chi")) return "【简中】";
  if (t.includes("繁") || t.includes("cht")) return "【繁中】";
  if (t.includes("双语") || t.includes("中英")) return "【双语】";
  if (t.includes("英") || t.includes("eng")) return "【英文】";
  return "【字幕】";
}

function formatDownload(num) {
  const n = Number(num) || 0;
  if (n >= 10000) return (n / 10000).toFixed(1) + "w";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

function parseDurationValue(value) {
  if (value == null) return 0;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const text = getText(value);
  if (!text) return 0;

  if (/^\d+(?:\.\d+)?$/.test(text)) return Number(text);

  const hms = text.match(/(?:(\d+):)?(\d{1,2}):(\d{2})/);
  if (hms) {
    const h = Number(hms[1] || 0);
    const m = Number(hms[2] || 0);
    const s = Number(hms[3] || 0);
    return h * 3600 + m * 60 + s;
  }

  const zh = text.match(/(\d+)\s*小时(?:\s*(\d+)\s*分(?:钟)?)?(?:\s*(\d+)\s*秒)?/);
  if (zh) {
    return Number(zh[1] || 0) * 3600 + Number(zh[2] || 0) * 60 + Number(zh[3] || 0);
  }

  return 0;
}

function formatDuration(seconds) {
  const n = Number(seconds) || 0;
  if (n <= 0) return "未知时长";
  const total = Math.floor(n);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatFileSize(bytes) {
  const n = Number(bytes) || 0;
  if (n <= 0) return "未知大小";
  if (n >= 1024 * 1024 * 1024) return (n / 1024 / 1024 / 1024).toFixed(1) + "G";
  if (n >= 1024 * 1024) return (n / 1024 / 1024).toFixed(1) + "M";
  if (n >= 1024) return (n / 1024).toFixed(1) + "K";
  return `${n}B`;
}

function firstNumber(...values) {
  for (const v of values) {
    const n = Number(v);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return 0;
}

function getExt(name) {
  if (!name) return "";
  const s = String(name).toLowerCase();
  if (s.endsWith(".srt")) return ".srt";
  if (s.endsWith(".ass")) return ".ass";
  if (s.endsWith(".ssa")) return ".ssa";
  return "";
}

function extractSearchCode(text) {
  const s = getText(text).toUpperCase();
  if (!s) return "";

  const normalized = s
    .replace(/\./g, " ")
    .replace(/_/g, "-")
    .replace(/\s+/g, " ")
    .trim();

  const patterns = [
    /\bFC2(?:[- ]?PPV)?[- ]?\d{5,8}\b/,
    /\bCARIB[- ]?\d{6,8}\b/,
    /\b1PONDO[- ]?\d{6,8}\b/,
    /\bHEYZO[- ]?\d{3,6}\b/,
    /\bT28[- ]?\d{6,8}\b/,
    /\b(?:S2M|MIAA|SSNI|SNIS|IPX|IPZZ|SSIS|JUQ|MIDE|MIDV|STARS|ABW|RKI|DVAJ|WANZ|LULU|DLDSS|VRTM|SDMU|SDDE|MKMP|HMN|MUDR|ADN|CAWD|PPPE|PRED|MGR|SHKD|MXGS|FSDSS|JUL|KTB|MIAB|GVH|MIMK|JUY|JUTA|IDBD|HND|DASD|CLO|BF|HONB|ROE|CEMD|MIUM|NITR|RCTD|RCT|IPVR|MIBD|JUR|JURD|SOE|ORE|PYO)\s*[-_ ]?\d{2,6}[A-Z]?(?:[-_ ]?[A-Z]{0,4})?\b/,
    /\b[A-Z]{2,10}\s*[-_ ]?\d{2,8}[A-Z]?\b/,
    /\b\d{6,8}\b/
  ];

  const candidates = [normalized];
  const titleLike = normalized
    .replace(/\b(UNCENSORED|LEAK|OTHER|COMPLETE|FULL|HDR|WEB|BLURAY|BDRIP|WEBDL|REMUX|X264|X265|10BIT|8BIT|HEVC|AVC)\b/gi, " ")
    .replace(/\b(?:CD\d+|PART\d+|DISC\d+|EP\s*\d+|E\s*\d+|S\d{1,2}E\d{1,2}|\d{1,2}x\d{1,2}|SEASON\s*\d+)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (titleLike && titleLike !== normalized) candidates.push(titleLike);

  for (const source of candidates) {
    for (const reg of patterns) {
      const match = source.match(reg);
      if (match?.[0]) {
        return match[0]
          .replace(/\s+/g, "")
          .replace(/_/g, "-")
          .replace(/-+/g, "-")
          .toUpperCase();
      }
    }
  }
  return "";
}

function detectMediaType(params) {
  const explicit = getText(params?.mediaType).toLowerCase();
  if (explicit === "movie" || explicit === "film") return "movie";
  if (explicit === "tv" || explicit === "series" || explicit === "episode") return "tv";

  const title = getText(params?.title) || getText(params?.seriesName);
  const avCode = extractSearchCode(title);
  if (avCode) return "movie";

  const season = Number(params?.season);
  const episode = Number(params?.episode);
  if ((!Number.isNaN(season) && season > 0) || (!Number.isNaN(episode) && episode > 0)) {
    return "tv";
  }

  if (/S\d{1,2}E\d{1,2}/i.test(title) || /Season\s*\d+\s*Episode\s*\d+/i.test(title) || /第\s*\d+\s*集/.test(title)) {
    return "tv";
  }

  return "movie";
}

function stripEpisodeMarkers(text) {
  return getText(text)
    .replace(/\b(?:第\s*\d+\s*集|第\s*\d+\s*話|EP\s*\d+|E\s*\d+|S\d{1,2}E\d{1,2}|\d{1,2}x\d{1,2}|Season\s*\d+\s*Episode\s*\d+)\b/gi, " ")
    .replace(/\b(?:第\s*\d+\s*季|Season\s*\d+)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function collectSearchContext(params = {}) {
  const rawFields = [params.title, params.seriesName, params.description, params.id, params.link, params.url]
    .map(getText)
    .filter(Boolean);
  const rawText = rawFields.join(" ").trim();
  const titleText = getText(params.title || params.seriesName);
  const descriptionText = getText(params.description);
  const displayText = stripEpisodeMarkers(titleText || rawText || descriptionText);
  const codeSource = stripEpisodeMarkers(rawText || titleText || descriptionText);
  const avCode = extractSearchCode(codeSource);
  return { rawText, titleText, descriptionText, displayText, avCode };
}

function buildSearchKeys(params, mediaType) {
  const { rawText, titleText, descriptionText, displayText, avCode } = collectSearchContext(params);
  const season = Number(params?.season);
  const episode = Number(params?.episode);
  if (!rawText) return [];

  const keys = [];
  const isAvTitle = Boolean(avCode);

  if (isAvTitle) {
    const titlePart = (displayText || titleText || rawText)
      .replace(new RegExp(avCode.replace(/[-_]/g, "[-_]?"), "i"), "")
      .replace(/\b(UNCENSORED|LEAK|OTHER|COMPLETE|FULL|HDR|WEB|BLURAY|BDRIP|WEBDL|REMUX|X264|X265|10BIT|8BIT|HEVC|AVC)\b/gi, "")
      .replace(/\b(?:EP|E|S|SEASON)\s*\d{1,3}\b/gi, "")
      .replace(/[-_:\s]+$/g, "")
      .replace(/^[\s\-_:]+|[\s\-_:]+$/g, "")
      .trim();
    const compactCode = avCode.replace(/[-_ ]/g, "");
    keys.push(avCode);
    keys.push(compactCode);
    if (titlePart && titlePart !== avCode) keys.push(`${avCode} ${titlePart}`);
    if (titlePart && titlePart !== compactCode) keys.push(`${compactCode} ${titlePart}`);
  }

  if (mediaType === "tv" || (!isAvTitle && /S\d{1,2}E\d{1,2}/i.test(displayText))) {
    const s = Number(season);
    const e = Number(episode);
    const hasSeason = !Number.isNaN(s) && s > 0;
    const hasEpisode = !Number.isNaN(e) && e > 0;
    const tvBase = displayText || titleText || rawText;
    const tvKeys = [];

    if (hasSeason && hasEpisode) {
      const sStr = String(s).padStart(2, "0");
      const eStr = String(e).padStart(2, "0");
      tvKeys.push(`${tvBase} S${sStr}E${eStr}`);
      tvKeys.push(`${tvBase} ${sStr}x${eStr}`);
    } else if (hasEpisode) {
      const eStr = String(e).padStart(2, "0");
      tvKeys.push(`${tvBase} E${eStr}`);
    }
    if (hasSeason) {
      const sStr = String(s).padStart(2, "0");
      tvKeys.push(`${tvBase} S${sStr}`);
    }
    tvKeys.push(tvBase);
    keys.push(...tvKeys);
  }

  keys.push(displayText || titleText || rawText);
  keys.push(titleText || rawText);
  return [...new Set(keys)].filter(k => k.length >= 2);
}

function scoreItem(item, params, mediaType) {
  const { rawText, titleText, descriptionText, displayText, avCode } = collectSearchContext(params);
  const title = (rawText || titleText || descriptionText || displayText).toLowerCase();
  const season = Number(params?.season);
  const episode = Number(params?.episode);
  const sStr = !Number.isNaN(season) && season > 0 ? String(season).padStart(2, "0") : "";
  const eStr = !Number.isNaN(episode) && episode > 0 ? String(episode).padStart(2, "0") : "";
  const text = (getText(item?.name) + " " + getText(item?.langs) + " " + getText(item?.ext)).toLowerCase();
  const titleLoose = title.replace(/[-_\s.]/g, "");
  const textLoose = text.replace(/[-_\s.]/g, "");
  const code = avCode || extractSearchCode(title);
  const codeLoose = code ? code.replace(/[-_ ]/g, "") : "";
  let score = Number(item?.cid_match ? 100000 : 0) + (Number(item?.down_count) || 0) / 10000;

  if (code && (text.includes(code.toLowerCase()) || textLoose.includes(codeLoose))) score += 25000;
  score += Math.max(0, Number(item?.score) || 0);
  score += Math.max(0, Number(item?.fingerprintScore) || 0);
  if (Number(item?.duration) > 0) score += 50;
  if (Number(item?.file_size) > 0) score += Math.min(Number(item?.file_size) / 1024 / 1024, 20);

  if (mediaType === "tv") {
    if (sStr && eStr && text.includes(`s${sStr}e${eStr}`)) score += 10000;
    else if (sStr && eStr && text.includes(`${sStr}x${eStr}`)) score += 9000;
    else if (sStr && text.includes(`s${sStr}`)) score += 5000;
    else if (title && (text.includes(title) || textLoose.includes(titleLoose))) score += 1000;
  } else if (title && (text.includes(title) || textLoose.includes(titleLoose))) {
    score += 1000;
  }

  if (code && mediaType === "movie") score += 500;

  if (text.includes("sub") || text.includes("subtitle") || text.includes("字幕")) score += 300;
  return score;
}

async function searchSub(key) {
  const url = `${API_BASE}/oracle/subtitle?name=${encodeURIComponent(key)}`;
  try {
    const res = await Widget.http.get(url, {
      headers: {
        "User-Agent": "ForwardWidgets/1.0.2",
        Accept: "*/*",
      }
    });
    const data = res?.data;
    if (!data || Number(data.code) !== 0 || !Array.isArray(data.data)) {
      console.warn(`[xunlei] search "${key}" failed: code=${data?.code} msg=${data?.msg || data?.message}`);
      return [];
    }
    return data.data;
  } catch (err) {
    console.warn(`[xunlei] search "${key}" error:`, err?.message || err);
    return [];
  }
}

function normalizeResult(item) {
  const duration = firstNumber(
    parseDurationValue(item?.Duration),
    parseDurationValue(item?.duration),
    parseDurationValue(item?.TimeLength),
    parseDurationValue(item?.time_length),
    parseDurationValue(item?.Length),
    parseDurationValue(item?.length),
    parseDurationValue(item?.VideoDuration),
    parseDurationValue(item?.video_duration),
    parseDurationValue(item?.Dur),
    parseDurationValue(item?.dur),
    parseDurationValue(item?.Runtime),
    parseDurationValue(item?.runtime),
    parseDurationValue(item?.PlayTime),
    parseDurationValue(item?.play_time)
  );

  const file_size = firstNumber(
    item?.FileSize,
    item?.file_size,
    item?.Size,
    item?.size,
    item?.FileSizeBytes,
    item?.fileSize,
    item?.filesize,
    item?.SubSize,
    item?.sub_size,
    item?.Subsize,
    item?.subsize,
    item?.LengthBytes,
    item?.length_bytes,
    item?.Bytes,
    item?.bytes
  );

  return {
    id: item?.Url || item?.url || item?.Id || item?.id || item?.Name || item?.name || Math.random().toString(36).slice(2),
    name: getText(item?.Name || item?.name || item?.Title || item?.title || item?.FileName || item?.filename || "迅雷字幕"),
    langs: getText(item?.Langs || item?.langs || item?.Languages?.join?.(",") || item?.Languages || item?.lang || item?.language || ""),
    ext: getText(item?.Ext || item?.ext || item?.Format || item?.format || getExt(item?.Name || item?.name) || ".srt"),
    url: getText(item?.Url || item?.url),
    down_count: Number(item?.DownCount || item?.down_count || item?.Download || item?.download || item?.Downloads || item?.downloads || 0),
    cid_match: Boolean(item?.CidMatch ?? item?.cid_match),
    duration,
    file_size,
    score: Number(item?.Score || item?.score || 0),
    fingerprintScore: Number(item?.FingerprintfScore || item?.fingerprintfScore || item?.FingerprintScore || item?.fingerprintScore || 0),
  };
}

async function loadSubtitle(params) {
  const mediaType = detectMediaType(params);
  const searchKeys = buildSearchKeys(params, mediaType);
  if (searchKeys.length === 0) return [];

  let allSubs = [];
  for (const word of searchKeys) {
    const list = await searchSub(word);
    console.warn(`[xunlei] keyword="${word}" hit=${list.length}`);
    if (list.length > 0) {
      allSubs = list;
      break;
    }
  }

  if (allSubs.length === 0) {
    console.warn(`[xunlei] no subtitle results for keys=${searchKeys.join(" | ")}`);
    return [];
  }

  const { rawText, titleText, descriptionText, displayText, avCode } = collectSearchContext(params);
  const rawTitle = rawText || titleText || descriptionText || displayText;
  const titleLower = rawTitle.toLowerCase();
  const matchText = stripEpisodeMarkers([rawText, descriptionText, params?.id, params?.link, params?.url].map(getText).filter(Boolean).join(" ")).toLowerCase();
  if (matchText) {
    const avCodeLoose = avCode ? avCode.replace(/[-_ ]/g, "").toLowerCase() : "";
    const titleLoose = matchText.replace(/[-_\s.]/g, "");
    const rawTitleLoose = titleLower.replace(/[-_\s.]/g, "");

    let matched = allSubs.filter(item => {
      const text = (getText(item?.name) + " " + getText(item?.langs) + " " + getText(item?.ext)).toLowerCase();
      const textLoose = text.replace(/[-_\s.]/g, "");
      if (avCode && (text.includes(avCode.toLowerCase()) || textLoose.includes(avCodeLoose))) return true;
      return text.includes(matchText) || textLoose.includes(titleLoose) || text.includes(titleLower) || textLoose.includes(rawTitleLoose) || matchText.includes(text);
    });

    if (matched.length === 0) {
      console.warn(`[xunlei] strict filter removed all results, fallback to loose list. title=${matchText}`);
      matched = allSubs.slice(0);
    }
    allSubs = matched;
  }

  const scored = allSubs.map(raw => {
    const item = normalizeResult(raw);
    return { item, score: scoreItem(item, params, mediaType) };
  });
  console.warn(`[xunlei] after normalize total=${scored.length}`);
  scored.sort((a, b) => b.score - a.score);

  const result = [];
  const existKey = new Set();
  const maxResultCount = 10;

  for (const { item } of scored) {
    if (result.length >= maxResultCount) break;
    if (!item.url) continue;

    const dedupeKey = `${item.name.toLowerCase()}|${item.url}`;
    if (existKey.has(dedupeKey)) continue;
    existKey.add(dedupeKey);

    const langTag = avCode ? "【简中】" : getLangTag(item.langs);
    const cleanName = item.name.replace(/\.(srt|ass|ssa|zip|rar|7z)$/i, "");
    const ext = getExt(item.name) || item.ext || ".srt";
    const durationText = item.duration > 0 ? formatDuration(item.duration) : "";
    const sizeText = item.file_size > 0 ? formatFileSize(item.file_size) : "";
    const extraParts = [];
    if (durationText) extraParts.push(`时长${durationText}`);
    if (sizeText) extraParts.push(`大小${sizeText}`);
    const extraText = extraParts.join(" | ");
    const extraRank = (Number(item?.score) || 0) + (Number(item?.fingerprintScore) || 0);

    result.push({
      id: item.id,
      title: `${langTag}${cleanName}${ext}`,
      subTitle: extraText,
      description: extraText,
      lang: avCode ? "简中" : (item.langs || "未知"),
      count: (item.cid_match ? 100000 : 0) + extraRank,
      url: item.url
    });
  }

  return result;
}
