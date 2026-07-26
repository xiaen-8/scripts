/**
 * Emby 番号聚合 ForwardWidget
 * 对齐 Forward 原生抓包：PlaybackInfo(DeviceProfile) → /videos/{id}/stream?Static=true
 * 远程库常见 307 到 OneDrive/SharePoint；脚本会尽量解析最终直链以加快起播。
 * Token 等请在全局参数填写，勿写进脚本。
 */

var STORAGE_PREFIX = "emby.agg.global.";
var ITEM_CACHE_PREFIX = "emby.agg.item.v1.";
var ITEM_CACHE_TTL_MS = 7 * 24 * 3600 * 1000;

var GLOBAL_PARAM_KEYS = [
  "embyHost",
  "embyToken",
  "embyUserId",
  "embyDeviceId",
  "embyClient",
  "embyDevice",
  "embyVersion",
  "embyUserAgent",
  "embyPathPrefix",
  "embyMaxBitrate",
  "embyResolveRedirect",
];

var DEFAULTS = {
  embyHost: "",
  embyToken: "",
  embyUserId: "",
  embyDeviceId: "",
  embyClient: "Forward",
  embyDevice: "iPhone",
  embyVersion: "1.3.18",
  embyUserAgent: "Forward-Standard/1.3.18",
  embyPathPrefix: "/emby",
  // 抓包 Query: MaxStreamingBitrate=500000000
  embyMaxBitrate: "500000000",
  // 是否主动解析 /stream 的 307 Location（SharePoint）
  embyResolveRedirect: "true",
};

/** 来自 Forward 1.3.18 进服播放抓包的 DeviceProfile（精简复刻） */
var FORWARD_DEVICE_PROFILE = {
  MaxStreamingBitrate: 50000000,
  MusicStreamingTranscodingBitrate: 50000000,
  MaxStaticBitrate: 500000000,
  ContainerProfiles: [],
  DirectPlayProfiles: [
    {
      Container:
        "mkv,mp4,flv,f4v,f4p,f4a,f4b,swf,rmvb,rm,vob,ogm,ogv,avi,mov,wmv,qt,divx,dv,asf,wtv,mpg,mpeg,mpeg1,mpeg2,m1v,m2v,mpv,mpeg4,m4v,m2p,ps,ts, m2ts,mts,mt2s,3gp,3gpp,3g2,3gp2,webm,dat,amv,mxf,mcf,xvid,yuv",
      AudioCodec:
        "aac,aac_latm,mp3,mp2,pcm_s16le,pcm_s24le,pcm_s32le,wav,ac3,eac3,flac,truehd,dts,dtshd,dca,opus,wmav2,wmav3,cook",
      VideoCodec:
        "h264,hevc,dvhe,dvh1,h264,hevc,hev1,mpeg4,vp8,mpeg,vp9,vc1,mpeg2video,rv40,wmv2,wmv3",
      Type: "Video",
    },
  ],
  TranscodingProfiles: [
    {
      MaxAudioChannels: "6",
      BreakOnNonKeyFrames: true,
      MinSegments: 2,
      Container: "ts",
      AudioCodec: "aac,mp3,wav,ac3,eac3,flac,opus",
      Type: "Video",
      Protocol: "hls",
      Context: "Streaming",
      VideoCodec: "hevc,h264,mpeg4",
    },
  ],
  CodecProfiles: [
    {
      Codec: "h264",
      Type: "Video",
      ApplyConditions: [
        { Property: "IsAnamorphic", Value: "true", IsRequired: false, Condition: "NotEquals" },
        {
          Value: "high|main|baseline|constrained baseline",
          IsRequired: false,
          Condition: "EqualsAny",
          Property: "VideoProfile",
        },
        { IsRequired: false, Value: "80", Property: "VideoLevel", Condition: "LessThanEqual" },
        { Value: "true", IsRequired: false, Condition: "NotEquals", Property: "IsInterlaced" },
      ],
    },
    {
      ApplyConditions: [
        { Value: "true", IsRequired: false, Condition: "NotEquals", Property: "IsAnamorphic" },
        {
          Condition: "EqualsAny",
          Value: "high|main|main 10",
          IsRequired: false,
          Property: "VideoProfile",
        },
        { Value: "175", IsRequired: false, Condition: "LessThanEqual", Property: "VideoLevel" },
        { Property: "IsInterlaced", Condition: "NotEquals", IsRequired: false, Value: "true" },
      ],
      Codec: "hevc",
      Type: "Video",
    },
  ],
  ResponseProfiles: [{ MimeType: "video/mp4", Type: "Video", Container: "m4v" }],
  SubtitleProfiles: [
    { Format: "ass", Method: "Embed" },
    { Format: "ssa", Method: "Embed" },
    { Format: "subrip", Method: "Embed" },
    { Format: "sub", Method: "Embed" },
    { Format: "pgssub", Method: "Embed" },
    { Format: "subrip", Method: "External" },
    { Format: "sub", Method: "External" },
    { Method: "External", Format: "ass" },
    { Method: "External", Format: "ssa" },
    { Method: "External", Format: "vtt" },
    { Format: "ass", Method: "External" },
    { Method: "External", Format: "ssa" },
  ],
};

