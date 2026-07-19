const RESOURCE_SITES = `
卧龙,https://collect.wolongzyw.com/api.php/provide/vod
最大,https://api.zuidapi.com/api.php/provide/vod
百度,https://api.apibdzy.com/api.php/provide/vod
暴风,https://bfzyapi.com/api.php/provide/vod
极速,https://jszyapi.com/api.php/provide/vod
天涯,https://tyyszy.com/api.php/provide/vod
无尽,https://api.wujinapi.com/api.php/provide/vod
魔都,https://www.mdzyapi.com/api.php/provide/vod
叁六,https://360zy.com/api.php/provide/vod
天堂,https://caiji.dyttzyapi.com/api.php/provide/vod
如意,https://cj.rycjapi.com/api.php/provide/vod
旺旺,https://wwzy.tv/api.php/provide/vod
红牛,https://www.hongniuzy2.com/api.php/provide/vod
光速,https://api.guangsuapi.com/api.php/provide/vod
爱坤,https://ikunzyapi.com/api.php/provide/vod
优酷,https://api.ukuapi.com/api.php/provide/vod
虎牙,https://www.huyaapi.com/api.php/provide/vod
新浪,https://api.xinlangapi.com/xinlangapi.php/provide/vod
量子,https://cj.lziapi.com/api.php/provide/vod
爱蛋,https://lovedan.net/api.php/provide/vod
非凡,https://api.ffzyapi.com/api.php/provide/vod
丫丫,https://cj.yayazy.net/api.php/provide/vod
樱花,https://m3u8.apiyhzy.com/api.php/provide/vod
步高,https://api.yparse.com/api/json
牛牛,https://api.niuniuzy.me/api.php/provide/vod
索尼,https://suoniapi.com/api.php/provide/vod
茅台,https://caiji.maotaizy.cc/api.php/provide/vod
豆瓣,https://dbzy.tv/api.php/provide/vod
速播,https://subocaiji.com/api.php/provide/vod
金鹰,https://jyzyapi.com/api.php/provide/vod
闪电,https://sdzyapi.com/api.php/provide/vod
飘零,https://p2100.net/api.php/provide/vod
豪华,https://hhzyapi.com/api.php/provide/vod
爱奇,https://iqiyizyapi.com/api.php/provide/vod
猫眼,https://api.maoyanapi.top/api.php/provide/vod
快车,https://caiji.kuaichezy.org/api.php/provide/vod
欧客,https://api.okzyw.net/api.php/provide/vod
金蝉,https://zy.jinchancaiji.com/api.php/provide/vod
`;

const CHINESE_NUM_MAP = {
  '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
  '六': 6, '七': 7, '八': 8, '九': 9, '十': 10
};

const PART_ORDER_MAP = {
  '': 0, '前': 1, '前篇': 1, '上': 1, '上部': 1, '上集': 1, '上部分': 1, '1': 1, '一': 1, 'A': 1, 'a': 1,
  '中': 2, '中部': 2, '中集': 2, '中部分': 2, '2': 2, '二': 2, 'B': 2, 'b': 2,
  '后': 3, '后篇': 3, '下': 3, '下部': 3, '下集': 3, '下部分': 3, '3': 3, '三': 3, 'C': 3, 'c': 3,
  '本': 4, '全': 4, '完整': 4, '4': 4, '四': 4,
  '五': 5, '5': 5, '五部': 5
};

const SITE_HEALTH_KEY = 'vod_site_health_stats';
const MAX_HEALTH_HISTORY = 20;
const INITIAL_HEALTH_SCORE = 0.7;

WidgetMetadata = {
  id: "VOD_Stream",
  title: "VOD STREAM",
  icon: "",
  version: "2.4.7",
  requiredVersion: "0.0.1",
  description: "获取聚合VOD影视资源，智能分组，连接质量排序",
  author: "MoYan",
  site: "",
  globalParams: [
    {
      name: "VodData",
      title: "JSON或CSV格式的源配置",
      type: "input",
      value: RESOURCE_SITES
    },
    {
      name: "excludeKeywords",
      title: "需要过滤的关键词（用逗号、空格或换行分隔，例如：特辑,加更,集锦）",
      type: "input",
      value: ""
    }
  ],
  modules: [
    {
      id: "loadResource",
      title: "加载资源",
      functionName: "loadResource",
      type: "stream",
      params: [],
    }
  ],
};

