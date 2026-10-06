// ==================== 115 Forward Module v1.6.0 ====================
// 功能：
//   1. 浏览 115 网盘文件夹，展示视频/文件夹列表，点击进入详情页聚合播放
//   2. 作为 Stream Source，在番号详情页下方匹配 115 文件，提供 HLS 播放源
//   3. 115detail:// pickcode 直播放，不依赖番号 / extractNumber / searchFiles
//   4. 115folder:// 文件夹作为媒体条目，内部视频作为播放源，支持多视频播放源弹窗
//   5. (v1.3.7) 列表页 Fast Visual Index: 封面由番号规则构造，列表页不请求外部 API
//   6. (v1.3.7) 运行时 meta cache: 详情页 MissAV 成功后回写内存缓存，列表页 unsupported-jav 可复用 MissAV 封面
//   6. (v1.3.6, 内部实验功能) 离线下载 relatedItems：详情页 episodeItems 区域显示 Sukebei 磁力候选，用户点击确认后提交 115 离线
//      默认关闭。将 ENABLE_OFFLINE_RELATED_ITEMS 设为 true 即可启用。
//   7. 多分辨率播放源：BD(4K) / UD(1080P) / HD(720P)，无番号文件也能返回所有清晰度
//  16. (v1.3.9) JAV 番号文件夹详情页: 115javfolder:// 路由，文件夹内视频作为播放资源
//  17. (v1.4.0) 远程 Forward Index: 通过 GitHub raw URL + resolver 提取 code，
//       查 remote index.byCode[code].cid 作为 DMM content id，
//       复用 Forward 内部 DMM 封面策略，提升列表页封面覆盖率。
//       支持 forwardIndexUrl / forwardIndexVersion 全局参数。
//  18. (v1.5.0) JAV 元数据增强服务：所有 JAV 详情/封面改走局域网元数据服务
//       (POST {javApiBase}/api/v1/scrape, Bearer Token)，移除 MissAV 搜索。
//       规则封面优先（快速路径），服务兜底并填充富数据（日文标题/演员/标签/
//       剧照/预告/评分）。三级缓存：内存 → Widget.storage(300条LRU/7天) → 服务。
//  19. (v1.5.1) 修复详情页元数据缺失：loadDetail 运行在全新 JS 上下文（无 params
//       注入，全局配置为空）→ 服务配置持久化到 Widget.storage，enrich 前惰性恢复。
//       实时抓取只在详情页，超时 30s（服务端最坏 21s）。
//  20. (v1.5.2) 列表页恢复温和实时抓取（并发2/单条8s/预算8s/熔断3），缓存优先；
//       失败写负缓存 1h（storage 持久化）防重复打扰服务端，详情页 ignoreNegative
//       强制重试。mgstage 盲拼封面（常 403/404）让位于服务端验证过的海报。
//  21. (v1.6.0) 演员/标签/片商点击浏览（r18.dev 直连，纯增量，局域网服务仍是主源）：
//       详情页附带拉取 r18.dev detail JSON 标注可点击 id（actress 的 dmm_id 与
//       r18.dev id 同源，免请求）；点击 → loadFolder 新分支调
//       /videos/vod/movies/list2/json（官网同源列表 API，100条/页带分页）；
//       影片卡片 link=115javmeta://<content_id> → 新详情路由（r18 detail 构建富
//       详情，服务缓存命中时合并）→ 播放走 loadResource 番号匹配 115 文件。
//  22. (v1.7.0) 元数据源切换：移除局域网 JAV 元数据服务依赖，所有 JAV 元数据
//       （详情/封面/列表回填）统一走 r18.dev 直连（combined=/dvd_id= 双端点），
//       命中后用已验证 content_id 构造 DMM ps/pl 大图；列表页封面回填扩大到
//       全部 JAV 条目（缓存优先 + 负缓存 + 预算熔断）。移除预告片区块（r18.dev
//       无预告数据，不盲拼 URL）。移除自用远程 forwardIndexUrl 与 index-dmm
//       封面策略。
//  23. (v1.7.1) 修复列表回填被 r18.dev 突发限流（429）打断的问题：429/网络错误
//       不再写负缓存、不计熔断（此前被误判"未收录"投毒 1h，now printing 占位图
//       滞留）；新增 429 指数冷却（3s→30s）+ 列表并发 1 + 请求间隔 400ms 限速；
//       无封面条目优先回填；单条超时 8s→5s。
//  24. (v1.7.2) 封面管线重构（移植 dmm-hd-cover 存在性探测）：awsimgsrc 对缺失图
//       回干净 404 → GET+Range 小请求即可判定，双层缓存（命中 30 天/miss 3 天）。
//       列表回填改两阶段：① 白名单盲拼/无图条目先做 cid 变体探测（映射/填充/
//       短码），命中直接上卡，零 r18 请求；② 探测全 miss 才走 r18.dev。
//       修复 r18 短码 content_id（jur834）构造 404 URL 覆盖好图的回归（now
//       printing 的第二个根因）。白名单同步 dmm-hd-cover 版（+ACHJ/CJOD/DVAJ/
//       JYMA/EBWH/MDHR/MIRD），BLOCKED_CODES 黑名单引入。
//  25. (v1.7.3) 修复 Forward 对非 2xx 抛异常导致的误判：r18.dev 404 以异常形式
//       出现（"unacceptable: 404"），被归为限流触发冷却、永不写负缓存，少数番号
//       每次翻页重复请求且始终无封面。现从异常消息还原状态码：404 → miss（进
//       负缓存），429 → 限流冷却，超时 → 暂时失败。探测引擎同样加固。
//  26. (v1.8.0) ① 尾字母后缀容错：MIAD-812U 这类发行标记后缀在变体探测与 r18
//       查询中自动尝试去后缀形态（MIAD-812 实测命中）；② LibreFanza
//       (libredmm.com) 兜底：r18.dev 双形态未收录的番号（NACT-170 等）从其
//       服务端渲染页提取真实 digital cid + 标题，探测验证后入缓存；负缓存
//       语义不变（双源都确认未收录才写）。③ mgstage 条目不再进 r18 队列：
//       变体探测 DMM 命中则升级 ps/pl，miss 保留有效盲拼图（实测 ABF-381
//       的 mgstage 图存在，r18 独占内容查询纯属浪费）。
//  27. (v1.8.1) 修复 LibreFanza slug 前导零：显示形态番号（NAAC-071/TIMD-041）
//       的 number 被去零成 naac-71/timd-41 导致兜底 404。LibreDMM 路由用官方
//       显示形态（含前导零），仅 content_id 形态输入才去零。
//  28. (v1.8.2) 修复详情页成功后负缓存未真正清除：负缓存表是惰性加载的，而
//       详情页（ignoreNegative）跳过了负缓存检查，内存表从未加载 →
//       clearJavNegative 的 if 守卫跳过删除 → storage 里的负缓存永不消失，
//       列表永远拦截、重启无效（实测 TIMD-041/NAAC-071 详情有封面但列表
//       始终没有）。现在 clearJavNegative/markJavNegative 先确保表已加载，
//       详情页成功即解锁列表回填，无需等待 1 小时负缓存过期。
//  29. (v1.8.3) 部分 Forward 环境的 storage 写入不跨上下文落地（实测：负缓存
//       标记后下次列表仍重试、探测缓存每次全量重跑）。列表回填改为：负缓存只
//       拦 10 分钟内的失败（陈旧快照里的老负缓存不再永久拦截 TIMD-041/
//       NAAC-071）；探测阶段预算上限 60%，剩余保给 r18/LibreFanza 修正队列
//       （此前探测吃光 15s 预算，修正队列被 skipped 截断）；探测不确定的条目
//       也进修正队列；backfill 日志输出处理/回填番号清单便于排查。
//  30. (v1.8.4) 预算放宽：整页 15s → 20s、探测占比 60% → 70%（探测窗口
//       9s → 14s，修正队列保底 6s 不变）、探测并发 3 → 4。预算上限是
//       loadFolder 同步阻塞的体验约束，与请求频率无关（探测走 DMM 图片
//       CDN，1KB Range 小请求，宽容）。
//  36. (v1.9.0) 列表加载提速：探测并发 4 → 6；direct-dmm（白名单盲拼）条目
//       改为单探测已上卡的盲拼 cid（探测请求量在白名单多的页面减半）。
//       实测基线：每页总耗时 12~22s（首次），重复访问 5~14s（探测缓存在
//       会话内生效）；其中 115 拉取 <1~2s，探测 8~13s，救援 1.5~2.5s/番号。
//  37. (v1.10.0) 封面回写闭环 + 预算收紧（吸收两轮外部评审）：
//       ① 持久化缓存从"整表 JSON + LRU"改为按番号小 key 的紧凑封面索引
//         pan115-cover:<番号>（{p,b,s,t}，~200B）；富元数据不再持久化，由内存
//         及详情宿主缓存承担（详情 60s 缓存过期后重新抓取富数据属预期行为，
//         不是 bug）。探测命中/救援命中/详情成功/legacy 按需提升四路全部写入，
//         主键一律用请求方 canonical 番号（MIAD-812U 写 MIAD-812U）。
//       ② 列表正缓存前置：内存 → cover entry → legacy，命中即覆盖盲拼图 +
//         清理矛盾负缓存 + 同番号去重广播；未命中才进负缓存检查与探测。
//       ③ 救援阶段重排：LibreFanza 并发 2（403/429 熔断即停、连续 3 个 5xx/0
//         结束），r18 严格串行；移除 sleepMs 间隔（真实 loadFolder 上下文无
//         setTimeout，间隔从来是 no-op）。LibreFanza 三态化：200 但解析失败
//         归 transient（页面改版/反爬不可当 definitive miss 污染负缓存）；
//         负缓存只在 Libre+r18 双源 definitive miss 且全程无 transient 时写。
//       ④ 预算语义收紧：详情 30s 总预算（JAV_DETAIL_DEADLINE_MS），列表救援
//         全部请求按剩余时间收缩 timeout，超预算 deadline 型失败不触发冷却、
//         不写负缓存。
//       ⑤ 详情页已验证封面兜底：pan115-cover: 命中优先于规则盲拼，富抓取
//         失败/超时时至少保留封面。
//       ⑥ 观测：backfill 日志区分 coverCache 命中来源（memory/entry/legacy/
//         written）与探测网络请求（netStage1/netVerify/cacheHit，实际进入
//         Widget.http.get 的计数）——用于验证小 key 在真实环境的跨上下文
//         可见性，再决定 cacheDuration 300→60（v1.10.1 候选）。
//  38. (v1.10.1) 列表宿主缓存 300s → 60s：v1.10.0 的观察条件已全部拿到真实
//       日志实证——pan115-cover: 小 key 跨上下文读/写成立（FPRE-239/DLDSS-541/
//       CRNX-342 跨页命中），热列表重访 949ms / probeNet=0 / 10:cache。缓存
//       过期重载代价约 1s，把"详情成功 → 返回列表见新封面"的窗口从 5 分钟
//       缩到 1 分钟（App 侧 60s 内返回仍直接复用宿主缓存，不会更频繁打 115）。
//  39. (v1.10.2) 数字前缀系列（mgstage 独占厂牌）救援打通（真实 URL 验证驱动）：
//       259LUXU/300MIUM/328CNSTV 这类番号在 DMM/Libre 的显示形态会去掉厂牌数字
//       前缀，且号码补零与否因系列而异（luxu-957 去零 ✓ / cnstv-027 保留 ✓）。
//       ① librefanzaUrl → librefanzaUrlCandidates：数字前缀番号生成"号码原样 +
//         号码去零"两个 slug 候选按序尝试（404 才换下一候选，transient 立即返回）；
//       ② parseLibreFanzaPage 增加回退路径：页面无 DMM 图时提取内嵌的
//         image.mgstage.com 官方商品图（pf_=正面海报 pb_=背面）+ mgstage 商品号；
//         页面提供的 URL 直接采信（mgstage 域名区域 403 与不存在无法区分，不探测）；
//       ③ verifyMetaCoverUrls 对 mgstage 来源 meta（noDmmVerify）跳过 DMM 探测；
//       ④ 实测身份：259LUXU-0957（文件写法）= mgstage 259LUXU-957 = ラグジュTV 939
//         乾春香（sukebei 标题与文件名演员一致）；328CNSTV-027 另有 DMM 数字版
//         h_1472cnstv00027（awsimgsrc ps/pl 206 实测存在，走现有探测升级大图）。
//  40. (v1.11.0) FC2 识别与救援（fc2-ppv-4544804 实测驱动）：
//       ① extractStandardCode 的 FC2 拒绝改为识别：规范形态 FC2-4544804（剥
//         PPV，与 LibreDMM slug 一致）——列表 enrich key / 详情查询 / cover
//         索引键由此打通（此前全部断链）；
//       ② slug：FC2 分支 → fc2-<号码>（实测 fc2-4544804 ✓ / fc2ppv-4544804 ✗）；
//       ③ 解析第三路径：FC2 页面内嵌官方内容缩略图（contents-thumbnail2.fc2.com）
//         + 标题 + 发行日期；缩略图 URL 会随内容过期（失效 = 404 + "No Image"
//         独角兽占位 body，实测），必须存在性探测（200 采信/404 及不确定降级
//         纯标题），绝不能直接采信页面 URL；
//       ④ 详情：FC2 键跳过 r18（结构性无收录）直走 Libre，显示真实日文标题/日期；
//       ⑤ 列表：FC2 跳过 DMM 探测直入救援；缩略图存活 → 上卡 + cover 索引；
//         失效/miss → 负缓存停止重试（不计 r18 熔断，FC2 密集页不饿死正常救援）。
//  41. (v1.11.1) 诊断增强：detail/javmeta 日志增加实际渲染标题（title 字段），
//       用于区分"模块未返回标题"与"Forward 未渲染标题"。附 13:54 重启后实测
//       结论：Widget.storage 跨进程重启不落地（重启后两次列表 entry=0、
//       cacheHit≈0、同一批番号全量重解析）——会话内 cover 索引可靠、跨进程
//       无效，重启后首次进列表的全量冷跑（~10-12s）由此而来，属宿主存储行为。
//  44. (v1.13.0) 剧照马赛克根治 + 冷加载治理（v1.6.0 对照实测驱动：同机同网
//       v1.6.0 剧照高清、详情秒开，v1.12.1 剧照马赛克、每次冷加载）：
//       ① 移除 legacy 元数据整表（pan115-jav-meta-cache）读取：Forward URL
//         缓存取证实锤 v1.12.1 详情上屏的是 120×90 缩略图（snos00065-7.jpg
//         实测 120×90 / 8KB），逐字来自 v1.7.x 时代写入 storage 的旧快照
//         （错误 cid snos065、发行日期 08-11，r18.dev 现值 08-07）——getCached
//         JavMeta 的 storage 兜底读到即中毒。v1.6.0 不读此表（走局域网刮削
//         服务，剧照 jp-N 大图 534×800），对照成立。富元数据自此零 storage
//         读取，跨上下文复用仅剩 pan115-cover: 紧凑封面索引（无剧照字段）；
//       ② 剧照防御 sanitizeJavStills：{cid}-{N}.jpg 缩略图形态确定性升级为
//         {cid}jp-{N}.jpg 大图（r18.dev image_full 同源），源头
//         normalizeR18Detail 与唯一上屏点 buildJavDetailItem 双层拦截；
//       ③ 列表 cacheDuration 60 → 300（恢复 v1.6.0 行为）：模块更新即换
//         Forward 存储实例，旧实例 163 条 cover 新实例仅 3 条可读，缓存过期
//         即全量重探（netStage1 35 请求实测 9-11s）——宿主缓存窗口才是体感
//         正解，v1.10.1 缩短窗口的前提（跨上下文可靠读）不成立；
//       ④ detailCacheDuration 60 → 300：详情 60s 到期即重跑 r18+封面验证
//         探测，是"每次进详情都转圈"主因；富元数据 7 天缓存，宿主缓存拉长
//         无新鲜度损失。
//  45. (v1.14.0) 播放源消重 + 原画/转码并列展示（rex 日志取证驱动：单模块也
//       出现成倍"播放来源"）：
//       ① rex 实测：每次播放 loadResource 被调用恰好两次（非可信上下文预取 +
//         正式解析，两次共享同一 JS 上下文），两次结果都被收进来源列表——
//         单文件 ×2、10 集剧集 ×2=20 条。同上下文内按 link 缓存首次成功结果
//         （TTL 10 分钟、容量 8、空结果不缓存），第二次调用零网络且返回
//         逐字节相同的 source 数组（含 115 签名 URL），供播放器按 URL 折叠；
//       ② 播放源规则改为原画直链 + 转码 m3u8 变体并列展示，废除"有转码即
//         隐藏原画"的 v1.12.0 逻辑。命名区分：原画=原文件直链
//         "115 网盘 (原画 · 大小)"，转码="115 网盘 (转码·原画/高清/…)"；
//         原画在前列出。任一路径失败静默降级（冷却/网络异常至少保留另一方），
//         双失败才 0 源。代价：每次 loadResource 增加一次 downurl POST
//         （缓存使两次调用只发一次）。
//  43. (v1.12.1) 季集标记门禁补充（rex 1.12.0 实测回访：龙之家族/金特务剧集
//       文件夹播放已正常——原文件兜底与翻页去重生效，但标题仍显示 S03E-05 /
//       S01E-08）：S03E05 → 前缀 S03E + 号码 05 能同时骗过字母前缀/噪声表/
//       分辨率/年份四条规则。isJavNoiseCode 增加 /^(?:S\d+E?\d*|E\d+|EP\d*)$/
//       季集形态拒绝（S2M 等真实前缀不匹配；allowlist 前缀本就直通）。
//  42. (v1.12.0) 非 JAV 文件夹原样呈现 + 播放兜底（rex/Forward 双端实测驱动，
//       Magnet 目录 movie/剧集文件夹"标题损坏 + 找不到播放源"）：
//       ① listFolderAll 判停缺陷：115 对 offset >= count 重复返回最后一页，
//         而目录内 nfo/srt 杂项归一化时被丢弃，旧判停"归一化数量 >= total"
//         会反复翻页并把同一视频重复计入（实测 Zootopia 目录 mkv×2 → m3u8
//         重复请求 ×2）。改为按原始条目覆盖判停 + fid/pickcode/文件名跨页去重；
//       ② m3u8 空响应兜底：115 转码接口对部分文件返回 HTTP 200 + 0 字节（云
//         转码未完成/不支持，三端实测一致），此前静默 0 源。移植 115 downurl
//         加密栈（md5 + 115 对称/RSA），m3u8 失败/为空时走
//         proapi.115.com/app/chrome/downurl 原文件直链（source "115 网盘 (原
//         文件)"）——模块独立完整，不再依赖 AVDB 模块在场兜底（Forward 侧
//         此前能播全靠 AVDB 的 original-downurl，rex 里 AVDB 无 cookie 缺席）；
//       ③ 番号噪声门禁 isJavNoiseCode：generic/medium 路径产出的"番号"可能是
//         年份（2025 → 20-25）、分辨率（WEB-DL 1080P → DL-1080P / 1080P →
//         10-80P）、集数（EP01 → EP-01）、整词+年份（The Sheep Detectives
//         2026 → DETECTIVES-2026）——实测导致欧美/剧集文件夹标题损坏并误触发
//         JAV 详情与回填链路（r18.dev 404 → 3s 冷却 + Libre transient +
//         breaker）。门禁规则：前缀必含字母、噪声前缀表（EP/WEB/DL/BD/…）、
//         分辨率号码（1080/720/2160…±P/I）、年份号码（1927-2035）；
//         allowlist 真实番号前缀不受影响。extractStandardCode 的 generic 分支
//         同门禁，噪声一律返回空串 → 文件夹/文件回落原始名称展示（unknown
//         类型本就应原样呈现）。
//  33. (v1.8.7) 整页预算 20s → 30s（部分环境探测缓存不持久化，每次列表全量
//       重探就要 13~17s，20s 会截断救援队列）；backfill 日志增加逐条目结果
//       （outcomes: code:probe/filled/miss/limited），便于定位个别番号无封面
//       的环节。预算为每次调用独立重置，不跨列表共享。
//  35. (v1.8.9) 兼容 cid 形态番号（文件名直接写 cid，如 snis00776 = SNIS-776）：
//       解析器 compact 模式与 extractStandardCode 的贪心切分会把数字吞进前缀
//       （SNIS007-76）→ allowlist 不中 → mediaType unknown → 永不回填（实测
//       列表无封面、详情因 r18 接受 cid 形态反而正常）。两处均改为字母|数字
//       边界优先切分（数字混排前缀 T28-601、数字开头 300MIUM-1359 走回退），
//       cid 形态解析为 SNIS-00776 后走白名单盲拼 + 探测，零 r18 请求出封面。
//  34. (v1.8.8) 修复 LibreFanza mono 标题（MILK-298 实测）的 now_printing：
//       这类标题的真实封面在 mono/movie/adult/{cid}{尾缀}/ 路径（digital 路径
//       上的包图不存在，302 → 占位图）。LibreFanza 解析改为直接提取页面真实
//       显示的封面 URL（探测验证后使用），不再凭 cid 拼 digital 路径；cid 从
//       封面 URL 目录段提取（digital 优先，mono 回退）。
//  31. (v1.8.5) 修复 Forward loadFolder 上下文缺少 setTimeout 导致整页回填
//       中断（"Can't find variable: setTimeout"，第二次间隔等待即抛）——
//       单条目修正队列正常、多条目页面全部中止，TIMD-041/NAAC-071 所在页
//       长期无封面的真因。sleepMs 在无定时器环境退化为立即继续（并发 1 +
//       网络 RTT 天然限速，429 有冷却兜底）。
//  32. (v1.8.6) 救援路径提速：探测 miss = cid 变体全部落空，r18 的精确查询
//       几乎必然同样落空（真实 cid 常带厂前缀）——列表回填的修正队列改为
//       LibreFanza 优先（1 个请求拿真实 cid，省 2 个 r18 请求/番号），探测
//       阶段 quick 模式只探第一批变体（长尾交给兜底）。实测同页 6 个待救
//       番号此前被 20s 预算截断（SKMJ-775/ALOG-031），现可全部完成。
//   8. (v1.3.1) 欧美 Scene 弱匹配聚合：deeper.19.04.19 / vixen.20.08.14 (studio + date)
//   9. (v1.3.1) extractMatchKey 三层调度：JAV → Western(强) → WesternDate(弱)
//  10. (v1.3.1) scoreWesternFile 评分选片：排除 trailer/sample/preview，大文件优先
//  11. (v1.3.2) 抽象 Media Resolver：统一类型识别 + JAV prefix allowlist + Western blocklist
//  12. (v1.3.6-FVI) 列表页重构为 Fast Visual Index，封面由番号规则构造，仅详情页调用 MissAV
//  13. (v1.3.4) enrichViaMissav 新增 fetchDescription 参数控制
//  14. (v1.3.5) extractJavKey: allowlist gate → blocklist gate + confidence 分层
//               放宽分隔符模式准入，新增 JAV_PREFIX_BLOCKLIST
//  15. (v1.3.6) resolveMediaKeyFromParams: 三层字段扫描
//               优先字段 → 原 combined 兜底 → 递归全量兜底
//   - link 只放路由 + 纯 ASCII 番号（聚合触发信号），不编码中文/日文
//   - 完整标题/封面/文件名走 PICKCODE_FILE_MAP 内存缓存
//   - loadDetail 路由：115detail:// → 正常详情页 | offline-submit:// → 离线提交
//   - loadResource 路由：offline-submit:// → 离线提交 | 115detail:// → 直放 | 其他 → 番号搜索
//   - 磁力搜索是读操作，自动发生；115 离线提交是写操作，只在用户点击后发生
//   - 播放源统一走 loadResource → buildStreamSources → parseStreams
//
// 底层 API：
//   - 搜索文件：      GET webapi.115.com/files/search
//   - 浏览文件夹：    GET webapi.115.com/files?cid=xxx
//   - Master m3u8:   GET https://115.com/api/video/m3u8/{pickcode}.m3u8
//   - 磁力搜索：     Sukebei (HTML 抓取)
//   - 元数据补充：   r18.dev 公共 API（v1.7.0 起直连，无需鉴权）
//   - 离线提交：     POST 115.com/web/lixian/?ct=lixian&ac=add_task_url
//
// 授权方式：手动输入 Cookie（115.com 域下的登录态 Cookie）
//
// 播放形式：
//   1. 用 Cookie 请求 master m3u8 API
//   2. parseStreams 解析所有 #EXT-X-STREAM-INF 子流（NAME + RESOLUTION 双通道识别）
//   3. 子流 URL 已内嵌 CDN 签名参数，播放器无需额外 Cookie
//   4. 需在 customHeaders 中携带 Referer + User-Agent（CDN 校验用）

// ==================== 元数据定义 ====================
var WidgetMetadata = {
  id: "pan115_rex",
  title: "115 网盘",
  description: "浏览 115 网盘视频文件，提供番号匹配播放源",
  author: "eric",
  version: "1.15.0",
  requiredVersion: "0.0.1",
  site: "https://115.com",
  // v1.13.0: 60 → 300。详情响应由 Forward 宿主缓存 5 分钟，重复进入秒开；
  // 富元数据本身 7 天缓存，宿主缓存拉长无新鲜度损失（v1.10.0 起详情 60s 到期
  // 即重跑 r18+探测，是"每次进详情都转圈"的主因）。
  detailCacheDuration: 300,

  globalParams: [
    {
      name: "cookie",
      title: "115 Cookie",
      type: "input",
      value: "",
      placeholder: "填入 115.com 登录后的完整 Cookie"
    }
  ],

  search: {
    title: "搜索 115 文件",
    functionName: "searchPan115",
    params: [
      { name: "keyword", title: "关键词", type: "input", value: "" },
      { name: "page", title: "页码", type: "page", value: "1" }
    ]
  },

  modules: [
    {
      title: "浏览文件夹",
      description: "浏览 115 网盘视频文件列表",
      functionName: "loadFolder",
      requiresWebView: false,
      // v1.13.0: 60 → 300（恢复 v1.6.0 行为）。列表缓存过期重载的真实代价不是
      // 早期估算的 ~1s：Forward 存储读到的快照跨实例/跨进程不可靠（v1.11.1 已
      // 记录跨进程不落地；v1.12.1 实测模块更新即换实例，163 条 cover 只剩 3 条
      // 可读），过期即触发全量重探（netStage1 35 请求，实测 9-11s）。拉长宿主
      // 缓存窗口才是体感正解。
      cacheDuration: 300,
      params: [
        {
          name: "cid",
          title: "目录 ID",
          type: "input",
          value: "0",
          placeholder: "0=根目录，或其他文件夹 ID"
        },
        {
          name: "page",
          title: "页码",
          type: "page",
          value: "1"
        }
      ]
    },
    {
      id: "loadResource",
      title: "115 网盘",
      description: "匹配 115 网盘文件，提供 HLS 播放源",
      functionName: "loadResource",
      type: "stream",
      params: []
    }
  ]
};

console.log("[pan115] version: 1.15.0");
console.log("[pan115/version] 1.15.0");

// ==================== 全局状态 ====================
var COOKIE_115 = "";
// mediaKey 维度内存缓存：{ [mediaKey]: { meta, fetchedAt } }（仅本上下文；
// 跨上下文复用走 pan115-cover: 紧凑封面索引，见下方存储层说明）
var JAV_META_CACHE = {};
// v1.13.0: 旧版整表 key "pan115-jav-meta-cache" 的读取已整体移除。该表由
// v1.7.x 时代版本写入且永不再更新，内含错误 cid（snos065）与 DMM 120×90
// 缩略图剧照（{cid}-{N}.jpg），Forward 存储读到旧快照时命中即马赛克
// （v1.12.1 实测 SNOS-065/MEYD-726/MIDV-719）。跨上下文复用只走
// pan115-cover: 紧凑封面索引（仅封面 URL，无剧照）。
var JAV_META_CACHE_TTL = 7 * 24 * 3600 * 1000;  // 封面/元数据缓存有效期 7 天
// 负缓存：r18.dev + LibreFanza 双源确认未收录的番号 1h 内不再重试。
// 注意：429 限流/网络超时/预算耗尽绝不能写负缓存，否则限流恢复后列表页仍会
// 跳过 1h（v1.7.0 初版 now printing 复发的根因）。
var JAV_NEGATIVE_CACHE = {};
var JAV_NEGATIVE_STORAGE_KEY = "pan115-jav-negative";  // 旧整表 key（只读迁移）
var JAV_NEGATIVE_TTL = 3600 * 1000;
// 详情页单次抓取超时：r18.dev 正常 1~2s/请求；未收录番号 worst case 走
// combined → dvd_id → combined 三个请求，20s 留足余量
var JAV_DETAIL_TIMEOUT = 20000;
// 详情页整条链路总预算（v1.10.0）：r18 双端点 × 去后缀重试 × LibreFanza × 封面
// 验证叠加后理论等待远超单请求超时。每个请求发起前按剩余时间收缩 timeout，
// 到期返回已有结果且不写负缓存（超预算 ≠ 未收录）。
var JAV_DETAIL_DEADLINE_MS = 30000;
// 列表页回填：整页预算 30s（loadFolder 同步阻塞，用户已接受的体验上限）。
// 救援阶段 LibreFanza 并发 2（静态站，403/429 熔断即停 + 连续 3 个 5xx/0 结束），
// r18 严格串行（突发限流实测 2 秒 11 连发即 429，冷却兜底）。请求间不再使用
// sleepMs 间隔——真实 loadFolder 上下文没有 setTimeout（v1.8.5 实测），间隔
// 等待是 no-op；请求时长天然限速。429/超时/超预算不写负缓存、不计熔断。
var JAV_LIBRE_CONCURRENCY = 2;
var JAV_LIBRE_BREAKER_5XX = 3;           // 连续 5xx/0 次数上限（403/429 立即熔断）
var JAV_LIST_TIMEOUT = 5000;
var JAV_LIST_BUDGET_MS = 30000;
var JAV_LIST_BREAKER_LIMIT = 5;
// 探测阶段预算占比 70%（探测窗口 21s）：探测打到 DMM 图片 CDN（1KB Range 小
// 请求，宽容），上限的目的只是给救援队列保底 9s。探测提前完成时，剩余时间
// 自动全部让给救援。
var JAV_LIST_PROBE_BUDGET_RATIO = 0.7;
var JAV_LIST_PROBE_CONCURRENCY = 6;
// 列表回填的负缓存新鲜窗：只跳过 10 分钟内失败的番号（陈旧快照里的老负缓存不拦截）
var JAV_LIST_NEGATIVE_RETRY_MS = 10 * 60 * 1000;
// Forward 播放器评分（固定值，用于在列表页和详情页显示评分）
var DEFAULT_RATING = 10;
var PICKCODE_FILE_MAP = {};

// ==================== 常量 ====================
var API_115 = "https://115.com";
var WEB_API_115 = "https://webapi.115.com";
var TIMEOUT = 15000;
var SUKEBEI_BASE = "https://sukebei.nyaa.si";
var MAGNET_CACHE_TTL = 3600 * 1000;  // 1 小时

// ==================== 离线下载开关（内部实验功能） ====================
// Internal experimental feature.
// Disabled by default in shared builds.
// The offline-submit route is kept for private/manual use, but no visible
// relatedItems are generated unless ENABLE_OFFLINE_RELATED_ITEMS is true.
var ENABLE_OFFLINE_RELATED_ITEMS = false;

// ==================== Fast Visual Index 调试开关 ====================
var PAN115_FAST_INDEX_DEBUG = false;

// ==================== 115 索引文件名（仅用于从列表中隐藏历史遗留的 index 文件） ====================
var FORWARD_INDEX_FILENAME = ".forward-index.json";
var FORWARD_INDEX_FILENAME_FALLBACK = "forward-index.json";
var FORWARD_INDEX_FILENAME_UNDERSCORE1 = "_forward_index.json";
var FORWARD_INDEX_FILENAME_UNDERSCORE2 = "forward_index.json";

var FORWARD_INDEX_FILENAMES = [
  FORWARD_INDEX_FILENAME,
  FORWARD_INDEX_FILENAME_FALLBACK,
  FORWARD_INDEX_FILENAME_UNDERSCORE1,
  FORWARD_INDEX_FILENAME_UNDERSCORE2
];

function debugFastIndex(tag, payload) {
  if (!PAN115_FAST_INDEX_DEBUG) return;
  try {
    console.log(tag, payload);
  } catch (e) {
    console.log(tag + " " + JSON.stringify(payload));
  }

}

var BASE_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
  "Referer": "https://115.com/",
  "Origin": "https://115.com"
};

var VIDEO_EXTS = new Set([
  "mp4", "mkv", "avi", "wmv", "mov", "m4v",
  "ts", "flv", "rmvb", "webm", "3gp"
]);

var QUALITY_MAP = {
  BD: { label: "4K",    priority: 4 },
  UD: { label: "1080P", priority: 3 },
  HD: { label: "720P",  priority: 2 },
  SD: { label: "480P",  priority: 1 },
  LD: { label: "360P",  priority: 0 }
};

// ==================== 工具函数 ====================

function guessQualityFromResolution(width, height) {
  var h = Number(height || 0);
  if (h >= 2160) return { quality: "BD", label: "4K", priority: 4 };
  if (h >= 1080) return { quality: "UD", label: "1080P", priority: 3 };
  if (h >= 720)  return { quality: "HD", label: "720P", priority: 2 };
  if (h >= 480)  return { quality: "SD", label: "480P", priority: 1 };
  if (h >= 360)  return { quality: "LD", label: "360P", priority: 0 };
  return { quality: "", label: h ? (h + "P") : "", priority: -1 };
}

function getText(value) {
  return String(value || "").trim();
}

function formatSize(bytes) {
  if (!bytes && bytes !== 0) return "";
  var n = Number(bytes);
  if (isNaN(n) || n < 0) return "";
  if (n === 0) return "0 B";
  var units = ["B", "KB", "MB", "GB", "TB"];
  var i = Math.min(Math.floor(Math.log(n) / Math.log(1024)), units.length - 1);
  var v = (n / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0);
  return v + " " + units[i];
}

