// @name PPnix ForwardWidget
// @description PPnix 影视模块 (ForwardWidget 版) — 支持电影/电视剧分类浏览、搜索、详情播放
// @version 1.0.0
// @site https://www.ppnix.com

WidgetMetadata = {
  id: "ppnix.widget",
  title: "PPnix",
  icon: "",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "PPnix 影视 — 电影/电视剧分类浏览与搜索，支持自定义域名和 CF Cookie",
  author: "Spider",
  site: "https://github.com",

  globalParams: [
    {
      name: "host",
      title: "PPnix 域名",
      type: "input",
      value: "https://www.ppnix.com",
    },
    {
      name: "langPath",
      title: "语言路径",
      type: "enumeration",
      value: "/cn",
      enumOptions: [
        { title: "中文", value: "/cn" },
        { title: "默认", value: "" },
      ],
    },
    {
      name: "cookie",
      title: "CF Cookie (cf_clearance=...)",
      type: "input",
      value: "",
    },
  ],

  search: {
    title: "搜索",
    functionName: "searchPpnix",
    params: [
      { name: "keyword", title: "关键词", type: "input", value: "" },
      { name: "page", title: "页码", type: "page" },
    ],
  },

  modules: [
    {
      id: "ppnix_movie",
      title: "电影",
      functionName: "loadMovieList",
      type: "video",
      cacheDuration: 3600,
      params: [
        {
          name: "genre",
          title: "类型",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "动作", value: "动作" },
            { title: "喜剧", value: "喜剧" },
            { title: "爱情", value: "爱情" },
            { title: "科幻", value: "科幻" },
            { title: "恐怖", value: "恐怖" },
            { title: "剧情", value: "剧情" },
            { title: "动画", value: "动画" },
            { title: "纪录片", value: "纪录片" },
          ],
        },
        {
          name: "area",
          title: "地区",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "大陆", value: "大陆" },
            { title: "香港", value: "香港" },
            { title: "台湾", value: "台湾" },
            { title: "美国", value: "美国" },
            { title: "日本", value: "日本" },
            { title: "韩国", value: "韩国" },
            { title: "英国", value: "英国" },
            { title: "法国", value: "法国" },
            { title: "泰国", value: "泰国" },
          ],
        },
        {
          name: "year",
          title: "年份",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "2025", value: "2025" },
            { title: "2024", value: "2024" },
            { title: "2023", value: "2023" },
            { title: "2022", value: "2022" },
            { title: "2021", value: "2021" },
            { title: "2020", value: "2020" },
            { title: "2019", value: "2019" },
          ],
        },
        {
          name: "sort",
          title: "排序",
          type: "enumeration",
          value: "newstime",
          enumOptions: [
            { title: "最新", value: "newstime" },
            { title: "最热", value: "onclick" },
            { title: "评分", value: "rating" },
          ],
        },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "ppnix_tv",
      title: "电视剧",
      functionName: "loadTvList",
      type: "video",
      cacheDuration: 3600,
      params: [
        {
          name: "genre",
          title: "类型",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "剧情", value: "剧情" },
            { title: "爱情", value: "爱情" },
            { title: "古装", value: "古装" },
            { title: "悬疑", value: "悬疑" },
            { title: "犯罪", value: "犯罪" },
            { title: "动作", value: "动作" },
            { title: "喜剧", value: "喜剧" },
          ],
        },
        {
          name: "area",
          title: "地区",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "大陆", value: "大陆" },
            { title: "香港", value: "香港" },
            { title: "台湾", value: "台湾" },
            { title: "美国", value: "美国" },
            { title: "日本", value: "日本" },
            { title: "韩国", value: "韩国" },
            { title: "英国", value: "英国" },
            { title: "泰国", value: "泰国" },
          ],
        },
        {
          name: "year",
          title: "年份",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "2025", value: "2025" },
            { title: "2024", value: "2024" },
            { title: "2023", value: "2023" },
            { title: "2022", value: "2022" },
            { title: "2021", value: "2021" },
            { title: "2020", value: "2020" },
          ],
        },
        {
          name: "sort",
          title: "排序",
          type: "enumeration",
          value: "newstime",
          enumOptions: [
            { title: "最新", value: "newstime" },
            { title: "最热", value: "onclick" },
            { title: "评分", value: "rating" },
          ],
        },
        { name: "page", title: "页码", type: "page" },
      ],
    },
  ],
};