// --- 辅助工具函数 ---
const isM3U8Url = (url) => url?.toLowerCase().includes('m3u8') || false;

function extractBaseName(title) {
  if (!title) return '';
  let cleaned = title.replace(/[\(\[（【][^\)\]）】]*[\)\]）】]/g, '');
  const separators = /[:：\-—\s]+/;
  const parts = cleaned.split(separators);
  return parts[0]?.trim() || cleaned.trim();
}

function cleanTitle(title) {
  if (!title) return '';
  return title.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '').toLowerCase();
}

function extractSeasonInfo(seriesName) {
  if (!seriesName) return { baseName: seriesName, seasonNumber: 1, cleanBaseName: '' };
  
  let cleanedName = seriesName;
  cleanedName = cleanedName.replace(/[\(\[（【][^\)\]）】]*[\)\]）】]/g, '');
  
  let baseName = cleanedName;
  let seasonNumber = 1;
  
  const chineseMatch = cleanedName.match(/第([一二三四五六七八九十\d]+)[季部]/);
  if (chineseMatch) {
    const val = chineseMatch[1];
    seasonNumber = CHINESE_NUM_MAP[val] || parseInt(val) || 1;
    baseName = cleanedName.replace(/第[一二三四五六七八九十\d]+[季部]/, '').trim();
  } else {
    const digitMatch = cleanedName.match(/(.+?)(?:[ _\-]?)(\d{1,4})$/);
    if (digitMatch) {
      const possibleBase = digitMatch[1].trim();
      const possibleSeason = parseInt(digitMatch[2]);
      if (possibleBase && possibleSeason > 0) {
        baseName = possibleBase;
        seasonNumber = possibleSeason;
      }
    }
  }
  
  baseName = extractBaseName(baseName);
  const cleanBaseName = cleanTitle(baseName);
  
  return { baseName, seasonNumber, cleanBaseName };
}

function parseVarietyEpisode(epName) {
  if (!epName) return null;
  const epNameClean = epName.trim();

  if (epNameClean.includes('先导')) {
    return { seasonNum: 0, partOrder: 0, subNumber: 0, originalSuffix: '', rawName: epNameClean, type: 'pilot', hasPeriod: false, isValid: true };
  }

  let specialMatch = epNameClean.match(/(?:特别篇|加更)[\s\-]*(\d+)/);
  if (specialMatch) {
    const specialNum = parseInt(specialMatch[1]);
    if (specialNum > 3000) return { isValid: false };
    return { seasonNum: 1000 + specialNum, partOrder: 0, subNumber: 0, originalSuffix: '', rawName: epNameClean, type: 'special', hasPeriod: false, isValid: true };
  }

  // 匹配“第X期（数字）”括号格式
  let parenMatch = epNameClean.match(/第\s*(\d+)\s*期\s*[（(]([\d一二三四五六七八九十]+)[）)]/);
  if (parenMatch) {
    const seasonNum = parseInt(parenMatch[1]);
    if (seasonNum > 999) return { isValid: false };
    let subStr = parenMatch[2];
    let subNumber = CHINESE_NUM_MAP[subStr] || parseInt(subStr) || 0;
    let originalSuffix = subStr;
    return { seasonNum, partOrder: 0, subNumber, originalSuffix, rawName: epNameClean, type: 'sub', hasPeriod: true, isValid: true };
  }

  // 匹配“第X期Y”无括号格式
  let subMatch = epNameClean.match(/第\s*(\d+)\s*期\s*([\d一二三四五六七八九十]+)/);
  if (subMatch) {
    const seasonNum = parseInt(subMatch[1]);
    if (seasonNum > 999) return { isValid: false };
    let subStr = subMatch[2];
    let subNumber = CHINESE_NUM_MAP[subStr] || parseInt(subStr) || 0;
    let originalSuffix = subStr;
    return { seasonNum, partOrder: 0, subNumber, originalSuffix, rawName: epNameClean, type: 'sub', hasPeriod: true, isValid: true };
  }

  // 匹配“第X期[上下中...]”格式
  let match = epNameClean.match(/第\s*(\d+)\s*期[\s\-\(（]*([上下中一二三四五六七八九十\d前半后本]*)[\s\)）\-]*/);
  if (match) {
    const seasonNum = parseInt(match[1]);
    if (seasonNum > 999) return { isValid: false };
    let partKey = match[2]?.trim() || '';
    const partOrder = PART_ORDER_MAP[partKey] !== undefined ? PART_ORDER_MAP[partKey] : (parseInt(partKey) || 0);
    let originalSuffix = partKey;
    return { seasonNum, partOrder, subNumber: 0, originalSuffix, rawName: epNameClean, type: 'standard', hasPeriod: true, isValid: true };
  }

  // 匹配“第X集[上下中...]”格式（电视剧，无期数）
  let setMatch = epNameClean.match(/第\s*(\d+)\s*集[\s\-\(（]*([上下中一二三四五六七八九十\d前半后本]*)[\s\)）\-]*/);
  if (setMatch) {
    const seasonNum = parseInt(setMatch[1]);
    if (seasonNum > 999) return { isValid: false };
    let partKey = setMatch[2]?.trim() || '';
    const partOrder = PART_ORDER_MAP[partKey] !== undefined ? PART_ORDER_MAP[partKey] : (parseInt(partKey) || 0);
    let originalSuffix = partKey;
    return { seasonNum, partOrder, subNumber: 0, originalSuffix, rawName: epNameClean, type: 'standard', hasPeriod: false, isValid: true };
  }

  return { isValid: false };
}

