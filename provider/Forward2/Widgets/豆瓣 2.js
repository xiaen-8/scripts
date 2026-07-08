WidgetMetadata = {
  id: "forward.douban.list",
  title: "豆瓣片单",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "解析豆瓣豆列(Doulist)及常规片单地址",
  author: "，",
  site: "https://douban.com",
  modules: [
    {
      id: "list",
      title: "豆瓣片单",
      functionName: "list",
      params: [
        {
          name: "url",
          title: "列表地址",
          type: "input",
          description: "支持豆瓣豆列(doulist)或其他豆瓣电影列表链接",
          placeholders: [
            {
              title: "请填入豆瓣片单链接",
              value: "",
            }
          ],
        },
        {
          name: "page",
          title: "页码",
          type: "page",
        }
      ],
    }
  ],
};

async function list(params = {}) {
  let url = params.url;
  if (!url) {
    throw new Error("请提供豆瓣片单地址");
  }

  // 处理分页：豆瓣豆列默认一页 25 个，依靠 start 参数控制游标
  const page = Number(params.page || 1);
  const start = (page - 1) * 25;

  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set("start", start);
    url = urlObj.toString();
  } catch (e) {
    // 兼容可能的不规范 URL
    url = url.replace(/([?&])start=\d+/, '$1').replace(/[?&]$/, '');
    url += (url.includes('?') ? '&' : '?') + 'start=' + start;
  }

  console.log("请求豆瓣片单页面:", url);

  // 伪装头部，防止被豆瓣基础反爬盾拦截
  const response = await Widget.http.get(url, {
    headers: {
      "Referer": "https://movie.douban.com/",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  if (!response || !response.data) {
    throw new Error("获取豆瓣片单数据失败");
  }

  const $ = Widget.html.load(response.data);
  if (!$ || $ === null) {
    throw new Error("解析 HTML 失败");
  }

  const doubanItems = [];
  const seen = new Set();

  // 策略1：优先解析标准豆瓣豆列的 DOM 结构 (.doulist-item)
  $(".doulist-item").each((i, el) => {
    const $item = $(el);
    const $link = $item.find(".title a");
    const href = $link.attr("href");
    if (!href) return;

    const match = href.match(/movie\.douban\.com\/subject\/(\d+)/);
    if (!match) return;

    const id = Number(match[1]);
    if (seen.has(id)) return;
    seen.add(id);

    const title = $link.text().trim();
    const posterPath = $item.find(".post img").attr("src");
    const ratingText = $item.find(".rating_nums").text().trim();

    doubanItems.push({
      id: id,
      type: "douban",
      mediaType: "movie", // 豆瓣 ID 本身涵盖影剧，默认传 movie 不影响内置详情页的路由
      title: title || undefined,
      posterPath: posterPath || undefined,
      rating: ratingText ? Number(ratingText) : undefined,
    });
  });

  // 策略2：兼容其他泛电影列表页面 (例如普通的搜索或标签分类页)
  if (doubanItems.length === 0) {
    $(".item, .subject-item").each((i, el) => {
      const $item = $(el);
      const $link = $item.find("a").first();
      const href = $link.attr("href");
      if (!href) return;

      const match = href.match(/movie\.douban\.com\/subject\/(\d+)/);
      if (!match) return;

      const id = Number(match[1]);
      if (seen.has(id)) return;
      seen.add(id);

      const title = $item.find(".title, .pl2 a").text().replace(/\s+/g, " ").trim();
      const posterPath = $item.find("img").attr("src");
      const ratingText = $item.find(".rating_nums").text().trim();

      doubanItems.push({
        id: id,
        type: "douban",
        mediaType: "movie",
        title: title || undefined,
        posterPath: posterPath || undefined,
        rating: ratingText ? Number(ratingText) : undefined,
      });
    });
  }

  // 策略3：极端兜底。如果页面结构大改，暴力提取页面里所有的 subject 链接 (退化为原 TMDB 的处理模式)
  if (doubanItems.length === 0) {
    $("a[href*='movie.douban.com/subject/']").each((i, el) => {
      const href = $(el).attr("href");
      if (!href) return;

      const match = href.match(/movie\.douban\.com\/subject\/(\d+)/);
      if (!match) return;

      const id = Number(match[1]);
      if (seen.has(id)) return;
      seen.add(id);

      doubanItems.push({
        id: id,
        type: "douban",
        mediaType: "movie",
      });
    });
  }

  console.log("片单解析完成，提取条目数:", doubanItems.length);
  return doubanItems;
}
