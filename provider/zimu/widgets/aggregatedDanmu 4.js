WidgetMetadata = {
  id: "forward.danmu.aggregated",
  title: "多平台弹幕聚合",
  version: "3.2.0",
  requiredVersion: "0.0.2",
  description: "AI 匹配搜索结果 → 全平台弹幕并发下载 → 六层智能聚合 → 规则过滤 → 统一导出",
  author: "tzb360",
  site: "https://github.com/InchStudio/ForwardWidgets",
  globalParams: [
    {
      name: "apiBase",
      title: "API 地址",
      type: "input",
      value: "",
      description: "danmu_api 服务地址"
    },
    {
      name: "aiApiKey",
      title: "AI API Key",
      type: "input",
      value: "",
      description: "DeepSeek / OpenAI Compatible API 密钥。仅用于搜索结果匹配，不参与弹幕内容处理。"
    },
    {
      name: "aiBaseUrl",
      title: "AI API 地址",
      type: "input",
      value: "https://api.deepseek.com",
      description: "OpenAI Compatible API 地址"
    },
    {
      name: "aiModel",
      title: "AI 模型",
      type: "input",
      value: "deepseek-chat",
      description: "模型名称"
    },
    {
      name: "enableDedup",
      title: "智能聚合去重",
      type: "enumeration",
      value: "1",
      description: "六层聚合：完全重复、跨平台重复、前缀合并、重复字符压缩、标点统一、空格统一",
      enumOptions: [{ title: "开启", value: "1" }, { title: "关闭", value: "0" }]
    },
    {
      name: "enableFilter",
      title: "弹幕过滤",
      type: "enumeration",
      value: "1",
      description: "规则过滤：日期/时间/打卡/考古/N刷/年份/第一/沙发/前排/广告/重复字符/纯符号",
      enumOptions: [{ title: "开启", value: "1" }, { title: "关闭", value: "0" }]
    },
    {
      name: "filterTemplate",
      title: "过滤模板",
      type: "enumeration",
      value: "default",
      enumOptions: [
        { title: "默认", value: "default" },
        { title: "电影模式", value: "movie" },
        { title: "动漫模式", value: "anime" },
        { title: "直播回放模式", value: "live" },
        { title: "极简模式", value: "minimal" },
        { title: "自定义1", value: "custom1" },
        { title: "自定义2", value: "custom2" },
        { title: "自定义3", value: "custom3" }
      ]
    },
    {
      name: "customKeywords",
      title: "自定义过滤关键词",
      type: "input",
      value: "",
      description: "逗号分隔"
    },
    {
      name: "customRegex",
      title: "自定义正则表达式",
      type: "input",
      value: "",
      description: "JS 正则字符串"
    },
    {
      name: "repeatThreshold",
      title: "重复字符阈值",
      type: "input",
      value: "5",
      description: "连续相同字符超过此数则压缩或过滤"
    },
    {
      name: "diagMode",
      title: "诊断模式",
      type: "enumeration",
      value: "0",
      enumOptions: [{ title: "关闭", value: "0" }, { title: "开启", value: "1" }]
    }
  ],
  modules: [
    { id: "searchDanmu", title: "搜索弹幕", functionName: "searchDanmu", type: "danmu", params: [] },
    { id: "getDetail", title: "获取详情", functionName: "getDetailById", type: "danmu", params: [] },
    { id: "getComments", title: "获取弹幕", functionName: "getCommentsById", type: "danmu", params: [] },
    { id: "getDanmuWithSegmentTime", title: "获取指定时刻弹幕", functionName: "getDanmuWithSegmentTime", type: "danmu", params: [] }
  ]
};

var CACHE_PREFIX = "agdm3_";
var DEDUP_TIME_WINDOW = 0.2;
var FONT_STD = 25;
var COLOR_DEFAULT = 16777215;
var MODE_SCROLL = 1;
var MODE_BOTTOM = 4;
var MODE_TOP = 5;

var FILTER_TEMPLATES = {
  "default": { date: 1, time: 1, sign: 1, year: 1, nshua: 1, first: 1, checkin: 1, ad: 1, repeat: 1, symbol: 1, repeatThresh: 5, keywords: "", regex: "" },
  "movie":   { date: 1, time: 1, sign: 1, year: 1, nshua: 1, first: 1, checkin: 1, ad: 1, repeat: 1, symbol: 1, repeatThresh: 5, keywords: "", regex: "" },
  "anime":   { date: 1, time: 1, sign: 1, year: 1, nshua: 1, first: 0, checkin: 1, ad: 1, repeat: 0, symbol: 1, repeatThresh: 8, keywords: "前方高能", regex: "" },
  "live":    { date: 1, time: 1, sign: 1, year: 0, nshua: 0, first: 0, checkin: 1, ad: 1, repeat: 0, symbol: 1, repeatThresh: 8, keywords: "", regex: "" },
  "minimal": { date: 0, time: 0, sign: 0, year: 0, nshua: 0, first: 0, checkin: 0, ad: 1, repeat: 0, symbol: 0, repeatThresh: 8, keywords: "", regex: "" }
};

