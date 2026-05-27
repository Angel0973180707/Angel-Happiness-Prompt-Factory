const SERIES_PRESETS = {
  "早安圖": { ratio:"1:1", music:"木吉他Lo-fi", scene:"日式窗邊早餐", mood:"慢生活療癒", color:"米白暖色系" },
  "晚安圖": { ratio:"9:16", music:"輕鋼琴Lo-fi", scene:"夜晚窗邊熱茶", mood:"安定陪伴", color:"米白深藍暖灰" },
  "生命旅居": { ratio:"9:16", music:"空靈療癒音樂", scene:"海邊靈魂旅居", mood:"生命感悟", color:"米白霧金" },
  "慢生活": { ratio:"1:1", music:"日系咖啡館音樂", scene:"鄉間慢生活", mood:"放鬆日常", color:"米白奶茶色" },
  "料理食譜板": { ratio:"1:1", music:"輕快廚房音樂", scene:"木桌料理食譜板", mood:"手作溫暖", color:"米白奶油色" },
  "人生金句": { ratio:"9:16", music:"溫柔鋼琴", scene:"安靜人生場景", mood:"共鳴放下", color:"米白暖橘" },
  "情緒教養": { ratio:"1:1", music:"溫暖輕音樂", scene:"家庭互動場景", mood:"安心陪伴", color:"米白暖黃" },
  "睡眠療癒": { ratio:"9:16", music:"Alpha波療癒音樂", scene:"夜晚靜心場景", mood:"放鬆舒眠", color:"深藍暖灰" },
  "療癒小物": { ratio:"1:1", music:"Lo-fi生活感", scene:"溫暖居家桌面", mood:"質感舒服", color:"奶茶色系" },
  "品牌導流": { ratio:"9:16", music:"清爽商業音樂", scene:"智慧名片展示", mood:"信任導流", color:"米白金棕" }
};

const QUALITY = "premium lifestyle illustration, Japanese adult healing picture book style, soft watercolor and colored pencil texture, cinematic lighting, editorial poster composition, visual storytelling, warm atmosphere, high aesthetic, professional composition";
const NEGATIVE = "avoid cheap AI look, avoid childish cartoon style, avoid plastic skin, avoid distorted hands, avoid bad anatomy, avoid messy background, avoid wrong text, avoid overexposure, avoid low resolution";

let currentTarget = "topicTsv";

function $(id){ return document.getElementById(id); }

$("generateIdeaBtn").addEventListener("click", () => {
  const idea = $("ideaInput").value.trim();
  const unit = $("unitSelect").value;
  const selectedSeries = $("seriesSelect").value;
  if(!idea){ alert("請輸入靈感"); return; }

  const data = buildContent(idea, unit, selectedSeries);
  renderResult(data);
  fillTsv(data);
  $("resultPanel").hidden = false;
  $("sheetPanel").hidden = false;
});

document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentTarget = btn.dataset.target;
    $("topicTsv").hidden = currentTarget !== "topicTsv";
    $("visualTsv").hidden = currentTarget !== "visualTsv";
  });
});

$("copyCurrentBtn").addEventListener("click", async () => {
  const text = $(currentTarget).value;
  await navigator.clipboard.writeText(text);
  alert("已複製");
});