// v1.14.1: 播放源名称用紧凑体积（"4.3 GB" → "4.3G"，"850 MB" → "850M"）
function compactSize(bytes) {
  return formatSize(bytes).replace(/ (\w+)$/, function (_, unit) { return unit.charAt(0); });
}

function isVideoFile(filename) {
  var ext = String(filename || "").split(".").pop().toLowerCase();
  return VIDEO_EXTS.has(ext);
}

function extractNumber(text) {
  var clean = stripKnownNoisePrefix(stripFileExtension(String(text || "")));
  var key = extractJavKey(clean);
  return key && key.type === "jav" ? key.key : "";
}

function displayTitleFromFile(filename) {
  var number = extractNumber(filename);
  if (number) return number;
  var name = String(filename || "").replace(/\.[^.]+$/, "");
  return name.length > 50 ? name.slice(0, 50) + "..." : name;
}


function safeDisplayTitleFromFile(filename) {
  var s = String(filename || "");
  s = s.replace(/\.[a-zA-Z0-9]{2,5}$/, "");
  s = s.replace(/^[^@]{1,30}@/, "");
  s = s.replace(/[._]+/g, " ");
  s = s.replace(/\s+/g, " ").trim();
  return s || String(filename || "Untitled");
}
// ==================== 115 文件/文件夹工具函数 ====================

function get115Name(item) {
  return String(
    item && (
      item.filename ||
      item.name ||
      item.n ||
      item.fn ||
      item.fname ||
      item.title ||
      ""
    ) || ""
  );
}

function get115Pickcode(item) {
  return String(item && (item.pickcode || item.pc || "") || "");
}

function hasVideoExtension(name) {
  return /\.(mp4|mkv|mov|avi|wmv|flv|m4v|ts|webm)$/i.test(String(name || ""));
}

// ==================== isRaw115Folder ====================
// 注意：不要用 pc/pickcode 判断文件夹，因为 115 接口中文件夹也可能有 pc。
// 文件夹 = 有名称 + 有 cid + 无 fid/id + 名称不是视频扩展名
// 视频文件 = 有 pc + 有 fid/id + 名称是视频扩展名

function isRaw115Folder(item) {
  if (!item) return false;

  var name = get115Name(item);
  var hasName = !!name;
  var hasCid = !!item.cid;
  var hasFileId = !!(item.fid || item.id || item.file_id);
  var isVideo = hasVideoExtension(name);

  // 显式目录字段优先
  if (item.is_dir === 1 || item.is_dir === true) return true;
  if (item.isdir === 1 || item.isdir === true) return true;
  if (item.isFolder === true) return true;

  // 115 files 接口里，子文件夹可能也有 pc；
  // 但文件夹通常没有 fid/id，cid 是自身目录 id，且名称不是视频文件
  if (hasName && hasCid && !hasFileId && !isVideo) return true;

  return false;
}

function isRaw115VideoFile(item) {
  if (!item) return false;

  var name = get115Name(item);
  var pc = String(item.pc || item.pickcode || "");
  var hasFileId = !!(item.fid || item.id || item.file_id);

  // 视频文件 = 有 pc/pickcode + 有 fid/id + 名称是视频扩展名
  // 注意：文件夹也可能有 pc，所以同时要求 hasFileId + hasVideoExtension
  return !!pc && hasVideoExtension(name) && hasFileId;
}

function get115Cid(item) {
  if (!item) return "";
  // 文件夹优先用 fid/id（自身 id），而非 cid（可能为父目录 id）
  if (item.isdir) return String(item.fid || item.id || item.cid || item.file_id || "");
  return String(item.cid || item.fid || item.file_id || item.id || "");
}

function is115Folder(item) {
  return !!(item && item.isdir);
}

function is115VideoFile(item) {
  return !!(item && !is115Folder(item) && get115Pickcode(item) && isVideoFile(get115Name(item)));
}

// ==================== 欧美 Scene Key 提取 ====================

var WESTERN_NOISE = /\b(?:xxx|1080p|2160p|4k|mp4|mkv|x264|x265|hevc|web-dl|webdl|ktr|n1c)\b/gi;

function extractWesternSceneKey(text) {
  var s = getText(text).toLowerCase();
  if (!s) return null;

  // 1. 过滤噪音词
  s = s.replace(WESTERN_NOISE, "");

  // 2. 分隔符归一化：空白/下划线/冒号 → 点号，合并连续点号
  var clean = s.replace(/[_\s:]+/g, ".").replace(/\.+/g, ".").replace(/^\.|\.$/g, "").trim();
  if (!clean) return null;

  // 3. 找日期模式 YY.MM.DD
  var dateMatch = clean.match(/(\d{2})[-.](\d{2})[-.](\d{2})/);
  if (!dateMatch) return null;

  var dateStr = dateMatch[0];
  var dateIndex = dateMatch.index;
  if (dateIndex === undefined) return null;

  // 4. 日期之前 → 取紧邻日期前的一个 token 作为 studio（忽略前置噪声）
  var beforeRaw = clean.slice(0, dateIndex).replace(/\.+$/, "").replace(/^\.+/, "");
  var beforeParts = beforeRaw.split(".").filter(Boolean);
  var studio = beforeParts.length > 0 ? beforeParts[beforeParts.length - 1] : "";

  // 5. 日期之后 → performer
  var afterRaw = clean.slice(dateIndex + dateStr.length).replace(/^\.+/, "").replace(/\.+$/, "");
  var performerParts = afterRaw.split(".").filter(Boolean);

  // 6. 校验：至少需要 studio + performer
  if (!studio || !performerParts.length) return null;

  // 6b. performer 不能是短 hash（4-8 位字母数字），
  // 这种情况说明是带尾随 route id 的 western_date，不是 scene
  // 例如 detail:Np9xG:deeper.19.04.19 Np9xG 中 Np9xG 不是 performer
  if (performerParts.length === 1 && /^[a-z0-9]{4,8}$/.test(performerParts[0])) return null;

  var performerJoined = performerParts.join(".");
  var key = studio + "." + dateStr + "." + performerJoined;
  var searchText = studio;
  var strictTarget = (studio + dateStr.replace(/\./g, "") + performerJoined).replace(/[^a-z0-9]/g, "");
  var displayTitle = studio.charAt(0).toUpperCase() + studio.slice(1) + " " + dateStr + " " + performerParts.map(function(p) { return p.charAt(0).toUpperCase() + p.slice(1); }).join(" ");

  console.log("[pan115/extractWesternSceneKey] key:", key,
              "searchText:", searchText,
              "strictTarget:", strictTarget);

  return {
    type: "western_scene",
    confidence: "strong",
    key: key,
    displayTitle: displayTitle,
    searchText: searchText,
    strictTarget: strictTarget,
    studio: studio,
    date: dateStr,
    performer: performerJoined,
    source: "extractWesternSceneKey"
  };
}

function extractWesternDateKey(text) {
  // 先清理 Forward route 噪声
  var s = stripForwardRouteNoise(getText(text).toLowerCase());
  if (!s) return null;

  // 1. 过滤噪音词
  s = s.replace(WESTERN_NOISE, "");

  // 2. 分隔符归一化（含冒号）
  var clean = s.replace(/[_\s:]+/g, ".").replace(/\.+/g, ".").replace(/^\.|\.$/g, "").trim();
  if (!clean) return null;

  // 3. 找日期模式 YY.MM.DD
  var dateMatch = clean.match(/(\d{2})[-.](\d{2})[-.](\d{2})/);
  if (!dateMatch) return null;

  var dateStr = dateMatch[0];
  var dateIndex = dateMatch.index;
  if (dateIndex === undefined) return null;

  // 4. 日期之前 → 取紧邻日期前的一个 token 作为 studio（忽略前置噪声）
  var beforeRaw = clean.slice(0, dateIndex).replace(/\.+$/, "").replace(/^\.+/, "");
  var beforeParts = beforeRaw.split(".").filter(Boolean);
  var studio = beforeParts.length > 0 ? beforeParts[beforeParts.length - 1] : "";

  // 5. 只要求 studio + date（不要求 performer）
  if (!studio) return null;

  var key = studio + " " + dateStr;
  var searchText = studio;
  var strictTarget = (studio + dateStr.replace(/\./g, "")).replace(/[^a-z0-9]/g, "");
  var displayTitle = studio.charAt(0).toUpperCase() + studio.slice(1) + " " + dateStr;

  console.log("[pan115/extractWesternDateKey] extracted scene: \"" + (beforeParts.length > 1 ? beforeParts.slice(-2).join(".") : studio + "." + dateStr) + "\"  studio: \"" + studio + "\"  date: \"" + dateStr + "\"");
  console.log("[pan115/extractWesternDateKey] key:", key,
              "searchText:", searchText,
              "strictTarget:", strictTarget,
              "displayTitle:", displayTitle);

  return {
    type: "western_date",
    confidence: "weak",
    key: key,
    displayTitle: displayTitle,
    searchText: searchText,
    strictTarget: strictTarget,
    studio: studio,
    date: dateStr,
    source: "extractWesternDateKey"
  };
}

// ==================== Western 文件评分 ====================

var WESTERN_BAD_WORDS = ["trailer", "sample", "preview", "behind", "bts"];

function scoreWesternFile(file) {
  var fn = String(file.filename || "").toLowerCase();
  var score = 0;

  // 扣分：非正片关键词
  for (var wi = 0; wi < WESTERN_BAD_WORDS.length; wi++) {
    if (fn.indexOf(WESTERN_BAD_WORDS[wi]) !== -1) score -= 50;
  }

  // 大小加分/扣分
  var size = Number(file.size || 0);
  if (size >= 2 * 1024 * 1024 * 1024) score += 30;
  else if (size >= 1024 * 1024 * 1024) score += 20;
  else if (size >= 500 * 1024 * 1024) score += 10;
  else if (size > 0 && size < 100 * 1024 * 1024) score -= 20;

  // 文件名越长越可能是完整 scene
  if (fn.length > 30) score += 5;

  return score;
}

// [DEPRECATED v1.4.0] 请使用 resolveMediaKeyFromText / resolveMediaKeyFromParams
// 保留向后兼容，内部仍调用新 resolver
function extractMatchKey(text) {
  // [DEPRECATED v1.4.0] 使用新的 resolveMediaKeyFromText
  var mediaKey = resolveMediaKeyFromText(text, { source: "extractMatchKey(deprecated)" });
  if (!mediaKey || mediaKey.type === "unknown") {
    console.log("[pan115/extractMatchKey] no match");
    return null;
  }
  var result = {
    type: mediaKey.type === "western_scene" ? "western" : mediaKey.type,
    key: mediaKey.key,
    searchText: mediaKey.searchText,
    strictTarget: mediaKey.strictTarget,
    displayTitle: mediaKey.displayTitle
  };
  console.log("[pan115/extractMatchKey] type:", result.type, "key:", result.key);
  return result;
}


// ==================== Media Key Resolver ====================
// 来源: 2026-06-13 jav prefix allowlist.md

var WESTERN_STUDIO_BLOCKLIST = new Set([
  "DEEPER", "VIXEN", "BLACKED", "BLACKEDRAW", "TUSHY", "TUSHYRAW",
  "SLAYED", "MILFY", "BRAZZERS", "NUBILES", "BANGBROS",
  "REALITYKINGS", "RK", "MOFOS", "DIGITALPLAYGROUND", "DP",
  "PRIVATE", "NAUGHTYAMERICA", "TEAMSKSKEET", "FAKEHUB",
  "PASSIONHD", "PURETABOO", "MYPERVYFAMILY"
]);

var JAV_PREFIX_ALIASES = Object.freeze({
  LUXU: "259LUXU", MIUM: "300MIUM", GANA: "200GANA", MAAN: "300MAAN",
  SIRO: "SIRO", DCV: "277DCV", JNT: "390JNT", JAC: "390JAC",
  HHH: "451HHH", HLM: "436HLM", SYS: "332SYS", NAMA: "332NAMA",
  HEN: "353HEN", ARA: "261ARA", FCT: "326FCT", ERK: "420ERK",
  STH: "420STH", MLA: "476MLA", MMC: "812MMC"
});

var JAV_PREFIX_ALLOWLIST = new Set([
  // Numeric / alias style prefixes
  "200GANA", "230GANA", "24ID", "259LUXU", "261ADA", "261ARA",
  "277DCV", "300MAAN", "300MIUM", "326FCT", "332NAMA", "332SYS",
  "353HEN", "390JAC", "390JNT", "420ERK", "420STH", "436HLM",
  "451HHH", "476MLA", "812MMC",
  // A
  "ABF", "ABP", "ABS", "ABW", "ADN", "ADZ", "AKB", "AKBD",
  "ALB", "ALD", "AND", "ANIX", "ANND", "ARA", "ATAD", "ATHB",
  "ATID", "AYAKISAKI", "AZGB",
  // B
  "BBAN", "BBI", "BF", "BID", "BLK", "BMW", "BNDV", "BOKD", "BT",
  // C
  "CAWD", "CEMD", "CGAD", "CGBD", "CHN", "CHSD", "CHSH",
  "CJOD", "CLO", "CLUB", "CMV", "COSETT", "COSQ", "CR", "CRS",
  "CUSD", "CYCD",
  // D
  "DAN", "DANDY", "DASD", "DASS", "DBE", "DBUD", "DCV", "DER",
  "DLDSS", "DMG", "DOJ", "DOM", "DPMI", "DSAM", "DSD", "DSS",
  "DV", "DVAJ", "DVDES", "DVDPS", "DVH",
  // E
  "EBOD", "EDD", "ERK", "ESK", "EVO", "EYAN", "EZD",
  // F
  "FALENO", "FCDSS", "FCT", "FELLATIOJAPAN", "FGAN", "FINH",
  "FLAV", "FNS", "FSDSS", "FSET", "FSNF", "FST", "FTAV", "FTHTD",
  // G
  "GANA", "GAR", "GATE", "GDGA", "GDSC", "GEN", "GEXP", "GGFH",
  "GGTB", "GMMD", "GODS", "GOMD", "GOMK", "GPTM", "GRET",
  "GRYD", "GSAD", "GSHRB", "GTRL", "GVH", "GXXD", "GYD",
  // H
  "HAWA", "HAVD", "HBAD", "HEN", "HEYZO", "HHH", "HHK", "HITMA",
  "HLM", "HMN", "HND", "HODV", "HONB", "HRDV", "HUNT", "HUNTA",
  "HUNTB", "HYK",
  // I
  "IBW", "IDBD", "IDOL", "IENE", "IESP", "INU", "IPBZ", "IPIT",
  "IPITD", "IPSD", "IPTD", "IPVR", "IPX", "IPZ", "IPZZ",
  // J
  "JAC", "JBD", "JDSY21", "JHZD", "JMSZ", "JNT", "JOB", "JUC",
  "JUFE", "JUQ", "JUKD", "JUL", "JULIA", "JUR", "JURD", "JUSD",
  "JUTA", "JUX", "JUY",
  // K
  "KAPD", "KAWD", "KBR", "KBH", "KIBD", "KIPX", "KIRD", "KISD",
  "KTB", "KUF", "KUSE", "KWBD",
  // L
  "LADY", "LAF", "LAFBD", "LEGSJAPAN", "LOO", "LULU", "LUXU",
  // M
  "MAAN", "MADA", "MAN", "MAS", "MBDD", "MBRBA", "MBRBB", "MBRBC",
  "MBRBD", "MBRBN", "MBYD", "MCY023", "MD0250", "MD032", "MD034",
  "MD036", "MDCN000", "MDL0010", "MDS", "MDSR0005", "MDSR0007",
  "MDWP003", "MDYD", "MEK", "MEYD", "MGJH", "MGR", "MIAA",
  "MIAB", "MIAD", "MIAE", "MIAS", "MIBD", "MIDA", "MIDD", "MIDE",
  "MIDV", "MIFD", "MIGD", "MIID", "MILD", "MIMK", "MIRD", "MIUM",
  "MIZD", "MKBD", "MKCK", "MKMP", "MLA", "MMC", "MMND", "MMO",
  "MOC", "MOED", "MOGI", "MOND", "MOX", "MSBD", "MUDR", "MUKD",
  "MUM", "MV", "MX", "MX3DS", "MXGS", "MXVR",
  // N
  "N", "NAAC", "NAMA", "NATR", "NEXD", "NFDM", "NGKS", "NHDT",
  "NHDTA", "NHDTC", "NITR", "NMSL", "NSFS", "NSS", "NTR", "NWF",
  // O
  "OBA", "OFCD", "OFJE", "ONED", "OPD", "OPEN", "ORE", "OVVR",
  // P
  "PAED", "PBD", "PGD", "PJD", "PM10", "PPP", "PPPD", "PPPE",
  "PPT", "PRBY", "PRBYB", "PRED", "PRTD", "PXV", "PYO",
  // R
  "RAY", "RBD", "RBS", "RCT", "RCTD", "RD", "REAL", "REBD",
  "REBDB", "RED", "REID", "RGI", "RJMD", "RMDBB", "RMDS", "RMLD",
  "RNHDT", "ROE",
  // S
  "S2M", "S2MCR", "SACE", "SAD", "SAMA", "SATM03", "SCOP",
  "SDAB", "SDDE", "SDDM", "SDJS", "SDMM", "SDMS", "SDMT", "SDMU",
  "SDNM", "SDSI", "SEND", "SERO", "SHKD", "SHP", "SI", "SIRO",
  "SIVR", "SKOT", "SKY", "SKYHD", "SMBD", "SMD", "SNIS", "SNOS",
  "SOE", "SODS", "SONE", "SPERMMANIA", "SPRD", "SPS", "SQTE",
  "SRXV", "SS", "SSIS", "SSNI", "SSPD", "STAR", "STARS", "START",
  "STH", "SUPD", "SVDVD", "SVMGM", "SVND", "SYS",
  // T
  "T28", "TBB", "TBL", "TBW", "TD", "TDLN", "TDP", "TEAM", "TEK",
  "TGGP", "THP", "THZ", "TKIPX", "TMD", "TMS", "TMSD", "TOR",
  "TPPN", "TRE", "TSDL", "TSGS", "TSW", "TSWN", "TTRE", "TYOD", "TZZ",
  // U
  "ULJM", "UPSM", "URE",
  // V
  "VAGU", "VDD", "VEMA", "VENU", "VOL", "VRTM", "VSPDR", "VSPDS",
  // W
  "WAAA", "WABB", "WANZ", "WPC", "WSA",
  // X
  "XV", "XVSE", "XVSR",
  // Y
  "YMDD", "YNO", "YRZ",
  // Z
  "ZARD", "ZATS", "ZDAD", "ZKV", "ZUKO", "ZZR"
]);

// ==================== JAV_PREFIX_BLOCKLIST ====================
// 明确不是 JAV 的一般性前缀。Western 大厂名由 WESTERN_STUDIO_BLOCKLIST 覆盖。
var JAV_PREFIX_BLOCKLIST = new Set([
  "WWW", "HTTP", "HTTPS", "VIDEO", "MOVIE", "SAMPLE", "TRAILER",
  "PART", "DISC", "CD", "DVD", "BLURAY", "CLIP", "PREVIEW",
  "EXTRA", "BONUS", "SCENE", "CHAPTER"
]);

// ==================== Resolver 工具函数 ====================

function normalizeForMatch(text) {
  return String(text || "").replace(/[^a-z0-9]/gi, "").toLowerCase();
}

function normalizeSpaces(text) {
  return String(text || "").replace(/[_\s]+/g, " ").trim();
}

// ==================== probe115CoverFields — 探测 raw item 中的封面相关字段 ====================
function probe115CoverFields(raw) {
  var keys = Object.keys(raw || {});
  var suspiciousKeys = keys.filter(function(key) {
    return /cover|thumb|image|img|pic|poster|snapshot|icon|ico|sha|fid_cover|file_category/i.test(key);
  });
  var picked = {};
  suspiciousKeys.forEach(function(key) {
    picked[key] = raw[key];
  });
  return picked;
}
function stripFileExtension(text) {
  return String(text || "").replace(/\.(mp4|mkv|avi|wmv|mov|m4v|ts|flv|rmvb|webm|3gp)$/i, "");
}

function stripKnownNoisePrefix(text) {
  var s = String(text || "");
  // 去掉域名前缀: hhd800.com@, hhb800.com@, xxx.yyy@
  s = s.replace(/^[A-Za-z0-9]+(?:\.[A-Za-z0-9]+)+@/, "");
  // 去掉已知资源站脏前缀(域名无@后缀时): HHD800, HHB800
  s = s.replace(/^(?:HHD800|HHB800)[_\-@.\s]?/, "");
  return s;
}

function stripForwardRouteNoise(text) {
  var s = String(text || "");
  // 去掉 detail:Np9xG: 前缀（含前置如 Np9xG detail:Np9xG: 形式）
  s = s.replace(/^(?:[A-Za-z0-9]{4,6}\s+)?detail:[A-Za-z0-9]+:/i, "");
  // 去掉裸 route id 前缀（独立短 hash，不包含点号，紧接 Western studio）
  s = s.replace(/^(?:[A-Za-z0-9]{4,6}\s+)?(deeper|vixen|blacked|blackedraw|tushy|tushyraw|slayed|milfy|brazzers|nubiles|bangbros|realitykings)/i, "$1");
  // 去掉尾部 route id（形如 4-8 位字母数字，位于内容末尾）
  s = s.replace(/\s+[A-Za-z0-9]{4,8}\s*$/, "");
  return s.trim();
}

// ==================== isAllowedJavPrefix ====================

function isAllowedJavPrefix(prefix) {
  var p = String(prefix || "").toUpperCase();
  if (!p) return false;
  if (WESTERN_STUDIO_BLOCKLIST.has(p)) return false;
  if (JAV_PREFIX_ALLOWLIST.has(p)) return true;
  // alias key，例如 LUXU -> 259LUXU
  if (JAV_PREFIX_ALIASES[p] && JAV_PREFIX_ALLOWLIST.has(JAV_PREFIX_ALIASES[p])) {
    return true;
  }
  return false;
}

// ==================== isJavPrefixBlocked ====================
function isJavPrefixBlocked(prefix) {
  var p = String(prefix || "").toUpperCase().trim();
  if (!p) return true;
  if (WESTERN_STUDIO_BLOCKLIST.has(p)) return true;
  if (JAV_PREFIX_BLOCKLIST.has(p)) return true;
  return false;
}

// ==================== isJavNoiseCode（v1.12.0 噪声门禁）====================
// 非 allowlist 路径产出的"番号"可能是发布组噪声：年份（2025 → 20-25）、
// 分辨率（WEB-DL 1080P → DL-1080P / 1080P → 10-80P）、集数（EP01 → EP-01）、
// 整词+年份（The Sheep Detectives 2026 → DETECTIVES-2026）。实测导致欧美/
// 剧集文件夹标题损坏（EP-01/20-25/20-26）并误触发 JAV 详情与回填链路
// （r18.dev 404 → 3s 冷却 + libredmb transient + breaker）。
// 门禁只作用于 generic/medium 路径；allowlist 命中的真实番号前缀不受影响。
var JAV_NOISE_PREFIXES = new Set([
  "EP", "WEB", "DL", "BD", "UHD", "HDR", "HEVC", "AAC", "DDP", "DD", "ATMOS",
  "TRUEHD", "DTS", "AC3", "FLAC", "AMZN", "NF", "ATVP", "PMTP", "DSNP", "HULU",
  "PCOK", "TV", "CHS", "CHT", "GB", "BIG5", "SUB", "DUB", "DUAL", "HQ", "REMUX",
  "PROPER", "REPACK", "IMAX", "EXTENDED", "UNRATED", "BDRIP", "WEBRIP", "HDTV",
  "PDTV", "DVDRIP", "BLURAY", "BR", "XXX", "KTR", "N1C", "XC", "P2P", "RARBG",
  "WWW", "COM", "NET", "ORG", "UINDEX", "H264", "H265", "X264", "X265", "AV1",
  "VP9", "MP4", "MKV", "AVI", "WMV", "DVD", "HDR10", "DVDR", "SDR", "DOLBY"
]);
var JAV_RESOLUTION_NUMBERS = new Set(["360", "480", "576", "720", "1080", "2160", "4320"]);

function isJavNoiseCode(prefix, number, suffix) {
  var p = String(prefix || "").toUpperCase();
  var n = String(number || "");
  var sfx = String(suffix || "").toUpperCase();
  if (!p) return true;
  // 纯数字前缀：真实番号前缀必含字母（FC2/300MIUM/259LUXU/T28 均含字母）
  if (!/[A-Z]/.test(p)) return true;
  if (JAV_NOISE_PREFIXES.has(p)) return true;
  // 季集标记变形：S03E05 → S03E-05、S01E08 → S01E-08、E05、EP01（龙之家族/
  // 金特务/剧集文件夹实测——播放正常但标题被季集码吞掉）
  if (/^(?:S\d+E?\d*|E\d+|EP\d*)$/i.test(p)) return true;
  // 分辨率号码（1080/1080P/720/2160 …）
  if (JAV_RESOLUTION_NUMBERS.has(n) && (!sfx || sfx === "P" || sfx === "I")) return true;
  // 年份号码（1927-2035：电影/剧集命名年份段）
  var num = parseInt(n, 10);
  if (num >= 1927 && num <= 2035) return true;
  return false;
}

// ==================== looksLikeWesternScene ====================

function looksLikeWesternScene(text) {
  var s = String(text || "").toUpperCase();
  // 检查日期模式 YY.MM.DD
  var datePattern = /\b(\d{2})[-.\s]?(\d{2})[-.\s]?(\d{2})\b/;
  var dm = s.match(datePattern);
  if (!dm) return false;
  // 检查日期前的文本是否包含 Western studio
  var beforeDate = s.slice(0, dm.index).replace(/[^A-Z0-9]/g, "");
  var result = false;
  WESTERN_STUDIO_BLOCKLIST.forEach(function(studio) {
    if (beforeDate.indexOf(studio) !== -1) result = true;
  });
  return result;
}

// ==================== buildJavKey ====================

function buildJavKey(number, opts) {
  // opts: string (old style) or { confidence, source } (new style)
  if (typeof opts === "string") opts = { source: opts };
  opts = opts || {};
  var k = String(number || "").toUpperCase();
  return {
    type: "jav",
    confidence: opts.confidence || "high",
    key: k,
    canonicalKey: k,
    displayTitle: k,
    searchText: k.toLowerCase().replace(/^fc2-/, ""),
    strictTarget: normalizeForMatch(k),
    number: k,
    source: opts.source || "extractJavKey"
  };
}

// ==================== extractJavKey ====================

function extractJavKey(text) {
  var s = String(text || "").toUpperCase();
  if (!s) return null;

  // 先做 Western guard，避免 deeper.19.04.19 被识别成 DEEPER19
  if (looksLikeWesternScene(s)) return null;

  // FC2
  var m = s.match(/\bFC2(?:[-_ ]?PPV)?[-_ ]?(\d{5,8})\b/);
  if (m) {
    return buildJavKey("FC2-PPV-" + m[1], "extractJavKey:fc2");
  }

  // Special providers
  var specialPatterns = [
    { re: /\bCARIB[-_ ]?(\d{6,8})\b/, prefix: "CARIB" },
    { re: /\b1PONDO[-_ ]?(\d{6,8})\b/, prefix: "1PONDO" },
    { re: /\bHEYZO[-_ ]?(\d{3,6})\b/, prefix: "HEYZO" },
    { re: /\bT28[-_ ]?(\d{6,8})\b/, prefix: "T28" }
  ];

  for (var i = 0; i < specialPatterns.length; i++) {
    var sm = s.match(specialPatterns[i].re);
    if (sm) {
      return buildJavKey(specialPatterns[i].prefix + "-" + sm[1], "extractJavKey:special");
    }
  }

  // 标准带分隔符番号：ABF-357 / ABF_357 / ABF 357
  // [v1.3.6] blocklist gate + confidence 分层，不再硬依赖 allowlist
  var separated = s.match(/\b([A-Z0-9]{2,12})[-_ ]+(\d{2,8})([A-Z]?)(?:[-_ ]?([A-Z]{1,4}))?\b/);
  if (separated) {
    var prefix = separated[1];

    if (isJavPrefixBlocked(prefix)) {
      console.log("[resolver/jav-pattern] blocklisted:", prefix, "raw:", text);
      return null;
    }

    // 所有本地后缀（-C / -restored / -4K / 破解 等）全部剥离，不进 key
    var code = prefix + "-" + separated[2] + (separated[3] || "");
    // separated[4]（如 -C、-4K）作为噪声丢弃

    var confidence = isAllowedJavPrefix(prefix) ? "high" : "medium";
    // v1.12.0: medium（非 allowlist）前缀过噪声门禁——WEB-DL 1080p → DL-1080P、
    // Detectives 2026 → DETECTIVES-2026 之类在此拦截，回落 unknown
    if (confidence !== "high" && isJavNoiseCode(prefix, separated[2], separated[3] || "")) {
      console.log("[resolver/jav-pattern] noise-gated:",
                  code, "prefix:", prefix, "raw:", text);
      return null;
    }
    console.log("[resolver/jav-pattern] raw:", text, "code:", code,
                "prefix:", prefix, "confidence:", confidence);
    return buildJavKey(code, { confidence: confidence, source: "extractJavKey:separated" });
  }

  // cid 形态（v1.8.9）：无分隔符且为"字母前缀+补零数字"（snis00776 / ipx00535）。
  // 贪心切分（[A-Z0-9]+）会把数字吞进前缀（SNIS007-76）导致 allowlist 不中、
  // 整条目退化为 unknown 永不回填——先按字母|数字边界切分，仅接受 allowlist
  // 前缀（与 compact 分支同门槛）防误报。
  var cidForm = s.match(/\b([A-Z]{2,12})(\d{2,8})\b/);
  if (cidForm && !isJavPrefixBlocked(cidForm[1]) && isAllowedJavPrefix(cidForm[1])) {
    return buildJavKey(cidForm[1] + "-" + cidForm[2], { confidence: "high", source: "extractJavKey:cid-form" });
  }

  // 无分隔符番号：ABF357 / SSIS123
  // [v1.3.6] blocklist 预检 + 保留 allowlist gate（无分隔符模式风险较高）
  var compact = s.match(/\b([A-Z0-9]{2,12})(\d{2,8})([A-Z]?)\b/);
  if (compact) {
    var compactPrefix = compact[1];
    if (isJavPrefixBlocked(compactPrefix)) {
      console.log("[resolver/jav-pattern] blocklisted:", compactPrefix, "raw:", text);
      return null;
    }
    if (isAllowedJavPrefix(compactPrefix)) {
      return buildJavKey(
        compactPrefix + "-" + compact[2] + (compact[3] || ""),
        "extractJavKey:compact-allowlist"
      );
    }
  }

  return null;
}

// ==================== 验收用例 (v1.3.6 pattern resolver) ====================
//
// JAV dirty filename → type: "jav"
//   resolveMediaKeyFromText("www.98T.la@MIKR-092.restored_prob4.mp4") → key: "MIKR-092" canonicalKey: "MIKR-092"
//   resolveMediaKeyFromText("MNGS-071.restored.mp4")                   → key: "MNGS-071" canonicalKey: "MNGS-071"
//   resolveMediaKeyFromText("www.98T.la@PRWF-012.restored.mp4")       → key: "PRWF-012" canonicalKey: "PRWF-012"
//   resolveMediaKeyFromText("MIKR-103.restored-M.mp4")                 → key: "MIKR-103" canonicalKey: "MIKR-103"
//   resolveMediaKeyFromText("START-326-C")                              → key: "START-326" canonicalKey: "START-326"
//   resolveMediaKeyFromText("SSIS-123-C-4K")                           → key: "SSIS-123" canonicalKey: "SSIS-123"
//
// Western remains western (unchanged):
//   resolveMediaKeyFromText("deeper.19.04.19.adria.rae.mp4")           → type: "western_scene"
//   resolveMediaKeyFromText("Deeper.26.06.11.Addison.Vodka.4k.mp4")   → type: "western_scene"
//   resolveMediaKeyFromText("BLACKEDRAW-026-4K-cd05")                  → NOT jav (blocklisted)
//
// ==================== Movie / TV 占位 ====================
// TODO vNext: 实现 Movie / TV 完整聚合
// TMDB ID, season, episode, title, year 等字段预留

function extractMovieKey(text) {
  return null;
}

function extractTvEpisodeKey(text) {
  return null;
}

// ==================== buildUnknownMediaKey ====================

function buildUnknownMediaKey(raw) {
  var s = String(raw || "");
  return {
    type: "unknown",
    confidence: "none",
    key: s,
    displayTitle: s,
    searchText: "",
    strictTarget: "",
    source: "buildUnknownMediaKey"
  };
}

// ==================== resolveMediaKeyFromText ====================

function resolveMediaKeyFromText(text, options) {
  options = options || {};
  var raw = String(text || "");
  var clean = normalizeSpaces(stripKnownNoisePrefix(stripFileExtension(raw)));


  var westernScene = extractWesternSceneKey(clean);
  if (westernScene) {
    return westernScene;
  }

  var westernDate = extractWesternDateKey(clean);
  if (westernDate) {
    return westernDate;
  }

  var jav = extractJavKey(clean);
  if (jav) {
    return jav;
  }

  var movie = extractMovieKey(clean);
  if (movie) {
    return movie;
  }

  var tv = extractTvEpisodeKey(clean);
  if (tv) {
    return tv;
  }

  var unknown = buildUnknownMediaKey(raw);
  return unknown;
}

// ==================== resolveMediaKeyFromParams ====================

// ==================== collectStringValues ====================

