/**
 * ============================================================
 * Cloudflare Worker: 跨域与防盗链突破代理 (Cover Proxy)
 * 作用：注入 Referer 和 UA，强行拉取防盗链图片并回传
 * 访问格式: https://你的域名.workers.dev/?url=真实图片地址
 * ============================================================
 */

export default {
  async fetch(request, env, ctx) {
    // 1. 解析请求，获取 url 参数
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get("url");

    // 如果没有传入 url，直接返回提示
    if (!targetUrl) {
      return new Response("Missing 'url' query parameter.", { status: 400 });
    }

    try {
      // 2. 伪造完美合规的请求头，突破防盗链
      const fetchHeaders = new Headers();
      fetchHeaders.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36");
      // 核心生命线：告诉图床我是从主站来的
      fetchHeaders.set("Referer", "https://hqporner.com/");
      fetchHeaders.set("Accept", "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8");

      // 3. 由 CF 节点代为向真实图床发起请求
      const response = await fetch(targetUrl, {
        method: "GET",
        headers: fetchHeaders
      });

      // 4. 重构响应头，允许 FW App 无限制跨域加载
      const modifiedResponse = new Response(response.body, response);
      modifiedResponse.headers.set("Access-Control-Allow-Origin", "*");
      modifiedResponse.headers.set("Cache-Control", "public, max-age=86400"); // 缓存 1 天，加速二次加载
      
      // 清理可能导致加载失败的安全策略头
      modifiedResponse.headers.delete("Content-Security-Policy");
      modifiedResponse.headers.delete("X-Frame-Options");
      modifiedResponse.headers.delete("Cross-Origin-Opener-Policy");

      return modifiedResponse;

    } catch (error) {
      return new Response("Proxy Error: " + error.message, { status: 500 });
    }
  },
};