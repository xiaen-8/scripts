/**
 * 天翼云盘分享资源模块
 * 从天翼云盘分享链接获取视频播放地址
 */
WidgetMetadata = {
  id: "nibiru.cloud189",
  title: "天翼云盘",
  icon: "https://cloud.189.cn/favicon.ico",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "天翼云盘分享资源播放",
  author: "nibiru",
  site: "https://cloud.189.cn",
  globalParams: [
    {
      name: "cookie",
      title: "Cookie",
      type: "input",
      description: "天翼云盘登录 Cookie（包含 COOKIE_LOGIN_USER）",
      placeholder: "COOKIE_LOGIN_USER=xxx; JSESSIONID=xxx",
    },
    {
      name: "listUrl",
      title: "资源列表地址",
      type: "input",
      description: "包含逗号分隔的资源 URL 列表的地址",
      placeholder: "https://example.com/list.txt",
    },
  ],
  modules: [
    {
      id: "loadList",
      title: "加载列表",
      functionName: "loadList",
      requiresWebView: false,
      params: [],
    },
    {
      id: "loadDetail",
      title: "加载详情",
      functionName: "loadDetail",
      requiresWebView: false,
      params: [],
    },
    {
      id: "loadResource",
      title: "加载资源",
      functionName: "loadResource",
      type: "stream",
      params: [],
    },
  ],
};

/**
 * 从列表地址加载资源列表
 */
async function loadList(params) {
  console.log("[loadList] 开始加载列表");
  console.log("[loadList] 参数:", JSON.stringify(params));
  const { listUrl, cookie } = params;

  // 保存 cookie 到 storage，供 loadDetail 使用
  if (cookie) {
    Widget.storage.set("cloud189_cookie", cookie);
    console.log("[loadList] 已保存 cookie 到 storage");
  }

  if (!listUrl) {
    console.error("[loadList] 错误: 未配置资源列表地址");
    throw new Error("请配置资源列表地址");
  }

  try {
    // 获取 URL 列表
    const response = await Widget.http.get(listUrl);
    const urlList = response.data
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (urlList.length === 0) {
      return [];
    }

    // 解析每个 URL，提取 shareCode
    const items = [];
    for (let i = 0; i < urlList.length; i++) {
      const url = urlList[i];
      const parsed = parseCloud189Url(url);
      if (parsed) {
        // 获取分享的基础信息
        try {
          const shareInfo = await getShareInfo(parsed.shareCode, parsed.accessCode);
          if (shareInfo && shareInfo.res_code === 0) {
            items.push({
              id: `${shareInfo.shareId}_${shareInfo.fileId}`,
              title: shareInfo.fileName || `资源 ${i + 1}`,
              type: shareInfo.isFolder ? "folder" : "movie",
              link: url,
              imgSrc: shareInfo.creator?.iconURL || "",
              releaseDate: shareInfo.fileCreateDate || "",
              extra: {
                shareId: shareInfo.shareId,
                shareCode: parsed.shareCode,
                fileId: shareInfo.fileId,
                isFolder: shareInfo.isFolder,
                shareMode: shareInfo.shareMode,
                accessCode: parsed.accessCode || "",
                originalUrl: url,
              },
            });
          }
        } catch (e) {
          console.error(`获取分享信息失败: ${url}`, e);
          // 即使获取分享信息失败，也添加一个基础条目
          items.push({
            id: `share_${i}`,
            title: `资源 ${i + 1}`,
            type: "movie",
            link: url,
            extra: {
              shareCode: parsed.shareCode,
              accessCode: parsed.accessCode || "",
              originalUrl: url,
            },
          });
        }
      }
    }

    return items;
  } catch (error) {
    console.error("加载列表失败:", error);
    throw new Error("加载资源列表失败: " + error.message);
  }
}

/**
 * 解析天翼云盘 URL，提取 shareCode 和 accessCode
 * 支持格式：
 * - https://cloud.189.cn/web/share?code=xxx
 * - https://cloud.189.cn/t/xxx (短链接)
 */
