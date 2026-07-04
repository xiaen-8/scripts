// ============================================================
//  FYPTT — 短视频列表、详情与搜索模块
//  源站: https://fyptt.to
//  WordPress 站点，解析 HTML 提取数据
// ============================================================

WidgetMetadata = {
  id: "forward.fyptt",
  title: "FYPTT",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "FYPTT — 竖屏短视频聚合",
  author: "EL",
  site: "https://fyptt.to",
  detailCacheDuration: 60,
  modules: [
    // ========== 最新视频 ==========
    {
      id: "latestVideos",
      title: "最新",
      functionName: "loadLatestVideos",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    // ========== 分类浏览 ==========
    {
      id: "browseCategory",
      title: "分类",
      functionName: "loadCategoryVideos",
      cacheDuration: 300,
      params: [
        {
          name: "category",
          title: "选择分类",
          type: "enumeration",
          value: "nsfw-tiktok",
          enumOptions: [
            { title: "裸体", value: "tiktok-nudes" },
            { title: "TikTok", value: "tiktok-porn" },
            { title: "巨乳", value: "tiktok-boobs" },
            { title: "Instagram", value: "instagram-porn" },
            { title: "性爱", value: "tiktok-sex" },
            { title: "限制级", value: "nsfw-tiktok" },
            { title: "三级", value: "tiktok-xxx" },
            { title: "美臀", value: "tiktok-ass" },
            { title: "小穴", value: "tiktok-pussy" },
            { title: "直播", value: "tiktok-live" },
            { title: "性感", value: "sexy-tiktok" },
            { title: "骚货", value: "tiktok-thots" },
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    }
  ],
  search: {
    title: "搜索",
    functionName: "searchVideos",
    params: [
      { name: "keyword", title: "关键词", type: "input", value: "" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

// ============================================================
//  常量
// ============================================================
const BASE_URL = "https://fyptt.to";
const REQUEST_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
  "Referer": BASE_URL + "/"
};

// ============================================================
//  工具函数
// ============================================================

/**
 * 获取页面 HTML
 */
async function fetchPage(url) {
  const resp = await Widget.http.get(url, { headers: REQUEST_HEADERS });
  if (!resp || !resp.data) {
    throw new Error(`请求失败: ${url}`);
  }
  return resp.data;
}

/**
 * 从列表页 HTML 中提取视频项
 */
function parseListHtml(html) {
  if (!html) return [];
  const $ = Widget.html.load(html);
  const items = [];

  // 每个视频卡片在 .fl-post-column 中
  $(".fl-post-column").each(function() {
    const col = $(this);

    // 取文章链接
    const linkEl = col.find("a[rel='bookmark']").first();
    const link = linkEl.attr("href") || "";
    if (!link) return;

    // 取标题
    const titleEl = col.find(".fl-post-grid-title a").first();
    let title = titleEl.text().trim();
    if (!title) {
      title = linkEl.attr("title") || "";
    }
    if (title.length > 120) title = title.substring(0, 120) + "…";

    // 取缩略图
    const imgEl = col.find("img").first();
    const thumb = imgEl.attr("src") || imgEl.attr("data-src") || "";

    // 取日期
    const dateEl = col.find(".fl-post-grid-date").first();
    const date = dateEl.text().trim();

    // 从 link 中提取 post ID
    const parts = link.replace(/\/+$/, "").split("/");
    const id = parts.length >= 2 ? parts[parts.length - 2] : String(Math.random()).slice(2);

    if (title) {
      const item = {
        id: id,
        type: "url",
        mediaType: "movie",
        title: title,
        coverUrl: thumb,
        posterPath: thumb,
        backdropPath: thumb,
        link: link,
        releaseDate: date,
        headers: { "Referer": BASE_URL + "/" }
      };

      // 从父级容器 class 中提取分类
      const containerClass = col.parent().attr("class") || "";
      const postClass = col.find("> div").attr("class") || "";
      const allClasses = containerClass + " " + postClass;
      const catMatch = allClasses.match(/category-([a-zA-Z0-9_-]+)/g);
      if (catMatch) {
        item.genreItems = catMatch.map(c => ({ id: c.replace("category-", ""), title: c.replace("category-", "").replace(/-/g, " ") }));
      }

      items.push(item);
    }
  });

  return items;
}

/**
 * 从视频详情页提取 fileid（iframe 中的参数）
 */
function extractFileId(html) {
  if (!html) return null;
  const match = html.match(/fileid=([A-Za-z0-9]+)/);
  return match ? match[1] : null;
}

/**
 * 从 embed 页提取 MP4 播放地址
 */
function extractVideoUrl(html) {
  if (!html) return null;
  const match = html.match(/src="([^"]+\.mp4[^"]*)"/);
  return match ? match[1] : null;
}

// ============================================================
//  loadLatestVideos — 最新视频列表
// ============================================================
async function loadLatestVideos(params = {}) {
  try {
    if (params.genreId) return loadCategoryVideos({ ...params, category: params.genreId });
    if (params.peopleId) return searchVideos({ keyword: params.peopleId.replace(/-/g, " ") });

    const page = Math.max(1, Number(params.page) || 1);
    let url = BASE_URL;
    if (page > 1) url += `/page/${page}/`;

    const html = await fetchPage(url);
    return parseListHtml(html);
  } catch (error) {
    console.error("[FYPTT loadLatestVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadCategoryVideos — 按分类浏览
// ============================================================
async function loadCategoryVideos(params = {}) {
  try {
    if (params.genreId) params.category = params.genreId;
    if (params.peopleId) return searchVideos({ keyword: params.peopleId.replace(/-/g, " ") });

    const category = (params.category || "nsfw-tiktok").trim();
    const page = Math.max(1, Number(params.page) || 1);

    let url = `${BASE_URL}/${encodeURIComponent(category)}/`;
    if (page > 1) url += `page/${page}/`;

    const html = await fetchPage(url);
    return parseListHtml(html);
  } catch (error) {
    console.error("[FYPTT loadCategoryVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  searchVideos — 搜索
// ============================================================
async function searchVideos(params = {}) {
  try {
    if (params.peopleId) return searchVideos({ keyword: params.peopleId.replace(/-/g, " ") });

    const keyword = (params.keyword || params.search_query || "").trim();
    if (!keyword) throw new Error("请输入搜索关键词");

    const page = Math.max(1, Number(params.page) || 1);
    let url = `${BASE_URL}/?s=${encodeURIComponent(keyword)}`;
    if (page > 1) url += `&page=${page}`;

    const html = await fetchPage(url);
    return parseListHtml(html);
  } catch (error) {
    console.error("[FYPTT searchVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadDetail — 视频详情 & 播放地址
//  Forward 约定：列表项 type="url" 时自动调用 loadDetail(link)
// ============================================================
async function loadDetail(link) {
  if (!link) throw new Error("无效的视频链接");

  // 1. 请求详情页，提取 fileid
  const html = await fetchPage(link);
  const fileId = extractFileId(html);
  if (!fileId) {
    throw new Error("未找到视频 ID");
  }

  // 2. 请求 embed 页，提取 MP4 地址
  const embedUrl = `${BASE_URL}/fypttstr.php?fileid=${fileId}`;
  const embedHtml = await fetchPage(embedUrl);
  const videoUrl = extractVideoUrl(embedHtml);
  if (!videoUrl) {
    throw new Error("未找到视频播放地址");
  }

  // 3. 从详情页提取标题
  const $ = Widget.html.load(html);
  const title = $("h1").first().text().trim() || `Video ${fileId}`;

  // 4. 提取缩略图（从 og:image 取，与列表图来源一致）
  const ogMatch = html.match(/property="og:image"\s+content="([^"]+)"/);
  const thumb = ogMatch ? ogMatch[1] : "";

  // 5. 提取分类
  const genreItems = [];
  const allCats = html.match(/hentry[^"]*category-([a-zA-Z0-9_-]+)([^"]*category-([a-zA-Z0-9_-]+))*/g);
  const catSet = new Set();
  const catMatches = html.matchAll(/category-([a-zA-Z0-9_-]+)/g);
  for (const m of catMatches) {
    if (!catSet.has(m[1])) {
      catSet.add(m[1]);
      genreItems.push({ id: m[1], title: m[1].replace(/-/g, " ") });
    }
  }

  // 6. 剧照：用原帖缩略图
  const backdropPaths = thumb ? [thumb] : [];

  // 7. 预告片：与主视频一致（作为备选播放入口）
  const trailers = videoUrl ? [{ url: videoUrl, coverUrl: thumb || "" }] : [];

  // 8. 相关推荐（评论区前的推荐帖子列表）
  const relatedItems = [];
  try {
    const relatedHtml = html.substring(0, html.indexOf('id="respond"'));
    const $r = Widget.html.load(relatedHtml);
    $r(".fl-post-column").each(function() {
      const el = $(this);
      const linkEl = el.find("a[rel='bookmark']").first();
      const rLink = linkEl.attr("href") || "";
      if (!rLink || rLink === link) return;

      const rTitle = el.find(".fl-post-grid-title a").first().text().trim() || linkEl.attr("title") || "";
      if (!rTitle) return;

      const rImg = el.find("img").first().attr("src") || "";
      const parts = rLink.replace(/\/+$/, "").split("/");
      const rId = parts.length >= 2 ? parts[parts.length - 2] : String(Math.random()).slice(2);

      relatedItems.push({
        id: rId,
        type: "url",
        mediaType: "movie",
        title: rTitle.length > 80 ? rTitle.substring(0, 80) + "…" : rTitle,
        coverUrl: rImg,
        posterPath: rImg,
        link: rLink,
        headers: { "Referer": BASE_URL + "/" }
      });
    });
  } catch (e) {
    // 相关推荐提取失败不影响主视频
  }

  return {
    id: link.match(/\/(\d+)\//)?.[1] || fileId,
    type: "url",
    mediaType: "movie",
    title: title,
    videoUrl: videoUrl,
    coverUrl: thumb,
    posterPath: thumb,
    backdropPath: thumb,
    backdropPaths: backdropPaths,
    trailers: trailers,
    link: link,
    genreItems: genreItems.length > 0 ? genreItems : undefined,
    relatedItems: relatedItems.length > 0 ? relatedItems : undefined,
    headers: {
      "Referer": BASE_URL + "/",
      "User-Agent": REQUEST_HEADERS["User-Agent"]
    }
  };
}