var FILTER_PATTERNS = {
  date: /(\d{4}[\u5e74.\-\/]\d{1,2}[\u6708.\-\/]?\d{0,2}[\u65e5\u53f7]?|\d{1,2}[\u6708.\-\/]\d{1,2}[\u65e5\u53f7]?|\d{1,2}\.\d{1,2}|\d{4}-\d{2}-\d{2}|\d{2,4}\/\d{1,2}\/\d{1,2})/,
  time: /^[\s]*(\d{1,3}:\d{2}(:\d{2})?)[\s]*$/,
  sign: /(\u6253\u5361|\u7b7e\u5230|\u7559\u540d|\u8003\u53e4|\u6316\u575f|\u7559\u5ff5|[\d\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d\u5341]\u5237|\u524d\u6765\u6253\u5361|\u5230\u6b64\u4e00\u6e38|\u8def\u8fc7|\u7eaa\u5ff5|\u56de\u5fc6|\u56de\u987e|\u91cd\u6e29|\u590d\u4e60|\u91cd\u5237|\u518d\u770b|\u5728\u770b)/,
  year: /(\d{4}[\u5e74]?\u6765\u7684|\u8fd8\u6709\u4eba\u5417|\u672a\u6765\u4eba|\u5341\u5e74[\u524d\u540e]|\u51e0\u5e74[\u524d\u540e]|\d+\u5e74[\u524d\u540e])/,
  nshua: /(\d[\u5237]|[\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d\u5341][\u5237]|n\u5237|N\u5237)/,
  first: /^(\u7b2c\u4e00|\u9996\u8bc4|\u6c99\u53d1|\u524d\u6392|\u5360\u697c|\u62a2|\u5730\u677f|\u677f\u51f3|\u6211\u7684|\u6765\u4e86|\u7b2c\u4e00[\u4e2a\u540d]|\u524d\u6392\u56f4\u89c2|\u672b\u6392|\u540e\u6392|\u677f\u51f3|\u8e72)/,
  checkin: /^(\u7b7e\u5230|\u62a5\u5230|\u62a5\u9053|\u6709\u4eba\u5417|\u8fd8\u6709\u4eba\u5417|\u96c6\u5408|\u4e3e\u624b|\u5192\u6ce1|\u5728\u7684|\u6765\u4e86\u6765\u4e86|\u5230\u4e86|\u6211\u5728|\u6765\u5566|\u56de\u6765|\u8865\u5267|\u65b0\u4eba|\u5165\u5751)/,
  ad: /(QQ\u7fa4|\u5fae\u4fe1|\u516c\u4f17\u53f7|\u52a0[Vv]|\u9080\u8bf7\u7801|\u626b\u7801|\u76f4\u64ad\u95f4|\u5173\u6ce8|\u7c89[\u4e1d\u6211]|\u70b9\u8d5e|\u6295\u5e01|\u7f51\u5740|http|\u4e09\u8fde|\u5305\u517b|DVD|\u52a0\u5fae|\u52a0Q)/,
  symbol: /^[\u3002\uff0c\uff1b\uff1a\uff01\uff1f\u2026\u3001\uff5e\~\`\!\@\#\$\%\^\&\*\(\)\-\+\=\[\]\{\}\\\|\;\:\'\"\,\.\<\>\/\?\s\u2605\u2606\u2665\u2666\u2660\u2663\u25c6\u25c7\u25a0\u25a1\u25cb\u25cf\u2600\u2601\u2615\u00b0]+$/
};

var SOURCE_LABELS = {
  "bilibili": "B站", "Bilibili": "B站",
  "tencent": "腾讯视频", "qq": "腾讯视频",
  "iqiyi": "爱奇艺", "qiyi": "爱奇艺",
  "youku": "优酷",
  "imgo": "芒果TV", "mgtv": "芒果TV",
  "migu": "咪咕",
  "sohu": "搜狐",
  "leshi": "乐视",
  "360": "360影视",
  "xigua": "西瓜视频",
  "maiduidui": "埋堆堆",
  "aiyifan": "爱壹帆",
  "renren": "人人影视",
  "hanjutv": "韩剧TV",
  "bahamut": "巴哈姆特",
  "dandan": "弹弹play", "dandanplay": "弹弹play",
  "animeko": "Animeko",
  "douban": "豆瓣", "tmdb": "TMDB", "fongmi": "fongmi"
};

function ck(type, id) { return CACHE_PREFIX + type + "_" + String(id); }
function isDiag(p) { return String(p.diagMode || "0") === "1"; }
function getTO(p) { var t = Number(p.timeout) || 15; if (t < 5) t = 5; if (t > 120) t = 120; return t * 1000; }
function apiUrl(p) { return String(p.apiBase || "").trim().replace(/\/+$/, ""); }
function httpHd(tk) { var h = { "Content-Type": "application/json", "User-Agent": "ForwardWidgets/3.2.0" }; if (tk) h["Authorization"] = "Bearer " + tk; return h; }

function normTitle(t) {
  return String(t || "").toLowerCase().replace(/from\s*\w+$/i, "").replace(/[\s\-_.\u00B7\u2022\u30FB()\uff08\uff09\[\]\u3010\u3011]/g, "").replace(/第[一二三四五六七八九十百千万\d]+[季部期]/g, "").trim();
}

function coreTitle(t) {
  return String(t || "").replace(/\s*from\s*\w+\s*$/i, "").replace(/\s*【[^】]*】\s*/g, "").replace(/\s*\((\d{4})\)/, " ($1)").trim();
}

function groupKey(title) {
  return "grp:" + String(title || "").replace(/\s+/g, "_").toLowerCase();
}

function storeSourceGroup(gk, sources) {
  Widget.storage.set(ck("grp", gk), sources, 86400);
}

function getSourceGroup(gk) {
  var s = Widget.storage.get(ck("grp", gk));
  return (s && Array.isArray(s)) ? s : null;
}

function srcLabel(n) {
  if (!n) return "unknown";
  return SOURCE_LABELS[n] || n;
}

function makeComment(time, mode, color, size, text, source) {
  if (mode < 1 || mode > 8) mode = MODE_SCROLL;
  return {
    _t: time, _m: mode, _c: color, _s: size || FONT_STD,
    _x: text, _src: source || "", _normalized: "",
    p: time + "," + mode + "," + (color || COLOR_DEFAULT) + "," + (size || FONT_STD),
    m: text
  };
}

function parseComment(raw, source) {
  var t = 0, m = MODE_SCROLL, co = COLOR_DEFAULT, sz = FONT_STD, tx = "";
  if (Array.isArray(raw)) {
    t = Number(raw[0]) || 0;
    m = Number(raw[1]) || MODE_SCROLL;
    co = Number(raw[2]) || COLOR_DEFAULT;
    sz = Number(raw[3]) || FONT_STD;
    tx = String(raw[4] || raw[raw.length - 1] || "");
  } else if (raw && typeof raw === "object") {
    if (raw.p !== undefined) {
      var pa = String(raw.p).split(",");
      t = Number(pa[0]) || 0;
      m = Number(pa[1]) || MODE_SCROLL;
      sz = Number(pa[2]) || FONT_STD;
      co = Number(pa[3]) || COLOR_DEFAULT;
    } else {
      t = Number(raw.time || raw.t) || 0;
      m = Number(raw.mode || raw.m) || MODE_SCROLL;
      co = Number(raw.color) || COLOR_DEFAULT;
      sz = Number(raw.size) || FONT_STD;
    }
    tx = String(raw.m || raw.content || raw.message || raw.text || "");
  }
  return makeComment(t, m, co, sz, tx, source);
}

function sortPool(pool) {
  if (pool && pool.length > 1) pool.sort(function(a, b) { return a._t - b._t; });
  return pool;
}

function normalizeText(text) {
  var s = text;
  s = s.replace(/\s+/g, "");
  s = s.replace(/[\uff01\uff1f]/g, function(m) { return m === "\uff01" ? "!" : "?"; });
  s = s.replace(/[\uff0c\u3001]/g, ",");
  s = s.replace(/\u3002/g, ".");
  s = s.replace(/[\uff1b\uff1a]/g, ":");
  s = s.replace(/[\u201c\u201d\u300e\u300f]/g, "\"");
  s = s.replace(/[\u2018\u2019]/g, "'");
  s = s.replace(/[\uff5e]/g, "~");
  s = s.replace(/\u3000/g, " ");
  s = s.trim();
  return s;
}

function compressRepeats(text, maxR) {
  if (!maxR || maxR < 2) maxR = 4;
  var out = "", i = 0;
  while (i < text.length) {
    var ch = text[i], count = 1;
    while (i + count < text.length && text[i + count] === ch) count++;
    if (count > maxR) { for (var r = 0; r < maxR; r++) out += ch; }
    else { for (var r2 = 0; r2 < count; r2++) out += text[i + r2]; }
    i += count;
  }
  return out;
}

function hasRepeatChars(text, threshold) {
  if (!text || text.length < 2) return false;
  var count = 1;
  for (var i = 1; i < text.length; i++) { if (text[i] === text[i - 1]) count++; else count = 1; if (count >= threshold) return true; }
  return false;
}

function smartDedup(pool) {
  if (!pool || pool.length === 0) return { result: pool, exact: 0, cross: 0, prefix: 0, compressed: 0 };

  var stats = { exact: 0, cross: 0, prefix: 0, compressed: 0 };

  var seen = {}, stage1 = [];
  for (var i = 0; i < pool.length; i++) {
    var c = pool[i];
    var key = c._t.toFixed(2) + "|" + c._x;
    if (seen[key]) { stats.exact++; continue; }
    seen[key] = true;
    stage1.push(c);
  }

  var buckets = {};
  for (var j = 0; j < stage1.length; j++) {
    var bk = Math.floor(stage1[j]._t / DEDUP_TIME_WINDOW);
    if (!buckets[bk]) buckets[bk] = [];
    buckets[bk].push(stage1[j]);
  }

  var stage2 = [];
  for (var bi in buckets) {
    var bucket = buckets[bi], bkNum = parseInt(bi);
    var filtered = [];
    for (var bi2 = 0; bi2 < bucket.length; bi2++) {
      var item = bucket[bi2], dup = false;
      for (var fi = 0; fi < filtered.length; fi++) {
        var pf = filtered[fi];
        if (Math.abs(item._t - pf._t) <= DEDUP_TIME_WINDOW) {
          if (item._x === pf._x) { dup = true; stats.cross++; break; }
          if (pf._x.length > 1 && item._x.length > 1) {
            var pfIsRepeat = hasRepeatChars(pf._x, 5);
            var itemIsRepeat = hasRepeatChars(item._x, 5);
            if (!pfIsRepeat && !itemIsRepeat) {
              if (item._x.indexOf(pf._x) === 0) {
                pf._x = item._x; pf._t = item._t; pf._c = item._c; pf._m = item._m; pf._s = item._s; pf._src = item._src;
                pf.m = item.m; pf.p = item.p;
                dup = true; stats.prefix++; break;
              }
              if (pf._x.indexOf(item._x) === 0) { dup = true; stats.prefix++; break; }
            }
          }
        }
      }
      if (!dup) {
        var prevB = buckets[bkNum - 1];
        if (prevB) {
          for (var pbi = 0; pbi < prevB.length; pbi++) {
            var pp = prevB[pbi];
            if (item._t - pp._t <= DEDUP_TIME_WINDOW && item._x === pp._x) { dup = true; stats.cross++; break; }
          }
        }
      }
      if (!dup) filtered.push(item);
    }
    for (var fi2 = 0; fi2 < filtered.length; fi2++) stage2.push(filtered[fi2]);
  }

  var stage3 = [];
  for (var k = 0; k < stage2.length; k++) {
    var sc = stage2[k];
    var orig = sc._x;
    var norm = normalizeText(orig);
    var comp = compressRepeats(norm, 4);
    if (comp !== norm) stats.compressed++;
    sc._normalized = comp;
    sc._x = comp;
    sc.m = comp;
    stage3.push(sc);
  }

  return { result: stage3, exact: stats.exact, cross: stats.cross, prefix: stats.prefix, compressed: stats.compressed };
}

function loadFilterConfig(params) {
  var cfg = { date: 1, time: 1, sign: 1, year: 1, nshua: 1, first: 1, checkin: 1, ad: 1, repeat: 1, symbol: 1, repeatThresh: 5, keywords: "", regex: "" };
  var tn = params.filterTemplate || "default";
  var tpl = FILTER_TEMPLATES[tn];
  if (!tpl) {
    var saved = Widget.storage.get("agdm3_tpl");
    if (saved && saved[tn]) tpl = saved[tn];
  }
  if (!tpl) tpl = FILTER_TEMPLATES["default"];

  for (var k in tpl) {
    if (k === "repeatThresh") cfg.repeatThresh = parseInt(tpl[k]) || 5;
    else if (tpl[k] !== undefined) cfg[k] = tpl[k];
  }

  if (params.repeatThreshold) cfg.repeatThresh = parseInt(params.repeatThreshold) || 5;
  if (params.customKeywords) cfg.keywords = String(params.customKeywords).trim();
  if (params.customRegex) cfg.regex = String(params.customRegex).trim();

  return cfg;
}

function filterPool(pool, params, fStats) {
  if (!pool || !pool.length) return pool;
  if (String(params.enableFilter || "1") !== "1") return pool;

  var cfg = loadFilterConfig(params);
  var cats = ["date", "time", "sign", "year", "nshua", "first", "checkin", "ad", "repeat", "symbol"];
  for (var ci = 0; ci < cats.length; ci++) fStats[cats[ci]] = 0;
  fStats.custom = 0;

  var ckList = cfg.keywords ? cfg.keywords.split(/[,，、\s]+/) : [];
  var crx = null;
  if (cfg.regex) { try { crx = new RegExp(cfg.regex); } catch (e) { crx = null; } }

  var result = [];
  for (var i = 0; i < pool.length; i++) {
    var c = pool[i], text = c._x, filtered = false, cat = "";

    if (cfg.date && FILTER_PATTERNS.date.test(text) && text.length < 30) { filtered = true; cat = "date"; }
    else if (cfg.time && FILTER_PATTERNS.time.test(text)) { filtered = true; cat = "time"; }
    else if (cfg.sign && FILTER_PATTERNS.sign.test(text)) { filtered = true; cat = "sign"; }
    else if (cfg.year && FILTER_PATTERNS.year.test(text)) { filtered = true; cat = "year"; }
    else if (cfg.nshua && FILTER_PATTERNS.nshua.test(text)) { filtered = true; cat = "nshua"; }
    else if (cfg.first && FILTER_PATTERNS.first.test(text)) { filtered = true; cat = "first"; }
    else if (cfg.checkin && FILTER_PATTERNS.checkin.test(text)) { filtered = true; cat = "checkin"; }
    else if (cfg.ad && FILTER_PATTERNS.ad.test(text)) { filtered = true; cat = "ad"; }
    else if (cfg.repeat && hasRepeatChars(text, cfg.repeatThresh)) { filtered = true; cat = "repeat"; }
    else if (cfg.symbol && FILTER_PATTERNS.symbol.test(text)) { filtered = true; cat = "symbol"; }

    if (!filtered) {
      for (var ki = 0; ki < ckList.length; ki++) {
        if (ckList[ki] && text.indexOf(ckList[ki]) !== -1) { filtered = true; cat = "custom"; break; }
      }
    }
    if (!filtered && crx && crx.test(text)) { filtered = true; cat = "custom"; }

    if (filtered) fStats[cat]++; else result.push(c);
  }
  return result;
}

function buildEpIndex(bgData, animeId) {
  if (!bgData || !bgData.bangumi || !Array.isArray(bgData.bangumi.episodes)) return;
  var idx = Widget.storage.get(ck("ep_idx", "all"));
  if (!idx || typeof idx !== "object") idx = {};
  var eps = bgData.bangumi.episodes;
  for (var i = 0; i < eps.length; i++) {
    var ep = eps[i], cid = String(ep.commentId || ep.episodeId || "");
    if (!cid) continue;
    idx[cid] = {
      animeId: String(animeId),
      animeTitle: bgData.bangumi.animeTitle || "",
      animeSource: bgData.bangumi.source || "",
      episodeIndex: i,
      episodeTitle: ep.episodeTitle || ""
    };
  }
  Widget.storage.set(ck("ep_idx", "all"), idx, 86400);
}

function getEpByCid(cid) {
  var idx = Widget.storage.get(ck("ep_idx", "all"));
  if (!idx || typeof idx !== "object") return null;
  return idx[String(cid)] || null;
}

function buildTitleIndex(animes) {
  var idx = Widget.storage.get(ck("title_idx", "all"));
  if (!idx || typeof idx !== "object") idx = {};
  for (var i = 0; i < animes.length; i++) {
    var a = animes[i], n = normTitle(a.animeTitle || "");
    if (!n) continue;
    if (!idx[n]) idx[n] = [];
    var aid = String(a.animeId), ex = false;
    for (var j = 0; j < idx[n].length; j++) {
      if (String(idx[n][j].animeId) === aid) { ex = true; break; }
    }
    if (!ex) idx[n].push(a);
  }
  Widget.storage.set(ck("title_idx", "all"), idx, 86400);
}

function findRelated(title, currentAnimeId) {
  var idx = Widget.storage.get(ck("title_idx", "all"));
  if (!idx || typeof idx !== "object") return [];
  var norm = normTitle(title);
  if (!norm) return [];
  var results = [], seen = {};
  var add = function(a) { var id = String(a.animeId); if (!seen[id]) { seen[id] = true; results.push(a); } };

  if (idx[norm]) {
    for (var i = 0; i < idx[norm].length; i++) add(idx[norm][i]);
  }

  if (results.length === 0) {
    for (var k in idx) {
      if (k.indexOf(norm) !== -1 || norm.indexOf(k) !== -1) {
        var arr = idx[k];
        for (var j = 0; j < arr.length; j++) add(arr[j]);
      }
    }
  }

  if (currentAnimeId && !seen[String(currentAnimeId)]) {
    var bgCk = ck("bg", String(currentAnimeId));
    var bgData = Widget.storage.get(bgCk);
    if (bgData && bgData.bangumi) {
      add({
        animeId: String(currentAnimeId),
        animeTitle: bgData.bangumi.animeTitle || title,
        source: bgData.bangumi.source || ""
      });
    }
  }
  return results;
}

function buildAiPrompt(animes, params) {
  var titles = [];
  for (var i = 0; i < animes.length; i++) {
    var a = animes[i];
    var yr = "";
    if (a.startDate) {
      var d = new Date(a.startDate);
      if (!isNaN(d.getTime())) yr = d.getFullYear();
    }
    titles.push("[" + i + "] " + (a.animeTitle || "") + (yr ? " (" + yr + ")" : ""));
  }

  var seriesName = params.seriesName || "";
  var type = params.type || "";
  var season = params.season || "";
  var episode = params.episode || "";

  var lines = [];
  lines.push("你是一个搜索结果匹配器。唯一任务：判断以下搜索结果中，哪些属于当前正在播放的媒体。");
  lines.push("");
  lines.push("当前媒体信息：");
  lines.push("  搜索关键词：" + (params.title || ""));
  if (seriesName) lines.push("  剧名：" + seriesName);
  if (type) lines.push("  类型：" + (type === "movie" ? "电影" : "电视剧/动漫"));
  if (season) lines.push("  季：" + season);
  if (episode) lines.push("  集：" + episode);

  lines.push("");
  lines.push("搜索结果：");
  for (var j = 0; j < titles.length; j++) lines.push(titles[j]);

  lines.push("");
  lines.push("匹配规则：");
  lines.push("1. 标题语义 + 年份 必须匹配当前媒体");
  lines.push("2. 类型(电影/剧集)必须匹配");
  lines.push("3. 排除：幕后纪录片、花絮、首映礼、特别节目、访谈、番外、预告片");
  lines.push("4. 排除：同系列不同部（如搜索第1部但排除第2部）");
  lines.push("5. 同一作品的多平台版本 → 全部保留");
  lines.push("");
  lines.push("严格输出 JSON，不要任何其他文字：");
  lines.push('{"keep":[5,6,7]}');

  return lines.join("\n");
}

async function aiFilterAnimes(animes, params) {
  var apiKey = String(params.aiApiKey || "").trim();
  if (!apiKey) {
    console.log("[聚合] AI 匹配：未配置 API Key，跳过，保留 " + animes.length + " 个结果");
    return animes;
  }
  if (animes.length <= 1) {
    console.log("[聚合] AI 匹配：仅 " + animes.length + " 个结果，跳过");
    return animes;
  }

  var baseUrl = String(params.aiBaseUrl || "https://api.deepseek.com").trim().replace(/\/+$/, "");
  var model = String(params.aiModel || "deepseek-chat").trim();
  var prompt = buildAiPrompt(animes, params);

  var requestBody = {
    model: model,
    messages: [
      { role: "system", content: "你是一个精确的搜索结果匹配器。只输出 JSON，不要解释。" },
      { role: "user", content: prompt }
    ],
    temperature: 0,
    max_tokens: 256
  };

  console.log("━━━ AI 搜索结果匹配 ━━━");
  console.log("[AI] Provider: " + baseUrl);
  console.log("[AI] Model: " + model);
  console.log("[AI] 匹配前结果数: " + animes.length);
  console.log("[AI] Prompt:");
  console.log(prompt);
  console.log("[AI] Request Payload:");
  console.log(JSON.stringify(requestBody, null, 2));

  var apiStart = Date.now();
  var response = null;

  try {
    response = await Widget.http.post(baseUrl + "/chat/completions", JSON.stringify(requestBody), {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey,
        "User-Agent": "ForwardWidgets/3.2.0"
      },
      timeout: 15000
    });
  } catch (e) {
    console.log("[AI] Exception: " + (e.message || e));
    console.log("[AI] 请求失败，保留全部 " + animes.length + " 个结果");
    return animes;
  }

  var latency = Date.now() - apiStart;
  console.log("[AI] Latency: " + latency + "ms");
  console.log("[AI] HTTP Status: " + (response.status || "unknown"));

  var respData = response.data;
  if (!respData) {
    console.log("[AI] Response: (empty)");
    console.log("[AI] 空响应，保留全部 " + animes.length + " 个结果");
    return animes;
  }

  console.log("[AI] Response Payload:");
  console.log(JSON.stringify(respData, null, 2));

  if (respData.error) {
    console.log("[AI] API Error: " + JSON.stringify(respData.error));
    console.log("[AI] API 返回错误，保留全部 " + animes.length + " 个结果");
    return animes;
  }

  if (!respData.choices || !respData.choices.length) {
    console.log("[AI] 无 choices 字段，保留全部 " + animes.length + " 个结果");
    return animes;
  }

  var content = String((respData.choices[0].message || {}).content || "");
  console.log("[AI] Completion: " + content);

  var jsonMatch = content.match(/\{[\s\S]*"keep"[\s\S]*\}/);
  if (!jsonMatch) {
    console.log("[AI] 无法提取 JSON，保留全部 " + animes.length + " 个结果");
    return animes;
  }

  var parsed = null;
  try { parsed = JSON.parse(jsonMatch[0]); } catch (pe) {
    console.log("[AI] JSON 解析失败: " + (pe.message || pe));
    return animes;
  }

  if (!parsed || !Array.isArray(parsed.keep) || parsed.keep.length === 0) {
    console.log("[AI] keep 无效，保留全部 " + animes.length + " 个结果");
    return animes;
  }

  var filtered = [];
  for (var idx = 0; idx < parsed.keep.length; idx++) {
    var i = parseInt(parsed.keep[idx], 10);
    if (i >= 0 && i < animes.length) filtered.push(animes[i]);
  }

  if (filtered.length === 0) {
    console.log("[AI] 匹配结果为空，保留全部 " + animes.length + " 个结果");
    return animes;
  }

  console.log("[AI] 匹配完成: " + animes.length + " → " + filtered.length);
  console.log("[AI] 保留结果:");
  for (var f = 0; f < filtered.length; f++) console.log("  - " + filtered[f].animeTitle);
  return filtered;
}

async function fetchBangumi(anime, srv, tkn, timeout) {
  try {
    var bgCk = ck("bg", String(anime.animeId));
    var cached = Widget.storage.get(bgCk);
    if (cached && cached.bangumi) return { ok: true, anime: anime, data: cached };

    var hd = httpHd(tkn);
    var resp = await Widget.http.get(srv + "/api/v2/bangumi/" + encodeURIComponent(anime.animeId), { headers: hd, timeout: timeout });
    var data = resp.data;
    if (data && data.bangumi) {
      data._animeId = anime.animeId;
      Widget.storage.set(bgCk, data, 86400);
      buildEpIndex(data, anime.animeId);
    }
    return { ok: true, anime: anime, data: data };
  } catch (e) {
    return { ok: false, anime: anime };
  }
}

function epIndex(ep) {
  if (!ep) return -1;
  if (ep.episodeIndex !== undefined && ep.episodeIndex >= 0) return ep.episodeIndex;
  var m = String(ep.episodeTitle || "").match(/第\s*(\d+)\s*[集\u8bdd\u8a71]/);
  return m ? parseInt(m[1]) - 1 : -1;
}

async function matchEpisodes(related, refEp, srv, tkn, timeout) {
  var refIdx = epIndex(refEp);
  var refTitle = refEp ? (refEp.episodeTitle || "") : "";

  var proms = [];
  for (var i = 0; i < related.length; i++) proms.push(fetchBangumi(related[i], srv, tkn, timeout));
  var results = await Promise.all(proms);

  var matches = [];
  for (var j = 0; j < results.length; j++) {
    var r = results[j];
    if (!r.ok || !r.data || !r.data.bangumi || !Array.isArray(r.data.bangumi.episodes)) continue;
    var eps = r.data.bangumi.episodes, matched = null;

    if (refTitle) {
      for (var k = 0; k < eps.length; k++) {
        if (eps[k].episodeTitle === refTitle) { matched = eps[k]; break; }
      }
    }
    if (!matched && refIdx >= 0 && refIdx < eps.length) matched = eps[refIdx];
    if (!matched && eps.length > 0) matched = eps[0];

    if (matched && (matched.commentId || matched.episodeId)) {
      matches.push({ anime: r.anime, episode: matched });
    }
  }
  return matches;
}

async function downloadOne(match, srv, tkn, timeout) {
  var sn = match.anime.source || "unknown";
  try {
    var cid = match.episode.commentId || match.episode.episodeId;
    var cmtCk = ck("cmt", String(cid));
    var cached = Widget.storage.get(cmtCk);

    if (cached && Array.isArray(cached.comments)) {
      var cmts = [];
      for (var ci = 0; ci < cached.comments.length; ci++) cmts.push(parseComment(cached.comments[ci], sn));
      return { ok: true, name: sn, comments: cmts };
    }

    var hd = httpHd(tkn);
    var resp = await Widget.http.get(srv + "/api/v2/comment/" + encodeURIComponent(cid) + "?withRelated=true&chConvert=1", { headers: hd, timeout: timeout });
    var data = resp.data;

    var cmts = [];
    if (data && Array.isArray(data.comments)) {
      Widget.storage.set(cmtCk, data, 43200);
      for (var cj = 0; cj < data.comments.length; cj++) cmts.push(parseComment(data.comments[cj], sn));
    }
    return { ok: true, name: sn, comments: cmts };
  } catch (e) {
    console.log("[聚合] 下载异常: " + srcLabel(sn) + " - " + (e.message || e));
    return { ok: false, name: sn, comments: [] };
  }
}

async function searchDanmu(params) {
  console.log("【searchDanmu】ENTER — 完整 params: " + JSON.stringify(Object.keys(params || {})));
  console.log("【searchDanmu】params.title=" + (params.title || "(空)"));
  console.log("【searchDanmu】params.seriesName=" + (params.seriesName || "(空)"));
  console.log("【searchDanmu】params.type=" + (params.type || "(空)"));
  console.log("【searchDanmu】params.season=" + (params.season || "(空)"));
  console.log("【searchDanmu】params.apiBase=" + (params.apiBase || "(空)"));

  var kw = params.title || params.seriesName || "";
  if (!kw) {
    console.log("【searchDanmu】EXIT — 搜索关键词为空 → { animes: [] }");
    return { animes: [] };
  }

  var srv = apiUrl(params);
  if (!srv) {
    console.log("【searchDanmu】EXIT — apiBase 为空 → { animes: [] }");
    return { animes: [] };
  }

  var dg = isDiag(params);
  var tkn = String(params.token || "").trim();

  var scCk = ck("search", (params.type || "") + "_" + kw);
  var cached = Widget.storage.get(scCk);
  if (cached && cached.animes) {
    console.log("【searchDanmu】缓存命中，直接返回 " + cached.animes.length + " 个 anime");
    return cached;
  }

  console.log("【searchDanmu】请求 API: " + srv + "/api/v2/search/anime?keyword=" + encodeURIComponent(kw));
  var hd = httpHd(tkn);

  try {
    var resp = await Widget.http.get(srv + "/api/v2/search/anime?keyword=" + encodeURIComponent(kw) + "&type=" + (params.type || ""), { headers: hd, timeout: getTO(params) });
    var data = resp.data;
    console.log("【searchDanmu】API 响应状态: " + (resp.status || "unknown"));

    if (!data || !data.animes) {
      console.log("【searchDanmu】EXIT — API 无 animes → { animes: [] }");
      return { animes: [] };
    }

    console.log("【searchDanmu】API 返回原始结果数: " + data.animes.length);
    for (var di = 0; di < data.animes.length; di++) {
      var da = data.animes[di];
      console.log("  [" + di + "] animeId=" + da.animeId + " bangumiId=" + (da.bangumiId || "(无)") + " source=" + (da.source || "(无)") + " title=" + da.animeTitle);
    }

    console.log("【searchDanmu】AI 前数量: " + data.animes.length);
    var rawMatched = await aiFilterAnimes(data.animes, params);
    console.log("【searchDanmu】AI 后数量: " + rawMatched.length);

    var groups = {};
    for (var i = 0; i < rawMatched.length; i++) {
      var a = rawMatched[i];
      var ct = coreTitle(a.animeTitle || "");
      if (!groups[ct]) groups[ct] = { coreTitle: ct, type: a.type || "", sources: [] };
      groups[ct].sources.push({
        animeId: a.animeId,
        bangumiId: a.bangumiId || a.animeId,
        animeTitle: a.animeTitle || "",
        type: a.type || "",
        source: a.source || "",
        startDate: a.startDate || ""
      });
    }

    var result = { animes: [] };
    var groupKeys = Object.keys(groups);
    console.log("【searchDanmu】作品分组: " + groupKeys.length + " 组");
    for (var gi = 0; gi < groupKeys.length; gi++) {
      var g = groups[groupKeys[gi]];
      var gk = groupKey(g.coreTitle);
      storeSourceGroup(gk, g.sources);

      var primary = g.sources[0];
      var srcCount = g.sources.length;
      result.animes.push({
        animeId: gk,
        animeTitle: g.coreTitle + (srcCount > 1 ? " (" + srcCount + " 平台)" : ""),
        type: g.type
      });

      console.log("【searchDanmu】返回: " + g.coreTitle + " → " + srcCount + " 个平台");
      if (dg) {
        for (var si = 0; si < g.sources.length; si++) {
          console.log("    [" + g.sources[si].source + "] " + g.sources[si].bangumiId);
        }
      }
    }

    Widget.storage.set(scCk, result, 86400);
    buildTitleIndex(rawMatched);

    console.log("【searchDanmu】EXIT — 返回 " + result.animes.length + " 个作品");
    return result;
  } catch (e) {
    console.log("【searchDanmu】EXCEPTION: " + (e.message || e));
    return { animes: [] };
  }
}

async function getDetailById(params) {
  console.log("【getDetailById】ENTER — animeId=" + params.animeId);

  var aid = params.animeId;
  if (!aid) {
    console.log("【getDetailById】EXIT — animeId 为空 → []");
    return [];
  }

  var srv = apiUrl(params);
  if (!srv) {
    console.log("【getDetailById】EXIT — apiBase 为空 → []");
    return [];
  }

  var tkn = String(params.token || "").trim();
  var dg = isDiag(params);
  var timeout = getTO(params);

  var sources = getSourceGroup(aid);

  if (sources && sources.length > 0) {
    console.log("【getDetailById】多源模式: " + sources.length + " 个平台");
    if (dg) for (var si = 0; si < sources.length; si++) console.log("  [" + sources[si].source + "] bangumiId=" + sources[si].bangumiId);

    var proms = [];
    for (var pi = 0; pi < sources.length; pi++) {
      proms.push(fetchBangumi(sources[pi], srv, tkn, timeout));
    }
    var results = await Promise.all(proms);

    var mergedEps = [];
    var epSeen = {};
    for (var ri = 0; ri < results.length; ri++) {
      var r = results[ri];
      if (!r.ok || !r.data || !r.data.bangumi || !Array.isArray(r.data.bangumi.episodes)) {
        if (dg) console.log("【getDetailById】" + srcLabel(r.anime.source) + ": 无数据");
        continue;
      }
      var eps = r.data.bangumi.episodes;
      if (dg) console.log("【getDetailById】" + srcLabel(r.anime.source) + ": " + eps.length + " 集");

      for (var ei = 0; ei < eps.length; ei++) {
        var ep = eps[ei];
        var et = (ep.episodeTitle || "").replace(/【[^】]*】\s*/g, "").replace(/\[[^\]]*\]\s*/g, "").trim();
        if (epSeen[et]) continue;
        epSeen[et] = true;
        mergedEps.push({
          episodeId: ep.commentId || ep.episodeId,
          episodeTitle: ep.episodeTitle || "",
          episodeNumber: ep.episodeNumber || String(mergedEps.length + 1)
        });
      }
    }

    if (mergedEps.length > 0) {
      mergedEps.sort(function(a, b) {
        var na = parseInt(a.episodeNumber) || 0;
        var nb = parseInt(b.episodeNumber) || 0;
        return na - nb;
      });
      console.log("【getDetailById】合并后: " + mergedEps.length + " 集");
      if (dg) for (var mi = 0; mi < mergedEps.length; mi++) {
        console.log("  [" + mi + "] ep=" + mergedEps[mi].episodeId + " " + mergedEps[mi].episodeTitle);
      }
      console.log("【getDetailById】EXIT — 返回 " + mergedEps.length + " 集");
      return mergedEps;
    }
  }

  var bgCk = ck("bg", String(aid));
  var cached = Widget.storage.get(bgCk);
  if (cached && cached.bangumi) {
    var eps = cached.bangumi.episodes || [];
    console.log("【getDetailById】缓存命中 → " + eps.length + " 集");
    return eps;
  }

  console.log("【getDetailById】请求 API: " + srv + "/api/v2/bangumi/" + encodeURIComponent(aid));
  var hd = httpHd(tkn);

  try {
    var resp = await Widget.http.get(srv + "/api/v2/bangumi/" + encodeURIComponent(aid), { headers: hd, timeout: timeout });
    var data = resp.data;
    console.log("【getDetailById】API 响应状态: " + (resp.status || "unknown"));

    if (data && data.bangumi) {
      data._animeId = aid;
      Widget.storage.set(bgCk, data, 86400);
      buildEpIndex(data, aid);
      var eps = data.bangumi.episodes || [];
      console.log("【getDetailById】获取 " + eps.length + " 集");
      console.log("【getDetailById】EXIT — 返回 " + eps.length + " 集");
      return eps;
    }
    console.log("【getDetailById】EXIT — API 无 bangumi → []");
    return [];
  } catch (e) {
    console.log("【getDetailById】EXCEPTION: " + (e.message || e));
    return [];
  }
}

async function getCommentsById(params) {
  console.log("【getCommentsById】ENTER — commentId=" + (params.commentId || "(空)"));

  var cid = params.commentId;
  var srv = apiUrl(params);
  if (!srv) { console.log("【getCommentsById】EXIT — apiBase 为空 → null"); return null; }

  var tkn = String(params.token || "").trim();
  var dg = isDiag(params);
  var timeout = getTO(params);

  if (!cid) { console.log("【getCommentsById】EXIT — commentId 为空 → null"); return null; }

  console.log("【getCommentsById】━ 获取弹幕 ━");
  var totalStart = Date.now();

  var aggCk = ck("agg", String(cid));
  var aggCached = Widget.storage.get(aggCk);
  if (aggCached && aggCached.comments) {
    console.log("【getCommentsById】聚合缓存命中: " + aggCached.comments.length + " 条");
    return aggCached;
  }

  var pool = [];
  var epInfo = getEpByCid(cid);
  console.log("【getCommentsById】epInfo: " + (epInfo ? ("animeTitle=" + epInfo.animeTitle + " source=" + epInfo.animeSource) : "(null)"));

  if (epInfo && epInfo.animeTitle) {
    var related = findRelated(epInfo.animeTitle, epInfo.animeId);
    console.log("【getCommentsById】标题索引匹配: " + related.length + " 个相关 anime");

    var targets = [];
    console.log("【getCommentsById】发现平台:");
    for (var i = 0; i < related.length; i++) {
      var src = related[i].source || "unknown";
      targets.push(related[i]);
      if (dg) console.log("  + " + srcLabel(src) + " (source=" + src + ")");
    }
    console.log("【getCommentsById】可用平台: " + targets.length + " 个");

    if (targets.length > 0) {
      console.log("【getCommentsById】开始匹配集数…");
      var matches = await matchEpisodes(targets, epInfo, srv, tkn, timeout);
      console.log("【getCommentsById】匹配到 " + matches.length + " 个集");

      if (matches.length > 0) {
        console.log("【getCommentsById】开始并发下载所有平台弹幕…");
        var proms = [];
        for (var mi = 0; mi < matches.length; mi++) proms.push(downloadOne(matches[mi], srv, tkn, timeout));
        var settled = await Promise.all(proms);

        for (var si = 0; si < settled.length; si++) {
          var s = settled[si];
          var lbl = srcLabel(s.name);
          if (s.ok && s.comments && s.comments.length > 0) {
            console.log("  " + lbl + ": " + s.comments.length + " 条");
            for (var ci = 0; ci < s.comments.length; ci++) pool.push(s.comments[ci]);
          } else {
            console.log("  " + lbl + ": 失败或无数据");
          }
        }
      } else {
        console.log("【getCommentsById】WARNING: 未能匹配到任何集");
      }
    } else {
      console.log("【getCommentsById】WARNING: 无可用平台");
    }
  } else {
    console.log("【getCommentsById】WARNING: 未找到 episode 信息");
  }

  if (pool.length === 0) {
    console.log("【getCommentsById】全平台无数据，回退到当前源");
    try {
      var hd = httpHd(tkn);
      var cmtCk2 = ck("cmt", String(cid));
      var cmtCached2 = Widget.storage.get(cmtCk2);
      var fbData = null;

      if (cmtCached2 && Array.isArray(cmtCached2.comments)) {
        fbData = cmtCached2;
        console.log("【getCommentsById】单源缓存命中");
      } else {
        console.log("【getCommentsById】单源请求: " + srv + "/api/v2/comment/" + cid);
        var fbResp = await Widget.http.get(srv + "/api/v2/comment/" + encodeURIComponent(cid) + "?withRelated=true&chConvert=1", { headers: hd, timeout: timeout });
        fbData = fbResp.data;
        if (fbData && Array.isArray(fbData.comments)) Widget.storage.set(cmtCk2, fbData, 43200);
      }

      if (fbData && Array.isArray(fbData.comments)) {
        var fbSrc = epInfo ? (epInfo.animeSource || "default") : "default";
        console.log("【getCommentsById】回退源: " + fbSrc + " → " + fbData.comments.length + " 条");
        for (var fi = 0; fi < fbData.comments.length; fi++) pool.push(parseComment(fbData.comments[fi], fbSrc));
      }
    } catch (e) {
      console.log("【getCommentsById】回退下载失败: " + (e.message || e));
      return null;
    }
  }

  if (pool.length === 0) {
    console.log("【getCommentsById】EXIT — 最终弹幕数为 0 → null");
    return null;
  }

  console.log("【getCommentsById】────────────");
  console.log("【getCommentsById】全部下载完成");
  console.log("【getCommentsById】聚合前数量: " + pool.length);

  sortPool(pool);

  var dedupStats = { exact: 0, cross: 0, prefix: 0, compressed: 0 };
  if (String(params.enableDedup || "1") !== "0") {
    console.log("【getCommentsById】开始六层智能聚合…");
    var dedupRes = smartDedup(pool);
    pool = dedupRes.result;
    dedupStats = dedupRes;
    console.log("【getCommentsById】L1-完全重复删除: " + dedupStats.exact + " 条");
    console.log("【getCommentsById】L2-跨平台重复删除: " + dedupStats.cross + " 条");
    console.log("【getCommentsById】L3-前缀合并: " + dedupStats.prefix + " 条");
    console.log("【getCommentsById】L4-重复字符压缩: " + dedupStats.compressed + " 条");
    console.log("【getCommentsById】L5-标点统一 + L6-空格统一: 已执行");
    console.log("【getCommentsById】聚合后数量: " + pool.length);
  } else {
    console.log("【getCommentsById】智能聚合: 已关闭");
  }

  var fStats = {};
  if (String(params.enableFilter || "1") !== "0") {
    console.log("【getCommentsById】开始规则过滤…");
    pool = filterPool(pool, params, fStats);
    var totalF = 0;
    var catNames = { date: "日期", time: "时间", sign: "打卡/留名/考古", year: "年份", nshua: "N刷", first: "第一/沙发/前排", checkin: "签到/报到", ad: "广告/QQ群/公众号", repeat: "重复字符", symbol: "纯符号", custom: "自定义" };
    for (var cfk in fStats) { if (fStats[cfk] > 0) console.log("【getCommentsById】" + (catNames[cfk] || cfk) + ": " + fStats[cfk] + " 条"); totalF += fStats[cfk]; }
    console.log("【getCommentsById】过滤合计: " + totalF + " 条");
    console.log("【getCommentsById】过滤后数量: " + pool.length);
  } else {
    console.log("【getCommentsById】规则过滤: 已关闭");
  }

  var resultComments = [];
  for (var ri = 0; ri < pool.length; ri++) {
    var pc = pool[ri];
    resultComments.push({ cid: ri + 1, p: pc.p, m: pc.m });
  }

  var result = { count: resultComments.length, comments: resultComments };
  var elapsed = Date.now() - totalStart;

  console.log("【getCommentsById】────────────");
  console.log("【getCommentsById】最终导出: " + result.comments.length + " 条");
  console.log("【getCommentsById】总耗时: " + elapsed + "ms");
  console.log("【getCommentsById】━ 获取弹幕完成 ━");

  Widget.storage.set(aggCk, result, 43200);
  Widget.storage.set(ck("pool", String(cid)), pool, 43200);

  return result;
}

async function getDanmuWithSegmentTime(params) {
  var cid = params.commentId;
  var segTime = Number(params.segmentTime);
  var dg = isDiag(params);

  if (dg) console.log("【getDanmuWithSegmentTime】ENTER — cid=" + cid + ", segTime=" + segTime);

  var aggCk = ck("agg", String(cid));
  var aggCached = Widget.storage.get(aggCk);

  var poolCk = ck("pool", String(cid));
  var poolCached = Widget.storage.get(poolCk);

  if (poolCached && Array.isArray(poolCached) && !isNaN(segTime)) {
    var segSize = 30;
    var start = Math.floor(segTime / segSize) * segSize;
    var end = start + segSize;

    var filtered = [];
    for (var i = 0; i < poolCached.length; i++) {
      var c = poolCached[i];
      if (c._t >= start && c._t < end) filtered.push(c);
    }

    if (filtered.length > 0) {
      if (dg) console.log("【getDanmuWithSegmentTime】时间片 " + start + "-" + end + ": " + filtered.length + " 条");

      var resultComments2 = [];
      for (var ri = 0; ri < filtered.length; ri++) {
        var fc = filtered[ri];
        resultComments2.push({ cid: ri + 1, p: fc.p, m: fc.m });
      }
      return { count: resultComments2.length, comments: resultComments2 };
    }
  }

  if (aggCached && aggCached.comments) {
    if (dg) console.log("【getDanmuWithSegmentTime】返回全部聚合弹幕: " + aggCached.comments.length + " 条");
    return aggCached;
  }

  if (dg) console.log("【getDanmuWithSegmentTime】EXIT — 无可用弹幕 → null");
  return null;
}
