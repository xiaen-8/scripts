WidgetMetadata = {
    id: "gm.xHamster.gm",
    title: "xHamster",
    version: "0.0.1",
    requiredVersion: "0.0.1",
    description: "xHamster 是一个以用户上传内容（UGC）为核心的成人视频网站和社区平台，创立于 2007 年，由 Hammy Media Ltd. 运营，总部位于塞浦路斯利马索尔。",
    author: "GM",
    site: "https://zh.xhamster.com",
    detailCacheDuration: 600,
    modules: [
        // ========== 最新视频 ==========
        {
            id: "newVideos",
            title: "最新",
            functionName: "getNewVideos",
            cacheDuration: 300,
            params: [
                {
                    name: "page",
                    title: "页码",
                    type: "page",
                    description: "页码",
                    value: "1"
                }
            ]
        },
        // ========== 最佳视频 ==========
        {
            id: "bestVideos",
            title: "最佳",
            functionName: "getBestVideos",
            cacheDuration: 600,
            params: [
                {
                    name: "period",
                    title: "时间范围",
                    type: "enumeration",
                    description: "最佳视频的时间范围",
                    value: "today",
                    enumOptions: [
                        { title: "今日", value: "today" },
                        { title: "本周", value: "weekly" },
                        { title: "本月", value: "monthly" },
                        { title: "全部", value: "all" }
                    ]
                },
                {
                    name: "page",
                    title: "页码",
                    type: "page",
                    description: "页码",
                    value: "1"
                }
            ]
        },
        // ========== 分类浏览：流行分类 ==========
        {
            id: "categoryPopular",
            title: "流行",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                {
                    name: "category",
                    title: "流行分类",
                    type: "enumeration",
                    description: "当前流行的视频分类",
                    value: "asian",
                    enumOptions: [
                        { title: "亚洲人", value: "asian" },
                        { title: "无码", value: "uncensored" },
                        { title: "18岁", value: "18-year-old" },
                        { title: "内射", value: "creampie" },
                        { title: "人妻", value: "milf" },
                        { title: "日本AV", value: "jav" },
                        { title: "成熟", value: "mature" },
                        { title: "素人", value: "amateur" },
                        { title: "人母", value: "mom" }
                    ]
                },
                {
                    name: "sort_by",
                    title: "排序方式",
                    type: "enumeration",
                    description: "排序方式",
                    value: "trending",
                    enumOptions: [
                        { title: "热门", value: "trending" },
                        { title: "最新", value: "newest" },
                        { title: "最佳", value: "best" },
                    ]
                },
                {
                    name: "page",
                    title: "页码",
                    type: "page",
                    description: "页码",
                    value: "1"
                }
            ]
        },
        // ========== 分类浏览：制作 ==========
        {
            id: "categoryProduction",
            title: "制作",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                {
                    name: "category",
                    title: "制作分类",
                    type: "enumeration",
                    description: "制作相关的视频分类",
                    value: "3d",
                    enumOptions: [
                        { title: "3D", value: "3d" },
                        { title: "业余", value: "amateur" },
                        { title: "幕后花絮", value: "behind-the-scenes" },
                        { title: "字幕", value: "caption" },
                        { title: "动画", value: "cartoon" },
                        { title: "特写", value: "close-up" },
                        { title: "合集", value: "compilation" },
                        { title: "情色", value: "erotica" },
                        { title: "搞笑", value: "funny" },
                        { title: "实录", value: "gonzo" },
                        { title: "Hentai", value: "hentai" },
                        { title: "自拍", value: "homemade" },
                        { title: "互动", value: "interactive" },
                        { title: "JAV", value: "jav" },
                        { title: "PMV", value: "pmv" },
                        { title: "POV", value: "pov" },
                        { title: "色情明星", value: "pornstar" },
                        { title: "怀旧", value: "retro" },
                        { title: "表演", value: "show" },
                        { title: "软核", value: "softcore" },
                        { title: "剧情", value: "story" },
                        { title: "无码", value: "uncensored" },
                        { title: "复古", value: "vintage" },
                        { title: "摄像头", value: "webcam" }
                    ]
                },
                {
                    name: "sort_by",
                    title: "排序方式",
                    type: "enumeration",
                    description: "排序方式",
                    value: "trending",
                    enumOptions: [
                        { title: "热门", value: "trending" },
                        { title: "最新", value: "newest" },
                        { title: "最佳", value: "best" },
                    ]
                },
                {
                    name: "page",
                    title: "页码",
                    type: "page",
                    description: "页码",
                    value: "1"
                }
            ]
        },
        // ========== 分类浏览：行动 ==========
        {
            id: "categoryActions",
            title: "行为",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                {
                    name: "category",
                    title: "行为分类",
                    type: "enumeration",
                    description: "性行动相关的视频分类",
                    value: "69",
                    enumOptions: [
                        { title: "69", value: "69" },
                        { title: "肛交", value: "anal" },
                        { title: "肛门手淫", value: "anal-masturbation" },
                        { title: "舔肛", value: "ass-licking" },
                        { title: "Ass to Mouth", value: "ass-to-mouth" },
                        { title: "Blowbang", value: "blowbang" },
                        { title: "口交", value: "blowjob" },
                        { title: "粗暴性爱", value: "brutal-sex" },
                        { title: "颜射", value: "bukkake" },
                        { title: "女上位", value: "cowgirl" },
                        { title: "内射", value: "creampie" },
                        { title: "吞精", value: "cum-swallowing" },
                        { title: "口内射精", value: "cum-in-mouth" },
                        { title: "射在脚上", value: "cum-on-feet" },
                        { title: "射在胸上", value: "cum-on-tits" },
                        { title: "射精", value: "cumshot" },
                        { title: "交换精液", value: "cumswap" },
                        { title: "舔阴", value: "cunnilingus" },
                        { title: "深喉", value: "deep-throat" },
                        { title: "脏话", value: "dirty-talk" },
                        { title: "后入式", value: "doggy-style" },
                        { title: "双插", value: "double-penetration" },
                        { title: "磨蹭", value: "dry-humping" },
                        { title: "舔鲍", value: "eating-pussy" },
                        { title: "边缘控制", value: "edging" },
                        { title: "极端插入", value: "extreme-insertion" },
                        { title: "颜面干插", value: "face-fuck" },
                        { title: "颜坐", value: "facesitting" },
                        { title: "颜面射精", value: "facial" },
                        { title: "女性自慰", value: "female-masturbation" },
                        { title: "指交", value: "fingering" },
                        { title: "拳交", value: "fisting" },
                        { title: "闪露", value: "flashing" },
                        { title: "足交", value: "footjob" },
                        { title: "前戏", value: "foreplay" },
                        { title: "肛门张开", value: "gaping" },
                        { title: "手交", value: "handjob" },
                        { title: "快乐结局", value: "happy-ending" },
                        { title: "挺动", value: "humping" },
                        { title: "接吻", value: "kissing" },
                        { title: "按摩", value: "massage" },
                        { title: "传教士", value: "missionary" },
                        { title: "呻吟", value: "moaning" },
                        { title: "高潮", value: "orgasm" },
                        { title: "女用假阳具", value: "pegging" },
                        { title: "前列腺按摩", value: "prostate-massage" },
                        { title: "骑乘", value: "riding" },
                        { title: "舔肛", value: "rimjob" },
                        { title: "粗暴肛交", value: "rough-anal" },
                        { title: "粗暴性爱", value: "rough-sex" },
                        { title: "剪刀式", value: "scissoring" },
                        { title: "尖叫", value: "screaming" },
                        { title: "剃毛", value: "shaving" },
                        { title: "潮吹", value: "squirting" },
                        { title: "脱衣舞", value: "striptease" },
                        { title: "乳交", value: "titty-fucking" },
                        { title: "电臀", value: "twerking" },
                        { title: "瑜伽", value: "yoga" }
                    ]
                },
                {
                    name: "sort_by",
                    title: "排序方式",
                    type: "enumeration",
                    description: "排序方式",
                    value: "trending",
                    enumOptions: [
                        { title: "热门", value: "trending" },
                        { title: "最新", value: "newest" },
                        { title: "最佳", value: "best" },
                    ]
                },
                {
                    name: "page",
                    title: "页码",
                    type: "page",
                    description: "页码",
                    value: "1"
                }
            ]
        },
        // ========== 分类浏览：恋物癖 ==========
        {
            id: "categoryFetish",
            title: "恋物",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                {
                    name: "category",
                    title: "恋物癖分类",
                    type: "enumeration",
                    description: "恋物癖相关的视频分类",
                    value: "bdsm",
                    enumOptions: [
                        { title: "阿嘿颜", value: "ahegao" },
                        { title: "腋窝", value: "armpit" },
                        { title: "BDSM", value: "bdsm" },
                        { title: "虐蛋", value: "ballbusting" },
                        { title: "气球", value: "balloon" },
                        { title: "肚子痴迷", value: "belly-fetish" },
                        { title: "体毛痴迷", value: "body-hair-fetish" },
                        { title: "人体彩绘", value: "body-paint" },
                        { title: "捆绑", value: "bondage" },
                        { title: "CBT", value: "cbt" },
                        { title: "CEI", value: "cei" },
                        { title: "贞操", value: "chastity" },
                        { title: "安全套", value: "condom" },
                        { title: "支配", value: "domination" },
                        { title: "女支配", value: "femdom" },
                        { title: "恋物", value: "fetish" },
                        { title: "恋足", value: "foot-fetish" },
                        { title: "足崇拜", value: "foot-worship" },
                        { title: "羞辱", value: "humiliation" },
                        { title: "变态", value: "kinky" },
                        { title: "哺乳", value: "lactating" },
                        { title: "油滑", value: "oiled" },
                        { title: "高潮控制", value: "orgasm-control" },
                        { title: "撒尿", value: "pissing" },
                        { title: "绳艺", value: "shibari" },
                        { title: "伪娘", value: "sissy" },
                        { title: "抽烟", value: "smoking" },
                        { title: "打屁股", value: "spanking" },
                        { title: "顺从", value: "submissive" },
                        { title: "挠痒", value: "tickling" },
                        { title: "捆绑束缚", value: "tied-up" },
                        { title: "蜡玩", value: "wax-play" },
                        { title: "摔跤", value: "wrestling" }
                    ]
                },
                {
                    name: "sort_by",
                    title: "排序方式",
                    type: "enumeration",
                    description: "排序方式",
                    value: "trending",
                    enumOptions: [
                        { title: "热门", value: "trending" },
                        { title: "最新", value: "newest" },
                        { title: "最佳", value: "best" },
                    ]
                },
                {
                    name: "page",
                    title: "页码",
                    type: "page",
                    description: "页码",
                    value: "1"
                }
            ]
        },
        // ========== 分类浏览：身体 ==========
        {
            id: "categoryBody",
            title: "身体",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                {
                    name: "category",
                    title: "身体特征",
                    type: "enumeration",
                    description: "按身材外貌筛选",
                    value: "big-tits",
                    enumOptions: [
                        { title: "大奶子", value: "big-tits" },
                        { title: "天然巨乳", value: "big-natural-tits" },
                        { title: "小奶子", value: "small-tits" },
                        { title: "假奶子", value: "fake-tits" },
                        { title: "大屁股", value: "big-ass" },
                        { title: "大鸡巴", value: "big-cock" },
                        { title: "娇小", value: "petite" },
                        { title: "微胖", value: "chubby" },
                        { title: "胖美女", value: "bbw" },
                        { title: "骨感", value: "skinny" },
                        { title: "怀孕", value: "pregnant" },
                        { title: "纹身", value: "tattoo" },
                        { title: "身体穿孔", value: "piercing" },
                        { title: "毛发浓密", value: "hairy" },
                        { title: "美女", value: "beauty" },
                        { title: "可爱", value: "cute" },
                        { title: "裸体", value: "nude" },
                        { title: "异国情调", value: "exotic" },
                        { title: "肌肉发达的女人", value: "muscular-woman" },
                        { title: "柔软", value: "flexible" }
                    ]
                },
                { name: "sort_by", title: "排序方式", type: "enumeration", value: "best", enumOptions: [{ title: "最佳", value: "best" }, { title: "最新", value: "newest" }] },
                { name: "page", title: "页码", type: "page" }
            ]
        },
        // ========== 分类浏览：头发 ==========
        {
            id: "categoryHair",
            title: "头发",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                {
                    name: "category",
                    title: "发色发型",
                    type: "enumeration",
                    description: "按发色发型筛选",
                    value: "blonde",
                    enumOptions: [
                        { title: "金发", value: "blonde" },
                        { title: "黑发女郎", value: "brunette" },
                        { title: "红发", value: "redhead" },
                        { title: "短发", value: "short-hair" },
                        { title: "长发", value: "long-hair" },
                        { title: "染发", value: "colored-hair" }
                    ]
                },
                { name: "sort_by", title: "排序方式", type: "enumeration", value: "best", enumOptions: [{ title: "最佳", value: "best" }, { title: "最新", value: "newest" }] },
                { name: "page", title: "页码", type: "page" }
            ]
        },
        // ========== 分类浏览：衣服 ==========
        {
            id: "categoryApparel",
            title: "服饰",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                {
                    name: "category",
                    title: "服饰穿着",
                    type: "enumeration",
                    description: "按服饰穿着筛选",
                    value: "lingerie",
                    enumOptions: [
                        { title: "性感内衣", value: "lingerie" },
                        { title: "制服", value: "uniform" },
                        { title: "学生制服", value: "school-uniform" },
                        { title: "比基尼", value: "bikini" },
                        { title: "丁字裤", value: "thong" },
                        { title: "内裤", value: "panties" },
                        { title: "胸罩", value: "bra" },
                        { title: "长筒丝袜", value: "stockings" },
                        { title: "连裤袜", value: "pantyhose" },
                        { title: "短裙", value: "skirt" },
                        { title: "牛仔裤", value: "jeans" },
                        { title: "高跟鞋", value: "high-heels" },
                        { title: "皮衣", value: "leather" },
                        { title: "渔网装", value: "fishnet" },
                        { title: "乳胶服", value: "latex" },
                        { title: "紧身衣", value: "spandex" },
                        { title: "眼镜", value: "glasses" },
                        { title: "蒙面", value: "masked" }
                    ]
                },
                { name: "sort_by", title: "排序方式", type: "enumeration", value: "best", enumOptions: [{ title: "最佳", value: "best" }, { title: "最新", value: "newest" }] },
                { name: "page", title: "页码", type: "page" }
            ]
        },
        // ========== 分类浏览：性取向 ==========
        {
            id: "categoryOrientation",
            title: "取向",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                {
                    name: "category",
                    title: "性取向",
                    type: "enumeration",
                    description: "按性取向筛选",
                    value: "bisexual",
                    enumOptions: [
                        { title: "双性恋", value: "bisexual" },
                        { title: "女同", value: "lesbian" }
                    ]
                },
                { name: "sort_by", title: "排序方式", type: "enumeration", value: "best", enumOptions: [{ title: "最佳", value: "best" }, { title: "最新", value: "newest" }] },
                { name: "page", title: "页码", type: "page" }
            ]
        },
        // ========== 分类浏览：年龄 ==========
        {
            id: "categoryAge",
            title: "年龄",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                {
                    name: "category",
                    title: "年龄段",
                    type: "enumeration",
                    description: "按年龄筛选",
                    value: "teen",
                    enumOptions: [
                        { title: "18岁", value: "18-year-old" },
                        { title: "人妻", value: "milf" },
                        { title: "奶奶", value: "granny" },
                        { title: "宝贝", value: "babe" },
                        { title: "成熟", value: "mature" },
                        { title: "老少配", value: "old-young" },
                        { title: "老熟女", value: "gilf" },
                        { title: "老男人", value: "old-man" },
                        { title: "青年", value: "teen" },
                        { title: "饥渴熟女", value: "cougar" }
                    ]
                },
                { name: "sort_by", title: "排序方式", type: "enumeration", value: "best", enumOptions: [{ title: "最佳", value: "best" }, { title: "最新", value: "newest" }] },
                { name: "page", title: "页码", type: "page" }
            ]
        },
        // ========== 分类浏览：种族 ==========
        {
            id: "categoryEthnicity",
            title: "种族",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                {
                    name: "category",
                    title: "种族",
                    type: "enumeration",
                    description: "按种族筛选",
                    value: "asian",
                    enumOptions: [
                        { title: "亚洲人", value: "asian" },
                        { title: "印度", value: "desi" },
                        { title: "拉丁美女", value: "latina" },
                        { title: "欧洲人", value: "european" },
                        { title: "美国人", value: "american" },
                        { title: "跨人种", value: "interracial" },
                        { title: "阿拉伯人", value: "arab" },
                        { title: "非洲人", value: "african" },
                        { title: "黄种男和白人女", value: "amwf" },
                        { title: "黑人", value: "black" }
                    ]
                },
                { name: "sort_by", title: "排序方式", type: "enumeration", value: "best", enumOptions: [{ title: "最佳", value: "best" }, { title: "最新", value: "newest" }] },
                { name: "page", title: "页码", type: "page" }
            ]
        },
        // ========== 分类浏览：人数 ==========
        {
            id: "categoryPeople",
            title: "人数",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                {
                    name: "category",
                    title: "人数",
                    type: "enumeration",
                    description: "按参与人数筛选",
                    value: "threesome",
                    enumOptions: [
                        { title: "3P", value: "threesome" },
                        { title: "4P", value: "foursome" },
                        { title: "单人表演", value: "solo" },
                        { title: "多对一群交", value: "gangbang" },
                        { title: "情侣", value: "couple" },
                        { title: "群交", value: "group-sex" },
                        { title: "群交派对", value: "orgy" }
                    ]
                },
                { name: "sort_by", title: "排序方式", type: "enumeration", value: "best", enumOptions: [{ title: "最佳", value: "best" }, { title: "最新", value: "newest" }] },
                { name: "page", title: "页码", type: "page" }
            ]
        },
        // ========== 分类浏览：性玩具 ==========
        {
            id: "categorySexToys",
            title: "玩具",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                {
                    name: "category",
                    title: "性玩具",
                    type: "enumeration",
                    description: "按使用玩具筛选",
                    value: "sex-toy",
                    enumOptions: [
                        { title: "成人玩具", value: "sex-toy" },
                        { title: "假阳具", value: "dildo" },
                        { title: "振动棒", value: "vibrator" },
                        { title: "穿戴式假阳具", value: "strapon" },
                        { title: "双头假阳具", value: "double-dildo" },
                        { title: "性爱机器", value: "fucking-machine" },
                        { title: "肛塞", value: "butt-plug" },
                        { title: "肛门拉珠", value: "anal-beads" },
                        { title: "灌肠", value: "enema" },
                        { title: "阴道抽插", value: "pussy-pump" },
                        { title: "蒙眼", value: "blindfolded" },
                        { title: "堵嘴球", value: "ball-gagged" }
                    ]
                },
                { name: "sort_by", title: "排序方式", type: "enumeration", value: "best", enumOptions: [{ title: "最佳", value: "best" }, { title: "最新", value: "newest" }] },
                { name: "page", title: "页码", type: "page" }
            ]
        },
        // ========== 分类浏览：设想（场景/剧情） ==========
        {
            id: "categoryScenario",
            title: "剧情",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                {
                    name: "category",
                    title: "设想场景",
                    type: "enumeration",
                    description: "按剧情场景筛选",
                    value: "hardcore",
                    enumOptions: [
                        { title: "重口味", value: "hardcore" },
                        { title: "角色扮演", value: "role-play" },
                        { title: "人母", value: "mom" },
                        { title: "处女", value: "virgin" },
                        { title: "出轨", value: "cheating" },
                        { title: "共享妻子", value: "wife-sharing" },
                        { title: "绿帽奴", value: "cuckold" },
                        { title: "第一次", value: "first-time" },
                        { title: "换妻", value: "wife-swap" },
                        { title: "勾引", value: "seduce" },
                        { title: "学生", value: "student" },
                        { title: "教师", value: "teacher" },
                        { title: "护士", value: "nurse" },
                        { title: "医生", value: "doctor" },
                        { title: "秘书", value: "secretary" },
                        { title: "老板", value: "boss" },
                        { title: "女仆", value: "maid" },
                        { title: "警察", value: "police" },
                        { title: "军队", value: "military" },
                        { title: "公共场合性爱", value: "public-sex" },
                        { title: "偷窥癖", value: "voyeur" },
                        { title: "陌生人", value: "stranger" },
                        { title: "搭讪", value: "pick-up" },
                        { title: "幻想", value: "fantasy" },
                        { title: "浪漫", value: "romantic" },
                        { title: "同人作品", value: "parody" },
                        { title: "试镜", value: "casting" },
                        { title: "面试", value: "audition" }
                    ]
                },
                { name: "sort_by", title: "排序方式", type: "enumeration", value: "best", enumOptions: [{ title: "最佳", value: "best" }, { title: "最新", value: "newest" }] },
                { name: "page", title: "页码", type: "page" }
            ]
        },
        // ========== 分类浏览：地点 ==========
        {
            id: "categoryLocation",
            title: "地点",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                {
                    name: "category",
                    title: "地点",
                    type: "enumeration",
                    description: "按发生地点筛选",
                    value: "office",
                    enumOptions: [
                        { title: "办公室", value: "office" },
                        { title: "厨房", value: "kitchen" },
                        { title: "浴室", value: "bathroom" },
                        { title: "淋浴", value: "shower" },
                        { title: "泳池", value: "pool" },
                        { title: "海滩", value: "beach" },
                        { title: "户外", value: "outdoor" },
                        { title: "汽车", value: "car" },
                        { title: "公交车", value: "bus" },
                        { title: "火车", value: "train" },
                        { title: "健身房", value: "gym" },
                        { title: "大学", value: "college" },
                        { title: "医院", value: "hospital" },
                        { title: "旅馆", value: "hotel" },
                        { title: "监狱", value: "prison" },
                        { title: "厕所", value: "toilet" },
                        { title: "桑拿", value: "sauna" },
                        { title: "农场", value: "farm" },
                        { title: "丛林", value: "jungle" },
                        { title: "水下", value: "underwater" }
                    ]
                },
                { name: "sort_by", title: "排序方式", type: "enumeration", value: "best", enumOptions: [{ title: "最佳", value: "best" }, { title: "最新", value: "newest" }] },
                { name: "page", title: "页码", type: "page" }
            ]
        }
    ],
    search: {
        title: "搜索",
        functionName: "getSearchResults",
        params: [
            { name: "search_query", title: "搜索关键词", type: "input", value: "Hegre" },
            { name: "sort_by", title: "排序方式", type: "enumeration", value: "relevant", enumOptions: [
                { title: "最相关", value: "relevant" },
                { title: "最新发布", value: "new" },
                { title: "最多播放", value: "views" }
            ]},
            { name: "page", title: "页码", type: "page" }
        ]
    }
};

