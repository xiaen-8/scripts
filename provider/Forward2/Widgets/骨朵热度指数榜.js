WidgetMetadata = {
  id: "guduo_hot",
  title: "骨朵",
  description: "每日更新的CN剧集、动漫、综艺、电影全网热度排行，名称来自骨朵源站，图片和影视元数据仅使用TMDB",
  author: "makka",
  site: "https://d2.guduomedia.com/",
  version: "1.4.2",
  requiredVersion: "0.0.1", 
  modules: [
    {
      id: "loadGuduoRank",
      title: "骨朵热榜",
      description: "查看每日各大平台影视热度榜",
      functionName: "loadGuduoRank",
      requiresWebView: false,
      cacheDuration: 86400, // 缓存 24 小时
      params: [
        {
          name: "category",
          title: "榜单分类",
          type: "enumeration",
          value: "剧集", 
          enumOptions: [
            { title: "陸劇", value: "剧集" },
            { title: "國漫", value: "动漫" },
            { title: "綜藝", value: "综艺" },
            { title: "電影", value: "电影" }
          ]
        }
      ]
    }
  ]
};

const GUDUO_BASE_URL = "https://d2.guduomedia.com";
const GUDUO_CATEGORY_MAP = {
  "剧集": "NETWORK_DRAMA",
  "动漫": "ALL_ANIME",
  "综艺": "NETWORK_VARIETY",
  "电影": "NETWORK_MOVIE"
};
const GUDUO_CATEGORY_LABELS = {
  NETWORK_DRAMA: "剧集",
  ALL_ANIME: "动漫",
  NETWORK_VARIETY: "综艺",
  NETWORK_MOVIE: "电影"
};
const GUDUO_TMDB_CACHE = new Map();
const GUDUO_MAX_REQUEST_ATTEMPTS = 3;

function getResponseBody(response) {
  if (!response) throw new Error("骨朵源站返回空响应");
  if (typeof response.data === "string") {
    const raw = response.data.replace(/^\uFEFF/, "").trim();
    if (!raw) throw new Error("骨朵源站返回空响应");
    if (raw[0] === "<") {
      const titleMatch = raw.match(/<title[^>]*>([^<]*)<\/title>/i);
      const title = titleMatch && titleMatch[1] ? `: ${titleMatch[1].trim()}` : "";
      throw new Error(`骨朵源站返回 HTML${title}，可能是临时拦截或网关错误`);
    }
    try {
      return JSON.parse(raw);
    } catch (error) {
      throw new Error(`骨朵源站返回了无法解析的 JSON: ${error.message || error}`);
    }
  }
  if (typeof response.data !== "object") {
    throw new Error("骨朵源站返回了不支持的数据格式");
  }
  return response.data;
}

function waitForGuduoRetry(attempt) {
  return new Promise((resolve) => setTimeout(resolve, 300 * attempt));
}

function shiftDate(date, days) {
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  parsed.setUTCDate(parsed.getUTCDate() + days);
  return parsed.toISOString().slice(0, 10);
}

async function getGuduoLatestDate() {
  let lastError = null;
  for (let attempt = 1; attempt <= GUDUO_MAX_REQUEST_ATTEMPTS; attempt += 1) {
    try {
      const response = await Widget.http.get(
        `${GUDUO_BASE_URL}/m/v3/billboard/configDay?t=${Date.now()}`,
        { timeout: 10000 }
      );
      const body = getResponseBody(response);
      const date = body && body.data && body.data.DAILY && body.data.DAILY.endDay;
      if (!date) throw new Error("骨朵源站未返回可用榜单日期");
      return date;
    } catch (error) {
      lastError = error;
      if (attempt < GUDUO_MAX_REQUEST_ATTEMPTS) {
        console.warn(`[骨朵榜单] 日期接口失败，准备重试: ${error.message || error}`);
        await waitForGuduoRetry(attempt);
      }
    }
  }
  throw lastError || new Error("骨朵源站日期接口请求失败");
}

