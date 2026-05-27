// ========================================
// 幸福生態圈 AI OS v4.5
// Story Driven Engine
// app.js 完整覆蓋版
// ========================================

const DEFAULT_GAS_URL =
"https://script.google.com/macros/s/AKfycbzGjQuix5THq44jWLmFWjuKsjes2crL6ys69mPQmXqng5nJBHlxCUHgSbsgxGepXcDgxg/exec";

const CONFIG = {
  GAS_URL:
    localStorage.getItem("GAS_URL")
    || DEFAULT_GAS_URL
};

const storySelect = document.getElementById("storySelect");
const generateAllBtn = document.getElementById("generateAllBtn");
const output = document.getElementById("output");

const gasUrlInput = document.getElementById("gasUrl");
const saveConfigBtn = document.getElementById("saveConfigBtn");
const testBtn = document.getElementById("testBtn");
const loadSeriesBtn = document.getElementById("loadSeriesBtn");
const statusText = document.getElementById("statusText");

window.addEventListener("DOMContentLoaded", async () => {
  if (gasUrlInput) gasUrlInput.value = CONFIG.GAS_URL;

  if (saveConfigBtn) {
    saveConfigBtn.addEventListener("click", () => {
      localStorage.setItem("GAS_URL", gasUrlInput.value.trim());
      statusText.textContent = "設定已儲存";
    });
  }

  if (testBtn) {
    testBtn.addEventListener("click", testConnection);
  }

  if (loadSeriesBtn) {
    loadSeriesBtn.addEventListener("click", loadStories);
  }

  if (generateAllBtn) {
    generateAllBtn.addEventListener("click", generateAll);
  }
});

async function testConnection() {
  try {
    const url = getGasUrl();
    const res = await fetch(`${url}?action=ping`);
    const json = await res.json();

    statusText.textContent = json.ok
      ? json.message
      : "連線失敗";
  } catch (err) {
    statusText.textContent = "連線失敗：" + err.message;
  }
}

function getGasUrl() {
  return gasUrlInput.value.trim()
    || localStorage.getItem("GAS_URL")
    || DEFAULT_GAS_URL;
}

async function loadStories() {
  try {
    const url = `${getGasUrl()}?action=getStories`;
    const res = await fetch(url);
    const json = await res.json();

    if (!json.ok) {
      throw new Error(json.message || "故事讀取失敗");
    }

    const stories = json.data || [];

    storySelect.innerHTML = `<option value="">請選擇故事</option>`;

    stories.forEach((story) => {
      const opt = document.createElement("option");
      opt.value = encodeURIComponent(JSON.stringify(story));
      opt.textContent = `${story.id || ""}｜${story.title || "未命名故事"}`;
      storySelect.appendChild(opt);
    });

    statusText.textContent = `已讀取 ${stories.length} 筆故事`;
  } catch (err) {
    statusText.textContent = "故事讀取失敗：" + err.message;
  }
}

async function generateAll() {
  if (!storySelect.value) {
    alert("請先選擇故事");
    return;
  }

  const story = JSON.parse(decodeURIComponent(storySelect.value));

  output.innerHTML = "AI 正在生成內容宇宙...";

  const longVideo = generateLongVideo(story);
  const shorts = generateShorts(story);
  const visuals = generateVisuals(story);

  try {
    await writeLongVideo(longVideo);

    for (const s of shorts) {
      await writeShort(s);
    }

    for (const v of visuals) {
      await writeVisual(v);
    }

    output.innerHTML = `
      <div class="result-card">
        <div class="item">
          <b>已完成生成</b>
          <pre>長影片：1 支
Shorts：${shorts.length} 支
圖文：${visuals.length} 篇

已寫入：
07_long_video_library
04_short_video_library
03_visual_content_library</pre>
        </div>

        <div class="item">
          <b>長影片標題</b>
          <pre>${escapeHtml(longVideo.video_title)}</pre>
        </div>

        <div class="item">
          <b>核心 Hook</b>
          <pre>${escapeHtml(longVideo.core_hook)}</pre>
        </div>
      </div>
    `;

    statusText.textContent = "內容宇宙已寫入完成";
  } catch (err) {
    output.innerHTML = "寫入失敗：" + err.message;
    statusText.textContent = "寫入失敗";
  }
}

