WidgetMetadata = {
  id: "douban.list",
  title: "豆瓣片单",
  version: "2.0.0",
  requiredVersion: "0.0.1",
  description: "内置20个经典恐怖/惊悚片豆列 + 即将上映（从 GitHub 数据源读取，无需实时抓取豆瓣），或填入自定义豆瓣豆列链接",
  author: ".|EL",
  site: "https://douban.com",
  modules: [
    {
      id: "list",
      title: "豆瓣片单",
      functionName: "list",
      cacheDuration: 86400,
      params: [
        {
          name: "list",
          title: "选择片单",
          type: "enumeration",
          value: "1652843",
          enumOptions: [
            { title: "Time Out影史百大恐怖片", value: "1652843" },
            { title: "看电影40部最经典恐怖片", value: "36980" },
            { title: "恐惧感的丧失(309部)", value: "36280" },
            { title: "难忘的经典惊悚/恐怖片(547部)", value: "37140418" },
            { title: "7分以上的恐怖/惊悚电影(174部)", value: "526461" },
            { title: "高分精品恐怖片(280部)", value: "5916567" },
            { title: "2000后优秀恐怖电影(204部)", value: "3356598" },
            { title: "被忽略掉的不沉闷恐怖劲片！(77部)", value: "724565" },
            { title: "Indiewire: 50位导演心中的最佳恐怖片(48部)", value: "152540212" },
            { title: "稀有难找 underground horror films(466部)", value: "109801736" },
            { title: "血浆片已阅整理 Gory Horror Film(47部)", value: "159889980" },
            { title: "女性导演恐怖片(383部)", value: "124549602" },
            { title: "Body Horror｜身体恐怖电影(155部)", value: "162107956" },
            { title: "瘆临其境！恐怖伪纪录片(193部)", value: "161922461" },
            { title: "码住！盘点欧美高分恐怖电影(585部)", value: "163019144" },
            { title: "怪力乱神！欧美超自然恐怖电影(206部)", value: "163048555" },
            { title: "审美与创意兼顾的恐怖片(96部)", value: "159035683" },
            { title: "我看过的恐怖片们(254部)", value: "148836450" },
            { title: "我的恐怖片之旅(1534部)", value: "45782339" },
            { title: "码住！2026年恐怖电影大盘点(304部)", value: "163145526" },
            { title: "⏎ 自定义URL", value: "custom" },
          ],
        },
        {
          name: "url",
          title: "自定义URL",
          type: "input",
          description: "填入豆瓣豆列/列表链接",
          placeholders: [
            { title: "https://www.douban.com/doulist/xxx/", value: "" },
          ],
          belongTo: { paramName: "list", value: ["custom"] },
        },
        {
          name: "page",
          title: "页码",
          type: "page",
        }
      ],
    },
    {
      id: "comingSoon",
      title: "即将上映",
      functionName: "listComingSoon",
      cacheDuration: 86400,
      params: [
        {
          name: "page",
          title: "页码",
          type: "page",
        }
      ],
    }
  ],
};

// ─── GitHub 数据源（直连 raw） ───
var DATA_BASE = "https://raw.githubusercontent.com/cyanbees/douban-widget/main/data/";

