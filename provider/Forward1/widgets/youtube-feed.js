WidgetMetadata = {
  id: "forward.youtube.feed",
  title: "YouTube 频道",
  icon: "https://www.youtube.com/s/desktop/28b0985e/img/favicon_144x144.png",
  version: "1.0.6",
  requiredVersion: "0.0.1",
  description: "订阅并播放 YouTube 视频",
  author: "Codex",
  site: "https://www.youtube.com",
  detailCacheDuration: 300,
  modules: [
    {
      id: "loadResource",
      title: "解析播放资源",
      functionName: "loadResource",
      type: "stream",
      params: [],
    },
    {
      id: "loadVideos",
      title: "YouTube视频订阅",
      description:
        "YouTube 支持视频、Shorts、直播、课程、播放列表和帖子。",
      functionName: "loadVideos",
      cacheDuration: 900,
      params: [
        {
          name: "source",
          title: "频道、播放列表或订阅源",
          type: "input",
          description:
            "YouTube：频道 ID、@handle、频道地址、播放列表地址或 Feed URL。",
          value: "",
        },
        {
          name: "youtubeResolver",
          title: "YouTube DASH Worker",
          type: "input",
          description:
            "填写 Worker 根地址或 https://HOST/dash/{videoId}/manifest.mpd。Worker 负责解析并代理音视频分轨。",
          value: "",
        },
        {
          name: "youtubeDetailWorker",
          title: "YouTube 详情 Worker",
          type: "input",
          description:
            "填写新建 Worker 的根地址。Worker 负责解析播放列表详情，并返回 Forward VideoItem。",
          value: "",
        },
        {
          name: "type",
          title: "YouTube 内容",
          type: "enumeration",
          value: "videos",
          enumOptions: [
            { title: "视频", value: "videos" },
            { title: "Shorts", value: "shorts" },
            { title: "直播", value: "live" },
            { title: "播客", value: "podcasts" },
            { title: "课程", value: "courses" },
            { title: "播放列表", value: "playlists" },
            { title: "帖子", value: "posts" },
          ],
        },
        {
          name: "sort_by",
          title: "排序方式",
          type: "enumeration",
          value: "latest",
          belongTo: {
            paramName: "type",
            value: ["videos", "shorts"],
          },
          enumOptions: [
            { title: "最新", value: "latest" },
            { title: "最热门", value: "popular" },
            { title: "最早", value: "oldest" },
          ],
        },
        {
          name: "page",
          title: "页码",
          type: "page",
        },
        {
          name: "count",
          title: "每页数量",
          type: "count",
          value: "50",
        },
      ],
    },
  ],
};


var DEFAULT_YOUTUBE_RESOLVER =
  "";
var DEFAULT_YOUTUBE_DETAIL_WORKER =
  "";
var YOUTUBE_DETAIL_WORKER_STORAGE_KEY =
  "forward.video.feed.youtubeDetailWorker";
var YOUTUBE_RESOLVER_STORAGE_KEY =
  "forward.video.feed.youtubeResolver";
var LEGACY_YOUTUBE_RESOLVER_HOSTS = [
  "inv.thepixora.com",
  "api.piped.private.coffee",
];
var YOUTUBE_CHANNEL_ID_PATTERN = /^UC[\w-]{22}$/;
var YOUTUBE_VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

async function loadVideos(params) {
  params = params || {};
  var request = normalizeFeedRequest(params);
  rememberYouTubeDetailWorker(request.youtubeDetailWorker);
  rememberYouTubeResolver(request.youtubeResolver);

  var playlistId = readYouTubePlaylistId(request.source);
  if (playlistId) {
    return [createYouTubePlaylistListItem({
      playlistId: playlistId,
      title: "YouTube 播放列表 " + playlistId,
      description: "点击进入详情后加载剧集",
      posterPath: "",
      resolver: request.youtubeResolver,
    })];
  }

  var videos = await loadYouTubeChannelContent(request);

  return paginateLatestVideos(videos, request);
}

async function loadDetail(link) {
  var detailLink = String(link || "");
  var playlistId = readYouTubePlaylistId(detailLink);
  if (playlistId) {
    return await loadPlaylistDetailFromWorker(playlistId);
  }

  var videoId = readVideoIdFromUrl(detailLink);
  if (videoId) {
    return createYouTubeVideoDetailItem({
      videoId: videoId,
      resolver: readYouTubeResolver(),
    });
  }

  return null;
}

async function loadPlaylistDetailFromWorker(playlistId) {
  var worker = readYouTubeDetailWorker();
  if (!worker) {
    throw new Error("请先部署 youtube-detail-worker，并在模块参数里填写 YouTube 详情 Worker 地址");
  }

  var response = await Widget.http.get(trimTrailingSlash(worker) + "/season", {
    headers: {
      Accept: "application/json",
    },
    params: {
      list: playlistId,
      youtubeResolver: readYouTubeResolver(),
    },
  });

  return assertForwardPlaylistDetail(readJsonResponse(response));
}

function readJsonResponse(response) {
  var data =
    response && Object.prototype.hasOwnProperty.call(response, "data")
      ? response.data
      : response;

  if (typeof data === "string") {
    return JSON.parse(data);
  }
  return data;
}

function assertForwardPlaylistDetail(detail) {
  assertPlainObject(detail, "详情页");
  assertNoTmdbSeasonFields(detail, "详情页");
  assertRequiredForwardFields(
    detail,
    ["id", "type", "title", "mediaType", "link", "episodeItems"],
    "详情页"
  );

  if (detail.type !== "url" || detail.mediaType !== "tv") {
    throw new Error("详情页必须是 type=url 且 mediaType=tv 的 Forward VideoItem");
  }

  if (!Array.isArray(detail.episodeItems)) {
    throw new Error("详情页 episodeItems 必须是数组");
  }

  detail.episodeItems.forEach(function (episode) {
    assertForwardEpisodeItem(episode);
  });

  return detail;
}

function assertForwardEpisodeItem(episode) {
  assertPlainObject(episode, "剧集");
  assertNoTmdbEpisodeFields(episode, "剧集");
  assertRequiredForwardFields(
    episode,
    ["id", "type", "title", "mediaType", "link"],
    "剧集"
  );

  if (episode.type !== "url") {
    throw new Error("剧集必须是 type=url 的 Forward VideoItem");
  }
}

function assertPlainObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(label + " JSON 必须是对象");
  }
}

function assertRequiredForwardFields(value, requiredKeys, label) {
  requiredKeys.forEach(function (key) {
    if (!Object.prototype.hasOwnProperty.call(value, key)) {
      throw new Error(label + " 缺少 Forward 字段 " + key);
    }
  });
}

function assertNoTmdbSeasonFields(value, label) {
  assertNoForbiddenFields(
    value,
    [
      "_id",
      "air_date",
      "episodes",
      "name",
      "networks",
      "overview",
      "poster_path",
      "season_number",
      "vote_average",
    ],
    label
  );
}

function assertNoTmdbEpisodeFields(value, label) {
  assertNoForbiddenFields(
    value,
    [
      "episode_number",
      "episode_type",
      "production_code",
      "runtime",
      "show_id",
      "still_path",
      "vote_count",
      "crew",
      "guest_stars",
    ],
    label
  );
}

function assertNoForbiddenFields(value, forbiddenKeys, label) {
  forbiddenKeys.forEach(function (key) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      throw new Error(label + " 不应返回 TMDB 字段 " + key);
    }
  });
}

function createYouTubeVideoDetailItem(request) {
  return createForwardVideoItem({
    videoId: request.videoId,
    title: "YouTube 视频",
    posterPath: createYouTubeLandscapeCover(request.videoId),
    resolver: request.resolver,
  });
}

function createForwardVideoItem(video) {
  var videoId = String(video.videoId || "");
  if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) {
    throw new Error("无效的 YouTube videoId");
  }

  var posterPath =
    video.posterPath ||
    createYouTubeLandscapeCover(videoId);
  var videoUrl = buildYouTubeResolverUrl(
    video.resolver || DEFAULT_YOUTUBE_RESOLVER,
    videoId
  );

  return {
    id: "youtube:video:" + videoId,
    type: "url",
    title: cleanText(video.title || "YouTube 视频"),
    mediaType: "movie",
    posterPath: posterPath,
    backdropPath: posterPath,
    description: cleanText(video.description || ""),
    link: getOfficialVideoUrl({
      videoId: videoId,
    }),
    videoUrl: videoUrl,
    playerType: "system",
  };
}

function createYouTubePlaylistListItem(playlist) {
  var title = cleanText(playlist.title || "YouTube 播放列表");
  var posterPath = playlist.posterPath || "";
  var link = getOfficialPlaylistUrl({
    playlistId: playlist.playlistId,
  });

  return {
    id: link,
    type: "url",
    title: title,
    mediaType: "tv",
    coverUrl: posterPath,
    posterPath: posterPath,
    backdropPath: posterPath,
    description: cleanText(playlist.description || ""),
    link: link,
  };
}


function youtubeWebHeaders() {
  return {
    Accept: "text/html",
    "Accept-Language":
      "zh-CN,zh;q=0.9,en;q=0.7",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) " +
      "AppleWebKit/537.36 Chrome/126.0 Safari/537.36",
  };
}





async function loadResource(params) {
  params = params || {};
  var inputUrl =
    params.videoUrl ||
    params.link ||
    params.id ||
    "";
  var resolver = readPlaybackResolver(params);

  if (isYouTubeDashManifestUrl(inputUrl)) {
    return [createYouTubeDashResourceFromUrl(inputUrl)];
  }

  var videoId = isYouTubeVideoId(inputUrl)
    ? String(inputUrl)
    : readVideoIdFromUrl(inputUrl);
  if (!videoId) {
    throw new Error("无法从播放链接解析 YouTube videoId");
  }

  return [
    createYouTubeDashResourceFromUrl(
      buildYouTubeResolverUrl(
        resolver,
        videoId
      )
    ),
  ];
}

function readPlaybackResolver(params) {
  return normalizeYouTubeResolver(
    params.youtubeResolver ||
      params.resolver ||
      readYouTubeResolver()
  );
}


function createYouTubeDashResourceFromUrl(url) {
  return {
    name: "YouTube DASH",
    description: "音视频分轨 · Worker 实时解析与代理",
    url: String(url),
  };
}

function isYouTubeDashManifestUrl(value) {
  try {
    var url = new URL(String(value || ""));
    return (
      (url.protocol === "https:" ||
        url.hostname === "localhost" ||
        url.hostname === "127.0.0.1") &&
      /\/dash\/[A-Za-z0-9_-]{11}\/manifest\.mpd\/?$/.test(url.pathname)
    );
  } catch (error) {
    return false;
  }
}


function normalizeYouTubeResolver(value) {
  var resolver = trimTrailingSlash(value);
  if (!resolver) {
    return DEFAULT_YOUTUBE_RESOLVER;
  }
  try {
    var endpoint = new URL(resolver);
    var host = endpoint.hostname.toLowerCase();
    if (LEGACY_YOUTUBE_RESOLVER_HOSTS.indexOf(host) >= 0) {
      return DEFAULT_YOUTUBE_RESOLVER;
    }
    if (
      endpoint.protocol !== "https:" &&
      host !== "localhost" &&
      host !== "127.0.0.1"
    ) {
      return DEFAULT_YOUTUBE_RESOLVER;
    }
    if (
      resolver.indexOf("{videoId}") >= 0 &&
      decodeURIComponent(endpoint.pathname).indexOf(
        "/dash/{videoId}/manifest.mpd"
      ) < 0
    ) {
      return DEFAULT_YOUTUBE_RESOLVER;
    }
  } catch (error) {
    return DEFAULT_YOUTUBE_RESOLVER;
  }
  return resolver;
}

function normalizeYouTubeDetailWorker(value) {
  var worker = trimTrailingSlash(value);
  if (!worker) {
    return DEFAULT_YOUTUBE_DETAIL_WORKER;
  }

  worker = worker.replace(/\/playlist$/i, "");
  try {
    var endpoint = new URL(worker);
    var host = endpoint.hostname.toLowerCase();
    if (
      endpoint.protocol !== "https:" &&
      host !== "localhost" &&
      host !== "127.0.0.1"
    ) {
      return DEFAULT_YOUTUBE_DETAIL_WORKER;
    }
  } catch (error) {
    return DEFAULT_YOUTUBE_DETAIL_WORKER;
  }

  return trimTrailingSlash(worker);
}