// ==================== 常量 ====================

const PPNIX_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36";

const SORT_MAP = {
  newstime: "newstime",
  onclick: "onclick",
  rating: "rating",
};

// ==================== 工具函数 ====================

function ppnixText(v) {
  return String(v == null ? "" : v).trim();
}

function ppnixHost(params) {
  return ppnixText(params.host || "https://www.ppnix.com").replace(/\/$/, "");
}

function ppnixLangPath(params) {
  const p = ppnixText(params.langPath || "/cn");
  if (!p) return "/cn";
  return p.startsWith("/") ? p : "/" + p;
}

function ppnixHeaders(params) {
  const headers = {
    "User-Agent": PPNIX_UA,
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9",
  };
  const cookie = ppnixText(params.cookie || "");
  if (cookie) headers["Cookie"] = cookie;
  return headers;
}

function ppnixJoinUrl(host, path) {
  const p = ppnixText(path);
  if (!p) return host + "/";
  if (/^https?:\/\//i.test(p)) return p;
  if (p.startsWith("/")) return host + p;
  return host + "/" + p;
}

function ppnixFixImage(host, url) {
  const u = ppnixText(url);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("//")) return "https:" + u;
  if (u.startsWith("/")) return host + u;
  return host + "/" + u;
}

// ==================== 列表解析 ====================

function ppnixParseList(host, html) {
  if (!html) return [{ id: "err_empty", type: "text", title: "无数据返回" }];
  if (html.includes("Just a moment") || html.includes("cf-browser-verification")) {
    return [
      {
        id: "err_cf",
        type: "text",
        title: "被 Cloudflare 拦截",
        subTitle: "请在 globalParams 中填入有效的 CF Cookie",
      },
    ];
  }

  const $ = Widget.html.load(html);
  const results = [];
  const seen = new Set();

  // PPnix 列表项选择器 — 兼容常见结构
  $("ul.lists-content li, .lists-content ul li, .lists .lists-content ul li").each((_, el) => {
    const $el = $(el);
    const $a = $el.find("a.thumbnail, h2 a, a").first();
    const href = ppnixText($a.attr("href") || $el.find("h2 a").attr("href") || "");
    if (!href || seen.has(href)) return;
    seen.add(href);

    const vodName = ppnixText(
      $el.find("img.thumb").attr("alt") ||
        $el.find("h2 a").text() ||
        $a.text()
    );
    if (!vodName) return;

    const vodPic = ppnixFixImage(
      host,
      $el.find("img.thumb").attr("src") ||
        $el.find("img.thumb").attr("data-src") ||
        ""
    );
    const remarks = ppnixText(
      $el.find("footer .rate").text() || $el.find("footer").text()
    );

    results.push({
      id: href,
      type: "url",
      title: vodName,
      coverUrl: vodPic,
      posterPath: vodPic,
      description: remarks,
      link: href,
    });
  });

  if (results.length === 0) {
    return [{ id: "empty", type: "text", title: "没有找到相关内容" }];
  }
  return results;
}

// ==================== 分类列表请求 ====================

