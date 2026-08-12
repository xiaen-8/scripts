/**
 * Stripchat 直播模块 (v5 - 优化直播源提取版)
 * ==========================================
 * 基于 sc-resolve.js 的多CDN探测 + 画质阶梯 + 广告过滤方案优化。
 *
 * 核心改进:
 *   1. 多CDN master探测 (doppiocdn.org/com + growcdnssedge.com)
 *   2. growcdn media 画质阶梯探测 (_source/_1080p/_720p/_480p等)
 *   3. 直播流验证 - 过滤 #EXT-X-MOUFLON-ADVERT 广告 / VOD / 模糊变体
 *   4. CDN URL重写 - doppiocdn media → growcdnssedge media
 *   5. 变体评分排序 - 分辨率高度优先，source/orig 视为最高画质
 *   6. 离线主播检测 - 探测失败时给出明确提示
 *
 * 数据来源:
 *   - API 代理: go.mavrtracktor.com/api/models
 *   - CDN: edge-hls.doppiocdn.org/com / edge-hls.growcdnssedge.com
 *   - Media: media-hls.growcdnssedge.com
 */

// ============================================================
// 分类定义
// ============================================================

var CATEGORIES = [
  // -- 女主播 --
  { id: "girls_cn",     tag: "girls/chinese",       title: "🇨🇳中国女孩",   group: "女主播" },
  { id: "girls_jp",     tag: "girls/japanese",      title: "🇯🇵日本女孩",   group: "女主播" },
  { id: "girls_kr",     tag: "girls/korean",        title: "🇰🇷韩国女孩",   group: "女主播" },
  { id: "girls_vn",     tag: "girls/vietnamese",    title: "🇻🇳越南女孩",   group: "女主播" },
  { id: "girls_ua",     tag: "girls/ukrainian",     title: "🇺🇦乌克兰女孩", group: "女主播" },
  { id: "girls_ru",     tag: "girls/russian",       title: "🇷🇺俄罗斯女孩", group: "女主播" },
  { id: "girls_us",     tag: "girls/american",      title: "🇺🇸美国女孩",   group: "女主播" },
  { id: "girls_co",     tag: "girls/colombian",     title: "🇨🇴哥伦比亚女孩", group: "女主播" },
  { id: "girls_de",     tag: "girls/german",        title: "🇩🇪德国女孩",   group: "女主播" },
  { id: "girls_fr",     tag: "girls/french",        title: "🇫🇷法国女孩",   group: "女主播" },
  { id: "girls_uk",     tag: "girls/uk-models",     title: "🇬🇧英国女孩",   group: "女主播" },
  { id: "girls_ca",     tag: "girls/canadian",      title: "🇨🇦加拿大女孩", group: "女主播" },
  { id: "girls_mx",     tag: "girls/mexican",       title: "🇲🇽墨西哥女孩", group: "女主播" },
  { id: "girls_in",     tag: "girls/indian",        title: "🇮🇳印度女孩",   group: "女主播" },
  { id: "girls_ve",     tag: "girls/venezuelan",    title: "🇻🇪委内瑞拉女孩", group: "女主播" },
  { id: "girls_ro",     tag: "girls/romanian",      title: "🇷🇴罗马尼亚女孩", group: "女主播" },
  { id: "girls_af",     tag: "girls/african",       title: "🌍非洲女孩",   group: "女主播" },
  { id: "girls_es",     tag: "girls/spanish-speaking", title: "🇪🇸西班牙女孩", group: "女主播" },
  { id: "girls_ar",     tag: "girls/arab",          title: "🇸🇦阿拉伯女孩", group: "女主播" },
  { id: "girls_ke",     tag: "girls/kenyan",        title: "🇰🇪肯尼亚女孩", group: "女主播" },
  { id: "girls_za",     tag: "girls/south-african", title: "🇿🇦南非女孩",   group: "女主播" },
  { id: "girls_br",     tag: "girls/brazilian",     title: "🇧🇷巴西女孩",   group: "女主播" },
  { id: "girls_th",     tag: "girls/thai",          title: "🇹🇭泰国女孩",   group: "女主播" },
  { id: "girls_it",     tag: "girls/italian",       title: "🇮🇹意大利女孩", group: "女主播" },
  { id: "girls_teens",  tag: "girls/teens",         title: "少女18+",      group: "女主播" },
  { id: "girls_young",  tag: "girls/young",         title: "鲜嫩青年22+",  group: "女主播" },
  { id: "girls_milfs",  tag: "girls/milfs",         title: "熟女",         group: "女主播" },
  { id: "girls_mature", tag: "girls/mature",        title: "成熟",         group: "女主播" },
  { id: "girls_grannies", tag: "girls/grannies",    title: "老奶奶",       group: "女主播" },
  { id: "girls_white",  tag: "girls/white",         title: "白人",         group: "女主播" },
  { id: "girls_asian",  tag: "girls/asian",         title: "亚洲人",       group: "女主播" },
  { id: "girls_latin",  tag: "girls/latin",         title: "拉丁人",       group: "女主播" },
  { id: "girls_ebony",  tag: "girls/ebony",         title: "黑珍珠",       group: "女主播" },
  { id: "girls_new",    tag: "girls/new",           title: "最新女主播",   group: "女主播" },
  { id: "girls_all",    tag: "girls",               title: "全部女主播",   group: "女主播" },

  // -- 情侣 --
  { id: "couples_cn",   tag: "couples/chinese",    title: "中国情侣",     group: "情侣" },
  { id: "couples_hot",  tag: "couples/popular",     title: "热门情侣",     group: "情侣" },
  { id: "couples_new",  tag: "couples/new",         title: "最新情侣",     group: "情侣" },
  { id: "couples_all",  tag: "couples",             title: "全部情侣",     group: "情侣" },

  // -- 男主播 --
  { id: "men_hot",      tag: "men/popular",         title: "最受欢迎",     group: "男主播" },
  { id: "men_couple",   tag: "men/gay-couples",     title: "男同伴侣",     group: "男主播" },
  { id: "men_gay",      tag: "men/gays",            title: "男同聊天",     group: "男主播" },
  { id: "men_straight", tag: "men/straight",        title: "直男",         group: "男主播" },
  { id: "men_all",      tag: "men",                 title: "全部男主播",   group: "男主播" },
];

