// app.js
"use strict";

/*
  Joy of Living Survey • Yaşama Sevinci Anketi
  Static, offline-ready. localStorage only. No network calls.
*/

const STORE_KEY = "joy_of_living_survey_v2";

const DOMAINS = [
  { key: "energy", tr: "Enerji & Beden", en: "Energy & Body", icon: "⚡" },
  { key: "meaning", tr: "Anlam & Değerler", en: "Meaning & Values", icon: "✨" },
  { key: "connection", tr: "Bağ & Aidiyet", en: "Connection & Belonging", icon: "🤝" },
  { key: "agency", tr: "Öz-yeterlik & Büyüme", en: "Agency & Growth", icon: "🧭" },
  { key: "habits", tr: "Ödül Döngüleri & Alışkanlık", en: "Reward Loops & Habits", icon: "🔁" },
];

const DOMAIN_DESCRIPTIONS = {
  energy: {
    tr: "Bedensel enerji, uyku, netlik ve günlük canlılık.",
    en: "Body energy, sleep support, mental clarity, and daily vitality.",
  },
  meaning: {
    tr: "Anlam, değerlerle uyum ve umut hissi.",
    en: "A sense of meaning, values alignment, and hope.",
  },
  connection: {
    tr: "Bağ kurma, ait hissetme ve destek alışverişi.",
    en: "Connection, belonging, and mutual support.",
  },
  agency: {
    tr: "Kontrol hissi, ilerleme ve duyguları yönetme.",
    en: "Agency, progress, and emotional steadiness.",
  },
  habits: {
    tr: "Dürtüler, odak ve günlük alışkanlık dengesi.",
    en: "Impulse balance, focus, and daily habit loops.",
  },
};

const SCALE = {
  tr: [
    { v: 0, label: "Hiç" },
    { v: 1, label: "Nadiren" },
    { v: 2, label: "Bazen" },
    { v: 3, label: "Sıklıkla" },
    { v: 4, label: "Her zaman" },
  ],
  en: [
    { v: 0, label: "Never" },
    { v: 1, label: "Rarely" },
    { v: 2, label: "Sometimes" },
    { v: 3, label: "Often" },
    { v: 4, label: "Always" },
  ],
};

