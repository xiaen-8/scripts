// @ts-check
/** @type {WidgetMetadata} */
WidgetMetadata = {
  id: "forward.spankbang",
  title: "SpankBang",
  version: "1.0.1",
  requiredVersion: "0.0.1",
  description: "SpankBang 免费色情视频 - 热门/标签/搜索/详情/播放",
  author: "Minis",
  site: "https://spankbang.com",
  detailCacheDuration: 300,
  modules: [
    {
      id: "trending",
      title: "热门视频",
      functionName: "loadTrending",
      type: "video",
      requiresWebView: true,
      cacheDuration: 600,
      params: [{ name: "page", title: "页码", type: "page" }],
    },
    {
      id: "tagBrowse",
      title: "标签浏览",
      functionName: "loadTag",
      type: "video",
      requiresWebView: true,
      cacheDuration: 600,
      params: [
        { name: "tag", title: "标签", type: "input", value: "milf",
          placeholders: [
            { title: "MILF", value: "milf" }, { title: "Blowjob", value: "blowjob" },
            { title: "Japanese", value: "japanese" }, { title: "Asian", value: "asian" },
            { title: "Anal", value: "anal" }, { title: "Creampie", value: "creampie" },
            { title: "Big Tits", value: "big-tits" }, { title: "Lesbian", value: "lesbian" },
            { title: "Amateur", value: "amateur" }, { title: "Teen (18+)", value: "teen" },
            { title: "Gangbang", value: "gangbang" }, { title: "Squirt", value: "squirt" },
            { title: "Verified Creators", value: "verified+creators" },
            { title: "HD", value: "hd" }, { title: "4K", value: "uhd" },
          ],
        },
        { name: "sort_by", title: "排序", type: "enumeration", value: "trending",
          enumOptions: [
            { title: "热门 (Trending)", value: "trending" },
            { title: "最新 (New)", value: "new" },
            { title: "最受欢迎 (Popular)", value: "popular" },
            { title: "精选 (Featured)", value: "featured" },
          ],
        },
        { name: "page", title: "页码", type: "page" },
      ],
    },
  ],
  search: {
    title: "搜索 SpankBang",
    functionName: "search",
    params: [
      { name: "keyword", title: "关键词", type: "input" },
      { name: "sort_by", title: "排序", type: "enumeration", value: "trending",
        enumOptions: [
          { title: "热门 (Trending)", value: "trending" },
          { title: "最新 (New)", value: "new" },
          { title: "最受欢迎 (Popular)", value: "popular" },
          { title: "精选 (Featured)", value: "featured" },
        ],
      },
      { name: "page", title: "页码", type: "page" },
    ],
  },
};

const SITE = "https://spankbang.com";
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const HDR = { "User-Agent": UA, Accept: "text/html,application/xhtml+xml", Referer: SITE + "/", "Accept-Language": "zh-CN,zh-Hans;q=0.9,zh;q=0.8,en;q=0.7" };

