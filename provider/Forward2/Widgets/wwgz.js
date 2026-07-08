// ==UserScript==
// @name        旺旺影视 ForwardWidget
// @description 旺旺影视视频浏览模块
// @version     1.0.0
// @author      Minis
// @site        https://vip.wwgz.cn:5200
// ==/UserScript==

/** @type {WidgetMetadata} */
WidgetMetadata = {
  id: "wwgz",
  title: "旺旺影视",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "旺旺影视 - 电影/电视剧/综艺/动漫/短剧",
  author: "Minis",
  site: "https://vip.wwgz.cn:5200",
  detailCacheDuration: 300,
  modules: [
    { id: "movie", title: "电影", functionName: "loadList", type: "video", cacheDuration: 600,
      params: [
        { name: "type", title: "类型", type: "enumeration", value: "1",
          enumOptions: [{ title: "全部", value: "1" }, { title: "动作片", value: "5" }, { title: "喜剧片", value: "6" }, { title: "爱情片", value: "7" }, { title: "科幻片", value: "8" }, { title: "恐怖片", value: "9" }, { title: "剧情片", value: "10" }, { title: "战争片", value: "11" }, { title: "惊悚片", value: "16" }, { title: "奇幻片", value: "17" }] },
        { name: "page", title: "页码", type: "page" },
      ] },
    { id: "tv", title: "连续剧", functionName: "loadList", type: "video", cacheDuration: 600,
      params: [
        { name: "type", title: "类型", type: "enumeration", value: "2",
          enumOptions: [{ title: "全部", value: "2" }, { title: "国产剧", value: "12" }, { title: "港台泰", value: "13" }, { title: "日韩剧", value: "14" }, { title: "欧美剧", value: "15" }] },
        { name: "page", title: "页码", type: "page" },
      ] },
    { id: "variety", title: "综艺", functionName: "loadList", type: "video", cacheDuration: 600, params: [{ name: "type", title: "分类", type: "constant", value: "3" }, { name: "page", title: "页码", type: "page" }] },
    { id: "anime", title: "动漫", functionName: "loadList", type: "video", cacheDuration: 600, params: [{ name: "type", title: "分类", type: "constant", value: "4" }, { name: "page", title: "页码", type: "page" }] },
    { id: "short", title: "短剧", functionName: "loadList", type: "video", cacheDuration: 600, params: [{ name: "type", title: "分类", type: "constant", value: "26" }, { name: "page", title: "页码", type: "page" }] },
  ],
  search: { title: "搜索", functionName: "search", params: [{ name: "keyword", title: "关键词", type: "input" }] },
};

var SITE = "https://vip.wwgz.cn:5200";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1";
var HDR = { "User-Agent": UA, Accept: "text/html,application/xhtml+xml", Referer: SITE + "/" };

