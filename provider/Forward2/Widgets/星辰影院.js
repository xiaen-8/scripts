// @name 星辰影院
// @description 星辰影院 - 精确匹配，返回所有唯一播放资源（无测试参数，稳定版）
// @version 1.1.5

const HOST = "https://www.xcyycn.com";
const REQUEST_TIMEOUT = 10000;

const REQUEST_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'zh-CN,zh;q=0.9',
  'Referer': HOST + '/'
};

// ==================== 工具函数 ====================
function logInfo(message, data = null) {
  if (data) console.log(`[星辰影院] ${message}:`, JSON.stringify(data));
  else console.log(`[星辰影院] ${message}`);
}

function logError(message, error = null) {
  if (error) console.error(`[星辰影院] ${message}:`, error.message || error);
  else console.error(`[星辰影院] ${message}`);
}

function cleanTitle(title) {
  if (!title) return '';
  return title.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '').toLowerCase();
}

function extractBaseName(title) {
  if (!title) return '';
  let cleaned = title.replace(/[\(\[（【][^\)\]）】]*[\)\]）】]/g, '');
  const separators = /[:：\-—\s]+/;
  const parts = cleaned.split(separators);
  return parts[0]?.trim() || cleaned.trim();
}

function toAbsUrl(url) {
  if (!url) return '';
  const u = String(url).trim();
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  if (u.startsWith('//')) return `https:${u}`;
  if (u.startsWith('/')) return HOST + u;
  return HOST + '/' + u;
}

async function httpGet(url, extraHeaders = {}) {
  const headers = { ...REQUEST_HEADERS, ...extraHeaders };
  const response = await Widget.http.get(url, { headers, timeout: REQUEST_TIMEOUT });
  return response.data;
}

