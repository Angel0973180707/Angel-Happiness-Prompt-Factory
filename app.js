// ========================================
// 幸福生態圈 AI OS v5.2
// 雙模式 + AI 協作指令包
// ========================================

const DEFAULT_GAS_URL =
"https://script.google.com/macros/s/AKfycbzGjQuix5THq44jWLmFWjuKsjes2crL6ys69mPQmXqng5nJBHlxCUHgSbsgxGepXcDgxg/exec";

const CONFIG = {
  GAS_URL: localStorage.getItem("GAS_URL") || DEFAULT_GAS_URL
};

let currentMode = "universe";

const els = {
  gasUrl: document.getElementById("gasUrl"),
  saveConfigBtn: document.getElementById("saveConfigBtn"),
  testBtn: document.getElementById("testBtn"),
  loadDataBtn: document.getElementById("loadDataBtn"),
  statusText: document.getElementById("statusText"),

  modeUniverseBtn: document.getElementById("modeUniverseBtn"),
  modeStoryBtn: document.getElementById("modeStoryBtn"),
  universePanel: document.getElementById("universePanel"),
  storyPanel: document.getElementById("storyPanel"),

  seriesSelect: document.getElementById("seriesSelect"),
  inspirationInput: document.getElementById("inspirationInput"),
  generateUniverseBtn: document.getElementById("generateUniverseBtn"),

  storySelect: document.getElementById("storySelect"),
  generateStoryBtn: document.getElementById("generateStoryBtn"),

  output: document.getElementById("output"),
  promptOutput: document.getElementById("promptOutput"),
  contentAnalysisBox: document.getElementById("contentAnalysisBox")
};

window.addEventListener("DOMContentLoaded", () => {
  if (els.gasUrl) els.gasUrl.value = CONFIG.GAS_URL;

  els.saveConfigBtn?.addEventListener("click", saveConfig);
  els.testBtn?.addEventListener("click", testConnection);
  els.loadDataBtn?.addEventListener("click", loadAllData);

  els.modeUniverseBtn?.addEventListener("click", () => setMode("universe"));
  els.modeStoryBtn?.addEventListener("click", () => setMode("story"));

  els.generateUniverseBtn?.addEventListener("click", generateUniverseMode);
  els.generateStoryBtn?.addEventListener("click", generateStoryMode);

  setMode("universe");
});

function saveConfig() {
  localStorage.setItem("GAS_URL", getGasUrl());
  setStatus("設定已儲存");
}

function getGasUrl() {
  return els.gasUrl?.value?.trim()
    || localStorage.getItem("GAS_URL")
    || DEFAULT_GAS_URL;
}

function setStatus(text) {
  if (els.statusText) els.statusText.textContent = text;
}

function setMode(mode) {
  currentMode = mode;

  els.modeUniverseBtn?.classList.toggle("active", mode === "universe");
  els.modeStoryBtn?.classList.toggle("active", mode === "story");

  els.universePanel?.classList.toggle("hidden", mode !== "universe");
  els.storyPanel?.classList.toggle("hidden", mode !== "story");

  clearOutputs();
}

function clearOutputs() {
  if (els.output) els.output.innerHTML = "尚未生成內容";
  if (els.promptOutput) els.promptOutput.innerHTML = "生成後會出現可複製的 AI 協作指令。";
  if (els.contentAnalysisBox) els.contentAnalysisBox.innerHTML = "故事模式生成後會自動分析內容品質。";
}

async function testConnection() {
  try {
    const res = await fetch(`${getGasUrl()}?action=ping`);
    const json = await res.json();
    setStatus(json.ok ? json.message : "連線失敗");
  } catch (err) {
    setStatus("連線失敗：" + err.message);
  }
}

async function loadAllData() {
  await Promise.allSettled([
    loadSeries(),
    loadStories()
  ]);
}

