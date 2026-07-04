// Base64 decode for player URL decryption
function base64decode(str) {
  var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
  );
  var c1, c2, c3, c4;
  var i = 0, len = str.length, out = "";
  while (i < len) {
    do { c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff]; } while (i < len && c1 == -1);
    if (c1 == -1) break;
    do { c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff]; } while (i < len && c2 == -1);
    if (c2 == -1) break;
    out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
    do { c3 = str.charCodeAt(i++) & 0xff; if (c3 == 61) return out; c3 = base64DecodeChars[c3]; } while (i < len && c3 == -1);
    if (c3 == -1) break;
    out += String.fromCharCode(((c2 & 0xf) << 4) | ((c3 & 0x3c) >> 2));
    do { c4 = str.charCodeAt(i++) & 0xff; if (c4 == 61) return out; c4 = base64DecodeChars[c4]; } while (i < len && c4 == -1);
    if (c4 == -1) break;
    out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
  }
  return out;
}

WidgetMetadata = {
  id: "girigirilove",
  title: "爱动漫",
  version: "1.3.0",
  requiredVersion: "0.0.1",
  description: "ギリギリ愛动漫 - 高清动漫线上观看",
  author: "EL",
  site: "https://girigirilove.com",
  icon: "https://ani.girigirilove.com/upload/anime.girigirilove.com_.png",
  detailCacheDuration: 120,
  modules: [
    {
      id: "loadLatest",
      title: "最新更新",
      functionName: "loadLatest",
      cacheDuration: 600,
      requiresWebView: false,
      sectionMode: false,
      params: [
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "loadJapanese",
      title: "日番",
      functionName: "loadJapanese",
      cacheDuration: 600,
      requiresWebView: false,
      sectionMode: false,
      params: [
        { name: "page", title: "页码", type: "page" },
        {
          name: "year",
          title: "年份",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "2026", value: "2026" },
            { title: "2025", value: "2025" },
            { title: "2024", value: "2024" },
            { title: "2023", value: "2023" },
            { title: "2022", value: "2022" },
            { title: "2021", value: "2021" },
            { title: "2020", value: "2020" },
            { title: "2019", value: "2019" },
            { title: "2018", value: "2018" },
            { title: "2017", value: "2017" },
            { title: "2016", value: "2016" },
            { title: "2015", value: "2015" },
            { title: "2014", value: "2014" },
            { title: "2013", value: "2013" },
            { title: "2012", value: "2012" },
            { title: "2011", value: "2011" },
            { title: "2010", value: "2010" },
            { title: "2009", value: "2009" },
            { title: "2008", value: "2008" },
            { title: "2007", value: "2007" },
            { title: "2006", value: "2006" },
            { title: "2005", value: "2005" },
            { title: "2004", value: "2004" },
            { title: "2003", value: "2003" },
            { title: "2002", value: "2002" },
            { title: "2001", value: "2001" },
            { title: "2000及以前", value: "2000至90年代" },
          ],
        },
        {
          name: "sort",
          title: "排序",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "最新", value: "" },
            { title: "最热", value: "hot" },
            { title: "评分", value: "score" },
          ],
        },
      ],
    },
    {
      id: "loadMovie",
      title: "剧场版",
      functionName: "loadMovie",
      cacheDuration: 600,
      requiresWebView: false,
      sectionMode: false,
      params: [
        { name: "page", title: "页码", type: "page" },
        {
          name: "year",
          title: "年份",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "2026", value: "2026" },
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
          value: "",
          enumOptions: [
            { title: "最新", value: "" },
            { title: "最热", value: "hot" },
            { title: "评分", value: "score" },
          ],
        },
      ],
    },
    {
      id: "loadAmerican",
      title: "美番",
      functionName: "loadAmerican",
      cacheDuration: 600,
      requiresWebView: false,
      sectionMode: false,
      params: [
        { name: "page", title: "页码", type: "page" },
        {
          name: "year",
          title: "年份",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "2026", value: "2026" },
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
          value: "",
          enumOptions: [
            { title: "最新", value: "" },
            { title: "最热", value: "hot" },
            { title: "评分", value: "score" },
          ],
        },
      ],
    },
    {
      id: "loadResource",
      title: "爱动漫播放源",
      description: "从ギリギリ动漫搜索解析播放链接",
      functionName: "loadResource",
      type: "stream",
      cacheDuration: 120,
      params: [],
    },
  ],
};

var SITE = "https://ani.girigirilove.com";
var UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
var HEADERS = {
  "Referer": SITE + "/",
  "Origin": SITE,
  "User-Agent": UA,
};
var PLAY_HEADERS = {
  "Referer": SITE + "/",
  "Origin": SITE,
  "User-Agent": UA,
};

