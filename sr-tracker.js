// =======================
// STATE
// =======================
let currentSR = null;
let startingSR = null;
let totalSRGained = 0;

// =======================
// CONSTANTS
// =======================
const STORAGE_KEY = "warzone_currentSR";

const RANKS = [
  { sr: 0, name: "Bronze 1", class: "bronze" },
  { sr: 300, name: "Bronze 2", class: "bronze" },
  { sr: 600, name: "Bronze 3", class: "bronze" },
  { sr: 900, name: "Silver 1", class: "silver" },
  { sr: 1300, name: "Silver 2", class: "silver" },
  { sr: 1700, name: "Silver 3", class: "silver" },
  { sr: 2100, name: "Gold 1", class: "gold" },
  { sr: 2600, name: "Gold 2", class: "gold" },
  { sr: 3100, name: "Gold 3", class: "gold" },
  { sr: 3600, name: "Platinum 1", class: "platinum" },
  { sr: 4200, name: "Platinum 2", class: "platinum" },
  { sr: 4800, name: "Platinum 3", class: "platinum" },
  { sr: 5400, name: "Diamond 1", class: "diamond" },
  { sr: 6100, name: "Diamond 2", class: "diamond" },
  { sr: 6800, name: "Diamond 3", class: "diamond" },
  { sr: 7500, name: "Crimson 1", class: "crimson" },
  { sr: 8300, name: "Crimson 2", class: "crimson" },
  { sr: 9100, name: "Crimson 3", class: "crimson" },
  { sr: 10000, name: "Iridescent", class: "iridescent" }
];

// =======================
// COUNTDOWN TARGET (UTC)
// 9:00 AM PT on March 12, 2026
// PT is UTC-7 on this date → 16:00 UTC
// =======================
const TARGET_DATE_UTC = Date.UTC(2026, 3, 2, 16, 0, 0);
// month is 0-based → 3 = April

// =======================
// DOM CACHE
// =======================
const el = {
  startingSR: document.getElementById("startingSR"),
  changeSR: document.getElementById("changeSR"),
  rankName: document.getElementById("rankName"),
  rankSR: document.getElementById("rankSR"),
  progressBar: document.getElementById("progressBar"),
  progressText: document.getElementById("progressText"),
  progressContainer: document.getElementById("progressContainer"),
  rankDisplay: document.getElementById("rankDisplay"),
  setSRSection: document.getElementById("setSRSection"),
  adjustSRSection: document.getElementById("adjustSRSection"),
  resetButton: document.getElementById("resetButton"),
  totalSRDisplay: document.getElementById("totalSRDisplay"),
  countdownTimer: document.getElementById("countdownTimer"),
  countdownText: document.getElementById("countdownText"),
  srPerDayText: document.getElementById("srPerDayText")
  
};

// =======================
// SR ACTIONS
// =======================
function setStartingSR() {
  const sr = parseInt(el.startingSR.value);
  if (isNaN(sr)) return;

  startingSR = currentSR = sr;
  totalSRGained = 0;

  localStorage.setItem(STORAGE_KEY, currentSR);

  updateDisplay();
  showTrackerUI();
}

function updateSR() {
  const change = parseInt(el.changeSR.value);
  if (isNaN(change)) return;

  currentSR += change;
  totalSRGained = currentSR - startingSR;

  // Save updated values
  localStorage.setItem("currentSR", currentSR);

  el.changeSR.value = "";
  el.totalSRDisplay.textContent = `Total SR Gained: ${totalSRGained}`;

  updateDisplay();
}

function resetTracker() {
  currentSR = startingSR = totalSRGained = null;

  // Clear all stored SR data
  localStorage.removeItem(STORAGE_KEY);

  el.startingSR.value = "";
  el.changeSR.value = "";

  el.setSRSection.classList.remove("hidden");
  el.adjustSRSection.classList.add("hidden");
  el.rankDisplay.classList.add("hidden");
  el.progressContainer.classList.add("hidden");
  el.progressText.classList.add("hidden");
  el.resetButton.classList.add("hidden");
  el.totalSRDisplay.classList.add("hidden");

  el.progressBar.style.width = "0%";
  el.progressBar.className = "progress-bar";
}

