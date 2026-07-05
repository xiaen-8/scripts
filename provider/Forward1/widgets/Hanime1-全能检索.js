var WidgetMetadata = {
    id: "hanime1_me_advanced", 
    title: "Hanime1-全能检索",
    description: "全标签组合过滤，上滑无限加载",
    author: "网络/TaYhu", 
    site: "https://hanime1.me",
    version: "1.2.0",
    requiredVersion: "0.0.2",
    detailCacheDuration: 300,
    modules: [
        {
            title: "影片分类",
            description: "高级全标签筛选",
            requiresWebView: false,
            functionName: "loadAdvancedGenre", 
            cacheDuration: 600, 
            params: [
                {
                    name: "genre", 
                    title: "基础大分类",
                    type: "enumeration",
                    description: "选择主分类",
                    value: "all",
                    enumOptions: [
                        { title: "全部", value: "all" },
                        { title: "里番", value: "rifan" },
                        { title: "泡面番", value: "paomian" },
                        { title: "Motion Anime", value: "motion" },
                        { title: "3DCG", value: "3dcg" },
                        { title: "2D 动画", value: "2d" },
                        { title: "2.5D", value: "2_5d" },
                        { title: "AI 生成", value: "ai" },
                        { title: "MMD", value: "mmd" },
                        { title: "Cosplay", value: "cosplay" }
                    ]
                },
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
                {
                    name: "upload_time",
                    title: "发布日期",
                    type: "enumeration",
                    description: "筛选发布时间",
                    value: "all",
                    enumOptions: [
                        { title: "全部", value: "all" },
                        { title: "过去 24 小时", value: "24h" },
                        { title: "过去 2 天", value: "2d" },
                        { title: "过去 1 周", value: "1w" },
                        { title: "过去 1 个月", value: "1m" },
                        { title: "过去 3 个月", value: "3m" },
                        { title: "过去 1 年", value: "1y" }
                    ]
                },
                {
                    name: "duration_filter",
                    title: "时长范围",
                    type: "enumeration",
                    description: "筛选影片时长",
                    value: "all",
                    enumOptions: [
                        { title: "全部", value: "all" },
                        { title: "1 分钟 +", value: "1m_plus" },
                        { title: "5 分钟 +", value: "5m_plus" },
                        { title: "10 分钟 +", value: "10m_plus" },
                        { title: "20 分钟 +", value: "20m_plus" },
                        { title: "30 分钟 +", value: "30m_plus" },
                        { title: "60 分钟 +", value: "60m_plus" },
                        { title: "0 - 10 分钟", value: "0_10m" },
                        { title: "0 - 20 分钟", value: "0_20m" }
                    ]
                },
                {
                    name: "tag_attr",
                    title: "影片属性",
                    type: "enumeration",
                    value: "all",
                    enumOptions: [{title:"全部",value:"all"}, {title:"无码",value:"无码"}, {title:"AI解码",value:"AI解码"}, {title:"中文字幕",value:"中文字幕"}, {title:"中文配音",value:"中文配音"}, {title:"同人作品",value:"同人作品"}, {title:"断面图",value:"断面图"}, {title:"ASMR",value:"ASMR"}, {title:"1080p",value:"1080p"}, {title:"60FPS",value:"60FPS"}]
                },
                {
                    name: "tag_rel",
                    title: "人物关系",
                    type: "enumeration",
                    value: "all",
                    enumOptions: [{title:"全部",value:"all"}, {title:"近亲",value:"近亲"}, {title:"姐",value:"姐"}, {title:"妹",value:"妹"}, {title:"母",value:"母"}, {title:"女儿",value:"女儿"}, {title:"师生",value:"师生"}, {title:"情侣",value:"情侣"}, {title:"青梅竹马",value:"青梅竹马"}, {title:"同事",value:"同事"}]
                },
                {
                    name: "tag_role",
                    title: "角色设定",
                    type: "enumeration",
                    value: "all",
                    enumOptions: [{title:"全部",value:"all"}, {title:"JK",value:"JK"}, {title:"处女",value:"处女"}, {title:"御姐",value:"御姐"}, {title:"熟女",value:"熟女"}, {title:"人妻",value:"人妻"}, {title:"女教师",value:"女教师"}, {title:"男教师",value:"男教师"}, {title:"女医生",value:"女医生"}, {title:"女病人",value:"女病人"}, {title:"护士",value:"护士"}, {title:"OL",value:"OL"}, {title:"女警",value:"女警"}, {title:"大小姐",value:"大小姐"}, {title:"偶像",value:"偶像"}, {title:"女仆",value:"女仆"}, {title:"巫女",value:"巫女"}, {title:"魔女",value:"魔女"}, {title:"修女",value:"修女"}, {title:"风俗娘",value:"风俗娘"}, {title:"公主",value:"公主"}, {title:"女忍者",value:"女忍者"}, {title:"女战士",value:"女战士"}, {title:"女骑士",value:"女骑士"}, {title:"魔法少女",value:"魔法少女"}, {title:"异种族",value:"异种族"}, {title:"天使",value:"天使"}, {title:"妖精",value:"妖精"}, {title:"魔物娘",value:"魔物娘"}, {title:"魅魔",value:"魅魔"}, {title:"吸血鬼",value:"吸血鬼"}, {title:"女鬼",value:"女鬼"}, {title:"兽娘",value:"兽娘"}, {title:"福瑞",value:"福瑞"}, {title:"乳牛",value:"乳牛"}, {title:"机械娘",value:"机械娘"}, {title:"碧池",value:"碧池"}, {title:"痴女",value:"痴女"}, {title:"雌小鬼",value:"雌小鬼"}, {title:"不良少女",value:"不良少女"}, {title:"傲娇",value:"傲嬌"}, {title:"病娇",value:"病嬌"}, {title:"无口",value:"无口"}, {title:"无表情",value:"无表情"}, {title:"眼神死",value:"眼神死"}, {title:"正太",value:"正太"}, {title:"伪娘",value:"伪娘"}, {title:"扶他",value:"扶他"}]
                },
                {
                    name: "tag_body",
                    title: "外貌身材",
                    type: "enumeration",
                    value: "all",
                    enumOptions: [{title:"全部",value:"all"}, {title:"短发",value:"短发"}, {title:"马尾",value:"马尾"}, {title:"双马尾",value:"双马尾"}, {title:"丸子头",value:"丸子头"}, {title:"巨乳",value:"巨乳"}, {title:"乳环",value:"乳环"}, {title:"舌环",value:"舌环"}, {title:"贫乳",value:"贫乳"}, {title:"黑皮肤",value:"黑皮肤"}, {title:"晒痕",value:"晒痕"}, {title:"眼镜娘",value:"眼镜娘"}, {title:"兽耳",value:"兽耳"}, {title:"尖耳朵",value:"尖耳朵"}, {title:"异色瞳",value:"异色瞳"}, {title:"美人痣",value:"美人痣"}, {title:"肌肉女",value:"肌肉女"}, {title:"白虎",value:"白虎"}, {title:"阴毛",value:"阴毛"}, {title:"腋毛",value:"腋毛"}, {title:"大屌",value:"大屌"}, {title:"着衣",value:"着衣"}, {title:"水手服",value:"水手服"}, {title:"体操服",value:"体操服"}, {title:"泳装",value:"泳装"}, {title:"比基尼",value:"比基尼"}, {title:"死库水",value:"死库水"}, {title:"和服",value:"和服"}, {title:"兔女郎",value:"兔女郎"}, {title:"围裙",value:"围裙"}, {title:"啦啦队",value:"啦啦队"}, {title:"丝袜",value:"丝袜"}, {title:"吊袜带",value:"吊袜带"}, {title:"热裤",value:"热裤"}, {title:"迷你裙",value:"迷你裙"}, {title:"性感内衣",value:"性感内衣"}, {title:"紧身衣",value:"紧身衣"}, {title:"丁字裤",value:"丁字褲"}, {title:"高跟鞋",value:"高跟鞋"}, {title:"睡衣",value:"睡衣"}, {title:"婚纱",value:"婚紗"}, {title:"旗袍",value:"旗袍"}, {title:"古装",value:"古装"}, {title:"哥德",value:"哥德"}, {title:"口罩",value:"口罩"}, {title:"刺青",value:"刺青"}, {title:"淫纹",value:"淫紋"}, {title:"身体写字",value:"身体写字"}]
                },
                {
                    name: "tag_loc",
                    title: "情境场所",
                    type: "enumeration",
                    value: "all",
                    enumOptions: [{title:"全部",value:"all"}, {title:"校园",value:"校园"}, {title:"教室",value:"教室"}, {title:"图书馆",value:"图书馆"}, {title:"保健室",value:"保健室"}, {title:"游泳池",value:"游泳池"}, {title:"爱情宾馆",value:"爱情宾馆"}, {title:"医院",value:"医院"}, {title:"办公室",value:"办公室"}, {title:"浴室",value:"浴室"}, {title:"窗边",value:"窗边"}, {title:"公共厕所",value:"公共厕所"}, {title:"公众场合",value:"公众场合"}, {title:"户外野战",value:"户外野战"}, {title:"电车",value:"电车"}, {title:"车震",value:"车震"}, {title:"游艇",value:"游艇"}, {title:"露营帐篷",value:"露营帐篷"}, {title:"电影院",value:"电影院"}, {title:"健身房",value:"健身房"}, {title:"沙滩",value:"沙滩"}, {title:"温泉",value:"温泉"}, {title:"夜店",value:"夜店"}, {title:"监狱",value:"监狱"}, {title:"教堂",value:"教堂"}]
                },
                {
                    name: "tag_plot",
                    title: "故事剧情",
                    type: "enumeration",
                    value: "all",
                    enumOptions: [{title:"全部",value:"all"}, {title:"纯爱",value:"纯爱"}, {title:"恋爱喜剧",value:"恋爱喜剧"}, {title:"后宫",value:"后宫"}, {title:"十指紧扣",value:"十指紧扣"}, {title:"开大车",value:"开大车"}, {title:"NTR",value:"NTR"}, {title:"精神控制",value:"精神控制"}, {title:"药物",value:"药物"}, {title:"痴汉",value:"痴汉"}, {title:"阿嘿颜",value:"阿嘿颜"}, {title:"精神崩溃",value:"精神崩溃"}, {title:"猎奇",value:"猎奇"}, {title:"BDSM",value:"BDSM"}, {title:"捆绑",value:"捆绑"}, {title:"眼罩",value:"眼罩"}, {title:"项圈",value:"项圈"}, {title:"调教",value:"调教"}, {title:"异物插入",value:"异物插入"}, {title:"寻欢洞",value:"寻欢洞"}, {title:"肉便器",value:"肉便器"}, {title:"性奴隶",value:"性奴隸"}, {title:"胃凸",value:"胃凸"}, {title:"强制",value:"强制"}, {title:"轮奸",value:"轮奸"}, {title:"凌辱",value:"凌辱"}, {title:"性暴力",value:"性暴力"}, {title:"逆强制",value:"逆強制"}, {title:"女王样",value:"女王樣"}, {title:"榨精",value:"榨精"}, {title:"母女丼",value:"母女丼"}, {title:"姐妹丼",value:"姐妹丼"}, {title:"出轨",value:"出軌"}, {title:"醉酒",value:"醉酒"}, {title:"摄影",value:"摄影"}, {title:"睡眠奸",value:"睡眠奸"}, {title:"机械奸",value:"机械奸"}, {title:"虫奸",value:"虫奸"}, {title:"性转换",value:"性转换"}, {title:"百合",value:"百合"}, {title:"耽美",value:"耽美"}, {title:"时间停止",value:"时间停止"}, {title:"异世界",value:"异世界"}, {title:"怪兽",value:"怪兽"}, {title:"哥布林",value:"哥布林"}, {title:"世界末日",value:"世界末日"}]
                },
                {
                    name: "tag_pos",
                    title: "性交体位",
                    type: "enumeration",
                    value: "all",
                    enumOptions: [{title:"全部",value:"all"}, {title:"手交",value:"手交"}, {title:"指交",value:"指交"}, {title:"乳交",value:"乳交"}, {title:"乳头交",value:"乳頭交"}, {title:"肛交",value:"肛交"}, {title:"双洞齐下",value:"双洞齐下"}, {title:"脚交",value:"脚交"}, {title:"素股",value:"素股"}, {title:"拳交",value:"拳交"}, {title:"3P",value:"3P"}, {title:"群交",value:"群交"}, {title:"口交",value:"口交"}, {title:"跪舔",value:"跪舔"}, {title:"深喉咙",value:"深喉咙"}, {title:"口爆",value:"口爆"}, {title:"吞精",value:"吞精"}, {title:"舔蛋蛋",value:"舔蛋蛋"}, {title:"舔穴",value:"舔穴"}, {title:"69",value:"69"}, {title:"自慰",value:"自慰"}, {title:"腋交",value:"腋交"}, {title:"舔腋下",value:"舔腋下"}, {title:"发交",value:"发交"}, {title:"舔耳朵",value:"舔耳朵"}, {title:"舔脚",value:"舔腳"}, {title:"内射",value:"内射"}, {title:"外射",value:"外射"}, {title:"颜射",value:"颜射"}, {title:"潮吹",value:"潮吹"}, {title:"怀孕",value:"怀孕"}, {title:"喷奶",value:"喷奶"}, {title:"放尿",value:"放尿"}, {title:"排便",value:"排便"}, {title:"骑乘位",value:"骑乘位"}, {title:"背后位",value:"背后位"}, {title:"颜面骑乘",value:"颜面骑乘"}, {title:"火车便当",value:"火车便当"}, {title:"一字马",value:"一字馬"}, {title:"性玩具",value:"性玩具"}, {title:"飞机杯",value:"飞机杯"}, {title:"跳蛋",value:"跳蛋"}, {title:"毒龙钻",value:"毒龍鑽"}, {title:"触手",value:"触手"}, {title:"兽交",value:"兽交"}, {title:"颈手枷",value:"颈手枷"}, {title:"扯头发",value:"扯头发"}, {title:"掐脖子",value:"掐脖子"}, {title:"打屁股",value:"打屁股"}, {title:"肉棒打脸",value:"肉棒打脸"}, {title:"阴道外翻",value:"阴道外翻"}, {title:"男乳首责",value:"男乳首责"}, {title:"接吻",value:"接吻"}, {title:"舌吻",value:"舌吻"}, {title:"POV",value:"POV"}]
                },
                { name: "page", title: "页码", type: "page", value: "1" }
            ]
        }
    ]
};