async function loadSeries() {
  try {
    const res = await fetch(`${getGasUrl()}?action=getSeries`);
    const json = await res.json();

    if (!json.ok) throw new Error(json.message || "系列讀取失敗");

    const rows = json.rows || json.data || [];

    els.seriesSelect.innerHTML = `<option value="">請選擇系列宇宙</option>`;

    rows.forEach(row => {
      const opt = document.createElement("option");
      opt.value = encodeURIComponent(JSON.stringify(row));
      opt.textContent = `${row.series_name || row.name || row.title || "未命名系列"}`;
      els.seriesSelect.appendChild(opt);
    });

    setStatus(`已讀取系列 ${rows.length} 筆`);
  } catch (err) {
    setStatus("系列讀取失敗：" + err.message);
  }
}

async function loadStories() {
  try {
    const res = await fetch(`${getGasUrl()}?action=getStories`);
    const json = await res.json();

    if (!json.ok) throw new Error(json.message || "故事讀取失敗");

    const stories = json.data || [];

    els.storySelect.innerHTML = `<option value="">請選擇故事</option>`;

    stories.forEach(story => {
      const opt = document.createElement("option");
      opt.value = encodeURIComponent(JSON.stringify(story));
      opt.textContent = `${story.id || story.story_id || ""}｜${story.title || story.story_title || "未命名故事"}`;
      els.storySelect.appendChild(opt);
    });

    setStatus(`已讀取故事 ${stories.length} 筆`);
  } catch (err) {
    setStatus("故事讀取失敗：" + err.message);
  }
}

/* =========================
   模式一：宇宙靈感模式
========================= */

async function generateUniverseMode() {
  if (!els.seriesSelect.value) {
    alert("請先選擇系列宇宙");
    return;
  }

  const inspiration = els.inspirationInput.value.trim();
  if (!inspiration) {
    alert("請先輸入靈感或主題");
    return;
  }

  const series = JSON.parse(decodeURIComponent(els.seriesSelect.value));
  const pack = buildUniversePack(series, inspiration);

  els.output.innerHTML = renderUniverseResult(pack);
  els.promptOutput.innerHTML = renderPromptCards(buildUniversePromptPack(pack));
  els.contentAnalysisBox.innerHTML = "宇宙靈感模式主要產生 AI 協作指令，不執行內容品質分析。";

  try {
    for (const v of pack.visuals) await writeVisual(v);
    for (const s of pack.shorts) await writeShort(s);
    setStatus("宇宙靈感內容已寫入，AI 協作指令包已生成");
  } catch (err) {
    setStatus("已生成指令包，但寫入失敗：" + err.message);
  }
}

function buildUniversePack(series, inspiration) {
  const now = Date.now();
  const persona = getSeriesPersona(series);
  const seriesName = persona.seriesName;

  const visuals = [1, 2, 3].map(i => ({
    content_id: `UNI-C-${now}-${i}`,
    unit: seriesName,
    series_name: seriesName,
    topic_name: inspiration,
    content_type: "POSTER_SINGLE",
    content_title: `${seriesName}｜${makeUniverseTitle(inspiration, i)}`,
    main_copy: makeUniverseCopy(inspiration, persona, i),
    visual_style: persona.visualStyle,
    layout_type: "POSTER",
    image_prompt: makeImagePrompt(seriesName, inspiration, persona, i),
    output_ratio: "1:1",
    music_style: persona.musicStyle,
    platform_copy: `${makeUniverseCopy(inspiration, persona, i)}\n\n${persona.hashtags}`,
    hashtags: persona.hashtags,
    theme_emotion: persona.emotion,
    scene_setting: persona.scene,
    character_setting: persona.character,
    character_action: persona.action,
    lighting_style: persona.lighting,
    color_palette: persona.colors,
    composition_style: "留白式海報構圖，文字可置入",
    texture_style: persona.texture,
    brand_elements: "簡約小太陽 logo 自然融入角落",
    quality_keywords: persona.quality,
    negative_prompt: "avoid cheap AI look, avoid distorted hands, avoid messy background, avoid overexposed face",
    final_prompt: makeImagePrompt(seriesName, inspiration, persona, i),
    shorts_cover_text: makeUniverseTitle(inspiration, i),
    shorts_hook_text: makeHook(inspiration, i),
    emotion_trigger: persona.emotion,
    content_energy_level: persona.energy,
    visual_focus_point: persona.focus,
    scroll_stopping_element: "溫暖畫面＋一句讓人停下來的文字",
    target_platform: "IG / Facebook / 小紅書 / Threads",
    reuse_potential: "高",
    image_count: 3,
    image_type: "poster + cinematic still",
    image_variation_mode: "series_universe_variation",
    shorts_split_count: 2,
    reusable_asset_level: "高",
    status: "draft",
    notes: "由宇宙靈感模式自動生成"
  }));

  const shorts = [1, 2, 3, 4, 5, 6].map(i => ({
    short_id: `UNI-S-${now}-${i}`,
    unit: seriesName,
    series_name: seriesName,
    topic_name: inspiration,
    short_title: `${seriesName}｜${makeUniverseTitle(inspiration, i)}`,
    hook_type: i === 6 ? "導流型" : "情緒共鳴型",
    emotion_trigger: persona.emotion,
    visual_style: persona.visualStyle,
    opening_script: makeHook(inspiration, i),
    main_script: makeShortMain(inspiration, persona, i),
    ending_script: i === 6 ? persona.cta : "願你在今天，也感受到一點點幸福。",
    bgm_style: persona.musicStyle,
    cta_style: i === 6 ? "導流型" : "柔性陪伴型",
    shorts_cover_text: makeUniverseTitle(inspiration, i),
    shorts_hook_text: makeHook(inspiration, i),
    video_prompt: `${persona.visualStyle}, ${inspiration}, warm short video, emotional storytelling`,
    platform_focus: "IG / TikTok / YouTube Shorts / 小紅書",
    output_ratio: "9:16",
    status: "draft",
    notes: "由宇宙靈感模式生成"
  }));

  return { series, persona, inspiration, visuals, shorts };
}

