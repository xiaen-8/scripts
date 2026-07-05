var WidgetMetadata = {
    id: "hanime1_me_daily", 
    title: "Hanime1-日常精选",
    description: "高频模块：搜索、排行榜、新番",
    author: "网络/TaYhu",
    site: "https://hanime1.me", 
    version: "1.2.0",
    requiredVersion: "0.0.2",
    detailCacheDuration: 300,
    modules: [
        {
            title: "搜索",
            description: "高级搜索：支持关键词与精细标签筛选",
            requiresWebView: false,
            functionName: "searchVideos",
            cacheDuration: 600, 
            params: [
                { name: "keyword", title: "搜索关键词", type: "input", description: "输入关键词", value: "" },
                {
                    name: "sort_by", 
                    title: "排序方式",
                    type: "enumeration",
                    description: "排序规则",
                    value: "all",
                    enumOptions: [
                        { title: "全部", value: "all" },
                        { title: "最新上市", value: "new_release" },
                        { title: "最新上传", value: "latest_upload" },
                        { title: "本日排行", value: "daily_rank" },
                        { title: "本周排行", value: "weekly_rank" },
                        { title: "本月排行", value: "monthly_rank" },
                        { title: "观看次数", value: "views" },
                        { title: "点赞比例", value: "likes" },
                        { title: "时长最长", value: "duration" },
                        { title: "他们在看", value: "watching" }
                    ]
                },
                { name: "page", title: "页码", type: "page", description: "页码", value: "1" }
            ]
        },
        {
            title: "排行榜",
            description: "热门与最新影片榜单聚合",
            requiresWebView: false,
            functionName: "loadHotRankings",
            cacheDuration: 300, 
            params: [
                {
                    name: "list_type",
                    title: "榜单类型",
                    type: "enumeration",
                    description: "选择你想看的榜单",
                    value: "watching",
                    enumOptions: [
                        { title: "他们在看", value: "watching" },
                        { title: "最新上传", value: "latest_upload" },
                        { title: "本日排行", value: "daily_rank" },
                        { title: "本周排行", value: "weekly_rank" },
                        { title: "本月排行", value: "monthly_rank" },
                        { title: "最新上市", value: "new_release" }
                    ]
                },
                {
                    name: "sort_by",
                    title: "翻页",
                    type: "enumeration",
                    description: "安全手动下拉翻页",
                    value: "1",
                    enumOptions: Array.from({length: 298}, (_, i) => ({ title: `第 ${i + 1} 页`, value: `${i + 1}` }))
                },
                { name: "page", title: "页码", type: "page", description: "页码", value: "1" }
            ]
        },
        {
            title: "新番预告",
            description: "查看即将上映的新番",
            requiresWebView: false,
            functionName: "loadPreviews",
            cacheDuration: 3600,
            params: []
        }
    ]
};

const BASE_URL = "https://hanime1.me";
const REQUEST_TIMEOUT = 10000;

function getCommonHeaders() {
    return {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": BASE_URL + "/",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7"
    };
}

async function httpGetWithTimeout(url) {
    return Widget.http.get(url, {
        headers: getCommonHeaders(),
        timeout: REQUEST_TIMEOUT
    });
}

function normalizeImageUrl(src) {
    if (!src) return "";
    if (src.startsWith("//")) return "https:" + src;
    if (src.startsWith("/")) return BASE_URL + src;
    if (!src.startsWith("http")) return BASE_URL + "/" + src;
    return src;
}

function extractPoster($a, $) {
    let poster = "";
    let $img = $a.find('.video-card-inner img').first();
    if (!$img.length) $img = $a.find('img').first();

    if ($img.length) {
        poster = $img.attr('src') || $img.attr('data-src') || $img.attr('data-original') || "";
        if (poster.includes('background.jpg')) poster = "";
    }

    if (!poster) {
        const $cardImg = $a.closest('.search-doujin-videos, .home-rows-videos-div, .video-card').find('img').first();
        if ($cardImg.length) {
            poster = $cardImg.attr('src') || $cardImg.attr('data-src') || "";
            if (poster.includes('background.jpg')) poster = "";
        }
    }
    return normalizeImageUrl(poster);
}