function absUrl(u) { return u && u.indexOf("http") === 0 ? u : (u.indexOf("/") === 0 ? SITE + u : SITE + "/" + u); }
function clean(t) { return String(t || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(); }
function np(p) { var n = Number(p); return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1; }

function listUrl(type, page) {
  return SITE + "/vod-list-id-" + type + "-pg-" + page + "-order--by-time-class-0-year-0-letter--area--lang-.html";
}

function parseList(html) {
  var items = [], seen = {};
  var re = /<li>[\s\S]*?<a\s+href="(\/vod-detail-id-\d+\.html)"[^>]*title="([^"]*)"[\s\S]*?(?:data-src|src)="([^"]+?)"[\s\S]*?<\/li>/gi;
  var m;
  while ((m = re.exec(html))) {
    var link = absUrl(m[1]);
    if (seen[link]) continue;
    seen[link] = true;
    var title = clean(m[2]);
    if (!title) continue;
    items.push({ id: link, type: "link", title: title, coverUrl: m[3] ? m[3].replace(/&amp;/g, "&") : "", link: link });
  }
  return items;
}

async function loadList(p) {
  var type = p.type || "1";
  var page = np(p.page || 1);
  var res = await Widget.http.get(listUrl(type, page), { headers: HDR, allow_redirects: true });
  var html = String(res.data || "");
  if (!html) throw new Error("空响应");
  var items = parseList(html);
  if (!items.length) throw new Error("未找到视频");
  return items;
}

async function search(p) {
  var kw = String(p.keyword || "").trim();
  if (!kw) throw new Error("请输入关键词");
  var res = await Widget.http.post(SITE + "/index.php?m=vod-search", "wd=" + encodeURIComponent(kw), { headers: { "User-Agent": UA, "Content-Type": "application/x-www-form-urlencoded" } });
  var html = String(res.data || "");
  if (!html) throw new Error("空响应");
  var items = [], seen = {};
  var re = /<li>[\s\S]*?<a\s+href="(\/[^"]*?)"[^>]*>[\s\S]*?(?:data-src|src)="([^"]+?)"[\s\S]*?class="sTit"[^>]*>([^<]+)<[\s\S]*?<\/li>/gi;
  var m;
  while ((m = re.exec(html))) {
    var link = absUrl(m[1]);
    if (seen[link]) continue;
    seen[link] = true;
    items.push({ id: link, type: "link", title: clean(m[3]), coverUrl: m[2] ? m[2].replace(/&amp;/g, "&") : "", link: link });
  }
  if (!items.length) throw new Error("没有找到结果");
  return items;
}

// 从编码参数获取真实视频地址
async function resolveM3u8(encoded) {
  var apis = ["https://api.nmvod.me:520/player/", "https://api.wwgz.cn:520/player/"];
  for (var i = 0; i < apis.length; i++) {
    try {
      var res = await Widget.http.get(apis[i] + "?url=" + encoded, { headers: { "User-Agent": UA, Referer: SITE + "/" } });
      var html = String(res.data || "");
      var um = html.match(/["']url["']\s*:\s*["']([^"']+)["']/);
      if (um && um[1].indexOf(".m3u8") >= 0) return um[1];
      var mm = html.match(/https?:\/\/[^"'\s]+?\.m3u8[^"'\s]*/i);
      if (mm) return mm[0];
    } catch(e) {}
  }
  return "";
}

async function loadDetail(link) {
  if (!link) return null;
  var url = absUrl(link);

  var res = await Widget.http.get(url, { headers: HDR, allow_redirects: true });
  var html = String(res.data || "");
  if (!html) return null;

  var title = "", poster = "", desc = "";
  var h1 = html.match(/<h1[^>]*class="title"[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i);
  if (h1) title = clean(h1[1]);
  var img = html.match(/<img[^>]+src="([^"]+?)"[^>]*alt="[^"]*"/);
  if (img) poster = absUrl(img[1]);
  var dm = html.match(/简介[：:]\s*([\s\S]*?)<\/p>/i);
  if (dm) desc = clean(dm[1]);

  // 获取播放地址和剧集列表
  var firstEp = html.match(/href="(\/vod-play-id-\d+-src-\d+-num-\d+\.html)"/);
  var episodes = [];
  var firstM3u8 = "";

  if (firstEp) {
    var playUrl = absUrl(firstEp[1]);
    var playRes = await Widget.http.get(playUrl, { headers: HDR, allow_redirects: true });
    var playHtml = String(playRes.data || "");
    var mu = playHtml.match(/mac_url\s*=\s*'([^']+)'/);
    if (mu) {
      var lines = mu[1].split("$$$");
      var pickLine = lines[1] || lines[0];
      var eps = pickLine.split("#");
      for (var ei = 0; ei < eps.length; ei++) {
        var ep = eps[ei].split("$");
        if (ep.length >= 2) {
          episodes.push({ id: "ep:" + ei, type: "url", title: clean(ep[0]), link: "wwgz-ep:" + ep[1] });
        }
      }
      // 预解析第一个剧集的 m3u8
      if (episodes.length > 0) {
        var enc = episodes[0].link.replace("wwgz-ep:", "");
        firstM3u8 = await resolveM3u8(enc);
      }
    }
  }

  return {
    id: url, type: "url", title: title || "旺旺影视", link: url,
    posterPath: poster || undefined, description: desc || undefined,
    videoUrl: firstM3u8 || undefined,
    videoSources: firstM3u8 ? [{ url: firstM3u8, type: "application/x-mpegURL", label: "自动" }] : undefined,
    episodeItems: episodes.length > 1 ? episodes : undefined,
    customHeaders: HDR,
  };
}

// 处理剧集切换（wwgz-ep: 协议）
var _origLoadDetail = loadDetail;
loadDetail = async function(link) {
  if (link && link.indexOf("wwgz-ep:") === 0) {
    var encoded = link.replace("wwgz-ep:", "");
    var m3u8 = await resolveM3u8(encoded);
    if (m3u8) {
      return { id: link, type: "video", title: "播放中", link: link, videoUrl: m3u8, videoSources: [{ url: m3u8, type: "application/x-mpegURL", label: "自动" }], customHeaders: { "User-Agent": UA, Referer: SITE + "/" } };
    }
    return { id: link, type: "url", title: "播放失败", link: link };
  }
  return _origLoadDetail(link);
};
