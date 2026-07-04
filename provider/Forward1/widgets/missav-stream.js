
// ==================== MissAV Stream Source v1.3 ====================
// 用途：作为 Forward 的 stream source，把 MissAV 播放源聚合到其他视频详情页下方。
//
// v1.3 改动：
// 1. 支持返回同一番号的所有版本（中文/无码/有码），按优先级排序。
// 2. stream name 中加入版本标识，如 "[中文字幕]MissAV 1080P"。
// 3. 相同 UUID 的版本自动去重。
//
// v1.2 改动：
// 1. 修复番号提取时 fileName 字段拼写错误。
// 2. 新增 originalFilename、mediaSources 等字段扫描。
// 3. 新增递归扫描 params 内部字符串值的兜底策略。
//
// 策略：
// - 从当前详情页 params 中提取番号。
// - 用番号搜索 MissAV，找到所有精确匹配的详情页。
// - 按优先级排序：中文字幕 > 无码流出 > 有码。
// - 逐个提取 surrit UUID，相同 UUID 去重。
// - 每个 UUID 检测 1080p 是否存在。
// - 有 1080p：返回 1080p + 720p。
// - 没有 1080p：只返回 720p。

var WidgetMetadata = {
  id: "missav_stream",
  title: "MissAV Stream",
  description: "通过番号匹配 MissAV 播放源，并聚合到当前视频详情页",
  author: "meeowzzz",
  site: "https://missav.ai",
  version: "1.3.0",
  requiredVersion: "0.0.1",
  modules: [
    {
      id: "loadResource",
      title: "MissAV 播放源",
      description: "根据当前视频信息匹配 MissAV 播放链接",
      functionName: "loadResource",
      type: "stream",
      params: []
    }
  ]
};

// ==================== 常量定义 ====================
const DEFAULT_BASE_URL = "https://missav.ai";
const REQUEST_TIMEOUT = 15000;

const DEFAULT_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
  "Referer": "https://missav.ai/",
  "Connection": "keep-alive"
};

const PLAY_HEADERS = {
  Referer: "https://missav.ai/",
  Origin: "https://missav.ai"
};

// ==================== Worker 支持（与 ovo 方案一致） ====================
function gs(k) { try { return Widget.storage.get(k) || ""; } catch (e) { return ""; } }
async function gl(w, u) {
  try {
    var r = await Widget.http.get(w + "/qualities/" + u, { headers: DEFAULT_HEADERS });
    var d = typeof r.data == "string" ? JSON.parse(r.data) : r.data;
    if (d && d.length) return d;
  } catch (e) {}
  return null;
}

// ==================== HTTP 封装 ====================
async function httpGet(url, options = {}) {
  const finalOptions = {
    headers: { ...DEFAULT_HEADERS, ...(options.headers || {}) },
    timeout: options.timeout || REQUEST_TIMEOUT
  };

  const resp = await Widget.http.get(url, finalOptions);

  if (!resp || resp.statusCode !== 200) {
    throw new Error(`HTTP ${resp?.statusCode || "unknown"}: ${url}`);
  }

  return resp.data;
}

// ==================== 基础工具 ====================
function getText(value) {
  return String(value || "").trim();
}

function normalizeCode(value) {
  return getText(value)
    .toUpperCase()
    .replace(/[\s_\-]+/g, "");
}

function toAbsoluteUrl(href) {
  if (!href) return "";
  if (href.startsWith("http")) return href;
  if (href.startsWith("/")) return DEFAULT_BASE_URL + href;
  return DEFAULT_BASE_URL + "/" + href;
}

function getVersionTag(link) {
  if (!link) return "有码";
  if (link.includes("-chinese-subtitle")) return "中文字幕";
  if (link.includes("-uncensored-leak")) return "无码破解";
  return "有码";
}