// ============================================================
// 构建 WidgetMetadata
// ============================================================

var _modules = [];
var _tagMap = {};

CATEGORIES.forEach(function(cat) {
  var fnName = "load_" + cat.id;
  _tagMap[fnName] = cat.tag;
  _modules.push({
    id: fnName,
    title: cat.title,
    functionName: fnName,
    cacheDuration: 60,
    params: [
      { name: "page", title: "页码", type: "page" },
    ],
  });
});

_modules.push({
  id: "loadResource",
  title: "加载直播流",
  functionName: "loadResource",
  type: "stream",
  params: [],
});

WidgetMetadata = {
  id: "forward.stripchat",
  title: "Stripchat",
  icon: "https://assets.vvebo.vip/scripts/icon.png",
  version: "5.2.1",
  requiredVersion: "0.0.1",
  description: "Stripchat 直播流模块（多CDN探测 + 画质阶梯 + 广告过滤 + Cookie认证）",
  author: "Forward",
  site: "https://github.com/InchStudio/ForwardWidgets",
  detailCacheDuration: 30,
  globalParams: [
    {
      name: "cookie",
      title: "Cookie",
      type: "input",
      description: "Stripchat Cookie（用于获取最高画质资源）\n获取方法：\n1. 浏览器打开 stripchat.com 并登录\n2. F12 → Network → 任意请求 → Headers\n3. 复制 Cookie 字段的完整值\n4. 粘贴到此处\n留空则使用默认访问权限",
      value: ""
    }
  ],
  modules: _modules,
  search: {
    title: "搜索主播",
    functionName: "search",
    params: [
      { name: "keyword", title: "关键词", type: "input" },
    ],
  },
};

// ============================================================
// 常量
// ============================================================

var API_BASE = "https://go.mavrtracktor.com";
var PAGE_SIZE = 30;
var HEADERS = {
  "User-Agent": "Mozilla/5.0 (Linux; Android 15; 2407FRK8EC Build/AP3A.240617.008; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/128.0.6613.127 Mobile Safari/537.36",
  "Referer": "https://zh.stripchat.global/",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
};

var HLS_HEADERS = {
  "User-Agent": HEADERS["User-Agent"],
  "Referer": "https://stripchat.com/",
  "Accept-Language": "en,zh-CN;q=0.9,zh;q=0.8",
};

// 全局 Cookie（由 globalParams 注入）
var _globalCookie = "";

/**
 * 构建 API 请求头（注入 Cookie）
 */
