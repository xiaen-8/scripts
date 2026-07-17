// widgets/ccav.js
WidgetMetadata = {
  id: "ccav.adult",
  title: "麻豆视频",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "麻豆视频 - 成人头条模块",
  author: "AiKuai",
  site: "https://www.91md.me",
  icon: "https://www.91md.me/template/ym005_pc/images/logo.png",
  detailCacheDuration: 300,
  globalParams: [
    {
      name: "baseUrl",
      title: "网站域名",
      type: "input",
      value: "https://www.91md.me",
      placeholders: [
            { title: "默认", value: "https://www.91md.me" },
            { title: "默认2", value: "https://www.9191md.me" },
                ]
    }
  ],
  modules: [
    {
      id: "loadList",
      title: "视频分类",
      functionName: "loadList",
      cacheDuration: 3600,
      params: [
        {
          name: "sort_by",
          title: "分类",
          type: "enumeration",
          enumOptions: [
            { title: "麻豆视频", value: "1" },
            { title: "成人头条", value: "9" },
            { title: "开心鬼传媒", value: "25" },
            { title: "蜜桃传媒", value: "4" },
            { title: "皇家华人", value: "5" },
            { title: "星空传媒", value: "6" },
            { title: "精东影业", value: "7" },
            { title: "乐播传媒", value: "8" },
            { title: "91制片厂", value: "2" },
            { title: "乌鸦传媒", value: "10" },
            { title: "兔子先生", value: "20" },
            { title: "杏吧原创", value: "21" },
            { title: "玩偶姐姐", value: "22" },
            { title: "mini传媒", value: "23" },
            { title: "天美传媒", value: "3" },
            { title: "大象传媒", value: "24" },
            { title: "萝莉社", value: "29" },
            { title: "PsychoPorn", value: "26" },
            { title: "糖心Vlog", value: "27" },
            { title: "性视界", value: "30" }
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

// --------------------------------------------
// 公共工具：从HTML中提取视频ID
// --------------------------------------------
function extractIdFromUrl(url) {
  const match = url.match(/\/id\/(\d+)/);
  return match ? match[1] : null;
}

// --------------------------------------------
// 解析列表页的单个视频条目（li元素）
// --------------------------------------------
function parseListItem($li, baseUrl) {
  const imgEl = $li.find('p.img img');
  const poster = imgEl.attr('src') || '';
  const title = imgEl.attr('alt') || $li.find('p').eq(1).text().trim() || '未知标题';
  const linkEl = $li.find('p.img a');
  const href = linkEl.attr('href') || '';
  const id = extractIdFromUrl(href);
  if (!id) return null;

  return {
    id: id,
    type: "url",
    title: title,
	backdropPath: poster,
    //posterPath: poster,//搜索显示封面的关键，但是加了这个分类浏览就会变成一行3个
    link: "detail:" + id,
  };
}

// --------------------------------------------
// 检查是否有下一页（根据网页分页结构）
// 分页HTML结构: <ul class="nextPage">...<a ...>下一页</a>...</ul>
// --------------------------------------------
function hasNextPage($) {
  // 方法1: 检查是否存在包含"下一页"文本的a标签
  let hasNext = false;
  $('ul.nextPage a').each(function() {
    const text = $(this).text().trim();
    if (text === '下一页') {
      hasNext = true;
      return false; // 跳出each循环
    }
  });
  if (hasNext) return true;

  // 方法2: 检查分页区域中是否有href包含page/{当前页+1}的链接
  // 方法3: 兜底：只要有分页链接且不是只有"上一页"，就认为可能有下一页
  const pageLinks = $('ul.nextPage a');
  if (pageLinks.length > 0) {
    let hasPageNumbers = false;
    pageLinks.each(function() {
      const text = $(this).text().trim();
      if (/^\d+$/.test(text)) {
        hasPageNumbers = true;
      }
    });
    // 如果有页码数字链接，说明有多页
    return hasPageNumbers;
  }

  return false;
}

// --------------------------------------------
// loadList - 列表页（支持分类选择 + 分页）
// 返回 VideoItem[] 数组，空数组表示没有更多数据
// --------------------------------------------
async function loadList(params = {}) {
  const baseUrl = params.baseUrl || "https://www.91md.me";
  const page = Number(params.page) || 1;
  const category = params.sort_by || "9"; // 默认成人头条
  const url = `${baseUrl}/index.php/vod/type/id/${category}/page/${page}.html`;

  try {
    const res = await Widget.http.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const html = res.data;
    const $ = Widget.html.load(html);

    const items = [];
    $('div.detail_right_div ul li').each(function() {
      const item = parseListItem($(this), baseUrl);
      if (item) items.push(item);
    });

    // 检查是否有下一页
    const hasMore = hasNextPage($);

    // 如果没有视频数据且没有下一页，返回空数组让App停止加载
    if (items.length === 0 && !hasMore) {
      return [];
    }

    return items;
  } catch (error) {
    console.error('[loadList] 失败:', error.message);
    throw new Error('列表加载失败，请检查网络或域名设置');
  }
}

// --------------------------------------------
// loadDetail - 详情页（修复正则匹配问题）
// --------------------------------------------
async function loadDetail(link) {
  const id = link.replace(/^detail:/, '');
  if (!id) return null;

  const baseUrl = (WidgetMetadata.globalParams && WidgetMetadata.globalParams[0] && WidgetMetadata.globalParams[0].value) || "https://www.91md.me";
  const url = `${baseUrl}/index.php/vod/play/id/${id}/sid/1/nid/1.html`;

  try {
    const res = await Widget.http.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const html = res.data;
    const $ = Widget.html.load(html);

    // 1. 提取标题
    const title = $('div.watch span.title').text().trim() || '未知标题';

    // 2. 提取播放地址（修复：正则不要求分号结尾，兼容多种情况）
    let videoUrl = '';
    // 使用更宽松的正则：匹配 var player_aaaa = {...} 后面跟 </script> 或 ;
    const playerMatch = html.match(/var player_aaaa\s*=\s*({[\s\S]+?})\s*(?:<\/script>|;)/);
    if (playerMatch) {
      try {
        const playerData = JSON.parse(playerMatch[1]);
        videoUrl = playerData.url || '';
      } catch (e) {
        console.error('[loadDetail] JSON解析失败:', e);
      }
    }

    // 3. 提取相关视频（relatedItems）
    const relatedItems = [];
    $('div.videoMore.sugetVideo ul li').each(function() {
      const item = parseListItem($(this), baseUrl);
      if (item) {
        item.link = "detail:" + item.id;
        relatedItems.push(item);
      }
    });

    // 4. 返回详情
    return {
      id: id,
      type: "url",
      title: title,
      videoUrl: videoUrl,
      relatedItems: relatedItems,
	  playerType: "app", 
    };
  } catch (error) {
    console.error('[loadDetail] 失败:', error.message);
    return null;
  }
}

// --------------------------------------------
// search - 搜索功能（支持分页）
// --------------------------------------------
async function search(params = {}) {
  const baseUrl = params.baseUrl || "https://www.91md.me";
  const keyword = params.keyword || '';
  const page = Number(params.page) || 1;

  if (!keyword.trim()) return [];

  const url = `${baseUrl}/index.php/vod/search.html?wd=${encodeURIComponent(keyword)}&page=${page}`;

  try {
    const res = await Widget.http.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const html = res.data;
    const $ = Widget.html.load(html);

    const items = [];
    $('div.detail_right_div ul li').each(function() {
      const item = parseListItem($(this), baseUrl);
      if (item) items.push(item);
    });

    // 检查是否有下一页
    const hasMore = hasNextPage($);

    if (items.length === 0 && !hasMore) {
      return [];
    }

    return items;
  } catch (error) {
    console.error('[search] 失败:', error.message);
    return [];
  }
}