export default {
  async fetch(request, env) {
    // 1. 定义你想要代理的 GitHub 私密文件路径
    const owner = "xiaen-8";
    const repo = "scripts";
    const path = "provider/Forward/ti.fwd"; // 你的文件路径
    const branch = "master";

    // 2. 如果你在 Cloudflare 设置了 GH_TOKEN，这里会自动带上权限去敲 GitHub 的门
    const headers = {
      "User-Agent": "Cloudflare-Pages-Worker"
    };
    
    if (env.GH_TOKEN) {
      headers["Authorization"] = `token ${env.GH_TOKEN}`;
    }

    // 3. 去向 GitHub 的私有 API 请求原始文件内容
    const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    
    try {
      const response = await fetch(githubApiUrl, { headers });
      if (!response.ok) {
        return new Response(`GitHub API 报错: ${response.statusText}`, { status: response.status });
      }
      
      const data = await response.json();
      
      // 4. GitHub API 返回的内容通常是 Base64 编码的，我们需要把它解码成明文代码
      const content = atob(data.content.replace(/\n/g, ''));
      
      // 5. 将原本只能你个人看到的私密代码，安全地吐给新视界 App
      return new Response(content, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Access-Control-Allow-Origin": "*" // 允许 App 跨域读取
        }
      });
    } catch (err) {
      return new Response(`服务器内部错误: ${err.message}`, { status: 500 });
    }
  }
};