function collectStringValues(value, depth, out, visited) {
  if (value === null || value === undefined) return out;
  if (depth > 5) return out;

  var valueType = typeof value;

  if (valueType === "string" || valueType === "number") {
    var text = String(value).trim();
    if (text) out.push(text);
    return out;
  }

  if (valueType !== "object") return out;

  if (visited.has(value)) return out;
  visited.add(value);

  if (Array.isArray(value)) {
    for (var i = 0; i < value.length; i++) {
      collectStringValues(value[i], depth + 1, out, visited);
    }
    return out;
  }

  var keys = Object.keys(value);
  for (var k = 0; k < keys.length; k++) {
    collectStringValues(value[keys[k]], depth + 1, out, visited);
  }

  return out;
}

// ==================== resolveMediaKeyFromParams ====================

function resolveMediaKeyFromParams(params) {
  if (!params || typeof params !== "object") {
    return buildUnknownMediaKey(String(params || ""));
  }

  console.log("[resolver/params] keys:", JSON.stringify(Object.keys(params)));

  // ============ Phase 1: 优先字段逐个扫描 ============

  var PRIORITY_FIELDS = [
    "code", "videoId", "number",
    "fileName", "filename", "file_name", "name",
    "path", "filePath", "file_path",
    "mediaPath", "media_path", "itemPath", "item_path",
    "localPath", "local_path",
    "originalFilename", "originalFileName",
    "title", "originalTitle", "originalName",
    "seriesName", "episodeName",
    "genreTitle", "description", "overview",
    "link", "url", "videoUrl", "playUrl", "streamUrl",
    "id", "vod_id"
  ];

  // 嵌套路径
  var NESTED_PATHS = [
    ["tmdbInfo", "title"], ["tmdbInfo", "name"],
    ["tmdbInfo", "originalTitle"], ["tmdbInfo", "originalName"],
    ["tmdbInfo", "overview"],
    ["info", "title"], ["info", "name"],
    ["info", "originalTitle"], ["info", "originalName"],
    ["info", "overview"],
    ["mediaSource", "name"], ["mediaSource", "fileName"],
    ["mediaSource", "filename"], ["mediaSource", "path"],
    ["mediaSource", "url"], ["mediaSource", "streamUrl"]
  ];

  // Flat priority fields
  for (var pi = 0; pi < PRIORITY_FIELDS.length; pi++) {
    var f = PRIORITY_FIELDS[pi];
    var val = params[f];
    if (val != null && typeof val === "string" && val.length >= 2) {
      var mk = resolveMediaKeyFromText(val, { source: "params:" + f });
      if (mk && mk.type !== "unknown") {
        console.log("[resolver/params] priority hit:", f, mk.type, mk.key);
        return mk;
      }
    }
  }

  // Nested priority paths
  for (var ni = 0; ni < NESTED_PATHS.length; ni++) {
    var keys = NESTED_PATHS[ni];
    var obj = params;
    var found = true;
    for (var ki = 0; ki < keys.length; ki++) {
      if (obj == null || typeof obj !== "object") { found = false; break; }
      obj = obj[keys[ki]];
    }
    if (found && typeof obj === "string" && obj.length >= 2) {
      var mk = resolveMediaKeyFromText(obj, { source: "params:nested." + keys.join(".") });
      if (mk && mk.type !== "unknown") {
        console.log("[resolver/params] priority hit:", keys.join("."), mk.type, mk.key);
        return mk;
      }
    }
  }

  // mediaSources 数组
  if (Array.isArray(params.mediaSources)) {
    var MEDIASRC_FIELDS = ["name", "fileName", "filename", "path", "url", "streamUrl"];
    for (var si = 0; si < params.mediaSources.length; si++) {
      var src = params.mediaSources[si];
      if (!src || typeof src !== "object") continue;
      for (var mfi = 0; mfi < MEDIASRC_FIELDS.length; mfi++) {
        var mf = MEDIASRC_FIELDS[mfi];
        var sv = src[mf];
        if (typeof sv === "string" && sv.length >= 2) {
          var mk = resolveMediaKeyFromText(sv, { source: "params:mediaSources[" + si + "]." + mf });
          if (mk && mk.type !== "unknown") {
            console.log("[resolver/params] priority hit: mediaSources[" + si + "]." + mf, mk.type, mk.key);
            return mk;
          }
        }
      }
    }
  }

  // ============ Phase 2: 原 combined 方式（向后兼容） ============

  var texts = [];

  if (params.title) texts.push(params.title);
  if (params.name) texts.push(params.name);
  if (params.originalTitle) texts.push(params.originalTitle);
  if (params.episodeName) texts.push(params.episodeName);
  if (params.airDate) texts.push(params.airDate);
  if (params.description) texts.push(params.description);
  if (params.link) texts.push(params.link);

  if (params.id && texts.indexOf(params.id) === -1) texts.push(params.id);
  if (params.vod_id && texts.indexOf(params.vod_id) === -1) texts.push(params.vod_id);

  if (texts.length) {
    var combined = texts.join(" ");
    var mk2 = resolveMediaKeyFromText(combined, { source: "params:combined" });
    if (mk2 && mk2.type !== "unknown") {
      console.log("[resolver/params] combined hit:", mk2.type, mk2.key);
      return mk2;
    }
  }

  // ============ Phase 3: 递归全量兜底 ============

  var stringValues = collectStringValues(params, 0, [], new WeakSet());
  var seenRecursive = {};
  for (var vi = 0; vi < stringValues.length; vi++) {
    var t = stringValues[vi];
    if (!t || t.length < 3 || seenRecursive[t]) continue;
    seenRecursive[t] = true;
    var mk3 = resolveMediaKeyFromText(t, { source: "params:recursive" });
    if (mk3 && mk3.type !== "unknown") {
      console.log("[resolver/params] recursive hit:", mk3.type, mk3.key);
      return mk3;
    }
  }

  console.log("[resolver/params] no hit after all passes");
  return buildUnknownMediaKey(String(params.title || params.name || ""));
}

// ==================== searchPan115ByMediaKey / matchFilesByMediaKey ====================

async function searchPan115ByMediaKey(cookie, mediaKey) {
  console.log("[pan115/stream] searchFiles keyword:", mediaKey.searchText);
  var files = await searchFiles(cookie, mediaKey.searchText);
  console.log("[pan115/stream] searchFiles result count:", files.length);
  var matched = matchFilesByMediaKey(files, mediaKey);
  console.log("[pan115/stream] matched count:", matched.length);

  if (!matched.length) return [];

  var promises = matched.map(function(f) {
    return buildStreamSources(cookie, f)["catch"](function(err) {
      console.error("[pan115/stream] buildStreamSources failed:", f && f.filename, err && err.message || err);
      return [];
    });
  });
  var nested = await Promise.all(promises);
  var streams = [];
  for (var si = 0; si < nested.length; si++) {
    if (nested[si] && nested[si].length) {
      streams = streams.concat(nested[si]);
    }
  }
  return streams;
}

function matchFilesByMediaKey(files, mediaKey) {
  var matched = [];

  for (var i = 0; i < files.length; i++) {
    var fn = normalizeForMatch(files[i].filename);
    if (mediaKey.strictTarget && fn.indexOf(mediaKey.strictTarget) !== -1) {
      matched.push(files[i]);
    }
  }

  if (mediaKey.type === "western_date" && matched.length > 1) {
    matched.sort(function(a, b) {
      return scoreWesternFile(b) - scoreWesternFile(a);
    });
    return matched.slice(0, 1);
  }

  return matched;
}

// ==================== 验收用例（仅供人工测试参考） ====================
//
// extractJavKey:
//   "BBAN-580" -> type: jav, key: BBAN-580
//   "hhd800.com@BBAN-580.mp4" -> type: jav, key: BBAN-580
//   "ABF357" -> type: jav, key: ABF-357
//   "SSIS123" -> type: jav, key: SSIS-123
//   "FC2-PPV-1234567" -> type: jav, key: FC2-PPV-1234567
//   "deeper.19.04.19" -> null (Western guard)
//   "DEEPER19" -> null (blocklist)
//   "VIXEN20" -> null
//   "BLACKEDRAW26" -> null
//
// resolveMediaKeyFromText:
//   "deeper.19.04.19.adria.rae.mp4" -> western_scene, strictTarget: deeper190419adriarae
//   "deeper.19.04.19" -> western_date, strictTarget: deeper190419
//   "Np9xG detail:Np9xG:deeper.19.04.19" -> western_date, strictTarget: deeper190419
//   "vixen.20.08.14.jia.lissa" -> western_scene
//   "DEEPER19" -> unknown

// ==================== HTTP 封装 ====================

async function httpGet(url, options) {
  options = options || {};
  var base = options.skipBaseHeaders ? {} : BASE_HEADERS;
  var mergedHeaders = Object.assign({}, base, options.headers || {});
  var finalOptions = {
    headers: mergedHeaders,
    timeout: options.timeout || TIMEOUT
  };

  var resp = await Widget.http.get(url, finalOptions);
  if (!resp || resp.statusCode !== 200) {
    throw new Error("HTTP " + (resp && resp.statusCode || "unknown") + ": " + url.slice(0, 80));
  }
  return resp.data;
}

function cookieHeader(cookie) {
  if (!cookie) return {};
  return { "Cookie": cookie };
}

// ==================== 115 API 核心 ====================

async function listFolder(cookie, cid, page, options) {
  var limit = 30;
  var offset = ((page || 1) - 1) * limit;
  var url = WEB_API_115 + "/files?cid=" + encodeURIComponent(cid)
    + "&offset=" + offset + "&limit=" + limit
    + "&show_dir=1&type=&star=&is_share=&format=json";

  var data = await httpGet(url, { headers: cookieHeader(cookie) });

  var parsed = null;
  try { parsed = typeof data === "string" ? JSON.parse(data) : data; } catch (e) {}

  console.log("[pan115/listFolder/raw-response]", {
    cid: cid,
    page: page,
    keys: Object.keys(parsed || {}),
    state: parsed && parsed.state,
    errno: parsed && parsed.errno,
    errNo: parsed && parsed.errNo,
    error: parsed && parsed.error,
    message: parsed && parsed.message,
    count: parsed && parsed.count,
    page_size: parsed && parsed.page_size,
    dataType: Array.isArray(parsed && parsed.data) ? "array" : typeof (parsed && parsed.data),
    dataLength: Array.isArray(parsed && parsed.data) ? parsed.data.length : undefined,
    raw: parsed
  });

  var allLists = [
    parsed && parsed.data,
    parsed && parsed.data && parsed.data.list,
    parsed && parsed.data && parsed.data.dirs,
    parsed && parsed.list,
    parsed && parsed.data && parsed.data.files,
  ];

  var files = [];
  for (var ci = 0; ci < allLists.length; ci++) {
    if (Array.isArray(allLists[ci])) { files = allLists[ci]; break; }
  }

  console.log("[pan115/listFolder/normalized] rawCount:", files.length, "normalizing items...");
  var normalized = [];
  for (var ni = 0; ni < files.length; ni++) {
    var raw = files[ni];
    if (!raw) continue;

    var name = get115Name(raw);
    var pc = String(raw.pc || raw.pickcode || "");

    if (isRaw115Folder(raw)) {
      normalized.push({
        filename: name,
        name: name,
        fid: String(raw.cid || raw.fid || raw.id || ""),
        pickcode: "",
        pc: "",
        size: 0,
        isdir: true,
        cid: String(raw.cid || raw.fid || raw.id || ""),
      });
    } else if (isRaw115VideoFile(raw)) {
      normalized.push({
        filename: name,
        name: name,
        fid: String(raw.fid || raw.id || raw.file_id || ""),
        pickcode: pc,
        pc: pc,
        size: Number(raw.s || raw.size || 0),
        isdir: false,
        cid: String(raw.cid || ""),
      });
    } else {
      continue;
    }
  }
  return normalized;
}
// ==================== listFolderAll: 分页全量读取 ====================
// 只用于 buildFolderDetailPage（视频计数）和 handleFolderPlayback（选择最大视频生成播放源）。
// 不宜用于父目录浏览（loadFolder 保持 Forward 原生分页）。
// options:
//   limit    每页数量（默认 100）
//   maxItems 最大条目数（默认 300）
//   maxPages 最大页数（默认 5）
async function listFolderAll(cookie, cid, options) {
  options = options || {};
  var limit = options.limit || 100;
  var maxItems = options.maxItems || 300;
  var maxPages = options.maxPages || 5;

  var allItems = [];
  var seenKeys = {};  // v1.12.0: 已处理条目（fid/pickcode/文件名），跨页去重
  var page = 1;
  var total = null;
  var truncated = false;

  while (page <= maxPages) {
    var offset = (page - 1) * limit;
    var url = WEB_API_115 + "/files?cid=" + encodeURIComponent(cid)
      + "&offset=" + offset + "&limit=" + limit
      + "&show_dir=1&type=&star=&is_share=&format=json";

    var data, parsed;
    try {
      data = await httpGet(url, { headers: cookieHeader(cookie) });
      parsed = typeof data === "string" ? JSON.parse(data) : data;
    } catch (e) {
      console.error("[pan115/listFolder] page fetch error:", e && e.message || e, "page:", page, "cid:", cid);
      break;
    }

    var allLists = [
      parsed && parsed.data,
      parsed && parsed.data && parsed.data.list,
      parsed && parsed.data && parsed.data.dirs,
      parsed && parsed.list,
      parsed && parsed.data && parsed.data.files,
    ];

    var rawPage = [];
    for (var ci = 0; ci < allLists.length; ci++) {
      if (Array.isArray(allLists[ci])) { rawPage = allLists[ci]; break; }
    }

    // extract total count from response (defensive: try multiple field names)
    if (total === null) {
      var d = parsed && parsed.data;
      var rawTotal = (d && (d.count || d.total || d.page_count || d.file_count || d.data_count))
        || (parsed && (parsed.count || parsed.total));
      if (rawTotal !== null && rawTotal !== undefined) {
        total = Number(rawTotal);
      }
    }

    console.log("[pan115/listFolder/page] cid:", cid, "offset:", offset, "limit:", limit, "rawCount:", rawPage.length, "total:", total);

    if (!rawPage.length) break;

    // normalize page items (same logic as listFolder)，跨页按 fid/pickcode/文件名去重
    var normalizedPage = [];
    var freshCount = 0;
    for (var ni = 0; ni < rawPage.length; ni++) {
      var raw = rawPage[ni];
      if (!raw) continue;

      // v1.12.0: 115 对 offset >= count 会重复返回最后一页；目录里的 nfo/srt
      // 等杂项归一化时被丢弃，旧判停"归一化数量 >= total"会因此翻页重拉，
      // 把同一视频重复计入（实测 Zootopia 目录 mkv×2 → m3u8 请求 ×2）。
      var idKey = String(raw.fid || raw.id || raw.file_id || "")
        || ("pc:" + String(raw.pc || raw.pickcode || ""))
        || ("n:" + get115Name(raw));
      if (seenKeys[idKey]) continue;
      seenKeys[idKey] = true;

      var name = get115Name(raw);
      var pc = String(raw.pc || raw.pickcode || "");

      if (isRaw115Folder(raw)) {
        normalizedPage.push({
          filename: name,
          name: name,
          fid: String(raw.cid || raw.fid || raw.id || ""),
          pickcode: "",
          pc: "",
          size: 0,
          isdir: true,
          cid: String(raw.cid || raw.fid || raw.id || ""),
        });
        freshCount++;
      } else if (isRaw115VideoFile(raw)) {
        normalizedPage.push({
          filename: name,
          name: name,
          fid: String(raw.fid || raw.id || raw.file_id || ""),
          pickcode: pc,
          pc: pc,
          size: Number(raw.s || raw.size || 0),
          isdir: false,
          cid: String(raw.cid || ""),
        });
        freshCount++;
      }
      // 其余杂项（nfo/srt/txt 等）：仅标记已见，不入列
    }

    allItems = allItems.concat(normalizedPage);

    // stopping conditions
    // v1.12.0: 判停改按"原始条目是否已取全"——归一化会丢弃杂项，归一化数量
    // 小于 total 不代表还有未取条目。整页无新条目（API 重复末页）也立即停。
    var rawCovered = (total !== null && total !== undefined)
      && (offset + rawPage.length) >= total;
    if (rawCovered) break;
    if (freshCount === 0) break;
    if (normalizedPage.length < limit) break;

    if (allItems.length >= maxItems) {
      truncated = true;
      break;
    }

    page++;
  }

  if (page > maxPages) {
    truncated = true;
  }

  // statistics: folder vs video vs unrecognized
  var folderCount = 0, videoCount = 0, skippedCount = 0;
  for (var i = 0; i < allItems.length; i++) {
    if (allItems[i].isdir) folderCount++;
    else if (allItems[i].pickcode) videoCount++;
    else skippedCount++;
  }

  console.log("[pan115/listFolder/final] cid:", cid, "totalFetched:", allItems.length, "folderCount:", folderCount, "videoCount:", videoCount, "skippedCount:", skippedCount, "truncated:", truncated);

  if (truncated) {
    console.log("[pan115/listFolder] truncated at maxItems/maxPages, cid:", cid, "fetched:", allItems.length);
  }

  return allItems;
}


async function searchFiles(cookie, keyword) {
  var url = WEB_API_115 + "/files/search?search_value=" + encodeURIComponent(keyword)
    + "&limit=30&offset=0";

  var data = await httpGet(url, { headers: cookieHeader(cookie) });

  var parsed = null;
  try { parsed = typeof data === "string" ? JSON.parse(data) : data; } catch (e) {}


  var lists = [
    parsed && parsed.data,
    parsed && parsed.data && parsed.data.list,
    parsed && parsed.data && parsed.data.files,
    parsed && parsed.data && parsed.data.items,
    parsed && parsed.files,
    parsed && parsed.list,
  ];

  var files = [];
  for (var i = 0; i < lists.length; i++) {
    if (Array.isArray(lists[i])) { files = lists[i]; break; }
  }

  console.log("[pan115/listFolder/normalized] rawCount:", files.length, "normalizing items...");
  return files.map(function (item) {
    return {
      pickcode: item.pc || item.pickcode || item.pick_code || item.pickCode || "",
      filename: item.n || item.name || item.file_name || item.filename || "",
      size: item.s || item.size || 0,
    };
  }).filter(function (item) { return item.pickcode && item.filename; });
}

async function getMasterM3u8Text(cookie, pickcode) {
  var url = API_115 + "/api/video/m3u8/" + encodeURIComponent(pickcode) + ".m3u8";
  var data = await httpGet(url, { headers: cookieHeader(cookie) });
  return String(data || "");
}

function parseStreams(masterText) {
  if (!masterText || masterText.indexOf("#EXTM3U") !== 0) return [];

  var lines = masterText.split("\n");
  var streams = [];

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line.indexOf("#EXT-X-STREAM-INF") === -1) continue;

    var nameMatch = line.match(/NAME="([^"]+)"/);
    var resolutionMatch = line.match(/RESOLUTION=(\d+)x(\d+)/);
    var bandwidthMatch = line.match(/BANDWIDTH=(\d+)/);

    var name = nameMatch ? nameMatch[1].toUpperCase() : "";
    var width = resolutionMatch ? Number(resolutionMatch[1]) : 0;
    var height = resolutionMatch ? Number(resolutionMatch[2]) : 0;

    // 优先 NAME 匹配，NAME 未识别时用 RESOLUTION 猜
    var quality = QUALITY_MAP[name];
    if (!quality) {
      quality = guessQualityFromResolution(width, height);
    }

    var urlLine = "";
    for (var j = i + 1; j < lines.length; j++) {
      var trimmed = lines[j].trim();
      if (trimmed && trimmed.charAt(0) !== "#") {
        urlLine = trimmed;
        break;
      }
    }

    urlLine = urlLine.replace(/^https:\s*\/\//i, "https://");
    if (!urlLine || urlLine.indexOf("http") !== 0) continue;

    var label = quality.label || (height ? height + "P" : "");
    streams.push({
      url: urlLine,
      quality: name || quality.quality || "",
      label: label,
      priority: quality.priority >= 0 ? quality.priority : -1,
      resolution: resolutionMatch ? width + "x" + height : "",
      bandwidth: bandwidthMatch ? Number(bandwidthMatch[1]) : 0
    });
  }

  // 按 priority 降序 → bandwidth 降序
  streams.sort(function (a, b) {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return (b.bandwidth || 0) - (a.bandwidth || 0);
  });

  console.log("[pan115/parseStreams] count:", streams.length);
  for (var si = 0; si < streams.length; si++) {
    var s = streams[si];
  }

  return streams;
}

// ==================== JAV 元数据（r18.dev 直连，v1.7.0） ====================
// 统一入口 fetchJavMeta：内存 → Widget.storage 持久化 → r18.dev 实时。
// 规则封面（direct-dmm/mgstage）仍是列表页快速路径；r18.dev 兜底并填充富数据
//（日文标题/演员/标签/剧照/已验证 content_id 构造的 DMM 大图）。

// ---- 持久化缓存（v1.10.0 重构）----
// 持久化从"整表 JSON + LRU"改为"按番号小 key 紧凑封面索引"：部分环境整表大 key
// 写入不跨上下文落地（v1.8.3 实测），而 dmmhd 按 cid 的小 key 可用；列表回写
// 只需要封面（~200 字节/番号），富元数据由内存及详情宿主缓存承担。
// 旧整表 key 保留一次性迁移读取，命中按需提升到新 key（不做批量回写）。
// 空间代价（明确接受）：Forward storage 无 delete API，cover/neg key 只增不减，
// 每番号 ~200 字节，数千番号 <1MB。

var JAV_COVER_ENTRY_PREFIX = "pan115-cover:";
var JAV_NEG_ENTRY_PREFIX = "pan115-javneg:";
var JAV_COVER_SOURCE_DMM_PROBE = "dmm-probe";

// 紧凑封面索引读取：返回 { p, b, s, t } 或 null（miss/过期/空图）
function readCoverEntry(key) {
  var k = String(key || "").toUpperCase();
  if (!k) return null;
  var raw = storeGetJSON(JAV_COVER_ENTRY_PREFIX + k, null);
  if (!raw || typeof raw !== "object") return null;
  if (!raw.t || Date.now() - Number(raw.t) > JAV_META_CACHE_TTL) return null;
  if (!raw.p && !raw.b) return null;
  return raw;
}

/**
 * 已验证封面写入（跨上下文回写的数据源）。主键一律用请求方 canonical key
 * （列表 _javEnrichKey / 详情 mediaKey），不用 resolver 返回的 meta.code。
 * 仅在至少一张图非空时写入；返回 storeSetJSON 结果（false = storage 写入失败）。
 */
function cacheVerifiedCover(key, poster, backdrop, source) {
  var k = String(key || "").toUpperCase();
  poster = String(poster || "");
  backdrop = String(backdrop || "") || poster;
  if (!k || (!poster && !backdrop)) return false;
  var ok = storeSetJSON(JAV_COVER_ENTRY_PREFIX + k, {
    p: poster, b: backdrop, s: String(source || ""), t: Date.now()
  });
  if (!ok) console.warn("[pan115/cover/write failed]", k, source);
  return ok;
}

function getCachedJavMeta(number) {
  var key = String(number || "").toUpperCase();
  if (!key) return null;
  // v1.13.0: 只信本上下文内存（JAV_META_CACHE 仅由本上下文 cacheJavMeta 写入），
  // 不再从 storage 读任何富元数据——Forward 存储快照跨实例/跨进程不可靠。
  var entry = JAV_META_CACHE[key];
  if (!entry || !entry.meta) return null;
  if (Date.now() - (entry.fetchedAt || 0) > JAV_META_CACHE_TTL) return null;
  return entry.meta;
}

/**
 * 详情页已验证封面读取：pan115-cover: 索引由列表探测/救援/详情成功写入，是
 * 「确定存在」的图。优先于规则盲拼（盲拼是猜测，可能 404/now_printing）；
 * 富元数据抓取照常进行（成功后其封面同样经过验证，供 buildJavDetailItem 择优），
 * 富抓取失败/超时时至少保底有图。返回 null = 索引未命中。
 */
function readVerifiedCoverForDetail(mediaKey) {
  var entry = readCoverEntry(mediaKey);
  if (!entry) return null;
  return { poster: entry.p || "", backdrop: entry.b || entry.p || "", source: entry.s || "" };
}

function cacheJavMeta(number, meta) {
  var key = String(number || "").toUpperCase();
  if (!key || !meta) return;
  JAV_META_CACHE[key] = { meta: meta, fetchedAt: Date.now() };
  // 紧凑封面索引同步落盘（列表回填 + 详情 fallback 的跨上下文数据源）
  cacheVerifiedCover(key, meta.posterUrl || "", meta.coverUrl || meta.posterUrl || "", meta.source || "");
}

// ---- 负缓存：双源确认未收录的番号短期内不重试，保护服务端限流配额（1h 自愈）----

var JAV_NEGATIVE_LOADED = false;

function loadJavNegativeStorage() {
  if (JAV_NEGATIVE_LOADED) return;
  JAV_NEGATIVE_LOADED = true;
  var stored = storeGetJSON(JAV_NEGATIVE_STORAGE_KEY, null);
  if (!stored || typeof stored !== "object") return;
  var now = Date.now();
  for (var key in stored) {
    var t = stored[key];
    if (typeof t === "number" && now - t <= JAV_NEGATIVE_TTL && !JAV_NEGATIVE_CACHE[key]) {
      JAV_NEGATIVE_CACHE[key] = t;
    }
  }
}

function isJavNegative(key) {
  loadJavNegativeStorage();
  var t = JAV_NEGATIVE_CACHE[key];
  if (typeof t !== "number") {
    // 按番号小 key（v1.10.0 起的写入路径；整表 key 为旧数据迁移源）
    var raw = storeGetJSON(JAV_NEG_ENTRY_PREFIX + key, null);
    if (typeof raw === "number") {
      JAV_NEGATIVE_CACHE[key] = raw;
      t = raw;
    }
  }
  return typeof t === "number" && Date.now() - t <= JAV_NEGATIVE_TTL;
}

// 负缓存时间窗：列表回填只跳过"最近"失败的番号。部分 Forward 环境的 storage
// 写入不跨上下文落地（v1.8.2 实测：读到的永远是旧快照），硬按 1h TTL 过滤会让
// 修复后的番号被旧快照里的负缓存永久拦截——列表页只信 10 分钟内的失败。
function javNegativeAge(key) {
  loadJavNegativeStorage();
  var t = JAV_NEGATIVE_CACHE[key];
  if (typeof t !== "number") {
    var raw = storeGetJSON(JAV_NEG_ENTRY_PREFIX + key, null);
    if (typeof raw === "number") {
      JAV_NEGATIVE_CACHE[key] = raw;
      t = raw;
    }
  }
  return typeof t === "number" ? Date.now() - t : Infinity;
}

function isJavNegativeRecent(key, maxAgeMs) {
  return javNegativeAge(key) <= maxAgeMs;
}

function markJavNegative(key) {
  // 先确保负缓存表已加载：ignoreNegative 路径（详情页）跳过了 isJavNegative
  // 检查，内存表可能是空的——直接写入会用空表覆盖 storage 里的全部负缓存
  loadJavNegativeStorage();
  var now = Date.now();
  JAV_NEGATIVE_CACHE[key] = now;
  storeSetJSON(JAV_NEG_ENTRY_PREFIX + key, now);
}

function clearJavNegative(key) {
  // 内存 + 按番号小 key 双清。Forward storage 无 delete API，置空串即可——
  // 读取侧 falsy 视为无（storeGetJSON 对 falsy 返回 fallback）。
  loadJavNegativeStorage();
  delete JAV_NEGATIVE_CACHE[key];
  storeSetJSON(JAV_NEG_ENTRY_PREFIX + key, "");
}

// ---- r18.dev 请求（fetchR18Detail / normalizeR18Detail 定义在下方 r18.dev 区块）----

/**
 * r18.dev 命中 → 统一 meta（含封面验证，deadline 透传）。供 fetchJavMeta（详情）
 * 与列表回填 r18 阶段复用。返回：
 *   { meta }         → 命中（封面已验证/升级）；
 *   { limited: true }→ 限流 / 冷却中 / 总预算耗尽（暂时性失败，不算 miss）；
 *   null             → 双端点 definitive miss。
 */
async function resolveR18Meta(attemptKey, timeoutMs, deadlineAt) {
  var result = await fetchR18Detail(attemptKey, { timeout: timeoutMs, deadlineAt: deadlineAt || 0 });
  if (result.outcome === "limited" || result.outcome === "deadline") return { limited: true };
  if (result.outcome !== "hit") return null;
  var m = normalizeR18Detail(result.detail);
  if (!m) return null;
  if (!m.dvdId) m.dvdId = attemptKey;
  await verifyMetaCoverUrls(m, deadlineAt || 0);
  return { meta: m };
}

/**
 * JAV 富元数据统一入口（v1.10.0 起为详情路径专用）：本上下文内存命中直接返回，
 * 未命中按 r18.dev → LibreFanza 顺序实时抓取。列表回填不再经过
 * 此函数（enrichUnsupportedJavItems 自管预算、去重与救援队列）。
 * v1.13.0: legacy storage 整表读取已移除（v1.7.x 毒数据：错误 cid + 120×90
 * 缩略图剧照），富元数据不再有任何 storage 读取路径。
 * - 30s 总预算（deadline）：每个请求发起前按剩余时间收缩 timeout，到期返回
 *   已有结果；预算耗尽 ≠ 未收录，不写负缓存。
 * - 负缓存语义：仅 r18 + LibreFanza 双源 definitive miss 才写；任一来源
 *   limited/deadline 都不写。
 * @param opts.ignoreNegative 详情页传 true：用户主动进入时无视负缓存强制重试
 * @param opts.deadlineMs     总预算毫秒（默认 JAV_DETAIL_DEADLINE_MS）
 */
async function fetchJavMeta(number, opts) {
  var key = String(number || "").toUpperCase();
  if (!key) return null;
  opts = opts || {};

  var cachedMeta = getCachedJavMeta(key);
  if (cachedMeta) {
    debugFastIndex("[pan115/javmeta/request]", { number: key, cache: "hit" });
    return cachedMeta;
  }

  // 负缓存：双源确认未收录的番号不再重试（详情页 ignoreNegative 绕过）
  if (!opts.ignoreNegative && isJavNegative(key)) {
    debugFastIndex("[pan115/javmeta/request]", { number: key, negative: "hit" });
    return null;
  }

  // 后缀容错：MIAD-812U 依次尝试原码与去后缀码（MIAD-812）
  var attempts = [key];
  var base = javBaseCode(key);
  if (base && base !== key) attempts.push(base);

  var deadlineAt = Date.now() + (opts.deadlineMs || JAV_DETAIL_DEADLINE_MS);
  var remaining = function () { return deadlineAt - Date.now(); };
  var sawLimited = false;
  var timedOut = false;
  var meta = null;

  var applyR18 = async function (attemptKey) {
    return await resolveR18Meta(attemptKey, Math.max(500, Math.min(JAV_DETAIL_TIMEOUT, remaining())), deadlineAt);
  };
  var applyLibre = async function (attemptKey) {
    var res = await fetchLibreFanzaMeta(attemptKey, { timeout: Math.max(500, Math.min(LIBREFANZA_TIMEOUT_MS, remaining())), deadlineAt: deadlineAt });
    if (res.outcome === "transient") return { limited: true };
    if (res.outcome !== "hit") return {};
    var m = res.meta;
    await verifyMetaCoverUrls(m, deadlineAt);
    return { meta: m };
  };

  // FC2：r18.dev 结构性无收录（双端点实测 404），直接 LibreFanza（标题/日期/
  // 官方缩略图）；其余番号顺序固定 [r18, libre]：r18 富数据优先
  var sources = /^FC2(?:PPV)?\d{5,8}$/.test(key.replace(/-/g, "")) ? [applyLibre] : [applyR18, applyLibre];
  for (var s = 0; s < sources.length && !meta; s++) {
    for (var i = 0; i < attempts.length && !meta; i++) {
      if (remaining() <= 500) { timedOut = true; break; }
      var res = await sources[s](attempts[i]);
      if (res && res.limited) {
        // 暂时性失败：不写负缓存；换下一来源/番号形态继续（r18 冷却中时
        // LibreFanza 仍可尝试，与 r18 限流互不影响）
        sawLimited = true;
        console.log("[pan115/javmeta/fallback]", JSON.stringify({ number: attempts[i], reason: "transient" }));
        continue;
      }
      if (res && res.meta) meta = res.meta;
    }
  }

  if (meta) {
    debugFastIndex("[pan115/javmeta/normalize]", {
      number: key,
      source: meta.source,
      title: (meta.titleJa || meta.titleEn || "").slice(0, 40),
      hasPoster: !!meta.posterUrl,
      hasCover: !!meta.coverUrl,
      screenshots: meta.screenshots.length,
      actresses: meta.actresses.length,
      genres: meta.genres.length
    });
    clearJavNegative(key);
    cacheJavMeta(key, meta);
    return meta;
  }

  if (sawLimited || timedOut) {
    console.log("[pan115/javmeta/fallback]", JSON.stringify({ number: key, reason: timedOut ? "deadline" : "transient" }));
    return null;  // 暂时性失败/预算耗尽：不写负缓存（下次重试）
  }

  console.log("[pan115/javmeta/fallback]", JSON.stringify({ number: key, reason: "not-found-anywhere" }));
  markJavNegative(key);
  return null;
}

/**
 * r18.dev/LibreFanza 命中后的封面验证：对 meta.code 生成 cid 变体并探测，命中
 * 真实存在的 cid 时把 posterUrl/coverUrl 升级为 awsimgsrc ps/pl 大图；全部
 * miss/不确定则保留 normalizeR18Detail 的 jacket / 页面初值（确定性高于盲拼
 * 构造）。deadlineAt（可选）传递到每个探测请求：timeout 收缩为 min(2s, 剩余)，
 * 预算耗尽返回 unknown 不写缓存。
 */
