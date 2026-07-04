const SITE = "https://ddys.app";
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
const PLAY_HEADERS = { "User-Agent": UA, "Referer": SITE + "/", "Origin": SITE };

// ==================== Widget 元数据（完全按照欧乐分类进行更改） ====================
var WidgetMetadata = {
  id: "https://ddys.app?mod=resource",
  title: "低调影视",
  description: "低调影视(ddys.app) 分类浏览与播放源返回，供 Forward 框架使用",
  author: "TG@ZenMoFiShi",
  site: "https://t.me/Nzmgs",
  version: "2.0.0",
  requiredVersion: "0.0.1",
  globalParams: [
    {
      name: "cookie",
      title: "ddys_protect Cookie",
      type: "input",
      description: "在浏览器登录 ddys.app 通过人机验证后，复制 ddys_protect_xxx=值 整段填入（含名）。不填将被站点拦截。",
      value: ""
    }
  ],
  search: { 
    title: "搜索", 
    functionName: "searchOleCompatible", 
    params: [ { name: "wd", title: "关键词", type: "input", value: "" }, { name: "pg", title: "页码", type: "page", value: "1" } ] 
  },
  modules: [
    { id: "ddys_movie", title: "电影", functionName: "loadMovieList", type: "video", cacheDuration: 3600, params: [ { name: "area", title: "地区（低调暂不支持，默认全部）", type: "enumeration", value: "0", enumOptions: [ { title: "全部", value: "0" } ] }, { name: "sort_by", title: "榜单类型", type: "enumeration", value: "hot", enumOptions: [ { title: "最新发布", value: "update" } ] }, { name: "page", title: "页码", type: "page", startPage: 1 } ] },
    { id: "ddys_tv", title: "剧集", functionName: "loadTvList", type: "video", cacheDuration: 3600, params: [ { name: "area", title: "地区（低调暂不支持，默认全部）", type: "enumeration", value: "0", enumOptions: [ { title: "全部", value: "0" } ] }, { name: "sort_by", title: "榜单类型", type: "enumeration", value: "hot", enumOptions: [ { title: "最新发布", value: "update" } ] }, { name: "page", title: "页码", type: "page", startPage: 1 } ] },
    { id: "ddys_variety", title: "综艺", functionName: "loadVarietyList", type: "video", cacheDuration: 3600, params: [ { name: "area", title: "地区（低调暂不支持，默认全部）", type: "enumeration", value: "0", enumOptions: [ { title: "全部", value: "0" } ] }, { name: "sort_by", title: "榜单类型", type: "enumeration", value: "hot", enumOptions: [ { title: "最新发布", value: "update" } ] }, { name: "page", title: "页码", type: "page", startPage: 1 } ] },
    { id: "ddys_anime", title: "动漫", functionName: "loadAnimeList", type: "video", cacheDuration: 3600, params: [ { name: "area", title: "地区（低调暂不支持，默认全部）", type: "enumeration", value: "0", enumOptions: [ { title: "全部", value: "0" } ] }, { name: "sort_by", title: "榜单类型", type: "enumeration", value: "hot", enumOptions: [ { title: "最新发布", value: "update" } ] }, { name: "page", title: "页码", type: "page", startPage: 1 } ] },
    { id: "ddys_short", title: "短剧", functionName: "loadShortList", type: "video", cacheDuration: 3600, params: [ { name: "area", title: "地区（低调暂不支持，默认全部）", type: "enumeration", value: "0", enumOptions: [ { title: "全部", value: "0" } ] }, { name: "sort_by", title: "榜单类型", type: "enumeration", value: "hot", enumOptions: [ { title: "最新发布", value: "update" } ] }, { name: "page", title: "页码", type: "page", startPage: 1 } ] },
    { id: "loadResource", title: "低调影视播放源", description: "低调影视搜索与播放源返回", functionName: "loadResource", type: "stream", cacheDuration: 120, params: [] }
  ]
};

