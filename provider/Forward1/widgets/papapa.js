// ForwardWidget 模块 - 啪啪啪（聚合分类版）

WidgetMetadata = {
  id: "forward.papapa",
  title: "啪啪啪",
  version: "1.0.1",
  requiredVersion: "0.0.1",
  description: "啪啪啪（聚合分类）",
  author: "AiKuai",
  site: "https://www.papalah.com",
  icon: "https://www.papalah.com/favicon.ico",
  detailCacheDuration: 60,
  modules: [
    {
      id: "papapa",
      title: "啪啪啪",
      functionName: "loadList",
      cacheDuration: 300,
      params: [
        {
          name: "sort_by",
          title: "分类",
          type: "enumeration",
          enumOptions: [
            { title: "最新视频", value: "" },
            { title: "热门视频", value: "hot" },
            { title: "最爱视频", value: "favorite" },
            { title: "随机视频", value: "random" },
          ],
          value: ""
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

const BASE = 'https://www.papalah.com';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0';

// ---------- 辅助：获取封面完整URL ----------
function getCoverUrl($el) {
  let cover = $el.find('.btn-watch-later').attr('data-thumb');
  if (!cover) {
    cover = $el.find('img').attr('data-src') || $el.find('img').attr('src') || '';
  }
  if (cover && !cover.startsWith('http')) {
    cover = BASE + '/' + cover.replace(/^\/+/, '');
  }
  return cover;
}

// ---------- 统一列表项构建 ----------
function buildItem($el) {
  const href = $el.find('a:first').attr('href');
  if (!href) return null;

  const title = $el.find('img').attr('alt') || $el.find('.v-name').text() || '无标题';
  const cover = getCoverUrl($el);
  const duration = $el.find('.v-duration').text() || '';

  // 从 item-footer 提取观看数
  let viewCount = $el.find('.item-footer .fa-eye').parent().text().trim()
    .replace(/觀看/, '').trim();

  return {
    id: href,
    type: "url",
    mediaType: "movie",
    title: title,
    posterPath: cover,
    backdropPath: cover,
    durationText: duration,
    remarks: viewCount || undefined,
    link: BASE + (href.startsWith('/') ? '' : '/') + href
  };
}

// ---------- 列表加载 ----------
async function loadList(params = {}) {
  try {
    const page = Number(params.page) || 1;
    const category = params.sort_by ?? "";
    let url = `${BASE}/${category}`;
    if (page > 1) {
      url += `?page=${page}`;
    }

    const res = await Widget.http.get(url, {
      headers: { 'User-Agent': UA }
    });
    const html = res.data;
    const $ = Widget.html.load(html);

    const items = [];
    $('.row .col-md-3.col-xs-6.item').each((_, element) => {
      const item = buildItem($(element));
      if (item) items.push(item);
    });

    return items;
  } catch (error) {
    console.error('[loadList] 失败:', error.message || error);
    throw error;
  }
}

// ---------- 通用视频地址提取（动态适配任意数组名） ----------
function extractVideoUrlFromScript(html) {
  // 1. 找出所有 const _xxx = [...] 定义
  const arrayRegex = /const\s+_([a-zA-Z0-9]+)\s*=\s*(\[[\s\S]*?\]);/g;
  let matches;
  const arrays = [];
  while ((matches = arrayRegex.exec(html)) !== null) {
    try {
      // 将单引号转为双引号以便 JSON.parse
      const arrStr = matches[2].replace(/'/g, '"');
      const arr = JSON.parse(arrStr);
      arrays.push({ name: matches[1], arr });
    } catch (e) {
      // 忽略解析失败
    }
  }

  if (arrays.length < 2) return null;

  // 2. 区分哪个是索引数组（元素全为数字且为 0..n-1 的排列）
  let idxArray = null;
  let strArray = null;
  for (const a of arrays) {
    if (a.arr.every(item => typeof item === 'number')) {
      // 检查是否为 0..len-1 的排列
      const sorted = [...a.arr].sort((x, y) => x - y);
      if (sorted.length === a.arr.length && sorted.every((v, i) => v === i)) {
        idxArray = a.arr;
        break;
      }
    }
  }
  // 找字符串数组（与索引数组互补）
  for (const a of arrays) {
    if (a.arr !== idxArray) {
      strArray = a.arr;
      break;
    }
  }

  if (!idxArray || !strArray || strArray.length !== idxArray.length) return null;

  // 3. 按索引顺序拼接
  let combined = '';
  for (let i = 0; i < idxArray.length; i++) {
    const pos = idxArray.indexOf(i);
    if (pos === -1) return null;
    combined += strArray[pos];
  }

  // 4. URL 解码
  let url = decodeURIComponent(combined);

  // 5. 移除尾部干扰字符（形如 _xxxxx）
  url = url.replace(/_[a-zA-Z0-9]+$/, '');

  // 6. 修正路径中的多余 'F'（如 /Fd2/ → /d2/，/F73/ → /73/）
  url = url.replace(/\/F([^\/]+)/g, '/$1');

  // 7. 补全域名
  if (url && !url.startsWith('http')) {
    url = BASE + '/' + url.replace(/^\/+/, '');
  }

  return url;
}

// ---------- 详情加载 ----------
async function loadDetail(link) {
  try {
    const res = await Widget.http.get(link, {
      headers: { 'User-Agent': UA }
    });
    const html = res.data;
    const $ = Widget.html.load(html);

    // 提取视频地址
    const videoUrl = extractVideoUrlFromScript(html);
    if (!videoUrl) throw new Error('未获取到视频地址');

    // 标题
    const title = $('h1')?.text()?.trim() || '未知标题';

    // 封面图
    const poster = $('#my-video').attr('poster') || '';
    const cover = poster || $('.btn-watch-later').attr('data-thumb') || '';
    const fullCover = cover && !cover.startsWith('http')
      ? BASE + '/' + cover.replace(/^\/+/, '')
      : cover;

    // 时长（从 data-duration 取，原始 HTML 中 JS 动态渲染的不可靠）
    const durationText = $('.btn.btn-watch-later').attr('data-duration')
      || $('[data-duration]').first().attr('data-duration')
      || '';

    // 观看数（精确匹配数字+k/m+觀看，排除「稍後觀看」）
    let viewCount = '';
    let uploadTime = '';
    $('.v-label').each((_, el) => {
      const text = $(el).text().trim();
      if (/[\d.]+[km]?\s*觀看$/.test(text)) {
        viewCount = text.replace(/觀看/, '').trim();
      }
    });
    const timeEl = $('.timeago');
    if (timeEl) uploadTime = timeEl.attr('title') || '';

    const description = [
      durationText ? '时长: ' + durationText : '',
      viewCount ? viewCount + ' 次观看' : '',
      uploadTime ? '上传: ' + uploadTime : ''
    ].filter(Boolean).join(' | ');

    return {
      id: link,
      type: "url",
      mediaType: "movie",
      title: title,
      link: link,
      coverUrl: fullCover,
      posterPath: fullCover,
      backdropPath: fullCover,
      videoUrl: videoUrl,
      playerType: "system",
      durationText: durationText,
      description: description || undefined,
      backdropPaths: fullCover ? [fullCover] : [],
      trailers: [{ url: videoUrl, coverUrl: fullCover }]
    };
  } catch (error) {
    console.error('[loadDetail] 失败:', error.message || error);
    throw error;
  }
}

// ---------- 搜索 ----------
async function search(params = {}) {
  try {
    const page = Number(params.page) || 1;

    // 标签导航：从详情页点击标签时 ForwardWidget 传入 genreId
    if (params.genreId) {
      const tag = encodeURIComponent(params.genreId);
      const url = `${BASE}/tag/${tag}?page=${page}`;
      const res = await Widget.http.get(url, { headers: { 'User-Agent': UA } });
      const $ = Widget.html.load(res.data);
      const items = [];
      $('.row .col-md-3.col-xs-6.item').each((_, element) => {
        const item = buildItem($(element));
        if (item) items.push(item);
      });
      return items;
    }

    const keyword = (params.keyword || '').trim();
    if (!keyword) return [];

    const text = encodeURIComponent(keyword);
    const url = `${BASE}/search?q=${text}&t=&page=${page}`;

    const res = await Widget.http.get(url, {
      headers: { 'User-Agent': UA }
    });
    const html = res.data;
    const $ = Widget.html.load(html);

    const items = [];
    $('.row .col-md-3.col-xs-6.item').each((_, element) => {
      const item = buildItem($(element));
      if (item) items.push(item);
    });

    return items;
  } catch (error) {
    console.error('[search] 失败:', error.message || error);
    throw error;
  }
}