$("downloadTsvBtn").addEventListener("click", () => {
  const text = $(currentTarget).value;
  const name = currentTarget === "topicTsv" ? "02_topic_library_row.tsv" : "03_visual_content_library_row.tsv";
  const blob = new Blob([text], {type:"text/tab-separated-values;charset=utf-8"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
});

function autoSeries(idea, selected){
  if(selected !== "自動判斷") return selected;
  if(/[晚夜睡眠焦慮放下休息]/.test(idea)) return "晚安圖";
  if(/[早晨光開始咖啡早餐]/.test(idea)) return "早安圖";
  if(/[人生生命自己重逢旅居海山天空]/.test(idea)) return "生命旅居";
  if(/[慢生活午後散步閱讀花草]/.test(idea)) return "慢生活";
  return "早安圖";
}

function analyzeIdea(idea){
  let time = "晨光";
  let emotion = "溫暖療癒";
  let life = "咖啡";
  let lifeTheme = idea;
  let scene = "日式窗邊生活場景";
  let lighting = "暖色晨光穿透窗簾";
  let action = "雙手捧著熱咖啡，安靜看向窗外";
  let color = "米白、奶油色、暖木色、柔金色";
  let music = "木吉他Lo-fi";

  if(/[雨下雨雨聲]/.test(idea)){
    time="雨天"; emotion="被接住、安靜療癒"; life="窗邊看雨"; scene="窗邊雨景與熱茶"; lighting="灰米白天光與室內暖光"; action="捧著熱茶，側臉看雨"; color="灰米白、暖木色、淡奶茶色"; music="鋼琴Lo-fi";
  } else if(/[夜晚晚安深夜睡眠焦慮休息]/.test(idea)){
    time="夜晚"; emotion="安定、陪伴、放鬆"; life="閱讀與熱茶"; scene="夜晚窗邊沙發"; lighting="暖黃夜燈與柔和月光"; action="抱著毛毯，低頭閱讀或喝熱茶"; color="米白、深藍、暖灰、奶茶色"; music="輕鋼琴Lo-fi";
  } else if(/[山森林木屋]/.test(idea)){
    time="山旅"; emotion="自由、安靜、存在感"; life="森林散步"; scene="山中木屋與霧氣窗景"; lighting="霧氣晨光與柔和逆光"; action="推開窗，看向遠山"; color="森林綠、暖木色、米白霧金"; music="民謠吉他";
  } else if(/[海海邊天空]/.test(idea)){
    time="海邊"; emotion="放下、自由、療癒"; life="看海"; scene="黃昏海邊與留白天空"; lighting="夕陽霧金光"; action="背影坐在海邊，看向遠方"; color="米白、霧金、淺藍、沙色"; music="空靈療癒音樂";
  } else if(/[午後閱讀書花草散步]/.test(idea)){
    time="午後"; emotion="放鬆、舒服、慢下來"; life="閱讀或散步"; scene="午後木桌與書本花草"; lighting="午後柔光與窗邊漫反射"; action="翻書、喝咖啡、整理花草"; color="米白、奶茶色、淺木色"; music="日系咖啡館音樂";
  }

  return { time, emotion, life, lifeTheme, scene, lighting, action, color, music };
}

function buildContent(idea, unit, selectedSeries){
  const series = autoSeries(idea, selectedSeries);
  const preset = SERIES_PRESETS[series] || SERIES_PRESETS["早安圖"];
  const a = analyzeIdea(idea);
  const id = `${unitPrefix(unit)}-C-${nowId()}`;
  const title = makeTitle(idea, series);
  const mainCopy = makeMainCopy(idea, series);
  const platformCopy = makePlatformCopy(idea, series, unit);
  const hashtags = makeHashtags(unit, series);
  const character = "40歲左右短髮女性，米白棉麻居家服，自然氣質，真實生活感，不看鏡頭";
  const composition = preset.ratio === "1:1" ? "Instagram高級海報構圖，保留文案留白區" : "9:16短影音封面構圖，人物與場景有清楚層次，保留上方或側邊文案空間";
  const texture = "水彩＋色鉛筆混合媒材，細膩紙張紋理，高級成人療癒繪本風";
  const brand = "簡約小太陽logo自然融入角落，低干擾、不突兀";
  const imagePrompt = `${unit} ${series}，${a.scene}，${a.emotion}，${a.lighting}，${character}`;
  const finalPrompt = `Japanese adult healing picture book style, ${unit} universe, ${series} poster, ${a.scene}, a 40-year-old short-haired woman wearing beige linen homewear, natural and calm, not looking at camera, ${a.action}, ${a.lighting}, color palette of ${a.color}, ${texture}, ${composition}, warm slow living atmosphere, visual storytelling, cute minimal sun logo naturally placed in the corner, ${QUALITY}, ${NEGATIVE}, ${preset.ratio} composition`;

  return {
    id, unit, series, topic: idea, contentType:"POSTER_SINGLE", title, mainCopy,
    visualStyle: "日系成人療癒繪本風", layoutType:"POSTER", imagePrompt,
    ratio: preset.ratio, music: a.music || preset.music, platformCopy, hashtags,
    themeEmotion: a.emotion, sceneSetting: a.scene, characterSetting: character,
    characterAction: a.action, lightingStyle: a.lighting, colorPalette: a.color,
    compositionStyle: composition, textureStyle: texture, brandElements: brand,
    qualityKeywords: QUALITY, negativePrompt: NEGATIVE, finalPrompt,
    voiceStyle:"溫柔療癒女聲", publishGroup:`${unit}全平台`, status:"待產圖",
    timeUniverse:a.time, emotionUniverse:a.emotion, lifeUniverse:a.life, lifeTheme:a.lifeTheme
  };
}

function makeTitle(idea, series){
  if(series === "晚安圖") return `今晚，${idea}`;
  if(series === "早安圖") return `早安，${idea}`;
  return idea;
}

function makeMainCopy(idea, series){
  if(series === "晚安圖") return `${idea}。把今天慢慢放下，讓心先回到安穩的地方。`;
  if(series === "早安圖") return `${idea}。先好好感受一點晨光，再慢慢走進今天。`;
  return `${idea}。幸福就在簡單的日常裡，慢慢感受，就會被生活溫柔接住。`;
}

function makePlatformCopy(idea, series, unit){
  const prefix = series === "晚安圖" ? "晚安 🌙" : series === "早安圖" ? "早安 ☀️" : "今天，也慢慢來 ✨";
  return `${prefix}\n${idea}\n願你在簡單日常裡，慢慢把幸福放回心裡。\n#${unit}`;
}

function makeHashtags(unit, series){
  return `#${unit} #${series} #幸福感 #療癒繪本風 #慢生活 #日系插畫 #溫暖日常 #小太陽 #成人繪本風`;
}

function renderResult(d){
  $("ideaResult").innerHTML = [
    ["內容編號", d.id], ["系列", `${d.unit}｜${d.series}`], ["主題", d.topic],
    ["主題情緒", d.themeEmotion], ["場景", d.sceneSetting], ["人物", d.characterSetting],
    ["人物動作", d.characterAction], ["光影", d.lightingStyle], ["音樂", d.music]
  ].map(([k,v]) => `<div class="item"><b>${k}：</b>${escapeHtml(v)}</div>`).join("");
}

function fillTsv(d){
  const topicHeaders = "topic_id\tunit\tseries_name\ttopic_name\ttime_universe\temotion_universe\tlife_universe\tlife_theme\ttheme_emotion\tscene_setting\tlighting_style\tcharacter_action\tcolor_palette\tmusic_style\tcomposition_style\ttexture_style\tstatus\tnotes";
  const topicRow = [d.id.replace("-C-","-T-"), d.unit, d.series, d.topic, d.timeUniverse, d.emotionUniverse, d.lifeUniverse, d.lifeTheme, d.themeEmotion, d.sceneSetting, d.lightingStyle, d.characterAction, d.colorPalette, d.music, d.compositionStyle, d.textureStyle, "啟用", "控制台靈感自動解析"].join("\t");
  $("topicTsv").value = `${topicHeaders}\n${topicRow}`;

  const visualHeaders = "content_id\tunit\tseries_name\ttopic_name\tcontent_type\tcontent_title\tmain_copy\tvisual_style\tlayout_type\timage_prompt\toutput_ratio\tmusic_style\tplatform_copy\thashtags\ttheme_emotion\tscene_setting\tcharacter_setting\tcharacter_action\tlighting_style\tcolor_palette\tcomposition_style\ttexture_style\tbrand_elements\tquality_keywords\tnegative_prompt\tfinal_prompt\tvoice_style\tpublish_group\tdrive_link\tstatus\tnotes";
  const visualRow = [d.id, d.unit, d.series, d.topic, d.contentType, d.title, d.mainCopy, d.visualStyle, d.layoutType, d.imagePrompt, d.ratio, d.music, d.platformCopy, d.hashtags, d.themeEmotion, d.sceneSetting, d.characterSetting, d.characterAction, d.lightingStyle, d.colorPalette, d.compositionStyle, d.textureStyle, d.brandElements, d.qualityKeywords, d.negativePrompt, d.finalPrompt, d.voiceStyle, d.publishGroup, "", d.status, "控制台靈感自動生成"].join("\t");
  $("visualTsv").value = `${visualHeaders}\n${visualRow}`;
}

function unitPrefix(unit){
  const map = { "幸福旅居":"HL", "幸福緣手作":"HY", "生活感悟":"LGW", "幸福教養":"HJ", "健康頻率":"HF", "生活好物":"LG", "智慧名片商業系":"HC" };
  return map[unit] || "HE";
}
function nowId(){
  const d = new Date();
  const pad = n => String(n).padStart(2,"0");
  return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}
function escapeHtml(str){ return String(str).replace(/[&<>"]/g, s => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[s])); }