// 全局搜索导航回退模块（与 search 共用 functionName）
WidgetMetadata.modules.push({
    id: "searchGlobal",
    title: "搜索",
    functionName: "getSearchResults",
    cacheDuration: 180,
    params: [
        { name: "search_query", title: "搜索关键词", type: "input", value: "Hegre" },
        { name: "sort_by", title: "排序方式", type: "enumeration", value: "relevant", enumOptions: [
            { title: "最相关", value: "relevant" },
            { title: "最新发布", value: "new" },
            { title: "最多播放", value: "views" }
        ]},
        { name: "page", title: "页码", type: "page" }
    ]
});

// ============================================================
//  常量
// ============================================================
const BASE_URL = "https://zh.xhamster.com";
const REQUEST_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.5",
    "Referer": "https://zh.xhamster.com/"
};
const IMAGE_HEADERS = {
    "User-Agent": REQUEST_HEADERS["User-Agent"],
    "Referer": "https://zh.xhamster.com/"
};

// ============================================================
//  辅助函数
// ============================================================

function stripHtmlText(text) {
    return (text || "").replace(/\s+/g, " ").trim();
}

function safeText(text, fallback = "") {
    const value = stripHtmlText(text);
    return value || fallback;
}

function normalizeImageUrl(src) {
    if (!src) return "";
    if (src.startsWith("//")) return "https:" + src;
    return src;
}

