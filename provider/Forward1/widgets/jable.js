//Original Author:nibiru
WidgetMetadata = {
  id: "jable_int",
  title: "Jable",
  description: "Jable分类浏览.全局搜索.标签.女优.预告.推荐.聚合",
  author: "nibiru｜MakkaPakka｜廿二日",
  site: "https://jable.tv",
  version: "2.5.0",
  requiredVersion: "0.0.2",
  detailCacheDuration: 60,
  modules: [
    // \u641c\u7d22\u6a21\u5757
    {
      id: "search",
      title: "\u641c\u7d22",
      description: "\u641c\u7d22",
      requiresWebView: false,
      functionName: "search",
      cacheDuration: 3600,
      params: [
        {
          name: "keyword",
          title: "\u5173\u952e\u8bcd",
          type: "input",
          description: "\u5173\u952e\u8bcd",
        },
        {
          name: "sort_by",
          title: "\u6392\u5e8f",
          type: "enumeration",
          description: "\u6392\u5e8f",
          enumOptions: [
            { title: "\u6700\u9ad8\u76f8\u5173", value: "" },
            { title: "\u6700\u591a\u89c2\u770b", value: "video_viewed" },
            { title: "\u8fd1\u671f\u6700\u4f73", value: "post_date_and_popularity" },
            { title: "\u6700\u8fd1\u66f4\u65b0", value: "post_date" },
            { title: "\u6700\u591a\u6536\u85cf", value: "most_favourited" },
          ],
        },
        { name: "from", title: "\u9875\u7801", type: "page", description: "\u9875\u7801", value: "1" },
      ],
    },
    // \u70ed\u95e8\u6a21\u5757
    {
      id: "hot",
      title: "\u70ed\u95e8",
      description: "\u70ed\u95e8\u5f71\u7247",
      requiresWebView: false,
      functionName: "loadPage",
      cacheDuration: 3600,
      params: [
        {
          name: "url",
          title: "\u5217\u8868\u5730\u5740",
          type: "constant",
          description: "\u5217\u8868\u5730\u5740",
          value: "https://jable.tv/hot/?mode=async&function=get_block&block_id=list_videos_common_videos_list",
        },
        {
          name: "sort_by",
          title: "\u6392\u5e8f",
          type: "enumeration",
          description: "\u6392\u5e8f",
          enumOptions: [
            { title: "\u4eca\u65e5\u70ed\u95e8", value: "video_viewed_today" },
            { title: "\u672c\u5468\u70ed\u95e8", value: "video_viewed_week" },
            { title: "\u672c\u6708\u70ed\u95e8", value: "video_viewed_month" },
            { title: "\u6240\u6709\u65f6\u95f4", value: "video_viewed" },
          ],
        },
        { name: "from", title: "\u9875\u7801", type: "page", description: "\u9875\u7801", value: "1" },
      ],
    },
    // \u6700\u65b0\u6a21\u5757
    {
      id: "newRelease",
      title: "\u6700\u65b0",
      description: "\u6700\u65b0\u4e0a\u5e02\u5f71\u7247",
      requiresWebView: false,
      functionName: "loadPage",
      cacheDuration: 3600,
      params: [
        {
          name: "url",
          title: "\u5217\u8868\u5730\u5740",
          type: "constant",
          description: "\u5217\u8868\u5730\u5740",
          value: "https://jable.tv/new-release/?mode=async&function=get_block&block_id=list_videos_common_videos_list",
        },
        {
          name: "sort_by",
          title: "\u6392\u5e8f",
          type: "enumeration",
          description: "\u6392\u5e8f",
          enumOptions: [
            { title: "\u6700\u65b0\u53d1\u5e03", value: "latest-updates" },
            { title: "\u6700\u591a\u89c2\u770b", value: "video_viewed" },
            { title: "\u6700\u591a\u6536\u85cf", value: "most_favourited" },
          ],
        },
        { name: "from", title: "\u9875\u7801", type: "page", description: "\u9875\u7801", value: "1" },
      ],
    },

    // \u4e2d\u6587\u6a21\u5757
    {
      id: "chinese",
      title: "\u4e2d\u6587",
      description: "\u4e2d\u6587\u5b57\u5e55\u5f71\u7247",
      requiresWebView: false,
      functionName: "loadPage",
      cacheDuration: 3600,
      params: [
        {
          name: "url",
          title: "\u5217\u8868\u5730\u5740",
          type: "constant",
          description: "\u5217\u8868\u5730\u5740",
          value: "https://jable.tv/categories/chinese-subtitle/?mode=async&function=get_block&block_id=list_videos_common_videos_list",
        },
        {
          name: "sort_by",
          title: "\u6392\u5e8f",
          type: "enumeration",
          description: "\u6392\u5e8f",
          enumOptions: [
            { title: "\u6700\u8fd1\u66f4\u65b0", value: "post_date" },
            { title: "\u6700\u591a\u89c2\u770b", value: "video_viewed" },
            { title: "\u6700\u591a\u6536\u85cf", value: "most_favourited" },
          ],
        },
        { name: "from", title: "\u9875\u7801", type: "page", description: "\u9875\u7801", value: "1" },
      ],
    },
    // \u5973\u4f18\u6a21\u5757
    {
      id: "models",
      title: "\u5973\u4f18",
      description: "\u6309\u5973\u4f18\u5206\u7c7b\u6d4f\u89c8\u5f71\u7247",
      requiresWebView: false,
      functionName: "loadPage",
      cacheDuration: 3600,
      params: [
        {
          name: "url",
          title: "\u9009\u62e9\u5973\u4f18",
          type: "enumeration",
          belongTo: {
            paramName: "sort_by",
            value: ["post_date","video_viewed","most_favourited"],
            },
          enumOptions: [
            { 
              title: "\u4e09\u4e0a\u60a0\u4e9a", 
              value: "https://jable.tv/s1/models/yua-mikami/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u696a\u53ef\u601c", 
              value: "https://jable.tv/models/86b2f23f95cc485af79fe847c5b9de8d/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5c0f\u91ce\u5915\u5b50", 
              value: "https://jable.tv/models/2958338aa4f78c0afb071e2b8a6b5f1b/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5927\u69fb\u54cd", 
              value: "https://jable.tv/models/hibiki-otsuki/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u85e4\u68ee\u91cc\u7a57", 
              value: "https://jable.tv/models/riho-fujimori/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "JULIA", 
              value: "https://jable.tv/models/julia/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u660e\u91cc\u4337", 
              value: "https://jable.tv/models/tsumugi-akari/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u6843\u4e43\u6728\u9999\u5948", 
              value: "https://jable.tv/models/momonogi-kana/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u6c34\u6237\u9999\u5948", 
              value: "https://jable.tv/models/kana-mito/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u7be0\u7530\u3086\u3046", 
              value: "https://jable.tv/s1/models/shinoda-yuu/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u67ab\u53ef\u601c", 
              value: "https://jable.tv/models/kaede-karen/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5409\u6ca2\u660e\u6b69", 
              value: "https://jable.tv/models/akiho-yoshizawa/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u7fbd\u6708\u5e0c", 
              value: "https://jable.tv/models/21e145d3f4d7c8c818fc7eae19342a7a/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u7f8e\u8c37\u6731\u91cc", 
              value: "https://jable.tv/s1/models/mitani-akari/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5c71\u5cb8\u9022\u82b1", 
              value: "https://jable.tv/models/yamagishi-aika/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u4f50\u4f50\u6728\u660e\u5e0c", 
              value: "https://jable.tv/models/sasaki-aki/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u795e\u6728\u9e97", 
              value: "https://jable.tv/models/ef9b1ab9a21b58d6ee4d7d97ab883288/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u4e03\u6cfd\u7f8e\u4e9a", 
              value: "https://jable.tv/models/nanasawa-mia/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u702c\u6238\u74b0\u5948", 
              value: "https://jable.tv/models/1a71be5a068c6f9e00fac285b31019f9/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u7027\u672c\u96eb\u8449", 
              value: "https://jable.tv/models/7ffb432871f53eda0b4d80be34fff86a/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u3055\u304f\u3089\u308f\u304b\u306a", 
              value: "https://jable.tv/models/0b96db26c8b192b0a54e24d878380765/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5f69\u6708\u4e03\u7dd2", 
              value: "https://jable.tv/models/e82b22cd3275fd0e569147d82fa1999d/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u9234\u4e43\u30a6\u30c8", 
              value: "https://jable.tv/models/559904d22cbf03091f790258aa4e9b8c/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u4e09\u7530\u771f\u9234", 
              value: "https://jable.tv/models/7749dd641e0426f55342972d920513a7/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u4e03\u30c4\u68ee\u308a\u308a", 
              value: "https://jable.tv/models/9ed214792a2144520430dd494c93f651/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u4e03\u5d8b\u821e", 
              value: "https://jable.tv/models/6ab2e738a33eafc3db27cab0b83cf5cd/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u516b\u639b\u3046\u307f", 
              value: "https://jable.tv/models/83397477054d35cd07e2c48685335a86/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u516b\u6728\u5948\u3005", 
              value: "https://jable.tv/models/3610067a1d725dab8ee8cd3ffe828850/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5bae\u4e0b\u73b2\u5948", 
              value: "https://jable.tv/models/b435825a4941964079157dd2fc0a8e5a/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5c0f\u6e4a\u3088\u3064\u8449", 
              value: "https://jable.tv/models/ff8ce98f2419126e00a90bc1f3385824/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5c0f\u91ce\u516d\u82b1", 
              value: "https://jable.tv/models/0478c4db9858c4e6c60af7fbf828009a/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5de5\u85e4\u3086\u3089", 
              value: "https://jable.tv/models/e7ba849893aa7ce8afcc3003a4075c20/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u672c\u5e84\u9234", 
              value: "https://jable.tv/models/honjou-suzu/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u685c\u7a7a\u3082\u3082", 
              value: "https://jable.tv/models/sakura-momo/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u6953\u3075\u3046\u3042", 
              value: "https://jable.tv/models/f88e49c4c1adb0fd1bae71ac122d6b82/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u6cb3\u5317\u5f69\u4f3d", 
              value: "https://jable.tv/models/saika-kawakita2/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u77e2\u57dc\u611b\u8309", 
              value: "https://jable.tv/models/0903b1921df6c616c29041be11c3d2e8/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u77f3\u5ddd\u6faa", 
              value: "https://jable.tv/models/a855133fa44ca5e7679cac0a0ab7d1cb/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u7f8e\u30ce\u5d8b\u3081\u3050\u308a", 
              value: "https://jable.tv/models/d1ebb3d61ee367652e6b1f35b469f2b6/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u91ce\u3005\u6d66\u6696", 
              value: "https://jable.tv/models/6b0ce5c4944edce04ab48d4bb608fd4c/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u9752\u7a7a\u3072\u304b\u308a", 
              value: "https://jable.tv/models/4c7a2cfa27b343e3e07659650400f61d/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u9999\u6f84\u308a\u3053", 
              value: "https://jable.tv/models/6c2e861e04b9327701a80ca77a088814/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u65b0\u3042\u308a\u306a", 
              value: "https://jable.tv/models/e763382dc86aa703456d964ca25d0e8b/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u672a\u6b69\u306a\u306a", 
              value: "https://jable.tv/models/c9535c2f157202cd0e934d62ef582e2e/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u51ea\u3072\u304b\u308b", 
              value: "https://jable.tv/models/91fca8d824e07075d09de0282f6e9076/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u4e09\u5bae\u3064\u3070\u304d", 
              value: "https://jable.tv/models/f0e279c00b2a7e1aca2ef4d31d611020/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u85cd\u82bd\u307f\u305a\u304d", 
              value: "https://jable.tv/models/679c69a5488daa35a5544749b75556c6/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u3064\u3070\u3055\u821e", 
              value: "https://jable.tv/models/0d7709a62cc199f923107c120d30893b/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u671d\u65e5\u308a\u304a", 
              value: "https://jable.tv/models/ad0935cfa1449ab126dde2b0c0929ad0/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u65e5\u4e0b\u90e8\u52a0\u5948", 
              value: "https://jable.tv/models/dfea76fd68bc52e0888a78e0fedce073/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5f13\u4e43\u308a\u3080", 
              value: "https://jable.tv/models/06c22ca98d8ec82963046ad17e0fad4a/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u590f\u5e0c\u307e\u308d\u3093", 
              value: "https://jable.tv/models/1c0f1b4475962e88b541f9f0db1584fe/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u6c34\u5ddd\u30b9\u30df\u30ec", 
              value: "https://jable.tv/models/7415fde573b12a4e87e83ef33ea354d5/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5b9f\u6d5c\u307f\u304d", 
              value: "https://jable.tv/models/299c2d256b9c509f80302d261ea0b5a9/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5f25\u751f\u307f\u3065\u304d", 
              value: "https://jable.tv/s1/models/mizuki-yayoi/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5929\u5ddd\u305d\u3089", 
              value: "https://jable.tv/models/3e69d39a117c2d25a407dfd57e204e48/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u65b0\u540d\u3042\u307f\u3093", 
              value: "https://jable.tv/models/0dba31ccef2f1fca3563c56dbcf3fa7d/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5c0f\u6cfd\u83dc\u7a57", 
              value: "https://jable.tv/models/2ec30dc8e35906a29fe5c8f5b97e6c89/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u4e09\u539f\u307b\u306e\u304b", 
              value: "https://jable.tv/models/mihara-honoka/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u6dbc\u68ee\u308c\u3080", 
              value: "https://jable.tv/models/7cadf3e484f607dc7d0f1c0e7a83b007/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u68ee\u65e5\u5411\u5b50", 
              value: "https://jable.tv/models/1a7543f89b125421e489d98de472ebf4/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u91d1\u677e\u5b63\u6b69", 
              value: "https://jable.tv/models/48ace5552227a2a4f867af73efa18f2d/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            }
          ],
          value: "https://jable.tv/s1/models/yua-mikami/?mode=async&function=get_block&block_id=list_videos_common_videos_list",
        },
        {
          name: "sort_by",
          title: "\u6392\u5e8f",
          type: "enumeration",
          description: "\u6392\u5e8f",
          enumOptions: [
            { title: "\u6700\u8fd1\u66f4\u65b0", value: "post_date" },
            { title: "\u6700\u591a\u89c2\u770b", value: "video_viewed" },
            { title: "\u6700\u591a\u6536\u85cf", value: "most_favourited" },
          ],
        },
        { name: "from", title: "\u9875\u7801", type: "page", description: "\u9875\u7801", value: "1" },
      ],
    },

    // \u8863\u7740\u6a21\u5757
    {
      id: "outfit",
      title: "\u8863\u7740",
      description: "\u6309\u8863\u7740\u5206\u7c7b\u6d4f\u89c8\u5f71\u7247",
      requiresWebView: false,
      functionName: "loadPage",
      cacheDuration: 3600,
      params: [
        {
          name: "url",
          title: "\u9009\u62e9\u8863\u7740",
          type: "enumeration",
          belongTo: {
            paramName: "sort_by",
            value: ["post_date","video_viewed","most_favourited"],
            },
          enumOptions: [
            { 
              title: "\u9ed1\u4e1d", 
              value: "https://jable.tv/tags/black-pantyhose/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u8089\u4e1d", 
              value: "https://jable.tv/tags/flesh-toned-pantyhose/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u4e1d\u889c", 
              value: "https://jable.tv/tags/pantyhose/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u517d\u8033", 
              value: "https://jable.tv/tags/kemonomimi/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u6e14\u7f51", 
              value: "https://jable.tv/tags/fishnets/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u6c34\u7740", 
              value: "https://jable.tv/tags/swimsuit/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u6821\u670d", 
              value: "https://jable.tv/tags/school-uniform/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u65d7\u888d", 
              value: "https://jable.tv/tags/cheongsam/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5a5a\u7eb1", 
              value: "https://jable.tv/tags/wedding-dress/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5973\u50d5", 
              value: "https://jable.tv/tags/maid/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u548c\u670d", 
              value: "https://jable.tv/tags/kimono/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u773c\u955c\u5a18", 
              value: "https://jable.tv/tags/glasses/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u8fc7\u819d\u889c", 
              value: "https://jable.tv/tags/knee-socks/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u8fd0\u52a8\u88c5", 
              value: "https://jable.tv/tags/sportswear/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5154\u5973\u90ce", 
              value: "https://jable.tv/tags/bunny-girl/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "Cosplay", 
              value: "https://jable.tv/tags/Cosplay/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            }
          ],
          value: "https://jable.tv/tags/black-pantyhose/?mode=async&function=get_block&block_id=list_videos_common_videos_list",
        },
        {
          name: "sort_by",
          title: "\u6392\u5e8f",
          type: "enumeration",
          description: "\u6392\u5e8f",
          enumOptions: [
            { title: "\u6700\u8fd1\u66f4\u65b0", value: "post_date" },
            { title: "\u6700\u591a\u89c2\u770b", value: "video_viewed" },
            { title: "\u6700\u591a\u6536\u85cf", value: "most_favourited" },
          ],
        },
        { name: "from", title: "\u9875\u7801", type: "page", description: "\u9875\u7801", value: "1" },
      ],
    },
    // \u5267\u60c5\u6a21\u5757
    {
      id: "plot",
      title: "\u5267\u60c5",
      description: "\u6309\u5267\u60c5\u5206\u7c7b\u6d4f\u89c8\u5f71\u7247",
      requiresWebView: false,
      functionName: "loadPage",
      cacheDuration: 3600,
      params: [
        {
          name: "url",
          title: "\u9009\u62e9\u5267\u60c5",
          type: "enumeration",
          belongTo: {
            paramName: "sort_by",
            value: ["post_date","video_viewed","most_favourited"],
            },
          enumOptions: [
            { 
              title: "\u51fa\u8f68", 
              value: "https://jable.tv/tags/affair/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u9189\u7537", 
              value: "https://jable.tv/tags/ugly-man/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u4eb2\u5c5e", 
              value: "https://jable.tv/tags/kinship/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u7ae5\u8d1e", 
              value: "https://jable.tv/tags/virginity/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u590d\u4ec7", 
              value: "https://jable.tv/tags/avenge/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5de8\u6c49", 
              value: "https://jable.tv/tags/giant/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5a9a\u836f", 
              value: "https://jable.tv/tags/love-potion/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u50ac\u7720", 
              value: "https://jable.tv/tags/hypnosis/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5077\u62cd", 
              value: "https://jable.tv/tags/private-cam/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "NTR", 
              value: "https://jable.tv/tags/ntr/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5e74\u9f84\u5dee", 
              value: "https://jable.tv/tags/age-difference/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u4e0b\u96e8\u5929", 
              value: "https://jable.tv/tags/rainy-day/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u65f6\u95f4\u505c\u6b62", 
              value: "https://jable.tv/tags/time-stop/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            }
          ],
          value: "https://jable.tv/tags/affair/?mode=async&function=get_block&block_id=list_videos_common_videos_list",
        },
        {
          name: "sort_by",
          title: "\u6392\u5e8f",
          type: "enumeration",
          description: "\u6392\u5e8f",
          enumOptions: [
            { title: "\u6700\u8fd1\u66f4\u65b0", value: "post_date" },
            { title: "\u6700\u591a\u89c2\u770b", value: "video_viewed" },
            { title: "\u6700\u591a\u6536\u85cf", value: "most_favourited" },
          ],
        },
        { name: "from", title: "\u9875\u7801", type: "page", description: "\u9875\u7801", value: "1" },
      ],
    },
    // \u5730\u70b9\u6a21\u5757
    {
      id: "location",
      title: "\u5730\u70b9",
      description: "\u6309\u5730\u70b9\u5206\u7c7b\u6d4f\u89c8\u5f71\u7247",
      requiresWebView: false,
      functionName: "loadPage",
      cacheDuration: 3600,
      params: [
        {
          name: "url",
          title: "\u9009\u62e9\u5730\u70b9",
          type: "enumeration",
          belongTo: {
            paramName: "sort_by",
            value: ["post_date","video_viewed","most_favourited"],
            },
          enumOptions: [
            { 
              title: "\u7535\u8f66", 
              value: "https://jable.tv/tags/tram/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5904\u5973", 
              value: "https://jable.tv/tags/first-night/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u76d1\u72f1", 
              value: "https://jable.tv/tags/prison/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u6e29\u6cc9", 
              value: "https://jable.tv/tags/hot-spring/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u6cf3\u6c60", 
              value: "https://jable.tv/tags/swimming-pool/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u6c7d\u8f66", 
              value: "https://jable.tv/tags/car/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5395\u6240", 
              value: "https://jable.tv/tags/toilet/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5b66\u6821", 
              value: "https://jable.tv/tags/school/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u9b54\u955c\u53f7", 
              value: "https://jable.tv/tags/magic-mirror/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u6d17\u6d74\u573a", 
              value: "https://jable.tv/tags/bathing-place/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u56fe\u4e66\u9986", 
              value: "https://jable.tv/tags/library/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5065\u8eab\u623f", 
              value: "https://jable.tv/tags/gym-room/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u4fbf\u5229\u5e97", 
              value: "https://jable.tv/tags/store/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            }
          ],
          value: "https://jable.tv/tags/tram/?mode=async&function=get_block&block_id=list_videos_common_videos_list",
        },
        {
          name: "sort_by",
          title: "\u6392\u5e8f",
          type: "enumeration",
          description: "\u6392\u5e8f",
          enumOptions: [
            { title: "\u6700\u8fd1\u66f4\u65b0", value: "post_date" },
            { title: "\u6700\u591a\u89c2\u770b", value: "video_viewed" },
            { title: "\u6700\u591a\u6536\u85cf", value: "most_favourited" },
          ],
        },
        { name: "from", title: "\u9875\u7801", type: "page", description: "\u9875\u7801", value: "1" },
      ],
    },
    // \u8eab\u6750\u6a21\u5757
    {
      id: "body",
      title: "\u8eab\u6750",
      description: "\u6309\u8eab\u6750\u5206\u7c7b\u6d4f\u89c8\u5f71\u7247",
      requiresWebView: false,
      functionName: "loadPage",
      cacheDuration: 3600,
      params: [
        {
          name: "url",
          title: "\u9009\u62e9\u8eab\u6750",
          type: "enumeration",
          belongTo: {
            paramName: "sort_by",
            value: ["post_date","video_viewed","most_favourited"],
            },
          enumOptions: [
            { 
              title: "\u957f\u8eab", 
              value: "https://jable.tv/tags/tall/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u8f6f\u4f53", 
              value: "https://jable.tv/tags/flexible-body/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u8d2b\u4e73", 
              value: "https://jable.tv/tags/small-tits/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u7f8e\u817f", 
              value: "https://jable.tv/tags/beautiful-leg/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u7f8e\u5c3b", 
              value: "https://jable.tv/tags/beautiful-butt/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u7eb9\u8eab", 
              value: "https://jable.tv/tags/tattoo/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u77ed\u53d1", 
              value: "https://jable.tv/tags/short-hair/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u767d\u864e", 
              value: "https://jable.tv/tags/hairless-pussy/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u719f\u5973", 
              value: "https://jable.tv/tags/mature-woman/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5de8\u4e73", 
              value: "https://jable.tv/tags/big-tits/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5c11\u5973", 
              value: "https://jable.tv/tags/girl/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5a07\u5c0f", 
              value: "https://jable.tv/tags/dainty/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            }
          ],
          value: "https://jable.tv/tags/tall/?mode=async&function=get_block&block_id=list_videos_common_videos_list",
        },
        {
          name: "sort_by",
          title: "\u6392\u5e8f",
          type: "enumeration",
          description: "\u6392\u5e8f",
          enumOptions: [
            { title: "\u6700\u8fd1\u66f4\u65b0", value: "post_date" },
            { title: "\u6700\u591a\u89c2\u770b", value: "video_viewed" },
            { title: "\u6700\u591a\u6536\u85cf", value: "most_favourited" },
          ],
        },
        { name: "from", title: "\u9875\u7801", type: "page", description: "\u9875\u7801", value: "1" },
      ],
    },    
    // \u89d2\u8272\u6a21\u5757
    {
      id: "role",
      title: "\u89d2\u8272",
      description: "\u6309\u89d2\u8272\u5206\u7c7b\u6d4f\u89c8\u5f71\u7247",
      requiresWebView: false,
      functionName: "loadPage",
      cacheDuration: 3600,
      params: [
        {
          name: "url",
          title: "\u9009\u62e9\u89d2\u8272",
          type: "enumeration",
          belongTo: {
            paramName: "sort_by",
            value: ["post_date","video_viewed","most_favourited"],
            },
          enumOptions: [
            { 
              title: "\u4eba\u59bb", 
              value: "https://jable.tv/tags/wife/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u533b\u751f", 
              value: "https://jable.tv/tags/doctor/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u62a4\u58eb", 
              value: "https://jable.tv/tags/nurse/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u8001\u5e08", 
              value: "https://jable.tv/tags/teacher/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u7a7a\u59d0", 
              value: "https://jable.tv/tags/flight-attendant/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u9003\u72af", 
              value: "https://jable.tv/tags/fugitive/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u60c5\u4fa3", 
              value: "https://jable.tv/tags/couple/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u4e3b\u64ad", 
              value: "https://jable.tv/tags/female-anchor/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u98ce\u4fd7\u5a18", 
              value: "https://jable.tv/tags/club-hostess-and-sex-worker/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5bb6\u653f\u5987", 
              value: "https://jable.tv/tags/housewife/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u641c\u67e5\u5b98", 
              value: "https://jable.tv/tags/detective/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u672a\u4ea1\u4eba", 
              value: "https://jable.tv/tags/widow/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5bb6\u5ead\u6559\u5e08", 
              value: "https://jable.tv/tags/private-teacher/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u7403\u961f\u7ecf\u7406", 
              value: "https://jable.tv/tags/team-manager/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            }
          ],
          value: "https://jable.tv/tags/wife/?mode=async&function=get_block&block_id=list_videos_common_videos_list",
        },
        {
          name: "sort_by",
          title: "\u6392\u5e8f",
          type: "enumeration",
          description: "\u6392\u5e8f",
          enumOptions: [
            { title: "\u6700\u8fd1\u66f4\u65b0", value: "post_date" },
            { title: "\u6700\u591a\u89c2\u770b", value: "video_viewed" },
            { title: "\u6700\u591a\u6536\u85cf", value: "most_favourited" },
          ],
        },
        { name: "from", title: "\u9875\u7801", type: "page", description: "\u9875\u7801", value: "1" },
      ],
    },
    // \u4ea4\u5408\u6a21\u5757
    {
      id: "acts",
      title: "\u4ea4\u5408",
      description: "\u6309\u4ea4\u5408\u5206\u7c7b\u6d4f\u89c8\u5f71\u7247",
      requiresWebView: false,
      functionName: "loadPage",
      cacheDuration: 3600,
      params: [
        {
          name: "url",
          title: "\u9009\u62e9\u4ea4\u5408",
          type: "enumeration",
          belongTo: {
            paramName: "sort_by",
            value: ["post_date","video_viewed","most_favourited"],
            },
          enumOptions: [
            { 
              title: "\u989c\u5c04", 
              value: "https://jable.tv/tags/facial/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u8db3\u4ea4", 
              value: "https://jable.tv/tags/footjob/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u75c9\u631b", 
              value: "https://jable.tv/tags/spasms/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u6f6e\u5439", 
              value: "https://jable.tv/tags/squirting/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u6df1\u5589", 
              value: "https://jable.tv/tags/deep-throat/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u63a5\u543b", 
              value: "https://jable.tv/tags/kiss/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u53e3\u7206", 
              value: "https://jable.tv/tags/cum-in-mouth/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u53e3\u4ea4", 
              value: "https://jable.tv/tags/blowjob/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u4e73\u4ea4", 
              value: "https://jable.tv/tags/tit-wank/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u4e2d\u51fa", 
              value: "https://jable.tv/tags/creampie/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            }
          ],
          value: "https://jable.tv/tags/facial/?mode=async&function=get_block&block_id=list_videos_common_videos_list",
        },
        {
          name: "sort_by",
          title: "\u6392\u5e8f",
          type: "enumeration",
          description: "\u6392\u5e8f",
          enumOptions: [
            { title: "\u6700\u8fd1\u66f4\u65b0", value: "post_date" },
            { title: "\u6700\u591a\u89c2\u770b", value: "video_viewed" },
            { title: "\u6700\u591a\u6536\u85cf", value: "most_favourited" },
          ],
        },
        { name: "from", title: "\u9875\u7801", type: "page", description: "\u9875\u7801", value: "1" },
      ],
    },
    // \u73a9\u6cd5\u6a21\u5757
    {
      id: "play",
      title: "\u73a9\u6cd5",
      description: "\u6309\u73a9\u6cd5\u5206\u7c7b\u6d4f\u89c8\u5f71\u7247",
      requiresWebView: false,
      functionName: "loadPage",
      cacheDuration: 3600,
      params: [
        {
          name: "url",
          title: "\u9009\u62e9\u73a9\u6cd5",
          type: "enumeration",
          belongTo: {
            paramName: "sort_by",
            value: ["post_date","video_viewed","most_favourited"],
            },
          enumOptions: [
            { 
              title: "\u9732\u51fa", 
              value: "https://jable.tv/tags/outdoor/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u4fb5\u72af", 
              value: "https://jable.tv/tags/intrusion/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u8c03\u6559", 
              value: "https://jable.tv/tags/tune/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u6346\u7ed1", 
              value: "https://jable.tv/tags/bondage/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u75f4\u6c49", 
              value: "https://jable.tv/tags/chikan/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u75f4\u5973", 
              value: "https://jable.tv/tags/chizyo/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u7537M", 
              value: "https://jable.tv/tags/masochism-guy/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u6ce5\u9189", 
              value: "https://jable.tv/tags/crapulence/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u6ce1\u59ec", 
              value: "https://jable.tv/tags/soapland/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u6bcd\u4e73", 
              value: "https://jable.tv/tags/breast-milk/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u653e\u5c3f", 
              value: "https://jable.tv/tags/piss/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u6309\u6469", 
              value: "https://jable.tv/tags/massage/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u591aP", 
              value: "https://jable.tv/tags/groupsex/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u77ac\u95f4\u63d2\u5165", 
              value: "https://jable.tv/tags/quickie/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u96c6\u56e2\u4fb5\u72af", 
              value: "https://jable.tv/tags/gang-intrusion/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            }
          ],
          value: "https://jable.tv/tags/outdoor/?mode=async&function=get_block&block_id=list_videos_common_videos_list",
        },
        {
          name: "sort_by",
          title: "\u6392\u5e8f",
          type: "enumeration",
          description: "\u6392\u5e8f",
          enumOptions: [
            { title: "\u6700\u8fd1\u66f4\u65b0", value: "post_date" },
            { title: "\u6700\u591a\u89c2\u770b", value: "video_viewed" },
            { title: "\u6700\u591a\u6536\u85cf", value: "most_favourited" },
          ],
        },
        { name: "from", title: "\u9875\u7801", type: "page", description: "\u9875\u7801", value: "1" },
      ],
    },    
    // \u4e3b\u9898\u6a21\u5757
    {
      id: "theme",
      title: "\u4e3b\u9898",
      description: "\u6309\u4e3b\u9898\u5206\u7c7b\u6d4f\u89c8\u5f71\u7247",
      requiresWebView: false,
      functionName: "loadPage",
      cacheDuration: 3600,
      params: [
        {
          name: "url",
          title: "\u9009\u62e9\u4e3b\u9898",
          type: "enumeration",
          belongTo: {
            paramName: "sort_by",
            value: ["post_date","video_viewed","most_favourited"],
            },
          enumOptions: [
            { 
              title: "\u89d2\u8272\u5267\u60c5", 
              value: "https://jable.tv/categories/roleplay/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5236\u670d\u8bf1\u60d1", 
              value: "https://jable.tv/categories/uniform/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u76f4\u63a5\u5f00\u556a", 
              value: "https://jable.tv/categories/sex-only/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u4e1d\u889c\u7f8e\u817f", 
              value: "https://jable.tv/categories/pantyhose/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u4e3b\u5974\u8c03\u6559", 
              value: "https://jable.tv/categories/bdsm/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u591aP\u7fa4\u4ea4", 
              value: "https://jable.tv/categories/groupsex/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u7537\u53cb\u89c6\u89d2", 
              value: "https://jable.tv/categories/pov/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u51cc\u8fb1\u5feb\u611f", 
              value: "https://jable.tv/categories/insult/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u76d7\u6444\u5077\u62cd", 
              value: "https://jable.tv/categories/private-cam/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u65e0\u7801\u89e3\u653e", 
              value: "https://jable.tv/categories/uncensored/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5973\u540c\u6b22\u6109", 
              value: "https://jable.tv/categories/lesbian/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            }
          ],
          value: "https://jable.tv/categories/roleplay/?mode=async&function=get_block&block_id=list_videos_common_videos_list",
        },
        {
          name: "sort_by",
          title: "\u6392\u5e8f",
          type: "enumeration",
          description: "\u6392\u5e8f",
          enumOptions: [
            { title: "\u6700\u8fd1\u66f4\u65b0", value: "post_date" },
            { title: "\u6700\u591a\u89c2\u770b", value: "video_viewed" },
            { title: "\u6700\u591a\u6536\u85cf", value: "most_favourited" },
          ],
        },
        { name: "from", title: "\u9875\u7801", type: "page", description: "\u9875\u7801", value: "1" },
      ],
    },
    /* Temporarily disabled
    // \u914d\u6d41\u6a21\u5757
    {
      id: "loadResource",
      title: "Jable \u64ad\u653e\u6e90",
      description: "\u901a\u8fc7\u756a\u53f7\u5339\u914d Jable \u64ad\u653e\u6e90",
      requiresWebView: false,
      functionName: "loadResource",
      type: "stream",
      cacheDuration: 600,
      params: []
    },
    */
    // \u6742\u9879\u6a21\u5757
    {
      id: "misc",
      title: "\u6742\u9879",
      description: "\u6309\u6742\u9879\u5206\u7c7b\u6d4f\u89c8\u5f71\u7247",
      requiresWebView: false,
      functionName: "loadPage",
      cacheDuration: 3600,
      params: [
        {
          name: "url",
          title: "\u9009\u62e9\u6742\u9879",
          type: "enumeration",
          belongTo: {
            paramName: "sort_by",
            value: ["post_date","video_viewed","most_favourited"],
            },
          enumOptions: [
            { 
              title: "\u5f55\u50cf", 
              value: "https://jable.tv/tags/video-recording/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u7efc\u827a", 
              value: "https://jable.tv/tags/variety-show/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u611f\u8c22\u796d", 
              value: "https://jable.tv/tags/thanksgiving/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u8282\u65e5\u4e3b\u9898", 
              value: "https://jable.tv/tags/festival/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u56db\u5c0f\u65f6\u4ee5\u4e0a", 
              value: "https://jable.tv/tags/more-than-4-hours/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            },
            { 
              title: "\u5904\u5973\u4f5c/\u9690\u9000\u4f5c", 
              value: "https://jable.tv/tags/debut-retires/?mode=async&function=get_block&block_id=list_videos_common_videos_list"
            }
          ],
          value: "https://jable.tv/tags/video-recording/?mode=async&function=get_block&block_id=list_videos_common_videos_list",
        },
        {
          name: "sort_by",
          title: "\u6392\u5e8f",
          type: "enumeration",
          description: "\u6392\u5e8f",
          enumOptions: [
            { title: "\u6700\u8fd1\u66f4\u65b0", value: "post_date" },
            { title: "\u6700\u591a\u89c2\u770b", value: "video_viewed" },
            { title: "\u6700\u591a\u6536\u85cf", value: "most_favourited" },
          ],
        },
        { name: "from", title: "\u9875\u7801", type: "page", description: "\u9875\u7801", value: "1" },
      ],
    },

    // \u6700\u8fd1\u66f4\u65b0\u6a21\u5757
    {
      id: "latest",
      title: "\u6700\u8fd1\u66f4\u65b0",
      description: "\u6700\u8fd1\u66f4\u65b0\u5f71\u7247",
      requiresWebView: false,
      functionName: "loadPage",
      cacheDuration: 3600,
      params: [
        {
          name: "url",
          title: "\u5217\u8868\u5730\u5740",
          type: "constant",
          description: "\u5217\u8868\u5730\u5740",
          value: "https://jable.tv/latest-updates/?mode=async&function=get_block&block_id=list_videos_latest_videos_list",
        },
        { name: "from", title: "\u9875\u7801", type: "page", description: "\u9875\u7801", value: "1" },
      ],
    },
  ],
  search: {
    title: "全局搜索",
    functionName: "searchGlobal",
    params: [
      { name: "keyword", title: "关键词", type: "input", description: "关键词", value: "" },
      { name: "from", title: "页码", type: "page", description: "页码", value: "1" },
    ],
  },
};


const BASE_URL = "https://jable.tv";

function normalizeUrl(href) {
  if (!href) return "";
  if (href.startsWith("http")) return href;
  if (href.startsWith("/")) return BASE_URL + href;
  return BASE_URL + "/" + href;
}

function safeText(str) {
  return (str || "").replace(/\s+/g, " ").trim();
}

async function search(params = {}) {
  const keyword = (params.keyword || "").trim();
  if (!keyword) {
    return [{
      id: "tip",
      type: "text",
      title: "请输入关键词开始搜索"
    }];
  }

  return await searchByKeyword(keyword, params);
}

async function searchGlobal(params = {}) {
  const keyword = (params.keyword || "").trim();
  if (!keyword) {
    return [{
      id: "tip",
      type: "text",
      title: "请输入关键词开始全局搜索"
    }];
  }

  return await searchByKeyword(keyword, params);
}

async function searchByKeyword(keyword, params = {}) {
  const encodedKeyword = encodeURIComponent(keyword);
  const url = `https://jable.tv/search/${encodedKeyword}/?mode=async&function=get_block&block_id=list_videos_videos_list_search_result&q=${encodedKeyword}`;

  return await loadPage({ ...params, url });
}

async function loadPage(params = {}) {
  const sections = await loadPageSections(params);
  const items = sections.flatMap((section) => section.childItems);
  return items;
}

async function loadPageSections(params = {}) {
  try {
    const jumpId = params.genreId || params.peopleId;
    let url = jumpId
      ? jumpId + (jumpId.includes("?") ? "" : "?mode=async&function=get_block&block_id=list_videos_common_videos_list")
      : params.url;
    if (!url) {
      throw new Error("\u5730\u5740\u4e0d\u80fd\u4e3a\u7a7a");
    }
    if (params["sort_by"]) {
      url += `&sort_by=${params.sort_by}`;
    }
    if (params["from"]) {
      url += `&from=${params.from}`;
    }
    const response = await Widget.http.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
    });

    if (!response || !response.data || typeof response.data !== "string") {
      throw new Error("\u65e0\u6cd5\u83b7\u53d6\u6709\u6548\u7684HTML\u5185\u5bb9");
    }

    const htmlContent = response.data;

    return parseHtml(htmlContent, params);
  } catch (error) {
    throw error;
  }
}

async function parseHtml(htmlContent, options = {}) {
  const $ = Widget.html.load(htmlContent);
  const sectionSelector = ".site-content .py-3,.pb-e-lg-40";
  const itemSelector = ".video-img-box";
  const coverSelector = "img";
  const durationSelector = ".absolute-bottom-right .label";
  const titleSelector = ".title a";

  let sections = [];
  const sectionElements = $(sectionSelector).toArray();

  for (const sectionElement of sectionElements) {
    const $sectionElement = $(sectionElement);
    const items = [];
    const sectionTitle = $sectionElement.find(".title-box .h3-md").first();
    const sectionTitleText = sectionTitle.text();
    const itemElements = $sectionElement.find(itemSelector).toArray();

    if (itemElements && itemElements.length > 0) {
      for (const itemElement of itemElements) {
        const $itemElement = $(itemElement);
        const titleId = $itemElement.find(titleSelector).first();
        const url = titleId.attr("href") || "";

        if (url && url.includes("jable.tv")) {
          const durationId = $itemElement.find(durationSelector).first();
          const coverId = $itemElement.find(coverSelector).first();
          const cover = coverId.attr("data-src") || coverId.attr("src") || "";
          const video = coverId.attr("data-preview");
          const title = titleId.text();
          const duration = durationId.text().trim();
          const dvdId = extractDvdId(url);
          const hdCovers = buildCoverUrlsFromVideoId(dvdId);
          let hdPoster = hdCovers.posterUrl || cover;
          let hdBackdrop = hdCovers.backdropUrl || cover;

          if (dvdId && /^(DLDSS|SDNT|SABA|DTT|VDD|NMSL|CLOT|FIT|RCTD)/i.test(dvdId) && (hdCovers.posterUrl || hdCovers.backdropUrl)) {
            const verified = await verifyCoverUrl(hdCovers.posterUrl || hdCovers.backdropUrl);
            if (!verified) {
              hdPoster = cover;
              hdBackdrop = cover;
            }
          }

          const item = {
            id: url,
            type: "url",
            title: title,
            backdropPath: hdBackdrop,
            posterPath: hdPoster,
            previewUrl: video,
            link: url,
            mediaType: "movie",
            description: dvdId ? `番号: ${dvdId}` : "",
            releaseDate: duration,
            coverUrl: hdBackdrop,
            image: hdBackdrop,
            detailPoster: hdPoster,
            playerType: "system"
          };
          items.push(item);
        }
      }
    }

    if (items.length > 0) {
      sections.push({
        title: sectionTitleText,
        childItems: items
      });
    }
  }

  return sections;
}

async function loadDetail(link) {
  const response = await Widget.http.get(link, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "Referer": "https://jable.tv/"
    },
  });

  const htmlContent = response.data || "";
  const $ = Widget.html.load(htmlContent);

  const match = htmlContent.match(/var\s+hlsUrl\s*=\s*['"](.*?)['"]/i);
  const playbackUrl = match && match[1] ? (match[1].startsWith("//") ? `https:${match[1]}` : match[1]) : "";

  if (!playbackUrl) {
    throw new Error("无法获取有效的播放地址，可能需要代理验证");
  }

  const dvdId = extractDvdId(link);
  const hdCovers = buildCoverUrlsFromVideoId(dvdId);
  const jableCover = $('meta[property="og:image"]').attr("content") || $('meta[name="twitter:image"]').attr("content") || "";

  let detailPosterCover = hdCovers.posterUrl || jableCover;
  let detailBackdropCover = hdCovers.backdropUrl || jableCover || detailPosterCover;

  const [jtMeta, trailerUrl] = await Promise.all([
    (dvdId ? fetchJavTrailersMeta(dvdId).catch(() => ({ backdropPath: "", backdropPaths: [] })) : Promise.resolve({ backdropPath: "", backdropPaths: [] }))
      .then(meta => {
        if (dvdId && /^(ABF|ABP|ABW)/i.test(dvdId) && meta.backdropPaths?.length) {
          return Promise.all(meta.backdropPaths.map(url => verifyCoverUrl(url))).then(results => {
            meta.backdropPaths = meta.backdropPaths.filter((_, i) => results[i]);
            return meta;
          });
        }
        return meta;
      }),
    dvdId ? buildJavTrailersUrl(dvdId).catch(() => "") : Promise.resolve(""),
    (dvdId && /^(DLDSS|SDNT|SABA|DTT|VDD|NMSL|CLOT|FIT|RCTD)/i.test(dvdId) && (hdCovers.posterUrl || hdCovers.backdropUrl))
      ? verifyCoverUrl(hdCovers.posterUrl || hdCovers.backdropUrl).then(verified => {
          if (!verified) { detailPosterCover = jableCover; detailBackdropCover = jableCover; }
        })
      : Promise.resolve(),
  ]);

  const trailers = [];
  if (trailerUrl) {
    const tc = buildTrailerCoverUrl(dvdId) || detailBackdropCover;
    trailers.push({ coverUrl: tc, posterPath: tc, backdropPath: tc, image: tc, url: trailerUrl });
  }

  const title = safeText($("section.video-info h4").first().text())
    || safeText($('meta[property="og:title"]').attr("content"))
    || "未知标题";

  const description = safeText($("h5.desc").first().text()) || undefined;

  const genreItems = [];
  $("h5.tags a.cat").each((_, el) => {
    const $a = $(el);
    const href = normalizeUrl($a.attr("href") || "");
    const text = safeText($a.text());
    if (!text || !href) return;
    genreItems.push({ id: href, title: text });
  });

  const tagItems = [];
  $("h5.tags a:not(.cat)").each((_, el) => {
    const $a = $(el);
    const href = normalizeUrl($a.attr("href") || "");
    if (!href.includes("jable.tv")) return;
    const text = safeText($a.text());
    if (!text || text === "•") return;
    tagItems.push({ id: href, title: text });
  });

  const allGenres = [...genreItems, ...tagItems];

  const peoples = [];
  const seenPeoples = new Set();
  $("div.models a.model").each((_, el) => {
    const $a = $(el);
    const modelHref = normalizeUrl($a.attr("href") || "");
    const $span = $a.find("span").first();
    const name = safeText(
      $span.attr("data-original-title")
      || $span.attr("data-originaltitle")
      || $span.attr("title")
      || $a.attr("data-original-title")
      || $a.find("span[data-original-title]").attr("data-original-title")
    );
    if (!name || seenPeoples.has(name)) return;
    seenPeoples.add(name);
    peoples.push({
      id: modelHref || name,
      title: name,
      avatar: "https://iili.io/KtHNnQS.png",
    });
  });

  const relatedItems = [];
  const seenRelated = new Set([link]);
  $("div.video-img-box").each((_, el) => {
    if (relatedItems.length >= 12) return false;
    const $item = $(el);
    const $a = $item.find("div.img-box a").first();
    const recHref = $a.attr("href") || "";
    const recLink = normalizeUrl(recHref);
    if (!recLink || seenRelated.has(recLink) || !recLink.includes("jable.tv/videos/")) return;
    seenRelated.add(recLink);

    const $img = $item.find("img").first();
    const recCover = $img.attr("data-src") || "";
    const recTitle = safeText($item.find("h6.title a").first().text()) || safeText($img.attr("alt")) || "相关视频";
    const recDuration = safeText($item.find(".absolute-bottom-right .label").first().text()) || undefined;

    const $subTitle = $item.find("p.sub-title");
    const subNodes = [];
    $subTitle.contents().each((_, node) => {
      if (node.type === "text") {
        const t = node.data.replace(/\s+/g, "");
        if (t) subNodes.push(t);
      }
    });
    const recViews = subNodes[0] || undefined;

    const descParts = [];
    if (recDuration) descParts.push(`时长: ${recDuration}`);
    if (recViews)    descParts.push(`观看: ${recViews}`);

    const itemCover = recCover || detailPosterCover || jableCover;
    relatedItems.push({
      id: recLink,
      type: "url",
      title: recTitle,
      backdropPath: itemCover || undefined,
      posterPath: itemCover || undefined,
      durationText: recDuration,
      description: descParts.length ? descParts.join(" | ") : undefined,
      mediaType: "movie",
      link: recLink,
    });
  });

  const item = {
    id: link,
    type: "detail",
    title,
    description,
    videoUrl: playbackUrl,
    playerType: "ijk",
    customHeaders: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      "Referer": link,
      "Origin": "https://jable.tv"
    },
    coverUrl: detailPosterCover,
    posterPath: detailPosterCover,
    detailPoster: detailBackdropCover,
    backdropPath: detailBackdropCover,
    image: detailBackdropCover,
    backdropPaths: [jtMeta.backdropPath, ...(jtMeta.backdropPaths || [])].filter(Boolean),
    genreItems: allGenres.length > 0 ? allGenres : undefined,
    peoples: peoples.length > 0 ? peoples : undefined,
    relatedItems,
    trailers: trailers,
    previewUrl: trailerUrl || ""
  };

  return item;
}

// ==================== HD Cover Generation, JavTrailers Gallery, and Trailer (adapted from MissAV 3.0) ====================

const JAVTRAILERS_URL_CACHE = {};
const JAVTRAILERS_URL_PROMISE_CACHE = {};
const JAVTRAILERS_FETCH_TIMEOUT_MS = 1200;
const JAVTRAILERS_MGSTAGE_PREFIXES = new Set(["ABF", "ABW", "JUFE", "MAAN", "PPT", "SIRO", "LUXU", "GANA", "ABP", "CHN"]);
const JAVTRAILERS_GALLERY_BASE_URL = "https://javtrailers.com";
const JAVTRAILERS_GALLERY_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
  "Referer": "https://javtrailers.com/",
  "Connection": "keep-alive"
};

async function verifyCoverUrl(url) {
  if (!url) return "";
  try {
    const resp = await Widget.http.get(url, { timeout: 3000 });
    const data = resp?.data;
    if (!data) return "";
    if (typeof data === "string" && data.length < 15360) return "";
    return url;
  } catch (e) {
    return "";
  }
}

function buildCoverUrlsFromVideoId(videoIdOrTitle) {
  const candidates = buildCoverCandidatesFromVideoId(videoIdOrTitle);
  return {
    posterUrl: candidates.posterCandidates[0] || "",
    backdropUrl: candidates.backdropCandidates[0] || "",
    posterCandidates: candidates.posterCandidates,
    backdropCandidates: candidates.backdropCandidates,
  };
}

const MGSTAGE_COVER_RULES = {
  ABF: { maker: "prestige" }, ABW: { maker: "prestige" }, ABP: { maker: "prestige" },
  CHN: { maker: "prestige" }, JUFE: { maker: "prestige" }, MAAN: { maker: "prestige" },
  PPT: { maker: "prestige" }, "390JAC": { maker: "jackson" }
};

function parseJavCodeParts(title) {
  const raw = String(title || "").toUpperCase();
  const match = raw.match(/\b([A-Z0-9]+)-?(\d{2,5})\b/);
  if (!match) return null;
  const prefix = match[1];
  const prefixLower = prefix.toLowerCase();
  const number5 = match[2].padStart(5, "0");
  const numMap = {
    WSA: "2",
    FSDSS: "1", FCDSS: "1", FNS: "1", FTHTD: "1",
    FALENO: "1", FGAN: "1", FSNF: "1", FLAV: "1",
    ABP: "118", CHN: "118",
    STARS: "1", STAR: "1", START: "1",
    SODS: "1",
    REBD: "h_346", REBDB: "h_346", GSHRB: "h_346"
  };
  return {
    prefix, prefixLower,
    number: match[2],
    number3: match[2].padStart(3, "0"),
    number5,
    code: `${numMap[prefix] || ""}${prefixLower}${number5}`,
    plainCode: `${prefixLower}${number5}`
  };
}

function buildMgstageCoverCandidatesFromParts(parts, rule) {
  if (!parts || !rule || !rule.maker) return { posterCandidates: [], backdropCandidates: [] };
  const prefixLower = parts.prefixLower;
  const number = String(parseInt(parts.number, 10));
  if (!prefixLower || !number || number === "NaN") return { posterCandidates: [], backdropCandidates: [] };
  const dvdDash = `${prefixLower}-${number}`;
  const base = `https://image.mgstage.com/images/${rule.maker}/${prefixLower}/${number}`;
  return {
    posterCandidates: compactUniqueUrls([`${base}/pf_e_${dvdDash}.jpg`, `${base}/pf_o1_${dvdDash}.jpg`]),
    backdropCandidates: compactUniqueUrls([`${base}/pb_e_${dvdDash}.jpg`])
  };
}

function buildDmmCoverCandidatesFromParts(parts) {
  if (!parts) return { posterCandidates: [], backdropCandidates: [] };
  const contentId = String(parts.code || "").toLowerCase().trim();
  if (!contentId) return { posterCandidates: [], backdropCandidates: [] };
  const awsBase = `https://awsimgsrc.dmm.co.jp/pics_dig/digital/video/${contentId}`;
  const picsBase = `https://pics.dmm.co.jp/digital/video/${contentId}`;
  return {
    posterCandidates: compactUniqueUrls([`${awsBase}/${contentId}ps.jpg`, `${picsBase}/${contentId}ps.jpg`]),
    backdropCandidates: compactUniqueUrls([`${awsBase}/${contentId}pl.jpg`, `${picsBase}/${contentId}pl.jpg`])
  };
}

function buildCoverCandidatesFromVideoId(videoIdOrTitle) {
  const parts = parseJavCodeParts(videoIdOrTitle);
  if (!parts) return { posterCandidates: [], backdropCandidates: [] };
  const rule = MGSTAGE_COVER_RULES[parts.prefix];
  if (rule) return buildMgstageCoverCandidatesFromParts(parts, rule);
  return buildDmmCoverCandidatesFromParts(parts);
}

function compactUniqueUrls(urls) {
  const seen = new Set();
  return (urls || []).filter(u => { const c = String(u || "").trim(); if (!c || seen.has(c)) return false; seen.add(c); return true; });
}

// ---- Trailer URL functions ----

function buildJavTrailersFallbackUrl(title) {
  const parts = parseJavCodeParts(title);
  if (!parts) return "";
  const first = parts.code[0];
  const folder = parts.code.slice(0, 3);
  return `https://media.javtrailers.com/hlsvideo/freepv/${first}/${folder}/${parts.code}/playlist.m3u8`;
}

function isJavTrailersMgstageTitle(title) {
  const parts = parseJavCodeParts(title);
  return !!parts && JAVTRAILERS_MGSTAGE_PREFIXES.has(parts.prefix);
}

function shouldFetchJavTrailersPage(title) {
  const parts = parseJavCodeParts(title);
  if (!parts) return false;
  return isJavTrailersMgstageTitle(title) || parts.prefix.includes("VR");
}

function buildJavTrailersPageIds(title) {
  const parts = parseJavCodeParts(title);
  if (!parts) return [];
  const ids = [];
  if (JAVTRAILERS_MGSTAGE_PREFIXES.has(parts.prefix)) ids.push(`118${parts.prefixLower}${parts.number5}`);
  ids.push(parts.code);
  return ids.filter((id, i, a) => id && a.indexOf(id) === i);
}

function extractJavTrailersMediaUrl(html) {
  if (!html || html.includes("Just a moment")) return "";
  const source = String(html);
  const m = source.match(/https:\/\/media\.javtrailers\.com\/[^"'\\\s<]+?(?:\.m3u8|\.mp4)/g);
  if (m && m.length > 0) return m[0];
  const ms = source.match(/https:\/\/sample\.mgstage\.com\/[^"'\\\s<]+?\.mp4/g);
  if (ms && ms.length > 0) return ms[0];
  const d = source.match(/https:\/\/cc3001\.dmm\.co\.jp\/[^"'\\\s<]+?(?:\.m3u8|\.mp4)/g);
  return d && d.length > 0 ? d[0] : "";
}

function fetchJavTrailersPageUrl(pageId) {
  return Widget.http.get(`https://javtrailers.com/video/${pageId}`, { headers: JAVTRAILERS_GALLERY_HEADERS })
    .then(res => extractJavTrailersMediaUrl(res.data))
    .catch(() => "");
}

async function buildJavTrailersUrl(title) {
  const parts = parseJavCodeParts(title);
  if (!parts) return "";
  if (JAVTRAILERS_URL_CACHE[parts.code] !== undefined) return JAVTRAILERS_URL_CACHE[parts.code];
  const fallbackUrl = buildJavTrailersFallbackUrl(title);
  const isMgstage = isJavTrailersMgstageTitle(title);
  if (!shouldFetchJavTrailersPage(title)) { JAVTRAILERS_URL_CACHE[parts.code] = fallbackUrl; return fallbackUrl; }
  if (!JAVTRAILERS_URL_PROMISE_CACHE[parts.code]) {
    const pageIds = buildJavTrailersPageIds(title);
    JAVTRAILERS_URL_PROMISE_CACHE[parts.code] = Promise.all(pageIds.map(id => fetchJavTrailersPageUrl(id)))
      .then(urls => urls.find(Boolean) || (isMgstage ? "" : fallbackUrl))
      .then(url => { if (url || !isMgstage) JAVTRAILERS_URL_CACHE[parts.code] = url; return url; });
  }
  try {
    if (isMgstage) return await JAVTRAILERS_URL_PROMISE_CACHE[parts.code];
    return await Promise.race([JAVTRAILERS_URL_PROMISE_CACHE[parts.code], new Promise(r => setTimeout(() => r(fallbackUrl), JAVTRAILERS_FETCH_TIMEOUT_MS))]);
  } catch (e) { return isMgstage ? "" : fallbackUrl; }
}

function buildTrailerCoverUrl(title) {
  const parts = parseJavCodeParts(title);
  if (!parts) return "";
  const mgPrefixes = new Set(["ABF", "ABW", "JUFE", "SQTE"]);
  if (mgPrefixes.has(parts.prefix)) {
    return `https://image.mgstage.com/images/prestige/${parts.prefixLower}/${parts.number3}/pb_e_${parts.prefixLower}-${parts.number3}.jpg`;
  }
  return `https://pics.dmm.co.jp/digital/video/${parts.code}/${parts.code}pl.jpg`;
}

// ---- JavTrailers Gallery functions ----

function resolveJavTrailersUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${JAVTRAILERS_GALLERY_BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
}

function normalizeText(text) { return (text || "").replace(/\s+/g, " ").trim(); }

function cleanDvdId(raw) {
  return normalizeText(raw)
    .replace(/-UNCENSORED-LEAK$/i, "").replace(/-CHINESE-SUBTITLE$/i, "")
    .replace(/_UNCENSORED_LEAK$/i, "").replace(/_CHINESE_SUBTITLE$/i, "")
    .replace(/\s+/g, "").trim();
}

function normalizeDvdIdForSearch(dvdId) {
  const clean = cleanDvdId(dvdId).toUpperCase();
  const m = clean.match(/^([A-Z]+)[-_ ]*0*(\d+)$/);
  if (m) return `${m[1].toLowerCase()}-${parseInt(m[2], 10)}`;
  return clean.replace(/_/g, "-").replace(/\s+/g, "-").toLowerCase();
}

function normalizeDvdIdForCompare(dvdId) {
  const clean = cleanDvdId(dvdId).toUpperCase();
  const m = clean.match(/([A-Z]+)[-_ ]*0*(\d+)/);
  if (m) return `${m[1]}${parseInt(m[2], 10)}`;
  return clean.replace(/[^A-Z0-9]/g, "");
}

function buildDmmContentIdFromDvdId(dvdId) {
  const clean = cleanDvdId(dvdId).toLowerCase();
  const m = clean.match(/^([a-z]+)[-_ ]*0*(\d+)$/i);
  if (!m) return clean.replace(/[^a-z0-9]/gi, "");
  return `${m[1].toLowerCase()}${String(parseInt(m[2], 10)).padStart(5, "0")}`;
}

function buildDmmGallery(contentId, count) {
  count = count || 10;
  const id = String(contentId || "").toLowerCase().trim();
  if (!id) return [];
  return Array.from({ length: count }, (_, i) => `https://pics.dmm.co.jp/digital/video/${id}/${id}jp-${i + 1}.jpg`);
}

function buildMgstageGalleryFromDvdId(dvdId, count) {
  count = count || 10;
  const clean = cleanDvdId(dvdId).toLowerCase();
  const m = clean.match(/^([a-z]+)[-_ ]*0*(\d+)$/i);
  if (!m) return [];
  const prefix = m[1].toLowerCase();
  const number = String(parseInt(m[2], 10));
  const dvdDash = `${prefix}-${number}`;
  return Array.from({ length: count }, (_, i) => `https://image.mgstage.com/images/prestige/${prefix}/${number}/cap_e_${i + 1}_${dvdDash}.jpg`);
}

function buildMgstageGalleryFromHtmlOrDvdId(html, dvdId, count) {
  count = count || 10;
  const raw = String(html || "").replace(/\\\//g, "/").replace(/&amp;/g, "&").replace(/\\u002F/g, "/");
  const seen = new Set();
  const urls = [];
  const pushUrl = url => { const c = normalizeImageUrl(url); if (c && !seen.has(c)) { seen.add(c); urls.push(c); } };
  const cm = raw.match(/https?:\/\/image\.mgstage\.com\/images\/([^"'\s<>]+?)\/([a-z]+)\/(\d+)\/pf_o\d+_([a-z]+-\d+)\.(?:jpg|jpeg|webp|png)/i);
  if (cm) {
    for (let i = 1; i <= count; i++) pushUrl(`https://image.mgstage.com/images/${cm[1]}/${cm[2].toLowerCase()}/${cm[3]}/cap_e_${i}_${cm[4].toLowerCase()}.jpg`);
    return urls;
  }
  return buildMgstageGalleryFromDvdId(dvdId, count);
}

function extractCompareIdsFromText(text) {
  const raw = String(text || "");
  const ids = [], seen = new Set();
  const patterns = [
    { re: /([a-z]{2,12})[-_\s\/]*0*(\d{2,6})/gi, prefixIdx: 1, numIdx: 2 },
    { re: /(\d+)([a-z]{2,12})0*(\d{2,6})/gi, prefixIdx: 2, numIdx: 3 },
  ];
  for (const { re, prefixIdx, numIdx } of patterns) {
    let m; while ((m = re.exec(raw)) !== null) {
      const prefix = m[prefixIdx] || "", num = m[numIdx] || "";
      if (!prefix || !num) continue;
      const id = `${prefix.toUpperCase()}${parseInt(num, 10)}`;
      if (!seen.has(id)) { seen.add(id); ids.push(id); }
    }
  }
  return ids;
}

function imageUrlMatchesDvd(url, dvdId, contentId) {
  const target = normalizeDvdIdForCompare(dvdId);
  const cc = normalizeDvdIdForCompare(contentId);
  const candidates = extractCompareIdsFromText(url);
  if (!target && !cc) return true;
  return candidates.some(c => c === target || c === cc || target.includes(c) || c.includes(target) || cc.includes(c) || c.includes(cc));
}

function normalizeImageUrl(url) {
  if (!url) return "";
  let clean = String(url).replace(/\\\//g, "/").replace(/&amp;/g, "&").trim();
  if (!clean || clean.startsWith("data:")) return "";
  if (clean.startsWith("//")) clean = "https:" + clean;
  return resolveJavTrailersUrl(clean);
}

function sortGalleryUrls(urls) {
  return (urls || []).sort((a, b) => {
    const i = u => { const p = [/jp-(\d+)\./i, /cap_e_(\d+)_/i, /cap_e_(\d+)\./i, /cap_(\d+)_/i, /-(\d+)\.(?:jpg|jpeg|webp|png)/i]; for (const r of p) { const m = u.match(r); if (m) return parseInt(m[1], 10); } return 9999; };
    return i(a) - i(b);
  });
}

function extractGalleryImagesFromSwiper($, dvdId, contentId) {
  const urls = [], seen = new Set();
  const pushUrl = url => { const c = normalizeImageUrl(url); if (c && !seen.has(c) && imageUrlMatchesDvd(c, dvdId, contentId)) { seen.add(c); urls.push(c); } };
  $(".swiper-wrapper .swiper-slide.image-container img, .swiper-wrapper .swiper-slide img").each((_, el) => {
    const $img = $(el);
    pushUrl($img.attr("src") || ""); pushUrl($img.attr("data-src") || ""); pushUrl($img.attr("data-original") || ""); pushUrl($img.attr("data-lazy") || "");
  });
  return sortGalleryUrls(urls);
}

function extractGalleryImagesFromRawHtml(html, dvdId, contentId) {
  const raw = String(html || "").replace(/\\\//g, "/").replace(/&amp;/g, "&").replace(/\\u002F/g, "/");
  const urls = [], seen = new Set();
  const pushUrl = url => { const c = normalizeImageUrl(url); if (c && !seen.has(c) && imageUrlMatchesDvd(c, dvdId, contentId)) { seen.add(c); urls.push(c); } };
  [/https?:\/\/pics\.dmm\.co\.jp\/digital\/video\/[^"'\s<>]+?\/[^"'\s<>]+?jp-\d+\.(?:jpg|jpeg|webp|png)/gi,
   /https?:\/\/image\.mgstage\.com\/images\/[^"'\s<>]+?\/cap_e_\d+_[^"'\s<>]+?\.(?:jpg|jpeg|webp|png)/gi,
   /https?:\/\/image\.mgstage\.com\/images\/[^"'\s<>]+?\/pf_o\d+_[^"'\s<>]+?\.(?:jpg|jpeg|webp|png)/gi,
   /src=["']([^"']*cap_e_\d+_[^"']+\.(?:jpg|jpeg|webp|png))["']/gi,
   /src=["']([^"']*pf_o\d+_[^"']+\.(?:jpg|jpeg|webp|png))["']/gi,
   /src=["']([^"']*jp-\d+\.(?:jpg|jpeg|webp|png))["']/gi].forEach(pat => { let m; while ((m = pat.exec(raw)) !== null) pushUrl(m[1] || m[0]); });
  return sortGalleryUrls(urls);
}

function isMgstageCoverOnlyImage(url) { return /image\.mgstage\.com\/images\/.+?\/pf_o\d+_/i.test(String(url || "")); }

function isLikelyDmmContentId(contentId) { return /^(?:\d+)?[a-z]+0\d{4,5}$/i.test(String(contentId || "").toLowerCase().trim()); }

function isDmmSourceHtml(html) { const r = String(html || "").toLowerCase(); return r.includes("pics.dmm.co.jp") || r.includes("al.fanza.co.jp") || r.includes("fanza"); }

function isMgstageSourceHtml(html) { const r = String(html || "").toLowerCase(); return r.includes("image.mgstage.com") || r.includes("mgstage.nihonjav.com") || r.includes("mgstage"); }

function extractDmmGalleryFromHtml(html, contentId, dvdId) {
  const $ = Widget.html.load(html);
  const swiper = extractGalleryImagesFromSwiper($, dvdId, contentId);
  if (swiper.length) return swiper;
  const raw = extractGalleryImagesFromRawHtml(html, dvdId, contentId);
  const isMg = isMgstageSourceHtml(html);
  const hasReal = raw.some(u => !isMgstageCoverOnlyImage(u) && (/cap_e_\d+_/i.test(u) || /jp-\d+\./i.test(u)));
  if (raw.length && (!isMg || hasReal)) return raw;
  const finalId = String(contentId || "").toLowerCase().trim();
  if (isDmmSourceHtml(html) && isLikelyDmmContentId(finalId)) return buildDmmGallery(finalId, 10);
  if (isMg) return buildMgstageGalleryFromHtmlOrDvdId(html, dvdId, 10);
  return [];
}

function buildDmmBackdropFromContentId(contentId) {
  const id = String(contentId || "").toLowerCase().trim();
  return id ? `https://pics.dmm.co.jp/digital/video/${id}/${id}pl.jpg` : "";
}

function buildMgstageBackdropFromDvdId(dvdId, maker) {
  maker = maker || "prestige";
  const clean = cleanDvdId(dvdId).toLowerCase();
  const m = clean.match(/^([a-z]+)[-_ ]*0*(\d+)$/i);
  if (!m) return "";
  return `https://image.mgstage.com/images/${maker}/${m[1].toLowerCase()}/${String(parseInt(m[2], 10))}/pb_e_${m[1].toLowerCase()}-${String(parseInt(m[2], 10))}.jpg`;
}

function extractJavTrailersBackdropPath($, html, contentId, dvdId) {
  const raw = String(html || "").replace(/\\\//g, "/").replace(/&amp;/g, "&");
  const mg = raw.match(/https?:\/\/image\.mgstage\.com\/images\/[^"'\s<>]+?\/pb_e_[^"'\s<>]+?\.(?:jpg|jpeg|webp|png)/i);
  if (mg) return normalizeImageUrl(mg[0]);
  const d = raw.match(/https?:\/\/pics\.dmm\.co\.jp\/digital\/video\/[^"'\s<>]+?\/[^"'\s<>]+?pl\.(?:jpg|jpeg|webp|png)/i);
  if (d) return normalizeImageUrl(d[0]);
  const pf = raw.match(/https?:\/\/image\.mgstage\.com\/images\/([^"'\s<>]+?)\/([a-z]+)\/(\d+)\/pf_o\d+_([a-z]+-\d+)\.(?:jpg|jpeg|webp|png)/i);
  if (pf) return `https://image.mgstage.com/images/${pf[1]}/${pf[2].toLowerCase()}/${pf[3]}/pb_e_${pf[4].toLowerCase()}.jpg`;
  const dvd = cleanDvdId(dvdId).toLowerCase().match(/^([a-z]+)[-_ ]*0*(\d+)$/i);
  if (dvd && dvd[1].toLowerCase() === "abf") { const b = buildMgstageBackdropFromDvdId(dvdId, "prestige"); if (b) return b; }
  const finalId = String(contentId || "").toLowerCase().trim();
  if (isLikelyDmmContentId(finalId)) return buildDmmBackdropFromContentId(finalId);
  return "";
}

function scoreJavTrailersSearchResult($, $a, targetCompareId) {
  const href = resolveJavTrailersUrl($a.attr("href") || "");
  const slug = href.split("/").filter(Boolean).pop() || "";
  const candidates = [normalizeText($a.text()), normalizeText($a.closest("div,li,article,section").text()), slug];
  let bestScore = 0;
  candidates.forEach(c => { const compare = normalizeDvdIdForCompare(c); if (compare === targetCompareId) bestScore = Math.max(bestScore, 100); });
  if (href.includes("/video/")) bestScore += 10;
  if (normalizeDvdIdForCompare(slug) === targetCompareId) bestScore = Math.max(bestScore, 110);
  return { href, slug, contentId: slug.toLowerCase(), score: bestScore };
}

async function findJavTrailersDetailUrl(dvdId) {
  const searchKeyword = normalizeDvdIdForSearch(dvdId), targetCompareId = normalizeDvdIdForCompare(dvdId);
  if (!searchKeyword || !targetCompareId) return "";
  try {
    const res = await Widget.http.get(`${JAVTRAILERS_GALLERY_BASE_URL}/search/${encodeURIComponent(searchKeyword)}`, { headers: JAVTRAILERS_GALLERY_HEADERS, timeout: 2500 });
    const html = res.data || "", $ = Widget.html.load(html);
    const candidates = [];
    $('a[href*="/video/"]').each((_, el) => { const r = scoreJavTrailersSearchResult($, $(el), targetCompareId); if (r.href) candidates.push(r); });
    candidates.sort((a, b) => b.score - a.score);
    if (candidates.length && candidates[0].score >= 60) return candidates[0].href;
    let m; while ((m = /href=["']([^"']*\/video\/([a-z0-9_]+)[^"']*)["']/gi.exec(html)) !== null) { const href = resolveJavTrailersUrl(m[1]), slug = m[2] || ""; if (normalizeDvdIdForCompare(slug) === targetCompareId) return href; }
    return "";
  } catch (e) { return ""; }
}

function extractJavTrailersContentId($, html, detailUrl) {
  const urlMatch = String(detailUrl || "").match(/\/video\/([a-z0-9_]+)/i);
  if (urlMatch) return urlMatch[1].toLowerCase();
  const textMatch = normalizeText($("body").text()).match(/Content\s*ID\s*:?\s*([a-z0-9_]+)/i);
  if (textMatch) return textMatch[1].toLowerCase();
  const imgMatch = String(html || "").match(/pics\.dmm\.co\.jp\/digital\/video\/([a-z0-9_]+)\//i);
  if (imgMatch) return imgMatch[1].toLowerCase();
  return "";
}

async function fetchJavTrailersMeta(dvdId) {
  const empty = { backdropPath: "", backdropPaths: [] };
  if (!dvdId) return empty;
  const buildFallbackBackdrop = (contentId, dvdId) => {
    const md = cleanDvdId(dvdId).toLowerCase().match(/^([a-z]+)[-_ ]*0*(\d+)$/i);
    if (md && md[1].toLowerCase() === "abf") { const b = buildMgstageBackdropFromDvdId(dvdId, "prestige"); if (b) return b; }
    const finalId = String(contentId || "").toLowerCase().trim();
    if (isLikelyDmmContentId(finalId)) return buildDmmBackdropFromContentId(finalId);
    return "";
  };
  try {
    const detailUrl = await findJavTrailersDetailUrl(dvdId);
    if (!detailUrl) {
      const ecid = buildDmmContentIdFromDvdId(dvdId);
      const bp = buildFallbackBackdrop(ecid, dvdId) || buildDmmBackdropFromContentId(ecid);
      const bps = isLikelyDmmContentId(ecid) ? buildDmmGallery(ecid, 10) : [];
      return { backdropPath: bp || "", backdropPaths: bps };
    }
    const res = await Widget.http.get(detailUrl, { headers: { ...JAVTRAILERS_GALLERY_HEADERS, Referer: `${JAVTRAILERS_GALLERY_BASE_URL}/` }, timeout: 2500 });
    const html = res.data || "", $ = Widget.html.load(html);
    const contentId = extractJavTrailersContentId($, html, detailUrl), expectedContentId = buildDmmContentIdFromDvdId(dvdId);
    const strip = s => String(s || "").toLowerCase().replace(/^\d+/, "");
    if (contentId && expectedContentId && strip(contentId) !== strip(expectedContentId)) {
      const isMg = JAVTRAILERS_MGSTAGE_PREFIXES.has((cleanDvdId(dvdId).match(/^([a-z]+)/i) || [])[1] || "".toUpperCase());
      return { backdropPath: isMg ? (buildMgstageBackdropFromDvdId(dvdId, "prestige") || "") : (buildDmmBackdropFromContentId(expectedContentId.toLowerCase()) || ""), backdropPaths: isMg ? buildMgstageGalleryFromDvdId(dvdId, 10) : isLikelyDmmContentId(expectedContentId.toLowerCase()) ? buildDmmGallery(expectedContentId.toLowerCase(), 10) : [] };
    }
    let bp = extractJavTrailersBackdropPath($, html, contentId, dvdId);
    if (!bp) bp = buildFallbackBackdrop(contentId, dvdId);
    const bps = extractDmmGalleryFromHtml(html, contentId, dvdId);
    return { backdropPath: bp || "", backdropPaths: bps };
  } catch (e) { const fb = buildFallbackBackdrop("", dvdId); if (fb) return { backdropPath: fb, backdropPaths: [] }; return empty; }
}

function extractDvdId(link) {
  const slug = String(link || "").split("?")[0].split("/").filter(Boolean).pop() || "";
  return slug.replace(/-(uncensored-leak|chinese-subtitle)$/i, "").toUpperCase();
}

// ==================== Stream Source（番号匹配 Jable 播放源）====================

function normalizeCode(value) {
  return String(value || "").toUpperCase().replace(/[\s_\-]+/g, "");
}

function extractSearchCode(text, options = {}) {
  const allowPureNumeric = options.allowPureNumeric !== false;
  const s = String(text || "").toUpperCase().replace(/\./g, " ").replace(/_/g, "-").replace(/\s+/g, " ").trim();
  if (!s) return "";
  const patterns = [
    /\bFC2(?:[- ]?PPV)?[- ]?\d{5,8}\b/,
    /\bCARIB[- ]?\d{6,8}\b/,
    /\b1PONDO[- ]?\d{6,8}\b/,
    /\bHEYZO[- ]?\d{3,6}\b/,
    /\bT28[- ]?\d{6,8}\b/,
    /\b(?:S2M|MIAA|SSNI|SNIS|IPX|IPZZ|SSIS|JUQ|MIDE|MIDV|STARS|ABW|RKI|DVAJ|WANZ|LULU|DLDSS|VRTM|SDMU|SDDE|MKMP|HMN|MUDR|ADN|CAWD|PPPE|PRED|MGR|SHKD|MXGS|FSDSS|JUL|KTB|MIAB|GVH|MIMK|JUY|JUTA|IDBD|HND|DASD|CLO|BF|HONB|ROE|CEMD|MIUM|NITR|RCTD|RCT|IPVR|MIBD|JUR|JURD|SOE|ORE|PYO|START|NSFS)\s*[-_ ]?\d{2,6}[A-Z]?(?:[-_ ]?[A-Z]{0,4})?\b/,
    /\b[A-Z]{2,10}\s*[-_ ]?\d{2,8}[A-Z]?\b/
  ];
  if (allowPureNumeric) patterns.push(/\b\d{6,8}\b/);
  for (const reg of patterns) {
    const match = s.match(reg);
    if (match && match[0]) return match[0].replace(/\s+/g, "").replace(/_/g, "-").replace(/-+/g, "-").toUpperCase();
  }
  return "";
}

function collectStringValues(value, depth = 0, out = [], visited = new Set()) {
  if (value === null || value === undefined || depth > 5) return out;
  const valueType = typeof value;
  if (valueType === "string" || valueType === "number") {
    const text = String(value).trim();
    if (text) out.push(text);
    return out;
  }
  if (valueType !== "object") return out;
  if (visited.has(value)) return out;
  visited.add(value);
  if (Array.isArray(value)) { for (const item of value) collectStringValues(item, depth + 1, out, visited); return out; }
  for (const key of Object.keys(value)) collectStringValues(value[key], depth + 1, out, visited);
  return out;
}

function extractCodeFromParams(params = {}) {
  const priorityCandidates = [
    params.code, params.videoId, params.number,
    params.fileName, params.filename, params.file_name, params.name, params.path,
    params.filePath, params.file_path, params.mediaPath, params.media_path,
    params.itemPath, params.item_path, params.localPath, params.local_path,
    params.originalFilename, params.originalFileName,
    params.id, params.title, params.seriesName, params.originalTitle, params.originalName,
    params.episodeName, params.description, params.genreTitle, params.overview,
    params.link, params.url, params.videoUrl, params.playUrl, params.streamUrl,
  ];
  if (params.tmdbInfo) {
    priorityCandidates.push(params.tmdbInfo.title, params.tmdbInfo.name, params.tmdbInfo.originalTitle, params.tmdbInfo.originalName, params.tmdbInfo.overview);
  }
  if (params.info) {
    priorityCandidates.push(params.info.title, params.info.name, params.info.originalTitle, params.info.originalName, params.info.overview);
  }
  if (params.mediaSource) {
    priorityCandidates.push(params.mediaSource.name, params.mediaSource.fileName, params.mediaSource.filename, params.mediaSource.path, params.mediaSource.url, params.mediaSource.streamUrl);
  }
  if (Array.isArray(params.mediaSources)) {
    for (const source of params.mediaSources) {
      priorityCandidates.push(source && source.name, source && source.fileName, source && source.filename, source && source.path, source && source.url, source && source.streamUrl);
    }
  }
  for (const value of priorityCandidates) { const code = extractSearchCode(value, { allowPureNumeric: true }); if (code) return code; }
  for (const value of collectStringValues(params)) { const code = extractSearchCode(value, { allowPureNumeric: false }); if (code) return code; }
  return "";
}

function parseJableSearchResults(html, targetCode) {
  if (!html || typeof html !== "string") return [];
  const $ = Widget.html.load(html);
  const results = [];
  const seen = new Set();
  $(".video-img-box").each((i, el) => {
    const $el = $(el);
    const $titleLink = $el.find(".title a").first();
    const href = $titleLink.attr("href") || "";
    const link = String(href).trim();
    if (!link || !link.includes("jable.tv") || seen.has(link)) return;
    const title = $titleLink.text().trim();
    const $img = $el.find("img").first();
    const cover = $img.attr("data-src") || $img.attr("src") || "";
    const match = (link.match(/\/([^/?#]+)(?:\?|#|$)/) || [])[1] || "";
    let decoded;
    try { decoded = decodeURIComponent(match); } catch (e) { decoded = match.replace(/%[0-9A-Fa-f]{2}/g, ""); }
    const code = extractSearchCode(decoded.replace(/-/g, " "), { allowPureNumeric: true }) || extractSearchCode(title, { allowPureNumeric: true });
    if (!code) return;
    seen.add(link);
    results.push({ title, link, code, cover });
  });
  if (results.length === 0) {
    $("a[href]").each((i, el) => {
      const href = $(el).attr("href") || "";
      const link = String(href).trim();
      if (!link || !link.includes("jable.tv") || seen.has(link)) return;
      const match = (link.match(/\/([^/?#]+)(?:\?|#|$)/) || [])[1] || "";
      let decoded2;
      try { decoded2 = decodeURIComponent(match); } catch (e) { decoded2 = match.replace(/%[0-9A-Fa-f]{2}/g, ""); }
      const codeFromLink = extractSearchCode(decoded2.replace(/-/g, " "), { allowPureNumeric: true });
      if (!codeFromLink) return;
      seen.add(link);
      results.push({ title: $(el).text().trim(), link, code: codeFromLink, cover: "" });
    });
  }
  const targetLoose = normalizeCode(targetCode);
  const exact = results.filter(item => normalizeCode(item.code) === targetLoose);
  if (exact.length > 0) return exact;
  return results;
}

function detectJableChineseSubtitle(html) {
  const $ = Widget.html.load(html);
  const keywords = $('meta[name="keywords"]').attr("content") || "";
  const firstKeyword = keywords.split(/[,，]/).map(s => s.trim()).filter(Boolean)[0];
  if (firstKeyword === "中文字幕") return true;
  const description = $('meta[name="description"]').attr("content") || "";
  if (description.includes("中文字幕版") || description.includes("更新至中文字幕") || description.includes("中文字幕")) return true;
  const lowerHtml = String(html).toLowerCase();
  if (lowerHtml.includes("chinese-subtitle") || lowerHtml.includes("chinese subtitle")) return true;
  return false;
}

async function loadResource(params = {}) {
  try {
    const code = extractCodeFromParams(params);
    if (!code) return [];
    const targetLoose = normalizeCode(code);
    let matched = null;
    const keys = [...new Set([code, code.replace(/-/g, "")])];
    for (const key of keys) {
      const keyword = encodeURIComponent(key);
      const searchUrl = `https://jable.tv/search/${keyword}/?mode=async&function=get_block&block_id=list_videos_videos_list_search_result&q=${keyword}`;
      const resp = await Widget.http.get(searchUrl, { headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36", "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8" } });
      const html = resp && resp.data;
      if (!html) continue;
      const results = parseJableSearchResults(html, code);
      matched = results.find(item => normalizeCode(item.code) === targetLoose);
      if (matched) break;
    }
    if (!matched || !matched.link) return [];
    const detailResp = await Widget.http.get(matched.link, { headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36", "Referer": "https://jable.tv/" } });
    const detailHtml = detailResp && detailResp.data;
    if (!detailHtml) return [];
    const hlsUrlMatch = detailHtml.match(/var\s+hlsUrl\s*=\s*['"](.*?)['"]/i);
    const hlsUrl = hlsUrlMatch && hlsUrlMatch[1] ? (hlsUrlMatch[1].startsWith("//") ? `https:${hlsUrlMatch[1]}` : hlsUrlMatch[1]) : "";
    if (!hlsUrl) return [];
    const isChineseSubtitle = detectJableChineseSubtitle(detailHtml);
    const sourceName = isChineseSubtitle ? "Jable 中文字幕" : "Jable 正片";
    return [{
      name: sourceName,
      description: `番号：${code}\n字幕：${isChineseSubtitle ? "中文字幕" : "无"}`,
      url: hlsUrl,
      customHeaders: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Referer": matched.link,
        "Origin": "https://jable.tv"
      }
    }];
  } catch (e) {
    return [];
  }
}

