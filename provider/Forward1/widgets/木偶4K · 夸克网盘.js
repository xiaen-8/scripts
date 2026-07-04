WidgetMetadata = {
  id: "forward.muou.quark",
  title: "木偶4K · 夸克网盘",
  version: "1.2.2",
  requiredVersion: "0.0.1",
  description: "Forward 专用按需加载版：采集木偶站列表/搜索/详情，仅解析夸克网盘；Cookie 持久化，episodeItems 仅提供剧集列表元信息，单集播放资源通过 loadResource(stream) 按需加载。",
  author: "Operit",
  site: "https://www.muou.site",
  detailCacheDuration: 0,
  globalParams: [
    {
      name: "site",
      title: "站点",
      type: "enumeration",
      value: "https://www.muou.site",
      enumOptions: [
        { title: "木偶主站", value: "https://www.muou.site" },
        { title: "木偶亚洲", value: "https://www.muou.asia" },
        { title: "线路 123", value: "https://123.666291.xyz" },
        { title: "线路 666", value: "https://666.666291.xyz" }
      ]
    },
    {
      name: "quarkCookie",
      title: "夸克 Cookie",
      type: "input",
      placeholders: [
        { title: "填入完整 Cookie，必须包含有效登录态", value: "" }
      ]
    },
    {
      name: "preloadCount",
      title: "详情页预取播放数量",
      type: "enumeration",
      value: "3",
      enumOptions: [
        { title: "1 个", value: "1" },
        { title: "2 个", value: "2" },
        { title: "3 个", value: "3" },
        { title: "5 个", value: "5" },
        { title: "10 个", value: "10" },
        { title: "全部", value: "0" }
      ]
    }
  ],
  modules: [
    {
      id: "movies",
      title: "电影",
      functionName: "loadCategory",
      cacheDuration: 600,
      params: [
        { name: "categoryId", title: "分类", type: "constant", value: "1" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "tv",
      title: "剧集",
      functionName: "loadCategory",
      cacheDuration: 600,
      params: [
        { name: "categoryId", title: "分类", type: "constant", value: "2" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "anime",
      title: "动漫",
      functionName: "loadCategory",
      cacheDuration: 600,
      params: [
        { name: "categoryId", title: "分类", type: "constant", value: "3" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "variety",
      title: "综艺",
      functionName: "loadCategory",
      cacheDuration: 600,
      params: [
        { name: "categoryId", title: "分类", type: "constant", value: "29" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "documentary",
      title: "纪录片",
      functionName: "loadCategory",
      cacheDuration: 600,
      params: [
        { name: "categoryId", title: "分类", type: "constant", value: "4" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadResource",
      title: "加载资源",
      functionName: "loadResource",
      type: "stream",
      params: []
    }
  ],
  search: {
    title: "搜索",
    functionName: "search",
    params: [
      { name: "keyword", title: "关键词", type: "input" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const CACHE_FOLDER = "ftv-cache";
const STORAGE_COOKIE_KEY = "forward.muou.quark.cookie";
const STORAGE_SITE_KEY = "forward.muou.quark.site";
const STORAGE_PRELOAD_KEY = "forward.muou.quark.preloadCount";
let CURRENT_COOKIE = "";

function getSite(params) {
  const incoming = params && params.site ? String(params.site).trim() : "";
  if (incoming) {
    safeStorageSet(STORAGE_SITE_KEY, incoming);
    return incoming.replace(/\/$/, "");
  }
  const saved = safeStorageGet(STORAGE_SITE_KEY);
  return String(saved || "https://www.muou.site").replace(/\/$/, "");
}

function safeStorageGet(key) {
  try {
    return Widget && Widget.storage && Widget.storage.get ? Widget.storage.get(key) : "";
  } catch (e) {
    console.log("[Storage] get failed:", key, e.message || e);
    return "";
  }
}

function safeStorageSet(key, value) {
  try {
    if (Widget && Widget.storage && Widget.storage.set) Widget.storage.set(key, value);
  } catch (e) {
    console.log("[Storage] set failed:", key, e.message || e);
  }
}

function normalizeCookie(cookie) {
  return String(cookie || "").trim();
}

function ensureCookie(cookie) {
  const incoming = normalizeCookie(cookie);
  if (incoming) {
    CURRENT_COOKIE = incoming;
    safeStorageSet(STORAGE_COOKIE_KEY, incoming);
    return CURRENT_COOKIE;
  }
  if (CURRENT_COOKIE) return CURRENT_COOKIE;
  CURRENT_COOKIE = normalizeCookie(safeStorageGet(STORAGE_COOKIE_KEY));
  return CURRENT_COOKIE;
}

function getPreloadCount(params) {
  const incoming = params && params.preloadCount !== undefined ? Number(params.preloadCount) : NaN;
  if (!Number.isNaN(incoming)) {
    const n = Math.max(0, Math.floor(incoming));
    safeStorageSet(STORAGE_PRELOAD_KEY, String(n));
    return n;
  }
  const saved = Number(safeStorageGet(STORAGE_PRELOAD_KEY));
  if (!Number.isNaN(saved)) return Math.max(0, Math.floor(saved));
  return 3;
}

function bindForwardParams(params = {}) {
  getSite(params);
  getPreloadCount(params);
  const ck = params.quarkCookie || params.cookie || params.quarkck || "";
  ensureCookie(ck);
}

function toQuery(obj) {
  return Object.keys(obj || {}).map(k => k + "=" + encodeURIComponent(obj[k])).join("&");
}

function absUrl(url, site) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("//")) return "https:" + url;
  if (url.startsWith("/")) return site + url;
  return site + "/" + url;
}

function pickText($, el, selector) {
  return $(el).find(selector).text().trim();
}

function idFromHref(href) {
  const s = String(href || "");
  const m = s.match(/\/detail\/id\/(\d+)\.html/) || s.match(/\/vod\/detail\/id\/(\d+)\.html/) || s.match(/id\/(\d+)/);
  return m ? m[1] : s;
}

function encodeLink(obj) {
  return "muou:" + encodeURIComponent(JSON.stringify(obj));
}

function decodeLink(link) {
  const raw = String(link || "");
  if (!raw.startsWith("muou:")) return null;
  try { return JSON.parse(decodeURIComponent(raw.slice(5))); } catch (_) { return null; }
}

async function httpText(url, options) {
  const res = await Widget.http.get(url, options || {});
  return typeof res.data === "string" ? res.data : JSON.stringify(res.data || "");
}

async function httpJson(method, url, data, headers) {
  const baseHeaders = headers || quarkHeaders();
  let res;
  if (method === "POST") {
    res = await Widget.http.post(url, JSON.stringify(data || {}), {
      headers: Object.assign({}, baseHeaders, { "Content-Type": "application/json" })
    });
  } else {
    res = await Widget.http.get(url, { headers: baseHeaders });
  }
  return typeof res.data === "string" ? JSON.parse(res.data) : res.data;
}

function quarkHeaders(cookie) {
  const ck = ensureCookie(cookie);
  return {
    "User-Agent": UA,
    "Cookie": ck,
    "Referer": "https://pan.quark.cn/"
  };
}

function playHeaders() {
  return { "User-Agent": UA, "Cookie": CURRENT_COOKIE };
}

async function loadCategory(params = {}) {
  bindForwardParams(params);
  const site = getSite(params);
  const page = Number(params.page || 1);
  const tid = String(params.categoryId || "1");
  const url = `${site}/index.php/vod/show/id/${tid}/page/${page}.html`;
  const html = await httpText(url);
  const $ = Widget.html.load(html);
  const list = [];

  $(".module-item").each((i, el) => {
    const a = $(el).find(".module-item-title");
    const href = a.attr("href") || "";
    const title = a.attr("title") || a.text().trim();
    const poster = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
    const remark = pickText($, el, ".module-item-text");
    const id = idFromHref(href);
    if (id && title) {
      list.push({
        id: `muou-${id}`,
        type: "url",
        title,
        posterPath: absUrl(poster, site),
        description: remark,
        link: encodeLink({ action: "detail", id, site })
      });
    }
  });
  return list;
}

async function search(params = {}) {
  bindForwardParams(params);
  const keyword = String(params.keyword || "").trim();
  if (!keyword) return [];
  const site = getSite(params);
  const url = `${site}/index.php/vod/search.html?wd=${encodeURIComponent(keyword)}`;
  const html = await httpText(url);
  const $ = Widget.html.load(html);
  const list = [];

  $(".module-search-item").each((i, el) => {
    const a = $(el).find("h3 a");
    const href = a.attr("href") || "";
    const title = a.text().trim() || $(el).find(".module-item-pic img").attr("alt") || "";
    const poster = $(el).find(".module-item-pic img").attr("data-src") || $(el).find(".module-item-pic img").attr("src") || "";
    const remark = pickText($, el, ".video-serial").replace("fuck you", "").trim();
    const id = idFromHref(href);
    if (id && title) {
      list.push({
        id: `muou-${id}`,
        type: "url",
        title,
        posterPath: absUrl(poster, site),
        description: remark,
        link: encodeLink({ action: "detail", id, site })
      });
    }
  });
  return list;
}

async function loadDetail(link) {
  ensureCookie();
  const info = decodeLink(link);
  if (!info) return null;
  return await buildDetailItem(info);
}

async function buildDetailItem(info) {
  const site = String(info.site || "https://www.muou.site").replace(/\/$/, "");
  const tid = String(info.id || "");
  const html = await httpText(`${site}/index.php/vod/detail/id/${tid}.html`);
  const $ = Widget.html.load(html);
  const title = $(".page-title").text().trim() || `木偶-${tid}`;
  const poster = $(".video-cover img").attr("data-src") || $(".video-cover img").attr("src") || "";
  const desc = $(".video-info-item.video-info-content .sqjj_a").text().trim().replace(/\[收起部分\]/g, "");

  const quarkLinks = [];
  $(".module-row-one p, .module-row-one a, a").each((i, el) => {
    const text = ($(el).attr("href") || "") + " " + $(el).text();
    const matches = text.match(/https?:\/\/pan\.quark\.cn\/s\/[A-Za-z0-9]+/g) || [];
    matches.forEach(u => { if (!quarkLinks.includes(u)) quarkLinks.push(u); });
  });

  const episodeItems = [];
  for (let i = 0; i < quarkLinks.length; i++) {
    const shareLink = quarkLinks[i];
    const detail = await getVideosFromShareLink(shareLink);
    const videos = (detail && detail.list) || [];
    videos.forEach((v, idx) => {
      const epTitle = formatVideoName(v.file_name, v.size) || `视频 ${idx + 1}`;
      episodeItems.push({
        id: `quark-${v.fid}`,
        type: "url",
        title: epTitle,
        description: quarkLinks.length > 1 ? `夸克网盘#${i + 1}` : "夸克网盘",
        link: encodeLink({ action: "play", videoInfo: v, title: epTitle })
      });
    });
  }

  return {
    id: `muou-${tid}`,
    type: "url",
    title,
    posterPath: absUrl(poster, site),
    description: desc || (quarkLinks.length ? `已发现 ${quarkLinks.length} 个夸克分享链接` : "未发现夸克分享链接"),
    episodeItems,
    link: encodeLink({ action: "detail", id: tid, site })
  };
}

async function loadResource(params) {
  const link = params && params.link;
  if (!link) return [];
  const info = decodeLink(link);
  if (!info || info.action !== "play") return [];
  const videoInfo = info.videoInfo || {};
  try {
    const fid = await saveShareFile(videoInfo);
    if (!fid) throw new Error("转存失败");
    const urls = await getPlayUrl(fid);
    const best = urls.find(v => v.resolution === "4k") || urls.find(v => v.resolution === "2k") || urls[0];
    if (best && best.url) {
      return [{
        name: info.title || "夸克视频",
        description: best.resolution ? `清晰度: ${best.resolution}` : "",
        url: best.url
      }];
    }
  } catch (e) {
    console.error("[Quark] loadResource 获取播放直链失败:", e.message || e);
  }
  return [{
    name: info.title || "夸克视频",
    description: "获取播放直链失败，请检查 Cookie",
    url: ""
  }];
}

async function getStoken(shareId, passcode) {
  const url = "https://drive-h.quark.cn/1/clouddrive/share/sharepage/token?pr=ucpro&fr=pc&uc_param_str=";
  const json = await httpJson("POST", url, { pwd_id: shareId, passcode: passcode || "" }, quarkHeaders());
  return json && json.status === 200 && json.data ? json.data.stoken : "";
}

async function getShareDetail(shareId, stoken) {
  const back = { movieName: "", list: [] };
  const folderQueue = ["0"];
  while (folderQueue.length > 0) {
    const pdir = folderQueue.shift();
    const params = {
      pr: "ucpro", fr: "pc", uc_param_str: "", ver: "2",
      pwd_id: shareId, stoken, pdir_fid: pdir,
      force: "0", _page: "1", _size: "200", _sort: "file_type:asc,file_name:asc"
    };
    const url = `https://drive-h.quark.cn/1/clouddrive/share/sharepage/detail?${toQuery(params)}`;
    const json = await httpJson("GET", url, null, quarkHeaders());
    const items = (json && json.data && json.data.list) || [];
    for (const item of items) {
      if (item.dir) {
        back.movieName = item.file_name || back.movieName;
        folderQueue.push(item.fid);
      } else if (String(item.file_type || "").includes("video") || item.obj_category === "video") {
        back.list.push({
          fid: item.fid,
          file_name: item.file_name,
          pdir_fid: item.pdir_fid,
          size: item.size,
          share_fid_token: item.share_fid_token || "",
          video_max_resolution: item.video_max_resolution || "",
          dir: false,
          file: true,
          shareId,
          stoken
        });
      }
    }
  }
  if (!back.movieName && back.list[0]) back.movieName = String(back.list[0].file_name || "").replace(/\.(mp4|mkv|flv|avi|mov|m3u8)$/i, "");
  return back;
}

async function getVideosFromShareLink(shareLink) {
  const match = String(shareLink || "").match(/\/s\/([a-zA-Z0-9]+)/);
  const shareId = match ? match[1] : "";
  if (!shareId) return { movieName: "", list: [] };
  const stoken = await getStoken(shareId, "");
  if (!stoken) return { movieName: "", list: [] };
  return await getShareDetail(shareId, stoken);
}

// ==================== 夸克网盘缓存文件夹管理 ====================

// 检查缓存文件夹是否存在，返回 fid
async function checkFolderExists(folderName) {
  const url = "https://drive-pc.quark.cn/1/clouddrive/file/sort?pr=ucpro&fr=pc&uc_param_str=&pdir_fid=0&_page=1&_size=50&_fetch_total=1&_fetch_sub_dirs=0&_sort=file_type:asc,updated_at:desc&fetch_all_file=1&fetch_risk_file_name=1";
  const json = await httpJson("GET", url, null, quarkHeaders());
  const list = (json && json.data && json.data.list) || [];
  const folder = list.find(x => x.dir && x.file_name === folderName);
  return folder ? folder.fid : "";
}

// 删除文件/文件夹列表
async function deleteFiles(filelist) {
  if (!Array.isArray(filelist) || filelist.length === 0) return false;
  const url = "https://drive-pc.quark.cn/1/clouddrive/file/delete?pr=ucpro&fr=pc&uc_param_str=";
  try {
    const json = await httpJson("POST", url, { action_type: 2, filelist: filelist, exclude_fids: [] }, quarkHeaders());
    if (json && json.status === 200 && json.code === 0) {
      console.log(`[QuarkAPI] 删除成功，共删除 ${filelist.length} 个文件/文件夹`);
      return true;
    }
    console.error("[QuarkAPI] 删除失败:", json);
    return false;
  } catch (e) {
    console.error("[QuarkAPI] 删除异常:", e.message || e);
    return false;
  }
}

// 创建缓存文件夹（与 quarkapi 逻辑一致：存在则先删除再创建）
async function createFolder(folderName, pdirFid = "0") {
  // 检查是否已存在
  const existingFid = await checkFolderExists(folderName);
  if (existingFid) {
    console.log(`[QuarkAPI] 缓存文件夹已存在，删除旧文件夹: ${folderName}`);
    await deleteFiles([existingFid]);
  }
  // 创建新文件夹
  const url = "https://drive-pc.quark.cn/1/clouddrive/file?pr=ucpro&fr=pc&uc_param_str=";
  try {
    const json = await httpJson("POST", url, {
      pdir_fid: pdirFid,
      file_name: folderName,
      dir_path: "",
      dir_init_lock: false
    }, quarkHeaders());
    if (json && json.status === 200 && json.code === 0 && json.data) {
      console.log(`[QuarkAPI] 创建缓存文件夹成功: ${folderName}, fid=${json.data.fid}`);
      return json.data.fid;
    }
    console.error("[QuarkAPI] 创建文件夹失败:", json);
    return "0";
  } catch (e) {
    console.error("[QuarkAPI] 创建文件夹异常:", e.message || e);
    return "0";
  }
}

// 转存分享文件到缓存文件夹
async function saveShareFile(videoInfo) {
  const toFid = await createFolder(CACHE_FOLDER);
  if (!toFid || toFid === "0") {
    console.error("[QuarkAPI] 缓存文件夹获取失败");
    return "";
  }
  const url = "https://drive-h.quark.cn/1/clouddrive/share/sharepage/save?pr=ucpro&fr=pc&uc_param_str=";
  const body = {
    fid_list: [videoInfo.fid],
    fid_token_list: [videoInfo.share_fid_token],
    pdir_fid: videoInfo.pdir_fid,
    pwd_id: videoInfo.shareId,
    scene: "link",
    stoken: videoInfo.stoken,
    to_pdir_fid: toFid
  };
  try {
    const json = await httpJson("POST", url, body, quarkHeaders());
    const inner = json && json.data && json.data.task_resp && json.data.task_resp.data;
    const fids = inner && (inner.save_as && (inner.save_as.save_as_top_fids || inner.save_as.save_as_select_top_fids));
    return fids && fids.length ? fids[0] : "";
  } catch (e) {
    console.error("[QuarkAPI] 转存失败:", e.message || e);
    return "";
  }
}

// 获取播放 URL
async function getPlayUrl(myFid) {
  const url = "https://drive-pc.quark.cn/1/clouddrive/file/v2/play?pr=ucpro&fr=pc&uc_param_str=";
  const json = await httpJson("POST", url, { fid: myFid, resolutions: "normal,low,high,super,2k,4k" }, quarkHeaders());
  const arr = json && json.status === 200 && json.code === 0 && json.data ? (json.data.video_list || []) : [];
  return arr.map(v => ({ resolution: v.resolution, file_name: json.data.file_name, url: v.video_info && v.video_info.url })).filter(v => v.url);
}

function formatVideoName(fileName, size) {
  if (!fileName) return "视频";
  const gb = Number(size || 0) / 1024 / 1024 / 1024;
  const sizeText = gb > 0 ? ` ${gb >= 1 ? gb.toFixed(2) + "GB" : Math.round(gb * 1024) + "MB"}` : "";
  return String(fileName).trim() + sizeText;
}
