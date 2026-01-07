// app.js
"use strict";

/*
  Joy of Living Survey • Yaşama Sevinci Anketi
  Static, offline-ready. localStorage only. No network calls.
*/

const STORE_KEY = "joy_of_living_survey_v1";

const DOMAINS = [
  { key: "energy", tr: "Enerji & Beden", en: "Energy & Body" },
  { key: "meaning", tr: "Anlam & Değerler", en: "Meaning & Values" },
  { key: "connection", tr: "Bağ & Aidiyet", en: "Connection & Belonging" },
  { key: "agency", tr: "Öz-yeterlik & Büyüme", en: "Agency & Growth" },
  { key: "habits", tr: "Ödül Döngüleri & Alışkanlık", en: "Reward Loops & Habits" },
];

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
  { id: 1, domain: "energy", reverse: false, text: { tr: "Son 7 günde sabahları uyanınca “yaşama enerjisi” hissettim.", en: "In the last 7 days, I felt a sense of life energy when I woke up." } },
  { id: 2, domain: "energy", reverse: false, text: { tr: "Gün içinde bedenim “canlı” ve hareket etmeye hazırdı.", en: "During the day, my body felt lively and ready to move." } },
  { id: 3, domain: "energy", reverse: false, text: { tr: "Uykum (süre/kalite) günümü taşımaya yetti.", en: "My sleep (duration/quality) supported my day." } },
  { id: 4, domain: "energy", reverse: false, text: { tr: "Gün içinde zihnim netti; “bulanıklık” azdı.", en: "My mind felt clear; “brain fog” was low." } },
  { id: 5, domain: "energy", reverse: false, text: { tr: "Gün ışığı / temiz hava / kısa yürüyüş gibi şeyleri düzenli aldım.", en: "I regularly got daylight / fresh air / short walks." } },
  { id: 6, domain: "energy", reverse: true, text: { tr: "Gün içinde sürekli yorgun/bitkin hissettim.", en: "I felt constantly tired/exhausted during the day." } },

  { id: 7, domain: "meaning", reverse: false, text: { tr: "Yaptıklarımın bir anlamı olduğuna dair içsel bir his vardı.", en: "I felt an inner sense that what I do has meaning." } },
  { id: 8, domain: "meaning", reverse: false, text: { tr: "Gün içinde şükür edebildiğim şeyleri fark ettim.", en: "I noticed things I could be grateful for." } },
  { id: 9, domain: "meaning", reverse: false, text: { tr: "Değerlerime (etik/adalet/merhamet vb.) uygun yaşadım.", en: "I lived in line with my values (ethics/justice/compassion, etc.)." } },
  { id: 10, domain: "meaning", reverse: false, text: { tr: "Maneviyat/din/dua/tefekkür bana güç verdi.", en: "Spirituality/religion/prayer/reflection gave me strength." } },
  { id: 11, domain: "meaning", reverse: false, text: { tr: "Geleceğe dair makul bir umut hissedebildim.", en: "I could feel a reasonable sense of hope about the future." } },
  { id: 12, domain: "meaning", reverse: true, text: { tr: "Günlerim amaçsız ve boş geçti.", en: "My days felt pointless and empty." } },

  { id: 13, domain: "connection", reverse: false, text: { tr: "En az bir kişiyle “gerçek” bir bağ/sohbet kurabildim.", en: "I had at least one genuine connection/conversation with someone." } },
  { id: 14, domain: "connection", reverse: false, text: { tr: "Kendimi bir topluluğa/aidiyete yakın hissettim (aile, arkadaş, mahalle, cemaat vb.).", en: "I felt close to a community/belonging (family, friends, local group, etc.)." } },
  { id: 15, domain: "connection", reverse: false, text: { tr: "İnsanlarla birlikteyken bile anlaşılmış hissettim.", en: "I felt understood even when I was with people." } },
  { id: 16, domain: "connection", reverse: false, text: { tr: "Destek istemem gerektiğinde isteyebileceğimi hissettim.", en: "I felt I could ask for support when I needed it." } },
  { id: 17, domain: "connection", reverse: false, text: { tr: "Başkalarına küçük de olsa faydam dokundu.", en: "I was helpful to others, even in small ways." } },
  { id: 18, domain: "connection", reverse: true, text: { tr: "Kendimi yalnız ve kopuk hissettim.", en: "I felt lonely and disconnected." } },

  { id: 19, domain: "agency", reverse: false, text: { tr: "Bugün/hafta “ilerleme” hissettiğim bir şey yaptım.", en: "I did something that gave me a sense of progress today/this week." } },
  { id: 20, domain: "agency", reverse: false, text: { tr: "Yapmam gerekeni ertelemeden başlatabildim.", en: "I could start what I needed to do without excessive procrastination." } },
  { id: 21, domain: "agency", reverse: false, text: { tr: "Zor duygular gelince tamamen dağılmadan yönetebildim.", en: "When hard emotions came up, I could manage them without falling apart." } },
  { id: 22, domain: "agency", reverse: false, text: { tr: "Kendime verdiğim sözleri çoğunlukla tuttum.", en: "I mostly kept promises I made to myself." } },
  { id: 23, domain: "agency", reverse: false, text: { tr: "Öğrenme/okuma/üretme gibi zihinsel beslenmeler yaptım.", en: "I engaged in mental nourishment like learning/reading/creating." } },
  { id: 24, domain: "agency", reverse: true, text: { tr: "Kendimi kontrol edemiyor gibi hissettim.", en: "I felt like I couldn’t control myself." } },

  { id: 25, domain: "habits", reverse: false, text: { tr: "Sosyal medya/short video gibi şeylerde “kontrol bende”ydi.", en: "With social media/short videos, I felt “I’m in control.”" } },
  { id: 26, domain: "habits", reverse: true, text: { tr: "Dürtüsel tüketim (scroll, atıştırma, alışveriş vb.) günümü ele geçirdi.", en: "Impulsive consumption (scrolling, snacking, shopping, etc.) took over my day." } },
  { id: 27, domain: "habits", reverse: false, text: { tr: "Odak gerektiren bir işe 20–40 dk bloklar halinde girebildim.", en: "I could do 20–40 minute blocks of focused work." } },
  { id: 28, domain: "habits", reverse: false, text: { tr: "Gün içinde küçük “keyif adaları” oluşturdum (müzik, çay, doğa, sohbet).", en: "I created small “joy islands” (music, tea, nature, conversation)." } },
  { id: 29, domain: "habits", reverse: false, text: { tr: "Gün sonunda tatlı bir “tamamladım” hissi vardı.", en: "By the end of the day, I had a satisfying sense of completion." } },
  { id: 30, domain: "habits", reverse: false, text: { tr: "Uyarana kaçmak yerine (telefon vs) sıkılmayı tolere edip sakin kalabildim.", en: "Instead of escaping into stimuli (phone etc.), I could tolerate boredom and stay calm." } },
];

