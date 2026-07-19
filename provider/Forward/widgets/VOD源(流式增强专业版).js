// 文件名：vod_stream_enhanced_pro.js
// 模块：VOD 流式增强专业版
// 作者：MoYan
// 版本：4.0.0
// 描述：VOD聚合搜索(全源+快速+精准匹配+实时流式)
// 核心特性：
// 1. 全源搜索 - 搜索所有可用站点，不提前停止
// 2. 极速响应 - 智能并发+健康检查+缓存优化
// 3. 精准匹配 - 混合相似度算法+上下文匹配
// 4. 实时流式 - 搜到一个返回一个，实时反馈
// 5. 智能去重 - 内容相似性去重，避免重复

// ==================== 配置常量 ====================
const RESOURCE_SITES = `
非凡,http://ffzy5.tv/api.php/provide/vod
卧龙,https://wolongzyw.com/api.php/provide/vod
最大,https://api.zuidapi.com/api.php/provide/vod
百度,https://api.apibdzy.com/api.php/provide/vod
暴风,https://bfzyapi.com/api.php/provide/vod
极速,https://jszyapi.com/api.php/provide/vod
天涯,https://tyyszy.com/api.php/provide/vod
无尽,https://api.wujinapi.com/api.php/provide/vod
魔都,https://www.mdzyapi.com/api.php/provide/vod
三灵,https://360zy.com/api.php/provide/vod
天影,http://caiji.dyttzyapi.com/api.php/provide/vod
如意,https://cj.rycjapi.com/api.php/provide/vod
旺旺,https://wwzy.tv/api.php/provide/vod
红牛,https://www.hongniuzy2.com/api.php/provide/vod
光速,https://api.guangsuapi.com/api.php/provide/vod
爱坤,https://ikunzyapi.com/api.php/provide/vod
优酷,https://api.ukuapi.com/api.php/provide/vod
虎牙,https://www.huyaapi.com/api.php/provide/vod
新浪,http://api.xinlangapi.com/xinlangapi.php/provide/vod
乐子,https://cj.lziapi.com/api.php/provide/vod
海豚,https://hhzyapi.com/api.php/provide/vod
鲸鱼,https://jyzyapi.com/provide/vod
爱蛋,https://lovedan.net/api.php/provide/vod
魔影,https://www.moduzy.com/api.php/provide/vod
非凡,https://api.ffzyapi.com/api.php/provide/vod
非采,http://cj.ffzyapi.com/api.php/provide/vod
非云,https://cj.ffzyapi.com/api.php/provide/vod
非一,http://ffzy1.tv/api.php/provide/vod
卧采,https://collect.wolongzyw.com/api.php/provide/vod
暴影,https://app.bfzyapi.com/api.php/provide/vod
无境,https://api.wujinapi.me/api.php/provide/vod
天角,https://tyyszyapi.com/api.php/provide/vod
光速,http://api.guangsuapi.com/api.php/provide/vod
新影,https://api.xinlangapi.com/xinlangapi.php/provide/vod
清影,https://api.1080zyku.com/inc/apijson.php
乐影,http://cj.lziapi.com/api.php/provide/vod
优酷,https://api.ukuapi88.com/api.php/provide/vod
无星,https://api.wujinapi.cc/api.php/provide/vod
丫丫,https://cj.yayazy.net/api.php/provide/vod
卧星,https://collect.wolongzy.cc/api.php/provide/vod
无网,https://api.wujinapi.net/api.php/provide/vod
旺影,https://api.wwzy.tv/api.php/provide/vod
至大,http://zuidazy.me/api.php/provide/vod
樱花,https://m3u8.apiyhzy.com/api.php/provide/vod
步步,https://api.yparse.com/api/json
牛牛,https://api.niuniuzy.me/api.php/provide/vod
索尼,https://suoniapi.com/api.php/provide/vod
茅台,https://caiji.maotaizy.cc/api.php/provide/vod
豆瓣,https://dbzy.tv/api.php/provide/vod
速博,https://subocaiji.com/api.php/provide/vod
金鹰,https://jinyingzy.com/api.php/provide/vod
闪电,https://sdzyapi.com/api.php/provide/vod
飘零,https://p2100.net/api.php/provide/vod
魔漫,https://caiji.moduapi.cc/api.php/provide/vod
红影,https://www.hongniuzy3.com/api.php/provide/vod
索闪,https://xsd.sdzyapi.com/api.php/provide/vod
`;

// 中文数字映射
const CHINESE_NUM_MAP = {
  '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
  '六': 6, '七': 7, '八': 8, '九': 9, '十': 10
};

// ==================== 优化配置 ====================
const CONFIG = {
  // 性能配置
  MAX_CONCURRENT_REQUESTS: 8,
  MIN_CONCURRENT_REQUESTS: 3,
  REQUEST_TIMEOUT: 6000,
  RETRY_ATTEMPTS: 2,
  CACHE_TTL: 10800,
  
  // 主力源配置
  MAIN_SOURCES: ['非凡', '最大', '暴风', '极速', '天影', '豆瓣', '卧龙', '百度'],
  
  // 流式搜索配置
  STREAMING: {
    ENABLED: true,
    FAST_MODE_THRESHOLD: 25,
    MIN_RESULTS_FOR_STOP: 40,
    MAX_STREAM_RESULTS: 200,
    SKIP_BACKUP_IF_MAIN_SUCCESS: false,
  },
  
  // 智能匹配配置
  MATCH_THRESHOLDS: {
    SIMILARITY_EXACT: 0.96,
    SIMILARITY_STRICT: 0.87,
    SIMILARITY_LOOSE: 0.75,
    KEYWORD_MIN_MATCH: 0.65,
  },
  
  // 智能去重配置
  DEDUPLICATION: {
    ENABLED: true,
    SIMILARITY_THRESHOLD: 0.85,
    CHECK_CONTENT: true,
    CHECK_RESOLUTION: true,
  },
  
  // 结果排序权重
  SORT_WEIGHTS: {
    EXACT_MATCH: 100,
    FUZZY_MATCH: 85,
    LOOSE_MATCH: 70,
    FALLBACK_MATCH: 50,
    SEASON_MATCH_BONUS: 35,
    VARIETY_MATCH_BONUS: 25,
    MAIN_SOURCE: 20,
    HAS_EP_INFO: 20,
    RECENT_UPDATE: 10,
    RESOLUTION_BONUS: 30,
    QUALITY_TAG_BONUS: 18,
    HTTPS_BONUS: 12,
    VALIDATED_BONUS: 15,
  }
};