WidgetMetadata = {
  id: "forward.emby.code.agg",
  title: "Emby番号聚合",
  version: "1.2.0",
  requiredVersion: "0.0.2",
  description: "按番号聚合 Emby；对齐 Forward PlaybackInfo+/videos/stream 与 307 直链",
  author: "老头",
  site: "",
  detailCacheDuration: 60,
  globalParams: [
    {
      name: "embyHost",
      title: "Emby 地址",
      type: "input",
      description: "例如 https://emby.example.com（不要末尾斜杠）",
      value: "",
    },
    {
      name: "embyToken",
      title: "AccessToken",
      type: "input",
      description: "抓包 X-Emby-Token（过期后重填）",
      value: "",
    },
    {
      name: "embyUserId",
      title: "UserId",
      type: "input",
      description: "抓包 Authorization 里的 Emby UserId",
      value: "",
    },
    {
      name: "embyDeviceId",
      title: "DeviceId",
      type: "input",
      description: "抓包 DeviceId；可留空自动生成",
      value: "",
    },
    {
      name: "embyClient",
      title: "Client",
      type: "input",
      value: "Forward",
    },
    {
      name: "embyDevice",
      title: "Device",
      type: "input",
      value: "iPhone",
    },
    {
      name: "embyVersion",
      title: "Version",
      type: "input",
      value: "1.3.18",
    },
    {
      name: "embyUserAgent",
      title: "User-Agent",
      type: "input",
      value: "Forward-Standard/1.3.18",
    },
    {
      name: "embyPathPrefix",
      title: "API 前缀",
      type: "input",
      value: "/emby",
    },
    {
      name: "embyMaxBitrate",
      title: "最大码率",
      type: "input",
      description: "对齐抓包 500000000",
      value: "500000000",
    },
    {
      name: "embyResolveRedirect",
      title: "解析307直链",
      type: "enumeration",
      description: "开启后尝试把 /stream 的 307 Location（如 SharePoint）直接给播放器，通常更快",
      enumOptions: [
        { title: "开启", value: "true" },
        { title: "关闭（交给播放器跟跳）", value: "false" },
      ],
      value: "true",
    },
  ],
  modules: [
    {
      id: "loadResource",
      title: "Emby 番号播放源",
      description: "番号 → Item → PlaybackInfo → /videos/stream（可解析307）",
      functionName: "loadResource",
      type: "stream",
      cacheDuration: 120,
      params: [],
    },
    {
      id: "searchByCode",
      title: "按番号测搜",
      functionName: "searchByCode",
      cacheDuration: 60,
      params: [
        { name: "keyword", title: "番号", type: "input", value: "" },
        { name: "page", title: "页码", type: "page", value: "1" },
      ],
    },
  ],
};

function syncGlobalParams(params) {
  params = params || {};
  for (var i = 0; i < GLOBAL_PARAM_KEYS.length; i++) {
    var key = GLOBAL_PARAM_KEYS[i];
    if (params[key] !== undefined && params[key] !== null && String(params[key]) !== "") {
      Widget.storage.set(STORAGE_PREFIX + key, String(params[key]).trim());
    }
  }
  return Object.assign({}, params, getEffectiveParams(params));
}

