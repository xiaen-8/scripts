export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const owner = "xiaen-8";
    const repo = "scripts";
    const branch = "master";

    const path = url.pathname.replace(/^\//, "");
    
    if (!path) {
      return new Response("Private Proxy Hub is running!", { status: 200 });
    }

    const headers = {
      "User-Agent": "Cloudflare-Pages-Worker"
    };
    
    if (env.GH_TOKEN) {
      headers["Authorization"] = `token ${env.GH_TOKEN}`;
    }

    const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    
    try {
      const response = await fetch(githubApiUrl, { headers });
      if (!response.ok) {
        return new Response(`GitHub 报错: ${response.status}`, { status: response.status });
      }
      
      const data = await response.json();
      const content = atob(data.content.replace(/\n/g, ''));
      
      // 强化响应头：强制允许跨域，并声明为纯文本，防止 App 容器拦截
      return new Response(content, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
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
