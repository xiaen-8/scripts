/**
 * 247看 ForwardWidget v1.4.0
 * 平台：247kan.com
 *
 * v1.4.0：精简代码，去掉 customHeaders 修复代理播放
 * v1.3.x：过滤非直链源、修复弹幕搜索、剧集按集数合并
 */

WidgetMetadata = {
  id: "forward.247kan",
  title: "247看",
  version: "1.4.0",
  requiredVersion: "0.0.1",
  description: "247看 — 免费在线高清影视平台，电影/电视剧/动漫/综艺，多线路播放",
  author: "Forward",
  site: "https://247kan.com",
  icon: "https://247kan.com/logo.png",
  detailCacheDuration: 300,
  globalParams: [
    { name: "baseURL", title: "站点地址", type: "input", value: "https://247kan.com", description: "247看站点地址" },
  ],
  modules: [
    {
      id: "loadMovie", title: "电影", functionName: "loadMovie", cacheDuration: 600,
      params: [
        {
          name: "category", title: "分类", type: "enumeration", value: "all",
          enumOptions: [
            { title: "全部电影", value: "all" }, { title: "动作片", value: "7" }, { title: "喜剧片", value: "8" },
            { title: "爱情片", value: "9" }, { title: "科幻片", value: "10" }, { title: "恐怖片", value: "11" },
            { title: "剧情片", value: "12" }, { title: "战争片", value: "13" },
          ],
        },
        {
          name: "sort", title: "排序", type: "enumeration", value: "time",
          enumOptions: [{ title: "最新", value: "time" }, { title: "最热", value: "hits" }, { title: "评分", value: "score" }],
        },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "loadSeries", title: "连续剧", functionName: "loadSeries", cacheDuration: 600,
      params: [
        {
          name: "category", title: "分类", type: "enumeration", value: "all",
          enumOptions: [
            { title: "全部剧集", value: "all" }, { title: "国产剧", value: "14" }, { title: "香港剧", value: "15" },
            { title: "韩国剧", value: "16" }, { title: "欧美剧", value: "17" }, { title: "台湾剧", value: "18" },
            { title: "日本剧", value: "19" }, { title: "海外剧", value: "20" }, { title: "泰国剧", value: "21" },
          ],
        },
        {
          name: "sort", title: "排序", type: "enumeration", value: "time",
          enumOptions: [{ title: "最新", value: "time" }, { title: "最热", value: "hits" }, { title: "评分", value: "score" }],
        },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "loadVariety", title: "综艺", functionName: "loadVariety", cacheDuration: 600,
      params: [
        {
          name: "category", title: "分类", type: "enumeration", value: "all",
          enumOptions: [
            { title: "全部综艺", value: "all" }, { title: "大陆综艺", value: "22" }, { title: "港台综艺", value: "23" },
            { title: "日韩综艺", value: "24" }, { title: "欧美综艺", value: "25" },
          ],
        },
        {
          name: "sort", title: "排序", type: "enumeration", value: "time",
          enumOptions: [{ title: "最新", value: "time" }, { title: "最热", value: "hits" }, { title: "评分", value: "score" }],
        },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "loadAnime", title: "动漫", functionName: "loadAnime", cacheDuration: 600,
      params: [
        {
          name: "category", title: "分类", type: "enumeration", value: "all",
          enumOptions: [
            { title: "全部动漫", value: "all" }, { title: "国产动漫", value: "26" }, { title: "日韩动漫", value: "27" },
            { title: "欧美动漫", value: "28" }, { title: "港台动漫", value: "29" }, { title: "海外动漫", value: "30" },
          ],
        },
        {
          name: "sort", title: "排序", type: "enumeration", value: "time",
          enumOptions: [{ title: "最新", value: "time" }, { title: "最热", value: "hits" }, { title: "评分", value: "score" }],
        },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "loadShort", title: "短剧", functionName: "loadShort", cacheDuration: 600,
      params: [
        {
          name: "sort", title: "排序", type: "enumeration", value: "time",
          enumOptions: [{ title: "最新", value: "time" }, { title: "最热", value: "hits" }, { title: "评分", value: "score" }],
        },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "loadDocumentary", title: "纪录片", functionName: "loadDocumentary", cacheDuration: 600,
      params: [
        {
          name: "sort", title: "排序", type: "enumeration", value: "time",
          enumOptions: [{ title: "最新", value: "time" }, { title: "最热", value: "hits" }, { title: "评分", value: "score" }],
        },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "loadRanking", title: "排行榜", functionName: "loadRanking", cacheDuration: 600,
      params: [
        {
          name: "period", title: "榜单", type: "enumeration", value: "daily",
          enumOptions: [{ title: "日榜", value: "daily" }, { title: "周榜", value: "weekly" }, { title: "月榜", value: "monthly" }],
        },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "loadResource", title: "播放源", functionName: "loadResource", type: "stream", cacheDuration: 120, params: [],
    },
  ],
  search: {
    title: "搜索", functionName: "search",
    params: [
      { name: "keyword", title: "关键词", type: "input" },
      { name: "page", title: "页码", type: "page" },
    ],
  },
};

// ==================== 工具 ====================

var KAN_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
var KAN_HOST = "https://247kan.com";

function getBase(params) {
  var base = ((params && params.baseURL) || KAN_HOST).replace(/\/+$/, "");
  KAN_HOST = base;
  return base;
}

function headers() {
  return { "User-Agent": KAN_UA, "Accept": "application/json", "Referer": KAN_HOST + "/" };
}

function isPlayable(url) {
  if (!url) return false;
  var u = String(url).toLowerCase();
  return u.indexOf(".m3u8") >= 0 || u.indexOf(".mp4") >= 0 || u.indexOf(".flv") >= 0;
}

function cleanText(text) {
  return String(text || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/\s+/g, " ").trim();
}

// ==================== API ====================

async function fetchJSON(path) {
  var res = await Widget.http.get(KAN_HOST + "/api" + path, { headers: headers() });
  var data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
  if (data && data.status === "error") throw new Error(data.message || "API error");
  return data;
}

// 获取视频详情
async function fetchVideo(vodId) {
  var data = await fetchJSON("/videos/" + vodId);
  return (data && data.data) || {};
}

// 收集指定剧集的所有可播放线路（去重）
function collectRoutes(v, episode) {
  var routes = [];
  var seen = {};
  if (Array.isArray(v.episodes)) {
    for (var i = 0; i < v.episodes.length; i++) {
      var ep = v.episodes[i];
      if (ep.episode === episode && isPlayable(ep.url)) {
        var key = ep.route || "default";
        if (!seen[key]) {
          seen[key] = true;
          routes.push({ route: ep.route || "", url: ep.url });
        }
      }
    }
  }
  if (routes.length === 0 && isPlayable(v.vod_play_url)) {
    routes.push({ route: "自动", url: v.vod_play_url });
  }
  return routes;
}

// 线路列表转 videoSources
function routesToSources(routes) {
  var sources = [];
  for (var i = 0; i < routes.length; i++) {
    sources.push({
      url: routes[i].url,
      type: "application/x-mpegURL",
      label: routes[i].route || ("线路" + (i + 1)),
    });
  }
  return sources;
}

// 线路列表转 streams（loadResource 用）
function routesToStreams(routes, episode) {
  var streams = [];
  for (var i = 0; i < routes.length; i++) {
    streams.push({
      name: routes[i].route || ("线路" + (i + 1)),
      episode: episode,
      url: routes[i].url,
    });
  }
  return streams;
}

// ==================== 列表解析 ====================

function parseVideoItem(v) {
  var id = String(v.vod_id || "");
  if (!id) return null;
  var desc = [];
  if (v.vod_remarks) desc.push(v.vod_remarks);
  if (v.vod_douban_score && v.vod_douban_score !== "0.0") desc.push("评分:" + v.vod_douban_score);
  if (v.vod_year) desc.push(v.vod_year);
  if (v.vod_area) desc.push(v.vod_area);
  if (v.vod_class) desc.push(v.vod_class);
  return {
    id: id, type: "url", title: v.vod_name || "",
    posterPath: v.vod_pic || v.vod_tmdb_poster || "",
    coverUrl: v.vod_pic || v.vod_tmdb_poster || "",
    description: desc.join(" ") || undefined,
    link: id,
  };
}

function parseVideoList(data) {
  var videos = (data && data.data && data.data.videos) || [];
  var items = [];
  for (var i = 0; i < videos.length; i++) {
    var item = parseVideoItem(videos[i]);
    if (item) items.push(item);
  }
  return items;
}

// ==================== 分类 ====================

async function loadByCategory(params, defaultCat) {
  getBase(params);
  var cat = params.category && params.category !== "all" ? params.category : defaultCat;
  var page = params.page || 1;
  var sort = params.sort || "time";
  return parseVideoList(await fetchJSON("/categories/" + cat + "/videos?page=" + page + "&limit=20&sort=" + sort));
}

async function loadMovie(params)     { return loadByCategory(params, "1"); }
async function loadSeries(params)   { return loadByCategory(params, "2"); }
async function loadVariety(params)  { return loadByCategory(params, "3"); }
async function loadAnime(params)    { return loadByCategory(params, "4"); }
async function loadShort(params)    { return loadByCategory(params, "5"); }
async function loadDocumentary(params) { return loadByCategory(params, "6"); }

async function loadRanking(params) {
  getBase(params);
  var period = params.period || "daily";
  var page = params.page || 1;
  return parseVideoList(await fetchJSON("/rankings/" + period + "?page=" + page + "&limit=20"));
}

// ==================== 搜索 ====================

async function search(params) {
  getBase(params);
  var keyword = String(params.keyword || "").trim();
  if (!keyword) return [];
  var page = params.page || 1;
  return parseVideoList(await fetchJSON("/search/videos?q=" + encodeURIComponent(keyword) + "&page=" + page + "&limit=20"));
}

// ==================== 详情 ====================

async function loadDetail(link) {
  // 播放链接：ep:{vodId}:{episode}
  if (link && link.indexOf("ep:") === 0) {
    var parts = link.split(":");
    var vodId = parts[1];
    var episode = parseInt(parts[2], 10) || 1;

    var v = await fetchVideo(vodId);
    var routes = collectRoutes(v, episode);

    if (routes.length > 0) {
      var sources = routesToSources(routes);
      return {
        id: link, type: "video",
        title: v.vod_name || "",    // 纯剧名供弹幕搜索
        episode: episode,
        link: link,
        videoUrl: routes[0].url,
        videoSources: sources,
      };
    }
    return { id: link, type: "url", title: v.vod_name || "播放失败", link: link };
  }

  // 正常详情页
  getBase({ baseURL: KAN_HOST });
  var vodId = String(link).trim();
  var v = await fetchVideo(vodId);

  var title = v.vod_name || "247看";
  var poster = v.vod_pic || v.vod_tmdb_poster || "";

  // 描述
  var meta = [];
  if (v.vod_year) meta.push(v.vod_year);
  if (v.vod_area) meta.push(v.vod_area);
  if (v.vod_lang) meta.push(v.vod_lang);
  if (v.vod_director) meta.push("导演:" + v.vod_director);
  if (v.vod_actor) meta.push("主演:" + v.vod_actor);
  if (v.vod_douban_score && v.vod_douban_score !== "0.0") meta.push("豆瓣:" + v.vod_douban_score);
  if (v.vod_remarks) meta.push(v.vod_remarks);
  var description = meta.length > 0 ? meta.join(" / ") : "";
  var content = cleanText(v.vod_content || v.vod_blurb || "");
  if (content) description += (description ? "\n" : "") + content;

  // 剧集列表 — 按集数合并
  var episodes = [];
  var videoUrl = "";

  if (Array.isArray(v.episodes) && v.episodes.length > 0) {
    var epMap = {};
    var epOrder = [];
    for (var i = 0; i < v.episodes.length; i++) {
      var n = v.episodes[i].episode;
      if (!epMap[n]) { epMap[n] = []; epOrder.push(n); }
      epMap[n].push(v.episodes[i]);
    }
    epOrder.sort(function(a, b) { return a - b; });

    for (var j = 0; j < epOrder.length; j++) {
      var num = epOrder[j];
      var epRoutes = collectRoutes(v, num);
      if (!videoUrl && epRoutes.length > 0) videoUrl = epRoutes[0].url;

      episodes.push({
        id: "ep_" + num,
        type: "url",
        title: (epMap[num][0] && epMap[num][0].name) || ("第" + num + "集"),
        link: "ep:" + vodId + ":" + num,
        videoUrl: "",
      });
    }
  } else if (isPlayable(v.vod_play_url)) {
    videoUrl = v.vod_play_url;
  }

  if (episodes.length === 0 && videoUrl) {
    episodes.push({ id: "ep_1", type: "url", title: v.vod_remarks || "播放", link: "ep:" + vodId + ":1", videoUrl: videoUrl });
  }
  if (episodes.length > 0 && videoUrl) episodes[0].videoUrl = videoUrl;

  // 第一集线路
  var firstSources = (Array.isArray(v.episodes) && v.episodes.length > 0)
    ? routesToSources(collectRoutes(v, v.episodes[0].episode))
    : (videoUrl ? [{ url: videoUrl, type: "application/x-mpegURL", label: "自动" }] : []);

  return {
    id: vodId,
    type: "url",
    title: title,
    posterPath: poster || undefined,
    coverUrl: poster || undefined,
    description: description || undefined,
    link: vodId,
    videoUrl: videoUrl || undefined,
    videoSources: firstSources.length > 0 ? firstSources : undefined,
    episodeItems: episodes.length > 0 ? episodes : undefined,
  };
}

// ==================== 播放源 ====================

async function loadResource(params) {
  var linkStr = String(params.link || "").trim();
  var epMatch = linkStr.match(/ep:(\d+):(\d+)/);

  var vodId, episode;
  if (epMatch) {
    vodId = epMatch[1];
    episode = parseInt(epMatch[2], 10) || 1;
  } else {
    // 通过标题搜索
    var title = String(params.seriesName || params.title || "").trim();
    if (!title) return [];
    getBase(params);
    var searchData = await fetchJSON("/search/videos?q=" + encodeURIComponent(title) + "&page=1&limit=1");
    var videos = (searchData && searchData.data && searchData.data.videos) || [];
    if (!videos.length) return [];
    vodId = String(videos[0].vod_id || "");
    episode = 1;
  }

  getBase(params);
  var v = await fetchVideo(vodId);
  var routes = collectRoutes(v, episode);
  return routesToStreams(routes, episode);
}
