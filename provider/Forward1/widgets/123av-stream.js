// ==================== 123AV Stream Source v1.0 ====================
// 用途：作为 Forward 的 stream source，把 123AV 播放源聚合到其他视频详情页下方。
//
// 策略：
// - 从当前详情页 params 中提取番号。
// - 直接访问 123AV 尝试不同版本的 slug（有码/无码流出/中文字幕）。
// - 有效版本提取 surritCode（从 x-data 解析），相同 surritCode 去重。
// - 调用 123av.com/stream API 获取可播放 m3u8 地址。
// - 返回 stream items，name 带版本标识。

var WidgetMetadata = {
  id: "123av_stream",
  title: "123AV Stream",
  description: "通过番号匹配 123AV 播放源，并聚合到当前视频详情页",
  author: "meeowzzz",
  site: "https://123av.com",
  version: "1.0.1",
  requiredVersion: "0.0.1",
  modules: [
    {
      id: "loadResource",
      title: "123AV 播放源",
      description: "根据当前视频信息匹配 123AV 播放链接",
      functionName: "loadResource",
      type: "stream",
      params: []
    }
  ]
};

// ==================== 常量定义 ====================
const BASE = "https://123av.com";
const REQUEST_TIMEOUT = 15000;

const DEFAULT_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
  "Referer": BASE + "/",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
  "Connection": "keep-alive"
};

const PLAY_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
  "Referer": BASE + "/"
};

// 版本 slug 后缀列表（按优先级排序）
const VERSION_SLUGS = [
  { suffix: "", version: "有码" },
  { suffix: "-uncensored-leaked", version: "无码破解" },
  { suffix: "-chinese-subtitle", version: "中文字幕" }
];

// ==================== HTTP 封装 ====================
async function httpGet(url, options = {}) {
  const finalOptions = {
    headers: { ...DEFAULT_HEADERS, ...(options.headers || {}) },
    timeout: options.timeout || REQUEST_TIMEOUT
  };

  const resp = await Widget.http.get(url, finalOptions);
  return resp;
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
  if (href.startsWith("/")) return BASE + href;
  return BASE + "/" + href;
}

// ==================== 番号提取（同 missav-stream.js） ====================
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
  const priorityCandidates = [
    params.code,
    params.videoId,
    params.number,
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

  for (const value of priorityCandidates) {
    const code = extractSearchCode(value, { allowPureNumeric: true });
    if (code) return code;
  }

  const allStrings = collectStringValues(params);

  for (const value of allStrings) {
    const code = extractSearchCode(value, { allowPureNumeric: false });
    if (code) return code;
  }

  return "";
}

// ==================== 版本发现 ====================
function getVersionFromSlug(slug) {
  if (!slug) return "有码";
  if (slug.includes("-chinese-subtitle")) return "中文字幕";
  if (slug.includes("-uncensored-leaked")) return "无码破解";
  return "有码";
}

async function discoverVersions(code) {
  // 清理 code 中可能带的多余后缀，得到干净的 base slug
  const baseSlug = code.toLowerCase()
    .replace(/-uncensored-leaked/gi, "")
    .replace(/-chinese-subtitle/gi, "")
    .replace(/-uncensored/gi, "")
    .trim();

  const foundVersions = [];

  for (const vs of VERSION_SLUGS) {
    const slug = baseSlug + vs.suffix;
    const url = `${BASE}/en/v/${encodeURIComponent(slug)}`;

    try {
      const resp = await httpGet(url, { timeout: 5000 });

      if (resp && resp.statusCode === 200) {
        const html = String(resp.data || "");

        // 确认是有效的视频页面（包含 player x-data）
        if (html.includes('x-data="player') || html.includes("surrit.store")) {
          foundVersions.push({
            slug,
            url,
            html,
            version: vs.version
          });
          console.log(`[123av_stream] 发现版本：${vs.version} → ${url}`);
        }
      }
    } catch (e) {
      // 404 或其他错误，跳过
      console.log(`[123av_stream] 版本不可用：${vs.version} → ${url}`);
    }
  }

  // 按优先级排序：中文字幕 > 无码破解 > 有码
  const priority = { "中文字幕": 0, "无码破解": 1, "有码": 2 };
  foundVersions.sort((a, b) => (priority[a.version] ?? 99) - (priority[b.version] ?? 99));

  return foundVersions;
}

