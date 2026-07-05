// ============================================================
//  Beeg — 视频列表、详情与搜索模块
//  源站: https://beeg.com
//  纯 JSON API — store.externulls.com
// ============================================================

WidgetMetadata = {
  id: "forward.beeg",
  title: "Beeg",
  version: "1.1.0",
  requiredVersion: "0.0.1",
  description: "Beeg 视频模块 — 多频道/多模特浏览，HLS 多画质播放",
  author: "EL",
  site: "https://beeg.com",
  detailCacheDuration: 60,
  modules: [
    {
      id: "latest",
      title: "最新",
      functionName: "loadLatest",
      cacheDuration: 86400,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "byModel",
      title: "模特浏览",
      functionName: "loadByModel",
      cacheDuration: 86400,
      params: [
        {
          name: "model",
          title: "选择模特",
          type: "enumeration",
          value: "LanaRhoades",
          enumOptions: [
            { title: "Comatozze", value: "Comatozze" },
            { title: "Sweetie Fox", value: "SweetieFox" },
            { title: "Candy Love", value: "CandyLove" },
            { title: "Diana Rider", value: "DianaRider" },
            { title: "Eva Elfie", value: "EvaElfie" },
            { title: "Lana Rhoades", value: "LanaRhoades" },
            { title: "Julie Jess", value: "JulieJess" },
            { title: "Anny Walker", value: "AnnyWalker" },
            { title: "Jenny Kitty", value: "JennyKitty" },
            { title: "Angel X", value: "AngelX" },
            { title: "Shinaryen", value: "Shinaryen" },
            { title: "Anastangel", value: "Anastangel" },
            { title: "Emilia Bunny", value: "EmiliaBunny" },
            { title: "Fantasy Babe", value: "FantasyBabe" },
            { title: "Syndicete", value: "Syndicete" },
            { title: "Sybil", value: "Sybil" },
            { title: "Hotties Two", value: "HottiesTwo" },
            { title: "Riley Reid", value: "RileyReid" },
            { title: "Abella Danger", value: "AbellaDanger" },
            { title: "404HotFound", value: "404HotFound" },
            { title: "Emily Willis", value: "EmilyWillis" },
            { title: "Ruth Lee", value: "RuthLee" },
            { title: "Lil Karina", value: "LilKarina" },
            { title: "Bonnie Blaze", value: "BonnieBlaze" },
            { title: "Elsa Jean", value: "ElsaJean" },
            { title: "Martin & Paola", value: "MartinPaola" },
            { title: "Mia Malkova", value: "MiaMalkova" },
            { title: "Cory Chase", value: "CoryChase" },
            { title: "Miu", value: "Miu" },
            { title: "Lexi Lore", value: "LexiLore" },
            { title: "Angela White", value: "AngelaWhite" },
            { title: "Lena Paul", value: "LenaPaul" },
            { title: "Dick For Lily", value: "DickForLily" },
            { title: "Kate Kuray", value: "KateKuray" },
            { title: "Reislin", value: "Reislin" },
            { title: "Gabbie Carter", value: "GabbieCarter" },
            { title: "Blake Blossom", value: "BlakeBlossom" },
            { title: "Yummy Mira", value: "YummyMira" },
            { title: "Nicole Aniston", value: "NicoleAniston" },
            { title: "Lina Migurtt", value: "LinaMigurtt" },
            { title: "Gattouz0", value: "Gattouz0" },
            { title: "Carla Cute", value: "CarlaCute" },
            { title: "PinkLoving", value: "PinkLoving" },
            { title: "Kera Bear", value: "KeraBear" },
            { title: "Adriana Chechik", value: "AdrianaChechik" },
            { title: "Melody Marks", value: "MelodyMarks" },
            { title: "Kenzie Reeves", value: "KenzieReeves" },
            { title: "Allinika", value: "Allinika" },
            { title: "Valentina Nappi", value: "ValentinaNappi" },
            { title: "Gina Valentina", value: "GinaValentina" },
            { title: "Leah Meow", value: "LeahMeow" },
            { title: "Purple Bitch", value: "PurpleBitch" },
            { title: "My Anny", value: "MyAnny" },
            { title: "Dani Daniels", value: "DaniDaniels" },
            { title: "Molly Little", value: "MollyLittle" },
            { title: "Carry Light", value: "CarryLight" },
            { title: "SolaZola", value: "SolaZola" },
            { title: "Tru Kait", value: "TruKait" },
            { title: "Bunny Rabbits", value: "BunnyRabbits" },
            { title: "Lexi Luna", value: "LexiLuna" },
            { title: "Skye Young", value: "SkyeYoung" },
            { title: "Yuiwoo", value: "Yuiwoo" },
            { title: "Mila Lioness", value: "MilaLioness" },
            { title: "Sugary Kitty", value: "SugaryKitty" },
            { title: "Lauren Phillips", value: "LaurenPhillips" },
            { title: "Stacy Cruz", value: "StacyCruz" },
            { title: "Molly Red Wolf", value: "MollyRedWolf" },
            { title: "Diana Daniels", value: "DianaDaniels" },
            { title: "Autumn Falls", value: "AutumnFalls" },
            { title: "Luxury Mur", value: "LuxuryMur" },
            { title: "Jenny Lux", value: "JennyLux" },
            { title: "Cutie Kim", value: "CutieKim" },
            { title: "Nikky Dandeli", value: "NikkyDandeli" },
            { title: "Little Caprice", value: "LittleCaprice" },
            { title: "Eliza Ibarra", value: "ElizaIbarra" },
            { title: "Sia Siberia", value: "SiaSiberia" },
            { title: "Krystal Boyd", value: "KrystalBoyd" },
            { title: "Luxury Girl", value: "LuxuryGirl" },
            { title: "Telari Love", value: "TelariLove" },
            { title: "Yinyleon", value: "Yinyleon" },
            { title: "Miss Lexa", value: "MissLexa" },
            { title: "Alina Lopez", value: "AlinaLopez" },
            { title: "Skylar Vox", value: "SkylarVox" },
            { title: "Carolina Jackson", value: "CarolinaJackson" },
            { title: "Samantha Flair", value: "SamanthaFlair" },
            { title: "Liya Silver", value: "LiyaSilver" },
            { title: "Kyler Quinn", value: "KylerQuinn" },
            { title: "Alexa Grace", value: "AlexaGrace" },
            { title: "Anissa Kate", value: "AnissaKate" },
            { title: "Bunny Blondy", value: "BunnyBlondy" },
            { title: "Kelly Aleman", value: "KellyAleman" },
            { title: "Jia Lissa", value: "JiaLissa" },
            { title: "Johnny Sins", value: "JohnnySins" },
            { title: "Mysaaat", value: "Mysaaat" },
            { title: "Leah Gotti", value: "LeahGotti" },
            { title: "Brandi Love", value: "BrandiLove" },
            { title: "Haley Reed", value: "HaleyReed" },
            { title: "Nath Gomez", value: "NathGomez" },
            { title: "Leo Lulu", value: "LeoLulu" },
            { title: "Mick Liter", value: "MickLiter" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "byBrand",
      title: "品牌浏览",
      functionName: "loadByBrand",
      cacheDuration: 86400,
      params: [
        {
          name: "brand",
          title: "选择品牌",
          type: "enumeration",
          value: "VixenPlus",
          enumOptions: [
            { title: "Bratty Sis", value: "BrattySis" },
            { title: "Wow Girls", value: "WowGirls" },
            { title: "Nubiles Porn", value: "NubilesPorn" },
            { title: "Adult Time", value: "AdultTime" },
            { title: "Ultra Films", value: "UltraFilms" },
            { title: "Family Strokes", value: "FamilyStrokes" },
            { title: "Blacked", value: "Blacked" },
            { title: "Family XXX", value: "FamilyXXX" },
            { title: "LetsDoeIt!", value: "LetsDoeIt" },
            { title: "Nubile Films", value: "NubileFilms" },
            { title: "New Sensations", value: "NewSensations" },
            { title: "Tiny 4K", value: "Tiny4K" },
            { title: "Vixen Plus", value: "VixenPlus" },
            { title: "Step Siblings Caught", value: "StepSiblingsCaught" },
            { title: "Naughty America", value: "NaughtyAmerica" },
            { title: "Pure Taboo", value: "PureTaboo" },
            { title: "Moms Teach Sex", value: "MomsTeachSex" },
            { title: "Hot Wife XXX", value: "HotWifeXXX" },
            { title: "Vixen", value: "VixenCom" },
            { title: "Sis Loves Me", value: "SisLovesMe" },
            { title: "Porn Force", value: "PornForce" },
            { title: "Dorcel Club", value: "DorcelClub" },
            { title: "My Family Pies", value: "MyFamilyPies" },
            { title: "My Friend's Hot Mom", value: "MyFriendsHotMom" },
            { title: "Team Skeet", value: "TeamSkeet" },
            { title: "Bare Back Studios", value: "BareBackStudios" },
            { title: "NF Busty", value: "NFBusty" },
            { title: "Passion HD", value: "PassionHD" },
            { title: "Teen Mega World", value: "TeenMegaWorld" },
            { title: "21 Naturals", value: "21Naturals" },
            { title: "Tushy", value: "Tushy" },
            { title: "Teen Fidelity", value: "TeenFidelity" },
            { title: "Porn Fidelity", value: "PornFidelity" },
            { title: "Cum 4K", value: "Cum4K" },
            { title: "Porn World", value: "PornWorld" },
            { title: "Mom Wants to Breed", value: "MomWantsToBreed" },
            { title: "Princess Cum", value: "PrincessCum" },
            { title: "My Pervy Family", value: "MyPervyFamily" },
            { title: "Exploited College Girls", value: "ExploitedCollegeGirls" },
            { title: "Deeper", value: "DeeperOfficial" },
            { title: "Net Video Girls", value: "NVG" },
            { title: "Bellesa Plus", value: "BellesaPlus" },
            { title: "White Boxxx", value: "WhiteBoxxx" },
            { title: "Blacked Raw", value: "BlackedRaw" },
            { title: "Pure Mature", value: "PureMature" },
            { title: "Life Selector", value: "LifeSelector" },
            { title: "21 Sextury", value: "21Sextury" },
            { title: "Jav HD", value: "JavHD" },
            { title: "Perv Mom", value: "PervMom" },
            { title: "Evil Angel", value: "EvilAngel" },
            { title: "Cam Soda", value: "CamSoda" },
            { title: "Hegre", value: "Hegre" },
            { title: "JAV Hub", value: "JAVHub" },
            { title: "Girl Cum", value: "GirlCumOfficial" },
            { title: "Exxxtra Small", value: "ExxxtraSmall" },
            { title: "Lubed (Com)", value: "LubedCom" },
            { title: "VIP 4K", value: "VIP4K" },
            { title: "AV Jiali", value: "AvJiali" },
            { title: "Sex Art", value: "SexArt" },
            { title: "Tonight's Girlfriend", value: "TonightsGirlfriend" },
            { title: "Dad Crush", value: "DadCrush" },
            { title: "NoLube", value: "NoLube" },
            { title: "It's POV", value: "ItsPOV" },
            { title: "Spy Fam", value: "SpyFam" },
            { title: "Exotic 4K", value: "Exotic4K" },
            { title: "Mom Lover", value: "MomLover" },
            { title: "My Sister's Hot Friend", value: "MySistersHotFriend" },
            { title: "Joy Mii", value: "JoyMii" },
            { title: "Daughter Swap", value: "DaughterSwap" },
            { title: "Caribbeancom", value: "Caribbeancom" },
            { title: "Girlsway", value: "Girlsway" },
            { title: "Luxure", value: "Luxure" },
            { title: "Massage Girls 18", value: "MassageGirls18" },
            { title: "Shop Lyfter", value: "ShopLyfter" },
            { title: "Nuru Massage", value: "NuruMassage" },
            { title: "Club Sweethearts", value: "ClubSweethearts" },
            { title: "Backroom Casting Couch", value: "BackroomCastingCouch" },
            { title: "Tushy Raw", value: "TushyRaw" },
            { title: "BFFs", value: "BFFs" },
            { title: "Mommy's Boy (Official)", value: "MommysBoyOfficial" },
            { title: "Transfixed", value: "Transfixed" },
            { title: "Touch My Wife", value: "TouchMyWife" },
            { title: "POVD", value: "POVD" },
            { title: "Casting Couch X", value: "CastingCouchX" },
            { title: "ATK Girlfriends", value: "AtkGirlfriends" },
            { title: "Holed", value: "Holed" },
            { title: "StasyQ", value: "StasyQ" },
            { title: "Family Swap", value: "FamilySwap" },
            { title: "Porn Pros", value: "PornPros" },
            { title: "Fit 18", value: "Fit18" },
            { title: "Her Limit", value: "HerLimit" },
            { title: "Mommy's Girl (Com)", value: "MommysGirlCom" },
            { title: "Met Art X", value: "MetArtX" },
            { title: "X Art", value: "XArt" },
            { title: "A Girl Knows", value: "AGirlKnows" },
            { title: "Teens Love Anal", value: "TeensLoveAnal" },
            { title: "Family Therapy XXX", value: "FamilyTherapyXXX" },
            { title: "Lust Cinema", value: "LustCinema" },
            { title: "Erotica X", value: "EroticaX" },
            { title: "Private (Com)", value: "PrivateCom" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "byCategory",
      title: "分类浏览",
      functionName: "loadByCategory",
      cacheDuration: 86400,
      params: [
        {
          name: "category",
          title: "选择分类",
          type: "enumeration",
          value: "Anal",
          enumOptions: [
            { title: "Anal", value: "Anal" },
            { title: "Japanese", value: "Japanese" },
            { title: "Big Tits", value: "BigTits" },
            { title: "Teen Girl", value: "TeenGirl" },
            { title: "Big Ass", value: "BigAss" },
            { title: "Mom", value: "Mom" },
            { title: "POV", value: "POV" },
            { title: "Creampie", value: "Creampie" },
            { title: "Lesbian", value: "Lesbian" },
            { title: "Young Girl", value: "YoungGirl" },
            { title: "MILF", value: "MILF" },
            { title: "Russian", value: "Russian" },
            { title: "Blowjob", value: "Blowjob" },
            { title: "Squirting", value: "Squirting" },
            { title: "Hardcore", value: "Hardcore" },
            { title: "Longer Full", value: "LongerFull" },
            { title: "18 Year Old", value: "18YearOld" },
            { title: "Sister", value: "Sister" },
            { title: "Compilation", value: "Compilation" },
            { title: "Petite", value: "Petite" },
            { title: "Asian Girl", value: "AsianGirl" },
            { title: "Mom-Son", value: "MomSon" },
            { title: "Family", value: "Family" },
            { title: "Sleeping", value: "Sleeping" },
            { title: "Latina", value: "Latina" },
            { title: "3some", value: "3some" },
            { title: "FFM", value: "FFM" },
            { title: "Deepthroat", value: "Deepthroat" },
            { title: "Cumshot", value: "Cumshot" },
            { title: "Teen Sex", value: "TeenSex" },
            { title: "Gangbang", value: "Gangbang" },
            { title: "Stockings", value: "Stockings" },
            { title: "Black Girl", value: "BlackGirl" },
            { title: "Full", value: "Full" },
            { title: "Amateur Girl", value: "AmateurGirl" },
            { title: "Cosplay", value: "Cosplay" },
            { title: "Rough", value: "Rough" },
            { title: "Masturbation", value: "Masturbation" },
            { title: "1080p", value: "1080p" },
            { title: "Transsexual", value: "Transsexual" },
            { title: "Cuckold", value: "Cuckold" },
            { title: "Babe", value: "Babe" },
            { title: "AI-Generated", value: "AIGenerated" },
            { title: "Indian", value: "Indian" },
            { title: "Lingerie", value: "Lingerie" },
            { title: "Big Cock", value: "BigCock" },
            { title: "Female Orgasm", value: "FemaleOrgasm" },
            { title: "Solo", value: "Solo" },
            { title: "Pussy Licking", value: "PussyLicking" },
            { title: "BBC", value: "BBC" },
            { title: "Schoolgirl", value: "Schoolgirl" },
            { title: "Redhead", value: "Redhead" },
            { title: "Natural Tits", value: "NaturalTits" },
            { title: "DP", value: "DP" },
            { title: "Cheating", value: "Cheating" },
            { title: "White Girl", value: "WhiteGirl" },
            { title: "Best Body", value: "BestBody" },
            { title: "Cum In Mouth", value: "CumInMouth" },
            { title: "Public", value: "Public" },
            { title: "Homemade", value: "Homemade" },
            { title: "Cowgirl", value: "Cowgirl" },
            { title: "Doggy", value: "Doggy" },
            { title: "Blonde", value: "Blonde" },
            { title: "BDSM", value: "BDSM" },
            { title: "Chinese", value: "Chinese" },
            { title: "Skinny", value: "Skinny" },
            { title: "Massage", value: "Massage" },
            { title: "Daughter", value: "Daughter" },
            { title: "Taboo", value: "Taboo" },
            { title: "Feet", value: "Feet" },
            { title: "JOI", value: "JOI" },
            { title: "Interracial", value: "Interracial" },
            { title: "Gay", value: "Gay" },
            { title: "Orgy", value: "Orgy" },
            { title: "Classic", value: "Classic" },
            { title: "Small Tits", value: "SmallTits" },
            { title: "Mature Woman", value: "MatureWoman" },
            { title: "Horizontal Media", value: "HorizontalMedia" },
            { title: "Trans Girl", value: "TransGirl" },
            { title: "Heels", value: "Heels" },
            { title: "Old-Young", value: "OldYoung" },
            { title: "Footjob", value: "Footjob" },
            { title: "Facial", value: "Facial" },
            { title: "Pantyhose", value: "Pantyhose" },
            { title: "Pro Performer", value: "ProPerformer" },
            { title: "MMF", value: "MMF" },
            { title: "4K", value: "4K" },
            { title: "Over 20 Min", value: "Over20Min" },
            { title: "BBW", value: "BBW" },
            { title: "PAWG", value: "PAWG" },
            { title: "Reverse Cowgirl", value: "ReverseCowgirl" },
            { title: "Brazilian", value: "Brazilian" },
            { title: "Missionary", value: "Missionary" },
            { title: "Sister-Brother", value: "SisterBrother" },
            { title: "Face Fuck", value: "FaceFuck" },
            { title: "Japanese Uncensored", value: "JapaneseUncensored" },
            { title: "Czech", value: "Czech" },
            { title: "4-20 Min", value: "4to20Min" },
            { title: "Filipina", value: "Filipina" },
            { title: "Dad-Daughter", value: "DadDaughter" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "searchBeeg",
      title: "搜索 Beeg",
      functionName: "searchVideos",
      cacheDuration: 3600,
      params: [
        { name: "keyword", title: "关键词", type: "input", value: "" },
        { name: "page", title: "页码", type: "page" }
      ]
    }
  ],
  search: {
    title: "搜索",
    functionName: "searchVideos",
    params: [
      { name: "keyword", title: "关键词", type: "input", value: "" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

// ============================================================
//  常量
// ============================================================
const API_BASE = "https://store.externulls.com";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15";

// ============================================================
//  工具函数
// ============================================================

async function fetchAPI(url) {
  const resp = await Widget.http.get(url, {
    headers: {
      "User-Agent": UA,
      "Origin": "https://beeg.com",
      "Referer": "https://beeg.com/"
    }
  });
  if (!resp || !resp.data) throw new Error("请求失败: " + url);
  const parsed = typeof resp.data === "string" ? JSON.parse(resp.data) : resp.data;
  return parsed;
}

function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return "";
  seconds = Math.round(seconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return h + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  return m + ":" + String(s).padStart(2, "0");
}

/** 从视频对象构建列表项 */
function buildItem(video) {
  const fcFacts = video.fc_facts ? video.fc_facts[0] : null;
  const factId = fcFacts ? fcFacts.id : null;
  const fileData = video.file && video.file.data ? video.file.data : [];
  const fileId = video.file && video.file.id ? video.file.id : (fileData.length > 0 && fileData[0].cd_file ? fileData[0].cd_file : factId);
  if (!fileId) return null;

  const duration = video.file && video.file.fl_duration ? video.file.fl_duration : 0;
  const height = video.file && video.file.fl_height ? video.file.fl_height : 0;
  const fcThumbs = fcFacts && fcFacts.fc_thumbs ? fcFacts.fc_thumbs : [];

  // 标题
  let title = "Untitled";
  for (var i = 0; i < fileData.length; i++) {
    if (fileData[i].cd_column === "sf_name") {
      title = fileData[i].cd_value || title;
      break;
    }
  }

  // 封面
  let cover = "";
  if (fcThumbs.length > 0) {
    cover = "https://thumbs.externulls.com/videos/" + fileId + "/" + fcThumbs[0] + ".jpg";
  } else if (fileData[0] && fileData[0].cd_file) {
    cover = "https://img.externulls.com/" + fileData[0].cd_file + "/preview_01.jpg";
  }

  const link = String(fileId);
  const durationText = formatDuration(duration);
  var remark = "";
  if (height > 0) remark += height + "p";
  if (durationText) remark += (remark ? " " : "") + durationText;

  return {
    id: link,
    type: "url",
    mediaType: "movie",
    title: title,
    link: link,
    coverUrl: cover || "",
    backdropPath: cover || "",
    durationText: durationText,
    remark: height > 0 ? height + "p" + (durationText ? " " + durationText : "") : (durationText || ""),
    ext: { fileId: fileId }
  };
}

// ============================================================
//  loadLatest — 最新列表（首页）
// ============================================================
async function loadLatest(params) {
  try {
    if (params.genreId || params.peopleId) {
      return loadChannel({ channel: params.genreId || params.peopleId, page: params.page });
    }

    const page = Math.max(1, Number(params.page) || 1);
    const offset = (page - 1) * 48;
    const url = API_BASE + "/tag/videos/index?limit=48&offset=" + offset;
    const data = await fetchAPI(url);

    const items = [];
    if (Array.isArray(data)) {
      for (const video of data) {
        const item = buildItem(video);
        if (item) items.push(item);
      }
    }
    return items;
  } catch (error) {
    console.error("[Beeg loadLatest] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadChannel — 按频道浏览
// ============================================================
async function loadChannel(params) {
  try {
    const slug = params.peopleId || params.genreId || params.channel || "";
    if (!slug) throw new Error("缺少频道参数");

    const page = Math.max(1, Number(params.page) || 1);
    const offset = (page - 1) * 48;
    const url = API_BASE + "/tag/videos/" + slug + "?limit=48&offset=" + offset;
    const data = await fetchAPI(url);

    const items = [];
    if (Array.isArray(data)) {
      for (const video of data) {
        const item = buildItem(video);
        if (item) items.push(item);
      }
    }
    return items;
  } catch (error) {
    console.error("[Beeg loadChannel] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadByModel — 按模特浏览
// ============================================================
async function loadByModel(params) {
  return loadChannel({ channel: params.model, page: params.page });
}

// ============================================================
//  loadByBrand — 按品牌浏览
// ============================================================
async function loadByBrand(params) {
  return loadChannel({ channel: params.brand, page: params.page });
}

// ============================================================
//  loadByCategory — 按分类浏览
// ============================================================
async function loadByCategory(params) {
  return loadChannel({ channel: params.category, page: params.page });
}

// ============================================================
//  searchVideos — 搜索（遍历首页匹配标题）
// ============================================================
async function searchVideos(params) {
  try {
    if (params.peopleId) {
      return loadChannel({ channel: params.peopleId, page: params.page || 1 });
    }

    const keyword = (params.keyword || "").trim().toLowerCase();
    if (!keyword) throw new Error("请输入搜索关键词");

    // 分词
    const words = keyword.split(/[^a-z0-9]+/).filter(function(w) { return w.length >= 2; });
    if (words.length === 0) throw new Error("关键词太短");

    const page = Math.max(1, Number(params.page) || 1);

    // 每页搜索扫描 5 个首页页面的内容
    const pagesPerSearch = 5;
    const startPage = (page - 1) * pagesPerSearch + 1;
    const endPage = startPage + pagesPerSearch - 1;

    const seen = {};
    const items = [];

    for (var hp = startPage; hp <= endPage; hp++) {
      const offset = (hp - 1) * 48;
      const url = API_BASE + "/tag/videos/index?limit=48&offset=" + offset;
      const data = await fetchAPI(url);

      if (!Array.isArray(data)) continue;

      for (let vi = 0; vi < data.length; vi++) {
        const video = data[vi];
        const item = buildItem(video);
        if (!item || seen[item.id]) continue;

        // 检查标题是否包含所有搜索词
        const titleLower = item.title.toLowerCase();
        let allMatch = true;
        for (let wi = 0; wi < words.length; wi++) {
          if (titleLower.indexOf(words[wi]) < 0) {
            allMatch = false;
            break;
          }
        }
        if (!allMatch) continue;

        seen[item.id] = true;
        item.posterPath = item.coverUrl;
        items.push(item);
        if (items.length >= 48) break;
      }
      if (items.length >= 48) break;
    }

    return items;
  } catch (error) {
    console.error("[Beeg searchVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadDetail — 视频详情
// ============================================================
async function loadDetail(link) {
  if (!link) throw new Error("无效的视频链接");

  try {
    // 从 link 中提取文件 ID：取路径最后一段，去除非数字字母，去掉 -0 前缀
    var rawId = String(link);
    var lastSlash = rawId.lastIndexOf("/");
    if (lastSlash >= 0) rawId = rawId.substring(lastSlash + 1);
    const fileId = rawId.replace(/[^0-9a-zA-Z_-]/g, "").replace(/^-0/, "");
    if (!fileId) throw new Error("无效的视频 ID");

    // 从 API 获取视频详情（含播放地址）
    const detailUrl = API_BASE + "/facts/file/" + fileId;
    const data = await fetchAPI(detailUrl);
    if (!data || !data.file) throw new Error("未找到视频数据");

    const hlsResources = data.file.hls_resources || {};
    const fileData = data.file.data || [];

    // 标题
    let title = "Untitled";
    for (var i = 0; i < fileData.length; i++) {
      if (fileData[i].cd_column === "sf_name") {
        title = fileData[i].cd_value || title;
        break;
      }
    }

    // 演员（从 tags 中提取 is_person=true 的条目）
    var peoples = [];
    var genreItems = [];
    if (data.tags && Array.isArray(data.tags)) {
      for (var ti = 0; ti < data.tags.length; ti++) {
        var tag = data.tags[ti];
        if (!tag || !tag.id) continue;
        if (tag.is_person) {
          // 提取头像
          var avatarUrl = "";
          var tagThumbs = tag.thumbs || [];
          if (tagThumbs.length > 0) {
            var th = tagThumbs[0];
            var thumbId = th.id;
            var cropId = (th.crops && th.crops.length > 0) ? th.crops[0].id : "";
            if (thumbId && cropId) {
              avatarUrl = "https://thumbs.externulls.com/photos/" + thumbId + "/to.webp?crop_id=" + cropId + "&size_new=128x128";
            }
          }
          peoples.push({
            id: tag.tg_slug || String(tag.id),
            title: tag.tg_name || "Unknown",
            role: "actor",
            avatar: avatarUrl || undefined
          });
        } else {
          genreItems.push({
            id: tag.tg_slug || String(tag.id),
            title: tag.tg_name || "Unknown"
          });
        }
      }
    }

    // 时长
    const duration = data.file.fl_duration || 0;
    const durationText = formatDuration(duration);

    // 封面
    const fcFacts = data.fc_facts ? data.fc_facts[0] : null;
    let cover = "";
    if (fcFacts && fcFacts.fc_thumbs && fcFacts.fc_thumbs.length > 0) {
      cover = "https://thumbs.externulls.com/videos/" + fileId + "/" + fcFacts.fc_thumbs[0] + ".jpg";
    } else if (fileData[0] && fileData[0].cd_file) {
      cover = "https://img.externulls.com/" + fileData[0].cd_file + "/preview_01.jpg";
    }

    // 剧照：利用 fc_thumbs 的多张预览图
    const backdropPaths = [];
    if (fcFacts && fcFacts.fc_thumbs && fcFacts.fc_thumbs.length > 0) {
      for (var bti = 0; bti < fcFacts.fc_thumbs.length; bti++) {
        backdropPaths.push("https://thumbs.externulls.com/videos/" + fileId + "/" + fcFacts.fc_thumbs[bti] + ".jpg");
      }
    } else if (cover) {
      backdropPaths.push(cover);
    }

    // 播放地址：解析 master playlist，优先选 av1 编码（CDN 最稳定），其次选最后列出的流
    var playUrl = "";
    var multiRaw = hlsResources["fl_cdn_multi"];
    if (multiRaw) {
      try {
        var masterResp = await Widget.http.get("https://video.beeg.com/" + multiRaw, {
          headers: {
            "User-Agent": UA,
            "Origin": "https://beeg.com",
            "Referer": "https://beeg.com/"
          }
        });
        if (masterResp && masterResp.data) {
          var masterText = typeof masterResp.data === "string" ? masterResp.data : String(masterResp.data);
          var bestAv1Url = "";
          var bestAv1Height = 0;
          var lastUrl = "";
          var lastHeight = 0;
          var lines = masterText.split("\n");
          var currentHeight = 0;
          var isAv1 = false;
          for (var li = 0; li < lines.length; li++) {
            var line = lines[li].trim();
            var resMatch = line.match(/RESOLUTION=(\d+)x(\d+)/);
            if (resMatch) {
              currentHeight = parseInt(resMatch[2], 10);
              isAv1 = line.indexOf("av01") >= 0;
            }
            if (line.indexOf("//") === 0 && currentHeight > 0) {
              var fullUrl = "https:" + line;
              if (currentHeight > lastHeight) {
                lastHeight = currentHeight;
                lastUrl = fullUrl;
              }
              if (isAv1 && currentHeight > bestAv1Height) {
                bestAv1Height = currentHeight;
                bestAv1Url = fullUrl;
              }
            }
          }
          playUrl = bestAv1Url || lastUrl;
        }
      } catch(e) {
        console.error("[Beeg loadDetail] 解析 master playlist 失败:", e.message || e);
      }
    }

    // fallback：如果解析失败，直接把 master playlist URL 交给播放器处理
    if (!playUrl && multiRaw) {
      playUrl = "https://video.beeg.com/" + multiRaw;
    }

    // 预告片
    var trailers = [];
    if (playUrl) {
      trailers.push({ url: playUrl, coverUrl: cover });
    }

    // 构建简介（日期/播放/点赞/分辨率）
    const descParts = [];
    if (fcFacts && fcFacts.fc_created) {
      descParts.push("日期: " + fcFacts.fc_created.substring(0, 10));
    }
    if (fcFacts && fcFacts.fc_st_views) {
      descParts.push("播放: " + Number(fcFacts.fc_st_views).toLocaleString() + " 次");
    }
    if (fcFacts && (fcFacts.reactions_count || fcFacts.reactions_count_unreg)) {
      const total = (fcFacts.reactions_count || 0) + (fcFacts.reactions_count_unreg || 0);
      descParts.push("点赞: " + total);
    }
    if (data.file.fl_width && data.file.fl_height) {
      descParts.push("分辨率: " + data.file.fl_width + "×" + data.file.fl_height);
    }

    return {
      id: link,
      type: "url",
      mediaType: "movie",
      title: title,
      link: link,
      coverUrl: cover || "",
      posterPath: cover || "",
      backdropPath: cover || "",
      videoUrl: playUrl || "",
      playerType: "app",
      headers: {
        "User-Agent": UA,
        "Origin": "https://beeg.com",
        "Referer": "https://beeg.com/"
      },
      durationText: durationText,
      description: descParts.length > 0 ? descParts.join("\n") : undefined,
      peoples: peoples.length > 0 ? peoples : undefined,
      genreItems: genreItems.length > 0 ? genreItems : undefined,
      backdropPaths: backdropPaths.length > 0 ? backdropPaths : undefined,
      trailers: trailers.length > 0 ? trailers : undefined
    };
  } catch (error) {
    console.error("[Beeg loadDetail] 失败:", error.message || error);
    throw error;
  }
}
