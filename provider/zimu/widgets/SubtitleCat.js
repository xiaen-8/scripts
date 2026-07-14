WidgetMetadata = {
  id: "forward.meta.subtitlecat",
  title: "SubtitleCat 字幕",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "从 subtitlecat.com 搜索字幕",
  author: "EL",
  globalParams: [],
  modules: [
    {
      id: "loadSubtitle",
      title: "加载字幕",
      functionName: "loadSubtitle",
      type: "subtitle",
      cacheDuration: 3600,
      params: [],
    },
  ],
};

const SITE = "https://www.subtitlecat.com";

function getText(v) { return String(v || "").trim(); }

// 清理 subtitlecat 标题中的多余后缀，如 -zh-tw-繁中、_aisubs.app、-c、_fhd 等
function cleanTitle(title) {
  let t = title.replace(/\.(srt|ass|ssa|zip|rar|7z)$/i, "");
  // 去掉 (translated from ...)
  t = t.replace(/\s*\(translated from[^)]*\)/gi, "");
  // 去掉语言后缀：-zh-CN、-zh-TW、-en、-ja、-ko、_zh-CN 等
  t = t.replace(/[-_](?:zh[_-]?CN|zh[_-]?TW|chs|cht|en|eng|ja|ko|id|ru|th|vi|bn|tr)[\s-]*/gi, "");
  // 去掉常见的转制/来源后缀：_aisubs.app、_fhd、-c 等
  t = t.replace(/_aisubs\.app/gi, "");
  t = t.replace(/_fhd/gi, "");
  t = t.replace(/\s*-c\s*$/i, "");
  t = t.replace(/(?:\s*[-_]+\s*繁中|繁中\s*)/gi, "");
  // 去掉冗余标点
  t = t.replace(/[-_\s]+$/g, "").replace(/^[-_\s]+/g, "").trim();
  return t || title;
}

// === 以下完全参考 THUNDER 字幕模块 ===

function extractSearchCode(text) {
  const s = getText(text).toUpperCase();
  if (!s) return "";

  const normalized = s.replace(/\./g, " ").replace(/_/g, "-").replace(/\s+/g, " ").trim();

  const patterns = [
    /\bFC2(?:[- ]?PPV)?[- ]?\d{5,8}\b/,
    /\bCARIB[- ]?\d{6,8}\b/,
    /\b1PONDO[- ]?\d{6,8}\b/,
    /\bHEYZO[- ]?\d{3,6}\b/,
    /\bT28[- ]?\d{6,8}\b/,
    /\b(?:S2M|SONE|MIAA|SSNI|SNIS|IPX|IPZZ|SSIS|JUQ|MIDE|MIDV|STARS|ABW|RKI|DVAJ|WANZ|LULU|DLDSS|VRTM|SDMU|SDDE|MKMP|HMN|MUDR|ADN|CAWD|PPPE|PRED|MGR|SHKD|MXGS|FSDSS|JUL|KTB|MIAB|GVH|MIMK|JUY|JUTA|IDBD|HND|DASD|CLO|BF|HONB|ROE|CEMD|MIUM|NITR|RCTD|RCT|IPVR|MIBD|JUR|JURD|SOE|ORE|PYO)\s*[-_ ]?\d{2,6}[A-Z]?(?:[-_ ]?[A-Z]{0,4})?\b/,
    /\b[A-Z]{2,10}\s*[-_ ]?\d{2,8}[A-Z]?\b/,
    /\b\d{6,8}\b/,
  ];

  const candidates = [normalized];
  const titleLike = normalized
    .replace(/\b(UNCENSORED|LEAK|OTHER|COMPLETE|FULL|HDR|WEB|BLURAY|BDRIP|WEBDL|REMUX|X264|X265|10BIT|8BIT|HEVC|AVC)\b/gi, " ")
    .replace(/\b(?:CD\d+|PART\d+|DISC\d+|EP\s*\d+|E\s*\d+|S\d{1,2}E\d{1,2}|\d{1,2}x\d{1,2}|SEASON\s*\d+)\b/gi, " ")
    .replace(/\s+/g, " ").trim();
  if (titleLike && titleLike !== normalized) candidates.push(titleLike);

  for (const source of candidates) {
    for (const reg of patterns) {
      const match = source.match(reg);
      if (match?.[0]) {
        return match[0].replace(/\s+/g, "").replace(/_/g, "-").replace(/-+/g, "-").toUpperCase();
      }
    }
  }
  return "";
}

