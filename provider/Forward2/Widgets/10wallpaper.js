// ============================================================
//  10Wallpaper — 高清4K-5K壁纸列表、详情与搜索模块
//  源站: https://10wallpaper.com
//  HTML 解析
// ============================================================

WidgetMetadata = {
  id: "10wallpaper",
  title: "10Wallpaper",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "10Wallpaper高清4K-5K壁纸 — 最新壁纸、分类浏览、搜索，原图直达下载",
  author: "EL",
  site: "https://10wallpaper.com",
  icon: "https://10wallpaper.com/favicon.ico",
  detailCacheDuration: 120,
  modules: [
    {
      id: "latest",
      title: "最新壁纸",
      functionName: "loadLatest",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "browseCategory",
      title: "分类浏览",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        {
          name: "category",
          title: "选择分类",
          type: "enumeration",
          value: "Landscape",
          enumOptions: [
            { title: "风景", value: "Landscape" },
            { title: "人物", value: "People" },
            { title: "植物", value: "Plants" },
            { title: "动物", value: "Animal" },
            { title: "影视", value: "Moive" },
            { title: "游戏", value: "Game" },
            { title: "城市", value: "City" },
            { title: "设计", value: "Design" },
            { title: "摄影", value: "Photography" },
            { title: "太空", value: "Space" },
            { title: "体育", value: "Sports" },
            { title: "广告", value: "Advertising" },
            { title: "汽车", value: "Auto" },
            { title: "军事", value: "Military" },
            { title: "节日", value: "Festivals" },
            { title: "其他", value: "Other" }
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
      { name: "keyword", title: "关键词", type: "input" }
    ]
  }
};

// ============================================================
//  常量
// ============================================================
const BASE = "https://10wallpaper.com";
const LANG = "/cn";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";

// ============================================================
//  工具函数
// ============================================================

function absURL(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("//")) return "https:" + url;
  return BASE + url;
}

// ============================================================
//  列表解析
// ============================================================

function parseListHtml(html) {
  var items = [];
  var $ = Widget.html.load(html);

  // 壁纸列表: div.pics p a / #pics-list p a
  $("div.pics p").each(function () {
    var $link = $(this).find("a").first();
    var href = $link.attr("href") || "";
    var imgSrc = $link.find("img").attr("src") || "";
    var title = $link.find("span").text().trim() || $link.find("img").attr("alt") || "";

    // Extract name from href: /cn/view/{name}.html
    var nameMatch = href.match(/\/cn\/view\/(.+)\.html/);
    if (!nameMatch) return;
    var name = nameMatch[1];

    var thumb = absURL(imgSrc);

    items.push({
      id: name,
      type: "url",
      title: title,
      link: name,
      coverUrl: thumb,
      backdropPath: thumb
    });
  });

  return items;
}

// ============================================================
//  列表页加载
// ============================================================

async function fetchPage(url) {
  var res = await Widget.http.get(url, {
    headers: { "User-Agent": UA }
  });
  var html = typeof res.data === "string" ? res.data : "";
  if (!html) throw new Error("空响应");
  return html;
}

async function loadListByPattern(basePath, pagePath, page) {
  page = Math.max(1, Number(page) || 1);
  var url = BASE + LANG + (page > 1 ? pagePath.replace("{page}", page) : basePath);
  var html = await fetchPage(url);
  return parseListHtml(html);
}

// ============================================================
//  loadLatest — 最新壁纸
// ============================================================

async function loadLatest(params) {
  try {
    if (params.genreId) return loadCategory({ category: params.genreId, page: params.page });
    if (params.peopleId) return search({ keyword: params.peopleId });
    return loadListByPattern("/", "/List_wallpapers/page/{page}", params.page);
  } catch (error) {
    console.error("[10wallpaper loadLatest] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadCategory — 按分类浏览
// ============================================================

async function loadCategory(params) {
  try {
    if (params.peopleId) return search({ keyword: params.peopleId });

    var category = params.genreId || params.category || "";
    if (!category) throw new Error("缺少分类参数");

    return loadListByPattern(
      "/" + category + "_wallpaper.html",
      "/" + category + "_wallpaper/page/{page}",
      params.page
    );
  } catch (error) {
    console.error("[10wallpaper loadCategory] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  search — 搜索壁纸
// ============================================================

async function search(params) {
  try {
    var kw = params.keyword;
    if (params.peopleId) {
      kw = params.peopleId;
    }

    var keyword = (kw || "").trim();
    if (!keyword) throw new Error("请输入搜索关键词");

    var encoded = encodeURIComponent(keyword).replace(/%20/g, "_");
    var url = BASE + LANG + "/search/" + encoded + "/";
    var html = await fetchPage(url);
    return parseListHtml(html);
  } catch (error) {
    console.error("[10wallpaper search] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadDetail — 壁纸详情
// ============================================================

async function loadDetail(link) {
  if (!link) throw new Error("无效的壁纸链接");

  try {
    var name = String(link);
    var detailUrl = BASE + LANG + "/view/" + name + ".html";

    var html = await fetchPage(detailUrl);
    var $ = Widget.html.load(html);

    // 标题: h2 span.main — 格式 "分类 / 壁纸名称"
    var fullTitle = $("h2 span.main").first().text().trim() || "";
    // 提取壁纸名称部分（去除 "分类 / " 前缀）
    var title = fullTitle;
    var slashIdx = fullTitle.indexOf("/");
    if (slashIdx >= 0) {
      title = fullTitle.substring(slashIdx + 1).trim();
    }

    // 分类: h2 span.main 的第一部分
    var genreItems = [];
    var catName = "";
    if (slashIdx >= 0) {
      catName = fullTitle.substring(0, slashIdx).trim();
      // Map Chinese category name to English ID for navigation
      var catMap = {
        "风景": "Landscape", "人物": "People", "植物": "Plants",
        "动物": "Animal", "影视": "Moive", "游戏": "Game",
        "城市": "City", "设计": "Design", "摄影": "Photography",
        "太空": "Space", "体育": "Sports", "广告": "Advertising",
        "汽车": "Auto", "军事": "Military", "节日": "Festivals",
        "其他": "Other"
      };
      var catId = catMap[catName] || "";
      if (catId) {
        genreItems.push({ id: catId, title: catName });
      }
    }

    // 预览图
    var previewSrc = $("p#main-pic img").first().attr("src") || "";
    var preview = absURL(previewSrc);

    // 从预览图URL推断缩略图URL（封面用缩略图，加载更快）
    // 预览: /wallpaper/1366x768/2606/xxx_1366x768.jpg
    // 缩略: /wallpaper/medium/2606/xxx_medium.jpg
    var thumb = previewSrc
      .replace(/\/\d+x\d+\//, "/medium/")
      .replace(/_\d+x\d+\.jpg$/, "_medium.jpg");
    var coverThumb = absURL(thumb);

    // ★ 高清原图: 第一个 span.res-ttl a 链接（最高分辨率）
    var originalUrl = "";
    var originalRes = "";
    var $firstResLink = $("span.res-ttl a").first();
    if ($firstResLink.length) {
      originalUrl = absURL($firstResLink.attr("href") || "");
      originalRes = $firstResLink.text().trim();
    }

    // 剧照: 所有分辨率版本
    var backdropPaths = [];
    var allResolutions = [];
    $("span.res-ttl a").each(function () {
      var href = $(this).attr("href") || "";
      var res = $(this).text().trim();
      if (href && res) {
        allResolutions.push(res);
        backdropPaths.push(absURL(href));
      }
    });

    // 描述（显示所有可用分辨率）
    var description = "";
    if (originalRes) description = "最高分辨率: " + originalRes;
    if (allResolutions.length > 1) {
      description += "\n可用分辨率: " + allResolutions.join(", ");
    }

    // 相关推荐
    var relatedItems = [];
    $("div.pics#related p").each(function () {
      var $link = $(this).find("a").first();
      var relHref = $link.attr("href") || "";
      var relNameMatch = relHref.match(/\/cn\/view\/(.+)\.html/);
      if (!relNameMatch) return;
      var relName = relNameMatch[1];
      var relImg = $link.find("img").attr("src") || "";
      var relTitle = $link.find("span").text().trim() || "";
      if (relName && relTitle) {
        relatedItems.push({
          id: relName,
          type: "url",
          title: relTitle,
          link: relName,
          coverUrl: absURL(relImg),
          backdropPath: absURL(relImg)
        });
      }
    });

    // 封面使用缩略图（加载快）
    var cover = coverThumb || preview;

    var result = {
      id: name,
      type: "url",
      title: title,
      link: name,
      coverUrl: cover,
      backdropPath: cover,
      backdropPaths: backdropPaths.length > 0 ? backdropPaths : undefined,
      description: description || undefined,
      genreItems: genreItems.length > 0 ? genreItems : undefined
    };

    if (relatedItems.length > 0) {
      result.relatedItems = relatedItems;
    }

    return result;
  } catch (error) {
    console.error("[10wallpaper loadDetail] 失败:", error.message || error);
    throw error;
  }
}
