WidgetMetadata = {
  id: "forward.1porn",
  title: "1Porn.TV",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "1Porn.TV 公开目录、搜索、详情与播放源",
  author: "Codex",
  site: "https://www.1porn.tv",
  icon: "https://www.1porn.tv/favicon.ico",
  detailCacheDuration: 60,
  modules: [
    listModule("latest", "最新", "https://www.1porn.tv/latest-updates/"),
    listModule("popular", "最多观看", "https://www.1porn.tv/most-popular/"),
    listModule("popularWeek", "本周热门", "https://www.1porn.tv/most-popular/week/"),
    listModule("topRated", "最高评分", "https://www.1porn.tv/top-rated/"),
    {
      id: "categories",
      title: "分类浏览",
      functionName: "loadCategory",
      cacheDuration: 1800,
      requiresWebView: false,
      params: [
        {
          name: "cat",
          title: "分类",
          type: "enumeration",
          value: "milf",
          enumOptions: [
            { title: "MILF", value: "milf" },
            { title: "Amateur", value: "amateur" },
            { title: "Anal", value: "anal" },
            { title: "Asian", value: "asian" },
            { title: "Big Ass", value: "big-ass" },
            { title: "Big Tits", value: "big-tits" },
            { title: "Blowjob", value: "blowjob" },
            { title: "Brunette", value: "brunette" },
            { title: "Creampie", value: "creampie" },
            { title: "Ebony", value: "ebony" },
            { title: "Facial", value: "facial" },
            { title: "Interracial", value: "interracial" },
            { title: "Lesbian", value: "lesbian" },
            { title: "Mature", value: "mature" },
            { title: "POV", value: "pov" },
            { title: "Public", value: "public" },
            { title: "Massage", value: "massage" },
            { title: "BDSM", value: "bdsm" },
            { title: "Fetish", value: "fetish" },
            { title: "Cosplay", value: "cosplay" }
          ]
        },
        sortParam(),
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "sites",
      title: "站点浏览",
      functionName: "loadSite",
      cacheDuration: 1800,
      requiresWebView: false,
      params: [
        {
          name: "site",
          title: "站点",
          type: "enumeration",
          value: "brazzers2",
          enumOptions: [
            { title: "Brazzers", value: "brazzers2" },
            { title: "Family Sinners", value: "family-sinners" },
            { title: "Family Strokes", value: "family-strokes" },
            { title: "Fake Taxi", value: "fake-taxi" },
            { title: "Vixen", value: "vixen" },
            { title: "Tushy Raw", value: "tushyraw" },
            { title: "Blacked", value: "blacked" },
            { title: "Evil Angel", value: "evil-angel" },
            { title: "Dorcel Club", value: "dorcel-club" },
            { title: "Mature NL", value: "mature-nl" },
            { title: "My Dads Hot Girlfriend", value: "my-dads-hot-girlfriend" },
            { title: "Naughty America", value: "naughtyamerica-com" }
          ]
        },
        sortParam(),
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "models",
      title: "演员浏览",
      functionName: "loadModel",
      cacheDuration: 1800,
      requiresWebView: false,
      params: [
        {
          name: "model",
          title: "演员",
          type: "enumeration",
          value: "angela-white",
          enumOptions: [
            { title: "Angela White", value: "angela-white" },
            { title: "Abella Danger", value: "abella-danger" },
            { title: "Ava Addams", value: "ava-addams" },
            { title: "Valentina Nappi", value: "valentina-nappi" },
            { title: "Alexis Fawx", value: "alexis-fawx" },
            { title: "Brandi Love", value: "brandi-love" },
            { title: "Cherie Deville", value: "cherie-deville" },
            { title: "Lena Paul", value: "lena-paul" },
            { title: "Dani Daniels", value: "dani-daniels" },
            { title: "Lana Rhoades", value: "lana-rhoades" },
            { title: "Kendra Lust", value: "kendra-lust" },
            { title: "Nicole Aniston", value: "nicole-aniston" },
            { title: "Julia Ann", value: "julia-ann" },
            { title: "Violet Myers", value: "violet-myers" }
          ]
        },
        sortParam(),
        { name: "page", title: "页码", type: "page" }
      ]
    },
    directoryModule("categoryDirectory", "分类目录", "https://www.1porn.tv/categories/", "categories"),
    directoryModule("modelDirectory", "演员目录", "https://www.1porn.tv/models/", "models"),
    directoryModule("siteDirectory", "站点目录", "https://www.1porn.tv/sites/", "sites"),
    {
      id: "loadResource",
      title: "播放源",
      description: "从 1Porn.TV 详情页提取公开 MP4 播放源",
      functionName: "loadResource",
      type: "stream",
      cacheDuration: 600,
      params: []
    }
  ],
  search: {
    title: "搜索",
    functionName: "search",
    params: [
      { name: "keyword", title: "关键词", type: "input" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

const BASE_URL = "https://www.1porn.tv";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const HEADERS = {
  "User-Agent": UA,
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
  "Referer": BASE_URL + "/"
};

async function loadList(params = {}) {
  if (params.peopleId || params.genreId) return loadRoute(params.peopleId || params.genreId, params);
  const url = appendPage(resolveUrl(params.url || `${BASE_URL}/latest-updates/`), positiveInt(params.page, 1));
  return fetchAndParseList(url);
}

async function loadCategory(params = {}) {
  if (params.peopleId || params.genreId) return loadRoute(params.peopleId || params.genreId, params);
  const route = buildSortedRoute("categories", params.cat || "milf", params.sort || "video_viewed");
  return fetchAndParseList(appendPage(route, positiveInt(params.page, 1)));
}

async function loadSite(params = {}) {
  if (params.peopleId || params.genreId) return loadRoute(params.peopleId || params.genreId, params);
  const route = buildSortedRoute("sites", params.site || "brazzers2", params.sort || "video_viewed");
  return fetchAndParseList(appendPage(route, positiveInt(params.page, 1)));
}

async function loadModel(params = {}) {
  if (params.peopleId || params.genreId) return loadRoute(params.peopleId || params.genreId, params);
  const route = buildSortedRoute("models", params.model || "angela-white", params.sort || "video_viewed");
  return fetchAndParseList(appendPage(route, positiveInt(params.page, 1)));
}

async function loadDirectory(params = {}) {
  if (params.peopleId || params.genreId) return loadRoute(params.peopleId || params.genreId, params);
  const url = appendPage(resolveUrl(params.url || `${BASE_URL}/categories/`), positiveInt(params.page, 1));
  const html = await fetchHtml(url);
  return parseDirectory(html, params.directoryType || inferDirectoryType(url));
}

async function search(params = {}) {
  if (params.peopleId || params.genreId) return loadRoute(params.peopleId || params.genreId, params);
  const keyword = cleanText(params.keyword);
  if (!keyword) return [{ id: "tip", type: "text", title: "请输入关键词开始搜索" }];
  const route = `${BASE_URL}/search/${encodePathSegment(keyword.replace(/\s+/g, "-"))}/relevance/`;
  return fetchAndParseList(appendPage(route, positiveInt(params.page, 1)));
}

async function loadDetail(link) {
  const url = canonicalContentUrl(resolveUrl(link));
  if (!url) return null;
  if (!isDetailUrl(url)) return loadRoute(url, {});

  const html = await fetchHtml(url);
  const $ = Widget.html.load(html);
  const title = parseDetailTitle($);
  const cover = normalizeImageUrl(
    $("video").first().attr("poster")
      || $('meta[property="og:image"]').attr("content")
      || firstImageFromHtml(html)
  );
  const stream = selectBestVideoSource($);
  const durationText = parseDurationText($, html);
  const releaseDate = parseReleaseDate($);
  const description = buildDescription($, durationText, releaseDate);
  const genreItems = parseDetailGenres($);
  const peoples = parseDetailPeople($);
  const relatedItems = parseVideoListFromScope($, $(".related-videos").first(), { limit: 18, skipUrl: url });
  const stills = extractStillImages(html);
  const backdropPaths = stills.length ? stills : (cover ? [cover] : []);

  const item = {
    id: url,
    type: "url",
    mediaType: "movie",
    title,
    link: url,
    description,
    posterPath: cover,
    detailPoster: cover,
    backdropPath: cover,
    coverUrl: cover,
    image: cover,
    backdropPaths,
    relatedItems,
    durationText,
    releaseDate,
    videoUrl: stream.url || undefined,
    previewUrl: stream.previewUrl || undefined,
    playerType: "system",
    customHeaders: {
      "Referer": url,
      "User-Agent": UA
    }
  };
  if (genreItems.length) item.genreItems = genreItems;
  if (peoples.length) item.peoples = peoples;
  if (stream.url) item.trailers = [{ url: stream.url, coverUrl: cover }];
  return item;
}

async function loadResource(params = {}) {
  const detailUrl = resolveUrl(params.link || params.url || params.id || "");
  if (!isDetailUrl(detailUrl)) return [];
  try {
    const html = await fetchHtml(detailUrl);
    const $ = Widget.html.load(html);
    const stream = selectBestVideoSource($);
    if (!stream.url) return [];
    return [{
      name: cleanText(params.title || parseDetailTitle($) || "1Porn.TV"),
      description: stream.label ? `1Porn.TV ${stream.label} 公开播放源` : "1Porn.TV 公开播放源",
      url: stream.url,
      customHeaders: {
        "Referer": detailUrl,
        "User-Agent": UA
      }
    }];
  } catch (error) {
    return [];
  }
}

async function loadRoute(route, params = {}) {
  const url = appendPage(canonicalContentUrl(resolveUrl(route)), positiveInt(params.page, 1));
  if (!url) return [];
  return fetchAndParseList(url);
}

async function fetchAndParseList(url) {
  const html = await fetchHtml(url);
  const $ = Widget.html.load(html);
  return parseVideoListFromScope($, $.root(), { limit: 80 });
}

async function fetchHtml(url) {
  const target = resolveUrl(url);
  const res = await Widget.http.get(target, {
    headers: Object.assign({}, HEADERS, { Referer: refererFor(target) })
  });
  return normalizeTextBody(res && res.data);
}

function parseVideoListFromScope($, scope, options = {}) {
  const items = [];
  const seen = {};
  const $scope = scope && scope.length ? scope : $.root();
  $scope.find(".list-videos .item").each((_, el) => {
    if (items.length >= (options.limit || 80)) return false;
    const $card = $(el);
    const link = canonicalContentUrl(resolveUrl(
      $card.find("a[href*='/videos/']").first().attr("href")
    ));
    if (!isDetailUrl(link) || link === options.skipUrl || seen[link]) return;

    const title = cleanText(
      $card.find(".thumb_title").first().attr("title")
        || $card.find(".thumb_title .title").first().text()
        || $card.find("a[href*='/videos/']").first().attr("title")
        || $card.find("img").first().attr("alt")
    );
    if (!title) return;
    seen[link] = true;

    const cover = normalizeImageUrl(firstNonEmpty(
      $card.find("img.thumb").first().attr("data-src"),
      $card.find("img.thumb").first().attr("data-original"),
      $card.find("img.thumb").first().attr("src"),
      $card.find("img").first().attr("data-src"),
      $card.find("img").first().attr("data-original"),
      $card.find("img").first().attr("src")
    ));
    const previewUrl = normalizeImageUrl($card.find(".thumb__img").first().attr("data-preview") || "");
    const durationText = normalizeDuration($card.find(".duration").first().text());
    const description = cleanText($card.find(".views").first().text() || $card.find(".wrap").first().text());
    const routeData = parseCardRoutes($, $card);

    const item = buildVideoItem({
      id: link,
      title,
      link,
      cover,
      previewUrl,
      durationText,
      description
    });
    if (routeData.genreItems.length) item.genreItems = routeData.genreItems;
    if (routeData.peoples.length) item.peoples = routeData.peoples;
    items.push(item);
  });
  return items;
}

function parseCardRoutes($, $card) {
  const genreItems = [];
  const peoples = [];
  $card.find(".models__item").each((_, el) => {
    const $a = $(el);
    const href = canonicalContentUrl(resolveUrl($a.attr("href") || ""));
    const title = cleanText($a.find("span").first().text() || $a.text() || $a.attr("title"));
    if (!href || !title) return;
    if (href.indexOf("/models/") >= 0) {
      pushUnique(peoples, { id: href, title, role: "演员" });
    } else if (href.indexOf("/sites/") >= 0 || href.indexOf("/networks/") >= 0 || href.indexOf("/categories/") >= 0) {
      pushUnique(genreItems, { id: href, title });
    }
  });
  return { genreItems, peoples };
}

function parseDirectory(html, type) {
  const $ = Widget.html.load(html);
  if (type === "models") return parseModelDirectory($);
  if (type === "sites") return parseRouteDirectory($, "sites", "站点");
  return parseRouteDirectory($, "categories", "分类");
}

function parseRouteDirectory($, type, label) {
  const items = [];
  const seen = {};
  const path = `/${type}/`;
  $(`a.item[href*='${path}'], .list-${type} a[href*='${path}'], a.sites__item[href*='${path}']`).each((_, el) => {
    if (items.length >= 200) return false;
    const $a = $(el);
    const link = canonicalContentUrl(resolveUrl($a.attr("href") || ""));
    if (!link || seen[link] || link.replace(/\/+$/, "") === `${BASE_URL}/${type}`) return;
    const title = cleanText($a.attr("title") || $a.find("strong, span").first().text() || $a.text());
    if (!title || title.length > 100) return;
    seen[link] = true;
    const cover = normalizeImageUrl(firstNonEmpty(
      $a.find("img").first().attr("data-src"),
      $a.find("img").first().attr("data-original"),
      $a.find("img").first().attr("src")
    ));
    const description = cleanText($a.find("span, em, .count").last().text()) || label;
    const item = buildRouteItem({
      id: link,
      title,
      link,
      cover,
      description
    });
    item.genreItems = [{ id: link, title }];
    items.push(item);
  });
  return items;
}

function parseModelDirectory($) {
  const items = [];
  const seen = {};
  $(".list-models a.item[href*='/models/'], a.item[href*='/models/']").each((_, el) => {
    if (items.length >= 120) return false;
    const $a = $(el);
    const link = canonicalContentUrl(resolveUrl($a.attr("href") || ""));
    if (!link || seen[link] || link.replace(/\/+$/, "") === `${BASE_URL}/models`) return;
    const title = cleanText($a.attr("title") || $a.find("strong, span").first().text() || $a.find("img").first().attr("alt") || $a.text());
    if (!title || title.length > 100) return;
    seen[link] = true;
    const avatar = normalizeImageUrl(firstNonEmpty(
      $a.find("img").first().attr("data-src"),
      $a.find("img").first().attr("data-original"),
      $a.find("img").first().attr("src")
    ));
    const description = cleanText($a.find("span, em, .count").last().text()) || "演员";
    const item = buildRouteItem({
      id: link,
      title,
      link,
      cover: avatar,
      description
    });
    item.peoples = [{ id: link, title, avatar, role: "演员" }];
    items.push(item);
  });
  return items;
}

function parseDetailTitle($) {
  return cleanTitle(
    $("#tab_video_info .headline h1").first().text()
      || $("h1").first().text()
      || $('meta[property="og:title"]').attr("content")
      || $("title").first().text()
      || "1Porn.TV"
  );
}

function parseDetailGenres($) {
  const out = [];
  $("#tab_video_info a.btn_sponsor[href], #tab_video_info a.btn_sponsor_group[href]").each((_, el) => {
    const href = canonicalContentUrl(resolveUrl($(el).attr("href") || ""));
    const title = cleanText($(el).text());
    if (href && title) pushUnique(out, { id: href, title });
  });
  $("#tab_video_info a.btn_tag[href*='/categories/']").each((_, el) => {
    const href = canonicalContentUrl(resolveUrl($(el).attr("href") || ""));
    const title = cleanText($(el).text());
    if (href && title) pushUnique(out, { id: href, title });
  });
  return out;
}

function parseDetailPeople($) {
  const out = [];
  $("#tab_video_info a.btn_model[href*='/models/']").each((_, el) => {
    const href = canonicalContentUrl(resolveUrl($(el).attr("href") || ""));
    const title = cleanText($(el).text());
    if (href && title) pushUnique(out, { id: href, title, role: "演员" });
  });
  return out;
}

function selectBestVideoSource($) {
  const sources = [];
  $("video source[src]").each((_, el) => {
    const $source = $(el);
    const url = normalizeMediaUrl($source.attr("src") || "");
    if (!url) return;
    const label = cleanText($source.attr("label") || "");
    sources.push({
      url,
      label,
      quality: qualityFromLabel(label, url),
      selected: $source.attr("selected") !== undefined
    });
  });
  sources.sort((a, b) => {
    if (b.quality !== a.quality) return b.quality - a.quality;
    return Number(b.selected) - Number(a.selected);
  });
  const best = sources[0] || {};
  return {
    url: best.url || "",
    label: best.label || "",
    previewUrl: ""
  };
}

function parseDurationText($, html) {
  const seconds = parseInt($('meta[property="video:duration"]').attr("content") || "", 10);
  if (Number.isFinite(seconds) && seconds > 0) return secondsToDuration(seconds);
  return normalizeDuration($(".duration").first().text() || html.match(/vjs-duration-display[^>]*>([^<]+)/i));
}

function parseReleaseDate($) {
  const raw = cleanText($('meta[property="video:release_date"]').attr("content") || "");
  const match = raw.match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : "";
}

function buildDescription($, durationText, releaseDate) {
  const views = cleanText($(".video-info .views").first().text()).replace(/\s*Views\s*$/i, " Views");
  const desc = cleanText($('meta[property="og:description"]').attr("content") || $('meta[name="description"]').attr("content") || "");
  return [durationText ? `时长: ${durationText}` : "", releaseDate ? `日期: ${releaseDate}` : "", views, desc].filter(Boolean).join(" | ");
}

function extractStillImages(html) {
  const out = [];
  const seen = {};
  const text = String(html || "");
  const re = /https?:\/\/img\.1porn\.tv\/[^"'<>\\\s]+\/player\/\d+\.jpg/g;
  let match;
  while ((match = re.exec(text)) && out.length < 40) {
    const url = normalizeImageUrl(match[0]);
    if (url && !seen[url]) {
      seen[url] = true;
      out.push(url);
    }
  }
  return out;
}

function firstImageFromHtml(html) {
  const match = String(html || "").match(/https?:\/\/img\.1porn\.tv\/[^"'<>\\\s]+\.(?:jpg|jpeg|png|webp)/i);
  return match ? match[0] : "";
}

function buildSortedRoute(type, slug, sort) {
  const cleanSlug = String(slug || "").replace(/^\/+|\/+$/g, "");
  const base = `${BASE_URL}/${type}/${cleanSlug}/`;
  if (sort === "post_date") return `${base}latest-updates/`;
  if (sort === "rating") return `${base}top-rated/`;
  if (sort === "ctr" && type === "categories") return `${base}most-relevant/`;
  if (sort === "video_viewed" && type === "sites") return `${base}most-popular/`;
  return base;
}

function buildVideoItem(data) {
  return {
    id: data.id,
    type: "url",
    mediaType: "movie",
    title: data.title,
    link: data.link,
    posterPath: data.cover || "",
    detailPoster: data.cover || "",
    backdropPath: data.cover || "",
    coverUrl: data.cover || "",
    image: data.cover || "",
    previewUrl: data.previewUrl || "",
    durationText: data.durationText || "",
    description: data.description || "",
    playerType: "system"
  };
}

function buildRouteItem(data) {
  return {
    id: data.id,
    type: "url",
    mediaType: "movie",
    title: data.title,
    link: data.link,
    posterPath: data.cover || "",
    detailPoster: data.cover || "",
    backdropPath: data.cover || "",
    coverUrl: data.cover || "",
    image: data.cover || "",
    description: data.description || "",
    playerType: "system"
  };
}

function listModule(id, title, url) {
  return {
    id,
    title,
    functionName: "loadList",
    cacheDuration: 900,
    requiresWebView: false,
    params: [
      { name: "url", title: "列表地址", type: "constant", value: url },
      { name: "page", title: "页码", type: "page" }
    ]
  };
}

function directoryModule(id, title, url, directoryType) {
  return {
    id,
    title,
    functionName: "loadDirectory",
    cacheDuration: 86400,
    requiresWebView: false,
    params: [
      { name: "url", title: "目录地址", type: "constant", value: url },
      { name: "directoryType", title: "目录类型", type: "constant", value: directoryType },
      { name: "page", title: "页码", type: "page" }
    ]
  };
}

function sortParam() {
  return {
    name: "sort",
    title: "排序",
    type: "enumeration",
    value: "video_viewed",
    enumOptions: [
      { title: "最多观看", value: "video_viewed" },
      { title: "最新", value: "post_date" },
      { title: "最高评分", value: "rating" },
      { title: "最相关", value: "ctr" }
    ]
  };
}

function appendPage(url, page) {
  const value = ensureTrailingSlash(resolveUrl(url));
  const n = positiveInt(page, 1);
  if (n <= 1) return value;
  const hashParts = value.split("#");
  const queryParts = hashParts[0].split("?");
  const base = queryParts[0].replace(/\/+$/, "");
  const query = queryParts[1] ? `?${queryParts[1]}` : "";
  const hash = hashParts[1] ? `#${hashParts[1]}` : "";
  return `${base}/${n}/${query}${hash}`;
}

function resolveUrl(href) {
  const value = cleanText(href);
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value.replace(/&amp;/g, "&");
  if (value.indexOf("//") === 0) return `https:${value}`.replace(/&amp;/g, "&");
  return `${BASE_URL}/${value.replace(/^\/+/, "")}`.replace(/&amp;/g, "&");
}

function normalizeImageUrl(url) {
  const value = resolveUrl(url);
  if (!value || /^data:/i.test(value) || /placeholder|noimage|blank\.gif/i.test(value)) return "";
  return value;
}

function normalizeMediaUrl(url) {
  const value = resolveUrl(url);
  if (!value || !/\.(mp4|m3u8)(?:[/?#]|$)/i.test(value)) return "";
  return value;
}

function refererFor(url) {
  if (isDetailUrl(url)) return BASE_URL + "/";
  return BASE_URL + "/";
}

function isDetailUrl(url) {
  return /^https?:\/\/(?:www\.)?1porn\.tv\/(?:[a-z]{2}\/)?videos\/[^/?#]+\/?/i.test(String(url || ""));
}

function canonicalContentUrl(url) {
  return String(url || "").replace(
    /^(https?:\/\/(?:www\.)?1porn\.tv)\/(?:pt|es|it|fr|de|ru|bi|ms|cs|nl|ro|sv|vi|hi|th|br|ko|uk|ja|zh)\/(videos|categories|sites|models|networks|search)\//i,
    "$1/$2/"
  );
}

function inferDirectoryType(url) {
  const text = String(url || "");
  if (text.indexOf("/models/") >= 0) return "models";
  if (text.indexOf("/sites/") >= 0) return "sites";
  return "categories";
}

function cleanTitle(value) {
  return cleanText(value)
    .replace(/\s*\|\s*Free Porn.*$/i, "")
    .replace(/\s*-\s*1PORN\.TV.*$/i, "")
    .replace(/\s*\/\s*\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\s*$/i, "")
    .trim();
}

function cleanText(value) {
  if (Array.isArray(value)) value = value[1] || "";
  return String(value || "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}

function firstNonEmpty() {
  for (let i = 0; i < arguments.length; i++) {
    const value = cleanText(arguments[i]);
    if (value) return value;
  }
  return "";
}

function positiveInt(value, fallback) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function ensureTrailingSlash(url) {
  const value = String(url || "");
  if (!value || /[/?#]$/.test(value)) return value;
  return value + "/";
}

function encodePathSegment(value) {
  return encodeURIComponent(String(value || "").trim()).replace(/%2F/gi, "-");
}

function normalizeTextBody(data) {
  if (data === null || data === undefined) return "";
  if (typeof data === "string") return data;
  return String(data);
}

function normalizeDuration(value) {
  const text = cleanText(value).replace(/^Full Video\s*/i, "");
  const match = text.match(/(\d{1,2}:)?\d{1,2}:\d{2}/);
  return match ? match[0] : text;
}

function secondsToDuration(seconds) {
  const total = Math.max(0, parseInt(seconds, 10) || 0);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}:${pad2(m)}:${pad2(s)}`;
  return `${m}:${pad2(s)}`;
}

function pad2(n) {
  return n < 10 ? `0${n}` : String(n);
}

function qualityFromLabel(label, url) {
  const match = String(label || url || "").match(/(\d{3,4})\s*p?m?/i);
  return match ? parseInt(match[1], 10) : 0;
}

function pushUnique(list, item) {
  if (!item || !item.id || list.some((it) => it.id === item.id)) return;
  list.push(item);
}