/* =========================
   模式二：故事長影片模式
========================= */

async function generateStoryMode() {
  if (!els.storySelect.value) {
    alert("請先選擇故事");
    return;
  }

  const story = JSON.parse(decodeURIComponent(els.storySelect.value));

  els.output.innerHTML = "AI 正在生成故事內容宇宙...";

  const longVideo = generateLongVideo(story);
  const shorts = generateShorts(story);
  const visuals = generateVisuals(story);
  const pack = { story, longVideo, shorts, visuals };

  try {
    await writeLongVideo(longVideo);
    for (const s of shorts) await writeShort(s);
    for (const v of visuals) await writeVisual(v);

    els.output.innerHTML = renderStoryResult(pack);
    els.promptOutput.innerHTML = renderPromptCards(buildStoryPromptPack(pack));

    const textForAnalysis = [
      longVideo.video_title,
      longVideo.core_hook,
      longVideo.opening_script,
      longVideo.chapter_01_script,
      longVideo.chapter_02_script,
      longVideo.chapter_03_script,
      longVideo.ending_script
    ].filter(Boolean).join("\n\n");

    const analysisRes = await analyzeContent(textForAnalysis);

    if (analysisRes.ok) {
      renderAnalysis(analysisRes.data);
      setStatus("故事內容宇宙已寫入，AI 協作指令包與內容分析已完成");
    } else {
      renderAnalysisError(analysisRes.message || "內容品質分析失敗");
      setStatus("內容已寫入，但品質分析失敗");
    }
  } catch (err) {
    els.output.innerHTML = "寫入失敗：" + err.message;
    setStatus("寫入失敗");
  }
}

/* =========================
   AI 協作指令包
========================= */