function parseCloud189Url(url) {
  console.log("[parseCloud189Url] 解析URL:", url);
  try {
    // 使用正则提取 URL 参数，避免使用 URL API（某些环境不支持）
    const getParam = (name) => {
      const regex = new RegExp("[?&]" + name + "=([^&#]*)");
      const match = url.match(regex);
      return match ? decodeURIComponent(match[1]) : "";
    };

    // 从 URL 参数中提取 code
    const code = getParam("code");
    const accessCode = getParam("accessCode");

    console.log("[parseCloud189Url] code:", code, "accessCode:", accessCode);
    if (code) {
      console.log("[parseCloud189Url] 解析成功 - shareCode:", code, "accessCode:", accessCode);
      return {
        shareCode: code,
        accessCode: accessCode,
      };
    }

    // 尝试从路径中提取短链接
    const pathMatch = url.match(/\/t\/([a-zA-Z0-9]+)/);
    if (pathMatch) {
      console.log("[parseCloud189Url] 短链接解析成功 - shareCode:", pathMatch[1]);
      return {
        shareCode: pathMatch[1],
        accessCode: accessCode,
      };
    }

    console.log("[parseCloud189Url] 无法解析URL");
    return null;
  } catch (e) {
    console.error("[parseCloud189Url] 解析 URL 失败:", e);
    return null;
  }
}

/**
 * 获取分享基础信息
 */
