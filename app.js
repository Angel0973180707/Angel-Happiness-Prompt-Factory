const GAS_URL = "你的GAS網址";

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

  let prompt = `
你是一位「幸福生態圈 AI 視覺內容導演」。

【主題宇宙】
${unit}

【系列】
${series}

【主題】
${topic}

【內容類型】
${contentType}

【指令分類】
${promptType}

【輸出比例】
${ratio}

【短影音秒數】
${duration}秒

【補充靈感】
${extra}

請生成：

適合 IG、Shorts、TikTok、小紅書、FB 的幸福感內容。

風格：

✓ 日系成人療癒
✓ 米白暖色系
✓ 繪本風
✓ 留白感
✓ 幸福感
✓ 小太陽logo
✓ 可直接搭配音樂做短影音

請輸出：

1. 主標題
2. 畫面文案
3. AI產圖提示詞
4. 音樂氛圍
5. 平台文案
6. Hashtag
`;

  document.getElementById("output")
    .innerText = prompt;

}

function copyPrompt(){

  const text =
    document.getElementById("output")
      .innerText;

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
    document.getElementById("output")
      .innerText;

  const driveLink =
    document.getElementById("driveLink")
      .value;

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

    status:"已產圖",

    notes:""

  };

  try{

    const res = await fetch(GAS_URL,{
      method:"POST",
      body:JSON.stringify(body)
    });

    const data = await res.json();

    alert("已儲存成功");

    console.log(data);

  }catch(err){

    console.error(err);

    alert("儲存失敗");

  }

}