function detectMediaType(params) {
  const explicit = getText(params?.mediaType).toLowerCase();
  if (explicit === "movie" || explicit === "film") return "movie";
  if (explicit === "tv" || explicit === "series" || explicit === "episode") return "tv";

  const title = getText(params?.title) || getText(params?.seriesName);
  if (extractSearchCode(title)) return "movie";

  const season = Number(params?.season);
  const episode = Number(params?.episode);
  if ((!Number.isNaN(season) && season > 0) || (!Number.isNaN(episode) && episode > 0)) return "tv";

  if (/S\d{1,2}E\d{1,2}/i.test(title) || /Season\s*\d+\s*Episode\s*\d+/i.test(title) || /第\s*\d+\s*集/.test(title)) return "tv";

  return "movie";
}

function stripEpisodeMarkers(text) {
  return getText(text)
    .replace(/\b(?:第\s*\d+\s*集|第\s*\d+\s*話|EP\s*\d+|E\s*\d+|S\d{1,2}E\d{1,2}|\d{1,2}x\d{1,2}|Season\s*\d+\s*Episode\s*\d+)\b/gi, " ")
    .replace(/\b(?:第\s*\d+\s*季|Season\s*\d+)\b/gi, " ")
    .replace(/\s+/g, " ").trim();
}

function buildSearchKeys(params, mediaType) {
  const rawFields = [params.title, params.seriesName, params.description, params.id, params.link, params.url]
    .map(getText).filter(Boolean);
  // 去重：同一个值出现多次会导致正则截断误匹配
  const deduped = [...new Set(rawFields)];
  const rawText = deduped.join(" ").trim();
  const titleText = getText(params.title || params.seriesName);
  const displayText = stripEpisodeMarkers(titleText || rawText);
  const codeSource = stripEpisodeMarkers(rawText || titleText);
  const avCode = extractSearchCode(codeSource);
  const season = Number(params?.season);
  const episode = Number(params?.episode);

  if (!rawText) return [];

  const keys = [];
  const isAvTitle = Boolean(avCode);

  if (isAvTitle) {
    const titlePart = (displayText || titleText)
      .replace(new RegExp(avCode.replace(/[-_]/g, "[-_]?"), "i"), "")
      .replace(/\b(UNCENSORED|LEAK|OTHER|COMPLETE|FULL|HDR|WEB|BLURAY|BDRIP|WEBDL|REMUX|X264|X265|10BIT|8BIT|HEVC|AVC)\b/gi, "")
      .replace(/\b(?:EP|E|S|SEASON)\s*\d{1,3}\b/gi, "")
      .replace(/[-_:\s]+$/g, "").replace(/^[\s\-_:]+|[\s\-_:]+$/g, "").trim();
    const compactCode = avCode.replace(/[-_ ]/g, "");
    keys.push(avCode);
    keys.push(compactCode);
    if (titlePart && titlePart !== avCode) keys.push(`${avCode} ${titlePart}`);
    if (titlePart && titlePart !== compactCode) keys.push(`${compactCode} ${titlePart}`);
  }

  if (mediaType === "tv" || (!isAvTitle && /S\d{1,2}E\d{1,2}/i.test(displayText))) {
    const s = Number(season);
    const e = Number(episode);
    const hasSeason = !Number.isNaN(s) && s > 0;
    const hasEpisode = !Number.isNaN(e) && e > 0;
    const tvBase = displayText || titleText;

    if (hasSeason && hasEpisode) {
      const sStr = String(s).padStart(2, "0");
      const eStr = String(e).padStart(2, "0");
      keys.push(`${tvBase} S${sStr}E${eStr}`);
      keys.push(`${tvBase} ${sStr}x${eStr}`);
    } else if (hasEpisode) {
      keys.push(`${tvBase} E${String(e).padStart(2, "0")}`);
    }
    if (hasSeason) keys.push(`${tvBase} S${String(s).padStart(2, "0")}`);
    keys.push(tvBase);
  }

  keys.push(displayText || titleText);
  keys.push(titleText);
  return [...new Set(keys)].filter(k => k.length >= 2);
}

