// ============================================================
//  WOW.XXX — 全球付费色情聚合站
//  源站: https://www.wow.xxx / https://www.1porn.tv
//  HTML 静态渲染 + 多分辨率 MP4 直链 (480p/720p/2160p)
//  提取 2160p (4K) 最高清视频
//  支持通过 globalParams.source 切换源站
// ============================================================

WidgetMetadata = {
  id: "forward.wow",
  title: "WOW.4K",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "WOW.XXX — 聚合 Brazzers / BLACKED / Vixen 等顶级付费站的高清视频",
  author: "EL",
  site: "https://www.wow.xxx",
  icon: "https://www.wow.xxx/zh/favicon.ico?v=2.0",
  detailCacheDuration: 60,
  globalParams: [
    {
      name: "source",
      title: "源站",
      type: "enumeration",
      value: "wow.xxx",
      enumOptions: [
        { title: "WOW.XXX", value: "wow.xxx" },
        { title: "1Porn.TV", value: "1porn.tv" }
      ]
    }
  ],
  modules: [
    {
      id: "featured",
      title: "推荐",
      functionName: "loadFeatured",
      cacheDuration: 86400,
      params: []
    },
    {
      id: "hot",
      title: "热门",
      functionName: "loadHot",
      cacheDuration: 86400,
      params: [
        {
          name: "sort_by",
          title: "时间",
          type: "enumeration",
          value: "week",
          enumOptions: [
            { title: "本周", value: "week" },
            { title: "今日", value: "today" },
            { title: "本月", value: "month" },
            { title: "全部", value: "all" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "categories",
      title: "分类浏览",
      functionName: "loadCategory",
      cacheDuration: 86400,
      params: [
        {
          name: "cat",
          title: "选择分类",
          type: "enumeration",
          value: "blowjob",
          enumOptions: [
            { title: "Blowjob", value: "blowjob" },
            { title: "Big Tits", value: "big-tits" },
            { title: "Anal", value: "anal" },
            { title: "MILF", value: "milf" },
            { title: "Teen (18+)", value: "teen" },
            { title: "Interracial", value: "interracial" },
            { title: "Lesbian", value: "lesbian" },
            { title: "Big Ass", value: "big-ass" },
            { title: "Ebony", value: "ebony" },
            { title: "Latina", value: "latina" },
            { title: "Asian", value: "asian" },
            { title: "Japanese", value: "japanese" },
            { title: "Threesome", value: "threesome" },
            { title: "Creampie", value: "creampie" },
            { title: "Gangbang", value: "gangbang" },
            { title: "BDSM", value: "bdsm" },
            { title: "DP", value: "double-penetration" },
            { title: "Cheating", value: "cheating" },
            { title: "Big Dick", value: "big-cock" },
            { title: "Facial", value: "facial" },
            { title: "POV", value: "pov" },
            { title: "Mature", value: "mature" },
            { title: "BBW", value: "bbw" },
            { title: "Hardcore", value: "hardcore" },
            { title: "Cuckold", value: "cuckold" },
            { title: "Squirt", value: "squirt" },
            { title: "Step Mom", value: "stepmom" },
            { title: "Step Sister", value: "stepsister" },
            { title: "Small Tits", value: "small-tits" },
            { title: "Cosplay", value: "cosplay" },
            { title: "Public", value: "public" },
            { title: "Amateur", value: "amateur" },
            { title: "Voyeur", value: "voyeur" },
            { title: "Feet", value: "feet" },
            { title: "Hairy", value: "hairy" },
            { title: "Skinny", value: "skinny" },
            { title: "Tattoo", value: "tattoo" },
            { title: "Outdoor", value: "outdoor" },
            { title: "Massage", value: "massage" },
            { title: "Swingers", value: "swinger" },
            { title: "Orgy", value: "orgy" },
            { title: "Striptease", value: "striptease" },
            { title: "Lingerie", value: "lingerie" },
            { title: "Fetish", value: "fetish" },
            { title: "Old/Young", value: "old-and-young" },
            { title: "Sex Toys", value: "sex-toys" },
            { title: "Deepthroat", value: "deepthroat" },
            { title: "BBC", value: "bbc-big-black-cock" },
            { title: "Shemale", value: "shemale" },
            { title: "Femdom", value: "femdom" },
            { title: "Bukkake", value: "bukkake" },
            { title: "JAV Censored", value: "jav-censored" },
            { title: "JAV Uncensored", value: "jav-uncensored" },
            { title: "VR", value: "vr-virtual-reality" }
          ]
        },
        {
          name: "sort_by",
          title: "排序",
          type: "enumeration",
          value: "post_date",
          enumOptions: [
            { title: "最新", value: "post_date" },
            { title: "最受欢迎", value: "video_viewed" },
            { title: "最高评分", value: "rating" },
            { title: "最相关", value: "ctr" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "networks",
      title: "厂牌",
      functionName: "loadNetwork",
      cacheDuration: 86400,
      params: [
        {
          name: "net",
          title: "选择厂牌",
          type: "enumeration",
          value: "brazzers-com",
          enumOptions: [
            { title: "Brazzers", value: "brazzers-com" },
            { title: "BLACKED", value: "blacked" },
            { title: "TUSHY", value: "tushy-com" },
            { title: "TUSHY RAW", value: "tushy-raw" },
            { title: "VIXEN", value: "vixen" },
            { title: "Deeper", value: "deeper" },
            { title: "Slayed", value: "slayed" },
            { title: "MILFY", value: "milfy" },
            { title: "WIFEY", value: "wifey" },
            { title: "Mofos", value: "mofos" },
            { title: "MYLF", value: "mylf-com" },
            { title: "Team Skeet", value: "teamskeet-com" },
            { title: "Adult Time", value: "adult-time" },
            { title: "Kink", value: "kink-com" },
            { title: "Nubiles Porn", value: "nubiles-porn-com" },
            { title: "FakeHub", value: "fakehub" },
            { title: "BangBros", value: "bangbros" },
            { title: "Reality Kings", value: "rk-com" },
            { title: "Naughty America", value: "naughtyamerica-com" },
            { title: "Jules Jordan", value: "jules-jordan" },
            { title: "Mom Lover", value: "mom-lover" },
            { title: "Oldje", value: "oldje-com" },
            { title: "PornForce", value: "pornforce" },
            { title: "DFXtra (Dogfart)", value: "dogfart-network" },
            { title: "Private", value: "private" },
            { title: "Dorcel Club", value: "dorcel-club" },
            { title: "Wicked", value: "wicked" },
            { title: "GirlsWay", value: "girlsway" }
          ]
        },
        {
          name: "sort_by",
          title: "排序",
          type: "enumeration",
          value: "video_viewed",
          enumOptions: [
            { title: "最受欢迎", value: "video_viewed" },
            { title: "最新", value: "post_date" },
            { title: "最高评分", value: "rating" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "models",
      title: "模特",
      functionName: "loadModel",
      cacheDuration: 86400,
      params: [
        {
          name: "model",
          title: "选择模特",
          type: "enumeration",
          value: "angela-white",
          enumOptions: [
            { title: "Angela White", value: "angela-white" },
            { title: "Abella Danger", value: "abella-danger" },
            { title: "Adriana Chechik", value: "adriana-chechik" },
            { title: "Alexis Fawx", value: "alexis-fawx" },
            { title: "Ava Addams", value: "ava-addams" },
            { title: "Blake Blossom", value: "blake-blossom" },
            { title: "Brandi Love", value: "brandi-love" },
            { title: "Cherie Deville", value: "cherie-deville" },
            { title: "Cory Chase", value: "cory-chase" },
            { title: "Dani Daniels", value: "dani-daniels" },
            { title: "Emily Willis", value: "emily-willis" },
            { title: "Eva Elfie", value: "eva-elfie" },
            { title: "Gianna Dior", value: "gianna-dior" },
            { title: "Isiah Maxwell", value: "isiah-maxwell" },
            { title: "Jia Lissa", value: "jia-lissa" },
            { title: "Jordi El Nino Polla", value: "jordi-el-nino-polla" },
            { title: "Kazumi", value: "kazumi" },
            { title: "Kendra Sunderland", value: "kendra-sunderland" },
            { title: "Kenzie Reeves", value: "kenzie-reeves" },
            { title: "Lana Rhoades", value: "lana-rhoades" },
            { title: "Lena Paul", value: "lena-paul" },
            { title: "Lexi Luna", value: "lexi-luna" },
            { title: "Mia Malkova", value: "mia-malkova" },
            { title: "Monica Moon", value: "monica-moon" },
            { title: "Natasha Nice", value: "natasha-nice" },
            { title: "Nicole Aniston", value: "nicole-aniston" },
            { title: "Rae Lil Black", value: "rae-lil-black" },
            { title: "Reagan Foxx", value: "reagan-foxx" },
            { title: "Riley Reid", value: "riley-reid" },
            { title: "Savannah Bond", value: "savannah-bond" },
            { title: "Scarlit Scandal", value: "scarlit-scandal" },
            { title: "Valentina Nappi", value: "valentina-nappi" },
            { title: "Vanna Bardot", value: "vanna-bardot" },
            { title: "Vicki Chase", value: "vicki-chase" },
            { title: "Violet Myers", value: "violet-myers" },
          ]
        },
        {
          name: "sort_by",
          title: "排序",
          type: "enumeration",
          value: "video_viewed",
          enumOptions: [
            { title: "最受欢迎", value: "video_viewed" },
            { title: "最新", value: "post_date" },
            { title: "最高评分", value: "rating" }
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

const LANG = '/zh';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

function getBase(source) {
  return 'https://www.' + (source || 'wow.xxx');
}

function fixUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return 'https://www.wow.xxx' + url;
}

// ---- 浏览列表页（含排序/时间/页码） ----
function buildBrowseUrl(sort, period, page, source) {
  page = Number(page) || 1;
  const base = getBase(source);
  if (sort === 'featured') return base + LANG + '/';
  let path;
  switch (sort) {
    case 'top':
      path = LANG + '/top-rated/';
      if (period && period !== 'all') path += period + '/';
      break;
    case 'popular':
      path = LANG + '/most-popular/';
      if (period && period !== 'all') path += period + '/';
      break;
    default:
      path = LANG + '/latest-updates/';
  }
  if (page > 1) path += page + '/';
  return base + path;
}

// ---- 分类网址 ----
function buildCategoryUrl(cat, sort_by, page, source) {
  page = Number(page) || 1;
  const base = getBase(source);
  let path = LANG + '/categories/' + cat + '/';
  switch (sort_by) {
    case 'post_date': path += 'latest-updates/'; break;
    case 'rating':    path += 'top-rated/'; break;
    case 'ctr':       path += 'most-relevant/'; break;
  }
  if (page > 1) path += page + '/';
  return base + path;
}

// ---- 模特网址 ----
function buildModelUrl(model, sort_by, page, source) {
  page = Number(page) || 1;
  const base = getBase(source);
  let path = LANG + '/models/' + model + '/';
  switch (sort_by) {
    case 'post_date': path += 'latest-updates/'; break;
    case 'rating':    path += 'top-rated/'; break;
  }
  if (page > 1) path += page + '/';
  return base + path;
}

// ---- 厂牌网址（部分是子站点，走 /sites/） ----
const NETWORK_SITES = {
  vixen: 'vixen', deeper: 'deeper', milfy: 'milfy', wifey: 'wifey',
  'tushy-raw': 'tushyraw', slayed: 'slayed', mofos: 'mofos',
  'blacked-raw': 'blackedraw', wicked: 'wicked', girlsway: 'girlsway'
};
function buildNetworkUrl(net, sort_by, page, source) {
  page = Number(page) || 1;
  const base = getBase(source);
  const isSite = NETWORK_SITES[net];
  let path = LANG + (isSite ? '/sites/' : '/networks/') + (isSite || net) + '/';
  switch (sort_by) {
    case 'post_date': path += 'latest-updates/'; break;
    case 'rating':    path += 'top-rated/'; break;
  }
  if (page > 1) path += page + '/';
  return base + path;
}

// ---- 搜索网址 ----
function buildSearchUrl(keyword, page, source) {
  page = Number(page) || 1;
  const base = getBase(source);
  let path = LANG + '/search/';
  if (page > 1) path += page + '/';
  path += '?q=' + encodeURIComponent(keyword.trim());
  return base + path;
}

// ---- 解析列表项 ----
function buildItem($el) {
  const link = $el.find('a[href*="/videos/"]').first().attr('href');
  if (!link) return null;
  const title = $el.find('strong.title').first().text().trim() || '';
  const img = $el.find('img.thumb').first();
  let cover = img.attr("data-src") || img.attr("data-original") || img.attr("src") || '';
  const duration = $el.find('span.duration').first().text().trim();
  const rating = $el.find('div.rating').first().text().trim();
  const views = $el.find('div.views').first().text().trim();
  return {
    id: link, type: "url", mediaType: "movie",
    title: title, coverUrl: fixUrl(cover), backdropPath: fixUrl(cover),
    durationText: duration,
    remarks: [rating, views].filter(Boolean).join(' | ') || undefined,
    link: link
  };
}

// ---- 通用列表加载 ----
async function loadList(url) {
  const res = await Widget.http.get(url, { headers: { 'User-Agent': UA } });
  const $ = Widget.html.load(res.data);
  const items = [];
  $('div.item').each((_, el) => {
    const item = buildItem($(el));
    if (item) items.push(item);
  });
  return items;
}

// ---- 详情页路由：peopleId → 模特列表，genreId → 分类列表 ----
function routeDetailParams(params, page, source) {
  const base = getBase(source);
  if (params.peopleId) {
    return loadList(base + LANG + '/models/' + params.peopleId + '/' + (page > 1 ? page + '/' : ''));
  }
  if (params.genreId) {
    return loadList(base + LANG + '/categories/' + params.genreId + '/' + (page > 1 ? page + '/' : ''));
  }
  return null;
}

// ===== 热门 =====
async function loadHot(params = {}) {
  const page = Number(params.page) || 1;
  const source = params.source;
  const routed = routeDetailParams(params, page, source);
  if (routed) return routed;
  return loadList(buildBrowseUrl('popular', params.sort_by || 'week', page, source));
}

// ===== 推荐 =====
async function loadFeatured(params = {}) {
  const page = Number(params.page) || 1;
  const source = params.source;
  const routed = routeDetailParams(params, page, source);
  if (routed) return routed;
  return loadList(getBase(source) + LANG + '/');
}

// ===== 分类 =====
async function loadCategory(params = {}) {
  const page = Number(params.page) || 1;
  const source = params.source;
  const routed = routeDetailParams(params, page, source);
  if (routed) return routed;
  return loadList(buildCategoryUrl(params.cat || 'blowjob', params.sort_by || 'post_date', page, source));
}

// ===== 模特 =====
async function loadModel(params = {}) {
  const page = Number(params.page) || 1;
  const source = params.source;
  const routed = routeDetailParams(params, page, source);
  if (routed) return routed;
  return loadList(buildModelUrl(params.model || 'angela-white', params.sort_by || 'video_viewed', page, source));
}

// ===== 厂牌 =====
async function loadNetwork(params = {}) {
  const page = Number(params.page) || 1;
  const source = params.source;
  const routed = routeDetailParams(params, page, source);
  if (routed) return routed;
  return loadList(buildNetworkUrl(params.net || 'brazzers-com', params.sort_by || 'video_viewed', page, source));
}

// ===== 搜索 =====
async function search(params = {}) {
  const keyword = (params.keyword || '').trim();
  const page = Number(params.page) || 1;
  const source = params.source;
  if (!keyword) {
    const routed = routeDetailParams(params, page, source);
    if (routed) return routed;
    return [];
  }
  const items = await loadList(buildSearchUrl(keyword, page, source));
  return items.map(item => ({ ...item, posterPath: item.coverUrl }));
}

// ===== 详情 =====
async function loadDetail(link) {
  try {
    const source = link.match(/https:\/\/www\.([^/]+)/)?.[1] || 'wow.xxx';
    const res = await Widget.http.get(link, { headers: { 'User-Agent': UA } });
    const html = res.data;
    const $ = Widget.html.load(html);

    const title = $('h1').first().text().trim();

    let videoUrl = '';
    const firstSource = $('video source').first().attr('src');
    if (firstSource) videoUrl = fixUrl(firstSource);

    const poster = $('video').first().attr('poster') || '';
    const cover = fixUrl(poster);

    const siteEl = $('a.btn_sponsor').first();
    const siteName = siteEl.text().trim();
    const siteLink = siteEl.attr('href') || '';

    const genreItems = [];
    $('a.btn_tag[href*="/categories/"]').each((_, el) => {
      const title = $(el).text().trim();
      const href = $(el).attr('href') || '';
      const id = href.match(/\/categories\/([^/]+)/)?.[1] || '';
      if (title && id) genreItems.push({ id: id, title: title });
    });

    const peoples = [];
    $('a.btn_model[href*="/models/"]').each((_, el) => {
      const title = $(el).text().trim();
      const href = $(el).attr('href') || '';
      const id = href.match(/\/models\/([^/]+)/)?.[1] || '';
      if (title && id) peoples.push({ id: id, title: title, role: 'pornstar' });
    });
    if (peoples.length > 0) {
      const seen = {};
      await Promise.all(peoples.filter(p => { if (seen[p.id]) return false; seen[p.id] = true; return true; }).map(async (p) => {
        try {
          const pres = await Widget.http.get(getBase(source) + LANG + '/models/' + p.id + '/', { headers: { 'User-Agent': UA } });
          const p$ = Widget.html.load(pres.data);
          const avatar = p$('img.thumb[src*="contents/models"]').first().attr('src') || '';
          if (avatar) p.avatar = fixUrl(avatar);
        } catch (e) { /* 头像抓取失败不影响详情页 */ }
      }));
    }

    let views = '', likes = '';
    const viewsEl = $('div.views').first();
    if (viewsEl.length) views = viewsEl.text().trim().replace(/\s*次观看\s*/, '');
    const likeCount = $('a.rate-like + span.count').first().text().trim();

    const backdropPaths = [];
    const playerMatch = html.match(/var url = "(https:\/\/img\.\w+\.\w+\/\d+\/\d+\/player\/)"/);
    if (playerMatch) {
      const baseUrl = playerMatch[1];
      for (let i = 1; i <= 100; i += 5) {
        backdropPaths.push(baseUrl + i + '.jpg');
      }
    }

    const descParts = [
      views ? views + ' 次观看' : '',
      likeCount ? '👍 ' + likeCount : '',
      siteName ? '来源: ' + siteName : ''
    ].filter(Boolean);

    return {
      id: link, type: "url", mediaType: "movie",
      title: title, link: link,
      coverUrl: cover, posterPath: cover, backdropPath: cover,
      videoUrl: videoUrl, playerType: 'app',
      backdropPaths: backdropPaths.length > 0 ? backdropPaths : undefined,
      description: descParts.length > 0 ? descParts.join(' | ') : undefined,
      trailers: videoUrl ? [{ url: videoUrl }] : [],
      genreItems: genreItems.length > 0 ? genreItems : undefined,
      peoples: peoples.length > 0 ? peoples : undefined,
      site: siteName ? { name: siteName, link: fixUrl(siteLink) } : undefined
    };
  } catch (error) {
    console.error('[wow.loadDetail] 失败:', error.message || error);
    throw error;
  }
}
