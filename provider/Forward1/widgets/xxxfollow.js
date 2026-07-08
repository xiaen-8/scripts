// ============================================================
//  XXXFollow — 短视频列表、详情与搜索模块
//  源站: https://www.xxxfollow.com
//  React SPA，通过 __PRELOAD_STATE__ 内嵌 JSON 提取数据
// ============================================================

WidgetMetadata = {
  id: "forward.xxxfollow",
  title: "XXXFollow",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "XXXFollow — 短视频聚合",
  author: "EL",
  site: "https://www.xxxfollow.com",
  detailCacheDuration: 60,
  modules: [
    {
      id: "forYou",
      title: "推荐",
      functionName: "loadForYou",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
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
            { title: "亚洲", value: "asian" },
            { title: "大屁股", value: "bigass" },
            { title: "巨乳", value: "bigtits" },
            { title: "口交", value: "blowjob" },
            { title: "棕发", value: "brunette" },
            { title: "贫乳", value: "smalltits" },
            { title: "内射", value: "creampie" },
            { title: "黑人", value: "ebony" },
            { title: "拉丁", value: "latina" },
            { title: "人妻", value: "milf" },
            { title: "18岁", value: "teen-18" },
            { title: "肛交", value: "anal" },
            { title: "3P", value: "threesome" },
            { title: "潮吹", value: "squirt" },
            { title: "第一人称", value: "pov" },
            { title: "女同", value: "lesbian" },
            { title: "素人", value: "amateur" },
            { title: "角色扮演", value: "cosplay" },
            { title: "纹身", value: "tattoo" },
            { title: "红发", value: "redhead" },
            { title: "后入", value: "doggystyle" },
            { title: "颜射", value: "cumshot" },
            { title: "自拍", value: "homemade" },
            { title: "黑人性爱", value: "black" },
            { title: "变性", value: "trans" },
            { title: "捆绑", value: "bondage" },
            { title: "指令自慰", value: "joi" },
            { title: "传教士", value: "missionary" },
            { title: "户外", value: "outdoors" },
            { title: "直播", value: "stripchat" },
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
const BASE_URL = "https://www.xxxfollow.com";
const REQUEST_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Referer": BASE_URL + "/"
};

// ============================================================
//  工具函数
// ============================================================

async function fetchPage(url) {
  const resp = await Widget.http.get(url, { headers: REQUEST_HEADERS });
  if (!resp || !resp.data) throw new Error(`请求失败: ${url}`);
  return resp.data;
}

/**
 * 从 HTML 中提取 __PRELOAD_STATE__ JSON
 */
function extractPreloadState(html) {
  const idx = html.indexOf("__PRELOAD_STATE__");
  if (idx < 0) return null;

  const braceStart = html.indexOf("{", idx);
  if (braceStart < 0) return null;

  let depth = 0, inStr = false, escape = false;
  let pos = braceStart;
  while (pos < html.length) {
    const ch = html[pos];
    if (escape) { escape = false; }
    else if (ch === "\\" && inStr) { escape = true; }
    else if (ch === '"' && !escape) { inStr = !inStr; }
    else if (!inStr) {
      if (ch === "{") depth++;
      else if (ch === "}") { depth--; if (depth === 0) break; }
    }
    pos++;
  }

  try {
    return JSON.parse(html.substring(braceStart, pos + 1));
  } catch (e) {
    return null;
  }
}

/**
 * 从预加载数据中提取视频列表
 */
function extractVideoList(preloadData) {
  if (!preloadData) return [];

  // 查找包含 list 数组的键
  for (const key of Object.keys(preloadData)) {
    const val = preloadData[key];
    if (val && typeof val === "object" && Array.isArray(val.list) && val.list.length > 0) {
      return val.list.map(item => parseVideoItem(item));
    }
  }
  return [];
}

/**
 * 将 API 视频项转为 VideoItem
 */
function parseVideoItem(item) {
  if (!item || !item.post) return null;

  const post = item.post;
  const media = post.media || [];
  const firstMedia = media[0] || {};

  const id = String(post.id);
  const slug = post.slug || id;
  const title = (post.text || `Video ${id}`).substring(0, 120);
  const videoUrl = firstMedia.fhd_url || firstMedia.uhd_url || firstMedia.url || firstMedia.sd_url || "";
  const thumb = firstMedia.thumb_url || firstMedia.start_url || "";
  const duration = firstMedia.duration_in_second || 0;

  // 剧照：取不同用途的图片作为多张剧照
  const backdropPaths = [];
  if (firstMedia.start_url) backdropPaths.push(firstMedia.start_url);
  if (firstMedia.thumb_url && firstMedia.thumb_url !== firstMedia.start_url) backdropPaths.push(firstMedia.thumb_url);

  // 预告片：与主视频相同的高清源（备选播放入口）
  const trailers = videoUrl ? [{ url: videoUrl, coverUrl: thumb }] : [];

  // 创作者：从 link_url（OnlyFans 链接）中提取用户名
  const linkUrl = item.link_url || "";
  const peoples = [];
  if (linkUrl) {
    const ofMatch = linkUrl.match(/onlyfans\.com\/([^/]+)/);
    if (ofMatch) {
      peoples.push({ id: ofMatch[1], title: ofMatch[1] });
    }
  }

  // 标签（在 post.tags 中）
  const tags = post.tags || [];
  const genreItems = tags
    .filter(t => t && t.tag)
    .map(t => ({ id: t.tag.toLowerCase().replace(/[^a-z0-9]+/g, "-"), title: t.display || t.tag }));

  return {
    id: id,
    type: "url",
    mediaType: "movie",
    title: title,
    coverUrl: thumb,
    posterPath: thumb,
    backdropPath: thumb,
    backdropPaths: backdropPaths.length > 0 ? backdropPaths : undefined,
    videoUrl: videoUrl,
    duration: duration,
    // 评分：基于点赞数换算（view_count 恒为 0，无法使用比例）
    rating: Math.min(10, Math.round((item.like_count || 0) / 2000)),
    link: slug,
    genreItems: genreItems.length > 0 ? genreItems : undefined,
    peoples: peoples.length > 0 ? peoples : undefined,
    headers: { "Referer": BASE_URL + "/" }
  };
}

// ============================================================
//  loadForYou — 推荐视频列表
// ============================================================
async function loadForYou(params = {}) {
  try {
    if (params.genreId) return loadTagVideos({ ...params, tag: params.genreId });
    if (params.peopleId) return loadForYou({ page: params.page || 1 });

    const page = Math.max(1, Number(params.page) || 1);
    let url = BASE_URL;
    if (page > 1) url += `/?page=${page}`;

    const html = await fetchPage(url);
    const data = extractPreloadState(html);
    return extractVideoList(data);
  } catch (error) {
    console.error("[XXXFollow loadForYou] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadTagVideos — 按标签浏览
// ============================================================
async function loadTagVideos(params = {}) {
  try {
    if (params.genreId) params.tag = params.genreId;
    if (params.peopleId) return loadForYou({ page: params.page || 1 });

    const tag = (params.tag || "asian").trim();
    const page = Math.max(1, Number(params.page) || 1);

    let url = `${BASE_URL}/tag/${encodeURIComponent(tag)}`;
    if (page > 1) url += `?page=${page}`;

    const html = await fetchPage(url);
    const data = extractPreloadState(html);
    return extractVideoList(data);
  } catch (error) {
    console.error("[XXXFollow loadTagVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  searchVideos — 搜索（顶层 search 块，不在 modules[] 中，
//  App 无法导航回此模块传 genreId/peopleId，故不处理）
// ============================================================
async function searchVideos(params = {}) {
  try {
    const keyword = (params.keyword || params.search_query || "").trim();
    if (!keyword) throw new Error("请输入搜索关键词");

    const page = Math.max(1, Number(params.page) || 1);
    let url = `${BASE_URL}/search/${encodeURIComponent(keyword)}`;
    if (page > 1) url += `?page=${page}`;

    const html = await fetchPage(url);
    const data = extractPreloadState(html);
    return extractVideoList(data);
  } catch (error) {
    console.error("[XXXFollow searchVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadCreatorVideos — 创作者视频列表
// ============================================================
async function loadCreatorVideos(params = {}) {
  try {
    const username = (params.keyword || params.peopleId || "").trim();
    if (!username) throw new Error("缺少创作者");

    const page = Math.max(1, Number(params.page) || 1);
    let url = `${BASE_URL}/${encodeURIComponent(username)}`;
    if (page > 1) url += `?page=${page}`;

    const html = await fetchPage(url);
    const data = extractPreloadState(html);
    return extractVideoList(data);
  } catch (error) {
    console.error("[XXXFollow loadCreatorVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadDetail — 视频详情（返回流地址等完整信息）
//  Forward 约定：列表项 type="url" 时自动调用 loadDetail(link)
//  link 为 post.slug
// ============================================================
async function loadDetail(link) {
  if (!link) throw new Error("无效的视频链接");

  // 详情其实就是同一个数据（单页应用，所有数据在首页已加载）
  // 先尝试从首页预加载数据中查找
  // 如果找不到，就重新请求首页（因为视频数据都在首页 feed 里）
  // 实际上列表项已经带了 videoUrl，这里做增强返回

  // 列表项已含完整 videoUrl，这里尝试在首页/标签/搜索数据中匹配以获得更多信息
  // 先尝试首页
  let html = await fetchPage(BASE_URL);
  let data = extractPreloadState(html);
  let found = findBySlug(data, link);

  // 如果首页没找到，尝试标签页
  if (!found) {
    html = await fetchPage(`${BASE_URL}/tag/asian`);
    data = extractPreloadState(html);
    found = findBySlug(data, link);
  }

  // 相关推荐：从首页 feed 中取其他视频（排除当前）
  if (found && data) {
    const related = [];
    for (const key of Object.keys(data)) {
      const val = data[key];
      if (val && typeof val === "object" && Array.isArray(val.list)) {
        for (const item of val.list) {
          if (!item.post || item.post.id === found.id) continue;
          const parsed = parseVideoItem(item);
          if (parsed) {
            delete parsed.videoUrl;
            delete parsed.trailers;
            related.push(parsed);
            if (related.length >= 10) break;
          }
        }
        break;
      }
    }
    if (related.length > 0) {
      found.relatedItems = related;
    }
  }

  if (found) {
    // 预告片：仅在详情页加入（列表项不带 trailers）
    found.trailers = [{ url: found.videoUrl, coverUrl: found.coverUrl || found.posterPath || "" }];
    return found;
  }

  // 没找到也返回基本结构
  return {
    id: link,
    type: "url",
    mediaType: "movie",
    title: link,
    link: link,
    headers: { "Referer": BASE_URL + "/" }
  };
}

/**
 * 在预加载数据中按 slug/id 查找视频
 */
function findBySlug(preloadData, link) {
  if (!preloadData) return null;
  for (const key of Object.keys(preloadData)) {
    const val = preloadData[key];
    if (val && typeof val === "object" && Array.isArray(val.list)) {
      const found = val.list.find(item =>
        item.post && (item.post.slug === link || String(item.post.id) === link)
      );
      if (found) {
        const parsed = parseVideoItem(found);
        if (parsed) return parsed;
      }
    }
  }
  return null;
}
