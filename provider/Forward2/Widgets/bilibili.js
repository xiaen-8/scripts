// @name 哔哩影视 Widget
// @description 哔哩官方番剧/国创/纪录片/综艺（已转为Widget格式）
// @version 1.0
// @author Converted from rule

var DEFAULT_HOST = "https://api.bilibili.com";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36";
var DEFAULT_COOKIE = ""; // 可在globalParams中设置

function logInfo(msg, data) {
    if (data) console.log("[哔哩Widget] " + msg, data);
    else console.log("[哔哩Widget] " + msg);
}

function buildHeaders(cookie) {
    var headers = {
        "User-Agent": UA,
        "Referer": "https://www.bilibili.com",
        "Accept": "application/json, text/plain, */*"
    };
    if (cookie) headers["Cookie"] = cookie;
    return headers;
}

async function httpGet(url, cookie = "") {
    try {
        var res = await Widget.http.get(url, { headers: buildHeaders(cookie), timeout: 10000 });
        var data = res && res.data !== undefined ? res.data : res;
        if (typeof data === "string") data = JSON.parse(data);
        return data;
    } catch (e) {
        logInfo("请求失败: " + url, e.message);
        return null;
    }
}

function cleanTitle(title) {
    return String(title || "").replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').trim();
}

function isPreview(title, remark) {
    return (title && title.includes("预告")) || (remark && remark.includes("预告"));
}

// ==================== 分类加载器 ====================
async function loadRank(seasonType, page = 1, useNewRank = false) {
    var url = useNewRank 
        ? `${DEFAULT_HOST}/pgc/season/rank/web/list?season_type=${seasonType}&pagesize=20&page=${page}&day=3`
        : `${DEFAULT_HOST}/pgc/web/rank/list?season_type=${seasonType}&pagesize=20&page=${page}&day=3`;
    var res = await httpGet(url);
    if (!res || res.code !== 0) return [];
    var list = (res.result || res.data || {}).list || [];
    return list.filter(v => !isPreview(v.title, v.new_ep?.index_show || v.index_show))
        .map(v => ({
            id: "bili_detail_" + v.season_id,
            type: "link",
            title: cleanTitle(v.title),
            posterPath: v.cover,
            backdropPath: v.cover,
            description: v.new_ep?.index_show || v.index_show || "",
            link: `bili://detail?season_id=${v.season_id}`
        }));
}

async function loadAll(tid = 1, page = 1, order = "2", seasonStatus = "-1") {
    var url = `${DEFAULT_HOST}/pgc/season/index/result?order=${order}&pagesize=20&type=1&season_type=${tid}&page=${page}&season_status=${seasonStatus}`;
    var res = await httpGet(url);
    if (!res || res.code !== 0) return [];
    var list = (res.data || {}).list || [];
    return list.filter(v => !isPreview(v.title)).map(v => ({
        id: "bili_detail_" + v.season_id,
        type: "link",
        title: cleanTitle(v.title),
        posterPath: v.cover,
        description: v.index_show || "",
        link: `bili://detail?season_id=${v.season_id}`
    }));
}

async function loadTimeline(tid = 1, page = 1) {
    var url = `${DEFAULT_HOST}/pgc/web/timeline/v2?season_type=${tid}&day_before=2&day_after=4`;
    var res = await httpGet(url);
    if (!res || res.code !== 0) return [];
    var videos = [];
    // 最新
    var latest = (res.result || {}).latest || [];
    latest.forEach(v => {
        if (!isPreview(v.title)) videos.push({
            id: "bili_detail_" + v.season_id,
            type: "link",
            title: cleanTitle(v.title),
            posterPath: v.cover,
            description: (v.pub_index || "") + " " + (v.follows || "")
        });
    });
    // 时间表
    var timeline = (res.result || {}).timeline || [];
    timeline.forEach(day => {
        (day.episodes || []).forEach(v => {
            if (v.published === 0 && !isPreview(v.title)) {
                videos.push({
                    id: "bili_detail_" + v.season_id,
                    type: "link",
                    title: cleanTitle(v.title),
                    posterPath: v.cover,
                    description: v.pub_index || ""
                });
            }
        });
    });
    return videos;
}

async function loadFollow(page = 1, type = 1, cookie = "") {  // 1=追番 2=追剧
    var url = `${DEFAULT_HOST}/x/space/bangumi/follow/list?type=${type}&follow_status=0&pn=${page}&ps=10&vmid=0`;
    var res = await httpGet(url, cookie);
    if (!res || res.code !== 0) return [];
    var list = (res.data || {}).list || [];
    return list.map(v => ({
        id: "bili_detail_" + v.season_id,
        type: "link",
        title: cleanTitle(v.title),
        posterPath: v.cover,
        description: v.new_ep?.index_show || ""
    }));
}

