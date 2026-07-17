// Base64 decode for player URL decryption
function libvioBase64Decode(str) {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var lookup = {};
  for (var i = 0; i < 256; i++) lookup[i] = -1;
  for (var i = 0; i < 64; i++) lookup[chars.charCodeAt(i)] = i;

  var c1, c2, c3, c4;
  var i = 0, len = str.length, out = "";
  while (i < len) {
    do { c1 = lookup[str.charCodeAt(i++) & 0xff]; } while (i < len && c1 === -1);
    if (c1 === -1) break;
    do { c2 = lookup[str.charCodeAt(i++) & 0xff]; } while (i < len && c2 === -1);
    if (c2 === -1) break;
    out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
    do { c3 = str.charCodeAt(i++) & 0xff; if (c3 === 61) return out; c3 = lookup[c3]; } while (i < len && c3 === -1);
    if (c3 === -1) break;
    out += String.fromCharCode(((c2 & 0xf) << 4) | ((c3 & 0x3c) >> 2));
    do { c4 = str.charCodeAt(i++) & 0xff; if (c4 === 61) return out; c4 = lookup[c4]; } while (i < len && c4 === -1);
    if (c4 === -1) break;
    out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
  }
  return out;
}

WidgetMetadata = {
  id: "libvio",
  title: "LIBVIO",
  version: "1.0.5",
  requiredVersion: "0.0.1",
  description: "LIBVIO 影视资源 - 剧集/番剧/日韩/欧美",
  author: "EL",
  site: "https://www.libvio.pw",
  icon: "https://www.libvio.pw/favicon.ico",
  detailCacheDuration: 120,
  globalParams: [
    {
      name: "baseURL",
      title: "站点地址",
      type: "input",
      value: "https://www.libvio.pw",
      description: "LIBVIO 当前可用域名，如 https://www.libvio.pw",
    },
  ],
  modules: [
    {
      id: "loadDrama",
      title: "剧集",
      functionName: "loadDrama",
      cacheDuration: 600,
      params: [
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "loadAnime",
      title: "番剧",
      functionName: "loadAnime",
      cacheDuration: 600,
      params: [
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "loadJapanese",
      title: "日韩",
      functionName: "loadJapanese",
      cacheDuration: 600,
      params: [
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "loadAmerican",
      title: "欧美",
      functionName: "loadAmerican",
      cacheDuration: 600,
      params: [
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "loadResource",
      title: "LIBVIO播放源",
      description: "从 LIBVIO 搜索解析播放链接",
      functionName: "loadResource",
      type: "stream",
      cacheDuration: 120,
      params: [],
    },
  ],
  search: {
    title: "搜索",
    functionName: "search",
    params: [
      { name: "keyword", title: "关键词", type: "input" },
      { name: "page", title: "页码", type: "page" },
    ],
  },
};

// ──────── config ────────

var LIBVIO_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var LIBVIO_DEFAULT = "https://www.libvio.pw";

// Mutable base URL — updated by module handlers (which receive globalParams),
// used by loadDetail (which only gets a link string).
var _libvioBase = LIBVIO_DEFAULT;

function getBase(params) {
  var base = (params && params.baseURL) || LIBVIO_DEFAULT;
  base = base.replace(/\/+$/, "");
  _libvioBase = base;
  return base;
}

function headers(base, referer) {
  return {
    "User-Agent": LIBVIO_UA,
    Referer: referer || base + "/",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  };
}

// ──────── helpers ────────

function absURL(base, url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.indexOf("//") === 0) return "https:" + url;
  if (url[0] === "/") return base.replace(/\/+$/, "") + url;
  return base.replace(/\/+$/, "") + "/" + url.replace(/^\/+/, "");
}

function firstMatch(text, re) {
  var m = re.exec(String(text || ""));
  return m ? m[1] : "";
}

function cleanText(text) {
  return String(text || "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, function (_, c) { return String.fromCharCode(Number(c)); })
    .replace(/\s+/g, " ")
    .trim();
}

function numberVal(v, fallback) {
  var n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

// ──────── cloud drive detection ────────

var CLOUD_FROM = ["kuake", "quark", "uc", "baidu", "xunlei", "aliyun", "ali", "tianyi", "quarkpan", "ucpan"];
var CLOUD_DOMAINS = ["pan.quark.cn", "drive.uc.cn", "pan.baidu.com"];

function isCloudSource(from, url) {
  var f = String(from || "").toLowerCase();
  for (var i = 0; i < CLOUD_FROM.length; i++) {
    if (f.indexOf(CLOUD_FROM[i]) >= 0) return true;
  }
  var u = String(url || "");
  for (var j = 0; j < CLOUD_DOMAINS.length; j++) {
    if (u.indexOf(CLOUD_DOMAINS[j]) >= 0) return true;
  }
  return false;
}

// ──────── parse video list from HTML ────────

function parseVodList(base, html) {
  var items = [];
  var $ = Widget.html.load(html);

  $("a.stui-vodlist__thumb").each(function () {
    var href = $(this).attr("href") || "";
    var title = $(this).attr("title") || "";
    var id = firstMatch(href, /\/detail\/(\d+)\.html/i);
    if (!id || !title) return;

    var poster = $(this).attr("data-original") || $(this).attr("src") || "";
    if (poster && !/^https?:\/\//i.test(poster)) poster = absURL(base, poster);

    var remarks = $(this).parent().find("span.pic-text, span.stui-vodlist__text").first().text().trim();

    items.push({
      id: id, type: "url",
      title: title + (remarks ? " " + remarks : ""),
      posterPath: poster, coverUrl: poster,
      link: id,
    });
  });

  if (!items.length) {
    $("ul.stui-vodlist > li, ul.vodlist > li").each(function () {
      var $thumb = $(this).find("a");
      var href = $thumb.attr("href") || "";
      var title = $thumb.attr("title") || $thumb.text().trim();
      var id = firstMatch(href, /\/detail\/(\d+)\.html/i);
      if (!id || !title) return;
      var poster = $(this).find("img").attr("data-original") || $(this).find("img").attr("src") || "";
      var remarks = $(this).find("span.pic-text, span.remarks").first().text().trim();
      items.push({
        id: id, type: "url",
        title: cleanText(title) + (remarks ? " " + remarks : ""),
        posterPath: absURL(base, poster), coverUrl: absURL(base, poster),
        link: id,
      });
    });
  }
  return items;
}

// ──────── resolve play URL from play page HTML ────────

function resolvePlayerUrl(html) {
  var m = String(html || "").match(/player_aaaa\s*=\s*(\{[\s\S]*?\})\s*;?\s*(?:<\/script|$)/i);
  if (!m) return null;
  try {
    var data = JSON.parse(m[1]);
  } catch (e) {
    try { data = eval("(" + m[1] + ")"); } catch (e2) { return null; }
  }
  if (!data || !data.url) return null;

  if (isCloudSource(data.from, data.url)) return null;

  var url = String(data.url);
  var encrypt = Number(data.encrypt || 0);
  if (encrypt === 1) {
    try { url = decodeURIComponent(url); } catch (e) { url = unescape(url); }
  } else if (encrypt === 2) {
    try { url = decodeURIComponent(escape(libvioBase64Decode(url))); } catch (e) { url = libvioBase64Decode(url); }
  }
  if (url.indexOf("//") === 0) url = "https:" + url;
  if (isCloudSource("", url)) return null;
  return url;
}

// ──────── category loaders ────────

function makeCategoryLoader(typeId) {
  return async function (params) {
    try {
      var base = getBase(params);
      var page = numberVal(params.page || 1, 1);
      var url = base + "/type/" + typeId + "-" + page + ".html";
      var res = await Widget.http.get(url, { headers: headers(base) });
      var html = typeof res.data === "string" ? res.data : "";
      if (!html) throw new Error("空响应");
      var items = parseVodList(base, html);
      if (!items.length) throw new Error("未解析到影片");
      return items;
    } catch (error) {
      console.error("[" + typeId + "] 失败:", error.message || error);
      throw error;
    }
  };
}

var loadDrama = makeCategoryLoader(2);
var loadAnime = makeCategoryLoader(4);
var loadJapanese = makeCategoryLoader(15);
var loadAmerican = makeCategoryLoader(16);

// ──────── search ────────

async function search(params) {
  try {
    var base = getBase(params);
    var keyword = String(params.keyword || params.query || "").trim();
    var page = numberVal(params.page || 1, 1);
    if (!keyword) return [];
    var url = base + "/search/" + encodeURIComponent(keyword) + "----------" + page + "---.html";
    var res = await Widget.http.get(url, { headers: headers(base) });
    var html = typeof res.data === "string" ? res.data : "";
    if (!html) return [];
    return parseVodList(base, html);
  } catch (error) {
    console.error("[search] 失败:", error.message || error);
    return [];
  }
}

// ──────── loadDetail ────────

async function loadDetail(link) {
  try {
    if (!link) return null;
    var base = _libvioBase;

    // ── Detect play page links ──
    var playMatch = String(link).match(/(?:^|\/)(w\/\d+-\d+-\d+\.html)/i);
    if (playMatch) {
      var playPath = playMatch[1];
      // Only fetch the play page — skip the detail page fetch for speed
      var playFullUrl = absURL(base, playPath);
      var pRes = await Widget.http.get(playFullUrl, { headers: headers(base) });
      var pHtml = typeof pRes.data === "string" ? pRes.data : "";
      var videoUrl = resolvePlayerUrl(pHtml);
      if (videoUrl) {
        // Extract title from play page or use generic
        var title = cleanText(firstMatch(pHtml, /<h1[^>]*>([\s\S]*?)<\/h1>/i) ||
                              firstMatch(pHtml, /<title>([\s\S]*?)<\/title>/i));
        title = title.replace(/\s*[-_]\s*LIBVIO.*$/i, "").trim() || "播放";
        return { id: playPath, type: "url", title: title, videoUrl: videoUrl, link: playPath };
      }
    }

    // ── Normal detail page ──
    var vodId = String(link).replace(/^\/detail\//, "").replace(/\.html$/, "").trim();
    var detailUrl = base + "/detail/" + vodId + ".html";
    var res = await Widget.http.get(detailUrl, { headers: headers(base) });
    var html = typeof res.data === "string" ? res.data : "";
    if (!html) return null;

    var $ = Widget.html.load(html);

    var title = cleanText($("h1").first().text().trim()) ||
                cleanText(firstMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i));
    title = title.replace(/\s*[-_]\s*LIBVIO.*$/i, "").trim();

    var poster = $(".stui-content__thumb img").attr("data-original") ||
                 $(".stui-content__thumb img").attr("src") || "";
    if (poster && !/^https?:\/\//i.test(poster)) poster = absURL(base, poster);

    var description = cleanText($(".stui-content__desc").first().text().trim()) || "";
    var rating = undefined;
    var ratingText = $(".stui-content__detail .score, .mac_score").first().text().trim();
    if (ratingText) rating = parseFloat(ratingText);

    var yearText = firstMatch(html, /年份[^0-9]*(\d{4})/i) || firstMatch(html, /年代[^0-9]*(\d{4})/i);
    var year = yearText ? numberVal(yearText, undefined) : undefined;
    var genreText = firstMatch(html, /类型[：:]\s*([^<\n]+)/i);
    var genres = genreText ? genreText.split(/[/,，、\s]+/).filter(Boolean) : [];
    var areaText = firstMatch(html, /地区[：:]\s*([^<\n]+)/i);
    var areas = areaText ? areaText.split(/[/,，、\s]+/).filter(Boolean) : [];
    var actorText = firstMatch(html, /主演[：:]\s*([^<\n]+)/i);
    var actors = actorText ? actorText.split(/[/,，、\s]+/).filter(Boolean) : [];
    var remarks = cleanText($(".stui-content__detail p.data:last").text().trim()) ||
                  cleanText(firstMatch(html, /更新[：:]\s*([^<\n]+)/i)) || undefined;

    // ── Parse episode / play links ──
    var episodeItems = [];

    $("ul.stui-content__playlist").first().find("a").each(function () {
      var href = $(this).attr("href") || "";
      var epTitle = $(this).text().trim();
      if (href && epTitle) {
        var epLink = href.replace(/^\//, "");
        episodeItems.push({ id: epLink, type: "url", title: epTitle, link: epLink });
      }
    });

    if (!episodeItems.length) {
      var seen = {};
      $("a[href*='/w/'], a[href*='w/']").each(function () {
        var href = $(this).attr("href") || "";
        var title = $(this).text().trim() || "播放";
        var epLink = href.replace(/^\//, "");
        if (!seen[epLink] && /w\/\d+-\d+-\d+/.test(epLink)) {
          seen[epLink] = true;
          episodeItems.push({ id: epLink, type: "url", title: title, link: epLink });
        }
      });
    }

    var relatedItems = [];
    $("ul.stui-vodlist li a.stui-vodlist__thumb").each(function () {
      var href = $(this).attr("href") || "";
      var relId = firstMatch(href, /\/detail\/(\d+)\.html/i);
      var relTitle = $(this).attr("title") || "";
      if (relId && relTitle && relId !== vodId) {
        var relPoster = $(this).attr("data-original") || $(this).attr("src") || "";
        relatedItems.push({ id: relId, type: "url", title: cleanText(relTitle), posterPath: absURL(base, relPoster), link: relId });
      }
    });

    var result = {
      id: vodId, type: "url",
      title: title + (remarks ? " " + remarks : ""),
      posterPath: poster, coverUrl: poster,
      description: description || undefined, rating: rating, year: year,
      genres: genres.length ? genres : undefined, areas: areas.length ? areas : undefined,
      actors: actors.length ? actors : undefined,
      link: vodId,
    };

    if (episodeItems.length > 0) {
      if (episodeItems.length === 1) {
        try {
          var epPlayUrl = absURL(base, episodeItems[0].link);
          var epRes = await Widget.http.get(epPlayUrl, { headers: headers(base) });
          var epHtml = typeof epRes.data === "string" ? epRes.data : "";
          var videoUrl = resolvePlayerUrl(epHtml);
          if (videoUrl) result.videoUrl = videoUrl;
        } catch (e) { /* ignore */ }
      }
      result.episodeItems = episodeItems;
    }
    if (relatedItems.length > 0) result.relatedItems = relatedItems;

    return result;
  } catch (error) {
    console.error("[loadDetail] 失败:", error.message || error);
    return null;
  }
}

// ──────── loadResource: stream resolver ────────

function stripTitleMeta(text) {
  return String(text || "")
    .replace(/[\(（][^\)）]*[\)）]/g, "")
    .replace(/第[0-9一二三四五六七八九十]+[季部]/g, "")
    .replace(/season\s*\d+/ig, "").replace(/part\s*\d+/ig, "").replace(/\bs\d{1,2}\b/ig, "")
    .trim();
}

function normalizeName(text) {
  return String(text || "")
    .replace(/\s+/g, "")
    .replace(/[：:·・,，.。!！?？\-—_'’"“”()（）\[\]【】」『』]/g, "")
    .toLowerCase();
}

var CN_NUM = { "一":1,"二":2,"三":3,"四":4,"五":5,"六":6,"七":7,"八":8,"九":9,"十":10 };
function cnToNum(s) {
  if (/^\d+$/.test(s)) return parseInt(s,10);
  if (s==="十") return 10;
  if (s.length===2&&s[0]==="十") return 10+(CN_NUM[s[1]]||0);
  if (s.length===2&&s[1]==="十") return (CN_NUM[s[0]]||0)*10;
  return CN_NUM[s]||0;
}

function extractSeason(text) {
  var t = String(text||"");
  var m = t.match(/第\s*([0-9一二三四五六七八九十]+)\s*季/);
  if (m) return cnToNum(m[1]);
  m = t.match(/season\s*(\d+)/i); if (m) return parseInt(m[1],10);
  m = t.match(/\bs(\d{1,2})\b/i); if (m) return parseInt(m[1],10);
  return 0;
}

function scoreMatch(rawTitle, wantBaseNorm, wantSeason) {
  var rawBase = stripTitleMeta(rawTitle);
  var baseNorm = normalizeName(rawBase);
  if (baseNorm === wantBaseNorm) return 300 + (wantSeason && extractSeason(rawTitle)===wantSeason ? 100 : 0);
  if (baseNorm.indexOf(wantBaseNorm) >= 0 || wantBaseNorm.indexOf(baseNorm) >= 0)
    return 150 + (wantSeason && extractSeason(rawTitle)===wantSeason ? 100 : 0);
  return -1;
}

async function searchPage(base, query, page, results, seen, wantBaseNorm, wantSeason, limit) {
  try {
    var url = base + "/search/" + encodeURIComponent(query) + "----------" + page + "---.html";
    var res = await Widget.http.get(url, { headers: headers(base) });
    var html = typeof res.data === "string" ? res.data : "";
    if (!html) return -1;
    var items = parseVodList(base, html);
    for (var i = 0; i < items.length && results.length < limit; i++) {
      if (seen[items[i].id]) continue;
      seen[items[i].id] = true;
      var sc = scoreMatch(items[i].title, wantBaseNorm, wantSeason);
      if (sc >= 0) { items[i]._score = sc; results.push(items[i]); }
    }
    var hasMore = /search\/----------(\d+)---\.html/g;
    var pages = 1, m;
    while ((m = hasMore.exec(html))) pages = Math.max(pages, parseInt(m[1],10));
    return page >= pages ? -1 : page + 1;
  } catch (e) { return -1; }
}

async function loadResource(params) {
  try {
    var base = getBase(params);
    var rawTitle = String(params.seriesName || params.title || "").trim();
    var isMovie = String(params.type || "") === "movie";
    var wantSeason = parseInt(params.season, 10) || 0;
    var wantEpisode = parseInt(params.episode, 10) || 0;

    // ── Fast path: params.link already has the play page URL ──
    // When tapping an episode from the detail page, the App passes
    // the episode item's "link". Use it directly — skip search entirely.
    var linkUrl = String(params.link || params.videoUrl || "").trim();
    var playMatch = linkUrl.match(/(?:^|\/)(w\/\d+-\d+-\d+\.html)/i);
    if (playMatch) {
      var fastPlayUrl = absURL(base, playMatch[1]);
      var fastRes = await Widget.http.get(fastPlayUrl, { headers: headers(base) });
      var fastHtml = typeof fastRes.data === "string" ? fastRes.data : "";
      var fastVideo = resolvePlayerUrl(fastHtml);
      if (fastVideo) {
        var label = isMovie ? "LIBVIO" : "LIBVIO S" + (wantSeason || 1) + "E" + (wantEpisode || "?");
        return [{ name: label, description: rawTitle, url: fastVideo,
                  customHeaders: { "Referer": base + "/", "User-Agent": LIBVIO_UA } }];
      }
      // Fast path failed, fall through to search
    }

    // ── Fallback: search 1 page only ──
    var baseTitle = stripTitleMeta(rawTitle) || rawTitle;
    if (!baseTitle) return [];
    var wantBaseNorm = normalizeName(baseTitle);
    var results = [], seen = {}, limit = 8;

    try { await searchPage(base, baseTitle, 1, results, seen, wantBaseNorm, wantSeason, limit); } catch (e) {}

    if (!results.length) {
      var catIds = isMovie ? ["1"] : ["2", "4", "15", "16"];
      for (var ci = 0; ci < catIds.length && !results.length; ci++) {
        try {
          var cUrl = base + "/type/" + catIds[ci] + "-1.html";
          var cRes = await Widget.http.get(cUrl, { headers: headers(base) });
          var cHtml = typeof cRes.data === "string" ? cRes.data : "";
          if (!cHtml) continue;
          var catItems = parseVodList(base, cHtml);
          for (var ii = 0; ii < catItems.length && results.length < limit; ii++) {
            if (seen[catItems[ii].id]) continue;
            seen[catItems[ii].id] = true;
            var sc = scoreMatch(catItems[ii].title, wantBaseNorm, wantSeason);
            if (sc >= 0) { catItems[ii]._score = sc; results.push(catItems[ii]); }
          }
        } catch (e) {}
      }
    }

    if (!results.length) return [];

    results.sort(function(a,b) { return (b._score||0) - (a._score||0); });
    var best = results[0];

    var dRes = await Widget.http.get(base + "/detail/" + best.id + ".html", { headers: headers(base) });
    var dHtml = typeof dRes.data === "string" ? dRes.data : "";
    if (!dHtml) return [];

    var $ = Widget.html.load(dHtml);
    var episodes = [];

    $("ul.stui-content__playlist").first().find("a").each(function () {
      var href = $(this).attr("href") || "";
      var epText = $(this).text().trim();
      if (href && epText) {
        var epNum = (epText.match(/(\d+)/) || [0,0])[1];
        episodes.push({ link: absURL(base, href), episode: parseInt(epNum,10), title: epText });
      }
    });

    if (!episodes.length) {
      var seen = {};
      $("a[href*='/w/']").each(function () {
        var href = $(this).attr("href") || "";
        if (!seen[href] && /\/w\/\d+-\d+-\d+\.html/.test(href)) {
          seen[href] = true;
          episodes.push({ link: absURL(base, href), episode: 1, title: "播放" });
        }
      });
    }

    if (!episodes.length) return [];

    var target = episodes[0];
    if (!isMovie && wantEpisode > 0) {
      for (var j = 0; j < episodes.length; j++) {
        if (episodes[j].episode === wantEpisode) { target = episodes[j]; break; }
      }
    }

    var pRes = await Widget.http.get(target.link, { headers: headers(base) });
    var pHtml = typeof pRes.data === "string" ? pRes.data : "";
    var videoUrl = resolvePlayerUrl(pHtml);
    if (!videoUrl) return [];

    var label = isMovie ? "LIBVIO" : "LIBVIO S" + (wantSeason || 1) + "E" + (target.episode || "?");
    return [{ name: label, description: best.title, url: videoUrl,
              customHeaders: { "Referer": base + "/", "User-Agent": LIBVIO_UA } }];
  } catch (error) {
    console.error("[loadResource] 失败:", error.message || error);
    return [];
  }
}