function _apiHeaders() {
  var h = {};
  for (var k in HEADERS) h[k] = HEADERS[k];
  if (_globalCookie) h["Cookie"] = _globalCookie;
  return h;
}

/**
 * 构建 HLS 请求头（注入 Cookie）
 */
function _hlsHeaders() {
  var h = {};
  for (var k in HLS_HEADERS) h[k] = HLS_HEADERS[k];
  if (_globalCookie) h["Cookie"] = _globalCookie;
  return h;
}

var GENDER_LABELS = {
  "female": "♀️女性",
  "male": "♂️男性",
  "maleFemale": "男女",
  "femaleTranny": "女性变性人",
  "maleTranny": "男性变性人",
  "group": "群体",
  "tranny": "变性人",
  "trannies": "多个变性人",
};

// ============================================================
// API 请求
// ============================================================

async function _fetchModels(tag, page, search) {
  var offset = (page - 1) * PAGE_SIZE;
  var url = API_BASE + "/api/models?tag=" + encodeURIComponent(tag)
    + "&forceClient=1&stripcashR=0&limit=" + PAGE_SIZE
    + "&usePreroll&webp=1&type=popular"
    + "&timezone=Asia/Shanghai&offset=" + offset;

  if (search) {
    url += "&search=" + encodeURIComponent(search);
  }

  var res = await Widget.http.get(url, { headers: _apiHeaders() });
  var data = res.data || {};
  return data.models || [];
}

// ============================================================
// 格式化 VideoItem
// ============================================================

function _formatModel(model) {
  var genderLabel = GENDER_LABELS[model.gender] || model.gender || "";
  var desc = genderLabel + " 👀观众:" + (model.viewersCount || 0);

  return {
    id: "sc_" + model.id,
    type: "url",
    title: model.username || "",
    posterPath: model.snapshotUrl || model.previewUrlThumbBig || "",
    backdropPath: model.snapshotUrl || model.previewUrlThumbBig || "",
    description: desc,
    link: "stripchat:" + model.username + ":" + model.id,
    playerType: "system",
  };
}

// ============================================================
// 分类加载函数
// ============================================================

function _injectCookie(params) {
  _globalCookie = (params && params.cookie) || "";
}

async function load_girls_cn(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/chinese", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_cn] 失败:", error.message || error); throw error; }
}
async function load_girls_jp(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/japanese", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_jp] 失败:", error.message || error); throw error; }
}
async function load_girls_kr(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/korean", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_kr] 失败:", error.message || error); throw error; }
}
async function load_girls_vn(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/vietnamese", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_vn] 失败:", error.message || error); throw error; }
}
async function load_girls_ua(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/ukrainian", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_ua] 失败:", error.message || error); throw error; }
}
async function load_girls_ru(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/russian", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_ru] 失败:", error.message || error); throw error; }
}
async function load_girls_us(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/american", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_us] 失败:", error.message || error); throw error; }
}
async function load_girls_co(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/colombian", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_co] 失败:", error.message || error); throw error; }
}
async function load_girls_de(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/german", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_de] 失败:", error.message || error); throw error; }
}
async function load_girls_fr(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/french", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_fr] 失败:", error.message || error); throw error; }
}
async function load_girls_uk(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/uk-models", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_uk] 失败:", error.message || error); throw error; }
}
async function load_girls_ca(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/canadian", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_ca] 失败:", error.message || error); throw error; }
}
async function load_girls_mx(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/mexican", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_mx] 失败:", error.message || error); throw error; }
}
async function load_girls_in(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/indian", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_in] 失败:", error.message || error); throw error; }
}
async function load_girls_ve(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/venezuelan", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_ve] 失败:", error.message || error); throw error; }
}
async function load_girls_ro(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/romanian", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_ro] 失败:", error.message || error); throw error; }
}
async function load_girls_af(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/african", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_af] 失败:", error.message || error); throw error; }
}
async function load_girls_es(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/spanish-speaking", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_es] 失败:", error.message || error); throw error; }
}
async function load_girls_ar(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/arab", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_ar] 失败:", error.message || error); throw error; }
}
async function load_girls_ke(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/kenyan", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_ke] 失败:", error.message || error); throw error; }
}
async function load_girls_za(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/south-african", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_za] 失败:", error.message || error); throw error; }
}
async function load_girls_br(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/brazilian", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_br] 失败:", error.message || error); throw error; }
}
async function load_girls_th(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/thai", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_th] 失败:", error.message || error); throw error; }
}
async function load_girls_it(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/italian", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_it] 失败:", error.message || error); throw error; }
}
async function load_girls_teens(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/teens", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_teens] 失败:", error.message || error); throw error; }
}
async function load_girls_young(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/young", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_young] 失败:", error.message || error); throw error; }
}
async function load_girls_milfs(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/milfs", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_milfs] 失败:", error.message || error); throw error; }
}
async function load_girls_mature(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/mature", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_mature] 失败:", error.message || error); throw error; }
}
async function load_girls_grannies(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/grannies", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_grannies] 失败:", error.message || error); throw error; }
}
async function load_girls_white(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/white", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_white] 失败:", error.message || error); throw error; }
}
async function load_girls_asian(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/asian", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_asian] 失败:", error.message || error); throw error; }
}
async function load_girls_latin(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/latin", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_latin] 失败:", error.message || error); throw error; }
}
async function load_girls_ebony(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/ebony", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_ebony] 失败:", error.message || error); throw error; }
}
async function load_girls_new(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls/new", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_new] 失败:", error.message || error); throw error; }
}
async function load_girls_all(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("girls", page); return models.map(_formatModel); } catch (error) { console.error("[load_girls_all] 失败:", error.message || error); throw error; }
}