// 各分类入口（可直接对应Widget模块）
var loadBangumi = () => loadRank(1, 1);                    // 番剧
var loadGuochuang = () => loadRank(4, 1, true);
var loadMovie = () => loadRank(2, 1);
var loadTV = () => loadRank(5, 1);
var loadDocu = () => loadRank(3, 1);
var loadVariety = () => loadRank(7, 1);
var loadAllCate = (params) => {
    var tid = params.tid || 1;
    var order = params.order || "2";
    var status = params.season_status || "-1";
    return loadAll(tid, params.page || 1, order, status);
};
var loadTimelineCate = (params) => loadTimeline(params.tid || 1, params.page || 1);
var loadFollowBangumi = (params) => loadFollow(params.page || 1, 1, params.Cookie || DEFAULT_COOKIE);
var loadFollowTV = (params) => loadFollow(params.page || 1, 2, params.Cookie || DEFAULT_COOKIE);

// ==================== 搜索 ====================
async function searchBilibili(params) {
    var keyword = (params.wd || params.keyword || "").trim();
    var page = params.pg || 1;
    if (!keyword) return [{ id: "empty", type: "text", title: "请输入搜索关键词" }];

    var urls = [
        `${DEFAULT_HOST}/x/web-interface/search/type?keyword=${encodeURIComponent(keyword)}&page=${page}&search_type=media_bangumi`,
        `${DEFAULT_HOST}/x/web-interface/search/type?keyword=${encodeURIComponent(keyword)}&page=${page}&search_type=media_ft`
    ];

    var allVideos = [];
    for (var u of urls) {
        var res = await httpGet(u);
        if (res && res.code === 0 && res.data && res.data.result) {
            var items = res.data.result || [];
            items.forEach(v => {
                if (!isPreview(v.title, v.index_show)) {
                    allVideos.push({
                        id: "bili_detail_" + v.season_id,
                        type: "link",
                        title: cleanTitle(v.title),
                        posterPath: v.cover,
                        description: v.index_show || "",
                        link: `bili://detail?season_id=${v.season_id}`
                    });
                }
            });
        }
    }
    return allVideos.length ? allVideos : [{ id: "empty", type: "text", title: "未找到相关内容" }];
}

// ==================== 详情 & 播放列表 ====================
async function loadDetail(params) {
    var seasonId = "";
    if (typeof params === "string") {
        var match = params.match(/season_id=(\d+)/);
        seasonId = match ? match[1] : params;
    } else {
        seasonId = params.season_id || params.id || "";
    }
    if (!seasonId) return { id: "error", type: "text", title: "无效的season_id" };

    var url = `${DEFAULT_HOST}/pgc/view/web/season?season_id=${seasonId}`;
    var res = await httpGet(url);
    if (!res || res.code !== 0 || !res.result) return { id: "error", type: "text", title: "获取详情失败" };

    var jo = res.result;
    var episodes = (jo.episodes || []).filter(ep => !isPreview(ep.title, ep.long_title));

    var episodeItems = episodes.map((ep, idx) => {
        var badge = ep.badge ? `[${ep.badge}]` : "";
        var title = `${ep.title} ${ep.long_title || ""} ${badge}`.trim();
        return {
            id: `bili_ep_${ep.id}`,
            type: "url",
            title: title,
            videoUrl: ep.link || `https://www.bilibili.com/bangumi/play/ep${ep.id}`,
            mediaType: "episode"
        };
    });

    var isMovieLike = episodes.length <= 1 && !jo.new_ep;
    return {
        id: "bili_" + seasonId,
        type: "url",
        title: cleanTitle(jo.title),
        description: jo.evaluate || "",
        posterPath: jo.cover,
        backdropPath: jo.cover,
        mediaType: isMovieLike ? "movie" : "tv",
        videoUrl: isMovieLike && episodeItems[0] ? episodeItems[0].videoUrl : null,
        episodeItems: isMovieLike ? [] : episodeItems,
        episode: episodeItems.length
    };
}