// 低调影视对应的实际路径映射（根据常规ddys站点的分类别名配置）
const CATEGORY_PATH = { movie: "movie", tv: "joofee", variety: "zongyi", anime: "anime", short: "duanju" };
const CATEGORY_NAME = { movie: "电影", tv: "剧集", variety: "综艺", anime: "动漫", short: "短剧" };

function toInt(v, d) {
  const n = parseInt(v, 10);
  return isNaN(n) ? (d || 0) : n;
}

function buildHeaders(params, extra) {
  const h = { "User-Agent": UA, "Referer": SITE + "/" };
  const ck = String((params && params.cookie) || "").trim();
  if (ck) h["Cookie"] = ck;
  return Object.assign(h, extra || {});
}

async function httpGet(url, params, extra) {
  let lastErr;
  for (let t = 0; t < 3; t++) {
    try {
      const res = await Widget.http.get(url, { headers: buildHeaders(params, extra) });
      return res;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("http fail: " + url);
}

function normalizeName(text) {
  return String(text || "")
    .replace(/\s+/g, "")
    .replace(/[：:·・,，.。!！?？\-—_'’"“”()（）\[\]【】]/g, "")
    .toLowerCase();
}

function stripTitleMeta(text) {
  return String(text || "")
    .replace(/[\(（][^\)）]*[\)）]/g, "")
    .replace(/第[0-9一二三四五六七八九十]+季/g, "")
    .replace(/season\s*\d+/ig, "")
    .replace(/\bs\d{1,2}\b/ig, "")
    .trim();
}

const CN_NUM = { "一": 1, "二": 2, "三": 3, "四": 4, "五": 5, "六": 6, "七": 7, "八": 8, "九": 9, "十": 10 };
function cnToNum(s) {
  if (/^\d+$/.test(s)) return parseInt(s, 10);
  if (s === "十") return 10;
  if (s.length === 2 && s[0] === "十") return 10 + (CN_NUM[s[1]] || 0);
  if (s.length === 2 && s[1] === "十") return (CN_NUM[s[0]] || 0) * 10;
  return CN_NUM[s] || 0;
}

function extractSeasonFromText(text) {
  const t = String(text || "");
  let m = t.match(/第\s*([0-9一二三四五六七八九十]+)\s*季/);
  if (m) return cnToNum(m[1]);
  m = t.match(/season\s*(\d+)/i);
  if (m) return parseInt(m[1], 10);
  m = t.match(/\bs(\d{1,2})\b/i);
  if (m) return parseInt(m[1], 10);
  return null;
}

// ---- 搜索与列表解析公共核心 ----
function parseSearchResults(html) {
  const out = [];
  // 匹配低调影视经典的列表封面图片、标题以及超链接结构
  const re = /<h2 class="post-title"><a href="(https:\/\/ddys\.app\/[a-z0-9-]+\/)"[^>]*rel="bookmark">([^<]+)<\/a>/g;
  // 用于尝试匹配封面图的附加正则（如果低调页面上有配备）
  const imgRe = /<img[^>]+src="([^"]+)"/g;
  
  let m;
  while ((m = re.exec(html))) {
    out.push({ url: m[1], rawTitle: m[2].trim() });
  }
  return out;
}

async function searchSite(keyword, params) {
  const url = SITE + "/?s=" + encodeURIComponent(keyword);
  const res = await httpGet(url, params);
  const html = (res && res.data) || "";
  if (/ddys-protect-panel/.test(html)) {
    throw new Error("被 ddys-protect 拦截：请在模块参数填写有效的 ddys_protect Cookie");
  }
  return parseSearchResults(html);
}

// 统一封装给全局搜索调用的函数
async function searchOleCompatible(params = {}) {
  const keyword = params.wd || params.keyword || "";
  if (!keyword.trim()) throw new Error("请输入搜索关键词");
  const results = await searchSite(keyword, params);
  if (!results.length) return [{ id: "empty", type: "text", title: "未找到相关影片，请尝试其他关键词" }];
  
  return results.map(item => ({
    id: "ddys_detail_" + item.url,
    type: "url",
    title: item.rawTitle,
    posterPath: "", 
    description: "低调影视 · 资源结果",
    link: item.url
  }));
}

// ==================== 统一的低调分类浏览函数（实现欧乐对应的加载模式） ====================
async function fetchCategoryList(cateType, page, params) {
  const slug = CATEGORY_PATH[cateType] || "movie";
  // 低调影视常规分页路径为 /category/分类别名/page/页码
  const url = page > 1 ? `${SITE}/category/${slug}/page/${page}` : `${SITE}/category/${slug}/`;
  
  try {
    const res = await httpGet(url, params);
    const html = (res && res.data) || "";
    if (/ddys-protect-panel/.test(html)) {
      return [{ id: "empty", type: "text", title: "被 ddys-protect 拦截，请在设置中配置有效 Cookie" }];
    }
    
    const list = parseSearchResults(html);
    const categoryName = CATEGORY_NAME[cateType] || "影视";
    
    if (list.length === 0 && page === 1) {
      return [{ id: "empty", type: "text", title: "暂无数据，请检查网络或Cookie参数" }];
    }
    
    return list.map((item, idx) => ({
      id: "ddys_" + cateType + "_" + idx + "_" + page,
      type: "url",
      title: item.rawTitle,
      posterPath: "", // 低调列表页不一定直接暴露标准格式封面图，保持轻量
      backdropPath: "",
      releaseDate: "",
      description: categoryName + " · 最新发布",
      genreTitle: categoryName,
      link: item.url // 直接传导详情页地址给 Forward 播放解析
    }));
  } catch (e) {
    return [{ id: "empty", type: "text", title: "请求失败: " + e.message }];
  }
}

// 对应欧乐模块各分类注册的调用函数
function loadMovieList(params) { const p = (params && params.page) ? parseInt(params.page) : 1; return fetchCategoryList("movie", p, params); }
function loadTvList(params) { const p = (params && params.page) ? parseInt(params.page) : 1; return fetchCategoryList("tv", p, params); }
function loadVarietyList(params) { const p = (params && params.page) ? parseInt(params.page) : 1; return fetchCategoryList("variety", p, params); }
function loadAnimeList(params) { const p = (params && params.page) ? parseInt(params.page) : 1; return fetchCategoryList("anime", p, params); }
function loadShortList(params) { const p = (params && params.page) ? parseInt(params.page) : 1; return fetchCategoryList("short", p, params); }

// ==================== 详情播放列表与串流定位（核心逻辑保持原样不作任何改动） ====================
function parsePlaylist(html) {
  const i = String(html || "").indexOf('"playlistType"');
  if (i < 0) return null;
  const s = html.lastIndexOf("{", i);
  if (s < 0) return null;
  let depth = 0, end = -1;
  for (let k = s; k < html.length; k++) {
    const c = html[k];
    if (c === "{") depth++;
    else if (c === "}") { depth--; if (depth === 0) { end = k + 1; break; } }
  }
  if (end < 0) return null;
  try { return JSON.parse(html.slice(s, end)); } catch (e) { return null; }
}

async function loadPlaylist(detailUrl, params) {
  const res = await httpGet(detailUrl, params);
  const html = (res && res.data) || "";
  if (/ddys-protect-panel/.test(html)) {
    throw new Error("被 ddys-protect 拦截：请在模块参数填写有效的 ddys_protect Cookie");
  }
  return parsePlaylist(html);
}

function scoreResult(item, wantBaseNorm, wantSeason) {
  let score = 0;
  const rawBase = stripTitleMeta(item.rawTitle);
  const baseNorm = normalizeName(rawBase);
  if (baseNorm === wantBaseNorm) score += 320;
  else if (baseNorm.indexOf(wantBaseNorm) >= 0 || wantBaseNorm.indexOf(baseNorm) >= 0) score += 160;
  else return -1;
  return score;
}

function pickBestResult(results, wantBaseNorm, wantSeason) {
  let best = null, bestScore = -Infinity;
  for (const it of results) {
    const sc = scoreResult(it, wantBaseNorm, wantSeason);
    if (sc > bestScore) { bestScore = sc; best = it; }
  }
  return bestScore >= 0 ? best : null;
}

function pickTrack(playlist, wantSeason, wantEpisode, isMovie) {
  if (!playlist || !Array.isArray(playlist.seasons) || !playlist.seasons.length) return null;
  const seasons = playlist.seasons;

  if (isMovie) {
    const s = seasons[0];
    return (s && s.tracks && s.tracks[0]) || null;
  }

  let season = null;
  if (wantSeason > 0) {
    season = seasons.find(s => toInt(s.season, -1) === wantSeason) || null;
    if (!season) {
      season = seasons.find(s => extractSeasonFromText(s.title) === wantSeason) || null;
    }
  }
  if (!season) {
    season = seasons.length === 1 ? seasons[0] : (seasons.find(s => toInt(s.season, -1) === 1) || seasons[0]);
  }

  const tracks = (season && season.tracks) || [];
  if (!tracks.length) return null;

  if (wantEpisode > 0) {
    let tr = tracks.find(t => toInt(t.episode, -1) === wantEpisode);
    if (tr) return tr;
    tr = tracks.find(t => toInt(t.title, -1) === wantEpisode);
    if (tr) return tr;
    return null;
  }
  return tracks[0];
}

function buildVideoUrl(track) {
  const server = String(track.server || "v3").trim();
  let src = String(track.src || "");
  if (!src) return null;
  if (!src.startsWith("/")) src = "/" + src;
  return "https://" + server + ".ddys.app" + src;
}

async function loadResource(params) {
  const rawSeries = String(params.seriesName || params.title || "").trim();
  const rawEpisodeName = String(params.episodeName || "").trim();
  const isMovie = String(params.type || "") === "movie";
  const wantSeason = toInt(params.season, 0);
  const wantEpisode = toInt(params.episode, 0);

  const baseTitle = stripTitleMeta(rawSeries) || rawSeries || rawEpisodeName;
  if (!baseTitle) return [];
  const wantBaseNorm = normalizeName(baseTitle);

  // 1. 搜索
  let results = await searchSite(baseTitle, params);
  if (!results.length && rawSeries && rawSeries !== baseTitle) {
    results = await searchSite(rawSeries, params);
  }
  if (!results.length) return [];

  // 2. 选剧
  const best = pickBestResult(results, wantBaseNorm, wantSeason);
  if (!best) return [];

  // 3. 详情播放列表
  const playlist = await loadPlaylist(best.url, params);
  if (!playlist) return [];

  // 4. 定位 季/集
  const track = pickTrack(playlist, wantSeason, wantEpisode, isMovie || playlist.playlistType === "movie");
  if (!track) return [];

  const url = buildVideoUrl(track);
  if (!url) return [];

  // 5. 返回播放源（带防盗链 Referer 头）
  const seasonLabel = wantSeason > 0 ? ("S" + wantSeason) : "";
  const epLabel = wantEpisode > 0 ? ("E" + wantEpisode) : "";
  return [
    {
      name: "低调影视 " + (seasonLabel + epLabel || "正片"),
      description: [
        best.rawTitle,
        "线路：" + (track.server || "v3"),
        seasonLabel || epLabel ? ("定位：" + seasonLabel + epLabel) : ""
      ].filter(Boolean).join("\n"),
      url: url,
      customHeaders: PLAY_HEADERS,
      headers: PLAY_HEADERS
    }
  ];
}
