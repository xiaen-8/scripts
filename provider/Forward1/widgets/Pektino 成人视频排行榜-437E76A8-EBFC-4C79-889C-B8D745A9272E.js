// widgets/pektino.js
// Pektino 成人视频排行榜模块（固定简体中文，全量列表）
// 数据来源：https://pektino.com

WidgetMetadata = {
  id: "forward.pektino",
  title: "Pektino 成人视频排行榜",
  version: "1.0.8",
  requiredVersion: "0.0.1",
  description: "从 pektino.com 获取 X(Twitter) 免费成人视频排行榜（简体中文）",
  author: "AiKuai",
  site: "https://pektino.com",
  icon: "https://pektino.com/favicon.ico",
  detailCacheDuration: 60,
  modules: [
    {
      id: "daily",
      title: "每日",
      functionName: "loadList",
      cacheDuration: 3600,
      requiresWebView: false,
      sectionMode: false,
      params: [
        { name: "page", title: "页码", type: "page" },
        {
          name: "sort_by",
          title: "排序",
          type: "enumeration",
          enumOptions: [
            { title: "按点赞", value: "favorite" },
            { title: "按观看数", value: "pv" },
            { title: "按时长", value: "time" },
            { title: "最近添加", value: "created" }
          ],
          value: "favorite"
        },
        { name: "range", title: "", type: "constant", value: "daily" }
      ]
    },
    {
      id: "weekly",
      title: "每周",
      functionName: "loadList",
      cacheDuration: 3600,
      requiresWebView: false,
      sectionMode: false,
      params: [
        { name: "page", title: "页码", type: "page" },
        {
          name: "sort_by",
          title: "排序",
          type: "enumeration",
          enumOptions: [
            { title: "按点赞", value: "favorite" },
            { title: "按观看数", value: "pv" },
            { title: "按时长", value: "time" },
            { title: "最近添加", value: "created" }
          ],
          value: "favorite"
        },
        { name: "range", title: "", type: "constant", value: "weekly" }
      ]
    },
    {
      id: "monthly",
      title: "每月",
      functionName: "loadList",
      cacheDuration: 3600,
      requiresWebView: false,
      sectionMode: false,
      params: [
        { name: "page", title: "页码", type: "page" },
        {
          name: "sort_by",
          title: "排序",
          type: "enumeration",
          enumOptions: [
            { title: "按点赞", value: "favorite" },
            { title: "按观看数", value: "pv" },
            { title: "按时长", value: "time" },
            { title: "最近添加", value: "created" }
          ],
          value: "favorite"
        },
        { name: "range", title: "", type: "constant", value: "monthly" }
      ]
    },
    {
      id: "all",
      title: "所有时间",
      functionName: "loadList",
      cacheDuration: 3600,
      requiresWebView: false,
      sectionMode: false,
      params: [
        { name: "page", title: "页码", type: "page" },
        {
          name: "sort_by",
          title: "排序",
          type: "enumeration",
          enumOptions: [
            { title: "按点赞", value: "favorite" },
            { title: "按观看数", value: "pv" },
            { title: "按时长", value: "time" },
            { title: "最近添加", value: "created" }
          ],
          value: "favorite"
        },
        { name: "range", title: "", type: "constant", value: "all" }
      ]
    }
  ]
};

// 辅助：去掉 "X (Twitter) adult video" 前缀
function cleanTitle(raw) {
  if (!raw) return '';
  return raw.replace(/^X\s*\(Twitter\)\s*adult\s*video\s*/i, '').trim();
}

// 固定语言（简体中文）
const LANG = 'zh-CN';

