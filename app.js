const LS_GAS_URL = "happiness_ai_console_gas_url_v3";
let latestPackage = null;

const $ = (id) => document.getElementById(id);

window.addEventListener("DOMContentLoaded", () => {
  $("gasUrl").value = localStorage.getItem(LS_GAS_URL) || "";

  $("saveConfigBtn").addEventListener("click", saveConfig);
  $("testBtn").addEventListener("click", testConnection);
  $("loadSeriesBtn").addEventListener("click", loadSeries);
  $("generateBtn").addEventListener("click", generateContent);
  $("copyBtn").addEventListener("click", copyTSV);
  $("writeBtn").addEventListener("click", writeToSheets);
});

function saveConfig() {
  localStorage.setItem(LS_GAS_URL, $("gasUrl").value.trim());
  setStatus("設定已儲存");
}

function getGasUrl() {
  return $("gasUrl").value.trim() || localStorage.getItem(LS_GAS_URL) || "";
}

function setStatus(text) {
  $("statusText").textContent = text;
}

async function testConnection() {
  const url = getGasUrl();
  if (!url) return alert("請先貼上 GAS Web App URL");

  try {
    const res = await fetch(`${url}?action=ping`);
    const data = await res.json();
    setStatus(data.ok ? "連線成功：" + data.message : "連線失敗");
  } catch (err) {
    setStatus("連線錯誤：" + err.message);
  }
}