const normUrl = u => !u ? "" : /^https?:\/\//i.test(u) ? u : u.startsWith("//") ? "https:" + u : u.startsWith("/") ? SITE + u : SITE + "/" + u;
const normPage = p => { const n = Number(p); return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1; };
const clean = t => String(t || "").replace(/<[^>]*>/g, " ").replace(/&amp;|&#39;|&quot;|&lt;|&gt;/g, "").replace(/\s+/g, " ").trim();
const parseViews = s => { if (!s) return 0; const m = String(s).match(/^([\d.]+)\s*([KM]?)$/i); if (!m) return 0; const n = parseFloat(m[1]), u = m[2].toUpperCase(); return u === "K" ? Math.round(n * 1000) : u === "M" ? Math.round(n * 1000000) : Math.round(n); };
const parseRating = s => { if (!s) return 0; const m = String(s).match(/(\d+)%/); return m ? parseFloat(m[1]) : 0; };

/** 从一个 video-item HTML 块中解析视频条目 */
function parseBlock(block) {
  const href = block.match(/<a[^>]*href=["'](\/[^"']*\/video\/[^"']*)["']/);
  if (!href) return null;
  const link = normUrl(href[1]);
  const id = href[1].match(/\/([a-z0-9]+)\/video\//)?.[1] || link;

  let cover = "";
  const img = block.match(/<img[^>]*src=["']([^"']+?)["']/);
  if (img) cover = img[1];
  if (!cover) { const v = block.match(/<video[^>]*poster=["']([^"']+?)["']/); if (v) cover = v[1]; }

  let title = "";
  const tMatch = block.match(/class="[^"]*text-secondary[^"]*text-body-md[^"]*"[^>]*>([^<]+)</);
  if (tMatch) title = clean(tMatch[1]);
  if (!title) { const a = block.match(/title="([^"]+)"/); if (a) title = a[1]; }
  if (!title) title = String(link).split("/").filter(Boolean).pop()?.replace(/[+]/g, " ") || "Unknown";

  const dur = block.match(/data-testid="video-item-length"[^>]*>\s*([^<]+)</);
  const durationText = dur ? clean(dur[1]) : "";

  let rating = 0;
  const vMatch = block.match(/data-testid="views"[^>]*>[\s\S]*?md:text-body-md[^>]*>([^<]+)</);
  if (vMatch) rating = parseViews(clean(vMatch[1]));
  const rMatch = block.match(/data-testid="rates"[^>]*>[\s\S]*?md:text-body-md[^>]*>([^<]+)</);
  const ratingScore = rMatch ? parseRating(clean(rMatch[1])) : (rating > 0 && rating <= 100 ? rating : 0);

  return { id, type: "link", title, coverUrl: cover || "", link, rating: ratingScore || undefined, durationText: durationText || undefined };
}

/** 解析 HTML 中所有 video-item，返回 VideoItem[] */
function parseVideoItems(html) {
  const items = [];
  const parts = html.split(/<div[^>]*data-testid="video-item"[^>]*data-id="\d+"[^>]*>/g);
  for (let i = 1; i < parts.length && items.length < 40; i++) {
    let depth = 0, end = -1, pos = 0;
    while (pos < parts[i].length) {
      const openIdx = parts[i].indexOf("<div ", pos);
      const closeIdx = parts[i].indexOf("</div>", pos);
      if (closeIdx < 0) break;
      if (openIdx >= 0 && openIdx < closeIdx) { depth++; pos = openIdx + 5; }
      else { depth--; pos = closeIdx + 6; if (depth < 0) { end = closeIdx + 6; break; } }
    }
    const item = parseBlock(end > 0 ? parts[i].substring(0, end) : parts[i]);
    if (item) items.push(item);
  }
  return items;
}

// ============ 列表 ============

async function loadTrending(p = {}) {
  const page = normPage(p.page || 1);
  const url = page > 1 ? `${SITE}/trending_videos/${page}/` : `${SITE}/trending_videos/`;
  const res = await Widget.http.get(url, { headers: HDR, allow_redirects: true });
  const html = String(res.data || "");
  if (!html) throw new Error("空响应");
  const items = parseVideoItems(html);
  if (!items.length) throw new Error("未解析到视频");
  return items;
}

async function loadTag(p = {}) {
  const tag = (p.tag || "").trim().toLowerCase().replace(/\s+/g, "+") || "milf";
  const page = normPage(p.page || 1);
  const sort = p.sort_by || "trending";
  const qs = sort === "trending" ? "" : `?o=${sort}`;
  const base = `${SITE}/s/${tag}/`;
  const url = page > 1 ? `${base}${page}/${qs}` : `${base}${qs}`;
  const res = await Widget.http.get(url, { headers: HDR, allow_redirects: true });
  const html = String(res.data || "");
  if (!html) throw new Error("空响应");
  const items = parseVideoItems(html);
  if (!items.length) throw new Error("未解析到视频");
  return items;
}

// ============ 搜索 ============

async function search(p = {}) {
  const kw = String(p.keyword || "").trim();
  if (!kw) throw new Error("请输入关键词");
  const page = normPage(p.page || 1);
  const sort = p.sort_by || "trending";
  const qs = sort === "trending" ? "" : `?o=${sort}`;
  const q = encodeURIComponent(kw.replace(/\s+/g, "+"));
  const base = `${SITE}/s/${q}/`;
  const url = page > 1 ? `${base}${page}/${qs}` : `${base}${qs}`;
  const res = await Widget.http.get(url, { headers: HDR, allow_redirects: true });
  const html = String(res.data || "");
  const items = parseVideoItems(html);
  if (!items.length) throw new Error("没有找到结果");
  return items;
}

// ============ 详情 ============

async function loadDetail(link) {
  if (!link) return null;
  const url = normUrl(link);
  if (!url) return null;

  const res = await Widget.http.get(url, { headers: HDR, allow_redirects: true });
  const html = String(res.data || "");
  if (!html) return null;

  let title = "";
  const h1 = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
  if (h1) title = clean(h1[1]);
  if (!title) { const og = html.match(/property=["']og:title["'][^>]*content=["']([^"']+)["']/i); if (og) title = og[1]; }

  const sources = { videoUrl: "", videoSources: [], posterPath: "" };
  const poster = html.match(/poster=["']([^"']+)["']/);
  if (poster) sources.posterPath = poster[1];
  const hls = html.match(/<video[^>]*\ssrc=["']([^"']*master\.m3u8[^"']*)["']/i);
  if (hls) { sources.videoUrl = hls[1]; sources.videoSources.push({ url: hls[1], type: "application/x-mpegURL", label: "Auto" }); }
  const mp4 = html.match(/<source\s+src=["']([^"']*\.mp4[^"']*)["']/i);
  if (mp4) { sources.videoSources.push({ url: mp4[1], type: "video/mp4", label: "MP4" }); if (!sources.videoUrl) sources.videoUrl = mp4[1]; }
  const seen = new Set();
  (html.match(/https:\/\/vdownload-\d+\.sb-cd\.com\/[^"'\s]*(?:1080p|720p|480p|240p)[^"'\s]*\.mp4[^"'\s]*/g) || []).forEach(src => {
    if (seen.has(src)) return; seen.add(src);
    const label = src.includes("1080p") ? "1080P" : src.includes("720p") ? "720P" : src.includes("480p") ? "480P" : src.includes("240p") ? "240P" : "MP4";
    if (!sources.videoSources.some(s => s.url === src)) sources.videoSources.push({ url: src, type: "video/mp4", label });
  });

  let posterPath = sources.posterPath || "";
  if (!posterPath) { const og = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)["']/i); if (og) posterPath = og[1].replace(/w:\d+/, "w:800"); }

  const tags = [];
  (html.match(/<a[^>]*href="\/s\/([^"]+)"[^>]*>([^<]+)<\/a>/g) || []).forEach(m => {
    const t = m.match(/>([^<]+)<\//);
    if (t && t[1].trim().length < 50 && !t[1].includes(" ")) tags.push({ id: t[1].trim().toLowerCase(), title: t[1].trim() });
  });

  const related = parseVideoItems(html).slice(0, 20);

  return {
    id: url, type: "video", title: title || "SpankBang Video", link: url,
    posterPath: posterPath || undefined,
    videoUrl: sources.videoUrl || undefined,
    videoSources: sources.videoSources.length ? sources.videoSources : undefined,
    genreItems: tags.length ? tags.slice(0, 30) : undefined,
    relatedItems: related.length ? related : undefined,
  };
}
