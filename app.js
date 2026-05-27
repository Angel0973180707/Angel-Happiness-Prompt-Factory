// ========================================
// 幸福產圖指令工廠 app.js 完整覆蓋版
// STEP 3｜系列自動帶風格版
// ========================================

const GAS_URL =
"https://script.google.com/macros/s/AKfycbzGjQuix5THq44jWLmFWjuKsjes2crL6ys69mPQmXqng5nJBHlxCUHgSbsgxGepXcDgxg/exec";

let SERIES_ROWS = [];
let SERIES_MAP = {};



// ========================================
// 初始化
// ========================================

window.onload = async function(){

  await loadSeries();

};



// ========================================
// 讀取系列
// ========================================

async function loadSeries(){

  try{

    const res = await fetch(
      GAS_URL + "?action=getSeries"
    );

    const data = await res.json();

    SERIES_ROWS = data.data || [];

    SERIES_ROWS.forEach(item=>{

      SERIES_MAP[item.series_name] = item;

    });

    renderSeriesOptions();

  }catch(err){

    console.error(err);

  }

}



// ========================================
// 渲染系列選單
// ========================================

function renderSeriesOptions(){

  const unit =
    document.getElementById("unit").value;

  const select =
    document.getElementById("series");

  select.innerHTML =
    '<option value="">請選擇系列</option>';

  SERIES_ROWS
    .filter(item => !item.unit || item.unit === unit)
    .forEach(item=>{

      const option =
        document.createElement("option");

      option.value =
        item.series_name;

      option.textContent =
        item.series_name;

      select.appendChild(option);

    });

}



// ========================================
// 生成 Prompt
// ========================================

function generatePrompt(){

const unit =
document.getElementById("unit").value;

const series =
document.getElementById("series").value;

const topic =
document.getElementById("topic").value;

const contentType =
document.getElementById("contentType").value;

const promptType =
document.getElementById("promptType").value;

const ratio =
document.getElementById("ratio").value;

const duration =
document.getElementById("duration").value;

const extra =
document.getElementById("extra").value;

const topicCount =
document.getElementById("topicCount").value;



// ========================================
// 系列預設風格
// ========================================

const seriesData =
SERIES_MAP[series] || {};

const autoStyle =
seriesData.visual_style_default || "";

const autoKeywords =
seriesData.default_keywords || "";

const autoScene =
seriesData.default_scene || "";

const autoMood =
seriesData.default_mood || "";

const autoMusic =
seriesData.default_music || "";

const autoLogo =
seriesData.default_logo || "";

const autoColor =
seriesData.default_color || "";

const autoRatio =
seriesData.default_ratio || ratio;



let prompt = "";



// ========================================
// 批次主題生成
// ========================================

if(promptType === "BATCH_IMAGE_PROMPT"){

prompt = `

你是一位：

「幸福生態圈 AI 主題生成導演」。

━━━━━━━━━━━━━━━━━━━
【主題宇宙】
━━━━━━━━━━━━━━━━━━━

${unit}

━━━━━━━━━━━━━━━━━━━
【系列】
━━━━━━━━━━━━━━━━━━━

${series}

━━━━━━━━━━━━━━━━━━━
【系列預設風格】
━━━━━━━━━━━━━━━━━━━

視覺風格：
${autoStyle}

關鍵字：
${autoKeywords}

場景：
${autoScene}

氛圍：
${autoMood}

音樂：
${autoMusic}

Logo：
${autoLogo}

色系：
${autoColor}

比例：
${autoRatio}

━━━━━━━━━━━━━━━━━━━
【補充靈感】
━━━━━━━━━━━━━━━━━━━

${extra}

━━━━━━━━━━━━━━━━━━━
【任務】
━━━━━━━━━━━━━━━━━━━

請生成：

${topicCount}個適合長期經營的主題。

主題必須：

✓ 有幸福感
✓ 有生活感
✓ 有畫面感
✓ 適合日更
✓ 適合 IG／Shorts／TikTok／FB／小紅書
✓ 符合系列宇宙感

━━━━━━━━━━━━━━━━━━━
【重要規則】
━━━━━━━━━━━━━━━━━━━

請嚴格按照以下格式輸出。

每個標籤都必須出現。
標籤名稱不可修改。
順序不可改變。

━━━━━━━━━━━━━━━━━━━
【固定輸出格式】
━━━━━━━━━━━━━━━━━━━

【主題清單】

1. 主題名稱｜一句畫面感描述
2. 主題名稱｜一句畫面感描述

不要生成圖片。

`;

}



// ========================================
// 單張精品產圖
// ========================================

else if(promptType === "VISUAL_PROMPT"){

prompt = `

你是一位：

「幸福生態圈 AI 視覺內容導演」。

━━━━━━━━━━━━━━━━━━━
【主題宇宙】
━━━━━━━━━━━━━━━━━━━

${unit}

━━━━━━━━━━━━━━━━━━━
【系列】
━━━━━━━━━━━━━━━━━━━

${series}

━━━━━━━━━━━━━━━━━━━
【主題】
━━━━━━━━━━━━━━━━━━━

${topic}

━━━━━━━━━━━━━━━━━━━
【系列預設風格】
━━━━━━━━━━━━━━━━━━━

視覺風格：
${autoStyle}

關鍵字：
${autoKeywords}

場景：
${autoScene}

氛圍：
${autoMood}

音樂：
${autoMusic}

Logo：
${autoLogo}

色系：
${autoColor}

比例：
${autoRatio}

━━━━━━━━━━━━━━━━━━━
【補充靈感】
━━━━━━━━━━━━━━━━━━━

${extra}

━━━━━━━━━━━━━━━━━━━
【重要規則】
━━━━━━━━━━━━━━━━━━━

請嚴格按照以下格式輸出。

每一個標籤都必須出現。
標籤名稱不可修改。
標籤順序不可改變。
不要新增其他標籤。
不要省略空白欄位。

━━━━━━━━━━━━━━━━━━━
【固定輸出格式】
━━━━━━━━━━━━━━━━━━━

【主標題】

【畫面文案】

【畫面描述】

【AI產圖提示詞】

【音樂氛圍】

【平台文案】

【Hashtag】

`;

}



// ========================================
// 短影音素材
// ========================================

else if(promptType === "SHORT_VIDEO_PROMPT"){

prompt = `

你是一位：

「幸福生態圈 AI 短影音導演」。

━━━━━━━━━━━━━━━━━━━
【主題宇宙】
━━━━━━━━━━━━━━━━━━━

${unit}

━━━━━━━━━━━━━━━━━━━
【系列】
━━━━━━━━━━━━━━━━━━━

${series}

━━━━━━━━━━━━━━━━━━━
【主題】
━━━━━━━━━━━━━━━━━━━

${topic}

━━━━━━━━━━━━━━━━━━━
【影片秒數】
━━━━━━━━━━━━━━━━━━━

${duration}秒

━━━━━━━━━━━━━━━━━━━
【系列預設風格】
━━━━━━━━━━━━━━━━━━━

視覺風格：
${autoStyle}

關鍵字：
${autoKeywords}

場景：
${autoScene}

氛圍：
${autoMood}

音樂：
${autoMusic}

Logo：
${autoLogo}

色系：
${autoColor}

比例：
${autoRatio}

━━━━━━━━━━━━━━━━━━━
【補充靈感】
━━━━━━━━━━━━━━━━━━━

${extra}

━━━━━━━━━━━━━━━━━━━
【重要規則】
━━━━━━━━━━━━━━━━━━━

請嚴格按照以下格式輸出。

每一個標籤都必須出現。
標籤名稱不可修改。
標籤順序不可改變。

━━━━━━━━━━━━━━━━━━━
【固定輸出格式】
━━━━━━━━━━━━━━━━━━━

【影片標題】

【分鏡流程】

【每張畫面描述】

【每張AI產圖提示詞】

【配音文案】

【字幕內容】

【音樂氛圍】

【平台文案】

【Hashtag】

`;

}



// ========================================
// 其它
// ========================================

else{

prompt = `

請為：

${series}

生成：

${topicCount}個相關內容。

`;

}



document.getElementById("output").innerText =
prompt;

}



