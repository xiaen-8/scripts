WidgetMetadata = {
  id: "forward.bagua",
  title: "bagua",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "bagua 分类、搜索与详情模块",
  author: "Codex",
  site: "https://www.mrds66.com",
  detailCacheDuration: 1800,
  globalParams: [
    {
      name: "baseUrl",
      title: "站点域名",
      type: "input",
      value: "https://www.mrds66.com"
    }
  ],
  modules: [
    {
      id: "loadList",
      title: "分类",
      functionName: "loadList",
      cacheDuration: 600,
      params: [
        {
          name: "category",
          title: "频道",
          type: "enumeration",
          value: "xazd",
          enumOptions: [
            { title: "默认", value: "xazd" }
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

var DEFAULT_BASE_URL = "https://www.mrds66.com";
var DEFAULT_POSTER = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc2MDAnIGhlaWdodD0nOTAwJyB2aWV3Qm94PScwIDAgNjAwIDkwMCc+PHJlY3Qgd2lkdGg9JzYwMCcgaGVpZ2h0PSc5MDAnIGZpbGw9JyMxODE4MTgnLz48cmVjdCB4PSc0OCcgeT0nNDgnIHdpZHRoPSc1MDQnIGhlaWdodD0nODA0JyByeD0nMjgnIGZpbGw9JyMyNDI0MjQnIHN0cm9rZT0nIzNhM2EzYScgc3Ryb2tlLXdpZHRoPScyJy8+PHRleHQgeD0nMzAwJyB5PSc0MDUnIGZpbGw9JyNmMmYyZjInIGZvbnQtc2l6ZT0nNzInIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXdlaWdodD0nNzAwJyB0ZXh0LWFuY2hvcj0nbWlkZGxlJz5iYWd1YTwvdGV4dD48dGV4dCB4PSczMDAnIHk9JzQ3NScgZmlsbD0nI2I4YjhiOCcgZm9udC1zaXplPSczMCcgZm9udC1mYW1pbHk9J0FyaWFsLHNhbnMtc2VyaWYnIHRleHQtYW5jaG9yPSdtaWRkbGUnPnByZXZpZXc8L3RleHQ+PC9zdmc+";

async function loadList(params) {
  params = params || {};
  var baseUrl = normalizeBaseUrl(params.baseUrl || DEFAULT_BASE_URL);
  var category = params.category || "xazd";
  var page = Math.max(1, Number(params.page || 1));
  var path = page === 1 ? "/category/" + category + "/" : "/category/" + category + "/" + page + "/";
  var html = await requestHtml(baseUrl + path);
  return parseList(html, baseUrl);
}

async function search(params) {
  params = params || {};
  var keyword = String(params.keyword || "").trim();
  if (!keyword) return [];

  var baseUrl = normalizeBaseUrl(params.baseUrl || DEFAULT_BASE_URL);
  var page = Math.max(1, Number(params.page || 1));
  var encoded = encodeURIComponent(keyword);
  var path = page === 1 ? "/search/" + encoded + "/" : "/search/" + encoded + "/" + page + "/";
  var html = await requestHtml(baseUrl + path);
  return parseList(html, baseUrl);
}

async function loadDetail(link) {
  if (!link) return null;

  var decoded = decodeLink(link);
  var baseUrl = normalizeBaseUrl(decoded.baseUrl || DEFAULT_BASE_URL);
  var url = absoluteUrl(decoded.url || link, baseUrl);
  var html = await requestHtml(url);

  var title =
    firstMatch(html, /<h1[^>]*class=["'][^"']*post-title[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i) ||
    metaContent(html, "property", "og:title") ||
    decoded.title ||
    "";
  var cover =
    metaContent(html, "itemprop", "image") ||
    metaContent(html, "property", "og:image") ||
    decoded.posterPath ||
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
  var stills = unique([cover].concat(extractArticleImages(html, baseUrl))).filter(Boolean);
  var tags = extractTags(html);
  var backdropPaths = [];
  for (var i = 0; i < stills.length; i++) {
    backdropPaths.push(absoluteUrl(stills[i], baseUrl));
  }
  var genreItems = [];
  for (var j = 0; j < tags.length; j++) {
    genreItems.push({ id: tags[j], title: tags[j] });
  }

  return {
    id: decoded.id || idFromUrl(url),
    type: "url",
    title: cleanText(title),
    posterPath: absoluteUrl(cover, baseUrl),
    backdropPath: absoluteUrl(stills[0] || cover, baseUrl),
    backdropPaths: backdropPaths,
    releaseDate,
    description: cleanText(description),
    videoUrl: videoUrl ? absoluteUrl(videoUrl, baseUrl) : undefined,
    link: encodeLink({ url: url, baseUrl: baseUrl, title: cleanText(title), posterPath: absoluteUrl(cover, baseUrl) }),
    genreItems: genreItems,
    playerType: "system"
  };
}

function parseList(html, baseUrl) {
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
    var posterPath =
      firstMatch(block, /loadBannerDirect\(\s*["']([^"']+)["']/i) ||
      firstMatch(block, /<meta\b[^>]*itemprop=["']image["'][^>]*content=["']([^"']+)["']/i);
    var dateText =
      firstMatch(block, /<time[^>]*>([\s\S]*?)<\/time>/i) ||
      firstMatch(block, /<meta\b[^>]*itemprop=["']datePublished["'][^>]*content=["']([^"']+)["']/i);

    if (!href || !title) continue;

    var url = absoluteUrl(href, baseUrl);
    var sourcePoster = absoluteUrl(posterPath || "", baseUrl);
    items.push({
      id: idFromUrl(url),
      type: "url",
      title: cleanText(title),
      posterPath: DEFAULT_POSTER,
      backdropPath: DEFAULT_POSTER,
      releaseDate: normalizeDate(dateText),
      link: encodeLink({ url: url, baseUrl: baseUrl, title: cleanText(title), posterPath: sourcePoster })
    });
  }

  return items;
}

async function requestHtml(url) {
  var res = await Widget.http.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Referer: normalizeBaseUrl(url)
    }
  });
  return String(res && res.data ? res.data : "");
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
  var tagRe = /<a\b[^>]*>([\s\S]*?)<\/a>/gi;
  var match;

  while ((match = tagRe.exec(tagsBlock))) {
    var tag = cleanText(match[1]);
    if (tag) tags.push(tag);
  }

  return unique(tags);
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
  return "mrds:" + JSON.stringify(data);
}

function decodeLink(link) {
  var value = String(link || "");
  if (value.indexOf("mrds:") === 0) {
    try {
      return JSON.parse(value.slice(5));
    } catch (error) {
      return { url: value.slice(5) };
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
