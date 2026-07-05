// ForwardWidget 模块 - 肉视频（聚合分类版）
WidgetMetadata = {
  id: "forward.rouvideo",
  title: "肉视频",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "肉视频成人影视聚合（聚合分类）",
  author: "Forward",
  site: "https://rou.video",
  icon: "https://rou.video/favicon.ico",
  modules: [
    {
      id: "rouvideo",
      title: "肉视频",
      functionName: "loadList",
      params: [
        {
          name: "sort_by",
          title: "分类",
          type: "enumeration",
          enumOptions: [
		    { title: "最新视频", value: "v" },
            { title: "國產AV", value: "t/國產AV" },
            { title: "探花", value: "t/探花" },
            { title: "自拍流出", value: "t/自拍流出" },
            { title: "OnlyFans", value: "t/OnlyFans" },
            { title: "日本", value: "t/日本" }
            
          ],
          value: "v"   // 默认选中
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

// 全局常量
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0';

// ---------- 列表加载（支持分类切换） ----------
async function loadList(params = {}) {
  try {
  const page = Number(params.page) || 1;
  const category = params.sort_by || "v"; // 默认成人头条
    // 构建分类 URL
    let url = `https://rou.video/${category}`;
    if (page > 1) {
      url += `?order=createdAt&page=${page}`;
    }
    console.error('[loadList] 失败:', url);
    const res = await Widget.http.get(url, {
      headers: { 'User-Agent': UA }
    });
    const html = res.data;
    const $ = Widget.html.load(html);

    const items = [];
    $('.grid.grid-cols-2.mb-6 > div').each((_, element) => {
      if ($(element).find('.relative').length === 0) return;
      const href = $(element).find('.relative a').attr('href');
      const title = $(element).find('img:last').attr('alt');
      const cover = $(element).find('img').attr('src');
      const subTitle = $(element).find('.relative a > div:eq(1)').text();
      const hdinfo = $(element).find('.relative a > div:first').text();
      const remarks = subTitle || hdinfo;

      items.push({
        id: href,
        type: "url",
        title: title || '无标题',
		backdropPath: cover,
        //posterPath: cover || '',
        description: remarks || '',
        link: "https://rou.video" + href
      });
    });

    return items;
  } catch (error) {
    console.error('[loadList] 失败:', error.message || error);
    throw error;
  }
}

// ---------- 详情加载 ----------
async function loadDetail(link) {
  try {
    const res = await Widget.http.get(link, {
      headers: { 'User-Agent': UA }
    });
    const html = res.data;
    const $ = Widget.html.load(html);

    const scriptContent = $('#__NEXT_DATA__').html();
    if (!scriptContent) throw new Error('未找到 __NEXT_DATA__');
    const jsonData = JSON.parse(scriptContent);
    const ev = jsonData.props?.pageProps?.ev;
    if (!ev) throw new Error('未找到 ev 数据');

    const decodedEv = decodeEv(ev);
    let videoUrl = decodedEv.videoUrl;
    if (!videoUrl) throw new Error('未获取到视频地址');

    // 将 .jpg 替换为 .m3u8（实际播放地址）
    if (videoUrl.endsWith('.jpg')) {
      videoUrl = videoUrl.replace(/\.jpg$/, '.m3u8');
    }

    const title = $('h1')?.text()?.trim() || '未知标题';

    return {
      id: link,
      type: "url",
      title: title,
      videoUrl: videoUrl,
      playerType: "system"
    };
  } catch (error) {
    console.error('[loadDetail] 失败:', error.message || error);
    throw error;
  }
}

// ---------- 解码辅助函数 ----------
function decodeEv(ev) {
  const decoded = _atob(ev.d)
    .split('')
    .map(c => String.fromCharCode(c.charCodeAt(0) - ev.k))
    .join('');
  return JSON.parse(decoded);
}

function _atob(b64) {
  const chars = {
    ascii: () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    indices: () => {
      if (!chars.cache) {
        chars.cache = {};
        const ascii = chars.ascii();
        for (let c = 0; c < ascii.length; c++) {
          chars.cache[ascii[c]] = c;
        }
      }
      return chars.cache;
    }
  };
  const indices = chars.indices();
  const pos = b64.indexOf('=');
  const padded = pos > -1;
  const len = padded ? pos : b64.length;
  let i = -1;
  let data = '';

  while (i < len) {
    const code =
      (indices[b64[++i]] << 18) |
      (indices[b64[++i]] << 12) |
      (indices[b64[++i]] << 6) |
      indices[b64[++i]];
    if (code !== 0) {
      data += String.fromCharCode(
        (code >>> 16) & 255,
        (code >>> 8) & 255,
        code & 255
      );
    }
  }
  if (padded) {
    data = data.slice(0, pos - b64.length);
  }
  return data;
}

// ---------- 搜索 ----------
async function search(params = {}) {
  try {
    const { keyword, page = 1 } = params;
    if (!keyword) return [];

    const text = encodeURIComponent(keyword);
    const url = `https://rou.video/search?q=${text}&t=&page=${page}`;

    const res = await Widget.http.get(url, {
      headers: { 'User-Agent': UA }
    });
    const html = res.data;
    const $ = Widget.html.load(html);

    const items = [];
    $('.grid.grid-cols-2.mb-6 > div').each((_, element) => {
      if ($(element).find('.relative').length === 0) return;
      const href = $(element).find('.relative a').attr('href');
      const title = $(element).find('img:last').attr('alt');
      const cover = $(element).find('img').attr('src');
      const subTitle = $(element).find('.relative a > div:eq(1)').text();
      const hdinfo = $(element).find('.relative a > div:first').text();
      const remarks = subTitle || hdinfo;

      items.push({
        id: href,
        type: "url",
        title: title || '无标题',
        posterPath: cover || '',
        description: remarks || '',
        link: "https://rou.video" + href
      });
    });

    return items;
  } catch (error) {
    console.error('[search] 失败:', error.message || error);
    throw error;
  }
}