// ==================== 模块元数据 ====================
WidgetMetadata = {
  id: "vod_stream_enhanced_pro",
  title: "VOD源(流式增强专业版)",
  icon: "",
  version: "4.0.0",
  requiredVersion: "0.0.1",
  description: "VOD聚合搜索(全源+快速+精准匹配+实时流式)",
  author: "MoYan",
  site: "",
  globalParams: [
    {
      name: "multiSource",
      title: "聚合搜索",
      type: "enumeration",
      enumOptions: [
        { title: "启用", value: "enabled" },
        { title: "禁用", value: "disabled" }
      ],
      value: "enabled"
    },
    {
      name: "VodData",
      title: "自定义源配置",
      type: "input",
      value: RESOURCE_SITES
    },
    {
      name: "searchMode",
      title: "搜索模式",
      type: "enumeration",
      enumOptions: [
        { title: "智能流式", value: "smart_stream" },
        { title: "批量搜索", value: "batch" },
        { title: "自动选择", value: "auto" }
      ],
      value: "smart_stream"
    },
    {
      name: "matchStrictness",
      title: "匹配严格度",
      type: "enumeration",
      enumOptions: [
        { title: "宽松(匹配更多)", value: "loose" },
        { title: "标准", value: "standard" },
        { title: "严格(更准确)", value: "strict" }
      ],
      value: "standard"
    },
    {
      name: "preferResolution",
      title: "清晰度偏好",
      type: "enumeration",
      enumOptions: [
        { title: "自动", value: "auto" },
        { title: "4K优先", value: "4k" },
        { title: "1080P优先", value: "1080p" },
        { title: "720P优先", value: "720p" }
      ],
      value: "auto"
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

// ==================== 工具函数模块 ====================
const isM3U8Url = (url) => url?.toLowerCase().includes('m3u8') || false;

function deepCleanSeriesName(name) {
  if (!name) return '';
  let cleaned = String(name);
  
  const removablePatterns = [
    /剧场版|电影版|特别篇|SP|OVA/gi,
    /\s*(HD|高清|超清|蓝光|4K|1080[Pp]|720[Pp]|HDR|杜比|Dolby|HEVC|X265|X264)\s*/gi,
    /\s*(WEB[-\s]?DL|WEBRip|BluRay|BDrip|BDRip|HDTV|TVrip|HQC)\s*/gi,
    /\s*(国语|粤语|英语|日语|韩语|中字|双语|简繁|内封|内嵌|字幕|未删减|完整版|完结|全集|合集|番外)\s*/g,
    /[\[\]()【】《》「」『』]/g,
  ];
  
  removablePatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  cleaned = cleaned.replace(/\s*\d{4}\s*/g, ' ');
  cleaned = cleaned.replace(/第\d+[集话]/g, '');
  cleaned = cleaned.replace(/[\.\-\s]+$/g, '');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
}

function calculateStringSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;
  if (str1 === str2) return 1;
  
  const chars1 = new Set(str1.replace(/\s+/g, ''));
  const chars2 = new Set(str2.replace(/\s+/g, ''));
  
  if (chars1.size === 0 || chars2.size === 0) return 0;
  
  const intersection = new Set([...chars1].filter(x => chars2.has(x)));
  const union = new Set([...chars1, ...chars2]);
  
  return union.size === 0 ? 0 : intersection.size / union.size;
}

function calculateEditDistanceSimilarity(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  
  if (len1 === 0) return len2 === 0 ? 1 : 0;
  if (len2 === 0) return 0;
  
  const matrix = [];
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  
  const maxLen = Math.max(len1, len2);
  return maxLen === 0 ? 1 : 1 - matrix[len1][len2] / maxLen;
}

function calculateHybridSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;
  if (str1 === str2) return 1;
  
  const charSimilarity = calculateStringSimilarity(str1, str2);
  const editSimilarity = calculateEditDistanceSimilarity(str1, str2);
  
  return (charSimilarity * 0.6 + editSimilarity * 0.4);
}

function extractResolutionInfo(vodName, epName) {
  const text = (vodName + ' ' + (epName || '')).toLowerCase();
  let resolution = { 
    level: 0, 
    label: '未知', 
    isHD: false, 
    is4K: false,
    tags: [],
    qualityScore: 0
  };
  
  if (/4[Kk]|UHD|2160[Pp]/.test(text)) {
    resolution = { level: 5, label: '4K', isHD: true, is4K: true, tags: [], qualityScore: 30 };
  } else if (/1080[Pp]|蓝光|FHD/.test(text)) {
    resolution = { level: 4, label: '1080P', isHD: true, is4K: false, tags: [], qualityScore: 25 };
  } else if (/720[Pp]|HD/.test(text)) {
    resolution = { level: 3, label: '720P', isHD: true, is4K: false, tags: [], qualityScore: 20 };
  } else if (/480[Pp]|SD/.test(text)) {
    resolution = { level: 2, label: '480P', isHD: false, is4K: false, tags: [], qualityScore: 10 };
  } else if (/360[Pp]/.test(text)) {
    resolution = { level: 1, label: '360P', isHD: false, is4K: false, tags: [], qualityScore: 5 };
  }
  
  if (/HDR|杜比/.test(text)) {
    resolution.tags.push('hdr');
    resolution.qualityScore += 10;
  }
  if (/HEVC|H\.265/.test(text)) {
    resolution.tags.push('hevc');
    resolution.qualityScore += 8;
  }
  if (/BluRay|BD/.test(text)) {
    resolution.tags.push('bluray');
    resolution.qualityScore += 15;
  }
  if (/WEB[-\s]?DL/.test(text)) {
    resolution.tags.push('webdl');
    resolution.qualityScore += 12;
  }
  
  if (epName && epName.toLowerCase().includes('https')) {
    resolution.qualityScore += 5;
  }
  
  return resolution;
}

function extractEnhancedInfo(seriesName) {
  if (!seriesName) return { 
    baseName: '', 
    seasonNumber: 1,
    isVariety: false,
    varietyEpisode: null,
    varietyDate: null,
    year: null,
    region: 'other',
    rawName: seriesName
  };

  const rawName = String(seriesName);
  let baseName = rawName;
  let seasonNumber = 1;
  let isVariety = false;
  let varietyEpisode = null;
  let varietyDate = null;
  let year = null;
  let region = 'other';

  const yearMatch = rawName.match(/(?:20|19)(\d{2})/);
  if (yearMatch) year = parseInt(yearMatch[0]);

  const varietyEpisodeMatch = rawName.match(/第(\d+)期/);
  if (varietyEpisodeMatch) {
    isVariety = true;
    varietyEpisode = parseInt(varietyEpisodeMatch[1]) || 1;
  } else {
    const dateMatch = rawName.match(/(\d{4}年\d{1,2}月\d{1,2}日|\d{4}\.\d{1,2}\.\d{1,2}|\d{4}\d{2}\d{2})/);
    if (dateMatch) {
      isVariety = true;
      varietyDate = dateMatch[0];
    }
  }

  if (rawName.includes('大陆') || rawName.includes('国产') || rawName.includes('内地')) {
    region = 'cn';
  } else if (rawName.includes('港')) {
    region = 'hk';
  } else if (rawName.includes('台')) {
    region = 'tw';
  } else if (rawName.includes('美')) {
    region = 'us';
  } else if (rawName.includes('韩')) {
    region = 'kr';
  } else if (rawName.includes('日')) {
    region = 'jp';
  }

  const chineseMatch = rawName.match(/第([一二三四五六七八九十零\d]+)[季部季]/);
  if (chineseMatch) {
    const val = chineseMatch[1];
    seasonNumber = CHINESE_NUM_MAP[val] || parseInt(val) || 1;
    baseName = rawName.replace(/第[一二三四五六七八九十零\d]+[季部季]/, '');
  } else {
    const englishMatch = rawName.match(/[Ss]eason\s*(\d+)/i) || rawName.match(/[Ss](\d+)/);
    if (englishMatch) {
      seasonNumber = parseInt(englishMatch[1]) || 1;
      baseName = rawName.replace(/[Ss]eason\s*\d+/i, '').replace(/[Ss]\d+/, '');
    }
  }

  baseName = deepCleanSeriesName(baseName);

  return { 
    baseName,
    seasonNumber,
    isVariety,
    varietyEpisode,
    varietyDate,
    year,
    region,
    rawName
  };
}

function isSmartSeriesMatch(targetInfo, candidateInfo, matchStrictness = 'standard') {
  const targetName = targetInfo.baseName;
  const candidateName = candidateInfo.baseName;
  
  if (!targetName || !candidateName) {
    return { match: false, type: 'none', score: 0, confidence: 0 };
  }
  
  const similarity = calculateHybridSimilarity(targetName, candidateName);
  
  let thresholds = CONFIG.MATCH_THRESHOLDS;
  if (matchStrictness === 'strict') {
    thresholds = { 
      SIMILARITY_EXACT: 0.98, 
      SIMILARITY_STRICT: 0.92, 
      SIMILARITY_LOOSE: 0.80, 
      KEYWORD_MIN_MATCH: 0.75 
    };
  } else if (matchStrictness === 'loose') {
    thresholds = { 
      SIMILARITY_EXACT: 0.90, 
      SIMILARITY_STRICT: 0.80, 
      SIMILARITY_LOOSE: 0.60, 
      KEYWORD_MIN_MATCH: 0.50 
    };
  }
  
  if (similarity >= thresholds.SIMILARITY_EXACT) {
    return { 
      match: true, 
      type: 'exact', 
      score: 100,
      similarity: similarity,
      seasonMatch: targetInfo.seasonNumber === candidateInfo.seasonNumber,
      confidence: 0.95
    };
  } else if (similarity >= thresholds.SIMILARITY_STRICT) {
    return { 
      match: true, 
      type: 'fuzzy', 
      score: 85,
      similarity: similarity,
      seasonMatch: targetInfo.seasonNumber === candidateInfo.seasonNumber,
      confidence: 0.85
    };
  } else if (similarity >= thresholds.SIMILARITY_LOOSE) {
    return { 
      match: true, 
      type: 'loose', 
      score: 70,
      similarity: similarity,
      seasonMatch: targetInfo.seasonNumber === candidateInfo.seasonNumber,
      confidence: 0.70
    };
  } else if (targetInfo.rawName.includes(candidateInfo.rawName) || 
             candidateInfo.rawName.includes(targetInfo.rawName)) {
    return { 
      match: true, 
      type: 'fallback', 
      score: 50,
      similarity: similarity,
      seasonMatch: targetInfo.seasonNumber === candidateInfo.seasonNumber,
      confidence: 0.60
    };
  }
  
  return { match: false, type: 'none', score: 0, similarity: 0, confidence: 0 };
}

function extractPlayInfoForCache(item, siteTitle, type, matchInfo, targetInfo) {
  const { vod_name, vod_play_url, vod_play_from, vod_remarks = '' } = item;
  if (!vod_name || !vod_play_url) return [];

  const playSources = vod_play_url.replace(/#+$/, '').split('$$$');
  const sourceNames = (vod_play_from || '').split('$$$');
  const results = [];

  playSources.forEach((playSource, i) => {
    const sourceName = sourceNames[i] || '默认源';
    const isTV = playSource.includes('#');

    if (type === 'tv' && isTV) {
      const episodes = playSource.split('#').filter(Boolean);
      episodes.forEach(ep => {
        const [epName, url] = ep.split('$');
        if (url && isM3U8Url(url)) {
          const epMatch = epName.match(/第(\d+)(集|期)/);
          const episodeNumber = epMatch ? parseInt(epMatch[1]) : null;
          
          const resolutionInfo = extractResolutionInfo(vod_name, epName);
          
          const dateMatch = epName.match(/(\d{4}年\d{1,2}月\d{1,2}日|\d{4}\.\d{1,2}\.\d{1,2}|\d{4}\d{2}\d{2})/);
          
          const resource = {
            name: siteTitle,
            description: `${vod_name} - ${epName}${vod_remarks ? ' - ' + vod_remarks : ''} - [${sourceName}]`,
            url: url.trim(),
            
            resolution: resolutionInfo.label,
            resolutionLevel: resolutionInfo.level,
            isHD: resolutionInfo.isHD,
            is4K: resolutionInfo.is4K,
            qualityTags: resolutionInfo.tags,
            qualityScore: resolutionInfo.qualityScore,
            isHttps: url.startsWith('https'),
            
            _ep: episodeNumber,
            _episodeDate: dateMatch ? dateMatch[0] : null,
            _isVariety: dateMatch !== null || epMatch?.[2] === '期',
            _matchType: matchInfo.type,
            _matchScore: matchInfo.score,
            _confidence: matchInfo.confidence,
            _isMainSource: CONFIG.MAIN_SOURCES.includes(siteTitle),
            _hasEpInfo: episodeNumber !== null || dateMatch !== null,
            _updateRecency: vod_remarks.includes('更新') || vod_remarks.includes('第') ? 1 : 0,
            _seasonMatch: matchInfo.seasonMatch
          };
          
          results.push(resource);
        }
      });
    } else if (type === 'movie' && !isTV) {
      const firstM3U8 = playSource.split('#').find(v => isM3U8Url(v.split('$')[1]));
      if (firstM3U8) {
        const [quality, url] = firstM3U8.split('$');
        const qualityText = quality.toLowerCase().includes('tc') ? '抢先版' : '正片';
        
        const resolutionInfo = extractResolutionInfo(vod_name, quality);
        
        const resource = {
          name: siteTitle,
          description: `${vod_name} - ${qualityText} - [${sourceName}]`,
          url: url.trim(),
          
          resolution: resolutionInfo.label,
          resolutionLevel: resolutionInfo.level,
          isHD: resolutionInfo.isHD,
          is4K: resolutionInfo.is4K,
          qualityTags: resolutionInfo.tags,
          qualityScore: resolutionInfo.qualityScore,
          isHttps: url.startsWith('https'),
          
          _matchType: matchInfo.type,
          _matchScore: matchInfo.score,
          _confidence: matchInfo.confidence,
          _isMainSource: CONFIG.MAIN_SOURCES.includes(siteTitle),
          _hasEpInfo: false,
          _updateRecency: vod_remarks.includes('更新') ? 1 : 0,
          _seasonMatch: matchInfo.seasonMatch
        };
        
        results.push(resource);
      }
    }
  });

  return results;
}

function parseResourceSites(VodData) {
  const parseLine = (line) => {
    const [title, value] = line.split(',').map(s => s.trim());
    if (title && value?.startsWith('http')) {
      const normalizedValue = (value.endsWith('/') || value.includes('.php') || value.includes('/json')) ? value : value + '/';
      return { 
        title, 
        value: normalizedValue,
        isMain: CONFIG.MAIN_SOURCES.includes(title)
      };
    }
    return null;
  };

  try {
    const trimmed = VodData?.trim() || '';
    if (trimmed === '') {
      return RESOURCE_SITES.trim().split('\n').map(parseLine).filter(Boolean);
    }

    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map(s => ({ 
          title: s.title || s.name, 
          value: s.url || s.value,
          isMain: CONFIG.MAIN_SOURCES.includes(s.title || s.name)
        })).filter(s => s.title && s.value);
      } else if (typeof parsed === 'object') {
        return Object.entries(parsed).map(([title, value]) => ({ 
          title, 
          value: String(value),
          isMain: CONFIG.MAIN_SOURCES.includes(title)
        })).filter(s => s.title && s.value);
      }
    }
    
    return trimmed.split('\n').map(parseLine).filter(Boolean);
  } catch (e) {
    return RESOURCE_SITES.trim().split('\n').map(parseLine).filter(Boolean);
  }
}

