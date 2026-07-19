WidgetMetadata = {
    id: "Missav",
    title: "MissAV_ovo",
    author: "𝙈𝙖𝙠𝙠𝙖𝙋𝙖𝙠𝙠𝙖|CC|EL|Eric|墨白",
    description: "MissAV 视频聚合模块，支持其他模块聚合missav资源、支持高清海报、封面图、预告片、相似推荐、演员信息及头像",
    version: "3.2.3",
    requiredVersion: "0.0.1",
    site: "https://missav.ai",
    globalParams: [
        { name: "worker", title: "Worker地址", type: "input", value: "" }
    ],
    modules: [
        {
            title: "最近更新",
            functionName: "loadRecentUpdates",
            type: "video",
            params: [
                { name: "page", title: "页码", type: "page" }
            ]
        },
        {
            title: "中文字幕",
            functionName: "loadList",
            type: "video",
            params: [
                { name: "page", title: "页码", type: "page" },
                { name: "endpoint", title: "endpoint", type: "enumeration", value: "dm278/cn/chinese-subtitle", enumOptions: [{ title: "中文字幕", value: "dm278/cn/chinese-subtitle" }] },
                { name: "filters", title: "中文字幕筛选", type: "enumeration", value: "", enumOptions: [
                    { title: "所有", value: "" },
                    { title: "单人作品", value: "individual" },
                    { title: "多人作品", value: "multiple" },
                    { title: "中文字幕", value: "chinese-subtitle" }
                ] },
                { name: "sort_by", title: "排序", type: "enumeration", value: "released_at", enumOptions: getSortOptions() }
            ]
        },
        {
            title: "日本AV",
            functionName: "loadList",
            type: "video",
            params: [
                { name: "page", title: "页码", type: "page" },
                { name: "endpoint", title: "endpoint", type: "enumeration", value: "dm632/cn/release", enumOptions: [
                    { title: "最新发布", value: "dm632/cn/release" },
                    { title: "本周热门", value: "dm170/cn/weekly-hot" },
                    { title: "月度热门", value: "dm266/cn/monthly-hot" }
                ] },
                { name: "sort_by", title: "排序", type: "enumeration", value: "released_at", enumOptions: [
                    { title: "发行日期", value: "released_at" },
                    { title: "最近更新", value: "published_at" },
                    { title: "收藏数", value: "saved" },
                    { title: "今日浏览数", value: "today_views" },
                    { title: "本周浏览数", value: "weekly_views" },
                    { title: "本月浏览数", value: "monthly_views" },
                    { title: "总浏览数", value: "views" }
                ] }
            ]
        },
        {
            title: "素人",
            functionName: "loadList",
            type: "video",
            params: [
                { name: "page", title: "页码", type: "page" },
                { name: "endpoint", title: "endpoint", type: "enumeration", value: "dm36/cn/siro", enumOptions: [
                    { title: "SIRO", value: "dm36/cn/siro" },
                    { title: "LUXU", value: "dm34/cn/luxu" },
                    { title: "GANA", value: "dm32/cn/gana" },
                    { title: "PRESTIGE PREMIUM", value: "dm999/cn/maan" },
                    { title: "S-CUTE", value: "dm38/cn/scute" },
                    { title: "ARA", value: "dm34/cn/ara" }
                ] },
                { name: "sort_by", title: "排序", type: "enumeration", value: "released_at", enumOptions: [
                    { title: "发行日期", value: "released_at" },
                    { title: "最近更新", value: "published_at" },
                    { title: "收藏数", value: "saved" },
                    { title: "今日浏览数", value: "today_views" },
                    { title: "本周浏览数", value: "weekly_views" },
                    { title: "本月浏览数", value: "monthly_views" },
                    { title: "总浏览数", value: "views" }
                ] }
            ]
        },
        {
            title: "无码影片",
            functionName: "loadList",
            type: "video",
            params: [
                { name: "page", title: "页码", type: "page" },
                { name: "endpoint", title: "endpoint", type: "enumeration", value: "dm816/cn/uncensored-leak", enumOptions: [
                    { title: "无码流出", value: "dm816/cn/uncensored-leak" },
                    { title: "FC2", value: "dm473/cn/fc2" },
                    { title: "HEYZO", value: "dm1977446/cn/heyzo" },
                    { title: "东京热", value: "dm42/cn/tokyohot" },
                    { title: "一本道", value: "dm4364834/cn/1pondo" },
                    { title: "Caribbeancom", value: "dm7414012/cn/caribbeancom" },
                    { title: "Caribbeancompr", value: "dm83900/cn/caribbeancompr" },
                    { title: "10musume", value: "dm6341956/cn/10musume" },
                    { title: "pacopacomama", value: "dm2479243/cn/pacopacomama" },
                    { title: "Gachinco", value: "dm150/cn/gachinco" },
                    { title: "XXX-AV", value: "dm42/cn/xxxav" },
                    { title: "人妻斬", value: "dm37/cn/marriedslash" },
                    { title: "顽皮4610", value: "dm33/cn/naughty4610" },
                    { title: "顽皮0930", value: "dm37/cn/naughty0930" }
                ] },
                { name: "sort_by", title: "排序", type: "enumeration", value: "released_at", enumOptions: [
                    { title: "发行日期", value: "released_at" },
                    { title: "最近更新", value: "published_at" },
                    { title: "收藏数", value: "saved" },
                    { title: "今日浏览数", value: "today_views" },
                    { title: "本周浏览数", value: "weekly_views" },
                    { title: "本月浏览数", value: "monthly_views" },
                    { title: "总浏览数", value: "views" }
                ] }
            ]
        },
        {
            title: "亚洲AV",
            functionName: "loadList",
            type: "video",
            params: [
                { name: "page", title: "页码", type: "page" },
                { name: "endpoint", title: "endpoint", type: "enumeration", value: "dm63/cn/madou", enumOptions: [
                    { title: "麻豆传媒", value: "dm63/cn/madou" },
                    { title: "TWAV", value: "dm31/cn/twav" },
                    { title: "Furuke", value: "dm15/cn/furuke" },
                    { title: "韩国直播", value: "cn/klive" },
                    { title: "中国直播", value: "cn/clive" }
                ] },
                { name: "sort_by", title: "排序", type: "enumeration", value: "released_at", enumOptions: [
                    { title: "发行日期", value: "released_at" },
                    { title: "最近更新", value: "published_at" },
                    { title: "收藏数", value: "saved" },
                    { title: "今日浏览数", value: "today_views" },
                    { title: "本周浏览数", value: "weekly_views" },
                    { title: "本月浏览数", value: "monthly_views" },
                    { title: "总浏览数", value: "views" }
                ] }
            ]
        },
        {
            title: "女优",
            functionName: "loadList",
            type: "video",
            params: [
                { name: "page", title: "页码", type: "page" },
                { name: "endpoint", title: "endpoint", type: "enumeration", value: "dm179/cn/actresses/%E7%80%AC%E6%88%B8%E7%92%B0%E5%A5%88", enumOptions: [
                    { title: "瀬戸環奈", value: "dm179/cn/actresses/%E7%80%AC%E6%88%B8%E7%92%B0%E5%A5%88" },
                    { title: "逢泽みゆ", value: "dm179/cn/actresses/%E9%80%A2%E6%B2%A2%E3%81%BF%E3%82%86" },
                    { title: "河北彩花", value: "dm179/cn/actresses/%E6%B2%B3%E5%8C%97%E5%BD%A9%E8%8A%B1" },
                    { title: "松本一香", value: "dm179/cn/actresses/%E6%9D%BE%E6%9C%AC%E4%B8%80%E9%A6%99" },
                    { title: "美园和花", value: "dm179/cn/actresses/%E7%BE%8E%E5%9B%AD%E5%92%8C%E8%8A%B1" },
                    { title: "北冈果林", value: "dm179/cn/actresses/%E5%8C%97%E5%B2%A1%E6%9E%9C%E6%9E%97" },
                    { title: "柏木こなつ", value: "dm179/cn/actresses/%E6%9F%8F%E6%9C%A8%E3%81%93%E3%81%AA%E3%81%A4" },
                    { title: "浅野こころ", value: "dm179/cn/actresses/%E6%B5%85%E9%87%8E%E3%81%93%E3%81%93%E3%82%8D" },
                    { title: "北野未奈", value: "dm179/cn/actresses/%E5%8C%97%E9%87%8E%E6%9C%AA%E5%A5%88" },
                    { title: "清原みゆう", value: "dm179/cn/actresses/%E6%B8%85%E5%8E%9F%E3%81%BF%E3%82%86%E3%81%86" },
                    { title: "沙月惠奈", value: "dm179/cn/actresses/%E6%B2%99%E6%9C%88%E6%83%A0%E5%A5%88" },
                    { title: "miru", value: "dm179/cn/actresses/miru" },
                    { title: "七森莉莉", value: "dm179/cn/actresses/%E4%B8%83%E6%A3%AE%E8%8E%89%E8%8E%89" },
                    { title: "七濑爱丽丝", value: "dm179/cn/actresses/%E4%B8%83%E6%BF%91%E7%88%B1%E4%B8%BD%E4%B8%9D" },
                    { title: "鹫尾芽衣", value: "dm179/cn/actresses/%E9%B9%AB%E5%B0%BE%E8%8A%BD%E8%A1%A3" },
                    { title: "博多彩叶", value: "dm179/cn/actresses/%E5%8D%9A%E5%A4%9A%E5%BD%A9%E5%8F%B6" },
                    { title: "石川澪", value: "dm179/cn/actresses/%E7%9F%B3%E5%B7%9D%E6%BE%AA" },
                    { title: "白上咲花", value: "dm179/cn/actresses/%E7%99%BD%E4%B8%8A%E5%92%B2%E8%8A%B1" },
                    { title: "田野忧", value: "dm179/cn/actresses/%E7%94%B0%E9%87%8E%E5%BF%A7" },
                    { title: "未步なな", value: "dm179/cn/actresses/%E6%9C%AA%E6%AD%A5%E3%81%AA%E3%81%AA" },
                    { title: "村上悠华", value: "dm179/cn/actresses/%E6%9D%91%E4%B8%8A%E6%82%A0%E5%8D%8E" },
                    { title: "三田真铃", value: "dm179/cn/actresses/%E4%B8%89%E7%94%B0%E7%9C%9F%E9%93%83" },
                    { title: "八掛うみ", value: "dm179/cn/actresses/%E5%85%AB%E6%8E%9B%E3%81%86%E3%81%BF" },
                    { title: "初美なのか", value: "dm179/cn/actresses/%E5%88%9D%E7%BE%8E%E3%81%AA%E3%81%AE%E3%81%8B" },
                    { title: "宮下玲奈", value: "dm179/cn/actresses/%E5%AE%AE%E4%B8%8B%E7%8E%B2%E5%A5%88" },
                    { title: "新有菜", value: "dm58/actresses/%E6%A9%8B%E6%9C%AC%E6%9C%89%E8%8F%9C%20%28%E6%96%B0%E6%9C%89%E8%8F%9C%29" },
                    { title: "新木希空", value: "dm179/cn/actresses/%E6%96%B0%E6%9C%A8%E5%B8%8C%E7%A9%BA" },
                    { title: "明里つむぎ", value: "dm179/cn/actresses/%E6%98%8E%E9%87%8C%E3%81%A4%E3%82%80%E3%81%8E" },
                    { title: "本庄鈴", value: "dm179/cn/actresses/%E6%9C%AC%E5%BA%84%E9%88%B4" },
                    { title: "桃乃木かな", value: "dm179/cn/actresses/%E6%A1%83%E4%B9%83%E6%9C%A8%E3%81%8B%E3%81%AA" },
                    { title: "桜空もも", value: "dm179/cn/actresses/%E6%A1%9C%E7%A9%BA%E3%82%82%E3%82%82" },
                    { title: "楓ふうあ", value: "dm63/actresses/%E6%A5%93%E3%81%B5%E3%81%86%E3%81%82" },
                    { title: "楓可憐", value: "dm38/actresses/%E6%A5%93%E5%8F%AF%E6%86%90%20%28%E7%94%B0%E4%B8%AD%E6%AA%B8%E6%AA%AC%29" },
                    { title: "涼森れむ", value: "dm179/cn/actresses/%E6%B6%BC%E6%A3%AE%E3%82%8C%E3%82%80" },
                    { title: "瀧本雫葉", value: "dm179/cn/actresses/%E7%80%A7%E6%9C%AC%E9%9B%AB%E8%91%89" },
                    { title: "田中レモン", value: "dm179/cn/actresses/%E7%94%B0%E4%B8%AD%E3%83%AC%E3%83%A2%E3%83%B3" },
                    { title: "相沢みなみ", value: "dm179/cn/actresses/%E7%9B%B8%E6%B2%A2%E3%81%BF%E3%81%AA%E3%81%BF" },
                    { title: "神木麗", value: "dm179/cn/actresses/%E7%A5%9E%E6%9C%A8%E9%BA%97" },
                    { title: "美ノ嶋めぐり", value: "dm179/cn/actresses/%E7%BE%8E%E3%83%8E%E5%B6%8B%E3%82%81%E3%81%90%E3%82%8A" },
                    { title: "野々浦暖", value: "dm179/cn/actresses/%E9%87%8E%E3%80%85%E6%B5%A6%E6%9A%96" },
                    { title: "青空ひかり", value: "dm179/cn/actresses/%E9%9D%92%E7%A9%BA%E3%81%B2%E3%81%8B%E3%82%8A" },
                    { title: "三上悠亚", value: "dm179/cn/actresses/%E4%B8%89%E4%B8%8A%E6%82%A0%E4%BA%9A" },
                    { title: "榊原萌", value: "dm179/cn/actresses/%E6%A6%8A%E5%8E%9F%E8%90%8C" },
                    { title: "彩月七绪", value: "dm179/cn/actresses/%E5%BD%A9%E6%9C%88%E4%B8%83%E7%BB%AA" },
                    { title: "神宫寺奈绪", value: "dm179/cn/actresses/%E7%A5%9E%E5%AE%AB%E5%AF%BA%E5%A5%88%E7%BB%AA" },
                    { title: "有村のぞみ", value: "dm179/cn/actresses/%E6%9C%89%E6%9D%91%E3%81%AE%E3%81%9E%E3%81%BF" }
                ] },
                { name: "sort_by", title: "排序", type: "enumeration", value: "released_at", enumOptions: [
                    { title: "发行日期", value: "released_at" },
                    { title: "最近更新", value: "published_at" },
                    { title: "收藏数", value: "saved" },
                    { title: "今日浏览数", value: "today_views" },
                    { title: "本周浏览数", value: "weekly_views" },
                    { title: "本月浏览数", value: "monthly_views" },
                    { title: "总浏览数", value: "views" }
                ] }
            ]
        },
        {
            title: "类型",
            functionName: "loadList",
            type: "video",
            params: [
                { name: "page", title: "页码", type: "page" },
                { name: "endpoint", title: "endpoint", type: "enumeration", value: "dm96/cn/genres/%E9%AB%98%E6%B8%85", enumOptions: [
                    { title: "高清", value: "dm96/cn/genres/%E9%AB%98%E6%B8%85" },
                    { title: "独家", value: "dm139/cn/genres/%E7%8B%AC%E5%AE%B6" },
                    { title: "中出", value: "dm130/cn/genres/%E4%B8%AD%E5%87%BA" },
                    { title: "单体作品", value: "dm122/cn/genres/%E5%8D%95%E4%BD%93%E4%BD%9C%E5%93%81" },
                    { title: "巨乳", value: "dm120/cn/genres/%E5%B7%A8%E4%B9%B3" },
                    { title: "人妻", value: "dm77/cn/genres/%E4%BA%BA%E5%A6%BB" },
                    { title: "熟女", value: "dm118/cn/genres/%E7%86%9F%E5%A5%B3" },
                    { title: "素人", value: "dm123/cn/genres/%E7%B4%A0%E4%BA%BA" },
                    { title: "美少女", value: "dm437/cn/genres/%E7%BE%8E%E5%B0%91%E5%A5%B3" },
                    { title: "口交", value: "dm1301/cn/genres/%E5%8F%A3%E4%BA%A4" },
                    { title: "多人运动", value: "dm321/cn/genres/%E5%A4%9A%E4%BA%BA%E8%BF%90%E5%8A%A8" },
                    { title: "薄格", value: "dm76/cn/genres/%E8%96%84%E6%A0%BC" },
                    { title: "骑乘", value: "dm486/cn/genres/%E9%AA%91%E4%B9%98" },
                    { title: "痴女", value: "dm313/cn/genres/%E7%97%B4%E5%A5%B3" },
                    { title: "4小时以上", value: "dm738/cn/genres/4%E5%B0%8F%E6%97%B6%E4%BB%A5%E4%B8%8A" },
                    { title: "女高中生", value: "dm4448/cn/genres/%E5%A5%B3%E9%AB%98%E4%B8%AD%E7%94%9F" },
                    { title: "潮吹", value: "dm161/cn/genres/%E6%BD%AE%E5%90%B9" },
                    { title: "苗条", value: "dm757/cn/genres/%E8%8B%97%E6%9D%A1" },
                    { title: "自拍", value: "dm978/cn/genres/%E8%87%AA%E6%8B%8D" },
                    { title: "合集", value: "dm784/cn/genres/%E5%90%88%E9%9B%86" },
                    { title: "乳交", value: "dm594/cn/genres/%E4%B9%B3%E4%BA%A4" },
                    { title: "恋物癖", value: "dm117/cn/genres/%E6%81%8B%E7%89%A9%E7%99%96" },
                    { title: "美乳", value: "dm215/cn/genres/%E7%BE%8E%E4%B9%B3" },
                    { title: "NTR", value: "dm736/cn/genres/NTR" },
                    { title: "企划", value: "dm341/cn/genres/%E4%BC%81%E5%88%92" },
                    { title: "乱伦", value: "dm56/cn/genres/%E4%B9%B1%E4%BC%A6" },
                    { title: "搭讪", value: "dm292/cn/genres/%E6%90%AD%E8%AE%AA" },
                    { title: "颜射", value: "dm319/cn/genres/%E9%A2%9C%E5%B0%84" },
                    { title: "淫乱", value: "dm903/cn/genres/%E6%B7%AB%E4%B9%B1" },
                    { title: "偷拍", value: "dm516/cn/genres/%E5%81%B7%E6%8B%8D" },
                    { title: "剧情", value: "dm98/cn/genres/%E5%89%A7%E6%83%85" },
                    { title: "自慰", value: "dm7606/cn/genres/%E8%87%AA%E6%85%B0" },
                    { title: "4K", value: "dm55/cn/genres/4K" },
                    { title: "手淫", value: "dm94/cn/genres/%E6%89%8B%E6%B7%AB" },
                    { title: "姐姐", value: "dm793/cn/genres/%E5%A7%90%E5%A7%90" },
                    { title: "羞辱", value: "dm161/cn/genres/%E7%BE%9E%E8%BE%B1" }
                ] },
                { name: "sort_by", title: "排序", type: "enumeration", value: "released_at", enumOptions: [
                    { title: "发行日期", value: "released_at" },
                    { title: "最近更新", value: "published_at" },
                    { title: "收藏数", value: "saved" },
                    { title: "今日浏览数", value: "today_views" },
                    { title: "本周浏览数", value: "weekly_views" },
                    { title: "本月浏览数", value: "monthly_views" },
                    { title: "总浏览数", value: "views" }
                ] }
            ]
        },
        {
            title: "发行商",
            functionName: "loadList",
            type: "video",
            params: [
                { name: "page", title: "页码", type: "page" },
                { name: "endpoint", title: "endpoint", type: "enumeration", value: "dm825/cn/makers/Moody%27s", enumOptions: [
                    { title: "Moody's", value: "dm825/cn/makers/Moody%27s" },
                    { title: "Prestige", value: "dm825/cn/makers/Prestige" },
                    { title: "Madonna", value: "dm825/cn/makers/Madonna" },
                    { title: "S1", value: "dm825/cn/makers/S1" },
                    { title: "SOD", value: "dm825/cn/makers/SOD" },
                    { title: "IdeaPocket", value: "dm825/cn/makers/IdeaPocket" },
                    { title: "Attackers", value: "dm825/cn/makers/Attackers" },
                    { title: "Glory Quest", value: "dm825/cn/makers/Glory%20Quest" },
                    { title: "ビッグモーカル", value: "dm825/cn/makers/%E3%83%93%E3%83%83%E3%82%B0%E3%83%A2%E3%83%BC%E3%82%AB%E3%83%AB" },
                    { title: "NATURAL HIGH", value: "dm825/cn/makers/NATURAL%20HIGH" },
                    { title: "Wanz Factory", value: "dm825/cn/makers/Wanz%20Factory" },
                    { title: "Takara Visual", value: "dm825/cn/makers/Takara%20Visual" },
                    { title: "Fc2", value: "dm825/cn/makers/Fc2" },
                    { title: "Premium", value: "dm825/cn/makers/Premium" },
                    { title: "Fitch", value: "dm825/cn/makers/Fitch" },
                    { title: "VENUS", value: "dm825/cn/makers/VENUS" },
                    { title: "DEEP'S", value: "dm825/cn/makers/DEEP%27S" },
                    { title: "本中", value: "dm825/cn/makers/%E6%9C%AC%E4%B8%AD" },
                    { title: "Hunter", value: "dm825/cn/makers/Hunter" },
                    { title: "溜池ゴロー", value: "dm825/cn/makers/%E6%BA%9C%E6%B1%A0%E3%82%B4%E3%83%AD%E3%83%BC" },
                    { title: "TMA", value: "dm825/cn/makers/TMA" },
                    { title: "センタービレッジ", value: "dm825/cn/makers/%E3%82%BB%E3%83%B3%E3%82%BF%E3%83%BC%E3%83%93%E3%83%AC%E3%83%83%E3%82%B8" },
                    { title: "Das", value: "dm825/cn/makers/Das" },
                    { title: "Waap Entertainment", value: "dm825/cn/makers/Waap%20Entertainment" },
                    { title: "Crystal-Eizou", value: "dm825/cn/makers/Crystal-Eizou" },
                    { title: "kawaii", value: "dm825/cn/makers/kawaii" },
                    { title: "ゴーゴーズ", value: "dm825/cn/makers/%E3%82%B4%E3%83%BC%E3%82%B4%E3%83%BC%E3%82%BA" },
                    { title: "プラネットプラス", value: "dm825/cn/makers/%E3%83%97%E3%83%A9%E3%83%8D%E3%83%83%E3%83%88%E3%83%97%E3%83%A9%E3%82%B9" },
                    { title: "OPPAI", value: "dm825/cn/makers/OPPAI" },
                    { title: "STAR PARADISE", value: "dm825/cn/makers/STAR%20PARADISE" },
                    { title: "E-BODY", value: "dm825/cn/makers/E-BODY" },
                    { title: "セレブの友", value: "dm825/cn/makers/%E3%82%BB%E3%83%AC%E3%83%96%E3%81%AE%E5%8F%8B" },
                    { title: "ドグマ", value: "dm825/cn/makers/%E3%83%89%E3%82%B0%E3%83%9E" },
                    { title: "Alice Japan", value: "dm825/cn/makers/Alice%20Japan" },
                    { title: "KM Produce", value: "dm825/cn/makers/KM%20Produce" },
                    { title: "桃太郎映像出版", value: "dm825/cn/makers/%E6%A1%83%E5%A4%AA%E9%83%8E%E6%98%A0%E5%83%8F%E5%87%BA%E7%89%88" }
                ] },
                { name: "sort_by", title: "排序", type: "enumeration", value: "released_at", enumOptions: [
                    { title: "发行日期", value: "released_at" },
                    { title: "最近更新", value: "published_at" },
                    { title: "收藏数", value: "saved" },
                    { title: "今日浏览数", value: "today_views" },
                    { title: "本周浏览数", value: "weekly_views" },
                    { title: "本月浏览数", value: "monthly_views" },
                    { title: "总浏览数", value: "views" }
                ] }
            ]
        },
        {
            title: "🔍 搜索视频",
            functionName: "searchList",
            type: "video",
            params: [
                { name: "keyword", title: "关键词", type: "input", value: "" },
                { name: "page", title: "页码", type: "page" }
            ]
        },
        /* Temporarily disabled
        {
            id: "loadResource",
            title: "MissAV 播放源",
            description: "智能提取关联上下文番号并多路自动抓取 MissAV 正片链接供给播放",
            functionName: "loadResource",
            type: "stream",
            params: []
        }
        */
    ],
    search: {
        title: "🌐 全局搜索",
        functionName: "searchGlobal",
        params: [
            { name: "keyword", title: "关键词", type: "input", description: "搜索的关键词", value: "" },
            { name: "page", title: "页码", type: "page", value: "1" }
        ]
    }
};

