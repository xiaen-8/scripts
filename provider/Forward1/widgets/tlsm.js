// ============================================================
//  TaoluSM — 视频列表、详情与搜索模块
//  源站: https://taolusm.com
//  HTML 解析 + /download/{id} 获取视频直链
// ============================================================

WidgetMetadata = {
  id: "forward.taolusm",
  title: "套路SM",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "套路SM 视频模块 — 最新、直播回放、剧情调教、日韩、欧美、免费试看",
  author: "EL",
  site: "https://taolusm.com",
  detailCacheDuration: 60,
  modules: [
    {
      id: "latest",
      title: "最新视频",
      functionName: "loadLatest",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "zhibo",
      title: "直播回放",
      functionName: "loadZhibo",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "juqing",
      title: "剧情调教",
      functionName: "loadJuqing",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "japaneseKorean",
      title: "日韩视频",
      functionName: "loadJapaneseKorean",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "western",
      title: "欧美视频",
      functionName: "loadWestern",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "free",
      title: "免费试看",
      functionName: "loadFree",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    }
  ],
  search: {
    title: "搜索视频",
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
const BASE = "https://taolusm.com";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15";

// ============================================================
//  工具函数
// ============================================================

async function fetchPage(url) {
  const resp = await Widget.http.get(url, {
    headers: {
      "User-Agent": UA,
      "Referer": BASE + "/"
    }
  });
  if (!resp || !resp.data) throw new Error("请求失败: " + url);
  return resp.data;
}

function getText(html, pattern) {
  const m = pattern.exec(html);
  return m ? m[1].trim() : "";
}

// ============================================================
//  列表解析
// ============================================================

function parseListHtml(html) {
  const items = [];
  // 每个视频卡片是 <a href="https://taolusm.com/v/{vid}" title="..." ...>...</a>
  const cardRegex = /<a\s+href="https:\/\/taolusm\.com\/v\/(\d+)"[^>]*title="([^"]*)"[^>]*>.*?<\/a>/gs;
  let match;
  while ((match = cardRegex.exec(html)) !== null) {
    const block = match[0];
    const vid = match[1];
    const title = match[2].trim();

    // 缩略图
    const thumbRegex = new RegExp('data-src="([^"]+covers/' + vid + '\\.webp)"');
    const thumbRaw = getText(block, thumbRegex);
    const thumb = thumbRaw || "";

    // 时长 (mm:ss 或 hh:mm:ss)
    let duration = "";
    const durMatch = block.match(/right-1[^>]*>\s*(\d+:\d+(?::\d+)?)\s*</);
    if (durMatch) duration = durMatch[1];

    // 观看数
    let views = "";
    const viewsMatch = block.match(/left-1[^>]*>.*?<\/svg>\s*<span>\s*([\d.]+[KMk]?)\s*<\/span>/s);
    if (viewsMatch) views = viewsMatch[1];

    // 描述 = 观看数
    const description = views ? "👁 " + views : "";

    items.push({
      id: vid,
      type: "url",
      mediaType: "movie",
      title: title,
      link: vid,
      coverUrl: thumb,
      posterPath: thumb,
      backdropPath: thumb,
      durationText: duration,
      description: description || undefined
    });
  }
  return items;
}

// ============================================================
//  通用列表加载
// ============================================================

async function loadList(path, params = {}) {
  try {
    // 处理从详情页点分类/演员跳转
    if (params.genreId) return loadCategoryPage(params.genreId, params.page);
    if (params.peopleId) return searchVideos({ keyword: params.peopleId, page: params.page });

    const page = Math.max(1, Number(params.page) || 1);
    const url = BASE + path + (page > 1 ? "?page=" + page : "");
    const html = await fetchPage(url);
    return parseListHtml(html);
  } catch (error) {
    console.error("[TaoluSM loadList] 失败:", error.message || error);
    throw error;
  }
}

function loadCategoryPage(category, page) {
  const catMap = {
    "zhibo": "/zhibo",
    "juqing": "/juqing",
    "japanese-korean": "/japanese-korean",
    "western": "/western",
    "free": "/free"
  };
  const path = catMap[category] || "/zhibo";
  return loadList(path, { page: page || 1 });
}