// QUESTION BANK (must be included exactly as data in app.js)
// Use a questions array with objects: {id, domain, reverse, text: {tr, en}}
const QUESTIONS = [
  { id: 1, domain: "energy", reverse: false, text: { tr: "Son 7 günde sabahları uyandığımda yaşama enerjisi hissettim.", en: "In the last 7 days, I felt a sense of life energy when I woke up." } },
  { id: 2, domain: "energy", reverse: false, text: { tr: "Son 7 günde gün içinde bedenim canlı ve hareket etmeye hazırdı.", en: "In the last 7 days, my body felt lively and ready to move." } },
  { id: 3, domain: "energy", reverse: false, text: { tr: "Son 7 günde uykumun süresi ve kalitesi günümü taşımaya yetti.", en: "In the last 7 days, my sleep duration and quality supported my day." } },
  { id: 4, domain: "energy", reverse: false, text: { tr: "Son 7 günde zihnim çoğunlukla netti; bulanıklık azdı.", en: "In the last 7 days, my mind was mostly clear; brain fog was low." } },
  { id: 5, domain: "energy", reverse: false, text: { tr: "Son 7 günde gün ışığı/temiz hava/kısa yürüyüş gibi şeyleri düzenli aldım.", en: "In the last 7 days, I regularly got daylight, fresh air, or short walks." } },
  { id: 6, domain: "energy", reverse: true, text: { tr: "Son 7 günde gün içinde sık sık yorgun ve bitkin hissettim.", en: "In the last 7 days, I often felt tired or exhausted during the day." } },

  { id: 7, domain: "meaning", reverse: false, text: { tr: "Son 7 günde yaptıklarımın anlamlı olduğuna dair içsel bir his vardı.", en: "In the last 7 days, I had an inner sense that what I do is meaningful." } },
  { id: 8, domain: "meaning", reverse: false, text: { tr: "Son 7 günde şükredebildiğim şeyleri fark ettim.", en: "In the last 7 days, I noticed things I could be grateful for." } },
  { id: 9, domain: "meaning", reverse: false, text: { tr: "Son 7 günde değerlerimle (adalet, merhamet vb.) uyumlu yaşadım.", en: "In the last 7 days, I lived in line with my values (justice, compassion, etc.)." } },
  { id: 10, domain: "meaning", reverse: false, text: { tr: "Son 7 günde maneviyat/din/dua/tefekkür bana güç verdi.", en: "In the last 7 days, spirituality/religion/prayer/reflection gave me strength." } },
  { id: 11, domain: "meaning", reverse: false, text: { tr: "Son 7 günde geleceğe dair makul bir umut hissedebildim.", en: "In the last 7 days, I could feel a reasonable sense of hope about the future." } },
  { id: 12, domain: "meaning", reverse: true, text: { tr: "Son 7 günde günlerim amaçsız ve boş geçti.", en: "In the last 7 days, my days felt pointless and empty." } },

  { id: 13, domain: "connection", reverse: false, text: { tr: "Son 7 günde en az bir kişiyle gerçek bir bağ/sohbet kurdum.", en: "In the last 7 days, I had at least one genuine connection or conversation." } },
  { id: 14, domain: "connection", reverse: false, text: { tr: "Son 7 günde bir topluluğa/aidiyete yakın hissettim (aile, arkadaş, mahalle vb.).", en: "In the last 7 days, I felt close to a community or sense of belonging (family, friends, local group)." } },
  { id: 15, domain: "connection", reverse: false, text: { tr: "Son 7 günde insanlarla birlikteyken anlaşılmış hissettim.", en: "In the last 7 days, I felt understood when I was with people." } },
  { id: 16, domain: "connection", reverse: false, text: { tr: "Son 7 günde destek istemem gerektiğinde isteyebileceğimi hissettim.", en: "In the last 7 days, I felt I could ask for support when I needed it." } },
  { id: 17, domain: "connection", reverse: false, text: { tr: "Son 7 günde başkalarına küçük de olsa faydam dokundu.", en: "In the last 7 days, I helped others in small ways." } },
  { id: 18, domain: "connection", reverse: true, text: { tr: "Son 7 günde kendimi yalnız ve kopuk hissettim.", en: "In the last 7 days, I felt lonely and disconnected." } },

  { id: 19, domain: "agency", reverse: false, text: { tr: "Son 7 günde ilerleme hissi veren bir şey yaptım.", en: "In the last 7 days, I did something that gave me a sense of progress." } },
  { id: 20, domain: "agency", reverse: false, text: { tr: "Son 7 günde yapmam gerekeni aşırı ertelemeden başlatabildim.", en: "In the last 7 days, I could start what I needed to do without excessive procrastination." } },
  { id: 21, domain: "agency", reverse: false, text: { tr: "Son 7 günde zor duygular geldiğinde tamamen dağılmadan yönetebildim.", en: "In the last 7 days, when hard emotions came up, I could manage them without falling apart." } },
  { id: 22, domain: "agency", reverse: false, text: { tr: "Son 7 günde kendime verdiğim sözleri çoğunlukla tuttum.", en: "In the last 7 days, I mostly kept promises I made to myself." } },
  { id: 23, domain: "agency", reverse: false, text: { tr: "Son 7 günde öğrenme/okuma/üretme gibi zihinsel beslenmeler yaptım.", en: "In the last 7 days, I engaged in mental nourishment like learning, reading, or creating." } },
  { id: 24, domain: "agency", reverse: true, text: { tr: "Son 7 günde kendimi kontrol edemiyor gibi hissettim.", en: "In the last 7 days, I felt like I couldn’t control myself." } },

  { id: 25, domain: "habits", reverse: false, text: { tr: "Son 7 günde sosyal medya/short video gibi şeylerde kontrol bende hissettim.", en: "In the last 7 days, I felt in control with social media or short videos." } },
  { id: 26, domain: "habits", reverse: true, text: { tr: "Son 7 günde dürtüsel tüketim (scroll, atıştırma, alışveriş vb.) günümü ele geçirdi.", en: "In the last 7 days, impulsive consumption (scrolling, snacking, shopping) took over my day." } },
  { id: 27, domain: "habits", reverse: false, text: { tr: "Son 7 günde odak gerektiren işe 20–40 dk bloklar halinde girebildim.", en: "In the last 7 days, I could do 20–40 minute blocks of focused work." } },
  { id: 28, domain: "habits", reverse: false, text: { tr: "Son 7 günde küçük “keyif adaları” oluşturdum (müzik, çay, doğa, sohbet).", en: "In the last 7 days, I created small “joy islands” (music, tea, nature, conversation)." } },
  { id: 29, domain: "habits", reverse: false, text: { tr: "Son 7 günde gün sonunda tatlı bir “tamamladım” hissi vardı.", en: "In the last 7 days, I had a satisfying sense of completion by day’s end." } },
  { id: 30, domain: "habits", reverse: false, text: { tr: "Son 7 günde uyarana kaçmak yerine (telefon vb.) sıkılmayı tolere edip sakin kalabildim.", en: "In the last 7 days, instead of escaping into stimuli (phone, etc.), I could tolerate boredom and stay calm." } },
];