// ==================== 番号提取 ====================
// allowPureNumeric:
// - true: 允许纯数字番号，例如某些特殊源。
// - false: 递归扫描深层 params 时不允许纯数字，避免误把日期、ID、时间戳当成番号。
function extractSearchCode(text, options = {}) {
  const allowPureNumeric = options.allowPureNumeric !== false;

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
    /\b(?:S2M|MIAA|SSNI|SNIS|IPX|IPZZ|SSIS|JUQ|MIDE|MIDV|STARS|ABW|RKI|DVAJ|WANZ|LULU|DLDSS|VRTM|SDMU|SDDE|MKMP|HMN|MUDR|ADN|CAWD|PPPE|PRED|MGR|SHKD|MXGS|FSDSS|JUL|KTB|MIAB|GVH|MIMK|JUY|JUTA|IDBD|HND|DASD|CLO|BF|HONB|ROE|CEMD|MIUM|NITR|RCTD|RCT|IPVR|MIBD|JUR|JURD|SOE|ORE|PYO|START|NSFS)\s*[-_ ]?\d{2,6}[A-Z]?(?:[-_ ]?[A-Z]{0,4})?\b/,
    /\b[A-Z]{2,10}\s*[-_ ]?\d{2,8}[A-Z]?\b/
  ];

  if (allowPureNumeric) {
    patterns.push(/\b\d{6,8}\b/);
  }

  for (const reg of patterns) {
    const match = normalized.match(reg);
    if (match?.[0]) {
      return match[0]
        .replace(/\s+/g, "")
        .replace(/_/g, "-")
        .replace(/-+/g, "-")
        .toUpperCase();
    }
  }

  return "";
}

// 递归收集 params 内部所有字符串。
// 用于不知道 Forward / Emby 实际把文件名放在哪个字段时的兜底扫描。
function collectStringValues(value, depth = 0, out = [], visited = new Set()) {
  if (value === null || value === undefined) return out;
  if (depth > 5) return out;

  const valueType = typeof value;

  if (valueType === "string" || valueType === "number") {
    const text = String(value).trim();
    if (text) out.push(text);
    return out;
  }

  if (valueType !== "object") return out;

  if (visited.has(value)) return out;
  visited.add(value);

  if (Array.isArray(value)) {
    for (const item of value) {
      collectStringValues(item, depth + 1, out, visited);
    }
    return out;
  }

  for (const key of Object.keys(value)) {
    collectStringValues(value[key], depth + 1, out, visited);
  }

  return out;
}

function extractCodeFromParams(params = {}) {
  // 第一层：优先扫描最可能含有番号的字段。
  // 这些字段包括常见视频源字段，以及可能的 Emby / 本地媒体字段。
  const priorityCandidates = [
    params.code,
    params.videoId,
    params.number,

    // Emby / 本地媒体可能字段
    params.fileName,
    params.filename,
    params.file_name,
    params.name,
    params.path,
    params.filePath,
    params.file_path,
    params.mediaPath,
    params.media_path,
    params.itemPath,
    params.item_path,
    params.localPath,
    params.local_path,
    params.originalFilename,
    params.originalFileName,

    // 常规媒体字段
    params.id,
    params.title,
    params.seriesName,
    params.originalTitle,
    params.originalName,
    params.episodeName,
    params.description,
    params.genreTitle,
    params.overview,
    params.link,
    params.url,
    params.videoUrl,
    params.playUrl,
    params.streamUrl
  ];

  // 常见嵌套对象字段
  if (params.tmdbInfo) {
    priorityCandidates.push(
      params.tmdbInfo.title,
      params.tmdbInfo.name,
      params.tmdbInfo.originalTitle,
      params.tmdbInfo.originalName,
      params.tmdbInfo.overview
    );
  }

  if (params.info) {
    priorityCandidates.push(
      params.info.title,
      params.info.name,
      params.info.originalTitle,
      params.info.originalName,
      params.info.overview
    );
  }

  if (params.mediaSource) {
    priorityCandidates.push(
      params.mediaSource.name,
      params.mediaSource.fileName,
      params.mediaSource.filename,
      params.mediaSource.path,
      params.mediaSource.url,
      params.mediaSource.streamUrl
    );
  }

  if (Array.isArray(params.mediaSources)) {
    for (const source of params.mediaSources) {
      priorityCandidates.push(
        source?.name,
        source?.fileName,
        source?.filename,
        source?.path,
        source?.url,
        source?.streamUrl
      );
    }
  }

  // 第一轮：优先字段允许纯数字番号。
  for (const value of priorityCandidates) {
    const code = extractSearchCode(value, { allowPureNumeric: true });
    if (code) return code;
  }

  // 第二轮：递归扫描所有字符串。
  // 这里不允许纯数字，避免误把日期 / ID / 时间戳识别为番号。
  const allStrings = collectStringValues(params);

  for (const value of allStrings) {
    const code = extractSearchCode(value, { allowPureNumeric: false });
    if (code) return code;
  }

  return "";
}

