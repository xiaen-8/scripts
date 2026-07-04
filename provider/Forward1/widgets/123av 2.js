// ============================================================
//  123AV — 视频列表、详情、搜索模块
//  源站: https://123av.com
//  SSR HTML 解析 + surrit.store API 获取播放地址
// ============================================================

WidgetMetadata = {
  id: "forward.123av",
  title: "123AV",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "123AV 日本 AV 在线观看模块。支持最新 / 热门 / 有码 / 无码 / 无码流出分类浏览，35 万+ 影片。",
  author: "EL",
  site: "https://123av.com",
  icon: "https://123av.com/assets/123av/favicon.png",
  detailCacheDuration: 60,
  modules: [
    {
      id: "new",
      title: "最新视频",
      functionName: "loadList",
      cacheDuration: 300,
      params: [
        { name: "endpoint", title: "", type: "constant", value: "new" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "hot",
      title: "热门视频",
      functionName: "loadList",
      cacheDuration: 300,
      params: [
        { name: "endpoint", title: "", type: "constant", value: "hot" },
        { name: "page", title: "页码", type: "page" },
        { name: "sort_by", title: "排序", type: "enumeration", enumOptions: [
          { title: "热门", value: "hot" },
          { title: "发行日期", value: "release_date" },
          { title: "最近添加", value: "recent" },
          { title: "今日浏览", value: "today" },
          { title: "本周浏览", value: "week" },
          { title: "本月浏览", value: "month" },
          { title: "最多观看", value: "views" },
          { title: "最多收藏", value: "follows" },
          { title: "最长时长", value: "longest" }
        ], value: "hot" }
      ]
    },
    {
      id: "recent",
      title: "最近更新",
      functionName: "loadList",
      cacheDuration: 300,
      params: [
        { name: "endpoint", title: "", type: "constant", value: "recent" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "censored",
      title: "有码",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "catType", title: "", type: "constant", value: "censored" },
        { name: "page", title: "页码", type: "page" },
        { name: "sort_by", title: "排序", type: "enumeration", enumOptions: [
          { title: "热门", value: "hot" },
          { title: "发行日期", value: "release_date" },
          { title: "最近添加", value: "recent" },
          { title: "今日浏览", value: "today" },
          { title: "本周浏览", value: "week" },
          { title: "本月浏览", value: "month" },
          { title: "最多观看", value: "views" },
          { title: "最多收藏", value: "follows" },
          { title: "最长时长", value: "longest" }
        ], value: "release_date" }
      ]
    },
    {
      id: "uncensored",
      title: "无码",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "catType", title: "", type: "constant", value: "uncensored" },
        { name: "page", title: "页码", type: "page" },
        { name: "sort_by", title: "排序", type: "enumeration", enumOptions: [
          { title: "热门", value: "hot" },
          { title: "发行日期", value: "release_date" },
          { title: "最近添加", value: "recent" },
          { title: "今日浏览", value: "today" },
          { title: "本周浏览", value: "week" },
          { title: "本月浏览", value: "month" },
          { title: "最多观看", value: "views" },
          { title: "最多收藏", value: "follows" },
          { title: "最长时长", value: "longest" }
        ], value: "release_date" }
      ]
    },
    {
      id: "uncensoredleaked",
      title: "无码流出",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "catType", title: "", type: "constant", value: "uncensored-leaked" },
        { name: "page", title: "页码", type: "page" },
        { name: "sort_by", title: "排序", type: "enumeration", enumOptions: [
          { title: "热门", value: "hot" },
          { title: "发行日期", value: "release_date" },
          { title: "最近添加", value: "recent" },
          { title: "今日浏览", value: "today" },
          { title: "本周浏览", value: "week" },
          { title: "本月浏览", value: "month" },
          { title: "最多观看", value: "views" },
          { title: "最多收藏", value: "follows" },
          { title: "最长时长", value: "longest" }
        ], value: "release_date" }
      ]
    }
  ],
  search: {
    title: "搜索番号/标题",
    functionName: "searchVideos",
    params: [
      { name: "keyword", title: "番号或关键词", type: "input", value: "" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

// ============================================================
//  常量
// ============================================================
const BASE = "https://123av.com";
const SURRIT = "https://surrit.store";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15";
const HEADERS = {
  "User-Agent": UA,
  "Referer": BASE + "/"
};

// ============================================================
//  工具函数
// ============================================================

async function fetchPage(url) {
  const resp = await Widget.http.get(url, { headers: HEADERS });
  if (!resp || !resp.data) throw new Error("请求失败: " + url);
  return resp.data;
}

function getText(html, pattern) {
  const m = pattern.exec(html);
  return m ? m[1].trim() : "";
}

// ============================================================
//  解析列表页 HTML — 按 card 切块
// ============================================================

function parseListHtml(html) {
  var items = [];
  // 匹配完整的 <div class="card" ...> 块
  var cardRegex = /<div class="card"[^>]*>[\s\S]*?<\/div>\s*<\/div>/g;
  var m;
  while ((m = cardRegex.exec(html)) !== null) {
    var block = m[0];

    // 提取 slug（从 card__cover 的 href）
    var slugMatch = block.match(/href="\/en\/v\/([^"]+)"/);
    if (!slugMatch) continue;
    var slug = slugMatch[1];

    // 提取封面图（优先 card__img 的 src）
    var coverMatch = block.match(/<img class="card__img"[^>]*src="([^"]+)"/);
    var coverUrl = coverMatch ? coverMatch[1] : "";

    // 提取标题（从 card__title a）
    var title = getText(block, /card__title[^>]*>[\s\S]*?<a[^>]*>([^<]+)</);
    if (!title) {
      title = getText(block, /card__link[^>]*>([^<]+)</);
    }

    // 提取时长
    var duration = getText(block, /card__dur[^>]*>([^<]+)</);

    // 提取观看数
    var views = getText(block, /card__views[^>]*>[\s\S]*?<svg[\s\S]*?<\/svg>\s*([\d.]+[KMB]?)/);

    // 从 slug 中提取番号（slug 通常以番号开头）
    var code = slug.split("-")[0];
    // 尝试更精确的番号提取
    var codeMatch = slug.match(/^([A-Z0-9]+[-\/][A-Z0-9]+)/i);
    if (codeMatch) code = codeMatch[1].toUpperCase();

    items.push({
      id: slug,
      type: "url",
      mediaType: "movie",
      title: title || slug,
      link: slug,
      coverUrl: coverUrl || "",
      posterPath: coverUrl || "",
      backdropPath: coverUrl || "",
      durationText: duration || "",
      remark: views ? views + " 观看" : code
    });
  }
  return items;
}

// ============================================================
//  buildUrl — 构建带分页的列表 URL
// ============================================================

function buildUrl(base, endpoint, page, sortBy) {
  var url;
  if (page > 1) {
    url = base + "/en/" + endpoint + "?page=" + page;
  } else {
    url = base + "/en/" + endpoint;
  }
  if (sortBy) {
    url += (url.indexOf("?") >= 0 ? "&" : "?") + "sort=" + encodeURIComponent(sortBy);
  }
  return url;
}

// ============================================================
//  loadList — 通用列表加载
//  处理 genreId → loadCategory, peopleId → loadCategory
// ============================================================

async function loadList(params) {
  try {
    if (params.genreId) return loadCategory({ catType: null, page: params.page, genreId: params.genreId });
    if (params.peopleId) return loadCategory({ catType: null, page: params.page, peopleId: params.peopleId });

    var endpoint = params.endpoint || "new";
    var page = Math.max(1, Number(params.page) || 1);
    var sortBy = (endpoint === "hot") ? (params.sort_by || "") : "";
    var url = buildUrl(BASE, endpoint, page, sortBy);
    var html = await fetchPage(url);
    var items = parseListHtml(html);

    // 首页有一些 featured 项目，可以额外收集
    if (endpoint === "new" && page === 1) {
      // 尝试从首页的 sections 中提取更多
      // 首页已包含 normal-list 区域的数据
    }

    return items;
  } catch (error) {
    console.error("[123AV loadList] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadCategory — 分类浏览
// ============================================================

async function loadCategory(params) {
  try {
    var page = Math.max(1, Number(params.page) || 1);

    // 处理详情页跳转过来的 genreId / peopleId
    if (params.genreId) {
      var url = buildUrl(BASE, "genres/" + params.genreId, page);
      var html = await fetchPage(url);
      return parseListHtml(html);
    }
    if (params.peopleId) {
      var url = buildUrl(BASE, "actresses/" + params.peopleId, page);
      var html = await fetchPage(url);
      return parseListHtml(html);
    }

    var catType = params.catType || "";
    if (!catType) return [];

    var sortBy = params.sort_by || "";
    var url = buildUrl(BASE, catType, page, sortBy);
    var html = await fetchPage(url);
    return parseListHtml(html);
  } catch (error) {
    console.error("[123AV loadCategory] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  searchVideos — 搜索
//  通过站点搜索页 HTML 提取结果
// ============================================================

async function searchVideos(params) {
  try {
    var keyword = (params.keyword || "").trim();
    if (!keyword) throw new Error("请输入搜索关键词");

    var page = Math.max(1, Number(params.page) || 1);

    // 尝试直接请求搜索页（SSR 可能返回空，但试试）
    try {
      var searchUrl = BASE + "/en/search?q=" + encodeURIComponent(keyword) + "&page=" + page;
      var html = await fetchPage(searchUrl);

      // 看看有没有搜索结果（SSR 搜索页通常为空，但万一有）
      var items = parseListHtml(html);
      if (items.length > 0) return items;
    } catch (e) {
      // 搜索页 SSR 无结果，回退
    }

    // 回退: 通过番号直接查详情页
    try {
      var code = keyword.toUpperCase().replace(/[^A-Z0-9-]/g, "");
      // 尝试直接访问详情页（如果 keyword 是番号）
      var detailUrl = BASE + "/en/v/" + encodeURIComponent(code);
      var html = await fetchPage(detailUrl);

      // 检查是否是有效的视频详情页（包含 player x-data）
      if (html.indexOf('x-data="player') >= 0) {
        var ogTitle = getText(html, /<meta[^>]+property="og:title"[^>]+content="([^"]+)"/);
        var ogImage = getText(html, /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/);

        return [{
          id: code,
          type: "url",
          mediaType: "movie",
          title: ogTitle || code,
          link: code.toLowerCase(),
          coverUrl: ogImage || "",
          posterPath: ogImage || "",
          backdropPath: ogImage || "",
          remark: code
        }];
      }
    } catch (e) {
      // 不是有效的番号
    }

    return [];
  } catch (error) {
    console.error("[123AV searchVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  getPlayableUrl — 通过 surrit.store API 获取视频播放地址
// ============================================================

async function getPlayableUrl(surritCode) {
  try {
    if (!surritCode) return "";

    var apiUrl = SURRIT + "/stream?id=" + encodeURIComponent(surritCode);
    var resp = await Widget.http.get(apiUrl, {
      headers: {
        "User-Agent": UA,
        "Referer": SURRIT + "/e/" + surritCode
      }
    });

    if (!resp || !resp.data) return "";

    var data = typeof resp.data === "string" ? JSON.parse(resp.data) : resp.data;
    if (data.status === "ok" && data.media && data.media.stream) {
      console.log("[123AV] 获取到 m3u8:", data.media.stream.substring(0, 60));
      return data.media.stream;
    }

    return "";
  } catch (error) {
    console.error("[123AV getPlayableUrl] 失败:", error.message || error);
    return "";
  }
}

// ============================================================
//  loadDetail — 视频详情
// ============================================================

async function loadDetail(link) {
  if (!link) throw new Error("无效的视频 ID");

  try {
    var slug = String(link).replace(/[^a-zA-Z0-9-_]/g, "").toLowerCase();
    if (!slug) throw new Error("无效的视频 ID");

    // 获取详情页 HTML
    var pageUrl = BASE + "/en/v/" + encodeURIComponent(slug);
    var html = await fetchPage(pageUrl);

    // 从 x-data 中提取 surrit code
    var playerMatch = html.match(/x-data="player\(JSON\.parse\('[^']*'\)/);
    var surritCode = "";
    var videoUrl = "";

    if (playerMatch) {
      try {
        // 从 x-data 中提取完整内容
        var fullData = html.match(/x-data="player\(JSON\.parse\('([^']+)'\)/);
        if (fullData && fullData[1]) {
          // 解码: \u0022 → " , \\\/ → /
          var jsonStr = fullData[1]
            .split("\\u0022").join('"')
            .split("\\\\\\/").join("/");
          var parsed = JSON.parse(jsonStr);
          if (parsed && parsed.length > 0 && parsed[0].url) {
            var embedUrl = parsed[0].url;
            // 从 embed URL 中提取海报图（列表图同源，s500 分辨率）
            var posterMatch = embedUrl.match(/[?&]poster=([^&]+)/);
            if (posterMatch) {
              thumb = decodeURIComponent(posterMatch[1]);
            }
            // 从 URL 中提取 surrit code: /e/{code}
            var codeMatch = embedUrl.match(/\/e\/([a-z0-9_]+)/i);
            if (codeMatch) {
              surritCode = codeMatch[1];
              // 通过 API 获取可播放地址
              videoUrl = await getPlayableUrl(surritCode);
            }
          }
        }
      } catch (e) {
        console.error("[123AV loadDetail] 解析播放器数据失败:", e.message || e);
      }
    }

    // 标题（og:title）
    var title = getText(html, /<meta[^>]+property="og:title"[^>]+content="([^"]+)"/);
    if (title) {
      title = title.replace(/ — 123AV$/, "").trim();
    }

    // 缩略图 — 从 player x-data 的 poster 参数提取，跟列表图同源
    if (!thumb) var thumb = "";

    // 描述
    var description = getText(html, /<meta[^>]+name="description"[^>]+content="([^"]+)"/);

    // Code
    var code = getText(html, /<dt>Code<\/dt>\s*<dd[^>]*>([^<]+)</);

    // Type
    var type = getText(html, /<dt>Type<\/dt>\s*<dd[^>]*>([^<]+)</);

    // 发行日期
    var releaseDate = getText(html, /<dt>Release date<\/dt>\s*<dd[^>]*>([^<]+)</);

    // 时长
    var duration = getText(html, /<dt>Duration<\/dt>\s*<dd[^>]*>([^<]+)</);

    // 演员
    var peoples = [];
    var actorRegex = /<a class="chip"[^>]*href="\/en\/actresses\/([^"]+)"[^>]*>([^<]+)<\/a>/g;
    var am;
    while ((am = actorRegex.exec(html)) !== null) {
      peoples.push({
        id: am[1],
        title: am[2].trim(),
        role: "actor"
      });
    }

    // 制作商
    var maker = getText(html, /<dt>Maker<\/dt>\s*<dd[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>/);

    // 分类（Genres）
    var genreItems = [];
    var genreRegex = /<a class="chip"[^>]*href="\/en\/genres\/([^"]+)"[^>]*>([^<]+)<\/a>/g;
    var gm;
    while ((gm = genreRegex.exec(html)) !== null) {
      genreItems.push({ id: gm[1], title: gm[2].trim() });
    }

    // 播放请求头
    var playHeaders = {};
    if (videoUrl) {
      playHeaders = {
        "Referer": SURRIT + "/",
        "User-Agent": UA
      };
    }

    return {
      id: slug,
      type: "url",
      mediaType: "movie",
      title: title || slug,
      link: slug,
      coverUrl: thumb || "",
      posterPath: thumb || "",
      backdropPath: thumb || "",
      videoUrl: videoUrl || "",
      customHeaders: playHeaders,
      genreItems: genreItems.length > 0 ? genreItems : undefined,
      peoples: peoples.length > 0 ? peoples : undefined,
      description: description || undefined,
      releaseDate: releaseDate || undefined,
      durationText: duration || undefined,
      remark: code || slug
    };
  } catch (error) {
    console.error("[123AV loadDetail] 失败:", error.message || error);
    throw error;
  }
}