// Micro-actions (bilingual)
const MICRO_ACTIONS = {
  energy: {
    tr: [
      "2 dk: Pencere aç, 10 derin nefes al, omuzlarını gevşet (kısa esneme ekle).",
      "10 dk: Kısa yürüyüş + gün ışığı (mümkünse).",
      "Çevre: Yatmadan önce 30 dk ekran kapalı “iniş rutini” (ışığı kıs).",
    ],
    en: [
      "2 min: Open a window, take 10 deep breaths, relax shoulders (add a quick stretch).",
      "10 min: Short walk + daylight (if possible).",
      "Environment: 30 min screen-off wind-down before bed (dim the lights).",
    ],
  },
  meaning: {
    tr: [
      "2 dk: Bugün şükredebileceğin 3 şeyi yaz.",
      "10 dk: Dua/tefekkür veya sakin bir okuma bloğu.",
      "Topluluk: Bu hafta 1 küçük iyilik planla (mesaj, yardım, teşekkür).",
    ],
    en: [
      "2 min: Write 3 gratitude items today.",
      "10 min: Prayer/reflection or a calm reading block.",
      "Community: Plan one small act of kindness this week (message, help, thanks).",
    ],
  },
  connection: {
    tr: [
      "2 dk: Bir kişiye içten “Nasılsın?” mesajı at (tek cümle yeter).",
      "10 dk: Kısa bir arama planla veya yürüyüşe birlikte çık.",
      "Aidiyet: Bu hafta 1 topluluk buluşması seç (online/yerel).",
    ],
    en: [
      "2 min: Send a sincere “How are you?” message (one line is enough).",
      "10 min: Schedule a short call or take a walk together.",
      "Belonging: Choose one community gathering this week (online/local).",
    ],
  },
  agency: {
    tr: [
      "2 dk: Tek bir küçük görev seç ve ilk adımı at.",
      "10 dk: Zamanlayıcı odak bloğu → bitince işaretle.",
      "Büyüme: 1 sayfa oku / küçük bir şey üret (not, çizim, taslak).",
    ],
    en: [
      "2 min: Pick one tiny task and do the first step.",
      "10 min: Timer focus block → mark done when finished.",
      "Growth: Read one page / create something small (note, sketch, draft).",
    ],
  },
  habits: {
    tr: [
      "2 dk: Bildirimleri kapat (en azından sosyal uygulamalar).",
      "10 dk: 20 dk odak + 2 dk mola (mini Pomodoro).",
      "Yerine koy: Short video yerine uzun içerik seç (okuma/podcast).",
    ],
    en: [
      "2 min: Turn off notifications (at least social apps).",
      "10 min: 20 min focus + 2 min break (mini Pomodoro).",
      "Replace: Choose long-form (reading/podcast) over short videos.",
    ],
  },
};

const SCORE_BANDS = [
  { min: 0, max: 33, tr: "Şu an destek ihtiyacı yüksek görünüyor.", en: "Signals suggest support could help right now." },
  { min: 34, max: 66, tr: "Karışık/denge arayışı: bazı alanlar güçlü, bazıları destek istiyor.", en: "Mixed signals: some areas are strong, others need care." },
  { min: 67, max: 100, tr: "Güçlü sinyaller: iyi giden alanlar belirgin.", en: "Strong signals: many areas are going well." },
];