async function verifyMetaCoverUrls(meta, deadlineAt) {
  if (!meta) return;
  if (meta.noDmmVerify) return;  // mgstage 独占标题：无 DMM cid，封面即页面官方图，不探测
  var res = await dmmhdProbeFirst(dmmhdContentIdVariants(meta.code), { deadlineAt: deadlineAt || 0 });
  if (res.cid) {
    meta.posterUrl = dmmhdPosterUrl(res.cid);
    meta.coverUrl = dmmhdBackdropUrl(res.cid);
    return;
  }
  // 变体全 miss：验证初始兜底 URL 本身（pics 对缺失图 302 → now_printing 占位图，
  // 不可直接信任）——ps 缺失退 pl，pl 也确认缺失才清空
  if (!meta.posterUrl) return;
  var psState = await dmmhdProbeUrl(meta.posterUrl, deadlineAt || 0);
  if (psState === false) {
    var plState = meta.coverUrl ? await dmmhdProbeUrl(meta.coverUrl, deadlineAt || 0) : false;
    if (plState === true) {
      meta.posterUrl = meta.coverUrl;
    } else if (plState === false) {
      meta.posterUrl = "";
      meta.coverUrl = "";
    }
  }
}

/**
 * 剧照 URL 防御（v1.13.0）：DMM digital/video 下 {cid}-{N}.jpg 是 120×90
 * 缩略图（r18.dev gallery 的 image_thumb 形态；v1.7.x 旧版毒缓存即此形态，
 * v1.12.1 实测拉伸全屏成马赛克）。确定性升级为 {cid}jp-{N}.jpg 大图
 * （r18.dev image_full 同源，实测 534×800/800×534）；其余 URL 原样保留
 * （jp- 大图、mgstage cap_e、FC2 官方缩略图等非此形态不受影响）。
 */
function sanitizeJavStills(urls) {
  var out = [];
  var list = Object.prototype.toString.call(urls) === "[object Array]" ? urls : [];
  for (var i = 0; i < list.length; i++) {
    var u = String(list[i] || "");
    if (!u) continue;
    var m = u.match(/^https:\/\/pics\.dmm\.co\.jp\/digital\/video\/([a-z0-9_]+)\/\1-(\d{1,3})\.jpg$/i);
    if (m) {
      u = "https://pics.dmm.co.jp/digital/video/" + m[1] + "/" + m[1] + "jp-" + m[2] + ".jpg";
    }
    if (out.indexOf(u) < 0) out.push(u);
  }
  return out;
}

/**
 * 统一 JAV 富详情构建（v1.7.0，参考 MissAV.js 详情契约）
 * @param mediaKey 番号
 * @param meta normalizeR18Detail 的结果，null 时回退基础详情
 * @param ruleArt { poster, backdrop } 规则封面（direct-dmm/mgstage），优先于 r18.dev 封面
 * @param extra { id, link, fallbackTitle, baseDescription, relatedItems, episodeItems }
 */
function buildJavDetailItem(mediaKey, meta, ruleArt, extra) {
  ruleArt = ruleArt || {};
  extra = extra || {};
  meta = meta || null;

  var code = String(mediaKey || (meta && meta.code) || "").toUpperCase();
  var titleJa = (meta && meta.titleJa) || "";
  var titleEn = (meta && meta.titleEn) || "";
  var fallbackTitle = extra.fallbackTitle || "";
  // 日文为主（用户偏好）：title 用日文原名，originalTitle 保留番号便于识别
  var displayTitle = titleJa || titleEn || fallbackTitle || code || "115 视频";
  var originalTitle = code || fallbackTitle || displayTitle;

  // 封面：direct-dmm 规则封面优先（快速路径，与 r18.dev 大图同源且有效）；
  // mgstage 盲拼 URL 是猜测、常 403/404，让位于 r18.dev 验证过的海报；
  // 无规则封面时 r18.dev 兜底
  var rulePosterUsable = !!ruleArt.poster && ruleArt.strategy !== "mgstage";
  var poster = (rulePosterUsable ? ruleArt.poster : "") ||
    (meta && meta.posterUrl) || ruleArt.poster || "";
  var backdrop = (ruleArt.backdrop && ruleArt.strategy !== "mgstage" ? ruleArt.backdrop : "") ||
    (meta && meta.coverUrl) || poster || "";

  // 描述：制作信息行 + 115 专属行（r18.dev 无简介文案）
  var descParts = [];
  if (meta && meta.description) descParts.push(meta.description);
  var infoRows = [];
  if (meta) {
    if (meta.maker) infoRows.push("制作商: " + meta.maker);
    if (meta.label) infoRows.push("发行商: " + meta.label);
    if (meta.series) infoRows.push("系列: " + meta.series);
    if (meta.director) infoRows.push("导演: " + meta.director);
    if (meta.runtime) infoRows.push("时长: " + meta.runtime + " 分钟");
  }
  if (infoRows.length) descParts.push(infoRows.join("\n"));
  if (extra.baseDescription) descParts.push(extra.baseDescription);
  var description = descParts.join("\n\n") || extra.fallbackDescription || "";

  var item = {
    id: extra.id || code,
    vod_id: extra.id || code,
    type: "detail",
    title: displayTitle,
    name: displayTitle,
    originalTitle: originalTitle,
    description: description,
    posterPath: poster,
    coverUrl: poster,
    backdropPath: backdrop,
    detailPoster: backdrop,
    image: backdrop,
    number: code,
    mediaType: "movie",
    rating: (meta && meta.ratingScore > 0) ? meta.ratingScore : DEFAULT_RATING,
    link: extra.link || "",
    episodeItems: extra.episodeItems || [],
    relatedItems: extra.relatedItems || []
  };

  if (meta) {
    // 剧照：r18.dev gallery 截图组；sanitizer 兜底拦截 120×90 缩略图形态
    // （防存储旧快照/上游字段变形再次上屏）
    var stills = sanitizeJavStills(meta.screenshots);
    if (stills.length) {
      item.backdropPaths = stills;
    }
    // 演员：japanese_name 优先，头像 thumb_url；有 r18 id 时可点击进入影片列表
    var peoples = [];
    var actors = [];
    for (var ai = 0; ai < (meta.actresses || []).length; ai++) {
      var act = meta.actresses[ai];
      if (!act || !act.name) continue;
      peoples.push({
        id: act.r18Id ? "r18dev/actress/" + act.r18Id : "pan115/actress/" + encodeURIComponent(act.name),
        title: act.name,
        avatar: act.thumbUrl || "",
        role: "主演"
      });
      actors.push({ name: act.name, avatar: act.thumbUrl || "" });
    }
    if (peoples.length) item.peoples = peoples;
    if (actors.length) item.actors = actors;
    // 标签：有 r18 id 时可点击进入影片列表
    var genreItems = [];
    for (var gi = 0; gi < (meta.genres || []).length; gi++) {
      var genreName = meta.genres[gi] && meta.genres[gi].name;
      if (!genreName) continue;
      var gr18Id = meta.genres[gi].r18Id || 0;
      genreItems.push({
        id: gr18Id ? "r18dev/category/" + gr18Id : "pan115/genre/" + encodeURIComponent(genreName),
        title: genreName
      });
    }
    // 片商作为可点击标签（有 r18 maker id 时跳转片商列表）
    if (meta.maker) {
      genreItems.push({
        id: meta.makerId ? "r18dev/studio/" + meta.makerId : "pan115/maker/" + encodeURIComponent(meta.maker),
        title: meta.maker
      });
    }
    if (genreItems.length) item.genreItems = genreItems;
    // 发行日期：绝不发空串（空 releaseDate 会导致 Forward 详情渲染中断，MissAV.js 同教训）
    if (meta.releaseDate) item.releaseDate = meta.releaseDate;
  }

  console.log("[pan115/detail/javmeta]", JSON.stringify({
    mediaKey: code,
    metaHit: !!meta,
    title: displayTitle.slice(0, 48),  // 诊断：实际渲染标题（区分"模块未给"与"Forward 未渲染"）
    coverSource: ruleArt.poster ? "rule" : (poster ? "r18dev" : "none"),
    backdropSource: ruleArt.backdrop ? "rule" : (backdrop ? "r18dev" : "none"),
    peoples: (item.peoples || []).length,
    genres: (item.genreItems || []).length,
    stills: (item.backdropPaths || []).length
  }));

  return item;
}

// ==================== r18.dev 直连 (v1.7.0 起为唯一元数据源) ====================
// 用途四处：① fetchJavMeta 统一元数据入口（详情页/列表回填）
// ② 点击演员/标签/片商后的影片列表页 ③ 115javmeta:// 元数据详情
// ④ 标注 actress/category/maker 的 r18.dev id（点击跳转用）。
// 失败一律静默降级到规则封面/基础详情。

var R18_BASE = "https://r18.dev";
var R18_HEADERS = {
  "User-Agent": "PlexJav18",
  "accept": "*/*"
};
// 会话级缓存：{ <原始查询码大写>: detail JSON }
var R18_DETAIL_CACHE = {};
// 全局限流冷却：429/网络异常后指数退避（3s → 6s → ... → 30s 封顶），
// 冷却期内所有 r18.dev 请求快速失败，避免持续硬打延长封禁
var R18_COOLDOWN_UNTIL = 0;
var R18_COOLDOWN_BASE_MS = 3000;
var R18_COOLDOWN_MAX_MS = 30000;

function r18Nodash(code) {
  return String(code || "").replace(/-/g, "").toLowerCase();
}

// 注：v1.9.x 的 sleepMs 请求间隔已在 v1.10.0 移除——真实 loadFolder 上下文没有
// setTimeout（v1.8.5 实测），间隔等待从来就是 no-op；现在靠请求时长天然限速
//（r18 串行 + Libre×2），429 由冷却机制兜底。

function r18InCooldown() {
  return Date.now() < R18_COOLDOWN_UNTIL;
}

// 遇 429/网络异常：在剩余冷却基础上翻倍（下限 3s，上限 30s）；冷却已过期则重新从 3s 起
function r18TriggerCooldown() {
  var now = Date.now();
  var remaining = Math.max(R18_COOLDOWN_UNTIL - now, 0);
  var next = Math.min(Math.max(R18_COOLDOWN_BASE_MS, remaining * 2), R18_COOLDOWN_MAX_MS);
  R18_COOLDOWN_UNTIL = now + next;
  console.log("[pan115/r18dev/cooldown]", JSON.stringify({ cooldownMs: next }));
}

/**
 * r18.dev GET，返回 { status, data }：
 *   status 200 → data 为解析后的 JSON；
 *   其他（404/429/5xx/超时/解析失败）→ data 为 null，status 保留原值（异常/超时为 0）。
 * 404 才是"未收录"；429/5xx/0 是"暂时不可用"，由调用方区别对待。
 * 注意：Forward 对非 2xx 会抛异常（"Response status code was unacceptable: 404."），
 * 需从异常消息里还原状态码，否则 404 会被误判为限流（v1.7.2 实测）。
 */
function r18StatusFromError(err) {
  var m = String(err && err.message || err).match(/unacceptable:\s*(\d{3})/i);
  return m ? Number(m[1]) : 0;
}

async function r18GetJson(url, timeoutMs) {
  try {
    var resp = await Widget.http.get(url, { headers: R18_HEADERS, timeout: timeoutMs || 15000 });
    var status = resp && resp.statusCode || 0;
    if (status !== 200) {
      debugFastIndex("[pan115/r18dev/http]", { url: url.slice(0, 100), status: status || "unknown" });
      return { status: status, data: null };
    }
    var data = resp.data;
    if (typeof data === "string") {
      try { data = JSON.parse(data); } catch (parseErr) { return { status: 0, data: null }; }
    }
    return { status: 200, data: data || null };
  } catch (err) {
    var errStatus = r18StatusFromError(err);
    console.log("[pan115/r18dev/fallback]", JSON.stringify({
      url: url.slice(0, 100),
      status: errStatus,
      error: String(err && err.message || err).slice(0, 100)
    }));
    return { status: errStatus, data: null };
  }
}

// 429/5xx/网络异常统一判定
function isR18TransientStatus(status) {
  return status === 429 || status === 0 || status >= 500;
}

/**
 * r18.dev 影片详情（content_id / dvd_id 两种入参都支持）：
 *   1. combined=<code> 直接命中（content_id 入参）；
 *   2. 404 时回落 dvd_id=<code>：该端点返回轻量映射（content_id 等），
 *      拿到 content_id 后再拉 combined 取完整数据。
 * 返回 { detail, outcome }：
 *   outcome "hit"     → detail 为原始 JSON（已入会话缓存）；
 *   outcome "miss"    → 双端点确认未收录；
 *   outcome "limited" → 限流/网络异常/冷却中，暂时性失败（已触发冷却）；
 *   outcome "deadline"→ 总预算耗尽（deadline 型超时，不触发冷却、不算 miss）。
 * @param opts.timeout     单请求超时上限（透传 r18GetJson，默认 15s）
 * @param opts.deadlineAt  总预算绝对时点；每个请求发起前 timeout 收缩为
 *                         min(timeout, 剩余)，剩余不足 500ms 直接返回 deadline
 */
async function fetchR18Detail(code, opts) {
  opts = opts || {};
  var key = String(code || "").toUpperCase();
  if (!key) return { detail: null, outcome: "miss" };
  if (R18_DETAIL_CACHE[key]) return { detail: R18_DETAIL_CACHE[key], outcome: "hit" };
  if (r18InCooldown()) return { detail: null, outcome: "limited" };

  var timeout = opts.timeout || JAV_DETAIL_TIMEOUT;
  var deadlineAt = opts.deadlineAt || 0;
  var remaining = function () { return deadlineAt ? deadlineAt - Date.now() : Infinity; };
  var reqTimeout = function () { return Math.min(timeout, remaining()); };
  // 预算耗尽附近的超时（status 0）要归为 deadline 而非 limited：不触发冷却
  var overshoot = function () { return !!deadlineAt && Date.now() >= deadlineAt - 50; };

  var nodash = r18Nodash(key);
  if (remaining() <= 500) return { detail: null, outcome: "deadline" };
  var first = await r18GetJson(R18_BASE + "/videos/vod/movies/detail/-/combined=" + nodash + "/json", reqTimeout());
  if (isR18TransientStatus(first.status)) {
    if (overshoot()) return { detail: null, outcome: "deadline" };
    r18TriggerCooldown();
    return { detail: null, outcome: "limited" };
  }
  if (first.data && first.data.content_id && first.data.title_ja !== undefined) {
    R18_DETAIL_CACHE[key] = first.data;
    console.log("[pan115/r18dev/detail]", JSON.stringify({ code: key, via: "combined" }));
    return { detail: first.data, outcome: "hit" };
  }
  if (remaining() <= 500) return { detail: null, outcome: "deadline" };
  var byDvd = await r18GetJson(R18_BASE + "/videos/vod/movies/detail/-/dvd_id=" + nodash + "/json", reqTimeout());
  if (isR18TransientStatus(byDvd.status)) {
    if (overshoot()) return { detail: null, outcome: "deadline" };
    r18TriggerCooldown();
    return { detail: null, outcome: "limited" };
  }
  var contentId = byDvd.data && getText(byDvd.data.content_id);
  if (!contentId) {
    console.log("[pan115/r18dev/fallback]", JSON.stringify({ code: key, reason: "not-found" }));
    return { detail: null, outcome: "miss" };
  }
  if (byDvd.data && getText(byDvd.data.title_ja)) {
    // dvd_id 端点直接给了完整数据
    R18_DETAIL_CACHE[key] = byDvd.data;
    console.log("[pan115/r18dev/detail]", JSON.stringify({ code: key, via: "dvd_id" }));
    return { detail: byDvd.data, outcome: "hit" };
  }
  if (remaining() <= 500) return { detail: null, outcome: "deadline" };
  var full = await r18GetJson(R18_BASE + "/videos/vod/movies/detail/-/combined=" + r18Nodash(contentId) + "/json", reqTimeout());
  if (isR18TransientStatus(full.status)) {
    if (overshoot()) return { detail: null, outcome: "deadline" };
    r18TriggerCooldown();
    return { detail: null, outcome: "limited" };
  }
  if (full.data && getText(full.data.title_ja) !== undefined && full.data.content_id) {
    R18_DETAIL_CACHE[key] = full.data;
    console.log("[pan115/r18dev/detail]", JSON.stringify({ code: key, via: "dvd_id->combined", contentId: contentId }));
    return { detail: full.data, outcome: "hit" };
  }
  return { detail: null, outcome: "miss" };
}

/**
 * r18.dev 影片列表（官网列表页同源 API，页面 JS 内发现）：
 *   GET /videos/vod/movies/list2/json?id=<id>&type=<actress|category|studio>&page=<n>
 * 返回 { results: [...], totalResults: n }，每页 100 条。
 */
async function fetchR18List(type, id, page) {
  var url = R18_BASE + "/videos/vod/movies/list2/json?id=" + encodeURIComponent(id)
    + "&type=" + encodeURIComponent(type) + "&page=" + (page || 1);
  var resp = await r18GetJson(url);
  var data = resp.data;
  if (isR18TransientStatus(resp.status)) {
    r18TriggerCooldown();
  }
  if (!data || Object.prototype.toString.call(data.results) !== "[object Array]") {
    console.log("[pan115/r18dev/fallback]", JSON.stringify({ list: type + "/" + id, page: page || 1, reason: "no-results" }));
    return null;
  }
  return {
    results: data.results,
    totalResults: Number(data.total_results) || 0
  };
}

// ==================== LibreFanza (libredmm.com) 兜底 (v1.8.0) ====================
// r18.dev 未收录的番号（如 NACT-170）从 LibreFanza 的服务端渲染页提取
// DMM digital content_id + 标题，再经变体探测验证封面。仅在 r18 双形态
//（原码 + 去后缀码）都确认 miss 后调用；无正式 JSON API，按页面结构做
// 最小化正则提取，页面改版时静默降级为 miss。
var LIBREFANZA_BASE = "https://www.libredmm.com";
var LIBREFANZA_TIMEOUT_MS = 10000;  // 单次页面请求超时（SSR 页面较大，1~3s 常态）
var LIBREFANZA_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
  "Accept": "text/html,application/xhtml+xml,*/*"
};

/**
 * MIAD-812U → MIAD-812（仅当存在尾字母后缀时返回去后缀形态，否则 null）
 */
function javBaseCode(code) {
  var parts = parseStandardCodeParts(code);
  if (!parts || !parts.suffix) return null;
  return parts.prefix + "-" + parts.number;
}

/**
 * LibreDMM slug 候选（v1.10.2）：
 * - 标准番号：显示形态（含横杠，如 NAAC-071）number 原样保留——LibreDMM 路由用
 *   官方显示形态（含前导零，naac-071 ✓ / naac-71 ✗，v1.8.0 实测）；content_id
 *   形态（无横杠，如 ipx00535，来自 115javmeta 路由）才去前导零。
 * - 数字开头前缀（mgstage 系：259LUXU-0957 / 300MIUM-1359 / 328CNSTV-027）：
 *   DMM/Libre 的显示形态会去掉厂牌数字前缀（luxu / mium / cnstv），且号码补零
 *   与否因系列而异（luxu-957 去零 ✓ / luxu-0957 ✗；cnstv-027 保留 ✓，2026-10
 *   实测）——生成"号码原样 + 号码去零"两个候选按序尝试，去重后通常 1~2 个。
 */
function librefanzaUrlCandidates(code) {
  var raw = String(code || "").toUpperCase();
  var hasDash = raw.indexOf("-") !== -1;
  var stripped = raw.replace(/[^A-Z0-9]/g, "");

  // FC2（FC2-4544804 / FC2PPV4544804 等）：LibreDMM slug 为 fc2-<号码>（剥 PPV，
  // 2026-10 实测 fc2-4544804 ✓ / fc2ppv-4544804 ✗）。单候选。
  var fc2 = stripped.match(/^FC2(?:PPV)?(\d{5,8})$/);
  if (fc2) return [LIBREFANZA_BASE + "/movies/fc2-" + fc2[1]];

  var mg = stripped.match(/^(\d{2,3})([A-Z]{2,10})(\d{2,8})([A-Z]?)$/);
  if (mg) {
    var out = [];
    var seen = {};
    var addSlug = function (num) {
      var url = LIBREFANZA_BASE + "/movies/" + mg[2].toLowerCase() + "-" + num + (mg[4] || "").toLowerCase();
      if (!seen[url]) { seen[url] = 1; out.push(url); }
    };
    addSlug(mg[3]);                    // 号码原样（cnstv-027 形态）
    addSlug(String(Number(mg[3])));    // 号码去零（luxu-957 形态）
    return out;
  }

  var m = stripped.match(/^(1?)([A-Z]{2,10})(\d{2,8})([A-Z]?)$/);
  if (!m) return [];
  var number = hasDash ? m[3] : String(Number(m[3]));
  return [LIBREFANZA_BASE + "/movies/" + m[2].toLowerCase() + "-" + number + (m[4] || "").toLowerCase()];
}

// 首个候选（兼容旧调用方/测试；fetchLibreFanzaMeta 用完整候选列表）
function librefanzaUrl(code) {
  var c = librefanzaUrlCandidates(code);
  return c.length ? c[0] : "";
}

async function fetchLibreFanzaPage(url, timeoutMs) {
  try {
    var resp = await Widget.http.get(url, { headers: LIBREFANZA_HEADERS, timeout: timeoutMs || LIBREFANZA_TIMEOUT_MS });
    var status = resp && resp.statusCode || 0;
    if (status !== 200) return { status: status, html: null };
    return { status: 200, html: typeof resp.data === "string" ? resp.data : null };
  } catch (e) {
    return { status: r18StatusFromError(e), html: null };
  }
}