async function loadSeries() {
  const url = getGasUrl();
  if (!url) return alert("請先貼上 GAS Web App URL");

  try {
    const res = await fetch(`${url}?action=getSeries`);
    const data = await res.json();

    if (!data.ok) throw new Error(data.message || "讀取失敗");

    const units = [...new Set(data.rows.map((r) => r.unit).filter(Boolean))];
    if (units.length) {
      $("unitSelect").innerHTML = units
        .map((u) => `<option value="${escapeHtml(u)}">${escapeHtml(u)}</option>`)
        .join("");
    }

    const series = [...new Set(data.rows.map((r) => r.series_name).filter(Boolean))];
    if (series.length) {
      $("seriesSelect").innerHTML = series
        .map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`)
        .join("");
    }

    setStatus(`已讀取 ${data.rows.length} 筆系列資料`);
  } catch (err) {
    setStatus("讀取系列失敗：" + err.message);
  }
}

function generateContent() {
  const unit = $("unitSelect").value;
  const series = $("seriesSelect").value;
  const idea = $("ideaInput").value.trim();

  if (!idea) return alert("請輸入一句靈感");

  latestPackage = buildLocalAIContent({ unit, series, idea });
  renderResult(latestPackage);
}

function buildLocalAIContent({ unit, series, idea }) {
  const stamp = formatStamp(new Date());
  const universe = getUniverseProfile(unit);
  const topic = analyzeIdea(idea, unit, series);
  const title = makeTitle(idea, topic, series);
  const mainCopy = makeMainCopy(idea, topic, unit);
  const platformCopy = `${title}\n\n${mainCopy}\n\n#${unit}`;
  const hashtags = makeHashtags(unit, series);
  const finalPrompt = makeFinalPrompt(universe, topic);

  return {
    visual: {
      content_id: `${unitCode(unit)}-C-${stamp}`,
      unit,
      series_name: series,
      topic_name: topic.topic_name,
      content_type: "POSTER_SINGLE",
      content_title: title,
      main_copy: mainCopy,
      visual_style: universe.visual_style,
      layout_type: "POSTER",
      image_prompt: `${universe.visual_style}，${topic.scene_setting}`,
      output_ratio: universe.ratio,
      music_style: topic.music_style,
      platform_copy: platformCopy,
      hashtags,
      theme_emotion: topic.theme_emotion,
      scene_setting: topic.scene_setting,
      character_setting: universe.character,
      character_action: topic.character_action,
      lighting_style: topic.lighting_style,
      color_palette: topic.color_palette,
      composition_style: topic.composition_style,
      texture_style: universe.texture_style,
      brand_elements: universe.logo,
      quality_keywords: universe.quality_keywords,
      negative_prompt: universe.negative_prompt,
      final_prompt: finalPrompt,
      shorts_cover_text: makeCoverText(idea),
      shorts_hook_text: makeHookText(idea),
      emotion_trigger: topic.emotion_trigger,
      content_energy_level: topic.energy,
      visual_focus_point: topic.visual_focus_point,
      scroll_stopping_element: topic.scroll_stopping_element,
      target_platform: "IG / TikTok / YouTube Shorts",
      reuse_potential: "高"
    },
    short: {
      short_id: `${unitCode(unit)}-S-${stamp}`,
      unit,
      series_name: series,
      topic_name: topic.topic_name,
      short_title: title,
      hook_type: topic.hook_type,
      emotion_trigger: topic.emotion_trigger,
      visual_style: universe.visual_style,
      opening_script: makeHookText(idea),
      main_script: mainCopy,
      ending_script: "把這份感覺，留給今天的自己。",
      bgm_style: topic.music_style,
      cta_style: "柔性陪伴型",
      shorts_cover_text: makeCoverText(idea),
      shorts_hook_text: makeHookText(idea),
      video_prompt: finalPrompt,
      platform_focus: "IG / TikTok / YouTube Shorts",
      output_ratio: "9:16",
      status: "待產圖",
      notes: "v3-lite 本地規則引擎生成"
    }
  };
}

function getUniverseProfile(unit) {
  const base = {
    visual_style: "日系成人療癒繪本風",
    ratio: "1:1",
    logo: "簡約小太陽logo自然融入角落",
    texture_style: "水彩＋色鉛筆混合媒材，細膩紙張紋理",
    quality_keywords:
      "premium lifestyle illustration, Japanese adult healing picture book style, cinematic lighting, editorial poster composition, visual storytelling, warm atmosphere, high aesthetic, professional composition",
    negative_prompt:
      "avoid cheap AI look, avoid childish cartoon style, avoid plastic skin, avoid distorted hands, avoid bad anatomy, avoid messy background, avoid wrong text, avoid overexposure, avoid low resolution"
  };

  const map = {
    幸福旅居: {
      ...base,
      character: "40歲左右短髮女性，棉麻居家服，自然生活感，不看鏡頭",
      visual_style: "日系成人療癒繪本風"
    },
    幸福教養: {
      ...base,
      character: "一位溫柔大人與孩子，自然家庭互動",
      visual_style: "親子療癒繪本風"
    },
    健康頻率: {
      ...base,
      character: "安靜冥想或休息的人物剪影，溫柔理性",
      visual_style: "溫柔腦神經科學療癒風"
    },
    生活好物: {
      ...base,
      character: "溫柔生活者的手部或居家片段",
      visual_style: "日系生活選物風"
    },
    幸福緣手作: {
      ...base,
      character: "手作料理者的雙手與餐桌",
      visual_style: "料理食譜圖板風"
    },
    智慧名片商業系: {
      ...base,
      character: "創業者使用手機與智慧名片的生活場景",
      visual_style: "溫暖商業品牌風"
    }
  };

  return map[unit] || map["幸福旅居"];
}

function analyzeIdea(idea, unit, series) {
  let t = {
    topic_name: idea,
    theme_emotion: "溫暖療癒",
    scene_setting: "窗邊生活場景，留白、木桌、柔和日常感",
    lighting_style: "柔和暖光，空氣感，微微逆光",
    character_action: "安靜坐著，雙手捧著熱飲，慢慢呼吸",
    color_palette: "米白、奶油色、暖木色",
    music_style: "木吉他 Lo-fi",
    composition_style: "Instagram高級海報構圖，主體清楚，保留文案留白",
    emotion_trigger: "被接住感",
    energy: "低能量療癒",
    visual_focus_point: "熱飲蒸氣與人物安靜姿態",
    scroll_stopping_element: "大面積留白＋溫暖逆光",
    hook_type: "情緒共鳴型"
  };

  if (/雨|下雨|雨聲/.test(idea)) {
    Object.assign(t, {
      theme_emotion: "安靜療癒",
      scene_setting: "窗邊看雨，玻璃上有雨痕，室內有熱茶與毛毯",
      lighting_style: "灰米白陰天光，室內暖燈柔和補光",
      character_action: "靠窗坐著，雙手捧熱茶，看著雨慢慢落下",
      color_palette: "灰米白、暖木色、淡奶茶色",
      music_style: "鋼琴 Lo-fi",
      emotion_trigger: "被雨聲安慰的感覺",
      visual_focus_point: "窗外雨痕與熱茶蒸氣",
      scroll_stopping_element: "雨窗＋暖燈對比"
    });
  }

  if (/夜|晚安|睡|累|焦慮/.test(idea) || series.includes("晚安")) {
    Object.assign(t, {
      theme_emotion: "安定陪伴",
      scene_setting: "夜晚窗邊或沙發角落，暖黃燈、熱茶、書本與毛毯",
      lighting_style: "低亮度暖黃燈光，柔和陰影，夜晚安定感",
      character_action: "抱著毛毯，坐在沙發閱讀或安靜喝茶",
      color_palette: "米白、深奶茶、暖灰、夜藍",
      music_style: "輕鋼琴 Lo-fi",
      emotion_trigger: "終於可以休息的感覺",
      energy: "低能量療癒",
      visual_focus_point: "暖燈與人物放鬆姿態",
      scroll_stopping_element: "夜晚暖燈＋安靜文字"
    });
  }

  if (unit === "健康頻率") {
    Object.assign(t, {
      theme_emotion: "神經系統穩定",
      scene_setting: "安靜深藍霧紫空間，柔和光流、呼吸節奏、抽象神經線條",
      lighting_style: "深藍霧紫微光，溫柔光流，不黑科技",
      character_action: "閉眼深呼吸或安靜冥想",
      color_palette: "深藍、霧紫、暖灰、微光金",
      music_style: "Alpha波療癒音樂",
      emotion_trigger: "大腦終於放鬆的感覺",
      visual_focus_point: "呼吸光流與神經系統意象",
      scroll_stopping_element: "深藍微光＋腦神經線條"
    });
  }

  return t;
}

function makeTitle(idea, topic, series) {
  if (series.includes("早安")) return "今天，也慢慢開始";
  if (series.includes("晚安")) return "今晚，把心放輕一點";
  if (/累|焦慮/.test(idea)) return "今天不用急著變更好";
  if (/雨/.test(idea)) return "被雨聲安慰的時光";
  return idea.length <= 14 ? idea : idea.slice(0, 14);
}

function makeMainCopy(idea, topic, unit) {
  if (unit === "健康頻率") {
    return "當你覺得累，不一定是意志力不夠。\n也許只是大腦和神經系統，需要一點安靜的時間。\n慢慢呼吸，讓身體先回到安全感裡。";
  }

  return `${idea}\n\n不用急著追趕世界，\n先把心放回自己身上。\n在一點光、一杯熱飲、一段安靜裡，\n慢慢找回今天的幸福感。`;
}

function makeHashtags(unit, series) {
  const arr = ["#幸福生態圈", `#${unit}`, `#${series}`, "#療癒系", "#慢生活", "#幸福感"];

  if (unit === "健康頻率") {
    arr.push("#腦神經科學", "#神經系統", "#睡眠療癒");
  }

  if (unit === "幸福教養") {
    arr.push("#親子教養", "#情緒穩定");
  }

  return [...new Set(arr)].join(" ");
}

function makeCoverText(idea) {
  if (/累|焦慮/.test(idea)) return "今天不用急著變更好";
  if (/雨/.test(idea)) return "被雨聲安慰一下";
  return "幸福，就在這一刻";
}

function makeHookText(idea) {
  if (/累|焦慮/.test(idea)) return "有時候，你不是不夠努力，只是太累了。";
  if (/雨/.test(idea)) return "下雨天，也可以是一種溫柔的提醒。";
  return "先別急著追趕世界，今天慢慢來也可以。";
}

function makeFinalPrompt(u, t) {
  return `${u.visual_style}, premium lifestyle illustration, ${t.scene_setting}, ${u.character}, ${t.character_action}, ${t.lighting_style}, ${t.color_palette}, ${t.composition_style}, ${u.texture_style}, ${u.logo}, emotional visual storytelling, warm atmosphere, high aesthetic, professional composition, ${u.quality_keywords}, ${u.negative_prompt}, square composition or selected social media ratio, no wrong text, no distorted hands`;
}

function renderResult(pkg) {
  const v = pkg.visual;

  const fields = [
    "content_title",
    "main_copy",
    "platform_copy",
    "hashtags",
    "final_prompt",
    "shorts_cover_text",
    "shorts_hook_text",
    "emotion_trigger"
  ];

  $("resultArea").innerHTML = `
    <div class="result-card">
      ${fields
        .map(
          (k) => `
          <div class="item">
            <b>${k}</b>
            <pre>${escapeHtml(v[k])}</pre>
          </div>
        `
        )
        .join("")}
    </div>
  `;
}

async function writeToSheets() {
  if (!latestPackage) return alert("請先生成內容包");

  const url = getGasUrl();
  if (!url) return alert("請先貼上 GAS Web App URL");

  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        action: "writeContentPackage",
        visual: latestPackage.visual,
        short: latestPackage.short
      })
    });

    const data = await res.json();

    if (!data.ok) throw new Error(data.message || "寫入失敗");

    setStatus("已寫入 Sheets");
  } catch (err) {
    setStatus("寫入失敗：" + err.message);
  }
}

function copyTSV() {

  if (!latestPackage) {
    return alert("請先生成內容包");
  }

  const v = latestPackage.visual;

  const keys = Object.keys(v);

  /* =========================
     TSV 安全轉換
  ========================= */

  const tsv = keys
    .map((k) => {

      return String(v[k] ?? "")

        /* 真換行 → \\n */
        .replace(/\r?\n/g, "\\n")

        /* Tab 避免炸欄位 */
        .replace(/\t/g, " ")

        /* 多餘空白整理 */
        .trim();

    })
    .join("\t");

  navigator.clipboard
    .writeText(tsv)
    .then(() => {

      setStatus("已複製 03 分頁 TSV（安全模式）");

    })
    .catch((err) => {

      setStatus("複製失敗：" + err.message);

    });

}

function unitCode(unit) {
  return {
    幸福旅居: "HL",
    幸福教養: "HJ",
    健康頻率: "HF",
    生活好物: "LG",
    幸福緣手作: "HY",
    智慧名片商業系: "HC"
  }[unit] || "HE";
}

function formatStamp(d) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
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
