// ============================================================
//  西瓜短剧 — 首页 / 频道 / 刷短剧 / 搜索 / 详情 / 播放
//  源站: https://www.xgshort.com
//  JSON API，自动游客登录鉴权
// ============================================================

WidgetMetadata = {
  id: "forward.xgshort",
  title: "西瓜短剧",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "西瓜短剧 — 接入 xgshort.com API 的短剧自定义媒体库。支持首页推荐、频道筛选（短剧/电影/电视剧）、题材分类、刷短剧模式、全集详情、搜索与播放解析。",
  author: "EL",
  site: "https://www.xgshort.com",
  icon: "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><defs><linearGradient id="g" x1="10" y1="8" x2="86" y2="88" gradientUnits="userSpaceOnUse"><stop stop-color="#ff3b5f"/><stop offset=".54" stop-color="#ff8a2a"/><stop offset="1" stop-color="#22c55e"/></linearGradient></defs><rect width="96" height="96" rx="24" fill="#101014"/><rect x="13" y="14" width="70" height="68" rx="20" fill="url(#g)"/><path d="M32 30c8-10 24-10 32 0 10 13 1 35-16 42-17-7-26-29-16-42Z" fill="#fff" opacity=".92"/><path d="M41 42v18l17-9-17-9Z" fill="#101014"/><path d="M26 26c12-10 32-10 44 0" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".62"/></svg>'),
  detailCacheDuration: 600,
  modules: [
    {
      id: "xgshort-home",
      title: "首页热播",
      functionName: "loadHomeList",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "xgshort-drama",
      title: "短剧",
      functionName: "loadCategoryList",
      cacheDuration: 300,
      params: [
        { name: "channelId", title: "", type: "constant", value: "1" },
        {
          name: "sort_by", title: "排序", type: "enumeration",
          enumOptions: [
            { title: "最新", value: "0" },
            { title: "人气最高", value: "1" },
            { title: "评分最高", value: "2" }
          ],
          value: "0"
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "xgshort-movie",
      title: "电影",
      functionName: "loadCategoryList",
      cacheDuration: 300,
      params: [
        { name: "channelId", title: "", type: "constant", value: "2" },
        {
          name: "sort_by", title: "排序", type: "enumeration",
          enumOptions: [
            { title: "最新", value: "0" },
            { title: "人气最高", value: "1" },
            { title: "评分最高", value: "2" }
          ],
          value: "0"
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "xgshort-series",
      title: "电视剧",
      functionName: "loadCategoryList",
      cacheDuration: 300,
      params: [
        { name: "channelId", title: "", type: "constant", value: "3" },
        {
          name: "sort_by", title: "排序", type: "enumeration",
          enumOptions: [
            { title: "最新", value: "0" },
            { title: "人气最高", value: "1" },
            { title: "评分最高", value: "2" }
          ],
          value: "0"
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "xgshort-feed",
      title: "刷短剧",
      functionName: "loadShortFeed",
      cacheDuration: 120,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "xgshort-topic",
      title: "题材筛选",
      functionName: "loadTopicList",
      cacheDuration: 300,
      params: [
        {
          name: "topicId", title: "题材", type: "enumeration",
          enumOptions: [
            { title: "全部", value: "0" },
            { title: "男频", value: "1" },
            { title: "女频", value: "2" },
            { title: "逆袭", value: "3" },
            { title: "都市", value: "4" },
            { title: "穿越", value: "5" },
            { title: "战神", value: "6" },
            { title: "赘婿", value: "7" },
            { title: "霸总", value: "8" },
            { title: "甜宠", value: "9" },
            { title: "悬疑", value: "10" },
            { title: "奇幻", value: "11" },
            { title: "复仇", value: "12" },
            { title: "家庭", value: "13" },
            { title: "搞笑", value: "14" },
            { title: "重生", value: "15" },
            { title: "乡村", value: "16" },
            { title: "热血", value: "17" },
            { title: "励志", value: "18" },
            { title: "剧情", value: "19" },
            { title: "爱情", value: "20" },
            { title: "古装", value: "23" },
            { title: "玄幻", value: "28" },
            { title: "科幻", value: "30" },
            { title: "动作", value: "25" }
          ],
          value: "0"
        },
        { name: "page", title: "页码", type: "page" }
      ]
    }
  ],
  search: {
    title: "搜索",
    functionName: "searchShort",
    params: [
      { name: "keyword", title: "关键词", type: "input" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

// ============================================================
//  常量定义
// ============================================================

var XG_BASE = 'https://www.xgshort.com';
var XG_API = XG_BASE + '/api';
var XG_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

var DEFAULT_FILTER_IDS = [0, 0, 0, 0, 0, 0];
var MAX_DETAIL_EPISODES = 500;

// ============================================================
//  工具函数
// ============================================================

function stringValue(value) {
  if (value == null) return '';
  return String(value).trim();
}

function arrayValue(value) {
  return Array.isArray(value) ? value : [];
}

function positiveInt(value, fallback) {
  var number = Number(value);
  if (!isFinite(number) || number < 0) return fallback == null ? 0 : fallback;
  return Math.floor(number);
}

function uniqueStrings(values) {
  var seen = {};
  var result = [];
  (values || []).forEach(function (value) {
    var text = stringValue(value);
    if (!text || seen[text]) return;
    seen[text] = true;
    result.push(text);
  });
  return result;
}

function yearFrom(value) {
  var match = /(?:^|[^\d])((?:19|20)\d{2})(?:[^\d]|$)/.exec(stringValue(value));
  return match ? Number(match[1]) : undefined;
}

function scoreValue(value) {
  var score = Number(value);
  if (!isFinite(score) || score <= 0) return undefined;
  return score;
}

function secondsToMinutes(seconds) {
  var value = Number(seconds);
  if (!isFinite(value) || value <= 0) return undefined;
  return Math.max(1, Math.round(value / 60));
}

function formatCount(value) {
  var number = Number(value);
  if (!isFinite(number) || number <= 0) return '';
  if (number >= 100000000) return trimNumber(number / 100000000) + '亿';
  if (number >= 10000) return trimNumber(number / 10000) + '万';
  return String(Math.round(number));
}

function trimNumber(value) {
  return (Math.round(value * 10) / 10).toFixed(1).replace(/\.0$/, '');
}

function imageURL(value) {
  var text = stringValue(value);
  if (!text) return undefined;
  if (/^https?:\/\//i.test(text)) return text;
  if (text.indexOf('//') === 0) return 'https:' + text;
  if (text.charAt(0) === '/') return XG_BASE + text;
  return text;
}

function containerFromURL(url) {
  var match = /\.([a-z0-9]+)(?:\?|#|$)/i.exec(stringValue(url));
  return match ? match[1].toLowerCase() : undefined;
}

function episodeDisplayTitle(episode) {
  var number = positiveInt(episode.episodeNumber, 0);
  var title = stringValue(episode.episodeTitle || episode.title);
  if (number > 0) return '第 ' + number + ' 集';
  return title || '正片';
}

function splitPeople(value) {
  return uniqueStrings(
    stringValue(value)
      .split(/[,，、/|]+/)
      .map(function (item) { return item.trim(); })
      .filter(Boolean)
  ).slice(0, 18);
}

// ============================================================
//  存储与认证
// ============================================================

function storageGet(key) {
  if (typeof Widget !== 'undefined' && Widget.storage && typeof Widget.storage.get === 'function') {
    return Widget.storage.get(key);
  }
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (_) {}
  return null;
}

function storageSet(key, value) {
  if (typeof Widget !== 'undefined' && Widget.storage && typeof Widget.storage.set === 'function') {
    Widget.storage.set(key, value);
    return;
  }
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {}
}

async function ensureAuth() {
  var cached = storageGet('xgshort.auth');
  if (cached && cached.accessToken && Number(cached.expiresAt) > Date.now() + 60 * 1000) {
    return cached;
  }
  var guestToken = cached && cached.guestToken ? cached.guestToken : '';
  var response = await requestJSON('POST', apiURL('/auth/guest-login'), { guestToken: guestToken }, baseHeaders());
  var tokenType = stringValue(response.token_type || response.tokenType || 'Bearer') || 'Bearer';
  var accessToken = stringValue(response.access_token || response.accessToken);
  if (!accessToken) throw new Error('[xgshort] 游客登录失败');
  var auth = {
    tokenType: tokenType,
    accessToken: accessToken,
    refreshToken: stringValue(response.refresh_token || response.refreshToken),
    guestToken: stringValue(response.guestToken || guestToken),
    expiresAt: Date.now() + Math.max(1, positiveInt(response.expires_in, 604800) - 300) * 1000
  };
  storageSet('xgshort.auth', auth);
  return auth;
}

// ============================================================
//  API 请求
// ============================================================

function apiURL(path, query) {
  var url = /^https?:\/\//i.test(path) ? path : XG_API + (path.charAt(0) === '/' ? path : '/' + path);
  var params = [];
  if (query) {
    Object.keys(query).forEach(function (key) {
      var value = query[key];
      if (value == null || value === '') return;
      params.push(encodeURIComponent(key) + '=' + encodeURIComponent(String(value)));
    });
  }
  if (params.length) url += (url.indexOf('?') >= 0 ? '&' : '?') + params.join('&');
  return url;
}

function baseHeaders() {
  return {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'User-Agent': XG_UA,
    Origin: XG_BASE,
    Referer: XG_BASE + '/',
    'Accept-Language': 'zh-CN,zh-Hans;q=0.9,en;q=0.7'
  };
}

function authHeaders(auth) {
  var headers = baseHeaders();
  headers.Authorization = auth.tokenType + ' ' + auth.accessToken;
  return headers;
}

function imageHeaders() {
  return {
    'User-Agent': XG_UA,
    Referer: XG_BASE + '/'
  };
}

function playbackHeaders() {
  return {
    Referer: XG_BASE + '/',
    Origin: XG_BASE
  };
}

async function requestJSON(method, url, body, headers) {
  var response;
  if (typeof Widget !== 'undefined' && Widget.http) {
    if (method === 'POST' && typeof Widget.http.post === 'function') {
      response = await Widget.http.post(url, body || {}, { headers: headers, timeout: 15 });
    } else if (typeof Widget.http.get === 'function') {
      response = await Widget.http.get(url, { headers: headers, timeout: 15 });
    }
  } else if (typeof fetch === 'function') {
    var fetchResponse = await fetch(url, {
      method: method,
      headers: headers,
      body: method === 'POST' ? JSON.stringify(body || {}) : undefined
    });
    response = {
      status: fetchResponse.status,
      data: await fetchResponse.text(),
      url: fetchResponse.url
    };
  }
  if (!response) throw new Error('[xgshort] 环境缺少 HTTP 请求能力');
  var status = Number(response.status || 0);
  var data = response.data;
  if (typeof data === 'string') {
    if (/cloudflare|challenge-platform|cf_clearance/i.test(data)) {
      throw new Error('[xgshort] 接口返回 Cloudflare 校验页');
    }
    try {
      data = JSON.parse(data);
    } catch (error) {
      throw new Error('[xgshort] 接口返回数据不是 JSON');
    }
  }
  if (status >= 400) {
    throw new Error('[xgshort] 请求失败：HTTP ' + status);
  }
  if (data && typeof data === 'object' && data.code && Number(data.code) !== 200) {
    throw new Error(data.message || data.msg || '[xgshort] 接口返回错误');
  }
  return data;
}

function unwrapData(response) {
  if (response && Object.prototype.hasOwnProperty.call(response, 'data')) return response.data;
  return response;
}

async function apiGet(path, query) {
  var auth = await ensureAuth();
  return requestJSON('GET', apiURL(path, query), null, authHeaders(auth));
}

async function apiPost(path, body) {
  var auth = await ensureAuth();
  return requestJSON('POST', apiURL(path), body, authHeaders(auth));
}

// ============================================================
//  数据加载函数
// ============================================================

async function loadSeriesDetail(seriesShortId) {
  var cacheKey = 'xgshort.detail.' + seriesShortId;
  var cached = storageGet(cacheKey);
  if (cached && cached.time && cached.data && Date.now() - Number(cached.time) < 10 * 60 * 1000) {
    return cached.data;
  }

  var page = 1;
  var hasMore = true;
  var seriesInfo = null;
  var tags = [];
  var episodes = [];
  while (hasMore && episodes.length < MAX_DETAIL_EPISODES) {
    var response = await apiGet('/video/episodes', {
      seriesShortId: seriesShortId,
      page: page,
      size: Math.min(200, MAX_DETAIL_EPISODES - episodes.length)
    });
    var payload = unwrapData(response);
    if (!seriesInfo && payload && payload.seriesInfo) seriesInfo = payload.seriesInfo;
    if (payload && payload.tags) tags = payload.tags;
    var list = arrayValue(payload && payload.list);
    episodes.push.apply(episodes, list);
    hasMore = !!(payload && payload.hasMore) && list.length > 0;
    page += 1;
  }

  var detail = { seriesInfo: seriesInfo || {}, tags: tags, episodes: episodes };
  storageSet(cacheKey, { time: Date.now(), data: detail });
  return detail;
}

async function filterPage(channelId, ids, page, size) {
  var normalizedIds = normalizeFilterIds(ids);
  var response = await apiGet('/list/getfiltersdata', {
    channeid: channelId,
    ids: normalizedIds.join(','),
    page: page,
    size: size
  });
  var payload = unwrapData(response);
  var list = arrayValue(payload && payload.list);
  return {
    items: list.map(seriesItem),
    hasMore: !!(payload && payload.hasMore)
  };
}

async function recommendPage(page, size) {
  var response = await apiGet('/video/recommend', { page: page, size: size });
  var payload = unwrapData(response);
  var list = arrayValue(payload && payload.list);
  return {
    items: list.map(feedEpisodeItem),
    hasMore: !!(payload && payload.hasMore)
  };
}

async function safeFilterItems(channelId, ids, page, size) {
  try {
    var result = await filterPage(channelId, ids, page, size);
    return result.items;
  } catch (_) {
    return [];
  }
}

async function safeRecommendItems(page, size) {
  try {
    var result = await recommendPage(page, size);
    return result.items;
  } catch (_) {
    return [];
  }
}

function normalizeFilterIds(ids) {
  var result = DEFAULT_FILTER_IDS.slice();
  (ids || []).forEach(function (value, index) {
    if (index < result.length) result[index] = positiveInt(value, 0);
  });
  return result;
}

// ============================================================
//  VideoItem 构造
// ============================================================

function makeSeriesId(shortId) {
  return 'xg-series:' + encodeURIComponent(stringValue(shortId));
}

function parseSeriesShortId(value) {
  var text = stringValue(value);
  if (!text) return '';
  var match = /^xg-series:(.+)$/.exec(text);
  if (match) return decodeURIComponent(match[1]);
  return text;
}

function makeEpisodeItemId(seriesShortId, episodeShortId) {
  return 'xg-episode:' + encodeURIComponent(stringValue(seriesShortId)) + ':' + encodeURIComponent(stringValue(episodeShortId));
}

function makeVersionId(episode) {
  return 'xgplay:' + encodeURIComponent(stringValue(episode.episodeAccessKey || episode.accessKey));
}

function seriesItem(entry) {
  var shortId = stringValue(entry.shortId || entry.seriesShortId || entry.url || entry.id);
  var title = stringValue(entry.title || entry.seriesTitle || entry.name) || shortId;
  var poster = imageURL(entry.coverUrl || entry.seriesCoverUrl || entry.poster || entry.image);
  var contentType = stringValue(entry.contentType || entry.type);
  return {
    id: makeSeriesId(shortId),
    title: title,
    subtitle: [contentType, entry.upStatus || entry.updateStatus, formatCount(entry.playCount)].filter(Boolean).join(' · '),
    type: 'url',
    mediaType: mediaTypeFrom(contentType, entry),
    coverUrl: poster,
    posterPath: poster,
    backdropPath: poster,
    description: stringValue(entry.description || entry.seriesDescription),
    year: yearFrom((arrayValue(entry.tags).join(' ') || entry.createdAt || '')),
    rating: scoreValue(entry.score || entry.seriesScore),
    remarks: stringValue(entry.upStatus || entry.updateStatus),
    metadataText: formatCount(entry.playCount),
    badges: uniqueStrings([contentType].concat(arrayValue(entry.tags))).slice(0, 4),
    aspectRatio: '2:3',
    headers: imageHeaders(),
    link: makeSeriesId(shortId)
  };
}

function feedEpisodeItem(entry) {
  var seriesShortId = stringValue(entry.seriesShortId);
  var episodeShortId = stringValue(entry.shortId || entry.episodeShortId);
  var title = stringValue(entry.seriesTitle || entry.title) || episodeShortId;
  var episodeTitle = episodeDisplayTitle(entry);
  var poster = imageURL(entry.seriesCoverUrl || entry.coverUrl);
  return {
    id: makeEpisodeItemId(seriesShortId, episodeShortId || entry.episodeNumber),
    title: title,
    subtitle: episodeTitle,
    type: 'url',
    mediaType: 'tv',
    coverUrl: poster,
    posterPath: poster,
    backdropPath: poster,
    description: stringValue(entry.seriesDescription),
    year: yearFrom(arrayValue(entry.tags).join(' ') || entry.createdAt),
    rating: scoreValue(entry.seriesScore),
    remarks: secondsToMinutes(entry.duration) ? secondsToMinutes(entry.duration) + '分钟' : '',
    metadataText: [episodeTitle, formatCount(entry.playCount)].filter(Boolean).join(' · '),
    badges: uniqueStrings([entry.contentType].concat(arrayValue(entry.tags))).slice(0, 4),
    aspectRatio: '9:16',
    headers: imageHeaders(),
    link: makeSeriesId(seriesShortId),
    videoUrl: firstPlayableURL(entry) || undefined,
    customHeaders: playbackHeaders(),
    playerType: 'app'
  };
}

function episodeItem(episode, series, cover) {
  var episodeShortId = stringValue(episode.shortId || episode.episodeShortId || episode.id);
  var seriesShortId = stringValue(episode.seriesShortId || series.shortId || '');
  var episodeTitle = episodeDisplayTitle(episode);
  var accessKey = stringValue(episode.episodeAccessKey || episode.accessKey);
  return {
    id: episodeShortId,
    type: 'url',
    title: episodeTitle,
    episodeNumber: positiveInt(episode.episodeNumber, undefined),
    link: 'xg-episode:' + encodeURIComponent(accessKey)
  };
}

function resourceGroupsForEpisode(episode) {
  var urls = arrayValue(episode.urls);
  var versions = urls.length ? urls.map(function (urlHint, index) {
    var playURL = stringValue(urlHint.cdnUrl || urlHint.ossUrl || urlHint.url || urlHint.playUrl);
    return {
      id: 'xg-v:' + index,
      name: qualityName(urlHint.quality) || '播放',
      subtitle: episode.duration ? secondsToMinutes(episode.duration) + '分钟' : '',
      url: playURL || undefined,
      container: playURL ? containerFromURL(playURL) : undefined,
      headers: playbackHeaders(),
      default: index === 0,
      action: {
        type: 'play',
        episodeId: stringValue(episode.shortId || episode.episodeShortId),
        versionId: makeVersionId(episode),
        url: playURL || makeVersionId(episode),
        headers: playbackHeaders(),
        title: qualityName(urlHint.quality) || '播放'
      }
    };
  }) : [
    {
      id: 'xg-v:0',
      name: '播放',
      default: true,
      action: {
        type: 'play',
        episodeId: stringValue(episode.shortId || episode.episodeShortId),
        versionId: makeVersionId(episode),
        url: makeVersionId(episode),
        title: '播放'
      }
    }
  ];
  return [
    {
      id: 'xgshort-quality',
      title: '清晰度',
      versions: versions
    }
  ];
}

function firstPlayableURL(entry) {
  var urls = arrayValue(entry && entry.urls);
  if (urls.length) {
    var first = urls[0];
    return stringValue(first.cdnUrl || first.ossUrl || first.url || first.playUrl);
  }
  return '';
}

function mediaTypeFrom(contentType, entry) {
  var text = stringValue(contentType);
  if (/电影|movie/i.test(text)) return 'movie';
  if (entry && entry.isSerial === false && !/短剧|剧|series|tv/i.test(text)) return 'movie';
  return 'tv';
}

function qualityName(value) {
  var text = stringValue(value);
  return text ? text.toUpperCase() : '';
}

// ============================================================
//  模块处理函数
// ============================================================

/**
 * 首页热播列表
 * 返回短剧频道的热门内容
 */
async function loadHomeList(params) {
  try {
    var page = positiveInt(params.page, 1);
    var items = await safeFilterItems(1, DEFAULT_FILTER_IDS, page, 30);
    return items;
  } catch (error) {
    console.error('[xgshort] loadHomeList 失败:', error.message || error);
    throw error;
  }
}

/**
 * 频道筛选列表（短剧/电影/电视剧 + 排序）
 */
async function loadCategoryList(params) {
  try {
    var channelId = positiveInt(params.channelId, 1);
    var sortValue = stringValue(params.sort_by) || '0';
    var page = positiveInt(params.page, 1);
    var ids = DEFAULT_FILTER_IDS.slice();
    ids[0] = Number(sortValue);
    var result = await filterPage(channelId, ids, page, 30);
    var channelNames = { 1: '短剧', 2: '电影', 3: '电视剧' };
    var title = channelNames[channelId] || '频道';
    return result.items;
  } catch (error) {
    console.error('[xgshort] loadCategoryList 失败:', error.message || error);
    throw error;
  }
}

/**
 * 刷短剧 — 竖屏推荐流
 */
async function loadShortFeed(params) {
  try {
    var page = positiveInt(params.page, 1);
    var result = await recommendPage(page, 10);
    return result.items;
  } catch (error) {
    console.error('[xgshort] loadShortFeed 失败:', error.message || error);
    throw error;
  }
}

/**
 * 题材筛选列表
 */
async function loadTopicList(params) {
  try {
    var topicId = positiveInt(params.topicId, 0);
    var page = positiveInt(params.page, 1);
    var ids = DEFAULT_FILTER_IDS.slice();
    ids[1] = topicId;
    var result = await filterPage(1, ids, page, 30);
    return result.items;
  } catch (error) {
    console.error('[xgshort] loadTopicList 失败:', error.message || error);
    throw error;
  }
}

// ============================================================
//  搜索
// ============================================================

async function searchShort(params) {
  try {
    var query = stringValue(params.keyword || params.query || params.text);
    if (!query) return [];
    var page = positiveInt(params.page, 1);
    var response = await apiGet('/list/fuzzysearch', { keyword: query, page: page, size: 30 });
    var payload = unwrapData(response);
    var list = arrayValue(payload && payload.list);
    var items = list.map(seriesItem);
    return items;
  } catch (error) {
    console.error('[xgshort] searchShort 失败:', error.message || error);
    throw error;
  }
}

// ============================================================
//  详情页
// ============================================================

async function loadDetail(link) {
  try {
    // 剧集播放链接: 直接解析 accessKey，跳过全集列表加载
    if (link && link.indexOf('xg-episode:') === 0) {
      var accessKey = decodeURIComponent(link.substring('xg-episode:'.length));
      if (!accessKey) return null;
      
      var response = await apiPost('/video/url/query', { type: 'episode', accessKey: accessKey });
      var payload = unwrapData(response);
      var urls = arrayValue(payload && payload.urls);
      var selected = selectPlayableURL(urls);
      var finalURL = stringValue(selected && (selected.cdnUrl || selected.ossUrl || selected.url || selected.playUrl));
      if (!finalURL) return null;
      
      return {
        id: link,
        type: 'url',
        videoUrl: finalURL,
        customHeaders: playbackHeaders(),
        playerType: 'app',
        link: link
      };
    }
    
    // 正常系列详情
    var seriesShortId = parseSeriesShortId(link);
    if (!seriesShortId) return null;
    var detail = await loadSeriesDetail(seriesShortId);
    var series = detail.seriesInfo || {};
    var episodes = detail.episodes || [];
    var firstEpisode = episodes[0] || {};
    var cover = imageURL(series.coverUrl || firstEpisode.seriesCoverUrl);
    var actors = splitPeople(series.actor || series.starring || firstEpisode.seriesActor || firstEpisode.seriesStarring);
    var title = stringValue(series.title || firstEpisode.seriesTitle || seriesShortId);
    var tags = uniqueStrings([].concat(arrayValue(series.tags), arrayValue(detail.tags), arrayValue(firstEpisode.tags)));
    var recommendations = await safeRecommendItems(1, 18);

    return {
      id: link,
      title: title,
      type: 'url',
      mediaType: 'tv',
      coverUrl: cover,
      posterPath: cover,
      backdropPath: cover,
      headers: imageHeaders(),
      description: stringValue(series.description || firstEpisode.seriesDescription),
      year: yearFrom(series.postTime || firstEpisode.createdAt || tags.join(' ')),
      rating: scoreValue(series.score || firstEpisode.seriesScore),
      runtimeMinutes: secondsToMinutes(firstEpisode.duration),
      viewCountText: formatCount(series.playCount || firstEpisode.playCount),
      genreItems: tags.slice(0, 8).map(function (tag) {
        return { id: tag, title: tag };
      }),
      peoples: actors.map(function (name) {
        return {
          id: name,
          title: name,
          role: '演员'
        };
      }),
      episodeItems: episodes.map(function (ep) {
        return episodeItem(ep, series, cover);
      }),
      resourceGroups: episodes.length ? resourceGroupsForEpisode(episodes[0]) : [],
      relatedItems: recommendations.slice(0, 18),
      link: link
    };
  } catch (error) {
    console.error('[xgshort] loadDetail 失败:', error.message || error);
    return null;
  }
}

// ============================================================
//  播放资源（动态获取播放地址）
// ============================================================

async function loadResource(params) {
  try {
    // 优先从 versionId 中解析 accessKey
    var versionId = stringValue(params.versionId || params.id);
    var directURL = stringValue(params.url || params.videoUrl);

    // 如果有直链且不是 versionId 格式，直接返回
    if (directURL && /^https?:\/\//i.test(directURL)) {
      return [{
        name: '播放',
        url: directURL,
        container: containerFromURL(directURL),
        customHeaders: playbackHeaders(),
        playerType: 'app'
      }];
    }

    // 从 versionId 或 url 参数中解析 xgplay: 格式的 accessKey
    var accessKey = '';
    var keySource = '';
    if (versionId.indexOf('xgplay:') === 0) {
      accessKey = decodeURIComponent(versionId.split(':')[1] || '');
      keySource = 'versionId';
    } else if (directURL && directURL.indexOf('xgplay:') === 0) {
      accessKey = decodeURIComponent(directURL.split(':')[1] || '');
      keySource = 'url';
    }

    // 尝试从 episode 参数（App 传的标准名）或缓存中获取
    if (!accessKey) {
      var episodeParam = stringValue(params.episodeId || params.episode);
      if (episodeParam) {
        var seriesShortId = parseSeriesShortId(stringValue(params.link || params.itemId || params.id));
        if (seriesShortId) {
          var cacheKey = 'xgshort.detail.' + seriesShortId;
          var cached = storageGet(cacheKey);
          if (cached && cached.data) {
            var episodes = cached.data.episodes || [];
            var ep = episodes.find(function (e) {
              return String(e.shortId || e.episodeShortId || e.id) === episodeParam ||
                     String(e.episodeNumber) === episodeParam;
            });
            if (ep) accessKey = stringValue(ep.episodeAccessKey || ep.accessKey);
          }
        }
      }
    }

    if (!accessKey) throw new Error('[xgshort] 播放参数缺少 accessKey');

    var response = await apiPost('/video/url/query', { type: 'episode', accessKey: accessKey });
    var payload = unwrapData(response);
    var urls = arrayValue(payload && payload.urls);
    var selected = selectPlayableURL(urls);
    var finalURL = stringValue(selected && (selected.cdnUrl || selected.ossUrl || selected.url || selected.playUrl));
    if (!finalURL) throw new Error('[xgshort] 没有返回可播放地址');

    return [{
      name: qualityName(selected.quality) || '播放',
      url: finalURL,
      container: containerFromURL(finalURL),
      customHeaders: playbackHeaders(),
      playerType: 'app'
    }];
  } catch (error) {
    console.error('[xgshort] loadResource 失败:', error.message || error);
    throw error;
  }
}

function selectPlayableURL(urls) {
  if (!urls || !urls.length) return null;
  return urls.slice().sort(function (left, right) {
    return qualityScore(right.quality) - qualityScore(left.quality);
  })[0];
}

function qualityScore(value) {
  var match = /(\d{3,4})/.exec(stringValue(value));
  return match ? Number(match[1]) : 0;
}