function extractFeatureTag(vod_remarks, epName, quality = '') {
  if (!vod_remarks) vod_remarks = '';
  if (!epName) epName = '';
  if (!quality) quality = '';
  
  const remark = vod_remarks.toLowerCase();
  const episode = epName.toLowerCase();
  const qual = quality.toLowerCase();
  
  const nonTheatricalKeywords = [
    'tc', 'tc版', '抢先版', '枪版', '尝鲜版', '非正式版',
    'hdts', 'hdts版', 'hdtc', 'hdtc版', 'ts', 'ts版',
    'cam', 'cam版', 'scr', 'scr版', 'dvdscr', 'web-dl',
    '低清', '高清tc', '高清抢先', '内部版', '预映版'
  ];
  
  const allText = `${remark} ${episode} ${qual}`;
  for (const keyword of nonTheatricalKeywords) {
    if (allText.includes(keyword)) {
      if (qual.includes('tc') || qual.includes('抢先') || remark.includes('tc') || remark.includes('抢先')) {
        return '抢先版';
      }
      return '非正片';
    }
  }
  
  if (remark.includes('纯享') || episode.includes('纯享')) return '纯享';
  if (remark.includes('番外') || episode.includes('番外')) return '番外';
  if (remark.includes('花絮') || episode.includes('花絮')) return '花絮';
  if (remark.includes('特辑') || episode.includes('特辑')) return '特辑';
  if (remark.includes('影视解说') || episode.includes('影视解说') ||
      remark.includes('影视频说') || episode.includes('影视频说') ||
      remark.includes('解说') || episode.includes('解说')) return '解说';
  
  return '正片';
}

function extractLanguageFromRemarks(vod_remarks, quality = '') {
  if (!vod_remarks) vod_remarks = '';
  if (!quality) quality = '';
  
  const combinedText = (vod_remarks + ' ' + quality).toLowerCase();
  
  const languageKeywords = {
    '国语': ['国语', '中文', '普通话', '大陆', '内地', '中字', '中文配音', '国配', '普通话版', '国语版'],
    '粤语': ['粤语', '粤', '广东话', '粤语配音'],
    '英语': ['英语', '英', '英文', '英语配音', '原声', 'english', '英字'],
    '日语': ['日语', '日', '日文', '日本', '日语配音', '日字'],
    '韩语': ['韩语', '韩', '韩文', '韩国', '韩语配音', '韩字'],
    '法语': ['法语', '法', '法文', '法国', '法语配音'],
    '多国': ['多国', '多语', '双语', '多语言', '多音轨']
  };
  
  for (const [lang, keywords] of Object.entries(languageKeywords)) {
    for (const keyword of keywords) {
      if (combinedText.includes(keyword.toLowerCase())) {
        return lang;
      }
    }
  }
  
  return '';
}

