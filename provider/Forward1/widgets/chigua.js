WidgetMetadata = {
  id: "chigua",
  title: "吃瓜合集",
  version: "1.1.2",
  requiredVersion: "0.0.1",
  description: "多站点吃瓜聚合 - 支持每日大赛/51吃瓜/91吃瓜/911爆料网 (支持多视频播放列表显示)",
  author: "AiKuai",
  site: "https://github.com/InchStudio/ForwardWidgets",
  detailCacheDuration: 1800,
  globalParams: [
    {
      name: "coverProxy",
      title: "封面代理",
      type: "input",
      value: "https://bagua-cover-proxy.dingyong1024.workers.dev",
      placeholders: [
        {title: "地址1",value: "https://bagua-cover-proxy.dingyong1024.workers.dev"},//先白嫖廿二日的，哈哈哈哈，建议搭建自己的CF Worker解密代理
      ]
    }
  ],
  modules: [
    {
      id: "loadCategoryList_mrds",
      title: "每日大赛 (mrds66)",
      functionName: "loadCategoryList_mrds",
      cacheDuration: 1800,
      params: [
        {
          name: "sort_by",
          title: "分类",
          type: "enumeration",
          enumOptions: [
            { title: "今日吃瓜", value: "mrds" },
            { title: "世界杯区", value: "sjbq" },
            { title: "主题大赛", value: "ztds" },
            { title: "热搜吃瓜", value: "rstt" },
            { title: "校园学生", value: "xazd" },
            { title: "必撸大赛", value: "blyp" },
            { title: "反差泄密", value: "fctg" },
            { title: "网红黑料", value: "mhds" },
            { title: "猎奇重口", value: "lqdp" },
            { title: "AV看片", value: "jdsj" },
            { title: "明星大赛", value: "mxwh" },
            { title: "动漫之家", value: "smdh" },
            { title: "影视国漫", value: "dypd" },
            { title: "cos写真", value: "mtds" },
            { title: "声控ASMR", value: "ysds" },
            { title: "寸止挑战", value: "czds" },
            { title: "混剪PMV", value: "hjds" },
            { title: "原创投稿", value: "tgds" },
            { title: "欧美精品", value: "omjp" },
            { title: "全网参赛", value: "qwcs" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadCategoryList_51cg",
      title: "51吃瓜 (51cg1)",
      functionName: "loadCategoryList_51cg",
      cacheDuration: 1800,
      params: [
        {
          name: "sort_by",
          title: "分类",
          type: "enumeration",
          enumOptions: [
            { title: "今日吃瓜", value: "wpcz" },
            { title: "网红黑料", value: "whhl" },
            { title: "热门大瓜", value: "rdsj" },
            { title: "必看大瓜", value: "bkdg" },
            { title: "学生校园", value: "xsxy" },
            { title: "海外吃瓜", value: "hwcg" },
            { title: "伦理道德", value: "lldd" },
            { title: "探花精选", value: "thjx" },
            { title: "看片娱乐", value: "ysyl" },
            { title: "每日大赛", value: "mrds" },
            { title: "明星黑料", value: "whmx" },
            { title: "网黄合集", value: "whhj" },
            { title: "骚男骚女", value: "snsn" },
            { title: "国产剧情", value: "gcjq" },
            { title: "擦边撩骚", value: "dcbq" },
            { title: "吃瓜看戏", value: "qubk" },
            { title: "人人吃瓜", value: "rrcg" },
            { title: "51涨知识", value: "zzs" },
            { title: "领导干部", value: "ldcg" },
            { title: "吃瓜新闻", value: "cgxw" },
            { title: "51剧场", value: "51djc" },
            { title: "免费短剧", value: "cbdj" },
            { title: "51品茶", value: "51by" },
            { title: "51原创", value: "yczq" },
            { title: "世界杯专栏", value: "sjb" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadCategoryList_91cg",
      title: "91吃瓜 (91cg1)",
      functionName: "loadCategoryList_91cg",
      cacheDuration: 1800,
      params: [
        {
          name: "sort_by",
          title: "分类",
          type: "enumeration",
          enumOptions: [
            { title: "今日吃瓜", value: "zxcghl" },
            { title: "美加墨世界杯", value: "mjmsjb" },
            { title: "最高点击", value: "rsdg" },
            { title: "必吃大瓜", value: "bcdg" },
            { title: "每日大赛", value: "mrds" },
            { title: "师生专栏", value: "xsjlb" },
            { title: "自拍偷拍", value: "zptp" },
            { title: "深夜撸片", value: "lpsd" },
            { title: "海角乱伦", value: "hjll" },
            { title: "网红黑料", value: "whhl" },
            { title: "反差靓女", value: "fclv" },
            { title: "91探花", value: "91th" },
            { title: "网黄合集", value: "gcwh" },
            { title: "明星AI", value: "aikj" },
            { title: "明星黑料", value: "mxhl" },
            { title: "成人动漫", value: "crdm" },
            { title: "擦边短剧", value: "dydj" },
            { title: "猎奇重口", value: "lqzk" },
            { title: "社会奇闻", value: "qwys" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    // ========== 新增 911爆料网 模块 ==========
    {
      id: "loadCategoryList_911",
      title: "911爆料网",
      functionName: "loadCategoryList_911",
      cacheDuration: 1800,
      params: [
        {
          name: "sort_by",
          title: "分类",
          type: "enumeration",
          enumOptions: [
            { title: "今日大瓜", value: "jrgb" },
            { title: "世界杯黑料", value: "mjmsjb" },
            { title: "世界杯宝贝", value: "zqbb" },
            { title: "独家爆料", value: "rmgb" },
            /* { title: "黑料排行", value: "rlph" }, */
            { title: "热点吃瓜", value: "ssdbl" },
            { title: "校园吃瓜", value: "xyss" },
            { title: "反差爆料", value: "bgzq" },
            { title: "网红黑料", value: "whbl" },
            { title: "明星吃瓜", value: "mxhl" },
            { title: "每日大赛", value: "mrds" },
            { title: "海角社区", value: "hjsq" },
            { title: "午夜剧场", value: "crfys" },
            { title: "动漫天堂", value: "dmhv" },
            { title: "影视床戏", value: "slec" },
            { title: "看片专辑", value: "kpzj" },
            { title: "猎奇吃瓜", value: "blqw" },
            { title: "偷窥泄密", value: "tksm" },
            { title: "SM专区", value: "zksr" },
            { title: "女同拉拉", value: "ntll" },
            { title: "探花经典", value: "thjx" },
            { title: "福利视频", value: "fljq" },
            { title: "网黄专辑", value: "crlz" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    }
    // ========== 新增结束 ==========
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

// ===================== 站点配置 =====================
const SITES = {
  mrds: {
    baseUrl: 'https://www.mrds66.com',
    name: 'mrds',
    categoryPrefix: 'mrds:'
  },
  '51cg': {
    baseUrl: 'https://51cg1.com',
    name: '51cg',
    categoryPrefix: 'hl:'
  },
  '91cg': {
    baseUrl: 'https://91cg1.com',
    name: '91cg',
    categoryPrefix: 'hl:'
  },
  // ========== 新增 911 站点 ==========
  '911': {
    baseUrl: 'https://911bl.com', 
    name: '911',
    categoryPrefix: 'category/'
  }
};

// 默认请求头
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
  'Referer': 'https://www.mrds66.com/'
};

// ===================== 工具函数：代理图片 =====================
function proxyImageUrl(url, proxy) {
  if (!proxy || !url) return url;
  if (url.startsWith(proxy)) return url;
  return proxy + '?url=' + encodeURIComponent(url);
}

// ===================== 公共解析函数 =====================
function parsePostToItem(articleHtml, baseUrl, siteKey, coverProxy) {
  try {
    // 提取链接
    let linkMatch = articleHtml.match(/href="(\/archives\/\d+\/)"/);
    if (!linkMatch) {
      linkMatch = articleHtml.match(/<a\b[^>]*href=["']([^"']*\/archives\/[^"']+)["'][^>]*>/i);
    }
    if (!linkMatch) return null;
    const link = linkMatch[1];
    const idMatch = link.match(/\/archives\/(\d+)\//);
    const id = idMatch ? idMatch[1] : '';

    // 标题
    let titleMatch = articleHtml.match(/<h2[^>]*class="post-card-title"[^>]*>([^<]*)<\/h2>/);
    if (!titleMatch) {
      titleMatch = articleHtml.match(/<meta\b[^>]*itemprop=["']headline["'][^>]*content=["']([^"']+)["']/i);
    }
    const title = titleMatch ? titleMatch[1].trim() : '';

    // 封面
    let backdropPath = '';
    const imgMatch = articleHtml.match(/loadBannerDirect\('([^']+)'/);
    if (imgMatch) {
      backdropPath = imgMatch[1];
    } else {
      const dataImgMatch = articleHtml.match(/data-xkrkllgl="([^"]+)"/);
      if (dataImgMatch) backdropPath = dataImgMatch[1];
    }
    if (backdropPath) {
      if (backdropPath.startsWith('//')) backdropPath = 'https:' + backdropPath;
      else if (backdropPath.startsWith('/')) backdropPath = baseUrl + backdropPath;
      if (coverProxy) {
        backdropPath = proxyImageUrl(backdropPath, coverProxy);
      }
    }

    // 日期
    let releaseDate = '';
    const dateMatch = articleHtml.match(/itemprop="datePublished" content="([^"]+)"/);
    if (dateMatch) releaseDate = dateMatch[1].split('T')[0];

    if (!id || !title) return null;

    // 构建 link（hl: 格式）
    const linkData = {
      url: link.startsWith('http') ? link : baseUrl + link,
      baseUrl: baseUrl,
      site: siteKey,
      title: title,
      sourceBackdrop: backdropPath,
      coverProxy: coverProxy
    };
    const encodedLink = 'hl:' + JSON.stringify(linkData);

    return {
      id: id,
      type: "url",
      title: title,
      backdropPath: backdropPath,
	  //posterPath: backdropPath, //搜索显示封面的关键，但是加了这个分类浏览就会变成一行3个
      description: '',
      releaseDate: releaseDate,
      link: encodedLink
    };
  } catch (e) {
    return null;
  }
}

// ===================== 各站点分类加载函数 =====================
async function loadCategoryList_mrds(params = {}) {
  return loadCategoryListGeneric(params, 'mrds');
}
async function loadCategoryList_51cg(params = {}) {
  return loadCategoryListGeneric(params, '51cg');
}
async function loadCategoryList_91cg(params = {}) {
  return loadCategoryListGeneric(params, '91cg');
}
// ========== 新增 911 加载函数 ==========
async function loadCategoryList_911(params = {}) {
  return loadCategoryListGeneric(params, '911');
}

async function loadCategoryListGeneric(params, siteKey) {
  try {
    const site = SITES[siteKey];
    if (!site) return [];
    const categoryId = params.sort_by || 'wpcz';
    const pg = Number(params.page || 1);
    const url = `${site.baseUrl}/category/${categoryId}/${pg > 1 ? pg + '/' : ''}`;
    const res = await Widget.http.get(url, { headers: HEADERS });
    const html = res.data || '';
    const items = [];
    const articleRegex = /<article[^>]*itemscope[^>]*>([\s\S]*?)<\/article>/g;
    let match;

    let coverProxy = params.coverProxy || '';
    if (!coverProxy && Widget.globalParams && Widget.globalParams.coverProxy) {
      coverProxy = Widget.globalParams.coverProxy;
    }

    while ((match = articleRegex.exec(html)) !== null) {
      const articleHtml = match[0];
      if (articleHtml.includes('ad-item') || articleHtml.includes('sponsored')) continue;
      const item = parsePostToItem(articleHtml, site.baseUrl, siteKey, coverProxy);
      if (item) items.push(item);
    }
    return items;
  } catch (e) {
    return [];
  }
}

// ===================== 搜索 =====================
async function search(params = {}) {
  try {
    const kw = params.keyword || "";
    const pg = Number(params.page || 1);
    if (!kw) return [];

    let coverProxy = params.coverProxy || '';
    if (!coverProxy && Widget.globalParams && Widget.globalParams.coverProxy) {
      coverProxy = Widget.globalParams.coverProxy;
    }

    const allItems = [];
    const seen = new Set();

    for (const [siteKey, site] of Object.entries(SITES)) {
      const url = `${site.baseUrl}/search/${encodeURIComponent(kw)}/${pg > 1 ? pg + '/' : ''}`;
      try {
        const res = await Widget.http.get(url, { headers: HEADERS });
        const html = res.data || '';
        const articleRegex = /<article[^>]*itemscope[^>]*>([\s\S]*?)<\/article>/g;
        let match;
        while ((match = articleRegex.exec(html)) !== null) {
          const articleHtml = match[0];
          if (articleHtml.includes('ad-item') || articleHtml.includes('sponsored')) continue;
          const item = parsePostToItem(articleHtml, site.baseUrl, siteKey, coverProxy);
          if (item) {
            let realUrl = '';
            if (item.link && item.link.startsWith('hl:')) {
              try {
                const decoded = JSON.parse(item.link.slice(3));
                realUrl = decoded.url || '';
              } catch (e) {}
            }
            const key = realUrl || item.id + siteKey;
            if (!seen.has(key)) {
              seen.add(key);
              allItems.push(item);
            }
          }
        }
      } catch (e) {
        // 单个站点搜索失败忽略
      }
    }
    return allItems;
  } catch (e) {
    return [];
  }
}

// ===================== 详情加载（保持不变） =====================
async function loadDetail(link) {
  if (!link) return null;

  let decoded = null;
  if (typeof link === 'string' && link.startsWith('hl:')) {
    try {
      decoded = JSON.parse(link.slice(3));
    } catch (e) {}
  }
  if (!decoded) {
    if (typeof link === 'string' && link.startsWith('mrds:')) {
      const parts = link.split(':')[1].split('|');
      const postId = parts[0];
      const title = decodeURIComponent(parts[1] || '');
      decoded = {
        url: `${SITES.mrds.baseUrl}/archives/${postId}/`,
        baseUrl: SITES.mrds.baseUrl,
        site: 'mrds',
        title: title
      };
    } else {
      return null;
    }
  }

  const url = decoded.url;
  const baseUrl = decoded.baseUrl || SITES.mrds.baseUrl;
  const siteKey = decoded.site || 'mrds';
  const titleFallback = decoded.title || '';
  let coverProxy = decoded.coverProxy || '';
  if (!coverProxy && Widget.globalParams && Widget.globalParams.coverProxy) {
    coverProxy = Widget.globalParams.coverProxy;
  }

  try {
    const res = await Widget.http.get(url, { headers: HEADERS });
    const html = res.data || '';

    function getProxyUrl(imgUrl) {
      if (!imgUrl) return '';
      if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
      else if (imgUrl.startsWith('/')) imgUrl = baseUrl + imgUrl;
      return proxyImageUrl(imgUrl, coverProxy);
    }

    let articleCover = '';
    const ogImageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
    if (ogImageMatch) articleCover = getProxyUrl(ogImageMatch[1]);
    if (!articleCover) {
      const itempropMatch = html.match(/<meta\s+itemprop="image"\s+content="([^"]+)"/i);
      if (itempropMatch) articleCover = getProxyUrl(itempropMatch[1]);
    }
    if (!articleCover && decoded.sourceBackdrop) {
      articleCover = decoded.sourceBackdrop;
    }

    let title = html.match(/<h1[^>]*class="post-title"[^>]*>([\s\S]*?)<\/h1>/i);
    if (title) title = title[1].trim();
    else title = titleFallback;

    let content = '';
    const contentMatch = html.match(/<div class="post-content">([\s\S]*?)<\/div>/);
    if (contentMatch) {
      content = contentMatch[1]
        .replace(/<script[^>]*>[\s\S]*?<\/script>/g, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/g, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 500);
    }

    const images = [];
    const imgRegex = /data-xkrkllgl="([^"]+)"/g;
    let imgMatch;
    while ((imgMatch = imgRegex.exec(html)) !== null) {
      let imgUrl = getProxyUrl(imgMatch[1]);
      if (imgUrl && !images.includes(imgUrl)) images.push(imgUrl);
    }
    if (images.length === 0 && articleCover) images.push(articleCover);

    const videoItems = [];
    const dplayerRegex = /<div[^>]*class="dplayer"[^>]*data-config='([^']+)'/g;
    let dplayerMatch;
    let videoIndex = 0;
    while ((dplayerMatch = dplayerRegex.exec(html)) !== null) {
      try {
        const configStr = dplayerMatch[1];
        const cleanConfig = configStr
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/\\\//g, '/');
        const config = JSON.parse(cleanConfig);
        if (config.video && config.video.url) {
          const videoUrl = config.video.url;
          let poster = decoded.sourceBackdrop || articleCover;
          const videoTitle = config.video_title || `视频${videoIndex + 1}`;
          videoItems.push({
            id: `video-${videoIndex}`,
            type: "url",
            title: videoTitle,
            videoUrl: videoUrl,
            backdropPath: poster,
            playerType: "app",
            link: videoUrl
          });
          videoIndex++;
        }
      } catch (e) {}
    }

    if (videoItems.length === 0) {
      const videoRegex = /(https?:\/\/[^\s"<>]+\.(m3u8|mp4)[^\s"<>]*)/gi;
      let vMatch;
      while ((vMatch = videoRegex.exec(html)) !== null) {
        const vUrl = vMatch[1];
        if (vUrl.includes('ads') || vUrl.includes('advertisement')) continue;
        videoItems.push({
          id: `video-${videoItems.length}`,
          type: "url",
          title: `视频${videoItems.length + 1}`,
          videoUrl: vUrl,
          backdropPath: decoded.sourceBackdrop || articleCover,
          playerType: "app",
          link: vUrl
        });
      }
    }

    const result = {
      id: decoded.id || (url.match(/\/archives\/(\d+)\//) ? RegExp.$1 : ''),
      type: "url",
      title: title,
      backdropPath: articleCover || (images.length > 0 ? images[0] : ''),
      description: content,
      backdropPaths: images.slice(0, 5),
      videoUrl: videoItems.length === 1 ? videoItems[0].videoUrl : undefined,
      playerType: videoItems.length === 1 ? "app" : undefined,
	  backdropPath: decoded.sourceBackdrop || articleCover,
      episodeItems: videoItems.length > 1 ? videoItems : (videoItems.length === 0 ? [{
        id: 'web-view',
        type: "url",
        title: "网页查看",
        link: url,
        backdropPath: articleCover || (images.length > 0 ? images[0] : '')
      }] : undefined),
      link: link
    };
    return result;
  } catch (e) {
    return null;
  }
}