// 从卡片元素提取视频数据（列表用）
function extractVideoData(card, url_cd) {
  const img = card.find('img[data-nimg="fill"]');
  const thumbnail = img.attr('src') || '';
  const durationEl = card.find('div.absolute.bottom-2.right-2');
  const durationText = durationEl.text().trim();

  let pv = 0;
  const pvSpan = card.find('span.flex.items-center').first();
  if (pvSpan.length) {
    const pvText = pvSpan.text().replace(/[^0-9]/g, '');
    pv = parseInt(pvText, 10) || 0;
  }

  let commentCount = 0;
  const commentSpan = card.find('span.flex.items-center').eq(1);
  if (commentSpan.length) {
    const commentText = commentSpan.text().replace(/[^0-9]/g, '');
    commentCount = parseInt(commentText, 10) || 0;
  }

  let favorite = 0;
  const favBtn = card.find('button.count-item');
  if (favBtn.length) {
    const favSpan = favBtn.find('span');
    const favText = favSpan.text().replace(/[^0-9]/g, '');
    favorite = parseInt(favText, 10) || 0;
  }
  //显示标题
/*   let rawTitle = img.attr('alt') || '';
  let title = cleanTitle(rawTitle); */
  //显示时间
  let title = '视频时长 ' + durationText; // 直接使用时长
  if (!title) title = `视频 ${url_cd}`;

  return {
    id: url_cd,
    type: "url",
    title: title,
    posterPath: thumbnail,
    link: url_cd,
    durationText: durationText,
    pv: pv,
    favorite: favorite,
    commentCount: commentCount
  };
}

// 加载列表（获取全部卡片，按 ItemList 顺序排列）
async function loadList(params = {}) {
  const sort_by = params.sort_by || 'favorite';
  const range = params.range || 'daily';
  const page = Number(params.page || 1);

  let base = `https://pektino.com/${LANG}`;
  if (range === 'weekly') base += '/weekly';
  else if (range === 'monthly') base += '/monthly';
  else if (range === 'all') base += '/all';

  const query = {};
  if (sort_by) query.sort = sort_by;
  if (page > 1) query.page = page;

  try {
    const res = await Widget.http.get(base, { params: query });
    const $ = Widget.html.load(res.data);

    // 1. 提取 ItemList 中的顺序映射 (url_cd -> position)
    const positionMap = {};
    $('script[type="application/ld+json"]').each((i, el) => {
      try {
        const text = $(el).html();
        const data = JSON.parse(text);
        if (data['@type'] === 'ItemList' && data.itemListElement) {
          for (const item of data.itemListElement) {
            const url = item.url;
            if (!url) continue;
            const match = url.match(/\/movie\/([^\/]+)/);
            if (match) {
              positionMap[match[1]] = item.position;
            }
          }
        }
      } catch (e) {}
    });

    // 2. 遍历所有卡片，收集数据
    const items = [];
    $('a.group.block.s-popunder').each((i, el) => {
      const linkEl = $(el);
      const href = linkEl.attr('href');
      if (!href) return;
      const match = href.match(/\/movie\/([^\/]+)/);
      if (!match) return;
      const url_cd = match[1];
      const card = linkEl.closest('div.bg-white');
      if (!card.length) return;
      const videoData = extractVideoData(card, url_cd);
      // 记录 position，若不存在则设为大数
      videoData._position = positionMap[url_cd] || 9999 + i;
      items.push(videoData);
    });

    // 3. 按 _position 排序，保证 ItemList 顺序优先，其余保持 DOM 顺序
    items.sort((a, b) => a._position - b._position);

    // 4. 移除临时字段
    items.forEach(item => delete item._position);

    return items;
  } catch (error) {
    console.error('[loadList] 失败:', error.message || error);
    throw error;
  }
}

