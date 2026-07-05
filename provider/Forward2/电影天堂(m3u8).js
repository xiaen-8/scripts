// @name 电影天堂(m3u8)
// @description 电影天堂m3u8影视采集插件
// @version 1.0.0

var DEFAULT_API_HOST = "http://api.ffzyapi.com";
var REFERER = "http://api.ffzyapi.com";
var REQUEST_TIMEOUT = 10000;
var MAX_RETRIES = 1;
var CACHE_TTL = 3600000;

var REQUEST_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "Accept": "application/json, text/plain, */*",
  "Referer": REFERER
};

var cacheStore = new Map();

function getCacheKey(key) {
  return "dytt_" + key;
}

function getFromCache(key) {
  var entry = cacheStore.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  if (entry) cacheStore.delete(key);
  return null;
}

function setToCache(key, data) {
  cacheStore.set(key, { data: data, timestamp: Date.now() });
  if (cacheStore.size > 30) {
    var oldest = cacheStore.keys().next().value;
    cacheStore.delete(oldest);
  }
}

function logInfo(msg) {
  console.log("[电影天堂] " + msg);
}

function logError(msg) {
  console.error("[电影天堂] " + msg);
}

function httpGet(url, retryCount) {
  retryCount = retryCount || 0;
  return new Promise(function(resolve) {
    Widget.http.get(url, { headers: REQUEST_HEADERS, timeout: REQUEST_TIMEOUT })
      .then(function(res) {
        try {
          var data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
          resolve(data);
        } catch (e) {
          resolve(null);
        }
      })
      .catch(function(err) {
        if (retryCount < MAX_RETRIES) {
          setTimeout(function() {
            httpGet(url, retryCount + 1).then(resolve);
          }, 500);
        } else {
          resolve(null);
        }
      });
  });
}

async function searchDytt(params) {
  params = params || {};
  var keyword = params.wd || params.keyword || "";
  var page = params.pg || 1;
  if (!keyword) return [{ id: "empty", type: "text", title: "请输入关键词" }];

  var url = DEFAULT_API_HOST + "/api.php/provide/vod/?ac=list&wd=" + encodeURIComponent(keyword) + "&pg=" + page;
  var data = await httpGet(url);
  if (!data || !Array.isArray(data.list)) return [];

  return data.list.map(function(item) {
    return {
      id: "dytt_detail_" + (item.vod_id || ""),
      type: "url",
      title: item.vod_name || "",
      posterPath: item.vod_pic || "",
      releaseDate: item.vod_year || "",
      description: (item.vod_year || "") + " · " + (item.type_name || ""),
      link: "dytt://detail?id=" + (item.vod_id || "")
    };
  });
}

function fetchCategoryList(cateId, page) {
  var url = DEFAULT_API_HOST + "/api.php/provide/vod/?ac=videolist&t=" + cateId + "&pg=" + page;
  return httpGet(url).then(function(data) {
    if (!data || !Array.isArray(data.list)) return [];
    return data.list.map(function(item) {
      return {
        id: "dytt_" + (item.vod_id || ""),
        type: "url",
        title: item.vod_name || "",
        posterPath: item.vod_pic || "",
        backdropPath: item.vod_pic || "",
        releaseDate: item.vod_year || "",
        description: (item.vod_year || "") + " · " + (item.type_name || ""),
        genreTitle: item.type_name || "",
        link: "dytt://detail?id=" + (item.vod_id || "")
      };
    });
  });
}

function loadMovieList(params) {
  params = params || {};
  var page = params.page || 1;
  return fetchCategoryList(1, page);
}

function loadTvList(params) {
  params = params || {};
  var page = params.page || 1;
  return fetchCategoryList(2, page);
}

function loadVarietyList(params) {
  params = params || {};
  var page = params.page || 1;
  return fetchCategoryList(3, page);
}

function loadAnimeList(params) {
  params = params || {};
  var page = params.page || 1;
  return fetchCategoryList(4, page);
}

async function loadDetail(params) {
  params = params || {};
  var link = params.id || params.link || "";
  if (!link) throw new Error("缺少视频ID");

  var vodId = "";
  if (link.includes("dytt://detail")) {
    var m = link.match(/[?&]id=([^&]+)/);
    vodId = m ? m[1] : "";
  } else {
    vodId = link;
  }
  if (!vodId) throw new Error("解析ID失败");

  var url = DEFAULT_API_HOST + "/api.php/provide/vod/?ac=detail&ids=" + vodId;
  var data = await httpGet(url);
  if (!data || !Array.isArray(data.list) || !data.list[0]) throw new Error("获取详情失败");

  var item = data.list[0];
  var title = item.vod_name || "";
  var playUrl = item.vod_play_url || "";

  var eps = [];
  if (playUrl) {
    var parts = playUrl.split("#");
    parts.forEach(function(p) {
      var sp = p.split("$");
      if (sp.length >= 2 && sp[1].includes(".m3u8")) {
        eps.push({
          id: vodId + "_" + eps.length,
          type: "url",
          title: sp[0],
          videoUrl: sp[1],
          mediaType: "episode"
        });
      }
    });
  }

  return {
    id: "dytt_" + vodId,
    type: "url",
    title: title,
    description: item.vod_content || "",
    posterPath: item.vod_pic || "",
    backdropPath: item.vod_pic || "",
    mediaType: eps.length > 1 ? "tv" : "movie",
    episode: eps.length,
    episodeItems: eps,
    videoUrl: eps[0] ? eps[0].videoUrl : ""
  };
}

WidgetMetadata = {
  id: "Dytt.M3u8",
  title: "电影天堂(m3u8)",
  icon: "",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "电影天堂m3u8播放插件，支持分类、搜索、详情、播放",
  author: "admin",
  globalParams: [
    { name: "ApiHost", title: "API地址", type: "input", value: "http://api.ffzyapi.com" }
  ],
  search: {
    title: "搜索",
    functionName: "searchDytt",
    params: [
      { name: "wd", title: "关键词", type: "input", value: "" },
      { name: "pg", title: "页码", type: "page", value: "1" }
    ]
  },
  modules: [
    {
      id: "dytt_movie",
      title: "电影",
      functionName: "loadMovieList",
      type: "video",
      cacheDuration: 3600,
      params: [{ name: "page", title: "页码", type: "page", startPage: 1 }]
    },
    {
      id: "dytt_tv",
      title: "剧集",
      functionName: "loadTvList",
      type: "video",
      cacheDuration: 3600,
      params: [{ name: "page", title: "页码", type: "page", startPage: 1 }]
    },
    {
      id: "dytt_variety",
      title: "综艺",
      functionName: "loadVarietyList",
      type: "video",
      cacheDuration: 3600,
      params: [{ name: "page", title: "页码", type: "page", startPage: 1 }]
    },
    {
      id: "dytt_anime",
      title: "动漫",
      functionName: "loadAnimeList",
      type: "video",
      cacheDuration: 3600,
      params: [{ name: "page", title: "页码", type: "page", startPage: 1 }]
    },
    {
      id: "dytt_search",
      title: "搜索",
      functionName: "searchDytt",
      type: "video",
      cacheDuration: 300,
      params: [
        { name: "wd", title: "关键词", type: "input", value: "" },
        { name: "pg", title: "页码", type: "page", value: "1" }
      ]
    }
  ]
};