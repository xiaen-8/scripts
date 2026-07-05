WidgetMetadata = {
  id: "kanavtao",
  title: "kanavTao",
  description: "kanav网站聚合",
  author: "廿二日",
  site: "https://kanav.ad",
  version: "1.2.8",
  requiredVersion: "0.0.2",
  detailCacheDuration: 300,
  modules: [
    {
      id: "loadResource",
      title: "聚合",
      functionName: "loadResource",
      type: "stream",
      params: [],
    },
    {
      id: "loadChinese",
      title: "中文字幕",
      functionName: "loadChinese",
      cacheDuration: 3600,
      params: [
        { name: "sort_by", title: "排序", type: "enumeration", value: "time_add", enumOptions: [{ title: "最新发布", value: "time_add" }, { title: "最多观看", value: "hits" }, { title: "本周热榜", value: "hits_week" }] },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "loadCoded",
      title: "日韩有码",
      functionName: "loadCoded",
      cacheDuration: 3600,
      params: [
        { name: "sort_by", title: "排序", type: "enumeration", value: "time_add", enumOptions: [{ title: "最新发布", value: "time_add" }, { title: "最多观看", value: "hits" }, { title: "本周热榜", value: "hits_week" }] },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "loadUncoded",
      title: "日韩无码",
      functionName: "loadUncoded",
      cacheDuration: 3600,
      params: [
        { name: "sort_by", title: "排序", type: "enumeration", value: "time_add", enumOptions: [{ title: "最新发布", value: "time_add" }, { title: "最多观看", value: "hits" }, { title: "本周热榜", value: "hits_week" }] },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "loadDomestic",
      title: "国产AV",
      functionName: "loadDomestic",
      cacheDuration: 3600,
      params: [
        { name: "sort_by", title: "排序", type: "enumeration", value: "time_add", enumOptions: [{ title: "最新发布", value: "time_add" }, { title: "最多观看", value: "hits" }, { title: "本周热榜", value: "hits_week" }] },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "loadSelfie",
      title: "流出自拍",
      functionName: "loadSelfie",
      cacheDuration: 3600,
      params: [
        { name: "sort_by", title: "分类", type: "enumeration", value: "22", enumOptions: [{ title: "全部", value: "22" }, { title: "自拍泄密", value: "30" }, { title: "探花约炮", value: "31" }, { title: "主播录制", value: "32" }] },
        { name: "sort", title: "排序", type: "enumeration", value: "time_add", enumOptions: [{ title: "最新发布", value: "time_add" }, { title: "最多观看", value: "hits" }, { title: "本周热榜", value: "hits_week" }] },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "loadAnime",
      title: "动漫番剧",
      functionName: "loadAnime",
      cacheDuration: 3600,
      params: [
        { name: "sort_by", title: "分类", type: "enumeration", value: "20", enumOptions: [{ title: "全部", value: "20" }, { title: "里番", value: "25" }, { title: "泡面番", value: "26" }, { title: "Motion Anime", value: "27" }, { title: "3D动画", value: "28" }, { title: "同人作品", value: "29" }] },
        { name: "sort", title: "排序", type: "enumeration", value: "time_add", enumOptions: [{ title: "最新发布", value: "time_add" }, { title: "最多观看", value: "hits" }, { title: "本周热榜", value: "hits_week" }] },
        { name: "page", title: "页码", type: "page" },
      ],
    },
  ],
  search: {
    title: "搜索",
    functionName: "search",
    params: [
      { name: "keyword", title: "关键词", type: "input" },
      { name: "page", title: "页码", type: "page" },
    ],
  },
};

const BASE_URL = "https://kanav.ad";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function getHeaders(referer) {
  return {
    "User-Agent": UA,
    "Referer": referer || BASE_URL + "/",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "zh-TW,zh;q=0.9,en-US;q=0.8",
  };
}

function safeText(str) {
  return (str || "").replace(/\s+/g, " ").trim();
}

function normalizeUrl(href) {
  if (!href) return "";
  if (href.startsWith("http")) return href;
  if (href.startsWith("/")) return BASE_URL + href;
  return BASE_URL + "/" + href;
}

function buildCategoryUrl(typeId, sortBy, page) {
  const p = parseInt(page) || 1;
  const sort = sortBy || "time_add";
  if (p > 1) {
    return `${BASE_URL}/index.php/vod/show/by/${sort}/id/${typeId}/page/${p}.html`;
  }
  return `${BASE_URL}/index.php/vod/show/by/${sort}/id/${typeId}.html`;
}

function extractCode(title) {
  if (!title) return "";
  const m = title.toUpperCase().match(/[A-Z]{2,6}[-_]?\d{3,7}/);
  return m ? m[0].replace("_", "-") : "";
}

function b64decode(str) {
  try {
    if (typeof atob === "function") return atob(str);
  } catch (e) {}
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let output = "";
  str = str.replace(/[^A-Za-z0-9+/=]/g, "");
  let i = 0;
  while (i < str.length) {
    const e1 = chars.indexOf(str[i++]);
    const e2 = chars.indexOf(str[i++]);
    const e3 = chars.indexOf(str[i++]);
    const e4 = chars.indexOf(str[i++]);
    const c1 = (e1 << 2) | (e2 >> 4);
    const c2 = ((e2 & 15) << 4) | (e3 >> 2);
    const c3 = ((e3 & 3) << 6) | e4;
    output += String.fromCharCode(c1);
    if (e3 !== 64) output += String.fromCharCode(c2);
    if (e4 !== 64) output += String.fromCharCode(c3);
  }
  return output;
}

function extractPlayerJson(html) {
  const idx = html.indexOf("player_aaaa");
  if (idx === -1) return null;
  const eqIdx = html.indexOf("=", idx);
  if (eqIdx === -1) return null;
  const braceStart = html.indexOf("{", eqIdx);
  if (braceStart === -1) return null;
  let depth = 0, end = -1;
  const limit = Math.min(braceStart + 5000, html.length);
  for (let i = braceStart; i < limit; i++) {
    if (html[i] === "{") depth++;
    else if (html[i] === "}") {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }
  if (end === -1) return null;
  try {
    return JSON.parse(html.substring(braceStart, end + 1));
  } catch (e) {
    return null;
  }
}

function decryptUrl(playerData) {
  let url = playerData.url || "";
  if (!url) return "";
  const enc = parseInt(playerData.encrypt) || 0;
  try {
    if (enc === 1) {
      url = decodeURIComponent(url);
    } else if (enc === 2) {
      url = decodeURIComponent(b64decode(url));
    }
  } catch (e) {}
  url = url.replace(/\\\//g, "/");
  if (url.startsWith("//")) url = "https:" + url;
  return url;
}

async function fetchVideoUrl(link) {
  const { data } = await Widget.http.get(link, { headers: getHeaders(link) });
  const html = data || "";
  const playerData = extractPlayerJson(html);
  if (!playerData) throw new Error("player_aaaa not found");
  const videoUrl = decryptUrl(playerData);
  if (!videoUrl) throw new Error("url decrypt failed");
  return { html, videoUrl };
}

function parseListPage(html) {
  if (!html || !html.trim()) return [];
  const $ = Widget.html.load(html);
  const items = [];
  const seen = new Set();

  $("div.col-md-3.col-sm-6.col-xs-6").each((_, el) => {
    const $el = $(el);
    if (!$el.find("div.video-item").length) return;

    const $a = $el.find(".featured-content-image a").first();
    const href = $a.attr("href") || "";
    const link = normalizeUrl(href);
    if (!link || seen.has(link)) return;
    seen.add(link);

    const $img = $el.find("img.lazy").first();
    const poster = $img.attr("data-original") || $img.attr("src") || "";
    const title = safeText($el.find(".entry-title a").first().text())
      || safeText($img.attr("alt"))
      || "";
    if (!title) return;

    const durationText = safeText($el.find("span.model-view").first().text()) || undefined;

    items.push({
      id: link,
      type: "url",
      title,
      backdropPath: poster || undefined,
      durationText,
      link,
      mediaType: "movie",
      playerType: "system",
    });
  });

  return items;
}

async function fetchByUrl(targetUrl, page) {
  const p = parseInt(page) || 1;
  let url = targetUrl;
  if (p > 1 && url.includes("/vod/show/")) {
    url = url.replace(/\.html$/, "") + `/page/${p}.html`;
  } else if (p > 1 && url.includes("/vod/search.html")) {
    url = url.includes("?") ? `${url}&page=${p}` : `${url}?page=${p}`;
  }
  const { data } = await Widget.http.get(url, { headers: getHeaders() });
  return parseListPage(data || "");
}

async function fetchCategory(typeId, params = {}) {
  if (params.genreId) {
    return fetchByUrl(params.genreId, params.page);
  }
  if (params.peopleId) {
    return fetchByUrl(params.peopleId, params.page);
  }
  const url = buildCategoryUrl(typeId, params.sort_by, params.page);
  const { data } = await Widget.http.get(url, { headers: getHeaders() });
  return parseListPage(data || "");
}

async function loadChinese(params = {}) { return fetchCategory("1", params); }
async function loadCoded(params = {}) { return fetchCategory("2", params); }
async function loadUncoded(params = {}) { return fetchCategory("3", params); }
async function loadDomestic(params = {}) { return fetchCategory("4", params); }
async function loadSelfie(params = {}) {
  return fetchCategory(params.sort_by || "22", { ...params, sort_by: params.sort || "time_add" });
}
async function loadAnime(params = {}) {
  return fetchCategory(params.sort_by || "20", { ...params, sort_by: params.sort || "time_add" });
}

async function search(params = {}) {
  const keyword = (params.keyword || "").trim();
  if (!keyword) return [];
  const page = parseInt(params.page) || 1;
  let url = `${BASE_URL}/index.php/vod/search.html?wd=${encodeURIComponent(keyword)}&by=time_add`;
  if (page > 1) url += `&page=${page}`;
  const { data } = await Widget.http.get(url, { headers: getHeaders() });
  return parseListPage(data || "");
}

async function loadDetail(link) {
  try {
    link = link.split("#")[0];

    const { html, videoUrl } = await fetchVideoUrl(link);
    const $ = Widget.html.load(html);

    const title = safeText($(".video-box-ather h3").first().text())
      || safeText($('meta[property="og:title"]').attr("content"))
      || "Unknown";

    const code = extractCode(title);

    const cover = $("img.countext-img").first().attr("src")
      || $('meta[property="og:image"]').attr("content")
      || "";

    const genreItems = [];
    const seenGenres = new Set();
    $(".hr-style.hr-tags ~ a").each((_, el) => {
      const $a = $(el);
      const text = safeText($a.text());
      const href = $a.attr("href") || "";
      if (!text || seenGenres.has(text)) return;
      seenGenres.add(text);
      const id = href ? normalizeUrl(href) : `${BASE_URL}/index.php/vod/search.html?wd=${encodeURIComponent(text)}&by=time_add`;
      genreItems.push({ id, title: text });
    });

    const peoples = [];
    const seenPeoples = new Set();

    $(".hr-style.hr-actor ~ a").each((_, el) => {
      const $a = $(el);
      const text = safeText($a.text());
      if (!text || seenPeoples.has(text)) return;
      seenPeoples.add(text);
      const searchHref = `${BASE_URL}/index.php/vod/search.html?wd=${encodeURIComponent(text)}&by=time_add`;
      peoples.push({ id: searchHref, title: text, role: "演员" });
    });

    $(".hr-style.hr-categories ~ a").each((_, el) => {
      const $a = $(el);
      const titleAttr = safeText($a.attr("title") || "");
      const text = safeText($a.text());
      if (!text || seenPeoples.has(text)) return;
      let role = "";
      if (titleAttr.includes("制片公司")) role = "制片公司";
      else if (titleAttr.includes("发行公司")) role = "发行公司";
      else return;
      seenPeoples.add(text);
      const href = $a.attr("href") || "";
      const searchHref = (href && href !== "#")
        ? normalizeUrl(href)
        : `${BASE_URL}/index.php/vod/search.html?wd=${encodeURIComponent(text)}&by=time_add`;
      peoples.push({ id: searchHref, title: text, role });
    });

    const relatedItems = [];
    const seenRelated = new Set([link]);
    $(".post-list div.col-md-3.col-sm-6.col-xs-6").each((_, el) => {
      if (relatedItems.length >= 12) return false;
      const $el = $(el);
      if (!$el.find("div.video-item").length) return;

      const $titleA = $el.find(".entry-title a").first();
      const recHref = $titleA.attr("href") || "";
      const recLink = normalizeUrl(recHref);
      if (!recLink || seenRelated.has(recLink)) return;
      seenRelated.add(recLink);

      const recTitle = safeText($titleA.text()) || "相关视频";

      const $img = $el.find("img.lazy").first();
      const recPoster = $img.attr("data-original") || $img.attr("src") || "";

      const recDuration = safeText($el.find("span.model-view").first().text()) || undefined;

      const recDateRaw = safeText($el.find(".entry-title").contents().filter((_, n) => n.type === "text").last().text());
      const recDate = recDateRaw ? recDateRaw.replace(/\s/g, "").replace(/\//g, "-") : undefined;

      const descParts = [];
      if (recDuration) descParts.push(`时长: ${recDuration}`);
      if (recDate) descParts.push(`日期: ${recDate}`);

      relatedItems.push({
        id: recLink,
        type: "url",
        title: recTitle,
        backdropPath: recPoster || undefined,
        durationText: recDuration,
        releaseDate: recDate,
        description: descParts.length ? descParts.join(" | ") : undefined,
        mediaType: "movie",
        link: recLink,
      });
    });

    return {
      id: link,
      type: "url",
      title: code || title,
      description: title,
      backdropPath: cover || undefined,
      genreItems: genreItems.length > 0 ? genreItems : undefined,
      peoples: peoples.length > 0 ? peoples : undefined,
      relatedItems,
      mediaType: "movie",
      link,
      videoUrl,
      playerType: "ijk",
      customHeaders: {
        "User-Agent": UA,
        "Referer": BASE_URL + "/",
        "Origin": BASE_URL,
      },
    };

  } catch (e) {
    return {
      id: link,
      type: "url",
      title: "加载失败",
      description: e.message || "请求失败",
      mediaType: "movie",
      link,
    };
  }
}

async function loadResource(params = {}) {
  try {
    console.log("[KanAV loadResource] params:", JSON.stringify(params));

    const rawTitle = (params.title || "").trim();
    const code = extractCode(rawTitle);
    const keyword = code || rawTitle || (params.seriesName || "").trim();

    console.log("[KanAV loadResource] keyword:", keyword);
    if (!keyword) return [];

    const directLink = (params.link || "");
    let targetLink;
    if (directLink.includes("kanav.ad") && (directLink.includes("/vod/play/") || directLink.includes("/vod/detail/"))) {
      targetLink = directLink.split("#")[0];
      console.log("[KanAV loadResource] 直接使用link:", targetLink);
    } else {
      const searchUrl = `${BASE_URL}/index.php/vod/search.html?wd=${encodeURIComponent(keyword)}&by=time_add`;
      console.log("[KanAV loadResource] 搜索URL:", searchUrl);
      const { data: searchData } = await Widget.http.get(searchUrl, { headers: getHeaders() });
      const results = parseListPage(searchData || "");
      console.log("[KanAV loadResource] 搜索结果数量:", results.length);
      if (!results.length) return [];
      targetLink = results[0].link;
      console.log("[KanAV loadResource] targetLink:", targetLink);
    }

    const { videoUrl } = await fetchVideoUrl(targetLink);
    if (!videoUrl) return [];

    return [{
      name: keyword,
      description: "KanAV | 1080P",
      url: videoUrl,
      playerType: "ijk",
      customHeaders: {
        "User-Agent": UA,
        "Referer": BASE_URL + "/",
        "Origin": BASE_URL,
      },
    }];
  } catch (e) {
    console.log("[KanAV loadResource] 异常:", e.message);
    return [];
  }
}