function normalizeWatchUrl(href) {
    if (!href) return "";
    if (href.startsWith("http")) {
        // 强制替换任意 xhamster.com 域名为 zh 域名
        return href.replace(/https?:\/\/(?:[^\/]+\.)?xhamster\.com/gi, BASE_URL);
    }
    if (href.startsWith("/")) return BASE_URL + href;
    return BASE_URL + "/" + href;
}

// 根据 href 生成带类型前缀的 peopleId
function makePeopleId(href) {
    if (!href) return "";
    const slug = href.split('/').pop().replace(/^\/+/, '').split('?')[0] || '';
    if (href.includes('/creators/')) return "creator:" + slug;
    if (href.includes('/pornstar')) return "pornstar:" + slug;
    if (href.includes('/users/')) return "user:" + slug;
    return slug;
}

/**
 * 从 window.initials.videoEntity 提取当前视频的 JSON 元数据
 * 返回 null 表示提取失败
 */
function extractVideoEntity(html) {
    try {
        const veIdx = html.indexOf('"videoEntity"');
        if (veIdx < 0) return null;
        const braceStart = html.indexOf('{', veIdx);
        if (braceStart < 0 || braceStart - veIdx > 30) return null;
        let depth = 0;
        for (let i = braceStart; i < Math.min(braceStart + 20000, html.length); i++) {
            if (html[i] === '{') depth++;
            else if (html[i] === '}') { depth--; if (depth === 0) return JSON.parse(html.substring(braceStart, i + 1)); }
        }
    } catch (e) { /* ignore */ }
    return null;
}