function rememberYouTubeDetailWorker(worker) {
  try {
    if (Widget.storage && Widget.storage.set) {
      Widget.storage.set(YOUTUBE_DETAIL_WORKER_STORAGE_KEY, worker || "");
    }
  } catch (error) {
  }
}

function rememberYouTubeResolver(resolver) {
  try {
    if (Widget.storage && Widget.storage.set) {
      Widget.storage.set(YOUTUBE_RESOLVER_STORAGE_KEY, resolver || "");
    }
  } catch (error) {
  }
}

function readYouTubeDetailWorker() {
  try {
    if (Widget.storage && Widget.storage.get) {
      return normalizeYouTubeDetailWorker(
        Widget.storage.get(YOUTUBE_DETAIL_WORKER_STORAGE_KEY)
      );
    }
  } catch (error) {
  }
  return DEFAULT_YOUTUBE_DETAIL_WORKER;
}

function readYouTubeResolver() {
  try {
    if (Widget.storage && Widget.storage.get) {
      return normalizeYouTubeResolver(
        Widget.storage.get(YOUTUBE_RESOLVER_STORAGE_KEY)
      );
    }
  } catch (error) {
  }
  return DEFAULT_YOUTUBE_RESOLVER;
}

function normalizeFeedRequest(params) {
  var source = String(params.source || "").trim();
  if (!source) {
    throw new Error("请填写频道、播放列表或订阅源地址");
  }

  return {
    source: source,
    youtubeResolver: normalizeYouTubeResolver(params.youtubeResolver),
    youtubeDetailWorker: normalizeYouTubeDetailWorker(params.youtubeDetailWorker),
    youtubeContent: normalizeYouTubeContent(params.type || params.youtubeContent),
    sort_by: normalizeYouTubeSort(params.sort_by),
    page: positiveInteger(params.page, 1),
    count: positiveInteger(params.count, 50),
  };
}

function normalizeYouTubeContent(value) {
  return [
    "videos",
    "shorts",
    "live",
    "playlists",
    "podcasts",
    "courses",
    "posts",
  ].indexOf(value) >= 0
    ? value
    : "videos";
}

function normalizeYouTubeSort(value) {
  return ["latest", "popular", "oldest"].indexOf(value) >= 0
    ? value
    : "latest";
}

async function resolveFeedUrl(request) {
  if (isYouTubeFeedUrl(request.source)) {
    return request.source;
  }

  var channelId = await resolveYouTubeChannelId(request.source);
  return buildYouTubeFeedUrl(channelId);
}

async function resolveYouTubeChannelId(source) {
  var channelId = readYouTubeChannelIdFromSource(source);
  if (channelId) {
    return channelId;
  }

  var channelPageUrl = resolveYouTubeChannelPageUrl(source);
  var response = await Widget.http.get(
    channelPageUrl,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148",
      },
    }
  );
  var html = String(response && response.data ? response.data : "");
  var channelId = extractYouTubeChannelId(html);
  if (!channelId) {
    throw new Error("无法从 YouTube handle 解析频道 ID，请改用 UC 开头的频道 ID");
  }
  return channelId;
}

async function loadYouTubeChannelContent(request) {
  if (request.youtubeContent === "videos" && isYouTubeFeedUrl(request.source)) {
    var feed = await fetchXmlFeed(request.source);
    return parseVideoFeed(feed, request);
  }

  var page = await fetchYouTubeChannelTabPage(request);
  var initialData = extractYtInitialData(page.html);
  var items = collectYouTubeTabItems(initialData, request);

  if (items.length) {
    return items;
  }

  if (request.youtubeContent === "videos") {
    var channelId = extractYouTubeChannelId(page.html);
    if (channelId) {
      var fallbackFeed = await fetchXmlFeed(buildYouTubeFeedUrl(channelId));
      return parseVideoFeed(fallbackFeed, request);
    }
  }

  throw new Error("没有读取到公开的 YouTube 内容");
}

async function fetchYouTubeChannelTabPage(request) {
  var pageUrl = resolveYouTubeChannelTabPageUrl(
    request.source,
    request.youtubeContent,
    request.sort_by
  );
  var response = await Widget.http.get(pageUrl, {
    headers: youtubeWebHeaders(),
  });

  return {
    url: pageUrl,
    html: String(response && response.data ? response.data : ""),
  };
}

function resolveYouTubeChannelTabPageUrl(source, content, sortBy) {
  var tab = readYouTubeContentTab(content);
  var url = resolveYouTubeChannelTabUrl(source, tab);
  return addYouTubeSortParams(url, readYouTubeContentSort(content, sortBy));
}

function resolveYouTubeChannelTabUrl(source, tab) {
  var channelId = readYouTubeChannelIdFromSource(source);
  if (channelId) {
    return "https://www.youtube.com/channel/" + channelId + "/" + tab;
  }
  if (isYouTubeChannelPageUrl(source)) {
    return normalizeYouTubeChannelTabUrl(source, tab);
  }
  if (isHttpUrl(source)) {
    throw new Error("频道栏目需要 YouTube 频道地址、频道 ID 或 @handle");
  }

  var handle = String(source || "").trim();
  handle = handle.charAt(0) === "@" ? handle.slice(1) : handle;
  return "https://www.youtube.com/@" + encodeURIComponent(handle) + "/" + tab;
}

function readYouTubeContentTab(content) {
  if (content.indexOf("shorts") === 0) {
    return "shorts";
  }
  if (content === "live") {
    return "streams";
  }
  if (content === "playlists") {
    return "playlists";
  }
  if (content === "podcasts") {
    return "podcasts";
  }
  if (content === "courses") {
    return "courses";
  }
  if (content === "posts") {
    return "community";
  }
  return "videos";
}