// ==================== 播放地址获取 ====================
function extractSurritCodeFromHtml(html) {
  if (!html) return "";

  // 从 x-data="player(JSON.parse('...'))" 中提取 embedUrl
  const playerMatch = html.match(/x-data="player\(JSON\.parse\('([^']+)'\)/);
  if (!playerMatch || !playerMatch[1]) return "";

  try {
    const jsonStr = playerMatch[1]
      .split("\\u0022").join('"')
      .split("\\\\\\/").join("/");

    const parsed = JSON.parse(jsonStr);
    if (!parsed || !parsed.length || !parsed[0].url) return "";

    const embedUrl = parsed[0].url;
    const codeMatch = embedUrl.match(/\/e\/([a-z0-9_]+)/i);
    return codeMatch ? codeMatch[1] : "";
  } catch (e) {
    console.warn("[123av_stream] 解析 x-data 失败：", e?.message || e);
    return "";
  }
}

async function getPlayableUrl(surritCode) {
  if (!surritCode) return "";

  try {
    const apiUrl = `${BASE}/stream?id=${encodeURIComponent(surritCode)}`;
    const resp = await Widget.http.get(apiUrl, {
      headers: {
        "User-Agent": DEFAULT_HEADERS["User-Agent"],
        "Referer": `${BASE}/e/${surritCode}`
      },
      timeout: 8000
    });

    if (!resp || !resp.data) return "";

    const data = typeof resp.data === "string" ? JSON.parse(resp.data) : resp.data;
    if (data.status === "ok" && data.media && data.media.stream) {
      return data.media.stream;
    }

    return "";
  } catch (e) {
    console.warn("[123av_stream] 获取播放地址失败：", e?.message || e);
    return "";
  }
}

// ==================== Stream 构建 ====================
function buildStreamItem(name, description, url) {
  return {
    name,
    description,
    url,
    customHeaders: PLAY_HEADERS
  };
}

async function buildStreamItems(surritCode, code, version) {
  const versionTag = version && version !== "有码" ? `[${version}]` : "";
  const verDesc = version && version !== "有码" ? `\n版本：${version}` : "";

  const playableUrl = await getPlayableUrl(surritCode);
  if (!playableUrl) return [];

  return [buildStreamItem(
    `${versionTag}${code}`,
    `番号：${code}\n来源：123AV${verDesc}`,
    playableUrl
  )];
}

// ==================== Stream Source 入口 ====================
async function loadResource(params = {}) {
  try {
    const code = extractCodeFromParams(params);

    if (!code) {
      console.log("[123av_stream] 当前视频信息中未找到番号，跳过 123AV 匹配");
      return [];
    }

    console.log(`[123av_stream] 提取到番号：${code}`);

    // 发现所有可用版本
    const versions = await discoverVersions(code);

    if (!versions.length) {
      console.log(`[123av_stream] 未找到可用版本：${code}`);
      return [];
    }

    console.log(`[123av_stream] 发现 ${versions.length} 个版本：${versions.map(v => v.version).join(", ")}`);

    // 遍历所有版本，提取 surritCode 并去重
    const seenCodes = new Set();
    const allStreams = [];

    for (const v of versions) {
      console.log(`[123av_stream] 处理版本：${v.version} → ${v.slug}`);

      const surritCode = extractSurritCodeFromHtml(v.html);
      if (!surritCode) {
        console.log(`[123av_stream] 未能提取 surritCode：${v.slug}`);
        continue;
      }

      if (seenCodes.has(surritCode)) {
        console.log(`[123av_stream] surritCode 已存在，跳过重复：${surritCode}`);
        continue;
      }
      seenCodes.add(surritCode);

      console.log(`[123av_stream] 提取到 surritCode：${surritCode}`);

      const streams = await buildStreamItems(surritCode, code, v.version);
      allStreams.push(...streams);
    }

    return allStreams;
  } catch (e) {
    console.error("[123av_stream] loadResource 失败：", e?.message || e);
    return [];
  }
}
