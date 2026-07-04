// Cloudflare Worker - chigua cover proxy v1.0
// 适配 chigua.com / 51吃瓜 系列站点
// 解密算法：AES-CBC
// 部署方式：复制全部内容粘贴到 Cloudflare Workers 编辑器，Save and Deploy

var KEY_TEXT = "f5d965df75336270";
var IV_TEXT  = "97b60394abc2fbe1";

// 允许的图片域名（chigua.com 系列）
var STATIC_ALLOWED_HOSTS = {
  "pic.hkvadq.cn":  true,   // chigua.com 当前图片域名
  "pic.sfbjdu.cn":  true,   // 备用
  "pic.myedua.cn":  true,   // 备用
  "pic.vslaqe.cn":  true    // 备用
};

// 域名故障时的自动备用顺序
var FALLBACK_HOSTS = {
  "pic.hkvadq.cn": ["pic.sfbjdu.cn", "pic.myedua.cn"],
  "pic.sfbjdu.cn": ["pic.hkvadq.cn", "pic.myedua.cn"],
  "pic.myedua.cn": ["pic.hkvadq.cn", "pic.vslaqe.cn"],
  "pic.vslaqe.cn": ["pic.hkvadq.cn", "pic.myedua.cn"]
};

var FETCH_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
  "Accept-Language": "zh-CN,zh;q=0.9",
  "Referer": "https://chigua.com/"
};

addEventListener("fetch", function(event) {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders() });
  }

  var requestUrl = new URL(request.url);

  // 健康检查
  if (requestUrl.pathname === "/health") {
    return jsonResponse({ status: "ok", timestamp: Date.now(), version: "1.0" });
  }

  var imageUrl = requestUrl.searchParams.get("url") || "";
  if (!imageUrl) {
    return jsonResponse({ error: "missing url parameter" }, 400);
  }

  var parsed;
  try {
    parsed = new URL(imageUrl);
  } catch (e) {
    return jsonResponse({ error: "invalid url format" }, 400);
  }

  if (parsed.protocol !== "https:") {
    return jsonResponse({ error: "only https allowed" }, 403);
  }
  if (!isAllowedImageUrl(parsed)) {
    return jsonResponse({ error: "host or path not allowed" }, 403);
  }

  // 请求原始图片（含备用域名重试）
  var upstream = await fetchWithFallbacks(parsed);
  if (!upstream.response || !upstream.response.ok) {
    // 兜底：直接请求
    try {
      var directRes = await fetch(parsed.toString(), { headers: FETCH_HEADERS });
      if (directRes.ok) {
        var directBody = await directRes.arrayBuffer();
        return imageResponse(directBody, parsed.pathname);
      }
    } catch (e) {}
    return jsonResponse({
      error: "upstream fetch failed",
      status: upstream.status,
      lastError: upstream.lastError
    }, upstream.status || 502);
  }

  var encrypted;
  try {
    encrypted = await upstream.response.arrayBuffer();
  } catch (e) {
    return jsonResponse({ error: "read upstream body failed", detail: e.message }, 502);
  }

  // AES-CBC 解密
  var decrypted;
  try {
    decrypted = await decryptAesCbc(encrypted);
  } catch (e) {
    // 解密失败：可能本来就是明文图片，直接返回
    return imageResponse(encrypted, parsed.pathname);
  }

  if (!decrypted || decrypted.byteLength === 0) {
    return imageResponse(encrypted, parsed.pathname);
  }

  // 验证解密结果是否是有效图片
  if (!isValidImageMagic(decrypted)) {
    return imageResponse(encrypted, parsed.pathname);
  }

  return imageResponse(decrypted, parsed.pathname);
}

// ── URL 校验 ──────────────────────────────────────────
function isAllowedImageUrl(parsed) {
  var host = String(parsed.hostname || "").toLowerCase();
  var path = String(parsed.pathname || "").toLowerCase();
  if (!isEncryptedPath(path)) return false;
  if (STATIC_ALLOWED_HOSTS[host]) return true;
  // 允许 pic.xxxxx.cn/com/net 格式的域名（应对站点换域名）
  return /^pic\.[a-z0-9-]+\.(cn|com|net)$/i.test(host);
}

function isEncryptedPath(pathname) {
  return /\/upload_01\//i.test(pathname) ||
         /\/xiao\//i.test(pathname) ||
         /\/uploads\//i.test(pathname) ||
         /\/upload\/upload\//i.test(pathname);
}

// ── 备用域名重试 ──────────────────────────────────────
async function fetchWithFallbacks(parsed) {
  var urls = [parsed.toString()];
  var fallbackHosts = FALLBACK_HOSTS[parsed.hostname] || [];

  for (var i = 0; i < fallbackHosts.length; i++) {
    var candidate = new URL(parsed.toString());
    candidate.hostname = fallbackHosts[i];
    if (isAllowedImageUrl(candidate)) urls.push(candidate.toString());
  }

  var lastError = "";
  var lastStatus = 502;

  for (var j = 0; j < urls.length; j++) {
    try {
      var response = await fetch(urls[j], { headers: FETCH_HEADERS });
      lastStatus = response.status;
      if (response.ok) {
        return { response: response, status: response.status, lastError: "" };
      }
      lastError = "HTTP " + response.status + " from " + urls[j];
    } catch (e) {
      lastStatus = 502;
      lastError = (e && e.message) || "fetch error from " + urls[j];
    }
  }

  return { response: null, status: lastStatus, lastError: lastError };
}

// ── AES-CBC 解密 ──────────────────────────────────────
async function decryptAesCbc(encrypted) {
  var key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(KEY_TEXT),
    { name: "AES-CBC" },
    false,
    ["decrypt"]
  );
  return await crypto.subtle.decrypt(
    { name: "AES-CBC", iv: new TextEncoder().encode(IV_TEXT) },
    key,
    encrypted
  );
}

// ── 图片魔数验证 ──────────────────────────────────────
function isValidImageMagic(bytes) {
  if (!bytes || bytes.byteLength < 4) return true;
  var b = new Uint8Array(bytes);
  // JPEG: FF D8 FF
  if (b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF) return true;
  // PNG: 89 50 4E 47
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47) return true;
  // GIF: 47 49 46
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) return true;
  // WebP: RIFF....WEBP
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
      bytes.byteLength > 12 &&
      b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return true;
  return false;
}

// ── 响应工具 ──────────────────────────────────────────
function imageResponse(body, pathname) {
  return new Response(body, {
    headers: {
      "Content-Type": contentTypeFromPath(pathname),
      "Cache-Control": "public, max-age=604800, immutable",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS"
    }
  });
}

function contentTypeFromPath(pathname) {
  var lower = String(pathname || "").toLowerCase();
  if (lower.indexOf(".png")  !== -1) return "image/png";
  if (lower.indexOf(".gif")  !== -1) return "image/gif";
  if (lower.indexOf(".webp") !== -1) return "image/webp";
  if (lower.indexOf(".svg")  !== -1) return "image/svg+xml";
  return "image/jpeg";
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
}

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*"
    }
  });
}