// 加载详情（修复观看数和收藏数提取，新增相关视频提取）
async function loadDetail(link) {
  const url_cd = String(link).trim();
  if (!url_cd) {
    throw new Error('Invalid link: empty');
  }
  const detailUrl = `https://pektino.com/${LANG}/movie/${url_cd}`;

  try {
    const res = await Widget.http.get(detailUrl);
    const $ = Widget.html.load(res.data);

    // 视频播放链接
    let videoUrl = '';
    const videoLinkEl = $('a[href*=".mp4"]').first();
    if (videoLinkEl.length) {
      videoUrl = videoLinkEl.attr('href');
    }

    // 缩略图
    let poster = '';
    const posterImg = $('img[alt*="adult video"]').first();
    if (posterImg.length) {
      poster = posterImg.attr('src');
    } else {
      const fallbackImg = $('img.object-cover').first();
      poster = fallbackImg.attr('src') || '';
    }

    // 标题（h1）
    let title = $('h1').first().text().trim();
    if (!title) title = `视频 ${url_cd}`;

    // ---- 精准提取观看数和收藏数 ----
    let pv = 0;
    let favorite = 0;
    const infoBar = $('div.flex.items-center.justify-between.text-gray-600.dark\\:text-gray-400.text-sm.m-2').first();
    if (infoBar.length) {
      const pvSpan = infoBar.find('span.flex.items-center').first();
      if (pvSpan.length) {
        const pvText = pvSpan.text().replace(/[^0-9]/g, '');
        pv = parseInt(pvText, 10) || 0;
      }
      const favBtn = infoBar.find('button.count-item');
      if (favBtn.length) {
        const favSpan = favBtn.find('span');
        const favText = favSpan.text().replace(/[^0-9]/g, '');
        favorite = parseInt(favText, 10) || 0;
      }
    } else {
      // 回退
      const pvSpan = $('span.flex.items-center').first();
      if (pvSpan.length) {
        const pvText = pvSpan.text().replace(/[^0-9]/g, '');
        pv = parseInt(pvText, 10) || 0;
      }
      const favBtn = $('button.count-item');
      if (favBtn.length) {
        const favSpan = favBtn.find('span');
        const favText = favSpan.text().replace(/[^0-9]/g, '');
        favorite = parseInt(favText, 10) || 0;
      }
    }

    // ---- 提取相关视频 ----
    const relatedItems = [];
    // 寻找“相关视频”标题所在的容器，然后找到其后的 .mt-4 区域
    const relatedTitle = $('h2:contains("相关视频")').first();
    if (relatedTitle.length) {
      // 标题的父级是 div.border-b，再找相邻的兄弟 div.mt-4
      const container = relatedTitle.closest('div.border-b').next('div.mt-4');
      if (container.length) {
        // 在容器内查找所有卡片（每张卡片是一个 div.bg-white...）
        const cards = container.find('div.bg-white.dark\\:bg-gray-800.rounded-lg.shadow-md.overflow-hidden.mb-4');
        cards.each((i, el) => {
          const card = $(el);
          const linkEl = card.find('a.group.block.s-popunder');
          if (!linkEl.length) return;
          const href = linkEl.attr('href');
          if (!href) return;
          const match = href.match(/\/movie\/([^\/]+)/);
          if (!match) return;
          const relatedUrlCd = match[1];
          const videoData = extractVideoData(card, relatedUrlCd);
          // 构造 relatedItems 条目，保留 link 供后续导航
          relatedItems.push({
            id: relatedUrlCd,
            type: "url",
            title: videoData.title,
            posterPath: videoData.posterPath,
            backdropPath: videoData.posterPath,
            durationText: videoData.durationText,
            pv: videoData.pv,
            favorite: videoData.favorite,
            link: relatedUrlCd   // 用于打开详情
          });
        });
      }
    }

    // 返回详情，包含相关视频
    return {
      id: url_cd,
      type: "url",
      title: title,
      posterPath: poster,
      videoUrl: videoUrl,
      backdropPaths: poster ? [poster] : [],
      relatedItems: relatedItems,          // 相关视频列表
      description: `观看数: ${pv} | 收藏数: ${favorite}`,
      _raw: { pv, favorite }
    };
  } catch (error) {
    console.error('[loadDetail] 失败:', error.message || error);
    throw error;
  }
}