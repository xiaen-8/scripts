// ============================================================
//  YesPorn VIP — 美国高清色情视频站
//  源站: https://yesporn.vip
//  HTML 静态渲染 + MP4 直链
//  仅提取 1080p 最高清视频
// ============================================================

WidgetMetadata = {
  id: "forward.yesporn",
  title: "YesPorn VIP",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "YesPorn VIP — 高清成人视频",
  author: "EL",
  site: "https://yesporn.vip",
  icon: "https://yesporn.vip/favicon.ico",
  detailCacheDuration: 60,
  modules: [
    {
      id: "latest",
      title: "浏览",
      functionName: "loadLatest",
      cacheDuration: 86400,
      params: [
        {
          name: "sort_by",
          title: "排序",
          type: "enumeration",
          value: "post_date",
          enumOptions: [
            { title: "最新", value: "post_date" },
            { title: "最多观看", value: "video_viewed" },
            { title: "最高评分", value: "rating" },
            { title: "最长时长", value: "duration" }
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
            { title: "Brunette", value: "brunette" },
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
            { title: "Threesome", value: "threesome" },
            { title: "Creampie", value: "creampie" },
            { title: "Gangbang", value: "gangbang" },
            { title: "BDSM", value: "bdsm" },
            { title: "DP", value: "dp" },
            { title: "Cheating", value: "cheating" },
            { title: "Big Dick", value: "big-dick" },
            { title: "Facial", value: "facial" },
            { title: "POV", value: "pov" },
            { title: "Mature", value: "mature" },
            { title: "BBW", value: "bbw" },
            { title: "Hardcore", value: "hardcore" },
            { title: "Cuckold", value: "cuckold" },
            { title: "Orgasm", value: "orgasm" },
            { title: "Step Daughter", value: "step-daughter" },
            { title: "Step Mom", value: "stepmom" },
            { title: "Small Tits", value: "small-tits" },
            { title: "Cosplay", value: "cosplay" },
            { title: "Public", value: "public" },
            { title: "Voyeur", value: "voyeur" },
            { title: "Feet", value: "feet" },
            { title: "Hairy Pussy", value: "hairy-pussy" },
            { title: "Skinny", value: "skinny" },
            { title: "Curvy", value: "curvy" },
            { title: "Tattoo", value: "tattoo" },
            { title: "Outdoor", value: "outdoor" },
            { title: "Massage", value: "massage" },
            { title: "Doctor", value: "doctor" },
            { title: "Swingers", value: "swingers" },
            { title: "Orgy", value: "orgy" },
            { title: "Striptease", value: "striptease" },
            { title: "Lingerie", value: "lingerie" },
            { title: "Fetish", value: "fetish" },
            { title: "GILF", value: "gilf" },
            { title: "Japanese", value: "japanese" },
            { title: "Family", value: "family" },
            { title: "Old/Young", value: "oldgoesyoung" },
            { title: "Sex Toys", value: "sex-toys" },
            { title: "Deep Throat", value: "deep-throat" },
            { title: "Shaved Pussy", value: "shaved-pussy" },
            { title: "Car", value: "car" },
            { title: "BBC", value: "bbc" },
            { title: "Step Sister", value: "step-sister" },
            { title: "Uncategorized", value: "uncategorized" }
          ]
        },
        {
          name: "sort_by",
          title: "排序",
          type: "enumeration",
          value: "post_date",
          enumOptions: [
            { title: "最新", value: "post_date" },
            { title: "最多观看", value: "video_viewed" },
            { title: "最高评分", value: "rating" },
            { title: "最长时长", value: "duration" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "channels",
      title: "频道浏览",
      functionName: "loadChannel",
      cacheDuration: 86400,
      params: [
        {
          name: "ch",
          title: "选择频道",
          type: "enumeration",
          value: "brazzers",
          enumOptions: [
            { title: "Brazzers", value: "brazzers" },
            { title: "RealityKings", value: "realitykings" },
            { title: "Vixen", value: "vixen" },
            { title: "Blacked", value: "blacked" },
            { title: "Blacked Raw", value: "blacked-raw" },
            { title: "Tushy", value: "tushy" },
            { title: "Tushy Raw", value: "tushy-raw" },
            { title: "Deeper", value: "deeper" },
            { title: "Slayed", value: "slayed" },
            { title: "Mofos", value: "mofos" },
            { title: "Team Skeet", value: "team-skeet" },
            { title: "BangBros", value: "bangbros" },
            { title: "Naughty America", value: "naughty-america" },
            { title: "DigitalPlayground", value: "digitalplayground" },
            { title: "EvilAngel", value: "evilangel" },
            { title: "PureTaboo", value: "puretaboo" },
            { title: "Jules Jordan", value: "jules-jordan" },
            { title: "Babes", value: "babes" },
            { title: "Wicked", value: "wicked" },
            { title: "21Sextury", value: "21sextury" },
            { title: "AnalVids", value: "analvids" },
            { title: "Girlsway", value: "girlsway" },
            { title: "Bellesa Films", value: "bellesa-films" },
            { title: "DorcelClub", value: "dorcelclub" },
            { title: "FakeHub", value: "fakehub" },
            { title: "Fake Taxi", value: "fake-hostel" },
            { title: "Public Agent", value: "public-agent" },
            { title: "Mom Lover", value: "mom-lover" },
            { title: "MyFamilyPies", value: "my-family-pies" },
            { title: "Family Strokes", value: "family-strokes" },
            { title: "Moms Teach Sex", value: "moms-teach-sex" },
            { title: "Step Siblings Caught", value: "step-siblings-caught" },
            { title: "FreeUse Fantasy", value: "freeuse-fantasy" },
            { title: "OnlyFans", value: "onlyfans" },
            { title: "Popular on Twitter", value: "popular-on-twitter" },
            { title: "SpyFam", value: "spyfam" },
            { title: "LetsDoeIt", value: "letsdoeit" },
            { title: "Reality Junkies", value: "realityjunkies" },
            { title: "PornFidelity", value: "pornfidelity" },
            { title: "Nubiles Porn", value: "nubiles-porn" },
            { title: "Hentaied", value: "hentaied" }
          ]
        },
        {
          name: "sort_by",
          title: "排序",
          type: "enumeration",
          value: "post_date",
          enumOptions: [
            { title: "最新", value: "post_date" },
            { title: "最多观看", value: "video_viewed" },
            { title: "最高评分", value: "rating" },
            { title: "最长时长", value: "duration" }
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
            { title: "Aidra Fox", value: "aidra-fox" },
            { title: "Alexa Grace", value: "alexa-grace" },
            { title: "Alina Lopez", value: "alina-lopez" },
            { title: "Ana Foxxx", value: "ana-foxxx" },
            { title: "Ariana Marie", value: "ariana-marie" },
            { title: "Asa Akira", value: "asa-akira" },
            { title: "August Ames", value: "august-ames" },
            { title: "Ava Addams", value: "ava-addams" },
            { title: "Bailey Brooks", value: "bailey-brooks" },
            { title: "Brandi Love", value: "brandi-love" },
            { title: "Capri Cavalli", value: "capri-cavalli" },
            { title: "Carmen Caliente", value: "carmen-caliente" },
            { title: "Carter Cruise", value: "carter-cruise" },
            { title: "Cherie DeVille", value: "cherie-deville" },
            { title: "Chloe Cherry", value: "chloe-cherry" },
            { title: "Christy Mack", value: "christy-mack" },
            { title: "Dani Daniels", value: "dani-daniels" },
            { title: "Danny D", value: "danny-d" },
            { title: "Eva Lovia", value: "eva-lovia" },
            { title: "Eva Elfie", value: "eva-elfie" },
            { title: "Gianna Dior", value: "gianna-dior" },
            { title: "Gina Valentina", value: "gina-valentina" },
            { title: "Hitomi Tanaka", value: "hitomi-tanaka" },
            { title: "Holly Hendrix", value: "holly-hendrix" },
            { title: "Isiah Maxwell", value: "isiah-maxwell" },
            { title: "Jada Stevens", value: "jada-stevens" },
            { title: "Jasmine Sherni", value: "jasmine-sherni" },
            { title: "Jayden Jaymes", value: "jayden-jaymes" },
            { title: "Jessa Rhodes", value: "jessa-rhodes" },
            { title: "Jia Lissa", value: "jia-lissa" },
            { title: "Jordi El Nino Polla", value: "jordi-el-nino-polla" },
            { title: "Julia Ann", value: "julia-ann" },
            { title: "Karma RX", value: "karma-rx" },
            { title: "Kate England", value: "kate-england" },
            { title: "Kendra Sunderland", value: "kendra-sunderland" },
            { title: "Kenzie Reeves", value: "kenzie-reeves" },
            { title: "Kira Noir", value: "kira-noir" },
            { title: "Lacy Lennon", value: "lacy-lennon" },
            { title: "Lana Rhoades", value: "lana-rhoades" },
            { title: "Lena Paul", value: "lena-paul" },
            { title: "Lexi Lore", value: "lexi-lore" },
            { title: "Little Caprice", value: "little-caprice" },
            { title: "London River", value: "london-river" },
            { title: "Maddy O'Reilly", value: "maddy-oreilly" },
            { title: "Maitland Ward", value: "maitland-ward" },
            { title: "Mandy Muse", value: "mandy-muse" },
            { title: "Manuel Ferrara", value: "manuel-ferrara" },
            { title: "Mia Khalifa", value: "mia-khalifa" },
            { title: "Mia Malkova", value: "mia-malkova" },
            { title: "Mona Azar", value: "mona-azar" },
            { title: "Monica Moon", value: "monica-moon" },
            { title: "Naomi Swann", value: "naomi-swann" },
            { title: "Natalia Starr", value: "natalia-starr" },
            { title: "Nicole Aniston", value: "nicole-aniston" },
            { title: "Nina Elle", value: "nina-elle" },
            { title: "Rachael Cavalli", value: "rachael-cavalli" },
            { title: "Rae Lil Black", value: "rae-lil-black" },
            { title: "Reagan Foxx", value: "reagan-foxx" },
            { title: "Remy LaCroix", value: "remy-lacroix" },
            { title: "Riley Reid", value: "riley-reid" },
            { title: "Rose Carter", value: "rose-carter" },
            { title: "Ryan Smiles", value: "ryan-smiles" },
            { title: "Sara Jay", value: "sara-jay" },
            { title: "Sasha Grey", value: "sasha-grey" },
            { title: "Savannah Bond", value: "savannah-bond" },
            { title: "Scarlit Scandal", value: "scarlit-scandal" },
            { title: "Sera Ryder", value: "sera-ryder" },
            { title: "Seth Gamble", value: "seth-gamble" },
            { title: "Shyla Stylez", value: "shyla-stylez" },
            { title: "Siri Dahl", value: "siri-dahl" },
            { title: "Skyla Novea", value: "skyla-novea" },
            { title: "Sophia Leone", value: "sophia-leone" },
            { title: "Sophia Locke", value: "sophia-locke" },
            { title: "Stella Cox", value: "stella-cox" },
            { title: "Sunny Leone", value: "sunny-leone" },
            { title: "Sybil A", value: "sybil-a" },
            { title: "Tori Black", value: "tori-black" },
            { title: "Valentina Nappi", value: "valentina-nappi" },
            { title: "Vanna Bardot", value: "vanna-bardot" },
            { title: "Veronica Rodriguez", value: "veronica-rodriguez" },
            { title: "Vicki Chase", value: "vicki-chase" },
            { title: "Violet Myers", value: "violet-myers" },
            { title: "Whitney Wright", value: "whitney-wright" },
            { title: "Xev Bellringer", value: "xev-bellringer" },
            { title: "Yhivi", value: "yhivi" },
            { title: "Yasmine Leon", value: "yasmine-leon" }
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

const BASE = 'https://yesporn.vip';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

function fixCover(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return BASE + '/' + url.replace(/^\/+/, '');
}

function addParams(url, params) {
  const sep = url.includes('?') ? '&' : '?';
  const parts = [];
  if (params.sort_by) parts.push('sort_by=' + params.sort_by);
  if (params.page > 1) parts.push('from=' + params.page);
  return parts.length > 0 ? url + sep + parts.join('&') : url;
}

function buildItem($el) {
  const link = $el.find('a[href*="/video/"]').first().attr('href');
  if (!link) return null;
  const title = $el.find('.title').text().trim() || $el.find('img').attr('alt') || '';
  let cover = $el.find('img').attr('data-original') || $el.find('img').attr('src') || '';
  if (cover) cover = cover.replace(/\/\d+x\d+\/\d+\.\w+$/, '/preview.jpg');
  const duration = $el.find('.time').text().trim();
  const views = $el.find('.thumb-item').first().text().trim();
  return {
    id: link, type: "url", mediaType: "movie",
    title: title, backdropPath: fixCover(cover),
    durationText: duration, remarks: views || undefined, link: link
  };
}

async function loadListByUrl(url) {
  const res = await Widget.http.get(url, { headers: { 'User-Agent': UA } });
  const $ = Widget.html.load(res.data);
  const items = [];
  $('.thumb.thumb_rel.item').each((_, el) => {
    const item = buildItem($(el));
    if (item) items.push(item);
  });
  return items;
}

// ---------- 浏览（含排序） ----------
async function loadLatest(params = {}) {
  return loadListByUrl(addParams(`${BASE}/`, {
    sort_by: params.sort_by || 'post_date',
    page: Number(params.page) || 1
  }));
}

// ---------- 分类 ----------
async function loadCategory(params = {}) {
  const page = Number(params.page) || 1;
  if (params.genreId) return loadListByUrl(addParams(`${BASE}/tags/${params.genreId}-0kvzvx/`, { page }));
  return loadListByUrl(addParams(`${BASE}/categories/${params.cat || 'blowjob'}/`, {
    sort_by: params.sort_by || 'post_date', page
  }));
}

// ---------- 频道 ----------
async function loadChannel(params = {}) {
  const page = Number(params.page) || 1;
  if (params.genreId) return loadListByUrl(addParams(`${BASE}/tags/${params.genreId}-0kvzvx/`, { page }));
  return loadListByUrl(addParams(`${BASE}/channels/${params.ch || 'brazzers'}-zk0omd/`, {
    sort_by: params.sort_by || 'post_date', page
  }));
}

// ---------- 模特 ----------
async function loadModel(params = {}) {
  const page = Number(params.page) || 1;
  if (params.peopleId) return loadListByUrl(addParams(`${BASE}/models/${params.peopleId}/`, { page }));
  return loadListByUrl(addParams(`${BASE}/models/${params.model || 'angela-white'}-3lsuxi/`, { page }));
}

// ---------- 搜索 ----------
async function search(params = {}) {
  const page = Number(params.page) || 1;
  if (params.genreId) return loadListByUrl(addParams(`${BASE}/tags/${params.genreId}-0kvzvx/`, { page }));
  const keyword = (params.keyword || '').trim();
  if (!keyword) return [];
  const items = await loadListByUrl(addParams(`${BASE}/search/?q=${encodeURIComponent(keyword)}`, { page }));
  return items.map(item => ({ ...item, posterPath: item.backdropPath }));
}

// ---------- 详情 ----------
async function loadDetail(link) {
  try {
    const res = await Widget.http.get(link, { headers: { 'User-Agent': UA } });
    const html = res.data;
    const $ = Widget.html.load(html);

    const title = $('h1.title').text().trim() || '';

    let duration = '', views = '', date = '';
    const durMatch = html.match(/icon-oclock[^>]*><\/use><\/svg><\/i>\s*([^<]+)</);
    if (durMatch) duration = durMatch[1].trim();
    const viewMatch = html.match(/icon-eye[^>]*><\/use><\/svg><\/i>\s*([\d.]+[kKmM]?)/);
    if (viewMatch) views = viewMatch[1].trim();
    const dateMatch = html.match(/icon-calendar[^>]*><\/use><\/svg><\/i>\s*([^<]+)</);
    if (dateMatch) date = dateMatch[1].trim();

    const uploader = $('a.sub-btn em').text().trim();

    const modelEl = $('a.btn.gold[href*="/models/"]');
    const modelName = modelEl.text().trim();
    const modelLink = modelEl.attr('href') || '';

    const tags = [];
    $('.tags-row a[href*="/tags/"]').each((_, el) => {
      const tag = $(el).text().trim();
      if (tag) tags.push(tag);
    });

    const screenshots = [];
    $('a.screen-img[href*="get_file"]').each((_, el) => {
      const src = $(el).attr('href');
      if (src) screenshots.push(src);
    });

    let videoUrl = '';
    const dlLink = $('a.download-link[href*="format=1080"]').first().attr('href');
    if (dlLink) {
      const vidMatch = dlLink.match(/id=(\d+)/);
      const videoId = vidMatch ? vidMatch[1] : '';
      if (videoId) {
        try {
          const dlRes = await Widget.http.get(
            `${BASE}/view_video_download.php?id=${videoId}&format=1080`,
            { headers: { 'User-Agent': UA } }
          );
          const dlHtml = dlRes.data;
          const gfMatch = dlHtml.match(/https:\/\/yesporn\.vip\/get_file\/[^"'<>]*?_1080p\.mp4[^"'<>]*/);
          if (gfMatch) videoUrl = gfMatch[0].replace(/\?.*$/, '').replace(/\/$/, '');
        } catch (e) {
          console.error('[loadDetail] 下载页:', e.message);
        }
      }
    }
    if (!videoUrl) {
      const fb = html.match(/https:\/\/yesporn\.vip\/get_file\/[^"'<>]*?_1080p\.mp4[^"'<>]*/);
      if (fb) videoUrl = fb[0].replace(/\?.*$/, '').replace(/\/$/, '');
    }

    let cover = '';
    const coverMatch = html.match(/https:\/\/yesnn\.b-cdn\.net[^"'<>]*?preview\.jpg/);
    if (coverMatch) cover = coverMatch[0];
    if (!cover && screenshots.length > 0) {
      const thumbMatch = html.match(/https:\/\/yesnn\.b-cdn\.net[^"'<>]*?\/390x218\/1\.jpg/);
      if (thumbMatch) cover = thumbMatch[0];
    }

    const descParts = [
      duration ? '时长: ' + duration : '',
      views ? views + ' 次观看' : '',
      date ? '日期: ' + date : '',
      uploader ? '上传: ' + uploader : ''
    ].filter(Boolean);
    const description = descParts.join(' | ');

    return {
      id: link, type: "url", mediaType: "movie",
      title: title, link: link,
      coverUrl: fixCover(cover), posterPath: fixCover(cover), backdropPath: fixCover(cover),
      videoUrl: videoUrl,
      durationText: duration, description: description || undefined,
      backdropPaths: screenshots.length > 0 ? screenshots : [fixCover(cover)],
      trailers: videoUrl ? [{ url: videoUrl }] : [],
      genre: tags.length > 0 ? tags : undefined,
      people: modelName ? [{ name: modelName, link: modelLink ? BASE + modelLink : '' }] : undefined
    };
  } catch (error) {
    console.error('[loadDetail] 失败:', error.message || error);
    throw error;
  }
}