// UI references
const UI = {
  langToggle: document.getElementById("langToggle"),
  resetAll: document.getElementById("resetAll"),

  intro: document.getElementById("view_intro"),
  survey: document.getElementById("view_survey"),
  review: document.getElementById("view_review"),
  results: document.getElementById("view_results"),

  title: document.getElementById("ui_title"),
  subtitle: document.getElementById("ui_subtitle"),
  introTitle: document.getElementById("ui_intro_title"),
  introLead: document.getElementById("ui_intro_lead"),
  introList: document.getElementById("ui_intro_list"),
  timeEstimate: document.getElementById("ui_time_estimate"),
  answeredCount: document.getElementById("ui_answered_count"),
  privacy: document.getElementById("ui_privacy"),
  disclaimer: document.getElementById("ui_disclaimer"),
  startBtn: document.getElementById("startBtn"),
  continueBtn: document.getElementById("continueBtn"),
  restartBtn: document.getElementById("restartBtn"),

  surveyTitle: document.getElementById("ui_survey_title"),
  domainPill: document.getElementById("ui_domain_pill"),
  counter: document.getElementById("ui_counter"),
  progressBar: document.getElementById("progressBar"),
  question: document.getElementById("ui_question"),
  scaleHint: document.getElementById("ui_scale_hint"),
  scaleForm: document.getElementById("scaleForm"),
  quickSelect: document.getElementById("quickSelect"),
  backBtn: document.getElementById("backBtn"),
  nextBtn: document.getElementById("nextBtn"),
  hint: document.getElementById("ui_hint"),

  reviewTitle: document.getElementById("ui_review_title"),
  reviewSubtitle: document.getElementById("ui_review_subtitle"),
  reviewList: document.getElementById("reviewList"),
  reviewBackBtn: document.getElementById("reviewBackBtn"),
  reviewConfirmBtn: document.getElementById("reviewConfirmBtn"),

  resultsTitle: document.getElementById("ui_results_title"),
  resultsSubtitle: document.getElementById("ui_results_subtitle"),
  totalScore: document.getElementById("ui_total_score"),
  totalLabel: document.getElementById("ui_total_label"),
  interpretation: document.getElementById("ui_interpretation"),
  subscaleGrid: document.getElementById("subscaleGrid"),
  focusTitle: document.getElementById("ui_focus_title"),
  focusSubtitle: document.getElementById("ui_focus_subtitle"),
  focusList: document.getElementById("focusList"),
  actionsTitle: document.getElementById("ui_actions_title"),
  actionsList: document.getElementById("actionsList"),
  weeklyTitle: document.getElementById("ui_weekly_title"),
  weeklyText: document.getElementById("ui_weekly_text"),
  copyBtn: document.getElementById("copyBtn"),
  exportBtn: document.getElementById("exportBtn"),
  retakeBtn: document.getElementById("retakeBtn"),
  resultsDisclaimer: document.getElementById("ui_results_disclaimer"),
};

// Helpers
function qsLang() {
  const p = new URLSearchParams(location.search);
  const q = (p.get("lang") || "").toLowerCase();
  return (q === "tr" || q === "en") ? q : null;
}

function safeParseJSON(raw) {
  try { return JSON.parse(raw); } catch { return null; }
}

function loadState() {
  const raw = localStorage.getItem(STORE_KEY);
  if (!raw) return null;
  return safeParseJSON(raw);
}

function getDefaultState() {
  return {
    lang: "en",
    step: 0,
    started: false,
    view: "intro",
    answers: {},
    hintDismissed: false,
    editingFromReview: false,
  };
}

function normalizeState(raw) {
  if (!raw || typeof raw !== "object") return null;
  const base = getDefaultState();
  const normalized = { ...base, ...raw };

  if (!["tr", "en"].includes(normalized.lang)) return null;

  if (typeof normalized.step !== "number" || normalized.step < 0 || normalized.step >= QUESTIONS.length) {
    normalized.step = 0;
  }

  if (typeof normalized.started !== "boolean") {
    normalized.started = false;
  }

  if (typeof normalized.answers !== "object" || Array.isArray(normalized.answers) || normalized.answers === null) {
    normalized.answers = {};
  }

  const cleanAnswers = {};
  for (const q of QUESTIONS) {
    const val = normalized.answers[q.id];
    if (Number.isInteger(val) && val >= 0 && val <= 4) {
      cleanAnswers[q.id] = val;
    }
  }
  normalized.answers = cleanAnswers;
  normalized.hintDismissed = Boolean(normalized.hintDismissed);
  normalized.editingFromReview = false;

  if (!["intro", "survey", "review", "results"].includes(normalized.view)) {
    normalized.view = "intro";
  }

  return normalized;
}

let state = (() => {
  const storedRaw = loadState();
  const stored = normalizeState(storedRaw);
  if (!stored && storedRaw) {
    clearState();
  }
  return stored;
})();

if (!state) {
  state = getDefaultState();
  const ql = qsLang();
  if (ql) state.lang = ql;
}

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function clearState() {
  localStorage.removeItem(STORE_KEY);
}

function t(tr, en) {
  return state.lang === "tr" ? tr : en;
}

function domainLabel(key) {
  const d = DOMAINS.find(x => x.key === key);
  if (!d) return key;
  return state.lang === "tr" ? d.tr : d.en;
}

function answeredFor(qId) {
  return typeof state.answers[qId] === "number";
}

function answeredCount() {
  return Object.keys(state.answers).length;
}

