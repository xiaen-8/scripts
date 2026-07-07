export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const owner = "xiaen-8";
    const repo = "scripts";
    const branch = "master";

    // 自动获取请求的文件路径（例如 /provider/Forward1/ti.fwd）
    const path = url.pathname.replace(/^\//, "");
    
    if (!path) {
      return new Response("Private Proxy Hub is running!", { status: 200 });
    }

    const headers = {
      "User-Agent": "Cloudflare-Pages-Worker"
    };
    
    // 带上你的私人令牌去敲私密仓库的大门
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
      
      // 解密私密代码内容并吐给新视界 App
      const content = atob(data.content.replace(/\n/g, ''));
      
      return new Response(content, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (err) {
      return new Response(`错误: ${err.message}`, { status: 500 });
    }
  }
};