function generateMovieDescription(vod_name, vod_remarks, quality, featureTag, sourceName) {
  let cleanMovieName = vod_name
    .replace(/[（(][^）)]*[）)]/g, '')
    .replace(/[\(\[][^\)\]]*[\)\]]/g, '')
    .replace(/【[^】]*】/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  const descriptionParts = [cleanMovieName];
  
  if (featureTag !== '解说') {
    const languageTag = extractLanguageFromRemarks(vod_remarks, quality);
    if (languageTag === '国语') {
      descriptionParts.push(`[${languageTag}]`);
    }
  }
  
  if (featureTag === '抢先版') {
    descriptionParts.push(`[抢先]`);
  } else if (featureTag === '解说') {
    descriptionParts.push(`[解说]`);
  }
  
  return descriptionParts.join(' ');
}

function toChineseNumber(numStr) {
  const map = {
    '1': '一', '2': '二', '3': '三', '4': '四', '5': '五',
    '6': '六', '7': '七', '8': '八', '9': '九'
  };
  if (map[numStr]) return map[numStr];
  if (['一','二','三','四','五','六','七','八','九'].includes(numStr)) return numStr;
  const num = parseInt(numStr, 10);
  if (!isNaN(num) && num >= 1 && num <= 9) {
    return map[num.toString()];
  }
  return numStr;
}

function parseResourceSites(VodData) {
  const parseLine = (line) => {
    const [title, value] = line.split(',').map(s => s.trim());
    if (title && value?.startsWith('http')) {
      return { title, value: value.endsWith('/') ? value : value + '/' };
    }
    return null;
  };
  try {
    const trimmed = VodData?.trim() || "";
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      return JSON.parse(trimmed).map(s => ({ title: s.title || s.name, value: s.url || s.value })).filter(s => s.title && s.value);
    }
    return trimmed.split('\n').map(parseLine).filter(Boolean);
  } catch (e) {
    return RESOURCE_SITES.trim().split('\n').map(parseLine).filter(Boolean);
  }
}