function setUiTexts() {
  UI.title.textContent = t("Yaşama Sevinci Anketi", "Joy of Living Survey");
  UI.subtitle.textContent = t(
    "TR/EN kısa bir öz değerlendirme. Veriler cihazında kalır.",
    "A short bilingual self-reflection survey. No data leaves your device."
  );

  UI.introTitle.textContent = t("Hoş geldin", "Welcome");
  UI.introLead.textContent = t(
    "Kısa, destekleyici bir kontrol: haftalık tekrar edebilirsin.",
    "A quick, supportive check-in you can repeat weekly."
  );
  UI.timeEstimate.textContent = t("~3–5 dakika", "~3–5 minutes");
  UI.answeredCount.textContent = t(
    `${answeredCount()} / 30 yanıtlandı`,
    `${answeredCount()} / 30 answered`
  );
  UI.introList.innerHTML = `
    <li>${t("30 soru • 0–4 ölçek • ~3–5 dakika", "30 questions • 0–4 scale • ~3–5 minutes")}</li>
    <li>${t("Toplam skor (0–100) + 5 alt skor", "Total score (0–100) + 5 sub-scores")}</li>
    <li>${t("En düşük alanlarına göre mikro-öneriler", "Micro-actions based on your lowest areas")}</li>
  `;

  UI.privacy.textContent = t(
    "Hiçbir veri gönderilmez; her şey tarayıcında kalır.",
    "No data is sent anywhere; everything stays in your browser."
  );

  UI.disclaimer.textContent = t(
    "Bu tıbbi teşhis değildir. Kendini tehlikede hissediyorsan veya kendine zarar verme düşüncelerin varsa acil yardım iste (ABD: 988).",
    "This is not a medical diagnosis. If you feel in danger or are thinking of self-harm, seek immediate help (US: call/text 988 or your local emergency number)."
  );

  UI.startBtn.textContent = t("Başla", "Start");
  UI.continueBtn.textContent = t("Devam et", "Continue");
  UI.restartBtn.textContent = t("Baştan başlat", "Restart");
  UI.resetAll.textContent = t("Sıfırla", "Reset");

  UI.surveyTitle.textContent = t("Anket", "Survey");
  UI.scaleHint.textContent = t("0 = Hiç · 4 = Her zaman", "0 = Never · 4 = Always");

  UI.backBtn.textContent = t("Geri", "Back");
  UI.hint.textContent = t(
    "İpucu: 1–5 tuşlarıyla hızlı cevapla (1→0, 2→1, 3→2, 4→3, 5→4). Enter: İleri.",
    "Tip: Use number keys 1–5 (1→0, 2→1, 3→2, 4→3, 5→4). Enter: Next."
  );

  UI.reviewTitle.textContent = t("Cevapları gözden geçir", "Review answers");
  UI.reviewSubtitle.textContent = t("Düzenlemek için bir maddeye dokun.", "Tap any item to edit before seeing results.");
  UI.reviewBackBtn.textContent = t("Geri", "Back");
  UI.reviewConfirmBtn.textContent = t("Sonuçları gör", "See results");

  UI.resultsTitle.textContent = t("Sonuçların", "Your results");
  UI.resultsSubtitle.textContent = t(
    "Bu sonuçlar anlık bir fotoğraf: güçlü yanlar ve destek isteyen alanlar.",
    "A snapshot of your current “joy of living” signals."
  );
  UI.totalLabel.textContent = t("Toplam (0–100)", "Total (0–100)");
  UI.actionsTitle.textContent = t("Mikro-adımlar (en düşük alanlara göre)", "Micro-actions (based on your lowest areas)");
  UI.focusTitle.textContent = t("Bir sonraki odak", "What to focus on next");
  UI.focusSubtitle.textContent = t("En düşük iki alan ve neden önemli oldukları.", "Your lowest two areas and why they matter.");
  UI.weeklyTitle.textContent = t("Haftalık kullanım", "Use this weekly");
  UI.weeklyText.textContent = t(
    "Haftada bir kez yap, trendi karşılaştır, en düşük 1–2 alana odaklan.",
    "Take it weekly, compare trends, and focus on your lowest 1–2 areas."
  );
  UI.copyBtn.textContent = t("Özeti kopyala", "Copy summary");
  UI.exportBtn.textContent = t("JSON dışa aktar", "Export JSON");
  UI.retakeBtn.textContent = t("Tekrar çöz", "Retake");
  UI.resultsDisclaimer.textContent = t(
    "Bu araç yalnızca farkındalık içindir; teşhis değildir.",
    "This tool is for reflection only, not diagnosis."
  );

  UI.langToggle.textContent = (state.lang === "tr") ? "EN" : "TR";
}

function show(view) {
  state.view = view;
  saveState();

  UI.intro.classList.add("hidden");
  UI.survey.classList.add("hidden");
  UI.review.classList.add("hidden");
  UI.results.classList.add("hidden");

  const el = {
    intro: UI.intro,
    survey: UI.survey,
    review: UI.review,
    results: UI.results,
  }[view];

  if (el) {
    el.classList.remove("hidden");
    el.classList.remove("fade-in");
    void el.offsetWidth;
    el.classList.add("fade-in");
  }
}

function currentQ() {
  return QUESTIONS[state.step];
}