async function fetchAndParse(url) {
    try {
        const response = await httpGetWithTimeout(url);
        const $ = Widget.html.load(response.data);
        const items = [];

        $('a[href*="/watch?v="]').each((i, el) => {
            const $a = $(el);
            const href = $a.attr('href');
            if (!href) return;

            let link = href;
            if (!link.startsWith('http')) {
                link = BASE_URL + (link.startsWith('/') ? '' : '/') + link;
            }

            if (items.some(it => it.link === link)) return;

            const poster = extractPoster($a, $);

            let title = $a.find('.card-mobile-title, .home-rows-videos-title, [class*="title"]').first().text().trim();
            if (!title) {
                title = $a.find('img').attr('alt') || $a.attr('title') || "";
            }
            if (!title) {
                const $header = $a.closest('div').prevAll('h3, h4, h5').first();
                if ($header.length) title = $header.text().trim();
            }
            if (!title) return; 

            const duration = $a.find('.card-mobile-duration, .duration, [class*="time"]').first().text().trim();
            const author = $a.find('.card-mobile-user, .author, [class*="user"]').first().text().trim();

            items.push({
                id: link,
                type: "url",
                title: title,
                posterPath: poster,
                backdropPath: poster,
                mediaType: "movie",
                durationText: duration,
                description: author || "影片",
                link: link
            });
        });

        return items;
    } catch (e) {
        return [];
    }
}

function mapSortToApi(sortValue) {
    const map = {
        "new_release": "最新上市",
        "latest_upload": "最新上傳",
        "daily_rank": "本日排行",
        "weekly_rank": "本週排行",
        "monthly_rank": "本月排行",
        "views": "觀看次數",
        "likes": "點讚比例",
        "duration": "時長最長",
        "watching": "他們在看"
    };
    return map[sortValue] || "";
}

const S2T_MAP = {
    "无码": "無碼", "AI解码": "AI解碼", "中文字幕": "中文字幕", "中文配音": "中文配音", 
    "同人作品": "同人作品", "断面图": "斷面圖", "动态": "動態", "动画": "動畫", 
    "里番": "裏番", "泡面番": "泡麵番" 
};

function convertToTraditional(text) {
    if (!text) return "";
    let result = text;
    for (const [simp, trad] of Object.entries(S2T_MAP)) {
        result = result.split(simp).join(trad);
    }
    return result;
}

function appendTagsToQuery(params, queryParts) {
    const fields = ['tag_attr', 'tag_rel', 'tag_role', 'tag_body', 'tag_plot', 'tag_loc', 'tag_pos'];
    fields.forEach(field => {
        if (params[field] && params[field].trim() && params[field] !== 'all') {
            const tagsList = params[field].split(/[\s,，]+/); 
            for (let tag of tagsList) {
                if (tag && tag !== 'all') {
                    const apiTag = convertToTraditional(tag);
                    queryParts.push(`tags%5B%5D=${encodeURIComponent(apiTag)}`);
                }
            }
        }
    });

    if (params.tags && params.tags.trim()) {
        const tagsList = params.tags.split(/[\s,，]+/); 
        for (let tag of tagsList) {
            if (tag && tag !== 'all') {
                const apiTag = convertToTraditional(tag);
                queryParts.push(`tags%5B%5D=${encodeURIComponent(apiTag)}`);
            }
        }
    }
}

function getTargetPageFromDropdown(params) {
    if (params.sort_by && !isNaN(parseInt(params.sort_by))) {
        return parseInt(params.sort_by);
    }
    return 1;
}