async function ppnixFetchList(params, categoryId) {
  const host = ppnixHost(params);
  const langPath = ppnixLangPath(params);
  const page = parseInt(params.page || 1, 10) || 1;
  const genre = ppnixText(params.genre || "");
  const area = ppnixText(params.area || "");
  const year = ppnixText(params.year || "");
  const sort = SORT_MAP[ppnixText(params.sort || "newstime")] || "newstime";

  // PPnix 分类 URL 格式: /cn/movie/类型-地区-年份-page-排序.html
  // page 参数: 第1页为空(0), 第N页为 N-1
  const pagePart = page <= 1 ? "0" : String(page - 1);
  const path = `${langPath}/${categoryId}/${genre}-${area}-${year}-${pagePart}-${sort}.html`;
  const url = ppnixJoinUrl(host, path);

  console.log("[PPnix] fetchList:", url);

  try {
    const res = await Widget.http.get(url, { headers: ppnixHeaders(params) });
    return ppnixParseList(host, res.data);
  } catch (e) {
    console.error("[PPnix] fetchList error:", e.message || e);
    return [{ id: "err", type: "text", title: "加载失败", subTitle: e.message }];
  }
}

// ==================== 模块入口函数 ====================

async function loadMovieList(params = {}) {
  return ppnixFetchList(params, "movie");
}

async function loadTvList(params = {}) {
  return ppnixFetchList(params, "tv");
}

// ==================== 搜索 ====================

async function searchPpnix(params = {}) {
  const keyword = ppnixText(params.keyword || "");
  if (!keyword) {
    return [{ id: "tip", type: "text", title: "请输入关键词开始搜索" }];
  }

  const host = ppnixHost(params);
  const langPath = ppnixLangPath(params);
  const page = parseInt(params.page || 1, 10) || 1;

  const encoded = encodeURIComponent(keyword);
  const pageSuffix = page <= 1 ? "" : `-page-${page}`;
  const path = `${langPath}/search/${encoded}--.html${pageSuffix}`;
  const url = ppnixJoinUrl(host, path);

  console.log("[PPnix] search:", url);

  try {
    const res = await Widget.http.get(url, { headers: ppnixHeaders(params) });
    return ppnixParseList(host, res.data);
  } catch (e) {
    console.error("[PPnix] search error:", e.message || e);
    return [{ id: "err", type: "text", title: "搜索失败", subTitle: e.message }];
  }
}

// ==================== 详情 ====================
// link 格式：原始 href，如 /cn/movie/12345.html
// 也兼容 globalParams 中的 host 通过 params 注入
// 注意: ForwardWidget 的 loadDetail 接收的是 link 字符串，不是 params 对象
// 但 globalParams 无法直接注入，所以把 host 编码进 link

