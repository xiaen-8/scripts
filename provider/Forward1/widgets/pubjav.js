// ============================================================
//  PUBJAV — 视频列表、详情、搜索模块
//  源站: https://pubjav.com
//  HTML 解析 + Ajax API + XOR 解密获取播放地址
// ============================================================

WidgetMetadata = {
  id: "forward.pubjav",
  title: "PUBJAV",
  version: "1.1.1",
  requiredVersion: "0.0.1",
  description: "PUBJAV 日本 AV 在线观看模块。\n支持分类浏览：有码 / 无码 / 素人 / 无码破解 / 无码流出。\n支持番号/标题搜索、多画质 HLS 播放、演员/分类关联跳转。\n数据源: https://pubjav.com — 每日更新，10万+ 部影片。",
  author: "EL",
  site: "https://pubjav.com",
  icon: "https://pubjav.com/assets/css/img/footer_logo.png",
  detailCacheDuration: 60,
  modules: [
    {
      id: "latest",
      title: "最新视频",
      functionName: "loadList",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "censored",
      title: "有码",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "catType", title: "", type: "constant", value: "censored" },
        { name: "page", title: "页码", type: "page" },
        { name: "sort_by", title: "排序", type: "enumeration", enumOptions: [
          { title: "最新更新", value: "desc" },
          { title: "最旧更新", value: "asc" },
          { title: "发行日期", value: "release" },
          { title: "最多观看", value: "viewed" },
          { title: "最多喜欢", value: "liked" },
          { title: "最多收藏", value: "favorite" }
        ], value: "release" }
      ]
    },
    {
      id: "uncensored",
      title: "无码",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "catType", title: "", type: "constant", value: "uncensored" },
        { name: "page", title: "页码", type: "page" },
        { name: "sort_by", title: "排序", type: "enumeration", enumOptions: [
          { title: "最新更新", value: "desc" },
          { title: "最旧更新", value: "asc" },
          { title: "发行日期", value: "release" },
          { title: "最多观看", value: "viewed" },
          { title: "最多喜欢", value: "liked" },
          { title: "最多收藏", value: "favorite" }
        ], value: "desc" }
      ]
    },
    {
      id: "amateur",
      title: "素人",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "catType", title: "", type: "constant", value: "amateur" },
        { name: "page", title: "页码", type: "page" },
        { name: "sort_by", title: "排序", type: "enumeration", enumOptions: [
          { title: "最新更新", value: "desc" },
          { title: "最旧更新", value: "asc" },
          { title: "发行日期", value: "release" },
          { title: "最多观看", value: "viewed" },
          { title: "最多喜欢", value: "liked" },
          { title: "最多收藏", value: "favorite" }
        ], value: "desc" }
      ]
    },
    {
      id: "reducingmosaic",
      title: "无码破解",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "catType", title: "", type: "constant", value: "reducing-mosaic" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "uncensoredleak",
      title: "无码流出",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "catType", title: "", type: "constant", value: "uncensored-leaked" },
        { name: "page", title: "页码", type: "page" }
      ]
    }
  ],
  search: {
    title: "搜索番号/标题",
    functionName: "searchVideos",
    params: [
      { name: "keyword", title: "番号或关键词", type: "input", value: "" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

// ============================================================
//  常量
// ============================================================
const BASE = "https://pubjav.com";
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1";
const HEADERS = {
  "User-Agent": UA,
  "Referer": BASE + "/"
};

// ============================================================
//  工具函数
// ============================================================

async function fetchPage(url) {
  const resp = await Widget.http.get(url, { headers: HEADERS });
  if (!resp || !resp.data) throw new Error("请求失败: " + url);
  return resp.data;
}

function getText(html, pattern) {
  const m = pattern.exec(html);
  return m ? m[1].trim() : "";
}

/** Base64 解码（兼容不支持 atob 的环境） */
function base64Decode(str) {
  if (typeof atob === "function") return atob(str);
  // 手动 base64 解码
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var output = "";
  var bytes = [];
  for (var i = 0; i < str.length; i++) {
    var c = str.charAt(i);
    var idx = chars.indexOf(c);
    if (idx >= 0) bytes.push(idx);
  }
  for (var i = 0; i < bytes.length; i += 4) {
    var b1 = bytes[i], b2 = bytes[i + 1] || 0, b3 = bytes[i + 2] || 0, b4 = bytes[i + 3] || 0;
    var o1 = (b1 << 2) | (b2 >> 4);
    var o2 = ((b2 & 15) << 4) | (b3 >> 2);
    var o3 = ((b3 & 3) << 6) | b4;
    output += String.fromCharCode(o1);
    if (b3 !== 64) output += String.fromCharCode(o2);
    if (b4 !== 64) output += String.fromCharCode(o3);
  }
  return output;
}

/** XOR 解密 — 与站点 JS 完全一致 */
function xorDecrypt(encoded, key) {
  if (!encoded || !key) return "";
  var decoded = base64Decode(encoded);
  var result = "";
  for (var i = 0; i < decoded.length; i++) {
    result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}

/** 从 m3u8 URL 中提取视频 ID 以便构建备用 CDN 地址 */
function extractVideoId(m3u8Url) {
  var m = m3u8Url.match(/\/([^/]+)\.m3u8$/);
  return m ? m[1] : "";
}

// ============================================================
//  解析列表页 HTML — 按 ml-item 切块
// ============================================================

function parseListHtml(html) {
  var items = [];
  // 按 /play/{code} 链接切块（只取 a 标签本身，后面的 trailer 链接单独处理）
  var blockRegex = /<a\s[^>]*href="\/play\/([^"]+)"[^>]*>[\s\S]*?<\/a>/g;
  var m;
  while ((m = blockRegex.exec(html)) !== null) {
    var code = m[1];
    var block = m[0];

    // 提取番号显示文本
    var codeDisplay = getText(block, /mli-code[^>]*>([^<]+)</);

    // 提取封面图（优先 data-original lazy 加载）
    var coverMatch = block.match(/data-original="([^"]+)"/);
    if (!coverMatch) coverMatch = block.match(/<img[^>]*src="([^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/);
    var coverUrl = coverMatch ? coverMatch[1] : "";

    // 提取标题（从 mli-info h2）
    var title = getText(block, /mli-info[^>]*>[\s\S]*?<h2>([^<]+)</);
    if (!title) {
      // 回退: 从 a 标签 title 属性提取
      title = getText(block, /title="([^"]+)"/);
    }

    // 提取时长
    var duration = getText(block, /mli-runtimes[^>]*>([^<]+)</);

    // 判断有码/无码
    var isUncensored = block.indexOf('mli-des-uncen') >= 0;
    var displayTitle = (codeDisplay || code);
    if (title && title !== displayTitle) {
      displayTitle = (codeDisplay || code) + " " + title;
    }

    items.push({
      id: code,
      type: "url",
      mediaType: "movie",
      title: displayTitle || code,
      link: code,
      coverUrl: coverUrl || "",
      posterPath: coverUrl || "",
      backdropPath: coverUrl || "",
      durationText: duration || "",
      remark: isUncensored ? "无码" : "有码"
    });
  }
  return items;
}

/** 构建排序参数字符串 */
function buildFilterQuery(params) {
  var sortBy = params.sort_by || "desc";
  if (sortBy !== "desc") return "&sort=" + encodeURIComponent(sortBy);
  return "";
}

// ============================================================
//  loadList — 最新视频列表
//  处理 genreId → loadCategory, peopleId → loadCategory
// ============================================================

async function loadList(params) {
  try {
    if (params.genreId) return loadCategory({ catType: null, page: params.page, genreId: params.genreId });
    if (params.peopleId) return loadCategory({ catType: null, page: params.page, peopleId: params.peopleId });

    var page = Math.max(1, Number(params.page) || 1);
    var filterQs = buildFilterQuery(params);
    var url = page > 1 ? BASE + "/movies/pg-" + page : BASE + "/movies";
    if (filterQs) url += (url.indexOf("?") >= 0 ? "" : "?") + filterQs.substring(1); // 去掉开头的&
    var html = await fetchPage(url);
    return parseListHtml(html);
  } catch (error) {
    console.error("[PUBJAV loadList] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadCategory — 按分类/演员/厂商浏览
// ============================================================

async function loadCategory(params) {
  try {
    var page = Math.max(1, Number(params.page) || 1);

    // 处理详情页跳转过来的 genreId / peopleId
    if (params.genreId) {
      var url = page > 1 ? BASE + "/genre/" + params.genreId + "?page=" + page : BASE + "/genre/" + params.genreId;
      var html = await fetchPage(url);
      return parseListHtml(html);
    }
    if (params.peopleId) {
      var url = page > 1 ? BASE + "/actor/" + params.peopleId + "?page=" + page : BASE + "/actor/" + params.peopleId;
      var html = await fetchPage(url);
      return parseListHtml(html);
    }

    var catType = params.catType || "";
    if (!catType) return [];

    var filterQs = buildFilterQuery(params);

    // 路径路由: censored/uncensored/amateur 用 /movies?genre= 路径
    // reducing-mosaic/uncensored-leaked 用 /genre/ 路径
    var url;
    var genrePathTypes = ["reducing-mosaic", "uncensored-leaked"];
    if (genrePathTypes.indexOf(catType) >= 0) {
      url = page > 1 ? BASE + "/genre/" + encodeURIComponent(catType) + "?page=" + page : BASE + "/genre/" + encodeURIComponent(catType);
    } else {
      url = page > 1 ? BASE + "/movies?genre=" + encodeURIComponent(catType) + "&pg=" + page : BASE + "/movies?genre=" + encodeURIComponent(catType);
    }
    if (filterQs) {
      // filterQs 以 & 开头，需要判断 URL 是否已有 ?
      if (url.indexOf("?") >= 0) {
        url += filterQs;
      } else {
        url += "?" + filterQs.substring(1);
      }
    }
    var html = await fetchPage(url);
    return parseListHtml(html);
  } catch (error) {
    console.error("[PUBJAV loadCategory] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  searchVideos — 搜索（POST /ajax/search）
// ============================================================

async function searchVideos(params) {
  try {
    var keyword = (params.keyword || "").trim();
    if (!keyword) throw new Error("请输入搜索关键词");

    var page = Math.max(1, Number(params.page) || 1);

    // 先尝试用站内搜索 API
    try {
      var resp = await Widget.http.post(BASE + "/ajax/search", "q=" + encodeURIComponent(keyword) + "&page=" + page, {
        headers: {
          "User-Agent": UA,
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Referer": BASE + "/"
        }
      });

      if (resp && resp.data) {
        var data = typeof resp.data === "string" ? JSON.parse(resp.data) : resp.data;
        if (data && data.hits && data.hits.length > 0) {
          return data.hits.map(function(item) {
            var code = (item._formatted && item._formatted.code) || item.code || "";
            var name = (item._formatted && item._formatted.name) || item.name || "";
            var poster = (item._formatted && item._formatted.poster) || item.poster || "";
            var nameJp = (item._formatted && item._formatted.name_jp) || "";
            var thumb = (item._formatted && item._formatted.thumbinfo) || "";

            // 尝试获取 actors
            var actors = (item._formatted && item._formatted.actors) || item.actors || [];
            var actorStr = Array.isArray(actors) ? actors.join(", ") : "";

            return {
              id: code,
              type: "url",
              mediaType: "movie",
              title: code + " " + (nameJp || name),
              link: code,
              coverUrl: poster || thumb || "",
              posterPath: poster || thumb || "",
              backdropPath: poster || thumb || "",
              description: name,
              remark: actorStr || code
            };
          });
        }
      }
    } catch (e) {
      console.error("[PUBJAV searchVideos] API搜索失败，尝试直查:", e.message || e);
    }

    // 回退: 尝试作为番号直接查详情页
    try {
      var detailUrl = BASE + "/play/" + encodeURIComponent(keyword.toUpperCase());
      var html = await fetchPage(detailUrl);
      var ogTitle = getText(html, /<meta[^>]+property="og:title"[^>]+content="([^"]+)"/);
      if (ogTitle) {
        var ogImage = getText(html, /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/);
        return [{
          id: keyword.toUpperCase(),
          type: "url",
          mediaType: "movie",
          title: ogTitle || keyword,
          link: keyword.toUpperCase(),
          coverUrl: ogImage || "",
          posterPath: ogImage || "",
          backdropPath: ogImage || "",
          remark: keyword.toUpperCase()
        }];
      }
    } catch (e) {
      // 不是有效的番号
    }

    return [];
  } catch (error) {
    console.error("[PUBJAV searchVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  getPlayableUrl — 通过 /ajax/player 获取可播放的视频 URL
//  采用 XOR 解密 + iframe 提取 m3u8 的完整链路
//  参考 javplayer.js 的处理方式
// ============================================================

async function getPlayableUrl(filmId, episodeId, pt, pk) {
  try {
    // Step 1: POST /ajax/player 获取加密播放器 HTML
    // ⚠️ body 必须是 form-urlencoded 字符串，不是对象！
    var bodyStr = "episode=" + String(episodeId) + "&filmId=" + String(filmId) + "&pt=" + pt;
    var resp = await Widget.http.post(BASE + "/ajax/player", bodyStr, {
      headers: {
        "User-Agent": UA,
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Referer": BASE + "/"
      }
    });

    if (!resp || !resp.data) return "";

    var data = typeof resp.data === "string" ? JSON.parse(resp.data) : resp.data;
    if (data.error || !data.player_enc) {
      console.error("[PUBJAV getPlayableUrl] 播放接口错误:", data.error || "无数据");
      return "";
    }

    // Step 2: XOR 解密得到 iframe HTML
    var decrypted = xorDecrypt(data.player_enc, pk);
    if (!decrypted) return "";

    // Step 3: 从解密后的 HTML 中提取 iframe src
    var iframeMatch = decrypted.match(/src="([^"]+)"/);
    if (!iframeMatch) return "";

    var iframeUrl = iframeMatch[1];
    // 统一 HTTPS
    iframeUrl = iframeUrl.replace(/^http:\/\//i, "https://");

    // Step 4: 域名替换绕过 Cloudflare（参考 javplayer.js）
    var fetchUrl = iframeUrl
      .replace("emturbovid.com", "turbovidhls.com")
      .replace("vidply.com", "vidplyhls.com");

    // Step 5: 请求 iframe/替代页面，提取 m3u8/视频直链
    try {
      var iframeResp = await Widget.http.get(fetchUrl, { headers: HEADERS });

      if (iframeResp && iframeResp.data) {
        var iframeHtml = typeof iframeResp.data === "string" ? iframeResp.data : String(iframeResp.data);

        // 多模式提取视频直链（参考 javplayer.js extractVideoUrl）
        // 模式1: var urlPlay = '...'
        var m1 = iframeHtml.match(/var\s+urlPlay\s*=\s*['"]([^'"]+)['"]/);
        if (m1) return m1[1];

        // 模式2: var (url|videoUrl|videoSrc|source|file) = '...mp4/m3u8...'
        var m2 = iframeHtml.match(/var\s+(?:url|videoUrl|videoSrc|source|file)\s*=\s*['"]([^'"]+\.(?:mp4|m3u8)[^'"]*)['"]/i);
        if (m2) return m2[1];

        // 模式3: <video ... src="...mp4/m3u8...">
        var m3 = iframeHtml.match(/<video[^>]*src=["']([^"']+\.(?:mp4|m3u8)[^"']*)["']/i);
        if (m3) return m3[1];

        // 模式4: jwplayer file: '...'
        var m4 = iframeHtml.match(/file:\s*['"]([^'"]+\.(?:mp4|m3u8)[^'"]*)['"]/i);
        if (m4) return m4[1];

        // 模式5: 页面中任何 .mp4 或 .m3u8 URL
        var m5 = iframeHtml.match(/https?:\/\/[^'"\s<>]+\.(?:mp4|m3u8)[^'"\s<>]*/i);
        if (m5) {
          // 检测是否是 Google Drive 托管的视频（Google Drive 在非浏览器环境无法播放）
          var detectedUrl = m5[0];
          try {
            var m3u8Resp = await Widget.http.get(detectedUrl, { headers: HEADERS });
            if (m3u8Resp && m3u8Resp.data) {
              var m3u8Content = typeof m3u8Resp.data === "string" ? m3u8Resp.data : String(m3u8Resp.data);
              if (m3u8Content.indexOf("googleusercontent") >= 0 || m3u8Content.indexOf("turbosplayer.com") >= 0) {
                console.log("[PUBJAV getPlayableUrl] Google Drive 视频源，不可播，跳过");
                return "";
              }
            }
          } catch (e) {
            // 检测失败，仍返回原 URL
          }
          return detectedUrl;
        }
      }
    } catch (e) {
      console.error("[PUBJAV getPlayableUrl] iframe 提取失败:", e.message || e);
    }

    // Step 6: 兜底 — 返回 iframe URL 让 App 在 WebView 中播放
    return iframeUrl;
  } catch (error) {
    console.error("[PUBJAV getPlayableUrl] 失败:", error.message || error);
    return "";
  }
}

// ============================================================
//  loadDetail — 视频详情
//  获取播放地址、演员、分类、剧照等
// ============================================================

async function loadDetail(link) {
  if (!link) throw new Error("无效的视频 ID");

  try {
    var code = String(link).replace(/[^a-zA-Z0-9-_]/g, "").toUpperCase();
    if (!code) throw new Error("无效的视频 ID");

    // 获取详情页 HTML
    var pageUrl = BASE + "/play/" + encodeURIComponent(code.toLowerCase());
    var html = await fetchPage(pageUrl);

    // 提取 __pt 和 __pk（用于播放解密）
    var pt = getText(html, /window\.__pt\s*=\s*"([^"]+)"/);
    var pk = getText(html, /window\.__pk\s*=\s*"([^"]+)"/);

    // 提取 filmId（data-source）
    var filmId = getText(html, /data-source="([^"]+)"/);

    // 提取 TB episode ID（默认服务器）
    var tbEpisodeId = "";
    var tbMatch = html.match(/<button[^>]*data-id="(\d+)"[^>]*>.*?<\/(?:i|span)>[^<]*TB<\/button>/i);
    if (tbMatch) tbEpisodeId = tbMatch[1];

    // 标题（og:title）
    var title = getText(html, /<meta[^>]+property="og:title"[^>]+content="([^"]+)"/);
    if (title) {
      title = title.replace(/ - Watch JAV.*$/, "").replace(/ \| PUBJAV.*$/, "").trim();
    }

    // 缩略图（og:image）
    var thumb = getText(html, /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/);

    // 描述
    var description = getText(html, /<meta[^>]+name="description"[^>]+content="([^"]+)"/);

    // 发行日期
    var releaseDate = getText(html, /Released Date:[^<]*<strong>([^<]+)</);

    // Runtime
    var runtime = getText(html, /Runtime:[^<]*<strong>[\s\S]*?(\d+)\s*minute/);

    // Version (Censored/Uncensored)
    var version = getText(html, /Version:[^<]*<strong>([^<]+)</);

    // 演员（去重）
    var peoples = [];
    var seenActors = {};
    var actorRegex = /<a[^>]*href="\/actor\/([^"]+)"[^>]*title="([^"]+)"[^>]*>[\s\S]*?<strong>([^<]+)<\/strong>/g;
    var am;
    while ((am = actorRegex.exec(html)) !== null) {
      var aid = am[1];
      if (!seenActors[aid]) {
        seenActors[aid] = true;
        peoples.push({
          id: aid,
          title: am[3] || am[2],
          role: "actor"
        });
      }
    }

    // 如果上面的正则没匹配到，尝试更简单的
    if (peoples.length === 0) {
      var simpleActorRegex = /Actor\(s\):[^<]*<span>[\s\S]*?<a[^>]*href="\/actor\/([^"]+)"[^>]*>([^<]+)</g;
      while ((am = simpleActorRegex.exec(html)) !== null) {
        var aid2 = am[1];
        if (!seenActors[aid2]) {
          seenActors[aid2] = true;
          peoples.push({
            id: aid2,
            title: am[2].trim(),
            role: "actor"
          });
        }
      }
    }

    // 分类（去重）
    var genreItems = [];
    var seenGenres = {};
    var genreRegex = /<a[^>]*href="\/genre\/([^"]+)"[^>]*title="([^"]+)"[^>]*>[\s\S]*?<strong>([^<]+)<\/strong>/g;
    var gm;
    while ((gm = genreRegex.exec(html)) !== null) {
      var gid = gm[1];
      if (!seenGenres[gid]) {
        seenGenres[gid] = true;
        genreItems.push({ id: gid, title: gm[3] || gm[2] });
      }
    }

    // 制作商
    var studio = getText(html, /Studio:[^<]*<span[^>]*>[\s\S]*?<a[^>]*href="\/studio\/([^"]+)"[^>]*>[\s\S]*?<strong>([^<]+)<\/strong>/);

    // 剧照（从 itemprop="image" 提取）
    var backdropPaths = [];
    var shotRegex = /<img[^>]*itemprop="image"[^>]*src="([^"]+)"[^>]*>/g;
    var bm;
    while ((bm = shotRegex.exec(html)) !== null) {
      if (bm[1] && backdropPaths.indexOf(bm[1]) === -1) {
        backdropPaths.push(bm[1]);
      }
    }

    // 获取可播放的 URL
    var videoUrl = "";
    var playHeaders = {};

    if (filmId && tbEpisodeId && pt && pk) {
      videoUrl = await getPlayableUrl(filmId, tbEpisodeId, pt, pk);
      playHeaders = {
        "Referer": BASE + "/",
        "User-Agent": UA
      };
    }

    // 预告片/正片
    var trailers = [];
    if (videoUrl) {
      trailers.push({ url: videoUrl, coverUrl: thumb || "" });
    }

    // 构建返回对象
    var result = {
      id: code,
      type: "url",
      mediaType: "movie",
      title: title || code,
      link: code,
      coverUrl: thumb || "",
      posterPath: thumb || "",
      backdropPath: thumb || "",
      videoUrl: videoUrl || "",
      customHeaders: playHeaders,
      playerType: "app",
      genreItems: genreItems.length > 0 ? genreItems : undefined,
      peoples: peoples.length > 0 ? peoples : undefined,
      backdropPaths: backdropPaths.length > 0 ? backdropPaths : (thumb ? [thumb] : undefined),
      trailers: trailers,
      description: description || undefined,
      releaseDate: releaseDate || undefined,
      durationText: runtime ? runtime + " min" : undefined,
      remark: code + (version ? " [" + version + "]" : "")
    };

    // 如果有相关推荐，从 "You May Also Like" 区域提取
    try {
      var relatedHtml = html.match(/You May Also Like\?[\s\S]*?(?:<div class="ml-item">[\s\S]*?<\/div>\s*<\/div>\s*){1,16}/);
      if (relatedHtml) {
        var relatedItems = parseListHtml(relatedHtml[0]);
        if (relatedItems.length > 0) {
          result.relatedItems = relatedItems;
        }
      }
    } catch (e) {
      // 相关推荐非关键，失败就算了
    }

    return result;
  } catch (error) {
    console.error("[PUBJAV loadDetail] 失败:", error.message || error);
    throw error;
  }
}