// =======================
// DISPLAY
// =======================
function updateDisplay() {
  const rank = getRank(currentSR);
  const prev = getPreviousRank(currentSR);
  const next = getNextRank(currentSR);

  el.rankName.textContent = rank.name.toUpperCase();
  el.rankName.className = `rank-name ${rank.class}`;
  el.rankSR.textContent = currentSR;

  const range = next.sr - prev.sr;
  const progress = range === 0 ? 100 : ((currentSR - prev.sr) / range) * 100;

  el.progressBar.style.width = `${Math.min(progress, 100)}%`;
  el.progressBar.className = `progress-bar ${rank.class}`;

  el.progressText.textContent =
    `${Math.max(0, next.sr - currentSR)} SR to ${next.name}`;
}

// =======================
// RANK HELPERS
// =======================
function getRank(sr) {
  return [...RANKS].reverse().find(r => sr >= r.sr);
}

function getPreviousRank(sr) {
  return [...RANKS].reverse().find(r => sr >= r.sr);
}

function getNextRank(sr) {
  return RANKS.find(r => sr < r.sr) || RANKS[RANKS.length - 1];
}

// =======================
// UI HELPERS
// =======================
function showTrackerUI() {
  el.setSRSection.classList.add("hidden");
  el.adjustSRSection.classList.remove("hidden");
  el.rankDisplay.classList.remove("hidden");
  el.progressContainer.classList.remove("hidden");
  el.progressText.classList.remove("hidden");
  el.resetButton.classList.remove("hidden");
  el.totalSRDisplay.classList.remove("hidden");
  el.totalSRDisplay.textContent = "Total SR Gained: 0";
}

// =======================
// COUNTDOWN (UTC-SAFE)
// =======================
function startCountdown() {
  if (!el.countdownTimer || !el.countdownText || !el.srPerDayText) return;

  const pad = n => String(n).padStart(2, "0");

  const tick = () => {
    const now = Date.now();               // UTC
    const diff = TARGET_DATE_UTC - now;   // ms

    if (diff <= 0) {
      el.countdownTimer.classList.add("hidden");
      el.srPerDayText.textContent = "";
      return;
    }

    el.countdownTimer.classList.remove("hidden");

    // ---- TIME BREAKDOWN ----
    const totalDays = diff / 86400000; // fractional days
    const d = Math.floor(totalDays);
    const h = Math.floor((diff / 3600000) % 24);
    const m = Math.floor((diff / 60000) % 60);
    const s = Math.floor((diff / 1000) % 60);

    el.countdownText.textContent =
      `${d}D ${pad(h)}H ${pad(m)}M ${pad(s)}S`;

    // ---- SR PER DAY ----
    if (currentSR === null) {
      el.srPerDayText.textContent = "";
      return;
    }

    const next = getNextRank(currentSR);
    const remainingSR = 10000 - currentSR;

    if (remainingSR <= 0) {
      el.srPerDayText.textContent =
        ` `;
      return;
    }

    const srPerDay = Math.ceil(remainingSR / totalDays);

    el.srPerDayText.innerHTML =
      `SR needed per day to reach Iridescent: <span class="sr-number">${srPerDay}</span>`;
  };

  tick();
  setInterval(tick, 1000);
}

// =======================
// INIT
// =======================
window.onload = () => {
const savedCurrentSR = localStorage.getItem(STORAGE_KEY);

if (savedCurrentSR !== null) {
  currentSR = parseInt(savedCurrentSR);

  // Reset session tracking
  startingSR = currentSR;
  totalSRGained = 0;

    updateDisplay();
    showTrackerUI();
    el.changeSR.focus();
  } else {
    el.startingSR.focus();
  }

  el.startingSR?.addEventListener("keydown", e => e.key === "Enter" && setStartingSR());
  el.changeSR?.addEventListener("keydown", e => e.key === "Enter" && updateSR());

  startCountdown();
};