async function load_couples_cn(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("couples/chinese", page); return models.map(_formatModel); } catch (error) { console.error("[load_couples_cn] 失败:", error.message || error); throw error; }
}
async function load_couples_hot(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("couples/popular", page); return models.map(_formatModel); } catch (error) { console.error("[load_couples_hot] 失败:", error.message || error); throw error; }
}
async function load_couples_new(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("couples/new", page); return models.map(_formatModel); } catch (error) { console.error("[load_couples_new] 失败:", error.message || error); throw error; }
}
async function load_couples_all(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("couples", page); return models.map(_formatModel); } catch (error) { console.error("[load_couples_all] 失败:", error.message || error); throw error; }
}

async function load_men_hot(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("men/popular", page); return models.map(_formatModel); } catch (error) { console.error("[load_men_hot] 失败:", error.message || error); throw error; }
}
async function load_men_couple(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("men/gay-couples", page); return models.map(_formatModel); } catch (error) { console.error("[load_men_couple] 失败:", error.message || error); throw error; }
}
async function load_men_gay(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("men/gays", page); return models.map(_formatModel); } catch (error) { console.error("[load_men_gay] 失败:", error.message || error); throw error; }
}
async function load_men_straight(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("men/straight", page); return models.map(_formatModel); } catch (error) { console.error("[load_men_straight] 失败:", error.message || error); throw error; }
}
async function load_men_all(params) {
  try { _injectCookie(params); var page = params.page || 1; var models = await _fetchModels("men", page); return models.map(_formatModel); } catch (error) { console.error("[load_men_all] 失败:", error.message || error); throw error; }
}

// ============================================================
// 详情页
// ============================================================

async function loadDetail(link) {
  try {
    var linkStr = String(link);
    if (linkStr.indexOf("stripchat:") !== 0) return null;

    var linkContent = linkStr.substring("stripchat:".length);
    var parts = linkContent.split(":");
    var username = parts[0];
    var modelId = parts[1] || "";

    var models = await _fetchModels("girls", 1, username);
    var model = null;
    for (var i = 0; i < models.length; i++) {
      if (models[i].username === username) {
        model = models[i];
        break;
      }
    }

    if (!model) {
      return {
        id: "sc_" + (modelId || username),
        type: "url",
        title: username,
        posterPath: "",
        backdropPath: "",
        description: "",
        genreItems: [],
        link: linkStr,
        playerType: "system",
      };
    }

    var genderLabel = GENDER_LABELS[model.gender] || model.gender || "";
    var tags = [];
    if (model.languages && model.languages.length > 0) {
      tags.push({ id: "lang", title: "语言: " + model.languages.join(", ") });
    }
    if (model.broadcastInteractiveToy && model.broadcastInteractiveToy.length > 0) {
      tags.push({ id: "toy", title: "互动玩具: " + model.broadcastInteractiveToy.join(", ") });
    }
    if (model.status) {
      tags.push({ id: "status", title: "状态: " + model.status });
    }

    return {
      id: "sc_" + model.id,
      type: "url",
      title: model.username,
      posterPath: model.snapshotUrl || model.previewUrlThumbBig || "",
      backdropPath: model.previewUrlThumbBig || model.snapshotUrl || "",
      description: genderLabel + " 👀观众:" + (model.viewersCount || 0),
      genreItems: tags,
      link: linkStr,
      playerType: "system",
    };
  } catch (error) {
    console.error("[loadDetail] 失败:", error.message || error);
    return null;
  }
}