async function getGuduoRankItems(category, date) {
  let lastError = null;
  for (let attempt = 1; attempt <= GUDUO_MAX_REQUEST_ATTEMPTS; attempt += 1) {
    try {
      const response = await Widget.http.get(
        `${GUDUO_BASE_URL}/m/v3/billboard/list?type=DAILY&category=${encodeURIComponent(category)}&date=${encodeURIComponent(date)}&attach=gdi&orderTitle=gdi&platformId=0&t=${Date.now()}`,
        { timeout: 10000 }
      );
      const body = getResponseBody(response);
      if (!body || body.code !== 0 || !Array.isArray(body.data)) {
        throw new Error(`骨朵榜单接口返回异常: ${category}`);
      }
      return body.data.slice(0, 20);
    } catch (error) {
      lastError = error;
      if (attempt < GUDUO_MAX_REQUEST_ATTEMPTS) {
        console.warn(`[骨朵榜单] ${date} 榜单请求失败，准备重试: ${error.message || error}`);
        await waitForGuduoRetry(attempt);
      }
    }
  }
  throw lastError || new Error(`骨朵榜单请求失败: ${category}`);
}

function getMediaType(category) {
  return category === "NETWORK_MOVIE" ? "movie" : "tv";
}

function formatReleaseDate(value) {
  if (!value) return undefined;
  if (typeof value === "number") {
    return new Date(value).toISOString().slice(0, 10);
  }
  return String(value);
}

function normalizeTitle(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[\s\u3000·•:：,，。.!！?？'"“”‘’()（）\[\]【】{}《》_-]+/g, "");
}

function stripTmdbSeasonSuffix(title) {
  let value = String(title || "").trim();
  const suffixPattern = /\s*(?:第\s*[0-9０-９一二三四五六七八九十百]+\s*(?:季|部|篇|章)|[0-9０-９]+\s*(?:季|部|篇)|[Ss]\s*\d+|Season\s*\d+|年番|完结季|完結季|最终季|最終季|特别篇|特別篇|番外篇|特别版|特別版)\s*$/iu;
  let previous = "";
  while (value && value !== previous) {
    previous = value;
    value = value.replace(suffixPattern, "").trim();
  }
  return value;
}

function getTitleCandidates(title) {
  const candidates = [];
  const addCandidate = (value) => {
    const candidate = String(value || "").trim();
    if (candidate && !candidates.includes(candidate)) candidates.push(candidate);
  };
  addCandidate(title);
  addCandidate(stripTmdbSeasonSuffix(title));
  return candidates;
}

function getTmdbId(value) {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return value;
  }
  if (typeof value === "string" && /^\d+$/.test(value)) {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
  }
  return null;
}

async function searchTmdbQuery(title, category) {
  if (!title || !Widget.tmdb || typeof Widget.tmdb.get !== "function") {
    return null;
  }

  const mediaType = getMediaType(category);
  const cacheKey = `${mediaType}:${normalizeTitle(title)}`;
  if (GUDUO_TMDB_CACHE.has(cacheKey)) {
    return GUDUO_TMDB_CACHE.get(cacheKey);
  }
  const endpoint = mediaType === "movie" ? "search/movie" : "search/tv";
  try {
    const response = await Widget.tmdb.get(endpoint, {
      params: {
        query: title,
        language: "zh-CN",
        page: 1,
        include_adult: false
      }
    });
    const results = response && Array.isArray(response.results) ? response.results : [];
    if (results.length === 0) {
      GUDUO_TMDB_CACHE.set(cacheKey, null);
      return null;
    }

    const normalizedSourceTitle = normalizeTitle(title);
    const exact = results.find((result) => {
      return [result.title, result.name, result.original_title, result.original_name].some(
        (value) => normalizeTitle(value) === normalizedSourceTitle
      );
    });
    const match = exact || null;
    GUDUO_TMDB_CACHE.set(cacheKey, match);
    return match;
  } catch (error) {
    console.warn(`[骨朵榜单] TMDB 搜索失败: ${title}`, error.message || error);
    return null;
  }
}