function renderIntro() {
  setUiTexts();
  const count = answeredCount();
  const hasProgress = count > 0;
  const allAnswered = QUESTIONS.every(q => answeredFor(q.id));

  UI.startBtn.classList.toggle("hidden", hasProgress || allAnswered);
  UI.continueBtn.classList.toggle("hidden", !hasProgress && !allAnswered);
  UI.restartBtn.classList.toggle("hidden", !hasProgress && !allAnswered);

  if (allAnswered) {
    UI.continueBtn.textContent = t("Sonuçları gör", "View results");
  }

  UI.answeredCount.textContent = t(
    `${count} / 30 yanıtlandı`,
    `${count} / 30 answered`
  );

  show("intro");
}

function renderScale(q) {
  const scale = SCALE[state.lang];
  const existing = state.answers[q.id];

  UI.scaleForm.innerHTML = scale.map((o, idx) => {
    const id = `q${q.id}_v${o.v}`;
    const selected = (existing === o.v);
    return `
      <label class="option ${selected ? "selected" : ""}" for="${id}">
        <span class="chip">${o.v}</span>
        <div>
          <strong>${o.label}</strong>
          <span>${t("Seçenek", "Option")} ${idx + 1}</span>
        </div>
        <input id="${id}" name="scale" type="radio" value="${o.v}" ${selected ? "checked" : ""} aria-label="${o.label}" />
      </label>
    `;
  }).join("");

  UI.scaleForm.setAttribute("role", "radiogroup");
  UI.scaleForm.setAttribute("aria-label", t("Cevap ölçeği", "Answer scale"));

  UI.scaleForm.querySelectorAll("input[name='scale']").forEach(inp => {
    inp.addEventListener("change", () => {
      const v = Number(inp.value);
      state.answers[q.id] = v;
      state.hintDismissed = true;
      saveState();

      UI.scaleForm.querySelectorAll(".option").forEach(el => el.classList.remove("selected"));
      const opt = inp.closest(".option");
      if (opt) opt.classList.add("selected");

      updateNav();
      updateHint();
      updateAnsweredCount();
    });
  });
}

function renderQuickSelect(q) {
  UI.quickSelect.innerHTML = SCALE[state.lang].map(o => {
    return `<button class="btn ghost" type="button" data-value="${o.v}">${o.v} · ${o.label}</button>`;
  }).join("");

  UI.quickSelect.querySelectorAll("button[data-value]").forEach(btn => {
    btn.addEventListener("click", () => {
      const val = Number(btn.getAttribute("data-value"));
      state.answers[q.id] = val;
      state.hintDismissed = true;
      saveState();
      renderSurveyStep();
      updateHint();
      updateAnsweredCount();
    });
  });
}

function updateHint() {
  UI.hint.classList.toggle("hidden", state.hintDismissed);
}

function updateAnsweredCount() {
  UI.answeredCount.textContent = t(
    `${answeredCount()} / 30 yanıtlandı`,
    `${answeredCount()} / 30 answered`
  );
}

function updateNav() {
  UI.backBtn.disabled = state.step === 0 && !state.editingFromReview;

  const q = currentQ();
  const answered = answeredFor(q.id);
  const isLast = state.step === QUESTIONS.length - 1;

  if (state.editingFromReview && isLast) {
    UI.nextBtn.textContent = t("Gözden geçir", "Review");
  } else {
    UI.nextBtn.textContent = isLast ? t("Bitir", "Finish") : t("İleri", "Next");
  }
  UI.nextBtn.disabled = !answered;
}

function renderSurveyStep() {
  setUiTexts();
  const q = currentQ();

  UI.domainPill.textContent = domainLabel(q.domain);
  UI.counter.textContent = `${state.step + 1} / ${QUESTIONS.length}`;

  const pct = Math.round(((state.step + 1) / QUESTIONS.length) * 100);
  UI.progressBar.style.width = `${Math.max(0, Math.min(100, pct))}%`;
  UI.progressBar.setAttribute("aria-valuenow", String(pct));
  UI.progressBar.setAttribute("aria-valuemin", "0");
  UI.progressBar.setAttribute("aria-valuemax", "100");

  UI.question.textContent = q.text[state.lang];

  renderScale(q);
  renderQuickSelect(q);
  updateNav();
  updateHint();
  show("survey");
}

function itemScore(q, ans) {
  const base = typeof ans === "number" ? ans : 0;
  return q.reverse ? (4 - base) : base;
}

function computeScores() {
  let totalRaw = 0;
  const subRaw = { energy: 0, meaning: 0, connection: 0, agency: 0, habits: 0 };

  for (const q of QUESTIONS) {
    const ans = state.answers[q.id];
    const pts = itemScore(q, ans);
    totalRaw += pts;
    subRaw[q.domain] += pts;
  }

  const total100 = Math.round((totalRaw / 120) * 100);

  const sub100 = {};
  for (const key of Object.keys(subRaw)) {
    sub100[key] = Math.round((subRaw[key] / 24) * 100);
  }

  return { totalRaw, total100, subRaw, sub100 };
}

