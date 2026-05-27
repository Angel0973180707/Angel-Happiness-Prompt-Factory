// app.js 完整覆蓋版（含平台文案/Hashtag回存）

const GAS_URL =
"https://script.google.com/macros/s/AKfycbzGjQuix5THq44jWLmFWjuKsjes2crL6ys69mPQmXqng5nJBHlxCUHgSbsgxGepXcDgxg/exec";



// ========================================
// 初始化
// ========================================

window.onload = async function(){

  await loadSeries();

};



// ========================================
// 載入系列
// ========================================

async function loadSeries(){

  try{

    const res = await fetch(
      GAS_URL + "?action=getSeries"
    );

    const data = await res.json();

    const select =
      document.getElementById("series");

    select.innerHTML =
      '<option value="">請選擇系列</option>';

    if(data.data){

      data.data.forEach(item=>{

        const option =
          document.createElement("option");

        option.value =
          item.series_name;

        option.textContent =
          item.series_name;

        select.appendChild(option);

      });

    }

  }catch(err){

    console.error(err);

  }

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
【內容類型】
━━━━━━━━━━━━━━━━━━━

${contentType}

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
✓ 適合日系成人療癒繪本風

━━━━━━━━━━━━━━━━━━━
【請輸出】
━━━━━━━━━━━━━━━━━━━

1. 主題名稱
2. 一句畫面感描述

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
【內容類型】
━━━━━━━━━━━━━━━━━━━

${contentType}

━━━━━━━━━━━━━━━━━━━
【輸出比例】
━━━━━━━━━━━━━━━━━━━

${ratio}

━━━━━━━━━━━━━━━━━━━
【補充靈感】
━━━━━━━━━━━━━━━━━━━

${extra}

━━━━━━━━━━━━━━━━━━━
【畫面風格】
━━━━━━━━━━━━━━━━━━━

✓ 日系成人療癒繪本風
✓ 米白暖色系
✓ 幸福感
✓ 柔和暖光
✓ 慢生活
✓ 小太陽logo
✓ 手寫感字體
✓ 留白感
✓ 高質感插畫

━━━━━━━━━━━━━━━━━━━
【請固定格式輸出】
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
【輸出比例】
━━━━━━━━━━━━━━━━━━━

${ratio}

━━━━━━━━━━━━━━━━━━━
【補充靈感】
━━━━━━━━━━━━━━━━━━━

${extra}

━━━━━━━━━━━━━━━━━━━
【請固定格式輸出】
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

document.getElementById("output").innerText = prompt;

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
// 解析 AI 輸出
// ========================================

function parseSection(text,title){

const regex =
new RegExp(`【${title}】([\\s\\S]*?)(?=【|$)`);

const match = text.match(regex);

return match ? match[1].trim() : "";

}



// ========================================
// 儲存視覺內容
// ========================================

async function saveVisualContent(){

const unit =
document.getElementById("unit").value;

const series =
document.getElementById("series").value;

const topic =
document.getElementById("topic").value;

const contentType =
document.getElementById("contentType").value;

const output =
document.getElementById("output").innerText;

const driveLink =
document.getElementById("driveLink").value;

const priority =
document.getElementById("priority").value;

const contentStatus =
document.getElementById("contentStatus").value;


// ========================================
// 自動解析
// ========================================

const title =
parseSection(output,"主標題");

const mainCopy =
parseSection(output,"畫面文案");

const imagePrompt =
parseSection(output,"AI產圖提示詞");

const musicStyle =
parseSection(output,"音樂氛圍");

const platformCopy =
parseSection(output,"平台文案");

const hashtags =
parseSection(output,"Hashtag");


// ========================================
// 回存
// ========================================

const body = {

action:"saveVisualContent",

unit:unit,

series_name:series,

topic_name:topic,

content_type:contentType,

content_title:title || topic,

main_copy:mainCopy,

visual_style:"幸福感療癒繪本風",

layout_type:"POSTER",

image_prompt:imagePrompt,

output_ratio:
document.getElementById("ratio").value,

music_style:musicStyle,

platform_copy:platformCopy,

hashtags:hashtags,

voice_style:"",

publish_group:
unit + "全平台",

drive_link:driveLink,

priority:priority,

status:contentStatus,

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