function readYouTubeContentSort(content, sortBy) {
  if (content === "videos" || content === "shorts") {
    return normalizeYouTubeSort(sortBy);
  }
  if (/_popular$/.test(content)) {
    return "popular";
  }
  if (/_oldest$/.test(content)) {
    return "oldest";
  }
  return "latest";
}

function addYouTubeSortParams(url, sort) {
  if (sort === "latest") {
    return url;
  }

  var endpoint = new URL(url);
  endpoint.searchParams.set("view", "0");
  endpoint.searchParams.set("sort", sort === "popular" ? "p" : "da");
  endpoint.searchParams.set("shelf_id", "0");
  return endpoint.toString();
}

function normalizeYouTubeChannelTabUrl(source, tab) {
  var url = new URL(String(source || ""));
  var parts = url.pathname.split("/").filter(Boolean);
  var baseParts = [];

  if (parts[0] && parts[0].charAt(0) === "@") {
    baseParts = [parts[0]];
  } else if (parts[0] === "channel" && parts[1]) {
    baseParts = [parts[0], parts[1]];
  } else if ((parts[0] === "c" || parts[0] === "user") && parts[1]) {
    baseParts = [parts[0], parts[1]];
  }

  if (!baseParts.length) {
    throw new Error("最新视频模式需要 YouTube 频道地址、频道 ID、@handle 或 Feed URL");
  }

  url.pathname = "/" + baseParts.concat(tab).join("/");
  url.search = "";
  url.hash = "";
  return url.toString();
}

function normalizeYouTubeChannelBaseUrl(source) {
  var url = new URL(String(source || ""));
  var parts = url.pathname.split("/").filter(Boolean);
  var baseParts = [];

  if (parts[0] && parts[0].charAt(0) === "@") {
    baseParts = [parts[0]];
  } else if (parts[0] === "channel" && parts[1]) {
    baseParts = [parts[0], parts[1]];
  } else if ((parts[0] === "c" || parts[0] === "user") && parts[1]) {
    baseParts = [parts[0], parts[1]];
  }

  if (!baseParts.length) {
    throw new Error("需要 YouTube 频道地址、频道 ID 或 @handle");
  }

  url.pathname = "/" + baseParts.join("/");
  url.search = "";
  url.hash = "";
  return url.toString();
}

function buildYouTubeFeedUrl(channelId) {
  return "https://www.youtube.com/feeds/videos.xml?channel_id=" + channelId;
}

function isYouTubeFeedUrl(source) {
  try {
    var url = new URL(String(source || ""));
    return (
      isYouTubeHost(url.hostname) &&
      url.pathname === "/feeds/videos.xml" &&
      YOUTUBE_CHANNEL_ID_PATTERN.test(url.searchParams.get("channel_id") || "")
    );
  } catch (error) {
    return false;
  }
}

function readYouTubeChannelIdFromSource(source) {
  var value = String(source || "").trim();
  if (YOUTUBE_CHANNEL_ID_PATTERN.test(value)) {
    return value;
  }

  try {
    var url = new URL(value);
    var feedChannelId = url.searchParams.get("channel_id") || "";
    if (YOUTUBE_CHANNEL_ID_PATTERN.test(feedChannelId)) {
      return feedChannelId;
    }

    var channelPathMatch = url.pathname.match(
      /^\/channel\/(UC[\w-]{22})(?:\/|$)/i
    );
    return channelPathMatch ? channelPathMatch[1] : "";
  } catch (error) {
    return "";
  }
}

function resolveYouTubeChannelPageUrl(source) {
  var value = String(source || "").trim();
  if (isYouTubeChannelPageUrl(value)) {
    return value;
  }
  if (isHttpUrl(value)) {
    throw new Error("最新视频模式需要 YouTube 频道地址、频道 ID、@handle 或 Feed URL");
  }

  var handle = value.charAt(0) === "@" ? value.slice(1) : value;
  return "https://www.youtube.com/@" + encodeURIComponent(handle);
}

function isYouTubeChannelPageUrl(source) {
  try {
    var url = new URL(String(source || ""));
    return (
      isYouTubeHost(url.hostname) &&
      /^\/(?:@[^/?#]+|c\/[^/?#]+|user\/[^/?#]+)(?:\/|$)/i.test(url.pathname)
    );
  } catch (error) {
    return false;
  }
}

function isYouTubeHost(hostname) {
  var host = String(hostname || "").toLowerCase();
  return host === "youtube.com" || host === "www.youtube.com" || host === "m.youtube.com";
}

function extractYouTubeChannelId(html) {
  var feedMatch = html.match(
    /feeds\/videos\.xml\?channel_id=(UC[\w-]{22})/
  );
  if (feedMatch) {
    return feedMatch[1];
  }

  var metadataMatch = html.match(/"channelId":"(UC[\w-]{22})"/);
  return metadataMatch ? metadataMatch[1] : "";
}

function readYouTubePlaylistId(source) {
  var value = String(source || "").trim();
  var urlMatch = value.match(/[?&]list=([\w-]{10,})/);
  if (urlMatch) {
    return urlMatch[1];
  }
  if (
    !YOUTUBE_CHANNEL_ID_PATTERN.test(value) &&
    /^(?:PL|UU|LL|RD|OLAK5uy_)[\w-]{8,}$/.test(value)
  ) {
    return value;
  }
  return "";
}

function extractYtInitialData(html) {
  var source = String(html || "");
  var markers = ["var ytInitialData =", 'window["ytInitialData"] ='];

  for (var index = 0; index < markers.length; index += 1) {
    var markerIndex = source.indexOf(markers[index]);
    if (markerIndex < 0) {
      continue;
    }
    var valueStart = markerIndex + markers[index].length;
    while (/\s/.test(source.charAt(valueStart))) {
      valueStart += 1;
    }
    if (
      source.charAt(valueStart) === "'" ||
      source.charAt(valueStart) === '"'
    ) {
      var stringValue = readJavaScriptString(source, valueStart);
      if (stringValue) {
        return JSON.parse(stringValue);
      }
      continue;
    }
    var objectStart = source.indexOf("{", valueStart);
    if (objectStart >= 0) {
      var jsonText = readBalancedJsonObject(source, objectStart);
      if (jsonText) {
        return JSON.parse(jsonText);
      }
    }
  }
  throw new Error("YouTube 页面缺少 ytInitialData");
}

function readJavaScriptString(source, startIndex) {
  var quote = source.charAt(startIndex);
  if (quote !== "'" && quote !== '"') {
    return "";
  }

  var result = "";
  for (var index = startIndex + 1; index < source.length; index += 1) {
    var character = source.charAt(index);
    if (character === quote) {
      return result;
    }
    if (character !== "\\") {
      result += character;
      continue;
    }

    index += 1;
    var escaped = source.charAt(index);
    if (escaped === "x") {
      result += String.fromCharCode(
        Number.parseInt(source.slice(index + 1, index + 3), 16)
      );
      index += 2;
    } else if (escaped === "u") {
      result += String.fromCharCode(
        Number.parseInt(source.slice(index + 1, index + 5), 16)
      );
      index += 4;
    } else if (escaped === "n") {
      result += "\n";
    } else if (escaped === "r") {
      result += "\r";
    } else if (escaped === "t") {
      result += "\t";
    } else if (escaped === "b") {
      result += "\b";
    } else if (escaped === "f") {
      result += "\f";
    } else {
      result += escaped;
    }
  }
  return "";
}

function readBalancedJsonObject(source, startIndex) {
  if (startIndex < 0 || source.charAt(startIndex) !== "{") {
    return "";
  }

  var depth = 0;
  var inString = false;
  var escaped = false;
  for (var index = startIndex; index < source.length; index += 1) {
    var character = source.charAt(index);
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === '"') {
        inString = false;
      }
      continue;
    }
    if (character === '"') {
      inString = true;
    } else if (character === "{") {
      depth += 1;
    } else if (character === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(startIndex, index + 1);
      }
    }
  }
  return "";
}

