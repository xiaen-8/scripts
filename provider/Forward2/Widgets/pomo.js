WidgetMetadata = {
  id: "gm.pomo",
  title: "Pomo",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "Pomo",
  author: "GM",
  site: "https://pomo.mom/",
  icon: "",
  detailCacheDuration: 300,
  modules: [
    {
      id: "loadList",
      title: "最新上映",
      functionName: "loadList",
      cacheDuration: 600,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadHuayu",
      title: "华语热门",
      functionName: "loadHuayu",
      cacheDuration: 600,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadJiating",
      title: "家庭影院",
      functionName: "loadJiating",
      cacheDuration: 600,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadDonghua",
      title: "动画大电影",
      functionName: "loadDonghua",
      cacheDuration: 600,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadLengmen",
      title: "冷门佳片",
      functionName: "loadLengmen",
      cacheDuration: 600,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadTOP250",
      title: "TOP250",
      functionName: "loadTOP250",
      cacheDuration: 600,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadDianshiju",
      title: "剧集",
      functionName: "loadDianshiju",
      cacheDuration: 600,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadBluray",
      title: "蓝光原盘",
      functionName: "loadBluray",
      cacheDuration: 600,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadResource",
      title: "加载资源",
      functionName: "loadResource",
      type: "stream",
      params: []
    }
  ],
  search: {
    title: "搜索",
    functionName: "search",
    params: [
      { name: "keyword", title: "关键词", type: "input", value: "" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

// ============================================================
// 基础配置
// ============================================================

var BASE = "https://pomo.mom";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var COMMON_HEADERS = {
  "User-Agent": UA,
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "zh-CN,zh;q=0.9"
};

// ============================================================
// 工具函数
// ============================================================

function requestHtml(url, referer) {
  var options = { headers: Object.assign({}, COMMON_HEADERS) };
  if (referer) {
    options.headers["Referer"] = referer;
  }
  return Widget.http.get(url, options);
}

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

/**
 * 从列表页 HTML 提取电影卡片
 * 首页、搜索页、分类页通用
 */
function extractCards(html) {
  var $ = Widget.html.load(html);
  var cards = [];

  // 尝试选择器1：标准卡片网格
  var $gridCards = $('div[class*="bg-cardbg"][class*="rounded-xl"][class*="overflow-hidden"]');

  // 尝试选择器2：更宽松的网格卡片
  if ($gridCards.length === 0) {
    $gridCards = $('div.bg-cardbg, div[class*="bg-cardbg"]').filter(function () {
      var $this = $(this);
      return $this.find('img').length > 0 && $this.find('a[href*="pomo.mom/"]').length > 0;
    });
  }

  // 尝试选择器3：退化为查找所有含电影链接的卡片区域
  if ($gridCards.length === 0) {
    $gridCards = $('a[href*="pomo.mom/"]').filter(function () {
      var href = $(this).attr('href') || '';
      return /\/(\d+)(?:\.html)?/.test(href) && $(this).find('img').length > 0;
    }).map(function () {
      return $(this).closest('div');
    });
  }

  $gridCards.each(function () {
    var $card = $(this);

    // 提取链接
    var $link = $card.find('a[href*="pomo.mom/"]').first();
    if ($link.length === 0) {
      $link = $card.is('a') ? $card : $card.find('a').first();
    }
    if ($link.length === 0) return;

    var href = ($link.attr('href') || '').trim();
    var idMatch = href.match(/\/(\d+)(?:\.html)?/);
    if (!idMatch) return;
    var id = idMatch[1];

    // 提取海报
    var $img = $card.find('img').first();
    var posterPath = ($img.attr('src') || '').trim();

    // 提取标题
    var $title = $card.find('h3').first();
    var title = normalizeText($title.text());

    // 如果没找到 h3，尝试用 alt
    if (!title) {
      title = normalizeText($img.attr('alt') || '');
    }

    // 跳过没有标题也没有海报的
    if (!title && !posterPath) return;

    // 英文名
    var $enDiv = $card.find('div[class*="text-gray-300"]').first();
    var enTitle = normalizeText($enDiv.text());

    // 类型/标签
    var $genreDiv = $card.find('div[class*="text-gray-400"]').first();
    var genre = normalizeText($genreDiv.text());

    // IMDB 评分
    var ratingText = normalizeText($card.find('.highlight').first().text());
    var rating = ratingText ? parseFloat(ratingText) : 0;

    // 构建描述
    var parts = [];
    if (enTitle && enTitle !== title) parts.push(enTitle);
    if (genre) parts.push(genre);

    cards.push({
      id: id,
      type: "url",
      title: title || enTitle || "未知",
      posterPath: posterPath,
      rating: rating,
      description: parts.join(" / "),
      mediaType: "movie",
      link: "pomo:" + id
    });
  });

  // 去重
  var seen = {};
  var unique = [];
  for (var i = 0; i < cards.length; i++) {
    var c = cards[i];
    if (!seen[c.link]) {
      seen[c.link] = true;
      unique.push(c);
    }
  }
  return unique;
}

// ============================================================
// 列表模块
// ============================================================

async function loadList(params) {
  try {
    params = params || {};
    var page = Number(params.page || 1);
    var url = page > 1 ? BASE + "/page/" + page : BASE;

    var res = await requestHtml(url);
    if (!res || !res.data) return [];

    var cards = extractCards(res.data);
    return cards;
  } catch (e) {
    console.log("loadList error: " + (e.message || e));
    return [];
  }
}

// ============================================================
// 搜索模块
// ============================================================

async function search(params) {
  try {
    params = params || {};
    var keyword = (params.keyword || "").trim();
    if (!keyword) return [];

    var page = Number(params.page || 1);
    var url = BASE + "/?keyword=" + encodeURIComponent(keyword);
    if (page > 1) {
      url = BASE + "/page/" + page + "?keyword=" + encodeURIComponent(keyword);
    }

    var res = await requestHtml(url);
    if (!res || !res.data) return [];

    return extractCards(res.data);
  } catch (e) {
    console.log("search error: " + (e.message || e));
    return [];
  }
}

// ============================================================
// 分类模块 — 各分类共用 loadCategoryPage
// ============================================================

async function loadCategoryPage(path, params) {
  try {
    params = params || {};
    var page = Number(params.page || 1);
    var url = BASE + "/" + path;
    if (page > 1) {
      url = BASE + "/" + path + "/page/" + page;
    }

    var res = await requestHtml(url);
    if (!res || !res.data) return [];

    return extractCards(res.data);
  } catch (e) {
    console.log("loadCategoryPage error: " + (e.message || e));
    return [];
  }
}

async function loadHuayu(params) {
  return loadCategoryPage("huayurm", params);
}

async function loadJiating(params) {
  return loadCategoryPage("jiating", params);
}

async function loadDonghua(params) {
  return loadCategoryPage("donghuadadiany", params);
}

async function loadLengmen(params) {
  return loadCategoryPage("lengmenjiapian", params);
}

async function loadTOP250(params) {
  return loadCategoryPage("paihangbang", params);
}

async function loadDianshiju(params) {
  return loadCategoryPage("dianshiju", params);
}

async function loadBluray(params) {
  return loadCategoryPage("sort/12", params);
}

// ============================================================
// 详情模块
// ============================================================

async function loadDetail(link) {
  try {
    var id = String(link).split(":")[1];
    if (!id) return null;

    var detailUrl = BASE + "/" + id;

    // 请求详情页
    var detailRes = await requestHtml(detailUrl, BASE + "/");
    if (!detailRes || !detailRes.data) return null;
    var html = detailRes.data;
    var $ = Widget.html.load(html);

    // --- 标题 ---
    var title = normalizeText($('h2.x-dbjs-title').first().text())
      || normalizeText($('h2').first().text())
      || '';

    // --- 海报 ---
    var posterPath = ($('div.x-dbjs-poster img').first().attr('src') || '').trim()
      || ($('meta[property="og:image"]').attr('content') || '').trim()
      || '';

    // --- IMDB 评分 ---
    var ratingText = normalizeText($('.x-dbjs-badge.rating-badge').first().text());
    var ratingMatch = ratingText.match(/([\d.]+)/);
    var rating = ratingMatch ? parseFloat(ratingMatch[1]) : 0;

    // --- 元数据 ---
    var alias = '';
    var genres = '';
    var director = '';
    var releaseDate = '';
    var actorsStr = '';

    $('.meta-row').each(function () {
      var text = normalizeText($(this).text());
      if (text.indexOf('别名') === 0) alias = text.replace('别名：', '').trim();
      if (text.indexOf('类型') === 0) genres = text.replace('类型：', '').trim();
      if (text.indexOf('导演') === 0) director = text.replace('导演：', '').trim();
      if (text.indexOf('时间') === 0) releaseDate = text.replace('时间：', '').trim();
      if (text.indexOf('演员') === 0) actorsStr = text.replace(/^演员阵容?：/, '').trim();
    });

    // --- 剧情简介 ---
    var description = '';
    var $introH3 = $('h3').filter(function () {
      return $(this).text().indexOf('剧情简介') >= 0;
    }).first();

    if ($introH3.length > 0) {
      var $descP = $introH3.nextAll('p').first();
      description = normalizeText($descP.text());
    }

    // --- 剧照 ---
    var backdropPaths = [];
    $('ul.pic-col5 img').each(function () {
      var src = ($(this).attr('src') || '').trim();
      if (src) backdropPaths.push(src);
    });
    if (backdropPaths.length === 0 && posterPath) {
      backdropPaths.push(posterPath);
    }

    // --- genreItems ---
    var genreItems = [];
    if (genres) {
      var genreList = genres.split(/[,，\/]/);
      for (var gi = 0; gi < genreList.length; gi++) {
        var g = genreList[gi].trim();
        if (g) genreItems.push({ id: g, title: g });
      }
    }

    // --- peoples ---
    var peoples = [];
    if (actorsStr) {
      var actorList = actorsStr.split(/\s*\/\s*/);
      for (var pi = 0; pi < actorList.length; pi++) {
        var a = actorList[pi].trim();
        if (a && a.length < 30) {
          peoples.push({ id: a, title: a, role: '演员' });
        }
      }
    }

    // --- 获取播放地址：请求 plyr_player 页面提取 m3u8 ---
    var streams = await fetchStreams(id);
    var videoUrl = streams.length > 0 ? streams[0].url : '';

    // --- 构建完整描述 ---
    var fullDesc = description || '';
    var descLines = [];
    if (alias) descLines.push('别名: ' + alias);
    if (director) descLines.push('导演: ' + director);
    if (streams.length > 0) {
      var lineDesc = streams.map(function (s) { return s.name; }).join(' | ');
      descLines.push('📺 在线播放: ' + lineDesc);
    }
    if (descLines.length > 0) {
      fullDesc = descLines.join('\n') + (fullDesc ? '\n\n' + fullDesc : '');
    }

    return {
      id: link,
      type: "url",
      title: title,
      posterPath: posterPath,
      backdropPaths: backdropPaths,
      description: fullDesc,
      rating: rating,
      releaseDate: releaseDate,
      mediaType: "movie",
      genreItems: genreItems,
      peoples: peoples,
      videoUrl: videoUrl,
      link: link
    };

  } catch (e) {
    console.log("loadDetail error: " + (e.message || e));
    return null;
  }
}

// ============================================================
// 统一的 m3u8 提取：请求 plyr_player 并解析线路
// ============================================================

async function fetchStreams(movieId) {
  try {
    var playerUrl = BASE + "/?plugin=plyr_player&gid=" + movieId;
    var playerRes = await requestHtml(playerUrl, BASE + "/" + movieId);

    if (!playerRes || !playerRes.data) {
      console.log("fetchStreams: 播放页为空, id=" + movieId);
      return [];
    }

    var html = playerRes.data;
    console.log("fetchStreams: 播放页获取成功, 长度=" + html.length);

    // 方法1：提取 routeXData 数组
    var streams = extractRouteStreams(html);

    // 方法2（fallback）：直接从 HTML 中找 .m3u8 URL
    if (streams.length === 0) {
      streams = extractM3u8Fallback(html);
    }

    console.log("fetchStreams: 提取到 " + streams.length + " 个播放源");
    return streams;

  } catch (e) {
    console.log("fetchStreams error: " + (e.message || e));
    return [];
  }
}

/**
 * 从 HTML 中提取 route1Data / route2Data 线路
 * 格式: const route1Data = ["HD\u56fd\u8bed$https:\/\/...index.m3u8"];
 */
function extractRouteStreams(html) {
  var streams = [];
  var routeRegex = /const\s+(route\d+Data)\s*=\s*\[([\s\S]*?)\];/g;
  var routeMatch;

  while ((routeMatch = routeRegex.exec(html)) !== null) {
    var routeName = routeMatch[1];
    var routeBody = routeMatch[2];

    // 提取所有双引号内的字符串
    var strRegex = /"([^"]+)"/g;
    var strMatch;

    while ((strMatch = strRegex.exec(routeBody)) !== null) {
      var raw = strMatch[1];

      // 反转义
      var decoded = unescapeJsonString(raw);

      var dollarIdx = decoded.indexOf('$');
      if (dollarIdx < 0) continue;

      var label = decoded.substring(0, dollarIdx).trim();
      var streamUrl = decoded.substring(dollarIdx + 1).trim();

      if (!/^https?:\/\//.test(streamUrl)) continue;

      var routeNum = routeName.replace('route', '').replace('Data', '');
      var name = '线路' + routeNum;
      if (label) name = name + ' ' + label;

      streams.push({ name: name, description: label, url: streamUrl });
    }
  }

  return streams;
}

/**
 * Fallback：直接从 HTML 中提取所有 .m3u8 链接
 */
function extractM3u8Fallback(html) {
  var streams = [];
  var seen = {};

  // 匹配所有 https://...m3u8 的 URL（可能包含 \/ 转义）
  var m3u8Regex = /(https?:\/\/[^"'\s<>]+\.m3u8[^"'\s<>]*)/gi;
  var match;
  var idx = 0;

  while ((match = m3u8Regex.exec(html)) !== null) {
    var url = match[1];
    // 处理可能的 \/ 转义
    url = url.replace(/\\\//g, '/');

    if (seen[url]) continue;
    seen[url] = true;

    idx++;
    streams.push({
      name: '线路' + idx,
      description: '',
      url: url
    });
  }

  return streams;
}

/**
 * JSON 字符串反转义: \/ → /, \uXXXX → Unicode
 */
function unescapeJsonString(str) {
  return str
    .replace(/\\\//g, '/')
    .replace(/\\u([0-9a-fA-F]{4})/g, function (_, hex) {
      return String.fromCharCode(parseInt(hex, 16));
    });
}

// ============================================================
// 播放资源模块 — 切换播放线路
// ============================================================

async function loadResource(params) {
  try {
    params = params || {};
    var link = params.link || '';

    // 从 link 提取电影 ID: "pomo:3243" → "3243"
    var id = String(link).split(":")[1];
    if (!id) {
      console.log("loadResource: 无法解析 link=" + link);
      return [];
    }

    console.log("loadResource: id=" + id);

    var streams = await fetchStreams(id);

    if (streams.length === 0) {
      console.log("loadResource: 未找到播放源");
      return [];
    }

    // 转换为 loadResource 要求的格式
    return streams.map(function (s) {
      return {
        name: s.name,
        description: s.description || '',
        url: s.url
      };
    });

  } catch (e) {
    console.log("loadResource error: " + (e.message || e));
    return [];
  }
}
