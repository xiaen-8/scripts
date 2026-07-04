WidgetMetadata = {
    id: "catpawplay_fw_browser",
    title: "CatPawPlay_FW",
    author: "OpenAI",
    description: "本地 CatPawPlay 浏览模块",
    version: "1.0.0",
    requiredVersion: "0.0.1",
    site: "http://localhost:2333",
    modules: [
        {
            title: "浏览视频",
            functionName: "loadList",
            type: "video",
            params: [
                { name: "page", title: "页码", type: "page" },
                { name: "embyBaseUrl", title: "Emby地址", type: "input", value: "http://localhost:2333/emby" },
                { name: "embyApiKey", title: "API Key", type: "input", value: "fw" },
                { name: "embyUserId", title: "UserId", type: "input", value: "emby-user-001" }
            ]
        },
        {
            title: "搜索视频",
            functionName: "searchList",
            type: "video",
            params: [
                { name: "keyword", title: "关键词", type: "input", value: "" },
                { name: "page", title: "页码", type: "page" },
                { name: "embyBaseUrl", title: "Emby地址", type: "input", value: "http://localhost:2333/emby" },
                { name: "embyApiKey", title: "API Key", type: "input", value: "fw" },
                { name: "embyUserId", title: "UserId", type: "input", value: "emby-user-001" }
            ]
        }
    ]
};

function normalizeBaseUrl(url) {
    var v = String(url || "").trim();
    return v && v.charAt(v.length - 1) === "/" ? v.slice(0, -1) : v;
}

function getImageUrl(baseUrl, apiKey, itemId, imageType) {
    return normalizeBaseUrl(baseUrl) + "/Items/" + encodeURIComponent(String(itemId)) + "/Images/" + encodeURIComponent(String(imageType)) + "?api_key=" + encodeURIComponent(String(apiKey || ""));
}

function toLinkItem(baseUrl, apiKey, item) {
    if (!item || !item.Id) return null;
    var itemType = String(item.Type || "");
    var linkType = "item";
    if (itemType === "Folder" || itemType === "CollectionFolder") linkType = "folder";
    if (itemType === "Series") linkType = "series";
    return {
        id: String(item.Id),
        type: "link",
        title: String(item.Name || item.Id),
        coverUrl: getImageUrl(baseUrl, apiKey, item.Id, "Primary"),
        link: linkType + ":" + String(item.Id),
        description: String(item.Overview || "").trim()
    };
}

function toVideoItem(baseUrl, apiKey, item) {
    if (!item || !item.Id) return null;
    return {
        id: String(item.Id),
        type: "video",
        title: String(item.Name || item.Id),
        videoUrl: normalizeBaseUrl(baseUrl) + "/Videos/" + encodeURIComponent(String(item.Id)) + "/stream?api_key=" + encodeURIComponent(String(apiKey || "")),
        coverUrl: getImageUrl(baseUrl, apiKey, item.Id, "Primary"),
        description: String(item.Overview || "").trim(),
        playerType: "system"
    };
}

function parseListResponse(baseUrl, apiKey, data) {
    var items = (data && Array.isArray(data.Items)) ? data.Items : [];
    var results = [];
    for (var i = 0; i < items.length; i++) {
        var row = toLinkItem(baseUrl, apiKey, items[i]);
        if (row) results.push(row);
    }
    if (results.length === 0) {
        return [{ id: "empty", type: "text", title: "没有找到内容" }];
    }
    return results;
}

async function loadList(params) {
    params = params || {};
    var page = Number(params.page || 1);
    var baseUrl = normalizeBaseUrl(params.embyBaseUrl || "http://localhost:2333/emby");
    var apiKey = String(params.embyApiKey || "fw").trim();
    var userId = String(params.embyUserId || "emby-user-001").trim();
    var limit = 30;
    try {
        var res = await Widget.http.get(baseUrl + "/Users/" + encodeURIComponent(userId) + "/Items", {
            params: {
                api_key: apiKey,
                Recursive: "false",
                Limit: limit,
                StartIndex: (page - 1) * limit,
                Fields: "CommunityRating,Overview,PremiereDate,ImageTags"
            }
        });
        return parseListResponse(baseUrl, apiKey, res.data);
    } catch (e) {
        return [{ id: "err", type: "text", title: "加载失败", subTitle: e.message }];
    }
}