async function loadDetail(link) {
  // link 可能是:
  //   1. 原始路径 "/cn/movie/12345.html"  (旧版兼容)
  //   2. 完整 URL "https://www.ppnix.com/cn/movie/12345.html"
  //   3. 自定义协议 "ppnix://https://www.ppnix.com|/cn/movie/12345.html"

  let resolvedUrl = "";
  const linkStr = ppnixText(link);

  if (linkStr.startsWith("ppnix://")) {
    // 格式: ppnix://<host>|<path>
    const inner = linkStr.slice("ppnix://".length);
    const sep = inner.indexOf("|");
    if (sep !== -1) {
      const host = inner.slice(0, sep);
      const path = inner.slice(sep + 1);
      resolvedUrl = ppnixJoinUrl(host, path);
    } else {
      resolvedUrl = inner; // fallback
    }
  } else if (/^https?:\/\//i.test(linkStr)) {
    resolvedUrl = linkStr;
  } else {
    // 裸路径，用默认 host
    resolvedUrl = "https://www.ppnix.com" + (linkStr.startsWith("/") ? linkStr : "/" + linkStr);
  }

  console.log("[PPnix] loadDetail:", resolvedUrl);

  // 从 URL 推断 host
  const hostMatch = resolvedUrl.match(/^(https?:\/\/[^/]+)/i);
  const host = hostMatch ? hostMatch[1] : "https://www.ppnix.com";
  const referer = host + "/cn/";

  const headers = {
    "User-Agent": PPNIX_UA,
    Referer: referer,
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  };

  try {
    const res = await Widget.http.get(resolvedUrl, { headers });
    const html = ppnixText(res.data);
    const $ = Widget.html.load(html);

    // 标题
    const titleRaw = ppnixText($("h1.product-title").text());
    const vodName =
      titleRaw.replace(/\s*\([^)]*\)\s*$/, "").trim() ||
      ppnixText($("title").text()).replace(/\s*\([^)]*\).*/, "");

    // 封面
    const vodPic = ppnixFixImage(
      host,
      $("header.product-header img.thumb").attr("src") || ""
    );

    // 简介
    const vodContent = ppnixText(
      $(".product-excerpt")
        .filter((_, el) => $(el).text().includes("简介:"))
        .text()
    ).replace(/^简介:/, "");

    // 导演 / 主演
    const vodDirector = ppnixText(
      $(".product-excerpt")
        .filter((_, el) => $(el).text().includes("导演:"))
        .find("span")
        .text()
    );
    const vodActor = ppnixText(
      $(".product-excerpt")
        .filter((_, el) => $(el).text().includes("主演:"))
        .find("span")
        .text()
    ).replace(/\s*\/\s*/g, ", ");

    // 年份
    const vodYear =
      (titleRaw.match(/\((\d{4})\)/) || [])[1] || "";

    // 演员列表 → peoples
    const peoples = [];
    if (vodActor) {
      vodActor.split(",").forEach((name, i) => {
        const n = ppnixText(name);
        if (n) peoples.push({ id: "actor_" + i, title: n, role: "主演" });
      });
    }
    if (vodDirector) {
      peoples.unshift({ id: "director_0", title: vodDirector, role: "导演" });
    }

    // 解析 m3u8 列表 (PPnix 原版逻辑: m3u8 = ['...','...'])
    const infoIdMatch = html.match(/infoid\s*=\s*(\d+)/);
    const infoId = infoIdMatch ? infoIdMatch[1] : "";
    const m3u8Match = html.match(/m3u8\s*=\s*\[(.*?)\]/s);
    const episodeParams = [];
    if (m3u8Match) {
      const re = /'([^']*)'|"([^"]*)"/g;
      let mm;
      while ((mm = re.exec(m3u8Match[1])) !== null) {
        const v = ppnixText(mm[1] || mm[2] || "");
        if (v) episodeParams.push(v);
      }
    }

    // 构建 episodeItems
    const isMovie =
      episodeParams.length === 1 &&
      !episodeParams[0].match(/第\d+集/) &&
      episodeParams[0].indexOf("集") === -1;

    const episodeItems = episodeParams.map((param, idx) => {
      const epTitle = isMovie
        ? vodName
        : vodName + " 第" + (idx + 1) + "集";
      const m3u8Url = infoId
        ? `${host}/info/m3u8/${infoId}/${encodeURIComponent(param)}.m3u8`
        : param;
      return {
        id: linkStr + "_ep_" + idx,
        type: "url",
        title: epTitle,
        videoUrl: m3u8Url,
        mediaType: isMovie ? "movie" : "episode",
        customHeaders: {
          Referer: resolvedUrl,
          Origin: host,
          "User-Agent": PPNIX_UA,
        },
      };
    });

    const mediaType = isMovie ? "movie" : "tv";
    const videoUrl =
      isMovie && episodeItems.length > 0 ? episodeItems[0].videoUrl : null;

    return {
      id: linkStr,
      type: "url",
      title: vodName,
      description: vodContent,
      posterPath: vodPic,
      backdropPath: vodPic,
      releaseDate: vodYear,
      mediaType,
      peoples,
      videoUrl: videoUrl || undefined,
      episodeItems: isMovie ? [] : episodeItems,
      customHeaders: {
        Referer: resolvedUrl,
        Origin: host,
        "User-Agent": PPNIX_UA,
      },
    };
  } catch (e) {
    console.error("[PPnix] loadDetail error:", e.message || e);
    return null;
  }
}