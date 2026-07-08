WidgetMetadata = {
  id: "jianpian.resource",
  title: "荐片影院",
  version: "1.4.2",
  requiredVersion: "0.0.1",
  description: "荐片视频源",
  author: "MoYan",
  site: "https://h5.jianpianips1.com",
  modules: [
    {
      id: "loadResource",
      title: "加载荐片资源",
      functionName: "loadResource",
      type: "stream",
      params: []
    }
  ]
};

const DEFAULT_API_HOST = "https://h5.jianpianips1.com";
const BACKUP_API_HOST = "https://h5.jianpianips2.com";

const REQUEST_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'zh-CN,zh;q=0.9'
};

const REQUEST_TIMEOUT = 8000;
const MIN_MATCH_SCORE = 60;  // 可配置的最低匹配分数

// ==================== 工具函数 ====================

function logInfo(message, data = null) {
  if (data) {
    console.log(`[荐片] ${message}:`, JSON.stringify(data));
  } else {
    console.log(`[荐片] ${message}`);
  }
}

function logError(message, error = null) {
  if (error) {
    console.error(`[荐片] ${message}:`, error.message || error);
  } else {
    console.error(`[荐片] ${message}`);
  }
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

function buildQueryString(params) {
  const parts = [];
  for (const key in params) {
    if (params[key] && params[key] !== '') {
      parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
    }
  }
  return parts.join('&');
}

async function httpRequest(url, options = {}) {
  const method = options.method || 'GET';
  const headers = { ...REQUEST_HEADERS, ...(options.headers || {}) };
  
  try {
    let response;
    if (method === 'GET') {
      response = await Widget.http.get(url, {
        headers: headers,
        timeout: options.timeout || REQUEST_TIMEOUT
      });
    } else {
      response = await Widget.http.post(url, {
        headers: headers,
        body: options.body,
        timeout: options.timeout || REQUEST_TIMEOUT
      });
    }
    
    let result = response.data;
    if (typeof result === 'string') {
      try {
        result = JSON.parse(result);
      } catch (e) {
        return { code: -1, msg: 'Invalid JSON', raw: result };
      }
    }
    return result;
  } catch (error) {
    logError(`请求失败: ${url}`, error);
    throw error;
  }
}

async function requestWithFallback(url, options = {}) {
  try {
    return await httpRequest(url, options);
  } catch (error) {
    if (url.includes(DEFAULT_API_HOST)) {
      const backupUrl = url.replace(DEFAULT_API_HOST, BACKUP_API_HOST);
      logInfo(`尝试备用域名: ${backupUrl}`);
      try {
        return await httpRequest(backupUrl, options);
      } catch (e) {
        throw error;
      }
    }
    throw error;
  }
}

// ==================== 核心搜索和匹配 ====================

async function searchVod(wd, pg = 1) {
  try {
    if (!wd?.trim()) {
      return { list: [], page: pg, pagecount: pg };
    }
    
    const queryString = buildQueryString({ keyword: wd, page: pg });
    const url = `${DEFAULT_API_HOST}/api/v2/search/videoV2?key=${queryString}`;
    const res = await requestWithFallback(url);
    
    let dataList = [];
    if (res?.code === 1) {
      if (Array.isArray(res.data)) {
        dataList = res.data;
      } else if (res.data?.list) {
        dataList = res.data.list;
      }
    } else if (Array.isArray(res)) {
      dataList = res;
    } else if (res?.list) {
      dataList = res.list;
    }
    
    const list = dataList
      .filter(i => i?.id && String(i.id) !== '0')
      .map(i => ({
        vod_id: String(i.id),
        vod_name: i.title || i.vod_name || '未知标题',
        vod_pic: i.path || i.tvimg || i.tagimg || '',
        vod_remarks: i.mask || (i.score ? `评分:${i.score}` : '')
      }));
    
    logInfo(`搜索 "${wd}" 找到 ${list.length} 条结果`);
    return { list, page: pg, pagecount: pg };
  } catch (e) {
    logError('搜索失败', e);
    return { list: [], page: pg, pagecount: pg };
  }
}

async function getDetail(vodId) {
  try {
    const url = `${DEFAULT_API_HOST}/api/video/detailv2?id=${vodId}`;
    const res = await requestWithFallback(url);
    if (!res || res.code !== 1 || !res.data) {
      logError('详情返回异常', res);
      return null;
    }
    return res.data;
  } catch (e) {
    logError('获取详情失败', e);
    return null;
  }
}

// 计算匹配分数（独立函数，便于维护）
function calculateMatchScore(searchName, itemName) {
  const cleanSearch = cleanTitle(searchName);
  const cleanItem = cleanTitle(itemName);
  
  if (cleanItem === cleanSearch) return 100;
  // 包含匹配：如果结果名远长于搜索词（>2倍），降权处理
  if (cleanItem.includes(cleanSearch)) {
    var ratio = cleanSearch.length / cleanItem.length;
    return ratio < 0.5 ? 40 + Math.round(ratio * 60) : 70;
  }
  if (cleanSearch.includes(cleanItem)) return 50;
  
  // 逐字符匹配
  let matchCount = 0;
  for (let i = 0; i < cleanSearch.length; i++) {
    if (cleanItem.includes(cleanSearch[i])) matchCount++;
  }
  return (matchCount / cleanSearch.length) * 30;
}

function extractPlayInfo(detail, vod_name, targetEpNum, type) {
  const playResources = [];
  const sourceListSource = detail?.source_list_source;
  
  if (!Array.isArray(sourceListSource)) return [];
  
  let resourceIndex = 0;
  
  for (const source of sourceListSource) {
    const sourceName = source.name || '未知线路';
    const lowerSourceName = sourceName.toLowerCase();
    
    // 过滤VIP/FTP线路
    if (lowerSourceName.includes('vip') || lowerSourceName.includes('ftp') || sourceName === '常规线路') {
      continue;
    }
    
    if (!source.source_list?.length) continue;
    
    for (const item of source.source_list) {
      let url = item.url;
      if (!url) continue;
      if (!url.includes('.m3u8') && !url.includes('.mp4')) continue;
      
      try { url = decodeURIComponent(url); } catch(e) {}
      
      const episodeName = item.source_name || '';
      let episodeNum = null;
      let isMatch = true;
      
      // 集数匹配
      if (targetEpNum !== null && targetEpNum !== undefined) {
        const cnMatch = episodeName.match(/第(\d+)[集话]/);
        if (cnMatch) {
          episodeNum = parseInt(cnMatch[1]);
          isMatch = episodeNum === targetEpNum;
        } else {
          const epMatch = episodeName.match(/[Ee][Pp]?\s*(\d+)/);
          if (epMatch) {
            episodeNum = parseInt(epMatch[1]);
            isMatch = episodeNum === targetEpNum;
          } else {
            const numMatch = episodeName.match(/^(\d+)$/);
            if (numMatch) {
              episodeNum = parseInt(numMatch[1]);
              isMatch = episodeNum === targetEpNum;
            } else {
              isMatch = false;
            }
          }
        }
        
        if (!isMatch) continue;
      }
      
      // 构建描述
      let description = vod_name;
      if (episodeNum) {
        description = `${vod_name} 第${episodeNum}集`;
      } else if (episodeName && !['正片', '播放'].includes(episodeName)) {
        const cleanEpName = episodeName.replace(/[<>\"\'\\]/g, '').trim();
        if (cleanEpName) description = `${vod_name} - ${cleanEpName}`;
      }
      
      if (sourceName && !sourceName.includes('默认')) {
        description = `${description} [${sourceName}]`;
      }
      
      resourceIndex++;
      
      playResources.push({
        name: sourceName,
        description: description,
        url: url
      });
    }
  }
  
  return playResources;
}

// ==================== 统一入口 ====================

async function loadResource(params) {
  // 获取参数（兼容多种字段名）
  let seriesName = params?.seriesName || params?.title || params?.name || params?.keyword;
  let type = params?.type === 'movie' ? 'movie' : 'tv';
  let episode = params?.episode ? parseInt(params.episode) : null;
  
  logInfo(`被动触发 - 搜索: ${seriesName}, 类型: ${type}, 集: ${episode}`);
  
  if (!seriesName) {
    logError('缺少系列名称');
    return [];
  }
  
  // 如果有 tmdbId，获取年份用于精准匹配
  var searchYear = "";
  if (params?.tmdbId) {
    try {
      var mt = params.type === "tv" ? "tv" : "movie";
      var tm = await Widget.tmdb.get(mt + "/" + params.tmdbId, { params: { language: "zh-CN" } });
      var dateStr = tm.release_date || tm.first_air_date || "";
      searchYear = dateStr ? dateStr.substring(0, 4) : "";
    } catch (e) { /* ignore */ }
  }
  
  const searchKeyword = extractBaseName(seriesName) + (searchYear ? " " + searchYear : "");
  logInfo(`搜索关键词: ${searchKeyword}`);
  
  // 搜索（带年份）
  let searchResult = await searchVod(searchKeyword, 1);
  
  // 如果带年份搜索无结果或匹配不足，fallback 到不带年份
  var needFallback = false;
  var fbScore = 0;
  if (searchYear) {
    if (!searchResult.list?.length) {
      needFallback = true;
    } else {
      // 试匹配，如果分数不够也 fallback
      var fbSearch = cleanTitle(searchKeyword);
      for (var fb of searchResult.list) {
        var s = calculateMatchScore(fbSearch, fb.vod_name);
        var sy = fbSearch.match(/(\d{4})/);
        var iy = cleanTitle(fb.vod_name).match(/(\d{4})/);
        if (sy && iy && sy[1] !== iy[1]) s *= 0.3;
        if (s > fbScore) fbScore = s;
      }
      if (fbScore < MIN_MATCH_SCORE) needFallback = true;
    }
  }
  if (needFallback) {
    logInfo(`带年份搜索匹配不足(最高分=${fbScore})，回退到不带年份`);
    var fallbackKeyword = extractBaseName(seriesName);
    searchResult = await searchVod(fallbackKeyword, 1);
  }
  if (!searchResult.list?.length) {
    logInfo(`未找到相关视频: ${searchKeyword}`);
    return [];
  }
  
  // 匹配最佳结果（fallback 后重新计算搜索词）
  const cleanSearchName = cleanTitle(needFallback ? extractBaseName(seriesName) : searchKeyword);
  let matchedItem = null;
  let matchScore = 0;
  
  for (const item of searchResult.list) {
    var score = calculateMatchScore(cleanSearchName, item.vod_name);
    // 年份惩罚：搜索词和结果年份不一致则降权
    var searchYearIn = cleanSearchName.match(/(\d{4})/);
    var itemYearIn = cleanTitle(item.vod_name).match(/(\d{4})/);
    if (searchYearIn && itemYearIn && searchYearIn[1] !== itemYearIn[1]) {
      score *= 0.3;
    }
    logInfo(`候选: ${item.vod_name} (${item.vod_id}) 得分: ${score}`);
    if (score > matchScore) {
      matchScore = score;
      matchedItem = item;
    }
  }
  
  if (!matchedItem || matchScore < MIN_MATCH_SCORE) {
    logInfo(`未找到足够匹配的资源 (最高分=${matchScore}, 需要≥${MIN_MATCH_SCORE})`);
    return [];
  }
  
  // 未上映电影检查：如果TMDB是未来年份且不得不fallback，拒绝匹配（同名不同年）
  if (searchYear && parseInt(searchYear) >= 2026 && needFallback) {
    logInfo(`未上映电影(${searchYear})靠fallback匹配到无法确认年份的资源，拒绝`);
    return [];
  }
  
  logInfo(`匹配到: ${matchedItem.vod_name} (匹配度: ${matchScore})`);
  
  // 获取详情
  const detail = await getDetail(matchedItem.vod_id);
  if (!detail) {
    logInfo('获取详情失败');
    return [];
  }
  
  // 使用真实标题
  const realTitle = detail.title || detail.vod_name || matchedItem.vod_name;
  logInfo(`真实影片标题: ${realTitle}`);
  
  // 提取播放资源
  const targetEpNum = (type === 'tv' && episode) ? episode : null;
  let playResources = extractPlayInfo(detail, realTitle, targetEpNum, type);
  
  logInfo(`提取到 ${playResources.length} 个播放资源`);
  
  // 去重
  const urlSet = new Set();
  const uniqueResources = [];
  for (const r of playResources) {
    if (!urlSet.has(r.url)) {
      urlSet.add(r.url);
      uniqueResources.push(r);
    }
  }
  
  logInfo(`最终返回 ${uniqueResources.length} 个播放资源`);
  if (uniqueResources.length > 0) {
    logInfo(`返回示例: ${JSON.stringify(uniqueResources[0])}`);
  }
  
  return uniqueResources;
}
