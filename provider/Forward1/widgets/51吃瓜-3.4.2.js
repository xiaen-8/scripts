WidgetMetadata = {
  "id": "51cg",
  "title": "51吃瓜",
  "version": "3.4.2",
  "requiredVersion": "0.0.2",
  "description": "51吃瓜网站聚合.可搭建自己的CF Worker解密代理",
  "author": "𝓓𝔂𝓵𝓪𝓷/廿二日",
  "site": "https://chigua.com",
  "icon": "https://chigua.com/favicon.ico",
  "detailCacheDuration": 1800,
  "globalParams": [
    {
      "name": "baseUrl",
      "title": "站点域名",
      "type": "input",
      "value": "https://chigua.com"
    },
    {
      "name": "coverProxy",
      "title": "封面代理",
      "type": "input",
      "value": "https://dawn-butterfly-5255.taoyhu-3ef.workers.dev",
      "placeholders": [
        {
          "title": "封面代理1",
          "value": "https://dawn-butterfly-5255.taoyhu-3ef.workers.dev"
        },
        {
          "title": "封面代理2",
          "value": "https://bagua-cover-proxy.dingyong1024.workers.dev"
        }
      ]
    }
  ],
  "modules": [
    {
      "id": "loadList",
      "title": "分类",
      "functionName": "loadList",
      "cacheDuration": 600,
      "params": [
        {
          "name": "sort_by",
          "title": "频道",
          "type": "enumeration",
          "value": "wpcz",
          "enumOptions": [
            { "title": "今日吃瓜", "value": "wpcz" },
            { "title": "网红黑料", "value": "whhl" },
            { "title": "热门大瓜", "value": "rdsj" },
            { "title": "吃瓜榜单", "value": "mrdg" },
            { "title": "必看大瓜", "value": "bkdg" },
            { "title": "学生校园", "value": "xsxy" },
            { "title": "海外吃瓜", "value": "hwcg" },
            { "title": "伦理道德", "value": "lldd" },
            { "title": "探花精选", "value": "thjx" },
            { "title": "看片娱乐", "value": "ysyl" },
            { "title": "每日大赛", "value": "mrds" },
            { "title": "明星黑料", "value": "whmx" },
            { "title": "网黄合集", "value": "whhj" },
            { "title": "骚男骚女", "value": "snsn" },
            { "title": "国产剧情", "value": "gcjq" },
            { "title": "擦边撩骚", "value": "dcbq" },
            { "title": "吃瓜看戏", "value": "qubk" },
            { "title": "人人吃瓜", "value": "rrcg" },
            { "title": "51涨知识", "value": "zzs" },
            { "title": "领导干部", "value": "ldcg" },
            { "title": "吃瓜新闻", "value": "cgxw" },
            { "title": "51剧场", "value": "51djc" },
            { "title": "免费短剧", "value": "cbdj" },
            { "title": "51品茶", "value": "51by" },
            { "title": "51原创", "value": "yczq" },
            { "title": "世界杯专栏", "value": "sjb" }
          ]
        },
        { "name": "page", "title": "页码", "type": "page" }
      ]
    }
  ],
  "search": {
    "title": "搜索",
    "functionName": "search",
    "params": [
      { "name": "keyword", "title": "关键词", "type": "input" },
      { "name": "page", "title": "页码", "type": "page" }
    ]
  }
};

var DEFAULT_BASE_URL = "https://chigua.com";