// ─── 内置豆列名称 + 文件名映射 ───
var BUILTIN_LISTS = {
  "1652843":   { t: "Time Out影史百大恐怖片", f: "doulist_1652843.json" },
  "36980":     { t: "看电影40部最经典恐怖片", f: "doulist_36980.json" },
  "36280":     { t: "恐惧感的丧失(309部)", f: "doulist_36280.json" },
  "37140418":  { t: "难忘的经典惊悚/恐怖片(547部)", f: "doulist_37140418.json" },
  "526461":    { t: "7分以上的恐怖/惊悚电影(174部)", f: "doulist_526461.json" },
  "5916567":   { t: "高分精品恐怖片(280部)", f: "doulist_5916567.json" },
  "3356598":   { t: "2000后优秀恐怖电影(204部)", f: "doulist_3356598.json" },
  "724565":    { t: "被忽略掉的不沉闷恐怖劲片！(77部)", f: "doulist_724565.json" },
  "152540212": { t: "Indiewire: 50位导演心中的最佳恐怖片(48部)", f: "doulist_152540212.json" },
  "109801736": { t: "稀有难找 underground horror films(466部)", f: "doulist_109801736.json" },
  "159889980": { t: "血浆片已阅整理 Gory Horror Film(47部)", f: "doulist_159889980.json" },
  "124549602": { t: "女性导演恐怖片(383部)", f: "doulist_124549602.json" },
  "162107956": { t: "Body Horror｜身体恐怖电影(155部)", f: "doulist_162107956.json" },
  "161922461": { t: "瘆临其境！恐怖伪纪录片(193部)", f: "doulist_161922461.json" },
  "163019144": { t: "码住！盘点欧美高分恐怖电影(585部)", f: "doulist_163019144.json" },
  "163048555": { t: "怪力乱神！欧美超自然恐怖电影(206部)", f: "doulist_163048555.json" },
  "159035683": { t: "审美与创意兼顾的恐怖片(96部)", f: "doulist_159035683.json" },
  "148836450": { t: "我看过的恐怖片们(254部)", f: "doulist_148836450.json" },
  "45782339":  { t: "我的恐怖片之旅(1534部)", f: "doulist_45782339.json" },
  "163145526": { t: "码住！2026年恐怖电影大盘点(304部)", f: "doulist_163145526.json" },
  "comingSoon":{ t: "即将上映", f: "coming_soon.json" },
};

// ─── 辅助：直接请求 GitHub raw，超时 5秒 ───
async function fetchDataJSON(path) {
  var res = await Widget.http.get(DATA_BASE + path, {
    headers: { "User-Agent": "Mozilla/5.0" },
    timeout: 5000,
  });
  if (!res || !res.data) throw new Error("数据为空");
  return typeof res.data === "object" ? res.data : JSON.parse(res.data);
}

// ─── 实时抓取的片单（数据量大，不走 GitHub JSON） ───
var LIVE_IDS = { "163145526": 1, "124549602": 1, "109801736": 1 };

// ─── 主函数（同时服务"豆瓣片单"和"即将上映"两个模块） ───
async function list(params) {
  try {
    var selectedList = params.list || "1652843";

    if (selectedList === "custom" || LIVE_IDS[selectedList]) {
      return await fetchFromDouban(params);
    }

    var preset = BUILTIN_LISTS[selectedList];
    if (!preset) throw new Error("无效的片单选择");
    console.log("[豆瓣] 使用内置片单:", preset.t);

    var doulistData = await fetchDataJSON(preset.f);
    if (!doulistData || !doulistData.items) throw new Error("豆列数据格式错误");

    var page = Number(params.page || 1);
    var start = (page - 1) * 25;
    var pageItems = doulistData.items.slice(start, start + 25);

    console.log("[豆瓣] 片单:", preset.t, "第" + page + "页, 共" + pageItems.length + "条");

    return pageItems.map(function (item) {
      return {
        id: item.doubanId,
        type: "douban",
        mediaType: "movie",
        title: item.title || "",
        posterPath: item.posterPath || undefined,
        rating: item.rating || undefined,
      };
    });

  } catch (error) {
    console.error("[豆瓣] list 失败:", error.message || error);
    var msg = error.message || "";
    if (msg.indexOf("数据") >= 0 || msg.indexOf("豆列") >= 0) {
      console.warn("[豆瓣] 降级到实时抓取兜底...");
      return await fetchFromDouban(params);
    }
    throw error;
  }
}

