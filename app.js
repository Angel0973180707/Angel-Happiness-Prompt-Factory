const GAS_URL =
"https://script.google.com/macros/s/AKfycbzGjQuix5THq44jWLmFWjuKsjes2crL6ys69mPQmXqng5nJBHlxCUHgSbsgxGepXcDgxg/exec";

let SERIES_ROWS = [];

window.onload = async function(){
  await loadSeries();
};

async function loadSeries(){
  try{
    const res = await fetch(GAS_URL + "?action=getSeries");
    const data = await res.json();
    SERIES_ROWS = data.data || [];
    renderSeriesOptions();
  }catch(err){
    console.error(err);
  }
}

function renderSeriesOptions(){
  const unit = document.getElementById("unit").value;
  const select = document.getElementById("series");
  select.innerHTML = '<option value="">請選擇系列</option>';

  SERIES_ROWS
    .filter(item => !item.unit || item.unit === unit)
    .forEach(item=>{
      const option = document.createElement("option");
      option.value = item.series_name;
      option.textContent = item.series_name;
      select.appendChild(option);
    });
}

function generatePrompt(){
  const unit = val("unit");
  const series = val("series");
  const topic = val("topic");
  const contentType = val("contentType");
  const promptType = val("promptType");
  const ratio = val("ratio");
  const duration = val("duration");
  const extra = val("extra");
  const topicCount = val("topicCount");

  let prompt = "";

  if(promptType === "BATCH_IMAGE_PROMPT"){
    prompt = `
你是一位「幸福生態圈 AI 主題生成導演」。

【主題宇宙】
${unit}

【系列】
${series}

【內容類型】
${contentType}

【補充靈感】
${extra}

請生成 ${topicCount} 個適合長期經營的主題。

主題必須：
✓ 有幸福感
✓ 有生活感
✓ 有畫面感
✓ 適合日更
✓ 適合 IG／Shorts／TikTok／FB／小紅書
✓ 適合日系成人療癒繪本風

請固定格式輸出：

【主題清單】
1. 主題名稱｜一句畫面感描述
2. 主題名稱｜一句畫面感描述

不要生成圖片。
`;
  }

  else if(promptType === "VISUAL_PROMPT"){
    prompt = `
你是一位「幸福生態圈 AI 視覺內容導演」。

【主題宇宙】
${unit}

【系列】
${series}

【主題】
${topic}

【內容類型】
${contentType}

【輸出比例】
${ratio}

【補充靈感】
${extra}

畫面風格：
✓ 日系成人療癒繪本風
✓ 米白暖色系
✓ 幸福感
✓ 柔和暖光
✓ 慢生活
✓ 小太陽logo
✓ 手寫感字體
✓ 留白感
✓ 高質感插畫

請務必用以下固定格式輸出，不要改標題：

【主標題】
填入主標題

【畫面文案】
填入畫面上的文字

【畫面描述】
填入完整畫面描述

【AI產圖提示詞】
填入可直接產圖的提示詞

【音樂氛圍】
填入適合開拍使用的音樂方向

【平台文案】
填入 IG／TikTok／Shorts／FB／小紅書 可共用的發布文案

【Hashtag】
填入 Hashtag
`;
  }

  else if(promptType === "SHORT_VIDEO_PROMPT"){
    prompt = `
你是一位「幸福生態圈 AI 短影音導演」。

【主題宇宙】
${unit}

【系列】
${series}

【主題】
${topic}

【影片秒數】
${duration}秒

【輸出比例】
${ratio}

【補充靈感】
${extra}
重要規則：
請嚴格按照以下格式輸出。
每一個標籤都必須出現。
標籤名稱不可修改。
標籤順序不可改變。
不要新增其他標籤。
不要省略空白欄位。

請務必用以下固定格式輸出，不要改標題：

【影片標題】
填入影片標題

【分鏡流程】
填入分鏡流程

【每張畫面描述】
填入每張畫面描述

【每張AI產圖提示詞】
填入每張圖片的產圖提示詞

【配音文案】
填入完整配音文案

【字幕內容】
填入字幕內容

【音樂氛圍】
填入音樂方向

【平台文案】
填入多平台發布文案

【Hashtag】
填入 Hashtag
`;
  }

  else if(promptType === "SERIES_EXPANSION"){
    prompt = `
請為「${unit}」生成 ${topicCount} 個適合長期經營的新系列。

請固定格式輸出：

【系列清單】
1. 系列名稱｜系列定位｜內容方向｜視覺風格
`;
  }

  else if(promptType === "TOPIC_GENERATION"){
    prompt = `
請為「${unit}｜${series}」生成 ${topicCount} 個可長期經營主題。

請固定格式輸出：

【主題清單】
1. 主題名稱｜畫面感描述｜情緒方向
`;
  }

  else if(promptType === "PLATFORM_COPY"){
    prompt = `
請為以下內容生成五平台發布文案。

【主題】
${topic}

【補充內容】
${extra}

請固定格式輸出：

【平台文案】
IG：
TikTok：
Shorts：
FB：
小紅書：

【Hashtag】
`;
  }

  document.getElementById("output").innerText = prompt;
}

function copyPrompt(){
  const text = document.getElementById("output").innerText;
  navigator.clipboard.writeText(text);
  alert("已複製 Prompt");
}

function parseSection(text,title){
  const regex = new RegExp(`【${title}】([\\s\\S]*?)(?=【|$)`);
  const match = text.match(regex);
  return match ? match[1].trim() : "";
}

async function saveVisualContent(){
  const aiText = val("aiResult") || document.getElementById("output").innerText;

  const body = {
    action:"saveVisualContent",
    unit:val("unit"),
    series_name:val("series"),
    topic_name:val("topic"),
    content_type:val("contentType"),
    content_title:parseSection(aiText,"主標題") || parseSection(aiText,"影片標題") || val("topic"),
    main_copy:parseSection(aiText,"畫面文案"),
    visual_style:"幸福感療癒繪本風",
    layout_type:"POSTER",
    image_prompt:parseSection(aiText,"AI產圖提示詞") || parseSection(aiText,"每張AI產圖提示詞"),
    output_ratio:val("ratio"),
    music_style:parseSection(aiText,"音樂氛圍"),
    platform_copy:parseSection(aiText,"平台文案"),
    hashtags:parseSection(aiText,"Hashtag"),
    voice_style:parseSection(aiText,"配音文案"),
    publish_group:val("unit") + "全平台",
    drive_link:val("driveLink"),
    priority:val("priority"),
    status:val("contentStatus"),
    notes:""
  };

  try{
    const res = await fetch(GAS_URL,{
      method:"POST",
      body:JSON.stringify(body)
    });

    const data = await res.json();
    console.log(data);
    alert("已儲存成功");
  }catch(err){
    console.error(err);
    alert("儲存失敗");
  }
}

function val(id){
  return document.getElementById(id).value.trim();
}