function collectYouTubeVideoItems(initialData, request) {
  var videos = [];
  var seenIds = {};

  walkObject(initialData, function (node) {
    var video = readYouTubeVideoModel(node, videos.length + 1);
    if (!video || seenIds[video.videoId]) {
      return;
    }

    seenIds[video.videoId] = true;
    videos.push(createForwardVideoItem({
      videoId: video.videoId,
      title: video.title,
      posterPath: video.posterPath,
      description: video.description,
      resolver: request.youtubeResolver,
    }));
    videos[videos.length - 1].duration = video.duration;
    videos[videos.length - 1].durationText = video.durationText;
  });

  return videos;
}

function collectYouTubeTabItems(initialData, request) {
  if (
    request.youtubeContent === "playlists" ||
    request.youtubeContent === "podcasts" ||
    request.youtubeContent === "courses"
  ) {
    return collectYouTubePlaylistItems(initialData, request);
  }
  if (request.youtubeContent === "posts") {
    return collectYouTubePostItems(initialData);
  }
  return collectYouTubeVideoItems(initialData, request);
}

function collectYouTubePlaylistItems(initialData, request) {
  var playlists = [];
  var seenIds = {};

  walkObject(initialData, function (node) {
    var playlist = readYouTubePlaylistModel(node, playlists.length + 1);
    if (!playlist || seenIds[playlist.playlistId]) {
      return;
    }

    seenIds[playlist.playlistId] = true;
    playlists.push(createYouTubePlaylistListItem({
      playlistId: playlist.playlistId,
      title: playlist.title,
      description: playlist.description,
      posterPath: playlist.posterPath,
      resolver: request.youtubeResolver,
    }));
  });

  return playlists;
}

function collectYouTubePostItems(initialData) {
  var posts = [];
  var seenIds = {};

  walkObject(initialData, function (node) {
    var post = readYouTubePostModel(node, posts.length + 1);
    if (!post || seenIds[post.id]) {
      return;
    }

    seenIds[post.id] = true;
    posts.push({
      id: post.id,
      type: "url",
      title: post.title,
      mediaType: "movie",
      posterPath: post.posterPath,
      backdropPath: post.posterPath,
      description: post.description,
      link: post.link,
    });
  });

  return posts;
}

function readYouTubeVideoModel(node, index) {
  if (!node || typeof node !== "object") {
    return null;
  }

  if (node.videoRenderer) {
    return readVideoRendererModel(node.videoRenderer, index);
  }

  if (node.lockupViewModel) {
    return readLockupVideoModel(node.lockupViewModel, index);
  }

  if (node.reelItemRenderer) {
    return readReelItemVideoModel(node.reelItemRenderer, index);
  }

  if (node.shortsLockupViewModel) {
    return readShortsLockupVideoModel(node.shortsLockupViewModel, index);
  }

  return null;
}

function readVideoRendererModel(renderer, index) {
  var videoId = String(renderer.videoId || "");
  if (!isYouTubeVideoId(videoId)) {
    return null;
  }

  var durationText = cleanText(readTextValue(renderer.lengthText));
  return {
    videoId: videoId,
    title:
      readTextValue(renderer.title) ||
      "视频 " + index,
    posterPath:
      readYouTubeThumbnail(renderer.thumbnail) ||
      createYouTubeLandscapeCover(videoId),
    description: readTextValue(renderer.descriptionSnippet),
    duration: readDurationMinutes(durationText),
    durationText: durationText,
  };
}

function readLockupVideoModel(model, index) {
  if (
    model.contentType &&
    model.contentType !== "LOCKUP_CONTENT_TYPE_VIDEO" &&
    model.contentType !== "LOCKUP_CONTENT_TYPE_SHORTS"
  ) {
    return null;
  }

  var endpoint = readLockupWatchEndpoint(model);
  var reelEndpoint = readLockupReelEndpoint(model);
  var videoId = String(model.contentId || endpoint.videoId || reelEndpoint.videoId || "");
  if (!isYouTubeVideoId(videoId)) {
    return null;
  }

  var metadata = model.metadata && model.metadata.lockupMetadataViewModel;
  var durationText = findYouTubeDurationText(model);
  return {
    videoId: videoId,
    title:
      readTextValue(metadata && metadata.title) ||
      findYouTubeVideoTitle(model) ||
      "视频 " + index,
    posterPath:
      readYouTubeThumbnailFromLockup(model) ||
      createYouTubeLandscapeCover(videoId),
    description: findTextMatching(
      metadata,
      /(?:\d+\s*(?:次观看|views?)|ago|前|小时前|天前|周前|个月前|年前)/i
    ),
    duration: readDurationMinutes(durationText),
    durationText: durationText,
  };
}