// ========================================
// 複製 Prompt
// ========================================

function copyPrompt(){

const text =
document.getElementById("output").innerText;

navigator.clipboard.writeText(text);

alert("已複製 Prompt");

}



// ========================================
// 解析 AI 區塊
// ========================================

function parseSection(text,title){

const regex =
new RegExp(`【${title}】([\\s\\S]*?)(?=【|$)`);

const match =
text.match(regex);

return match ? match[1].trim() : "";

}



// ========================================
// 儲存內容
// ========================================

async function saveVisualContent(){

const aiText =
document.getElementById("aiResult").value ||
document.getElementById("output").innerText;

const body = {

action:"saveVisualContent",

unit:
document.getElementById("unit").value,

series_name:
document.getElementById("series").value,

topic_name:
document.getElementById("topic").value,

content_type:
document.getElementById("contentType").value,

content_title:
parseSection(aiText,"主標題") ||
parseSection(aiText,"影片標題") ||
document.getElementById("topic").value,

main_copy:
parseSection(aiText,"畫面文案"),

visual_style:"幸福感療癒繪本風",

layout_type:"POSTER",

image_prompt:
parseSection(aiText,"AI產圖提示詞") ||
parseSection(aiText,"每張AI產圖提示詞"),

output_ratio:
document.getElementById("ratio").value,

music_style:
parseSection(aiText,"音樂氛圍"),

platform_copy:
parseSection(aiText,"平台文案"),

hashtags:
parseSection(aiText,"Hashtag"),

voice_style:
parseSection(aiText,"配音文案"),

publish_group:
document.getElementById("unit").value + "全平台",

drive_link:
document.getElementById("driveLink").value,

priority:
document.getElementById("priority").value,

status:
document.getElementById("contentStatus").value,

notes:""

};



try{

const res = await fetch(GAS_URL,{

method:"POST",

body:JSON.stringify(body)

});

const data =
await res.json();

console.log(data);

alert("已儲存成功");

}catch(err){

console.error(err);

alert("儲存失敗");

}

}