// ==================== MissAV 搜索结果解析 ====================
function extractCodeFromMissAVLink(link) {
  const href = getText(link);
  if (!href) return "";

  const lastPart = href
    .split("?")[0]
    .split("#")[0]
    .split("/")
    .filter(Boolean)
    .pop() || "";

  const cleaned = decodeURIComponent(lastPart)
    .replace(/-uncensored-leak/gi, "")
    .replace(/-chinese-subtitle/gi, "")
    .replace(/-/g, " ");

  return extractSearchCode(cleaned, { allowPureNumeric: true });
}

function parseSearchResults(html, targetCode) {
  if (!html || html.includes("Just a moment")) {
    console.warn("[missav_stream] 可能被 Cloudflare 拦截，搜索页返回异常");
    return [];
  }

  const $ = Widget.html.load(html);
  const results = [];
  const seen = new Set();

  // MissAV 常见卡片结构：div.group 内包含 a.text-secondary
  $("div.group").each((i, el) => {
    const $el = $(el);
    const $link = $el.find("a.text-secondary").first();
    const href = $link.attr("href");
    if (!href) return;

    const link = toAbsoluteUrl(href);
    if (!link || seen.has(link)) return;
    seen.add(link);

    const title = $link.text().trim();
    const codeFromLink = extractCodeFromMissAVLink(link);
    const codeFromTitle = extractSearchCode(title, { allowPureNumeric: true });
    const code = codeFromLink || codeFromTitle;

    results.push({
      title,
      link,
      code,
      version: getVersionTag(link)
    });
  });

  // fallback：如果 div.group 结构失效，遍历所有链接
  if (results.length === 0) {
    $("a[href]").each((i, el) => {
      const $el = $(el);
      const href = $el.attr("href");
      if (!href) return;

      const link = toAbsoluteUrl(href);
      if (!link.includes("/cn/")) return;
      if (seen.has(link)) return;

      const codeFromLink = extractCodeFromMissAVLink(link);
      if (!codeFromLink) return;

      seen.add(link);

      results.push({
        title: $el.text().trim(),
        link,
        code: codeFromLink,
        version: getVersionTag(link)
      });
    });
  }

  const targetLoose = normalizeCode(targetCode);

  // 精确番号优先
  const exact = results.filter(item => normalizeCode(item.code) === targetLoose);
  if (exact.length > 0) return exact;

  return results;
}

async function findMissAVDetailByCode(code) {
  const searchKeys = [
    code,
    code.replace(/-/g, "")
  ].filter(Boolean);

  const targetLoose = normalizeCode(code);

  for (const key of [...new Set(searchKeys)]) {
    const url = `${DEFAULT_BASE_URL}/cn/search/${encodeURIComponent(key)}`;

    try {
      const html = await httpGet(url);
      const results = parseSearchResults(html, code);

      if (!results.length) continue;

      // 筛选精确匹配的版本
      const exactMatches = results.filter(item => normalizeCode(item.code) === targetLoose);
      if (!exactMatches.length) {
        console.warn(`[missav_stream] 搜索到结果，但没有精确匹配番号：${code}`);
        continue;
      }

      // 按优先级排序：中文字幕 > 无码流出 > 有码
      const priority = { "中文字幕": 0, "无码流出": 1, "有码": 2 };
      exactMatches.sort((a, b) => (priority[a.version] ?? 99) - (priority[b.version] ?? 99));

      return exactMatches.map(item => ({ link: item.link, version: item.version }));
    } catch (e) {
      console.warn(`[missav_stream] 搜索失败：${key}`, e?.message || e);
    }
  }

  return [];
}

// ==================== 详情页解析 surrit UUID ====================
function extractSurritUuidFromHtml(html) {
  if (!html) return "";

  const $ = Widget.html.load(html);
  let uuid = "";

  $("script").each((i, el) => {
    const scriptContent = $(el).html() || "";

    // 1. 从 surrit CDN 地址中提取 UUID（与 ovo 方案一致）
    const m = scriptContent.match(/surrit\.com\/([a-f0-9\-]+)/);
    if (m) { uuid = m[1]; return false; }

    // 2. 从 eval 混淆脚本中提取 UUID（与 ovo 方案一致）
    if (!uuid && scriptContent.includes("eval(function")) {
      const um = scriptContent.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/);
      if (um) uuid = um[0];
    }
  });

  return uuid;
}