function generateLongVideo(story) {
  const now = Date.now();

  return {
    video_id: `HJ-L-${now}`,
    unit: "幸福教養",
    series_name: "幸福教養",
    topic_name: story.title || "",
    video_title: `${story.title || "教養故事"}｜幸福教養長影片`,
    video_type: "LONG_VIDEO",
    core_emotion: story.emotion_type || "溫暖療癒",
    core_hook: story.core_hook || story.parenting_quote || story.summary || "",
    story_source: story.title || "",
    story_summary: story.summary || "",
    pain_point: story.summary || "",
    awakening_point: story.parenting_quote || "",
    transformation_point: story.psychology || "",
    core_realization: story.parenting_quote || "",
    opening_hook: story.parenting_quote || story.summary || "",
    opening_script: story.summary || "",
    chapter_01_title: "故事現場",
    chapter_01_script: story.content || story.summary || "",
    chapter_02_title: "心理學理解",
    chapter_02_script: story.psychology || "",
    chapter_03_title: "腦神經科學",
    chapter_03_script: story.brain_science || "",
    ending_script: "真正的幸福教養，不是控制孩子，而是先安住大人的心。",
    emotion_flow: "衝突 → 理解 → 安定 → 轉化",
    scene_flow: "故事現場 → 情緒理解 → 腦科學解析 → 幸福轉化",
    camera_language: "cinematic documentary, warm close-up, slow pan",
    music_flow: "溫柔鋼琴 → 暖光弦樂 → 安定尾奏",
    visual_style: "溫暖療癒紀錄片風",
    video_prompt: `${story.title || ""} cinematic healing parenting documentary, warm storytelling, emotional transformation`,
    shorts_derivative_count: 6,
    estimated_shorts_hooks: "情緒共鳴｜教養現場｜腦科學解析｜心理轉化｜幸福金句｜導流長片",
    target_platform: "YouTube",
    video_duration: "8-12分鐘",
    content_density: "高",
    reuse_potential: "高",
    status: "draft",
    notes: "由 00_story_library 自動生成"
  };
}

function generateShorts(story) {
  const now = Date.now();

  const hooks = [
    story.parenting_quote || "孩子不是故意鬧，有時只是還不知道怎麼表達。",
    story.brain_science || "情緒高漲時，大腦會先進入防衛模式。",
    story.psychology || "真正的陪伴，是先理解情緒背後的需要。",
    story.summary || "一個教養現場，藏著大人和孩子共同成長的入口。",
    "大人先穩住，孩子才有機會慢慢回來。",
    "完整故事，請看 YouTube 長影片。"
  ];

  return hooks.map((hook, i) => ({
    short_id: `HJ-S-${now}-${i + 1}`,
    unit: "幸福教養",
    series_name: "幸福教養",
    topic_name: story.title || "",
    short_title: `${story.title || "教養故事"}｜Shorts ${i + 1}`,
    hook_type: i === 5 ? "導流型" : "情緒共鳴型",
    emotion_trigger: story.emotion_type || "被理解感",
    visual_style: "親子療癒繪本風",
    opening_script: hook,
    main_script: story.summary || "",
    ending_script: i === 5
      ? "完整故事，歡迎到 YouTube 長影片。"
      : "大人先穩住，關係才會有空間。",
    bgm_style: "溫暖鋼琴 Lo-fi",
    cta_style: i === 5 ? "導流 YouTube 長影片" : "柔性陪伴型",
    shorts_cover_text: makeShortCover(story, i),
    shorts_hook_text: hook,
    video_prompt: `${story.title || ""}, warm parenting short video, healing family moment, emotional storytelling`,
    platform_focus: "IG / TikTok / YouTube Shorts",
    output_ratio: "9:16",
    status: "draft",
    notes: "由長影片拆分"
  }));
}

