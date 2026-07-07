WidgetMetadata = {
  id: "forward.xgroovy",
  title: "XGroovy 视频",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "XGroovy 成人视频聚合浏览",
  author: "AiKuai",
  site: "https://cn.xgroovy.com",
  icon: "https://cn.xgroovy.com/favicon.ico",
  detailCacheDuration: 60,
  modules: [
    {
      id: "loadList",
      title: "视频列表",
      functionName: "loadList",
      cacheDuration: 3600,
      params: [
        {
          name: "sort_by",
          title: "分类",
          type: "enumeration",
          enumOptions: [
            { title: "首页推荐", value: "" },
            { title: "最新发布", value: "new" },
            { title: "中文色情", value: "categories/Chinese" },
            { title: "国产视频", value: "search/china" },
            { title: "年轻人 (18/19)", value: "categories/young" },
            { title: "继家庭幻想", value: "categories/family" },
            { title: "青少年 (18+)", value: "categories/teens" },
            { title: "人妖", value: "shemale" },
            { title: "妈妈", value: "categories/mom" },
            { title: "AI生成", value: "categories/ai" },
            { title: "辣妈", value: "categories/milf" },
            { title: "拉丁裔美女", value: "categories/latina" },
            { title: "美女", value: "categories/beautiful-girl" },
            { title: "女同", value: "categories/lesbians" },
            { title: "业余", value: "categories/amateur" },
            { title: "黑人", value: "categories/ebony" },
            { title: "合集", value: "categories/compilation" },
            { title: "巨乳", value: "categories/big-tits" },
            { title: "熟女", value: "categories/mature" },
            { title: "3P 三人行", value: "categories/threesome" },
            { title: "爆菊", value: "categories/anal" },
            { title: "体内射精", value: "categories/creampie" },
            { title: "第一次", value: "categories/first-time" },
            { title: "老年轻 (18/19)", value: "categories/old-young" },
            { title: "绿帽侠", value: "categories/cuckold" },
            { title: "大屌", value: "categories/big-cock" },
            { title: "大屁股", value: "categories/big-ass" },
            { title: "亚洲人", value: "categories/asian" },
            { title: "女性自慰", value: "categories/solo" },
            { title: "出轨", value: "categories/cheating" },
            { title: "娇小", value: "categories/petite" },
            { title: "硬核性交", value: "categories/rough" },
            { title: "BBW (大号美女)", value: "categories/bbw" },
            { title: "色情日漫", value: "categories/hentai" },
            { title: "性高潮", value: "categories/orgasm" },
            { title: "潮吹", value: "categories/squirt" },
            { title: "口交", value: "categories/blowjob" },
            { title: "名人", value: "categories/celebrity" },
            { title: "轮交", value: "categories/gangbang" },
            { title: "射精", value: "categories/cumshot" },
            { title: "POV (第一视角)", value: "categories/pov" },
            { title: "双性恋者", value: "categories/bisexual" },
            { title: "卡通", value: "categories/cartoon" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "searchModule",
      title: "全局搜索",
      functionName: "search",
      cacheDuration: 0,          // 搜索结果不缓存
      params: [
        { name: "keyword", title: "关键词", type: "input" },
        { name: "page", title: "页码", type: "page" }
      ]
    }
  ],
  search: {
    title: "搜索视频",
    functionName: "search",
    params: [
      { name: "keyword", title: "关键词", type: "input" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

const BASE_URL = "https://cn.xgroovy.com";

function resolveUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return BASE_URL + (path.startsWith("/") ? path : "/" + path);
}


function parseList(html, includePoster = false) {
  const $ = Widget.html.load(html);
  const items = [];
  $(".item").each(function() {
    const $item = $(this);
    const videoId = $item.attr("data-video-id");
    if (!videoId) return;

    const $a = $item.find("a.popito");
    const href = $a.attr("href") || "";
    const fullLink = resolveUrl(href);

    const title = $a.find("strong.title").text().trim();
    const $img = $item.find("img.thumb");
    let thumb = $img.attr("data-jpg") || $img.attr("src") || "";
    thumb = resolveUrl(thumb);
    const duration = $item.find(".duration").text().trim();
    const views = $item.find(".views").text().trim();
    const rating = $item.find(".rating").text().trim();
    const author = $item.find(".author-link a").text().trim();

    if (videoId && title) {
      const item = {
        id: videoId,
        type: "url",
        title: title,
        backdropPath: thumb,
        durationText: duration,
        link: fullLink,
        description: "浏览: " + (views || "0") + " | 评分: " + (rating || "0") + (author ? " | 来源: " + author : "")
      };
      // 只有搜索时才添加 posterPath
      if (includePoster) {
        item.posterPath = thumb;
      }
      items.push(item);
    }
  });
  return items;
}

function parseDetail(html) {
  const $ = Widget.html.load(html);

  let videoUrl = "";
  
  // 方法A: 先尝试通过 video 标签查找
  const $video = $("video");
  if ($video.length) {
    const sources = [];
    $video.find("source").each(function() {
      const $src = $(this);
      const url = $src.attr("src");
      if (url) {
        let fullUrl = resolveUrl(url);
        // 修复4: 清理 ?br=xxx 参数
        fullUrl = fullUrl.split('/?')[0];
        
        if (fullUrl.toLowerCase().endsWith(".mp4")) {
          const label = $src.attr("title") || "480p";
          sources.push({ url: fullUrl, label: label });
        }
      }
    });
    
    const priority = { "1080p": 4, "720p": 3, "480p": 2, "240p": 1 };
    let best = sources[0];
    sources.forEach(s => {
      const p = priority[s.label] || 0;
      const bp = priority[best?.label] || 0;
      if (p > bp) best = s;
    });
    if (best) videoUrl = best.url;
  }

  // 方法B: 如果上面的方法没找到，用正则兜底
  if (!videoUrl) {
    const sourceRegex = /<source[^>]+src="([^"]+)"[^>]*type="video\/mp4"[^>]*title="([^"]*)"/gi;
    const sources = [];
    let match;
    while ((match = sourceRegex.exec(html)) !== null) {
      let url = resolveUrl(match[1]);
      url = url.split('/?')[0]; // 清理参数
      sources.push({ url: url, label: match[2] || "480p" });
    }
    if (sources.length > 0) {
      const priority = { "1080p": 4, "720p": 3, "480p": 2, "240p": 1 };
      let best = sources[0];
      sources.forEach(s => {
        const p = priority[s.label] || 0;
        const bp = priority[best.label] || 0;
        if (p > bp) best = s;
      });
      videoUrl = best.url;
    }
  }

  const title = $("h1").text().trim();

  const genreItems = [];
  $(".meta-data a").each(function() {
    const $tag = $(this);
    const tagName = $tag.text().trim();
    const tagHref = $tag.attr("href") || "";
    const slug = tagHref.replace(/^\/tags\//, "").replace(/\/$/, "");
    if (tagName && slug) {
      genreItems.push({ id: slug, title: tagName });
    }
  });

  const related = [];
  const $relatedContainer = $("#list_videos_custom_related_sphinx_videos_items");
  if ($relatedContainer.length) {
    $relatedContainer.find(".item").each(function() {
      const $item = $(this);
      const rid = $item.attr("data-video-id");
      if (!rid) return;
      const $a = $item.find("a.popito");
      const rtitle = $a.find("strong.title").text().trim();
      const $img = $item.find("img.thumb");
      let rthumb = $img.attr("data-jpg") || $img.attr("src") || "";
      rthumb = resolveUrl(rthumb);
      if (rid && rtitle) {
        related.push({
          id: rid,
          type: "url",
          title: rtitle,
          posterPath: rthumb,
          link: resolveUrl($a.attr("href") || "")
        });
      }
    });
  }

  return { videoUrl, title, genreItems, related };
}

// 获取列表（热门或最新）
async function loadList(params = {}) {
  try {
    const sortBy = params.sort_by || "";
    const page = Number(params.page) || 1;
    let url = "";
      url = BASE_URL + "/" + sortBy;
      if (page === 1) {
        url = BASE_URL + "/"+sortBy+"/";
      } else {
        url = BASE_URL + "/"+sortBy+"/" + page + "/";
      }
    const res = await Widget.http.get(url);
    let html = res.data;
    let containerHtml = "";
    if (sortBy === "new") {
      const $ = Widget.html.load(html);
      const $container = $("#list_videos_most_recent_videos_items");
      if ($container.length) {
        containerHtml = $container.html();
      } else {
        containerHtml = html;
      }
    } else {
      // 其他分类（young, teens, shemale, beautiful-girl）使用通用容器
      const $ = Widget.html.load(html);
      const $container = $("#list_videos_common_videos_list_items");
      if ($container.length) {
        containerHtml = $container.html();
      } else {
        // 兜底：尝试其他常见容器
        const altContainer = $("#list_videos_most_recent_videos_items, .list-videos, .content").first();
        containerHtml = altContainer.length ? altContainer.html() : html;
      }
    }
    const fullHtml = '<div class="list-videos">' + containerHtml + '</div>';
    return parseList(fullHtml);
  } catch (error) {
    console.error("[XGroovy loadList] 失败:", error.message || error);
    throw error;
  }
}


async function loadDetail(link) {
  try {
    // link 现在是完整的详情页 URL（如 https://cn.xgroovy.com/videos/732895/xxx/）
    // 不再需要 split 和手动拼接
    const res = await Widget.http.get(link);
    const html = res.data;
    const detail = parseDetail(html);
    if (!detail.videoUrl) {
      return null;
    }
    // 从完整链接中提取 videoId
    const idMatch = link.match(/\/videos\/(\d+)\//);
    const vid = idMatch ? idMatch[1] : "";
    return {
      id: vid,
      type: "url",
      title: detail.title || "视频",
      videoUrl: detail.videoUrl,
      genreItems: detail.genreItems,
      relatedItems: detail.related,
      playerType: "system",
      link: link
    };
  } catch (error) {
    console.error("[XGroovy loadDetail] 失败:", error.message || error);
    return null;
  }
}

// 搜索
async function search(params = {}) {
  try {
    const keyword = params.keyword || "";
    const page = Number(params.page) || 1;
    if (!keyword) return [];
    let url = BASE_URL + "/search/" + encodeURIComponent(keyword);
    if (page > 1) {
      url += "/" + page;
    }
    url += "/";
    let res;
    try {
      res = await Widget.http.get(url);
    } catch (e) {
      url = BASE_URL + "/search/?q=" + encodeURIComponent(keyword) + "&page=" + page;
      res = await Widget.http.get(url);
    }
    return parseList(res.data, true);  // ← 这里传入 true
  } catch (error) {
    console.error("[XGroovy search] 失败:", error.message || error);
    throw error;
  }
}