async function searchList(params) {
    params = params || {};
    var page = Number(params.page || 1);
    var keyword = String(params.keyword || "").trim();
    var baseUrl = normalizeBaseUrl(params.embyBaseUrl || "http://localhost:2333/emby");
    var apiKey = String(params.embyApiKey || "fw").trim();
    var userId = String(params.embyUserId || "emby-user-001").trim();
    var limit = 30;
    if (!keyword) {
        return [{ id: "tip", type: "text", title: "请输入关键词开始搜索" }];
    }
    try {
        var res = await Widget.http.get(baseUrl + "/Users/" + encodeURIComponent(userId) + "/Items", {
            params: {
                api_key: apiKey,
                Recursive: "true",
                IncludeItemTypes: "Movie,Series,Video",
                SearchTerm: keyword,
                Limit: limit,
                StartIndex: (page - 1) * limit,
                Fields: "CommunityRating,Overview,PremiereDate,ImageTags"
            }
        });
        return parseListResponse(baseUrl, apiKey, res.data);
    } catch (e) {
        return [{ id: "err", type: "text", title: "搜索失败", subTitle: e.message }];
    }
}

async function loadDetail(link) {
    var baseUrl = normalizeBaseUrl("http://localhost:2333/emby");
    var apiKey = "fw";
    var userId = "emby-user-001";
    try {
        var parts = String(link || "").split(":");
        var kind = parts.shift();
        var itemId = parts.join(":");
        if (!itemId) {
            return [{ id: "err", type: "text", title: "无效链接" }];
        }

        if (kind === "folder") {
            var listRes = await Widget.http.get(baseUrl + "/Users/" + encodeURIComponent(userId) + "/Items", {
                params: {
                    api_key: apiKey,
                    ParentId: itemId,
                    Limit: 100,
                    Fields: "CommunityRating,Overview,PremiereDate,ImageTags"
                }
            });
            return parseListResponse(baseUrl, apiKey, listRes.data);
        }

        if (kind === "series") {
            var epRes = await Widget.http.get(baseUrl + "/Shows/" + encodeURIComponent(itemId) + "/Episodes", {
                params: {
                    api_key: apiKey,
                    UserId: userId,
                    Limit: 150,
                    Fields: "CommunityRating,Overview,PremiereDate,ImageTags"
                }
            });
            var eps = (epRes && epRes.data && Array.isArray(epRes.data.Items)) ? epRes.data.Items : [];
            var episodeItems = [];
            for (var i = 0; i < eps.length; i++) {
                var ep = toVideoItem(baseUrl, apiKey, eps[i]);
                if (ep) episodeItems.push(ep);
            }
            return episodeItems.length ? episodeItems : [{ id: "empty", type: "text", title: "没有找到剧集" }];
        }

        var itemRes = await Widget.http.get(baseUrl + "/Users/" + encodeURIComponent(userId) + "/Items/" + encodeURIComponent(itemId), {
            params: {
                api_key: apiKey,
                Fields: "CommunityRating,Overview,PremiereDate,ImageTags"
            }
        });
        var item = itemRes && itemRes.data ? itemRes.data : null;
        if (!item) {
            return [{ id: "err", type: "text", title: "未找到视频" }];
        }
        var type = String(item.Type || "");
        if (type === "Folder" || type === "CollectionFolder") {
            var childRes = await Widget.http.get(baseUrl + "/Users/" + encodeURIComponent(userId) + "/Items", {
                params: {
                    api_key: apiKey,
                    ParentId: itemId,
                    Limit: 100,
                    Fields: "CommunityRating,Overview,PremiereDate,ImageTags"
                }
            });
            return parseListResponse(baseUrl, apiKey, childRes.data);
        }
        if (type === "Series") {
            var sRes = await Widget.http.get(baseUrl + "/Shows/" + encodeURIComponent(itemId) + "/Episodes", {
                params: {
                    api_key: apiKey,
                    UserId: userId,
                    Limit: 150,
                    Fields: "CommunityRating,Overview,PremiereDate,ImageTags"
                }
            });
            var sEps = (sRes && sRes.data && Array.isArray(sRes.data.Items)) ? sRes.data.Items : [];
            var sItems = [];
            for (var j = 0; j < sEps.length; j++) {
                var row = toVideoItem(baseUrl, apiKey, sEps[j]);
                if (row) sItems.push(row);
            }
            return sItems.length ? sItems : [{ id: "empty", type: "text", title: "没有找到剧集" }];
        }
        var videoItem = toVideoItem(baseUrl, apiKey, item);
        return videoItem ? [videoItem] : [{ id: "err", type: "text", title: "解析失败" }];
    } catch (e) {
        return [{ id: "err", type: "text", title: "请求错误", subTitle: e.message }];
    }
}