function readReelItemVideoModel(renderer, index) {
  var videoId = String(renderer.videoId || "");
  if (!isYouTubeVideoId(videoId)) {
    return null;
  }

  return {
    videoId: videoId,
    title:
      readTextValue(renderer.headline) ||
      readTextValue(renderer.title) ||
      "Shorts " + index,
    posterPath:
      readYouTubeThumbnail(renderer.thumbnail) ||
      createYouTubeLandscapeCover(videoId),
    description: readTextValue(renderer.viewCountText),
    duration: 0,
    durationText: "",
  };
}

function readShortsLockupVideoModel(model, index) {
  var endpoint =
    model.onTap &&
    model.onTap.innertubeCommand &&
    model.onTap.innertubeCommand.reelWatchEndpoint;
  var videoId = String(
    (endpoint && endpoint.videoId) ||
    model.videoId ||
    model.entityId ||
    ""
  );
  if (!isYouTubeVideoId(videoId)) {
    return null;
  }

  return {
    videoId: videoId,
    title:
      readTextValue(model.overlayMetadata && model.overlayMetadata.primaryText) ||
      readTextValue(model.accessibilityText) ||
      "Shorts " + index,
    posterPath:
      readYouTubeThumbnail(model.thumbnail) ||
      createYouTubeLandscapeCover(videoId),
    description: readTextValue(model.overlayMetadata && model.overlayMetadata.secondaryText),
    duration: 0,
    durationText: "",
  };
}

function readLockupWatchEndpoint(model) {
  return (
    model &&
    model.rendererContext &&
    model.rendererContext.commandContext &&
    model.rendererContext.commandContext.onTap &&
    model.rendererContext.commandContext.onTap.innertubeCommand &&
    model.rendererContext.commandContext.onTap.innertubeCommand.watchEndpoint
  ) || {};
}

function readLockupReelEndpoint(model) {
  return (
    model &&
    model.rendererContext &&
    model.rendererContext.commandContext &&
    model.rendererContext.commandContext.onTap &&
    model.rendererContext.commandContext.onTap.innertubeCommand &&
    model.rendererContext.commandContext.onTap.innertubeCommand.reelWatchEndpoint
  ) || {};
}

function readYouTubePlaylistModel(node, index) {
  if (!node || typeof node !== "object") {
    return null;
  }

  if (node.playlistRenderer) {
    return readPlaylistRendererModel(node.playlistRenderer, index);
  }
  if (node.gridPlaylistRenderer) {
    return readPlaylistRendererModel(node.gridPlaylistRenderer, index);
  }
  if (node.compactPlaylistRenderer) {
    return readPlaylistRendererModel(node.compactPlaylistRenderer, index);
  }
  if (node.lockupViewModel) {
    return readLockupPlaylistModel(node.lockupViewModel, index);
  }

  return null;
}

function readPlaylistRendererModel(renderer, index) {
  var endpoint =
    renderer.navigationEndpoint &&
    (renderer.navigationEndpoint.browseEndpoint || renderer.navigationEndpoint.watchEndpoint);
  var playlistId = String(
    renderer.playlistId ||
    (endpoint && (endpoint.playlistId || endpoint.browseId || "")) ||
    ""
  );
  playlistId = normalizeYouTubePlaylistId(playlistId);
  if (!playlistId) {
    return null;
  }

  return {
    playlistId: playlistId,
    title:
      readTextValue(renderer.title) ||
      "YouTube 播放列表 " + index,
    description:
      readTextValue(renderer.videoCountText) ||
      readTextValue(renderer.descriptionSnippet),
    posterPath: readYouTubePlaylistRendererThumbnail(renderer),
  };
}

function readLockupPlaylistModel(model, index) {
  var playlistId = normalizeYouTubePlaylistId(String(model.contentId || ""));
  if (!playlistId) {
    return null;
  }

  var metadata = model.metadata && model.metadata.lockupMetadataViewModel;
  return {
    playlistId: playlistId,
    title:
      readTextValue(metadata && metadata.title) ||
      findYouTubeVideoTitle(model) ||
      "YouTube 播放列表 " + index,
    description:
      findTextMatching(model, /(?:\d+\s*(?:个视频|個影片|videos?|episodes?|集))/i) ||
      "播放列表",
    posterPath: readYouTubePlaylistLockupThumbnail(model),
  };
}

function readYouTubePlaylistRendererThumbnail(renderer) {
  return (
    readYouTubeThumbnail(renderer.thumbnail) ||
    readYouTubeThumbnail(renderer.thumbnails) ||
    readYouTubeThumbnail(renderer.thumbnailRenderer) ||
    readYouTubeThumbnail(renderer.heroPlaylistThumbnailRenderer) ||
    readYouTubeThumbnail(renderer.primaryThumbnail) ||
    readFirstNestedYouTubeThumbnail(renderer) ||
    ""
  );
}

function readYouTubePlaylistLockupThumbnail(model) {
  return (
    readYouTubeThumbnailFromLockup(model) ||
    readYouTubeThumbnail(
      model.contentImage &&
      model.contentImage.collectionThumbnailViewModel &&
      model.contentImage.collectionThumbnailViewModel.primaryThumbnail
    ) ||
    readYouTubeThumbnail(
      model.contentImage &&
      model.contentImage.collectionThumbnailViewModel &&
      model.contentImage.collectionThumbnailViewModel.thumbnail
    ) ||
    readFirstNestedYouTubeThumbnail(model.contentImage) ||
    ""
  );
}

function normalizeYouTubePlaylistId(value) {
  var playlistId = String(value || "");
  if (playlistId.indexOf("VL") === 0) {
    playlistId = playlistId.slice(2);
  }
  if (YOUTUBE_CHANNEL_ID_PATTERN.test(playlistId)) {
    return "";
  }
  return /^(?:PL|UU|LL|RD|OLAK5uy_)[A-Za-z0-9_-]{8,}$/.test(playlistId)
    ? playlistId
    : "";
}

