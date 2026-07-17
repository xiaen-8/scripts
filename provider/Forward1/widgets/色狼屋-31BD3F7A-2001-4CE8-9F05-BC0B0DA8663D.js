WidgetMetadata = {
  id: "forward.selangwu",
  title: "色狼屋",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "色狼屋 - 中文传媒 / 国产 / 日韩AV 等成人视频",
  author: "Forward",
  site: "https://www.selangwu01.xyz",
  icon: "https://www.selangwu01.xyz/template/05/static/image/minilogo.png",
  detailCacheDuration: 3600,
  modules: [
    // 主分类模块（视频分类）
    {
      id: "loadList",
      title: "视频分类",
      functionName: "loadList",
      cacheDuration: 1800,
      params: [
        { name: "sort_by", title: "分类", type: "enumeration",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "中文传媒", value: "1" },
            { title: "国产", value: "2" },
            { title: "欧美AV", value: "3" },
            { title: "日本AV", value: "4" },
            { title: "明星网黄", value: "5" },
            { title: "动漫", value: "6" },
            { title: "吃瓜黑料", value: "7" },
            { title: "变态暗网", value: "8" },
            { title: "小众口味", value: "9" },
            { title: "AV解说", value: "10" },
            { title: "AI换脸", value: "12" },
            { title: "韩国AV", value: "13" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    // 搜索模块（顶层）
    {
      id: "search",
      title: "搜索",
      functionName: "search",
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

// 基础域名（可通过 globalParams 覆盖）
const BASE_URL = "https://www.selangwu01.xyz";

// ====================== loadList ======================
async function loadList(params = {}) {
  try {
    const cate = params.sort_by || "";
    const page = Number(params.page || 1);
    let url = `${BASE_URL}/index.php/vod/type/id/1.html`;

    if (cate) {
      url = `${BASE_URL}/index.php/vod/type/id/${cate}.html`;
    }
    if (page > 1) {
      url = url.replace('.html', `/page/${page}.html`);
    }

    const res = await Widget.http.get(url);
    const $ = Widget.html.load(res.data);

    const items = [];
    $(".module-item").each((_, el) => {
      const $el = $(el);
      const $a = $el.find("a.module-item-title");
      const title = $a.text().trim();
      const link = $a.attr("href");
      const img = $el.find("img.lazy").attr("data-src") || $el.find("img").attr("src");
      const idMatch = link.match(/id\/(\d+)/);
      const id = idMatch ? idMatch[1] : "";

      // 提取上映时间
      const releaseDate = $el.find(".video-info-aux .tag-link").first().text().trim();

      if (title && link) {
        items.push({
          id: id || link,
          type: "url",
          mediaType: "movie",
          title: title,
          backdropPath: img ? img.startsWith("http") ? img : `https://img1.souavzyw.vip${img}` : "",
          link: link,
          releaseDate: releaseDate,   // 新增上映时间
        });
      }
    });

    return items;
  } catch (e) {
    console.error("[selangwu loadList]", e.message);
    throw e;
  }
}

// ====================== loadDetail ======================
async function loadDetail(link) {
  try {
    if (!link) return null;
    const fullUrl = link.startsWith("http") ? link : `${BASE_URL}${link}`;
    const res = await Widget.http.get(fullUrl);
    const $ = Widget.html.load(res.data);

    // 提取标题
    const title = $("h1.page-title").first().text().trim() ||
                  $(".video-info-header h1").text().trim() ||
                  $("title").text().split("-")[0].trim();

    // 从传入的 link 中提取视频 ID
    const idMatch = link.match(/id\/(\d+)/);
    const vodId = idMatch ? idMatch[1] : null;
    // 提取 m3u8 视频地址（原有逻辑保持不变）
    let videoUrl = "";
    const html = res.data;
    const m3u8Match = html.match(/"url"\s*:\s*"([^"]+\.m3u8)"/) ||
                      html.match(/url["']\s*:\s*["']([^"']+\.m3u8)["']/);
    if (m3u8Match) {
      videoUrl = m3u8Match[1].replace(/\\/g, '');
    }

    return {
      id: vodId || link,            // 优先使用数字 ID
      type: "url",
      mediaType: "movie",
      title: title,
      description: $(".video-info-aux, .module-info-text").text().trim().slice(0, 200),
      videoUrl: videoUrl,
      link: link,
    };
  } catch (e) {
    console.error("[selangwu loadDetail]", e.message);
    return null;
  }
}

// ====================== search ======================
async function search(params = {}) {
  try {
    const keyword = params.keyword || "";
    const page = Number(params.page || 1);
    if (!keyword) return [];

    // 构造搜索URL（与网站实际格式一致）
    let url;
    if (page === 1) {
      url = `${BASE_URL}/index.php/vod/search.html?wd=${encodeURIComponent(keyword)}`;
    } else {
      url = `${BASE_URL}/index.php/vod/search/page/${page}/wd/${encodeURIComponent(keyword)}.html`;
    }

    const res = await Widget.http.get(url);
    const $ = Widget.html.load(res.data);

    const items = [];
    // 完全使用 loadList 的选择器逻辑
    $(".module-item").each((_, el) => {
      const $el = $(el);
      const $a = $el.find("a.module-item-title");
      const title = $a.text().trim();
      const link = $a.attr("href");
      // 图片：优先 data-src，回退 src
      const img = $el.find("img.lazy").attr("data-src") || $el.find("img").attr("src");
      // 提取数字ID
      const idMatch = link && link.match(/id\/(\d+)/);
      const id = idMatch ? idMatch[1] : "";

      // 提取上映时间（第一个 .tag-link 的文本）
      const releaseDate = $el.find(".video-info-aux .tag-link").first().text().trim();

      if (title && link) {
        items.push({
          id: id || link,
          type: "url",
          mediaType: "movie",
          title: title,
          // 与 loadList 一致：相对路径补全图片域名
          backdropPath: img ? (img.startsWith("http") ? img : `https://img1.souavzyw.vip${img}`) : "",
          link: link,               // 相对路径，loadDetail 会补全
          releaseDate: releaseDate,
        });
      }
    });

    return items;
  } catch (e) {
    console.error("[selangwu search]", e.message);
    return [];
  }
}