// ==================== 解析函数 ====================
function parseSearchList(html) {
  const list = [];
  let pos = 0;
  while (true) {
    const liStart = html.indexOf('<li', pos);
    if (liStart === -1) break;
    const liEnd = html.indexOf('</li>', liStart);
    const liHtml = html.substring(liStart, liEnd);
    pos = liEnd;
    const aStart = liHtml.indexOf('<a');
    if (aStart === -1) continue;
    const aEnd = liHtml.indexOf('</a>', aStart);
    const aHtml = liHtml.substring(aStart, aEnd);
    const hrefMatch = aHtml.match(/href=["']([^"']+)/);
    if (!hrefMatch) continue;
    const vodId = hrefMatch[1].trim();
    let vodName = '';
    const titleMatch = aHtml.match(/title=["']([^"']+)/);
    if (titleMatch) vodName = titleMatch[1].trim();
    if (!vodName) {
      const textMatch = aHtml.match(/>([^<]+)</);
      if (textMatch) vodName = textMatch[1].trim();
    }
    if (vodId && vodName) list.push({ vod_id: vodId, vod_name: vodName });
  }
  return list;
}

function parseDetail(html) {
  const result = { title: '', playSources: [] };
  let titleMatch = html.match(/hl-dc-title[^>]*>([^<]+)</);
  if (!titleMatch) titleMatch = html.match(/hl-vod-title[^>]*>([^<]+)</);
  if (!titleMatch) titleMatch = html.match(/<h1[^>]*>([^<]+)</);
  if (!titleMatch) titleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/);
  if (titleMatch) result.title = titleMatch[1].trim();
  
  let tabsHtml = '';
  const tabsStart = html.indexOf('hl-plays-from hl-tabs');
  if (tabsStart !== -1) {
    let tabsEnd = html.indexOf('</div>', tabsStart);
    if (tabsEnd === -1) tabsEnd = tabsStart + 1000;
    tabsHtml = html.substring(tabsStart, tabsEnd);
  }
  const sourceNames = [];
  const nameRegex = /<a[^>]*>([^<]+)<\/a>/g;
  let nameMatch;
  while ((nameMatch = nameRegex.exec(tabsHtml)) !== null) {
    sourceNames.push(nameMatch[1].trim());
  }
  const playlistsHtml = [];
  let searchStart = 0;
  while (true) {
    const plStart = html.indexOf('hl-plays-list', searchStart);
    if (plStart === -1) break;
    let plEnd = html.indexOf('</div>', plStart);
    if (plEnd === -1) plEnd = plStart + 1000;
    playlistsHtml.push(html.substring(plStart, plEnd));
    searchStart = plEnd;
  }
  for (let i = 0; i < sourceNames.length && i < playlistsHtml.length; i++) {
    const episodes = [];
    const epHtml = playlistsHtml[i];
    let epPos = 0;
    while (true) {
      const aStart = epHtml.indexOf('<a', epPos);
      if (aStart === -1) break;
      const aEnd = epHtml.indexOf('</a>', aStart);
      const aHtml = epHtml.substring(aStart, aEnd);
      epPos = aEnd;
      const hrefMatch = aHtml.match(/href=["']([^"']+)/);
      if (!hrefMatch) continue;
      let epUrl = hrefMatch[1].trim();
      let epName = '';
      const textMatch = aHtml.match(/>([^<]+)</);
      if (textMatch) epName = textMatch[1].trim();
      if (epName.includes('展开')) continue;
      epName = epName.replace(/[<>\"\'\\]/g, '');
      if (epUrl) {
        episodes.push({
          name: epName || `第${episodes.length+1}集`,
          playUrl: toAbsUrl(epUrl),
          rawName: epName
        });
      }
    }
    if (episodes.length) result.playSources.push({ name: sourceNames[i], episodes });
  }
  if (result.playSources.length === 0) {
    const anyList = html.match(/hl-plays-list[^>]*>([\s\S]*?)<\/div>/);
    if (anyList) {
      const episodes = [];
      const epRegex = /<a[^>]*href=["']([^"']+)[^>]*>([^<]+)<\/a>/g;
      let epMatch;
      while ((epMatch = epRegex.exec(anyList[1])) !== null) {
        let epUrl = epMatch[1].trim();
        let epName = epMatch[2].trim();
        if (epName.includes('展开')) continue;
        epName = epName.replace(/[<>\"\'\\]/g, '');
        if (epUrl) episodes.push({ name: epName || '播放', playUrl: toAbsUrl(epUrl), rawName: epName });
      }
      if (episodes.length) result.playSources.push({ name: '默认线路', episodes });
    }
  }
  return result;
}

function extractEpisodeNumber(epName) {
  if (!epName) return null;
  let match = epName.match(/第\s*(\d+)\s*[集话期]/);
  if (match) return parseInt(match[1]);
  match = epName.match(/[Ee][Pp]?\s*(\d+)/);
  if (match) return parseInt(match[1]);
  match = epName.match(/\b(\d{1,3})\b/);
  if (match && !match[1].match(/^(1080|720|480|2160|4k)$/i)) return parseInt(match[1]);
  return null;
}

async function extractVideoUrl(playPageUrl) {
  try {
    const html = await httpGet(playPageUrl, { Referer: HOST });
    let playerMatch = html.match(/player_\w+\s*=\s*(\{[^;]+\})/);
    if (!playerMatch) playerMatch = html.match(/player\s*=\s*(\{[^;]+\})/);
    if (playerMatch) {
      try {
        const data = JSON.parse(playerMatch[1]);
        if (data && data.url) {
          let url = String(data.url);
          const encrypt = String(data.encrypt || '0');
          if (encrypt === '2') {
            try { url = decodeURIComponent(Buffer.from(url, 'base64').toString()); } catch(e) {}
          } else if (encrypt === '1') {
            try { url = decodeURIComponent(url); } catch(e) {}
          }
          if (url && (url.includes('.m3u8') || url.includes('.mp4'))) return url;
        }
      } catch(e) {}
    }
    const m3u8Match = html.match(/(https?:\/\/[^"'\s]+\.m3u8[^"'\s]*)/);
    if (m3u8Match) return m3u8Match[1];
    return null;
  } catch (e) {
    return null;
  }
}

async function searchVod(wd) {
  try {
    const url = `${HOST}/s.html?wd=${encodeURIComponent(wd)}&submit=`;
    const html = await httpGet(url);
    const list = parseSearchList(html);
    logInfo(`搜索 "${wd}" 找到 ${list.length} 条结果`);
    return list;
  } catch (e) {
    logError('搜索失败', e);
    return [];
  }
}

async function getDetail(vodId) {
  const detailUrl = toAbsUrl(vodId);
  const html = await httpGet(detailUrl);
  return parseDetail(html);
}

// ==================== 统一入口（精确匹配，无缓存） ====================
async function loadResource(params) {
  let seriesName = params?.seriesName || params?.title || params?.name || params?.keyword;
  let type = params?.type === 'movie' ? 'movie' : 'tv';
  let episode = params?.episode ? parseInt(params.episode) : null;

  logInfo(`触发 - 搜索: ${seriesName}, 类型: ${type}, 集: ${episode}`);
  if (!seriesName) return [];

  const searchKeyword = extractBaseName(seriesName);
  const searchResults = await searchVod(searchKeyword);
  if (!searchResults.length) return [];

  // 精确匹配
  const cleanTarget = cleanTitle(seriesName);
  let matchedItem = null;
  for (const item of searchResults) {
    if (cleanTitle(item.vod_name) === cleanTarget) {
      matchedItem = item;
      break;
    }
  }
  if (!matchedItem) {
    logInfo(`未找到精确匹配: ${seriesName}`);
    return [];
  }

  logInfo(`精确匹配到: ${matchedItem.vod_name} (${matchedItem.vod_id})`);

  const detail = await getDetail(matchedItem.vod_id);
  if (!detail || !detail.playSources.length) {
    logInfo('获取详情失败或无播放源');
    return [];
  }

  const realTitle = detail.title || matchedItem.vod_name;
  logInfo(`真实标题: ${realTitle}, 共${detail.playSources.length}个播放源`);

  // 收集所有匹配集数的播放项
  const targetItems = [];
  for (const source of detail.playSources) {
    for (const ep of source.episodes) {
      let epNum = null;
      const cnMatch = ep.name.match(/第(\d+)[集话]/);
      if (cnMatch) {
        epNum = parseInt(cnMatch[1]);
      } else {
        const numMatch = ep.name.match(/(\d+)/);
        if (numMatch && !numMatch[1].match(/^(1080|720|480|2160|4k)$/i)) {
          epNum = parseInt(numMatch[1]);
        }
      }
      if (type === 'movie') {
        if (targetItems.length === 0) targetItems.push(ep);
      } else {
        if (episode !== null && epNum === episode) {
          targetItems.push(ep);
        } else if (episode === null && targetItems.length === 0) {
          targetItems.push(ep);
        }
      }
    }
  }

  if (targetItems.length === 0) {
    logInfo(`未找到匹配的集数 (type=${type}, episode=${episode})`);
    return [];
  }

  const resources = [];
  for (let i = 0; i < targetItems.length; i++) {
    const item = targetItems[i];
    let videoUrl = await extractVideoUrl(item.playUrl);
    if (!videoUrl) {
      logInfo(`未提取到直链，使用播放页URL: ${item.playUrl}`);
      videoUrl = item.playUrl;
    }
    let description = realTitle;
    if (type === 'tv' && item.rawName && !item.rawName.includes('正片')) {
      description = `${realTitle} ${item.rawName}`;
    } else if (type === 'movie') {
      description = realTitle;
    } else {
      description = `${realTitle} - ${item.name}`;
    }
    resources.push({
      id: `${matchedItem.vod_id}_${Date.now()}_${i}`,
      name: '星辰影院',
      type: type,
      description: description,
      url: videoUrl
    });
  }

  // 去重
  const urlSet = new Set();
  const uniqueResources = [];
  for (const r of resources) {
    if (!urlSet.has(r.url)) {
      urlSet.add(r.url);
      uniqueResources.push(r);
    }
  }

  logInfo(`最终返回 ${uniqueResources.length} 个播放资源`);
  if (uniqueResources.length > 0) {
    logInfo(`示例: ${JSON.stringify(uniqueResources[0])}`);
  }
  return uniqueResources;
}

// ==================== Widget 元数据 ====================
WidgetMetadata = {
  id: "XingChenYingYuan",
  title: "星辰影院",
  icon: "",
  version: "1.1.5",
  requiredVersion: "0.0.1",
  description: "星辰影院",
  author: "MoYan",
  globalParams: [],   // 清空全局参数，不再提供测试输入框
  modules: [
    {
      id: "loadResource",
      title: "加载星辰影院资源",
      functionName: "loadResource",
      type: "stream",
      params: []
    }
  ]
};