// ============================================================
//  模块入口
// ============================================================

async function loadLatest(params) { return loadList("/", params); }
async function loadZhibo(params)  { return loadList("/zhibo", params); }
async function loadJuqing(params) { return loadList("/juqing", params); }
async function loadJapaneseKorean(params) { return loadList("/japanese-korean", params); }
async function loadWestern(params) { return loadList("/western", params); }
async function loadFree(params)   { return loadList("/free", params); }

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
    const url = BASE + "/search/" + encodeURIComponent(keyword) + (page > 1 ? "?page=" + page : "");
    const html = await fetchPage(url);
    return parseListHtml(html);
  } catch (error) {
    console.error("[TaoluSM searchVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadDetail — 视频详情
// ============================================================
async function loadDetail(link) {
  if (!link) throw new Error("无效的视频链接");

  try {
    // 同时获取视频详情页和下载地址
    const [detailHtml, videoUrl] = await Promise.all([
      fetchPage(BASE + "/v/" + link),
      resolveVideoUrl(link)
    ]);

    // 标题
    const title = getText(detailHtml, /<meta[^>]+property="og:title"[^>]+content="([^"]+)"/)
      || getText(detailHtml, /<title>([^<]+)<\/title>/)
      || link;

    // 缩略图
    let thumb = getText(detailHtml, /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/);
    if (!thumb) {
      thumb = getText(detailHtml, /<meta[^>]+name="twitter:image"[^>]+content="([^"]+)"/);
    }

    // 描述
    let description = "";
    const descMatch = detailHtml.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/);
    if (descMatch) description = descMatch[1];

    // 相关推荐（从详情页解析同类的视频卡片）
    const relatedItems = [];
    const relCards = detailHtml.match(/<a\s+href="https:\/\/taolusm\.com\/v\/(\d+)"[^>]*title="([^"]*)"[^>]*>.*?<\/a>/gs);
    if (relCards) {
      const seen = new Set();
      for (const card of relCards) {
        const idMatch = card.match(/v\/(\d+)/);
        const titleMatch = card.match(/title="([^"]*)"/);
        const thumbMatch = card.match(/data-src="([^"]+covers\/\d+\.webp)"/);
        if (idMatch && titleMatch && !seen.has(idMatch[1])) {
          seen.add(idMatch[1]);
          const rThumb = thumbMatch ? thumbMatch[1] : "";
          // 过滤掉当前视频自身
          if (idMatch[1] !== link) {
            relatedItems.push({
              id: idMatch[1],
              type: "url",
              mediaType: "movie",
              title: titleMatch[1].trim(),
              link: idMatch[1],
              coverUrl: rThumb,
              posterPath: rThumb,
              backdropPath: rThumb
            });
          }
        }
      }
    }

    return {
      id: link,
      type: "url",
      mediaType: "movie",
      title: title.replace(/ - .*$/, "").trim(),
      link: link,
      coverUrl: thumb || "",
      posterPath: thumb || "",
      backdropPath: thumb || "",
      videoUrl: videoUrl || "",
      headers: {
        "Referer": BASE + "/",
        "User-Agent": UA
      },
      description: description || undefined,
      genreItems: undefined,
      backdropPaths: thumb ? [thumb] : [],
      trailers: videoUrl ? [{ url: videoUrl, coverUrl: thumb }] : [],
      relatedItems: relatedItems.length > 0 ? relatedItems : undefined
    };
  } catch (error) {
    console.error("[TaoluSM loadDetail] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  解析视频下载地址
//  /download/{vid} 返回 302 → 真实 MP4 地址
//  直接返回下载 URL，播放器会跟随 302 重定向到 MP4
// ============================================================
async function resolveVideoUrl(vid) {
  // 直接返回下载地址，播放器会自己跟随 302 重定向到真实 MP4
  // 这是最可靠的方式：不依赖 Widget.http 的重定向行为
  return BASE + "/download/" + vid;
}