function getLowestDomains(sub100) {
  return [...DOMAINS]
    .sort((a, b) => sub100[a.key] - sub100[b.key])
    .slice(0, 2);
}

function interpretScore(total100) {
  const band = SCORE_BANDS.find(b => total100 >= b.min && total100 <= b.max) || SCORE_BANDS[1];
  return state.lang === "tr" ? band.tr : band.en;
}

function renderReview() {
  setUiTexts();
  const scale = SCALE[state.lang];

  UI.reviewList.innerHTML = QUESTIONS.map(q => {
    const val = state.answers[q.id];
    const label = scale.find(s => s.v === val)?.label || "-";
    return `
      <div class="review-item">
        <button type="button" data-qid="${q.id}">
          <strong>${q.id}. </strong>${q.text[state.lang]}
        </button>
        <span class="review-score">${val} · ${label}</span>
      </div>
    `;
  }).join("");

  show("review");
}

function renderResults() {
  setUiTexts();
  const { total100, sub100 } = computeScores();

  UI.totalScore.textContent = String(total100);
  UI.interpretation.textContent = interpretScore(total100);

  UI.subscaleGrid.innerHTML = DOMAINS.map(d => {
    const s = sub100[d.key];
    const name = state.lang === "tr" ? d.tr : d.en;
    return `
      <div class="subcard">
        <div class="subtop">
          <div class="subname">${d.icon} ${name}</div>
          <div class="subscore">${s}</div>
        </div>
        <div class="bar" aria-label="${name}">
          <div style="width:${s}%"></div>
        </div>
      </div>
    `;
  }).join("");

  const lowest2 = getLowestDomains(sub100);

  UI.focusList.innerHTML = lowest2.map(d => {
    const title = state.lang === "tr" ? d.tr : d.en;
    const desc = DOMAIN_DESCRIPTIONS[d.key][state.lang];
    return `
      <div class="focus-item">
        <strong>${d.icon} ${title}</strong>
        <span class="muted">${desc}</span>
      </div>
    `;
  }).join("");

  UI.actionsList.innerHTML = lowest2.map(d => {
    const title = state.lang === "tr" ? d.tr : d.en;
    const acts = MICRO_ACTIONS[d.key][state.lang];
    return `
      <div class="action">
        <h4>${title}</h4>
        <ul>${acts.map(x => `<li>${x}</li>`).join("")}</ul>
      </div>
    `;
  }).join("");

  show("results");
}

function formatTimestamp() {
  const now = new Date();
  return now.toLocaleString(state.lang === "tr" ? "tr-TR" : undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

async function copySummary() {
  const { total100, sub100 } = computeScores();
  const lowest2 = getLowestDomains(sub100);
  const timestamp = formatTimestamp();

  const lines = [];
  lines.push(`${t("Tarih", "Date")}: ${timestamp}`);
  lines.push(`${t("Yaşama Sevinci Skoru", "Joy of Living Score")}: ${total100}/100`);
  for (const d of DOMAINS) {
    const name = state.lang === "tr" ? d.tr : d.en;
    lines.push(`- ${name}: ${sub100[d.key]}/100`);
  }
  lines.push("");
  lines.push(t("En düşük 2 alan", "Lowest 2 areas") + ":");
  lowest2.forEach(d => {
    const name = state.lang === "tr" ? d.tr : d.en;
    const actions = MICRO_ACTIONS[d.key][state.lang].slice(0, 2).join(" | ");
    lines.push(`• ${name}: ${actions}`);
  });
  lines.push("");
  lines.push(t("Not: Bu bir teşhis değildir.", "Note: Not a diagnosis."));

  const text = lines.join("\n");

  const originalLabel = t("Özeti kopyala", "Copy summary");
  const successLabel = t("Kopyalandı!", "Copied!");

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      throw new Error("Clipboard API not available");
    }
    UI.copyBtn.textContent = successLabel;
    setTimeout(() => { UI.copyBtn.textContent = originalLabel; }, 1200);
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      UI.copyBtn.textContent = successLabel;
      setTimeout(() => { UI.copyBtn.textContent = originalLabel; }, 1200);
    } catch {
      // If copy fails silently, keep button unchanged
    }
  }
}

