WidgetMetadata = {
    id: "gm.javplayer",
    title: "JavPlayer",
    version: "1.0.0",
    requiredVersion: "0.0.1",
    description: "JavPlayer — 免费JAV在线播放，日韩有码/无码/中文字幕",
    author: "EL",
    site: "https://javplayer.org",
    detailCacheDuration: 0,
    modules: [
        {
            id: "cat1", title: "素人Amateur", functionName: "getCategoryVideos", cacheDuration: 600,
            params: [
                { name: "typeId", title: "typeId", type: "constant", value: "amateur" },
                {
                    name: "sort", title: "排序", type: "enumeration", value: "new-releases",
                    enumOptions: [
                        { title: "最新发布", value: "new-releases" },
                        { title: "最多观看", value: "most-viewed" },
                        { title: "最多点赞", value: "most-liked" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        },
        {
            id: "cat2", title: "有码Censored", functionName: "getCategoryVideos", cacheDuration: 600,
            params: [
                { name: "typeId", title: "typeId", type: "constant", value: "censored" },
                {
                    name: "sort", title: "排序", type: "enumeration", value: "new-releases",
                    enumOptions: [
                        { title: "最新发布", value: "new-releases" },
                        { title: "最多观看", value: "most-viewed" },
                        { title: "最多点赞", value: "most-liked" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        },
        {
            id: "cat3", title: "无修正Uncensored", functionName: "getCategoryVideos", cacheDuration: 600,
            params: [
                { name: "typeId", title: "typeId", type: "constant", value: "uncensored" },
                {
                    name: "sort", title: "排序", type: "enumeration", value: "new-releases",
                    enumOptions: [
                        { title: "最新发布", value: "new-releases" },
                        { title: "最多观看", value: "most-viewed" },
                        { title: "最多点赞", value: "most-liked" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        },
        {
            id: "cat4", title: "英文字幕Subtitle", functionName: "getCategoryVideos", cacheDuration: 600,
            params: [
                { name: "typeId", title: "typeId", type: "constant", value: "subtitle" },
                {
                    name: "sort", title: "排序", type: "enumeration", value: "new-releases",
                    enumOptions: [
                        { title: "最新发布", value: "new-releases" },
                        { title: "最多观看", value: "most-viewed" },
                        { title: "最多点赞", value: "most-liked" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        },
        {
            id: "loadResource",
            title: "JavPlayer 播放源",
            description: "从 JavPlayer 匹配番号获取播放链接",
            functionName: "loadResource",
            type: "stream",
            params: []
        }
    ],
    search: {
        title: "搜索",
        functionName: "getSearchResults",
        params: [
            { name: "keyword", title: "关键词/番号", type: "input", value: "FC2PPV" },
            { name: "page", title: "页码", type: "page" }
        ]
    }
};

// 全局搜索专用模块（与 search 共用 functionName）
WidgetMetadata.modules.push({
    id: "searchGlobal",
    title: "搜索",
    functionName: "getSearchResults",
    cacheDuration: 180,
    params: [
        { name: "keyword", title: "关键词/番号", type: "input", value: "SSNI" },
        { name: "page", title: "页码", type: "page" }
    ]
});

var BASE_URL = "https://javplayer.org";

var REQUEST_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.5"
};
var IMAGE_HEADERS = {
    "User-Agent": REQUEST_HEADERS["User-Agent"],
    "Referer": BASE_URL + "/"
};

function safeText(text) { return (text || "").replace(/\s+/g, " ").trim(); }
function normalizeImageUrl(src) { if (!src) return ""; src = src.trim(); if (src.startsWith("//")) src = "https:" + src; return src; }

async function fetchPage(url) {
    var resp = await Widget.http.get(url, { headers: REQUEST_HEADERS });
    if (!resp || !resp.data) throw new Error("页面加载失败");
    return resp.data;
}

function parseVideoList(html) {
    var $ = Widget.html.load(html), items = [], seen = {};
    $(".card").each(function () {
        var $el = $(this);
        var $link = $el.find(".card__title a").first();
        if (!$link.length) return;
        var href = $link.attr("href") || "";
        if (!href) return;
        if (href.startsWith("/")) href = BASE_URL + href;
        if (seen[href]) return;
        seen[href] = true;

        // 封面图
        var $img = $el.find(".card__cover img").first();
        var coverUrl = normalizeImageUrl($img.attr("data-src") || $img.attr("src") || "");

        // 标题
        var title = safeText($link.text());

        // 番号
        var code = "";
        var $code = $el.find(".card__category a").first();
        if ($code.length) code = safeText($code.text());

        // 时长
        var durText = "";
        var $dur = $el.find(".card__rate").first();
        if ($dur.length) durText = safeText($dur.text()) + "min";

        // 标签 (Uncensored / English Subtitle)
        var label = "";
        var $label = $el.find(".card__cover_label");
        if ($label.length) label = safeText($label.text());

        // 组合标题: [标签] 标题 + 番号
        var fullTitle = title;
        if (code) fullTitle = code + " " + fullTitle;
        if (label) fullTitle = "[" + label + "] " + fullTitle;

        var idMatch = href.match(/\/v\/(.+)/);
        var id = idMatch ? idMatch[1] : href;

        items.push({
            id: id,
            type: "url",
            mediaType: "movie",
            title: fullTitle || "Untitled",
            coverUrl: coverUrl,
            posterPath: coverUrl,
            durationText: durText,
            link: href,
            headers: IMAGE_HEADERS
        });
    });
    return items;
}

async function getSearchResults(params) {
    var query = (params.peopleId ? params.peopleId.replace(/^actor:/, "").trim() : "") ||
                (params.genreId || params.keyword || params.search_query || "").trim();
    if (!query) return [];
    var page = Math.max(1, Number(params.page) || 1);
    var url = BASE_URL + "/search/" + encodeURIComponent(query);
    if (page > 1) url = url + "/pg-" + page;
    return parseVideoList(await fetchPage(url));
}

async function getCategoryVideos(params) {
    var page = Math.max(1, Number(params.page) || 1);
    var sort = params.sort || "new-releases";

    // 从详情页点演员进来 → 走搜索
    var peopleQuery = params.peopleId || "";
    if (peopleQuery) {
        peopleQuery = peopleQuery.replace(/^actor:/, "").trim();
        if (peopleQuery) {
            var url = BASE_URL + "/search/" + encodeURIComponent(peopleQuery);
            if (page > 1) url = url + "/pg-" + page;
            return parseVideoList(await fetchPage(url));
        }
    }

    var typeId = params.genreId || params.typeId || "amateur";
    var url;
    if (typeId === "amateur") url = BASE_URL + "/amateur";
    else if (typeId === "censored") url = BASE_URL + "/censored";
    else if (typeId === "uncensored") url = BASE_URL + "/uncensored";
    else if (typeId === "subtitle") url = BASE_URL + "/subtitle";
    else url = BASE_URL + "/category/" + typeId;

    if (page > 1) url = url + "/pg-" + page;
    if (sort !== "new-releases") {
        if (page > 1) url = url + "?sort=" + sort;
        else url = url + "?sort=" + sort;
    }
    return parseVideoList(await fetchPage(url));
}

// ========== base64 解码（兼容无 atob 环境） ==========
function _atob(str) {
    if (typeof atob === "function") return atob(str);
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    str = str.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    for (var i = 0; i < str.length; i += 4) {
        var enc1 = chars.indexOf(str.charAt(i));
        var enc2 = chars.indexOf(str.charAt(i + 1));
        var enc3 = chars.indexOf(str.charAt(i + 2));
        var enc4 = chars.indexOf(str.charAt(i + 3));
        var chr1 = (enc1 << 2) | (enc2 >> 4);
        var chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        var chr3 = ((enc3 & 3) << 6) | enc4;
        output += String.fromCharCode(chr1);
        if (enc3 !== 64) output += String.fromCharCode(chr2);
        if (enc4 !== 64) output += String.fromCharCode(chr3);
    }
    return output;
}

// ========== base64 编码（兼容无 btoa 环境） ==========
function _btoa(str) {
    if (typeof btoa === "function") return btoa(str);
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var bytes = [];
    for (var i = 0; i < str.length; i++) {
        bytes.push(str.charCodeAt(i));
    }
    for (var i = 0; i < bytes.length; i += 3) {
        var b1 = bytes[i], b2 = i + 1 < bytes.length ? bytes[i + 1] : 0, b3 = i + 2 < bytes.length ? bytes[i + 2] : 0;
        output += chars.charAt(b1 >> 2);
        output += chars.charAt(((b1 & 3) << 4) | (b2 >> 4));
        output += i + 1 < bytes.length ? chars.charAt(((b2 & 15) << 2) | (b3 >> 6)) : "=";
        output += i + 2 < bytes.length ? chars.charAt(b3 & 63) : "=";
    }
    return output;
}

// ========== XOR 解密（对应 main.js 中的 xorDecrypt） ==========
function xorDecrypt(encoded, key) {
    if (!encoded) return "";
    var decoded = _atob(encoded);
    if (!key) return decoded;
    var result = "";
    for (var i = 0; i < decoded.length; i++) {
        result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
}

// ========== 从 HTML 中提取 meta token & socket ==========
function extractMetaAuth(html) {
    var $ = Widget.html.load(html);
    var token = $('meta[name="_token"]').attr("value") || "";
    var socket = $('meta[name="_socket"]').attr("value") || "";
    return { token: token, socket: socket };
}

// ========== 从 HTML 中提取 filmId ==========
function extractFilmId(html) {
    var m = html.match(/filmId\s*=\s*(\d+)/);
    return m ? m[1] : "";
}

// ========== 从 HTML 中提取 __pt 和 __pk ==========
function extractPtPk(html) {
    var pt = "", pk = "";
    var m = html.match(/window\.__pt\s*=\s*"([^"]+)"/);
    if (m) pt = m[1];
    m = html.match(/window\.__pk\s*=\s*"([^"]+)"/);
    if (m) pk = m[1];
    return { pt: pt, pk: pk };
}

// ========== 从 iframe embed HTML 中提取 src URL ==========
function extractIframeUrl(html) {
    var m = html.match(/src="([^"]+)"/);
    return m ? m[1] : "";
}

// ========== loadDetail - 核心逻辑 ==========
async function loadDetail(link) {
    if (!link) return null;

    // 抓详情页 HTML
    var html = await fetchPage(link);

    // 检查 Cloudflare 拦截
    if (html.indexOf("cf_chl_opt") >= 0 || html.indexOf("Just a moment") >= 0) {
        console.log("[JavPlayer] loadDetail: Cloudflare blocked");
        return null;
    }

    // 提取认证信息
    var auth = extractMetaAuth(html);
    if (!auth.token || !auth.socket) {
        console.log("[JavPlayer] loadDetail: token/socket not found");
        return null;
    }

    // 提取 filmId
    var filmId = extractFilmId(html);
    if (!filmId) {
        console.log("[JavPlayer] loadDetail: filmId not found");
        return null;
    }

    // 提取 __pt 和 __pk
    var pp = extractPtPk(html);
    if (!pp.pt || !pp.pk) {
        console.log("[JavPlayer] loadDetail: pt/pk not found");
        return null;
    }

    // 构造 Authorization header
    var authStr = _btoa(auth.token + ":" + auth.socket);
    var postHeaders = {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
        "Authorization": "Basic " + authStr,
        "Referer": BASE_URL + "/",
        "User-Agent": REQUEST_HEADERS["User-Agent"]
    };

    // 调用 /ajax/player 获取播放地址
    var videoUrl = "";
    var playerError = "";
    var debugInfo = [];
    try {
        var body = "episode=0&filmId=" + filmId + "&pt=" + pp.pt;
        var resp = await Widget.http.post(BASE_URL + "/ajax/player", body, { headers: postHeaders });
        if (resp && resp.data) {
            debugInfo.push("POST /ajax/player: ✅");
            var item = typeof resp.data === "string" ? JSON.parse(resp.data) : resp.data;
            if (item.error) {
                playerError = "服务器拒绝: " + (item.code || item.error);
                debugInfo.push("服务器错误: " + (item.code || item.error));
            } else if (item.player_enc) {
                debugInfo.push("player_enc: ✅");
                var decrypted = xorDecrypt(item.player_enc, pp.pk);
                var iframeUrl = extractIframeUrl(decrypted);
                debugInfo.push("iframeUrl: " + (iframeUrl ? iframeUrl.substring(0, 60) : "❌ 未找到"));
                if (iframeUrl) {
                    var directUrl = iframeUrl.replace("http://", "https://").replace("emturbovid.com", "turbovidhls.com");
                    var iframeHtml = "";
                    try {
                        var iframeResp = await Widget.http.get(directUrl, { headers: REQUEST_HEADERS });
                        if (iframeResp) {
                            var raw = iframeResp.data || iframeResp.body || "";
                            if (typeof raw === "string") iframeHtml = raw;
                            else if (typeof raw === "object" && raw.body) iframeHtml = String(raw.body);
                            else try { iframeHtml = JSON.stringify(raw); } catch(e){}
                            debugInfo.push("GET turbovidhls: ✅ " + (typeof raw === "string" ? raw.length + " chars" : typeof raw));
                        } else {
                            debugInfo.push("GET turbovidhls: ❌ 无响应");
                        }
                    } catch (e2) {
                        playerError = "视频源加载失败: " + e2.message;
                        debugInfo.push("GET turbovidhls: ❌ " + e2.message);
                    }
                    // 从 HTML 中提取直链 — 多模式匹配
                    var extractVideoUrl = function(html) {
                        // 模式1: var urlPlay = '...'
                        var m = html.match(/var urlPlay\s*=\s*['"]([^'"]+)['"]/);
                        if (m) return { url: m[1], mode: "urlPlay" };
                        // 模式2: var (url|videoUrl|videoSrc|source|file|src) = '...mp4/m3u8...'
                        m = html.match(/var\s+(?:url|videoUrl|videoSrc|source|file)\s*=\s*['"]([^'"]+\.(?:mp4|m3u8)[^'"]*)['"]/i);
                        if (m) return { url: m[1], mode: "var " + m[0].split("=")[0].trim() };
                        // 模式3: <video ... src="...mp4/m3u8...">
                        m = html.match(/<video[^>]*src=["'"]([^"']+\.(?:mp4|m3u8)[^"']*)["']/i);
                        if (m) return { url: m[1], mode: "video tag" };
                        // 模式4: jwplayer file: '...'
                        m = html.match(/file:\s*['"]([^'"]+\.(?:mp4|m3u8)[^'"]*)['"]/i);
                        if (m) return { url: m[1], mode: "jwplayer file" };
                        // 模式5: 页面中任何 .mp4 或 .m3u8 URL
                        m = html.match(/https?:\/\/[^'"\s<>]+\.(?:mp4|m3u8)[^'"\s<>]*/i);
                        if (m) return { url: m[0], mode: "raw URL" };
                        return null;
                    };
                    var result = extractVideoUrl(iframeHtml);
                    if (result) {
                        videoUrl = result.url;
                        debugInfo.push("直链: ✅ [" + result.mode + "] " + result.url.substring(0, 50));
                    } else {
                        debugInfo.push("直链: ❌ 未找到视频源 (首80: " + iframeHtml.substring(0, 80).replace(/\n/g, " ") + ")");
                    }
                    if (!videoUrl) {
                        videoUrl = iframeUrl;
                        debugInfo.push("兜底: 使用 iframeUrl");
                    }
                } else {
                    debugInfo.push("iframeUrl: ❌ 解密结果无 src");
                }
            } else {
                debugInfo.push("player_enc: ❌ 响应中无 player_enc");
            }
        } else {
            debugInfo.push("POST /ajax/player: ❌ 无响应");
        }
    } catch (e) {
        playerError = "请求异常: " + (e.message || "");
        debugInfo.push("POST /ajax/player: ❌ " + (e.message || "未知错误"));
    }

    // ====== 提取元数据 ======
    var $ = Widget.html.load(html), title = "", code = "";

    // 标题 + 番号
    var $h1 = $("h1").first();
    if ($h1.length) title = safeText($h1.text());

    // 封面图
    var posterPath = "";
    var $cover = $("#tab-info .card__cover img").first();
    if ($cover.length) posterPath = normalizeImageUrl($cover.attr("src") || "");

    // 元数据卡
    var $metaLis = $(".card__meta li");

    // 上映日期
    var releaseDate = "";
    var studio = "";
    var durationText = "";
    var playerError = playerError || "";

    $metaLis.each(function () {
        var text = safeText($(this).text());
        if (text.indexOf("Release Date:") >= 0) {
            var m = text.match(/(\w+\.\s*\d+,\s*\d{4})/);
            if (m) {
                var d = new Date(m[1]);
                if (!isNaN(d.getTime())) {
                    releaseDate = d.getFullYear() + "-" +
                        String(d.getMonth() + 1).padStart(2, "0") + "-" +
                        String(d.getDate()).padStart(2, "0");
                }
            }
        }
        if (text.indexOf("Studio:") >= 0) {
            var $a = $(this).find("a").first();
            if ($a.length) studio = safeText($a.text());
        }
        if (text.indexOf("Running time:") >= 0) {
            durationText = safeText(text.replace("Running time:", ""));
        }
    });

    // 番号（从 URL 或页面提取）
    var codeMatch = link.match(/\/v\/(.+)/);
    if (codeMatch) code = codeMatch[1];

    // 分类（genreItems）
    var genreItems = [];
    $(".card__meta li:contains('Categories:') a").each(function () {
        var $a = $(this);
        var name = safeText($a.text());
        var href = $a.attr("href") || "";
        var m = href.match(/\/category\/([^/]+)/);
        var id = m ? m[1] : name;
        if (name) genreItems.push({ id: id, title: name });
    });

    // 演员（peoples）— 从 Model(s) 字段的 <a> 链接提取
    var peoples = [];
    $(".card__meta li:contains('Model(s):') a").each(function () {
        var $a = $(this);
        var name = safeText($a.text());
        if (name) {
            // 提取纯英文名用于 ID
            var href = $a.attr("href") || "";
            var m = href.match(/\/model\/([^/]+)/);
            var id = m ? "actor:" + m[1] : "actor:" + name;
            peoples.push({ id: id, title: name });
        }
    });

    // 制作商/Studio 作为分类
    if (studio) {
        var studioSlug = studio.toLowerCase().replace(/[\s]+/g, "-");
        genreItems.push({ id: studioSlug, title: studio + " (Studio)" });
    }

    // 组合标题
    var displayTitle = title || code || "视频播放";
    if (code && title.indexOf(code) < 0) {
        displayTitle = code + " " + title;
    }

    return {
        id: link,
        type: "url",
        mediaType: "movie",
        videoUrl: videoUrl || "",
        title: displayTitle,
        coverUrl: posterPath,
        backdropPath: posterPath,
        posterPath: posterPath,
        releaseDate: releaseDate,
        durationText: durationText,
        description: debugInfo.length > 0 ? debugInfo.join(" | ") : (playerError ? "⚠️ " + playerError : undefined),
        genreItems: genreItems.length > 0 ? genreItems : undefined,
        peoples: peoples.length > 0 ? peoples : undefined,
        playerType: "system",
        headers: IMAGE_HEADERS,
        customHeaders: { "Referer": BASE_URL + "/", "User-Agent": REQUEST_HEADERS["User-Agent"] },
        link: link
    };
}

// ========== 从番号获取 JavPlayer 播放地址（供 loadResource 使用） ==========
async function getPlayUrl(link) {
    var html = await fetchPage(link);
    if (html.indexOf("cf_chl_opt") >= 0 || html.indexOf("Just a moment") >= 0) return "";
    var auth = extractMetaAuth(html);
    if (!auth.token || !auth.socket) return "";
    var filmId = extractFilmId(html);
    if (!filmId) return "";
    var pp = extractPtPk(html);
    if (!pp.pt || !pp.pk) return "";

    var authStr = _btoa(auth.token + ":" + auth.socket);
    var postHeaders = {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
        "Authorization": "Basic " + authStr,
        "Referer": BASE_URL + "/",
        "User-Agent": REQUEST_HEADERS["User-Agent"]
    };

    try {
        var resp = await Widget.http.post(BASE_URL + "/ajax/player", "episode=0&filmId=" + filmId + "&pt=" + pp.pt, { headers: postHeaders });
        if (resp && resp.data) {
            var item = typeof resp.data === "string" ? JSON.parse(resp.data) : resp.data;
            if (item.player_enc) {
                var decrypted = xorDecrypt(item.player_enc, pp.pk);
                var iframeUrl = extractIframeUrl(decrypted);
                if (iframeUrl) {
                    var directUrl = iframeUrl.replace("http://", "https://").replace("emturbovid.com", "turbovidhls.com");
                    var iframeResp = await Widget.http.get(directUrl, { headers: REQUEST_HEADERS });
                    if (iframeResp) {
                        var iframeHtml = typeof (iframeResp.data || "") === "string" ? (iframeResp.data || "") : String(iframeResp.data || "");
                        if (iframeHtml) {
                            var m = iframeHtml.match(/var urlPlay\s*=\s*['"]([^'"]+)['"]/);
                            if (m) return m[1];
                            m = iframeHtml.match(/https?:\/\/[^'"\s<>]+\.(?:mp4|m3u8)[^'"\s<>]*/i);
                            if (m) return m[0];
                        }
                    }
                    return iframeUrl;
                }
            }
        }
    } catch (e) {}
    return "";
}

// ========== Stream Source 入口：根据当前视频信息匹配 JavPlayer 播放链接 ==========
async function loadResource(params) {
    // 从 params 中提取番号
    var rawCode = (params.code || params.number || params.videoId || params.title || params.keyword || "").toString().trim();
    var code = "";
    // 优先匹配 FC2/FC2PPV
    var m = rawCode.match(/FC2[- ]?PPV[- ]?\d{5,8}/i);
    if (m) code = m[0];
    else {
        m = rawCode.match(/[A-Z]{2,10}[- ]?\d{2,6}[A-Z]?/);
        if (m) code = m[0];
    }
    if (!code) {
        // 递归扫描所有字符串字段
        var all = [];
        function scan(v, d) {
            if (!v || d > 3) return;
            if (typeof v === "string" && v.length > 3) all.push(v);
            else if (typeof v === "object") for (var k in v) scan(v[k], d + 1);
        }
        scan(params, 0);
        for (var i = 0; i < all.length; i++) {
            m = all[i].match(/FC2[- ]?PPV[- ]?\d{5,8}|[A-Z]{2,10}[- ]?\d{2,6}[A-Z]?/);
            if (m) { code = m[0]; break; }
        }
        if (!code) return [];
    }

    // 清理番号
    code = code.replace(/[\s_]/g, "-").replace(/-+/g, "-").replace(/^[-]+|[-]+$/g, "").toLowerCase();
    if (!code) return [];

    var link = BASE_URL + "/v/" + code;
    try {
        var playUrl = await getPlayUrl(link);
        if (!playUrl) return [];

        return [{
            name: "JavPlayer",
            description: code.toUpperCase(),
            url: playUrl,
            customHeaders: { "Referer": BASE_URL + "/", "User-Agent": REQUEST_HEADERS["User-Agent"] }
        }];
    } catch (e) {
        return [];
    }
}