async function searchVideos(params) {
    const page = parseInt(params.page) || 1;
    const rawKeyword = params.keyword || "";
    const sort = mapSortToApi(params.sort_by);

    let url = `${BASE_URL}/search`;
    const queryParts = [];
    
    if (rawKeyword) {
        const processedKeyword = convertToTraditional(rawKeyword);
        queryParts.push(`query=${encodeURIComponent(processedKeyword)}`);
    }

    if (sort) queryParts.push(`sort=${encodeURIComponent(sort)}`);
    
    appendTagsToQuery(params, queryParts);

    if (page > 1) queryParts.push(`page=${page}`);

    if (queryParts.length > 0) {
        url += '?' + queryParts.join('&');
    }
    
    return fetchAndParse(url);
}

async function loadHotRankings(params) {
    if (params.page && parseInt(params.page) > 1) return [];
    const page = getTargetPageFromDropdown(params);
    
    const typeMap = {
        "watching": "他們在看",
        "latest_upload": "最新上傳",
        "daily_rank": "本日排行",
        "weekly_rank": "本週排行",
        "monthly_rank": "本月排行",
        "new_release": "最新上市"
    };
    
    const sortVal = typeMap[params.list_type || "watching"];
    let url = `${BASE_URL}/search?sort=${encodeURIComponent(sortVal)}`;
    if (page > 1) url += `&page=${page}`;
    
    return fetchAndParse(url);
}

async function loadPreviews(params) {
    const d = new Date();
    const year = d.getFullYear();
    let month = d.getMonth() + 1;
    let paddedMonth = month < 10 ? '0' + month : month;

    const url = `${BASE_URL}/previews/${year}-${paddedMonth}`;
    return fetchAndParse(url); 
}

async function loadDetail(link) {
    try {
        const response = await httpGetWithTimeout(link);
        const htmlData = response.data;
        const $ = Widget.html.load(htmlData);

        let videoUrl = "";

        const m3u8Match = htmlData.match(/(https:\/\/[^"'\s]+\.m3u8[^"'\s]*)/);
        if (m3u8Match) {
            videoUrl = m3u8Match[1];
        } 
        else {
            const sourceMatch = htmlData.match(/source\s*=\s*['"](https:\/\/[^'"]+)['"]/);
            if (sourceMatch) {
                videoUrl = sourceMatch[1];
            } else {
                videoUrl = $('video source').attr('src');
            }
        }

        if (!videoUrl) {
            throw new Error("video_url_not_found");
        }

        videoUrl = videoUrl.replace(/&amp;/g, '&');

        const title = $('meta[property="og:title"]').attr('content') || $('title').text() || "标题未知";
        const desc = $('meta[property="og:description"]').attr('content') || "";
        const cover = $('meta[property="og:image"]').attr('content') || "";

        const childItems = [];
        $('.home-rows-videos-div a[href*="/watch?v="]').each((i, el) => {
            if (i >= 12) return false;

            const $a = $(el);
            let recLink = $a.attr('href');
            if (!recLink) return;
            if (!recLink.startsWith('http')) {
                recLink = BASE_URL + (recLink.startsWith('/') ? '' : '/') + link;
            }

            const recPoster = extractPoster($a, $);

            let recTitle = $a.find('.home-rows-videos-title, [class*="title"]').first().text().trim();
            if (!recTitle) recTitle = $a.find('img').attr('alt') || "相关推荐";

            childItems.push({
                id: recLink,
                type: "url",
                title: recTitle,
                posterPath: recPoster,
                backdropPath: recPoster,
                mediaType: "movie",
                link: recLink
            });
        });

        return {
            id: link,
            type: "detail",
            videoUrl: videoUrl,
            title: title,
            description: desc,
            posterPath: normalizeImageUrl(cover),
            backdropPath: normalizeImageUrl(cover),
            mediaType: "movie",
            link: link,
            childItems: childItems,
            headers: getCommonHeaders()
        };

    } catch (error) {
        let errorMsg = "无法加载视频，请重试。";
        if (error.message === "video_url_not_found") {
            errorMsg = "未找到流媒体地址，请检查网络节点。";
        }
        return {
            id: link,
            type: "detail",
            videoUrl: link, 
            title: "加载失败",
            description: errorMsg,
            posterPath: "",
            mediaType: "movie",
            link: link
        };
    }
}