const BASE_URL = "https://missav.ai";
const AVATAR_BASE_URL = "https://missav.ai";
const HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Referer": "https://missav.ai/",
    "Connection": "keep-alive"
};

const PEOPLE_AVATAR_CACHE = {};
const RECENT_UPDATES_CATEGORY = "recent_updates";
const RECENT_UPDATES_ENDPOINT = "dm539/cn/new";
const VIDEO_URL_CACHE = {};

// 亚洲AV/素人模块的番号前缀——这些资源没有标准番号，搜不到 JavTrailers 剧照和预告片
// 亚洲AV：麻豆传媒 (CUS)、TWAV、KBJ、中国直播/韩国直播 (CN)
// 素人：SIRO、LUXU、GANA、ARA、MIUM、S-CUTE
const ASIAN_AV_DVD_PREFIXES = new Set(["CUS", "TWAV", "KBJ", "CN", "SIRO", "LUXU", "GANA", "ARA", "MIUM", "S-CUTE"]);

function gs(k) { try { return Widget.storage.get(k) || ""; } catch (e) { return ""; } }
async function gl(w, u) {
    try {
        var r = await Widget.http.get(w + "/qualities/" + u, { headers: HEADERS });
        var d = typeof r.data == "string" ? JSON.parse(r.data) : r.data;
        if (d && d.length) return d;
    } catch (e) {}
    return null;
}

function getSortOptions() {
    return [
        { title: "发行日期", value: "released_at" },
        { title: "最近更新", value: "published_at" },
        { title: "收藏数", value: "saved" },
        { title: "今日浏览数", value: "today_views" },
        { title: "本周浏览数", value: "weekly_views" },
        { title: "本月浏览数", value: "monthly_views" },
        { title: "总浏览数", value: "views" }
    ];
}

function getPrimaryCategoryOptions() {
    return [
        { title: "中文字幕", value: "dm278/cn/chinese-subtitle" },
        { title: "日本AV", value: "dm632/cn/release" },
        { title: "素人", value: "amateur" },
        { title: "无码影片", value: "uncensored" },
        { title: "亚洲AV", value: "asia" },
        { title: "女优", value: "actress" },
        { title: "类型", value: "genre" },
        { title: "发行商", value: "maker" },
        { title: "🔍 搜索视频", value: "search" }
    ];
}

function getCategoryOptions() {
    return [
        { title: "SIRO", value: "dm36/cn/siro", group: "amateur" },
        { title: "LUXU", value: "dm34/cn/luxu", group: "amateur" },
        { title: "GANA", value: "dm32/cn/gana", group: "amateur" },
        { title: "PRESTIGE PREMIUM", value: "dm999/cn/maan", group: "amateur" },
        { title: "S-CUTE", value: "dm38/cn/scute", group: "amateur" },
        { title: "ARA", value: "dm34/cn/ara", group: "amateur" },
        { title: "无码流出", value: "dm816/cn/uncensored-leak", group: "uncensored" },
        { title: "FC2", value: "dm473/cn/fc2", group: "uncensored" },
        { title: "HEYZO", value: "dm1977446/cn/heyzo", group: "uncensored" },
        { title: "东京热", value: "dm42/cn/tokyohot", group: "uncensored" },
        { title: "一本道", value: "dm4364834/cn/1pondo", group: "uncensored" },
        { title: "Caribbeancom", value: "dm7414012/cn/caribbeancom", group: "uncensored" },
        { title: "Caribbeancompr", value: "dm83900/cn/caribbeancompr", group: "uncensored" },
        { title: "10musume", value: "dm6341956/cn/10musume", group: "uncensored" },
        { title: "pacopacomama", value: "dm2479243/cn/pacopacomama", group: "uncensored" },
        { title: "Gachinco", value: "dm150/cn/gachinco", group: "uncensored" },
        { title: "XXX-AV", value: "dm42/cn/xxxav", group: "uncensored" },
        { title: "人妻斬", value: "dm37/cn/marriedslash", group: "uncensored" },
        { title: "顽皮4610", value: "dm33/cn/naughty4610", group: "uncensored" },
        { title: "顽皮0930", value: "dm37/cn/naughty0930", group: "uncensored" },
        { title: "麻豆传媒", value: "dm63/cn/madou", group: "asia" },
        { title: "TWAV", value: "dm31/cn/twav", group: "asia" },
        { title: "Furuke", value: "dm15/cn/furuke", group: "asia" },
        { title: "韩国直播", value: "cn/klive", group: "asia" },
        { title: "中国直播", value: "cn/clive", group: "asia" },
        ...ACTRESS_ENDPOINTS.map((item) => ({ title: item.title, value: item.value, group: "actress" })),
        ...GENRES_ENDPOINTS.map((item) => ({ title: item.title, value: item.value, group: "genre" })),
        ...MAKERS_ENDPOINTS.map((item) => ({ title: item.title, value: item.value, group: "maker" }))
    ];
}

function filterCategoryOptions(group) {
    return getCategoryOptions().filter((item) => item.group === group).map(({ title, value }) => ({ title, value }));
}

function getDirectListEndpoints() { return ["dm278/cn/chinese-subtitle", "dm632/cn/release"]; }
function getSortableCategoryGroups() { return ["amateur", "uncensored", "asia", "actress", "genre", "maker"]; }