function extractPlayInfoForCache(item, siteTitle, type, excludeKeywords = []) {
  const { vod_name, vod_play_url, vod_play_from, vod_remarks = '' } = item;
  if (!vod_name || !vod_play_url) return [];

  const playSources = vod_play_url.replace(/#+$/, '').split('$$$');
  const sourceNames = (vod_play_from || '').split('$$$');
  
  return playSources.flatMap((playSource, i) => {
    const sourceName = sourceNames[i] || '默认源';
    const isTV = playSource.includes('#');
    const results = [];

    if (type === 'tv' && isTV) {
      const episodes = playSource.split('#').filter(Boolean);
      
      episodes.forEach(ep => {
        const [rawEpName, url] = ep.split('$');
        if (url && isM3U8Url(url)) {
          const epNameClean = rawEpName.trim();
          
          const shouldExclude = excludeKeywords.some(keyword => 
            epNameClean.includes(keyword) || vod_remarks.includes(keyword)
          );
          if (shouldExclude) return;
          
          const parsedInfo = parseVarietyEpisode(epNameClean);
          if (!parsedInfo || !parsedInfo.isValid) return;
          
          const episodeInfoForSort = {
            seasonNum: parsedInfo.seasonNum,
            partOrder: parsedInfo.partOrder,
            subNumber: parsedInfo.subNumber || 0,
            originalSuffix: parsedInfo.originalSuffix || '',
            rawName: epNameClean,
            type: parsedInfo.type,
            hasPeriod: parsedInfo.hasPeriod
          };
          const featureTag = extractFeatureTag(vod_remarks, epNameClean);
          const healthScore = getSiteHealthManager().getHealthScore(siteTitle);
          
          results.push({
            name: siteTitle,
            description: `${vod_name} - ${rawEpName}${vod_remarks ? ' - ' + vod_remarks : ''} - [${sourceName}]`,
            url: url.trim(),
            _epInfo: episodeInfoForSort,
            _rawEpName: epNameClean,
            _originalEpForFilter: parsedInfo.seasonNum,
            _vodName: vod_name,
            _featureTag: featureTag,
            _sourceName: sourceName,
            _healthScore: healthScore,
            _siteTitle: siteTitle
          });
        }
      });
    } else if (type === 'movie' && !isTV) {
      const firstM3U8 = playSource.split('#').find(v => isM3U8Url(v.split('$')[1]));
      if (firstM3U8) {
        const [quality, url] = firstM3U8.split('$');
        
        const shouldExclude = excludeKeywords.some(keyword => 
          vod_name.includes(keyword) || vod_remarks.includes(keyword) || quality.includes(keyword)
        );
        if (shouldExclude) return results;
        
        const languageTag = extractLanguageFromRemarks(vod_remarks, quality);
        const featureTag = extractFeatureTag(vod_remarks, vod_name, quality);
        const healthScore = getSiteHealthManager().getHealthScore(siteTitle);
        const movieDescription = generateMovieDescription(vod_name, vod_remarks, quality, featureTag, sourceName);
        
        results.push({
          name: siteTitle,
          description: movieDescription,
          url: url.trim(),
          _featureTag: featureTag,
          _languageTag: languageTag,
          _healthScore: healthScore,
          _siteTitle: siteTitle
        });
      }
    }
    return results;
  });
}

function extractSubNumberText(rawName) {
  const match = rawName.match(/第\s*\d+\s*期\s*([\d一二三四五六七八九十]+)/);
  if (match) {
    return match[1];
  }
  return null;
}

function getNormalizedGroupKey(info) {
  if (info.seasonNum === 0) {
    return `pilot_${info.partOrder}_${info.subNumber}_${info.type}`;
  }
  let normalizedType = 0;
  if (info.subNumber > 0) {
    normalizedType = info.subNumber;
  } else if (info.partOrder > 0) {
    normalizedType = info.partOrder;
  }
  if (normalizedType === 0) {
    return `${info.seasonNum}_main`;
  } else if (normalizedType === 1) {
    return `${info.seasonNum}_main`;
  } else if (normalizedType <= 4) {
    return `${info.seasonNum}_part_${normalizedType}`;
  } else {
    return `${info.seasonNum}_sub_${info.subNumber}`;
  }
}

function assignContinuousEpisodeNumbers(resources, originalSeriesName) {
  const tvResources = resources.filter(r => r._epInfo);
  const nonTvResources = resources.filter(r => !r._epInfo);
  
  if (tvResources.length === 0) return resources;
  
  // 清理用户输入的剧名（移除括号）
  let baseSeriesName = (originalSeriesName || '')
    .replace(/[（(][^）)]*[）)]/g, '')
    .replace(/[\(\[][^\)\]]*[\)\]]/g, '')
    .replace(/【[^】]*】/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .trim();
  
  const groupKeySet = new Set();
  tvResources.forEach(res => {
    const key = getNormalizedGroupKey(res._epInfo);
    groupKeySet.add(key);
  });
  
  const pilotKeys = Array.from(groupKeySet).filter(k => k.startsWith('pilot_'));
  const normalKeys = Array.from(groupKeySet).filter(k => !k.startsWith('pilot_'));
  
  normalKeys.sort((a, b) => {
    const [seasonA, typeA, numA] = a.split('_');
    const [seasonB, typeB, numB] = b.split('_');
    const sA = parseInt(seasonA), sB = parseInt(seasonB);
    if (sA !== sB) return sA - sB;
    if (typeA === 'main' && typeB !== 'main') return -1;
    if (typeA !== 'main' && typeB === 'main') return 1;
    const nA = parseInt(numA) || 0;
    const nB = parseInt(numB) || 0;
    if (nA !== nB) return nA - nB;
    return 0;
  });
  
  const groupToEpisode = new Map();
  let nextEpisode = 1;
  for (const key of normalKeys) {
    groupToEpisode.set(key, nextEpisode++);
  }
  for (const key of pilotKeys) {
    groupToEpisode.set(key, 0);
  }
  
  const finalResources = tvResources.map(res => {
    const info = res._epInfo;
    const groupKey = getNormalizedGroupKey(info);
    const episodeNumber = groupToEpisode.get(groupKey);
    
    // 从资源名提取季数
    const { seasonNumber } = extractSeasonInfo(res._vodName);
    let seasonText = '';
    if (seasonNumber > 0) {
      const seasonChinese = toChineseNumber(seasonNumber.toString());
      seasonText = ` 第${seasonChinese}季`;
    }
    const cleanVodName = baseSeriesName + seasonText;
    
    const episodePart = `第${episodeNumber}集`;
    
    // 只有在明确匹配到“第X期”时才显示期数部分
    let periodPart = '';
    if (info.hasPeriod === true) {
      let suffix = info.originalSuffix || '';
      if (suffix) {
        const num = parseInt(suffix, 10);
        if (!isNaN(num) && num >= 1 && num <= 9) {
          suffix = toChineseNumber(suffix);
        }
        periodPart = `第${info.seasonNum}期 ${suffix}`;
      } else {
        periodPart = `第${info.seasonNum}期`;
      }
    }
    
    // 有上下部或子分集的资源强制标签为“正片”
    let displayTag = res._featureTag;
    if (info.partOrder > 0 || info.subNumber > 0) {
      displayTag = '正片';
    }
    
    const descriptionParts = [cleanVodName];
    if (episodePart) descriptionParts.push(episodePart);
    if (periodPart) descriptionParts.push(periodPart);
    if (displayTag) descriptionParts.push(`[${displayTag}]`);
    const newDescription = descriptionParts.join(' ');
    
    return {
      ...res,
      _ep: episodeNumber,
      description: newDescription
    };
  });
  
  return [...finalResources, ...nonTvResources];
}

