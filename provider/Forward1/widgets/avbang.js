WidgetMetadata = {
  id: "forward.avbang",
  title: "AV帮",
  version: "1.0.4",
  requiredVersion: "0.0.1",
  description: "AV帮 - 一区二区三区四区及详细子分类（分页 + m3u8 + 封面）",
  author: "Grok",
  site: "https://avbang.cyou",
  icon: "https://avbang.cyou/favicon.ico",
  detailCacheDuration: 1800,
  modules: [
    {
      id: "loadZone1",
      title: "视频一区",
      functionName: "loadZone1",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { 
          name: "sort_by", 
          title: "子分类", 
          type: "enumeration", 
          enumOptions: [
            { title: "全部", value: "" },
            { title: "无码专区", value: "无码专区" },
            { title: "麻豆传媒", value: "麻豆传媒" },
            { title: "制服诱惑", value: "制服诱惑" },
            { title: "AI换脸", value: "AI换脸" },
            { title: "中文字幕", value: "中文字幕" },
            { title: "卡通动漫", value: "卡通动漫" },
            { title: "欧美系列", value: "欧美系列" },
            { title: "美女主播", value: "美女主播" }
          ]
        }
      ]
    },
    {
      id: "loadZone2",
      title: "视频二区",
      functionName: "loadZone2",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { 
          name: "sort_by", 
          title: "子分类", 
          type: "enumeration", 
          enumOptions: [
            { title: "全部", value: "" },
            { title: "华语AV", value: "华语AV" },
            { title: "日本有码", value: "日本有码" },
            { title: "日本无码", value: "日本无码" }
          ]
        }
      ]
    },
    {
      id: "loadZone3",
      title: "视频三区",
      functionName: "loadZone3",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { 
          name: "sort_by", 
          title: "子分类", 
          type: "enumeration", 
          enumOptions: [
            { title: "全部", value: "" },
            { title: "国产传媒", value: "国产传媒" },
            { title: "国产精品", value: "国产精品" },
            { title: "国产自拍", value: "国产自拍" }
          ]
        }
      ]
    },
    {
      id: "loadZone4",
      title: "视频四区",
      functionName: "loadZone4",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { 
          name: "sort_by", 
          title: "子分类", 
          type: "enumeration", 
          enumOptions: [
            { title: "全部", value: "" },
            { title: "中文字幕", value: "中文字幕" },
            { title: "日本有码", value: "日本有码" },
            { title: "日本无码", value: "日本无码" },
            { title: "AV解说", value: "AV解说" },
            { title: "cosplay", value: "cosplay" },
            { title: "黑丝诱惑", value: "黑丝诱惑" },
            { title: "SWAG", value: "SWAG" },
            { title: "自拍偷拍", value: "自拍偷拍" },
            { title: "激情动漫", value: "激情动漫" },
            { title: "网红主播", value: "网红主播" },
            { title: "探花系列", value: "探花系列" },
            { title: "三级伦理", value: "三级伦理" },
            { title: "VR视角", value: "VR视角" },
            { title: "国产传媒", value: "国产传媒" },
            { title: "素人搭讪", value: "素人搭讪" }
          ]
        }
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

// 通用列表加载（优化封面提取）
async function loadListByZone(zoneId, params = {}) {
  try {
    const page = Number(params.page || 1);
    let url;

    if (params.sort_by && params.sort_by !== '') {
      const encodedClass = encodeURIComponent(params.sort_by);
      url = `https://avbang.cyou/vod/show/class/${encodedClass}/id/${zoneId}/`;
      if (page > 1) url += `page/${page}/`;
    } else {
      url = `https://avbang.cyou/vod/show/id/${zoneId}/`;
      if (page > 1) url += `page/${page}/`;
    }

    console.log(`[loadZone${zoneId}] fetching:`, url);

    const res = await Widget.http.get(url);
    const html = res.data;
    const $ = Widget.html.load(html);

    const items = [];

    // 遍历每个视频项
    $('li a[href*="/vod/play/id/"], .vodlist_item').each((i, el) => {
      const $el = $(el);
      const href = $el.attr('href') || $el.find('a').attr('href');
      
      // 提取封面 - data-original
      let poster = $el.find('img.lazy').attr('data-original') || 
                   $el.find('img').attr('data-original') || 
                   $el.find('img').attr('src');

      let title = $el.find('.title, .vodlist_title').text().trim() || 
                  $el.find('img').attr('alt') || 
                  $el.find('img').attr('title') ||
                  $el.text().trim().split('\n')[0];

      if (href && title) {
        const idMatch = href.match(/id\/(\d+)/);
        const vid = idMatch ? idMatch[1] : href;
        const cleanLink = href.startsWith('http') ? href : `https://avbang.cyou${href}`;
        const linkWithPoster = poster ? `${cleanLink}?poster=${encodeURIComponent(poster)}` : cleanLink;
        items.push({
          id: vid,
          type: "url",
          mediaType: "movie",
          title: title.replace(/\s+/g, ' ').trim(),
          link: linkWithPoster,
          coverUrl: poster ? poster : "",   // 通用兜底
          backdropPath: poster ? poster : "",   // 横图位优先
        });
      }
    });

    console.log(`[loadZone${zoneId}] 获取到 ${items.length} 条`);
    return items;
  } catch (error) {
    console.error(`[loadZone${zoneId}] 失败:`, error.message || error);
    throw error;
  }
}

async function loadZone1(params = {}) { return loadListByZone(1, params); }
async function loadZone2(params = {}) { return loadListByZone(2, params); }
async function loadZone3(params = {}) { return loadListByZone(3, params); }
async function loadZone4(params = {}) { return loadListByZone(4, params); }

// 详情页 m3u8 提取（从 link 中取出编码的封面图给剧照）
async function loadDetail(link) {
  try {
    // 从 link 中提取编码的封面图
    const [cleanLink, posterParam] = (link || '').split('?poster=');
    const posterFromLink = posterParam ? decodeURIComponent(posterParam) : '';

    const fullUrl = cleanLink.startsWith('http') ? cleanLink : `https://avbang.cyou${cleanLink}`;
    const res = await Widget.http.get(fullUrl);
    const html = res.data;
    const $ = Widget.html.load(html);

    const title = $('h1').first().text().trim() || $('title').text().trim();

    // m3u8 提取
    let videoUrl = '';
    const scriptText = $('script').text();

    const uulMatch = scriptText.match(/var\s+uul\s*=\s*['"](https?:\/\/[^'"]+)['"]/i);
    if (uulMatch && uulMatch[1]) {
      videoUrl = uulMatch[1];
      const concatMatch = scriptText.match(/uul\s*\+\s*['"]([^'"]+)['"]/i);
      if (concatMatch && concatMatch[1]) videoUrl += concatMatch[1];
    }

    if (!videoUrl) {
      const m3u8Match = scriptText.match(/(https?:\/\/[^\s'"]+\.m3u8)/i);
      if (m3u8Match) videoUrl = m3u8Match[1];
    }

    return {
      id: link,
      type: "url",
      title: title,
      link: link,
      videoUrl: videoUrl,
      playerType: "app",
      description: $('.desc, .content, .intro').text().trim().substring(0, 800),
      trailers: videoUrl ? [{ url: videoUrl }] : [],
      backdropPaths: posterFromLink ? [posterFromLink] : [],
    };
  } catch (error) {
    console.error("[loadDetail] 失败:", error.message);
    return null;
  }
}

// 搜索（已修复）
async function search(params = {}) {
  try {
    const keyword = encodeURIComponent(params.keyword || '');
    const page = Number(params.page || 1);
    if (!keyword) return [];

    let url = `https://avbang.cyou/vod/search.html?wd=${keyword}`;
    if (page > 1) {
      url += `&page=${page}`;
    }

    console.log(`[search] fetching:`, url);

    const res = await Widget.http.get(url);
    const html = res.data;
    const $ = Widget.html.load(html);

    const items = [];

    // 使用与 loadListByZone 相同的解析逻辑
    $('li a[href*="/vod/play/id/"], .vodlist_item').each((i, el) => {
      const $el = $(el);
      const href = $el.attr('href') || $el.find('a').attr('href');
      
      // 提取封面
      let poster = $el.find('img.lazy').attr('data-original') || 
                   $el.find('img').attr('data-original') || 
                   $el.find('img').attr('src');

      let title = $el.find('.title, .vodlist_title').text().trim() || 
                  $el.find('img').attr('alt') || 
                  $el.find('img').attr('title') ||
                  $el.text().trim().split('\n')[0];

      if (href && title) {
        const idMatch = href.match(/id\/(\d+)/);
        const vid = idMatch ? idMatch[1] : href;
        const cleanLink = href.startsWith('http') ? href : `https://avbang.cyou${href}`;
        const linkWithPoster = poster ? `${cleanLink}?poster=${encodeURIComponent(poster)}` : cleanLink;
        items.push({
          id: vid,
          type: "url",
          mediaType: "movie",
          title: title.replace(/\s+/g, ' ').trim(),
          link: linkWithPoster,
          backdropPath: poster ? poster : "",
          posterPath: poster ? poster : "",
        });
      }
    });

    console.log(`[search] 获取到 ${items.length} 条`);
    return items;
  } catch (error) {
    console.error("[search] 失败:", error.message);
    throw error;
  }
}