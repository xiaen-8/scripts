// ============================================================
//  KBJFan — 视频列表、详情与搜索模块
//  源站: https://www.kbjfan.com
//  WordPress HTML 解析
// ============================================================

WidgetMetadata = {
  id: "forward.kbjfan",
  title: "KBJFan",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "KBJFan 视频模块 — Korean BJ Dance / Korean BJ Nude",
  author: "EL",
  site: "https://www.kbjfan.com",
  detailCacheDuration: 60,
  modules: [
    {
      id: "dance",
      title: "Korean BJ Dance",
      functionName: "loadDance",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "nude",
      title: "Korean BJ Nude",
      functionName: "loadNude",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "searchKbjfan",
      title: "搜索 KBJFan",
      functionName: "searchVideos",
      cacheDuration: 3600,
      params: [
        { name: "keyword", title: "关键词", type: "input", value: "" },
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
const BASE = "https://www.kbjfan.com";
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1";

// ============================================================
//  工具函数
// ============================================================

async function fetchPage(url) {
  const resp = await Widget.http.get(url, {
    headers: { "User-Agent": UA }
  });
  if (!resp || !resp.data) throw new Error("请求失败: " + url);
  return resp.data;
}

function getText(html, pattern) {
  const m = pattern.exec(html);
  return m ? m[1].trim() : "";
}

function parseListHtml(html) {
  const items = [];
  const blocks = html.split('<posts class="posts-item card ajax-item style3"');
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];

    const link = getText(block, /<a[^>]*href="([^"]+)"[^>]*>/);
    if (!link) continue;

    const title = getText(block, /<h2 class="item-heading">\s*<a[^>]*>([^<]+)<\/a>/);
    const cover = getText(block, /<img[^>]*data-src="([^"]+)"/);
    const pubdate = getText(block, /<span[^>]*>(\d{4}-\d{2}-\d{2})<\/span>/);
    const views = getText(block, /meta-view[^>]*>([0-9.]+K?)/);

    items.push({
      id: link,
      type: "url",
      mediaType: "movie",
      title: title || "Untitled",
      link: link,
      coverUrl: cover || "",
      posterPath: cover || "",
      backdropPath: cover || "",
      releaseDate: pubdate || "",
      remark: views ? views + " 次观看" : ""
    });
  }
  return items;
}

// ============================================================
//  loadDance — Korean BJ Dance
// ============================================================
async function loadDance(params) {
  return loadList("koreanbjdance", params);
}

// ============================================================
//  loadNude — Korean BJ Nude
// ============================================================
async function loadNude(params) {
  return loadList("koreanbjnude", params);
}

// ============================================================
//  列表页加载
// ============================================================
async function loadList(cat, params = {}) {
  try {
    if (params.genreId) return loadList(params.genreId, params);
    if (params.peopleId) return searchVideos({ keyword: params.peopleId });

    const page = Math.max(1, Number(params.page) || 1);
    const url = BASE + "/" + cat + (page > 1 ? "/page/" + page + "/" : "");
    const html = await fetchPage(url);
    return parseListHtml(html);
  } catch (error) {
    console.error("[KBJFan loadList] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  searchVideos — 搜索
// ============================================================
async function searchVideos(params) {
  try {
    if (params.peopleId) {
      return searchVideos({ keyword: params.peopleId, page: params.page || 1 });
    }

    const keyword = (params.keyword || "").trim();
    if (!keyword) throw new Error("请输入搜索关键词");

    const page = Math.max(1, Number(params.page) || 1);
    const url = BASE + "/?s=" + encodeURIComponent(keyword) + (page > 1 ? "&paged=" + page : "");
    const html = await fetchPage(url);
    return parseListHtml(html);
  } catch (error) {
    console.error("[KBJFan searchVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadDetail — 视频详情
// ============================================================
async function loadDetail(link) {
  if (!link) throw new Error("无效的视频链接");

  try {
    const html = await fetchPage(link);

    // 标题（title 标签，去掉站点后缀）
    const title = getText(html, /<title>([^<]+)<\/title>/)
      .replace(/ - KBJFan$/, "").trim();

    // 封面（video-pic 属性，Dplayer 的海报图）
    let thumb = getText(html, /video-pic="([^"]+)"/);
    if (!thumb) {
      thumb = getText(html, /dplayer-initial-img[^>]*data-src="([^"]+)"/);
    }
    if (thumb && !thumb.startsWith("http")) thumb = "https:" + thumb;

    // 视频地址（Dplayer video-url 属性）
    const videoUrl = getText(html, /video-url="([^"]+)"/);

    // 剧照
    const backdropPaths = thumb ? [thumb] : [];

    // 预告片
    const trailers = [];
    if (videoUrl) {
      trailers.push({ url: videoUrl, coverUrl: thumb });
    }

    return {
      id: link,
      type: "url",
      mediaType: "movie",
      title: title || "Untitled",
      link: link,
      coverUrl: thumb || "",
      posterPath: thumb || "",
      backdropPath: thumb || "",
      videoUrl: videoUrl || "",
      backdropPaths: backdropPaths,
      trailers: trailers
    };
  } catch (error) {
    console.error("[KBJFan loadDetail] 失败:", error.message || error);
    throw error;
  }
}