function buildUniversePromptPack(pack) {
  const firstVisual = pack.visuals[0];
  const firstShort = pack.shorts[0];

  return [
    {
      title: "AI 產圖指令｜ChatGPT / Gemini / Canva AI",
      text: `你是一位「幸福生態圈 AI 視覺內容導演」。

請根據以下資料，生成一張高質感圖文圖片。

【系列宇宙】
${pack.persona.seriesName}

【主題靈感】
${pack.inspiration}

【視覺風格】
${pack.persona.visualStyle}

【圖片主標題】
${firstVisual.content_title}

【畫面文案】
${firstVisual.main_copy}

【畫面描述】
${firstVisual.scene_setting}
${firstVisual.character_setting}
${firstVisual.character_action}

【AI 產圖提示詞】
${firstVisual.final_prompt}

【負面提示詞】
${firstVisual.negative_prompt}

【比例】
1:1

【品牌元素】
簡約小太陽 logo，自然放在角落，不要翅膀。`
    },
    {
      title: "AI 文案指令｜Claude / ChatGPT",
      text: `你是一位「幸福生態圈內容編輯」。

請根據以下系列與靈感，寫出一篇溫暖、有共鳴、沒有作文感的社群貼文。

【系列】
${pack.persona.seriesName}

【靈感】
${pack.inspiration}

【語氣】
${pack.persona.tone}

【要求】
1. 開頭要有 Hook，不要用「隨著時代」這種作文感開頭。
2. 使用真人會說的語言。
3. 加入生活畫面。
4. 結尾帶出幸福感。
5. 加入 5 組 Hashtag。

【參考文案】
${firstVisual.platform_copy}`
    },
    {
      title: "Shorts 指令｜6 支短影音",
      text: `你是一位「幸福生態圈短影音導演」。

請根據以下資料，產出 6 支 Shorts 腳本。

【系列】
${pack.persona.seriesName}

【主題】
${pack.inspiration}

【風格】
${pack.persona.visualStyle}

【請每支輸出】
1. Shorts 標題
2. 前 3 秒 Hook
3. 畫面描述
4. 旁白
5. 字幕
6. BGM 建議
7. CTA

【第一支參考】
Hook：${firstShort.opening_script}
主內容：${firstShort.main_script}
結尾：${firstShort.ending_script}`
    },
    {
      title: "Canva AI 設計指令｜圖文模板",
      text: `請設計一張「${pack.persona.seriesName}」圖文模板。

【尺寸】
1:1

【主色】
${pack.persona.colors}

【風格】
${pack.persona.visualStyle}

【標題】
${firstVisual.content_title}

【文案】
${firstVisual.main_copy}

【設計要求】
溫暖、有留白、高質感、成人療癒感。
加入簡約小太陽 logo，不要翅膀。
文字要清楚可讀，適合 IG / Facebook / 小紅書。`
    }
  ];
}

function buildStoryPromptPack(pack) {
  const { story, longVideo, shorts, visuals } = pack;
  const firstVisual = visuals[0];

  return [
    {
      title: "YouTube 長影片指令｜完整腳本",
      text: `你是一位「幸福生態圈 YouTube 長影片導演」。

請根據以下資料，寫出一支 8-12 分鐘 YouTube 長影片完整腳本。

【影片標題】
${longVideo.video_title}

【核心 Hook】
${longVideo.core_hook}

【故事摘要】
${longVideo.story_summary}

【痛點】
${longVideo.pain_point}

【章節】
1. ${longVideo.chapter_01_title}
2. ${longVideo.chapter_02_title}
3. ${longVideo.chapter_03_title}

【要求】
1. 開頭 15 秒要直接打中觀眾痛點。
2. 不要作文感。
3. 加入故事畫面。
4. 加入心理學與腦神經科學理解。
5. 結尾導流 Shorts / LINE / PWA。
6. 請輸出：標題、簡介、完整腳本、章節時間軸、CTA、Hashtags。`
    },
    {
      title: "AI 產圖指令｜故事圖文",
      text: `你是一位「幸福生態圈 AI 視覺內容導演」。

請根據以下故事，生成一張 1:1 圖文圖片。

【故事主題】
${story.title || story.story_title || "教養故事"}

【圖片主標題】
${firstVisual.content_title}

【畫面文案】
${firstVisual.main_copy}

【畫面描述】
${firstVisual.scene_setting}
${firstVisual.character_setting}
${firstVisual.character_action}

【AI 產圖提示詞】
${firstVisual.final_prompt}

【負面提示詞】
${firstVisual.negative_prompt}

【品牌元素】
簡約小太陽 logo，自然放在角落，不要翅膀。

【整體要求】
成人療癒繪本風、溫暖、柔和光線、有幸福感。`
    },
    {
      title: "Shorts 拆分指令｜從長影片拆 6 支",
      text: `你是一位「幸福生態圈 Shorts 編劇」。

請根據以下長影片內容，拆成 6 支 Shorts。

【長影片標題】
${longVideo.video_title}

【核心 Hook】
${longVideo.core_hook}

【故事內容】
${longVideo.chapter_01_script}

【心理學理解】
${longVideo.chapter_02_script}

【腦神經科學】
${longVideo.chapter_03_script}

【請每支輸出】
1. 標題
2. 前 3 秒 Hook
3. 旁白
4. 畫面描述
5. 字幕
6. CTA

【既有 6 支方向】
${shorts.map((s, i) => `${i + 1}. ${s.opening_script}`).join("\n")}`
    },
    {
      title: "AI 文案優化指令｜去AI感＋提高共鳴",
      text: `你是一位「幸福生態圈內容品質編輯」。

請優化以下內容，讓它更像真人說話、更有共鳴、更少作文感。

【原始內容】
${longVideo.opening_script}

${longVideo.chapter_01_script}

【優化要求】
1. 刪掉空泛鋪陳。
2. 開頭直接命中痛點。
3. 用國小五年級也聽得懂的語言。
4. 加入內心 OS。
5. 保留幸福教養的溫暖感。
6. 結尾要有一句讓人想收藏的金句。`
    }
  ];
}