// Micro-actions (bilingual)
const MICRO_ACTIONS = {
  energy: {
    tr: [
      "2 dk: Pencere aç, 10 derin nefes al, omuzlarını gevşet.",
      "10 dk: Kısa yürüyüş + gün ışığı (mümkünse).",
      "Çevre: Yatmadan önce 30 dk ekran kapalı “iniş rutini”.",
    ],
    en: [
      "2 min: Open a window, take 10 deep breaths, relax your shoulders.",
      "10 min: Short walk + daylight (if possible).",
      "Environment: 30 min screen-off wind-down before bed.",
    ],
  },
  meaning: {
    tr: [
      "2 dk: Bugün şükredebileceğin 3 şeyi yaz.",
      "10 dk: Dua/tefekkür veya sakin bir okuma bloğu.",
      "Topluluk: Bu hafta 1 küçük iyilik planla.",
    ],
    en: [
      "2 min: Write 3 gratitude items today.",
      "10 min: Prayer/reflection or a calm reading block.",
      "Community: Plan one small act of kindness this week.",
    ],
  },
  connection: {
    tr: [
      "2 dk: Bir kişiye içten “Nasılsın?” mesajı at.",
      "10 dk: Kısa bir arama planla.",
      "Aidiyet: Bu hafta 1 topluluk buluşması seç.",
    ],
    en: [
      "2 min: Send a sincere “How are you?” message.",
      "10 min: Schedule a short call.",
      "Belonging: Choose one community gathering this week.",
    ],
  },
  agency: {
    tr: [
      "2 dk: Tek bir küçük görev seç ve ilk adımı at.",
      "10 dk: Zamanlayıcı odak bloğu → bitince işaretle.",
      "Büyüme: 1 sayfa oku / küçük bir şey üret.",
    ],
    en: [
      "2 min: Pick one tiny task and do the first step.",
      "10 min: Timer focus block → then mark done.",
      "Growth: Read one page / create something small.",
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

// UI references
const UI = {
  langToggle: document.getElementById("langToggle"),
  resetAll: document.getElementById("resetAll"),

  intro: document.getElementById("view_intro"),
  survey: document.getElementById("view_survey"),
  results: document.getElementById("view_results"),

  title: document.getElementById("ui_title"),
  subtitle: document.getElementById("ui_subtitle"),
  introTitle: document.getElementById("ui_intro_title"),
  introList: document.getElementById("ui_intro_list"),
  privacy: document.getElementById("ui_privacy"),
  disclaimer: document.getElementById("ui_disclaimer"),
  startBtn: document.getElementById("startBtn"),

  domainPill: document.getElementById("ui_domain_pill"),
  counter: document.getElementById("ui_counter"),
  progressBar: document.getElementById("progressBar"),
  question: document.getElementById("ui_question"),
  scaleForm: document.getElementById("scaleForm"),
  backBtn: document.getElementById("backBtn"),
  nextBtn: document.getElementById("nextBtn"),
  hint: document.getElementById("ui_hint"),

  resultsTitle: document.getElementById("ui_results_title"),
  resultsSubtitle: document.getElementById("ui_results_subtitle"),
  totalScore: document.getElementById("ui_total_score"),
  totalLabel: document.getElementById("ui_total_label"),
  subscaleGrid: document.getElementById("subscaleGrid"),
  actionsTitle: document.getElementById("ui_actions_title"),
  actionsList: document.getElementById("actionsList"),
  copyBtn: document.getElementById("copyBtn"),
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

let state = loadState() || {
  lang: qsLang() || "en",
  step: 0,
  started: false,
  answers: {}, // { [id:number]: 0..4 }
};

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

function setUiTexts() {
  UI.title.textContent = t("Yaşama Sevinci Anketi", "Joy of Living Survey");
  UI.subtitle.textContent = t(
    "TR/EN kısa bir öz değerlendirme. Veriler cihazında kalır.",
    "A short bilingual self-reflection survey. No data leaves your device."
  );

  UI.introTitle.textContent = t("Nasıl çalışır?", "How it works");
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
  UI.resetAll.textContent = t("Sıfırla", "Reset");

  UI.backBtn.textContent = t("Geri", "Back");
  UI.hint.textContent = t(
    "İpucu: 1–5 tuşlarıyla hızlı cevapla (1→0, 2→1, 3→2, 4→3, 5→4). Enter: İleri.",
    "Tip: Use number keys 1–5 (1→0, 2→1, 3→2, 4→3, 5→4). Enter: Next."
  );

  UI.resultsTitle.textContent = t("Sonuçların", "Your results");
  UI.resultsSubtitle.textContent = t(
    "Bu sonuçlar anlık bir fotoğraf: güçlü yanlar ve destek isteyen alanlar.",
    "A snapshot of your current “joy of living” signals."
  );
  UI.totalLabel.textContent = t("Toplam (0–100)", "Total (0–100)");
  UI.actionsTitle.textContent = t("Mikro-adımlar (en düşük alanlara göre)", "Micro-actions (based on your lowest areas)");
  UI.copyBtn.textContent = t("Özeti kopyala", "Copy summary");
  UI.retakeBtn.textContent = t("Tekrar çöz", "Retake");
  UI.resultsDisclaimer.textContent = t(
    "Bu araç yalnızca farkındalık içindir; teşhis değildir.",
    "This tool is for reflection only, not diagnosis."
  );

  // Toggle button shows the OTHER language
  UI.langToggle.textContent = (state.lang === "tr") ? "EN" : "TR";
}

function show(view) {
  UI.intro.classList.add("hidden");
  UI.survey.classList.add("hidden");
  UI.results.classList.add("hidden");

  if (view === "intro") UI.intro.classList.remove("hidden");
  if (view === "survey") UI.survey.classList.remove("hidden");
  if (view === "results") UI.results.classList.remove("hidden");
}

function currentQ() {
  return QUESTIONS[state.step];
}

function answeredFor(qId) {
  return typeof state.answers[qId] === "number";
}

function renderScale(q) {
  const scale = SCALE[state.lang];
  const existing = state.answers[q.id];

  UI.scaleForm.innerHTML = scale.map((o, idx) => {
    const id = `q${q.id}_v${o.v}`;
    const selected = (existing === o.v);
    return `
      <label class="option ${selected ? "selected" : ""}" for="${id}">
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
      saveState();

      UI.scaleForm.querySelectorAll(".option").forEach(el => el.classList.remove("selected"));
      const opt = inp.closest(".option");
      if (opt) opt.classList.add("selected");

      updateNav();
    });
  });
}

function updateNav() {
  UI.backBtn.disabled = state.step === 0;

  const q = currentQ();
  const answered = answeredFor(q.id);
  const isLast = state.step === QUESTIONS.length - 1;

  UI.nextBtn.textContent = isLast ? t("Bitir", "Finish") : t("İleri", "Next");
  UI.nextBtn.disabled = !answered;
}

function renderQuestion() {
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
  updateNav();
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

function renderResults() {
  const { total100, sub100 } = computeScores();

  UI.totalScore.textContent = String(total100);

  UI.subscaleGrid.innerHTML = DOMAINS.map(d => {
    const s = sub100[d.key];
    const name = state.lang === "tr" ? d.tr : d.en;
    return `
      <div class="subcard">
        <div class="subtop">
          <div class="subname">${name}</div>
          <div class="subscore">${s}</div>
        </div>
        <div class="bar" aria-label="${name}">
          <div style="width:${s}%"></div>
        </div>
      </div>
    `;
  }).join("");

  const lowest2 = [...DOMAINS]
    .sort((a, b) => sub100[a.key] - sub100[b.key])
    .slice(0, 2);

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

  UI.copyBtn.onclick = () => copySummary(total100, sub100);
}

async function copySummary(total100, sub100) {
  const lines = [];
  lines.push(`${t("Yaşama Sevinci Skoru", "Joy of Living Score")}: ${total100}/100`);
  for (const d of DOMAINS) {
    const name = state.lang === "tr" ? d.tr : d.en;
    lines.push(`- ${name}: ${sub100[d.key]}/100`);
  }
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
    // Fallback
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

function startSurvey() {
  state.started = true;
  saveState();
  show("survey");
  setUiTexts();
  renderQuestion();
}

function finishSurvey() {
  show("results");
  setUiTexts();
  renderResults();
}

function goNext() {
  const isLast = state.step === QUESTIONS.length - 1;
  if (isLast) return finishSurvey();
  state.step = Math.min(QUESTIONS.length - 1, state.step + 1);
  saveState();
  renderQuestion();
}

function goBack() {
  state.step = Math.max(0, state.step - 1);
  saveState();
  renderQuestion();
}

function resetAll() {
  clearState();
  state = {
    lang: qsLang() || "en",
    step: 0,
    started: false,
    answers: {},
  };
  setUiTexts();
  show("intro");
}

function toggleLang() {
  state.lang = (state.lang === "tr") ? "en" : "tr";
  saveState();
  setUiTexts();

  if (!UI.survey.classList.contains("hidden")) {
    renderQuestion();
  } else if (!UI.results.classList.contains("hidden")) {
    renderResults();
  }
}

function bindEvents() {
  UI.startBtn.addEventListener("click", startSurvey);
  UI.backBtn.addEventListener("click", goBack);
  UI.nextBtn.addEventListener("click", goNext);
  UI.resetAll.addEventListener("click", resetAll);
  UI.retakeBtn.addEventListener("click", resetAll);
  UI.langToggle.addEventListener("click", toggleLang);

  // Keyboard support: 1–5 selects answer options quickly, Enter = Next (if answered)
  document.addEventListener("keydown", (e) => {
    if (UI.survey.classList.contains("hidden")) return;

    const k = e.key;

    // number keys 1..5 map to values 0..4
    if (k >= "1" && k <= "5") {
      const map = { "1": 0, "2": 1, "3": 2, "4": 3, "5": 4 };
      const val = map[k];
      const q = currentQ();
      state.answers[q.id] = val;
      saveState();
      renderQuestion();
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
  // If URL has ?lang=tr|en, use it as initial language ONLY if there is no stored state.
  const stored = loadState();
  const ql = qsLang();
  if (!stored && ql) state.lang = ql;

  setUiTexts();

  if (state.started) {
    const allAnswered = QUESTIONS.every(q => answeredFor(q.id));
    if (allAnswered) {
      show("results");
      renderResults();
    } else {
      show("survey");
      renderQuestion();
    }
  } else {
    show("intro");
  }
}

(function init() {
  bindEvents();
  hydrateInitialView();
})();