function extractMetadataFromDetail(html) {
    const $ = Widget.html.load(html);
    const entity = extractVideoEntity(html);

    // 标题（优先 videoEntity，兜底 DOM）
    let title = entity ? safeText(entity.title) : '';
    if (!title) title = safeText($('h1').first().text());
    if (!title) title = safeText($('meta[property="og:title"]').attr("content") || "");
    if (!title) title = safeText($('title').text());

    // 描述（优先 videoEntity，兜底 DOM）
    let description = entity ? safeText(entity.description) : '';
    if (!description) description = safeText($('meta[name="description"]').attr("content") || $('meta[property="og:description"]').attr("content") || "");
    if (!description) {
        const $desc = $('.video-description');
        if ($desc.length) description = safeText($desc.text());
    }

    // 分类（仅从 video-tags-list 区域提取，排除侧栏/页脚分类导航）
    const genreItems = [];
    const seenGenres = new Set();
    $('[data-role="video-tags-list"] a[href*="/categories/"]').each(function () {
        if (genreItems.length >= 12) return;
        const href = $(this).attr('href') || '';
        const slugMatch = href.match(/\/categories\/([^/?]+)/);
        const slug = slugMatch ? slugMatch[1] : '';
        const catText = safeText($(this).text());
        if (!slug || !catText || seenGenres.has(slug)) return;
        seenGenres.add(slug);
        genreItems.push({ id: slug, title: catText });
    });

    // 团队（上传者/作者）
    const peoples = [];
    const seenNames = new Set();

    // 优先使用 tag-list 容器内第一个 creator 链接（data-role="video-tags-list" 内才是真正的上传者，共演不会排第一）
    $('[data-role="video-tags-list"] a[href*="/creators/"], [data-role="video-tags-list"] a[href*="/users/"], [data-role="video-tags-list"] a[href*="/pornstar/"]').each(function () {
        if (peoples.length > 0) return;
        const $a = $(this);
        const href = $a.attr('href') || '';
        // 取名称（从 img alt 或链接文本）
        const name = safeText($a.find('img').first().attr('alt') || $a.text());
        if (!name || name.length < 2 || seenNames.has(name)) return;
        seenNames.add(name);
        // 取头像：链接内的 img
        const $img = $a.find('img').first();
        const avatarUrl = normalizeImageUrl($img.attr('src') || $img.attr('data-src') || '');
        peoples.push({ id: makePeopleId(href), title: name, avatar: normalizeImageUrl(avatarUrl) || undefined });
    });

    // 兜底：video-uploader__name（少数单上传者页面这个也准）
    if (!peoples.length) {
        $('a.video-uploader__name[data-role="video-uploader-link"]').each(function () {
            if (peoples.length > 0) return;
            const $a = $(this);
            const href = $a.attr('href') || '';
            const peopleId = makePeopleId(href);
            const name = safeText($a.text());
            if (!name || name.length < 2 || seenNames.has(name)) return;
            seenNames.add(name);
            // 找对应头像（同一 href 的 video-uploader-logo，取 data-background-image）
            let avatarUrl = '';
            $('a.video-uploader-logo[data-role="video-uploader-link"][href="' + href + '"]').each(function () {
                const bg = $(this).attr('data-background-image') || '';
                if (bg) avatarUrl = bg.split(',')[0] || bg;
            });
            if (!avatarUrl) {
                $a.parent().find('img.image-9a750, img[alt]').each(function () {
                    const src = $(this).attr('src') || '';
                    if (src && !avatarUrl) avatarUrl = src;
                });
            }
            peoples.push({ id: peopleId, title: name, avatar: normalizeImageUrl(avatarUrl) || undefined });
        });
    }

    // 兜底：如果 video-uploader__name 找不到，用全局范围加 nav 过滤
    if (!peoples.length) {
        $('a[href*="/creators/"], a[href*="/users/"], a[href*="/pornstar/"]').each(function () {
            if (peoples.length > 0) return;
            const $a = $(this);
            const rawText = safeText($a.text());
            if (!rawText || /^[A-Za-z]+$/.test(rawText) || rawText.length < 2) return;
            const name = safeText(rawText.replace(/\d+\.?\d*[KkMmBb]?\/?\s*$/, '').trim());
            if (!name || name.length < 2) return;
            const href = $a.attr('href') || '';
            const peopleId = makePeopleId(href);
            // 取链接内的头像
            let avatarUrl = '';
            $a.find('img').each(function () {
                const src = $(this).attr('src') || '';
                if (src.indexOf('avatar') >= 0) avatarUrl = src;
            });
            if (!avatarUrl) {
                const $firstImg = $a.find('img').first();
                if ($firstImg.length) avatarUrl = $firstImg.attr('src') || '';
            }
            peoples.push({ id: peopleId, title: name, avatar: normalizeImageUrl(avatarUrl) || undefined });
        });
    }

    // 发布日期 — 优先 videoEntity.dateAgo（如 "2 年 前"），换算为近似日期
    let releaseDate = "";
    const dateAgoStr = entity ? entity.dateAgo : null;
    if (dateAgoStr) {
        try {
            const now = new Date();
            const numMatch = String(dateAgoStr).match(/(\d+)/);
            if (numMatch) {
                const n = parseInt(numMatch[1]);
                if (/年|year/i.test(dateAgoStr)) now.setFullYear(now.getFullYear() - n);
                else if (/月|month/i.test(dateAgoStr)) now.setMonth(now.getMonth() - n);
                else if (/周|week/i.test(dateAgoStr)) now.setDate(now.getDate() - n * 7);
                else if (/天|day/i.test(dateAgoStr)) now.setDate(now.getDate() - n);
                else if (/小时|hour/i.test(dateAgoStr)) now.setHours(now.getHours() - n);
                const y = now.getFullYear();
                const m = String(now.getMonth() + 1).padStart(2, '0');
                const d = String(now.getDate()).padStart(2, '0');
                releaseDate = y + '-' + m + '-' + d;
            }
        } catch (e) { /* ignore */ }
    }

    // 背景图
    const backdropPath = normalizeImageUrl($('meta[property="og:image"]').attr("content") || "") || undefined;

    // 预览视频 URL (预告片)
    let previewUrl = "";
    $('[data-previewvideo]').each(function () {
        const url = $(this).attr("data-previewvideo") || "";
        if (url && !previewUrl) previewUrl = url;
    });
    if (!previewUrl) {
        const previewMatch = html.match(/"previewUrl"\s*:\s*"([^"]+)"/);
        if (previewMatch) previewUrl = previewMatch[1].replace(/\\\//g, "/");
    }

    // 视频时长 — 优先 videoEntity.duration（秒数），兜底 HTML 正则
    let duration = 0;
    let durationText = "";
    if (entity && entity.duration && entity.duration > 0) {
        duration = entity.duration;
    } else {
        const durMatch = html.match(/"duration"\s*:\s*(\d+)/);
        if (durMatch) duration = parseInt(durMatch[1]);
    }
    if (duration > 0) {
        const mins = Math.floor(duration / 60);
        const secs = duration % 60;
        durationText = mins + ":" + (secs < 10 ? "0" : "") + secs;
    }

    // 剧照 — 优先 videoEntity.capturedFrames，兜底 HTML 正则
    let backdropPaths = [];
    if (entity && entity.capturedFrames && entity.capturedFrames.length > 0) {
        for (const frame of entity.capturedFrames) {
            const src = frame.imgFrameSrc || frame.imgSrc || '';
            if (src) {
                const normalized = normalizeImageUrl(src);
                if (normalized) backdropPaths.push(normalized);
            }
        }
    }
    if (backdropPaths.length === 0) {
        const frameRegex = /"imgFrameSrc"\s*:\s*"([^"]+)"/g;
        let frameMatch;
        while ((frameMatch = frameRegex.exec(html)) !== null) {
            const src = frameMatch[1].replace(/\\\//g, '/');
            const normalized = normalizeImageUrl(src);
            if (normalized) backdropPaths.push(normalized);
        }
    }

    return {
        title: title || "视频播放",
        description: description || undefined,
        genreItems: genreItems.length > 0 ? genreItems : undefined,
        peoples: peoples.length > 0 ? peoples : undefined,
        releaseDate: releaseDate || undefined,
        backdropPath: backdropPath || undefined,
        backdropPaths: backdropPaths.length > 0 ? backdropPaths : undefined,
        duration: duration || undefined,
        durationText: durationText || undefined,
        previewUrl: previewUrl || undefined
    };
}