// ============================================================
// 直播流解析（基于 sc-resolve.js 优化）
// ==========================================
//
// 核心策略:
// 1. 多CDN master探测 - doppiocdn 列出完整画质阶梯，growcdn master 常仅240p/480p
// 2. growcdn media 画质阶梯 - media/*_1080p.m3u8 和 media/{id}.m3u8 可提供完整源流
// 3. doppiocdn media 常返回广告(#EXT-X-MOUFLON-ADVERT)，需重写至 growcdn
// 4. 逐个探测候选URL，验证是否为真实直播流(非广告/VOD)
// ============================================================

/**
 * 构建多个CDN的master m3u8 URL列表
 * doppiocdn masters 列出完整画质阶梯(含source/1080p)
 * growcdnssedge masters 常仅广告240p/480p，但media可提供完整源流
 */
function _buildMasterUrls(roomId) {
  var id = String(roomId);
  return [
    "https://edge-hls.doppiocdn.org/hls/" + id + "/master/" + id + "_auto.m3u8",
    "https://edge-hls.doppiocdn.com/hls/" + id + "/master/" + id + "_auto.m3u8",
    "https://edge-hls.doppiocdn.org/hls/" + id + "/master/" + id + ".m3u8",
    "https://edge-hls.doppiocdn.com/hls/" + id + "/master/" + id + ".m3u8",
    "https://edge-hls.growcdnssedge.com/hls/" + id + "/master/" + id + "_auto.m3u8",
    "https://edge-hls.growcdnssedge.com/hls/" + id + "/master/" + id + ".m3u8",
  ];
}

/**
 * 将相对URL拼接为绝对URL（不依赖URL构造器）
 */
function _joinUrl(baseUrl, relative) {
  if (!relative) return relative;
  if (relative.indexOf("http://") === 0 || relative.indexOf("https://") === 0) return relative;
  var base = baseUrl.charAt(baseUrl.length - 1) === "/" ? baseUrl : baseUrl + "/";
  return base + relative;
}

/**
 * 解析master m3u8中的变体流
 * 过滤掉 blurred（模糊）变体
 * 返回 [{bandwidth, name, width, height, url}]
 */
function _parseMasterVariants(m3u8Text, baseUrl) {
  var lines = String(m3u8Text || "").split(/\r?\n/);
  var variants = [];
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line.indexOf("#EXT-X-STREAM-INF:") !== 0) continue;

    var bwMatch = line.match(/BANDWIDTH=(\d+)/i);
    var nameMatch = line.match(/NAME="([^"]+)"/i);
    var resMatch = line.match(/RESOLUTION=(\d+)x(\d+)/i);

    var next = i + 1 < lines.length ? lines[i + 1].trim() : "";
    if (!next || next.charAt(0) === "#") continue;

    var name = nameMatch ? nameMatch[1] : "";
    // 跳过模糊变体
    if (/blurred/i.test(name)) continue;

    var width = resMatch ? parseInt(resMatch[1], 10) : 0;
    var height = resMatch ? parseInt(resMatch[2], 10) : 0;

    variants.push({
      bandwidth: bwMatch ? parseInt(bwMatch[1], 10) : 0,
      name: name,
      width: width,
      height: height,
      url: _joinUrl(baseUrl, next),
    });
  }
  return variants;
}

/**
 * 变体评分: 分辨率高度优先，source/orig 视为最高画质，其次带宽
 */
function _variantScore(v) {
  var h = Number(v.height) || 0;
  if (!h && v.name) {
    var m = String(v.name).match(/(\d+)\s*p/i);
    if (m) h = parseInt(m[1], 10);
  }
  // source/orig/original 是全分辨率编码
  if (/^(source|orig|original)$/i.test(String(v.name || "").trim())) {
    h = Math.max(h, 2160);
  }
  var bw = Number(v.bandwidth) || 0;
  return h * 1000000000 + bw;
}

/**
 * 将 doppiocdn media URL 重写为 growcdnssedge media URL
 * doppiocdn media 常返回广告，growcdnssedge media 是可播放的画质阶梯
 */