async function extractSurritUuidFromDetail(detailLink) {
  try {
    const html = await httpGet(detailLink, {
      headers: {
        "Referer": "https://missav.ai/"
      }
    });

    if (!html || html.includes("Just a moment")) {
      console.warn("[missav_stream] 详情页可能被 Cloudflare 拦截");
      return "";
    }

    return extractSurritUuidFromHtml(html);
  } catch (e) {
    console.warn("[missav_stream] 详情页加载失败：", e?.message || e);
    return "";
  }
}

// ==================== 清晰度检测与 Stream 返回 ====================
async function isM3U8Available(url) {
  try {
    const resp = await Widget.http.get(url, {
      headers: PLAY_HEADERS,
      timeout: 1500
    });

    return resp && resp.statusCode === 200 && String(resp.data || "").includes("#EXTM3U");
  } catch (e) {
    return false;
  }
}

function buildStreamItem(name, description, url) {
  return {
    name,
    description,
    url,
    customHeaders: PLAY_HEADERS
  };
}

async function buildStreamItems(uuid, code, detailLink, version) {
  const versionTag = version && version !== "有码" ? `[${version}]` : "";
  const verDesc = version && version !== "有码" ? `\n版本：${version}` : "";

  // Worker 画质获取（与 ovo 方案一致）
  const worker = gs("worker");
  const lines = worker ? await gl(worker, uuid) : null;

  if (lines && lines.length) {
    return lines.map(l => buildStreamItem(
      `${versionTag}MissAV ${l.label}`,
      `番号：${code}\n来源：MissAV\n清晰度：${l.label}${verDesc}\n详情页：${detailLink}`,
      l.url
    ));
  }

  // Worker 不可用时，回退到 HEAD 检测
  const url1080 = `https://surrit.com/${uuid}/1080p/video.m3u8`;
  const url720 = `https://surrit.com/${uuid}/720p/video.m3u8`;

  const items = [];

  const has1080 = await isM3U8Available(url1080);

  if (has1080) {
    items.push(
      buildStreamItem(
        `${versionTag}MissAV 1080P`,
        `番号：${code}\n来源：MissAV\n清晰度：1080P${verDesc}\n详情页：${detailLink}`,
        url1080
      )
    );
  }

  items.push(
    buildStreamItem(
      `${versionTag}MissAV 720P`,
      `番号：${code}\n来源：MissAV\n清晰度：720P${verDesc}\n详情页：${detailLink}`,
      url720
    )
  );

  return items;
}

// ==================== Stream Source 入口 ====================
async function loadResource(params = {}) {
  try {
    const code = extractCodeFromParams(params);

    if (!code) {
      console.log("[missav_stream] 当前视频信息中未找到番号，跳过 MissAV 匹配");
      return [];
    }

    console.log(`[missav_stream] 提取到番号：${code}`);

    const detailPages = await findMissAVDetailByCode(code);

    if (!detailPages.length) {
      console.log(`[missav_stream] 未找到 MissAV 精确匹配：${code}`);
      return [];
    }

    console.log(`[missav_stream] 匹配到 ${detailPages.length} 个版本：${detailPages.map(p => p.version).join(", ")}`);

    // 遍历所有版本，提取 UUID 并去重
    const seenUuids = new Set();
    const allStreams = [];

    for (const page of detailPages) {
      console.log(`[missav_stream] 处理版本：${page.version} → ${page.link}`);

      const uuid = await extractSurritUuidFromDetail(page.link);

      if (!uuid) {
        console.log(`[missav_stream] 未能提取 UUID：${page.link}`);
        continue;
      }

      if (seenUuids.has(uuid)) {
        console.log(`[missav_stream] UUID 已存在，跳过重复：${uuid}`);
        continue;
      }
      seenUuids.add(uuid);

      console.log(`[missav_stream] 提取到 UUID：${uuid}`);

      const streams = await buildStreamItems(uuid, code, page.link, page.version);
      allStreams.push(...streams);
    }

    return allStreams;
  } catch (e) {
    console.error("[missav_stream] loadResource 失败：", e?.message || e);
    return [];
  }
}