function extractRelatedFromDetail(html, currentLink) {
    const items = [];
    const seen = new Set([currentLink]);

    const $ = Widget.html.load(html);

    // 尝试多种选择器找推荐视频卡片
    const cardSelectors = [
        '.recommended-videos .video-thumb',
        '.suggested-videos .video-thumb',
        '.more-videos .video-thumb',
        '.video-thumb',
        '.thumb-list-item'
    ];

    for (const sel of cardSelectors) {
        if (items.length >= 12) break;
        const $cards = $(sel);
        if ($cards.length < 1) continue;

        $cards.each(function () {
            if (items.length >= 12) return false;

            const $card = $(this);
            const $a = $card.find('a').first();
            if (!$a.length) return;

            const href = $a.attr('href') || '';
            const link = normalizeWatchUrl(href);
            if (!link || seen.has(link) || !link.includes('/videos/')) return;

            const $img = $card.find('img').first();
            if (!$img.length) return;

            const title = safeText($img.attr('alt') || $a.attr('aria-label') || $card.attr('aria-label') || '');
            if (!title) return;

            const imgSrc = $img.attr('src') || $img.attr('data-src') || '';
            const backdropPath = normalizeImageUrl(imgSrc) || undefined;

            seen.add(link);
            items.push({
                id: link,
                type: 'url',
                title: title,
                coverUrl: backdropPath,
                backdropPath: backdropPath,
                mediaType: 'movie',
                link: link
            });
        });

        if (items.length > 0) break;
    }

    return items.length > 0 ? items : undefined;
}