function exportJSON() {
  const { total100, sub100, totalRaw, subRaw } = computeScores();
  const payload = {
    timestamp: new Date().toISOString(),
    lang: state.lang,
    answers: state.answers,
    scores: {
      totalRaw,
      total100,
      subRaw,
      sub100,
    },
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `joy-of-living-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function startSurvey() {
  state.started = true;
  state.step = 0;
  state.answers = {};
  state.editingFromReview = false;
  saveState();
  renderSurveyStep();
}

function continueSurvey() {
  const allAnswered = QUESTIONS.every(q => answeredFor(q.id));
  if (allAnswered) {
    renderResults();
    return;
  }
  state.started = true;
  state.editingFromReview = false;
  saveState();
  renderSurveyStep();
}

function finishSurvey() {
  state.editingFromReview = false;
  saveState();
  renderReview();
}

function confirmReview() {
  state.editingFromReview = false;
  saveState();
  renderResults();
}

function goNext() {
  const isLast = state.step === QUESTIONS.length - 1;
  if (isLast) {
    if (state.editingFromReview) {
      renderReview();
    } else {
      finishSurvey();
    }
    return;
  }
  state.step = Math.min(QUESTIONS.length - 1, state.step + 1);
  saveState();
  renderSurveyStep();
}

function goBack() {
  if (state.editingFromReview && state.step === 0) {
    renderReview();
    return;
  }
  state.step = Math.max(0, state.step - 1);
  saveState();
  renderSurveyStep();
}

function resetAll() {
  clearState();
  state = getDefaultState();
  const ql = qsLang();
  if (ql) state.lang = ql;
  setUiTexts();
  renderIntro();
}

function toggleLang() {
  state.lang = (state.lang === "tr") ? "en" : "tr";
  saveState();

  if (state.view === "survey") {
    renderSurveyStep();
  } else if (state.view === "review") {
    renderReview();
  } else if (state.view === "results") {
    renderResults();
  } else {
    renderIntro();
  }
}

function bindEvents() {
  UI.startBtn.addEventListener("click", startSurvey);
  UI.continueBtn.addEventListener("click", continueSurvey);
  UI.restartBtn.addEventListener("click", resetAll);
  UI.backBtn.addEventListener("click", goBack);
  UI.nextBtn.addEventListener("click", goNext);
  UI.reviewBackBtn.addEventListener("click", () => {
    state.editingFromReview = false;
    renderSurveyStep();
  });
  UI.reviewConfirmBtn.addEventListener("click", confirmReview);
  UI.resetAll.addEventListener("click", resetAll);
  UI.retakeBtn.addEventListener("click", resetAll);
  UI.langToggle.addEventListener("click", toggleLang);
  UI.copyBtn.addEventListener("click", copySummary);
  UI.exportBtn.addEventListener("click", exportJSON);

  UI.reviewList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-qid]");
    if (!button) return;
    const id = Number(button.getAttribute("data-qid"));
    const idx = QUESTIONS.findIndex(q => q.id === id);
    if (idx >= 0) {
      state.step = idx;
      state.editingFromReview = true;
      saveState();
      renderSurveyStep();
    }
  });

  // Keyboard support: 1–5 selects answer options quickly, Enter = Next (if answered)
  document.addEventListener("keydown", (e) => {
    if (state.view !== "survey") return;

    const k = e.key;

    if (k >= "1" && k <= "5") {
      const map = { "1": 0, "2": 1, "3": 2, "4": 3, "5": 4 };
      const val = map[k];
      const q = currentQ();
      state.answers[q.id] = val;
      state.hintDismissed = true;
      saveState();
      renderSurveyStep();
      return;
    }

    if (k === "Enter") {
      const q = currentQ();
      if (answeredFor(q.id) && !UI.nextBtn.disabled) {
        e.preventDefault();
        goNext();
      }
    }
  });
}

function hydrateInitialView() {
  setUiTexts();
  const allAnswered = QUESTIONS.every(q => answeredFor(q.id));

  if (state.started) {
    if (allAnswered) {
      renderResults();
    } else {
      renderSurveyStep();
    }
  } else {
    renderIntro();
  }
}

function testScoringExamples() {
  const sampleAnswers = {};
  QUESTIONS.forEach(q => {
    sampleAnswers[q.id] = 4;
  });

  const savedAnswers = state.answers;
  state.answers = sampleAnswers;
  const { totalRaw, total100, subRaw } = computeScores();
  state.answers = savedAnswers;

  const expectedTotalRaw = (QUESTIONS.length * 4) - (5 * 4); // reverse-coded items become 0
  const expectedTotal100 = Math.round((expectedTotalRaw / 120) * 100);

  return {
    totalRaw,
    total100,
    subRaw,
    expectedTotalRaw,
    expectedTotal100,
    pass: totalRaw === expectedTotalRaw && total100 === expectedTotal100,
  };
}

(function init() {
  bindEvents();
  hydrateInitialView();
  window.testScoringExamples = testScoringExamples;
})();