function readYouTubePostModel(node, index) {
  var renderer = node && (node.backstagePostThreadRenderer || node.backstagePostRenderer);
  if (!renderer) {
    return null;
  }

  var postRenderer = renderer.backstagePostRenderer || renderer;
  var postId = String(postRenderer.postId || postRenderer.entityKey || "");
  var content = readTextValue(postRenderer.contentText);
  if (!postId && !content) {
    return null;
  }

  var endpoint =
    postRenderer.publishedTimeText &&
    postRenderer.publishedTimeText.runs &&
    postRenderer.publishedTimeText.runs[0] &&
    postRenderer.publishedTimeText.runs[0].navigationEndpoint;
  var url =
    endpoint &&
    endpoint.commandMetadata &&
    endpoint.commandMetadata.webCommandMetadata &&
    endpoint.commandMetadata.webCommandMetadata.url;

  return {
    id: "youtube:post:" + (postId || index),
    title: cleanText(content || "YouTube 帖子 " + index),
    description: readTextValue(postRenderer.publishedTimeText),
    posterPath: readYouTubeThumbnail(postRenderer.backstageAttachment),
    link: url ? "https://www.youtube.com" + url : "https://www.youtube.com/post/" + encodeURIComponent(postId),
  };
}

function readYouTubeThumbnailFromLockup(model) {
  var sources =
    model &&
    model.contentImage &&
    model.contentImage.thumbnailViewModel &&
    model.contentImage.thumbnailViewModel.image &&
    model.contentImage.thumbnailViewModel.image.sources;

  return readLargestThumbnailUrl(sources);
}

function readYouTubeThumbnail(thumbnail) {
  if (Array.isArray(thumbnail)) {
    return readLargestThumbnailUrl(thumbnail);
  }
  return readLargestThumbnailUrl(
    thumbnail && (thumbnail.thumbnails || thumbnail.sources)
  );
}

function readFirstNestedYouTubeThumbnail(value) {
  var posterPath = "";
  walkObject(value, function (node) {
    if (posterPath || !node || typeof node !== "object") {
      return;
    }
    posterPath = readYouTubeThumbnail(node);
  });
  return posterPath;
}

function readLargestThumbnailUrl(thumbnails) {
  if (!Array.isArray(thumbnails) || !thumbnails.length) {
    return "";
  }

  thumbnails = thumbnails.slice().sort(function (left, right) {
    return (
      Number(right.width || 0) * Number(right.height || 0) -
      Number(left.width || 0) * Number(left.height || 0)
    );
  });

  return String(thumbnails[0].url || "").replace(/\\u0026/g, "&");
}

function findYouTubeVideoTitle(value) {
  var title = "";
  walkObject(value, function (candidate) {
    if (title || !candidate || typeof candidate !== "object") {
      return;
    }

    if (typeof candidate.content === "string" && candidate.content.trim()) {
      title = cleanText(candidate.content);
      return;
    }

    if (
      Array.isArray(candidate.runs) &&
      candidate.runs[0] &&
      typeof candidate.runs[0].text === "string"
    ) {
      title = cleanText(candidate.runs.map(function (run) {
        return run.text || "";
      }).join(""));
    }
  });
  return title;
}

function findYouTubeDurationText(value) {
  var duration = "";
  walkObject(value, function (candidate) {
    if (duration) {
      return;
    }

    var text = readTextValue(candidate);
    if (!text) {
      return;
    }

    var match = cleanText(text).match(
      /(?:^|\s)(\d{1,2}:\d{2}(?::\d{2})?)(?:\s|$)/
    );
    if (match) {
      duration = match[1];
    }
  });
  return duration;
}


function walkObject(value, visitor) {
  if (value === null || value === undefined) {
    return;
  }
  visitor(value);
  if (typeof value !== "object") {
    return;
  }
  if (Array.isArray(value)) {
    value.forEach(function (item) {
      walkObject(item, visitor);
    });
    return;
  }
  Object.keys(value).forEach(function (key) {
    walkObject(value[key], visitor);
  });
}

function readTextValue(value) {
  if (typeof value === "string") {
    return value;
  }
  if (!value || typeof value !== "object") {
    return "";
  }
  if (typeof value.content === "string") {
    return value.content;
  }
  if (typeof value.simpleText === "string") {
    return value.simpleText;
  }
  if (value.text) {
    return readTextValue(value.text);
  }
  if (value.dynamicTextViewModel) {
    return readTextValue(value.dynamicTextViewModel.text);
  }
  if (Array.isArray(value.runs)) {
    return value.runs
      .map(function (run) {
        return run.text || "";
      })
      .join("");
  }
  return "";
}

function findTextMatching(value, pattern) {
  var result = "";
  walkObject(value, function (candidate) {
    if (result) {
      return;
    }
    var text = readTextValue(candidate);
    if (text && pattern.test(text)) {
      result = cleanText(text);
    }
  });
  return result;
}

function createYouTubeLandscapeCover(videoId) {
  return videoId
    ? "https://i.ytimg.com/vi/" + videoId + "/hqdefault.jpg"
    : "";
}


async function fetchXmlFeed(url) {
  var response = await Widget.http.get(url, {
    headers: {
      Accept: "application/atom+xml, application/rss+xml, application/xml, text/xml",
      "User-Agent": "ForwardWidgets/1.0",
    },
  });
  if (!response || !response.data) {
    throw new Error("订阅源没有返回内容");
  }
  return String(response.data);
}

