WidgetMetadata = {
    id: "hanime1Tao",
    title: "hanime1",
    description: "搜索·标签·分类·推荐·预告·作者",
    author: "廿二日",
    site: "https://hanime1.me",
    version: "2.0.2",
    requiredVersion: "0.0.2",
    detailCacheDuration: 300,
    search: {
        title: "快捷搜索",
        functionName: "searchVideos",
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
    modules: [
        {
            title: "搜索",
            description: "关键词与排序组合检索",
            requiresWebView: false,
            type: "video",
            functionName: "searchVideos",
            cacheDuration: 300,
            params: [
                { name: "keyword", title: "搜索关键词", type: "input", description: "在此输入你想搜索的影片", value: "" },
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
            title: "分类",
            description: "高级全标签筛选",
            requiresWebView: false,
            type: "video",
            functionName: "loadAdvancedGenre",
            cacheDuration: 600,
            params: [
                {
                    name: "genre",
                    title: "基础大分类",
                    type: "enumeration",
                    value: "all",
                    enumOptions: [
                        { title: "全部", value: "all" },
                        { title: "裏番", value: "rifan" },
                        { title: "泡麵番", value: "paomian" },
                        { title: "Motion Anime", value: "motion" },
                        { title: "3DCG", value: "3dcg" },
                        { title: "2D 動畫", value: "2d" },
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
                    enumOptions: [{title:"全部",value:"all"}, {title:"無碼",value:"無碼"}, {title:"AI解碼",value:"AI解碼"}, {title:"中文字幕",value:"中文字幕"}, {title:"中文配音",value:"中文配音"}, {title:"同人作品",value:"同人作品"}, {title:"斷面圖",value:"斷面圖"}, {title:"ASMR",value:"ASMR"}, {title:"1080p",value:"1080p"}, {title:"60FPS",value:"60FPS"}]
                },
                {
                    name: "tag_rel",
                    title: "人物关系",
                    type: "enumeration",
                    value: "all",
                    enumOptions: [{title:"全部",value:"all"}, {title:"近親",value:"近親"}, {title:"姐",value:"姐"}, {title:"妹",value:"妹"}, {title:"母",value:"母"}, {title:"女兒",value:"女兒"}, {title:"師生",value:"師生"}, {title:"情侶",value:"情侶"}, {title:"青梅竹馬",value:"青梅竹馬"}, {title:"同事",value:"同事"}]
                },
                {
                    name: "tag_role",
                    title: "角色设定",
                    type: "enumeration",
                    value: "all",
                    enumOptions: [{title:"全部",value:"all"}, {title:"JK",value:"JK"}, {title:"處女",value:"處女"}, {title:"御姐",value:"御姐"}, {title:"熟女",value:"熟女"}, {title:"人妻",value:"人妻"}, {title:"女教師",value:"女教師"}, {title:"男教師",value:"男教師"}, {title:"女醫生",value:"女醫生"}, {title:"女病人",value:"女病人"}, {title:"護士",value:"護士"}, {title:"OL",value:"OL"}, {title:"女警",value:"女警"}, {title:"大小姐",value:"大小姐"}, {title:"偶像",value:"偶像"}, {title:"女僕",value:"女僕"}, {title:"巫女",value:"巫女"}, {title:"魔女",value:"魔女"}, {title:"修女",value:"修女"}, {title:"風俗娘",value:"風俗娘"}, {title:"公主",value:"公主"}, {title:"女忍者",value:"女忍者"}, {title:"女戰士",value:"女戰士"}, {title:"女騎士",value:"女騎士"}, {title:"魔法少女",value:"魔法少女"}, {title:"異種族",value:"異種族"}, {title:"天使",value:"天使"}, {title:"妖精",value:"妖精"}, {title:"魔物娘",value:"魔物娘"}, {title:"魅魔",value:"魅魔"}, {title:"吸血鬼",value:"吸血鬼"}, {title:"女鬼",value:"女鬼"}, {title:"獸娘",value:"獸娘"}, {title:"福瑞",value:"福瑞"}, {title:"乳牛",value:"乳牛"}, {title:"機械娘",value:"機械娘"}, {title:"碧池",value:"碧池"}, {title:"痴女",value:"痴女"}, {title:"雌小鬼",value:"雌小鬼"}, {title:"不良少女",value:"不良少女"}, {title:"傲嬌",value:"傲嬌"}, {title:"病嬌",value:"病嬌"}, {title:"無口",value:"無口"}, {title:"無表情",value:"無表情"}, {title:"眼神死",value:"眼神死"}, {title:"正太",value:"正太"}, {title:"偽娘",value:"偽娘"}, {title:"扶他",value:"扶他"}]
                },
                {
                    name: "tag_body",
                    title: "外貌身材",
                    type: "enumeration",
                    value: "all",
                    enumOptions: [{title:"全部",value:"all"}, {title:"短髮",value:"短髮"}, {title:"馬尾",value:"馬尾"}, {title:"雙馬尾",value:"雙馬尾"}, {title:"丸子頭",value:"丸子頭"}, {title:"巨乳",value:"巨乳"}, {title:"乳環",value:"乳環"}, {title:"舌環",value:"舌環"}, {title:"貧乳",value:"貧乳"}, {title:"黑皮膚",value:"黑皮膚"}, {title:"曬痕",value:"曬痕"}, {title:"眼鏡娘",value:"眼鏡娘"}, {title:"獸耳",value:"獸耳"}, {title:"尖耳朵",value:"尖耳朵"}, {title:"異色瞳",value:"異色瞳"}, {title:"美人痣",value:"美人痣"}, {title:"肌肉女",value:"肌肉女"}, {title:"白虎",value:"白虎"}, {title:"陰毛",value:"陰毛"}, {title:"腋毛",value:"腋毛"}, {title:"大屌",value:"大屌"}, {title:"著衣",value:"著衣"}, {title:"水手服",value:"水手服"}, {title:"體操服",value:"體操服"}, {title:"泳裝",value:"泳裝"}, {title:"比基尼",value:"比基尼"}, {title:"死庫水",value:"死庫水"}, {title:"和服",value:"和服"}, {title:"兔女郎",value:"兔女郎"}, {title:"圍裙",value:"圍裙"}, {title:"啦啦隊",value:"啦啦隊"}, {title:"絲襪",value:"絲襪"}, {title:"吊襪帶",value:"吊襪帶"}, {title:"熱褲",value:"熱褲"}, {title:"迷你裙",value:"迷你裙"}, {title:"性感內衣",value:"性感內衣"}, {title:"緊身衣",value:"緊身衣"}, {title:"丁字褲",value:"丁字褲"}, {title:"高跟鞋",value:"高跟鞋"}, {title:"睡衣",value:"睡衣"}, {title:"婚紗",value:"婚紗"}, {title:"旗袍",value:"旗袍"}, {title:"古裝",value:"古裝"}, {title:"哥德",value:"哥德"}, {title:"口罩",value:"口罩"}, {title:"刺青",value:"刺青"}, {title:"淫紋",value:"淫紋"}, {title:"身體寫字",value:"身體寫字"}]
                },
                {
                    name: "tag_loc",
                    title: "情境场所",
                    type: "enumeration",
                    value: "all",
                    enumOptions: [{title:"全部",value:"all"}, {title:"校園",value:"校園"}, {title:"教室",value:"教室"}, {title:"圖書館",value:"圖書館"}, {title:"保健室",value:"保健室"}, {title:"游泳池",value:"游泳池"}, {title:"愛情賓館",value:"愛情賓館"}, {title:"醫院",value:"醫院"}, {title:"辦公室",value:"辦公室"}, {title:"浴室",value:"浴室"}, {title:"窗邊",value:"窗邊"}, {title:"公共廁所",value:"公共廁所"}, {title:"公眾場合",value:"公眾場合"}, {title:"戶外野戰",value:"戶外野戰"}, {title:"電車",value:"電車"}, {title:"車震",value:"車震"}, {title:"遊艇",value:"遊艇"}, {title:"露營帳篷",value:"露營帳篷"}, {title:"電影院",value:"電影院"}, {title:"健身房",value:"健身房"}, {title:"沙灘",value:"沙灘"}, {title:"溫泉",value:"溫泉"}, {title:"夜店",value:"夜店"}, {title:"監獄",value:"監獄"}, {title:"教堂",value:"教堂"}]
                },
                {
                    name: "tag_plot",
                    title: "故事剧情",
                    type: "enumeration",
                    value: "all",
                    enumOptions: [{title:"全部",value:"all"}, {title:"純愛",value:"純愛"}, {title:"戀愛喜劇",value:"戀愛喜劇"}, {title:"後宮",value:"後宮"}, {title:"十指緊扣",value:"十指緊扣"}, {title:"開大車",value:"開大車"}, {title:"NTR",value:"NTR"}, {title:"精神控制",value:"精神控制"}, {title:"藥物",value:"藥物"}, {title:"痴漢",value:"痴漢"}, {title:"阿嘿顏",value:"阿嘿顏"}, {title:"精神崩潰",value:"精神崩潰"}, {title:"獵奇",value:"獵奇"}, {title:"BDSM",value:"BDSM"}, {title:"捆綁",value:"捆綁"}, {title:"眼罩",value:"眼罩"}, {title:"項圈",value:"項圈"}, {title:"調教",value:"調教"}, {title:"異物插入",value:"異物插入"}, {title:"尋歡洞",value:"尋歡洞"}, {title:"肉便器",value:"肉便器"}, {title:"性奴隸",value:"性奴隸"}, {title:"胃凸",value:"胃凸"}, {title:"強制",value:"強制"}, {title:"輪姦",value:"輪姦"}, {title:"凌辱",value:"凌辱"}, {title:"性暴力",value:"性暴力"}, {title:"逆強制",value:"逆強制"}, {title:"女王樣",value:"女王樣"}, {title:"榨精",value:"榨精"}, {title:"母女丼",value:"母女丼"}, {title:"姐妹丼",value:"姐妹丼"}, {title:"出軌",value:"出軌"}, {title:"醉酒",value:"醉酒"}, {title:"攝影",value:"攝影"}, {title:"睡眠姦",value:"睡眠姦"}, {title:"機械姦",value:"機械姦"}, {title:"蟲姦",value:"蟲姦"}, {title:"性轉換",value:"性轉換"}, {title:"百合",value:"百合"}, {title:"耽美",value:"耽美"}, {title:"時間停止",value:"時間停止"}, {title:"異世界",value:"異世界"}, {title:"怪獸",value:"怪獸"}, {title:"哥布林",value:"哥布林"}, {title:"世界末日",value:"世界末日"}]
                },
                {
                    name: "tag_pos",
                    title: "性交体位",
                    type: "enumeration",
                    value: "all",
                    enumOptions: [{title:"全部",value:"all"}, {title:"手交",value:"手交"}, {title:"指交",value:"指交"}, {title:"乳交",value:"乳交"}, {title:"乳頭交",value:"乳頭交"}, {title:"肛交",value:"肛交"}, {title:"雙洞齊下",value:"雙洞齊下"}, {title:"腳交",value:"腳交"}, {title:"素股",value:"素股"}, {title:"拳交",value:"拳交"}, {title:"3P",value:"3P"}, {title:"群交",value:"群交"}, {title:"口交",value:"口交"}, {title:"跪舔",value:"跪舔"}, {title:"深喉嚨",value:"深喉嚨"}, {title:"口爆",value:"口爆"}, {title:"吞精",value:"吞精"}, {title:"舔蛋蛋",value:"舔蛋蛋"}, {title:"舔穴",value:"舔穴"}, {title:"69",value:"69"}, {title:"自慰",value:"自慰"}, {title:"腋交",value:"腋交"}, {title:"舔腋下",value:"舔腋下"}, {title:"髮交",value:"髮交"}, {title:"舔耳朵",value:"舔耳朵"}, {title:"舔腳",value:"舔腳"}, {title:"內射",value:"內射"}, {title:"外射",value:"外射"}, {title:"顏射",value:"顏射"}, {title:"潮吹",value:"潮吹"}, {title:"懷孕",value:"懷孕"}, {title:"噴奶",value:"噴奶"}, {title:"放尿",value:"放尿"}, {title:"排便",value:"排便"}, {title:"騎乘位",value:"騎乘位"}, {title:"背後位",value:"背後位"}, {title:"顏面騎乘",value:"顏面騎乘"}, {title:"火車便當",value:"火車便當"}, {title:"一字馬",value:"一字馬"}, {title:"性玩具",value:"性玩具"}, {title:"飛機杯",value:"飛機杯"}, {title:"跳蛋",value:"跳蛋"}, {title:"毒龍鑽",value:"毒龍鑽"}, {title:"觸手",value:"觸手"}, {title:"獸交",value:"獸交"}, {title:"頸手枷",value:"頸手枷"}, {title:"扯頭髮",value:"扯頭髮"}, {title:"掐脖子",value:"掐脖子"}, {title:"打屁股",value:"打屁股"}, {title:"肉棒打臉",value:"肉棒打臉"}, {title:"陰道外翻",value:"陰道外翻"}, {title:"男乳首責",value:"男乳首責"}, {title:"接吻",value:"接吻"}, {title:"舌吻",value:"舌吻"}, {title:"POV",value:"POV"}]
                },
                { name: "page", title: "页码", type: "page", value: "1" }
            ]
        },
        {
            title: "排行榜",
            description: "热门与最新影片榜单聚合",
            requiresWebView: false,
            type: "video",
            functionName: "loadHotRankings",
            cacheDuration: 300,
            params: [
                {
                    name: "sort",
                    title: "榜单类型",
                    type: "enumeration",
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
                { name: "page", title: "页码", type: "page", description: "页码", value: "1" }
            ]
        },
        {
            title: "影片属性",
            description: "按影片属性筛选",
            requiresWebView: false,
            type: "video",
            functionName: "loadByTagAttr",
            cacheDuration: 600,
            params: [
                {
                    name: "sort_by",
                    title: "影片属性",
                    type: "enumeration",
                    value: "無碼",
                    enumOptions: [{title:"無碼",value:"無碼"}, {title:"AI解碼",value:"AI解碼"}, {title:"中文字幕",value:"中文字幕"}, {title:"中文配音",value:"中文配音"}, {title:"同人作品",value:"同人作品"}, {title:"斷面圖",value:"斷面圖"}, {title:"ASMR",value:"ASMR"}, {title:"1080p",value:"1080p"}, {title:"60FPS",value:"60FPS"}]
                },
                { name: "page", title: "页码", type: "page", value: "1" }
            ]
        },
        {
            title: "人物关系",
            description: "按人物关系筛选",
            requiresWebView: false,
            type: "video",
            functionName: "loadByTagRel",
            cacheDuration: 600,
            params: [
                {
                    name: "sort_by",
                    title: "人物关系",
                    type: "enumeration",
                    value: "近親",
                    enumOptions: [{title:"近親",value:"近親"}, {title:"姐",value:"姐"}, {title:"妹",value:"妹"}, {title:"母",value:"母"}, {title:"女兒",value:"女兒"}, {title:"師生",value:"師生"}, {title:"情侶",value:"情侶"}, {title:"青梅竹馬",value:"青梅竹馬"}, {title:"同事",value:"同事"}]
                },
                { name: "page", title: "页码", type: "page", value: "1" }
            ]
        },
        {
            title: "角色设定",
            description: "按角色设定筛选",
            requiresWebView: false,
            type: "video",
            functionName: "loadByTagRole",
            cacheDuration: 600,
            params: [
                {
                    name: "sort_by",
                    title: "角色设定",
                    type: "enumeration",
                    value: "JK",
                    enumOptions: [{title:"JK",value:"JK"}, {title:"處女",value:"處女"}, {title:"御姐",value:"御姐"}, {title:"熟女",value:"熟女"}, {title:"人妻",value:"人妻"}, {title:"女教師",value:"女教師"}, {title:"男教師",value:"男教師"}, {title:"女醫生",value:"女醫生"}, {title:"女病人",value:"女病人"}, {title:"護士",value:"護士"}, {title:"OL",value:"OL"}, {title:"女警",value:"女警"}, {title:"大小姐",value:"大小姐"}, {title:"偶像",value:"偶像"}, {title:"女僕",value:"女僕"}, {title:"巫女",value:"巫女"}, {title:"魔女",value:"魔女"}, {title:"修女",value:"修女"}, {title:"風俗娘",value:"風俗娘"}, {title:"公主",value:"公主"}, {title:"女忍者",value:"女忍者"}, {title:"女戰士",value:"女戰士"}, {title:"女騎士",value:"女騎士"}, {title:"魔法少女",value:"魔法少女"}, {title:"異種族",value:"異種族"}, {title:"天使",value:"天使"}, {title:"妖精",value:"妖精"}, {title:"魔物娘",value:"魔物娘"}, {title:"魅魔",value:"魅魔"}, {title:"吸血鬼",value:"吸血鬼"}, {title:"女鬼",value:"女鬼"}, {title:"獸娘",value:"獸娘"}, {title:"福瑞",value:"福瑞"}, {title:"乳牛",value:"乳牛"}, {title:"機械娘",value:"機械娘"}, {title:"碧池",value:"碧池"}, {title:"痴女",value:"痴女"}, {title:"雌小鬼",value:"雌小鬼"}, {title:"不良少女",value:"不良少女"}, {title:"傲嬌",value:"傲嬌"}, {title:"病嬌",value:"病嬌"}, {title:"無口",value:"無口"}, {title:"無表情",value:"無表情"}, {title:"眼神死",value:"眼神死"}, {title:"正太",value:"正太"}, {title:"偽娘",value:"偽娘"}, {title:"扶他",value:"扶他"}]
                },
                { name: "page", title: "页码", type: "page", value: "1" }
            ]
        },
        {
            title: "外貌身材",
            description: "按外貌身材筛选",
            requiresWebView: false,
            type: "video",
            functionName: "loadByTagBody",
            cacheDuration: 600,
            params: [
                {
                    name: "sort_by",
                    title: "外貌身材",
                    type: "enumeration",
                    value: "短髮",
                    enumOptions: [{title:"短髮",value:"短髮"}, {title:"馬尾",value:"馬尾"}, {title:"雙馬尾",value:"雙馬尾"}, {title:"丸子頭",value:"丸子頭"}, {title:"巨乳",value:"巨乳"}, {title:"乳環",value:"乳環"}, {title:"舌環",value:"舌環"}, {title:"貧乳",value:"貧乳"}, {title:"黑皮膚",value:"黑皮膚"}, {title:"曬痕",value:"曬痕"}, {title:"眼鏡娘",value:"眼鏡娘"}, {title:"獸耳",value:"獸耳"}, {title:"尖耳朵",value:"尖耳朵"}, {title:"異色瞳",value:"異色瞳"}, {title:"美人痣",value:"美人痣"}, {title:"肌肉女",value:"肌肉女"}, {title:"白虎",value:"白虎"}, {title:"陰毛",value:"陰毛"}, {title:"腋毛",value:"腋毛"}, {title:"大屌",value:"大屌"}, {title:"著衣",value:"著衣"}, {title:"水手服",value:"水手服"}, {title:"體操服",value:"體操服"}, {title:"泳裝",value:"泳裝"}, {title:"比基尼",value:"比基尼"}, {title:"死庫水",value:"死庫水"}, {title:"和服",value:"和服"}, {title:"兔女郎",value:"兔女郎"}, {title:"圍裙",value:"圍裙"}, {title:"啦啦隊",value:"啦啦隊"}, {title:"絲襪",value:"絲襪"}, {title:"吊襪帶",value:"吊襪帶"}, {title:"熱褲",value:"熱褲"}, {title:"迷你裙",value:"迷你裙"}, {title:"性感內衣",value:"性感內衣"}, {title:"緊身衣",value:"緊身衣"}, {title:"丁字褲",value:"丁字褲"}, {title:"高跟鞋",value:"高跟鞋"}, {title:"睡衣",value:"睡衣"}, {title:"婚紗",value:"婚紗"}, {title:"旗袍",value:"旗袍"}, {title:"古裝",value:"古裝"}, {title:"哥德",value:"哥德"}, {title:"口罩",value:"口罩"}, {title:"刺青",value:"刺青"}, {title:"淫紋",value:"淫紋"}, {title:"身體寫字",value:"身體寫字"}]
                },
                { name: "page", title: "页码", type: "page", value: "1" }
            ]
        },
        {
            title: "情境场所",
            description: "按情境场所筛选",
            requiresWebView: false,
            type: "video",
            functionName: "loadByTagLoc",
            cacheDuration: 600,
            params: [
                {
                    name: "sort_by",
                    title: "情境场所",
                    type: "enumeration",
                    value: "校園",
                    enumOptions: [{title:"校園",value:"校園"}, {title:"教室",value:"教室"}, {title:"圖書館",value:"圖書館"}, {title:"保健室",value:"保健室"}, {title:"游泳池",value:"游泳池"}, {title:"愛情賓館",value:"愛情賓館"}, {title:"醫院",value:"醫院"}, {title:"辦公室",value:"辦公室"}, {title:"浴室",value:"浴室"}, {title:"窗邊",value:"窗邊"}, {title:"公共廁所",value:"公共廁所"}, {title:"公眾場合",value:"公眾場合"}, {title:"戶外野戰",value:"戶外野戰"}, {title:"電車",value:"電車"}, {title:"車震",value:"車震"}, {title:"遊艇",value:"遊艇"}, {title:"露營帳篷",value:"露營帳篷"}, {title:"電影院",value:"電影院"}, {title:"健身房",value:"健身房"}, {title:"沙灘",value:"沙灘"}, {title:"溫泉",value:"溫泉"}, {title:"夜店",value:"夜店"}, {title:"監獄",value:"監獄"}, {title:"教堂",value:"教堂"}]
                },
                { name: "page", title: "页码", type: "page", value: "1" }
            ]
        },
        {
            title: "故事剧情",
            description: "按故事剧情筛选",
            requiresWebView: false,
            type: "video",
            functionName: "loadByTagPlot",
            cacheDuration: 600,
            params: [
                {
                    name: "sort_by",
                    title: "故事剧情",
                    type: "enumeration",
                    value: "純愛",
                    enumOptions: [{title:"純愛",value:"純愛"}, {title:"戀愛喜劇",value:"戀愛喜劇"}, {title:"後宮",value:"後宮"}, {title:"十指緊扣",value:"十指緊扣"}, {title:"開大車",value:"開大車"}, {title:"NTR",value:"NTR"}, {title:"精神控制",value:"精神控制"}, {title:"藥物",value:"藥物"}, {title:"痴漢",value:"痴漢"}, {title:"阿嘿顏",value:"阿嘿顏"}, {title:"精神崩潰",value:"精神崩潰"}, {title:"獵奇",value:"獵奇"}, {title:"BDSM",value:"BDSM"}, {title:"捆綁",value:"捆綁"}, {title:"眼罩",value:"眼罩"}, {title:"項圈",value:"項圈"}, {title:"調教",value:"調教"}, {title:"異物插入",value:"異物插入"}, {title:"尋歡洞",value:"尋歡洞"}, {title:"肉便器",value:"肉便器"}, {title:"性奴隸",value:"性奴隸"}, {title:"胃凸",value:"胃凸"}, {title:"強制",value:"強制"}, {title:"輪姦",value:"輪姦"}, {title:"凌辱",value:"凌辱"}, {title:"性暴力",value:"性暴力"}, {title:"逆強制",value:"逆強制"}, {title:"女王樣",value:"女王樣"}, {title:"榨精",value:"榨精"}, {title:"母女丼",value:"母女丼"}, {title:"姐妹丼",value:"姐妹丼"}, {title:"出軌",value:"出軌"}, {title:"醉酒",value:"醉酒"}, {title:"攝影",value:"攝影"}, {title:"睡眠姦",value:"睡眠姦"}, {title:"機械姦",value:"機械姦"}, {title:"蟲姦",value:"蟲姦"}, {title:"性轉換",value:"性轉換"}, {title:"百合",value:"百合"}, {title:"耽美",value:"耽美"}, {title:"時間停止",value:"時間停止"}, {title:"異世界",value:"異世界"}, {title:"怪獸",value:"怪獸"}, {title:"哥布林",value:"哥布林"}, {title:"世界末日",value:"世界末日"}]
                },
                { name: "page", title: "页码", type: "page", value: "1" }
            ]
        },
        {
            title: "性交体位",
            description: "按性交体位筛选",
            requiresWebView: false,
            type: "video",
            functionName: "loadByTagPos",
            cacheDuration: 600,
            params: [
                {
                    name: "sort_by",
                    title: "性交体位",
                    type: "enumeration",
                    value: "手交",
                    enumOptions: [{title:"手交",value:"手交"}, {title:"指交",value:"指交"}, {title:"乳交",value:"乳交"}, {title:"乳頭交",value:"乳頭交"}, {title:"肛交",value:"肛交"}, {title:"雙洞齊下",value:"雙洞齊下"}, {title:"腳交",value:"腳交"}, {title:"素股",value:"素股"}, {title:"拳交",value:"拳交"}, {title:"3P",value:"3P"}, {title:"群交",value:"群交"}, {title:"口交",value:"口交"}, {title:"跪舔",value:"跪舔"}, {title:"深喉嚨",value:"深喉嚨"}, {title:"口爆",value:"口爆"}, {title:"吞精",value:"吞精"}, {title:"舔蛋蛋",value:"舔蛋蛋"}, {title:"舔穴",value:"舔穴"}, {title:"69",value:"69"}, {title:"自慰",value:"自慰"}, {title:"腋交",value:"腋交"}, {title:"舔腋下",value:"舔腋下"}, {title:"髮交",value:"髮交"}, {title:"舔耳朵",value:"舔耳朵"}, {title:"舔腳",value:"舔腳"}, {title:"內射",value:"內射"}, {title:"外射",value:"外射"}, {title:"顏射",value:"顏射"}, {title:"潮吹",value:"潮吹"}, {title:"懷孕",value:"懷孕"}, {title:"噴奶",value:"噴奶"}, {title:"放尿",value:"放尿"}, {title:"排便",value:"排便"}, {title:"騎乘位",value:"騎乘位"}, {title:"背後位",value:"背後位"}, {title:"顏面騎乘",value:"顏面騎乘"}, {title:"火車便當",value:"火車便當"}, {title:"一字馬",value:"一字馬"}, {title:"性玩具",value:"性玩具"}, {title:"飛機杯",value:"飛機杯"}, {title:"跳蛋",value:"跳蛋"}, {title:"毒龍鑽",value:"毒龍鑽"}, {title:"觸手",value:"觸手"}, {title:"獸交",value:"獸交"}, {title:"頸手枷",value:"頸手枷"}, {title:"扯頭髮",value:"扯頭髮"}, {title:"掐脖子",value:"掐脖子"}, {title:"打屁股",value:"打屁股"}, {title:"肉棒打臉",value:"肉棒打臉"}, {title:"陰道外翻",value:"陰道外翻"}, {title:"男乳首責",value:"男乳首責"}, {title:"接吻",value:"接吻"}, {title:"舌吻",value:"舌吻"}, {title:"POV",value:"POV"}]
                },
                { name: "page", title: "页码", type: "page", value: "1" }
            ]
        }
    ]
};

const BASE_URL = "https://hanime1.me";
const REQUEST_TIMEOUT = 12000;

const S2T_MAP = {
    "无码": "無碼", "AI解码": "AI解碼", "中文字幕": "中文字幕", "中文配音": "中文配音",
    "同人作品": "同人作品", "断面图": "斷面圖", "动态": "動態", "动画": "動畫",
    "里番": "裏番", "泡面番": "泡麵番",
    "师生": "師生", "情侣": "情侶", "青梅竹马": "青梅竹馬", "处女": "處女",
    "御姐": "御姐", "熟女": "熟女", "女教师": "女教師", "男教师": "男教師",
    "女医生": "女醫生", "女病人": "女病人", "护士": "護士", "女警": "女警",
    "女仆": "女僕", "魔女": "魔女", "风俗娘": "風俗娘", "女战士": "女戰士",
    "女骑士": "女騎士", "异种族": "異種族", "妖精": "妖精", "魔物娘": "魔物娘",
    "吸血鬼": "吸血鬼", "兽娘": "獸娘", "机械娘": "機械娘", "痴女": "痴女",
    "不良少女": "不良少女", "傲娇": "傲嬌", "病娇": "病嬌", "无表情": "無表情",
    "伪娘": "偽娘",
    "短发": "短髮", "马尾": "馬尾", "双马尾": "雙馬尾", "丸子头": "丸子頭",
    "乳环": "乳環", "舌环": "舌環", "贫乳": "貧乳", "黑皮肤": "黑皮膚",
    "晒痕": "曬痕", "眼镜娘": "眼鏡娘", "兽耳": "獸耳", "尖耳朵": "尖耳朵",
    "异色瞳": "異色瞳", "肌肉女": "肌肉女", "阴毛": "陰毛", "腋毛": "腋毛",
    "大屌": "大屌", "着衣": "著衣", "体操服": "體操服", "泳装": "泳裝",
    "和服": "和服", "围裙": "圍裙", "啦啦队": "啦啦隊", "丝袜": "絲襪",
    "吊袜带": "吊襪帶", "热裤": "熱褲", "迷你裙": "迷你裙", "性感内衣": "性感內衣",
    "紧身衣": "緊身衣", "丁字裤": "丁字褲", "高跟鞋": "高跟鞋", "睡衣": "睡衣",
    "婚纱": "婚紗", "古装": "古裝", "刺青": "刺青", "淫纹": "淫紋",
    "身体写字": "身體寫字",
    "校园": "校園", "图书馆": "圖書館", "游泳池": "游泳池", "爱情宾馆": "愛情賓館",
    "医院": "醫院", "办公室": "辦公室", "窗边": "窗邊", "公共厕所": "公共厕所",
    "公众场合": "公眾场合", "户外野战": "戶外野戰", "电车": "電車", "车震": "車震",
    "露营帐篷": "露營帳篷", "电影院": "電影院", "健身房": "健身房", "沙滩": "沙灘",
    "监狱": "監獄",
    "纯爱": "純愛", "恋爱喜剧": "戀愛喜劇", "后宫": "後宮", "十指紧扣": "十指緊扣",
    "开大车": "開大車", "精神控制": "精神控制", "药物": "藥物", "痴汉": "痴漢",
    "阿嘿颜": "阿嘿顏", "精神崩溃": "精神崩潰", "猎奇": "獵奇", "捆绑": "捆綁",
    "眼罩": "眼罩", "项圈": "項圈", "调教": "調教", "异物插入": "異物插入",
    "寻欢洞": "尋歡洞", "肉便器": "肉便器", "性奴隶": "性奴隸", "胃凸": "胃凸",
    "强制": "強制", "轮奸": "輪姦", "性暴力": "性暴力", "逆强制": "逆強制",
    "女王样": "女王樣", "榨精": "榨精", "出轨": "出軌", "醉酒": "醉酒",
    "摄影": "攝影", "睡眠奸": "睡眠姦", "机械奸": "機械姦", "虫奸": "蟲姦",
    "性转换": "性轉換", "时间停止": "時間停止", "异世界": "異世界", "怪兽": "怪獸",
    "世界末日": "世界末日",
    "手交": "手交", "指交": "指交", "乳交": "乳交", "乳头交": "乳頭交",
    "肛交": "肛交", "双洞齐下": "雙洞齊下", "脚交": "腳交", "拳交": "拳交",
    "群交": "群交", "口交": "口交", "深喉咙": "深喉嚨", "吞精": "吞精",
    "舔蛋蛋": "舔蛋蛋", "自慰": "自慰", "腋交": "腋交", "舔腋下": "舔腋下",
    "发交": "髮交", "舔耳朵": "舔耳朵", "舔脚": "舔腳", "内射": "內射",
    "外射": "外射", "颜射": "顏射", "潮吹": "潮吹", "怀孕": "懷孕",
    "喷奶": "噴奶", "放尿": "放尿", "排便": "排便", "骑乘位": "騎乘位",
    "背后位": "背後位", "颜面骑乘": "顏面騎乘", "火车便当": "火車便當",
    "一字马": "一字馬", "性玩具": "性玩具", "飞机杯": "飛機杯",
    "跳蛋": "跳蛋", "毒龙钻": "毒龍鑽", "触手": "觸手", "兽交": "獸交",
    "颈手枷": "頸手枷", "扯头发": "扯頭髮", "掐脖子": "掐脖子",
    "打屁股": "打屁股", "肉棒打脸": "肉棒打臉", "阴道外翻": "陰道外翻",
    "男乳首责": "男乳首責", "接吻": "接吻", "舌吻": "舌吻", "POV": "POV"
};

function convertToTraditional(text) {
    if (!text) return "";
    let result = text;
    const sortedKeys = Object.keys(S2T_MAP).sort((a, b) => b.length - a.length);
    for (const simp of sortedKeys) {
        if (result.includes(simp)) {
            result = result.split(simp).join(S2T_MAP[simp]);
        }
    }
    return result;
}

function getCommonHeaders(refererUrl = BASE_URL + "/") {
    return {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
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
    if (!src.startsWith("http")) return BASE_URL + "/" + src;
    return src;
}

function normalizeWatchUrl(href) {
    if (!href) return "";
    if (href.startsWith("http")) return href;
    if (href.startsWith("/")) return BASE_URL + href;
    return BASE_URL + "/" + href;
}

function stripHtmlText(text) {
    return (text || "").replace(/\s+/g, " ").trim();
}

function safeText(text, fallback = "") {
    const value = stripHtmlText(text);
    return value || fallback;
}

function assignImagePaths(imgUrl) {
    const normUrl = normalizeImageUrl(imgUrl);
    if (!normUrl) return { posterPath: undefined, backdropPath: undefined };
    
    if (normUrl.includes('/thumbnail/')) {
        return { posterPath: undefined, backdropPath: normUrl };
    }
    if (normUrl.includes('/cover/')) {
        return { posterPath: normUrl, backdropPath: undefined };
    }
    return { posterPath: normUrl, backdropPath: normUrl };
}

function extractCardData($card, seen) {
    const href = $card.attr('href') || $card.find('a.overlay').attr('href') || $card.find('a.video-link').attr('href') || '';
    const link = normalizeWatchUrl(href);
    if (!link || seen.has(link) || !/\/watch\?v=\d+/.test(link)) return null;

    const title = safeText($card.find('.home-rows-videos-title, .card-mobile-title, div.title').first().text());
    if (!title) return null;

    const $imgs = $card.find('img');
    let $posterImg;
    if ($card.hasClass('related-watch-wrap') && $imgs.length >= 2) {
        $posterImg = $imgs.eq(1);
    } else {
        $posterImg = $imgs.first();
    }
    const poster = $posterImg.attr('data-src') || $posterImg.attr('data-original') || $posterImg.attr('src') || '';

    const durationText = safeText($card.find('div.duration, .card-mobile-duration').first().text()) || undefined;
    const cardText = $card.find('.stat-item, .subtitle').text() || '';
    const cardDateMatch = cardText.match(/\d{4}-\d{2}-\d{2}/);
    const releaseDate = cardDateMatch ? cardDateMatch[0] : undefined;

    seen.add(link);
    return { link, title, poster, durationText, releaseDate };
}

function buildCards($) {
    const cards = [];
    $('.home-rows-videos-div').each((_, el) => cards.push($(el).parent('a')));
    $('.related-watch-wrap').each((_, el) => cards.push($(el)));
    $('div.video-item-container').each((_, el) => cards.push($(el)));
    return cards;
}

function parseListHtml(html) {
    if (!html || !html.trim()) return [];
    const $ = Widget.html.load(html);
    const items = [];
    const seen = new Set();

    buildCards($).forEach($card => {
        const data = extractCardData($card, seen);
        if (!data) return;
        const { link, title, poster, durationText, releaseDate } = data;
        const normUrl = normalizeImageUrl(poster);
        items.push({
            id: link,
            type: "url",
            title: convertToTraditional(title),
            posterPath: undefined,
            backdropPath: normUrl || undefined,
            durationText,
            releaseDate,
            link,
            mediaType: "movie",
            playerType: "system"
        });
    });

    return items;
}

function parseListHtmlPortrait(html) {
    if (!html || !html.trim()) return [];
    const $ = Widget.html.load(html);
    const items = [];
    const seen = new Set();

    buildCards($).forEach($card => {
        const data = extractCardData($card, seen);
        if (!data) return;
        const { link, title, poster, durationText, releaseDate } = data;
        const normUrl = normalizeImageUrl(poster);
        items.push({
            id: link,
            type: "url",
            title: convertToTraditional(title),
            posterPath: normUrl || undefined,
            backdropPath: undefined,
            durationText,
            releaseDate,
            link,
            mediaType: "movie",
            playerType: "system"
        });
    });

    return items;
}

function parseListHtmlSearch(html) {
    if (!html || !html.trim()) return [];
    const $ = Widget.html.load(html);
    const items = [];
    const seen = new Set();

    buildCards($).forEach($card => {
        const data = extractCardData($card, seen);
        if (!data) return;
        const { link, title, poster, durationText, releaseDate } = data;
        const normUrl = normalizeImageUrl(poster);
        const posterPath = normUrl || undefined;
        const backdropPath = normUrl || undefined;
        items.push({
            id: link,
            type: "url",
            title: convertToTraditional(title),
            posterPath,
            backdropPath,
            durationText,
            releaseDate,
            link,
            mediaType: "movie",
            playerType: "system"
        });
    });

    return items;
}

async function fetchAndParse(url, referer, parser = parseListHtml) {
    try {
        const response = await httpGetWithTimeout(url, referer);
        return parser(response.data || "");
    } catch (e) {
        return [];
    }
}

function mapSortToApi(v) {
    const m = {
        "new_release":    "最新上市",
        "latest_upload":  "最新上傳",
        "daily_rank":     "本日排行",
        "weekly_rank":    "本週排行",
        "monthly_rank":   "本月排行",
        "views":          "觀看次數",
        "likes":          "點讚比例",
        "duration":       "時長最長",
        "watching":       "他們在看"
    };
    return m[v] || "";
}

function mapGenreToApi(v) {
    const m = {
        "rifan":   "裏番",
        "paomian": "泡麵番",
        "motion":  "Motion Anime",
        "3dcg":    "3DCG",
        "2d":      "2D動畫",
        "2_5d":    "2.5D",
        "ai":      "AI生成",
        "mmd":     "MMD",
        "cosplay": "Cosplay"
    };
    return m[v] || "";
}

function mapTimeToApi(v) {
    const m = {
        "24h": "過去 24 小時",
        "2d":  "過去 2 天",
        "1w":  "過去 1 週",
        "1m":  "過去 1 個月",
        "3m":  "過去 3 個月",
        "1y":  "過去 1 年"
    };
    return m[v] || "";
}

function mapDurationToApi(v) {
    const m = {
        "1m_plus":  "1 分鐘 +",
        "5m_plus":  "5 分鐘 +",
        "10m_plus": "10 分鐘 +",
        "20m_plus": "20 分鐘 +",
        "30m_plus": "30 分鐘 +",
        "60m_plus": "60 分鐘 +",
        "0_10m":    "0 - 10 分鐘",
        "0_20m":    "0 - 20 分鐘"
    };
    return m[v] || "";
}

function buildSiteUrl(path, queryParts = []) {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const query = queryParts.filter(Boolean).join('&');
    return query ? `${BASE_URL}${cleanPath}?${query}` : `${BASE_URL}${cleanPath}`;
}

function appendTagsToQuery(params, queryParts) {
    ['tag_attr', 'tag_rel', 'tag_role', 'tag_body', 'tag_plot', 'tag_loc', 'tag_pos'].forEach(field => {
        const raw = params[field];
        if (!raw || raw === 'all') return;
        raw.split(/[\s,，]+/).forEach(tag => {
            if (tag && tag !== 'all') {
                queryParts.push(`tags%5B%5D=${encodeURIComponent(convertToTraditional(tag))}`);
            }
        });
    });
}

async function searchVideos(params) {
    const page = parseInt(params.page) || 1;
    const rawKeyword = params.keyword || "";
    const sort = mapSortToApi(params.sort_by || 'all');
    const queryParts = [];

    if (rawKeyword) queryParts.push(`query=${encodeURIComponent(convertToTraditional(rawKeyword))}`);
    if (sort) queryParts.push(`sort=${encodeURIComponent(sort)}`);
    appendTagsToQuery(params, queryParts);
    if (page > 1) queryParts.push(`page=${page}`);

    const url = buildSiteUrl('/search', queryParts);
    const referer = page > 1
        ? buildSiteUrl('/search', queryParts.map(p => p.startsWith('page=') ? `page=${page - 1}` : p))
        : BASE_URL + '/';
    return fetchAndParse(url, referer, parseListHtmlSearch);
}

async function loadAdvancedGenre(params) {
    const page = parseInt(params.page) || 1;
    const genre = mapGenreToApi(params.genre);
    const sort = mapSortToApi(params.sort_by || "all");
    const time = mapTimeToApi(params.upload_time);
    const duration = mapDurationToApi(params.duration_filter);
    const queryParts = [];

    if (genre) queryParts.push(`genre=${encodeURIComponent(genre)}`);
    if (sort) queryParts.push(`sort=${encodeURIComponent(sort)}`);
    if (time) queryParts.push(`time=${encodeURIComponent(time)}`);
    if (duration) queryParts.push(`duration=${encodeURIComponent(duration)}`);
    appendTagsToQuery(params, queryParts);
    if (page > 1) queryParts.push(`page=${page}`);

    const url = buildSiteUrl('/search', queryParts);
    const referer = page > 1
        ? buildSiteUrl('/search', queryParts.map(p => p.startsWith('page=') ? `page=${page - 1}` : p))
        : BASE_URL + '/';

    const isPortrait = ['rifan', 'paomian'].includes(params.genre);
    return fetchAndParse(url, referer, isPortrait ? parseListHtmlPortrait : parseListHtml);
}

async function loadHotRankings(params) {
    const page = parseInt(params.page) || 1;
    const sortVal = mapSortToApi(params.sort_by || "watching") || "他們在看";
    const queryParts = [];

    if (sortVal) queryParts.push(`sort=${encodeURIComponent(sortVal)}`);
    if (page > 1) queryParts.push(`page=${page}`);

    const url = buildSiteUrl('/search', queryParts);
    const referer = page > 1
        ? buildSiteUrl('/search', queryParts.map(p => p.startsWith('page=') ? `page=${page - 1}` : p))
        : BASE_URL + '/';
    return fetchAndParse(url, referer);
}

function buildTagModuleUrl(params) {
    const tag = params.sort_by;
    const page = parseInt(params.page) || 1;
    const queryParts = [];

    if (tag && tag !== 'all') {
        queryParts.push(`tags%5B%5D=${encodeURIComponent(convertToTraditional(tag))}`);
    }
    if (page > 1) queryParts.push(`page=${page}`);

    const url = buildSiteUrl('/search', queryParts);
    const referer = page > 1
        ? buildSiteUrl('/search', queryParts.map(p => p.startsWith('page=') ? `page=${page - 1}` : p))
        : BASE_URL + '/';
    return { url, referer };
}

async function loadByTagAttr(params) { const { url, referer } = buildTagModuleUrl(params); return fetchAndParse(url, referer); }
async function loadByTagRel(params) { const { url, referer } = buildTagModuleUrl(params); return fetchAndParse(url, referer); }
async function loadByTagRole(params) { const { url, referer } = buildTagModuleUrl(params); return fetchAndParse(url, referer); }
async function loadByTagBody(params) { const { url, referer } = buildTagModuleUrl(params); return fetchAndParse(url, referer); }
async function loadByTagLoc(params) { const { url, referer } = buildTagModuleUrl(params); return fetchAndParse(url, referer); }
async function loadByTagPlot(params) { const { url, referer } = buildTagModuleUrl(params); return fetchAndParse(url, referer); }
async function loadByTagPos(params) { const { url, referer } = buildTagModuleUrl(params); return fetchAndParse(url, referer); }

async function loadDetail(link) {
    try {
        const response = await httpGetWithTimeout(link, link);
        const html = response.data || "";
        const $ = Widget.html.load(html);

        let videoUrl = "";
        let trailerUrl = "";
        let bestSize = -1;
        let worstSize = 99999;

        $('video source[src]').each((_, el) => {
            const $s = $(el);
            const src = ($s.attr('src') || '').replace(/&amp;/g, '&');
            const size = parseInt($s.attr('size') || '0', 10);

            if (src) {
                if (size > bestSize) {
                    bestSize = size;
                    videoUrl = src;
                }
                if (size > 0 && size < worstSize) {
                    worstSize = size;
                    trailerUrl = src;
                }
            }
        });

        if (!videoUrl) {
            const match = html.match(/https?:\/\/[^"'\s]+\.mp4[^"'\s]*/);
            if (match) {
                videoUrl = match[0].replace(/&amp;/g, '&');
                trailerUrl = videoUrl;
            }
        }
        if (!trailerUrl && videoUrl) trailerUrl = videoUrl;

        const origTitle = safeText($('#shareBtn-title').text());
        let transTitle = "";
        $('div.video-description-panel').children('div[style*="margin-bottom"]')
            .not('[class]')
            .each((_, el) => {
                const t = safeText($(el).text());
                if (!t) return;
                if (/^\d+$/.test(t)) return;
                if (/觀看次數|观看次数|萬次|万次|\d{4}-\d{2}-\d{2}/.test(t)) return;
                if (t === origTitle) return;
                transTitle = t;
                return false;
            });

        let title = convertToTraditional(transTitle || origTitle || '标题未知');
        let tagline = (transTitle && origTitle && transTitle !== origTitle)
            ? convertToTraditional(origTitle)
            : undefined;

        const genreItems = [];
        $('.single-video-tag a').each((_, el) => {
            const tagText = $(el).text().replace(/\(\d+\)/g, '').replace(/&nbsp;/g, '').trim();
            if (tagText && tagText !== 'add' && tagText !== 'remove') {
                genreItems.push({ id: tagText, title: convertToTraditional(tagText) });
            }
        });

        const peoples = [];
        const seenPeoples = new Set();
        $('.video-details-wrapper a[href*="/user/"]').each((_, el) => {
            const $a = $(el);
            const href = $a.attr('href') || '';
            const userId = href.split('/user/')[1]?.split(/[?#]/)[0] || '';
            const $imgs = $a.find('img');
            const $realAvatar = $imgs.length >= 2 ? $imgs.eq(1) : $imgs.first();
            const avatar = normalizeImageUrl(
                $realAvatar.attr('src') || $realAvatar.attr('data-src') || ''
            );
            const name = convertToTraditional(
                safeText($realAvatar.attr('alt') || $a.text())
            );
            if (!name || seenPeoples.has(name)) return;
            seenPeoples.add(name);
            peoples.push({
                id: userId || name,
                title: name,
                avatar: avatar || 'https://iili.io/KtHNnQS.png',
            });
        });
        if (!peoples.length) {
            const artistName = convertToTraditional(safeText($('#video-artist-name').text()));
            if (artistName) peoples.push({
                id: artistName,
                title: artistName,
                avatar: 'https://iili.io/KtHNnQS.png',
            });
        }

        let releaseDate = "";
        const hiddenXsText = $('.hidden-xs').first().text() || "";
        const detailsText = $('.video-details-wrapper').text() || "";
        const dateMatch = (hiddenXsText + " " + detailsText).match(/\d{4}-\d{2}-\d{2}/);
        if (dateMatch) releaseDate = dateMatch[0];

        let description = "";
        const $caption = $('.video-caption-text');
        if ($caption.length) {
            let raw = $caption.text()
                .replace(/&amp;/g, '&')
                .replace(/\u00a0/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
            raw = raw
                .replace(/^[\s\u201c\u201d\u300c\u300d\uff02"「『\u300e\u300f]+/, '')
                .replace(/[\s\u201c\u201d\u300c\u300d\uff02"」』\u300e\u300f]+$/, '')
                .trim();
            if (raw) description = convertToTraditional(raw);
        }
        if (!description) {
            const ogDesc = $('meta[property="og:description"]').attr('content') || '';
            const cleanOg = ogDesc.trim();
            if (cleanOg && cleanOg !== origTitle && cleanOg !== transTitle) {
                description = convertToTraditional(cleanOg);
            }
        }

        const ogImage = normalizeImageUrl($('meta[property="og:image"]').attr('content') || '');
        let finalPosterPath = undefined;
        let finalBackdropPath = ogImage || undefined;

        const relatedItems = [];
        const seenRelated = new Set([link]);

        const relatedCards = [];
        $('.home-rows-videos-div').each((_, el) => relatedCards.push($(el).parent('a')));
        $('.related-watch-wrap').each((_, el) => relatedCards.push($(el)));

        relatedCards.forEach($card => {
            if (relatedItems.length >= 12) return;
            const href = $card.attr('href') || $card.find('a.overlay').attr('href') || '';
            const recLink = normalizeWatchUrl(href);
            if (!recLink || seenRelated.has(recLink) || !/\/watch\?v=\d+/.test(recLink)) return;
            seenRelated.add(recLink);

            const recTitle = safeText($card.find('.home-rows-videos-title, .card-mobile-title').first().text()) || '相关视频';

            const $imgs = $card.find('img');
            let $recImg;
            if ($card.hasClass('related-watch-wrap') && $imgs.length >= 2) {
                $recImg = $imgs.eq(1);
            } else {
                $recImg = $imgs.first();
            }
            const recPosterRaw = $recImg.attr('data-src') || $recImg.attr('data-original') || $recImg.attr('src') || '';
            const recBackdrop = normalizeImageUrl(recPosterRaw) || undefined;
            const rawDurText = $card.find('.card-mobile-duration').text();
            const durMatch = rawDurText.match(/\d+:\d{2}/);
            const recDuration = durMatch ? durMatch[0] : undefined;
            const vidMatch = recLink.match(/v=(\d+)/);
            const vid = vidMatch ? vidMatch[1] : undefined;
            const recDesc = [
                recDuration ? `时长: ${recDuration}` : null,
                vid ? `ID: ${vid}` : null
            ].filter(Boolean).join(' | ') || undefined;
            relatedItems.push({
                id: recLink,
                type: 'url',
                title: convertToTraditional(recTitle),
                posterPath: undefined,
                backdropPath: recBackdrop,
                description: recDesc,
                mediaType: 'movie',
                link: recLink
            });
        });

        return {
            id: link,
            type: 'detail',
            videoUrl,
            trailers: (trailerUrl && trailerUrl !== videoUrl)
                ? [{ coverUrl: finalBackdropPath || finalPosterPath || '', url: trailerUrl }]
                : undefined,
            title,
            tagline,
            description,
            genreItems: genreItems.length > 0 ? genreItems : undefined,
            peoples: peoples.length > 0 ? peoples : undefined,
            releaseDate: releaseDate || undefined,
            posterPath: finalPosterPath,
            backdropPath: finalBackdropPath,
            mediaType: 'movie',
            link,
            relatedItems,
            customHeaders: getCommonHeaders(link)
        };

    } catch (error) {
        return {
            id: link,
            type: 'detail',
            videoUrl: link,
            title: '加载失败',
            description: '无法加载视频或该视频已失效，请刷新重试。',
            posterPath: undefined,
            backdropPath: undefined,
            mediaType: 'movie',
            link
        };
    }
}
