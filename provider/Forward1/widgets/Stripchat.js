/**
 * Stripchat 直播模块 (v4 - 完整分类版)
 * ==========================================
 * 模仿 xbpq 配置，通过 go.mavrtracktor.com API 代理获取数据。
 * 完整分类体系：按地区、类型细分。
 *
 * 数据来源:
 *   - API 代理: go.mavrtracktor.com/api/models
 *   - CDN: edge-hls.growcdnssedge.com / media-hls.growcdnssedge.com
 *   - 发布页: zh.stripchat.global
 */

// ============================================================
// 分类定义（来自 xbpq 配置）
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
// 构建 WidgetMetadata（动态生成模块列表）
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
  version: "4.0.0",
  requiredVersion: "0.0.1",
  description: "Stripchat 直播流模块（完整分类）",
  author: "F",
  site: "https://github.com/InchStudio/ForwardWidgets",
  detailCacheDuration: 30,
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
  "Cookie": "__cf_bm=oNTPk44OY3qgxxupLX.qfzpksNyJxa8ANhlbWGFiu_g-1781217379.7708697-1.0.1.1-6T3wN.r6EGesDbtNOtMlC_vNQjzlqPOOxirqUcpgxvwMPSyfy.5MMElKxzcmtFwxBNsURO_gPGHZNQQ_rbPyDUitzG4TLmeI2yRp6SU2J0aKTtJs9D1kzRlOXLyGDaEsx0Snr_dwjXt6Urffv07zJQ; stripchat_cam_sessionId=dc9c8d91167c8e9299024b259febe9ea551c062bc4322158e483914d3d1d; stripchat_cam_sessionRemember=1; sCashGuestId=2dd513896ae917617f6c8062668ede8fc18731a3e03c875c27ad43933d2946f9; localeDomain=zh; alreadyVisited=1; isVisitorsAgreementAccepted=1; _vid_t=6IoH8As9yO8UnIyR72qfLL0bnajipRRR9cZr+iDPcAw1v3iqJgy+jaVUWxCYwuzoihJnbLRFPsPyyA==; moe_uuid=b6e0eac4-6b8b-493b-8762-5bc8b7124b0c",
};

// 性别标签映射
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

  var res = await Widget.http.get(url, { headers: HEADERS });
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
// 分类加载函数（44 个显式声明）
// ============================================================

async function load_girls_cn(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/chinese", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_cn] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_jp(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/japanese", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_jp] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_kr(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/korean", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_kr] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_vn(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/vietnamese", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_vn] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_ua(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/ukrainian", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_ua] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_ru(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/russian", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_ru] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_us(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/american", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_us] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_co(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/colombian", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_co] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_de(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/german", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_de] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_fr(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/french", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_fr] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_uk(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/uk-models", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_uk] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_ca(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/canadian", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_ca] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_mx(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/mexican", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_mx] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_in(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/indian", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_in] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_ve(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/venezuelan", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_ve] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_ro(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/romanian", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_ro] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_af(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/african", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_af] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_es(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/spanish-speaking", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_es] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_ar(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/arab", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_ar] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_ke(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/kenyan", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_ke] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_za(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/south-african", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_za] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_br(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/brazilian", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_br] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_th(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/thai", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_th] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_it(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/italian", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_it] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_teens(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/teens", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_teens] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_young(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/young", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_young] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_milfs(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/milfs", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_milfs] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_mature(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/mature", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_mature] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_grannies(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/grannies", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_grannies] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_white(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/white", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_white] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_asian(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/asian", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_asian] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_latin(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/latin", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_latin] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_ebony(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/ebony", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_ebony] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_new(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls/new", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_new] 失败:", error.message || error);
    throw error;
  }
}

async function load_girls_all(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("girls", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_girls_all] 失败:", error.message || error);
    throw error;
  }
}

async function load_couples_cn(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("couples/chinese", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_couples_cn] 失败:", error.message || error);
    throw error;
  }
}

async function load_couples_hot(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("couples/popular", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_couples_hot] 失败:", error.message || error);
    throw error;
  }
}

async function load_couples_new(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("couples/new", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_couples_new] 失败:", error.message || error);
    throw error;
  }
}

async function load_couples_all(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("couples", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_couples_all] 失败:", error.message || error);
    throw error;
  }
}

async function load_men_hot(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("men/popular", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_men_hot] 失败:", error.message || error);
    throw error;
  }
}

