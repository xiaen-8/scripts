WidgetMetadata = {
  id: "forward.onlyfans18",
  title: "Onlyfans18",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "Onlyfans18高质量流出视频",
  author: "AiKuai",
  site: "https://onlyfans18.vip",
  icon: "https://onlyfans18.vip/favicon.ico",
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
            { title: "最近更新", value: "new" },
            { title: "onlyfans", value: "1" },
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    }
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

const BASE_URL = "https://onlyfans18.vip";

function resolveUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return BASE_URL + (path.startsWith("/") ? path : "/" + path);
}

function parseList(html) {
  const $ = Widget.html.load(html);
  const items = [];
  $(".col-style").each(function() {
    const $box = $(this);
    const $a = $box.find("a.videoBox");
    const href = $a.attr("href") || "";
    const match = href.match(/\/id\/(\d+)\//);
    if (!match) return;
    const vid = match[1];

    const coverStyle = $box.find(".videoBox-cover").attr("style") || "";
    const coverMatch = coverStyle.match(/url\(["']?(.*?)["']?\)/);
    const img = coverMatch ? resolveUrl(coverMatch[1]) : "";

    const title = $box.find(".videoBox-info .title").text().trim();
    const duration = $box.find(".videoBox-time").first().text().trim();
    const views = $box.find(".views .number").text().trim();
    const likes = $box.find(".likes .number").text().trim();

    if (vid && title) {
      items.push({
        id: vid,
        type: "url",
        title: title,
		backdropPath: img,
        //posterPath: img,//搜索显示封面的关键，但是加了这个分类浏览就会变成一行3个
        durationText: duration,
        link: "detail:" + vid,
        description: "浏览: " + (views || "0") + " | 点赞: " + (likes || "0")
      });
    }
  });
  return items;
}

function parseDetail(html) {
  const $ = Widget.html.load(html);
  let videoUrl = "";

  // 提取 player_data 中的 url
  // 注意：player_data 后面没有分号，直接是 </script>，所以正则不能要求 ;
  const playerDataMatch = html.match(/var player_data\s*=\s*({[\s\S]*?})/);
  if (playerDataMatch) {
    try {
      const playerData = JSON.parse(playerDataMatch[1]);
      videoUrl = playerData.url || "";
    } catch (e) {
      // 备用：正则直接提取 url 字段并手动替换转义斜杠
      const urlMatch = playerDataMatch[1].match(/["']url["']\s*:\s*["']([^"']+)["']/);
      if (urlMatch) {
        videoUrl = urlMatch[1].replace(/\\\//g, "/");
      }
    }
  }

  // 补全为绝对路径：/upload/... → https://onlyfans18.vip/upload/...
  if (videoUrl && !videoUrl.startsWith("http")) {
    videoUrl = BASE_URL + (videoUrl.startsWith("/") ? videoUrl : "/" + videoUrl) + "?format=m3u8";
  }

  const title = $(".video-title").text().trim();

  const genreItems = [];
  $(".video-detail .tags a").each(function() {
    const $el = $(this);
    const tagName = $el.text().trim();
    const tagHref = $el.attr("href") || "";
    const tagIdMatch = tagHref.match(/tag\/(.+?)\.html/);
    const tagId = tagIdMatch ? decodeURIComponent(tagIdMatch[1]) : tagName;
    if (tagName) {
      genreItems.push({ id: tagId, title: tagName });
    }
  });

  const related = [];
  $("#recommend .col-style").each(function() {
    const $box = $(this);
    const $a = $box.find("a.videoBox");
    const href = $a.attr("href") || "";
    const match = href.match(/\/id\/(\d+)\//);
    if (!match) return;
    const rid = match[1];

    const coverStyle = $box.find(".videoBox-cover").attr("style") || "";
    const coverMatch = coverStyle.match(/url\(["']?(.*?)["']?\)/);
    const img = coverMatch ? resolveUrl(coverMatch[1]) : "";

    const rtitle = $box.find(".videoBox-info .title").text().trim();

    if (rid && rtitle) {
      related.push({
        id: rid,
        type: "url",
        title: rtitle,
        posterPath: img,
        link: "detail:" + rid
      });
    }
  });

  return { videoUrl, title, genreItems, related };
}

async function loadList(params = {}) {
  try {
    const type = params.sort_by || "new";
    const page = Number(params.page) || 1;
    let url;
    if (type === "new") {
      if (page === 1) {
        url = BASE_URL + "/index.php/label/new.html";
      } else {
        url = BASE_URL + "/index.php/vod/show/id/1/page/" + page + ".html";
      }
    } else if (type === "hot") {
      url = BASE_URL + "/index.php/label/hot.html";
      if (page > 1) {
        url = BASE_URL + "/index.php/vod/show/id/1/by/hits/page/" + page + ".html";
      }
    } else {
      url = BASE_URL + "/index.php/vod/type/id/" + type;
      if (page > 1) {
        url += "/page/" + page;
      }
      url += ".html";
    }
    const res = await Widget.http.get(url);
    return parseList(res.data);
  } catch (error) {
    console.error("[loadList] 失败:", error.message || error);
    throw error;
  }
}

async function loadDetail(link) {
  try {
    const parts = link.split(":");
    if (parts.length !== 2) return null;
    const vid = parts[1];
    const url = BASE_URL + "/index.php/vod/play/id/" + vid + "/sid/1/nid/1.html";
    const res = await Widget.http.get(url);
    const { videoUrl, title, genreItems, related } = parseDetail(res.data);
    if (!videoUrl) return null;
    return {
      id: vid,
      type: "url",
      title: title || "视频",
      videoUrl: videoUrl,
      genreItems: genreItems,
      relatedItems: related,
      playerType: "app",
      link: link
    };
  } catch (error) {
    console.error("[loadDetail] 失败:", error.message || error);
    return null;
  }
}

async function search(params = {}) {
  try {
    const keyword = params.keyword || "";
    const page = Number(params.page) || 1;
    if (!keyword) return [];
    let url = BASE_URL + "/index.php/vod/search/wd/" + encodeURIComponent(keyword);
    if (page > 1) {
      url += "/page/" + page;
    }
    url += ".html";
    const res = await Widget.http.get(url);
    return parseList(res.data);
  } catch (error) {
    console.error("[search] 失败:", error.message || error);
    throw error;
  }
}