function parseLibreFanzaPage(html) {
  if (!html) return null;
  var title = "";
  var h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) {
    title = h1[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    // 去掉前导番号（FC2 等前缀含数字的形态也要剥：FC2-4544804 …）
    title = title.replace(/^[A-Z0-9]{2,12}-\d{2,8}[A-Z]?\s*/i, "").trim();
  }

  // 路径 A：DMM 标题（digital / mono）——页面真实显示的封面 URL（digital 是
  // digital/video pl；mono 是 mono/movie/adult/{cid}{尾缀}/pl——凭 cid 拼路径
  // 会 302 到 now_printing 占位图）
  var coverMatch = html.match(/https:\/\/pics\.dmm\.co\.jp\/[^"'\\\s)]+\.jpg/i);
  var cidMatch = html.match(/pics\.dmm\.co\.jp\/digital\/video\/([a-z0-9_]+)\//);
  if (coverMatch || cidMatch) {
    var contentId = cidMatch ? cidMatch[1] : "";
    var coverUrl = coverMatch ? coverMatch[0] : "";
    if (!contentId && coverUrl) {
      var folder = coverUrl.match(/\/([a-z0-9_]+)\/[a-z0-9_]+\.jpg$/i);
      if (folder) contentId = folder[1];  // mono 标题：目录段即 cid（含 tk 等尾缀）
    }
    if (!contentId) return null;
    return { contentId: contentId, titleJa: title, coverUrl: coverUrl };
  }

  // 路径 B（v1.10.2）：mgstage 独占标题（259LUXU / 300MIUM 等数字前缀系列）——
  // 页面无任何 DMM 图，内嵌 image.mgstage.com 官方商品图（pf_=正面 pb_=背面）。
  // 页面提供的 URL 直接采信（等同 mono 页面封面的可信级别）：mgstage 域名探测
  // 语义不可靠（区域 403 与不存在无法区分），不做存在性探测。
  var mgPoster = html.match(/https:\/\/image\.mgstage\.com\/[^"'\\\s)]*\/pf_[^"'\\\s)]*\.jpg/i);
  var mgBackdrop = html.match(/https:\/\/image\.mgstage\.com\/[^"'\\\s)]*\/pb_[^"'\\\s)]*\.jpg/i);
  var mgAny = html.match(/https:\/\/image\.mgstage\.com\/[^"'\\\s)]*\.jpg/i);
  var mgPosterUrl = (mgPoster && mgPoster[0]) || (mgAny && mgAny[0]) || "";
  if (mgPosterUrl) {
    var product = html.match(/product_detail\/([A-Z0-9]+-[A-Z0-9]+)/i);
    return {
      contentId: "",
      mgstageCode: product ? product[1].toUpperCase() : "",
      titleJa: title,
      posterUrl: mgPosterUrl,
      coverUrl: (mgBackdrop && mgBackdrop[0]) || mgPosterUrl
    };
  }

  // 路径 C（v1.11.0）：FC2 独占标题——页面无 DMM/mgstage 图，内嵌 FC2 官方内容
  // 缩略图（contents-thumbnail2.fc2.com）。注意：缩略图 URL 会随内容过期失效
  //（失效时 CDN 返回 404 + "No Image" 占位图 body，2026-10 实测），URL 是否
  // 可用由调用方探测决定；标题/发行日期始终有效。
  var fc2Thumb = html.match(/https:\/\/contents-thumbnail2\.fc2\.com\/[^"'\\\s)]+\.(?:png|jpe?g)/i);
  if (fc2Thumb) {
    var fc2Date = html.match(/Release Date<\/dt>\s*<dd>(\d{4}-\d{2}-\d{2})</i);
    return {
      contentId: "",
      fc2: true,
      titleJa: title,
      posterUrl: fc2Thumb[0],
      coverUrl: fc2Thumb[0],
      releaseDate: fc2Date ? fc2Date[1] : ""
    };
  }
  return null;
}

/**
 * LibreFanza 兜底查询（v1.10.2：slug 候选迭代 + mgstage 独占标题支持）：
 *   { outcome: "hit", meta }       → 命中。DMM 标题（code = 真实 digital cid，
 *                                    封面初值 = 页面真实显示的 pics 封面，由
 *                                    verifyMetaCoverUrls 探测升级/验证）；mgstage
 *                                    独占标题（code = 页面链接的 mgstage 商品号，
 *                                    封面 = 页面内嵌官方图，noDmmVerify 跳过 DMM
 *                                    探测）；
 *   { outcome: "miss" }            → 全部 slug 候选 HTTP 404（definitive）；
 *   { outcome: "transient", status } → 429/403/5xx/0，以及 200 但解析失败
 *                                    （页面改版/反爬/不完整 HTML——绝不能当
 *                                    definitive miss 批量污染负缓存）。
 * 恒不 reject。
 */
async function fetchLibreFanzaMeta(code, opts) {
  var candidates = librefanzaUrlCandidates(code);
  if (!candidates.length) return { outcome: "miss" };  // slug 无法构造：形态不支持，重试结果不变
  console.log("[pan115/librefanza/request]", JSON.stringify({ code: code, candidates: candidates }));
  var startedAt = Date.now();

  for (var ci = 0; ci < candidates.length; ci++) {
    var resp = await fetchLibreFanzaPage(candidates[ci], opts && opts.timeout);
    if (resp.status === 404) continue;  // 本形态未收录：试下一候选
    if (resp.status !== 200) {
      console.log("[pan115/librefanza/fallback]", JSON.stringify({ code: code, status: resp.status, elapsedMs: Date.now() - startedAt }));
      return { outcome: "transient", status: resp.status };
    }
    var parsed = parseLibreFanzaPage(resp.html);
    if (!parsed) {
      console.log("[pan115/librefanza/fallback]", JSON.stringify({ code: code, status: 200, reason: "parse-empty" }));
      return { outcome: "transient", status: 200 };
    }

    var meta;
    if (parsed.contentId) {
      // DMM 标题：封面初值 = 页面真实显示的 pics 封面（ps 竖图由 pl 横图推导，
      // 同包生成）。verifyMetaCoverUrls 会在 awsimgsrc 变体命中时升级为 ps/pl 大图
      var pageCover = parsed.coverUrl || "";
      var pagePoster = pageCover ? pageCover.replace(/pl\.jpg/i, "ps.jpg") : "";
      meta = {
        code: parsed.contentId,
        dvdId: String(code || "").toUpperCase(),
        titleJa: parsed.titleJa,
        posterUrl: pagePoster || pageCover,
        coverUrl: pageCover || pagePoster,
        source: "librefanza"
      };
      console.log("[pan115/librefanza/detail]", JSON.stringify({ code: code, contentId: parsed.contentId, title: (parsed.titleJa || "").slice(0, 40) }));
    } else if (parsed.fc2) {
      // FC2 独占标题：缩略图必须存在性探测——失效图返回 404 + "No Image" 占位
      // body（状态码语义干净：200=真图 / 404=占位）。探测不过 → 降级纯标题
      //（标题/日期仍然有效）；不确定（5xx/超时）同降级，下次重试。
      var fc2Poster = "";
      var thumbState = await dmmhdProbeUrl(parsed.posterUrl, (opts && opts.deadlineAt) || 0);
      if (thumbState === true) {
        fc2Poster = parsed.posterUrl;
      }
      meta = {
        code: String(code || "").toUpperCase(),
        dvdId: String(code || "").toUpperCase(),
        titleJa: parsed.titleJa,
        releaseDate: parsed.releaseDate || "",
        posterUrl: fc2Poster,
        coverUrl: fc2Poster,
        noDmmVerify: true,
        source: "librefanza"
      };
      console.log("[pan115/librefanza/detail]", JSON.stringify({ code: code, fc2: true, hasArt: !!fc2Poster, title: (parsed.titleJa || "").slice(0, 40) }));
    } else {
      // mgstage 独占标题：封面 = 页面内嵌官方图（可信级别等同 mono 页面封面，
      // 不做 DMM 探测）；code = 页面链接的 mgstage 商品号（如 259LUXU-957）
      meta = {
        code: parsed.mgstageCode || String(code || "").toUpperCase(),
        dvdId: String(code || "").toUpperCase(),
        titleJa: parsed.titleJa,
        posterUrl: parsed.posterUrl || "",
        coverUrl: parsed.coverUrl || parsed.posterUrl || "",
        noDmmVerify: true,
        source: "librefanza"
      };
      console.log("[pan115/librefanza/detail]", JSON.stringify({ code: code, mgstageCode: meta.code, mgstage: true, title: (parsed.titleJa || "").slice(0, 40) }));
    }
    meta.description = "";
    if (!meta.releaseDate) meta.releaseDate = "";  // FC2 路径已携带发行日期，不覆盖
    meta.releaseYear = 0;
    meta.runtime = 0;
    meta.director = "";
    meta.maker = "";
    meta.label = "";
    meta.series = "";
    meta.ratingScore = 0;
    meta.screenshots = [];
    meta.actresses = [];
    meta.genres = [];
    meta.makerId = 0;
    return { outcome: "hit", meta: meta };
  }

  console.log("[pan115/librefanza/fallback]", JSON.stringify({ code: code, status: 404, candidates: candidates.length, elapsedMs: Date.now() - startedAt }));
  return { outcome: "miss" };
}

/**
 * r18.dev detail JSON → 统一 meta（fetchJavMeta 的产出物，额外携带 r18Id/makerId/dvdId）。
 * 封面初值 = r18 自带 jacket 图（确定性 URL）；fetchJavMeta 随后做变体探测，
 * 命中真实 cid 时升级为 awsimgsrc ps/pl 大图。
 */
function normalizeR18Detail(d) {
  if (!d) return null;
  var screenshots = [];
  var gallery = Object.prototype.toString.call(d.gallery) === "[object Array]" ? d.gallery : [];
  for (var i = 0; i < gallery.length && screenshots.length < 12; i++) {
    if (gallery[i] && gallery[i].image_full) screenshots.push(gallery[i].image_full);
  }
  screenshots = sanitizeJavStills(screenshots);  // 缩略图形态升级/拦截（v1.13.0）
  var actresses = [];
  var acts = Object.prototype.toString.call(d.actresses) === "[object Array]" ? d.actresses : [];
  for (var a = 0; a < acts.length; a++) {
    var act = acts[a] || {};
    var name = getText(act.name_kanji) || getText(act.name_romaji);
    if (!name) continue;
    actresses.push({
      name: name,
      japaneseName: getText(act.name_kanji) || "",
      thumbUrl: act.image_url ? "https://pics.dmm.co.jp/mono/actjpgs/" + act.image_url : "",
      r18Id: Number(act.id) || 0
    });
  }
  var genres = [];
  var cats = Object.prototype.toString.call(d.categories) === "[object Array]" ? d.categories : [];
  for (var g = 0; g < cats.length; g++) {
    var cat = cats[g] || {};
    var genreName = getText(cat.name_en);
    if (!genreName) continue;
    genres.push({ name: genreName, r18Id: Number(cat.id) || 0 });
  }
  var directors = [];
  var dirs = Object.prototype.toString.call(d.directors) === "[object Array]" ? d.directors : [];
  for (var di = 0; di < dirs.length; di++) {
    var dirName = getText(dirs[di] && (dirs[di].name_kanji || dirs[di].name_romaji));
    if (dirName) directors.push(dirName);
  }
  var releaseDate = getText(d.release_date).slice(0, 10) || "";
  return {
    code: getText(d.content_id) || "",
    dvdId: getText(d.dvd_id) || "",
    titleJa: getText(d.title_ja) || "",
    titleEn: getText(d.title_en) || "",
    description: "",
    releaseDate: releaseDate,
    releaseYear: Number(releaseDate.slice(0, 4)) || 0,
    runtime: Number(d.runtime_mins) || 0,
    director: directors.join(", "),
    maker: getText(d.maker_name_en) || "",
    label: getText(d.label_name_en) || "",
    series: getText(d.series_name_en) || "",
    ratingScore: 0,
    posterUrl: getText(d.jacket_thumb_url) || "",
    coverUrl: getText(d.jacket_full_url) || "",
    screenshots: screenshots,
    actresses: actresses,
    genres: genres,
    makerId: Number(d.maker_id) || 0,
    source: "r18dev"
  };
}

/**
 * 元数据详情（115javmeta://）：r18.dev detail 为主，走 fetchJavMeta（缓存优先）。
 */
async function handleMetaDetail(code) {
  code = String(code || "").trim();
  if (!code) return null;
  console.log("[pan115/r18dev/metaDetail]", code);
  var meta = await fetchJavMeta(code, { ignoreNegative: true });
  if (!meta) {
    // v1.10.0: 富抓取未命中也尽量带上已验证封面索引（此前列表探测/救援成功过的话）
    var fallbackCover = readVerifiedCoverForDetail(code);
    return {
      id: "115javmeta_" + code,
      type: "detail",
      title: code,
      name: code,
      description: "r18.dev 未收录该影片",
      mediaType: "movie",
      rating: DEFAULT_RATING,
      link: "115javmeta://" + encodeURIComponent(code),
      posterPath: fallbackCover ? fallbackCover.poster : "",
      coverUrl: fallbackCover ? fallbackCover.poster : "",
      backdropPath: fallbackCover ? (fallbackCover.backdrop || fallbackCover.poster) : ""
    };
  }

  var dvdId = meta.dvdId || "";
  var itemId = dvdId || meta.code || code;
  var link = "115javmeta://" + encodeURIComponent(meta.code || code)
    + (dvdId ? "?dvd=" + encodeURIComponent(dvdId) : "");

  return buildJavDetailItem(itemId, meta, {}, {
    id: itemId,
    link: link,
    fallbackTitle: dvdId || code
  });
}

/**
 * 解析详情页演员/标签/片商点击回调：peoples[].id / genreItems[].id
 * 形如 r18dev/actress/1039157、r18dev/category/1033、r18dev/studio/1219。
 * 其他格式返回 null（回落现有 115 浏览行为）。
 */
function parseJavBrowseParams(params) {
  var raw = getText(params && params.peopleId) || getText(params && params.genreId);
  if (!raw) return null;
  var m = raw.match(/^r18dev\/(actress|category|studio)\/(\d+)$/);
  if (!m) return null;
  return { type: m[1], id: m[2], raw: raw };
}

/**
 * 演员/标签/片商影片列表（纯元数据，免 115 Cookie）。
 * r18.dev 每页 100 条；Forward 页（每页 30）映射到 r18 页 + 切片。
 */
async function handleJavBrowseList(browse, params) {
  var page = parseInt(params && params.page || "1", 10) || 1;
  var pageSize = 30;
  var offset = (page - 1) * pageSize;
  var r18Page = Math.floor(offset / 100) + 1;
  var sliceStart = offset % 100;

  var list = await fetchR18List(browse.type, browse.id, r18Page);
  if (!list || !list.results || !list.results.length) {
    console.log("[pan115/r18dev/list]", JSON.stringify({ type: browse.type, id: browse.id, page: page, empty: true }));
    return [{
      id: "r18browse_empty_" + page,
      type: "url",
      title: "没有更多了",
      mediaType: "movie",
      link: "",
      description: browse.raw
    }];
  }

  var items = [];
  for (var i = sliceStart; i < list.results.length && items.length < pageSize; i++) {
    var r = list.results[i];
    if (!r || !getText(r.content_id)) continue;
    var titleJa = getText(r.title_ja) || getText(r.title_en) || getText(r.dvd_id) || getText(r.content_id);
    var thumb = getText(r.jacket_thumb_url) || "";
    var releaseDate = getText(r.release_date).slice(0, 10) || "";
    var item = {
      id: "r18meta_" + getText(r.content_id),
      vod_id: "r18meta_" + getText(r.content_id),
      type: "url",
      title: titleJa,
      name: titleJa,
      originalTitle: getText(r.dvd_id) || getText(r.content_id),
      posterPath: thumb,
      coverUrl: thumb,
      backdropPath: thumb,
      mediaType: "movie",
      rating: DEFAULT_RATING,
      link: "115javmeta://" + encodeURIComponent(getText(r.content_id))
    };
    if (releaseDate) item.releaseDate = releaseDate;
    items.push(item);
  }

  console.log("[pan115/r18dev/list]", JSON.stringify({
    type: browse.type,
    id: browse.id,
    page: page,
    returned: items.length,
    total: list.totalResults
  }));
  return items;
}

// ==================== Cookie 同步 ====================

// v1.15.0: 115 Cookie 持久化 —— loadDetail 运行在全新 JS 上下文且无 params 注入
//（v1.5.1 对 JAV 服务配置的同款教训），模块级 COOKIE_115 在详情上下文里永远为空，
// 导致非 JAV 文件夹详情页固定落入"需要 115 Cookie"降级分支（id=115folder_nocookie_*，
// 播放不受影响：loadResource 上下文有 params.cookie）。任意带 cookie 的调用
//（列表/播放，syncCookie）落盘一次；无 params 的上下文（详情/离线回执）惰性恢复。
var COOKIE_STORAGE_KEY = "pan115-cookie";
var COOKIE_LAST_PERSISTED = "";

function persistCookie(cookie) {
  if (!cookie || cookie === COOKIE_LAST_PERSISTED) return;
  if (storeSetJSON(COOKIE_STORAGE_KEY, cookie)) COOKIE_LAST_PERSISTED = cookie;
}

function restoreCookieFromStorage() {
  if (COOKIE_115) return COOKIE_115;
  var stored = storeGetJSON(COOKIE_STORAGE_KEY, "");
  if (stored && typeof stored === "string" && stored.length > 10) {
    COOKIE_115 = stored;
    console.log("[pan115/cookie] restored from storage, length:", stored.length);
  }
  return COOKIE_115;
}

function resolveCookie(params) {
  if (params && params.cookie) return getText(params.cookie);
  if (COOKIE_115) return COOKIE_115;
  return restoreCookieFromStorage();
}

function syncCookie(cookie) {
  COOKIE_115 = cookie || "";
  if (COOKIE_115) persistCookie(COOKIE_115);
}

// ==================== 构建函数 ====================

/**
 * buildFallbackBrowseItem — 纯本地 fallback 浏览卡片
 * 不依赖任何网络调用，确保合法视频文件至少显示一张卡片
 */
function buildFallbackBrowseItem(file) {
  var filename = String(file && (file.filename || file.name || file.n || "") || "");
  var itemTitle = safeDisplayTitleFromFile(filename);
  var number = "";
  var mediaKey = null;

  try {
    mediaKey = resolveMediaKeyFromText(filename, { source: "fallback-file" });
    if (mediaKey && mediaKey.displayTitle) itemTitle = mediaKey.displayTitle;
    if (mediaKey && mediaKey.type === "jav") number = mediaKey.key;
  } catch (e) {
    console.warn("[pan115/buildFallbackBrowseItem] resolver failed:", filename, e && e.message || e);
  }
  var backdropPath = "";

  var descParts = [];
  if (number) descParts.push("番号: " + number);
  descParts.push("原文件: " + filename);
  if (formatSize(file.size)) descParts.push("大小: " + formatSize(file.size));
  var description = descParts.filter(Boolean).join(" · ");

  PICKCODE_FILE_MAP[file.pickcode] = {
    title: itemTitle,
    filename: filename,
    size: file.size,
    number: number,
    mediaKey: mediaKey,
    matchType: mediaKey && mediaKey.type || "",
    backdropPath: backdropPath,
    description: description
  };

  var link = "115detail://" + file.pickcode;
  if (number) {
    link += "?title=" + encodeURIComponent(number);
  }

  var itemId = number || ("115_" + file.pickcode);

  console.log("[pan115] [FALLBACK] filename:", filename,
              "number:", number, "title:", itemTitle);

  return {
    id: itemId,
    vod_id: itemId,
    type: "url",
    title: itemTitle,
    name: itemTitle,
    originalTitle: number || itemTitle,
    backdropPath: backdropPath,
    coverUrl: backdropPath,
    posterPath: backdropPath,
    mediaType: "movie",
    link: link,
    description: description,
    rating: DEFAULT_RATING
  };
}

// ==================== buildFolderBrowseItem — 文件夹浏览卡片 ====================

async function buildFolderBrowseItem(folder) {
  var folderName = get115Name(folder);
  var cid = get115Cid(folder);
  var mediaKeyType = null;
  var itemTitle = safeDisplayTitleFromFile(folderName);

  try {
    mediaKeyType = resolveMediaKeyFromText(folderName, { source: "folder" });
    if (mediaKeyType && mediaKeyType.displayTitle && mediaKeyType.type !== "unknown") {
      itemTitle = mediaKeyType.displayTitle;
    }
  } catch (e) {
    console.warn("[pan115/buildFolderBrowseItem] resolver failed:", folderName, e && e.message || e);
  }

  if (!cid) {
    console.warn("[pan115/buildFolderBrowseItem] missing cid:", folderName);
    return null;
  }

  var mediaType = (mediaKeyType && mediaKeyType.type) || "unknown";

  var canonicalCode = extractStandardCode((mediaKeyType && mediaKeyType.key) || folderName);

  var posterPath = "";
  var backdropPath = "";
  var artworkStrategy = "none";

  // 规则封面（direct-dmm/mgstage；未命中的 unsupported-jav 由列表页回填走 r18.dev）
  if (mediaType === "jav" && canonicalCode) {
    var candidates = buildImageCandidatesFromValue(canonicalCode);
    artworkStrategy = candidates.strategy;
    if (artworkStrategy === "direct-dmm" || artworkStrategy === "mgstage") {
      posterPath = chooseFirstCandidate(candidates.posterCandidates);
      backdropPath = chooseFirstCandidate(candidates.backdropCandidates) || posterPath;
    }
  }

  var rawTitle = folderName || itemTitle;
  var mediaKeyForLink = canonicalCode || (mediaKeyType && mediaKeyType.key) || "";
  var javFolderLink = (mediaType === "jav" && canonicalCode);
  var linkScheme = javFolderLink ? "115javfolder://" : "115folder://";
  var link = linkScheme + encodeURIComponent(cid)
    + "?title="     + encodeURIComponent(mediaKeyForLink || itemTitle || folderName || "文件夹")
    + (javFolderLink ? ("&mediaKey=" + encodeURIComponent(canonicalCode)) : "")
    + "&mediaType=" + encodeURIComponent(mediaType)
    + "&rawTitle="  + encodeURIComponent(rawTitle);
  var _folderMediaKey = canonicalCode || (mediaKeyType && mediaKeyType.key) || "";

  debugFastIndex("[pan115/fastIndex/folder]", {
    rawName: folderName,
    mediaType: mediaType,
    mediaKeyRaw: (mediaKeyType && mediaKeyType.key) || "",
    canonicalCode: canonicalCode || "",
    artworkStrategy: artworkStrategy,
    posterEmpty: !posterPath,
    backdropEmpty: !backdropPath,
    cid: cid,
    linkTitle: mediaKeyForLink || itemTitle || folderName
  });

  var result = {
    id: "115folder_" + cid,
    vod_id: "115folder_" + cid,
    type: "url",
    title: "\ud83d\udcc1 " + (itemTitle || folderName || "\u6587\u4ef6\u5939"),
    name: itemTitle || folderName || "\u6587\u4ef6\u5939",
    originalTitle: folderName,
    mediaType: "movie",
    link: link,
    description: "\u5b50\u6587\u4ef6\u5939 \u00b7 \u70b9\u51fb\u8fdb\u5165",
    coverUrl: posterPath,
    posterPath: posterPath,
    backdropPath: backdropPath,
    rating: DEFAULT_RATING,
    // v1.7.0: 所有识别出番号的 JAV 条目都交给 r18.dev 回填/校验封面
    //（缓存优先；direct-dmm 猜错 maker 前缀、mgstage 盲拼 404 都会被修正）
    _javEnrichKey: (mediaType === "jav" && canonicalCode) ? canonicalCode : ""
  };

  return result;
}


async function buildBrowseItem(cookie, file) {
  if (!file.pickcode || !file.filename || !isVideoFile(file.filename)) return null;

  var filename = String(file && (file.filename || file.name || file.n || "") || "");
  var itemTitle = safeDisplayTitleFromFile(filename);
  var mediaKeyType = null;

  try {
    itemTitle = safeDisplayTitleFromFile(filename);

    mediaKeyType = resolveMediaKeyFromText(filename, { source: "file" });
    var mediaType = (mediaKeyType && mediaKeyType.type) || "unknown";

    // 约束 #5: 优先复用已识别的 key，失败后回退原文件名
    var canonicalCode = extractStandardCode((mediaKeyType && mediaKeyType.key) || filename);

    // 封面构造（同步，无网络）
    var posterPath = "";
    var backdropPath = "";
    var artworkStrategy = "none";

    // 规则封面（direct-dmm/mgstage；未命中的 unsupported-jav 由列表页回填走 r18.dev）
    if (mediaType === "jav" && canonicalCode) {
      var candidates = buildImageCandidatesFromValue(canonicalCode);
      artworkStrategy = candidates.strategy;
      if (artworkStrategy === "direct-dmm" || artworkStrategy === "mgstage") {
        posterPath = chooseFirstCandidate(candidates.posterCandidates);
        backdropPath = chooseFirstCandidate(candidates.backdropCandidates) || posterPath;
      }
    }

    // 读取运行时 meta cache (仅当规则封面为空时回退到 r18.dev meta 封面)
    if (!posterPath) {
      var cachedMeta = PICKCODE_FILE_MAP[file.pickcode] || {};
      if (cachedMeta.metaPosterPath) {
        posterPath = cachedMeta.metaPosterPath;
        backdropPath = cachedMeta.metaBackdropPath || posterPath;
        if (!cachedMeta.metaTitle) {
          // 如果有 meta 封面但无 metaTitle，不改变 itemTitle
        }
        debugFastIndex("[pan115/metaCache/hit]", {
          pickcode: file.pickcode,
          mediaKey: canonicalCode || (mediaKeyType && mediaKeyType.key) || "",
          hasMetaPoster: !!cachedMeta.metaPosterPath,
          hasMetaBackdrop: !!cachedMeta.metaBackdropPath
        });
      }
    }

    // 构建 link
    var mediaKeyForLink = canonicalCode || (mediaKeyType && mediaKeyType.key) || "";
    var displayName = (mediaKeyType && mediaKeyType.displayTitle) || itemTitle;
    var rawTitle = filename || displayName || itemTitle;

    var link = "115detail://" + file.pickcode
      + "?title="     + encodeURIComponent(mediaKeyForLink || displayName || filename)
      + "&mediaType=" + encodeURIComponent(mediaType)
      + "&rawTitle="  + encodeURIComponent(rawTitle);

    // PICKCODE_FILE_MAP 字段独立储存
    PICKCODE_FILE_MAP[file.pickcode] = {
      title:           itemTitle || displayName,
      filename:        filename,
      size:            file.size,
      mediaKey:        canonicalCode || (mediaKeyType && mediaKeyType.key) || "",
      mediaType:       mediaType,
      posterPath:      posterPath,
      backdropPath:    backdropPath,
      artworkStrategy: artworkStrategy
    };
    debugFastIndex("[pan115/cache/write]", {
      pickcode: file.pickcode,
      mediaKey: canonicalCode || (mediaKeyType && mediaKeyType.key) || "",
      mediaType: mediaType,
      hasPoster: !!posterPath,
      hasBackdrop: !!backdropPath,
      artworkStrategy: artworkStrategy,
      filename: filename
    });

    var itemId = canonicalCode || (mediaKeyType && mediaKeyType.key) || ("115_" + file.pickcode);

    var _browseMediaKey = canonicalCode || (mediaKeyType && mediaKeyType.key) || "";
    var _browseDisplayName = (mediaKeyType && mediaKeyType.displayTitle) || itemTitle || "";
    var _browseLinkTitle = mediaKeyForLink || _browseDisplayName || filename;

    debugFastIndex("[pan115/fastIndex/file]", {
      rawName: filename,
      displayName: _browseDisplayName,
      mediaType: mediaType,
      mediaKeyRaw: (mediaKeyType && mediaKeyType.key) || "",
      canonicalCode: canonicalCode || "",
      artworkStrategy: artworkStrategy,
      posterEmpty: !posterPath,
      backdropEmpty: !backdropPath,
      linkTitle: _browseLinkTitle,
      pickcode: file.pickcode
    });

    // v1.7.0: 所有识别出番号的 JAV 条目都交给 r18.dev 回填/校验封面
    //（缓存优先；direct-dmm 猜错 maker 前缀、mgstage 盲拼 404 都会被修正）
    var javEnrichKey = (mediaType === "jav" && canonicalCode) ? canonicalCode : "";

    return {
      id: itemId,
      vod_id: itemId,
      type: "url",
      title: itemTitle,
      name: itemTitle,
      originalTitle: canonicalCode || (mediaKeyType && mediaKeyType.key) || itemTitle,
      posterPath: posterPath,
      coverUrl: posterPath,
      backdropPath: backdropPath,
      mediaType: "movie",
      link: link,
      description: "原文件: " + file.filename + (formatSize(file.size) ? " \u00b7 " + formatSize(file.size) : ""),
      rating: DEFAULT_RATING,
      _javEnrichKey: javEnrichKey
    };
  } catch (err) {
    console.warn("[pan115/buildBrowseItem] abnormal, using fallback",
                 file.filename,
                 err && err.message ? err.message : err);
    return buildFallbackBrowseItem(file);
  }
}

// ==================== 115 原文件直链（v1.12.0，m3u8 空响应兜底）====================
// 实测：115 转码接口 /api/video/m3u8/{pickcode}.m3u8 对部分文件返回 HTTP 200
// + 0 字节（云转码未完成/不支持），此前 buildStreamSources 静默返回 0 源 →
// rex/Forward 报"找不到播放源"。Forward 侧实际能播靠的是 AVDB 模块的
// video-original-downurl 原文件直链兜底——本节将该能力内置（加密栈与
// proapi.115.com/app/chrome/downurl 交互逻辑取自 AVDB 已验证实现），
// 使本模块独立完整，不再依赖 AVDB 同时在场。

function md5(s) {
  function md5cycle(h, x) {
    var a = h[0], b = h[1], c = h[2], d = h[3];
    a = ff(a, b, c, d, x[0], 7, -680876936); d = ff(d, a, b, c, x[1], 12, -389564586); c = ff(c, d, a, b, x[2], 17, 606105819); b = ff(b, c, d, a, x[3], 22, -1044525330);
    a = ff(a, b, c, d, x[4], 7, -176418897); d = ff(d, a, b, c, x[5], 12, 1200080426); c = ff(c, d, a, b, x[6], 17, -1473231341); b = ff(b, c, d, a, x[7], 22, -45705983);
    a = ff(a, b, c, d, x[8], 7, 1770035416); d = ff(d, a, b, c, x[9], 12, -1958414417); c = ff(c, d, a, b, x[10], 17, -42063); b = ff(b, c, d, a, x[11], 22, -1990404162);
    a = ff(a, b, c, d, x[12], 7, 1804603682); d = ff(d, a, b, c, x[13], 12, -40341101); c = ff(c, d, a, b, x[14], 17, -1502002290); b = ff(b, c, d, a, x[15], 22, 1236535329);
    a = gg(a, b, c, d, x[1], 5, -165796510); d = gg(d, a, b, c, x[6], 9, -1069501632); c = gg(c, d, a, b, x[11], 14, 643717713); b = gg(b, c, d, a, x[0], 20, -373897302);
    a = gg(a, b, c, d, x[5], 5, -701558691); d = gg(d, a, b, c, x[10], 9, 38016083); c = gg(c, d, a, b, x[15], 14, -660478335); b = gg(b, c, d, a, x[4], 20, -405537848);
    a = gg(a, b, c, d, x[9], 5, 568446438); d = gg(d, a, b, c, x[14], 9, -1019803690); c = gg(c, d, a, b, x[3], 14, -187363961); b = gg(b, c, d, a, x[8], 20, 1163531501);
    a = gg(a, b, c, d, x[13], 5, -1444681467); d = gg(d, a, b, c, x[2], 9, -51403784); c = gg(c, d, a, b, x[7], 14, 1735328473); b = gg(b, c, d, a, x[12], 20, -1926607734);
    a = hh(a, b, c, d, x[5], 4, -378558); d = hh(d, a, b, c, x[8], 11, -2022574463); c = hh(c, d, a, b, x[11], 16, 1839030562); b = hh(b, c, d, a, x[14], 23, -35309556);
    a = hh(a, b, c, d, x[1], 4, -1530992060); d = hh(d, a, b, c, x[4], 11, 1272893353); c = hh(c, d, a, b, x[7], 16, -155497632); b = hh(b, c, d, a, x[10], 23, -1094730640);
    a = hh(a, b, c, d, x[13], 4, 681279174); d = hh(d, a, b, c, x[0], 11, -358537222); c = hh(c, d, a, b, x[3], 16, -722521979); b = hh(b, c, d, a, x[6], 23, 76029189);
    a = hh(a, b, c, d, x[9], 4, -640364487); d = hh(d, a, b, c, x[12], 11, -421815835); c = hh(c, d, a, b, x[15], 16, 530742520); b = hh(b, c, d, a, x[2], 23, -995338651);
    a = ii(a, b, c, d, x[0], 6, -198630844); d = ii(d, a, b, c, x[7], 10, 1126891415); c = ii(c, d, a, b, x[14], 15, -1416354905); b = ii(b, c, d, a, x[5], 21, -57434055);
    a = ii(a, b, c, d, x[12], 6, 1700485571); d = ii(d, a, b, c, x[3], 10, -1894986606); c = ii(c, d, a, b, x[10], 15, -1051523); b = ii(b, c, d, a, x[1], 21, -2054922799);
    a = ii(a, b, c, d, x[8], 6, 1873313359); d = ii(d, a, b, c, x[15], 10, -30611744); c = ii(c, d, a, b, x[6], 15, -1560198380); b = ii(b, c, d, a, x[13], 21, 1309151649);
    a = ii(a, b, c, d, x[4], 6, -145523070); d = ii(d, a, b, c, x[11], 10, -1120210379); c = ii(c, d, a, b, x[2], 15, 718787259); b = ii(b, c, d, a, x[9], 21, -343485551);
    h[0] = safe_add(a, h[0]); h[1] = safe_add(b, h[1]); h[2] = safe_add(c, h[2]); h[3] = safe_add(d, h[3]);
  }
  function cmn(q, a, b, x, s, t) { return safe_add(rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b); }
  function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
  function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
  function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
  function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
  function rol(n, b) { return (n << b) | (n >>> (32 - b)); }
  function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }
  function str2binl(str) {
    var bin = [];
    for (var i = 0; i < str.length * 8; i += 8) {
      bin[i >> 5] |= (str.charCodeAt(i / 8) & 0xFF) << (i % 32);
    }
    return bin;
  }
  function binl2hex(binarray) {
    var hex = "";
    for (var i = 0; i < binarray.length * 4; i++) {
      hex += "0123456789abcdef".charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 15) +
             "0123456789abcdef".charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 15);
    }
    return hex;
  }
  var x = str2binl(s);
  var lenBits = s.length * 8;
  x[lenBits >> 5] |= 0x80 << ((lenBits) % 32);
  while (((x.length * 32) % 512) !== 448) { x.push(0); }
  x.push(lenBits & 0xFFFFFFFF);
  x.push(Math.floor(lenBits / 0x100000000) & 0xFFFFFFFF);
  var h = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476];
  for (var i = 0; i < x.length; i += 16) {
    md5cycle(h, x.slice(i, i + 16));
  }
  return binl2hex(h);
}

var M115_RSA_MODULUS_HEX =
  "8686980c0f5a24c4b9d43020cd2c22703ff3f450756529058b1cf88f09b8602" +
  "136477198a6e2683149659bd122c33592fdb5ad47944ad1ea4d36c6b172aad633" +
  "8c3bb6ac6227502d010993ac967d1aef00f0c8e038de2e4d3bc2ec368af2e9f10" +
  "a6f1eda4f7262f136420c07c331b871bf139f74f3010e3c4fe57df3afb71683";
var M115_RSA_BLOCK_SIZE = 128;
var M115_RSA_PAYLOAD_SIZE = M115_RSA_BLOCK_SIZE - 11;
var M115_G_KTS = [
  240, 229, 105, 174, 191, 220, 191, 138, 26, 69, 232, 190, 125, 166, 115, 184,
  222, 143, 231, 196, 69, 218, 134, 196, 155, 100, 139, 20, 106, 180, 241, 170,
  56, 1, 53, 158, 38, 105, 44, 134, 0, 107, 79, 165, 54, 52, 98, 166,
  42, 150, 104, 24, 242, 74, 253, 189, 107, 151, 143, 77, 143, 137, 19, 183,
  108, 142, 147, 237, 14, 13, 72, 62, 215, 47, 136, 216, 254, 254, 126, 134,
  80, 149, 79, 209, 235, 131, 38, 52, 219, 102, 123, 156, 126, 157, 122, 129,
  50, 234, 182, 51, 222, 58, 169, 89, 52, 102, 59, 170, 186, 129, 96, 72,
  185, 213, 129, 156, 248, 108, 132, 119, 255, 84, 120, 38, 95, 190, 232, 30,
  54, 159, 52, 128, 92, 69, 44, 155, 118, 213, 27, 143, 204, 195, 184, 245
];
var M115_G_KEY_S = [0x29, 0x23, 0x21, 0x5e];
var M115_G_KEY_L = [120, 6, 173, 76, 51, 134, 93, 24, 76, 1, 63, 70];

function m115HexToBytes(hex) {
  var output = [];
  for (var i = 0; i < hex.length; i += 2) output.push(parseInt(hex.substr(i, 2), 16));
  return output;
}

var M115_RSA_MODULUS = m115HexToBytes(M115_RSA_MODULUS_HEX);

function m115ConcatBytes(parts) {
  var output = [];
  for (var i = 0; i < parts.length; i++) {
    for (var j = 0; j < parts[i].length; j++) output.push(parts[i][j] & 0xff);
  }
  return output;
}

function m115Utf8Encode(text) {
  var output = [];
  var value = String(text || "");
  for (var i = 0; i < value.length; i++) {
    var code = value.charCodeAt(i);
    if (code >= 0xd800 && code <= 0xdbff && i + 1 < value.length) {
      var low = value.charCodeAt(i + 1);
      if (low >= 0xdc00 && low <= 0xdfff) {
        code = 0x10000 + ((code - 0xd800) << 10) + (low - 0xdc00);
        i++;
      }
    }
    if (code < 0x80) {
      output.push(code);
    } else if (code < 0x800) {
      output.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    } else if (code < 0x10000) {
      output.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    } else {
      output.push(0xf0 | (code >> 18), 0x80 | ((code >> 12) & 0x3f),
                  0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    }
  }
  return output;
}

function m115Utf8Decode(bytes) {
  var output = "";
  for (var i = 0; i < bytes.length;) {
    var first = bytes[i++] & 0xff;
    var code;
    if (first < 0x80) {
      code = first;
    } else if ((first & 0xe0) === 0xc0 && i < bytes.length) {
      code = ((first & 0x1f) << 6) | (bytes[i++] & 0x3f);
    } else if ((first & 0xf0) === 0xe0 && i + 1 < bytes.length) {
      code = ((first & 0x0f) << 12) | ((bytes[i++] & 0x3f) << 6) | (bytes[i++] & 0x3f);
    } else if ((first & 0xf8) === 0xf0 && i + 2 < bytes.length) {
      code = ((first & 0x07) << 18) | ((bytes[i++] & 0x3f) << 12) |
             ((bytes[i++] & 0x3f) << 6) | (bytes[i++] & 0x3f);
    } else {
      code = 0xfffd;
    }
    if (code <= 0xffff) {
      output += String.fromCharCode(code);
    } else {
      code -= 0x10000;
      output += String.fromCharCode(0xd800 | (code >> 10), 0xdc00 | (code & 0x3ff));
    }
  }
  return output;
}

function m115Base64Encode(bytes) {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var output = "";
  for (var i = 0; i < bytes.length; i += 3) {
    var b1 = bytes[i] & 0xff;
    var hasB2 = i + 1 < bytes.length;
    var hasB3 = i + 2 < bytes.length;
    var b2 = hasB2 ? bytes[i + 1] & 0xff : 0;
    var b3 = hasB3 ? bytes[i + 2] & 0xff : 0;
    output += chars.charAt(b1 >> 2);
    output += chars.charAt(((b1 & 3) << 4) | (b2 >> 4));
    output += hasB2 ? chars.charAt(((b2 & 15) << 2) | (b3 >> 6)) : "=";
    output += hasB3 ? chars.charAt(b3 & 63) : "=";
  }
  return output;
}

function m115Base64Decode(text) {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var clean = String(text || "").replace(/\s/g, "");
  if (!clean || clean.length % 4 !== 0 || /[^A-Za-z0-9+/=]/.test(clean)) {
    throw new Error("115 Base64 数据格式无效");
  }
  var output = [];
  for (var i = 0; i < clean.length; i += 4) {
    var c1 = chars.indexOf(clean.charAt(i));
    var c2 = chars.indexOf(clean.charAt(i + 1));
    var c3 = clean.charAt(i + 2) === "=" ? -1 : chars.indexOf(clean.charAt(i + 2));
    var c4 = clean.charAt(i + 3) === "=" ? -1 : chars.indexOf(clean.charAt(i + 3));
    if (c1 < 0 || c2 < 0 || (c3 < 0 && clean.charAt(i + 2) !== "=") ||
        (c4 < 0 && clean.charAt(i + 3) !== "=")) {
      throw new Error("115 Base64 数据格式无效");
    }
    output.push(((c1 << 2) | (c2 >> 4)) & 0xff);
    if (c3 >= 0) output.push((((c2 & 15) << 4) | (c3 >> 2)) & 0xff);
    if (c4 >= 0) output.push((((c3 & 3) << 6) | c4) & 0xff);
  }
  return output;
}

function m115CompareBytes(left, right) {
  for (var i = 0; i < left.length; i++) {
    if (left[i] !== right[i]) return left[i] > right[i] ? 1 : -1;
  }
  return 0;
}

function m115SubtractBytes(left, right) {
  var output = left.slice();
  var borrow = 0;
  for (var i = output.length - 1; i >= 0; i--) {
    var value = output[i] - right[i] - borrow;
    if (value < 0) { value += 256; borrow = 1; } else { borrow = 0; }
    output[i] = value;
  }
  return output;
}

function m115AddMod(left, right) {
  var length = M115_RSA_BLOCK_SIZE;
  var sum = new Array(length + 1);
  var carry = 0;
  for (var i = length - 1; i >= 0; i--) {
    var value = left[i] + right[i] + carry;
    sum[i + 1] = value & 0xff;
    carry = value >>> 8;
  }
  sum[0] = carry;
  var modulus = [0].concat(M115_RSA_MODULUS);
  if (m115CompareBytes(sum, modulus) >= 0) sum = m115SubtractBytes(sum, modulus);
  return sum.slice(1);
}

function m115MultiplyMod(left, right) {
  var result = new Array(M115_RSA_BLOCK_SIZE);
  for (var z = 0; z < result.length; z++) result[z] = 0;
  for (var i = 0; i < right.length; i++) {
    for (var bit = 7; bit >= 0; bit--) {
      result = m115AddMod(result, result);
      if ((right[i] >>> bit) & 1) result = m115AddMod(result, left);
    }
  }
  return result;
}

function m115RsaPublicOperation(input) {
  if (input.length > M115_RSA_BLOCK_SIZE) throw new Error("115 RSA 输入块过大");
  var base = new Array(M115_RSA_BLOCK_SIZE - input.length).fill(0).concat(input);
  if (m115CompareBytes(base, M115_RSA_MODULUS) >= 0) throw new Error("115 RSA 输入超出模数");
  var result = base.slice();
  for (var i = 0; i < 16; i++) result = m115MultiplyMod(result, result);
  return m115MultiplyMod(result, base);
}

function m115Pkcs1PadType2(input) {
  if (input.length > M115_RSA_PAYLOAD_SIZE) throw new Error("115 RSA 输入块过大");
  var padding = [];
  var paddingLength = M115_RSA_BLOCK_SIZE - input.length - 3;
  for (var i = 0; i < paddingLength; i++) {
    padding.push(1 + Math.floor(Math.random() * 255));
  }
  return [0, 2].concat(padding, [0], input);
}

function m115Pkcs1UnpadType2(input) {
  var separator = -1;
  for (var i = 1; i < input.length; i++) {
    if (input[i] === 0) { separator = i; break; }
  }
  if (separator < 0) throw new Error("115 RSA 响应块格式无效");
  return input.slice(separator + 1);
}

function m115GetKey(length, key) {
  if (key) {
    var result = [];
    for (var i = 0; i < length; i++) {
      result.push(((((key[i] + M115_G_KTS[length * i]) & 0xff) ^
                    M115_G_KTS[length * (length - 1 - i)])) & 0xff);
    }
    return result;
  }
  return length === 12 ? M115_G_KEY_L.slice() : M115_G_KEY_S.slice();
}

function xor115Enc(input, key) {
  var output = [];
  var mod4 = input.length % 4;
  var i = 0;
  for (; i < mod4; i++) output.push((input[i] ^ key[i % key.length]) & 0xff);
  for (; i < input.length; i++) output.push((input[i] ^ key[(i - mod4) % key.length]) & 0xff);
  return output;
}

function m115SymEncode(input, key1, key2) {
  var first = xor115Enc(input, m115GetKey(4, key1));
  first.reverse();
  return xor115Enc(first, m115GetKey(12, key2));
}

function m115SymDecode(input, key1, key2) {
  var first = xor115Enc(input, m115GetKey(12, key2));
  first.reverse();
  return xor115Enc(first, m115GetKey(4, key1));
}

function m115AsymEncode(input) {
  var blocks = [];
  for (var offset = 0; offset < input.length; offset += M115_RSA_PAYLOAD_SIZE) {
    blocks.push(m115RsaPublicOperation(m115Pkcs1PadType2(
      input.slice(offset, offset + M115_RSA_PAYLOAD_SIZE)
    )));
  }
  return m115Base64Encode(m115ConcatBytes(blocks));
}

function m115AsymDecode(base64Text) {
  var input = m115Base64Decode(base64Text);
  if (!input.length || input.length % M115_RSA_BLOCK_SIZE !== 0) {
    throw new Error("115 加密响应长度异常");
  }
  var blocks = [];
  for (var offset = 0; offset < input.length; offset += M115_RSA_BLOCK_SIZE) {
    blocks.push(m115Pkcs1UnpadType2(m115RsaPublicOperation(
      input.slice(offset, offset + M115_RSA_BLOCK_SIZE)
    )));
  }
  return m115ConcatBytes(blocks);
}

function m115Encode(text, timestamp) {
  var key = m115Utf8Encode(md5("!@###@#" + timestamp + "DFDR@#@#"));
  var encrypted = m115SymEncode(m115Utf8Encode(text), key, null);
  return {
    data: m115AsymEncode(key.slice(0, 16).concat(encrypted)),
    key: key
  };
}

function m115Decode(base64Text, key) {
  var decoded = m115AsymDecode(base64Text);
  if (decoded.length < 16) throw new Error("解密后的 115 响应过短");
  return m115Utf8Decode(m115SymDecode(decoded.slice(16), key, decoded.slice(0, 16)));
}

async function pan115HttpPost(url, body, cookie) {
  var resp = await Widget.http.post(url, body, {
    headers: Object.assign({}, BASE_HEADERS, cookieHeader(cookie), {
      "Content-Type": "application/x-www-form-urlencoded"
    }),
    timeout: 15000
  });
  if (!resp || resp.statusCode !== 200) {
    throw new Error("115 POST HTTP " + (resp && resp.statusCode || "unknown") + ": " + url.slice(0, 80));
  }
  var data = resp.data;
  if (typeof data === "string") {
    try { return JSON.parse(data); } catch (eParse) { throw new Error("115 POST 响应不是有效 JSON"); }
  }
  return data;
}

function find115DownloadEntry(decoded, pickcode) {
  if (!decoded || typeof decoded !== "object") return null;
  var values = [];
  if (decoded.url && typeof decoded.url === "object") values.push(decoded);
  for (var key in decoded) {
    if (Object.prototype.hasOwnProperty.call(decoded, key) &&
        decoded[key] && typeof decoded[key] === "object") {
      values.push(decoded[key]);
    }
  }
  var urlEntries = [];
  for (var i = 0; i < values.length; i++) {
    var entry = values[i];
    var url = entry.url && typeof entry.url === "object" ? String(entry.url.url || "").trim() : "";
    if (!/^https?:\/\//i.test(url)) continue;
    if (String(entry.pick_code || entry.pickcode || "") === String(pickcode)) return entry;
    urlEntries.push(entry);
  }
  return urlEntries.length === 1 ? urlEntries[0] : null;
}

async function request115OriginalDownloadUrl(cookie, pickcode) {
  var timestamp = Math.floor(Date.now() / 1000);
  var encoded = m115Encode(JSON.stringify({ pickcode: pickcode }), timestamp);
  var endpoint = "https://proapi.115.com/app/chrome/downurl?t=" + timestamp;
  var envelope = await pan115HttpPost(endpoint, "data=" + encodeURIComponent(encoded.data), cookie);
  if (!envelope || typeof envelope !== "object") throw new Error("115 downurl 返回格式无效");
  if (!envelope.state) throw new Error("115 downurl 请求被拒绝: " + String(envelope.error || envelope.message || ""));
  if (!envelope.data || typeof envelope.data !== "string") throw new Error("115 downurl 响应缺少加密 data");

  var decodedText = m115Decode(envelope.data, encoded.key);
  var decoded;
  try { decoded = JSON.parse(decodedText); }
  catch (_) { throw new Error("115 downurl 解密结果不是有效 JSON"); }

  var entry = find115DownloadEntry(decoded, pickcode);
  if (!entry) throw new Error("115 downurl 解密成功，但未找到唯一的原文件地址");
  var directUrl = String(entry.url && entry.url.url || "").trim();
  if (!/^https?:\/\//i.test(directUrl)) throw new Error("115 downurl 返回的原文件地址无效");
  return {
    url: directUrl,
    fileName: String(entry.file_name || entry.name || ""),
    fileSize: parseInt(entry.file_size || entry.size || "0", 10) || 0
  };
}

async function buildOriginal115Stream(cookie, file) {
  var original = await request115OriginalDownloadUrl(cookie, file.pickcode);
  var filename = original.fileName || file.filename;
  var fileSize = original.fileSize || file.size || 0;
  var number = extractNumber(filename);
  var displayTitle = number || safeDisplayTitleFromFile(filename);
  return [{
    // v1.14.1: 统一命名格式 "115 | 原画 4.3G"（原画=原文件直链，体积随名）
    name: "115 | 原画" + (fileSize ? " " + compactSize(fileSize) : ""),
    description: (number ? "番号: " : "标题: ") + displayTitle +
                 "\n文件: " + filename +
                 (fileSize ? "\n大小: " + formatSize(fileSize) : ""),
    url: original.url,
    customHeaders: {
      "Referer": "https://115.com/",
      "User-Agent": BASE_HEADERS["User-Agent"]
    }
  }];
}

async function buildStreamSources(cookie, file) {
  if (!file.pickcode || !file.filename || !isVideoFile(file.filename)) return [];

  var safeTitle = "";
  var number = extractNumber(file.filename);
  safeTitle = number || safeDisplayTitleFromFile(file.filename);

  // ---- 转码 m3u8 变体（115 云转码；空 body/未完成时为 0 条）----
  var masterText = "";
  try {
    masterText = await getMasterM3u8Text(cookie, file.pickcode);
  } catch (eM3u8) {
    // v1.12.0 实测：Forward 对 0 字节响应抛 "Response could not be serialized"，
    // rex 静默返回空——统一按转码不可用处理
    console.log("[pan115/buildStreamSources] m3u8 fetch failed:",
                file.filename, eM3u8 && eM3u8.message || eM3u8);
  }
  var streams = parseStreams(masterText);
  var transcode = streams.map(function (s) {
    var label = s.label || s.quality || "";
    return {
      name: "115 | 转码" + (label ? " " + label : ""),
      description: (number ? "番号: " : "标题: ") + safeTitle +
                   "\n文件: " + file.filename +
                   (s.resolution ? "\n分辨率: " + s.resolution : ""),
      url: s.url,
      customHeaders: {
        "Referer": "https://115.com/",
        "User-Agent": BASE_HEADERS["User-Agent"]
      }
    };
  });

  // ---- 原画直链（原文件）。v1.14.0 起始终并列展示，不再"有转码即隐藏"；
  // 失败静默降级（冷却/网络异常时至少保留转码源）----
  var original = [];
  try {
    original = (await buildOriginal115Stream(cookie, file)) || [];
  } catch (eOriginal) {
    console.log("[pan115/buildStreamSources] original fetch failed:",
                file.filename, eOriginal && eOriginal.message || eOriginal);
  }

  var result = original.concat(transcode);
  if (!result.length) {
    console.log("[pan115/buildStreamSources] count: 0 (no transcode, no original)");
    return [];
  }
  console.log("[pan115/buildStreamSources] count:", result.length,
              "(original:", original.length, ", transcode:", transcode.length, ")");
  return result;
}

// 兼容包装：单 stream 版本
async function buildStreamSource(cookie, file) {
  var streams = await buildStreamSources(cookie, file);
  return streams.length ? streams[0] : null;
}

/**
 * parse115DetailLink — 解析 115detail://{pickcode}[?title=xxx] 链接
 */
function parse115DetailLink(link) {
  var cleanLink = String(link || "");
  var pathPart = cleanLink.slice("115detail://".length);
  var qIndex = pathPart.indexOf("?");
  return {
    pickcode: qIndex >= 0 ? pathPart.slice(0, qIndex) : pathPart,
    query: qIndex >= 0 ? pathPart.slice(qIndex + 1) : ""
  };
}

/**
 * handleDirectPickcodeResource — 115detail:// 直播放路径
 * 不依赖番号，不用 searchFiles，直接用 pickcode 获取 115 播放源
 */
async function handleDirectPickcodeResource(params, link) {
  var cookie = resolveCookie(params);
  syncCookie(cookie);
  if (!cookie) return [];

  var parsed = parse115DetailLink(link);
  var pickcode = parsed.pickcode;
  if (!pickcode) return [];

  var cached = PICKCODE_FILE_MAP[pickcode] || {};
  var filename = cached.filename || params.title || params.name || "115-video.mp4";
  var file = {
    pickcode: pickcode,
    filename: filename,
    size: cached.size || 0
  };

  var sources = await buildStreamSources(cookie, file);
  console.log("[pan115/directPickcode] pickcode:", pickcode, "filename:", filename, "streams:", sources.length);
  return sources;
}

// ==================== parse115FolderLink ====================

function parse115FolderLink(link) {
  var s = String(link || "");
  if (s.indexOf("115folder://") !== 0) return null;

  var rest = s.slice("115folder://".length);
  var qIndex = rest.indexOf("?");
  var cidPart = qIndex >= 0 ? rest.slice(0, qIndex) : rest;
  var query = qIndex >= 0 ? rest.slice(qIndex + 1) : "";

  var title = "";
  if (query) {
    query.split("&").forEach(function(pair) {
      var kv = pair.split("=");
      if (decodeURIComponent(kv[0] || "") === "title") {
        title = decodeURIComponent(kv.slice(1).join("=") || "");
      }
    });
  }

  return {
    cid: decodeURIComponent(cidPart || ""),
    title: title
  };
}

// ==================== parse115JavFolderLink (v1.3.9) ====================

function parse115JavFolderLink(link) {
  var s = String(link || "");
  if (s.indexOf("115javfolder://") !== 0) return null;

  var rest = s.slice("115javfolder://".length);
  var qIndex = rest.indexOf("?");
  var cidPart = qIndex >= 0 ? rest.slice(0, qIndex) : rest;
  var query = qIndex >= 0 ? rest.slice(qIndex + 1) : "";

  var title = "";
  var mediaKey = "";
  var rawTitle = "";
  if (query) {
    query.split("&").forEach(function(pair) {
      var kv = pair.split("=");
      var key = decodeURIComponent(kv[0] || "");
      var val = decodeURIComponent(kv.slice(1).join("=") || "");
      if (key === "title") title = val;
      else if (key === "mediaKey") mediaKey = val;
      else if (key === "rawTitle") rawTitle = val;
    });
  }

  return {
    cid: decodeURIComponent(cidPart || ""),
    title: title,
    mediaKey: mediaKey,
    rawTitle: rawTitle
  };
}

// ==================== 列表页 JAV 封面回填 (v1.10.0，正缓存前置 + Libre×2/r18 串行) ====================
// 管线（每次调用独立预算 30s，listDeadlineAt 传递到每个请求收缩 timeout）：
//   0. 按 canonical 番号分组去重（同番号多卡片只走一条网络链路，结果广播全组）；
//   1. 正缓存前置（任一命中 → 强制覆盖卡片图（含纠正盲拼错误）+ 清理矛盾负缓存）：
//      本上下文内存完整 meta → pan115-cover: 紧凑索引（v1.13.0 起 legacy 整表
//      读取已移除，富元数据不再有任何 storage 读取路径）；
//   2. 负缓存拦截：只拦 10 分钟内失败（部分环境 storage 写入不落地读到旧快照，
//      硬按 1h TTL 会让修复后的番号被永久拦截）；
//   3. 探测阶段（DMM 图片 CDN，并发 6，预算占 70%）：variant → direct → mgstage。
//      每个 awsimgsrc 命中写 pan115-cover:（source dmm-probe）并广播全组；
//      mgstage miss 保留盲拼终态（未经 verify，不写 cover，不进救援）；
//   4. 救援阶段（剩余预算）：
//      4a. LibreFanza 并发 2：403/429 熔断即停、连续 3 个 5xx/0 结束（简单
//          breaker，无计时器依赖）；未处理条目转 4b，不算 definitive miss；
//      4b. r18 严格串行：cooldown 兜底、definitive miss 计熔断；
//      4c. 负缓存只在「Libre definitive miss + r18 definitive miss 且全程无
//          transient」时写；任一 transient / Libre 未尝试 / 预算耗尽不写。
//      注：真实 loadFolder 上下文没有 setTimeout（v1.8.5 实测），请求间不再用
//      sleepMs 间隔——请求时长天然限速（r18 串行 + Libre×2 各约 0.5~1 req/s）。
async function enrichUnsupportedJavItems(items) {
  // ---- 0. 分组去重（同番号多卡片共享一次网络链路）----
  var groups = {};      // key -> [items]
  var groupOrder = [];  // 保序
  var dup = 0;
  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    if (!it || !it._javEnrichKey) continue;
    var gk = it._javEnrichKey;
    if (groups[gk]) { groups[gk].push(it); dup++; continue; }
    groups[gk] = [it];
    groupOrder.push(gk);
  }
  if (!groupOrder.length) return;

  var fillGroup = function (key, poster, backdrop) {
    // 已验证封面无条件覆盖（含纠正 direct-dmm/mgstage 盲拼错误）
    var list = groups[key] || [];
    for (var f = 0; f < list.length; f++) {
      list[f].posterPath = poster;
      list[f].coverUrl = poster;
      list[f].backdropPath = backdrop || poster;
    }
  };

  var startedAt = Date.now();
  var listDeadlineAt = startedAt + JAV_LIST_BUDGET_MS;
  var probeDeadline = startedAt + Math.floor(JAV_LIST_BUDGET_MS * JAV_LIST_PROBE_BUDGET_RATIO);
  var remainingList = function () { return listDeadlineAt - Date.now(); };

  var coverCache = { memory: 0, entry: 0, written: 0 };
  var coverEntryHitCodes = [];
  var coverWrittenCodes = [];
  var negativeSkipped = 0;
  var blocked = 0;
  var outcomes = [];

  var writeCover = function (key, poster, backdrop, source) {
    if (cacheVerifiedCover(key, poster, backdrop, source)) {
      coverCache.written++;
      coverWrittenCodes.push(key);
    }
  };

  var variantQ = [];    // 无图：探测 miss 需 LibreFanza/r18 救援（最优先）
  var directQ = [];     // direct-dmm 盲拼已上卡：单探测确认/修正
  var mgstageQ = [];    // mgstage 盲拼：DMM 命中升级，miss 保留终态
  var fc2Q = [];        // FC2：跳过 DMM 探测（结构性无收录），直入 Libre 救援

  // ---- 1+2. 正缓存前置（内存 → cover entry）→ 负缓存拦截 → 分型 ----
  for (var g = 0; g < groupOrder.length; g++) {
    var key = groupOrder[g];
    var cachedMeta = getCachedJavMeta(key);  // 本上下文内存完整 meta
    if (cachedMeta && (cachedMeta.posterUrl || cachedMeta.coverUrl)) {
      fillGroup(key, cachedMeta.posterUrl || cachedMeta.coverUrl, cachedMeta.coverUrl || cachedMeta.posterUrl);
      coverCache.memory++;
      coverEntryHitCodes.push(key);
      outcomes.push(key + ":cache");
      if (isJavNegative(key)) clearJavNegative(key);  // 正命中顺手清理矛盾负缓存
      continue;
    }
    var entry = readCoverEntry(key);
    if (entry) {
      fillGroup(key, entry.p, entry.b);
      coverCache.entry++;
      coverEntryHitCodes.push(key);
      outcomes.push(key + ":cache");
      if (isJavNegative(key)) clearJavNegative(key);
      continue;
    }
    if (isJavNegativeRecent(key, JAV_LIST_NEGATIVE_RETRY_MS)) { negativeSkipped++; continue; }

    if (/^FC2(?:PPV)?\d{5,8}$/.test(key.replace(/-/g, ""))) {
      // FC2：DMM 图管线结构性不适用（r18/DMM 双源实测 404），跳过探测直入救援，
      // 由 LibreFanza 提供标题/日期 + FC2 官方缩略图（存活时）
      fc2Q.push({ key: key, kind: "fc2" });
      continue;
    }

    var strategy = "";
    try {
      strategy = buildImageCandidatesFromValue(key).strategy || "";
    } catch (eStrategy) { strategy = ""; }
    if (strategy === "direct-dmm") {
      // 白名单盲拼已上卡：只单探已上卡的盲拼 cid（与盲拼 URL 同源），请求量减半
      var partsD = parseStandardCodeParts(key);
      directQ.push({ key: key, kind: "direct", singleCid: partsD ? buildDmmContentIdFromParts(partsD) : "" });
    }
    else if (strategy === "unsupported-jav" || strategy === "none") variantQ.push({ key: key, kind: "variant" });
    else if (strategy === "mgstage") mgstageQ.push({ key: key, kind: "mgstage" });
    else blocked++;  // blocked（XXX-AV 等）：跳过，不探测不进救援
  }

  var probed = 0;      // 探测阶段解决的组数（含升级/修正）
  var missCodes = [];
  var probeItems = variantQ.length + directQ.length + mgstageQ.length;
  var net0 = DMMHD_PROBE_NET_CALLS;
  var cacheHit0 = DMMHD_CACHE_HIT_CALLS;

  // ---- 3. DMM CDN 存在性探测（并发 6，预算占比 70%）----
  var probeQueue = variantQ.concat(directQ).concat(mgstageQ);
  var rescueQ = [];    // { key, kind, sawTransient, libreUnknown }
  async function probeWorker() {
    while (probeQueue.length) {
      if (Date.now() > probeDeadline) return;
      var entry = probeQueue.shift();
      var res;
      if (entry.kind === "direct") {
        // direct-dmm：单探已上卡的盲拼 cid（存在 → 保留；miss/不确定 → 救援）
        var state = await dmmhdProbe(entry.singleCid, probeDeadline);
        res = state === true ? { cid: entry.singleCid } : { cid: "" };
      } else {
        // variant / mgstage：cid 变体探测（quick 模式，长尾变体交给救援兜底）
        res = await dmmhdProbeFirst(dmmhdContentIdVariants(entry.key), { quick: true, deadlineAt: probeDeadline });
      }
      if (res.cid) {
        fillGroup(entry.key, dmmhdPosterUrl(res.cid), dmmhdBackdropUrl(res.cid));
        writeCover(entry.key, dmmhdPosterUrl(res.cid), dmmhdBackdropUrl(res.cid), JAV_COVER_SOURCE_DMM_PROBE);
        probed++;
        outcomes.push(entry.key + ":probe");
      } else if (entry.kind === "mgstage") {
        // mgstage miss：保留盲拼终态（未经 verify 不写 cover，不进救援）
      } else {
        // variant/direct 探测 miss（含不确定）→ 救援队列
        rescueQ.push({ key: entry.key, kind: entry.kind });
        missCodes.push(entry.key);
      }
    }
  }
  var probeWorkers = [];
  for (var pw = 0; pw < Math.min(JAV_LIST_PROBE_CONCURRENCY, probeQueue.length); pw++) probeWorkers.push(probeWorker());
  await Promise.all(probeWorkers);
  var net1 = DMMHD_PROBE_NET_CALLS;

  // 无图（variant）、FC2 条目优先救援：direct-dmm 已有盲拼图兜底
  for (var fqi = 0; fqi < fc2Q.length; fqi++) rescueQ.push(fc2Q[fqi]);
  var kindRank = { variant: 0, fc2: 0, direct: 1 };
  rescueQ.sort(function (a, b) { return (kindRank[a.kind] || 9) - (kindRank[b.kind] || 9); });

  // ---- 4a. LibreFanza 并发 2（breaker + 剩余预算，所有请求 timeout 按剩余收缩）----
  var libreStats = { hit: 0, miss: 0, transient: 0, breaker: false };
  var r18Q = [];
  var libreStopped = false;
  var libreConsec5xx = 0;
  var negativeMarked = 0;          // fc2 分支与 r18 分支共用（须先于 worker 启动赋值）
  var negativeMarkedCodes = [];
  async function libreWorker() {
    while (rescueQ.length) {
      if (libreStopped) return;
      if (remainingList() <= 1500) return;  // 剩余不足以完成一次有效请求
      var entry = rescueQ.shift();
      var resolved = false;
      var attempts = [entry.key];
      var base = javBaseCode(entry.key);
      if (base && base !== entry.key) attempts.push(base);
      for (var a = 0; a < attempts.length && !resolved; a++) {
        var res = await fetchLibreFanzaMeta(attempts[a], { timeout: Math.max(500, Math.min(JAV_LIST_TIMEOUT, remainingList())) });
        if (res.outcome === "hit") {
          var m = res.meta;
          await verifyMetaCoverUrls(m, listDeadlineAt);
          if (m.posterUrl || m.coverUrl) {
            fillGroup(entry.key, m.posterUrl || m.coverUrl, m.coverUrl || m.posterUrl);
            cacheJavMeta(entry.key, m);  // 内存完整 meta + 紧凑 cover（source librefanza）
            libreStats.hit++;
            libreConsec5xx = 0;
            outcomes.push(entry.key + ":filled");
            resolved = true;
          } else if (entry.kind === "fc2") {
            libreStats.hit++;       // 标题/日期命中但缩略图已失效：无图可上，
            libreConsec5xx = 0;     // 保持未解决 → 尾部 fc2 分支统一落负缓存
          } else {
            libreStats.miss++;  // 页面存在但无可用封面：视同 miss
            libreConsec5xx = 0;
          }
        } else if (res.outcome === "transient") {
          libreStats.transient++;
          entry.sawTransient = true;
          if (res.status === 403 || res.status === 429) {
            libreStopped = true; libreStats.breaker = true; break;  // 反爬/限流：立即停
          }
          if (res.status === 0 || res.status >= 500) {
            libreConsec5xx++;
            if (libreConsec5xx >= JAV_LIBRE_BREAKER_5XX) { libreStopped = true; libreStats.breaker = true; break; }
          }
        } else {
          libreStats.miss++;  // 404 definitive miss
          libreConsec5xx = 0;
        }
      }
      if (!resolved) {
        if (entry.kind === "fc2") {
          // FC2：r18 结构性无收录，不进 r18、不计 r18 熔断。缩略图失效（标题
          // 命中）与全候选 miss 都写负缓存停止列表重试（详情 ignoreNegative
          // 不受影响；缩略图若恢复，1h 负缓存过期后自然重探）
          if (!entry.sawTransient) {
            markJavNegative(entry.key);
            negativeMarked++;
            negativeMarkedCodes.push(entry.key);
            outcomes.push(entry.key + ":miss");
          } else {
            outcomes.push(entry.key + ":limited");
          }
        } else {
          r18Q.push(entry);
        }
      }
      if (libreStopped) return;
    }
  }
  var libreWorkers = [];
  for (var lw = 0; lw < Math.min(JAV_LIBRE_CONCURRENCY, rescueQ.length); lw++) libreWorkers.push(libreWorker());
  await Promise.all(libreWorkers);
  // Libre 未处理的条目（熔断/预算停止）全部转串行 r18；Libre 未知 → 不算 definitive
  while (rescueQ.length) {
    var leftover = rescueQ.shift();
    leftover.libreUnknown = true;
    r18Q.push(leftover);
  }

  // ---- 4b. r18 严格串行（cooldown + 剩余预算；definitive miss 计熔断）----
  var r18Stats = { hit: 0, miss: 0, limited: 0 };
  var failures = 0;
  while (r18Q.length) {
    if (remainingList() <= 1500) break;          // 预算耗尽：剩余不毒化，下次重试
    if (failures >= JAV_LIST_BREAKER_LIMIT) break;
    if (r18InCooldown()) break;                  // 限流冷却：本轮收工
    var entry = r18Q.shift();
    var key = entry.key;
    var resolved = false;
    var limited = false;
    var attempts = [key];
    var base = javBaseCode(key);
    if (base && base !== key) attempts.push(base);
    for (var a2 = 0; a2 < attempts.length && !resolved; a2++) {
      var res = await resolveR18Meta(attempts[a2], Math.max(500, Math.min(JAV_LIST_TIMEOUT, remainingList())), listDeadlineAt);
      if (res && res.limited) { limited = true; break; }
      if (res && res.meta && (res.meta.posterUrl || res.meta.coverUrl)) {
        fillGroup(key, res.meta.posterUrl, res.meta.coverUrl || res.meta.posterUrl);
        cacheJavMeta(key, res.meta);  // 内存完整 meta + 紧凑 cover（source r18dev）
        r18Stats.hit++;
        outcomes.push(key + ":filled");
        resolved = true;
      }
      // definitive miss / meta 无图 → 尝试下一番号形态
    }
    if (resolved) continue;
    if (limited) {
      r18Stats.limited++;
      outcomes.push(key + ":limited");
    } else {
      failures++;
      r18Stats.miss++;
      outcomes.push(key + ":miss");
      // 负缓存纪律：Libre definitive miss + r18 definitive miss + 全程无 transient
      //（Libre 被熔断/预算跳过的条目未知状态，绝不写入）
      if (!entry.sawTransient && !entry.libreUnknown) {
        markJavNegative(key);
        negativeMarked++;
        negativeMarkedCodes.push(key);
      }
    }
  }
  var net2 = DMMHD_PROBE_NET_CALLS;
  var r18Left = r18Q.length;

  console.log("[pan115/javmeta/backfill]", JSON.stringify({
    source: "cover-cache+probe+libre+r18",
    targets: groupOrder.length,
    dup: dup,
    fc2: fc2Q.length,
    coverCache: coverCache,
    coverEntryHitCodes: coverEntryHitCodes.slice(0, 8),
    coverWrittenCodes: coverWrittenCodes.slice(0, 8),
    probe: {
      items: probeItems,
      resolved: probed,
      netStage1: net1 - net0,
      netVerify: net2 - net1,
      cacheHit: DMMHD_CACHE_HIT_CALLS - cacheHit0
    },
    probeMiss: missCodes.slice(0, 8),
    negativeSkipped: negativeSkipped,
    blocked: blocked,
    libre: libreStats,
    r18: r18Stats,
    negativeMarked: negativeMarked,
    negativeMarkedCodes: negativeMarkedCodes.slice(0, 8),
    r18Left: r18Left,
    outcomes: outcomes.slice(0, 40),
    elapsedMs: Date.now() - startedAt
  }));
}

// ==================== 入口函数 ====================

async function loadFolder(params) {
  var cookie = resolveCookie(params);
  syncCookie(cookie);

  // v1.6.0: r18.dev 演员/标签/片商列表浏览（详情页点击回调；纯元数据列表，免 115 Cookie）
  var javBrowse = parseJavBrowseParams(params);
  if (javBrowse) {
    return await handleJavBrowseList(javBrowse, params);
  }

  var cid = getText(params.cid) || "0";
  var page = parseInt(params.page || "1", 10) || 1;



  if (!cookie) {
    return [{
      id: "no-cookie",
      type: "url",
      title: "需要 115 Cookie",
      backdropPath: "",
      mediaType: "movie",
      link: "",
      description: "请在参数或全局设置中填入 115 Cookie"
    }];
  }

  try {
    var files = await listFolder(cookie, cid, page);

    // 从列表中过滤掉历史遗留的 index 文件（老用户网盘里可能还留着，避免显示成坏卡片）
    var filteredFiles = [];
    var isIndexFile = {};
    for (var ifi2 = 0; ifi2 < FORWARD_INDEX_FILENAMES.length; ifi2++) {
      isIndexFile[FORWARD_INDEX_FILENAMES[ifi2]] = true;
    }
    for (var fi = 0; fi < files.length; fi++) {
      var fname = get115Name(files[fi]);
      if (!isIndexFile[fname]) {
        filteredFiles.push(files[fi]);
      }
    }
    files = filteredFiles;

    var results = [];
    var foldersCount = 0;
    var videosCount = 0;

    for (var fi2 = 0; fi2 < files.length; fi2++) {
      var entry = files[fi2];
      try {
        if (is115Folder(entry)) {
          var folderItem = await buildFolderBrowseItem(entry);
          if (folderItem) {
            results.push(folderItem);
            foldersCount++;
          }
          continue;
        }
        if (is115VideoFile(entry)) {
          var videoItem = await buildBrowseItem(cookie, entry);
          if (videoItem) {
            results.push(videoItem);
            videosCount++;
          }
          continue;
        }
      } catch (e) {
        console.warn("[pan115/loadFolder] item build failed:", get115Name(entry), e && e.message || e);
      }
    }

    console.log("[pan115/loadFolder] cid:", cid, "folders:", foldersCount, "videos:", videosCount, "items:", results.length);

    // v1.7.0: 缓存优先回填，未命中的温和实时抓取（r18.dev 成功后入缓存，
    // 详情页/下次列表均命中；未收录写负缓存 1h 防重复请求）
    try {
      await enrichUnsupportedJavItems(results);
    } catch (e) {
      console.warn("[pan115/loadFolder] jav backfill failed:", e && e.message || e);
    }
    // 清理内部标记字段，不下发到 App
    for (var ri = 0; ri < results.length; ri++) {
      if (results[ri]) {
        delete results[ri]._javEnrichKey;
      }
    }

    if (!results.length) {
      return [{
        id: "empty", type: "url", title: "空文件夹",
        backdropPath: "", mediaType: "movie", link: "",
        description: "该目录下没有可用内容"
      }];
    }

    return results;
  } catch (err) {
    console.error("[pan115] loadFolder:", err && err.message ? err.message : err);
    return [{
      id: "error", type: "url", title: "加载失败",
      backdropPath: "", mediaType: "movie", link: "",
      description: err && err.message ? err.message : "请检查 Cookie 或目录 ID 是否正确"
    }];
  }
}


// --- buildFolderDetailPage (v1.3.6: 文件夹详情页) — 当前未被 Forward 调用 ---
/**
 * 115folder:// 详情页入口（保留中）
 *
 * 注意：当前 Forward 在点击 browse folder item (115folder://) 时，
 * 未观察到 loadDetail 被调用。Forward 直接将 browse item 展开为详情页。
 * 因此文件夹元数据增强实现在 buildFolderBrowseItem 中，而非此处。
 *
 * 如果 Future Forward 版本调用 loadDetail 的 115folder:// 路由，
 * 此函数可作为 fallback 详情页生成器。
 * 播放仍走 loadResource → handleFolderPlayback。
 */
async function buildFolderDetailPage(parsed) {
  var cid = parsed && parsed.cid;
  var folderTitle = parsed && parsed.title || "文件夹";
  console.log("[pan115/folderDetail] ENTER", "cid:", cid, "title:", folderTitle);

  if (!cid) {
    return {
      id: "115folder_error",
      type: "detail",
      title: "加载失败",
      description: "缺少文件夹 cid"
    };
  }

  var cookie = resolveCookie(null) || "";
  if (!cookie) {
    return {
      id: "115folder_nocookie_" + cid,
      type: "detail",
      title: folderTitle,
      description: "未获取到 115 Cookie，详情信息不可用；若已在模块设置填写 Cookie，播放不受影响"
    };
  }

  // 统计视频数量供描述使用
  var videoCount = 0;
  try {
    var files = await listFolderAll(cookie, cid, { limit: 100, maxItems: 300 });
    for (var fi = 0; fi < files.length; fi++) {
      if (is115VideoFile(files[fi])) videoCount++;
    }
  } catch (e) {
    console.warn("[pan115/folder] listFolderAll count failed:", e && e.message || e);
  }

  // 解析媒体身份
  var mediaKey = null;
  try {
    mediaKey = resolveMediaKeyFromText(folderTitle, { source: "folder-detail" });
  } catch (e) {
    console.warn("[pan115/folderDetail] resolveMediaKeyFromText failed:", folderTitle, e && e.message || e);
  }

  console.log("[pan115/folderDetail] title:", folderTitle,
    "mediaKey:", mediaKey && (mediaKey.type + "/" + mediaKey.key),
    "videoCount:", videoCount);

  if (mediaKey && mediaKey.type === "jav") {
    // JAV 文件夹：r18.dev 元数据 + 富详情 + 离线下载入口
    var javKey = mediaKey.canonicalKey || mediaKey.key;
    var meta = null;
    try {
      meta = await fetchJavMeta(javKey, { source: "folder-detail", ignoreNegative: true });
    } catch (e) {
      console.warn("[pan115/folderDetail] javmeta enrich failed:", e && e.message || e);
    }
    console.log("[pan115/folderDetail] jav meta hit:", !!meta, "key:", javKey);

    // 规则封面（快速路径，优先于 r18.dev 封面；mgstage 盲拼除外）
    var ruleCandidates = buildImageCandidatesFromValue(javKey);
    var rulePoster = "";
    var ruleBackdrop = "";
    if (ruleCandidates.strategy === "direct-dmm" || ruleCandidates.strategy === "mgstage") {
      rulePoster = chooseFirstCandidate(ruleCandidates.posterCandidates);
      ruleBackdrop = chooseFirstCandidate(ruleCandidates.backdropCandidates) || rulePoster;
    }
    // v1.10.0: 已验证封面索引优先于规则盲拼（富抓取失败时也保底有图）
    var verifiedCover = readVerifiedCoverForDetail(javKey);
    if (verifiedCover && verifiedCover.poster) {
      rulePoster = verifiedCover.poster;
      ruleBackdrop = verifiedCover.backdrop || ruleBackdrop;
    }

    // 磁力候选 relatedItems（由 ENABLE_OFFLINE_RELATED_ITEMS 控制，getMagnetCandidatesWithCache 内部已提前返回）
    var candidates = [];
    try {
      candidates = await getMagnetCandidatesWithCache(javKey);
    } catch (e) {
      console.warn("[pan115/folderDetail] getMagnetCandidatesWithCache failed:", e && e.message || e);
    }

    return buildJavDetailItem(javKey, meta, {
      poster: rulePoster,
      backdrop: ruleBackdrop,
      strategy: ruleCandidates.strategy || ""
    }, {
      id: "115folder_" + cid,
      link: "115folder://" + encodeURIComponent(cid) + "?title=" + encodeURIComponent(folderTitle),
      fallbackTitle: mediaKey.displayTitle || folderTitle,
      baseDescription: "115 文件夹 · 共 " + videoCount + " 个视频",
      relatedItems: candidates.map(function(c) {
        return {
          id: c.id,
          type: "url",
          title: c.title,
          description: c.description,
          link: c.link
        };
      })
    });
  }

  // 非 JAV（unknown / western_scene / western_date）：基础详情页
  var displayTitle = (mediaKey && mediaKey.displayTitle) || folderTitle;
  var desc = videoCount > 0
    ? "115 文件夹 · 共 " + videoCount + " 个视频 · 点击播放"
    : "115 文件夹 · 暂无可播放视频";

  console.log("[pan115/folderDetail] non-jav fallback, type:", mediaKey && mediaKey.type, "displayTitle:", displayTitle);

  return {
    id: "115folder_" + cid,
    type: "detail",
    title: displayTitle,
    name: displayTitle,
    originalTitle: folderTitle,
    description: desc,
    episodeItems: [],
    relatedItems: [],
    coverUrl: "",
    posterPath: "",
    backdropPath: "",
    mediaType: "movie",
    rating: DEFAULT_RATING,
    link: "115folder://" + encodeURIComponent(cid) + "?title=" + encodeURIComponent(folderTitle)
  };
}
async function handleFolderPlayback(cookie, parsed) {
  var cid = parsed && parsed.cid;
  if (!cid) {
    console.warn("[pan115/folder/playback] missing cid");
    return [];
  }

  var files;
  try {
    files = await listFolderAll(cookie, cid, { limit: 100, maxItems: 300 });
  } catch (e) {
    console.error("[pan115/folder/playback] listFolderAll failed:", e && e.message || e);
    return [];
  }

  // 过滤出视频文件，按大小排序（大文件优先）
  var videoFiles = [];
  for (var fi = 0; fi < files.length; fi++) {
    if (is115VideoFile(files[fi])) {
      videoFiles.push(files[fi]);
    }
  }

  if (!videoFiles.length) {
    console.log("[pan115/folder/playback] no video files, returning empty");
    return [];
  }

  // 多视频取前 10 个（按大小排序，大文件优先）
  videoFiles.sort(function (a, b) {
    return (b.size || 0) - (a.size || 0);
  });
  if (videoFiles.length > 10) {
    videoFiles = videoFiles.slice(0, 10);
  }
  console.log("[pan115/folderPlayback] cid:", cid, "videos:", videoFiles.length);

  // 对每个视频构建播放源，合并后返回
  var allSources = [];
  for (var vi = 0; vi < videoFiles.length; vi++) {
    try {
      var sources = await buildStreamSources(cookie, videoFiles[vi]);
      if (sources && sources.length) {
        allSources = allSources.concat(sources);
      }
    } catch (e) {
      console.warn("[pan115/folder/playback] buildStreamSources failed for:", get115Name(videoFiles[vi]), e && e.message || e);
    }
  }

  if (allSources.length > 10) {
    allSources = allSources.slice(0, 10);
  }

  console.log("[pan115/folderPlayback] cid:", cid, "total sources:", allSources.length);
  return allSources;
}

// --- handleJavFolderDetail (v1.3.9) ---
async function handleJavFolderDetail(parsed) {
  var cid = parsed && parsed.cid;
  console.log("[v1.3.9] jav folder route parsed: cid=" + (cid || "") + ", mediaKey=" + (parsed && parsed.mediaKey || ""));
  if (!cid) {
    return {
      id: "115javfolder_error",
      type: "detail",
      title: "\u52a0\u8f7d\u5931\u8d25",
      description: "\u7f3a\u5c11\u6587\u4ef6\u5939 cid",
      rating: DEFAULT_RATING,
    };
  }

  var cookie = resolveCookie(null) || "";
  // 规则封面（同步，不需要 cookie；mgstage 盲拼除外，见 buildJavDetailItem）
  var mediaKey = parsed && parsed.mediaKey || "";
  var posterPath = "";
  var backdropPath = "";
  var ruleStrategy = "";
  if (mediaKey) {
    var candidates = buildImageCandidatesFromValue(mediaKey);
    ruleStrategy = candidates.strategy || "";
    if (candidates.strategy === "direct-dmm" || candidates.strategy === "mgstage") {
      posterPath = chooseFirstCandidate(candidates.posterCandidates);
      backdropPath = chooseFirstCandidate(candidates.backdropCandidates) || posterPath;
    }
    // v1.10.0: 已验证封面索引优先于规则盲拼（富抓取失败时也保底有图）
    var verifiedCover = readVerifiedCoverForDetail(mediaKey);
    if (verifiedCover && verifiedCover.poster) {
      posterPath = verifiedCover.poster;
      backdropPath = verifiedCover.backdrop || backdropPath;
      ruleStrategy = "verified-cover";
    }
  }
  var title = mediaKey || parsed && parsed.title || "JAV \u6587\u4ef6\u5939";
  var itemId = mediaKey || ("115javfolder_" + cid);
  var javLink = "115javfolder://" + encodeURIComponent(cid)
    + "?title=" + encodeURIComponent(title)
    + "&mediaKey=" + encodeURIComponent(mediaKey)
    + "&rawTitle=" + encodeURIComponent(parsed && parsed.rawTitle || "");

  // JAV 元数据增强：r18.dev 与 115 Cookie 无关，无 cookie 也能展示元数据；
  // 规则封面（上方 posterPath/backdropPath）优先（mgstage 除外），r18.dev 兜底并填充富数据。
  // ignoreNegative：详情页用户主动进入，无视负缓存强制重试。
  var meta = null;
  if (mediaKey) {
    try {
      meta = await fetchJavMeta(mediaKey, { source: "jav-folder-detail", ignoreNegative: true });
    } catch (e) {
      console.warn("[pan115/javfolder] enrich failed:", e && e.message || e);
    }
  }

  // cookie-check: non-fatal, enrich detail still renders metadata
  // playback enforcement handled by loadResource
  if (!cookie) {
    console.log("[v1.3.9] jav folder no cookie, returning metadata detail: title=" + title);
    return buildJavDetailItem(mediaKey, meta, {
      poster: posterPath,
      backdrop: backdropPath,
      strategy: ruleStrategy
    }, {
      id: itemId,
      link: javLink,
      fallbackTitle: parsed && parsed.rawTitle || title,
      baseDescription: "JAV 文件夹"
    });
  }

  // \u62c9\u53d6\u6587\u4ef6\u5939 children\uff08\u53ea\u7b2c\u4e00\u9875\uff09
  var files;
  try {
    files = await listFolder(cookie, cid, 1);
  } catch (e) {
    console.warn("[v1.3.9] jav folder listFolder failed:", e && e.message || e);
    return buildJavDetailItem(mediaKey, meta, {
      poster: posterPath,
      backdrop: backdropPath,
      strategy: ruleStrategy
    }, {
      id: itemId,
      link: javLink,
      fallbackTitle: parsed && parsed.rawTitle || title,
      baseDescription: "JAV 文件夹 · 加载失败"
    });
  }

  console.log("[v1.3.9] jav folder children count: " + (files ? files.length : 0));

  // \u7b5b\u9009\u89c6\u9891\u6587\u4ef6
  var videoFiles = [];
  for (var fi = 0; fi < files.length; fi++) {
    if (is115VideoFile(files[fi])) {
      videoFiles.push(files[fi]);
    }
  }
  console.log("[v1.3.9] jav folder video count: " + videoFiles.length);

  // \u6309\u5927\u5c0f\u964d\u5e8f\uff08\u5927\u6587\u4ef6\u4f18\u5148\uff09
  videoFiles.sort(function(a, b) {
    return (b.size || 0) - (a.size || 0);
  });

  // \u6784\u9020\u89c6\u9891\u8d44\u6e90\u63cf\u8ff0
  var videoDescParts = [];
  for (var vi = 0; vi < videoFiles.length; vi++) {
    var vf = videoFiles[vi];
    var vfName = get115Name(vf);
    var vfSize = formatSize(vf.size);
    var vfDesc = vfName;
    if (vfSize) vfDesc += " (" + vfSize + ")";
    videoDescParts.push(vfDesc);
    console.log("[v1.3.9] jav folder resource pushed: title=" + vfName + ", pickcode=" + get115Pickcode(vf) + ", size=" + vfSize);
  }

  var desc = "JAV \u6587\u4ef6\u5939 \u00b7 " + videoFiles.length + " \u4e2a\u89c6\u9891";

  console.log("[v1.3.9] jav folder metadata fallback: title=" + title + ", videoCount=" + videoFiles.length);

  return buildJavDetailItem(mediaKey, meta, {
    poster: posterPath,
    backdrop: backdropPath,
    strategy: ruleStrategy
  }, {
    id: itemId,
    link: javLink,
    fallbackTitle: parsed && parsed.rawTitle || title,
    baseDescription: desc
  });
}

// --- loadDetail (v1.2.0: \u8def\u7531\u62c6\u5206) ---
async function loadDetail(link) {
  link = String(link || "");
  debugFastIndex("[pan115/loadDetail/entry]", { link: link });
  try {
    if (link.indexOf("offline-submit://") === 0) {
      return await handleOfflineSubmit(link);
    }
    if (link.indexOf("115detail://") === 0) {
      debugFastIndex("[pan115/loadDetail/route]", { route: "normalDetail", link: link });
      return await handleNormalDetail(link);
    }
    if (link.indexOf("115javfolder://") === 0) {
      debugFastIndex("[pan115/loadDetail/route]", { route: "javFolder", link: link });
      var parsed = parse115JavFolderLink(link);
      console.log("[v1.3.9] jav folder route parsed: cid=" + (parsed && parsed.cid || "") + ", mediaKey=" + (parsed && parsed.mediaKey || ""));
      return await handleJavFolderDetail(parsed);
    }
    if (link.indexOf("115folder://") === 0) {
      debugFastIndex("[pan115/loadDetail/route]", { route: "folder", link: link });
      var parsed = parse115FolderLink(link);
      console.log("[pan115/detail] folder route hit:", parsed && parsed.cid, parsed && parsed.title || "");
      return await buildFolderDetailPage(parsed);
    }
    if (link.indexOf("115javmeta://") === 0) {
      debugFastIndex("[pan115/loadDetail/route]", { route: "javmeta", link: link });
      var metaCode = decodeURIComponent(String(link).slice("115javmeta://".length).split("?")[0]);
      return await handleMetaDetail(metaCode);
    }
    debugFastIndex("[pan115/loadDetail/route]", { route: "unknown", link: link });
    console.log("[pan115/detail] no route matched for:", link);
    return null;
  } catch (err) {
    console.error("[pan115/detail] exception:", err && err.message || err);
    // loadDetail \u4e0d\u5e94 throw\uff0c\u4efb\u4f55\u5f02\u5e38\u90fd\u8fd4\u56de\u56de\u6267\u9875
    return {
      id: link,
      type: "url",
      title: "\u52a0\u8f7d\u5931\u8d25",
      description: String(err && err.message || err),
      link: link
    };
  }
}

// --- loadResource (v1.2.0: 路由拆分) ---

// v1.14.0: 播放源结果缓存 —— rex/Forward 对同一播放链接会连续调用两次
// loadResource（rex 实测：每次播放两条 "=== loadResource entry ==="，非可信上下文
// 预取 + 正式解析，两次结果都被收进"播放来源"列表，表现为成倍的相同来源；两次
// 调用共享同一 JS 上下文）。同上下文内按 link 缓存首次成功结果并原样复用：
// 第二次调用零网络，两次返回的 source 数组逐字节相同（含 115 签名 URL），
// 供播放器按 URL 折叠重复项。
var STREAM_RESULT_CACHE = {};
var STREAM_RESULT_CACHE_TTL = 10 * 60 * 1000;  // 115 签名 URL 有效期为小时级，10 分钟内复用安全
var STREAM_RESULT_CACHE_MAX = 8;

function readStreamResultCache(link) {
  var entry = STREAM_RESULT_CACHE[link];
  if (!entry) return null;
  if (Date.now() - entry.t > STREAM_RESULT_CACHE_TTL) {
    delete STREAM_RESULT_CACHE[link];
    return null;
  }
  return entry.sources;
}

function writeStreamResultCache(link, sources) {
  // 空结果不缓存：瞬时失败（转码空响应 + downurl 抖动）允许下次调用重试
  if (!link || !sources || !sources.length) return;
  if (!STREAM_RESULT_CACHE[link]) {
    var keys = Object.keys(STREAM_RESULT_CACHE);
    if (keys.length >= STREAM_RESULT_CACHE_MAX) {
      var oldest = keys[0];
      for (var i = 1; i < keys.length; i++) {
        if (STREAM_RESULT_CACHE[keys[i]].t < STREAM_RESULT_CACHE[oldest].t) oldest = keys[i];
      }
      delete STREAM_RESULT_CACHE[oldest];
    }
  }
  STREAM_RESULT_CACHE[link] = { sources: sources, t: Date.now() };
}

async function loadResource(params) {
  console.log("[pan115/stream] === loadResource entry ===");
  var link = String(params && params.link || "");

  // 离线候选卡片点击：操作回执页，不缓存
  if (link.indexOf("offline-submit://") === 0) {
    return await loadResourceUncached(params, link);
  }

  var cachedSources = readStreamResultCache(link);
  if (cachedSources) {
    console.log("[pan115/stream] result cache hit, sources:", cachedSources.length);
    return cachedSources;
  }

  var sources = await loadResourceUncached(params, link);
  writeStreamResultCache(link, sources);
  return sources;
}

async function loadResourceUncached(params, link) {
  // 1. 离线候选卡片点击
  if (link.indexOf("offline-submit://") === 0) {
    console.log("[pan115/stream] offline-submit detected:", link);
    return await handleOfflineSubmitFromResource(params, link);
  }

  // 2. 115 浏览页本地文件：直接按 pickcode 播放（不依赖番号/搜索）
  if (link.indexOf("115detail://") === 0) {
    console.log("[pan115/stream] 115detail detected:", link);
    return await handleDirectPickcodeResource(params, link);
  }

  // 2b. 115javfolder:// JAV 文件夹播放源 (v1.3.9)
  if (link.indexOf("115javfolder://") === 0) {
    console.log("[v1.3.9] javfolder link detected:", link);
    var cookie = resolveCookie(params);
    syncCookie(cookie);
    if (!cookie) {
      console.log("[v1.3.9] javfolder: no cookie");
      return [];
    }
    var parsed = parse115JavFolderLink(link);
    console.log("[v1.3.9] javfolder cid:", parsed && parsed.cid, "mediaKey:", parsed && parsed.mediaKey || "");
    if (!parsed || !parsed.cid) return [];

    var files;
    try {
      files = await listFolder(cookie, parsed.cid, 1);
    } catch (e) {
      console.warn("[v1.3.9] javfolder listFolder failed:", e && e.message || e);
      return [];
    }

    // 过滤视频文件
    var videoFiles = [];
    for (var fi = 0; fi < files.length; fi++) {
      if (is115VideoFile(files[fi])) videoFiles.push(files[fi]);
    }
    if (!videoFiles.length) {
      console.log("[v1.3.9] javfolder no video files");
      return [];
    }

    // 按大小排序
    videoFiles.sort(function(a, b) { return (b.size || 0) - (a.size || 0); });
    console.log("[v1.3.9] javfolder videos:", videoFiles.length);

    // 对每个视频构建播放源，合并返回
    var allSources = [];
    for (var vi = 0; vi < videoFiles.length; vi++) {
      try {
        var sources = await buildStreamSources(cookie, videoFiles[vi]);
        if (sources && sources.length) allSources = allSources.concat(sources);
      } catch (e) {
        console.warn("[v1.3.9] javfolder buildStreamSources failed:", get115Name(videoFiles[vi]), e && e.message || e);
      }
    }

    if (allSources.length > 10) allSources = allSources.slice(0, 10);
    console.log("[v1.3.9] javfolder total sources:", allSources.length);
    return allSources;
  }

  // 2c. 115javmeta:// 元数据详情播放：按番号匹配 115 文件 (v1.6.0)
  if (link.indexOf("115javmeta://") === 0) {
    var cookieMeta = resolveCookie(params);
    syncCookie(cookieMeta);
    if (!cookieMeta) {
      console.log("[pan115/r18dev/play] no cookie, abort");
      return [];
    }
    var restMeta = String(link).slice("115javmeta://".length);
    var qIdxMeta = restMeta.indexOf("?");
    var contentIdMeta = decodeURIComponent(qIdxMeta >= 0 ? restMeta.slice(0, qIdxMeta) : restMeta);
    var dvdMeta = "";
    if (qIdxMeta >= 0) {
      var pairsMeta = restMeta.slice(qIdxMeta + 1).split("&");
      for (var pm = 0; pm < pairsMeta.length; pm++) {
        var kvMeta = pairsMeta[pm].split("=");
        if (decodeURIComponent(kvMeta[0] || "") === "dvd") {
          dvdMeta = decodeURIComponent(kvMeta.slice(1).join("=") || "");
        }
      }
    }
    // dvd_id 优先（115 文件名按番号组织），无 dvd_id 时尝试从 content_id 提取
    var metaCode = dvdMeta || contentIdMeta;
    var metaKey = extractJavKey(metaCode);
    console.log("[pan115/r18dev/play]", JSON.stringify({
      contentId: contentIdMeta,
      dvd: dvdMeta,
      matchKey: metaKey && metaKey.key || "(none)"
    }));
    if (!metaKey) return [];
    return await searchPan115ByMediaKey(cookieMeta, metaKey);
  }

  // 3. 115folder:// 文件夹播放源
  if (link.indexOf("115folder://") === 0) {
    console.log("[pan115/stream] 115folder link detected:", link);
    var cookie = resolveCookie(params);
    syncCookie(cookie);
    if (!cookie) {
      console.log("[pan115/stream] 115folder: no cookie");
      return [];
    }
    var parsed = parse115FolderLink(link);
    console.log("[pan115/stream] 115folder cid:", parsed && parsed.cid, "title:", parsed && parsed.title || "");
    return await handleFolderPlayback(cookie, parsed);
  }

  // 4. 外部详情页聚合：需要番号搜索（JAV）或欧美 scene key 搜索
  try {
    var cookie = resolveCookie(params);
    syncCookie(cookie);
    if (!cookie) { console.log("[pan115/stream] cookie empty, abort"); return []; }

    var mediaKey = resolveMediaKeyFromParams(params);
    if (!mediaKey || mediaKey.type === "unknown") {
      console.log("[pan115/stream] no match key, abort");
      return [];
    }

    if (mediaKey.type === "jav" || mediaKey.type === "western_scene" || mediaKey.type === "western_date") {
      return await searchPan115ByMediaKey(cookie, mediaKey);
    }

    if (mediaKey.type === "movie" || mediaKey.type === "tv_episode") {
      console.log("[pan115/stream] movie/tv key detected but not implemented:", JSON.stringify(mediaKey));
      return [];
    }

    console.log("[pan115/stream] unexpected type:", mediaKey.type);
    return [];
  } catch (err) {
    console.error("[pan115/stream] loadResource:", err && err.message ? err.message : err);
    return [];
  }
}

// --- searchPan115 ---
async function searchPan115(params) {
  var cookie = resolveCookie(params);
  syncCookie(cookie);
  if (!cookie) {
    return [{
      id: "no-cookie", type: "url", title: "需要 115 Cookie",
      backdropPath: "", mediaType: "movie", link: "",
      description: "请在参数或全局设置中填入 115 Cookie"
    }];
  }

  var keyword = getText(params.keyword);
  if (!keyword) return [];

  try {
    var files = await searchFiles(cookie, keyword);
    var videoFiles = files.filter(function (f) { return isVideoFile(f.filename); });

    var promises = videoFiles.map(function (f) {
      return buildBrowseItem(cookie, f)["catch"](function () { return null; });
    });
    var items = await Promise.all(promises);
    return items.filter(Boolean);
  } catch (err) {
    console.error("[pan115] searchPan115:", err && err.message ? err.message : err);
    return [];
  }
}

// ==================== 115 离线下载函数 ====================

/**
 * 从 Cookie 首段提取 UID
 * Cookie 格式通常为: UID=xxx; CID=...; SEID=...; ...
 */
function extractUidFromCookie(cookie) {
  var first = String(cookie || "").split(";")[0].trim();
  var idx = first.indexOf("=");
  return idx >= 0 ? first.slice(idx + 1) : "";
}

/**
 * 获取 115 离线 token (sign + time)
 * GET https://115.com/?ct=offline&ac=space
 * 返回: { sign, time, size, limit }
 * 需要 Cookie 处于登录态
 */
async function getOfflineSpaceToken(cookie) {
  console.log("[pan115/offline] === getOfflineSpaceToken ===");
  var url = "https://115.com/?ct=offline&ac=space&_=" + Date.now();
  try {
    var raw = await httpGet(url, { headers: cookieHeader(cookie) });
    console.log("[pan115/offline] space raw type:", typeof raw);

    var json = null;
    if (typeof raw === "string") {
      console.log("[pan115/offline] space raw preview:", raw.slice(0, 200));
      json = JSON.parse(raw);
    } else if (raw && typeof raw === "object") {
      console.log("[pan115/offline] space raw object keys:", JSON.stringify(Object.keys(raw)));
      json = raw;
    } else {
      throw new Error("space 返回格式异常: " + String(raw));
    }

    console.log("[pan115/offline] space response state:", json.state, "| has sign:", !!json.sign, "| has time:", !!json.time);
    if (json.state !== true) {
      throw new Error("space 获取失败: " + (json.error || json.error_msg || JSON.stringify(json)));
    }
    return {
      sign: json.sign,
      time: json.time,
      size: json.size,
      limit: json.limit
    };
  } catch (err) {
    console.error("[pan115/offline] space 请求异常:", err && err.message ? err.message : err);
    throw err;
  }
}

/**
 * 提交一条磁力链离线任务
 * POST https://115.com/web/lixian/?ct=lixian&ac=add_task_url
 * @param {string} cookie - 115 登录 Cookie
 * @param {string} magnet - 磁力链接
 * @param {{ sign: string, time: string|number, uid?: string }} tokenObj - 离线授权参数
 * @returns {{ state: boolean, info_hash?: string, error?: string }}
 */
async function submitOfflineTask(cookie, magnet, tokenObj) {
  console.log("[pan115/offline] === submitOfflineTask ===");
  var maglink = String(magnet || "").trim();
  var uid = tokenObj.uid || extractUidFromCookie(cookie);
  var body = "url=" + encodeURIComponent(maglink)
           + "&uid=" + encodeURIComponent(uid)
           + "&sign=" + encodeURIComponent(tokenObj.sign)
           + "&time=" + encodeURIComponent(tokenObj.time);

  console.log("[pan115/offline] POST url:", maglink.slice(0, 50));
  console.log("[pan115/offline] uid:", uid);
  console.log("[pan115/offline] body preview:", body.slice(0, 100) + "...");

  try {
    var raw = await Widget.http.post(
      "https://115.com/web/lixian/?ct=lixian&ac=add_task_url",
      body,
      {
        headers: Object.assign({}, BASE_HEADERS, cookieHeader(cookie), {
          "Content-Type": "application/x-www-form-urlencoded",
          "Referer": "https://115.com/",
          "Origin": "https://115.com"
        }),
        timeout: 20000
      }
    );

    var data = raw && raw.data;
    console.log("[pan115/offline] POST raw.data type:", typeof data);

    var json = null;
    if (typeof data === "string") {
      console.log("[pan115/offline] POST response:", data.slice(0, 200));
      json = JSON.parse(data);
    } else if (data && typeof data === "object") {
      console.log("[pan115/offline] POST response object keys:", JSON.stringify(Object.keys(data)));
      json = data;
    } else {
      throw new Error("POST 返回格式异常: " + String(data));
    }

    if (json.state === true) {
      console.log("[pan115/offline] success, info_hash:", json.info_hash);
      return { state: true, info_hash: json.info_hash || "" };
    }
    var errMsg = json.errcode === "911"
      ? "账号使用异常，请手工验证"
      : (json.error_msg || json.error || "未知错误");
    console.warn("[pan115/offline] task failed:", errMsg, "| full:", JSON.stringify(json));
    return {
      state: false,
      error: errMsg,
      errcode: json.errcode,
    };
  } catch (err) {
    console.error("[pan115/offline] POST 请求异常:", err && err.message ? err.message : err);
    throw err;
  }
}

/**
 * 一键离线：space token → 提交任务
 * @param {string} cookie - 115 登录 Cookie
 * @param {string} magnet - 磁力链接
 * @param {{ uid?: string }} [opts] - 可选参数，不传则自动从 cookie 提取 uid
 * @returns {{ state: boolean, info_hash?: string, error?: string }}
 */
async function offlineOneClick(cookie, magnet, opts) {
  console.log("[pan115/offline] === offlineOneClick ===");
  console.log("[pan115/offline] cookie length:", (cookie || "").length);
  console.log("[pan115/offline] magnet:", String(magnet || "").slice(0, 80));
  opts = opts || {};
  var token = await getOfflineSpaceToken(cookie);
  console.log("[pan115/offline] space token ok, sign:", token.sign, "| time:", token.time);
  var result = await submitOfflineTask(cookie, magnet, {
    sign: token.sign,
    time: token.time,
    uid: opts.uid || "",
  });
  console.log("[pan115/offline] result:", JSON.stringify(result));
  return result;
}

// ==================== v1.2.0: 存储工具函数 ====================

function storeGetJSON(key, fallback) {
  try {
    var raw = Widget.storage.get(key);
    if (!raw) return fallback;
    if (typeof raw === "string") return JSON.parse(raw);
    return raw;
  } catch (_) {
    return fallback;
  }
}

// 返回 true = 调用成功 / false = 抛异常失败。注意：同上下文回读成功只能证明
// 本次写入 API 未报错，不能证明下一上下文可见（跨上下文可见性靠日志观测）。
function storeSetJSON(key, value) {
  try {
    Widget.storage.set(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error("[storage] set failed:", e && e.message || e);
    return false;
  }
}

// ==================== v1.2.0: Sukebei 磁力引擎 ====================

/**
 * 从磁力链接中提取 infoHash
 */
function extractInfoHash(maglink) {
  var m = String(maglink).match(/btih:([a-f0-9]{40})/i);
  return m ? m[1].toLowerCase() : "";
}

/**
 * 简单的字符串哈希（作为 infoHash 缺失时的 fallback）
 */
function simpleHash(s) {
  var hash = 0;
  var str = String(s);
  for (var i = 0; i < str.length; i++) {
    var chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return "h" + Math.abs(hash).toString(36);
}

/**
 * 从磁力标题中提取标签
 * @returns {string[]} tags 数组，如 ["cnsub", "hd", "4k"]
 */
function extractTags(title) {
  var t = String(title || "");
  var tags = [];
  if (/(?:[^A-Za-z]|^)FHDC|[-_]CH?(?:[^A-Za-z]|$)|中字|中文/i.test(t)) tags.push("cnsub");
  if (/\bHD\b/i.test(t)) tags.push("hd");
  if (/\b4K\b/i.test(t)) tags.push("4k");
  return tags;
}

/**
 * 将大小文本（如 "2.3 GiB"）解析为字节数
 */
function parseSizeBytes(s) {
  var m = String(s || "").replace(/,/g, "").match(/([\d.]+)\s*(GiB|MiB|KiB|GB|MB|KB|B)?/i);
  if (!m) return 0;
  var n = parseFloat(m[1]);
  var u = (m[2] || "B").toUpperCase();
  var map = {
    GIB: 1 << 30, MIB: 1 << 20, KIB: 1 << 10,
    GB: 1 << 30, MB: 1 << 20, KB: 1 << 10, B: 1
  };
  return n * (map[u] || 1);
}

/**
 * 字节数 → 可读大小标签
 */
function formatSizeLabel(bytes) {
  if (!bytes || bytes <= 0) return "";
  var gb = bytes / (1 << 30);
  if (gb >= 1) return gb.toFixed(gb >= 10 ? 1 : 2) + " GB";
  var mb = bytes / (1 << 20);
  if (mb >= 1) return Math.round(mb) + " MB";
  return Math.round(bytes / (1 << 10)) + " KB";
}

/**
 * 磁力候选评分排序
 * 中字优先 > 高清优先 > 合理大小优先 > 大合集降权
 */
function scoreCandidate(c) {
  var score = 0;
  if (c.tags && c.tags.indexOf("cnsub") >= 0) score += 100;
  if (c.tags && c.tags.indexOf("hd") >= 0)    score += 20;
  if (c.tags && c.tags.indexOf("4k") >= 0)    score += 10;
  if (c.sizeBytes) {
    var gb = c.sizeBytes / (1 << 30);
    if (gb >= 0.3 && gb <= 15) score += 20;   // 合理大小范围
    if (gb > 30) score -= 50;                  // 超大合集降权
  }
  return score;
}

/**
 * 从 Sukebei 搜索磁力链接
 * GET https://sukebei.nyaa.si/?f=0&c=0_0&q={kw}
 * 解析 HTML 表格获取磁力行，按评分排序后返回
 */
async function searchMagnetSukebei(kw) {
  var url = SUKEBEI_BASE + "/?f=0&c=0_0&q=" + encodeURIComponent(kw);
  var resp = await Widget.http.get(url, { timeout: 8000 });
  if (!resp || !resp.data) {
    return [];
  }

  var $ = Widget.html.load(resp.data);
  var items = [];

  $("tr.default, tr.success").each(function () {
    var titleEl = $(this).find("td:nth-child(2) > a:nth-child(1)");
    var magEl   = $(this).find("td:nth-child(3) > a:last-child");
    var sizeEl  = $(this).find("td:nth-child(4)");

    var title  = String(titleEl.attr("title") || titleEl.text()).trim();
    var maglink = String(magEl.attr("href") || "").trim();
    var size   = String(sizeEl.text()).trim();

    if (!title || !maglink) return;

    var infoHash = extractInfoHash(maglink);
    var tags = extractTags(title);
    var sizeBytes = parseSizeBytes(size);

    items.push({
      title: title,
      maglink: maglink,
      size: size,
      sizeBytes: sizeBytes,
      infoHash: infoHash || simpleHash(maglink),
      source: "sukebei",
      tags: tags
    });
  });

  items.sort(function (a, b) { return scoreCandidate(b) - scoreCandidate(a); });
  return items;
}

// ==================== v1.2.0: 磁力候选管理与 episodeItems ====================

/**
 * 获取磁力候选（缓存优先）
 * - 缓存命中且未过期 → 直接构建 episodeItems
 * - 缓存未命中 → 搜索 → 写缓存 → 构建
 * - 任何异常返回空数组，不阻塞详情页
 */
async function getMagnetCandidatesWithCache(number) {
  // Disabled by default -- see ENABLE_OFFLINE_RELATED_ITEMS
  if (!ENABLE_OFFLINE_RELATED_ITEMS) return [];
  var dvdId = (number || "").trim().toLowerCase();
  if (!dvdId) return [];

  // 1. 读缓存
  var cached = storeGetJSON("magnet-candidates:" + dvdId, null);
  if (cached && Date.now() - cached.time < MAGNET_CACHE_TTL) {
    return buildEpisodeItems(dvdId, cached.items);
  }

  // 2. 搜索 Sukebei（超时由 Widget.http.get 的 timeout 参数保障）
  var items = [];
  try {
    items = await searchMagnetSukebei(dvdId);
  } catch (e) {
    items = [];
  }

  // 3. 写缓存
  if (items.length > 0) {
    storeSetJSON("magnet-candidates:" + dvdId, { time: Date.now(), items: items });
  } else {
  }

  // 4. 构建 episodeItems（含提交状态）
  return buildEpisodeItems(dvdId, items);
}

/**
 * 将磁力候选列表构建为 episodeItems
 * 每条候选是一个 type:"url" 的 VideoItem，禁止设置 videoUrl
 * 提交状态从 storage 读取：✅ 已提交 / ⬇️ 未提交 / ⬇️ 失败可重试
 */
function buildEpisodeItems(dvdId, candidates) {
  if (!ENABLE_OFFLINE_RELATED_ITEMS) return [];
  if (!candidates || !candidates.length) return [];

  return candidates.map(function (c, idx) {
    var candidateId = c.infoHash || ("idx_" + idx);
    var submitted = storeGetJSON("offline-submitted:" + dvdId + ":" + candidateId, null);

    var sizeLabel = formatSizeLabel(c.sizeBytes) || c.size || "";
    var tagText = "";
    if (c.tags) {
      if (c.tags.indexOf("cnsub") >= 0) tagText += "｜中文字幕";
      if (c.tags.indexOf("hd") >= 0)    tagText += "｜高清";
      if (c.tags.indexOf("4k") >= 0)    tagText += "｜4K";
    }
    var sourceLabel = "Sukebei";
    var title = "";
    var desc = "";

    if (submitted && submitted.ok) {
      title = "✅ 已提交到115" + (sizeLabel ? "｜" + sizeLabel : "") + tagText;
      desc = "已提交到 115。请返回原详情页刷新，等待资源匹配。";
    } else if (submitted && !submitted.ok) {
      title = "⚠️ 上次提交失败｜" + sizeLabel;
      desc = "点击可重试 · 来源: " + sourceLabel;
    } else {
      title = "⬇️ 115离线｜点击提交｜" + (sizeLabel ? sizeLabel + tagText : "");
      desc = "来源: " + sourceLabel + " · 打开此卡片会提交到 115 离线";
    }

    return {
      id: "offline:" + dvdId + ":" + candidateId,
      type: "url",
      title: title,
      description: desc,
      link: "offline-submit://" + dvdId + "?cid=" + candidateId
      // 不设置 videoUrl / previewUrl / playerType
    };
  });
}

// ==================== Fast Visual Index: 封面规则函数块（同步，无网络请求） ====================

var STANDARD_CODE_ALLOWLIST = /\b(?:S2M|MIAA|SSNI|SNIS|IPX|IPZZ|SSIS|JUQ|MIDE|MIDV|STARS|ABW|ABF|ABP|JUFE|SQTE|DVAJ|WANZ|LULU|DLDSS|VRTM|SDMU|SDDE|MKMP|HMN|MUDR|ADN|CAWD|PPPE|PRED|MGR|SHKD|MXGS|FSDSS|JUL|KTB|MIAB|GVH|MIMK|JUY|JUTA|IDBD|HND|DASD|CLO|BF|HONB|ROE|CEMD|MIUM|NITR|RCTD|RCT|IPVR|MIBD|JUR|JURD|SOE|ORE|PYO|START|NSFS)\s*[-_ ]?\d{2,6}[A-Z]?(?:[-_ ]?[A-Z]{0,4})?\b/;
var STANDARD_CODE_GENERIC = /\b[A-Z0-9]{2,10}\s*[-_ ]?\d{2,8}[A-Z]?(?:[-_ ]?[A-Z]{0,4})?\b/;

var DMM_CONTENT_PREFIX_MAP = {
  WSA: "2",
  FSDSS: "1",
  FCDSS: "1",
  FNS: "1",
  FTHTD: "1",
  FALENO: "1",
  FGAN: "1",
  FSNF: "1",
  FLAV: "1",
  NAAC: "h_706",
  MAAN: "h_1711",
  NHDTC: "1",
  KUSE: "1",
  MBDD: "301",
  SDNM: "1",
  STARS: "1",
  STAR: "1",
  START: "1",
  SODS: "1",
  REBD: "h_346",
  REBDB: "h_346",
  GSHRB: "h_346",
  MOGI: "1",
  FTAV: "1"
};
// 白名单：已知「按前缀映射 cid 可拼出正确 DMM 图」的番号前缀
//（与 forward/dmm-hd-cover 的 DIRECT_PREFIXES 保持同步）
var DMM_DIRECT_PREFIXES = new Set(["SNIS", "SNOS", "SONE", "SSIS", "SSNI", "STARS", "START", "SODS", "FSDSS", "FCDSS", "FNS", "FTHTD", "FSNF", "FLAV", "NHDTC", "KUSE", "MOGI", "FTAV", "WSA", "MIDV", "MIDA", "MIDE", "MIDD", "DASS", "HIKA", "MKMP", "MADM", "IPZZ", "IPZ", "IPX", "NGOD", "SDNM", "AVSA", "MNGS", "WAAA", "OFES", "OFJE", "OAE", "SIVR", "HSODA", "JUFE", "MUKA", "MIMK", "HMN", "ROYD", "SDHS", "JUR", "SGKI", "CAWD", "REBD", "ADN", "ATID", "JUL", "JUMS", "JUQ", "LULU", "MEYD", "MIAA", "MIAB", "MIRD", "PRED", "URE", "YUJ", "CJOD", "EBWH", "JYMA", "MDHR", "DVAJ", "ACHJ"]);
// 已知「按规则拼不出正确图」的番号（探测必然 miss，直接不生成候选）；与 dmm-hd-cover 同步
var DMM_DIRECT_BLOCKED_CODES = new Set(["START-227", "IPZZ-899", "START-334", "START-302", "START-349", "START-339", "START-310", "START-314", "START-287", "START-273", "START-266", "START-304", "START-285", "START-276", "START-135", "START-062", "START-023", "START-014", "STARS-977", "STARS-917", "STARS-915", "STARS-91501", "SDNM-39101"]);
var DMM_CONTENT_ID_OVERRIDES = {};

var MGSTAGE_COVER_RULES = {
  ABF: { maker: "prestige" },
  ABW: { maker: "prestige" },
  ABP: { maker: "prestige" },
  CHN: { maker: "prestige" },
  MAAN: { maker: "prestige" },
  PPT: { maker: "prestige" },
  SQTE: { maker: "prestige" },
  LUXU: { maker: "prestige" },
  GANA: { maker: "prestige" }
};

var MGSTAGE_PREFIXES = new Set(["ABF", "ABW", "ABP", "CHN", "MAAN", "PPT", "SQTE", "LUXU", "GANA"]);

function normalizeDmmPrefix(prefix) {
  var p = String(prefix || "").toUpperCase();
  if (p === "REBDB") return "REBD";
  return p;
}

function extractStandardCode(text) {
  var s = String(text || "").trim();
  if (!s) return "";
  s = s.toUpperCase();
  // FC2（v1.11.0 起识别）：规范形态 FC2-4544804（剥 PPV，与 LibreDMM slug 一致）。
  // 此前直接拒绝导致列表 enrich key 与详情查询断链；封面走 FC2 官方缩略图探测，
  // 元数据走 LibreFanza（r18/DMM 对 FC2 结构性无收录）。
  var fc2 = s.match(/\bFC2(?:[-_ ]?PPV)?[-_ ]?(\d{5,8})\b/);
  if (fc2) return "FC2-" + fc2[1];

  var allowMatch = s.match(STANDARD_CODE_ALLOWLIST);
  var match = allowMatch || s.match(STANDARD_CODE_GENERIC);
  if (!match || !match[0]) return "";

  var raw = match[0].replace(/\s+/g, "").replace(/_/g, "-").replace(/-+/g, "-").toUpperCase();
  // 先按字母|数字边界切分（cid 形态 snis00776 → SNIS-00776，贪心数字混排
  // 前缀会把数字吞进前缀错切成 SNIS007-76）；数字混排前缀（T28-601 等）走回退
  var parts = raw.match(/^([A-Z]{2,})-?(\d{2,8})([A-Z]?)$/);
  if (!parts) parts = raw.match(/^([A-Z0-9]+)-?(\d{2,8})([A-Z]?)$/);
  if (!parts) {
    // generic 匹配但无法切分（纯字母标签 WEB-DL 等）→ 视为无番号；
    // allowlist 命中恒含号码，不受影响
    return allowMatch ? raw : "";
  }

  // v1.12.0: generic 匹配（前缀不在 allowlist）过噪声门禁——裸年份（2025 →
  // 20-25）、分辨率（1080P → 10-80P）、集数（EP01 → EP-01）之类返回空串，
  // 让调用方回落原始文件名/文件夹名（unknown 类型本就该原样展示）
  if (!allowMatch && isJavNoiseCode(parts[1], parts[2], parts[3] || "")) {
    return "";
  }

  return parts[1].toUpperCase() + "-" + parts[2] + (parts[3] || "");
}

function parseStandardCodeParts(value) {
  var code = extractStandardCode(value);
  if (!code) return null;

  var normalized = code.toUpperCase().replace(/\s+/g, "").replace(/_/g, "-").replace(/-+/g, "-");
  var match = normalized.match(/^([A-Z0-9]+)-?(\d{2,8})([A-Z]?)$/);
  if (!match) return null;

  var prefix = match[1].toUpperCase();
  var number = match[2];
  var suffix = match[3] || "";
  return {
    prefix: prefix,
    prefixLower: prefix.toLowerCase(),
    number: number,
    number3: number.padStart(3, "0"),
    number5: number.padStart(5, "0"),
    suffix: suffix,
    code: prefix + "-" + number + suffix,
    plainCode: prefix.toLowerCase() + number.padStart(5, "0") + suffix.toLowerCase()
  };
}

function isDirectDmmSeries(parts) {
  if (!parts) return false;
  if (DMM_DIRECT_BLOCKED_CODES.has(parts.prefix + "-" + parts.number)) return false;
  return DMM_DIRECT_PREFIXES.has(normalizeDmmPrefix(parts.prefix));
}

function buildDmmContentIdFromParts(parts) {
  if (!parts) return "";

  var code = parts.code ? String(parts.code).toUpperCase() : "";
  if (code && DMM_CONTENT_ID_OVERRIDES[code]) {
    return DMM_CONTENT_ID_OVERRIDES[code];
  }

  var prefix = normalizeDmmPrefix(parts.prefix);
  var numericPrefix = DMM_CONTENT_PREFIX_MAP[prefix] || "";
  if (!numericPrefix && /^SD[A-Z]{2,3}$/.test(prefix)) {
    numericPrefix = "1";
  }
  return numericPrefix + prefix.toLowerCase() + parts.number5 + String(parts.suffix || "").toLowerCase();
}

function buildDmmCoverCandidatesFromContentId(contentId) {
  if (!contentId) return { posterCandidates: [], backdropCandidates: [] };

  return {
    posterCandidates: [
      "https://awsimgsrc.dmm.co.jp/pics_dig/digital/video/" + contentId + "/" + contentId + "ps.jpg",
      "https://pics.dmm.co.jp/digital/video/" + contentId + "/" + contentId + "ps.jpg"
    ],
    backdropCandidates: [
      "https://awsimgsrc.dmm.co.jp/pics_dig/digital/video/" + contentId + "/" + contentId + "pl.jpg",
      "https://pics.dmm.co.jp/digital/video/" + contentId + "/" + contentId + "pl.jpg"
    ]
  };
}

function buildDmmCoverCandidatesFromParts(parts) {
  if (!parts) return { posterCandidates: [], backdropCandidates: [] };
  return buildDmmCoverCandidatesFromContentId(buildDmmContentIdFromParts(parts));
}

function buildMgstageCoverCandidatesFromParts(parts, rule) {
  if (!parts || !rule || !rule.maker) return { posterCandidates: [], backdropCandidates: [] };

  var prefixLower = parts.prefixLower;
  var number = parts.number3;
  if (!prefixLower || !number) return { posterCandidates: [], backdropCandidates: [] };

  var dvdDash = prefixLower + "-" + number;
  var base = "https://image.mgstage.com/images/" + rule.maker + "/" + prefixLower + "/" + number;
  return {
    posterCandidates: [
      base + "/pf_e_" + dvdDash + ".jpg",
      base + "/pf_o1_" + dvdDash + ".jpg"
    ],
    backdropCandidates: [
      base + "/pb_e_" + dvdDash + ".jpg"
    ]
  };
}

function buildImageCandidatesFromValue(value) {
  var rawValue = String(value || "").trim().toUpperCase();
  if (rawValue.indexOf("XXX-AV") !== -1) {
    return { strategy: "blocked", posterCandidates: [], backdropCandidates: [] };
  }

  var parts = parseStandardCodeParts(rawValue);
  if (!parts) return { strategy: "none", posterCandidates: [], backdropCandidates: [] };

  if (isDirectDmmSeries(parts)) {
    var directCandidates = buildDmmCoverCandidatesFromParts(parts);
    directCandidates.strategy = "direct-dmm";
    return directCandidates;
  }

  if (MGSTAGE_PREFIXES.has(parts.prefix)) {
    var rule = MGSTAGE_COVER_RULES[parts.prefix] || { maker: "prestige" };
    var mgstageCandidates = buildMgstageCoverCandidatesFromParts(parts, rule);
    mgstageCandidates.strategy = "mgstage";
    return mgstageCandidates;
  }

  return { strategy: "unsupported-jav", posterCandidates: [], backdropCandidates: [] };
}

function chooseFirstCandidate(candidates, fallback) {
  for (var i = 0; i < (candidates || []).length; i++) {
    if (candidates[i]) return candidates[i];
  }
  return fallback || "";
}

// ==================== DMM 封面存在性探测 (v1.7.2，移植自 forward/dmm-hd-cover) ====================
// 核心知识（dmm-hd-cover 实测）：
//   - pics.dmm.co.jp 对缺失图返回 302 → now_printing 占位图（200 正常加载，无法用 onerror
//     分辨）——列表页 now printing 占位图的来源；
//   - awsimgsrc.dmm.co.jp 对缺失图返回干净 404 → GET + Range 小请求即可可靠判定：
//     200/206/416 = 存在；404 = 不存在；403/5xx/超时 = 不确定（不缓存，下次重试）。
// 探测结果双层缓存（内存 + storage）：命中 30 天（图片按 cid 寻址内容不变），
// miss 3 天（新番可能后补图）。

var DMMHD_PROBE_TIMEOUT_MS = 2000;
// 观测计数器（v1.10.0）：backfill 日志按阶段取差值，用于区分"缓存命中"与
// "实际网络探测"——判定 pan115-dmmhd: / pan115-cover: 小 key 是否跨上下文可见
var DMMHD_PROBE_NET_CALLS = 0;    // 实际进入 Widget.http.get 的探测请求数
var DMMHD_CACHE_HIT_CALLS = 0;    // dmmhdProbe 命中缓存（内存/storage）的次数
var DMMHD_TTL_HIT = 30 * 86400 * 1000;
var DMMHD_TTL_MISS = 3 * 86400 * 1000;
var DMMHD_STORAGE_PREFIX = "pan115-dmmhd:";
var DMMHD_MEM_CACHE = {};
var DMMHD_PROBE_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "image/*,*/*;q=0.8",
  "Referer": "https://www.dmm.co.jp/",
  "Range": "bytes=0-1023"
};

function dmmhdPosterUrl(cid) {
  return "https://awsimgsrc.dmm.co.jp/pics_dig/digital/video/" + cid + "/" + cid + "ps.jpg";
}

function dmmhdBackdropUrl(cid) {
  return "https://awsimgsrc.dmm.co.jp/pics_dig/digital/video/" + cid + "/" + cid + "pl.jpg";
}

// 返回 true/false（缓存有效）或 null（未知，需要探测）
function dmmhdReadCache(cid) {
  if (cid in DMMHD_MEM_CACHE) return DMMHD_MEM_CACHE[cid];
  try {
    var raw = storeGetJSON(DMMHD_STORAGE_PREFIX + cid, null);
    if (raw && typeof raw === "object") {
      var age = Date.now() - Number(raw.t || 0);
      if (age < (raw.h ? DMMHD_TTL_HIT : DMMHD_TTL_MISS)) {
        DMMHD_MEM_CACHE[cid] = !!raw.h;
        return !!raw.h;
      }
    }
  } catch (e) {}
  return null;
}

function dmmhdWriteCache(cid, exists) {
  DMMHD_MEM_CACHE[cid] = !!exists;
  storeSetJSON(DMMHD_STORAGE_PREFIX + cid, { h: exists ? 1 : 0, t: Date.now() });
}

// 探测一个图片 URL 是否存在。恒不 reject。
// 返回 true = 存在 / false = 确认不存在（404）/ null = 不确定（403/5xx/超时/预算耗尽）。
// deadlineAt（可选）：timeout 收缩为 min(DMMHD_PROBE_TIMEOUT_MS, 剩余)，剩余
// 不足以发请求时直接返回 null（不写缓存，视为不确定）。
async function dmmhdProbeUrl(url, deadlineAt) {
  if (!url) return false;
  var timeout = DMMHD_PROBE_TIMEOUT_MS;
  if (deadlineAt) timeout = Math.min(timeout, deadlineAt - Date.now());
  if (timeout <= 0) return null;
  DMMHD_PROBE_NET_CALLS++;  // 观测口径：实际进入 Widget.http.get 的探测请求数
  var status = 0;
  try {
    var resp = await Widget.http.get(url, {
      headers: DMMHD_PROBE_HEADERS,
      timeout: timeout
    });
    status = resp && resp.statusCode || 0;
  } catch (e) {
    status = r18StatusFromError(e);  // 兼容对非 2xx 抛异常的宿主环境
  }
  if (status === 200 || status === 206 || status === 416) return true;
  if (status === 404) return false;
  console.log("[pan115/dmmhd/unknown]", JSON.stringify({ url: url.slice(0, 120), status: status }));
  return null;
}

async function dmmhdProbe(cid, deadlineAt) {
  if (!cid) return false;
  var cached = dmmhdReadCache(cid);
  if (cached !== null) {
    DMMHD_CACHE_HIT_CALLS++;  // 观测口径：探测缓存命中（内存或 storage 层）
    return cached;
  }
  var state = await dmmhdProbeUrl(dmmhdBackdropUrl(cid), deadlineAt);
  if (state === true) dmmhdWriteCache(cid, true);
  else if (state === false) dmmhdWriteCache(cid, false);
  return state;
}

// 并发探测一组 cid：返回 { cid, definitive } —— cid 为第一个存在的（无则空串），
// definitive 表示全部结论确定（无 unknown，可安全判定"都没有"）。
async function dmmhdProbeAny(ids, deadlineAt) {
  var results = await Promise.all((ids || []).map(function (cid) {
    return dmmhdProbe(cid, deadlineAt).then(function (state) {
      return { cid: cid, hit: state === true, unknown: state === null };
    });
  }));
  var definitive = true;
  for (var i = 0; i < results.length; i++) {
    if (results[i].hit) return { cid: results[i].cid, definitive: true };
    if (results[i].unknown) definitive = false;
  }
  return { cid: "", definitive: definitive };
}

/**
 * 番号/cid → 有序探测变体（黑名单内返回空数组）。r18.dev 的 content_id 形态不统一
 *（jur834 短码 / mide00390 填充 / h_086midv00001 带厂前缀），直接构造会 404，
 * 必须经探测选出真实存在的 cid。首选项是入参原样（多数 r18 cid 直接有效）。
 * 注意：不能用 parseStandardCodeParts 解析无横杠短码（贪婪前缀会吞数字），这里
 * 用 dmm-hd-cover 的 parseCode 规则：前缀纯字母 + 数字段。
 */
function dmmhdContentIdVariants(code) {
  var out = [];
  var seen = {};
  function add(cid) {
    cid = String(cid || "").toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (!cid || seen[cid]) return;
    seen[cid] = 1;
    out.push(cid);
  }
  add(code);  // 原样：h_086midv00001 / mide00390 等形态直接有效
  var stripped = String(code || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  var m = stripped.match(/^(1?)([A-Z]{2,10})(\d{2,8})([A-Z]?)$/);
  if (!m) return out;
  var prefix = m[2];
  var number = m[3];
  var suffix = m[4] || "";
  if (DMM_DIRECT_BLOCKED_CODES.has(prefix + "-" + number + suffix)) return [];
  var parts = { prefix: prefix, prefixLower: prefix.toLowerCase(), number5: ("00000" + number).slice(-5), suffix: suffix.toLowerCase() };
  if (suffix) {
    // 尾字母后缀（MIAD-812U 等）多为发行标记，真实 cid 不带后缀：无后缀 5 位填充最可能
    add(parts.prefixLower + parts.number5);
  } else {
    add(buildDmmContentIdFromParts(parts));
  }
  add(buildDmmContentIdFromParts(parts));                         // 数字前缀映射（含后缀）
  if (suffix) add(parts.prefixLower + parts.number5);             // 无后缀 5 位填充
  add(parts.prefixLower + number.padStart(4, "0"));               // 4 位填充
  add(parts.prefixLower + number);                                // 原始位数
  add("1" + parts.prefixLower + parts.number5);
  add("1" + parts.prefixLower + number);
  return out;
}

/**
 * 并发探测有序 cid 变体，按输入顺序返回第一个存在的；全部失败/不确定返回
 * { cid: "", definitive }。默认两批：先探最可能的两个变体，全 miss 再探长尾；
 * quick 模式（列表回填用）只探第一批——长尾变体交给 LibreFanza 兜底（那里
 * 能拿到真实 cid），省下的预算用于救援更多条目。
 * opts.deadlineAt（可选）：批间检查剩余预算，耗尽不再启动下一批探测。
 */
async function dmmhdProbeFirst(variants, opts) {
  var ids = variants || [];
  if (!ids.length) return { cid: "", definitive: true };
  var deadlineAt = (opts && opts.deadlineAt) || 0;
  var first = await dmmhdProbeAny(ids.slice(0, 2), deadlineAt);
  if (first.cid) return first;
  if (ids.length > 2 && !(opts && opts.quick)) {
    if (deadlineAt && Date.now() > deadlineAt - 500) {
      return { cid: "", definitive: false };  // 预算耗尽：长尾不探，视为不确定
    }
    var second = await dmmhdProbeAny(ids.slice(2), deadlineAt);
    if (second.cid) return second;
    return { cid: "", definitive: first.definitive && second.definitive };
  }
  return { cid: "", definitive: first.definitive };
}

// ==================== v1.2.0: handleNormalDetail 详情页 + 磁力候选区 ====================

/**
 * 处理 115detail:// 正常详情页
 * - 解析 pickcode，构建基础详情
 * - 搜索 115 文件（失败不阻断）
 * - 搜索磁力候选（失败不阻断；由 ENABLE_OFFLINE_RELATED_ITEMS 控制，默认关闭）
 * - 返回携带 episodeItems 的完整 VideoItem
 */
async function handleNormalDetail(link) {
  var cleanLink = String(link || "").trim();

  // 解析 pickcode + query
  var pathPart = cleanLink.slice("115detail://".length);
  var qIndex = pathPart.indexOf("?");
  var pickcode = qIndex >= 0 ? pathPart.slice(0, qIndex) : pathPart;
  if (!pickcode) return null;

  // 解析 query 参数
  var titleParam = "";
  var mediaTypeParam = "";
  var rawTitleParam = "";
  if (qIndex >= 0) {
    var pairs = pathPart.slice(qIndex + 1).split("&");
    for (var i = 0; i < pairs.length; i++) {
      var kv = pairs[i].split("=");
      var key = decodeURIComponent(kv[0] || "");
      var val = kv[1] !== undefined ? decodeURIComponent(kv.slice(1).join("=")) : "";
      if (key === "title") titleParam = val;
      else if (key === "mediaType") mediaTypeParam = val;
      else if (key === "rawTitle") rawTitleParam = val;
    }
  }

  debugFastIndex("[pan115/detail/parsed]", {
    pickcode: pickcode,
    titleParam: titleParam,
    mediaTypeParam: mediaTypeParam,
    rawTitleParam: rawTitleParam
  });

  // 读取后备缓存
  var cached = PICKCODE_FILE_MAP[pickcode] || {};

  // 约束 #2: 标准化 mediaKey
  var titleToCheck = titleParam || rawTitleParam || cached.filename || "";
  var mediaKey =
    extractStandardCode(titleParam || cached.mediaKey || titleToCheck) ||
    titleParam ||
    cached.mediaKey ||
    "";

  // 约束 #4: 判断是否 JAV（复合判断）
  var isJav = (mediaTypeParam === "jav") || !!extractStandardCode(titleToCheck);

  // 构造后备信息
  var fallbackTitle = mediaKey || rawTitleParam || cached.title || "115 \u89c6\u9891";
  var fallbackPoster = cached.posterPath || "";
  var fallbackBackdrop = cached.backdropPath || "";

  // 详情页入口日志
  debugFastIndex("[pan115/detail/entry]", {
    link: cleanLink,
    pickcode: pickcode,
    titleParam: titleParam,
    mediaTypeParam: mediaTypeParam,
    rawTitleParam: rawTitleParam,
    cachedMediaKey: cached.mediaKey || "",
    cachedMediaType: cached.mediaType || "",
    normalizedMediaKey: mediaKey || "",
    isJav: isJav
  });

  // 规则封面候选（同步，优先于服务封面；mgstage 盲拼除外，见 buildJavDetailItem）
  var rulePoster = "";
  var ruleBackdrop = "";
  var ruleStrategy = "";
  if (isJav && mediaKey) {
    var rc = buildImageCandidatesFromValue(mediaKey);
    rulePoster = chooseFirstCandidate(rc.posterCandidates, "");
    ruleBackdrop = chooseFirstCandidate(rc.backdropCandidates, "");
    ruleStrategy = rc.strategy || "";
    if (rulePoster) {
      debugFastIndex("[pan115/detail/fallbackArtwork]", {
        mediaKey: mediaKey,
        strategy: rc.strategy || "none",
        posterFromRule: !!rulePoster,
        backdropFromRule: !!ruleBackdrop,
        posterFromCache: !!cached.posterPath,
        backdropFromCache: !!cached.backdropPath,
        finalPosterEmpty: false,
        finalBackdropEmpty: !ruleBackdrop
      });
    }
  }

  // JAV 元数据增强（v1.7.0）：r18.dev 直连；规则封面优先，r18.dev 兜底并填充富数据。
  // ignoreNegative：详情页用户主动进入，无视负缓存强制重试；成功后清负缓存。
  var javMeta = null;
  if (isJav && mediaKey) {
    try {
      javMeta = await fetchJavMeta(mediaKey, { source: "detail", ignoreNegative: true });
    } catch (e) {
      console.warn("[pan115/detail/javmeta] enrich failed:", mediaKey, e && e.message || e);
    }

    // 成功后回写运行时 meta cache（列表页封面回填数据源）
    if (pickcode && javMeta) {
      var existingMap = PICKCODE_FILE_MAP[pickcode] || {};
      PICKCODE_FILE_MAP[pickcode] = Object.assign({}, existingMap, {
        metaTitle: javMeta.titleJa || javMeta.titleEn || "",
        metaPosterPath: javMeta.posterUrl || "",
        metaBackdropPath: javMeta.coverUrl || javMeta.posterUrl || "",
        metaSource: "r18dev",
        metaFetchedAt: Date.now()
      });
      debugFastIndex("[pan115/metaCache/write]", {
        pickcode: pickcode,
        mediaKey: mediaKey,
        hasMetaTitle: !!(javMeta.titleJa || javMeta.titleEn),
        hasMetaPoster: !!javMeta.posterUrl,
        hasMetaBackdrop: !!(javMeta.coverUrl || javMeta.posterUrl),
        source: "r18dev"
      });
    }
  }

  // 构建描述（115 专属行）
  var descParts = [];
  if (mediaKey) descParts.push("番号: " + mediaKey);
  if (rawTitleParam) descParts.push("原文件: " + rawTitleParam);
  else if (cached.filename) descParts.push("原文件: " + cached.filename);
  if (cached.size) {
    var sizeText = formatSize(cached.size);
    if (sizeText) descParts.push("大小: " + sizeText);
  }
  var baseDescription = descParts.join("\n");

  var itemId = mediaKey || ("115_" + pickcode);

  // v1.10.0: 已验证封面索引（pan115-cover:）优先于规则盲拼与缓存兜底——索引是
  // 探测/双源确认过的真实图；富抓取（javMeta）成功时其封面同样已验证，由
  // buildJavDetailItem 的 ruleArt 优先级择优，失败时至少保底有图
  var verifiedCover = mediaKey ? readVerifiedCoverForDetail(mediaKey) : null;
  if (verifiedCover && verifiedCover.poster) {
    rulePoster = verifiedCover.poster;
    ruleBackdrop = verifiedCover.backdrop || ruleBackdrop;
    ruleStrategy = "verified-cover";
  }

  // strategy 归因：规则候选命中 → rc.strategy；否则缓存封面 → 其构建时的 strategy
  var coverStrategy = rulePoster ? ruleStrategy : (fallbackPoster ? (cached.artworkStrategy || "") : "");

  var item = buildJavDetailItem(mediaKey, javMeta, {
    poster: rulePoster || fallbackPoster || "",
    backdrop: ruleBackdrop || fallbackBackdrop || "",
    strategy: coverStrategy
  }, {
    id: itemId,
    link: cleanLink,
    fallbackTitle: fallbackTitle,
    baseDescription: baseDescription
  });

  // 尝试搜索 115 文件（失败不阻断）
  try {
    var cookie = resolveCookie(null) || "";
    if (cookie && mediaKey) {
      var searchText = mediaKey.toLowerCase().replace(/^fc2-/, "");
      await searchFiles(cookie, searchText);
    }
  } catch (e) {
    console.error("[pan115] searchFiles (non-blocking):", e && e.message || e);
  }

  // 搜索磁力候选（失败不阻断；由 ENABLE_OFFLINE_RELATED_ITEMS 控制，默认关闭）
  var candidates = [];
  if (mediaKey) {
    candidates = await getMagnetCandidatesWithCache(mediaKey);
  }
  item.episodeItems = [];
  item.relatedItems = candidates.map(function (c) {
    return {
      id: c.id,
      type: "url",
      title: c.title,
      description: c.description,
      link: c.link
    };
  });

  return item;
}

// ==================== v1.2.0: handleOfflineSubmit 离线提交 + 操作回执 ====================

/**
 * 构建操作回执页
 * type:"url" + 不包含 videoUrl，仅展示结果
 */
function buildReceipt(link, ok, title, message) {
  return {
    id: link,
    type: "url",
    title: title,
    description: message,
    link: link
  };
}

/**
 * 处理 offline-submit:// 提交请求
 * - 解析番号和候选 ID
 * - 防重复提交（已成功的候选不再重复提交）
 * - 从缓存中读取磁力候选
 * - 提交 115 离线任务
 * - 写入提交状态缓存
 * - 返回操作回执页
 */
async function handleOfflineSubmit(link) {
  // 1. 解析参数
  var rest = link.slice("offline-submit://".length);
  var qIdx = rest.indexOf("?");
  var dvdId = qIdx >= 0 ? rest.slice(0, qIdx) : rest;
  var cidStr = qIdx >= 0 ? rest.slice(qIdx + 1) : "";
  var candidateId = "";

  cidStr.split("&").forEach(function (pair) {
    var kv = pair.split("=");
    if (kv[0] === "cid") candidateId = decodeURIComponent(kv[1] || "");
  });

  if (!dvdId || !candidateId) {
    return buildReceipt(link, false, "提交失败", "未找到有效的番号和候选标识");
  }

  // 2. 防重复提交
  var submitted = storeGetJSON("offline-submitted:" + dvdId + ":" + candidateId, null);
  if (submitted && submitted.ok) {
    return buildReceipt(link, true, "此前已提交",
      "这条磁力已提交到 115。请返回原详情页并刷新，等待资源匹配。");
  }

  // 3. 从缓存读取磁力候选
  var cached = storeGetJSON("magnet-candidates:" + dvdId, null);
  var candidates = (cached && cached.items) || [];
  var candidate = null;
  for (var i = 0; i < candidates.length; i++) {
    var cid = candidates[i].infoHash || ("idx_" + i);
    if (cid === candidateId) { candidate = candidates[i]; break; }
  }

  if (!candidate) {
    return buildReceipt(link, false, "提交失败",
      "未找到对应的磁力候选，请返回原详情页刷新后重试。");
  }

  // 4. 获取 cookie
  var cookie = resolveCookie(null) || "";
  if (!cookie) {
    return buildReceipt(link, false, "提交失败",
      "请先在全局设置或参数中填入 115 Cookie。");
  }

  // 5. 提交 115 离线任务
  var result;
  try {
    result = await offlineOneClick(cookie, candidate.maglink);
  } catch (e) {
    result = { state: false, error: String(e && e.message || e) };
  }

  // 6. 写入提交状态
  storeSetJSON("offline-submitted:" + dvdId + ":" + candidateId, {
    ok: result && result.state === true,
    time: Date.now(),
    title: candidate.title,
    sizeText: formatSizeLabel(candidate.sizeBytes) || candidate.size || ""
  });

  // 7. 返回回执页
  if (result && result.state === true) {
    return buildReceipt(link, true, "已提交到 115 离线下载",
      "任务已提交。请返回原详情页并刷新，等待 115 资源匹配。");
  }

  return buildReceipt(link, false, "提交失败",
    (result && result.error) || "115 返回失败，请稍后重试。");
}



// ==================== v1.2.0: handleOfflineSubmitFromResource (通过 loadResource 触发离线提交) ====================

/**
 * 当 loadResource 检测到 params.link 以 offline-submit:// 开头时调用。
 * 提交 115 离线任务，不返回任何 stream 资源。
 * 两层防重复：submitted ok 检查 + pending 5 分钟检查。
 */
async function handleOfflineSubmitFromResource(params, link) {
  // 1. 解析参数
  var rest = link.slice("offline-submit://".length);
  var qIdx = rest.indexOf("?");
  var dvdId = qIdx >= 0 ? rest.slice(0, qIdx) : rest;
  var cidStr = qIdx >= 0 ? rest.slice(qIdx + 1) : "";
  var candidateId = "";
  cidStr.split("&").forEach(function (pair) {
    var kv = pair.split("=");
    if (kv[0] === "cid") candidateId = decodeURIComponent(kv[1] || "");
  });

  if (!dvdId || !candidateId) {
    console.error("[pan115/stream] offline-submit parse failed:", link);
    return [];
  }
  console.log("[pan115/stream] offline parsed dvdId:", dvdId, "candidateId:", candidateId);

  // 2. 防重复：检查已提交状态
  var submittedKey = "offline-submitted:" + dvdId + ":" + candidateId;
  var submitted = storeGetJSON(submittedKey, null);
  if (submitted && submitted.ok) {
    console.log("[pan115/stream] offline already submitted, skip:", submittedKey);
    return [];
  }

  // 3. 防重复：检查 pending（5 分钟内不重复）
  var pendingKey = "offline-pending:" + dvdId + ":" + candidateId;
  var pending = storeGetJSON(pendingKey, null);
  if (pending && pending.time && Date.now() - pending.time < 5 * 60 * 1000) {
    console.log("[pan115/stream] offline pending, skip duplicate:", pendingKey);
    return [];
  }

  // 4. 写 pending
  storeSetJSON(pendingKey, { time: Date.now() });

  // 5. 从缓存读取磁力候选
  var cached = storeGetJSON("magnet-candidates:" + dvdId, null);
  var candidates = (cached && cached.items) || [];
  var candidate = null;
  for (var i = 0; i < candidates.length; i++) {
    var cid = candidates[i].infoHash || ("idx_" + i);
    if (cid === candidateId) { candidate = candidates[i]; break; }
  }

  if (!candidate) {
    console.error("[pan115/stream] offline candidate not found for:", candidateId);
    storeSetJSON(submittedKey, { ok: false, time: Date.now(), error: "candidate not found" });
    storeSetJSON(pendingKey, { time: 0, done: true });
    return [];
  }
  console.log("[pan115/stream] offline candidate found:", candidate.title);

  // 6. 获取 cookie
  var cookie = resolveCookie(params) || COOKIE_115 || "";
  syncCookie(cookie);
  console.log("[pan115/stream] offline cookie length:", cookie.length);
  if (!cookie) {
    console.error("[pan115/stream] offline submit failed: no cookie");
    storeSetJSON(submittedKey, { ok: false, time: Date.now(), error: "no cookie" });
    storeSetJSON(pendingKey, { time: 0, done: true });
    return [];
  }

  // 7. 提交 115 离线任务
  console.log("[pan115/stream] offline submit start");
  var result;
  try {
    result = await offlineOneClick(cookie, candidate.maglink);
    console.log("[pan115/stream] offline submit result:", JSON.stringify(result));
  } catch (e) {
    var errMsg = e && e.message || String(e);
    console.error("[pan115/stream] offline submit failed:", errMsg);
    result = { state: false, error: errMsg };
  }

  // 8. 写入提交状态
  storeSetJSON(submittedKey, {
    ok: result && result.state === true,
    time: Date.now(),
    title: candidate.title,
    sizeText: formatSizeLabel(candidate.sizeBytes) || candidate.size || "",
    message: result && result.error || ""
  });

  // 9. 清除 pending
  storeSetJSON(pendingKey, { time: 0, done: true });

  // 10. 返回空数组（不提供 stream 资源）
  return [];
}