async function loadSubtitle(params) {
  const mediaType = detectMediaType(params);
  const searchKeys = buildSearchKeys(params, mediaType);
  if (searchKeys.length === 0) return [];

  for (const word of searchKeys) {
    try {
      const resp = await Widget.http.get(SITE + "/index.php?search=" + encodeURIComponent(word), {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept-Language": "zh-CN,zh;q=0.9",
        },
        timeout: 8000,
        allow_redirects: true,
      });
      const html = resp?.data || "";
      if (!html) continue;

      // 解析搜索结果
      const matches = [];
      const rowRe = /<tr>[\s\S]*?<a\s+href="(subs\/(\d+)\/([^"]+\.html))"[^>]*>([^<]+)<\/a>[\s\S]*?<\/tr>/gi;
      let m;
      while ((m = rowRe.exec(html)) !== null) {
        const dl = m[0].match(/(\d+)\s*downloads?/i);
        matches.push({ sid: m[2], slug: m[3], title: m[4].trim(), downloads: dl ? parseInt(dl[1], 10) : 0 });
      }
      if (matches.length === 0) continue;

	  // 按下载量排序
      matches.sort((a, b) => b.downloads - a.downloads);

      // 取 top 搜索结果，逐个爬详情页获取语言版本
      let result = [];
      const seenDl = {};

      for (let mi = 0; mi < Math.min(matches.length, 3); mi++) {
        const top = matches[mi];
        if (seenDl[top.sid]) continue;
        seenDl[top.sid] = true;

        try {
          const detailResp = await Widget.http.get(SITE + "/subs/" + top.sid + "/" + top.slug, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
              "Accept-Language": "zh-CN,zh;q=0.9",
            },
            timeout: 5000,
            allow_redirects: true,
          });
          const dh = detailResp?.data || "";

          const links = [];
          const linkRe = /href="(\/subs\/\d+\/[^"]+\.(?:srt|ass))"/gi;
          let lm;
          while ((lm = linkRe.exec(dh)) !== null) {
            const rawUrl = lm[1];
            if (links.some(x => x.url === rawUrl)) continue;
            const lc = rawUrl.match(/-([a-z]{2}(?:[_-][A-Z]{2})?)\.(?:srt|ass)$/);
            links.push({ url: rawUrl, lang: lc ? lc[1].replace(/_/g, "-").toLowerCase() : "" });
          }
          if (links.length === 0) continue;

          // 语言排序
          const order = { "zh-cn": 0, "zh-tw": 1, "en": 2, "eng": 2, "ja": 3, "ko": 4 };
          links.sort((a, b) => (order[a.lang] ?? 9) - (order[b.lang] ?? 9));

          const cleanName = cleanTitle(top.title);
          const count = 100000 + top.downloads;

          // 每个详情页最多输出 2 个最佳语言版本
          for (let i = 0; i < Math.min(links.length, 2); i++) {
            const langKey = links[i].lang;
            let label = "【字幕】";
            if (langKey === "zh-cn" || langKey === "chs") label = "【简中】";
            else if (langKey === "zh-tw" || langKey === "cht") label = "【繁中】";
            else if (langKey === "en" || langKey === "eng") label = "【英文】";
            else if (langKey === "ja") label = "【日文】";
            else if (langKey === "ko") label = "【韩文】";

            result.push({
              id: top.sid + "-" + (langKey || i),
              title: label + cleanName + ".srt",
              subTitle: "下载" + top.downloads + "次",
              description: "下载" + top.downloads + "次",
              lang: label.replace(/[【】]/g, ""),
              count: count,
              url: encodeURI(SITE + links[i].url),
            });
          }
        } catch (_) {
          continue;
        }
      }

      if (result.length > 0) return result;

    } catch (_) {
      continue;
    }
  }

  return [];
}