function generateVisuals(story) {
  const now = Date.now();

  const copies = [
    story.parenting_quote || story.summary || "",
    story.brain_science || story.summary || "",
    story.psychology || story.summary || ""
  ];

  return copies.map((copy, i) => ({
    content_id: `HJ-C-${now}-${i + 1}`,
    unit: "幸福教養",
    series_name: "情緒教養",
    topic_name: story.title || "",
    content_type: "POSTER_SINGLE",
    content_title: makeVisualTitle(story, i),
    main_copy: copy,
    visual_style: "親子療癒繪本風",
    layout_type: "POSTER",
    image_prompt: "親子療癒繪本風，溫暖家庭場景，柔和光線",
    output_ratio: "1:1",
    music_style: "溫暖輕音樂",
    platform_copy: `${makeVisualTitle(story, i)}\n\n${copy}\n\n#幸福教養`,
    hashtags: "#幸福教養 #情緒教養 #親子關係 #腦神經科學 #心理學 #幸福生態圈",
    theme_emotion: story.emotion_type || "安心陪伴",
    scene_setting: "溫暖家庭互動場景，親子靠近但保有空間",
    character_setting: "一位溫柔大人與孩子，自然互動",
    character_action: "大人蹲下傾聽孩子，孩子慢慢安定",
    lighting_style: "柔和暖黃光，家庭安全感",
    color_palette: "米白、暖黃、木質色",
    composition_style: "留白式海報構圖，文字可置入",
    texture_style: "水彩＋色鉛筆混合媒材",
    brand_elements: "簡約小太陽logo自然融入角落",
    quality_keywords: "premium healing illustration, warm family storytelling, soft cinematic light",
    negative_prompt: "avoid cheap AI look, avoid distorted hands, avoid messy background",
    final_prompt: "warm parenting healing illustration, adult and child in a calm family scene, soft cinematic light, watercolor texture, emotional storytelling, premium composition",
    shorts_cover_text: makeShortCover(story, i),
    shorts_hook_text: copy,
    emotion_trigger: story.emotion_type || "被理解感",
    content_energy_level: "中能量溫暖",
    visual_focus_point: "大人蹲下傾聽孩子的瞬間",
    scroll_stopping_element: "溫暖親子對視＋情緒文字",
    target_platform: "IG / Facebook / 小紅書",
    reuse_potential: "高",
    image_count: 3,
    image_type: "poster + cinematic still",
    image_variation_mode: "emotional_variation",
    shorts_split_count: 2,
    reusable_asset_level: "高",
    status: "draft",
    notes: "由故事拆圖文"
  }));
}

function makeShortCover(story, i) {
  const arr = [
    "孩子不是故意鬧",
    "情緒背後有需要",
    "大人先穩住",
    "理解，比控制更有力量",
    "教養，是一起成長",
    "完整故事看長影片"
  ];
  return arr[i] || story.title || "幸福教養";
}

function makeVisualTitle(story, i) {
  const arr = [
    `${story.title || "教養故事"}｜教養金句`,
    `${story.title || "教養故事"}｜腦科學理解`,
    `${story.title || "教養故事"}｜心理學轉化`
  ];
  return arr[i];
}

async function writeLongVideo(data) {
  await postData("writeLongVideo", data);
}

async function writeShort(data) {
  await postData("writeShort", data);
}

async function writeVisual(data) {
  await postData("writeVisual", data);
}

async function postData(action, data) {
  const res = await fetch(getGasUrl(), {
    method: "POST",
    body: JSON.stringify({
      action,
      data
    })
  });

  const json = await res.json();

  if (!json.ok) {
    throw new Error(json.message || "寫入失敗");
  }

  return json;
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (s) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[s]));
}