const BASE_URL = "https://hanime1.me";
const REQUEST_TIMEOUT = 12000;

function getCommonHeaders(refererUrl = BASE_URL) {
    return {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        "Referer": refererUrl,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1"
    };
}

async function httpGetWithTimeout(url, referer) {
    return Widget.http.get(url, {
        headers: getCommonHeaders(referer),
        timeout: REQUEST_TIMEOUT
    });
}

function normalizeImageUrl(src) {
    if (!src) return "";
    if (src.startsWith("//")) return "https:" + src;
    if (src.startsWith("/")) return BASE_URL + src;
    return src;
}

async function fetchAndParse(url, page) {
    try {
        const prevPageUrl = page > 1 ? url.replace(`page=${page}`, `page=${page-1}`) : BASE_URL;
        const response = await httpGetWithTimeout(url, prevPageUrl);
        const $ = Widget.html.load(response.data);
        const items = [];

        $('a[href*="/watch?v="]').each((i, el) => {
            const $a = $(el);
            const href = $a.attr('href');
            if (!href) return;

            let link = href;
            if (!link.startsWith('http')) link = BASE_URL + (link.startsWith('/') ? '' : '/') + link;
            if (items.some(it => it.link === link)) return;

            let poster = "";
            const $img = $a.find('img').first();
            if ($img.length) {
                poster = $img.attr('data-src') || $img.attr('src') || "";
                if (poster.includes('background.jpg')) poster = "";
            }
            if (!poster) {
                const $cardImg = $a.closest('.search-doujin-videos, .home-rows-videos-div, .video-card').find('img').first();
                if ($cardImg.length) {
                    poster = $cardImg.attr('data-src') || $cardImg.attr('src') || "";
                    if (poster.includes('background.jpg')) poster = "";
                }
            }
            poster = normalizeImageUrl(poster);

            let title = $a.find('.card-mobile-title, .home-rows-videos-title, [class*="title"]').first().text().trim();
            if (!title) title = $img.attr('alt') || $a.attr('title') || "";
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

function mapSortToApi(v) {
    const m = {"new_release": "最新上市", "latest_upload": "最新上傳", "daily_rank": "本日排行", "weekly_rank": "本週排行", "monthly_rank": "本月排行", "views": "觀看次數", "likes": "點讚比例", "duration": "時長最長", "watching": "他們在看"};
    return m[v] || "";
}

function mapGenreToApi(v) {
    const m = {"rifan": "裏番", "paomian": "泡麵番", "motion": "Motion Anime", "3dcg": "3DCG", "2d": "2D動畫", "2_5d": "2.5D", "ai": "AI生成", "mmd": "MMD", "cosplay": "Cosplay"};
    return m[v] || "";
}

function mapTimeToApi(v) {
    const m = {"24h": "過去 24 小時", "2d": "過去 2 天", "1w": "過去 1 週", "1m": "過去 1 個月", "3m": "過去 3 個月", "1y": "過去 1 年"};
    return m[v] || "";
}

function mapDurationToApi(v) {
    const m = {"1m_plus": "1 分鐘 +", "5m_plus": "5 分鐘 +", "10m_plus": "10 分鐘 +", "20m_plus": "20 分鐘 +", "30m_plus": "30 分鐘 +", "60m_plus": "60 分鐘 +", "0_10m": "0 - 10 分鐘", "0_20m": "0 - 20 分鐘"};
    return m[v] || "";
}

const S2T_MAP = {"无码": "無碼", "AI解码": "AI解碼", "断面图": "斷面圖", "里番": "裏番", "泡面番": "泡麵番", "中文字幕": "中文字幕", "中文配音": "中文配音"};

function convertToTraditional(text) {
    if (!text) return "";
    let res = text;
    for (const [s, t] of Object.entries(S2T_MAP)) res = res.split(s).join(t);
    return res;
}

function appendTagsToQuery(params, queryParts) {
    ['tag_attr', 'tag_rel', 'tag_role', 'tag_body', 'tag_plot', 'tag_loc', 'tag_pos'].forEach(f => {
        if (params[f] && params[f] !== 'all') {
            params[f].split(/[\s,，]+/).forEach(t => {
                if (t) queryParts.push(`tags%5B%5D=${encodeURIComponent(convertToTraditional(t))}`);
            });
        }
    });
}

async function loadAdvancedGenre(params) {
    const page = parseInt(params.page) || 1;
    const genre = mapGenreToApi(params.genre);
    const sort = mapSortToApi(params.sort_by || "all"); 
    const time = mapTimeToApi(params.upload_time);
    const duration = mapDurationToApi(params.duration_filter);

    let url = `${BASE_URL}/search`;
    const q = [];
    if (genre) q.push(`genre=${encodeURIComponent(genre)}`);
    if (sort) q.push(`sort=${encodeURIComponent(sort)}`);
    if (time) q.push(`time=${encodeURIComponent(time)}`);
    if (duration) q.push(`duration=${encodeURIComponent(duration)}`);
    appendTagsToQuery(params, q);
    if (page > 1) q.push(`page=${page}`);
    url += (q.length > 0 ? '?' + q.join('&') : '');

    return fetchAndParse(url, page);
}

async function loadDetail(link) {
    try {
        const response = await httpGetWithTimeout(link, BASE_URL + "/search");
        const $ = Widget.html.load(response.data);
        let vUrl = "";
        const qualityIds = ['#video-sd', '#video-hd', '#video-720p', '#video-1080p'];
        for (const id of qualityIds) {
            const val = $(id).val();
            if (val) { vUrl = val; break; }
        }
        if (!vUrl) {
            const match = response.data.match(/source\s*=\s*['"](https:\/\/[^'"]+)['"]/);
            if (match) vUrl = match[1];
        }
        if (!vUrl) vUrl = $('video source').attr('src');
        if (!vUrl) throw new Error();

        return {
            id: link,
            type: "detail",
            videoUrl: vUrl.replace(/&amp;/g, '&'),
            title: $('meta[property="og:title"]').attr('content') || "标题未知",
            posterPath: normalizeImageUrl($('meta[property="og:image"]').attr('content') || ""),
            mediaType: "movie",
            link: link,
            headers: getCommonHeaders(link)
        };
    } catch (e) {
        return { id: link, type: "detail", videoUrl: link, title: "加载失败", link: link };
    }
}