function parseVideoFeed(xml, request) {
  var $ = Widget.html.load(xml, {
    xmlMode: true,
    decodeEntities: true,
  });
  var nodes = $("entry");
  if (!nodes.length) {
    nodes = $("item");
  }

  var videos = [];
  nodes.each(function (_, element) {
    var item = $(element);
    var link = readItemLink(item);
    var videoId = readYouTubeVideoId(
      item,
      link
    );

    if (!videoId) {
      return;
    }

    var title =
      cleanText(item.find("title").first().text()) ||
      videoId;
    var description = readDescription(item);
    var releaseDate = formatDate(
      item.find("published").first().text() ||
        item.find("pubDate").first().text() ||
        item.find("updated").first().text()
    );
    var coverUrl = readCoverUrl(
      videoId
    );
    var detailLink = getOfficialVideoUrl({
      videoId: videoId,
    });

    var video = createForwardVideoItem({
      videoId: videoId,
      title: title,
      posterPath: coverUrl,
      description: description,
      resolver: request.youtubeResolver,
    });
    video.releaseDate = releaseDate;
    video.link = detailLink;
    videos.push(video);
  });
  return videos;
}


function readItemLink(item) {
  return (
    item.find('link[rel="alternate"]').first().attr("href") ||
    item.find("link").first().attr("href") ||
    cleanText(item.find("link").first().text()) ||
    cleanText(item.find("guid").first().text())
  );
}

function readYouTubeVideoId(item, link) {
  var namespacedId = cleanText(item.find("yt\\:videoId").first().text());
  if (namespacedId) {
    return namespacedId;
  }

  var altNames = ["yt\\:videoid", "yt\\:videoID", "yt\\:VideoId"];
  for (var i = 0; i < altNames.length; i += 1) {
    var altId = cleanText(item.find(altNames[i]).first().text());
    if (altId) {
      return altId;
    }
  }

  var atomId = cleanText(item.find("id").first().text());
  if (atomId) {
    var parts = atomId.split(":");
    var candidate = parts[parts.length - 1];
    if (/^[\w-]{11}$/.test(candidate)) {
      return candidate;
    }
  }

  var guidText = cleanText(item.find("guid").first().text());
  if (guidText) {
    var guidMatch = guidText.match(/(?:yt:video:)?([\w-]{11})/i);
    if (guidMatch) {
      return guidMatch[1];
    }
  }

  return readVideoIdFromUrl(link);
}


function readDescription(item) {
  var raw =
    item.find("media\\:description").first().text() ||
    item.find("content\\:encoded").first().text() ||
    item.find("description").first().text() ||
    item.find("summary").first().text();
  return cleanText(stripHtml(raw));
}

function readCoverUrl(videoId) {
  return createYouTubeLandscapeCover(videoId);
}

function buildYouTubeResolverUrl(resolver, videoId) {
  var endpoint = String(resolver || "").trim();
  if (endpoint.indexOf("{videoId}") >= 0) {
    return endpoint.replace("{videoId}", encodeURIComponent(videoId));
  }
  return (
    trimTrailingSlash(endpoint) +
    "/dash/" +
    encodeURIComponent(videoId) +
    "/manifest.mpd"
  );
}





function readVideoIdFromUrl(url) {
  var value = String(url || "");
  if (!value) {
    return "";
  }
  if (isYouTubeVideoId(value)) {
    return value;
  }

  var vParamMatch = value.match(/[?&]v=([A-Za-z0-9_-]{11})/);
  if (vParamMatch) {
    return vParamMatch[1];
  }

  var shortMatch = value.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
  if (shortMatch) {
    return shortMatch[1];
  }

  var pathMatch = value.match(/\/embed\/([A-Za-z0-9_-]{11})/);
  if (pathMatch) {
    return pathMatch[1];
  }

  var shortsMatch = value.match(/\/shorts\/([A-Za-z0-9_-]{11})/);
  if (shortsMatch) {
    return shortsMatch[1];
  }

  var directPathMatch = value.match(/\/v\/([A-Za-z0-9_-]{11})/);
  if (directPathMatch) {
    return directPathMatch[1];
  }

  var watchPathMatch = value.match(/\/watch\/([A-Za-z0-9_-]{11})/);
  if (watchPathMatch) {
    return watchPathMatch[1];
  }

  return "";
}

function getOfficialVideoUrl(playback) {
  var url =
    "https://www.youtube.com/watch?v=" +
    encodeURIComponent(playback.videoId);

  if (playback.playlistId) {
    url +=
      "&list=" +
      encodeURIComponent(playback.playlistId);
  }

  if (playback.playlistId && Number(playback.index) > 0) {
    url +=
      "&index=" +
      encodeURIComponent(playback.index);
  }

  return url;
}

function getOfficialPlaylistUrl(collection) {
  return (
    "https://www.youtube.com/playlist?list=" +
    encodeURIComponent(collection.playlistId)
  );
}


function paginate(items, page, count) {
  var start = (positiveInteger(page, 1) - 1) * positiveInteger(count, 20);
  return items.slice(start, start + positiveInteger(count, 20));
}

function paginateLatestVideos(items, request) {
  if (isYouTubeFeedUrl(request.source)) {
    return paginate(items, request.page, request.count);
  }

  var count = positiveInteger(request.count, 15);
  var pageSize = Math.max(count * 2, 30);
  var start = (positiveInteger(request.page, 1) - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

function formatDate(value) {
  var date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return (
    date.getFullYear() +
    "-" +
    padNumber(date.getMonth() + 1) +
    "-" +
    padNumber(date.getDate())
  );
}

function readDurationMinutes(value) {
  var text = String(value || "").trim();
  if (!text) {
    return 0;
  }

  var parts = text.split(":").map(function (part) {
    return Number.parseInt(part, 10);
  });
  if (parts.some(function (part) {
    return !Number.isFinite(part);
  })) {
    return 0;
  }
  if (parts.length === 3) {
    return Math.round(parts[0] * 60 + parts[1] + parts[2] / 60);
  }
  if (parts.length === 2) {
    return Math.round(parts[0] + parts[1] / 60);
  }
  return 0;
}

function padNumber(value) {
  return String(value).padStart(2, "0");
}

function cleanText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}


function stripHtml(value) {
  return String(value || "").replace(/<[^>]*>/g, " ");
}

function positiveInteger(value, fallback) {
  var parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function isHttpUrl(value) {
  return /^https?:\/\//i.test(String(value || ""));
}

function trimTrailingSlash(value) {
  return String(value || "")
    .trim()
    .replace(/\/+$/, "");
}

function isYouTubeVideoId(value) {
  return YOUTUBE_VIDEO_ID_PATTERN.test(String(value || ""));
}
