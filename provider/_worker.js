export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const owner = "xiaen-8";
    const repo = "scripts";
    const branch = "master";

    // 1. 获取纯净的文件路径
    let path = url.pathname.replace(/^\//, "");
    
    if (!path) {
      return new Response("Private Proxy Hub is running!", { status: 200 });
    }

    // 2. 修复手机端或 App 传输、重定向导致的各种神奇编码（如空格 %20 变成 %2520 或 %202.js）
    try {
      path = decodeURIComponent(path);
      // 顺便兼容图11/图12中可能存在的异常后缀拼接
      path = path.replace(/%202\.js$/, " 2.js"); 
    } catch(e) {}

    const headers = {
      "User-Agent": "Cloudflare-Pages-Worker"
    };
    
    if (env.GH_TOKEN) {
      headers["Authorization"] = `token ${env.GH_TOKEN}`;
    }

    // 3. 请求 GitHub API 获取文件内容
    const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    
    try {
      const response = await fetch(githubApiUrl, { headers });
      if (!response.ok) {
        return new Response(`GitHub 报错: ${response.status}`, { status: response.status });
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        return new Response(JSON.stringify(data), {
          headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" }
        });
      }

      // 4. 解密 Base64 文本
      let content = atob(data.content.replace(/\n/g, ''));
      
      // 【核心魔法】：如果请求的是配置文件，自动把里面公开的 raw 链接全量替换为当前 Cloudflare 专属代理链接
      if (path.endsWith(".fwd") || path.endsWith(".json")) {
        const currentHost = `https://${url.host}/`;
        // 自动将含有 raw.githubusercontent.com/xiaen-8/scripts/master/ 的地方替换为你的 pages.dev/
        content = content.replace(/https:\/\/raw\.githubusercontent\.com\/xiaen-8\/scripts\/master\//g, currentHost);
      }
      
      // 5. 返回给新视界
      return new Response(content, {
        headers: {
          "Content-Type": path.endsWith(".js") ? "application/javascript; charset=utf-8" : "text/plain; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
          "Access-Control-Allow-Headers": "*",
          "Cache-Control": "no-cache"
        }
      });
    } catch (err) {
      return new Response(`错误: ${err.message}`, { status: 500 });
    }
  }
};