function getEffectiveParams(params) {
  params = params || {};
  var out = {};
  for (var i = 0; i < GLOBAL_PARAM_KEYS.length; i++) {
    var key = GLOBAL_PARAM_KEYS[i];
    if (params[key] !== undefined && params[key] !== null && String(params[key]) !== "") {
      out[key] = String(params[key]).trim();
    } else {
      var stored = Widget.storage.get(STORAGE_PREFIX + key);
      if (stored !== undefined && stored !== null && String(stored) !== "") {
        out[key] = String(stored).trim();
      }
    }
  }
  for (var k in DEFAULTS) {
    if (!out[k]) out[k] = DEFAULTS[k];
  }
  if (!out.embyDeviceId) {
    var cachedId = Widget.storage.get(STORAGE_PREFIX + "embyDeviceId");
    if (cachedId) {
      out.embyDeviceId = String(cachedId);
    } else {
      out.embyDeviceId = genDeviceId();
      Widget.storage.set(STORAGE_PREFIX + "embyDeviceId", out.embyDeviceId);
    }
  }
  out.embyHost = normalizeHost(out.embyHost);
  out.embyPathPrefix = normalizePathPrefix(out.embyPathPrefix);
  if (!out.embyUserAgent && out.embyVersion) {
    out.embyUserAgent = "Forward-Standard/" + out.embyVersion;
  }
  return out;
}

function normalizeHost(host) {
  return String(host || "").trim().replace(/\/+$/, "");
}

function normalizePathPrefix(prefix) {
  prefix = String(prefix || "/emby").trim();
  if (!prefix || prefix === "/") return "";
  if (prefix.charAt(0) !== "/") prefix = "/" + prefix;
  return prefix.replace(/\/+$/, "");
}

function genDeviceId() {
  var hex = "0123456789abcdef";
  var out = "";
  for (var i = 0; i < 32; i++) out += hex.charAt(Math.floor(Math.random() * 16));
  return out;
}

function genPlaySessionId() {
  return genDeviceId();
}

function assertConfig(cfg) {
  if (!cfg.embyHost) throw new Error("请先在全局参数填写 Emby 地址");
  if (!cfg.embyToken) throw new Error("请先在全局参数填写 AccessToken");
  if (!cfg.embyUserId) throw new Error("请先在全局参数填写 UserId");
}

function buildEmbyHeaders(cfg) {
  var auth =
    'MediaBrowser Token="' +
    cfg.embyToken +
    '", Emby UserId="' +
    cfg.embyUserId +
    '", Client="' +
    cfg.embyClient +
    '", Device="' +
    cfg.embyDevice +
    '", DeviceId="' +
    cfg.embyDeviceId +
    '", Version="' +
    cfg.embyVersion +
    '"';
  return {
    Accept: "*/*",
    "Content-Type": "application/json",
    "Accept-Language": "zh-CN,zh-Hans;q=0.9",
    "User-Agent": cfg.embyUserAgent || "Forward-Standard/" + cfg.embyVersion,
    "X-Emby-Token": cfg.embyToken,
    "X-Emby-Authorization": auth,
  };
}

function buildCdnPlayHeaders(cfg) {
  // SharePoint / OneDrive 不需要 Emby 鉴权头
  return {
    Accept: "*/*",
    "Accept-Language": "zh-CN,zh-Hans;q=0.9",
    "User-Agent": cfg.embyUserAgent || "Forward-Standard/" + cfg.embyVersion,
  };
}

function apiUrl(cfg, path, query) {
  var url = cfg.embyHost + cfg.embyPathPrefix + path;
  var qs = [];
  query = query || {};
  for (var key in query) {
    if (!Object.prototype.hasOwnProperty.call(query, key)) continue;
    var val = query[key];
    if (val === undefined || val === null || val === "") continue;
    qs.push(encodeURIComponent(key) + "=" + encodeURIComponent(String(val)));
  }
  return qs.length ? url + "?" + qs.join("&") : url;
}

function parseResponseBody(res, path) {
  if (!res) throw new Error("Emby 无响应: " + path);
  var status = res.statusCode || res.status || 200;
  if (status >= 400) throw new Error("Emby HTTP " + status + " " + path);
  var data = res.data !== undefined ? res.data : res;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      throw new Error("Emby 返回非 JSON: " + path);
    }
  }
  return data;
}

