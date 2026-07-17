// Lvmao影院 ForwardWidget 模块（调试版 - 输出HTML）
const DEFAULT_BASE_URL = "https://www.Lvmao.tv";

WidgetMetadata = {
  id: "forward.Lvmao",
  title: "Lvmao影院",
  version: "1.2.1",
  requiredVersion: "0.0.1",
  description: "修复版",
  author: "AiKuai",
  site: "https://github.com/InchStudio/ForwardWidgets",
  icon: "",
  detailCacheDuration: 60,
  globalParams: [
    {
      name: "baseUrl",
      title: "网站域名",
      type: "input",
      value: "https://www.26qtmi.vip",
      placeholders: [
        { title: "Lvmao", value: "https://www.26qtmi.vip" },
        { title: "Lvmao", value: "https://www.mh7cof.vip" },
        { title: "Lvmao", value: "https://www.kugshb.vip" },
		{ title: "5X5X", value: "https://www.zsacuc.com" },
		{ title: "5X5X", value: "https://www.fr7852.com" },
		{ title: "5X5X", value: "https://www.fgqm5r.com" },
        { title: "永久发布页", value: "https://lv9mao9.com" },
      ]
    }
  ],
  modules: [
    {
      id: "loadList",
      title: "最新影片",
      functionName: "loadList",
      cacheDuration: 3600,
      params: [
        {
          name: "sort_by",
          title: "分类",
          type: "enumeration",
          enumOptions: [
            /* { title: "首页", value: "" }, */
            { title: "大陆", value: "1" },
            { title: "日韩", value: "2" },
            { title: "欧美", value: "3" },
            { title: "动画", value: "4" },
            { title: "三级", value: "5" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "searchModule",
      title: "搜索",
      functionName: "search",
      cacheDuration: 0,          // 搜索结果不缓存
      params: [
        { name: "keyword", title: "关键词", type: "input" },
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

async function getBaseUrl(params) {
  let base = params && params.baseUrl ? params.baseUrl : Widget.storage.get("baseUrl");
  if (!base) base = DEFAULT_BASE_URL;
  Widget.storage.set("baseUrl", base);
  return base;
}

function fixUrl(url, baseUrl) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("//")) return "https:" + url;
  if (url.startsWith("/")) return baseUrl + url;
  return url;
}

const DEFAULT_HEADERS = {
  "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "zh-CN,zh;q=0.9"
};

function logHtml(label, html) {
  const preview = String(html).substring(0, 3000);
  console.log("[" + label + "] HTML preview (3000 chars):\n" + preview);
  console.log("[" + label + "] Total length: " + String(html).length);
}

function parseList(html, baseUrl) {
  const $ = Widget.html.load(html);
  const items = [];

  let $cards = $(".video-grid .card");
  if ($cards.length === 0) {
    $cards = $(".video-grid a[href^='/vd/']");
  }
  if ($cards.length === 0) {
    $cards = $("a[href^='/vd/']");
  }

  console.log("[parseList] matched cards:", $cards.length);

  $cards.each(function (idx) {
    const $card = $(this);
    const href = $card.attr("href") || "";
    if (!href || !href.includes("/vd/")) return;

    const match = href.match(/\/vd\/(\d+)\//);
    if (!match) return;
    const vid = match[1];

    let $img = $card.find("img.card-img");
    if ($img.length === 0) $img = $card.find("img").first();

    let title = $img.attr("alt");
    if (!title) title = $card.find(".card-title").text().trim();
    if (!title) title = $card.attr("title");
    if (!title) title = "视频" + vid;

    let img = $img.attr("data-src") || $img.attr("src") || $img.attr("data-original") || "";

    items.push({
      id: vid,
      type: "url",
      title: title,
	  backdropPath: fixUrl(img, baseUrl),
      //posterPath: fixUrl(img, baseUrl),//搜索显示封面的关键，但是加了这个分类浏览就会变成一行3个
      link: "Lvmao:" + vid
    });
  });

  console.log("[parseList] parsed items:", items.length);
  return items;
}

function parseDetail(html, baseUrl) {
  const $ = Widget.html.load(html);
  let videoUrl = $("#player-wrap").attr("data-m3u8") || "";
  if (!videoUrl) {
    videoUrl = $("#player-wrap").attr("data-mp4") || "";
  }

  let title = $(".text-lg.font-bold").text().trim();
  if (!title) {
    const titleText = $("title").text() || "";
    title = titleText.split(" - ")[0].trim();
  }
  if (!title) {
    title = $("h1").first().text().trim();
  }

  const relatedItems = parseList(html, baseUrl);
  return { videoUrl, title, relatedItems };
}

async function loadList(params = {}) {
  try {
    const baseUrl = await getBaseUrl(params);
    const type = params.sort_by || "";
    const page = Number(params.page) || 1;

    let url;
    if (type) {
      url = baseUrl + "/category/" + type + "/";
      if (page > 1) url += "page/" + page + "/";
    } else {
      url = baseUrl + "/";
      if (page > 1) url += "page/" + page + "/";
    }

    console.log("[loadList] fetching:", url);
    const res = await Widget.http.get(url, { headers: DEFAULT_HEADERS });

    if (!res || !res.data) {
      console.error("[loadList] empty response");
      throw new Error("空响应");
    }

    logHtml("loadList", res.data);

    const items = parseList(res.data, baseUrl);
    console.log("[loadList] returning items:", items.length);
    return items;
  } catch (error) {
    console.error("[loadList] 失败:", error.message || error);
    throw error;
  }
}

async function loadDetail(link) {
  try {
    const baseUrl = Widget.storage.get("baseUrl") || DEFAULT_BASE_URL;
    const parts = String(link).split(":");
    if (parts.length !== 2) {
      console.error("[loadDetail] invalid link:", link);
      return null;
    }
    const vid = parts[1];

    const url = baseUrl + "/vd/" + vid + "/";
    console.log("[loadDetail] fetching:", url);
    const res = await Widget.http.get(url, { headers: DEFAULT_HEADERS });

    if (!res || !res.data) {
      console.error("[loadDetail] empty response");
      return null;
    }

    logHtml("loadDetail", res.data);

    const { videoUrl, title, relatedItems } = parseDetail(res.data, baseUrl);

    if (!videoUrl) {
      console.error("[loadDetail] no videoUrl found");
      return null;
    }

    return {
      id: vid,
      type: "url",
      title: title || "视频",
      videoUrl: videoUrl,
      relatedItems: relatedItems,
      playerType: "system",
      link: link
    };
  } catch (error) {
    console.error("[loadDetail] 失败:", error.message || error);
    return null;
  }
}

async function search(params = {}) {
  try {
    const baseUrl = await getBaseUrl(params);
    const keyword = params.keyword || "";
    const page = Number(params.page) || 1;
    if (!keyword) return [];

    let url = baseUrl + "/search/?wd=" + encodeURIComponent(keyword);
    if (page > 1) url += "&page=" + page;

    console.log("[search] fetching:", url);
    const res = await Widget.http.get(url, { headers: DEFAULT_HEADERS });

    if (!res || !res.data) {
      console.error("[search] empty response");
      throw new Error("空响应");
    }

    logHtml("search", res.data);
    return parseList(res.data, baseUrl);
  } catch (error) {
    console.error("[search] 失败:", error.message || error);
    throw error;
  }
}