async function getShareInfo(shareCode, accessCode = "", cookie = "") {
  console.log("[getShareInfo] 获取分享信息 - shareCode:", shareCode, "accessCode:", accessCode);
  const noCache = Math.random();
  const apiUrl = `https://cloud.189.cn/api/open/share/getShareInfoByCodeV2.action?noCache=${noCache}&shareCode=${shareCode}`;
  console.log("[getShareInfo] 请求URL:", apiUrl);

  const headers = getCommonHeaders(cookie);

  try {
    const response = await Widget.http.get(apiUrl, { headers });
    console.log("[getShareInfo] 响应状态: 成功");
    let data = response.data;

    if (typeof data === "string") {
      data = JSON.parse(data);
    }

    console.log("[getShareInfo] 返回数据:", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("获取分享信息失败:", error);
    throw error;
  }
}

/**
 * 获取分享目录文件列表
 */
async function listShareDir(params) {
  console.log("[listShareDir] 获取文件列表");
  console.log("[listShareDir] 参数:", JSON.stringify(params));
  const {
    shareId,
    fileId,
    shareDirFileId,
    isFolder = true,
    shareMode = 3,
    accessCode = "",
    cookie = "",
    pageNum = 1,
    pageSize = 60,
  } = params;

  const noCache = Math.random();
  const apiUrl = `https://cloud.189.cn/api/open/share/listShareDir.action?noCache=${noCache}&pageNum=${pageNum}&pageSize=${pageSize}&fileId=${fileId}&isFolder=${isFolder}&shareId=${shareId}&shareMode=${shareMode}&iconOption=5&orderBy=lastOpTime&descending=true&accessCode=${accessCode}`;
  console.log("[listShareDir] 请求URL:", apiUrl);

  const headers = getCommonHeaders(cookie);

  try {
    const response = await Widget.http.get(apiUrl, { headers });
    console.log("[listShareDir] 响应状态: 成功");
    let data = response.data;

    if (typeof data === "string") {
      data = JSON.parse(data);
    }

    console.log("[listShareDir] 完整响应:", JSON.stringify(data));

    console.log("[listShareDir] 文件夹数量:", data.fileListAO?.folderList?.length || 0);
    console.log("[listShareDir] 文件数量:", data.fileListAO?.fileList?.length || 0);
    // 打印文件详情用于调试
    if (data.fileListAO?.fileList?.length > 0) {
      console.log("[listShareDir] 文件列表详情:", JSON.stringify(data.fileListAO.fileList.map(f => ({
        name: f.name,
        mediaType: f.mediaType,
        fileType: f.fileType,
        isFolder: f.isFolder
      }))));
    }
    return data;
  } catch (error) {
    console.error("获取文件列表失败:", error);
    throw error;
  }
}

/**
 * 加载详情 - 用于打开分享链接时获取内部文件列表
 * @param {string} link - 分享链接，可能是原始URL或包含参数的复合链接
 */
async function loadDetail(link) {
  console.log("[loadDetail] 开始加载详情");
  console.log("[loadDetail] link:", link);
  
  // 从 storage 获取 cookie
  const cookie = Widget.storage.get("cloud189_cookie") || "";
  console.log("[loadDetail] 获取 cookie:", cookie ? "已获取" : "未找到");
  
  // 解析链接，可能包含额外的参数信息（如 fileId）
  let shareCode, accessCode, fileId, shareId, shareMode;
  let isFolder = true; // 默认假设是文件夹

  // 如果不是 JSON 格式，尝试从 URL 解析
  if (!shareCode) {
    const parsed = parseCloud189Url(link);
    if (!parsed) {
      throw new Error("无法解析分享链接");
    }
    shareCode = parsed.shareCode;
    accessCode = parsed.accessCode || "";
  }

  // 如果 JSON 已经提供了完整信息，且是文件夹，直接获取文件夹内容
  if (shareId && fileId && isFolder) {
    console.log("[loadDetail] 使用JSON参数直接获取文件夹内容...");
    // 直接跳转到获取文件夹内容的逻辑
  }
  // 获取分享基础信息（如果需要的话）
  else if (!shareId || !fileId) {
    console.log("[loadDetail] 需要获取分享信息...");
    const shareInfo = await getShareInfo(shareCode, accessCode, cookie);
    if (!shareInfo || shareInfo.res_code !== 0) {
      console.error("[loadDetail] 获取分享信息失败:", shareInfo?.res_message);
      throw new Error(shareInfo?.res_message || "获取分享信息失败");
    }
    shareId = shareInfo.shareId;
    fileId = fileId || shareInfo.fileId;
    shareMode = shareInfo.shareMode || 3;
    isFolder = shareInfo.isFolder;
    console.log("[loadDetail] 分享信息 - shareId:", shareId, "fileId:", fileId, "isFolder:", isFolder);

    // 如果不是文件夹，返回单个文件信息
    if (!isFolder) {
      console.log("[loadDetail] 返回单个文件信息");
      return {
        id: `${shareId}_${fileId}`,
        type: "url",
        title: shareInfo.fileName,
        imgSrc: shareInfo.creator?.iconURL || "",
        releaseDate: shareInfo.fileCreateDate || "",
        videoUrl: "",
        backdropPath: shareInfo.creator?.iconURL || "",
        relatedItems: [],
        episodeItems: isVideoFile(shareInfo.fileName)
          ? [
              {
                id: `${shareId}_${fileId}`,
                type: "url",
                title: shareInfo.fileName,
                episodeNumber: 1,
                link: JSON.stringify({
                  shareCode,
                  accessCode,
                  shareId,
                  fileId,
                  shareMode,
                }),
              },
            ]
          : [],
      };
    }
  }

  try {
    // 获取文件夹内容
    const dirList = await listShareDir({
      shareId,
      fileId,
      shareDirFileId: fileId,
      isFolder: true,
      shareMode,
      accessCode,
      cookie,
    });

    if (dirList.res_code !== 0) {
      throw new Error(dirList.res_message || "获取文件列表失败");
    }

    const fileListAO = dirList.fileListAO || {};
    const folders = fileListAO.folderList || [];
    const files = fileListAO.fileList || [];

    console.log("[loadDetail] 原始文件数:", files.length, "文件夹数:", folders.length);
    
    // 筛选视频文件
    const videoFiles = files.filter((file) => isVideoFile(file));
    console.log("[loadDetail] 视频文件数:", videoFiles.length);
    if (files.length > 0 && videoFiles.length === 0) {
      console.log("[loadDetail] 文件名列表:", files.map(f => f.name));
    }

    // 如果当前目录没有视频文件，但有子文件夹，递归获取子文件夹内容
    if (videoFiles.length === 0 && folders.length > 0) {
      console.log("[loadDetail] 当前目录无视频文件，递归获取子文件夹内容...");
      
      let allEpisodeItems = [];
      let allRelatedItems = [];
      let episodeCounter = 0;

      for (const folder of folders) {
        console.log("[loadDetail] 递归进入文件夹:", folder.name);
        
        // 递归获取子文件夹内容
        const subResult = await getFilesRecursive({
          shareId,
          shareCode,
          shareMode,
          accessCode,
          cookie,
          rootFileId: fileId, // 传递根目录ID作为shareDirFileId
          folderId: folder.id,
          folderName: folder.name,
        });

        // 累加视频文件
        for (const episode of subResult.episodes) {
          episodeCounter++;
          allEpisodeItems.push({
            ...episode,
            episodeNumber: episodeCounter,
          });
        }

        // 累加子文件夹（如果还有更深层的）
        allRelatedItems = allRelatedItems.concat(subResult.folders);
      }

      console.log("[loadDetail] 递归完成 - episodeItems:", allEpisodeItems.length, "relatedItems:", allRelatedItems.length);
      // 使用第一个视频的图标作为背景图
      const backdropPath = allEpisodeItems.length > 0 ? allEpisodeItems[0].imgSrc : "";
      return {
        id: `${shareId}_${fileId}`,
        type: "url",
        title: dirList.fileName || "分享文件夹",
        videoUrl: "",
        backdropPath,
        relatedItems: allRelatedItems,
        episodeItems: allEpisodeItems,
      };
    }

    // 处理文件夹 -> relatedItems（用于继续导航）
    const relatedItems = folders.map((folder) => ({
      id: `${shareId}_${folder.id}`,
      type: "url",
      title: folder.name,
      imgSrc: folder.icon?.smallUrl || folder.icon?.largeUrl || "",
      // 使用 JSON 格式的复合链接，包含导航所需的所有参数
      link: JSON.stringify({
        shareCode,
        accessCode,
        shareId,
        fileId: folder.id,
        shareMode,
        isFolder: true, // 标记为文件夹，loadDetail 会获取其内容
      }),
      mediaType: "folder",
    }));

    // 处理文件 -> episodeItems (视频文件)
    const episodeItems = videoFiles.map((file, index) => ({
      id: `${shareId}_${file.id}`,
      type: "url",
      title: file.name,
      imgSrc: file.icon?.smallUrl || file.icon?.largeUrl || "",
      episodeNumber: index + 1,
      // 使用 JSON 格式的复合链接
      link: JSON.stringify({
        shareCode,
        accessCode,
        shareId,
        fileId: file.id,
        shareMode,
        fileName: file.name,
        fileSize: file.size,
      }),
    }));

    // 使用第一个视频文件的图标作为背景图
    const firstVideoIcon = videoFiles.length > 0 ? videoFiles[0].icon : null;
    const backdropPath = firstVideoIcon?.largeUrl || firstVideoIcon?.smallUrl || "";

    console.log("[loadDetail] 返回结果 - relatedItems:", relatedItems.length, "episodeItems:", episodeItems.length);
    return {
      id: `${shareId}_${fileId}`,
      type: "url",
      title: dirList.fileName || "分享文件夹",
      videoUrl: "",
      backdropPath,
      relatedItems,
      episodeItems,
    };
  } catch (error) {
    console.error("加载详情失败:", error);
    throw new Error("加载文件列表失败: " + error.message);
  }
}

/**
 * 递归获取文件夹内的所有视频文件
 */
async function getFilesRecursive(params) {
  const { shareId, shareCode, shareMode, accessCode, cookie, rootFileId, folderId, folderName } = params;
  console.log("[getFilesRecursive] 获取文件夹内容:", folderName, "folderId:", folderId, "rootFileId:", rootFileId);

  const dirList = await listShareDir({
    shareId,
    fileId: folderId,
    shareDirFileId: rootFileId, // 使用根目录ID
    isFolder: true,
    shareMode,
    accessCode,
    cookie,
  });

  if (dirList.res_code !== 0) {
    console.error("[getFilesRecursive] 获取失败:", dirList.res_message);
    return { episodes: [], folders: [] };
  }

  const fileListAO = dirList.fileListAO || {};
  const folders = fileListAO.folderList || [];
  const files = fileListAO.fileList || [];

  // 筛选视频文件
  const videoFiles = files.filter((file) => isVideoFile(file));
  
  // 将视频文件转换为 episode 格式
  const episodes = videoFiles.map((file) => ({
    id: `${shareId}_${file.id}`,
    type: "url",
    title: file.name,
    imgSrc: file.icon?.smallUrl || file.icon?.largeUrl || "",
    link: JSON.stringify({
      shareCode,
      accessCode,
      shareId,
      fileId: file.id,
      shareMode,
      fileName: file.name,
      fileSize: file.size,
    }),
  }));

  console.log("[getFilesRecursive] 文件夹:", folderName, "- 视频:", videoFiles.length, "子文件夹:", folders.length);

  // 如果有视频文件，返回；否则继续递归
  if (episodes.length > 0) {
    // 有视频了，子文件夹作为 relatedItems 返回（不再递归）
    const subFolders = folders.map((folder) => ({
      id: `${shareId}_${folder.id}`,
      type: "url",
      title: folder.name,
      imgSrc: folder.icon?.smallUrl || folder.icon?.largeUrl || "",
      link: JSON.stringify({
        shareCode,
        accessCode,
        shareId,
        fileId: folder.id,
        shareMode,
        isFolder: true,
      }),
      mediaType: "folder",
    }));
    return { episodes, folders: subFolders };
  }

  // 没有视频，继续递归子文件夹
  let allEpisodes = [];
  let allFolders = [];

  for (const folder of folders) {
    const subResult = await getFilesRecursive({
      shareId,
      shareCode,
      shareMode,
      accessCode,
      cookie,
      rootFileId, // 保持传递根目录ID
      folderId: folder.id,
      folderName: folder.name,
    });
    allEpisodes = allEpisodes.concat(subResult.episodes);
    allFolders = allFolders.concat(subResult.folders);
  }

  return { episodes: allEpisodes, folders: allFolders };
}

/**
 * 判断是否为视频文件
 * @param {Object|string} file - 文件对象或文件名
 * @returns {boolean}
 */
function isVideoFile(file) {
  // 如果传入的是文件对象，优先使用 mediaType 判断
  if (typeof file === "object" && file !== null) {
    // mediaType === 3 表示视频文件（来自天翼云API）
    if (file.mediaType === 3) {
      return true;
    }
    // 如果有 fileName 或 name 字段，用扩展名判断
    const fileName = file.name || file.fileName || "";
    return checkVideoExtension(fileName);
  }
  
  // 如果传入的是字符串（文件名），用扩展名判断
  if (typeof file === "string") {
    return checkVideoExtension(file);
  }
  
  return false;
}

/**
 * 通过文件扩展名判断是否为视频
 */
function checkVideoExtension(fileName) {
  const videoExtensions = [
    ".mp4",
    ".mkv",
    ".avi",
    ".mov",
    ".wmv",
    ".flv",
    ".webm",
    ".m4v",
    ".ts",
    ".rmvb",
    ".rm",
    ".3gp",
  ];
  const lowerName = (fileName || "").toLowerCase();
  return videoExtensions.some((ext) => lowerName.endsWith(ext));
}

/**
 * 获取视频播放地址
 * 作为 stream 类型模块，会接收媒体信息参数
 */
async function loadResource(params) {
  console.log("[loadResource] 开始获取播放地址");
  console.log("[loadResource] 参数:", JSON.stringify(params));
  const { cookie, link, extra } = params;

  if (!cookie) {
    throw new Error("请配置天翼云盘 Cookie");
  }

  let shareId, fileId;

  // 优先使用 extra 中的信息
  if (extra && extra.shareId && extra.fileId) {
    shareId = extra.shareId;
    fileId = extra.fileId;
  } else if (link) {
    // 尝试解析 JSON 格式的复合链接
    if (link.startsWith("{")) {
      try {
        const linkParams = JSON.parse(link);
        shareId = linkParams.shareId;
        fileId = linkParams.fileId;
      } catch (e) {
        console.error("解析 JSON 链接失败:", e);
      }
    }

    // 如果不是 JSON 格式，尝试从 URL 解析
    if (!shareId || !fileId) {
      const parsed = parseCloud189Url(link);
      if (parsed) {
        // 需要先获取 shareInfo
        const shareInfo = await getShareInfo(parsed.shareCode, parsed.accessCode);
        if (shareInfo && shareInfo.res_code === 0) {
          shareId = shareInfo.shareId;
          fileId = shareInfo.fileId;
        }
      }
    }
  }

  if (!shareId || !fileId) {
    throw new Error("无法获取 shareId 或 fileId");
  }

  try {
    const playUrl = await getPlayUrl(shareId, fileId, cookie);

    if (!playUrl) {
      throw new Error("获取播放地址失败");
    }

    return [
      {
        name: "天翼云盘",
        description: "原画质量",
        url: playUrl,
      },
    ];
  } catch (error) {
    console.error("获取播放地址失败:", error);
    throw new Error("获取播放地址失败: " + error.message);
  }
}

/**
 * 调用天翼云盘 API 获取播放地址
 */
async function getPlayUrl(shareId, fileId, cookie) {
  const noCache = Math.random();
  const apiUrl = `https://cloud.189.cn/api/portal/getNewVlcVideoPlayUrl.action?noCache=${noCache}&shareId=${shareId}&dt=1&fileId=${fileId}&type=4`;

  const headers = {
    Accept: "application/json;charset=UTF-8",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "zh-CN,zh-Hans;q=0.9",
    "Browser-Id": generateBrowserId(),
    Cookie: cookie,
    Referer: `https://cloud.189.cn/web/share?shareId=${shareId}`,
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "Sign-Type": "1",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15",
  };

  const response = await Widget.http.get(apiUrl, { headers });
  const data = response.data;

  if (typeof data === "string") {
    try {
      const json = JSON.parse(data);
      return extractPlayUrl(json);
    } catch (e) {
      console.error("解析响应失败:", e);
      return null;
    }
  }

  return extractPlayUrl(data);
}

/**
 * 从 API 响应中提取播放地址
 */
function extractPlayUrl(data) {
  if (data.res_code !== 0) {
    console.error("API 返回错误:", data.res_message);
    return null;
  }

  // 优先使用 normal 质量
  if (data.normal && data.normal.url) {
    return data.normal.url;
  }

  // 尝试其他质量
  const qualities = ["high", "medium", "low"];
  for (const quality of qualities) {
    if (data[quality] && data[quality].url) {
      return data[quality].url;
    }
  }

  return null;
}

/**
 * 获取通用请求头
 * @param {string} cookie - 可选的 Cookie
 */
function getCommonHeaders(cookie) {
  const headers = {
    Accept: "application/json;charset=UTF-8",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "zh-CN,zh-Hans;q=0.9",
    "Browser-Id": generateBrowserId(),
    Referer: "https://cloud.189.cn/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15",
  };
  
  if (cookie) {
    headers.Cookie = cookie;
  }
  
  return headers;
}

/**
 * 生成 Browser-Id
 */
function generateBrowserId() {
  const chars = "0123456789abcdef";
  let result = "";
  for (let i = 0; i < 32; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}