function sortByConnectionHealth(resources) {
  if (resources.length <= 1) return resources;
  
  const groupedResources = {};
  resources.forEach(resource => {
    const key = `${resource._vodName || 'unknown'}_${resource._ep || 0}`;
    if (!groupedResources[key]) groupedResources[key] = [];
    groupedResources[key].push(resource);
  });
  
  const sortedResources = [];
  Object.values(groupedResources).forEach(group => {
    group.sort((a, b) => (b._healthScore || 0) - (a._healthScore || 0));
    sortedResources.push(...group);
  });
  return sortedResources;
}

// ======================== 懒加载健康度管理器 ========================
let siteHealthManagerInstance = null;

class SiteHealthManager {
  constructor() {
    this.healthStats = {};
    this.loadHealthStats();
  }
  loadHealthStats() {
    try {
      const stats = Widget.storage.get(SITE_HEALTH_KEY);
      if (stats && typeof stats === 'object') this.healthStats = stats;
    } catch (e) { this.healthStats = {}; }
  }
  saveHealthStats() {
    try { Widget.storage.set(SITE_HEALTH_KEY, this.healthStats); } catch (e) {}
  }
  recordRequest(siteTitle, responseTime, success, dataSize = 0) {
    if (!siteTitle) return;
    if (!this.healthStats[siteTitle]) {
      this.healthStats[siteTitle] = {
        totalRequests: 0, successRequests: 0, totalResponseTime: 0, totalDataSize: 0,
        recentHistory: [], healthScore: INITIAL_HEALTH_SCORE, lastUpdated: Date.now()
      };
    }
    const stats = this.healthStats[siteTitle];
    stats.totalRequests++;
    if (success) {
      stats.successRequests++;
      stats.totalResponseTime += responseTime;
      stats.totalDataSize += dataSize;
      stats.recentHistory.push({ timestamp: Date.now(), responseTime, success: true, dataSize });
    } else {
      stats.recentHistory.push({ timestamp: Date.now(), responseTime, success: false, dataSize: 0 });
    }
    if (stats.recentHistory.length > MAX_HEALTH_HISTORY) stats.recentHistory = stats.recentHistory.slice(-MAX_HEALTH_HISTORY);
    this.calculateHealthScore(siteTitle);
    stats.lastUpdated = Date.now();
    this.saveHealthStats();
  }
  calculateHealthScore(siteTitle) {
    const stats = this.healthStats[siteTitle];
    if (!stats || stats.totalRequests === 0) { if (stats) stats.healthScore = INITIAL_HEALTH_SCORE; return; }
    const successRate = stats.successRequests / stats.totalRequests;
    const avgResponseTime = stats.successRequests > 0 ? stats.totalResponseTime / stats.successRequests : 10000;
    let recentSuccessRate = 0, recentCount = 0;
    const oneHourAgo = Date.now() - 3600000;
    stats.recentHistory.forEach(record => {
      if (record.timestamp > oneHourAgo) { recentCount++; if (record.success) recentSuccessRate++; }
    });
    recentSuccessRate = recentCount > 0 ? recentSuccessRate / recentCount : successRate;
    const responseTimeScore = Math.max(0, Math.min(1, 1 - (avgResponseTime / 5000)));
    stats.healthScore = (recentSuccessRate * 0.6) + (successRate * 0.3) + (responseTimeScore * 0.1);
    stats.healthScore = Math.max(0, Math.min(1, stats.healthScore));
  }
  getHealthScore(siteTitle) {
    if (!this.healthStats[siteTitle]) return INITIAL_HEALTH_SCORE;
    const stats = this.healthStats[siteTitle];
    const hoursSinceUpdate = (Date.now() - stats.lastUpdated) / 3600000;
    if (hoursSinceUpdate > 24) return stats.healthScore * Math.max(0, 1 - (hoursSinceUpdate - 24) * 0.1);
    return stats.healthScore;
  }
  getSiteRankings() {
    const rankings = [];
    for (const [siteTitle, stats] of Object.entries(this.healthStats)) {
      rankings.push({
        siteTitle, healthScore: this.getHealthScore(siteTitle),
        successRate: stats.totalRequests > 0 ? stats.successRequests / stats.totalRequests : 0,
        avgResponseTime: stats.successRequests > 0 ? stats.totalResponseTime / stats.successRequests : 0,
        totalRequests: stats.totalRequests
      });
    }
    rankings.sort((a, b) => b.healthScore - a.healthScore);
    return rankings;
  }
}

