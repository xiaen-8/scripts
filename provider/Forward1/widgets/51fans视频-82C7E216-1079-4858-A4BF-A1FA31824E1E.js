// ============================================
// 51fans Widget Module - 极简版
// 仅保留：热门预览（含子分类+分页）+ 搜索 + 详情（支持多视频播放列表）
// ============================================

WidgetMetadata = {
  id: "forward.51fans",
  title: "51fans视频",
  version: "1.0.3",
  requiredVersion: "0.0.1",
  description: "51fans网 - 免费看片吃瓜第一站",
  author: "Forward",
  site: "https://github.com/InchStudio/ForwardWidgets",
  icon: "https://assets.vvebo.vip/scripts/icon.png",
  detailCacheDuration: 300,
  
  modules: [
    {
      id: "previewList",
      title: "热门预览",
      functionName: "previewList",
      type: "preview",
      cacheDuration: 1800,
      requiresWebView: false,
      sectionMode: false,
      params: [
        { 
          name: "sort_by", 
          title: "子分类", 
          type: "enumeration",
          enumOptions: [
            { title: "51fans首页", value: "home" },
            { title: "51fans热门", value: "order/hot" },
            { title: "最近更新", value: "order/today" },
            { title: "网黄精选", value: "category/txwh" },
            { title: "国产专栏", value: "category/txfc" },
            { title: "原创投稿", value: "category/txyc" },
            { title: "乱伦禁忌", value: "category/txll" },
            { title: "AV鉴赏", value: "category/txav" },
            { title: "吃瓜黑料", value: "category/txhl" },
            { title: "探花大神", value: "category/thtp" },
            { title: "里番动漫", value: "category/txdm" },
            { title: "成人综艺", value: "category/txzy" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "searchModule",
      title: "全局搜索",
      functionName: "search",
      cacheDuration: 0,
      params: [
        { name: "keyword", title: "关键词", type: "input" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
  ],
  
  search: {
    title: "搜索",
    functionName: "search",
    params: [
      { name: "keyword", title: "关键词", type: "input" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

// ============================================
// 常量
// ============================================
const BASE_URL = "https://51fans1.com";
const PIC_DOMAIN = "pic.jjlxoi.cn";
const COVER_PROXY = "https://bagua-cover-proxy.dingyong1024.workers.dev?url=";

function buildImageUrl(path) {
  if (!path) return "";
  let fullUrl;
  if (path.startsWith("http")) {
    fullUrl = path;
  } else if (path.startsWith("//")) {
    fullUrl = "https:" + path;
  } else {
    fullUrl = `https://${PIC_DOMAIN}${path}`;
  }
  return COVER_PROXY + encodeURIComponent(fullUrl);
}

// ============================================
// 热门预览（子分类+分页）
// ============================================

async function previewList(params = {}) {
  try {
    const page = Number(params.page || 1);
    const category = params.sort_by || "";
    
    let url;
    if (category === "home") {
      url = BASE_URL + "/";
      if (page > 1) url += `page/${page}/`;
    } else if (category) {
      url = `${BASE_URL}/${category}/`;
      if (page > 1) url += `page/${page}/`;
    }
    const res = await Widget.http.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.0"
      }
    });
    
    const html = res.data;
    const $ = Widget.html.load(html);
    
    const items = [];
    $(".xqbj-list-rows").each((i, elem) => {
      const $row = $(elem);
      
      const linkElem = $row.find("a[href^='/archives/']").first();
      const href = linkElem.attr("href") || "";
      const idMatch = href.match(/\/archives\/(\d+)\//);
      const id = idMatch ? idMatch[1] : "";
      
      const title = linkElem.attr("title") || linkElem.find("h3").text() || "";
      
      const imgElem = linkElem.find("img[data-image-preview]").first();
      let posterPath = imgElem.attr("z-image-loader-url") || "";
      posterPath = posterPath.replace(/[`'"]/g, "");
      
      const tagElem = $row.find(".xqbj-list-rows-bottom-tags-btn").first();
      const tagName = tagElem.text().trim() || "";
      
      let releaseDate = "";
      const $iconTime = $row.find(".xqbj-icon-time");
      if ($iconTime.length) {
        const $timeTag = $iconTime.closest(".xqbj-list-rows-bottom-tags-tag");
        let $dateText = $timeTag.find(".xqbj-list-rows-bottom-tags-text.is-mobile");
        if (!$dateText.length) {
          $dateText = $timeTag.find(".xqbj-list-rows-bottom-tags-text.is-desktop");
        }
        releaseDate = $dateText.text().trim();
      }
      
      if (id && title) {
        items.push({
          id: id,
          type: "url",
          title: title.trim(),
          backdropPath: buildImageUrl(posterPath),
          link: `detail:${id}`,
          subtitle: tagName,
          releaseDate: releaseDate
        });
      }
    });
    
    return items;
    
  } catch (error) {
    console.error("[previewList] 失败:", error.message || error);
    throw error;
  }
}

// ============================================
// 详情（支持多视频播放列表）
// ============================================

async function loadDetail(link) {
  try {
    const id = String(link).replace("detail:", "");
    if (!id) return null;
    
    const url = `${BASE_URL}/archives/${id}/`;
    
    const res = await Widget.http.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.0"
      }
    });
    
    const html = res.data;
    const $ = Widget.html.load(html);
    
    const title = $("h1").first().text() || $(".article-title").first().text() || "";
    const posterPath = $("meta[property='og:image']").attr("content") || "";
    const description = $("meta[name='description']").attr("content") || "";

    // ---------- 提取所有视频（播放列表） ----------
    const episodeItems = [];
    let firstVideoUrl = null;

    $(".dplayer").each((i, elem) => {
      const configStr = $(elem).attr("data-config");
      if (!configStr) return;

      try {
        const config = JSON.parse(configStr);
        const videoUrl = config?.video?.url;
        if (!videoUrl) return;

        // 优先使用 data-video_title，若无则用默认标题
        const videoTitle = $(elem).attr("data-video_title") || `视频 ${i + 1}`;
        // 使用 data-video_id 或组合 id
        const videoId = $(elem).attr("data-video_id") || `${id}_${i}`;

        const item = {
          id: videoId,
          type: "url",
          title: videoTitle.trim(),
          videoUrl: videoUrl,
          posterPath: buildImageUrl(posterPath), // 沿用页面主图
          playerType: "app"
        };
        episodeItems.push(item);

        if (!firstVideoUrl) {
          firstVideoUrl = videoUrl;
        }
      } catch (e) {
        // 忽略解析失败
      }
    });

    // ---------- 相关推荐 ----------
    const relatedItems = [];
    $(".rank-card").each((i, elem) => {
      const $card = $(elem);
      const href = $card.attr("href") || "";
      const recIdMatch = href.match(/\/archives\/(\d+)\//);
      const recId = recIdMatch ? recIdMatch[1] : "";
      const recTitle = $card.find(".rank-card-content-content-name").text() || "";
      
      if (recId && recTitle) {
        relatedItems.push({
          id: recId,
          type: "url",
          title: recTitle.trim(),
          link: `detail:${recId}`
        });
      }
    });

    // ---------- 截图/剧照 ----------
    const backdropPaths = [];
    $("img[data-image-preview]").each((i, elem) => {
      const src = $(elem).attr("z-image-loader-url") || "";
      if (src) {
        backdropPaths.push(buildImageUrl(src.replace(/[`'"]/g, "")));
      }
    });

    // ---------- 组装详情对象 ----------
    return {
      id: id,
      type: "url",
      title: title.trim(),
      posterPath: buildImageUrl(posterPath),
      description: description.trim(),
      link: link,
      videoUrl: firstVideoUrl,               // 首个视频（向后兼容）
      episodeItems: episodeItems,            // 播放列表（若只有一项，也会显示为单集）
      backdropPaths: backdropPaths,
      relatedItems: relatedItems.slice(0, 10),
      playerType: "app"
    };
    
  } catch (error) {
    console.error("[loadDetail] 失败:", error.message || error);
    return null;
  }
}

// ============================================
// 搜索
// ============================================

async function search(params = {}) {
  try {
    const keyword = params.keyword || "";
    const page = Number(params.page || 1);
    
    if (!keyword) return [];
    
    const url = `${BASE_URL}/search/${encodeURIComponent(keyword)}/`;
    
    const res = await Widget.http.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.0"
      }
    });
    
    const html = res.data;
    const $ = Widget.html.load(html);
    
    const items = [];
    $(".xqbj-list-rows").each((i, elem) => {
      const $row = $(elem);
      
      const linkElem = $row.find("a[href^='/archives/']").first();
      const href = linkElem.attr("href") || "";
      const idMatch = href.match(/\/archives\/(\d+)\//);
      const id = idMatch ? idMatch[1] : "";
      
      const title = linkElem.attr("title") || linkElem.find("h3").text() || "";
      
      const imgElem = linkElem.find("img[data-image-preview]").first();
      let posterPath = imgElem.attr("z-image-loader-url") || "";
      posterPath = posterPath.replace(/[`'"]/g, "");
      
      const tagElem = $row.find(".xqbj-list-rows-bottom-tags-btn").first();
      const tagName = tagElem.text().trim() || "";
      
      let releaseDate = "";
      const $iconTime = $row.find(".xqbj-icon-time");
      if ($iconTime.length) {
        const $timeTag = $iconTime.closest(".xqbj-list-rows-bottom-tags-tag");
        let $dateText = $timeTag.find(".xqbj-list-rows-bottom-tags-text.is-mobile");
        if (!$dateText.length) {
          $dateText = $timeTag.find(".xqbj-list-rows-bottom-tags-text.is-desktop");
        }
        releaseDate = $dateText.text().trim();
      }
      
      if (id && title) {
        items.push({
          id: id,
          type: "url",
          title: title.trim(),
          posterPath: buildImageUrl(posterPath),
          link: `detail:${id}`,
          subtitle: tagName,
          releaseDate: releaseDate
        });
      }
    });
    
    return items;
    
  } catch (error) {
    console.error("[search] 失败:", error.message || error);
    throw error;
  }
}