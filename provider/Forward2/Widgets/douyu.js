// ============================================================
//  斗鱼直播 douyu— 完整重写版
//  源站: https://www.douyu.com
// ============================================================

WidgetMetadata = {
  id: "video-douyu",
  title: "斗鱼直播",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "斗鱼直播平台 — 分类浏览、搜索、高清直播播放，支持 Cookie 登录提升画质",
  author: "佚名",
  site: "https://www.douyu.com",
  detailCacheDuration: 30,
  globalParams: [
    {
      name: "douyuCookie",
      title: "斗鱼 Cookie",
      type: "input",
      description: "登录 douyu.com 后从浏览器复制的 Cookie，可观看高清直播。扫码获取: 运行 node douyu-login-server.js 后访问 http://localhost:3000",
      placeholders: [{ title: "acf_auth=...; acf_ltkid=...", value: "acf_auth=" }]
    }
  ],
  modules: [
    {
      id: "recommended",
      title: "推荐直播",
      functionName: "loadRecommended",
      cacheDuration: 60,
      params: [
        {
          name: "sort_by",
          title: "分类",
          type: "enumeration",
          value: "all",
          enumOptions: [
            { title: "全部推荐", value: "all" },
            { title: "英雄联盟", value: "1" },
            { title: "王者荣耀", value: "181" },
            { title: "DOTA2", value: "3" },
            { title: "CS2", value: "6" },
            { title: "穿越火线", value: "33" },
            { title: "无畏契约", value: "1554" },
            { title: "魔兽世界", value: "5" },
            { title: "DNF", value: "40" },
            { title: "炉石传说", value: "2" },
            { title: "三角洲行动", value: "4133" },
            { title: "APEX", value: "651" },
            { title: "永劫无间", value: "1227" },
            { title: "主机游戏", value: "19" },
            { title: "逃离塔科夫", value: "1024" },
            { title: "DNF手游", value: "1092" },
            { title: "金铲铲之战", value: "2556" },
            { title: "原神", value: "1223" },
            { title: "和平精英", value: "350" },
            { title: "崩坏：星穹铁道", value: "3379" },
            { title: "暗区突围", value: "3133" },
            { title: "火影忍者", value: "196" },
            { title: "蛋仔派对", value: "3358" },
            { title: "第五人格", value: "356" },
            { title: "星秀", value: "1008" },
            { title: "户外", value: "124" },
            { title: "颜值", value: "201" },
            { title: "派对", value: "1221" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadResource",
      title: "直播源",
      type: "stream",
      functionName: "loadResource",
      cacheDuration: 0,
      params: [
        { name: "link", title: "房间ID", type: "input" }
      ]
    }
  ],
  search: {
    title: "搜索",
    functionName: "searchRooms",
    params: [
      { name: "keyword", title: "关键词", type: "input" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

// ========== 常量 ==========

var PC_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
var MOBILE_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var DOUYU_DID = "10000000000000000000000000001501";
var DOUYU_COOKIE = "";
var PLACEHOLDER_IMAGE = "https://www.douyu.com/favicon.ico";
var CATE_CACHE_KEY = "douyu:cateList";
var CACHE_TTL_MS = 3600000; // 1h

// ========== MD5（纯 JS 实现） ==========

function md5(str) {
  var hexcase = 0;
  var chrsz = 8;

  function md5_ff(a, b, c, d, x, s, ac) {
    a = md5_cmn((b & c) | ((~b) & d), a, b, x, s, ac);
    return a;
  }

  function md5_gg(a, b, c, d, x, s, ac) {
    a = md5_cmn((b & d) | (c & (~d)), a, b, x, s, ac);
    return a;
  }

  function md5_hh(a, b, c, d, x, s, ac) {
    a = md5_cmn(b ^ c ^ d, a, b, x, s, ac);
    return a;
  }

  function md5_ii(a, b, c, d, x, s, ac) {
    a = md5_cmn(c ^ (b | (~d)), a, b, x, s, ac);
    return a;
  }

  function md5_cmn(q, a, b, x, s, t) {
    a = safe_add(a, q);
    a = safe_add(a, x);
    a = safe_add(a, t);
    a = bit_rol(a, s);
    return safe_add(b, a);
  }

  function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }

  function bit_rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  function hex_md5(s) {
    return binl2hex(core_md5(str2binl(s), s.length * chrsz));
  }

  function core_md5(x, len) {
    x[len >> 5] |= 0x80 << ((len) % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    for (var i = 0; i < x.length; i += 16) {
      var olda = a;
      var oldb = b;
      var oldc = c;
      var oldd = d;
      a = md5_ff(a, b, c, d, x[i], 7, -680876936);
      d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
      b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
      a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = md5_gg(b, c, d, a, x[i], 20, -373897302);
      a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
      a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
      d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = md5_hh(d, a, b, c, x[i], 11, -358537222);
      c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
      a = md5_ii(a, b, c, d, x[i], 6, -198630844);
      d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
      a = safe_add(a, olda);
      b = safe_add(b, oldb);
      c = safe_add(c, oldc);
      d = safe_add(d, oldd);
    }
    return [a, b, c, d];
  }

  function str2binl(str) {
    var bin = [];
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz) {
      bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
    }
    return bin;
  }

  function binl2hex(binarray) {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i++) {
      str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
        hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
    }
    return str;
  }

  return hex_md5(str);
}

function generateRandomHex(length) {
  var chars = "0123456789abcdef";
  var result = "";
  for (var i = 0; i < length; i++)
    result += chars.charAt(Math.floor(Math.random() * 16));
  return result;
}

function htmlUnescape(str) {
  if (!str) return "";
  return String(str)
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}

function stripHTML(value) {
  return String(value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function formatHot(value) {
  if (value == null || value === "") return "";
  var raw = String(value);
  if (raw.indexOf("万") >= 0) return raw;
  var num = Number(raw);
  if (!isFinite(num)) return raw;
  if (num >= 10000) return (num / 10000).toFixed(num >= 100000 ? 0 : 1).replace(/\.0$/, "") + "万热度";
  return Math.round(num) + "热度";
}

function imageURL(value) {
  var url = String(value || "").trim();
  if (!url) return "";
  if (url.indexOf("//") === 0) return "https:" + url;
  if (/^https?:\/\//i.test(url) || url.indexOf("data:image/") === 0) return url;
  if (url.indexOf("/") === 0) return "https://www.douyu.com" + url;
  return url;
}

function errorMessage(error) {
  return error && error.message ? error.message : String(error || "未知错误");
}

// ========== 请求封装 ==========

function defaultHeaders(url) {
  var headers = { "User-Agent": PC_UA, "Referer": url || WidgetMetadata.site };
  if (DOUYU_COOKIE) headers["Cookie"] = DOUYU_COOKIE;
  return headers;
}

function imageHeaders() {
  return { "Referer": WidgetMetadata.site, "User-Agent": MOBILE_UA };
}

async function request(url, opts) {
  opts = opts || {};
  if (!opts.headers) opts.headers = {};
  if (!opts.headers["User-Agent"]) opts.headers["User-Agent"] = PC_UA;
  if (!opts.headers["Referer"]) opts.headers["Referer"] = WidgetMetadata.site;
  if (DOUYU_COOKIE && !opts.headers["Cookie"]) opts.headers["Cookie"] = DOUYU_COOKIE;
  var res;
  if ((opts.method || "GET").toUpperCase() === "POST" || opts.body !== undefined) {
    var body = opts.body || "";
    delete opts.body;
    res = await Widget.http.post(url, body, opts);
  } else {
    res = await Widget.http.get(url, opts);
  }
  if (!res || res.data === undefined || res.data === null)
    throw new Error("无效响应 from " + url);
  return res;
}

// ========== 分类缓存 ==========

async function loadCategories() {
  var cached = null;
  if (typeof Widget.storage !== "undefined" && Widget.storage.get)
    cached = Widget.storage.get(CATE_CACHE_KEY);
  if (cached && cached.time && Date.now() - Number(cached.time) < CACHE_TTL_MS && cached.data)
    return cached.data;
  var res = await request("https://m.douyu.com/api/cate/list", {
    headers: { "User-Agent": MOBILE_UA, "Referer": "https://m.douyu.com/" }
  });
  var data = res.data;
  var result = {
    cate1Info: (data && data.data && data.data.cate1Info) || [],
    cate2Info: (data && data.data && data.data.cate2Info) || []
  };
  if (typeof Widget.storage !== "undefined" && Widget.storage.set)
    Widget.storage.set(CATE_CACHE_KEY, { time: Date.now(), data: result });
  return result;
}

async function findCate1(cate1Id) {
  var cats = await loadCategories();
  var found = null;
  for (var i = 0; i < cats.cate1Info.length; i++) {
    if (String(cats.cate1Info[i].cate1Id) === String(cate1Id)) {
      found = cats.cate1Info[i];
      break;
    }
  }
  return found || { cate1Id: cate1Id, cate1Name: "直播" };
}

async function firstSubCategory(cate1Id) {
  var cats = await loadCategories();
  for (var i = 0; i < cats.cate2Info.length; i++) {
    if (String(cats.cate2Info[i].cate1Id) === String(cate1Id))
      return cats.cate2Info[i];
  }
  return null;
}

// ========== 斗鱼签名 ==========

async function getEncryptJS(roomId) {
  var res = await request("https://www.douyu.com/swf_api/homeH5Enc?rids=" + roomId, {
    headers: { "Referer": "https://www.douyu.com/" + roomId }
  });
  var data = res.data;
  if (data && data.data && data.data["room" + roomId])
    return data.data["room" + roomId];
  return null;
}

function getDouyuSign(crptext, roomId) {
  try {
    var CryptoJS = {
      MD5: function(str) {
        var hash = md5(String(str));
        return { toString: function() { return hash; } };
      },
      enc: {
        Utf8: { parse: function(s) { return s; }, stringify: function(v) { return String(v); } },
        Hex: { parse: function(s) { return s; }, stringify: function(v) { return String(v); } }
      },
      lib: { WordArray: function() {} }
    };
    var time = Math.round(Date.now() / 1000);
    eval(crptext);
    return ub98484234(roomId, DOUYU_DID, time);
  } catch (e) {
    console.error("[DouyuSign] error: " + errorMessage(e));
    return "";
  }
}

// ========== 房间信息 ==========

async function getRoomInfo(roomId) {
  var res = await request("https://www.douyu.com/betard/" + roomId, {
    headers: { "Referer": "https://www.douyu.com/" + roomId }
  });
  var data = res.data;
  return data && data.room ? data.room : null;
}

// ========== 播放地址获取 ==========

async function requestPlayInfo(roomId, signData, rate, cdn) {
  var body = signData + "&cdn=" + encodeURIComponent(cdn || "")
    + "&rate=" + encodeURIComponent(String(rate == null ? 0 : rate))
    + "&ver=Douyu_223061205&iar=1&ive=1&hevc=0&fa=0";
  var res = await request("https://www.douyu.com/lapi/live/getH5Play/" + encodeURIComponent(roomId), {
    method: "POST",
    body: body,
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Referer": "https://www.douyu.com/" + roomId }
  });
  var result = res.data;
  if (!result || !result.data) return null;
  var d = result.data;
  return {
    raw: d,
    cdns: (d.cdnsWithName || []).map(function(item) { return String(item.cdn || ""); }).filter(Boolean),
    rates: d.multirates || []
  };
}

async function getPlayURL(roomId, signData, rate, cdn) {
  var info = await requestPlayInfo(roomId, signData, rate, cdn);
  var d = info && info.raw;
  if (!d || !d.rtmp_url || !d.rtmp_live) return null;
  var rtmpURL = String(d.rtmp_url || "");
  var rtmpLive = htmlUnescape(String(d.rtmp_live || ""));
  var flvUrl = rtmpURL + "/" + rtmpLive;
  var hlsUrl = "";
  if (d.hls_url && d.hls_live) {
    hlsUrl = String(d.hls_url) + "/" + htmlUnescape(String(d.hls_live));
  }
  return { hlsUrl: hlsUrl, flvUrl: flvUrl };
}

var SKIP_REDIRECT_PROBE_HEADER = "X-Forward-Skip-Redirect-Probe";

function buildPlaybackHeaders(roomId) {
  var headers = {
    "User-Agent": PC_UA,
    "Referer": "https://www.douyu.com/" + roomId
  };
  if (DOUYU_COOKIE) headers["Cookie"] = DOUYU_COOKIE;
  headers[SKIP_REDIRECT_PROBE_HEADER] = "1";
  return headers;
}

function buildVideoResource(roomId, name, url, description) {
  var container = "flv";
  var clean = String(url || "").split("?")[0].toLowerCase();
  if (clean.indexOf(".m3u8") >= 0) container = "m3u8";
  return {
    name: name,
    description: description,
    url: url,
    container: container,
    customHeaders: buildPlaybackHeaders(roomId),
    playerType: "app"
  };
}

// ========== 列表 ==========

function normalizeRoomItem(item) {
  var roomId = String(item.rid || item.roomId || item.room_id || item.id || "");
  var title = htmlUnescape(String(item.rn || item.roomName || item.room_name || item.title || ""));
  var nickname = htmlUnescape(String(item.nn || item.nickName || item.owner_name || item.nickname || ""));
  var poster = imageURL(item.rs16 || item.roomSrc || item.room_pic || item.pic || item.rs1 || item.avatar || "");
  var category = htmlUnescape(String(item.c2name || item.cate2Name || item.c2name_display || item.game_name || ""));
  var hot = item.ol || item.hn || item.hot || item.online || "";
  return {
    id: "douyu:room:" + roomId,
    type: "url",
    title: title,
    coverUrl: poster || PLACEHOLDER_IMAGE,
    backdropPath: poster || PLACEHOLDER_IMAGE,
    link: roomId,
    vod_remarks: nickname || category || formatHot(hot),
    description: (category ? category + " · " : "") + nickname + " - " + title,
    headers: imageHeaders(),
    posterHeaders: imageHeaders()
  };
}

// ========== 获取分类房间 ==========

async function fetchCateRooms(cate1Id, cate2Info, maxItems) {
  try {
    maxItems = maxItems || 8;
    var subCate = null;
    for (var i = 0; i < cate2Info.length; i++) {
      if (cate2Info[i].cate1Id === cate1Id) { subCate = cate2Info[i]; break; }
    }
    if (!subCate) return [];

    var res = await request("https://www.douyu.com/gapi/rkc/directory/mixList/2_" + subCate.cate2Id + "/1");
    var listData = res.data;
    var rl = (listData && listData.data && listData.data.rl) || [];
    var items = [];
    for (var i = 0; i < rl.length && items.length < maxItems; i++) {
      if (rl[i].type !== 1) continue;
      items.push(normalizeRoomItem(rl[i]));
    }
    return items;
  } catch (e) {
    console.error("[fetchCateRooms] error: " + errorMessage(e));
    return [];
  }
}

// ========== 推荐列表 ==========

async function loadRecommended(params) {
  try {
    DOUYU_COOKIE = params.douyuCookie || "";

    // genreId 路由（从详情页分类标签点进来）
    if (params.genreId) {
      return await loadCategoryRooms(params.genreId, params.page || 1);
    }

    var selectedCate = params.sort_by || "all";
    if (selectedCate !== "all") {
      return await loadCategoryRooms(selectedCate, params.page || 1);
    }

    var page = Number(params.page || 1);

    if (page > 1) {
      // 翻页使用全站推荐
      var res = await request("https://www.douyu.com/japi/weblist/apinc/allpage/6/" + page);
      var data = res.data;
      var rl = (data && data.data && data.data.rl) || [];
      return parseRoomList(rl);
    }

    // 首页：分类聚合
    var cats = await loadCategories();
    if (!cats || !cats.cate1Info || cats.cate1Info.length === 0) {
      var fbRes = await request("https://www.douyu.com/japi/weblist/apinc/allpage/6/1");
      var fbData = fbRes.data;
      var fbRl = (fbData && fbData.data && fbData.data.rl) || [];
      return parseRoomList(fbRl);
    }

    var maxCates = Math.min(cats.cate1Info.length, 6);
    var promises = [];
    for (var c = 0; c < maxCates; c++) {
      promises.push(fetchCateRooms(cats.cate1Info[c].cate1Id, cats.cate2Info || [], 4));
    }
    var results = await Promise.all(promises);
    var allRooms = [];
    for (var r = 0; r < results.length; r++) {
      allRooms = allRooms.concat(results[r]);
    }
    return allRooms;
  } catch (error) {
    console.error("[loadRecommended] 失败:", errorMessage(error));
    throw error;
  }
}

async function loadCategoryRooms(typeId, page) {
  if (!page) page = 1;
  var res = await request("https://www.douyu.com/gapi/rkc/directory/mixList/2_" + typeId + "/" + page);
  var rs = res.data;
  var rl = (rs && rs.data && rs.data.rl) || [];
  return parseRoomList(rl);
}

function parseRoomList(rl) {
  var items = [];
  for (var i = 0; i < rl.length; i++) {
    if (rl[i].type !== 1) continue;
    items.push(normalizeRoomItem(rl[i]));
  }
  return items;
}

// ========== 详情 ==========

async function loadDetail(link) {
  try {
    var roomId = String(link);
    var room = await getRoomInfo(roomId);
    if (!room) throw new Error("无法获取房间信息: " + roomId);

    var title = htmlUnescape(String(room.room_name || "斗鱼房间 " + roomId));
    var nickname = htmlUnescape(String(room.owner_name || ""));
    var poster = imageURL(room.room_pic || room.roomSrc || "");
    var avatar = imageURL(room.owner_avatar || room.avatar || "");
    var category = htmlUnescape(String(room.cate2_name || room.game_name || room.c2name || ""));
    var isLive = Number(room.show_status || 0) === 1 && Number(room.videoLoop || 0) !== 1;
    var description = htmlUnescape(stripHTML(String(room.show_details || room.description || "")));

    var genreItems = [];
    var cateId = room.cate_id || room.cate1_id || room.game_id || "";
    var cateName = room.second_lvl_name || room.cate_name || room.game_name || "";
    if (cateId && cateName) {
      genreItems.push({ id: String(cateId), title: cateName });
    }

    var peoples = [];
    if (nickname) peoples.push({ id: nickname, title: nickname, role: "主播" });

    return {
      id: "douyu:room:" + roomId,
      type: "url",
      title: title,
      coverUrl: poster || avatar || PLACEHOLDER_IMAGE,
      posterPath: poster || avatar || PLACEHOLDER_IMAGE,
      detailPoster: poster || avatar || PLACEHOLDER_IMAGE,
      backdropPath: poster || PLACEHOLDER_IMAGE,
      link: roomId,
      description: description || (isLive ? "直播中 · " + (category || "") : "未开播"),
      genreItems: genreItems,
      peoples: peoples,
      vod_remarks: isLive ? "直播中" : "未开播",
      headers: imageHeaders(),
      posterHeaders: imageHeaders()
    };
  } catch (error) {
    console.error("[loadDetail] 失败:", errorMessage(error));
    return null;
  }
}

// ========== 搜索 ==========

async function searchRooms(params) {
  try {
    DOUYU_COOKIE = params.douyuCookie || "";
    var keyword = params.keyword;
    var page = Number(params.page || 1);
    if (!keyword) throw new Error("请输入搜索关键词");

    var did = generateRandomHex(32);
    var url = "https://www.douyu.com/japi/search/api/searchShow?kw=" +
      encodeURIComponent(keyword) + "&page=" + page + "&pageSize=20";

    var res = await request(url, {
      headers: {
        "Referer": "https://www.douyu.com/search/",
        "Cookie": "dy_did=" + did + ";acf_did=" + did
      }
    });
    var result = res.data;

    if (result && result.error !== 0) {
      throw new Error("搜索API错误: " + (result.msg || "未知错误"));
    }

    var relateShow = (result && result.data && result.data.relateShow) || [];
    var items = [];
    for (var i = 0; i < relateShow.length; i++) {
      var item = relateShow[i];
      items.push({
        id: "douyu:room:" + String(item.rid || ""),
        type: "url",
        title: String(item.roomName || ""),
        coverUrl: imageURL(item.roomSrc || ""),
        posterPath: imageURL(item.roomSrc || ""),
        backdropPath: imageURL(item.roomSrc || ""),
        link: String(item.rid || ""),
        vod_remarks: String(item.nickName || ""),
        description: String(item.nickName || "") + " - " + String(item.roomName || ""),
        headers: imageHeaders(),
        posterHeaders: imageHeaders()
      });
    }
    return items;
  } catch (error) {
    console.error("[searchRooms] 失败:", errorMessage(error));
    throw error;
  }
}

// ========== 直播流获取 ==========

async function loadResource(params) {
  try {
    params = params || {};
    DOUYU_COOKIE = params.douyuCookie || "";
    var roomId = String(params.link || params.roomId || "").trim();
    if (!roomId) throw new Error("缺少房间ID");

    var room = await getRoomInfo(roomId);
    if (!room) throw new Error("无法获取房间信息: " + roomId);

    var isLive = Number(room.show_status || 0) === 1 && Number(room.videoLoop || 0) !== 1;
    if (!isLive) return [];

    var crptext = await getEncryptJS(roomId);
    if (!crptext) throw new Error("无法获取签名脚本: " + roomId);

    var signData = getDouyuSign(crptext, roomId);
    if (!signData) throw new Error("无法生成播放签名: " + roomId);

    var roomName = String(room.room_name || "");
    var ownerName = String(room.owner_name || "");
    var description = ownerName ? (ownerName + " - " + roomName) : roomName;

    // 发现请求 — 获取所有可用码率和 CDN
    var discInfo = await requestPlayInfo(roomId, signData, -1, "");
    if (!discInfo) return [];

    // CDN 排序：scdn 放最后
    var cdns = discInfo.cdns.sort(function(a, b) {
      var aS = a.indexOf("scdn") === 0 ? 1 : 0;
      var bS = b.indexOf("scdn") === 0 ? 1 : 0;
      return aS - bS;
    });

    // 码率按降序排列（原画优先）
    var rates = discInfo.rates.sort(function(a, b) { return (b.rate || 0) - (a.rate || 0); });

    var resources = [];
    for (var ri = 0; ri < rates.length; ri++) {
      var rateVal = rates[ri].rate || 0;
      var rateName = String(rates[ri].name || "未知");

      var url = null;
      // 每档码率先尝试所有 CDN
      for (var ci = 0; ci < cdns.length; ci++) {
        var playInfo = await getPlayURL(roomId, signData, rateVal, cdns[ci]);
        if (playInfo) {
          // FLV 优先，其次 HLS
          url = playInfo.flvUrl || playInfo.hlsUrl;
          if (url) break;
        }
      }
      // 如果都没拿到，试空 CDN
      if (!url) {
        var playInfo2 = await getPlayURL(roomId, signData, rateVal, "");
        if (playInfo2) url = playInfo2.flvUrl || playInfo2.hlsUrl;
      }

      if (url) {
        resources.push(buildVideoResource(roomId, rateName, url, description));
      }
    }

    return resources;
  } catch (error) {
    console.error("[loadResource] 失败:", errorMessage(error));
    throw error;
  }
}