function getSiteHealthManager() {
  if (!siteHealthManagerInstance) {
    siteHealthManagerInstance = new SiteHealthManager();
  }
  return siteHealthManagerInstance;
}

function parseExcludeKeywords(input) {
  if (!input || typeof input !== 'string') return [];
  const keywords = input.split(/[,\s\n\t]+/).filter(k => k.trim().length > 0);
  return [...new Set(keywords)];
}

// ======================== 核心：统一匹配逻辑 ========================
async function loadResource(params) {
  const { seriesName, type = 'tv', season, episode, VodData, excludeKeywords: userExcludeKeywords = "" } = params;
  if (!seriesName) return [];

  const excludeKeywords = parseExcludeKeywords(userExcludeKeywords);
  const resourceSites = parseResourceSites(VodData);
  
  const fullCleanOriginal = cleanTitle(seriesName);
  const baseName = extractBaseName(seriesName);
  const cleanBaseName = cleanTitle(baseName);
  
  let requestNumber = null;
  let hasNumberSuffix = false;
  const numberMatch = cleanBaseName.match(/^(.+?)(\d+)$/);
  if (numberMatch) {
    requestNumber = numberMatch[2];
    hasNumberSuffix = true;
  }
  
  let searchKeyword;
  if (hasNumberSuffix) {
    searchKeyword = numberMatch[1] + numberMatch[2];
  } else {
    searchKeyword = seriesName;
  }
  
  let baseKeyword = cleanBaseName.replace(/\d+$/, '');
  
  let targetSeason = season ? parseInt(season) : null;
  if (targetSeason === null && type === 'tv') {
    const seasonInfo = extractSeasonInfo(seriesName);
    targetSeason = seasonInfo.seasonNumber;
  }
  const targetEpisode = episode ? parseInt(episode) : null;
  
  const cacheKey = `vod_cache_${searchKeyword}_s${targetSeason}_${type}`;
  let allResources = [];
  
  try {
    const cached = Widget.storage.get(cacheKey);
    if (cached && Array.isArray(cached)) allResources = cached;
  } catch (e) {}
  
  const fetchFromSites = async (keyword, matchMode) => {
    const tasks = resourceSites.map(async (site) => {
      const startTime = Date.now();
      try {
        const response = await Widget.http.get(site.value, {
          params: { ac: "detail", wd: keyword },
          timeout: 8000
        });
        const endTime = Date.now();
        getSiteHealthManager().recordRequest(site.title, endTime - startTime, true, JSON.stringify(response.data).length);
        
        const list = response?.data?.list;
        if (!Array.isArray(list)) return [];
        
        return list.flatMap(item => {
          const cleanItemFull = cleanTitle(item.vod_name);
          
          let shouldMatch = false;
          if (matchMode === 'first') {
            const cleanKeyword = cleanTitle(keyword);
            if (type === 'tv' && hasNumberSuffix) {
              // 电视剧有数字后缀：要求资源名以 cleanKeyword 开头，并独立数字校验
              if (cleanItemFull.startsWith(cleanKeyword)) {
                shouldMatch = true;
                if (requestNumber) {
                  const numberPattern = new RegExp(`(^|[^\\d])${requestNumber}($|[^\\d])`);
                  if (!numberPattern.test(cleanItemFull)) {
                    shouldMatch = false;
                  }
                }
              }
            } else if (type === 'tv' && !hasNumberSuffix) {
              // 电视剧无数字后缀：精确相等匹配，或资源名以 cleanBaseName 开头（用于季数匹配）
              shouldMatch = cleanItemFull === fullCleanOriginal;
              if (!shouldMatch && cleanItemFull.startsWith(cleanBaseName)) {
                shouldMatch = true;
              }
            } else if (type === 'movie') {
              // 电影：仅精确相等匹配
              shouldMatch = cleanItemFull === fullCleanOriginal;
            }
          } else if (matchMode === 'fallback') {
            shouldMatch = cleanItemFull === fullCleanOriginal;
          }
          
          // 电视剧季数校验：仅当用户明确指定季数时进行
          if (type === 'tv' && shouldMatch && targetSeason !== null) {
            const itemSeasonInfo = extractSeasonInfo(item.vod_name);
            const itemSeason = itemSeasonInfo.seasonNumber;
            if (itemSeason !== targetSeason) {
              shouldMatch = false;
            }
          }
          
          if (shouldMatch) {
            return extractPlayInfoForCache(item, site.title, type, excludeKeywords);
          }
          return [];
        });
      } catch (error) {
        const endTime = Date.now();
        getSiteHealthManager().recordRequest(site.title, endTime - startTime, false, 0);
        return [];
      }
    });
    
    const results = await Promise.all(tasks);
    return results.flat();
  };
  
  if (allResources.length === 0) {
    let firstResults = await fetchFromSites(searchKeyword, 'first');
    const urlSet = new Set();
    firstResults = firstResults.filter(r => {
      if (urlSet.has(r.url)) return false;
      urlSet.add(r.url);
      return true;
    });
    
    if (firstResults.length === 0 && baseKeyword.length > 0) {
      const secondResults = await fetchFromSites(baseKeyword, 'fallback');
      secondResults.forEach(r => {
        if (!urlSet.has(r.url)) {
          urlSet.add(r.url);
          firstResults.push(r);
        }
      });
    }
    
    allResources = firstResults;
    
    if (type === 'tv') {
      allResources = assignContinuousEpisodeNumbers(allResources, seriesName);
    }
    
    if (allResources.length > 0) {
      try { Widget.storage.set(cacheKey, allResources, 10800); } catch (e) {}
    }
  }
  
  if (type === 'tv' && targetEpisode !== null) {
    allResources = allResources.filter(res => res._ep !== undefined && res._ep !== null && res._ep === targetEpisode);
  }
  
  // 排序
  if (type === 'movie') {
    allResources.sort((a, b) => {
      const aLang = a._languageTag || '';
      const bLang = b._languageTag || '';
      const aFeature = a._featureTag || '';
      const bFeature = b._featureTag || '';
      
      const getPriority = (lang, feature) => {
        if (feature === '解说') return 5;
        const isMandarin = lang === '国语';
        const isEarly = feature === '抢先版';
        if (isMandarin && isEarly) return 1;
        if (isMandarin && !isEarly) return 2;
        if (!isMandarin && isEarly) return 3;
        return 4;
      };
      
      const aPriority = getPriority(aLang, aFeature);
      const bPriority = getPriority(bLang, bFeature);
      
      if (aPriority !== bPriority) return aPriority - bPriority;
      return (b._healthScore || 0) - (a._healthScore || 0);
    });
  } else {
    // 电视剧排序：优先有上下部/子分集的资源（无论标签），然后按正片优先，再按集号，最后按健康度
    allResources.sort((a, b) => {
      const aHasExtra = (a._epInfo && (a._epInfo.partOrder > 0 || a._epInfo.subNumber > 0)) ? 1 : 0;
      const bHasExtra = (b._epInfo && (b._epInfo.partOrder > 0 || b._epInfo.subNumber > 0)) ? 1 : 0;
      if (aHasExtra !== bHasExtra) return bHasExtra - aHasExtra;

      const aIsTheatrical = a._featureTag === '正片';
      const bIsTheatrical = b._featureTag === '正片';
      if (aIsTheatrical !== bIsTheatrical) return bIsTheatrical - aIsTheatrical;

      const aEp = a._ep || 0;
      const bEp = b._ep || 0;
      if (aEp !== bEp) return aEp - bEp;

      return (b._healthScore || 0) - (a._healthScore || 0);
    });
  }
  
  return allResources;
}