function renderPromptCards(cards) {
  return `
    <div class="prompt-grid">
      ${cards.map((card, i) => `
        <div class="prompt-card">
          <b>${escapeHtml(card.title)}</b>
          <pre id="promptText${i}">${escapeHtml(card.text)}</pre>
          <button class="copy-btn" onclick="copyPrompt(${i})">複製這段指令</button>
        </div>
      `).join("")}
    </div>
  `;
}

function copyPrompt(index) {
  const el = document.getElementById(`promptText${index}`);
  if (!el) return;

  navigator.clipboard.writeText(el.innerText)
    .then(() => setStatus("已複製 AI 協作指令"))
    .catch(() => {
      const range = document.createRange();
      range.selectNodeContents(el);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      setStatus("已選取文字，請手動複製");
    });
}

/* =========================
   生成資料
========================= */

function generateLongVideo(story) {
  const now = Date.now();

  return {
    video_id: `HJ-L-${now}`,
    unit: "幸福教養",
    series_name: "幸福教養",
    topic_name: story.title || story.story_title || "",
    video_title: `${story.title || story.story_title || "教養故事"}｜幸福教養長影片`,
    video_type: "LONG_VIDEO",
    core_emotion: story.emotion_type || "溫暖療癒",
    core_hook: story.core_hook || story.parenting_quote || story.summary || "",
    story_source: story.title || story.story_title || "",
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
    video_prompt: `${story.title || story.story_title || ""} cinematic healing parenting documentary, warm storytelling, emotional transformation`,
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
    topic_name: story.title || story.story_title || "",
    short_title: `${story.title || story.story_title || "教養故事"}｜Shorts ${i + 1}`,
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
    video_prompt: `${story.title || story.story_title || ""}, warm parenting short video, healing family moment, emotional storytelling`,
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
    topic_name: story.title || story.story_title || "",
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

/* =========================
   人格與文案
========================= */

function getSeriesPersona(series) {
  const name = series.series_name || series.name || series.title || "幸福生態圈";

  const base = {
    seriesName: name,
    tone: "溫暖、生活感、療癒、白話",
    visualStyle: series.visual_style || "溫暖療癒成人繪本風",
    musicStyle: "溫暖鋼琴 Lo-fi",
    emotion: "安心、被理解、幸福感",
    scene: "溫暖日常生活場景",
    character: "自然、親切、有生活感的人物",
    action: "安靜地感受生活中的幸福瞬間",
    lighting: "柔和暖光",
    colors: "米白、暖黃、木質色、金色暖陽",
    texture: "水彩＋色鉛筆混合媒材",
    quality: "premium healing illustration, warm light, soft storytelling",
    energy: "中能量溫暖",
    focus: "日常裡被幸福照亮的瞬間",
    cta: "想看更多幸福日常，歡迎回到幸福生態圈。",
    hashtags: "#幸福生態圈 #幸福感 #日常療癒 #AI創作"
  };

  if (name.includes("旅居")) {
    return {
      ...base,
      visualStyle: "幸福旅居成人療癒繪本風，金色暖陽，慢生活，高質感留白",
      scene: "清晨窗邊、旅居小屋、暖陽灑落的慢生活場景",
      character: "中年女性，安靜、自在、帶著柔和笑意",
      action: "坐在窗邊喝茶，看著光慢慢進來",
      cta: "生命是一場旅居，願你今天也慢慢安住自己。",
      hashtags: "#幸福旅居 #生命是一場旅居 #慢生活 #早安圖 #幸福生態圈"
    };
  }

  if (name.includes("教養")) {
    return {
      ...base,
      visualStyle: "親子療癒繪本風，溫暖家庭場景，柔和光線",
      scene: "親子互動的家庭場景，大人蹲下傾聽孩子",
      character: "一位溫柔大人與孩子，自然互動",
      action: "大人先穩住，陪孩子慢慢把情緒說出來",
      cta: "大人先穩住，關係才會有空間。",
      hashtags: "#幸福教養 #親子關係 #情緒教養 #腦神經科學 #幸福生態圈"
    };
  }

  if (name.includes("健康") || name.includes("頻率")) {
    return {
      ...base,
      visualStyle: "自然療癒風，靜心感，身心能量平衡，柔和自然光",
      scene: "自然光、植物、茶飲、靜心呼吸的空間",
      character: "成人女性，放鬆呼吸，感受身體慢慢回來",
      action: "閉眼深呼吸，把注意力帶回身體",
      cta: "讓身體慢下來，心也會慢慢回來。",
      hashtags: "#健康頻率 #身心平衡 #能量 #情緒照顧 #幸福生態圈"
    };
  }

  if (name.includes("手作") || name.includes("烘焙")) {
    return {
      ...base,
      visualStyle: "溫暖手作烘焙繪本風，木質餐桌，健康麵包，幸福感",
      scene: "手作工作室、剛出爐的麵包、自然光灑在木桌上",
      character: "溫柔手作人，正在整理麵包與食材",
      action: "把健康麵包放上桌，讓家人安心享用",
      cta: "幸福，有時就藏在一口安心的麵包裡。",
      hashtags: "#幸福緣手作 #健康麵包 #手作烘焙 #幸福感 #幸福生態圈"
    };
  }

  return base;
}

function makeUniverseTitle(inspiration, i) {
  const titles = [
    "幸福就在簡單的日常裡",
    "把心慢慢安住",
    "今天，也留一點溫柔給自己",
    "你不是不夠好，只是太累了",
    "日常裡的小小幸福",
    "把幸福感帶回生活"
  ];
  return titles[(i - 1) % titles.length] || inspiration;
}

function makeUniverseCopy(inspiration, persona, i) {
  const copies = [
    `有時候，幸福不是變得更厲害，而是願意在簡單的日常裡，重新感覺自己。`,
    `當心慢下來，你會發現，原來生活一直都有光。`,
    `不用急著變好，先讓自己回到一個舒服的位置。`
  ];
  return copies[(i - 1) % copies.length] || inspiration;
}

function makeHook(inspiration, i) {
  const hooks = [
    `你是不是也常常忘了，其實幸福可以很簡單？`,
    `越想把日子過好的人，越需要先把心安住。`,
    `那一天，我突然發現，慢下來也是一種力量。`,
    `你不是沒有幸福感，你只是太久沒有好好感受自己。`,
    `真正讓人留下來的，不是大道理，而是被理解的感覺。`,
    `如果今天只能留下一句話，我想說：${inspiration}`
  ];
  return hooks[(i - 1) % hooks.length];
}

function makeShortMain(inspiration, persona, i) {
  const mains = [
    `很多時候，我們以為幸福要等到事情完成、問題解決、人生變好。可是幸福也可能只是此刻一點點暖光，一口茶，一個終於放鬆的呼吸。`,
    `當你願意慢下來，心裡那個一直用力的人，也終於可以被你看見。`,
    `真正的幸福感，不是外面給你的，而是你開始願意溫柔地陪自己。`
  ];
  return mains[(i - 1) % mains.length];
}

function makeImagePrompt(seriesName, inspiration, persona, i) {
  return `${persona.visualStyle}，主題是「${inspiration}」，${persona.scene}，${persona.character}，${persona.action}，${persona.lighting}，${persona.colors}，${persona.texture}，留白式構圖，適合放置繁體中文文案，角落加入簡約小太陽logo，不要翅膀，高質感，溫暖療癒，premium editorial illustration`;
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
  return arr[i] || story.title || story.story_title || "幸福教養";
}

function makeVisualTitle(story, i) {
  const title = story.title || story.story_title || "教養故事";
  const arr = [
    `${title}｜教養金句`,
    `${title}｜腦科學理解`,
    `${title}｜心理學轉化`
  ];
  return arr[i];
}

/* =========================
   畫面渲染
========================= */

function renderUniverseResult(pack) {
  return `
    <div class="result-card">
      <div class="item">
        <b>宇宙靈感模式已生成</b>
        <pre>系列：${escapeHtml(pack.persona.seriesName)}
靈感：${escapeHtml(pack.inspiration)}
圖文：${pack.visuals.length} 篇
Shorts：${pack.shorts.length} 支

已寫入：
03_visual_content_library
04_short_video_library</pre>
      </div>
    </div>
  `;
}

function renderStoryResult(pack) {
  return `
    <div class="result-card">
      <div class="item">
        <b>故事內容宇宙已生成</b>
        <pre>長影片：1 支
Shorts：${pack.shorts.length} 支
圖文：${pack.visuals.length} 篇

已寫入：
07_long_video_library
04_short_video_library
03_visual_content_library</pre>
      </div>

      <div class="item">
        <b>長影片標題</b>
        <pre>${escapeHtml(pack.longVideo.video_title)}</pre>
      </div>

      <div class="item">
        <b>核心 Hook</b>
        <pre>${escapeHtml(pack.longVideo.core_hook)}</pre>
      </div>
    </div>
  `;
}

function renderAnalysis(data) {
  if (!els.contentAnalysisBox) return;

  els.contentAnalysisBox.innerHTML = `
    <div class="analysis-card">
      <h3>內容品質分析</h3>

      <div class="score-grid">
        <div class="score-item">
          <div class="score-title">Hook</div>
          <div class="score-value">${escapeHtml(data.hook_score)}</div>
        </div>
        <div class="score-item">
          <div class="score-title">共鳴</div>
          <div class="score-value">${escapeHtml(data.resonance_score)}</div>
        </div>
        <div class="score-item">
          <div class="score-title">真人感</div>
          <div class="score-value">${escapeHtml(data.ai_score)}</div>
        </div>
        <div class="score-item">
          <div class="score-title">密度</div>
          <div class="score-value">${escapeHtml(data.density_score)}</div>
        </div>
      </div>

      <div class="total-score">總分：${escapeHtml(data.total_score)}</div>
      <div class="level-tag">${escapeHtml(data.level)}</div>

      <h4>問題</h4>
      <ul>${(data.problems || []).map(p => `<li>${escapeHtml(p)}</li>`).join("")}</ul>

      <h4>優化建議</h4>
      <ul>${(data.suggestions || []).map(s => `<li>${escapeHtml(s)}</li>`).join("")}</ul>
    </div>
  `;
}

function renderAnalysisError(message) {
  if (!els.contentAnalysisBox) return;

  els.contentAnalysisBox.innerHTML = `
    <div class="analysis-card">
      <h3>內容品質分析</h3>
      <p>分析失敗：${escapeHtml(message)}</p>
    </div>
  `;
}

/* =========================
   API
========================= */

async function writeLongVideo(data) {
  return postData("writeLongVideo", data);
}

async function writeShort(data) {
  return postData("writeShort", data);
}

async function writeVisual(data) {
  return postData("writeVisual", data);
}

async function postData(action, data) {
  const res = await fetch(getGasUrl(), {
    method: "POST",
    body: JSON.stringify({ action, data })
  });

  const json = await res.json();

  if (!json.ok) throw new Error(json.message || "寫入失敗");

  return json;
}

async function analyzeContent(text) {
  try {
    const res = await fetch(getGasUrl(), {
      method: "POST",
      body: JSON.stringify({
        action: "analyzeContent",
        text: text || ""
      })
    });

    return await res.json();
  } catch (err) {
    return {
      ok: false,
      message: err.message
    };
  }
}

/* =========================
   工具
========================= */

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, s => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[s]));
}
