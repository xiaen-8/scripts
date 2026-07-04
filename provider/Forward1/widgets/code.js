export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    // 获取传递过来的加密图片 URL。
    const targetUrl = url.searchParams.get("url");

    if (!targetUrl) {
      return new Response("Missing 'url' parameter", { status: 400 });
    }

    try {
      // 1. 请求原网站的加密文件
      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Referer": new URL(targetUrl).origin // 绕过图片防盗链
        }
      });

      if (!response.ok) throw new Error("无法获取原加密图片");
      
      // 该网站的某些图片下载下来直接就是二进制密文，部分是Base64字符串
      // 这里假设下载下来的是直接需要解密的二进制数据流
      const encryptedBuffer = await response.arrayBuffer();
      const keyStr = "f5d965df75336270";
      const ivStr = "97b60394abc2fbe1";
      const encoder = new TextEncoder();
      const keyBuffer = encoder.encode(keyStr);
      const ivBuffer = encoder.encode(ivStr);
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyBuffer,
        { name: "AES-CBC" },
        false,
        ["decrypt"]
      );

      // 4. 执行云端解密
      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: "AES-CBC",
          iv: ivBuffer,
        },
        cryptoKey,
        encryptedBuffer
      );

      // 5. 返回解密后的正常图片（并设置浏览器缓存，防止重复请求消耗 Worker 额度）
      return new Response(decryptedBuffer, {
        headers: {
          "Content-Type": "image/jpeg", // 可根据实际后缀动态调整为 image/webp 或 image/png
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=86400" 
        }
      });

    } catch (error) {
      return new Response("解密失败: " + error.message, { status: 500 });
    }
  }
};