// ==================== 智能匹配 (loadResource) ====================
async function loadResource(params) {
    var seriesName = params.seriesName || params.title || params.keyword || params.TestTitle || "";
    var type = params.type === "movie" ? "movie" : "tv";
    var targetEpisode = params.episode ? parseInt(params.episode) : null;
    if (!seriesName) return [];

    var searchResults = await searchBilibili({ wd: seriesName, pg: 1 });
    if (!searchResults.length || searchResults[0].id === "empty") return [];

    // 简单打分取第一个最匹配
    var best = searchResults[0];
    var detail = await loadDetail({ season_id: best.id.replace("bili_detail_", "") });

    var candidates = [];
    if (detail.videoUrl) {
        candidates.push({ title: detail.title, videoUrl: detail.videoUrl });
    }

    var eps = detail.episodeItems || [];
    for (var ep of eps) {
        if (!ep.videoUrl) continue;
        if (type === "movie") {
            candidates.push({ title: ep.title, videoUrl: ep.videoUrl });
            break;
        }
        if (targetEpisode) {
            var epNumMatch = ep.title.match(/第?\s*(\d{1,3})\s*[集话期]/);
            if (epNumMatch && parseInt(epNumMatch[1]) === targetEpisode) {
                candidates.push({ title: ep.title, videoUrl: ep.videoUrl });
            }
        } else {
            candidates.push({ title: ep.title, videoUrl: ep.videoUrl });
        }
    }

    return candidates.map((item, i) => ({
        id: "bili_resource_" + i,
        name: "哔哩影视",
        type: type,
        description: item.title || seriesName,
        url: item.videoUrl
    }));
}

// ==================== WidgetMetadata ====================
WidgetMetadata = {
    id: "bilibili.official",
    title: "哔哩影视",
    icon: "https://www.bilibili.com/favicon.ico",
    version: "1.0",
    requiredVersion: "0.0.1",
    description: "哔哩官方番剧、国创、纪录片、综艺（Widget版）",
    author: "Converted",
    globalParams: [
        { name: "Cookie", title: "Bilibili Cookie（用于追番追剧）", type: "input", value: DEFAULT_COOKIE }
    ],
    search: {
        title: "搜索",
        functionName: "searchBilibili",
        params: [
            { name: "wd", title: "关键词", type: "input", value: "" },
            { name: "pg", title: "页码", type: "page", value: "1" }
        ]
    },
    modules: [
        { id: "bili_bangumi", title: "番剧", functionName: "loadBangumi", type: "video", cacheDuration: 1800 },
        { id: "bili_guochuang", title: "国创", functionName: "loadGuochuang", type: "video", cacheDuration: 1800 },
        { id: "bili_movie", title: "电影", functionName: "loadMovie", type: "video", cacheDuration: 1800 },
        { id: "bili_tv", title: "电视剧", functionName: "loadTV", type: "video", cacheDuration: 1800 },
        { id: "bili_docu", title: "纪录片", functionName: "loadDocu", type: "video", cacheDuration: 1800 },
        { id: "bili_variety", title: "综艺", functionName: "loadVariety", type: "video", cacheDuration: 1800 },
        { id: "bili_all", title: "全部", functionName: "loadAllCate", type: "video", cacheDuration: 1800, 
          params: [
            { name: "tid", title: "分类", type: "enumeration", value: "1", enumOptions: [
                { title: "番剧", value: "1" }, { title: "国创", value: "4" }, { title: "电影", value: "2" },
                { title: "电视剧", value: "5" }, { title: "纪录片", value: "3" }, { title: "综艺", value: "7" }
            ]},
            { name: "order", title: "排序", type: "enumeration", value: "2", enumOptions: [
                { title: "播放数量", value: "2" }, { title: "更新时间", value: "0" }, { title: "最高评分", value: "4" }
            ]},
            { name: "season_status", title: "付费", type: "enumeration", value: "-1", enumOptions: [
                { title: "全部", value: "-1" }, { title: "免费", value: "1" }, { title: "付费", value: "2,6" }
            ]},
            { name: "page", title: "页码", type: "page", value: "1" }
          ]
        },
        { id: "bili_timeline", title: "时间表", functionName: "loadTimelineCate", type: "video", cacheDuration: 1800 },
        { id: "bili_follow_bangumi", title: "我的追番", functionName: "loadFollowBangumi", type: "video", cacheDuration: 600 },
        { id: "bili_follow_tv", title: "我的追剧", functionName: "loadFollowTV", type: "video", cacheDuration: 600 },
        { id: "bili_search", title: "搜索", functionName: "searchBilibili", type: "video", cacheDuration: 300 },
        { id: "loadDetail", title: "详情", functionName: "loadDetail", type: "video", cacheDuration: 60 },
        { id: "loadResource", title: "智能匹配", functionName: "loadResource", type: "stream", cacheDuration: 300,
          params: [{ name: "TestTitle", title: "测试片名", type: "input", value: "" }]
        }
    ]
};