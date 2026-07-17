// 91tv ForwardWidget 模块（封面修复版）
const DEFAULT_BASE_URL = "https://www.91tv.com";

WidgetMetadata = {
  id: "forward.91tv",
  title: "91天堂",
  version: "1.0.2",
  requiredVersion: "0.0.1",
  description: "91天堂网视频模块 - 支持最新/分类/搜索",
  author: "AiKuai",
  site: "https://github.com/InchStudio/ForwardWidgets",
  icon: "",
  detailCacheDuration: 60,
  globalParams: [
    {
      name: "baseUrl",
      title: "网站域名",
      type: "input",
      value: "https://bsi.hfsbu7rwhijnj287a0fdmkgsjk.top/",
	  placeholders: [
         { title: "默认", value: "https://jvyc.hfsbu7rwhijnj287a0fdmkgsjk.top/" },
         { title: "默认", value: "https://bsi.hfsbu7rwhijnj287a0fdmkgsjk.top/" },
         { title: "默认", value: "https://ezk.hfsbu7rwhijnj287a0fdmkgsjk.top/" },
         { title: "默认", value: "https://fa0i.hfsbu7rwhijnj287a0fdmkgsjk.top/" },
         { title: "默认", value: "https://56w.hfsbu7rwhijnj287a0fdmkgsjk.top/" },
         { title: "默认", value: "https://xtr.hfsbu7rwhijnj287a0fdmkgsjk.top/" },
         { title: "默认", value: "https://nvrh.hfsbu7rwhijnj287a0fdmkgsjk.top/" },
         { title: "默认", value: "https://t6jf.hfsbu7rwhijnj287a0fdmkgsjk.top/" },
         { title: "默认", value: "https://q52iz3.hfsbu7rwhijnj287a0fdmkgsjk.top/" },
         { title: "默认", value: "https://www.91vtv.top" },
        ]
     }
  ],
  modules: [
    {
      id: "loadList",
      title: "最新影片",
      functionName: "loadList",
      cacheDuration: 3600,
      params: [
        {
          name: "sort_by",
          title: "分类",
          type: "enumeration",
          enumOptions: [
            { title: "最新", value: "" },
            { title: "国产", value: "5" },
            { title: "无码", value: "1" },
            { title: "有码", value: "2" },
            { title: "欧美", value: "3" },
            { title: "动漫", value: "4" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
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

// ---------- 辅助函数 ----------
async function getBaseUrl(params) {
  let base = params && params.baseUrl ? params.baseUrl : Widget.storage.get('baseUrl');
  if (!base) base = DEFAULT_BASE_URL;
  Widget.storage.set('baseUrl', base);
  return base;
}

/**
 * 从缩略图元素中提取图片 URL，并补全为绝对路径
 */
function getImageUrl($thumb, baseUrl) {
  let url = $thumb.attr('data-original');
  if (!url) {
    // 尝试从 style 中提取 background-image
    const style = $thumb.attr('style') || '';
    const match = style.match(/url\(["']?([^"')]+)["']?\)/);
    if (match) url = match[1];
  }
  if (!url) {
    url = $thumb.attr('src');
  }
  if (url) {
    // 补全相对路径
    if (url.startsWith('//')) {
      url = 'https:' + url;
    } else if (url.startsWith('/')) {
      url = baseUrl + url;
    }
  }
  return url;
}

// 解析列表页（首页、分类、搜索）
function parseList(html, baseUrl) {
  const $ = Widget.html.load(html);
  const items = [];
  $('.stui-vodlist__box').each(function() {
    const $box = $(this);
    const $thumb = $box.find('.stui-vodlist__thumb');
    const href = $thumb.attr('href');
    const title = $thumb.attr('title') || $box.find('.text-title a').text().trim();
    const img = getImageUrl($thumb, baseUrl);
    if (!href) return;
    const match = href.match(/\/index\.php\/vod\/play\/id\/(\d+)/);
    if (!match) return;
    const vid = match[1];
    items.push({
      id: vid,
      type: "url",
      title: title,
	  backdropPath: img,
      //posterPath: img,//搜索显示封面的关键，但是加了这个分类浏览就会变成一行3个
      link: "91tv:" + vid,
    });
  });
  return items;
}

// 解析详情页（增强版）
function parseDetail(html) {
  const $ = Widget.html.load(html);
  let videoUrl = null;

  // 在 <script> 中查找 player_aaaa
  const scripts = $('script').toArray();
  for (let s of scripts) {
    const text = $(s).html();
    if (!text || !text.includes('var player_aaaa=')) continue;

    // 方法1：JSON 解析（自动处理转义）
    try {
      const match = text.match(/var player_aaaa=\s*({[^;]+});/);
      if (match) {
        const obj = JSON.parse(match[1]);
        if (obj.url) {
          videoUrl = obj.url;
          break;
        }
      }
    } catch (e) { /* 忽略，尝试备用方法 */ }

    // 方法2：正则直接提取 url 字符串并手动替换转义
    if (!videoUrl) {
      const urlMatch = text.match(/["']url["']\s*:\s*["']([^"']+)["']/);
      if (urlMatch) {
        // 将 \/ 替换为 /，同时处理其他转义（如有）
        videoUrl = urlMatch[1].replace(/\\\//g, '/');
        break;
      }
    }
  }

  // 提取推荐列表（封面也使用同样逻辑，但这里不调用 getImageUrl 因为无 baseUrl）
  const related = [];
  // 注意：推荐列表中的封面在此处我们不处理，因为列表已经处理过，这里仅用于关联
  $('.stui-vodlist__bd .stui-vodlist__box').each(function() {
    const $box = $(this);
    const $thumb = $box.find('.stui-vodlist__thumb');
    const href = $thumb.attr('href');
    const title = $thumb.attr('title') || $box.find('.text-title a').text().trim();
    const img = $thumb.attr('data-original') || $thumb.attr('src') || ''; // 不补全，因为后续不会显示推荐封面（仅用于跳转）
    if (!href) return;
    const match = href.match(/\/index\.php\/vod\/play\/id\/(\d+)/);
    if (!match) return;
    const vid = match[1];
    related.push({
      id: vid,
      type: "url",
      title: title,
      posterPath: img,
      link: "91tv:" + vid,
    });
  });

  // 提取标题和封面（详情页可能没有封面，跳过）
  const title = $('.stui-player__detail .title').text().trim() || '';
  // 封面通常没有，不提取

  return { videoUrl, related, title };
}

// ---------- 模块函数 ----------
async function loadList(params = {}) {
  try {
    const baseUrl = await getBaseUrl(params);
    const type = params.sort_by || "";
    const page = Number(params.page) || 1;
    let url;
    if (type) {
      url = baseUrl + "/index.php/vod/type/id/" + type + ".html";
      if (page > 1) url += "?page=" + page;
    } else {
      url = baseUrl + "/";
      if (page > 1) url += "?page=" + page;
    }
    const res = await Widget.http.get(url);
    return parseList(res.data, baseUrl);
  } catch (error) {
    console.error("[91tv loadList] 失败:", error.message);
    throw error;
  }
}

async function loadDetail(link) {
  try {
    const baseUrl = Widget.storage.get('baseUrl') || DEFAULT_BASE_URL;
    const parts = link.split(":");
    if (parts.length !== 2) return null;
    const vid = parts[1];
    const url = baseUrl + "/index.php/vod/play/id/" + vid + "/sid/1/nid/1.html";
    const res = await Widget.http.get(url);
    const { videoUrl, related, title } = parseDetail(res.data);
    if (!videoUrl) return null;
    return {
      id: vid,
      type: "url",
      title: title || "视频",
      // posterPath 省略，因为列表已提供
      videoUrl: videoUrl,
      relatedItems: related,
      playerType: "system",
      link: link,
    };
  } catch (error) {
    console.error("[91tv loadDetail] 失败:", error.message);
    return null;
  }
}

async function search(params = {}) {
  try {
    const baseUrl = await getBaseUrl(params);
    const keyword = params.keyword || "";
    const page = Number(params.page) || 1;
    if (!keyword) return [];
    const url = baseUrl + "/index.php/vod/search.html?wd=" + encodeURIComponent(keyword) + "&page=" + page;
    const res = await Widget.http.get(url);
    return parseList(res.data, baseUrl);
  } catch (error) {
    console.error("[91tv search] 失败:", error.message);
    throw error;
  }
}