async function fetchPage(url, headers) {
    const response = await Widget.http.get(url, { headers: headers || REQUEST_HEADERS });
    if (!response || !response.data) {
        throw new Error("页面加载失败");
    }
    return response.data;
}

// ============================================================
//  解析视频列表 — 桌面版 HTML 结构
//  优先级：1) 页面内嵌 JSON (window.initials.videoThumbProps)
//          2) DOM 解析 (.video-thumb--type-video) 作为兜底
// ============================================================
function parseVideoList(html) {
    const items = [];
    const seen = new Set();

    // —— 方式 1：从 window.initials JSON 中提取 videoThumbProps ——
    const propsKey = '"videoThumbProps":[';
    const propsIdx = html.indexOf(propsKey);
    if (propsIdx >= 0) {
        // 括号计数找到匹配的 ]
        let arrayStart = propsIdx + propsKey.length - 1; // 指向 [
        let depth = 0;
        let arrayEnd = -1;
        for (let i = arrayStart; i < html.length; i++) {
            if (html[i] === '[') depth++;
            else if (html[i] === ']') {
                depth--;
                if (depth === 0) { arrayEnd = i + 1; break; }
            }
        }

        if (arrayEnd > arrayStart) {
            try {
                const arrayStr = html.substring(arrayStart, arrayEnd);
                const videoData = JSON.parse(arrayStr);

                for (const v of videoData) {
                    const videoId = String(v.id || "");
                    const link = (v.pageURL || "").replace(/\\\//g, '/');
                    if (!videoId || !link || seen.has(link)) continue;
                    seen.add(link);

                    const title = (v.title || "").trim();
                    const coverUrl = normalizeImageUrl((v.imageURL || v.thumbURL || "").replace(/\\\//g, '/')) || "";
                    const previewUrl = (v.trailerURL || "").replace(/\\\//g, '/') || undefined;
                    const author = (v.landing && v.landing.name) ? v.landing.name.trim() : "";

                    // 时长：JSON 中是秒数，转为 MM:SS
                    let durationText = "";
                    if (v.duration && v.duration > 0) {
                        const mins = Math.floor(v.duration / 60);
                        const secs = v.duration % 60;
                        durationText = mins + ":" + (secs < 10 ? "0" : "") + secs;
                    }

                    items.push({
                        id: videoId,
                        type: "url",
                        mediaType: "movie",
                        title: title || "未命名视频",
                        description: author ? "作者：" + author : "",
                        coverUrl: coverUrl,
                        previewUrl: previewUrl,
                        durationText: durationText,
                        link: link,
                        headers: IMAGE_HEADERS
                    });
                }
            } catch (e) {
                // JSON 解析失败，降级到 DOM 解析
            }
        }
    }

    // —— 方式 2：DOM 兜底 ——
    if (items.length === 0) {
        const $ = Widget.html.load(html);

        $(".video-thumb--type-video[data-video-id]").each(function () {
            const $el = $(this);
            const videoId = $el.attr("data-video-id") || "";

            let link = "";
            let title = "";
            let previewUrl = "";
            const $link = $el.find(".video-thumb__image-container").first();
            if ($link.length) {
                link = $link.attr("href") || "";
                title = $link.attr("aria-label") || $link.attr("title") || "";
                previewUrl = $link.attr("data-previewvideo") || "";
            }

            if (!videoId || !link || seen.has(link)) return;
            seen.add(link);

            let coverUrl = "";
            const $img = $el.find("img.thumb-image-container__image").first();
            if ($img.length) {
                coverUrl = $img.attr("src") || $img.attr("data-src") || "";
            }
            if (!coverUrl) {
                const $anyImg = $el.find("img").first();
                if ($anyImg.length) {
                    coverUrl = $anyImg.attr("src") || $anyImg.attr("data-src") || "";
                }
            }
            coverUrl = normalizeImageUrl(coverUrl) || "";

            let durationText = "";
            const $duration = $el.find(".thumb-image-container__duration").first();
            if ($duration.length) {
                durationText = $duration.text().trim();
            }

            let author = "";
            const $author = $el.find(".video-uploader__name").first();
            if ($author.length) {
                author = $author.text().trim();
            }

            if (link && !/^https?:\/\//.test(link)) {
                link = BASE_URL + link;
            }

            items.push({
                id: videoId,
                type: "url",
                mediaType: "movie",
                title: title || "未命名视频",
                description: author ? "作者：" + author : "",
                coverUrl: coverUrl,
                previewUrl: previewUrl || undefined,
                durationText: durationText,
                link: link,
                headers: IMAGE_HEADERS
            });
        });
    }

    return items;
}

// ============================================================
//  从视频详情页提取最高画质的 m3u8 URL
//  策略：获取主 <video> 的 m3u8 后，解析 multi 参数取最后一项（最高画质），
//  替换 _TPL_ 为具体画质名。保留 multi= 及 token，不做编码转换。
//  例如 multi=...480p:,720p: → _TPL_ → 720p
// ============================================================
function extractVideoUrl(html) {
    // 方法1: 查找主 <video> 标签的 src 属性
    const videoSrcMatch = html.match(/<video[^>]+src="(https?:\/\/[^"]+\.m3u8[^"]*?)"/i);
    if (videoSrcMatch && videoSrcMatch[1]) {
        return upgradeToBestQuality(videoSrcMatch[1]);
    }

    // 方法2: 查找 <link rel="preload" href="...m3u8">
    const preloadMatch = html.match(/<link[^>]+rel="preload"[^>]+href="(https?:\/\/[^"]+\.m3u8[^"]*?)"/i);
    if (preloadMatch && preloadMatch[1]) {
        return upgradeToBestQuality(preloadMatch[1]);
    }

    // 方法3: 直接在 HTML 中查找任意 m3u8 URL
    const anyM3u8 = html.match(/https?:\/\/[^"'\s<>]+\.m3u8[^"'\s<>]*/);
    if (anyM3u8) {
        return upgradeToBestQuality(anyM3u8[0]);
    }

    return "";
}

// 从 multi 参数中提取最高画质，替换 _TPL_
// 保留 multi= 和 token 不变（裁剪会导致 403）
function upgradeToBestQuality(url) {
    // 提取 multi 参数中的最高画质
    // 格式: multi=256x144:144p:,426x240:240p:,854x480:480p:,1280x720:720p:
    const multiMatch = url.match(/multi=([^\/]+)/);
    if (!multiMatch) return url;  // 没有 multi 参数，原样返回

    const multiPart = multiMatch[1];
    // 提取所有画质条目
    const qualities = multiPart.split(',').filter(function(q) { return q.trim(); });
    if (qualities.length <= 1) return url;  // 只有一个画质或没有，原样返回

    // 取最后一个（最高画质）
    const bestQuality = qualities[qualities.length - 1].replace(/:$/, '');
    // 从最高画质条目提取画质名 (如 720p)
    const qualityName = bestQuality.split(':')[1] || bestQuality;

    // 替换 _TPL_ 为具体画质名，保留 multi= 和 token 不变
    var newUrl = url.replace('_TPL_', qualityName);

    return newUrl;
}

// ============================================================
//  loadDetail — 获取视频 m3u8 播放链接返回给 Forward 播放器
//  Forward 约定：列表项 type="url" 时自动调用 loadDetail(link)
// ============================================================
async function loadDetail(link) {
    if (!link) throw new Error("无效的视频链接");

    // 提取 videoId（从 URL 尾部获取）
    const idMatch = link.match(/-xh([A-Za-z0-9]+)$/);
    const videoId = idMatch ? idMatch[1] : "";

    // 用桌面版 User-Agent 请求视频页
    const html = await fetchPage(link);
    const videoUrl = extractVideoUrl(html);

    if (!videoUrl) {
        throw new Error("无法获取视频播放链接");
    }

    // 提取元数据（try-catch 保护，出错不影响播放）
    let meta = { title: "视频播放" };
    try {
        meta = extractMetadataFromDetail(html);
    } catch (e) {
        // 元数据提取失败不影响播放
    }

    // 提取相似推荐视频（try-catch 保护）
    let relatedItems;
    try {
        relatedItems = extractRelatedFromDetail(html, link);
    } catch (e) {
        // 推荐提取失败不影响播放
    }

    // 构建预告片（如果有预览视频）
    const trailers = meta.previewUrl
        ? [{ coverUrl: meta.backdropPath, url: meta.previewUrl }]
        : undefined;

    return {
        id: videoId,
        type: "url",
        mediaType: "movie",
        videoUrl: videoUrl,
        headers: IMAGE_HEADERS,
        customHeaders: {
            "Referer": link,
            "User-Agent": REQUEST_HEADERS["User-Agent"]
        },
        title: meta.title,
        description: meta.description,
        genreItems: meta.genreItems,
        peoples: meta.peoples,
        releaseDate: meta.releaseDate,
        backdropPath: meta.backdropPath,
        duration: meta.duration,
        durationText: meta.durationText,
        backdropPaths: meta.backdropPaths,
        trailers: trailers,
        relatedItems: relatedItems,
        link: link
    };
}

// ============================================================
//  getPeopleVideos — 人物作品列表（peopleId 点击后调用）
// ============================================================
async function getPeopleVideos(params = {}) {
    const peopleId = (params.peopleId || "").trim();
    if (!peopleId) throw new Error("缺少人物 ID");

    const page = Math.max(1, Number(params.page) || 1);

    let url;
    const colonIdx = peopleId.indexOf(':');
    if (colonIdx > 0) {
        const type = peopleId.substring(0, colonIdx);
        const slug = peopleId.substring(colonIdx + 1);
        if (type === "user") {
            url = `${BASE_URL}/users/${slug}/videos`;
        } else if (type === "creator") {
            url = `${BASE_URL}/creators/${slug}`;
        } else if (type === "pornstar") {
            url = `${BASE_URL}/pornstars/${slug}`;
        } else {
            url = `${BASE_URL}/users/${peopleId}/videos`;
        }
    } else {
        url = `${BASE_URL}/users/${peopleId}/videos`;
    }

    if (page > 1) {
        url += `?page=${page}`;
    }

    const html = await fetchPage(url);
    return parseVideoList(html);
}

// ============================================================
//  getBestVideos — 最佳视频
// ============================================================
async function getBestVideos(params = {}) {
    if (params.genreId) return getCategoryVideos({ ...params, category: params.genreId });
    if (params.peopleId) return getPeopleVideos(params);
    const period = params.period || "weekly";
    const page = Math.max(1, Number(params.page) || 1);

    // xhamster 首页链接：Best Videos = /best/weekly
    let url;
    if (period === "today") {
        url = `${BASE_URL}/best/daily`;
    } else if (period === "weekly") {
        url = `${BASE_URL}/best/weekly`;
    } else if (period === "monthly") {
        url = `${BASE_URL}/best/monthly`;
    } else {
        // "all" 也用 weekly（xhamster 没有 /best 页面，会返回 503）
        url = `${BASE_URL}/best/weekly`;
    }

    if (page > 1) url += `/${page}`;

    const html = await fetchPage(url);
    return parseVideoList(html);
}

// ============================================================
//  getNewVideos — 最新视频
// ============================================================
async function getNewVideos(params = {}) {
    if (params.genreId) return getCategoryVideos({ ...params, category: params.genreId });
    if (params.peopleId) return getPeopleVideos(params);
    const page = Math.max(1, Number(params.page) || 1);
    // 注意：/videos 已返回 404，改用 /newest
    let url = `${BASE_URL}/newest`;
    if (page > 1) url += `/${page}`;

    const html = await fetchPage(url);
    return parseVideoList(html);
}

// ============================================================
//  getSearchResults — 全站搜索
// ============================================================
async function getSearchResults(params = {}) {
    if (params.genreId) return getCategoryVideos({ ...params, category: params.genreId });
    if (params.peopleId) return getPeopleVideos(params);
    const searchQuery = (params.search_query || params.keyword || "").trim();
    if (!searchQuery) throw new Error("请输入搜索关键词");

    const sortBy = params.sort_by || "relevant";
    const page = Math.max(1, Number(params.page) || 1);

    const formattedQuery = encodeURIComponent(searchQuery.replace(/[\s]+/g, "+"));
    let url = `${BASE_URL}/search/${formattedQuery}`;

    const sortParams = [];
    if (sortBy && sortBy !== "relevant") {
        sortParams.push(`sort=${sortBy}`);
    }
    if (page > 1) {
        sortParams.push(`page=${page}`);
    }
    if (sortParams.length > 0) {
        url += "?" + sortParams.join("&");
    }

    const html = await fetchPage(url);
    return parseVideoList(html);
}

// ============================================================
//  getCategoryVideos — 分类浏览（制作/行动/恋物癖等共用）
// ============================================================
async function getCategoryVideos(params = {}) {
    if (params.genreId) params.category = params.genreId;
    if (params.peopleId) return getPeopleVideos(params);
    const category = params.category || "3d";
    const sortBy = params.sort_by || "best";
    const page = Math.max(1, Number(params.page) || 1);

    let url = `${BASE_URL}/categories/${category}`;

    if (sortBy === "newest") {
        url += "/newest";
    } else if (sortBy === "best") {
        url += "/best";
    }

    if (page > 1) {
        url += `/${page}`;
    }

    const html = await fetchPage(url);
    return parseVideoList(html);
}