async function fetchWithSmartRetry(url, params, retries, siteTitle) {
  let lastError;
  
  for (let i = 0; i <= retries; i++) {
    try {
      const searchParams = {
        ...params,
        params: {
          ...params.params,
          t: params.params.t || (params.params.wd?.includes('综艺') ? 4 : 2)
        }
      };
      
      const response = await Widget.http.get(url, {
        ...searchParams,
        timeout: CONFIG.REQUEST_TIMEOUT
      });
      
      if (!response?.data?.list || response.data.list.length === 0) {
        delete searchParams.params.t;
        const fallbackResponse = await Widget.http.get(url, {
          ...searchParams,
          timeout: CONFIG.REQUEST_TIMEOUT
        });
        return fallbackResponse;
      }
      
      return response;
    } catch (error) {
      lastError = error;
      if (i < retries) {
        const delay = 1000 * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

function calculateResourceScore(resource, preferResolution = 'auto') {
  let score = resource._matchScore || 0;
  const weights = CONFIG.SORT_WEIGHTS;
  
  if (resource._matchType === 'exact') score += weights.EXACT_MATCH;
  else if (resource._matchType === 'fuzzy') score += weights.FUZZY_MATCH;
  else if (resource._matchType === 'loose') score += weights.LOOSE_MATCH;
  else if (resource._matchType === 'fallback') score += weights.FALLBACK_MATCH;
  
  if (resource._seasonMatch) score += weights.SEASON_MATCH_BONUS;
  if (resource._isVariety && resource._hasEpInfo) score += weights.VARIETY_MATCH_BONUS;
  if (resource._isMainSource) score += weights.MAIN_SOURCE;
  if (resource._hasEpInfo) score += weights.HAS_EP_INFO;
  if (resource._updateRecency) score += weights.RECENT_UPDATE;
  
  score += weights.RESOLUTION_BONUS * (resource.resolutionLevel / 5);
  
  if (resource.qualityScore > 0) {
    score += weights.QUALITY_TAG_BONUS * (Math.min(resource.qualityScore, 30) / 30);
  }
  
  if (resource.isHttps) {
    score += weights.HTTPS_BONUS;
  }
  
  if (resource._confidence > 0) {
    score += weights.VALIDATED_BONUS * resource._confidence;
  }
  
  if (preferResolution === '4k' && resource.is4K) {
    score += 35;
  } else if (preferResolution === '1080p' && resource.resolutionLevel >= 4) {
    score += 25;
  } else if (preferResolution === '720p' && resource.resolutionLevel >= 3) {
    score += 15;
  }
  
  return Math.min(score, 200);
}

// ==================== 智能站点管理模块 ====================
class SiteManager {
  constructor() {
    this.sites = new Map();
    this.stats = new Map();
    this.healthCache = new Map();
  }
  
  initializeSites(resourceSites) {
    resourceSites.forEach(site => {
      const siteKey = `${site.title}_${site.value}`;
      this.sites.set(siteKey, {
        ...site,
        isHealthy: true,
        lastCheck: 0,
        responseTime: 0,
        successRate: 1.0,
        priority: site.isMain ? 1 : 0.5
      });
      
      this.stats.set(siteKey, {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        avgResponseTime: 0
      });
    });
    
    return this.getSortedSites();
  }
  
  getSortedSites() {
    return Array.from(this.sites.values())
      .sort((a, b) => {
        if (a.isHealthy !== b.isHealthy) {
          return b.isHealthy ? 1 : -1;
        }
        if (b.priority !== a.priority) {
          return b.priority - a.priority;
        }
        return a.responseTime - b.responseTime;
      });
  }
  
  async checkSiteHealth(site, timeout = 2000) {
    const siteKey = `${site.title}_${site.value}`;
    const now = Date.now();
    
    if (this.healthCache.has(siteKey)) {
      const cached = this.healthCache.get(siteKey);
      if (now - cached.timestamp < 300000) {
        return cached.isHealthy;
      }
    }
    
    try {
      const startTime = Date.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(site.value, {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }).finally(() => clearTimeout(timeoutId));
      
      const responseTime = Date.now() - startTime;
      const isHealthy = response.ok;
      
      const siteInfo = this.sites.get(siteKey);
      if (siteInfo) {
        siteInfo.isHealthy = isHealthy;
        siteInfo.lastCheck = now;
        siteInfo.responseTime = responseTime;
        
        if (!isHealthy) {
          siteInfo.priority = Math.max(0.1, siteInfo.priority * 0.7);
        } else {
          siteInfo.priority = Math.min(1, siteInfo.priority * 1.05);
        }
      }
      
      this.updateStats(siteKey, isHealthy, responseTime);
      
      this.healthCache.set(siteKey, {
        isHealthy,
        timestamp: now,
        responseTime
      });
      
      return isHealthy;
    } catch (error) {
      const siteInfo = this.sites.get(siteKey);
      if (siteInfo) {
        siteInfo.isHealthy = false;
        siteInfo.lastCheck = now;
        siteInfo.priority = Math.max(0.1, siteInfo.priority * 0.5);
      }
      
      this.updateStats(siteKey, false, 0);
      this.healthCache.set(siteKey, {
        isHealthy: false,
        timestamp: now,
        responseTime: 0
      });
      
      return false;
    }
  }
  
  updateStats(siteKey, success, responseTime) {
    const stats = this.stats.get(siteKey) || {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      avgResponseTime: 0
    };
    
    stats.totalRequests++;
    if (success) {
      stats.successfulRequests++;
      stats.avgResponseTime = (stats.avgResponseTime * (stats.successfulRequests - 1) + responseTime) / stats.successfulRequests;
    } else {
      stats.failedRequests++;
    }
    
    this.stats.set(siteKey, stats);
  }
  
  getOptimalConcurrency() {
    const healthyCount = Array.from(this.sites.values())
      .filter(site => site.isHealthy).length;
    
    if (healthyCount <= 5) return CONFIG.MIN_CONCURRENT_REQUESTS;
    if (healthyCount <= 10) return 4;
    if (healthyCount <= 20) return 6;
    return CONFIG.MAX_CONCURRENT_REQUESTS;
  }
}

// ==================== 智能搜索执行模块 ====================
class SmartSearchExecutor {
  constructor(siteManager, targetInfo, type, matchStrictness) {
    this.siteManager = siteManager;
    this.targetInfo = targetInfo;
    this.type = type;
    this.matchStrictness = matchStrictness;
    
    this.allResults = [];
    this.seenUrls = new Set();
    this.seenContent = new Map();
    this.foundCount = 0;
    this.isSearching = true;
    
    this.stats = {
      totalSites: 0,
      completedSites: 0,
      successfulSites: 0,
      failedSites: 0,
      skippedSites: 0
    };
  }
  
  async search(onResultCallback = null) {
    const sites = this.siteManager.getSortedSites();
    this.stats.totalSites = sites.length;
    
    console.log(`🔍 开始智能搜索: ${this.targetInfo.rawName}`);
    console.log(`📊 可用站点: ${sites.length}个`);
    
    const siteGroups = this.groupSitesByPriority(sites);
    let allResults = [];
    
    for (const group of siteGroups) {
      if (!this.isSearching) {
        console.log(`⏹️ 搜索被停止，跳过剩余站点`);
        break;
      }
      
      const groupResults = await this.searchSiteGroup(group, onResultCallback);
      allResults.push(...groupResults);
      
      allResults = this.smartDeduplicate(allResults);
    }
    
    return allResults;
  }
  
  groupSitesByPriority(sites) {
    const groups = {
      high: [],
      medium: [],
      low: []
    };
    
    sites.forEach(site => {
      if (!site.isHealthy) {
        this.stats.skippedSites++;
        return;
      }
      
      if (site.isMain || site.priority > 0.8) {
        groups.high.push(site);
      } else if (site.priority > 0.5) {
        groups.medium.push(site);
      } else {
        groups.low.push(site);
      }
    });
    
    return [groups.high, groups.medium, groups.low].filter(group => group.length > 0);
  }
  
  async searchSiteGroup(sites, onResultCallback) {
    const concurrency = this.siteManager.getOptimalConcurrency();
    console.log(`🎯 搜索组: ${sites.length}个站点, 并发: ${concurrency}`);
    
    const executing = new Set();
    const allGroupResults = [];
    
    for (let i = 0; i < sites.length; i++) {
      if (!this.isSearching) break;
      
      const site = sites[i];
      
      while (executing.size >= concurrency) {
        await Promise.race(Array.from(executing));
      }
      
      const searchPromise = this.searchSingleSite(site, onResultCallback)
        .then(results => {
          allGroupResults.push(...results);
          return results;
        })
        .finally(() => {
          executing.delete(searchPromise);
        });
      
      executing.add(searchPromise);
      
      if (site.responseTime < 1000 && executing.size >= concurrency) {
        await Promise.race(Array.from(executing));
      }
    }
    
    await Promise.allSettled(Array.from(executing));
    
    return allGroupResults;
  }
  
  async searchSingleSite(site, onResultCallback) {
    if (!this.isSearching) return [];
    
    const siteStartTime = Date.now();
    const siteKey = `${site.title}_${site.value}`;
    
    try {
      const response = await this.fetchWithSmartRetry(site, this.targetInfo.baseName);
      
      if (!response?.data?.list) {
        this.stats.completedSites++;
        this.stats.skippedSites++;
        return [];
      }
      
      const siteResults = [];
      const matchedItems = [];
      
      for (const item of response.data.list) {
        if (!item.vod_name) continue;
        
        const candidateInfo = extractEnhancedInfo(item.vod_name);
        const matchResult = isSmartSeriesMatch(this.targetInfo, candidateInfo, this.matchStrictness);
        
        if (matchResult.match && matchResult.confidence >= 0.6) {
          matchedItems.push({ item, matchResult });
          
          if (matchResult.confidence >= 0.9) {
            const resources = extractPlayInfoForCache(item, site.title, this.type, matchResult, this.targetInfo);
            siteResults.push(...this.processImmediateResults(resources, site, onResultCallback));
          }
        }
      }
      
      for (const { item, matchResult } of matchedItems) {
        if (matchResult.confidence < 0.9) {
          const resources = extractPlayInfoForCache(item, site.title, this.type, matchResult, this.targetInfo);
          siteResults.push(...this.processImmediateResults(resources, site, onResultCallback));
        }
      }
      
      this.stats.completedSites++;
      this.stats.successfulSites++;
      
      const searchTime = Date.now() - siteStartTime;
      console.log(`✅ ${site.title}: 找到${siteResults.length}个结果 (${searchTime}ms)`);
      
      return siteResults;
      
    } catch (error) {
      this.stats.completedSites++;
      this.stats.failedSites++;
      console.warn(`❌ ${site.title}: 搜索失败 (${error.message})`);
      return [];
    }
  }
  
  async fetchWithSmartRetry(site, keyword, maxRetries = CONFIG.RETRY_ATTEMPTS) {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const params = {
          ac: "detail",
          wd: keyword,
          t: this.type === 'movie' ? 1 : (this.targetInfo.isVariety ? 4 : 2)
        };
        
        if (site.value.includes('ffzy') || site.value.includes('wolong')) {
          if (this.targetInfo.year) {
            params.y = this.targetInfo.year;
          }
        }
        
        const response = await Widget.http.get(site.value, {
          params,
          timeout: CONFIG.REQUEST_TIMEOUT
        });
        
        return response;
      } catch (error) {
        lastError = error;
        
        if (attempt < maxRetries) {
          const baseDelay = 1000 * Math.pow(2, attempt);
          const jitter = Math.random() * 1000;
          const delay = baseDelay + jitter;
          
          console.log(`⏱️ ${site.title} 请求失败，${delay}ms后重试 (${error.message})`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }
  
  processImmediateResults(resources, site, onResultCallback) {
    const newResults = [];
    
    for (const resource of resources) {
      if (this.seenUrls.has(resource.url)) continue;
      
      this.seenUrls.add(resource.url);
      resource._searchTime = Date.now();
      resource._site = site.title;
      resource._priority = site.priority;
      
      if (!this.isContentDuplicate(resource)) {
        this.foundCount++;
        newResults.push(resource);
        
        if (onResultCallback) {
          const cleanResource = cleanResourceForOutput(resource);
          onResultCallback([cleanResource], {
            type: 'immediate_result',
            site: site.title,
            matchType: resource._matchType,
            confidence: resource._confidence || 0.7,
            foundCount: this.foundCount
          });
        }
      }
    }
    
    return newResults;
  }
  
  isContentDuplicate(resource) {
    if (!CONFIG.DEDUPLICATION.ENABLED) return false;
    
    const contentKey = this.generateContentKey(resource);
    
    for (const [existingKey, existingResource] of this.seenContent.entries()) {
      const similarity = calculateStringSimilarity(contentKey, existingKey);
      
      if (similarity >= CONFIG.DEDUPLICATION.SIMILARITY_THRESHOLD) {
        const existingScore = calculateResourceScore(existingResource);
        const newScore = calculateResourceScore(resource);
        
        if (newScore > existingScore) {
          this.seenContent.delete(existingKey);
          this.seenContent.set(contentKey, resource);
          return false;
        }
        return true;
      }
    }
    
    this.seenContent.set(contentKey, resource);
    return false;
  }
  
  generateContentKey(resource) {
    const parts = [
      resource.name,
      resource.description?.substring(0, 50) || '',
      resource.resolution || '',
      resource.resolutionLevel || 0
    ];
    
    return parts.join('_');
  }
  
  shouldStopSearch() {
    if (this.foundCount >= CONFIG.STREAMING.MIN_RESULTS_FOR_STOP) {
      const highQualityCount = this.allResults.filter(r => 
        r._matchType === 'exact' || r._matchType === 'fuzzy'
      ).length;
      
      if (highQualityCount >= 15) {
        console.log(`🎯 已找到${highQualityCount}个高质量结果，可提前结束`);
        return true;
      }
    }
    
    const completionRate = this.stats.completedSites / this.stats.totalSites;
    if (completionRate >= 0.8 && this.foundCount >= 20) {
      return true;
    }
    
    return false;
  }
  
  smartDeduplicate(results) {
    if (!CONFIG.DEDUPLICATION.ENABLED || results.length < 2) {
      return results;
    }
    
    const uniqueResults = [];
    const urlMap = new Map();
    const contentMap = new Map();
    
    results.sort((a, b) => calculateResourceScore(b) - calculateResourceScore(a));
    
    for (const resource of results) {
      const url = resource.url;
      
      if (urlMap.has(url)) {
        const existing = urlMap.get(url);
        if (calculateResourceScore(resource) > calculateResourceScore(existing)) {
          const index = uniqueResults.indexOf(existing);
          if (index > -1) {
            uniqueResults.splice(index, 1);
          }
          urlMap.set(url, resource);
          uniqueResults.push(resource);
        }
        continue;
      }
      
      const contentKey = this.generateContentKey(resource);
      let isDuplicate = false;
      
      for (const [existingKey, existingResource] of contentMap.entries()) {
        if (calculateStringSimilarity(contentKey, existingKey) >= CONFIG.DEDUPLICATION.SIMILARITY_THRESHOLD) {
          isDuplicate = true;
          
          if (calculateResourceScore(resource) > calculateResourceScore(existingResource)) {
            const index = uniqueResults.indexOf(existingResource);
            if (index > -1) {
              uniqueResults.splice(index, 1);
            }
            contentMap.delete(existingKey);
            break;
          }
        }
      }
      
      if (!isDuplicate) {
        urlMap.set(url, resource);
        contentMap.set(contentKey, resource);
        uniqueResults.push(resource);
      }
    }
    
    return uniqueResults;
  }
  
  stop() {
    this.isSearching = false;
  }
}

// ==================== 主函数模块 ====================
function cleanResourceForOutput(resource) {
  const clean = { ...resource };
  
  const fieldsToDelete = [
    '_finalScore', '_matchType', '_matchScore', '_seasonMatch', 
    '_isMainSource', '_hasEpInfo', '_updateRecency', '_ep', 
    '_isVariety', '_episodeDate', '_searchTime', '_site', '_priority',
    '_confidence'
  ];
  
  fieldsToDelete.forEach(field => {
    if (field in clean) delete clean[field];
  });
  
  if (!clean.resolution) {
    clean.resolution = '未知';
    clean.resolutionLevel = 0;
    clean.isHD = false;
    clean.is4K = false;
    clean.qualityTags = [];
    clean.qualityScore = 0;
    clean.isHttps = clean.url.startsWith('https');
  }
  
  if (clean.resolutionLevel >= 5) {
    clean.recommended = '4K超清';
  } else if (clean.resolutionLevel >= 4 && clean.qualityScore > 20) {
    clean.recommended = '蓝光高清';
  } else if (clean.resolutionLevel >= 3) {
    clean.recommended = '高清';
  } else if (clean.qualityScore > 15) {
    clean.recommended = '高质量';
  }
  
  return clean;
}

async function loadResource(params, onStreamResult = null) {
  const { 
    seriesName, 
    type = 'tv', 
    season, 
    episode, 
    multiSource, 
    VodData,
    matchStrictness = 'standard',
    preferResolution = 'auto',
    searchMode = 'smart_stream'
  } = params;

  if (multiSource !== "enabled" || !seriesName) {
    return [];
  }

  console.log(`🚀 启动智能搜索: ${seriesName}`);
  console.log(`⚙️ 模式: ${searchMode}, 严格度: ${matchStrictness}`);
  
  const startTime = Date.now();
  
  const resourceSites = parseResourceSites(VodData);
  if (resourceSites.length === 0) {
    onStreamResult && onStreamResult([], { type: 'error', message: '无可用资源站' });
    return [];
  }
  
  const targetInfo = extractEnhancedInfo(seriesName);
  const targetSeason = season ? parseInt(season) : targetInfo.seasonNumber;
  const targetEpisode = episode ? parseInt(episode) : null;
  targetInfo.seasonNumber = targetSeason;
  
  const cacheKey = `vod_smart_${targetInfo.baseName}_s${targetSeason}_${type}_${matchStrictness}`;
  let cachedResults = [];
  
  if (CONFIG.CACHE_TTL > 0) {
    try {
      cachedResults = Widget.storage?.get?.(cacheKey) || [];
      if (cachedResults.length > 0) {
        console.log(`💾 缓存命中: ${cachedResults.length}个结果`);
        
        if (onStreamResult) {
          const batchSize = 5;
          for (let i = 0; i < cachedResults.length; i += batchSize) {
            const batch = cachedResults.slice(i, i + batchSize);
            onStreamResult(batch, {
              type: 'cached_results',
              batch: Math.floor(i / batchSize) + 1,
              totalBatches: Math.ceil(cachedResults.length / batchSize),
              foundCount: cachedResults.length
            });
            
            await new Promise(resolve => setTimeout(resolve, 50));
          }
          
          onStreamResult(cachedResults, {
            type: 'complete',
            source: 'cache',
            totalCount: cachedResults.length,
            searchTime: Date.now() - startTime
          });
        }
        
        return cachedResults;
      }
    } catch (e) {
      console.warn('缓存读取失败:', e.message);
    }
  }
  
  let finalResults = [];
  
  if (searchMode === 'smart_stream' || searchMode === 'auto') {
    console.log('🎯 使用智能流式搜索模式');
    finalResults = await performSmartSearch(params, onStreamResult);
  } else {
    console.log('🔍 使用批量搜索模式');
    finalResults = await performBatchSearch(params);
  }
  
  if (type === 'tv' && targetEpisode) {
    const beforeFilter = finalResults.length;
    finalResults = finalResults.filter(res => 
      (res._ep === targetEpisode) ||
      (res.description && res.description.includes(`第${targetEpisode}集`))
    );
    console.log(`🎯 集数过滤: ${beforeFilter} -> ${finalResults.length}`);
  }
  
  finalResults.forEach(res => {
    res._finalScore = calculateResourceScore(res, preferResolution);
  });
  
  finalResults.sort((a, b) => {
    if (b._finalScore !== a._finalScore) return b._finalScore - a._finalScore;
    if (b.resolutionLevel !== a.resolutionLevel) return b.resolutionLevel - a.resolutionLevel;
    if (b.qualityScore !== a.qualityScore) return b.qualityScore - a.qualityScore;
    if (b.isHttps !== a.isHttps) return b.isHttps ? 1 : -1;
    return 0;
  });
  
  const fieldsToDelete = [
    '_finalScore', '_matchType', '_matchScore', '_seasonMatch', 
    '_isMainSource', '_hasEpInfo', '_updateRecency', '_ep', 
    '_isVariety', '_episodeDate', '_searchTime', '_site', '_priority'
  ];
  
  finalResults.forEach(res => {
    fieldsToDelete.forEach(field => {
      if (field in res) delete res[field];
    });
    
    if (!res.resolution) {
      res.resolution = '未知';
      res.resolutionLevel = 0;
      res.isHD = false;
      res.is4K = false;
      res.qualityTags = [];
      res.qualityScore = 0;
      res.isHttps = res.url.startsWith('https');
    }
    
    if (res.resolutionLevel >= 5) {
      res.recommended = '4K超清';
    } else if (res.resolutionLevel >= 4 && res.qualityScore > 20) {
      res.recommended = '蓝光高清';
    } else if (res.resolutionLevel >= 3) {
      res.recommended = '高清';
    } else if (res.qualityScore > 15) {
      res.recommended = '高质量';
    }
  });
  
  if (finalResults.length > 0 && CONFIG.CACHE_TTL > 0) {
    try {
      Widget.storage?.set?.(cacheKey, finalResults, CONFIG.CACHE_TTL);
      console.log(`💾 已缓存 ${finalResults.length} 个结果`);
    } catch (e) {
      console.warn('缓存写入失败:', e.message);
    }
  }
  
  const totalTime = Date.now() - startTime;
  console.log(`✅ 搜索完成! 总计: ${finalResults.length}个结果, 耗时: ${totalTime}ms`);
  
  if (onStreamResult) {
    onStreamResult(finalResults, {
      type: 'complete',
      totalCount: finalResults.length,
      searchTime: totalTime,
      cached: cachedResults.length > 0
    });
  }
  
  return finalResults;
}

async function performSmartSearch(params, onStreamResult) {
  const { 
    seriesName, 
    type = 'tv', 
    VodData,
    matchStrictness = 'standard'
  } = params;
  
  const startTime = Date.now();
  
  const siteManager = new SiteManager();
  const resourceSites = parseResourceSites(VodData);
  const sortedSites = siteManager.initializeSites(resourceSites);
  
  const targetInfo = extractEnhancedInfo(seriesName);
  
  const quickCheckSites = sortedSites.slice(0, 10);
  const healthChecks = quickCheckSites.map(site => 
    siteManager.checkSiteHealth(site, 1500)
  );
  
  await Promise.allSettled(healthChecks);
  
  const executor = new SmartSearchExecutor(siteManager, targetInfo, type, matchStrictness);
  
  const allResults = await executor.search(onStreamResult);
  
  const stats = executor.stats;
  const totalTime = Date.now() - startTime;
  
  console.log(`
📊 搜索统计报告:
   总耗时: ${totalTime}ms
   总站点: ${stats.totalSites}
   完成站点: ${stats.completedSites}
   成功站点: ${stats.successfulSites}
   失败站点: ${stats.failedSites}
   跳过站点: ${stats.skippedSites}
   找到结果: ${allResults.length}
  `);
  
  return allResults;
}

async function performBatchSearch(params) {
  const { 
    seriesName, 
    type = 'tv', 
    season, 
    episode, 
    VodData,
    matchStrictness = 'standard',
    preferResolution = 'auto'
  } = params;

  console.log(`🔍 启动批量搜索: ${seriesName}`);
  const startTime = Date.now();
  
  const resourceSites = parseResourceSites(VodData);
  if (resourceSites.length === 0) {
    return [];
  }

  const targetInfo = extractEnhancedInfo(seriesName);
  const targetSeason = season ? parseInt(season) : targetInfo.seasonNumber;
  const targetEpisode = episode ? parseInt(episode) : null;
  targetInfo.seasonNumber = targetSeason;

  const cacheKey = `vod_batch_${targetInfo.baseName}_s${targetSeason}_${type}`;
  let allResults = [];

  try {
    const cached = Widget.storage?.get?.(cacheKey);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      console.log(`✅ 批量模式缓存命中: ${cached.length}个结果`);
      allResults = cached;
    }
  } catch (e) {
    console.warn('读取缓存失败');
  }

  if (allResults.length === 0) {
    const stats = { total: resourceSites.length, success: 0, failed: 0 };
    
    const requestTasks = resourceSites.map(site => async () => {
      try {
        const retries = site.isMain ? CONFIG.RETRY_ATTEMPTS : 1;
        const response = await fetchWithSmartRetry(
          site.value,
          { params: { ac: "detail", wd: targetInfo.baseName } },
          retries,
          site.title
        );

        if (!response?.data?.list) {
          stats.failed++;
          return [];
        }

        let siteResults = [];
        for (const item of response.data.list) {
          if (!item.vod_name) continue;
          
          const candidateInfo = extractEnhancedInfo(item.vod_name);
          const matchResult = isSmartSeriesMatch(targetInfo, candidateInfo, matchStrictness);
          
          if (matchResult.match && matchResult.confidence >= 0.6) {
            const resources = extractPlayInfoForCache(item, site.title, type, matchResult, targetInfo);
            siteResults.push(...resources);
          }
        }
        
        if (siteResults.length > 0) {
          stats.success++;
        }
        
        return siteResults;
      } catch (error) {
        stats.failed++;
        return [];
      }
    });

    const results = await Promise.allSettled(requestTasks.map(task => task()));
    
    const fulfilledResults = results
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => r.value);
    
    const executor = new SmartSearchExecutor(new SiteManager(), targetInfo, type, matchStrictness);
    allResults = executor.smartDeduplicate(fulfilledResults);
    
    console.log(`📊 批量搜索完成: ${Date.now() - startTime}ms, 结果: ${allResults.length}`);
    
    if (allResults.length > 0) {
      try {
        Widget.storage?.set?.(cacheKey, allResults, CONFIG.CACHE_TTL);
      } catch (e) {}
    }
  }

  let finalResults = allResults;
  if (type === 'tv' && targetEpisode) {
    finalResults = allResults.filter(res => 
      (res._ep === targetEpisode) ||
      (res.description && res.description.includes(`第${targetEpisode}集`))
    );
  }
  
  finalResults.forEach(res => {
    res._finalScore = calculateResourceScore(res, preferResolution);
  });
  
  finalResults.sort((a, b) => b._finalScore - a._finalScore);
  
  const fieldsToDelete = ['_finalScore', '_matchType', '_matchScore', '_seasonMatch', 
                         '_isMainSource', '_hasEpInfo', '_updateRecency', '_ep', 
                         '_isVariety', '_episodeDate', '_confidence'];
  finalResults.forEach(res => {
    fieldsToDelete.forEach(field => {
      if (field in res) delete res[field];
    });
    
    if (!res.resolution) {
      res.resolution = '未知';
      res.resolutionLevel = 0;
      res.isHD = false;
      res.is4K = false;
      res.qualityTags = [];
      res.qualityScore = 0;
      res.isHttps = res.url.startsWith('https');
    }
  });
  
  return finalResults.slice(0, 100);
}

module.exports = { loadResource };