async function searchTmdbItem(title, category) {
  for (const candidate of getTitleCandidates(title)) {
    const match = await searchTmdbQuery(candidate, category);
    if (match) return match;
  }
  return null;
}

async function searchTmdbItems(items, category) {
  const results = new Array(items.length);
  let nextIndex = 0;
  const workerCount = Math.min(4, items.length);

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await searchTmdbItem(items[index].name, category);
    }
  }

  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}

function toGuduoVideoItem(item, tmdbItem, category, rank) {
  if (!tmdbItem) return null;

  const sourceTitle = item.name || `骨朵榜单第 ${rank} 名`;
  const mediaType = getMediaType(category);
  const tmdbId = tmdbItem ? getTmdbId(tmdbItem.id) : null;

  if (!tmdbId) return null;

  const tmdbOverview = tmdbItem.overview || "";
  const releaseValue = mediaType === "movie"
    ? tmdbItem.release_date
    : tmdbItem.first_air_date;
  const result = {
    id: tmdbId,
    type: "tmdb",
    mediaType,
    title: sourceTitle,
    description: tmdbOverview,
    posterPath: tmdbItem.poster_path || "",
    backdropPath: tmdbItem.backdrop_path || "",
    releaseDate: formatReleaseDate(releaseValue),
    genreTitle: GUDUO_CATEGORY_LABELS[category]
  };
  if (tmdbItem.vote_average != null) {
    result.rating = Number(tmdbItem.vote_average);
  }
  return result;
}

async function loadGuduoRank(params = {}) {
  try {
    const { category = "剧集" } = params;
    const sourceCategory = GUDUO_CATEGORY_MAP[category] || GUDUO_CATEGORY_MAP["剧集"];
    const latestDate = await getGuduoLatestDate();

    console.log(`[骨朵榜单] 开始加载: ${category} / ${latestDate}`);
    let items = [];
    let dataDate = latestDate;
    let lastRankError = null;
    for (let offset = 0; offset <= 3 && items.length === 0; offset += 1) {
      dataDate = shiftDate(latestDate, -offset);
      if (!dataDate) break;
      try {
        items = await getGuduoRankItems(sourceCategory, dataDate);
        lastRankError = null;
      } catch (error) {
        lastRankError = error;
        console.warn(`[骨朵榜单] ${dataDate} 无法读取，继续尝试更早日期:`, error.message || error);
      }
    }
    if (items.length === 0) {
      const suffix = lastRankError ? `，最近错误: ${lastRankError.message || lastRankError}` : "";
      throw new Error(`骨朵榜单连续 4 天无数据: ${sourceCategory}${suffix}`);
    }
    if (dataDate !== latestDate) {
      console.warn(`[骨朵榜单] ${latestDate} 无数据，回退到 ${dataDate}`);
    }
    const tmdbItems = await searchTmdbItems(items, sourceCategory);
    const results = items
      .map((item, index) => toGuduoVideoItem(item, tmdbItems[index], sourceCategory, index + 1))
      .filter(Boolean);
    const unmatched = items
      .filter((item, index) => !tmdbItems[index])
      .map((item) => item.name)
      .filter(Boolean);
    if (unmatched.length > 0) {
      console.warn(`[骨朵榜单] ${unmatched.length} 条未匹配 TMDB，已跳过: ${unmatched.join("、")}`);
    }
    if (results.length === 0) {
      throw new Error(`骨朵榜单没有匹配到 TMDB 条目: ${sourceCategory}`);
    }

    console.log(`[骨朵榜单] 成功加载 ${results.length} 条数据`);
    return results;

  } catch (error) {
    console.error("[骨朵榜单] 请求发生错误:", error);
    throw error;
  }
}