function getHeader(res, name) {
  if (!res) return "";
  var headers = res.headers || res.header || res.responseHeaders || {};
  if (!headers) return "";
  var lower = String(name).toLowerCase();
  for (var k in headers) {
    if (String(k).toLowerCase() === lower) {
      var v = headers[k];
      return Array.isArray(v) ? String(v[0] || "") : String(v || "");
    }
  }
  return "";
}

async function embyGet(cfg, path, query) {
  var url = apiUrl(cfg, path, query);
  var res = await Widget.http.get(url, { headers: buildEmbyHeaders(cfg) });
  return parseResponseBody(res, path);
}

async function embyPost(cfg, path, query, body) {
  var url = apiUrl(cfg, path, query);
  var headers = buildEmbyHeaders(cfg);
  var payload = typeof body === "string" ? body : JSON.stringify(body || {});
  var res;
  if (Widget.http.post) {
    res = await Widget.http.post(url, { headers: headers, body: payload });
  } else if (Widget.http.request) {
    res = await Widget.http.request({ url: url, method: "POST", headers: headers, body: payload });
  } else {
    return null;
  }
  return parseResponseBody(res, path);
}

function normalizeCode(code) {
  return String(code || "")
    .toUpperCase()
    .replace(/\./g, "-")
    .replace(/_/g, "-")
    .replace(/\s+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function compactCode(code) {
  return normalizeCode(code).replace(/-/g, "");
}

function extractSearchCode(text) {
  var s = String(text || "")
    .toUpperCase()
    .replace(/\./g, " ")
    .replace(/_/g, "-")
    .replace(/\s+/g, " ")
    .trim();
  if (!s) return "";
  var patterns = [
    /\bFC2(?:[- ]?PPV)?[- ]?\d{5,8}\b/,
    /\b(?:S2M|MIAA|SSNI|SNIS|IPX|IPZZ|SSIS|JUQ|MIDE|MIDV|STARS|ABW|RKI|DVAJ|WANZ|LULU|DLDSS|VRTM|SDMU|SDDE|MKMP|HMN|MUDR|ADN|CAWD|PPPE|PRED|MGR|SHKD|MXGS|FSDSS|JUL|KTB|MIAB|GVH|MIMK|JUY|JUTA|IDBD|HND|DASD|CLO|BF|HONB|ROE|CEMD|MIUM|NITR|RCTD|RCT|IPVR|MIBD|JUR|JURD|SOE|ORE|PYO|START|NSFS|JJGG|BANK|MILK|SIR|FSOK|KV|KIWVR|MREC|DVRT|VOD)\s*[-_ ]?\d{2,6}[A-Z]?(?:[-_ ]?[A-Z]{0,4})?\b/,
    /\b[A-Z]{2,10}\s*[-_ ]?\d{2,8}[A-Z]?\b/,
    /\b\d{6,8}\b/,
  ];
  for (var i = 0; i < patterns.length; i++) {
    var match = s.match(patterns[i]);
    if (match && match[0]) return normalizeCode(match[0].replace(/\s+/g, ""));
  }
  return "";
}

function collectStringValues(value, depth, out, visited) {
  depth = depth || 0;
  out = out || [];
  visited = visited || [];
  if (value === null || value === undefined || depth > 5) return out;
  var type = typeof value;
  if (type === "string" || type === "number") {
    var text = String(value).trim();
    if (text) out.push(text);
    return out;
  }
  if (type !== "object") return out;
  for (var i = 0; i < visited.length; i++) {
    if (visited[i] === value) return out;
  }
  visited.push(value);
  if (Array.isArray(value)) {
    for (var j = 0; j < value.length; j++) collectStringValues(value[j], depth + 1, out, visited);
    return out;
  }
  var keys = Object.keys(value);
  for (var k = 0; k < keys.length; k++) collectStringValues(value[keys[k]], depth + 1, out, visited);
  return out;
}

function extractCodeFromParams(params) {
  params = params || {};
  var priority = [
    params.code,
    params.videoId,
    params.number,
    params.matchCode,
    params.fileName,
    params.filename,
    params.file_name,
    params.name,
    params.path,
    params.filePath,
    params.file_path,
    params.mediaPath,
    params.media_path,
    params.id,
    params.title,
    params.seriesName,
    params.originalTitle,
    params.originalName,
    params.episodeName,
    params.description,
    params.link,
    params.url,
    params.videoUrl,
    params.playUrl,
    params.streamUrl,
    params.keyword,
  ];
  if (params.tmdbInfo) {
    priority.push(
      params.tmdbInfo.title,
      params.tmdbInfo.name,
      params.tmdbInfo.originalTitle,
      params.tmdbInfo.originalName
    );
  }
  if (params.info) {
    priority.push(params.info.title, params.info.name, params.info.originalTitle, params.info.originalName);
  }
  for (var i = 0; i < priority.length; i++) {
    var code = extractSearchCode(priority[i]);
    if (code) return code;
  }
  var bag = collectStringValues(params);
  for (var j = 0; j < bag.length; j++) {
    var found = extractSearchCode(bag[j]);
    if (found) return found;
  }
  return "";
}

function codeVariants(code) {
  var norm = normalizeCode(code);
  var compact = compactCode(norm);
  var list = [norm];
  if (compact && compact !== norm) list.push(compact);
  if (/^FC2/.test(norm)) {
    var digits = norm.replace(/\D/g, "");
    if (digits) list.push("FC2-" + digits, "FC2PPV-" + digits);
  }
  var seen = {};
  var out = [];
  for (var i = 0; i < list.length; i++) {
    var v = list[i];
    if (!v || seen[v]) continue;
    seen[v] = true;
    out.push(v);
  }
  return out;
}

function itemHaystack(item) {
  if (!item) return "";
  var parts = [
    item.Name,
    item.OriginalTitle,
    item.SortName,
    item.Overview,
    item.Path,
    item.Container,
    item.ProductionYear,
  ];
  if (item.ProviderIds) {
    var p = item.ProviderIds;
    parts.push(p.Tmdb, p.Imdb, p.Tvdb, p.Jav, p.Javdb, p.Dmm, p.Avsox);
  }
  return parts.filter(Boolean).join(" ").toUpperCase();
}

function scoreItemAgainstCode(item, code) {
  var target = normalizeCode(code);
  var compact = compactCode(target);
  var hay = itemHaystack(item);
  if (!hay) return 0;
  var hayCompact = hay.replace(/[^A-Z0-9]/g, "");
  var name = normalizeCode(item.Name || "");
  var nameCompact = compactCode(name);
  if (name === target || nameCompact === compact) return 100;
  if (hay.indexOf(target) >= 0) return 90;
  if (hayCompact.indexOf(compact) >= 0) {
    var idx = hayCompact.indexOf(compact);
    var next = hayCompact.charAt(idx + compact.length);
    if (!next || /[^0-9]/.test(next)) return 80;
  }
  return 0;
}

function itemCacheKey(code) {
  return ITEM_CACHE_PREFIX + compactCode(code);
}

function readItemCache(code) {
  try {
    var raw = Widget.storage.get(itemCacheKey(code));
    if (!raw) return null;
    var obj = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!obj || !obj.id) return null;
    if (Date.now() - Number(obj.ts || 0) > ITEM_CACHE_TTL_MS) return null;
    return obj;
  } catch (e) {
    return null;
  }
}

function writeItemCache(code, item) {
  if (!code || !item || !item.Id) return;
  Widget.storage.set(
    itemCacheKey(code),
    JSON.stringify({ id: item.Id, name: item.Name || "", ts: Date.now() })
  );
}

async function searchEmbyOnce(cfg, term, code) {
  var data = await embyGet(cfg, "/Users/" + cfg.embyUserId + "/Items", {
    SearchTerm: term,
    Recursive: "true",
    IncludeItemTypes: "Movie,Video,Episode",
    Fields: "Path,Overview,ProviderIds,OriginalTitle,SortName",
    Filters: "IsNotFolder",
    Limit: 20,
  });
  var items = (data && data.Items) || [];
  var ranked = [];
  for (var j = 0; j < items.length; j++) {
    var item = items[j];
    if (!item || !item.Id) continue;
    var score = scoreItemAgainstCode(item, code);
    if (score < 75) continue;
    ranked.push({ item: item, score: score });
  }
  ranked.sort(function (a, b) {
    return b.score - a.score;
  });
  return ranked;
}

async function searchEmbyItems(cfg, code) {
  var variants = codeVariants(code);
  var bestMap = {};
  for (var i = 0; i < variants.length; i++) {
    var ranked = await searchEmbyOnce(cfg, variants[i], code);
    for (var j = 0; j < ranked.length; j++) {
      var row = ranked[j];
      var prev = bestMap[row.item.Id];
      if (!prev || row.score > prev.score) bestMap[row.item.Id] = row;
    }
    for (var id in bestMap) {
      if (bestMap[id] && bestMap[id].score >= 90) return [bestMap[id].item];
    }
    if (ranked.length) break;
  }
  var out = [];
  for (var key in bestMap) {
    if (Object.prototype.hasOwnProperty.call(bestMap, key)) out.push(bestMap[key]);
  }
  out.sort(function (a, b) {
    return b.score - a.score;
  });
  return out.map(function (x) {
    return x.item;
  });
}

async function resolveItemByCode(cfg, code) {
  var cached = readItemCache(code);
  if (cached && cached.id) {
    try {
      var detail = await embyGet(cfg, "/Users/" + cfg.embyUserId + "/Items/" + cached.id, {
        Fields: "Path,Overview,ProviderIds,OriginalTitle,SortName",
      });
      if (detail && detail.Id && scoreItemAgainstCode(detail, code) >= 75) {
        writeItemCache(code, detail);
        return detail;
      }
    } catch (e) {}
  }
  var items = await searchEmbyItems(cfg, code);
  if (!items.length) return null;
  writeItemCache(code, items[0]);
  return items[0];
}

function absoluteEmbyUrl(cfg, maybeUrl) {
  var u = String(maybeUrl || "").trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.charAt(0) !== "/") u = "/" + u;
  // 抓包 DirectStreamUrl = /videos/3740/stream?...  → 实际请求 /emby/videos/...
  if (cfg.embyPathPrefix && u.indexOf(cfg.embyPathPrefix + "/") === 0) {
    return cfg.embyHost + u;
  }
  if (u.indexOf("/emby/") === 0 || u.indexOf("/jellyfin/") === 0) {
    return cfg.embyHost + u;
  }
  return cfg.embyHost + cfg.embyPathPrefix + u;
}