function _toGrowMediaUrl(input) {
  if (!input) return null;
  var s = String(input).trim();
  s = s.replace(
    /https?:\/\/media-hls\.doppiocdn\.(?:org|com|net)\/b-hls-\d+\//i,
    "https://media-hls.growcdnssedge.com/b-hls-10/"
  );
  return s;
}

/**
 * growcdn media 画质后缀列表
 * 无后缀(bare)通常是真正的源流 H.264 1080p
 * _1080p 可能是 AV1 编码
 * 优先 bare/source 以兼容 ffmpeg remux
 */
var GROW_MEDIA_SUFFIXES = [
  "",          // source / best h264
  "_source",
  "_orig",
  "_1600p",
  "_1080p",
  "_720p",
  "_480p",
  "_360p",
  "_240p",
  "_160p",
];

/**
 * 构建 growcdn media 候选URL列表
 * 1. 先按画质阶梯探测（masters常遗漏720p/1080p）
 * 2. 再加入master中列出的变体URL（重写至growcdn）
 */
function _buildGrowMediaCandidates(roomId, masterVariants) {
  var id = String(roomId);
  var base = "https://media-hls.growcdnssedge.com/b-hls-10/" + id + "/" + id;
  var out = [];
  var seen = {};

  function push(u) {
    if (!u || seen[u]) return;
    seen[u] = true;
    out.push(u);
  }

  // 1) 画质阶梯探测
  for (var i = 0; i < GROW_MEDIA_SUFFIXES.length; i++) {
    push(base + GROW_MEDIA_SUFFIXES[i] + ".m3u8");
  }

  // 2) master变体重写至growcdn
  var ranked = masterVariants.slice().sort(function(a, b) {
    return _variantScore(b) - _variantScore(a);
  });
  for (var j = 0; j < ranked.length; j++) {
    var grow = _toGrowMediaUrl(ranked[j].url);
    if (grow && /media-hls\.growcdnssedge\.com/i.test(grow)) push(grow);
  }

  return out;
}

/**
 * 验证URL是否为真实直播media playlist
 * 过滤广告(#EXT-X-MOUFLON-ADVERT / cpa/v2/)、VOD、无媒体段的空playlist
 */
