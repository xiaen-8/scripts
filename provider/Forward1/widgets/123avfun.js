// ============================================================
//  123AV.FUN — 短视频列表、详情、搜索模块
//  源站: https://123av.fun
//  SSR HTML 解析，视频源直接来自 data-src 属性
//  内容主要聚合自 Twitter 等社交平台，HLS 播放
// ============================================================

WidgetMetadata = {
  id: "forward.123avfun",
  title: "123AV.FUN",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "123AV.FUN 短视频社区，聚合热门国产自拍、短视频与精选长视频，24小时实时更新。",
  author: "EL",
  site: "https://123av.fun",
  icon: "https://123av.fun/image/180.png",
  detailCacheDuration: 60,
  modules: [
    {
      id: "latest",
      title: "最新发布",
      functionName: "loadList",
      cacheDuration: 300,
      params: [
        { name: "sortPath", title: "", type: "constant", value: "publish-time/sort-desc" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "most_viewed",
      title: "最多播放",
      functionName: "loadList",
      cacheDuration: 300,
      params: [
        { name: "sortPath", title: "", type: "constant", value: "view-count/sort-desc" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "most_commented",
      title: "最多评论",
      functionName: "loadList",
      cacheDuration: 300,
      params: [
        { name: "sortPath", title: "", type: "constant", value: "comment-count/sort-desc" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "most_faved",
      title: "最多收藏",
      functionName: "loadList",
      cacheDuration: 300,
      params: [
        { name: "sortPath", title: "", type: "constant", value: "favorite-count/sort-desc" },
        { name: "page", title: "页码", type: "page" }
      ]
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
//  常量
// ============================================================
const BASE = "https://123av.fun";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15";
const HEADERS = {
  "User-Agent": UA,
  "Referer": BASE + "/"
};

// ============================================================
//  工具函数
// ============================================================

async function fetchPage(url) {
  var resp = await Widget.http.get(url, { headers: HEADERS });
  if (!resp || !resp.data) throw new Error("请求失败: " + url);
  return resp.data;
}

function getText(html, pattern) {
  var m = pattern.exec(html);
  return m ? m[1].trim() : "";
}

function formatDuration(seconds) {
  var n = Number(seconds);
  if (!n || n <= 0) return "";
  var m = Math.floor(n / 60);
  var s = Math.floor(n % 60);
  return m + ":" + (s < 10 ? "0" : "") + s;
}

// ============================================================
//  parseVideoCards — 从 SSR HTML 提取视频卡片列表
//  每个卡片 <a> 标签包含完整的 data-* 属性数据
// ============================================================

function parseVideoCards(html) {
  var items = [];
  // 匹配每个完整的 <a ... data-src="..." ...> 卡片块
  var blockRegex = /<a\s[^>]*data-src="([^"]*)"[^>]*data-twitter="([^"]*)"[^>]*data-poster="([^"]*)"[^>]*data-id="(\d+)"[^>]*data-duration="([^"]*)"[^>]*data-username="([^"]*)"[^>]*data-playcount="([^"]*)"[^>]*data-videotitle="([^"]*)"[^>]*href="(\/detail\/[^"]+)"[^>]*>[\s\S]*?<div[^>]*class="[^"]*line-clamp-2[^"]*"[^>]*>([\s\S]*?)<\/div>/g;
  var seen = {};
  var m;
  while ((m = blockRegex.exec(html)) !== null) {
    var hlsUrl = m[1] || "";
    var twitterUrl = m[2] || "";
    var poster = m[3] || "";
    var id = m[4];
    var duration = m[5];
    var username = m[6];
    var playcount = m[7];
    var videotitle = m[8];
    var detailPath = m[9];
    var titleBlock = m[10];

    if (seen[id]) continue;
    seen[id] = true;

    // 清理标题
    var title = videotitle || "";
    if (!title) {
      title = getText(titleBlock, />([^<]+)</) || ("视频 " + id);
    }

    // 补全 URL
    if (poster && !poster.startsWith("http")) poster = BASE + poster;
    if (detailPath && !detailPath.startsWith("http")) detailPath = BASE + detailPath;

    // 优先使用 replacesrc / data-src（代理源），没有则用 twitter 源
    var videoUrl = hlsUrl || twitterUrl || "";

    // 尝试从块中提取 replacesrc
    var replaceMatch = blockRegex.lastIndex > 0
      ? html.substring(blockRegex.lastIndex - 1, blockRegex.lastIndex + 5000)
      : "";
    // 其实 data-src 已经在 m[1] 中了，这就是代理源

    items.push({
      id: id,
      type: "url",
      mediaType: "movie",
      title: title,
      link: id,
      coverUrl: poster || "",
      posterPath: poster || "",
      backdropPath: poster || "",
      videoUrl: videoUrl || "",
      durationText: formatDuration(duration),
      remark: playcount ? playcount + " 播放" : (username || "")
    });
  }
  return items;
}

// ============================================================
//  buildListUrl — 构建列表 URL
//  首页: /  分页: /page-N  排序: /{sort}/sort-desc
// ============================================================

function buildListUrl(sortPath, page) {
  var url = BASE;
  if (sortPath && sortPath !== "publish-time/sort-desc") {
    url += "/" + sortPath;
  }
  if (page > 1) {
    url += (url === BASE ? "" : "") + "/page-" + page;
    // 首页的分页格式: /page-2
    if (sortPath && sortPath !== "publish-time/sort-desc") {
      // 排序页的分页格式: /{sort}/sort-desc/page-N
      url = BASE + "/" + sortPath + "/page-" + page;
    } else {
      url = BASE + "/page-" + page;
    }
  }
  return url;
}

// ============================================================
//  loadList — 通用列表加载
// ============================================================

async function loadList(params) {
  try {
    if (params.genreId) {
      // 分类导航：详情页标签跳转，搜索标签视频
      return searchByTag(params.genreId, params.page);
    }
    if (params.peopleId) {
      return []; // 123av 没有演员系统
    }

    var sortPath = params.sortPath || "publish-time/sort-desc";
    var page = Math.max(1, Number(params.page) || 1);
    var url = buildListUrl(sortPath, page);
    var html = await fetchPage(url);
    return parseVideoCards(html);
  } catch (error) {
    console.error("[123AV.FUN loadList] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  searchByTag — 按标签搜索（从详情页标签跳转）
//  123av 没有直接的标签搜索页，用搜索代替
// ============================================================

async function searchByTag(tag, page) {
  try {
    var keyword = encodeURIComponent(tag);
    var p = Math.max(1, Number(page) || 1);
    var url = BASE + "/?search=" + keyword + "&page=" + p;
    var html = await fetchPage(url);
    return parseVideoCards(html);
  } catch (error) {
    console.error("[123AV.FUN searchByTag] 失败:", error.message || error);
    return [];
  }
}

// ============================================================
//  loadDetail — 视频详情
// ============================================================

async function loadDetail(link) {
  if (!link) throw new Error("无效的视频 ID");

  try {
    var id = String(link).trim();

    // 尝试获取详情页 HTML
    var detailUrl = BASE + "/detail/" + id;
    var html = "";
    try {
      html = await fetchPage(detailUrl);
    } catch (e) {
      // 详情页获取失败
      return null;
    }

    // 标题
    var title = getText(html, /<meta[^>]+property="og:title"[^>]+content="([^"]+)"/);
    if (!title) {
      title = getText(html, /<h1[^>]*>([\s\S]*?)<\/h1>/);
    }

    // 封面（og:image）
    var coverUrl = getText(html, /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/);
    if (coverUrl && !coverUrl.startsWith("http")) coverUrl = BASE + coverUrl;

    // 描述
    var description = getText(html, /<meta[^>]+name="description"[^>]+content="([^"]+)"/);

    // 标签（video:tag）
    var tagRegex = /<meta[^>]+property="video:tag"[^>]+content="([^"]+)"/g;
    var tagNames = [];
    var tm;
    while ((tm = tagRegex.exec(html)) !== null) {
      tagNames.push(tm[1]);
    }

    // 视频源 — 从页面中提取 data-src 或 source src
    var videoUrl = getText(html, /data-src="([^"]+)"/);
    if (!videoUrl) {
      videoUrl = getText(html, /<source[^>]+src="([^"]+)"/);
    }

    // 剧照（使用封面图）
    var backdropPaths = coverUrl ? [coverUrl] : [];

    // 播放统计
    var playcount = "";
    var playMatch = html.match(/([\d,]+)\s*<span[^>]*class="[^"]*text-white\/70[^"]*"[^>]*>/);
    if (!playMatch) {
      playMatch = html.match(/(\d+)\s*<span[^>]*>[^<]*播放/);
    }
    if (playMatch) playcount = playMatch[1];

    // 发布日期
    var releaseDate = getText(html, /发表于\s*(\d{4}-\d{2}-\d{2})/);
    if (!releaseDate) {
      releaseDate = getText(html, /(\d{4}-\d{2}-\d{2}\s*\d{2}:\d{2}:\d{2})/);
    }

    // 作者
    var author = "";
    var authorMatch = html.match(/href="\/author-info\/(\d+)"[^>]*>([^<]+)<\/a>/);
    if (authorMatch) author = authorMatch[2].trim();

    return {
      id: id,
      type: "url",
      mediaType: "movie",
      title: title || ("视频 " + id),
      link: id,
      coverUrl: coverUrl || "",
      posterPath: coverUrl || "",
      backdropPath: coverUrl || "",
      videoUrl: videoUrl || "",
      backdropPaths: backdropPaths.length > 0 ? backdropPaths : undefined,
      trailers: videoUrl ? [{ url: videoUrl, coverUrl: coverUrl || "" }] : undefined,
      genreTitle: tagNames.length > 0 ? tagNames.join(" / ") : undefined,
      description: description || undefined,
      releaseDate: releaseDate || undefined,
      remark: playcount ? playcount + " 播放" : undefined
    };
  } catch (error) {
    console.error("[123AV.FUN loadDetail] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  search — 搜索
// ============================================================

async function search(params) {
  try {
    var keyword = (params.keyword || "").trim();
    if (!keyword) throw new Error("请输入搜索关键词");

    var page = Math.max(1, Number(params.page) || 1);
    var url = BASE + "/?search=" + encodeURIComponent(keyword) + "&page=" + page;
    var html = await fetchPage(url);
    return parseVideoCards(html);
  } catch (error) {
    console.error("[123AV.FUN search] 失败:", error.message || error);
    throw error;
  }
}