function ensureEmbyTokenQuery(url, token) {
  if (!url || !token) return url;
  if (/([?&])(X-Emby-Token|api_key)=/i.test(url)) return url;
  return url + (url.indexOf("?") >= 0 ? "&" : "?") + "X-Emby-Token=" + encodeURIComponent(token);
}

function isPrivateOrLanUrl(url) {
  var u = String(url || "");
  if (/^https?:\/\/(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|127\.|localhost)/i.test(u)) return true;
  if (/^http:\/\/\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?\//i.test(u)) return true;
  return false;
}

function isCdnDirectUrl(url) {
  return /sharepoint\.com|onedrive\.live\.com|download\.aspx|1drv\.ms|blob\.core\.windows\.net/i.test(
    String(url || "")
  );
}

function pickBestMediaSource(sources) {
  sources = sources || [];
  if (!sources.length) return null;
  var scored = sources.slice().sort(function (a, b) {
    var scoreA =
      (a.SupportsDirectPlay ? 300 : 0) +
      (a.SupportsDirectStream ? 200 : 0) +
      (a.DirectStreamUrl ? 120 : 0) +
      (a.TranscodingUrl ? 40 : 0) +
      Math.min(Number(a.Bitrate || a.Size || 0) / 1000000, 40);
    var scoreB =
      (b.SupportsDirectPlay ? 300 : 0) +
      (b.SupportsDirectStream ? 200 : 0) +
      (b.DirectStreamUrl ? 120 : 0) +
      (b.TranscodingUrl ? 40 : 0) +
      Math.min(Number(b.Bitrate || b.Size || 0) / 1000000, 40);
    return scoreB - scoreA;
  });
  return scored[0];
}

/** 对齐抓包：/videos/{id}/stream?MediaSourceId=...&X-Emby-Token=...&Static=true */
function buildNativeStreamUrl(cfg, itemId, mediaSource) {
  var sourceId = (mediaSource && mediaSource.Id) || "mediasource_" + itemId;
  return apiUrl(cfg, "/videos/" + itemId + "/stream", {
    MediaSourceId: sourceId,
    "X-Emby-Token": cfg.embyToken,
    Static: "true",
  });
}

async function fetchPlaybackInfo(cfg, itemId) {
  var bitrate = Number(cfg.embyMaxBitrate || 500000000) || 500000000;
  var query = {
    UserId: cfg.embyUserId,
    MaxStreamingBitrate: String(bitrate),
    reqformat: "json",
    StartTimeTicks: "0",
    // 抓包是 false：探测可播信息，不是立刻标成播放中
    IsPlayback: "false",
    AutoOpenLiveStream: "false",
  };
  var body = { DeviceProfile: FORWARD_DEVICE_PROFILE };

  var info = null;
  try {
    info = await embyPost(cfg, "/Items/" + itemId + "/PlaybackInfo", query, body);
  } catch (e) {
    info = null;
  }
  if (!info) {
    info = await embyGet(cfg, "/Items/" + itemId + "/PlaybackInfo", query);
  }
  return info;
}

/**
 * 尝试解析 /stream 的 307 Location（抓包最终到 SharePoint）。
 * Widget.http 若自动跟随重定向，则用最终 responseURL。
 */
async function resolveStreamRedirect(cfg, streamUrl) {
  try {
    var res = await Widget.http.get(streamUrl, { headers: buildEmbyHeaders(cfg) });
    var loc = getHeader(res, "location");
    if (loc) {
      if (loc.indexOf("//") === 0) loc = "https:" + loc;
      if (loc.charAt(0) === "/") loc = cfg.embyHost + loc;
      if (/^https?:\/\//i.test(loc)) return loc;
    }
    var finalUrl = res.responseURL || res.url || (res.request && res.request.responseURL) || "";
    if (finalUrl && finalUrl !== streamUrl && /^https?:\/\//i.test(finalUrl)) {
      if (isCdnDirectUrl(finalUrl) || finalUrl.indexOf(cfg.embyHost) !== 0) return finalUrl;
    }
  } catch (e) {}
  return "";
}

async function reportPlaybackStart(cfg, item, mediaSource, playSessionId, playMethod) {
  // 尽力上报；失败不影响播放。Stopped/Progress 心跳 Widget 无法在真正播时持续发。
  try {
    var body = {
      ItemId: String(item.Id),
      MediaSourceId: mediaSource && mediaSource.Id ? String(mediaSource.Id) : undefined,
      PlaySessionId: playSessionId || genPlaySessionId(),
      CanSeek: true,
      IsPaused: false,
      IsMuted: false,
      PositionTicks: 0,
      VolumeLevel: 100,
      PlayMethod: playMethod || "DirectStream",
      RepeatMode: "RepeatNone",
    };
    await embyPost(cfg, "/Sessions/Playing", {}, body);
  } catch (e) {}
}

async function resolvePlayTarget(cfg, item, playbackInfo) {
  var itemId = item.Id;
  var sources = (playbackInfo && playbackInfo.MediaSources) || [];
  var mediaSource = pickBestMediaSource(sources);
  var playSessionId = (playbackInfo && playbackInfo.PlaySessionId) || genPlaySessionId();

  // 1) 公开 https 远程 Path（非内网 IP）可直链
  if (mediaSource && mediaSource.Path && /^https:\/\//i.test(mediaSource.Path) && !isPrivateOrLanUrl(mediaSource.Path)) {
    return {
      url: mediaSource.Path,
      mediaSource: mediaSource,
      mode: "remote-path",
      playSessionId: playSessionId,
      useCdnHeaders: true,
    };
  }

  // 2) 优先用 PlaybackInfo 返回的 DirectStreamUrl（抓包形态）
  var streamUrl = "";
  if (mediaSource && mediaSource.DirectStreamUrl) {
    streamUrl = absoluteEmbyUrl(cfg, mediaSource.DirectStreamUrl);
    streamUrl = ensureEmbyTokenQuery(streamUrl, cfg.embyToken);
  } else if (mediaSource && mediaSource.TranscodingUrl) {
    streamUrl = absoluteEmbyUrl(cfg, mediaSource.TranscodingUrl);
    streamUrl = ensureEmbyTokenQuery(streamUrl, cfg.embyToken);
  } else {
    streamUrl = buildNativeStreamUrl(cfg, itemId, mediaSource);
  }

  var mode = mediaSource && mediaSource.TranscodingUrl && !mediaSource.DirectStreamUrl ? "transcode" : "direct-stream";
  var useCdnHeaders = false;

  // 3) 解析 307 → SharePoint（抓包关键加速点）
  if (String(cfg.embyResolveRedirect || "true") === "true") {
    var finalUrl = await resolveStreamRedirect(cfg, streamUrl);
    if (finalUrl) {
      streamUrl = finalUrl;
      mode = isCdnDirectUrl(finalUrl) ? "redirect-cdn" : "redirect-follow";
      useCdnHeaders = isCdnDirectUrl(finalUrl) || streamUrl.indexOf(cfg.embyHost) !== 0;
    }
  }

  return {
    url: streamUrl,
    mediaSource: mediaSource,
    mode: mode,
    playSessionId: playSessionId,
    useCdnHeaders: useCdnHeaders,
  };
}

function formatBytes(n) {
  n = Number(n || 0);
  if (!n) return "";
  if (n < 1024) return n + " B";
  if (n < 1048576) return (n / 1024).toFixed(1) + " KB";
  if (n < 1073741824) return (n / 1048576).toFixed(1) + " MB";
  return (n / 1073741824).toFixed(2) + " GB";
}

function buildPlayHeaders(cfg, play) {
  if (play.useCdnHeaders) return buildCdnPlayHeaders(cfg);
  var headers = buildEmbyHeaders(cfg);
  var mediaSource = play.mediaSource;
  if (mediaSource && mediaSource.RequiredHttpHeaders) {
    var req = mediaSource.RequiredHttpHeaders;
    for (var k in req) {
      if (Object.prototype.hasOwnProperty.call(req, k) && req[k]) headers[k] = String(req[k]);
    }
  }
  return headers;
}

function toStreamItem(cfg, item, code, play) {
  var mediaSource = play.mediaSource;
  var sizeText = mediaSource ? formatBytes(mediaSource.Size) : "";
  var container = (mediaSource && mediaSource.Container) || "";
  var bitrate = mediaSource && mediaSource.Bitrate ? Math.round(mediaSource.Bitrate / 1000) + " kbps" : "";
  var desc =
    "番号：" +
    code +
    "\n标题：" +
    (item.Name || "") +
    "\n模式：" +
    (play.mode || "") +
    (bitrate ? "\n码率：" + bitrate : "") +
    (sizeText ? "\n体积：" + sizeText : "") +
    (container ? "\n封装：" + container : "");
  return {
    name: "Emby · " + (item.Name || code),
    description: desc,
    url: play.url,
    customHeaders: buildPlayHeaders(cfg, play),
  };
}

function toListItem(item, code) {
  return {
    id: item.Id,
    type: "url",
    mediaType: "movie",
    title: item.Name || code,
    description: code ? "番号: " + code : item.Overview || "",
    posterPath: "",
    backdropPath: "",
    link: item.Id,
    name: code || item.Name,
    seriesName: code || item.Name,
    code: code,
    matchCode: code,
  };
}

async function loadResource(params) {
  try {
    var cfg = syncGlobalParams(params || {});
    assertConfig(cfg);
    var code = extractCodeFromParams(params || {});
    if (!code) return [];

    var item = await resolveItemByCode(cfg, code);
    if (!item || !item.Id) return [];

    var playbackInfo = await fetchPlaybackInfo(cfg, item.Id);
    var play = await resolvePlayTarget(cfg, item, playbackInfo || {});
    if (!play.url) return [];

    // 异步上报不影响返回；不 await 太久
    reportPlaybackStart(cfg, item, play.mediaSource, play.playSessionId, play.mode === "transcode" ? "Transcode" : "DirectStream");

    return [toStreamItem(cfg, item, code, play)];
  } catch (e) {
    return [];
  }
}

async function searchByCode(params) {
  var cfg = syncGlobalParams(params || {});
  assertConfig(cfg);
  var keyword = String((params && params.keyword) || "").trim();
  var code = extractSearchCode(keyword) || normalizeCode(keyword);
  if (!code) return [];
  var items = await searchEmbyItems(cfg, code);
  if (items[0]) writeItemCache(code, items[0]);
  return items.slice(0, 20).map(function (item) {
    return toListItem(item, code);
  });
}