function normalizePeopleId(value) {
    if (!value) return "";
    let id = String(value).trim();
    id = id.replace(BASE_URL, "").replace(/^https?:\/\/[^/]+\//, "");
    id = id.replace(/^\/+/, "").split("?")[0].replace(/\/$/, "");
    return id;
}

function normalizeGenreId(value) {
    if (!value) return "";
    let id = String(value).trim();
    id = id.replace(BASE_URL, "").replace(/^https?:\/\/[^/]+\//, "");
    id = id.replace(/^\/+/, "").split("?")[0].replace(/\/$/, "");
    return id;
}

function normalizePeopleTitle(title) {
    return normalizePeopleKey(title);
}

function normalizeDetailLabel(label) {
    return (label || "").replace(/\s+/g, "").replace(/：/g, ":").toLowerCase();
}

function isActressLabel(label) {
    return ["女优:", "女優:", "actress:", "actresses:"].includes(label);
}

function isGenreLabel(label) {
    return ["类型:", "類型:", "分类:", "分類:", "genre:", "genres:", "category:", "categories:"].includes(label);
}

function getImageFromElement($, $el) {
    return $el.find("img").attr("data-src") ||
        $el.find("img").attr("src") ||
        "";
}

function isInvalidAvatarUrl(url) {
    if (!url) return true;
    return /fourhoi\.com\/[^/]+\/(cover|preview|thumbnail)[^/]*\.(jpg|jpeg|png|webp)(?:\?.*)?$/i.test(url);
}

function pickFirstAvatar($) {
    const ogImg = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content');
    if (ogImg && !ogImg.includes("logo") && !ogImg.includes("square") && !ogImg.includes("cover")) return ogImg;
    const selector = ".avatar img, [class*='avatar'] img, .rounded-full img, img[alt*='女优'], img[alt*='女優'], img[alt*='Actress'], img[alt*='actress']";
    const $img = $(selector).first();
    return $img.attr("data-src") || $img.attr("src") || "";
}

function resolveAvatarImageUrl(path) {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${AVATAR_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function resolveAvatarPageUrl(peopleId) {
    if (!peopleId) return "";
    const normalized = normalizePeopleId(peopleId);
    if (!normalized || !normalized.includes("/actresses/")) return "";
    return `${AVATAR_BASE_URL}/${normalized}`;
}

function normalizePeopleKey(value) {
    return (value || "").replace(/\s+/g, "").replace(/[·•・]/g, "").toLowerCase();
}

function normalizeDisplayTitle(value) {
    return (value || "").replace(/\s+/g, " ").trim();
}

function buildPeopleItem(name, avatar, href) {
    const title = normalizeDisplayTitle(name);
    if (!title) return null;
    const peopleId = normalizePeopleId(href) || `cn/actresses/${encodeURIComponent(title)}`;
    return {
        id: peopleId,
        title,
        avatar: resolveUrl(avatar || ""),
        role: "主演"
    };
}

function buildGenreItem(name, href) {
    const title = normalizeDisplayTitle(name);
    const genreId = normalizeGenreId(href);
    if (!title || !genreId || !genreId.includes("/genres/")) return null;
    return { id: genreId, title };
}

function isRecentUpdatesCategory(primaryCategory) {
    return primaryCategory === RECENT_UPDATES_CATEGORY || primaryCategory === RECENT_UPDATES_ENDPOINT;
}

function resolveEndpointByPrimaryCategory(primaryCategory, endpoint) {
    if (isRecentUpdatesCategory(primaryCategory)) return RECENT_UPDATES_ENDPOINT;
    if (getDirectListEndpoints().includes(primaryCategory)) return primaryCategory;
    if (primaryCategory && ["amateur", "uncensored", "asia", "actress", "genre", "maker"].includes(primaryCategory)) {
        const matched = getCategoryOptions().find((item) => item.group === primaryCategory);
        return matched ? matched.value : (endpoint || primaryCategory || "dm632/cn/release");
    }
    return endpoint || primaryCategory || "dm632/cn/release";
}

function buildPeopleContext(id, title, avatar = "") {
    if (!id) return null;
    return { id, title, avatar: resolveUrl(avatar || ""), role: "主演" };
}

function buildGenreContext(id, title) {
    if (!id) return null;
    return { id, title };
}

async function resolvePeopleAvatar(peopleId) {
    if (!peopleId || !peopleId.includes("/actresses/")) return "";
    if (Object.prototype.hasOwnProperty.call(PEOPLE_AVATAR_CACHE, peopleId)) return PEOPLE_AVATAR_CACHE[peopleId];

    try {
        const avatarPageUrl = resolveAvatarPageUrl(peopleId);
        if (!avatarPageUrl) return "";
        const res = await Widget.http.get(avatarPageUrl, { headers: HEADERS });
        if (!res.data || res.data.includes("Just a moment")) return "";
        const $ = Widget.html.load(res.data);
        const avatar = pickFirstAvatar($);
        if (!avatar || isInvalidAvatarUrl(avatar)) {
            PEOPLE_AVATAR_CACHE[peopleId] = "";
            return "";
        }
        PEOPLE_AVATAR_CACHE[peopleId] = resolveAvatarImageUrl(avatar);
        return PEOPLE_AVATAR_CACHE[peopleId];
    } catch (e) {
        return "";
    }
}

const ACTRESS_ENDPOINTS = [
    { title: "瀬户环奈", value: "dm179/cn/actresses/%E7%80%AC%E6%88%B8%E7%92%B0%E5%A5%88" },
    { title: "逢泽みゆ", value: "dm179/cn/actresses/%E9%80%A2%E6%B2%A2%E3%81%BF%E3%82%86" },
    { title: "河北彩花", value: "dm179/cn/actresses/%E6%B2%B3%E5%8C%97%E5%BD%A9%E8%8A%B1" },
    { title: "松本一香", value: "dm179/cn/actresses/%E6%9D%BE%E6%9C%AC%E4%B8%80%E9%A6%99" },
    { title: "美园和花", value: "dm179/cn/actresses/%E7%BE%8E%E5%9B%AD%E5%92%8C%E8%8A%B1" },
    { title: "北冈果林", value: "dm179/cn/actresses/%E5%8C%97%E5%B2%A1%E6%9E%9C%E6%9E%97" },
    { title: "柏木こなつ", value: "dm179/cn/actresses/%E6%9F%8F%E6%9C%A8%E3%81%93%E3%81%AA%E3%81%A4" },
    { title: "浅野こころ", value: "dm179/cn/actresses/%E6%B5%85%E9%87%8E%E3%81%93%E3%81%93%E3%82%8D" },
    { title: "北野未奈", value: "dm179/cn/actresses/%E5%8C%97%E9%87%8E%E6%9C%AA%E5%A5%88" },
    { title: "清原みゆう", value: "dm179/cn/actresses/%E6%B8%85%E5%8E%9F%E3%81%BF%E3%82%86%E3%81%86" },
    { title: "沙月惠奈", value: "dm179/cn/actresses/%E6%B2%99%E6%9C%88%E6%83%A0%E5%A5%88" },
    { title: "miru", value: "dm179/cn/actresses/miru" },
    { title: "七森莉莉", value: "dm179/cn/actresses/%E4%B8%83%E6%A3%AE%E8%8E%89%E8%8E%89" },
    { title: "七濑爱丽丝", value: "dm179/cn/actresses/%E4%B8%83%E6%BF%91%E7%88%B1%E4%B8%BD%E4%B8%9D" },
    { title: "鹫尾芽衣", value: "dm179/cn/actresses/%E9%B9%AB%E5%B0%BE%E8%8A%BD%E8%A1%A3" },
    { title: "博多彩叶", value: "dm179/cn/actresses/%E5%8D%9A%E5%A4%9A%E5%BD%A9%E5%8F%B6" },
    { title: "石川澪", value: "dm179/cn/actresses/%E7%9F%B3%E5%B7%9D%E6%BE%AA" },
    { title: "白上咲花", value: "dm179/cn/actresses/%E7%99%BD%E4%B8%8A%E5%92%B2%E8%8A%B1" },
    { title: "田野忧", value: "dm179/cn/actresses/%E7%94%B0%E9%87%8E%E5%BF%A7" },
    { title: "未步なな", value: "dm179/cn/actresses/%E6%9C%AA%E6%AD%A5%E3%81%AA%E3%81%AA" },
    { title: "村上悠华", value: "dm179/cn/actresses/%E6%9D%91%E4%B8%8A%E6%82%A0%E5%8D%8E" },
    { title: "三田真铃", value: "dm179/cn/actresses/%E4%B8%89%E7%94%B0%E7%9C%9F%E9%93%83" },
    { title: "八挂うみ", value: "dm179/cn/actresses/%E5%85%AB%E6%8E%9B%E3%81%86%E3%81%BF" },
    { title: "初美なのか", value: "dm179/cn/actresses/%E5%88%9D%E7%BE%8E%E3%81%AA%E3%81%AE%E3%81%8B" },
    { title: "宫下玲奈", value: "dm179/cn/actresses/%E5%AE%AE%E4%B8%8B%E7%8E%B2%E5%A5%88" },
    { title: "新有菜", value: "dm58/actresses/%E6%A9%8B%E6%9C%AC%E6%9C%89%E8%8F%9C%20%28%E6%96%B0%E6%9C%89%E8%8F%9C%29" },
    { title: "新木希空", value: "dm179/cn/actresses/%E6%96%B0%E6%9C%A8%E5%B8%8C%E7%A9%BA" },
    { title: "明里つむぎ", value: "dm179/cn/actresses/%E6%98%8E%E9%87%8C%E3%81%A4%E3%82%80%E3%81%8E" },
    { title: "小野六花", value: "dm179/cn/actresses/%E5%B0%8F%E9%87%8E%E5%85%AD%E8%8A%B1" },
    { title: "宇都宫紫苑", value: "dm179/cn/actresses/%E5%AE%87%E9%83%BD%E5%AE%AE%E7%B4%AB%E8%8B%91" },
    { title: "小宵こなん", value: "dm179/cn/actresses/%E5%B0%8F%E5%AE%B5%E3%81%93%E3%81%AA%E3%82%93" },
    { title: "本庄鈴", value: "dm179/cn/actresses/%E6%9C%AC%E5%BA%84%E9%88%B4" },
    { title: "桃乃木かな", value: "dm179/cn/actresses/%E6%A1%83%E4%B9%83%E6%9C%A8%E3%81%8B%E3%81%AA" },
    { title: "桜空もも", value: "dm179/cn/actresses/%E6%A1%9C%E7%A9%BA%E3%82%82%E3%82%82" },
    { title: "楓ふうあ", value: "dm179/cn/actresses/%E6%A1%AB%E3%81%B5%E3%81%86%E3%81%82" },
    { title: "楓カレン", value: "dm179/cn/actresses/%E6%A5%93%E3%82%AB%E3%83%AC%E3%83%B3" },
    { title: "涼森れむ", value: "dm179/cn/actresses/%E6%B6%BC%E6%A3%AE%E3%82%8C%E3%82%80" },
    { title: "瀧本雫葉", value: "dm179/cn/actresses/%E7%80%A7%E6%9C%AC%E9%9B%AB%E8%91%89" },
    { title: "田中レモン", value: "dm179/cn/actresses/%E7%94%B0%E4%B8%AD%E3%83%AC%E3%83%A2%E3%83%B3" },
    { title: "相沢みなみ", value: "dm179/cn/actresses/%E7%9B%B8%E6%B2%A2%E3%81%BF%E3%81%AA%E3%81%BF" },
    { title: "神木麗", value: "dm179/cn/actresses/%E7%A5%9E%E6%9C%A8%E9%BA%97" },
    { title: "美ノ嶋めぐり", value: "dm179/cn/actresses/%E7%BE%8E%E3%83%8E%E5%B6%8B%E3%82%81%E3%81%90%E3%82%8A" },
    { title: "野々浦暖", value: "dm179/cn/actresses/%E9%87%8E%E3%80%85%E6%B5%A6%E6%9A%96" },
    { title: "青空ひかり", value: "dm179/cn/actresses/%E9%9D%92%E7%A9%BA%E3%81%B2%E3%81%8B%E3%82%8A" },
    { title: "三上悠亚", value: "dm179/cn/actresses/%E4%B8%89%E4%B8%8A%E6%82%A0%E4%BA%9A" },
    { title: "榊原萌", value: "dm179/cn/actresses/%E6%A6%8A%E5%8E%9F%E8%90%8C" },
    { title: "彩月七绪", value: "dm179/cn/actresses/%E5%BD%A9%E6%9C%88%E4%B8%83%E7%BB%AA" },
    { title: "神宫寺奈绪", value: "dm179/cn/actresses/%E7%A5%9E%E5%AE%AB%E5%AF%BA%E5%A5%88%E7%BB%AA" },
    { title: "有村のぞみ", value: "dm179/cn/actresses/%E6%9C%89%E6%9D%91%E3%81%AE%E3%81%9E%E3%81%BF" }
];

const GENRES_ENDPOINTS = [
    { title: "高清", value: "dm96/cn/genres/%E9%AB%98%E6%B8%85" },
    { title: "独家", value: "dm139/cn/genres/%E7%8B%AC%E5%AE%B6" },
    { title: "中出", value: "dm130/cn/genres/%E4%B8%AD%E5%87%BA" },
    { title: "单体作品", value: "dm122/cn/genres/%E5%8D%95%E4%BD%93%E4%BD%9C%E5%93%81" },
    { title: "巨乳", value: "dm120/cn/genres/%E5%B7%A8%E4%B9%B3" },
    { title: "人妻", value: "dm77/cn/genres/%E4%BA%BA%E5%A6%BB" },
    { title: "熟女", value: "dm118/cn/genres/%E7%86%9F%E5%A5%B3" },
    { title: "素人", value: "dm123/cn/genres/%E7%B4%A0%E4%BA%BA" },
    { title: "美少女", value: "dm437/cn/genres/%E7%BE%8E%E5%B0%91%E5%A5%B3" },
    { title: "口交", value: "dm1301/cn/genres/%E5%8F%A3%E4%BA%A4" },
    { title: "多人运动", value: "dm321/cn/genres/%E5%A4%9A%E4%BA%BA%E8%BF%90%E5%8A%A8" },
    { title: "薄格", value: "dm76/cn/genres/%E8%96%84%E6%A0%BC" },
    { title: "骑乘", value: "dm486/cn/genres/%E9%AA%91%E4%B9%98" },
    { title: "痴女", value: "dm313/cn/genres/%E7%97%B4%E5%A5%B3" },
    { title: "4小时以上", value: "dm738/cn/genres/4%E5%B0%8F%E6%97%B6%E4%BB%A5%E4%B8%8A" },
    { title: "女高中生", value: "dm4448/cn/genres/%E5%A5%B3%E9%AB%98%E4%B8%AD%E7%94%9F" },
    { title: "潮吹", value: "dm161/cn/genres/%E6%BD%AE%E5%90%B9" },
    { title: "苗条", value: "dm757/cn/genres/%E8%8B%97%E6%9D%A1" },
    { title: "自拍", value: "dm978/cn/genres/%E8%87%AA%E6%8B%8D" },
    { title: "合集", value: "dm784/cn/genres/%E5%90%88%E9%9B%86" },
    { title: "乳交", value: "dm594/cn/genres/%E4%B9%B3%E4%BA%A4" },
    { title: "恋物癖", value: "dm117/cn/genres/%E6%81%8B%E7%89%A9%E7%99%96" },
    { title: "美乳", value: "dm215/cn/genres/%E7%BE%8E%E4%B9%B3" },
    { title: "NTR", value: "dm736/cn/genres/NTR" },
    { title: "企划", value: "dm341/cn/genres/%E4%BC%81%E5%88%92" },
    { title: "乱伦", value: "dm56/cn/genres/%E4%B9%B1%E4%BC%A6" },
    { title: "搭讪", value: "dm292/cn/genres/%E6%90%AD%E8%AE%AA" },
    { title: "颜射", value: "dm319/cn/genres/%E9%A2%9C%E5%B0%84" },
    { title: "淫乱", value: "dm903/cn/genres/%E6%B7%AB%E4%B9%B1" },
    { title: "偷拍", value: "dm516/cn/genres/%E5%81%B7%E6%8B%8D" },
    { title: "剧情", value: "dm98/cn/genres/%E5%89%A7%E6%83%85" },
    { title: "自慰", value: "dm7606/cn/genres/%E8%87%AA%E6%85%B0" },
    { title: "4K", value: "dm55/cn/genres/4K" },
    { title: "手淫", value: "dm94/cn/genres/%E6%89%8B%E6%B7%AB" },
    { title: "姐姐", value: "dm793/cn/genres/%E5%A7%90%E5%A7%90" },
    { title: "羞辱", value: "dm161/cn/genres/%E7%BE%9E%E8%BE%B1" }
];

const MAKERS_ENDPOINTS = [
    { title: "Moody's", value: "dm825/cn/makers/Moody%27s" },
    { title: "Prestige", value: "dm825/cn/makers/Prestige" },
    { title: "Madonna", value: "dm825/cn/makers/Madonna" },
    { title: "S1", value: "dm825/cn/makers/S1" },
    { title: "SOD", value: "dm825/cn/makers/SOD" },
    { title: "IdeaPocket", value: "dm825/cn/makers/IdeaPocket" },
    { title: "Attackers", value: "dm825/cn/makers/Attackers" },
    { title: "Glory Quest", value: "dm825/cn/makers/Glory%20Quest" },
    { title: "ビッグモーカル", value: "dm825/cn/makers/%E3%83%93%E3%83%83%E3%82%B0%E3%83%A2%E3%83%BC%E3%82%AB%E3%83%AB" },
    { title: "NATURAL HIGH", value: "dm825/cn/makers/NATURAL%20HIGH" },
    { title: "Wanz Factory", value: "dm825/cn/makers/Wanz%20Factory" },
    { title: "Takara Visual", value: "dm825/cn/makers/Takara%20Visual" },
    { title: "Fc2", value: "dm825/cn/makers/Fc2" },
    { title: "Premium", value: "dm825/cn/makers/Premium" },
    { title: "Fitch", value: "dm825/cn/makers/Fitch" },
    { title: "VENUS", value: "dm825/cn/makers/VENUS" },
    { title: "DEEP'S", value: "dm825/cn/makers/DEEP%27S" },
    { title: "本中", value: "dm825/cn/makers/%E6%9C%AC%E4%B8%AD" },
    { title: "Hunter", value: "dm825/cn/makers/Hunter" },
    { title: "溜池ゴロー", value: "dm825/cn/makers/%E6%BA%9C%E6%B1%A0%E3%82%B4%E3%83%AD%E3%83%BC" },
    { title: "TMA", value: "dm825/cn/makers/TMA" },
    { title: "センタービレッジ", value: "dm825/cn/makers/%E3%82%BB%E3%83%B3%E3%82%BF%E3%83%BC%E3%83%93%E3%83%AC%E3%83%83%E3%82%B8" },
    { title: "Das", value: "dm825/cn/makers/Das" },
    { title: "Waap Entertainment", value: "dm825/cn/makers/Waap%20Entertainment" },
    { title: "Crystal-Eizou", value: "dm825/cn/makers/Crystal-Eizou" },
    { title: "kawaii", value: "dm825/cn/makers/kawaii" },
    { title: "ゴーゴーズ", value: "dm825/cn/makers/%E3%82%B4%E3%83%BC%E3%82%B4%E3%83%BC%E3%82%BA" },
    { title: "プラネットプラス", value: "dm825/cn/makers/%E3%83%97%E3%83%A9%E3%83%8D%E3%83%83%E3%83%88%E3%83%97%E3%83%A9%E3%82%B9" },
    { title: "OPPAI", value: "dm825/cn/makers/OPPAI" },
    { title: "STAR PARADISE", value: "dm825/cn/makers/STAR%20PARADISE" },
    { title: "E-BODY", value: "dm825/cn/makers/E-BODY" },
    { title: "セレブの友", value: "dm825/cn/makers/%E3%82%BB%E3%83%AC%E3%83%96%E3%81%AE%E5%8F%8B" },
    { title: "ドグマ", value: "dm825/cn/makers/%E3%83%89%E3%82%B0%E3%83%9E" },
    { title: "Alice Japan", value: "dm825/cn/makers/Alice%20Japan" },
    { title: "KM Produce", value: "dm825/cn/makers/KM%20Produce" },
    { title: "桃太郎映像出版", value: "dm825/cn/makers/%E6%A1%83%E5%A4%AA%E9%83%8E%E6%98%A0%E5%83%8F%E5%87%BA%E7%89%88" }
];

const GENRES_STATIC = GENRES_ENDPOINTS;
const MAKERS_STATIC = MAKERS_ENDPOINTS;

function buildListUrl(endpoint, page = 1, filters = "", sort_by = "") {
    const params = [];
    if (filters) params.push(`filters=${encodeURIComponent(filters)}`);
    if (sort_by) params.push(`sort=${encodeURIComponent(sort_by)}`);
    if (page > 1) params.push(`page=${page}`);
    return `${BASE_URL}/${endpoint}${params.length ? `?${params.join("&")}` : ""}`;
}

function unpackPacker(html) {
    if (!html) return "";
    let unpackedResults = [];
    const packerRegex = /eval\s*\(\s*function\s*\(\s*p\s*,\s*a\s*,\s*c\s*,\s*k\s*,\s*e\s*,\s*d\s*\)[\s\S]+?\}\s*\(\s*'([\s\S]+?)'\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*'([\s\S]+?)'[\s\S]+?\)/g;

    let match;
    while ((match = packerRegex.exec(html)) !== null) {
        try {
            let p = match[1].replace(/\\'/g, "'");
            let a = parseInt(match[2], 10);
            let c = parseInt(match[3], 10);
            let k = match[4].split('|');

            let cIdx = c;
            while (cIdx > 0) {
                cIdx--;
                if (k[cIdx]) {
                    let w = cIdx.toString(36);
                    let reg = new RegExp('\\b' + w + '\\b', 'g');
                    p = p.replace(reg, k[cIdx]);
                }
            }
            unpackedResults.push(p);
        } catch (err) {}
    }
    return unpackedResults.join('\n');
}

function getText(value) { return String(value || "").trim(); }

function extractSearchCode(text, options = {}) {
    const allowPureNumeric = options.allowPureNumeric !== false;
    const s = getText(text).toUpperCase();
    if (!s) return "";
    const normalized = s.replace(/\./g, " ").replace(/_/g, "-").replace(/\s+/g, " ").trim();
    const patterns = [
        /\bFC2(简介)?(?:[- ]?PPV)?[- ]?\d{5,8}\b/,
        /\bCARIB[- ]?\d{6,8}\b/,
        /\b1PONDO[- ]?\d{6,8}\b/,
        /\bHEYZO[- ]?\d{3,6}\b/,
        /\bT28[- ]?\d{6,8}\b/,
        /\b(?:S2M|MIAA|SSNI|SNIS|IPX|IPZZ|SSIS|JUQ|MIDE|MIDV|STARS|ABW|RKI|DVAJ|WANZ|LULU|DLDSS|VRTM|SDMU|SDDE|MKMP|HMN|MUDR|ADN|CAWD|PPPE|PRED|MGR|SHKD|MXGS|FSDSS|JUL|KTB|MIAB|GVH|MIMK|JUY|JUTA|IDBD|HND|DASD|CLO|BF|HONB|ROE|CEMD|MIUM|NITR|RCTD|RCT|IPVR|MIBD|JUR|JURD|SOE|ORE|PYO|START|NSFS)\s*[-_ ]?\d{2,6}[A-Z]?(?:[-_ ]?[A-Z]{0,4})?\b/,
        /\b[A-Z]{2,10}\s*[-_ ]?\d{2,8}[A-Z]?\b/
    ];
    if (allowPureNumeric) patterns.push(/\b\d{6,8}\b/);
    for (const reg of patterns) {
        const match = normalized.match(reg);
        if (match?.[0]) return match[0].replace(/\s+/g, "").replace(/_/g, "-").replace(/-+/g, "-").toUpperCase();
    }
    return "";
}

function collectStringValues(value, depth = 0, out = [], visited = new Set()) {
    if (value === null || value === undefined || depth > 5) return out;
    const valueType = typeof value;
    if (valueType === "string" || valueType === "number") {
        const text = String(value).trim();
        if (text) out.push(text);
        return out;
    }
    if (valueType !== "object" || visited.has(value)) return out;
    visited.add(value);
    if (Array.isArray(value)) {
        for (const item of value) collectStringValues(item, depth + 1, out, visited);
        return out;
    }
    for (const key of Object.keys(value)) collectStringValues(value[key], depth + 1, out, visited);
    return out;
}

function extractCodeFromParams(params = {}) {
    // 第一层：优先扫描最可能含有番号的字段。
    // 这些字段包括常见视频源字段，以及可能的 Emby / 本地媒体字段。
    const priorityCandidates = [
        params.code,
        params.videoId,
        params.number,

        // Emby / 本地媒体可能字段
        params.fileName,
        params.filename,
        params.file_name,
        params.name,
        params.path,
        params.filePath,
        params.file_path,
        params.mediaPath,
        params.media_path,
        params.itemPath,
        params.item_path,
        params.localPath,
        params.local_path,
        params.originalFilename,
        params.originalFileName,

        // 常规媒体字段
        params.id,
        params.title,
        params.seriesName,
        params.originalTitle,
        params.originalName,
        params.episodeName,
        params.description,
        params.genreTitle,
        params.overview,
        params.link,
        params.url,
        params.videoUrl,
        params.playUrl,
        params.streamUrl
    ];

    // 常见嵌套对象字段
    if (params.tmdbInfo) {
        priorityCandidates.push(
            params.tmdbInfo.title,
            params.tmdbInfo.name,
            params.tmdbInfo.originalTitle,
            params.tmdbInfo.originalName,
            params.tmdbInfo.overview
        );
    }

    if (params.info) {
        priorityCandidates.push(
            params.info.title,
            params.info.name,
            params.info.originalTitle,
            params.info.originalName,
            params.info.overview
        );
    }

    if (params.mediaSource) {
        priorityCandidates.push(
            params.mediaSource.name,
            params.mediaSource.fileName,
            params.mediaSource.filename,
            params.mediaSource.path,
            params.mediaSource.url,
            params.mediaSource.streamUrl
        );
    }

    if (Array.isArray(params.mediaSources)) {
        for (const source of params.mediaSources) {
            priorityCandidates.push(
                source?.name,
                source?.fileName,
                source?.filename,
                source?.path,
                source?.url,
                source?.streamUrl
            );
        }
    }

    // 第一轮：优先字段允许纯数字番号。
    for (const value of priorityCandidates) {
        const code = extractSearchCode(value, { allowPureNumeric: true });
        if (code) return code;
    }

    // 第二轮：递归扫描所有字符串。
    // 这里不允许纯数字，避免误把日期 / ID / 时间戳识别为番号。
    const allStrings = collectStringValues(params);

    for (const value of allStrings) {
        const code = extractSearchCode(value, { allowPureNumeric: false });
        if (code) return code;
    }

    return "";
}

// ==================== MissAV 多类型搜索（移植自 Missav_stream_v1.2） ====================
// 一个番号可能在 MissAV 上有：有码 / 中文 / 无码 三种详情页。
// 以下函数负责精确匹配所有类型的详情页并提取 surrit UUID。

function extractCodeFromMissAVLink(link) {
    const href = getText(link);
    if (!href) return "";
    const lastPart = href.split("?")[0].split("#")[0].split("/").filter(Boolean).pop() || "";
    const cleaned = decodeURIComponent(lastPart)
        .replace(/-uncensored-leak/gi, "")
        .replace(/-chinese-subtitle/gi, "")
        .replace(/-/g, " ");
    return extractSearchCode(cleaned, { allowPureNumeric: true });
}

function classifyMissavLink(link) {
    const href = getText(link).toLowerCase();
    if (href.includes("-uncensored-leak")) return "破解无码";
    if (href.includes("-chinese-subtitle")) return "中文";
    return "有码";
}

function getVersionTag(link) {
    if (!link) return "";
    if (link.includes("-uncensored-leak")) return "[无码流出] ";
    if (link.includes("-chinese-subtitle")) return "[中文字幕] ";
    return "";
}

function parseSearchResults(html, targetCode) {
    if (!html || html.includes("Just a moment")) {
        console.warn("[MissAV] 可能被 Cloudflare 拦截，搜索页返回异常");
        return [];
    }

    const $ = Widget.html.load(html);
    const results = [];
    const seen = new Set();

    $("div.group").each((i, el) => {
        const $el = $(el);
        const $link = $el.find("a.text-secondary").first();
        const href = $link.attr("href");
        if (!href) return;

        const link = resolveUrl(href);
        if (!link || seen.has(link)) return;
        seen.add(link);

        const title = getVersionTag(link) + $link.text().trim();
        const codeFromLink = extractCodeFromMissAVLink(link);
        const codeFromTitle = extractSearchCode(title, { allowPureNumeric: true });
        const code = codeFromLink || codeFromTitle;

        results.push({ title, link, code });
    });

    // fallback：如果 div.group 结构失效，遍历所有链接
    if (results.length === 0) {
        $("a[href]").each((i, el) => {
            const $el = $(el);
            const href = $el.attr("href");
            if (!href) return;
            const link = resolveUrl(href);
            if (!link.includes("/cn/")) return;
            if (seen.has(link)) return;
            const codeFromLink = extractCodeFromMissAVLink(link);
            if (!codeFromLink) return;
            seen.add(link);
            results.push({ title: getVersionTag(link) + $el.text().trim(), link, code: codeFromLink });
        });
    }

    const targetLoose = normalizeCode(targetCode);
    const exact = results.filter(item => normalizeCode(item.code) === targetLoose);
    if (exact.length > 0) return exact;
    return results;
}

function normalizeCode(value) {
    return getText(value).toUpperCase().replace(/[\s_\-]+/g, "");
}

async function findAllMissAVDetailPages(code) {
    const searchKeys = [code, code.replace(/-/g, "")].filter(Boolean);
    const targetLoose = normalizeCode(code);
    const seen = new Set();
    const pages = [];

    for (const key of [...new Set(searchKeys)]) {
        const url = `${BASE_URL}/cn/search/${encodeURIComponent(key)}`;
        try {
            const res = await Widget.http.get(url, { headers: HEADERS });
            const html = res.data || "";
            const results = parseSearchResults(html, code);
            if (!results.length) continue;

            const exactMatches = results.filter(item => normalizeCode(item.code) === targetLoose);
            for (const item of exactMatches) {
                if (seen.has(item.link)) continue;
                seen.add(item.link);
                pages.push({ link: item.link, code, type: classifyMissavLink(item.link) });
            }
        } catch (e) {
            console.warn(`[MissAV] 搜索失败：${key}`, e?.message || e);
        }
    }

    return pages;
}

async function buildMissavStreamItems(uuid, code, detailLink, type = "有码") {
    const items = [];
    const headers = {
        "Referer": "https://missav.ai/",
        "User-Agent": HEADERS["User-Agent"],
        "Origin": "https://missav.ai"
    };

    try {
        const resp = await Widget.http.get(`https://surrit.com/${uuid}/1080p/video.m3u8`, {
            headers, timeout: 1500
        });
        if (resp && resp.statusCode === 200 && String(resp.data || "").includes("#EXTM3U")) {
            items.push({
                name: `MissAV ${type} 1080P`,
                description: `番号：${code}\n类型：${type}\n来源：MissAV\n清晰度：1080P`,
                url: `https://surrit.com/${uuid}/1080p/video.m3u8`,
                customHeaders: headers
            });
        }
    } catch (e) {}

    items.push({
        name: `MissAV ${type} 720P`,
        description: `番号：${code}\n类型：${type}\n来源：MissAV\n清晰度：720P`,
        url: `https://surrit.com/${uuid}/720p/video.m3u8`,
        customHeaders: headers
    });

    return items;
}


const JAVTRAILERS_URL_CACHE = {};
const JAVTRAILERS_URL_PROMISE_CACHE = {};
const JAVTRAILERS_FETCH_TIMEOUT_MS = 1200;
const JAVTRAILERS_MGSTAGE_PREFIXES = new Set(["ABF", "ABW", "JUFE", "MAAN", "PPT", "SIRO", "LUXU", "GANA", "ABP", "CHN"]);

const JAVP_TRAILER_API_BASE = "https://javp.cc.cd/trailers/";
const JAVP_TRAILER_CACHE = {};
const JAVP_TRAILER_PROMISE_CACHE = {};
const JAVP_FETCH_TIMEOUT_MS = 1800;
const JAVP_HEAD_TIMEOUT_MS = 1200;
const JAVP_QUALITY_OPTIONS = [
    { quality: "4k", label: "4K" },
    { quality: "hhb", label: "1080P" },
    { quality: "hmb", label: "720P" },
    { quality: "mhb", label: "576P" },
    { quality: "mmb", label: "432P" }
];

function parseJavCodeParts(title) {
    const raw = String(title || "").toUpperCase();
    const match = raw.match(/\b([A-Z0-9]+)-?(\d{2,5})([A-Z]?)\b/);
    if (!match) return null;
    const prefix = match[1];
    const prefixLower = prefix.toLowerCase();
    const suffix = match[3] || "";
    const number5 = match[2].padStart(5, "0");
    const numericContentPrefixMap = {
        WSA: "2",
        // FALENO 厂牌系列：Content ID 带数字前缀 1
        FSDSS: "1", FCDSS: "1", FNS: "1", FTHTD: "1",
        FALENO: "1", FGAN: "1", FSNF: "1", FLAV: "1",
        // MGStage/Prestige 系：Content ID 带数字前缀 118
        ABP: "118", CHN: "118",
        // SOD Create 系：Content ID 带数字前缀 1
        STARS: "1", STAR: "1", START: "1",
        // SOD Create 其他系列
        SODS: "1",
        // REbecca 系：Content ID 带前缀 h_346
        REBD: "h_346", REBDB: "h_346", GSHRB: "h_346"
    };
    const numericContentPrefix = numericContentPrefixMap[prefix] || "";
    return {
        prefix,
        prefixLower,
        number: match[2],
        number3: match[2].padStart(3, "0"),
        number5,
        suffix,
        code: `${numericContentPrefix}${prefixLower}${number5}`,
        plainCode: `${prefixLower}${number5}`
    };
}

function buildJavTrailersFallbackUrl(title) {
    const parts = parseJavCodeParts(title);
    if (!parts) return "";
    const first = parts.code[0];
    const folder = parts.code.slice(0, 3);
    return `https://media.javtrailers.com/hlsvideo/freepv/${first}/${folder}/${parts.code}/playlist.m3u8`;
}

function isJavTrailersMgstageTitle(title) {
    const parts = parseJavCodeParts(title);
    return !!parts && JAVTRAILERS_MGSTAGE_PREFIXES.has(parts.prefix);
}

function shouldFetchJavTrailersPage(title) {
    const parts = parseJavCodeParts(title);
    if (!parts) return false;
    return isJavTrailersMgstageTitle(title) || parts.prefix.includes("VR");
}

function buildJavTrailersPageIds(title) {
    const parts = parseJavCodeParts(title);
    if (!parts) return [];

    const ids = [];
    if (JAVTRAILERS_MGSTAGE_PREFIXES.has(parts.prefix)) {
        ids.push(`118${parts.prefixLower}${parts.number5}`);
    }
    ids.push(parts.code);

    return ids.filter((id, index, arr) => id && arr.indexOf(id) === index);
}

function extractJavTrailersMediaUrl(html) {
    if (!html || html.includes("Just a moment")) return "";
    const source = String(html);
    const mediaMatches = source.match(/https:\/\/media\.javtrailers\.com\/[^"'\\\s<]+?(?:\.m3u8|\.mp4)/g);
    if (mediaMatches && mediaMatches.length > 0) return mediaMatches[0];
    const mgstageMatches = source.match(/https:\/\/sample\.mgstage\.com\/[^"'\\\s<]+?\.mp4/g);
    if (mgstageMatches && mgstageMatches.length > 0) return mgstageMatches[0];
    const dmmMatches = source.match(/https:\/\/cc3001\.dmm\.co\.jp\/[^"'\\\s<]+?(?:\.m3u8|\.mp4)/g);
    return dmmMatches && dmmMatches.length > 0 ? dmmMatches[0] : "";
}

function fetchJavTrailersPageUrl(pageId) {
    return Widget.http.get(`https://javtrailers.com/video/${pageId}`, { headers: HEADERS })
        .then((res) => extractJavTrailersMediaUrl(res.data))
        .catch(() => "");
}

function normalizeTrailerCode(value) {
    const code = extractSearchCode(value) || extractVideoId(value) || "";
    return String(code || "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
}

function getJavpQualityLabel(quality) {
    const item = JAVP_QUALITY_OPTIONS.find((q) => q.quality === quality);
    return item ? item.label : quality;
}

async function isPlayableTrailerUrl(url) {
    if (!url) return false;
    try {
        const res = await Widget.http.head(url, {
            headers: {
                "User-Agent": HEADERS["User-Agent"],
                "Accept": "video/mp4,application/vnd.apple.mpegurl,application/x-mpegURL,*/*;q=0.8",
                "Referer": "https://javp.cc/"
            },
            timeout: JAVP_HEAD_TIMEOUT_MS
        });
        return !!res && res.statusCode >= 200 && res.statusCode < 400;
    } catch (e) {
        return false;
    }
}

function buildJavpQualityCandidates(trailerUrl) {
    const raw = String(trailerUrl || "").trim();
    const matched = raw.match(/^(.*?)(4k|hhb|hmb|mhb|mmb)\.mp4(?:[?#].*)?$/i);
    if (!matched) return [];
    const prefix = matched[1];
    return JAVP_QUALITY_OPTIONS.map((item) => ({
        quality: item.quality,
        label: item.label,
        url: `${prefix}${item.quality}.mp4`
    }));
}

async function pickBestJavpTrailerUrl(trailerUrl) {
    const raw = String(trailerUrl || "").trim();
    if (!raw) return "";

    const candidates = buildJavpQualityCandidates(raw);
    if (!candidates.length) return raw;

    const checks = await Promise.all(candidates.map(async (item) => ({
        ...item,
        ok: await isPlayableTrailerUrl(item.url)
    })));

    const best = checks.find((item) => item.ok);
    return best ? best.url : raw;
}

async function fetchJavpTrailerUrl(code) {
    const query = normalizeTrailerCode(code);
    if (!query) return "";
    if (Object.prototype.hasOwnProperty.call(JAVP_TRAILER_CACHE, query)) return JAVP_TRAILER_CACHE[query];

    if (!JAVP_TRAILER_PROMISE_CACHE[query]) {
        JAVP_TRAILER_PROMISE_CACHE[query] = Widget.http.get(`${JAVP_TRAILER_API_BASE}${encodeURIComponent(query)}`, {
            headers: { ...HEADERS, "Accept": "application/json,text/plain,*/*", "Referer": "https://javp.cc/" },
            timeout: JAVP_FETCH_TIMEOUT_MS
        })
            .then(async (res) => {
                const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
                const trailerUrl = String(data?.trailer || "").trim();
                const bestUrl = await pickBestJavpTrailerUrl(trailerUrl);
                JAVP_TRAILER_CACHE[query] = bestUrl;
                return bestUrl;
            })
            .catch(() => {
                JAVP_TRAILER_CACHE[query] = "";
                return "";
            });
    }

    return JAVP_TRAILER_PROMISE_CACHE[query];
}

async function buildPreferredTrailerUrl(titleOrCode) {
    const javpUrl = await fetchJavpTrailerUrl(titleOrCode);
    if (javpUrl) return javpUrl;
    return await buildJavTrailersUrl(titleOrCode);
}

async function buildJavTrailersUrl(title) {
    const parts = parseJavCodeParts(title);
    if (!parts) return "";
    if (Object.prototype.hasOwnProperty.call(JAVTRAILERS_URL_CACHE, parts.code)) return JAVTRAILERS_URL_CACHE[parts.code];

    const fallbackUrl = buildJavTrailersFallbackUrl(title);
    const isMgstage = isJavTrailersMgstageTitle(title);
    if (!shouldFetchJavTrailersPage(title)) {
        JAVTRAILERS_URL_CACHE[parts.code] = fallbackUrl;
        return fallbackUrl;
    }

    if (!JAVTRAILERS_URL_PROMISE_CACHE[parts.code]) {
        const pageIds = buildJavTrailersPageIds(title);
        JAVTRAILERS_URL_PROMISE_CACHE[parts.code] = Promise.all(pageIds.map((pageId) => fetchJavTrailersPageUrl(pageId)))
            .then((urls) => urls.find(Boolean) || (isMgstage ? "" : fallbackUrl))
            .then((url) => {
                if (url || !isMgstage) JAVTRAILERS_URL_CACHE[parts.code] = url;
                return url;
            });
    }

    try {
        if (isMgstage) return await JAVTRAILERS_URL_PROMISE_CACHE[parts.code];
        return await Promise.race([
            JAVTRAILERS_URL_PROMISE_CACHE[parts.code],
            new Promise((resolve) => setTimeout(() => resolve(fallbackUrl), JAVTRAILERS_FETCH_TIMEOUT_MS))
        ]);
    } catch (e) {
        return isMgstage ? "" : fallbackUrl;
    }
}

function buildTrailerCoverUrl(title) {
    const candidates = buildImageCandidatesFromValue(title);
    return chooseFirstCandidate(candidates.backdropCandidates) || "";
}

function extractVideoId(href) {
    if (!href) return "";
    const cleanHref = href.split('#')[0].split('?')[0];
    const slug = cleanHref.split('/').pop() || "";
    return slug.replace(/-(uncensored-leak|chinese-subtitle)$/, "").toUpperCase();
}

function buildMissavListCoverUrl(link) {
    const videoId = extractVideoId(link || "");
    return videoId ? `https://fourhoi.com/${videoId.toLowerCase()}/cover-t.jpg` : "";
}

// ==================== 高清封面 URL 规则（替代 0oo0 私人服务） ====================
//
// 约定：
// - posterUrl   = 高清竖图，用于 coverUrl，Forward 详情页主图最依赖这个字段
// - backdropUrl = 高清横图，用于 detailPoster / backdropPath / image
//
// 重要：
// - URL 规则只能“猜”图片地址，不能保证图片存在。
// - 因此列表页的 detailPoster 会使用 chooseFirstCandidate() 直接取第一个候选
// - 为了控制速度，只检测横图，不检测竖图。

// ==================== AVDB 方案：封面 URL 规则 ====================
// DMM 系列白名单——只有这些前缀才拼 DMM 封面 URL
var DMM_DIRECT_PREFIXES = new Set(["SNIS", "SNOS", "SONE", "SSIS", "SSNI", "STARS", "START", "SODS", "FSDSS", "FCDSS", "FNS", "FTHTD", "FSNF", "FLAV", "NHDTC", "KUSE", "MOGI", "FTAV", "WSA", "MIDV", "MIDA", "MIDE", "MIDD", "DASS", "HIKA", "MKMP", "MADM", "IPZZ", "IPZ", "IPX", "NGOD", "SDNM", "AVSA", "MNGS", "WAAA", "OFES", "OFJE", "OAE", "SIVR", "HSODA", "JUFE", "MUKA", "MIMK", "HMN", "ROYD", "SDHS", "JUR", "CAWD", "REBD", "ADN", "ATID", "JUL", "JUMS", "JUQ", "LULU", "MEYD", "MIAA", "MIAB", "MIRD", "PRED", "URE", "YUJ", "CJOD", "EBWH", "JYMA", "MDHR", "DVAJ", "ACHJ"]);
var DMM_DIRECT_BLOCKED_CODES = new Set(["START-227", "IPZZ-899", "START-334", "START-302", "START-349", "START-339", "START-310", "START-314", "START-287", "START-273", "START-266", "START-304", "START-285", "START-276", "START-135", "START-062", "START-023", "START-014", "STARS-977", "STARS-917", "STARS-915", "STARS-91501", "SDNM-39101"]);
var DMM_CONTENT_ID_OVERRIDES = {};

// DMM contentId 数字前缀映射
var DMM_CONTENT_PREFIX_MAP = {
    WSA: "2",
    FSDSS: "1", FCDSS: "1", FNS: "1", FTHTD: "1",
    FALENO: "1", FGAN: "1", FSNF: "1", FLAV: "1",
    NAAC: "h_706",
    NHDTC: "1",
    KUSE: "1",
    MBDD: "301",
    SDNM: "1",
    STARS: "1", STAR: "1", START: "1",
    SODS: "1",
    REBD: "h_346", REBDB: "h_346", GSHRB: "h_346",
    MOGI: "1",
    FTAV: "1"
};

// MGStage 系列白名单
var MGSTAGE_PREFIXES = new Set(["ABF", "ABW", "ABP", "CHN", "PPT", "MAAN"]);

var MGSTAGE_COVER_RULES = {
    ABF: { maker: "prestige" },
    ABW: { maker: "prestige" },
    ABP: { maker: "prestige" },
    CHN: { maker: "prestige" },
    PPT: { maker: "prestige" },
    JUFE: { maker: "prestige" },
    MAAN: { maker: "prestige" },
    "390JAC": { maker: "jackson" }
};

function compactUniqueUrls(urls) {
    const seen = new Set();
    const results = [];
    urls.forEach((url) => {
        const clean = String(url || "").trim();
        if (!clean || seen.has(clean)) return;
        seen.add(clean);
        results.push(clean);
    });
    return results;
}

function buildMgstageCoverCandidatesFromParts(parts, rule) {
    if (!parts || !rule || !rule.maker) {
        return { posterCandidates: [], backdropCandidates: [] };
    }

    const prefixLower = parts.prefixLower;
    const number = String(parseInt(parts.number, 10));
    if (!prefixLower || !number || number === "NaN") {
        return { posterCandidates: [], backdropCandidates: [] };
    }

    const dvdDash = `${prefixLower}-${number}`;
    const base = `https://image.mgstage.com/images/${rule.maker}/${prefixLower}/${number}`;

    return {
        posterCandidates: compactUniqueUrls([
            `${base}/pf_e_${dvdDash}.jpg`,
            `${base}/pf_o1_${dvdDash}.jpg`
        ]),
        backdropCandidates: compactUniqueUrls([
            `${base}/pb_e_${dvdDash}.jpg`,
            `${base}/pb_o1_${dvdDash}.jpg`
        ])
    };
}

function buildDmmCoverCandidatesFromParts(parts) {
    if (!parts) return { posterCandidates: [], backdropCandidates: [] };

    // contentId 由 buildImageCandidatesFromValue → buildDmmContentIdFromParts 生成
    // 例如 START-521 -> 1start00521，ROE-494 -> roe00494
    const contentId = String(parts.code || "").toLowerCase().trim();
    if (!contentId) return { posterCandidates: [], backdropCandidates: [] };

    const awsBase = `https://awsimgsrc.dmm.co.jp/pics_dig/digital/video/${contentId}`;
    const picsBase = `https://pics.dmm.co.jp/digital/video/${contentId}`;

    return {
        posterCandidates: compactUniqueUrls([
            `${awsBase}/${contentId}ps.jpg`,
            `${picsBase}/${contentId}ps.jpg`
        ]),
        backdropCandidates: compactUniqueUrls([
            `${awsBase}/${contentId}pl.jpg`,
            `${picsBase}/${contentId}pl.jpg`
        ])
    };
}

// ==================== AVDB 方案：封面策略选择 ====================

function normalizeDmmPrefix(prefix) {
    const p = String(prefix || "").toUpperCase();
    if (p === "REBDB") return "REBD";
    return p;
}

function isDirectDmmSeries(parts) {
    if (!parts) return false;
    if (DMM_DIRECT_BLOCKED_CODES.has(parts.prefix + "-" + parts.number)) return false;
    return DMM_DIRECT_PREFIXES.has(normalizeDmmPrefix(parts.prefix));
}

function buildDmmContentIdFromParts(parts) {
    if (!parts) return "";
    const code = parts.code ? String(parts.code).toUpperCase() : "";
    if (code && DMM_CONTENT_ID_OVERRIDES[code]) return DMM_CONTENT_ID_OVERRIDES[code];
    const prefix = normalizeDmmPrefix(parts.prefix);
    const numericPrefix = DMM_CONTENT_PREFIX_MAP[prefix] || "";
    if (!numericPrefix && /^SD[A-Z]{2,3}$/.test(prefix)) return "1" + prefix.toLowerCase() + parts.number5;
    return numericPrefix + prefix.toLowerCase() + parts.number5 + String(parts.suffix || "").toLowerCase();
}

// 主入口：根据番号生成封面候选策略
function buildImageCandidatesFromValue(value) {
    const parts = parseJavCodeParts(value);
    if (!parts) return { posterCandidates: [], backdropCandidates: [] };

    if (isDirectDmmSeries(parts)) {
        const contentId = buildDmmContentIdFromParts(parts);
        if (!contentId) return { posterCandidates: [], backdropCandidates: [] };
        return buildDmmCoverCandidatesFromParts({ code: contentId });
    }

    if (MGSTAGE_PREFIXES.has(parts.prefix)) {
        const rule = MGSTAGE_COVER_RULES[parts.prefix] || { maker: "prestige" };
        return buildMgstageCoverCandidatesFromParts(parts, rule);
    }

    return { posterCandidates: [], backdropCandidates: [] };
}

function chooseFirstCandidate(candidates, fallback) {
    for (var i = 0; i < candidates.length; i++) {
        if (candidates[i]) return candidates[i];
    }
    return fallback || "";
}

function resolveUrl(path) {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function normalizeText(text) {
    return (text || "").replace(/\s+/g, " ").trim();
}

async function parseVideoList(html, options = {}) {
    const { includeImageFields = false, currentPeople = null, currentGenre = null } = options;

    if (!html || html.includes("Just a moment")) {
        return [{ id: "err_cf", type: "text", title: "被 Cloudflare 拦截", subTitle: "请稍后重试" }];
    }

    const $ = Widget.html.load(html);
    const results = [];

    const cards = $("div.group").toArray();

    for (const el of cards) {
        const $el = $(el);
        const $link = $el.find("a.text-secondary");
        const href = $link.attr("href");

        if (href) {
            const title = getVersionTag(href) + $link.text().trim();
            const $img = $el.find("img");
            const imgSrc = $img.attr("data-src") || $img.attr("src") || "";
            const duration = $el.find(".absolute.bottom-1.right-1").text().trim();
            const videoId = extractVideoId(href);

            const coverCandidates = buildImageCandidatesFromValue(videoId);
            const fourhoiCover = videoId ? `https://fourhoi.com/${videoId.toLowerCase()}/cover-t.jpg` : imgSrc;

            // 竖图：DMM/MGStage 候选 → fourhoi → MissAV 原始图
            var posterCover = chooseFirstCandidate(coverCandidates.posterCandidates) || fourhoiCover || imgSrc;

            // 横图：DMM/MGStage 候选 → MissAV 原始图 → fourhoi（避免横图位置显示竖图）
            const backdropFallback = imgSrc || fourhoiCover || "";
            var backdropCover = chooseFirstCandidate(coverCandidates.backdropCandidates) || backdropFallback;

            const item = {
                id: href,
                type: "link",
                title,

                // 列表页实测优先吃 coverUrl。
                // 为了让首页 / 列表页横图样式稳定显示横图，这里放高清横图。
                coverUrl: backdropCover,

                // 按旧私服结构保留竖图给 detailPoster。
                // 虽然当前测试里它没有压过 coverUrl，但先保持和旧版一致。
                detailPoster: posterCover,

                link: href,
                description: `时长: ${duration}${videoId ? ` | 番号: ${videoId}` : ""}`,
                customHeaders: HEADERS
            };

            const peopleItems = [];
            if (currentPeople) peopleItems.push(currentPeople);

            $el.find('a[href*="/actresses/"], a[href*="actresses"]').each((_, peopleEl) => {
                const $people = $(peopleEl);
                const people = buildPeopleItem(
                    $people.text(),
                    getImageFromElement($, $people),
                    $people.attr("href") || ""
                );
                if (!people) return;

                const existingIndex = peopleItems.findIndex((item) =>
                    item.id === people.id ||
                    normalizePeopleKey(item.title) === normalizePeopleKey(people.title)
                );

                if (existingIndex >= 0) {
                    if (!peopleItems[existingIndex].avatar && people.avatar) {
                        peopleItems[existingIndex].avatar = people.avatar;
                    }
                    return;
                }

                peopleItems.push(people);
            });

            if (peopleItems.length) item.peoples = peopleItems;
            if (currentGenre) item.genreItems = [currentGenre];

            if (includeImageFields) {
                item.backdropPath = backdropCover;
                item.posterPath = posterCover;
                item.image = backdropCover;
            }

            results.push(item);
        }
    }

    return results.length > 0 ? results : [{ id: "empty", type: "text", title: "没有找到相关视频" }];
}

function buildStaticEntries(list, description) {
    return list.map((item) => ({
        id: item.value,
        type: "link",
        title: item.title,
        link: resolveUrl(item.value),
        coverUrl: "",
        description,
        customHeaders: HEADERS
    }));
}

// ==================== JavTrailers Gallery 剧照提取（移植自 Fused v19） ====================

const JAVTRAILERS_GALLERY_BASE_URL = "https://javtrailers.com";

const JAVTRAILERS_GALLERY_HEADERS = {
    "User-Agent": HEADERS["User-Agent"],
    "Accept": HEADERS["Accept"],
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Referer": "https://javtrailers.com/",
    "Connection": "keep-alive"
};

function resolveJavTrailersUrl(path) {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${JAVTRAILERS_GALLERY_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function cleanDvdId(raw) {
    return normalizeText(raw)
        .replace(/-UNCENSORED-LEAK$/i, "")
        .replace(/-CHINESE-SUBTITLE$/i, "")
        .replace(/_UNCENSORED_LEAK$/i, "")
        .replace(/_CHINESE_SUBTITLE$/i, "")
        .replace(/\s+/g, "")
        .trim();
}

function extractDvdIdFromMissAv($, link) {
    let dvdId = "";
    const labels = ["番号", "品番", "DVD ID"].map(l => normalizeText(l).replace(/[：:]/g, "").trim());
    $('.text-secondary').each((_, el) => {
        if (dvdId) return;
        const $row = $(el);
        const label = normalizeText($row.find('span').first().text()).replace(/[：:]/g, "").trim();
        if (labels.includes(label)) {
            const text = normalizeText($row.find("span.font-medium").first().text());
            if (text) dvdId = text;
        }
    });
    if (!dvdId) {
        const slug = String(link || "").split("?")[0].split("/").filter(Boolean).pop() || "";
        dvdId = slug;
    }
    return cleanDvdId(dvdId);
}

function normalizeDvdIdForSearch(dvdId) {
    const clean = cleanDvdId(dvdId).toUpperCase();
    const m = clean.match(/^([A-Z]+)[-_ ]*0*(\d+)$/);
    if (m) return `${m[1].toLowerCase()}-${parseInt(m[2], 10)}`;
    return clean.replace(/_/g, "-").replace(/\s+/g, "-").toLowerCase();
}

function normalizeDvdIdForCompare(dvdId) {
    const clean = cleanDvdId(dvdId).toUpperCase();
    const m = clean.match(/([A-Z]+)[-_ ]*0*(\d+)/);
    if (m) return `${m[1]}${parseInt(m[2], 10)}`;
    return clean.replace(/[^A-Z0-9]/g, "");
}

function buildDmmContentIdFromDvdId(dvdId) {
    const clean = cleanDvdId(dvdId).toLowerCase();
    const m = clean.match(/^([a-z]+)[-_ ]*0*(\d+)$/i);
    if (!m) return clean.replace(/[^a-z0-9]/gi, "");
    const prefix = m[1].toLowerCase();
    const number = String(parseInt(m[2], 10)).padStart(5, "0");
    return `${prefix}${number}`;
}

function buildDmmGallery(contentId, count = 10) {
    const id = String(contentId || "").toLowerCase().trim();
    if (!id) return [];
    const results = [];
    for (let i = 1; i <= count; i++) {
        results.push(`https://pics.dmm.co.jp/digital/video/${id}/${id}jp-${i}.jpg`);
    }
    return results;
}

function buildMgstageGalleryFromDvdId(dvdId, count = 10) {
    const clean = cleanDvdId(dvdId).toLowerCase();
    const m = clean.match(/^([a-z]+)[-_ ]*0*(\d+)$/i);
    if (!m) return [];
    const prefix = m[1].toLowerCase();
    const number = String(parseInt(m[2], 10));
    const dvdDash = `${prefix}-${number}`;
    const results = [];
    for (let i = 1; i <= count; i++) {
        results.push(`https://image.mgstage.com/images/prestige/${prefix}/${number}/cap_e_${i}_${dvdDash}.jpg`);
    }
    return results;
}

function buildMgstageGalleryFromHtmlOrDvdId(html, dvdId, count = 10) {
    const raw = String(html || "")
        .replace(/\\\//g, "/")
        .replace(/&amp;/g, "&")
        .replace(/\\u002F/g, "/");
    const urls = [];
    const seen = new Set();
    const pushUrl = (url) => {
        const clean = normalizeImageUrl(url);
        if (!clean || seen.has(clean)) return;
        seen.add(clean);
        urls.push(clean);
    };
    const coverMatch = raw.match(/https?:\/\/image\.mgstage\.com\/images\/([^"'\\\s<>]+?)\/([a-z]+)\/(\d+)\/pf_o\d+_([a-z]+-\d+)\.(?:jpg|jpeg|webp|png)/i);
    if (coverMatch) {
        const maker = coverMatch[1];
        const prefix = coverMatch[2].toLowerCase();
        const number = coverMatch[3];
        const dvdDash = coverMatch[4].toLowerCase();
        for (let i = 1; i <= count; i++) {
            pushUrl(`https://image.mgstage.com/images/${maker}/${prefix}/${number}/cap_e_${i}_${dvdDash}.jpg`);
        }
        return urls;
    }
    return buildMgstageGalleryFromDvdId(dvdId, count);
}

function extractCompareIdsFromText(text) {
    const raw = String(text || "");
    const ids = [];
    const seen = new Set();
    const patterns = [
        /([a-z]{2,12})[-_\s\/]*0*(\d{2,6})/gi,
        /(\d+)([a-z]{2,12})0*(\d{2,6})/gi
    ];
    patterns.forEach((pattern) => {
        let match;
        while ((match = pattern.exec(raw)) !== null) {
            let prefix = "", num = "";
            if (match.length === 3) { prefix = match[1]; num = match[2]; }
            else if (match.length === 4) { prefix = match[2]; num = match[3]; }
            if (!prefix || !num) continue;
            const id = `${prefix.toUpperCase()}${parseInt(num, 10)}`;
            if (!seen.has(id)) { seen.add(id); ids.push(id); }
        }
    });
    return ids;
}

function imageUrlMatchesDvd(url, dvdId, contentId) {
    const target = normalizeDvdIdForCompare(dvdId);
    const contentCompare = normalizeDvdIdForCompare(contentId);
    const candidates = extractCompareIdsFromText(url);
    if (!target && !contentCompare) return true;
    return candidates.some((candidate) => {
        return (
            candidate === target ||
            candidate === contentCompare ||
            target.includes(candidate) ||
            candidate.includes(target) ||
            contentCompare.includes(candidate) ||
            candidate.includes(contentCompare)
        );
    });
}

function normalizeImageUrl(url) {
    if (!url) return "";
    let clean = String(url)
        .replace(/\\\//g, "/")
        .replace(/&amp;/g, "&")
        .trim();
    if (!clean || clean.startsWith("data:")) return "";
    if (clean.startsWith("//")) clean = `https:${clean}`;
    return resolveJavTrailersUrl(clean);
}

function sortGalleryUrls(urls) {
    return urls.sort((a, b) => {
        const getIndex = (url) => {
            const patterns = [
                /jp-(\d+)\./i,
                /cap_e_(\d+)_/i,
                /cap_e_(\d+)\./i,
                /cap_(\d+)_/i,
                /-(\d+)\.(?:jpg|jpeg|webp|png)/i
            ];
            for (const pattern of patterns) {
                const m = url.match(pattern);
                if (m && m[1]) return parseInt(m[1], 10);
            }
            return 9999;
        };
        return getIndex(a) - getIndex(b);
    });
}

function extractGalleryImagesFromSwiper($, dvdId, contentId) {
    const urls = [];
    const seen = new Set();
    const pushUrl = (url) => {
        const clean = normalizeImageUrl(url);
        if (!clean || seen.has(clean)) return;
        if (!imageUrlMatchesDvd(clean, dvdId, contentId)) return;
        seen.add(clean);
        urls.push(clean);
    };
    $(".swiper-wrapper .swiper-slide.image-container img, .swiper-wrapper .swiper-slide img").each((_, el) => {
        const $img = $(el);
        pushUrl($img.attr("src") || "");
        pushUrl($img.attr("data-src") || "");
        pushUrl($img.attr("data-original") || "");
        pushUrl($img.attr("data-lazy") || "");
    });
    return sortGalleryUrls(urls);
}

function extractGalleryImagesFromRawHtml(html, dvdId, contentId) {
    const normalized = String(html || "")
        .replace(/\\\//g, "/")
        .replace(/&amp;/g, "&")
        .replace(/\\u002F/g, "/");
    const urls = [];
    const seen = new Set();
    const pushUrl = (url) => {
        const clean = normalizeImageUrl(url);
        if (!clean || seen.has(clean)) return;
        if (!imageUrlMatchesDvd(clean, dvdId, contentId)) return;
        seen.add(clean);
        urls.push(clean);
    };
    const patterns = [
        /https?:\/\/pics\.dmm\.co\.jp\/digital\/video\/[^"'\\\s<>]+?\/[^"'\\\s<>]+?jp-\d+\.(?:jpg|jpeg|webp|png)/gi,
        /https?:\/\/image\.mgstage\.com\/images\/[^"'\\\s<>]+?\/cap_e_\d+_[^"'\\\s<>]+?\.(?:jpg|jpeg|webp|png)/gi,
        /https?:\/\/image\.mgstage\.com\/images\/[^"'\\\s<>]+?\/pf_o\d+_[^"'\\\s<>]+?\.(?:jpg|jpeg|webp|png)/gi,
        /src=["']([^"']*cap_e_\d+_[^"']+\.(?:jpg|jpeg|webp|png))["']/gi,
        /src=["']([^"']*pf_o\d+_[^"']+\.(?:jpg|jpeg|webp|png))["']/gi,
        /src=["']([^"']*jp-\d+\.(?:jpg|jpeg|webp|png))["']/gi
    ];
    patterns.forEach((pattern) => {
        let match;
        while ((match = pattern.exec(normalized)) !== null) {
            pushUrl(match[1] || match[0]);
        }
    });
    return sortGalleryUrls(urls);
}

function isMgstageCoverOnlyImage(url) {
    return /image\.mgstage\.com\/images\/.+?\/pf_o\d+_/i.test(String(url || ""));
}

function isLikelyDmmContentId(contentId) {
    const id = String(contentId || "").toLowerCase().trim();
    return /^(?:\d+)?[a-z]+0\d{4,5}$/i.test(id);
}

function isDmmSourceHtml(html) {
    const raw = String(html || "").toLowerCase();
    return raw.includes("pics.dmm.co.jp") || raw.includes("al.fanza.co.jp") || raw.includes("fanza");
}

function isMgstageSourceHtml(html) {
    const raw = String(html || "").toLowerCase();
    return raw.includes("image.mgstage.com") || raw.includes("mgstage.nihonjav.com") || raw.includes("mgstage");
}

function extractDmmGalleryFromHtml(html, contentId, dvdId) {
    const $ = Widget.html.load(html);
    const swiperImages = extractGalleryImagesFromSwiper($, dvdId, contentId);
    if (swiperImages.length) return swiperImages;
    const rawImages = extractGalleryImagesFromRawHtml(html, dvdId, contentId);
    const isMgstage = isMgstageSourceHtml(html);
    const rawHasRealGallery = rawImages.some((url) => {
        if (isMgstageCoverOnlyImage(url)) return false;
        return /cap_e_\d+_/i.test(url) || /jp-\d+\./i.test(url);
    });
    if (rawImages.length && (!isMgstage || rawHasRealGallery)) return rawImages;
    const finalId = String(contentId || "").toLowerCase().trim();
    if (isDmmSourceHtml(html) && isLikelyDmmContentId(finalId)) return buildDmmGallery(finalId, 10);
    if (isMgstage) return buildMgstageGalleryFromHtmlOrDvdId(html, dvdId, 10);
    return [];
}

function buildDmmBackdropFromContentId(contentId) {
    const id = String(contentId || "").toLowerCase().trim();
    if (!id) return "";
    return `https://pics.dmm.co.jp/digital/video/${id}/${id}pl.jpg`;
}

function buildMgstageBackdropFromDvdId(dvdId, maker = "prestige") {
    const clean = cleanDvdId(dvdId).toLowerCase();
    const m = clean.match(/^([a-z]+)[-_ ]*0*(\d+)$/i);
    if (!m) return "";
    const prefix = m[1].toLowerCase();
    const number = String(parseInt(m[2], 10));
    const dvdDash = `${prefix}-${number}`;
    return `https://image.mgstage.com/images/${maker}/${prefix}/${number}/pb_e_${dvdDash}.jpg`;
}

function extractJavTrailersBackdropPath($, html, contentId, dvdId) {
    const raw = String(html || "")
        .replace(/\\\//g, "/")
        .replace(/&amp;/g, "&")
        .replace(/\\u002F/g, "/");
    const mgstagePbMatch = raw.match(/https?:\/\/image\.mgstage\.com\/images\/[^"'\\\s<>]+?\/pb_e_[^"'\\\s<>]+?\.(?:jpg|jpeg|webp|png)/i);
    if (mgstagePbMatch && mgstagePbMatch[0]) return normalizeImageUrl(mgstagePbMatch[0]);
    const dmmPlMatch = raw.match(/https?:\/\/pics\.dmm\.co\.jp\/digital\/video\/[^"'\\\s<>]+?\/[^"'\\\s<>]+?pl\.(?:jpg|jpeg|webp|png)/i);
    if (dmmPlMatch && dmmPlMatch[0]) return normalizeImageUrl(dmmPlMatch[0]);
    const mgstagePfMatch = raw.match(/https?:\/\/image\.mgstage\.com\/images\/([^"'\\\s<>]+?)\/([a-z]+)\/(\d+)\/pf_o\d+_([a-z]+-\d+)\.(?:jpg|jpeg|webp|png)/i);
    if (mgstagePfMatch) {
        const maker = mgstagePfMatch[1], prefix = mgstagePfMatch[2].toLowerCase(), number = mgstagePfMatch[3], dvdDash = mgstagePfMatch[4].toLowerCase();
        return `https://image.mgstage.com/images/${maker}/${prefix}/${number}/pb_e_${dvdDash}.jpg`;
    }
    const dvdClean = cleanDvdId(dvdId).toLowerCase();
    const dvdPrefixMatch = dvdClean.match(/^([a-z]+)[-_ ]*0*(\d+)$/i);
    const dvdPrefix = dvdPrefixMatch ? dvdPrefixMatch[1].toLowerCase() : "";
    if (dvdPrefix === "abf") {
        const mgstageBackdrop = buildMgstageBackdropFromDvdId(dvdId, "prestige");
        if (mgstageBackdrop) return mgstageBackdrop;
    }
    const finalId = String(contentId || "").toLowerCase().trim();
    if (isLikelyDmmContentId(finalId)) return buildDmmBackdropFromContentId(finalId);
    return "";
}

function scoreJavTrailersSearchResult($, $a, targetCompareId) {
    const href = resolveJavTrailersUrl($a.attr("href") || "");
    const text = normalizeText($a.text());
    const nearbyText = normalizeText($a.closest("div,li,article,section").text());
    const slug = href.split("/").filter(Boolean).pop() || "";
    const candidates = [text, nearbyText, slug];
    let bestScore = 0;
    candidates.forEach((candidate) => {
        const compare = normalizeDvdIdForCompare(candidate);
        if (!compare) return;

        // 只接受严格番号匹配，避免 IPZZ-014 误命中 IPZZ-149、
        // IPZZ-008 误命中 IPZZ-828 这类前缀包含错误。
        if (compare === targetCompareId) {
            bestScore = Math.max(bestScore, 100);
        }
    });
    if (href.includes("/video/")) bestScore += 10;
    return { href, slug, contentId: slug.toLowerCase(), score: bestScore };
}

async function findJavTrailersDetailUrl(dvdId) {
    const searchKeyword = normalizeDvdIdForSearch(dvdId);
    const targetCompareId = normalizeDvdIdForCompare(dvdId);
    if (!searchKeyword || !targetCompareId) return "";
    const searchUrl = `${JAVTRAILERS_GALLERY_BASE_URL}/search/${encodeURIComponent(searchKeyword)}`;
    try {
        const res = await Widget.http.get(searchUrl, { headers: JAVTRAILERS_GALLERY_HEADERS, timeout: 2500 });
        const html = res.data || "";
        const $ = Widget.html.load(html);
        const candidates = [];
        $('a[href*="/video/"]').each((_, el) => {
            const $a = $(el);
            const result = scoreJavTrailersSearchResult($, $a, targetCompareId);
            if (result.href) candidates.push(result);
        });
        candidates.sort((a, b) => b.score - a.score);
        if (candidates.length && candidates[0].score >= 60) return candidates[0].href;
        const directPattern = /href=["']([^"']*\/video\/([a-z0-9_]+)[^"']*)["']/gi;
        let match;
        while ((match = directPattern.exec(html)) !== null) {
            const href = resolveJavTrailersUrl(match[1]), slug = match[2] || "";
            if (normalizeDvdIdForCompare(slug) === targetCompareId) return href;
        }
        return "";
    } catch (e) {
        console.log(`[JavTrailers] search failed: ${e.message}`);
        return "";
    }
}

function extractJavTrailersContentId($, html, detailUrl) {
    const text = normalizeText($("body").text());
    const urlMatch = String(detailUrl || "").match(/\/video\/([a-z0-9_]+)/i);
    if (urlMatch && urlMatch[1]) return urlMatch[1].toLowerCase();
    const contentIdMatch = text.match(/Content\s*ID\s*:?\s*([a-z0-9_]+)/i);
    if (contentIdMatch && contentIdMatch[1]) return contentIdMatch[1].toLowerCase();
    const imageMatch = String(html || "").match(/pics\.dmm\.co\.jp\/digital\/video\/([a-z0-9_]+)\//i);
    if (imageMatch && imageMatch[1]) return imageMatch[1].toLowerCase();
    return "";
}

async function fetchJavTrailersMeta(dvdId) {
    const empty = { detailUrl: "", contentId: "", backdropPath: "", backdropPaths: [], trailers: [] };
    if (!dvdId) return empty;

    const buildFallbackBackdropPath = (contentId, dvdId) => {
        const dvdClean = cleanDvdId(dvdId).toLowerCase();
        const dvdPrefixMatch = dvdClean.match(/^([a-z]+)[-_ ]*0*(\d+)$/i);
        const dvdPrefix = dvdPrefixMatch ? dvdPrefixMatch[1].toLowerCase() : "";
        if (dvdPrefix === "abf") {
            const mgstageBackdrop = buildMgstageBackdropFromDvdId(dvdId, "prestige");
            if (mgstageBackdrop) return mgstageBackdrop;
        }
        const finalId = String(contentId || "").toLowerCase().trim();
        if (isLikelyDmmContentId(finalId)) return buildDmmBackdropFromContentId(finalId);
        return "";
    };

    try {
        const detailUrl = await findJavTrailersDetailUrl(dvdId);
        if (!detailUrl) {
            const expectedContentId = buildDmmContentIdFromDvdId(dvdId);
            const fallbackBackdropPath =
                buildFallbackBackdropPath(expectedContentId, dvdId) ||
                buildDmmBackdropFromContentId(expectedContentId);

            const fallbackBackdropPaths = isLikelyDmmContentId(expectedContentId)
                ? buildDmmGallery(expectedContentId, 10)
                : [];

            return {
                detailUrl: "",
                contentId: expectedContentId || "",
                backdropPath: fallbackBackdropPath || "",
                backdropPaths: fallbackBackdropPaths,
                trailers: []
            };
        }
        const res = await Widget.http.get(detailUrl, {
            headers: { ...JAVTRAILERS_GALLERY_HEADERS, "Referer": `${JAVTRAILERS_GALLERY_BASE_URL}/` },
            timeout: 2500
        });
        const html = res.data || "";
        const $ = Widget.html.load(html);
        const contentId = extractJavTrailersContentId($, html, detailUrl);
        const expectedContentId = buildDmmContentIdFromDvdId(dvdId);

        // JavTrailers 搜索可能把 IPZZ-014 误命中成 IPZZ-149，
        // 或把 IPZZ-008 误命中成 IPZZ-828。
        // 如果详情页 contentId 和当前 dvdId 推导出的 contentId 不一致，
        // 就不要继续信任这个 JavTrailers 页面，直接回退到当前番号自己的图。
        // 注意：ABF-123 在 JavTrailers 上 contentId=118abf00123（带存储前缀），
        // 而 buildDmmContentIdFromDvdId 返回 abf00123，所以要去掉前缀再比较。
        const stripStoragePrefix = (s) => String(s || "").toLowerCase().replace(/^\d+/, "");
        const dvdCleanPrefixM = cleanDvdId(dvdId).match(/^([a-z]+)/i);
        const dvdCleanPrefix = dvdCleanPrefixM ? dvdCleanPrefixM[1].toLowerCase() : "";
        if (
            contentId &&
            expectedContentId &&
            stripStoragePrefix(contentId) !== stripStoragePrefix(expectedContentId)
        ) {
            const expectedContentIdClean = expectedContentId.toLowerCase().trim();
            const isMgstageFallback = dvdCleanPrefix && JAVTRAILERS_MGSTAGE_PREFIXES.has(dvdCleanPrefix.toUpperCase());

            const fallbackBackdropPath = isMgstageFallback
                ? buildMgstageBackdropFromDvdId(dvdId, "prestige")
                : buildDmmBackdropFromContentId(expectedContentIdClean);

            const fallbackBackdropPaths = isMgstageFallback
                ? buildMgstageGalleryFromDvdId(dvdId, 10)
                : isLikelyDmmContentId(expectedContentIdClean)
                    ? buildDmmGallery(expectedContentIdClean, 10)
                    : [];

            return {
                detailUrl: "",
                contentId: expectedContentId,
                backdropPath: fallbackBackdropPath || "",
                backdropPaths: fallbackBackdropPaths,
                trailers: []
            };
        }

        let backdropPath = extractJavTrailersBackdropPath($, html, contentId, dvdId);
        if (!backdropPath) backdropPath = buildFallbackBackdropPath(contentId, dvdId);

        const backdropPaths = extractDmmGalleryFromHtml(html, contentId, dvdId);

        return {
            detailUrl,
            contentId,
            backdropPath,
            backdropPaths,
            trailers: []
        };
    } catch (e) {
        console.log(`[JavTrailers] detail failed: ${e.message}`);
        const fallbackBackdropPath = buildFallbackBackdropPath("", dvdId);
        if (fallbackBackdropPath) return { detailUrl: "", contentId: "", backdropPath: fallbackBackdropPath, backdropPaths: [], trailers: [] };
        return empty;
    }
}

async function loadRecentUpdates(params = {}) {
    const { page = 1, sort_by = "published_at" } = params;
    return loadList({ primary_category: RECENT_UPDATES_CATEGORY, page, sort_by });
}

async function loadList(params = {}) {
    const { endpoint = "dm632/cn/release", page = 1, sort_by = "", filters = "", primary_category = "", peopleId = "", genreId = "" } = params;
    const targetEndpoint = resolveEndpointByPrimaryCategory(primary_category, endpoint);
    const targetSort = isRecentUpdatesCategory(primary_category) ? (sort_by || "published_at") : sort_by;

    let targetUrl = buildListUrl(targetEndpoint, page, filters, targetSort);

    if (peopleId) {
        targetUrl = resolveUrl(String(peopleId));
        if (page > 1) targetUrl += targetUrl.includes("?") ? `&page=${page}` : `?page=${page}`;
    } else if (genreId) {
        targetUrl = resolveUrl(String(genreId));
        if (page > 1) targetUrl += targetUrl.includes("?") ? `&page=${page}` : `?page=${page}`;
    }

    try {
        const currentPeopleId = peopleId ? normalizePeopleId(peopleId) : "";
        const currentPeopleTitle = peopleId ? decodeURIComponent(String(peopleId).split('/').pop() || '主演') : "";
        const res = await Widget.http.get(targetUrl, { headers: HEADERS });
        let currentPeople = null;

        if (currentPeopleId) {
            const cachedAvatar = PEOPLE_AVATAR_CACHE[currentPeopleId] || "";
            const pageAvatar = cachedAvatar || resolveAvatarImageUrl(pickFirstAvatar(Widget.html.load(res.data)));
            if (pageAvatar) {
                PEOPLE_AVATAR_CACHE[currentPeopleId] = pageAvatar;
            } else if (!cachedAvatar) {
                // 第 2 页往后没有头像元素，直接从女优独立页获取
                const resolved = await resolvePeopleAvatar(currentPeopleId);
                if (resolved) PEOPLE_AVATAR_CACHE[currentPeopleId] = resolved;
            }
            currentPeople = buildPeopleContext(
                currentPeopleId,
                currentPeopleTitle,
                PEOPLE_AVATAR_CACHE[currentPeopleId] || ""
            );
        }

        return await parseVideoList(res.data, {
            currentPeople,
            currentGenre: genreId ? buildGenreContext(normalizeGenreId(genreId), decodeURIComponent(String(genreId).split('/').pop() || '分类')) : null
        });
    } catch (e) {
        return [{ id: "err", type: "text", title: "加载失败", subTitle: e.message }];
    }
}

async function searchList(params = {}) {
    const { page = 1, keyword } = params;

    if (!keyword) {
        return [{ id: "tip", type: "text", title: "请输入关键词开始搜索" }];
    }

    let url = `${BASE_URL}/cn/search/${encodeURIComponent(keyword)}`;
    if (page > 1) url += `?page=${page}`;

    try {
        const res = await Widget.http.get(url, { headers: HEADERS });
        return await parseVideoList(res.data);
    } catch (e) {
        return [{ id: "err", type: "text", title: "搜索失败", subTitle: e.message }];
    }
}

async function searchGlobal(params = {}) {
    const { page = 1, keyword } = params;

    if (!keyword) {
        return [{ id: "tip", type: "text", title: "请输入关键词开始全局搜索" }];
    }

    let url = `${BASE_URL}/cn/search/${encodeURIComponent(keyword)}`;
    if (page > 1) url += `?page=${page}`;

    try {
        const res = await Widget.http.get(url, { headers: HEADERS });
        return await parseVideoList(res.data, { includeImageFields: true });
    } catch (e) {
        return [{ id: "err", type: "text", title: "全局搜索失败", subTitle: e.message }];
    }
}

async function loadResource(params = {}) {
    try {
        const code = extractCodeFromParams(params);
        if (!code) return [];

        // 查找所有精确匹配的 MissAV 详情页（有码/中文/无码）
        const detailPages = await findAllMissAVDetailPages(code);
        if (!detailPages.length) {
            // fallback：使用旧版单页查找逻辑
            return loadResourceLegacy(params, code);
        }

        // 按中文 → 无码 → 有码排序
        const typePriority = { "中文": 0, "破解无码": 1, "有码": 2 };
        detailPages.sort((a, b) => (typePriority[a.type] ?? 99) - (typePriority[b.type] ?? 99));

        const allStreams = [];
        const seenUuids = new Set();

        for (const page of detailPages) {
            const cacheKey = `${code.toUpperCase()}_${page.type}`;
            let uuid = VIDEO_URL_CACHE[cacheKey];

            if (!uuid) {
                try {
                    const res = await Widget.http.get(page.link, { headers: HEADERS });
                    const html = res.data || "";
                    if (html.includes("Just a moment")) continue;

                    // 提取 surrit UUID
                    uuid = extractSurritUuidFromDetailHtml(html);
                    if (uuid) VIDEO_URL_CACHE[cacheKey] = uuid;
                } catch (e) {
                    continue;
                }
            }

            if (!uuid || seenUuids.has(uuid)) continue;
            seenUuids.add(uuid);

            const streams = await buildMissavStreamItems(uuid, code, page.link, page.type);
            allStreams.push(...streams);
        }

        return allStreams;
    } catch (e) {
        return [];
    }
}

// 旧版单页查找逻辑（作为 findAllMissAVDetailPages 的回退）
async function loadResourceLegacy(params, code) {
    try {
        let cached = VIDEO_URL_CACHE[code.toUpperCase()];
        let videoUrl = cached ? cached.url : null;
        let currentReferer = cached?.referer || `${BASE_URL}/cn/search/${encodeURIComponent(code.trim())}`;
        let detailHtml = "";

        if (!videoUrl) {
            const MAX_RETRIES = 2;
            for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
                let searchUrl = `${BASE_URL}/cn/search/${encodeURIComponent(code.trim())}`;
                const res = await Widget.http.get(searchUrl, { headers: HEADERS });
                let html = res.data;
                detailHtml = html;
                let detailLink = searchUrl;

                if (html.includes("Just a moment") || html.includes("cf-browser-verification")) {
                    if (attempt < MAX_RETRIES) continue;
                    return [];
                }

                const $ = Widget.html.load(html);

                if ($('#videodetails').length > 0 || $('meta[property="og:type"]').attr('content') === 'video.movie') {
                    detailLink = $('meta[property="og:url"]').attr('content') || searchUrl;
                } else {
                    let firstHref = "";
                    const targetLoose = code.toUpperCase().replace(/[\s_\-]+/g, "");

                    $("div.group").each((i, el) => {
                        const $el = $(el);
                        const $link = $el.find("a.text-secondary");
                        const href = $link.attr("href");
                        if (href) {
                            const videoId = extractVideoId(href);
                            if (videoId.replace(/[\s_\-]+/g, "") === targetLoose) {
                                firstHref = href;
                                return false;
                            }
                        }
                    });

                    if (!firstHref) {
                        const targetUpper = code.toUpperCase();
                        $("div.group").each((i, el) => {
                            const $el = $(el);
                            const $link = $el.find("a.text-secondary");
                            const href = $link.attr("href");
                            const text = $link.text().toUpperCase().replace(/[\s_\-]+/g, "");
                            if (href && text.includes(targetUpper.replace(/[\s_\-]+/g, ""))) {
                                firstHref = href;
                                return false;
                            }
                        });
                    }

                    if (!firstHref) firstHref = $("div.group a.text-secondary").first().attr("href");

                    if (firstHref) {
                        detailLink = resolveUrl(firstHref);
                        const detailRes = await Widget.http.get(detailLink, { headers: HEADERS });
                        detailHtml = detailRes.data;
                    } else {
                        if (attempt < MAX_RETRIES) continue;
                        return [];
                    }
                }

                currentReferer = detailLink;
                videoUrl = extractVideoUrlFromHtml(detailHtml);

                if (!videoUrl) {
                    if (attempt < MAX_RETRIES) continue;
                    break;
                }
                break;
            }

            if (videoUrl) {
                VIDEO_URL_CACHE[code.toUpperCase()] = { url: videoUrl, timestamp: Date.now(), referer: currentReferer };
            }
        }

        if (videoUrl) {
            const uuidMatch = videoUrl.match(/surrit\.com\/([a-f0-9\-]{36})\//i);
            const uuid = uuidMatch ? uuidMatch[1] : "";

            if (uuid) {
                return await buildMissavStreamItems(uuid, code, currentReferer, "有码");
            }

            return [{
                name: code.toUpperCase(),
                description: "MissAV 播放源",
                url: videoUrl,
                customHeaders: { "Referer": currentReferer, "User-Agent": HEADERS["User-Agent"], "Origin": "https://missav.ai" }
            }];
        }
        return [];
    } catch (e) {
        return [];
    }
}

function extractSurritUuidFromDetailHtml(html) {
    if (!html) return "";
    const $ = Widget.html.load(html);
    let uuid = "";

    $("script").each((i, el) => {
        const scriptContent = $(el).html() || "";
        if (scriptContent.includes("surrit.com") && scriptContent.includes(".m3u8")) {
            const uuidFromUrl = scriptContent.match(/https:\/\/surrit\.com\/([a-f0-9\-]{36})\/[^"'\s]*\.m3u8/i);
            if (uuidFromUrl && uuidFromUrl[1]) { uuid = uuidFromUrl[1]; return false; }
        }
        if (!uuid && scriptContent.includes("eval(function")) {
            const uuidMatches = scriptContent.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi);
            if (uuidMatches && uuidMatches.length > 0) { uuid = uuidMatches[0]; return false; }
        }
    });

    if (!uuid) {
        const match = html.match(/surrit\.com\/([a-f0-9\-]{36})\//i);
        if (match && match[1]) uuid = match[1];
    }

    return uuid;
}

// ==================== 播放地址增强（合并自 3.8 方案）：直接提取 + Packer 解混淆 ====================

function extractVideoUrlFromHtml(html) {
    if (!html) return "";
    const $ = Widget.html.load(html);
    let videoUrl = "";

    $('script').each((i, el) => {
        const scriptContent = $(el).html() || "";

        if (scriptContent.includes('surrit.com') && scriptContent.includes('.m3u8')) {
            const matches = scriptContent.match(/https:\/\/surrit\.com\/[a-f0-9\-]+\/[^"'\s]*\.m3u8/g);
            if (matches && matches.length > 0) { videoUrl = matches[0]; return false; }
        }

        if (!videoUrl && scriptContent.includes('eval(function')) {
            const unpacked = unpackPacker(scriptContent);
            if (unpacked) {
                const matches = unpacked.match(/https:\/\/surrit\.com\/[a-f0-9\-]+\/[^"'\s]*\.m3u8/g);
                if (matches && matches.length > 0) { videoUrl = matches[0]; return false; }
            }
            const uuidMatches = scriptContent.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/g);
            if (uuidMatches && uuidMatches.length > 0) { videoUrl = `https://surrit.com/${uuidMatches[0]}/playlist.m3u8`; return false; }
        }
    });

    if (!videoUrl) {
        const matchFull = html.match(/https:\/\/surrit\.com\/[a-f0-9\-]+\/[^"'\s]*\.m3u8/i);
        if (matchFull && matchFull[0]) return matchFull[0];
        const matchSimple = html.match(/source\s*=\s*['"]([^'"]+)['"]/);
        if (matchSimple && matchSimple[1]) return matchSimple[1];
    }

    return videoUrl;
}

function extractRelatedItems($, currentLink) {
    const relatedItems = [];
    const seenKeys = new Set();
    // 归一化 key：只保留大小写字母和数字，忽略所有标点/分隔符差异
    const normalizeKey = (key) => (key || "").toUpperCase().replace(/[^A-Z0-9]/g, "");

    const currentIdClean = extractVideoId(currentLink).toUpperCase();
    const currentHrefClean = resolveUrl(currentLink).split('#')[0].split('?')[0].toLowerCase();

    const addKey = (key) => {
        if (!key) return;
        const nk = normalizeKey(key);
        seenKeys.add(nk);
    };

    addKey(currentIdClean);
    addKey(currentHrefClean);

    $("div.thumbnail, div.group").each((i, el) => {
        const $el = $(el);
        if ($el.closest('#videodetails').length > 0) return;
        const $link = $el.find("a.text-secondary, a[href*='/cn/'], a[href*='/en/'], a[href*='/ja/']").first();
        let href = $link.attr("href");

        if (href) {
            href = resolveUrl(href.split('#')[0].split('?')[0]);
            const videoId = extractVideoId(href).toUpperCase();
            const hrefKey = normalizeKey(href.toLowerCase());
            const videoKey = normalizeKey(videoId);

            if (seenKeys.has(hrefKey)) return;
            if (videoKey && seenKeys.has(videoKey)) return;

            seenKeys.add(hrefKey);
            if (videoKey) seenKeys.add(videoKey);

            let title = $link.find("font.transmart-tgt-font-container").length > 0
                ? $link.find("font.transmart-tgt-font-container").text().trim()
                : normalizeText($link.text());
            if (!title) title = videoId || "推荐影片";

            const $img = $el.find("img");
            const imgSrc = $img.attr("data-src") || $img.attr("src") || "";
            const duration = normalizeText($el.find(".absolute.bottom-1.right-1").text());
            const coverCandidates = buildImageCandidatesFromValue(videoId);
            const fourhoiCover = videoId ? `https://fourhoi.com/${videoId.toLowerCase()}/cover-t.jpg` : imgSrc;
            const posterCover = chooseFirstCandidate(coverCandidates.posterCandidates) || fourhoiCover || imgSrc;
            const backdropCover = chooseFirstCandidate(coverCandidates.backdropCandidates) || posterCover || imgSrc;

            relatedItems.push({
                id: href,
                type: "link",
                title,
                coverUrl: posterCover,
                detailPoster: backdropCover,
                posterPath: posterCover,
                backdropPath: backdropCover,
                image: backdropCover,
                link: href,
                description: `${duration ? `时长: ${duration} | ` : ""}番号: ${videoId}`,
                customHeaders: HEADERS
            });
        }
    });

    return relatedItems;
}

async function loadDetail(link) {
    // missav: 伪协议处理（与 missavovo.js 方案一致）
    if (link && link.indexOf("missav:") === 0) {
        const pp = link.split(":");
        if (pp.length >= 4) {
            return {
                id: link,
                type: "video",
                title: pp[2],
                videoUrl: decodeURIComponent(pp.slice(3).join(":")),
                customHeaders: {
                    Referer: "https://missav.ai/",
                    Origin: "https://missav.ai"
                }
            };
        }
    }
    try {
        const res = await Widget.http.get(link, { headers: HEADERS });
        const html = res.data;
        const $ = Widget.html.load(html);

        const title = $('meta[property="og:title"]').attr('content') || $('h1').text().trim();
        const code = extractSearchCode(title) || extractVideoId(link);

        const actors = [];
        const peoples = [];
        const genreItems = [];
        const seenActors = new Set();
        const seenGenres = new Set();

        const pushActor = (name, avatar, href) => {
            const cleanName = normalizeDisplayTitle(name);
            const cleanKey = normalizePeopleKey(cleanName);
            if (!cleanName) return;
            const people = buildPeopleItem(cleanName, avatar, href);
            const actor = { name: cleanName, avatar: avatar || "", link: href || "" };
            const existingIndex = actors.findIndex((item) => {
                const itemKey = normalizePeopleKey(item.name);
                return itemKey === cleanKey || itemKey.includes(cleanKey) || cleanKey.includes(itemKey);
            });
            if (existingIndex >= 0) {
                const existingKey = normalizePeopleKey(actors[existingIndex].name);
                const shouldReplace = cleanKey.length > existingKey.length || (!actors[existingIndex].link && actor.link) || (!actors[existingIndex].avatar && actor.avatar);
                if (shouldReplace) {
                    seenActors.delete(existingKey);
                    actors[existingIndex] = actor;
                    if (people) peoples[existingIndex] = people;
                    seenActors.add(cleanKey);
                }
                return;
            }
            seenActors.add(cleanKey);
            actors.push(actor);
            if (people) peoples.push(people);
        };

        const metaActressNames = [];
        $('meta[property="og:video:actor"], meta[property="video:actor"], meta[name="video:actor"]').each((_, el) => {
            const content = $(el).attr("content") || "";
            content.split(",").map((name) => name.trim()).filter(Boolean).forEach((name) => metaActressNames.push(name));
        });

        $(".text-secondary").each((_, el) => {
            const $row = $(el);
            const label = normalizeDetailLabel($row.find("span").first().text());
            if (isActressLabel(label)) {
                $row.find('a[href*="/actresses/"], a[href*="actresses"]').each((_, actressEl) => {
                    const $actress = $(actressEl);
                    const href = resolveUrl($actress.attr("href") || "");
                    const rawName = $actress.text().replace(/\s+/g, " ").trim();
                    const matchedMetaName = metaActressNames.find((name) => normalizePeopleKey(rawName).includes(normalizePeopleKey(name)) || normalizePeopleKey(name).includes(normalizePeopleKey(rawName)));
                    pushActor(matchedMetaName || rawName, getImageFromElement($, $actress), href);
                });
            }
            if (isGenreLabel(label)) {
                $row.find('a[href*="/genres/"], a[href*="chinese-subtitle"]').each((_, genreEl) => {
                    const $genre = $(genreEl);
                    const genre = buildGenreItem($genre.text(), $genre.attr("href") || "");
                    if (genre && !seenGenres.has(genre.id)) {
                        seenGenres.add(genre.id);
                        genreItems.push(genre);
                    }
                });
            }
        });

        // 简介提取：优先取 DOM 中的描述，去重后回退到 meta description
        let officialDescription = $("div.mb-1.text-secondary.break-all").first().text().trim();
        if (!officialDescription) {
            officialDescription = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || "";
        }
        if (officialDescription) {
            const jpTitle = (() => {
                let jt = "";
                $(".text-secondary").each((_, el) => {
                    const label = $(el).find("span").first().text().trim();
                    if (label === "标题:" || label === "標題:") { jt = $(el).find(".font-medium").text().trim(); return false; }
                });
                return jt;
            })();

            const normalizeStr = (s) => String(s || "").replace(/[\s_\-\|，,.:：、。！!?机制？()（）「」『』……+~～\x22']/g, "").toUpperCase();
            const dNorm = normalizeStr(officialDescription);
            const tNorm = normalizeStr(title);
            const jNorm = normalizeStr(jpTitle);

            // 如果简介和标题/日文标题完全一样，说明不是真简介，清空
            if ((tNorm && dNorm === tNorm) || (jNorm && dNorm === jNorm)) {
                officialDescription = "";
            } else {
                // 去掉简介里混入的标题/番号等重复文本
                if (title) officialDescription = officialDescription.split(title).join("");
                if (jpTitle) officialDescription = officialDescription.split(jpTitle).join("");
                if (code) {
                    officialDescription = officialDescription.split(code).join("").split(code.toUpperCase()).join("").split(code.toLowerCase()).join("");
                    const codeNoHyphen = code.replace(/-/g, "");
                    if (codeNoHyphen) officialDescription = officialDescription.split(codeNoHyphen).join("").split(codeNoHyphen.toUpperCase()).join("").split(codeNoHyphen.toLowerCase()).join("");
                }
                officialDescription = officialDescription
                    .replace(/在\s*MissAV\.ai\s*上免费高清在线观看|在\s*MissAV\s*上免费观看|免费高清在线观看|在线观看|免费观看|高清|视频|观看/gi, "")
                    .replace(/^[\s,.:：、，。\-–—_]+/g, "").trim();
            }
        }

        // UUID 提取（与 missavovo.js 方案一致）
        let uuid = "";
        $("script").each(function(i, el) {
            const c = $(el).html() || "";
            const m = c.match(/surrit\.com\/([a-f0-9\-]+)/);
            if (m) { uuid = m[1]; return false; }
            if (!uuid && c.includes("eval(function")) {
                const um = c.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/);
                if (um) uuid = um[0];
            }
        });

        // 多路并行：JavTrailers 剧照 + 预告片 + 回退推荐 + 演员头像
        const dvdId = extractDvdIdFromMissAv($, link);
        const trailerTitle = title || $('meta[property="og:title"]').attr('content') || "";

        // 亚洲AV/素人（麻豆、SIRO、S-CUTE 等）没有标准番号，搜不到 JavTrailers 和预告片，跳过
        const dvdPrefix = dvdId ? parseJavCodeParts(dvdId) : null;
        const dvdUpper = dvdId ? dvdId.toUpperCase() : "";
        const isAsianAv = (dvdPrefix && ASIAN_AV_DVD_PREFIXES.has(dvdPrefix.prefix))
            || (dvdUpper && Array.from(ASIAN_AV_DVD_PREFIXES).some(p => dvdUpper === p || dvdUpper.startsWith(p + "-") || dvdUpper.startsWith(p + "_")));

        // 同步解析推荐视频（纯 DOM，无需网络）
        const relatedItems = extractRelatedItems($, link);

        // 回退推荐视频请求：提前发起，与 JavTrailers 并行
        const fallbackItemsPromise = (relatedItems.length === 0 && peoples.length > 0)
            ? loadList({ peopleId: peoples[0].id, page: 1 })
                .then(f => Array.isArray(f) ? f.filter(v => extractVideoId(v.id) !== extractVideoId(link)).slice(0, 8) : [])
                .catch(() => [])
            : Promise.resolve(relatedItems);

        // 演员头像请求：同样提前到与 JavTrailers 并行
        const avatarPromise = peoples.length > 0
            ? Promise.all(peoples.map((p) => p.avatar || resolvePeopleAvatar(p.id)))
            : Promise.resolve([]);

        // Worker 画质获取（与 missavovo.js 方案一致）
        const qualitiesPromise = uuid
            ? (async () => {
                const worker = gs("worker");
                const lines = worker ? await gl(worker, uuid) : null;
                if (lines && lines.length) return lines;
                const cdn = "https://surrit.com/" + uuid;
                const qualities = [{ label: "720P", url: cdn + "/720p/video.m3u8" }];
                // 探测 1080p 是否存活，避免拿不到资源却强制展示（如中文字幕版没有 1080p 源）
                try {
                    const probeResp = await Widget.http.get(cdn + "/1080p/video.m3u8", {
                        headers: { "User-Agent": HEADERS["User-Agent"], "Referer": "https://missav.ai/" },
                        timeout: 1500
                    });
                    if (probeResp && probeResp.statusCode === 200 && String(probeResp.data || "").includes("#EXTM3U")) {
                        qualities.unshift({ label: "1080P", url: cdn + "/1080p/video.m3u8" });
                    }
                } catch (e) {}
                return qualities;
            })()
            : Promise.resolve([]);

        const [jtMeta, trailerUrl, fallbackItems, avatarUrls, qualityLines] = await Promise.all([
            // JavTrailers 剧照（超时 2500ms）— 亚洲AV 没有标准番号，搜不到，直接跳过
            !isAsianAv && dvdId ? fetchJavTrailersMeta(dvdId) : Promise.resolve({ detailUrl: "", contentId: "", backdropPath: "", backdropPaths: [], trailers: [] }),
            // 预告片地址 — 亚洲AV 跳过
            !isAsianAv ? buildPreferredTrailerUrl(dvdId || trailerTitle) : Promise.resolve(""),
            // 回退推荐视频
            fallbackItemsPromise,
            // 演员头像（与上面所有网络请求并发）
            avatarPromise,
            // Worker 画质列表（与 missavovo.js 方案一致）
            qualitiesPromise
        ]);

        const detailCode = extractVideoId(link);

        // DOM 推荐有内容就用 DOM 的，否则用回退的
        const finalRelatedItems = relatedItems.length > 0 ? relatedItems : fallbackItems;
        const trailerCoverUrl = buildTrailerCoverUrl(trailerTitle) || buildMissavListCoverUrl(link);
        const trailers = [];
        if (trailerUrl) {
            trailers.push({
                coverUrl: trailerCoverUrl,
                posterPath: trailerCoverUrl,
                backdropPath: trailerCoverUrl,
                image: trailerCoverUrl,
                thumbnail: trailerCoverUrl,
                url: trailerUrl
            });
        }

        // MissAV 原始封面
        const missavCover = $('meta[property="og:image"]').attr('content') ||
            $('meta[name="twitter:image"]').attr('content') ||
            $('video').attr('poster') ||
            $('img').first().attr('data-src') ||
            $('img').first().attr('src') ||
            "";

        // AVDB 方案：高清封面候选
        const detailCandidates = buildImageCandidatesFromValue(detailCode);
        const fourhoiCover = detailCode ? `https://fourhoi.com/${detailCode.toLowerCase()}/cover-t.jpg` : "";

        if (uuid) {
            // 竖图：DMM/MGStage 候选 → fourhoi → MissAV 原始图
            var detailPosterCover = chooseFirstCandidate(detailCandidates.posterCandidates) || fourhoiCover || resolveUrl(missavCover) || "";
            // 横图：DMM/MGStage 候选 → MissAV 原始图 → fourhoi
            var detailBackdropCover = chooseFirstCandidate(detailCandidates.backdropCandidates) || resolveUrl(missavCover) || detailPosterCover;

            // 构建多画质 stream 列表（参考 AVDB buildMissavStreamItems 格式）
            const episodeItems = qualityLines && qualityLines.length > 0
                ? qualityLines.map(function(l) {
                    return {
                        id: l.label,
                        type: "url",
                        title: l.label,
                        name: "MissAV " + l.label,
                        link: "missav:" + uuid + ":" + l.label + ":" + encodeURIComponent(l.url),
                        customHeaders: {
                            Referer: "https://missav.ai/",
                            Origin: "https://missav.ai"
                        }
                    };
                  })
                : [];

            const item = {
                id: link,
                type: "video",
                title: getVersionTag(link) + title,
                description: officialDescription,
                link: link,
                posterPath: detailPosterCover,
                episodeItems: episodeItems,
                actors,
                trailers,
                mediaType: "movie",

                // 详情页竖图字段：高清竖图
                coverUrl: detailPosterCover,
                posterPath: detailPosterCover,

                // 详情页横图字段：高清横图
                detailPoster: detailBackdropCover,
                backdropPath: detailBackdropCover,
                image: detailBackdropCover,

                // 剧照数组仍然保留 JavTrailers 的结果
                backdropPaths: [
                    ...(jtMeta.backdropPath ? [jtMeta.backdropPath] : []),
                    ...(jtMeta.backdropPaths || [])
                ],

                // 详情页推荐视频
                relatedItems: finalRelatedItems,

                customHeaders: {
                    Referer: "https://missav.ai/",
                    Origin: "https://missav.ai"
                }
            };

            if (peoples.length) item.peoples = peoples;
            if (genreItems.length) item.genreItems = genreItems;

            if (item.peoples && avatarUrls.length) {
                for (let i = 0; i < avatarUrls.length; i++) {
                    item.peoples[i].avatar = avatarUrls[i] || "";
                    if (actors[i]) actors[i].avatar = avatarUrls[i] || "";
                }
            }

            return [item];
        }
        return [{ id: "err", type: "text", title: "解析失败", subTitle: "未找到播放地址" }];
    } catch (e) {
        return [{ id: "err", type: "text", title: "请求错误", subTitle: e.message }];
    }
}
