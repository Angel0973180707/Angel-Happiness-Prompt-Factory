const GAS_URL =
"https://script.google.com/macros/s/AKfycbzGjQuix5THq44jWLmFWjuKsjes2crL6ys69mPQmXqng5nJBHlxCUHgSbsgxGepXcDgxg/exec";

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

請先生成：

${topicCount}個適合此系列長期經營的主題。

主題必須：

✓ 有幸福感
✓ 有生活感
✓ 有情緒畫面
✓ 適合日更
✓ 適合 IG／Shorts／TikTok／FB／小紅書
✓ 適合日系成人療癒繪本風

━━━━━━━━━━━━━━━━━━━
【輸出格式】
━━━━━━━━━━━━━━━━━━━

1. 主題名稱
2. 一句畫面感描述

不要生成圖片。

只生成主題。

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
【請輸出】
━━━━━━━━━━━━━━━━━━━

1. 主標題
2. 畫面文案
3. 畫面描述
4. AI產圖提示詞
5. 音樂氛圍
6. IG／TikTok／Shorts／小紅書文案
7. Hashtag

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
【畫面風格】
━━━━━━━━━━━━━━━━━━━

✓ 日系成人療癒
✓ 慢生活
✓ 溫暖幸福感
✓ 柔和暖光
✓ 小太陽logo

━━━━━━━━━━━━━━━━━━━
【請輸出】
━━━━━━━━━━━━━━━━━━━

1. 分鏡流程
2. 每張畫面描述
3. 每張 AI產圖提示詞
4. 配音文案
5. 字幕內容
6. 音樂氛圍
7. 平台文案
8. Hashtag

`;

}


// ========================================
// 系列擴充
// ========================================

else if(promptType === "SERIES_EXPANSION"){

prompt = `

請為：

${unit}

生成：

${topicCount}個適合長期經營的新系列。

每個系列需包含：

1. 系列名稱
2. 系列定位
3. 內容方向
4. 視覺風格

`;

}


// ========================================
// 主題生成
// ========================================

else if(promptType === "TOPIC_GENERATION"){

prompt = `

請為：

${series}

生成：

${topicCount}個可長期經營主題。

每個主題需包含：

1. 主題名稱
2. 畫面感描述
3. 情緒方向

`;

}


// ========================================
// 平台文案
// ========================================

else if(promptType === "PLATFORM_COPY"){

prompt = `

請為以下內容：

主題：
${topic}

生成：

IG
TikTok
Shorts
FB
小紅書

五平台文案。

包含：

1. 標題
2. 文案
3. Hashtag
4. CTA

`;

}


// ========================================
// 回填指令
// ========================================

else{

prompt = `

請將以下內容：

主題：
${topic}

整理成：

Google Sheets TSV 格式。

`;

}

document.getElementById("output").innerText = prompt;

}



function copyPrompt(){

const text =
document.getElementById("output").innerText;

navigator.clipboard.writeText(text);

alert("已複製 Prompt");

}



async function saveVisualContent(){

const unit =
document.getElementById("unit").value;

const series =
document.getElementById("series").value;

const topic =
document.getElementById("topic").value;

const contentType =
document.getElementById("contentType").value;

const prompt =
document.getElementById("output").innerText;

const driveLink =
document.getElementById("driveLink").value;

const body = {

action:"saveVisualContent",

unit:unit,

series_name:series,

topic_name:topic,

content_type:contentType,

content_title:topic,

main_copy:"",

visual_style:"幸福感療癒繪本風",

layout_type:"POSTER",

image_prompt:prompt,

output_ratio:
document.getElementById("ratio").value,

music_style:"溫暖療癒",

voice_style:"",

publish_group:
unit + "全平台",

drive_link:driveLink,

priority:"P3｜一般內容",

status:"已產圖",

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