async function loadList(params) {
  params = params || {};
  var baseUrl = normalizeBaseUrl(params.baseUrl);
  var page = Math.max(Number(params.page) || 1, 1);
  var coverProxy = normalizeProxyUrl(params.coverProxy || "");
  var coverMode = "image";
  var needCover = true;

  var url;
  if (params.genreId && params.genreId.startsWith("http")) {
    var tagBase = params.genreId.replace(/\/+$/, "");
    url = page === 1 ? tagBase + "/" : tagBase + "/" + page + "/";
  } else {
    var category = String(params.sort_by || "wpcz").trim().replace(/[^a-z0-9]/gi, "");
    url = page === 1
      ? baseUrl + "/category/" + category + "/"
      : baseUrl + "/category/" + category + "/" + page + "/";
  }

  var resp = await Widget.http.get(url, { headers: getHeaders() });
  var html = String(resp && resp.data ? resp.data : "");

  var items = [];
  var articleRe = /<article\b[^>]*itemtype=["'][^"']*BlogPosting[^"']*["'][^>]*>[\s\S]*?<\/article>/gi;
  var match;

  while ((match = articleRe.exec(html))) {
    var block = match[0];
    if (/class=["'][^"']*ad-item/i.test(block)) continue;

    var href =
      firstMatch(block, /<a\b[^>]*href=["']([^"']*\/archives\/[^"']+)["'][^>]*>/i) ||
      firstMatch(block, /<meta\b[^>]*itemprop=["'][^"']*url[^"']*["'][^>]*content=["']([^"']+)["']/i);
    var title =
      firstMatch(block, /<h2[^>]*class=["'][^"']*post-card-title[^"']*["'][^>]*>([\s\S]*?)<\/h2>/i) ||
      firstMatch(block, /<meta\b[^>]*itemprop=["']headline["'][^>]*content=["']([^"']+)["']/i);
    var coverPath =
      firstMatch(block, /loadBannerDirect\(\s*["']([^"']+)["']/i) ||
      firstMatch(block, /<meta\b[^>]*itemprop=["']image["'][^>]*content=["']([^"']+)["']/i);
    var dateText =
      firstMatch(block, /<time[^>]*>([\s\S]*?)<\/time>/i) ||
      firstMatch(block, /<meta\b[^>]*itemprop=["']datePublished["'][^>]*content=["']([^"']+)["']/i);

    if (!href || !title) continue;

    var absUrl = absoluteUrl(href, baseUrl);
    var sourcePoster = absoluteUrl(coverPath || "", baseUrl);

    items.push({
      id: idFromUrl(absUrl),
      type: "url",
      mediaType: "movie",
      title: cleanText(title),
      coverUrl: sourcePoster,
      backdropPath: sourcePoster,
      thumbnail: sourcePoster,
      image: sourcePoster,
      sourcePoster: sourcePoster,
      releaseDate: normalizeDate(dateText),
      description: normalizeDate(dateText),
      link: encodeLink({ url: absUrl, baseUrl: baseUrl, coverProxy: coverProxy, coverMode: coverMode, title: cleanText(title), sourcePoster: sourcePoster })
    });
  }

  if (needCover && items.length > 0) {
    items = await hydrateCovers(items, baseUrl, coverProxy);
  }

  return items;
}

async function search(params) {
  params = params || {};
  var keyword = String(params.keyword || "").trim();
  if (!keyword) return [];

  var baseUrl = normalizeBaseUrl(params.baseUrl || DEFAULT_BASE_URL);
  var page = Math.max(Number(params.page) || 1, 1);
  var coverProxy = normalizeProxyUrl(params.coverProxy || "");
  var coverMode = "image";
  var needCover = true;
  var encoded = encodeURIComponent(keyword);
  var path = page === 1 ? "/search/" + encoded + "/" : "/search/" + encoded + "/" + page + "/";

  var resp = await Widget.http.get(baseUrl + path, { headers: getHeaders() });
  var html = String(resp && resp.data ? resp.data : "");

  var items = [];
  var articleRe = /<article\b[^>]*itemtype=["'][^"']*BlogPosting[^"']*["'][^>]*>[\s\S]*?<\/article>/gi;
  var match;

  while ((match = articleRe.exec(html))) {
    var block = match[0];
    if (/class=["'][^"']*ad-item/i.test(block)) continue;

    var href =
      firstMatch(block, /<a\b[^>]*href=["']([^"']*\/archives\/[^"']+)["'][^>]*>/i) ||
      firstMatch(block, /<meta\b[^>]*itemprop=["'][^"']*url[^"']*["'][^>]*content=["']([^"']+)["']/i);
    var title =
      firstMatch(block, /<h2[^>]*class=["'][^"']*post-card-title[^"']*["'][^>]*>([\s\S]*?)<\/h2>/i) ||
      firstMatch(block, /<meta\b[^>]*itemprop=["']headline["'][^>]*content=["']([^"']+)["']/i);
    var coverPath =
      firstMatch(block, /loadBannerDirect\(\s*["']([^"']+)["']/i) ||
      firstMatch(block, /<meta\b[^>]*itemprop=["']image["'][^>]*content=["']([^"']+)["']/i);

    if (!href || !title) continue;

    var absUrl = absoluteUrl(href, baseUrl);
    var sourcePoster = absoluteUrl(coverPath || "", baseUrl);

    items.push({
      id: idFromUrl(absUrl),
      type: "url",
      mediaType: "movie",
      title: cleanText(title),
      coverUrl: sourcePoster,
      backdropPath: sourcePoster,
      thumbnail: sourcePoster,
      image: sourcePoster,
      sourcePoster: sourcePoster
    });
  }

  if (needCover && items.length > 0) {
    items = await hydrateCovers(items, baseUrl, coverProxy); 
  }

  return items;
}

async function loadDetail(link) {
  if (!link) return null;

  var decoded = decodeLink(link);
  var baseUrl = normalizeBaseUrl(decoded.baseUrl || DEFAULT_BASE_URL);
  var url = absoluteUrl(decoded.url || link, baseUrl);
  var coverProxy = normalizeProxyUrl(decoded.coverProxy || "");

  var resp = await Widget.http.get(url, { headers: getHeaders() });
  var html = String(resp && resp.data ? resp.data : "");

  var title =
    firstMatch(html, /<h1[^>]*class=["'][^"']*post-title[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i) ||
    metaContent(html, "property", "og:title") ||
    decoded.title ||
    "";
  var cover =
    metaContent(html, "itemprop", "image") ||
    metaContent(html, "property", "og:image") ||
    decoded.sourcePoster ||
    "";
  var description =
    metaContent(html, "property", "og:description") ||
    metaContent(html, "name", "description") ||
    "";
  var releaseDate = normalizeDate(
    metaContent(html, "property", "article:published_time") ||
    firstMatch(html, /<time[^>]*>([\s\S]*?)<\/time>/i)
  );
  var videoUrl = extractVideoUrl(html);
  var resolvedVideoUrl = videoUrl ? absoluteUrl(videoUrl, baseUrl) : undefined;

  var articleImgs = extractArticleImages(html, baseUrl);
  var stills = unique([absoluteUrl(cover, baseUrl)].concat(articleImgs)).filter(Boolean);
  var coverUrl = stills[0] || absoluteUrl(cover, baseUrl);
  var resolvedStills = stills.map(function(s) {
    return (coverProxy && isEncryptedImage(s))
      ? coverProxy + "?url=" + encodeURIComponent(s)
      : s;
  });

  var relatedLinks = extractRelatedLinks(html, baseUrl);
  var relatedItems = relatedLinks.length > 0 ? await hydrateRelatedItems(relatedLinks, baseUrl, coverProxy) : [];

  var tags = extractTags(html);
  var genreItems = tags.map(function(t) {
    return { id: absoluteUrl(t.url, baseUrl), title: t.title };
  });

  return {
    id: idFromUrl(url),
    type: "url",
    mediaType: "movie",
    title: cleanText(title) || decoded.title || idFromUrl(url),
    coverUrl: resolvedStills[0] || coverUrl,
    backdropPath: resolvedStills[0] || coverUrl,
    backdropPaths: resolvedStills.length > 1 ? resolvedStills : undefined,
    releaseDate: releaseDate,
    description: cleanText(description),
    videoUrl: resolvedVideoUrl,
    previewUrl: resolvedVideoUrl,
    trailers: resolvedVideoUrl ? [{ coverUrl: resolvedStills[0] || coverUrl, url: resolvedVideoUrl }] : undefined,
    genreItems: genreItems.length > 0 ? genreItems : undefined,
    relatedItems: relatedItems.length > 0 ? relatedItems : undefined,
    link: encodeLink({
      url: url,
      title: cleanText(title) || decoded.title || idFromUrl(url),
      sourcePoster: absoluteUrl(cover, baseUrl),
      baseUrl: baseUrl,
      coverProxy: coverProxy
    }),
    playerType: "ijk",
    headers: {
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
      "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      "Referer": url
    },
    customHeaders: getHeaders()
  };
}

async function hydrateCovers(items, baseUrl, coverProxy) {
  if (!coverProxy) return items;
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var sp = item.sourcePoster || "";
    var cover = await resolveCoverImage(sp, baseUrl, coverProxy);
    cover = cover || sp;
    item.coverUrl = cover;
    item.backdropPath = cover;
    item.thumbnail = cover;
    item.image = cover;
    delete item.sourcePoster;
  }
  return items;
}

async function resolveCoverImage(url, baseUrl, coverProxy) {
  var fullUrl = absoluteUrl(url, baseUrl);
  if (!fullUrl) return "";
  if (!coverProxy) return fullUrl;
  return coverProxy + "?url=" + encodeURIComponent(fullUrl);
}

function getHeaders() {
  return {
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Referer": "https://chigua.com/"
  };
}

function extractVideoUrl(html) {
  var configText = firstMatch(html, /<div\b[^>]*class=["'][^"']*dplayer[^"']*["'][^>]*data-config=(["'])([\s\S]*?)\1/i, 2);
  if (configText) {
    var decoded = decodeHtml(configText);
    try {
      var config = JSON.parse(decoded);
      if (config && config.video && config.video.url) return config.video.url;
    } catch (error) {
      var fromConfig = firstMatch(decoded, /"url"\s*:\s*"([^"]+)"/i);
      if (fromConfig) return fromConfig.replace(/\\\//g, "/");
    }
  }
  return (
    firstMatch(html, /["'](https?:\\?\/\\?\/[^"']+?\.m3u8[^"']*)["']/i) ||
    firstMatch(html, /["'](https?:\\?\/\\?\/[^"']+?\.mp4[^"']*)["']/i) ||
    ""
  ).replace(/\\\//g, "/");
}

function extractRelatedLinks(html, baseUrl) {
  var nearBlock = firstMatch(html, /<div\b[^>]*class=["'][^"']*post-near[^"']*["'][^>]*>([\s\S]*?)<\/nav>/i) || "";
  var items = [];
  var seen = {};
  var nearLinkRe = /<a\b[^>]*href=["']([^"']*\/archives\/[^"']+)["'][^>]*title=["']([^"']+)["']/gi;
  var m;
  while ((m = nearLinkRe.exec(nearBlock))) {
    var link = absoluteUrl(m[1], baseUrl);
    var title = cleanText(m[2]);
    if (!link || !title || seen[link]) continue;
    seen[link] = true;
    items.push({ url: link, title: title });
  }
  return items;
}

async function hydrateRelatedItems(links, baseUrl, coverProxy) {
  var limited = links.slice(0, 4);
  var results = await Promise.all(limited.map(async function(item) {
    try {
      var resp = await Widget.http.get(item.url, { headers: getHeaders() });
      var html = String(resp && resp.data ? resp.data : "");
      var cover = metaContent(html, "itemprop", "image") ||
                  metaContent(html, "property", "og:image") || "";
      var resolvedCover = cover ? absoluteUrl(cover, baseUrl) : "";
      if (resolvedCover && coverProxy && isEncryptedImage(resolvedCover)) {
        resolvedCover = coverProxy + "?url=" + encodeURIComponent(resolvedCover);
      }
      return {
        id: idFromUrl(item.url),
        type: "url",
        mediaType: "movie",
        title: item.title,
        backdropPath: resolvedCover || undefined,
        link: encodeLink({ url: item.url, baseUrl: baseUrl, title: item.title, coverProxy: coverProxy })
      };
    } catch (e) {
      return {
        id: idFromUrl(item.url),
        type: "url",
        mediaType: "movie",
        title: item.title,
        link: encodeLink({ url: item.url, baseUrl: baseUrl, title: item.title, coverProxy: coverProxy })
      };
    }
  }));
  return results;
}

function isEncryptedImage(url) {
  return /\/xiao\//i.test(url) || /\/upload_01\//i.test(url) || /\/uploads\//i.test(url) || /\/upload\/upload\//i.test(url);
}

function extractArticleImages(html, baseUrl) {
  var body = firstMatch(html, /<div\b[^>]*class=["'][^"']*post-content[^"']*["'][^>]*>([\s\S]*?)<div class=["']tags["']/i) || html;
  var images = [];
  var attrRe = /\b(?:data-xkrkllgl|data-src|src)=["']([^"']+)["']/gi;
  var match;
  while ((match = attrRe.exec(body))) {
    var url = decodeHtml(match[1]);
    if (!url || /\/usr\/themes\/Mirages\/images\/banner\.png/i.test(url) || /\/usr\/plugins\/tbxw\/zw\.png/i.test(url)) continue;
    if (/\/uploads\/default\/other\//i.test(url)) continue;
    images.push(absoluteUrl(url, baseUrl));
  }
  return images;
}

function extractTags(html) {
  var tagsBlock = firstMatch(html, /<div\b[^>]*itemprop=["']keywords["'][^>]*>([\s\S]*?)<\/div>/i) || "";
  var tags = [];
  var seen = {};
  var tagRe = /<a\b[^>]*href=["']([^"']*\/tag\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  var match;
  while ((match = tagRe.exec(tagsBlock))) {
    var url = decodeHtml(match[1]);
    var title = cleanText(match[2]);
    if (!title || !url || seen[url]) continue;
    seen[url] = true;
    tags.push({ url: url, title: title });
  }
  return tags;
}

function metaContent(html, attr, value) {
  var escaped = escapeRegExp(value);
  return decodeHtml(
    firstMatch(html, new RegExp("<meta\\b[^>]*" + attr + "=[\"']" + escaped + "[\"'][^>]*content=[\"']([^\"']*)[\"']", "i")) ||
    firstMatch(html, new RegExp("<meta\\b[^>]*content=[\"']([^\"']*)[\"'][^>]*" + attr + "=[\"']" + escaped + "[\"']", "i")) ||
    ""
  );
}

function firstMatch(text, re, groupIndex) {
  var match = String(text || "").match(re);
  return match ? decodeHtml(match[groupIndex || 1] || "") : "";
}

function cleanText(text) {
  return decodeHtml(String(text || ""))
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtml(text) {
  return String(text || "")
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function normalizeBaseUrl(url) {
  var value = String(url || DEFAULT_BASE_URL).trim().replace(/\/+$/, "");
  var match = value.match(/^https?:\/\/[^/]+/i);
  return match ? match[0] : DEFAULT_BASE_URL;
}

function normalizeProxyUrl(url) {
  var value = String(url || "").trim();
  if (!value) return "";
  if (!/^https?:\/\//.test(value)) return "";
  return value;
}

function normalizeCoverMode(value) {
  var mode = String(value || "image").trim().toLowerCase();
  if (mode === "image" || mode === "both" || mode === "video") return mode;
  return "image";
}

function normalizePreviewCount(value) {
  var count = Number(value);
  if (!isFinite(count)) count = 0;
  if (count < 0) return 0;
  if (count > 12) return 12;
  return Math.floor(count);
}

function absoluteUrl(url, baseUrl) {
  var value = decodeHtml(String(url || "").trim());
  if (!value) return "";
  if (/^\/\//.test(value)) return "https:" + value;
  if (/^https?:\/\//i.test(value)) return value;
  if (value[0] === "/") return normalizeBaseUrl(baseUrl) + value;
  return normalizeBaseUrl(baseUrl) + "/" + value;
}

function normalizeDate(text) {
  var value = cleanText(text);
  if (!value) return "";
  var iso = value.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return iso[1] + "-" + iso[2] + "-" + iso[3];
  var zh = value.match(/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
  if (zh) return zh[1] + "-" + pad2(zh[2]) + "-" + pad2(zh[3]);
  return value;
}

function pad2(value) {
  var text = String(value);
  return text.length < 2 ? "0" + text : text;
}

function idFromUrl(url) {
  return firstMatch(url, /\/archives\/([^/?#]+)\/?/i) || String(url);
}

function encodeLink(data) {
  return "hl:" + JSON.stringify(data);
}

function decodeLink(link) {
  var value = String(link || "");
  if (value.indexOf("hl:") === 0) {
    try {
      return JSON.parse(value.slice(3));
    } catch (error) {
      return { url: value.slice(3) };
    }
  }
  return { url: value };
}

function unique(list) {
  var seen = {};
  return (list || []).filter(function (item) {
    var key = String(item || "");
    if (!key || seen[key]) return false;
    seen[key] = true;
    return true;
  });
}

function escapeRegExp(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}