async function _isLiveMediaPlaylist(url) {
  try {
    var res = await Widget.http.get(url, { headers: _hlsHeaders() });
    var text = res.data || "";
    if (!text) return false;

    // 广告流
    if (/#EXT-X-MOUFLON-ADVERT|cpa\/v2\//i.test(text)) return false;
    // VOD（录播）
    if (/#EXT-X-PLAYLIST-TYPE:\s*VOD/i.test(text)) return false;
    // 需要有真实媒体段
    if (!/#EXTINF/i.test(text)) return false;

    return true;
  } catch (e) {
    return false;
  }
}

/**
 * 解析master m3u8并提取Mouflon pkey
 */
function _extractMouflonPkey(m3u8Doc) {
  var pkey = "";
  var needle = "#EXT-X-MOUFLON:PSCH:v2:";
  var idx = 0;
  while (true) {
    idx = m3u8Doc.indexOf(needle, idx);
    if (idx === -1) break;
    var lineEnd = m3u8Doc.indexOf("\n", idx);
    var end = lineEnd === -1 ? m3u8Doc.length : lineEnd;
    var line = m3u8Doc.substring(idx, end).trim();
    var pkeyStart = line.lastIndexOf(":");
    if (pkeyStart !== -1) {
      pkey = line.substring(pkeyStart + 1);
      break;
    }
    idx += needle.length;
  }
  return pkey;
}

/**
 * 从master变体构建可播放流列表（附加pkey参数）
 * 返回 Forward ResourceItem 格式
 */
function _buildStreamFromVariants(variants, pkey) {
  var streams = [];
  var seen = {};

  // 按评分降序排列
  var ranked = variants.slice().sort(function(a, b) {
    return _variantScore(b) - _variantScore(a);
  });

  for (var i = 0; i < ranked.length; i++) {
    var v = ranked[i];
    var segUrl = v.url;

    // 重写至growcdn（doppiocdn media常含广告）
    var growUrl = _toGrowMediaUrl(segUrl);
    if (growUrl) segUrl = growUrl;

    // 附加pkey
    if (pkey && segUrl.indexOf("pkey=") === -1) {
      var sep = segUrl.indexOf("?") !== -1 ? "&" : "?";
      segUrl += sep + "playlistType=lowLatency&psch=v2&pkey=" + pkey;
    } else if (pkey === "" && segUrl.indexOf("playlistType") === -1) {
      segUrl += (segUrl.indexOf("?") !== -1 ? "&" : "?") + "playlistType=lowLatency";
    }

    // 去重
    if (seen[segUrl]) continue;
    seen[segUrl] = true;

    // 构建标签
    var label = v.name || "";
    var resLabel = "";
    if (v.width && v.height) {
      resLabel = v.height + "p";
    }
    if (label && resLabel) {
      label = label + " (" + resLabel + ")";
    } else if (resLabel) {
      label = resLabel;
    } else if (label) {
      // 保留name
    } else if (v.bandwidth > 1000000) {
      label = Math.round(v.bandwidth / 1000) + "kbps";
    } else {
      label = "流畅";
    }

    streams.push({
      name: label + " 直播流",
      description: "HLS 直播流",
      url: segUrl,
      bandwidth: v.bandwidth,
      resolution: (v.width && v.height) ? (v.width + "x" + v.height) : "",
    });
  }

  return streams;
}

/**
 * 核心解析函数: 多CDN探测 + 画质阶梯 + 广告过滤
 *
 * 流程:
 * 1. 并行请求所有CDN的master m3u8，收集变体信息
 * 2. 提取Mouflon pkey
 * 3. 构建growcdn media候选URL（画质阶梯 + master变体重写）
 * 4. 逐个探测候选URL，找到第一个真实直播流
 * 5. 返回所有可用流（master变体 + 验证通过的media URL）
 */
async function _resolveMasterStreams(modelId) {
  var id = String(modelId);
  var allVariants = [];
  var pkey = "";
  var masterUrls = _buildMasterUrls(id);

  // Step 1: 并行请求所有CDN master
  for (var mi = 0; mi < masterUrls.length; mi++) {
    try {
      var res = await Widget.http.get(masterUrls[mi], { headers: _hlsHeaders() });
      var m3u8Doc = res.data || "";
      if (!m3u8Doc) continue;

      // 提取pkey（只需找到一个即可）
      if (!pkey) {
        pkey = _extractMouflonPkey(m3u8Doc);
      }

      // 解析变体
      var baseUrl = masterUrls[mi].replace(/\/[^/]*$/, "/");
      var variants = _parseMasterVariants(m3u8Doc, baseUrl);
      for (var vi = 0; vi < variants.length; vi++) {
        allVariants.push(variants[vi]);
      }
    } catch (e) {
      // 尝试下一个CDN
    }
  }

  // Step 2: 从master变体构建流列表
  var streams = [];
  if (allVariants.length > 0) {
    streams = _buildStreamFromVariants(allVariants, pkey);
  }

  // Step 3: 探测growcdn media画质阶梯（可能发现master未列出的更高质量流）
  var mediaCandidates = _buildGrowMediaCandidates(id, allVariants);
  var verifiedMediaUrl = null;
  var verifiedMediaSuffix = "";

  for (var ci = 0; ci < mediaCandidates.length; ci++) {
    var candidateUrl = mediaCandidates[ci];
    // 附加pkey
    var probeUrl = candidateUrl;
    if (pkey && probeUrl.indexOf("pkey=") === -1) {
      probeUrl += (probeUrl.indexOf("?") !== -1 ? "&" : "?") + "playlistType=lowLatency&psch=v2&pkey=" + pkey;
    }

    if (await _isLiveMediaPlaylist(probeUrl)) {
      verifiedMediaUrl = probeUrl;
      // 从URL提取画质标签
      var suffixMatch = candidateUrl.match(/_([^/]+?)\.m3u8/);
      verifiedMediaSuffix = suffixMatch ? suffixMatch[1] : "source";
      break;
    }
  }

  // Step 4: 如果media探测成功，将其作为最高优先流插入
  if (verifiedMediaUrl) {
    var mediaLabel = "";
    switch (verifiedMediaSuffix) {
      case "": case "source": case "orig": case "original":
        mediaLabel = "原画源流";
        break;
      case "1600p": mediaLabel = "1600p"; break;
      case "1080p": mediaLabel = "1080p"; break;
      case "720p": mediaLabel = "720p"; break;
      case "480p": mediaLabel = "480p"; break;
      case "360p": mediaLabel = "360p"; break;
      case "240p": mediaLabel = "240p"; break;
      case "160p": mediaLabel = "160p"; break;
      default: mediaLabel = verifiedMediaSuffix;
    }

    // 检查是否已有相同URL
    var alreadyExists = false;
    for (var si = 0; si < streams.length; si++) {
      if (streams[si].url === verifiedMediaUrl) {
        alreadyExists = true;
        break;
      }
    }

    if (!alreadyExists) {
      streams.unshift({
        name: mediaLabel + " 直播流 (已验证)",
        description: "HLS 直播流 - growcdn media 验证通过",
        url: verifiedMediaUrl,
        bandwidth: 0,
        resolution: "",
      });
    }
  }

  return streams;
}

// ============================================================
// 加载直播流资源
// ============================================================

async function loadResource(params) {
  try {
    // 注入全局 Cookie
    _injectCookie(params);

    var modelId = "";
    var username = "";
    var linkStr = params.link || "";

    if (linkStr.indexOf("stripchat:") === 0) {
      var linkContent = linkStr.substring("stripchat:".length);
      var parts = linkContent.split(":");
      username = parts[0];
      if (parts.length >= 2) {
        modelId = parts[parts.length - 1];
      }
    }

    if (!modelId) return [];

    console.log("[loadResource] 解析直播流: " + username + " (ID: " + modelId + ")");

    // Step 1: 多CDN探测 + 画质阶梯 + 广告过滤
    var resources = await _resolveMasterStreams(modelId);

    if (resources.length > 0) {
      // 按带宽降序排列（已验证的media流已在最前）
      resources.sort(function(a, b) {
        // "已验证"标记的流优先
        var aVerified = a.name && a.name.indexOf("已验证") !== -1 ? 1 : 0;
        var bVerified = b.name && b.name.indexOf("已验证") !== -1 ? 1 : 0;
        if (aVerified !== bVerified) return bVerified - aVerified;
        return (b.bandwidth || 0) - (a.bandwidth || 0);
      });
      console.log("[loadResource] 找到 " + resources.length + " 个流");
      return resources;
    }

    // Step 2: fallback - 通过API获取流地址
    try {
      console.log("[loadResource] master探测失败，尝试API fallback");
      var models = await _fetchModels("girls", 1, username);
      var model = null;
      for (var i = 0; i < models.length; i++) {
        if (String(models[i].id) === String(modelId)) {
          model = models[i];
          break;
        }
      }

      if (model && model.stream && model.stream.urls) {
        var urls = model.stream.urls;
        var qualityNames = {
          "original": "原画", "1080p": "1080p", "720p": "720p",
          "480p": "480p", "240p": "240p",
        };
        var added = {};
        for (var quality in urls) {
          if (added[urls[quality]]) continue;
          added[urls[quality]] = true;
          var url = urls[quality];
          // 重写至growcdn
          var growUrl = _toGrowMediaUrl(url);
          if (growUrl) url = growUrl;
          if (url.indexOf("playlistType") === -1) {
            url += (url.indexOf("?") !== -1 ? "&" : "?") + "playlistType=lowLatency";
          }
          resources.push({
            name: (qualityNames[quality] || quality) + " 直播流",
            description: "HLS 直播流 (API)",
            url: url,
          });
        }
      }
    } catch (e) {
      console.error("[loadResource] API fallback 失败:", e.message || e);
    }

    // Step 3: 最终fallback - 直接构建growcdn URL
    if (resources.length === 0) {
      console.log("[loadResource] 所有探测失败，使用默认growcdn URL");
      var cdnBase = "https://edge-hls.growcdnssedge.com/hls/" + modelId + "/master/";
      resources.push({ name: "自动画质 直播流", description: "HLS 直播流", url: cdnBase + modelId + "_auto.m3u8?playlistType=lowLatency" });
      resources.push({ name: "原画 直播流", description: "HLS 直播流", url: cdnBase + modelId + ".m3u8?playlistType=lowLatency" });
    }

    return resources;
  } catch (error) {
    console.error("[loadResource] 失败:", error.message || error);
    return [];
  }
}

// ============================================================
// 搜索
// ============================================================

async function search(params) {
  try {
    _injectCookie(params);
    var keyword = params.keyword || "";
    if (!keyword) return [];

    var models = await _fetchModels("girls", 1, keyword);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[search] 失败:", error.message || error);
    throw error;
  }
}