// ─── 兜底函数：实时抓取豆瓣 ───
async function fetchFromDouban(params) {
  var selectedList = params.list || "1652843";
  var url = params.url ? params.url.trim() : "";

  if (selectedList !== "custom") {
    var presetName = BUILTIN_LISTS[selectedList];
    if (!presetName) throw new Error("无效的片单选择");
    url = "https://www.douban.com/doulist/" + selectedList + "/";
    console.log("[豆瓣] 降级抓取片单:", presetName.t);
  } else if (!url) {
    throw new Error("请提供豆瓣片单地址");
  }

  var page = Number(params.page || 1);
  var start = (page - 1) * 25;
  url = url.replace(/([?&])start=\d+/, '$1').replace(/[?&]$/, '');
  url += (url.indexOf('?') >= 0 ? '&' : '?') + 'start=' + start;

  console.log("[豆瓣] 实时抓取:", url);

  var response = await Widget.http.get(url, {
    headers: {
      "Referer": "https://movie.douban.com/",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    timeout: 8000,
  });

  if (!response || !response.data) {
    throw new Error("获取豆瓣片单数据失败");
  }

  var $ = Widget.html.load(response.data);
  if (!$ || $ === null) {
    throw new Error("解析 HTML 失败");
  }

  var doubanItems = [];
  var seen = new Set();

  // 策略1：标准 doulist-item
  $(".doulist-item").each(function (i, el) {
    var $item = $(el);
    var $link = $item.find(".title a");
    var href = $link.attr("href");
    if (!href) return;

    var match = href.match(/movie\.douban\.com\/subject\/(\d+)/);
    if (!match) return;

    var id = Number(match[1]);
    if (seen.has(id)) return;
    seen.add(id);

    var title = $link.text().trim();
    var posterPath = $item.find(".post img").attr("src");
    var ratingText = $item.find(".rating_nums").text().trim();

    doubanItems.push({
      id: id,
      type: "douban",
      mediaType: "movie",
      title: title || "",
      posterPath: posterPath || undefined,
      rating: ratingText ? Number(ratingText) : undefined,
    });
  });

  // 策略2：兜底
  if (doubanItems.length === 0) {
    $("a[href*='movie.douban.com/subject/']").each(function (i, el) {
      var href = $(el).attr("href");
      if (!href) return;
      var match = href.match(/movie\.douban\.com\/subject\/(\d+)/);
      if (!match) return;
      var id = Number(match[1]);
      if (seen.has(id)) return;
      seen.add(id);
      var title = $(el).text().trim();
      doubanItems.push({
        id: id,
        type: "douban",
        mediaType: "movie",
        title: title || "",
      });
    });
  }

  console.log("[豆瓣] 实时抓取完成，提取:", doubanItems.length, "条");
  return doubanItems;
}

// ─── 即将上映独立模块 ───
var COMING_SOON_URL = "https://raw.githubusercontent.com/cyanbees/douban-widget/main/data/coming_soon.json";

async function listComingSoon(params) {
  try {
    var res = await Widget.http.get(COMING_SOON_URL, {
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 10000,
    });
    if (!res || !res.data) return [];

    var data = typeof res.data === "object" ? res.data : JSON.parse(res.data);
    if (!data || !data.items) return [];

    var page = Number(params.page || 1);
    var start = (page - 1) * 25;
    var pageItems = data.items.slice(start, start + 25);

    console.log("[豆瓣] 即将上映: 第" + page + "页, 共" + pageItems.length + "条");

    return pageItems.map(function (item) {
      var displayTitle = item.title || "";
      if (item.releaseDate) {
        displayTitle = "[" + item.releaseDate.substring(5) + "] " + displayTitle;
      }
      // posterPath 传 TMDB raw path（以/开头），App 会自动拼接 image.tmdb.org
      var rawPoster = null;
      if (item.posterPath) {
        var m = item.posterPath.match(/\/[^/]+\.jpg$/);
        if (m) rawPoster = m[0];
      }
      return {
        id: item.tmdbId,
        type: "tmdb",
        mediaType: "movie",
        title: displayTitle,
        posterPath: rawPoster,
        releaseDate: item.releaseDate || undefined,
      };
    });

  } catch (error) {
    console.error("[豆瓣] 即将上映获取失败:", error.message || error);
    return [];
  }
}
