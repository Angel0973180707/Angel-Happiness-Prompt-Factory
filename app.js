// ========================================
// 幸福生態圈 AI OS v4.5
// Story Driven Engine
// app.js 完整覆蓋版
// ========================================

const CONFIG = {
  GAS_URL: "https://script.google.com/macros/s/AKfycbzGjQuix5THq44jWLmFWjuKsjes2crL6ys69mPQmXqng5nJBHlxCUHgSbsgxGepXcDgxg/exec"
};
// ========================================
// DOM
// ========================================

const storySelect = document.getElementById("storySelect");
const generateAllBtn = document.getElementById("generateAllBtn");
const output = document.getElementById("output");

// ========================================
// INIT
// ========================================

window.addEventListener("DOMContentLoaded", async () => {
  await loadStories();
});

// ========================================
// 讀取故事庫
// ========================================

async function loadStories() {

  try {

    const url =
      `${CONFIG.GAS_URL}?action=getStories`;

    const res = await fetch(url);

    const json = await res.json();

    const stories = json.data || [];

    storySelect.innerHTML =
      `<option value="">請選擇故事</option>`;

    stories.forEach(story => {

      const opt = document.createElement("option");

      opt.value = JSON.stringify(story);

      opt.textContent =
        `${story.id}｜${story.title}`;

      storySelect.appendChild(opt);

    });

  } catch (err) {

    console.error(err);

    alert("故事讀取失敗");

  }

}

// ========================================
// 生成全部
// ========================================

generateAllBtn.addEventListener("click", async () => {

  if (!storySelect.value) {

    alert("請先選擇故事");

    return;

  }

  const story = JSON.parse(storySelect.value);

  output.innerHTML = "AI 正在生成內容宇宙...";

  // ====================================
  // 長影片
  // ====================================

  const longVideo =
    generateLongVideo(story);

  // ====================================
  // Shorts
  // ====================================

  const shorts =
    generateShorts(story);

  // ====================================
  // 圖文
  // ====================================

  const visuals =
    generateVisuals(story);

  // ====================================
  // 寫入 Sheets
  // ====================================

  await writeLongVideo(longVideo);

  for (const s of shorts) {

    await writeShort(s);

  }

  for (const v of visuals) {

    await writeVisual(v);

  }

  output.innerHTML =
    `
    ✅ 已完成生成

    長影片：1支
    Shorts：${shorts.length}支
    圖文：${visuals.length}篇
    `;

});

// ========================================
// 生成長影片
// ========================================

function generateLongVideo(story) {

  const now = Date.now();

  return {

    video_id:
      `HL-L-${now}`,

    unit:
      "幸福教養",

    series_name:
      "幸福教養",

    topic_name:
      story.title,

    video_title:
      `${story.title}｜幸福教養人生故事`,

    video_type:
      "LONG_VIDEO",

    core_emotion:
      story.emotion_type || "溫暖療癒",

    core_hook:
      story.core_hook || story.parenting_quote,

    story_source:
      story.title,

    story_summary:
      story.summary,

    pain_point:
      story.summary,

    awakening_point:
      story.parenting_quote,

    transformation_point:
      story.psychology,

    core_realization:
      story.parenting_quote,

    opening_hook:
      story.parenting_quote,

    opening_script:
      story.summary,

    chapter_01_title:
      "故事現場",

    chapter_01_script:
      story.content,

    chapter_02_title:
      "心理學理解",

    chapter_02_script:
      story.psychology,

    chapter_03_title:
      "腦神經科學",

    chapter_03_script:
      story.brain_science,

    ending_script:
      "真正的幸福，不是控制，而是理解。",

    emotion_flow:
      "衝突→理解→放鬆→轉化",

    scene_flow:
      "故事→情緒→理解→療癒",

    camera_language:
      "cinematic documentary",

    music_flow:
      "piano healing",

    visual_style:
      "日系療癒電影感",

    video_prompt:
      `${story.title} cinematic healing parenting film`,

    shorts_derivative_count:
      6,

    estimated_shorts_hooks:
      "情緒共鳴,人生感悟,教養理解",

    target_platform:
      "YouTube",

    video_duration:
      "8-12分鐘",

    content_density:
      "高",

    reuse_potential:
      "高",

    status:
      "draft",

    notes:
      ""

  };

}

// ========================================
// 生成 Shorts
// ========================================

function generateShorts(story) {

  const arr = [];

  for (let i = 1; i <= 6; i++) {

    arr.push({

      short_id:
        `HL-S-${Date.now()}-${i}`,

      unit:
        "幸福教養",

      series_name:
        "幸福教養",

      topic_name:
        story.title,

      short_title:
        `${story.title}｜Shorts ${i}`,

      opening_script:
        story.parenting_quote,

      main_script:
        story.summary,

      ending_script:
        "更多完整故事，歡迎到 YouTube 長影片。",

      emotion_trigger:
        story.emotion_type,

      platform_focus:
        "IG / TikTok / YouTube Shorts",

      status:
        "draft"

    });

  }

  return arr;

}

// ========================================
// 生成圖文
// ========================================

function generateVisuals(story) {

  const arr = [];

  for (let i = 1; i <= 3; i++) {

    arr.push({

      content_id:
        `HL-C-${Date.now()}-${i}`,

      unit:
        "幸福旅居",

      series_name:
        "人生感悟",

      topic_name:
        story.title,

      content_type:
        "POSTER_SINGLE",

      content_title:
        story.title,

      main_copy:
        story.parenting_quote,

      visual_style:
        "日系成人療癒繪本風",

      output_ratio:
        "1:1",

      emotion_trigger:
        story.emotion_type,

      target_platform:
        "IG / FB / 小紅書",

      status:
        "draft"

    });

  }

  return arr;

}

// ========================================
// 寫入長影片
// ========================================

async function writeLongVideo(data) {

  await fetch(CONFIG.GAS_URL, {

    method: "POST",

    body: JSON.stringify({

      action: "writeLongVideo",

      data

    })

  });

}

// ========================================
// 寫入Shorts
// ========================================

async function writeShort(data) {

  await fetch(CONFIG.GAS_URL, {

    method: "POST",

    body: JSON.stringify({

      action: "writeShort",

      data

    })

  });

}

// ========================================
// 寫入圖文
// ========================================

async function writeVisual(data) {

  await fetch(CONFIG.GAS_URL, {

    method: "POST",

    body: JSON.stringify({

      action: "writeVisual",

      data

    })

  });

}