// Sort mapping to URL param
function sortParam(sort) {
  if (sort === "hot") return "hits";
  if (sort === "score") return "score";
  return "";
}

// Parse anime card list from HTML
function parseCards(html) {
  var items = [];
  var $ = Widget.html.load(html);
  $("a.public-list-exp").each(function () {
    var href = $(this).attr("href") || "";
    var title = $(this).attr("title") || "";
    var id = href.replace(/^\//, "").replace(/\/$/, "");
    if (!id || !title) return;

    var poster = $(this).find("img.gen-movie-img").attr("data-src") || "";
    if (poster && !poster.startsWith("http")) {
      poster = SITE + poster;
    }

    var remarks = $(this).find("span.public-list-prb").text().trim();
    var ratingLabel = $(this).find("span.public-prt").text().trim();

    var description = "";
    var $button = $(this).closest(".public-list-box").find(".public-list-button");
    if ($button.length) {
      description = $button.find(".public-list-subtitle").text().trim();
    }

    items.push({
      id: id,
      type: "url",
      title: title + (remarks ? " " + remarks : ""),
      posterPath: poster,
      coverUrl: poster,
      description: description || undefined,
      link: id,
    });
  });
  return items;
}

// Resolve play URL from play page
function resolvePlayUrl(html) {
  var match = html.match(/player_aaaa=({[\s\S]*?})\s*<\/script>/);
  if (!match) return null;
  try {
    var data = JSON.parse(match[1]);
    if (!data || !data.url) return null;

    var url = data.url;
    if (data.encrypt == 2) {
      url = decodeURIComponent(base64decode(url));
    } else if (data.encrypt == 1) {
      url = unescape(url);
    }

    if (url && url.startsWith("//")) url = "https:" + url;
    return url;
  } catch (e) {
    return null;
  }
}

// Resolve play URL from a play page ID (e.g. "play/XXXX")
async function resolvePlayPage(playId, headers) {
  var playUrl = SITE + "/" + playId + "/";
  var res = await Widget.http.get(playUrl, { headers: headers });
  var html = (res && res.data) || "";
  return resolvePlayUrl(html);
}

async function loadLatest(params) {
  try {
    var page = Number(params.page || 1);
    // 首页展示全部最新更新（忽略 sort 参数，首页无排序）
    var url = SITE + "/";
    if (page > 1) url = SITE + "/show/2--------" + page + "---/";

    var res = await Widget.http.get(url, { headers: HEADERS });
    var html = typeof res.data === "string" ? res.data : "";
    if (!html) throw new Error("空响应");

    var items = parseCards(html);
    if (!items.length) throw new Error("未解析到影片");
    return items;
  } catch (error) {
    console.error("[loadLatest] 失败:", error.message || error);
    throw error;
  }
}

async function loadJapanese(params) {
  try {
    var page = Number(params.page || 1);
    var sort = sortParam(params.sort);
    var year = params.year;
    var url;
    if (year) {
      url = SITE + "/show/2-----------" + year + "/";
    } else {
      url = SITE + "/show/2--" + sort + "------" + page + "---/";
    }    var res = await Widget.http.get(url, { headers: HEADERS });
    var html = typeof res.data === "string" ? res.data : "";
    if (!html) throw new Error("空响应");

    var items = parseCards(html);
    if (!items.length) throw new Error("未解析到影片");
    return items;
  } catch (error) {
    console.error("[loadJapanese] 失败:", error.message || error);
    throw error;
  }
}

async function loadMovie(params) {
  try {
    var page = Number(params.page || 1);
    var sort = sortParam(params.sort);
    var year = params.year;
    var url;
    if (year) {
      url = SITE + "/show/21-----------" + year + "/";
    } else {
      url = SITE + "/show/21--" + sort + "------" + page + "---/";
    }    var res = await Widget.http.get(url, { headers: HEADERS });
    var html = typeof res.data === "string" ? res.data : "";
    if (!html) throw new Error("空响应");

    var items = parseCards(html);
    if (!items.length) throw new Error("未解析到影片");
    return items;
  } catch (error) {
    console.error("[loadMovie] 失败:", error.message || error);
    throw error;
  }
}

async function loadAmerican(params) {
  try {
    var page = Number(params.page || 1);
    var sort = sortParam(params.sort);
    var year = params.year;
    var url;
    if (year) {
      url = SITE + "/show/3-----------" + year + "/";
    } else {
      url = SITE + "/show/3--" + sort + "------" + page + "---/";
    }    var res = await Widget.http.get(url, { headers: HEADERS });
    var html = typeof res.data === "string" ? res.data : "";
    if (!html) throw new Error("空响应");

    var items = parseCards(html);
    if (!items.length) throw new Error("未解析到影片");
    return items;
  } catch (error) {
    console.error("[loadAmerican] 失败:", error.message || error);
    throw error;
  }
}

// ──────── helper: fuzzy title matching ────────

function normalizeName(text) {
  return String(text || "")
    .replace(/\s+/g, "")
    .replace(/[：:·・,，.。!！?？\-—_'’"“”()（）\[\]【】」『』]/g, "")
    .toLowerCase();
}

function stripTitleMeta(text) {
  return String(text || "")
    .replace(/[\(（][^\)）]*[\)）]/g, "")
    .replace(/第[0-9一二三四五六七八九十]+[季部]/g, "")
    .replace(/season\s*\d+/ig, "")
    .replace(/part\s*\d+/ig, "")
    .replace(/\bs\d{1,2}\b/ig, "")
    .trim();
}

const CN_NUM = { "一": 1, "二": 2, "三": 3, "四": 4, "五": 5, "六": 6, "七": 7, "八": 8, "九": 9, "十": 10 };
function cnToNum(s) {
  if (/^\d+$/.test(s)) return parseInt(s, 10);
  if (s === "十") return 10;
  if (s.length === 2 && s[0] === "十") return 10 + (CN_NUM[s[1]] || 0);
  if (s.length === 2 && s[1] === "十") return (CN_NUM[s[0]] || 0) * 10;
  return CN_NUM[s] || 0;
}

function extractSeasonFromText(text) {
  var t = String(text || "");
  var m = t.match(/第\s*([0-9一二三四五六七八九十]+)\s*季/);
  if (m) return cnToNum(m[1]);
  m = t.match(/season\s*(\d+)/i);
  if (m) return parseInt(m[1], 10);
  m = t.match(/part\s*(\d+)/i);
  if (m) return parseInt(m[1], 10);
  m = t.match(/\bs(\d{1,2})\b/i);
  if (m) return parseInt(m[1], 10);
  // Roman numerals: Ⅱ Ⅲ Ⅳ Ⅴ Ⅵ
  var romanMap = { "Ⅱ": 2, "Ⅲ": 3, "Ⅳ": 4, "Ⅴ": 5, "Ⅵ": 6 };
  m = t.match(/([ⅡⅢⅣⅤⅥ])\s*(?:季|部|$)/);
  if (m) return romanMap[m[1]] || null;
  return null;
}

function scoreResult(rawTitle, wantBaseNorm, wantSeason) {
  var rawBase = stripTitleMeta(rawTitle);
  var baseNorm = normalizeName(rawBase);
  var score = 0;

  if (baseNorm === wantBaseNorm) {
    score += 300;
  } else if (baseNorm.indexOf(wantBaseNorm) >= 0 || wantBaseNorm.indexOf(baseNorm) >= 0) {
    score += 150;
  } else {
    return -1;
  }

  // Bonus for season match
  if (wantSeason > 0) {
    var foundSeason = extractSeasonFromText(rawTitle);
    if (foundSeason === wantSeason) score += 100;
  }

  return score;
}

function pickBestResult(wantBaseNorm, wantSeason, animeList) {
  var best = null;
  var bestScore = -1;
  for (var i = 0; i < animeList.length; i++) {
    var it = animeList[i];
    var sc = scoreResult(it.title, wantBaseNorm, wantSeason);
    if (sc > bestScore) {
      bestScore = sc;
      best = it;
    }
  }
  return best;
}

// ──────── search helpers for loadResource ────────
async function scanCategoryForTitle(wantBaseNorm, isMovie, wantSeason, yearParam) {
  // Scan first pages of each relevant category for best matching title
  var maxPages = 3;
  // Movie → only scan 剧场版; TV/unknown → scan 日番 + 美番
  var catIds = isMovie ? ["21"] : ["2", "3"];

  // Try with year filter first; if no match, retry without year
  var attempts = yearParam ? [yearParam, ""] : [""];
  for (var ai = 0; ai < attempts.length; ai++) {
    var year = attempts[ai];
    var best = null;
    var bestScore = -1;

    for (var ci = 0; ci < catIds.length && bestScore < 300; ci++) {
      var pageReqs = [];
      for (var pg = 1; pg <= maxPages; pg++) {
        var url;
        if (year) {
          url = SITE + "/show/" + catIds[ci] + "-----------" + year +"/";
          if (pg > 1) break; // year filter only returns page 1
        } else {
          url = SITE + "/show/" + catIds[ci] + "--------" + pg + "---/";
        }
        pageReqs.push(
          Widget.http.get(url, { headers: HEADERS }).then(function(r) {
            return (r && r.data) || "";
          }).catch(function() { return ""; })
        );
      }
      var pages = await Promise.all(pageReqs);
      for (var pi = 0; pi < pages.length && bestScore < 300; pi++) {
        var h = pages[pi];
        if (!h) continue;
        var items = parseCards(h);
        for (var ii = 0; ii < items.length; ii++) {
          var sc = scoreResult(items[ii].title, wantBaseNorm, wantSeason);
          if (sc > bestScore) {
            bestScore = sc;
            best = items[ii];
          }
        }
      }
    }
    if (best) return [best];
  }
  return [];
}

// ──────── loadResource: aggregated search / play source ────────

async function loadResource(params) {
  try {
    var rawTitle = String(params.seriesName || params.title || "").trim();
    var rawEpisode = String(params.episodeName || "").trim();
    var isMovie = String(params.type || "") === "movie";
    var wantSeason = parseInt(params.season, 10) || 0;
    var wantEpisode = parseInt(params.episode, 10) || 0;

    var baseTitle = stripTitleMeta(rawTitle) || rawTitle || rawEpisode;
    if (!baseTitle) return [];
    var wantBaseNorm = normalizeName(baseTitle);

    // If caller already knows the play page link, resolve the video URL directly
    if (params.link) {
      var videoUrl = await resolvePlayPage(params.link, PLAY_HEADERS);
      if (!videoUrl) return [];
      var label = isMovie ? "ギリギリ动漫" : "ギリギリ动漫" + (rawEpisode ? " " + rawEpisode : "");
      return [{
        name: label,
        description: rawTitle,
        url: videoUrl,
        customHeaders: { "Referer": SITE + "/", "User-Agent": UA },
      }];
    }

    // Site search is always blocked by Cloudflare — skip straight to category scan
    var wantYear = String(params.year || "").trim();
    var animeList = await scanCategoryForTitle(wantBaseNorm, isMovie, wantSeason, wantYear);

    if (!animeList.length) return [];

    // 3. Pick best match
    var best = pickBestResult(wantBaseNorm, wantSeason, animeList);
    if (!best) return [];

    // 4. Fetch detail page for episodes
    var detailUrl = SITE + "/" + best.link + "/";
    var detailRes;
    try {
      detailRes = await Widget.http.get(detailUrl, { headers: HEADERS });
    } catch (e) {
      return [];
    }
    var detailHtml = (detailRes && detailRes.data) || "";
    if (!detailHtml) return [];

    var $ = Widget.html.load(detailHtml);

    // Find 简中 group index, fallback to 繁中
    var scIndex = -1;
    $(".anthology-tab a.swiper-slide").each(function (i) {
      var text = $(this).text().trim();
      if (text.indexOf("简中") !== -1) {
        scIndex = i;
      } else if (scIndex === -1 && text.indexOf("繁中") !== -1) {
        scIndex = i;
      }
    });
    if (scIndex === -1) scIndex = 0;

    // Extract episodes from 简中 group
    var episodes = [];
    var $scGroup = $(".anthology-list-box").eq(scIndex);
    $scGroup.find("ul.anthology-list-play li a.hide.this-link").each(function () {
      var href = $(this).attr("href") || "";
      var epNumText = $(this).text().trim();
      var epMatch = epNumText.match(/(\d+)/);
      var epNum = epMatch ? parseInt(epMatch[1], 10) : 0;
      if (href && epNum > 0) {
        episodes.push({
          id: href.replace(/^\//, "").replace(/\/$/, ""),
          episode: epNum,
        });
      }
    });

    if (!episodes.length) return [];

    // 4. Pick the right episode
    var target = episodes[0];
    if (!isMovie && wantEpisode > 0) {
      for (var j = 0; j < episodes.length; j++) {
        if (episodes[j].episode === wantEpisode) {
          target = episodes[j];
          break;
        }
      }
    }

    // 5. Resolve play URL
    var playUrl = SITE + "/" + target.id + "/";
    var playRes;
    try {
      playRes = await Widget.http.get(playUrl, { headers: PLAY_HEADERS });
    } catch (e) {
      return [];
    }
    var playHtml = (playRes && playRes.data) || "";
    var videoUrl = resolvePlayUrl(playHtml);
    if (!videoUrl) return [];

    var label = isMovie ? "ギリギリ动漫" : "ギリギリ动漫 S" + (wantSeason || 1) + "E" + (target.episode);
    return [
      {
        name: label,
        description: best.title,
        url: videoUrl,
        customHeaders: {
          "Referer": SITE + "/",
          "User-Agent": UA,
        },
      },
    ];
  } catch (error) {
    console.error("[loadResource] 失败:", error.message || error);
    return [];
  }
}

async function loadDetail(link) {
  try {
    if (!link) return null;
    var id = String(link);

    // Check if this is an episode play link
    if (id.indexOf("play") === 0) {
      var playUrl = SITE + "/" + id + "/";
      var res = await Widget.http.get(playUrl, { headers: HEADERS });
      var html = typeof res.data === "string" ? res.data : "";
      if (!html) return null;

      var videoUrl = resolvePlayUrl(html);
      if (videoUrl) {
        return {
          id: id,
          type: "url",
          title: "播放",
          videoUrl: videoUrl,
          link: id,
        };
      }
      return null;
    }

    // Normal detail: fetch the anime page
    var detailUrl = SITE + "/" + id + "/";
    var res = await Widget.http.get(detailUrl, { headers: HEADERS });
    var html = typeof res.data === "string" ? res.data : "";
    if (!html) return null;

    var $ = Widget.html.load(html);

    // Title
    var title = $(".slide-info-title").first().text().trim() ||
                $("h3").first().text().trim();

    // Poster
    var poster = $(".detail-pic img.lazy").attr("data-src") || "";
    if (poster && !poster.startsWith("http")) {
      poster = SITE + poster;
    }

    // Description
    var description = $("div.text.cor3").first().text().trim() || "";

    // Rating
    var rating = undefined;
    var ratingText = $("div.fraction").first().text().trim();
    if (ratingText) {
      rating = parseFloat(ratingText);
    }

    // Parse episode groups — prefer 简中, fallback to 繁中
    var scIndex = -1;
    $(".anthology-tab a.swiper-slide").each(function (i) {
      var text = $(this).text().trim();
      if (text.indexOf("简中") !== -1) {
        scIndex = i;
      } else if (scIndex === -1 && text.indexOf("繁中") !== -1) {
        scIndex = i;
      }
    });

    // Fall back to first group if none found
    if (scIndex === -1) scIndex = 0;

    var episodeItems = [];
    // Only parse the group at scIndex
    var $scGroup = $(".anthology-list-box").eq(scIndex);
    $scGroup.find("ul.anthology-list-play li a.hide.this-link").each(function () {
      var href = $(this).attr("href") || "";
      var epText = $(this).text().trim();
      if (href && epText) {
        var epId = href.replace(/^\//, "").replace(/\/$/, "");
        // 纯数字且≤100视为集数→"第N集"，否则保持原文（如画质标签"1080"、"1080P"、"4K"）
        var title = (/^\d+$/.test(epText) && parseInt(epText, 10) <= 100)
          ? ("第" + parseInt(epText, 10) + "集") : epText;
        episodeItems.push({
          id: epId,
          type: "url",
          title: title,
          link: epId,
        });
      }
    });

    // Related items
    var relatedItems = [];
    $(".related .public-list-box").each(function () {
      var $link = $(this).find("a.public-list-exp");
      var href = $link.attr("href") || "";
      var relId = href.replace(/^\//, "").replace(/\/$/, "");
      var relTitle = $link.attr("title") || "";
      var relPoster = $link.find("img.gen-movie-img").attr("data-src") || "";
      if (relId && relTitle) {
        relatedItems.push({
          id: relId,
          type: "url",
          title: relTitle,
          posterPath: relPoster,
          link: relId,
        });
      }
    });

    // Airing / update status
    var remarks = $(".slide-info-remarks.cor5").first().text().trim() || undefined;

    var result = {
      id: id,
      type: "url",
      title: title + (remarks ? " " + remarks : ""),
      posterPath: poster,
      coverUrl: poster,
      description: description || undefined,
      rating: rating,
      link: id,
    };

    if (episodeItems.length > 0) {
      // For single episode (movie), resolve play URL directly
      if (episodeItems.length === 1) {
        try {
          var epPlayUrl = SITE + "/" + episodeItems[0].link + "/";
          var epRes = await Widget.http.get(epPlayUrl, { headers: HEADERS });
          var epHtml = typeof epRes.data === "string" ? epRes.data : "";
          var videoUrl = resolvePlayUrl(epHtml);
          if (videoUrl) result.videoUrl = videoUrl;
        } catch (e) { /* ignore */ }
      }
      result.episodeItems = episodeItems;
    }

    if (relatedItems.length > 0) {
      result.relatedItems = relatedItems;
    }

    return result;
  } catch (error) {
    console.error("[loadDetail] 失败:", error.message || error);
    return null;
  }
}
