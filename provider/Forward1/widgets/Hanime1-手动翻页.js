var WidgetMetadata = {
    id: "hanime1_me_channels", 
    title: "Hanime1-手动翻页",
    description: "独立分类，大跨度翻页专用",
    author: "网络/TaYhu", 
    site: "https://hanime1.me",
    version: "1.2.0",
    requiredVersion: "0.0.2",
    detailCacheDuration: 300,
    modules: [
        {
            title: "里番",
            description: "独立分类：精准71页",
            requiresWebView: false,
            functionName: "loadRifan", 
            cacheDuration: 600, 
            params: [
                {
                    name: "sort_by", 
                    title: "翻页",
                    type: "enumeration",
                    description: "手动下拉翻页 (共71页)",
                    value: "1",
                    enumOptions: Array.from({length: 71}, (_, i) => ({ title: `第 ${i + 1} 页`, value: `${i + 1}` }))
                },
                {
                    name: "video_sort", 
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
            title: "3DCG",
            description: "独立分类：精准42页",
            requiresWebView: false,
            functionName: "load3DCG", 
            cacheDuration: 600, 
            params: [
                {
                    name: "sort_by", 
                    title: "翻页",
                    type: "enumeration",
                    description: "手动下拉翻页 (共42页)",
                    value: "1",
                    enumOptions: Array.from({length: 42}, (_, i) => ({ title: `第 ${i + 1} 页`, value: `${i + 1}` }))
                },
                {
                    name: "video_sort", 
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
            title: "泡面番",
            description: "独立分类：精准2页",
            requiresWebView: false,
            functionName: "loadPaomian", 
            cacheDuration: 600, 
            params: [
                {
                    name: "sort_by", 
                    title: "翻页",
                    type: "enumeration",
                    description: "手动下拉翻页 (共2页)",
                    value: "1",
                    enumOptions: Array.from({length: 2}, (_, i) => ({ title: `第 ${i + 1} 页`, value: `${i + 1}` }))
                },
                {
                    name: "video_sort", 
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
            title: "Motion Anime",
            description: "独立分类：精准16页",
            requiresWebView: false,
            functionName: "loadMotion", 
            cacheDuration: 600, 
            params: [
                {
                    name: "sort_by", 
                    title: "翻页",
                    type: "enumeration",
                    description: "手动下拉翻页 (共16页)",
                    value: "1",
                    enumOptions: Array.from({length: 16}, (_, i) => ({ title: `第 ${i + 1} 页`, value: `${i + 1}` }))
                },
                {
                    name: "video_sort", 
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
            title: "2D 动画",
            description: "独立分类：精准77页",
            requiresWebView: false,
            functionName: "load2D", 
            cacheDuration: 600, 
            params: [
                {
                    name: "sort_by", 
                    title: "翻页",
                    type: "enumeration",
                    description: "手动下拉翻页 (共77页)",
                    value: "1",
                    enumOptions: Array.from({length: 77}, (_, i) => ({ title: `第 ${i + 1} 页`, value: `${i + 1}` }))
                },
                {
                    name: "video_sort", 
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
            title: "2.5D",
            description: "独立分类：精准91页",
            requiresWebView: false,
            functionName: "load2_5D", 
            cacheDuration: 600, 
            params: [
                {
                    name: "sort_by", 
                    title: "翻页",
                    type: "enumeration",
                    description: "手动下拉翻页 (共91页)",
                    value: "1",
                    enumOptions: Array.from({length: 91}, (_, i) => ({ title: `第 ${i + 1} 页`, value: `${i + 1}` }))
                },
                {
                    name: "video_sort", 
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
            title: "AI 生成",
            description: "独立分类：精准2页",
            requiresWebView: false,
            functionName: "loadAI", 
            cacheDuration: 600, 
            params: [
                {
                    name: "sort_by", 
                    title: "翻页",
                    type: "enumeration",
                    description: "手动下拉翻页 (共2页)",
                    value: "1",
                    enumOptions: Array.from({length: 2}, (_, i) => ({ title: `第 ${i + 1} 页`, value: `${i + 1}` }))
                },
                {
                    name: "video_sort", 
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
            title: "MMD",
            description: "独立分类：精准6页",
            requiresWebView: false,
            functionName: "loadMMD", 
            cacheDuration: 600, 
            params: [
                {
                    name: "sort_by", 
                    title: "翻页",
                    type: "enumeration",
                    description: "手动下拉翻页 (共6页)",
                    value: "1",
                    enumOptions: Array.from({length: 6}, (_, i) => ({ title: `第 ${i + 1} 页`, value: `${i + 1}` }))
                },
                {
                    name: "video_sort", 
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
            title: "Cosplay",
            description: "独立分类：精准4页",
            requiresWebView: false,
            functionName: "loadCosplay", 
            cacheDuration: 600, 
            params: [
                {
                    name: "sort_by", 
                    title: "翻页",
                    type: "enumeration",
                    description: "手动下拉翻页 (共4页)",
                    value: "1",
                    enumOptions: Array.from({length: 4}, (_, i) => ({ title: `第 ${i + 1} 页`, value: `${i + 1}` }))
                },
                {
                    name: "video_sort", 
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

function getTargetPageFromDropdown(params) {
    if (params.sort_by && !isNaN(parseInt(params.sort_by))) {
        return parseInt(params.sort_by);
    }
    return 1;
}

async function loadSpecificGenre(params, genreName) {
    const page = getTargetPageFromDropdown(params);
    const sort = mapSortToApi(params.video_sort || "all");

    let url = `${BASE_URL}/search`;
    const queryParts = [];
    
    if (genreName) queryParts.push(`genre=${encodeURIComponent(genreName)}`);
    if (sort) queryParts.push(`sort=${encodeURIComponent(sort)}`);
    if (page > 1) queryParts.push(`page=${page}`);

    if (queryParts.length > 0) {
        url += '?' + queryParts.join('&');
    }
    
    return fetchAndParse(url);
}

async function loadRifan(params) { return loadSpecificGenre(params, "裏番"); }
async function load3DCG(params) { return loadSpecificGenre(params, "3DCG"); }
async function loadPaomian(params) { return loadSpecificGenre(params, "泡麵番"); }
async function loadMotion(params) { return loadSpecificGenre(params, "Motion Anime"); }
async function load2D(params) { return loadSpecificGenre(params, "2D動畫"); }
async function load2_5D(params) { return loadSpecificGenre(params, "2.5D"); }
async function loadAI(params) { return loadSpecificGenre(params, "AI生成"); }
async function loadMMD(params) { return loadSpecificGenre(params, "MMD"); }
async function loadCosplay(params) { return loadSpecificGenre(params, "Cosplay"); }

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
                recLink = BASE_URL + (recLink.startsWith('/') ? '' : '/') + recLink;
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