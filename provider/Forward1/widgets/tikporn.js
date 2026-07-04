// ============================================================
//  Tik.Porn — 视频列表、详情与搜索模块
//  源站: https://tik.porn
//  Next.js SSR，通过 __NEXT_DATA__ 内嵌 JSON 提取数据
// ============================================================

WidgetMetadata = {
  id: "forward.tikporn",
  title: "Tik.Porn",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "Tik.Porn — 短视频聚合",
  author: "EL",
  site: "https://tik.porn",
  detailCacheDuration: 60,
  modules: [
    // ========== 最新视频 ==========
    {
      id: "latestVideos",
      title: "随机推荐",
      functionName: "loadLatestVideos",
      cacheDuration: 60,       // 首页 feed 每批拉取不同内容，60s 后刷新获取新一批
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    // ========== 标签分类浏览 ==========
    {
      id: "browseTag",
      title: "标签",
      functionName: "loadTagVideos",
      cacheDuration: 300,
      params: [
        {
          name: "tag",
          title: "选择标签",
          type: "enumeration",
          value: "asian",
          enumOptions: [
            { title: "Asian", value: "asian" },
            { title: "Blonde", value: "blonde" },
            { title: "Brunette", value: "brunette" },
            { title: "Big Boobs", value: "big-boobs" },
            { title: "Big Ass", value: "big-ass" },
            { title: "Ebony", value: "ebony" },
            { title: "Latina", value: "latina" },
            { title: "MILF", value: "milf" },
            { title: "Teen", value: "teen" },
            { title: "Redhead", value: "redhead" },
            { title: "Hentai", value: "hentai" },
            { title: "Mature", value: "mature" },
            { title: "BBW", value: "bbw" },
            { title: "Amateur", value: "amateur" },
            { title: "Fetish", value: "fetish" },
            { title: "Domination", value: "domination" },
            { title: "POV", value: "pov" },
            { title: "Shaved Pussy", value: "shaved-pussy" },
            { title: "Big Dick", value: "big-dick" },
            { title: "Stockings", value: "stockings" },
            { title: "Tattoo", value: "tattoo" },
            { title: "Lesbian", value: "lesbian" },
            { title: "Threesome", value: "threesome" },
            { title: "Funny", value: "funny" },
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    // ========== 动作分类浏览 ==========
    {
      id: "browseAction",
      title: "动作",
      functionName: "loadActionVideos",
      cacheDuration: 300,
      params: [
        {
          name: "action",
          title: "选择动作",
          type: "enumeration",
          value: "teasing",
          enumOptions: [
            { title: "Teasing", value: "teasing" },
            { title: "Striptease", value: "striptease" },
            { title: "Blowjob", value: "blowjob" },
            { title: "Cowgirl", value: "cowgirl" },
            { title: "Doggystyle", value: "doggystyle" },
            { title: "Missionary", value: "missionary" },
            { title: "Anal", value: "anal" },
            { title: "69", value: "69" },
            { title: "Reverse Cowgirl", value: "reverse-cowgirl" },
            { title: "Deepthroat", value: "deepthroat" },
            { title: "Handjob", value: "handjob" },
            { title: "Fingering", value: "fingering" },
            { title: "Twerk", value: "twerk" },
            { title: "Pussy Fingering", value: "pussy-fingering" },
            { title: "Rimjob", value: "rimjob" },
            { title: "Facesitting", value: "facesitting" },
            { title: "Footjob", value: "footjob" },
            { title: "Pussy Licking", value: "pussy-licking" },
            { title: "Sex Toys", value: "sextoys" },
            { title: "Standing Fuck", value: "standing-fuck" },
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    // 搜索也注册为模块，让 App 能从详情页导航回搜索结果并传 peopleId/genreId
    {
      id: "searchGlobal",
      title: "搜索影片",
      functionName: "searchVideos",
      cacheDuration: 300,
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
const BASE_URL = "https://tik.porn";
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
 * 获取页面 HTML 并解析 __NEXT_DATA__ JSON
 */
async function fetchPageData(url) {
  const resp = await Widget.http.get(url, { headers: REQUEST_HEADERS });
  if (!resp || !resp.data) {
    throw new Error(`请求失败: ${url}`);
  }
  const html = resp.data;
  // 提取 __NEXT_DATA__ JSON
  const match = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
  if (!match) {
    throw new Error("未找到页面数据");
  }
  return JSON.parse(match[1]);
}

/**
 * 将 API 视频对象转为 VideoItem
 */
function parseVideoItem(video) {
  if (!video) return null;

  const id = video.id;
  const link = video.basePath || `/video/${id}`;
  const meta = video.metadata || {};

  // 标题
  const title = meta.title
    ? meta.title.replace(/\s*\|\s*Tik\.Porn\s*$/, "").trim()
    : (video.texts?.profile?.user?.default?.text || `Video ${id}`);

  // 缩略图
  const poster = video.poster || "";
  const thumbs = video.thumbnails || {};
  const coverUrl = thumbs.md || thumbs.sm || poster;

  // 播放地址
  const source = video.source || {};
  const videoUrl = source.src || "";

  // 时长
  const duration = video.duration || 0;

  // 统计
  const likes = video.likes || 0;
  const views = video.views || 0;

  // 评分 (0-10 scale, based on likes ratio)
  const rating = Math.min(10, Math.max(0, Math.round((likes / Math.max(views, 1)) * 500 * 10) / 10));

  // 分类标签
  const actionName = video.action?.name || "";
  const tags = video.tags || [];
  const genreItems = tags.map(t => ({
    id: t.slug || String(t.id),
    title: t.name || String(t.id)
  }));
  if (actionName && !genreItems.find(g => g.title === actionName)) {
    genreItems.unshift({ id: video.action?.slug || actionName, title: actionName });
  }

  // 作者/演员
  const user = video.user;
  const creators = video.creator || [];
  const peoples = [];
  if (user && user.name) {
    peoples.push({
      id: user.slug || String(user.id),
      title: user.name,
      avatar: user.image || ""
    });
  }
  if (creators.length > 0) {
    for (const c of creators) {
      if (!peoples.find(p => p.id === (c.slug || String(c.id)))) {
        peoples.push({
          id: c.slug || String(c.id),
          title: c.name,
          avatar: c.image || ""
        });
      }
    }
  }

  // 日期
  const uploadDate = meta.uploadDate || "";

  // 描述
  const description = meta.description || "";

  const item = {
    id: String(id),
    type: "url",
    mediaType: "movie",
    title: title,
    coverUrl: coverUrl || poster,
    posterPath: poster || coverUrl,
    backdropPath: poster || coverUrl,
    videoUrl: videoUrl,
    duration: duration,
    rating: rating,
    description: description,
    releaseDate: uploadDate,
    link: link,
    genreItems: genreItems.length > 0 ? genreItems : undefined,
    peoples: peoples.length > 0 ? peoples : undefined,
    headers: {
      "Referer": BASE_URL + "/",
      "User-Agent": REQUEST_HEADERS["User-Agent"]
    }
  };

  // 剧照：取 poster 和 tryptic 两种不同构图
  const videoThumbs = video.thumbs || [];
  if (videoThumbs.length > 0) {
    const jpegThumbs = videoThumbs.find(t => t.type === "image/jpeg");
    const bestThumbs = jpegThumbs || videoThumbs[0];
    if (bestThumbs?.src) {
      const paths = [];
      if (bestThumbs.src.poster) paths.push(bestThumbs.src.poster);
      if (bestThumbs.src.thumbnail && bestThumbs.src.thumbnail !== bestThumbs.src.poster) {
        paths.push(bestThumbs.src.thumbnail);
      }
      if (paths.length > 0) {
        item.backdropPaths = paths;
      }
    }
  }

  return item;
}

/**
 * 从分页 JSON 中提取视频列表
 */
function extractVideoList(pageProps) {
  // 尝试多种数据路径
  let videosData = null;
  let pagination = null;

  // 路径1: 首页/标签/动作页
  if (pageProps.videos && pageProps.videos.data) {
    videosData = pageProps.videos.data;
    pagination = pageProps.videos.pagination;
  }
  // 路径2: 搜索页
  else if (pageProps.initialVideoResults && pageProps.initialVideoResults.data) {
    videosData = pageProps.initialVideoResults.data;
    pagination = pageProps.initialVideoResults.pagination;
  }

  if (!videosData || !Array.isArray(videosData)) {
    return { items: [], hasMore: false };
  }

  const items = videosData
    .map(v => parseVideoItem(v))
    .filter(Boolean);

  const hasMore = pagination ? pagination.hasMore !== false : true;

  return { items, hasMore };
}

// ============================================================
//  loadLatestVideos — 最新视频列表（模拟源站无限滚动 feed）
//  源站首页是 TikTok 式竖滑视频流，每页 1 个视频，支持无限滚动。
//  本函数以 page 为偏移步进批量拉取，去重后返回。
//  每次调用拿到的都是不同的视频段，配合 ForwardWidget 分页实现"无限刷"。
// ============================================================
async function loadLatestVideos(params = {}) {
  try {
    if (params.genreId) return loadTagVideos({ ...params, tag: params.genreId });
    if (params.peopleId) return loadModelVideos(params);

    const page = Math.max(1, Number(params.page) || 1);

    // Feed 批大小：每次拉取 20 页首页 feed
    // page=1 → 拉首页 feed 第 1～20 页 → ~16 个不重复视频
    // page=2 → 拉第 31～50 页（跳过 10 页减少重复）→ 下一批 ~16 个
    // page=3 → 拉第 61～80 页 → 再下一批
    // 配合 page 参数实现无限滚动
    const BATCH_SIZE = 20;
    const PAGE_GAP = 20; // 批次间跳 20 页减少重复
    const baseOffset = (page - 1) * (BATCH_SIZE + PAGE_GAP) + 1;

    const fetchPromises = [];
    for (let i = 0; i < BATCH_SIZE; i++) {
      const p = baseOffset + i;
      let url = `${BASE_URL}/`;
      if (p > 1) url += `?page=${p}`;
      fetchPromises.push(
        fetchPageData(url).then(json => {
          const pp = json.props?.pageProps || {};
          return extractVideoList(pp).items;
        }).catch(() => [])
      );
    }

    const results = await Promise.all(fetchPromises);
    const items = results.flat().filter(Boolean);

    // 去重（按 id）
    const seen = new Set();
    const unique = [];
    for (const item of items) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        unique.push(item);
      }
    }

    return unique;
  } catch (error) {
    console.error("[TikPorn loadLatestVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadTagVideos — 按标签浏览
//  注意: 标签页仅首页可 SSR 加载约11个视频，不支持服务端分页（客户端无限滚动）。
//  当 page > 1 时回退到搜索接口获取更多结果。
// ============================================================
async function loadTagVideos(params = {}) {
  try {
    if (params.genreId) params.tag = params.genreId;
    if (params.peopleId) return loadModelVideos(params);

    const tag = (params.tag || "asian").trim();
    const page = Math.max(1, Number(params.page) || 1);

    // 标签页仅支持首页 SSR，分页需走搜索
    if (page > 1) {
      return searchVideos({ keyword: tag, page: page });
    }

    let url = `${BASE_URL}/tag/${encodeURIComponent(tag)}`;
    const json = await fetchPageData(url);
    const pageProps = json.props?.pageProps || {};
    const { items } = extractVideoList(pageProps);

    return items;
  } catch (error) {
    console.error("[TikPorn loadTagVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadActionVideos — 按动作浏览
//  注意: 动作页仅首页可 SSR 加载约11个视频，不支持服务端分页（客户端无限滚动）。
//  当 page > 1 时回退到搜索接口获取更多结果。
// ============================================================
async function loadActionVideos(params = {}) {
  try {
    if (params.genreId) return loadTagVideos({ ...params, tag: params.genreId });
    if (params.peopleId) return loadModelVideos(params);

    const action = (params.action || "teasing").trim();
    const page = Math.max(1, Number(params.page) || 1);

    // 动作页仅支持首页 SSR，分页需走搜索
    if (page > 1) {
      return searchVideos({ keyword: action, page: page });
    }

    let url = `${BASE_URL}/action/${encodeURIComponent(action)}`;
    const json = await fetchPageData(url);
    const pageProps = json.props?.pageProps || {};
    const { items } = extractVideoList(pageProps);

    return items;
  } catch (error) {
    console.error("[TikPorn loadActionVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  searchVideos — 搜索
// ============================================================
async function searchVideos(params = {}) {
  try {
    if (params.genreId) return loadTagVideos({ ...params, tag: params.genreId });
    if (params.peopleId) return loadModelVideos(params);

    const keyword = (params.keyword || params.search_query || "").trim();
    if (!keyword) throw new Error("请输入搜索关键词");

    const page = Math.max(1, Number(params.page) || 1);

    const url = `${BASE_URL}/?s=${encodeURIComponent(keyword)}&page=${page}`;

    const json = await fetchPageData(url);
    const pageProps = json.props?.pageProps || {};
    const { items } = extractVideoList(pageProps);

    return items;
  } catch (error) {
    console.error("[TikPorn searchVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadModelVideos — 创作者/模特视频列表（peopleId 点击后调用）
//  注意: 模特页仅首页可 SSR 加载约11个视频，不支持服务端分页。
//  当 page > 1 时回退到搜索接口获取更多结果。
// ============================================================
async function loadModelVideos(params = {}) {
  try {
    const peopleId = (params.peopleId || "").trim();
    if (!peopleId) throw new Error("缺少人物 ID");

    const page = Math.max(1, Number(params.page) || 1);

    // 模特页仅支持首页 SSR，分页需走搜索
    if (page > 1) {
      return searchVideos({ keyword: peopleId, page: page });
    }

    let url = `${BASE_URL}/${encodeURIComponent(peopleId)}`;
    const json = await fetchPageData(url);
    const pageProps = json.props?.pageProps || {};
    const { items } = extractVideoList(pageProps);

    return items;
  } catch (error) {
    console.error("[TikPorn loadModelVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadDetail — 视频详情 & 播放地址
//  Forward 约定：列表项 type="url" 时自动调用 loadDetail(link)
// ============================================================
async function loadDetail(link) {
  if (!link) throw new Error("无效的视频链接");

  // 从 basePath 提取视频 ID
  const idMatch = String(link).match(/\/video\/(\d+)/);
  const videoId = idMatch ? idMatch[1] : link;

  // 请求详情页
  const url = `${BASE_URL}/video/${videoId}`;
  const json = await fetchPageData(url);
  const pageProps = json.props?.pageProps || {};

  // 视频主数据
  const video = pageProps.firstVideo;
  if (!video) {
    throw new Error(`无法获取视频数据: ${videoId}`);
  }

  const item = parseVideoItem(video);
  if (!item) {
    throw new Error(`解析视频数据失败: ${videoId}`);
  }

  // 提取相关视频
  try {
    const relatedData = pageProps.initialRelatedVideos;
    if (relatedData && relatedData.data && Array.isArray(relatedData.data)) {
      const relatedItems = relatedData.data
        .map(v => {
          const parsed = parseVideoItem(v);
          if (parsed) {
            // 相关视频不带 videoUrl 以节省带宽
            delete parsed.videoUrl;
          }
          return parsed;
        })
        .filter(Boolean);
      if (relatedItems.length > 0) {
        item.relatedItems = relatedItems;
      }
    }
  } catch (e) {
    // 相关视频提取失败不影响主视频
  }

  // 确保 videoUrl 存在
  if (!item.videoUrl) {
    // 尝试从 sources 中取 mp4
    const sources = video.sources || [];
    const mp4Source = sources.find(s => s.type === "video/mp4");
    if (mp4Source && mp4Source.src) {
      item.videoUrl = mp4Source.src;
    }
  }

  // 预告片：用超清 MP4（downloadLink）作为第二画质备选
  if (video.downloadLink) {
    item.trailers = [{ url: video.downloadLink, coverUrl: item.coverUrl || item.posterPath || "" }];
  }

  return item;
}