async function load_men_couple(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("men/gay-couples", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_men_couple] 失败:", error.message || error);
    throw error;
  }
}

async function load_men_gay(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("men/gays", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_men_gay] 失败:", error.message || error);
    throw error;
  }
}

async function load_men_straight(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("men/straight", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_men_straight] 失败:", error.message || error);
    throw error;
  }
}

async function load_men_all(params) {
  try {
    var page = params.page || 1;
    var models = await _fetchModels("men", page);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[load_men_all] 失败:", error.message || error);
    throw error;
  }
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
// 流 URL 解析（master m3u8）
// ============================================================

async function _resolveMasterStreams(modelId) {
  var masterUrl = "https://edge-hls.growcdnssedge.com/hls/" + modelId + "/master/" + modelId + "_auto.m3u8";

  try {
    var res = await Widget.http.get(masterUrl, { headers: HEADERS });
    var m3u8Doc = res.data || "";

    // 提取 Mouflon pkey
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

    // 解析变体
    var streams = [];
    var lines = m3u8Doc.split("\n");
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (line.indexOf("#EXT-X-STREAM-INF:") === 0) {
        var bwMatch = line.match(/BANDWIDTH=(\d+)/);
        var resMatch = line.match(/RESOLUTION=(\d+x\d+)/);
        var nameMatch = line.match(/NAME="([^"]+)"/);
        var bandwidth = bwMatch ? parseInt(bwMatch[1], 10) : 0;
        var resolution = resMatch ? resMatch[1] : "";
        var qualityName = nameMatch ? nameMatch[1] : "";

        if (i + 1 < lines.length && lines[i + 1].trim().charAt(0) !== "#") {
          var segUrl = lines[i + 1].trim();

          if (pkey) {
            var sep = segUrl.indexOf("?") !== -1 ? "&" : "?";
            segUrl += sep + "playlistType=lowLatency&psch=v2&pkey=" + pkey;
          }

          var label = qualityName || resolution || (bandwidth > 1000000 ? Math.round(bandwidth / 1000) + "kbps" : "流畅");
          if (resolution && qualityName) {
            label = qualityName + " (" + resolution.replace("x", "p ") + ")";
          } else if (resolution) {
            label = resolution.replace("x", "p ");
          }

          streams.push({
            name: label + " 直播流",
            description: "HLS 直播流",
            url: segUrl,
            bandwidth: bandwidth,
            resolution: resolution,
          });
        }
      }
    }

    return streams;
  } catch (e) {
    console.error("[_resolveMasterStreams] 失败:", e.message || e);
    return [];
  }
}

async function loadResource(params) {
  try {
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

    // 优先通过 master m3u8 获取真实画质
    var resources = await _resolveMasterStreams(modelId);

    if (resources.length > 0) {
      resources.sort(function(a, b) { return (b.bandwidth || 0) - (a.bandwidth || 0); });
      return resources;
    }

    // fallback: API
    try {
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
          "original": "原画", "1080p": "1080p", "720p": "720p", "480p": "480p", "240p": "240p",
        };
        var added = {};
        for (var quality in urls) {
          if (added[urls[quality]]) continue;
          added[urls[quality]] = true;
          var url = urls[quality];
          if (url.indexOf("playlistType") === -1) url += "?playlistType=lowLatency";
          resources.push({
            name: (qualityNames[quality] || quality) + " 直播流",
            description: "HLS 直播流",
            url: url,
          });
        }
      }
    } catch (e) {}

    // 最终 fallback
    if (resources.length === 0) {
      var cdnBase = "https://edge-hls.growcdnssedge.com/hls/" + modelId + "/master/";
      resources.push({ name: "自动画质 直播流", description: "HLS 直播流", url: cdnBase + modelId + "_auto.m3u8?playlistType=lowLatency" });
      resources.push({ name: "480p 直播流", description: "HLS 直播流", url: cdnBase + modelId + "_480p.m3u8?playlistType=lowLatency" });
      resources.push({ name: "240p 直播流", description: "HLS 直播流", url: cdnBase + modelId + "_240p.m3u8?playlistType=lowLatency" });
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
    var keyword = params.keyword || "";
    if (!keyword) return [];

    var models = await _fetchModels("girls", 1, keyword);
    return models.map(_formatModel);
  } catch (error) {
    console.error("[search] 失败:", error.message || error);
    throw error;
  }
}
