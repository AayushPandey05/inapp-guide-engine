//! GUIDE DEFINITIONS

const guides = [
  {
    id: "onboarding",
    name: "Onboarding",
    steps: [
      {
        element: "#startTourBtn",
        title: "Welcome to AppDash!",
        description:
          "This is your guide button. Click it anytime to start or restart a walkthrough for any feature in the app.",
      },
      {
        element: "#stat-active",
        title: "Live metrics at a glance",
        description:
          "Your dashboard shows real-time stats — active users, adoption rate, tasks completed, and guides launched.",
      },
      {
        element: "#nav-users",
        title: "Manage your team",
        description:
          "Head here to add, remove, or update roles for any user — all from one central place.",
      },
      {
        element: "#inp-email",
        title: "Email address",
        description:
          "Enter the new user's work email. This becomes their unique login ID across the entire platform.",
      },
      {
        element: "#btn-submit",
        title: "You're all set!",
        description:
          "Hit Create user to finish. They'll instantly receive an invite email with login instructions.",
      },
    ],
  },
  {
    id: "profile-setup",
    name: "Profile Setup",
    steps: [
      {
        element: "#inp-first",
        title: "Enter your first name",
        description:
          "Start by filling in your first name to personalise your profile across the workspace.",
      },
      {
        element: "#inp-last",
        title: "Add your last name",
        description:
          "Your full name helps teammates find you quickly in the directory and mentions.",
      },
      {
        element: "#inp-role",
        title: "Set your role",
        description:
          "Enter your job title. This is used to assign the right tasks, permissions, and guide flows to you.",
      },
      {
        element: "#btn-submit",
        title: "Save your profile",
        description:
          "All done! Click here to save. Your profile updates apply instantly across the platform.",
      },
    ],
  },
];

//! STATE
const state = {
  currentGuide: 0,
  currentStep: 0,
  isActive: false,
  highlightedEl: null,
};

//! DOM REFERENCES
const overlay = document.getElementById("guide-overlay");
const tooltip = document.getElementById("guide-tooltip");
const ttStep = document.getElementById("tt-step");
const ttName = document.getElementById("tt-guide-name");
const ttTitle = document.getElementById("tt-title");
const ttDesc = document.getElementById("tt-desc");
const ttDots = document.getElementById("tt-dots");
const ttNext = document.getElementById("tt-next");
const ttPrev = document.getElementById("tt-prev");
const ttSkip = document.getElementById("tt-skip");
const toast = document.getElementById("toast");

//! LOCALSTORAGE HELPERS
function getProgress() {
  try {
    return JSON.parse(localStorage.getItem("guideProgress") || "{}");
  } catch {
    return {};
  }
}

function saveProgress(guideId, stepIndex) {
  try {
    const progress = getProgress();
    progress[guideId] = stepIndex;
    localStorage.setItem("guideProgress", JSON.stringify(progress));
  } catch (e) {
    console.warn("Could not save progress:", e);
  }
}

function clearProgress(guideId) {
  try {
    const progress = getProgress();
    delete progress[guideId];
    localStorage.setItem("guideProgress", JSON.stringify(progress));
  } catch (e) {
    console.warn("Could not clear progress:", e);
  }
}

//! TOAST
let toastTimer = null;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

//! HIGHLIGHT
function clearHighlight() {
  if (state.highlightedEl) {
    state.highlightedEl.classList.remove("guide-highlight");
    state.highlightedEl = null;
  }
}

function highlightElement(el) {
  clearHighlight();
  el.classList.add("guide-highlight");
  state.highlightedEl = el;
}

//! TOOLTIP POSITIONING
function positionTooltip(el) {
  // Small delay so scroll settles first
  setTimeout(() => {
    const rect = el.getBoundingClientRect();
    const tipW = 290;
    const tipH = 210;
    const gap = 14;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Default: below the element
    let top = rect.bottom + gap;
    let left = rect.left + rect.width / 2 - tipW / 2;

    // Flip above if it goes off the bottom
    if (top + tipH > vh - 16) {
      top = rect.top - tipH - gap;
    }

    // Clamp horizontally
    if (left + tipW > vw - 16) left = vw - tipW - 16;
    if (left < 16) left = 16;

    tooltip.style.top = top + "px";
    tooltip.style.left = left + "px";
  }, 130);
}

//! PROGRESS DOTS
function renderDots(total, current) {
  ttDots.innerHTML = "";
  for (let i = 0; i < total; i++) {
    const dot = document.createElement("div");
    dot.className = "dot" + (i <= current ? " done" : "");
    ttDots.appendChild(dot);
  }
}

//! CORE — SHOW STEP
function showStep(index) {
  const guide = guides[state.currentGuide];
  const steps = guide.steps;

  // Past last step → finish tour
  if (index >= steps.length) {
    endTour(true);
    return;
  }

  // Before first step → do nothing
  if (index < 0) return;

  state.currentStep = index;
  saveProgress(guide.id, index);

  const step = steps[index];
  const el = document.querySelector(step.element);

  // Element missing → warn and skip
  if (!el) {
    console.warn(`[guide.js] Element not found: ${step.element} — skipping`);
    showToast("Element not found, skipping step...");
    setTimeout(() => showStep(index + 1), 900);
    return;
  }

  // Highlight + scroll
  highlightElement(el);
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  positionTooltip(el);

  // Populate tooltip
  ttStep.textContent = `Step ${index + 1} of ${steps.length}`;
  ttName.textContent = guide.name;
  ttTitle.textContent = step.title;
  ttDesc.textContent = step.description;

  // Prev button visibility
  ttPrev.style.visibility = index === 0 ? "hidden" : "visible";

  // Next button label
  ttNext.textContent = index === steps.length - 1 ? "Finish ✓" : "Next →";

  // Progress dots
  renderDots(steps.length, index);

  // Show overlay + tooltip
  overlay.classList.add("active");
  tooltip.classList.add("active");
}

//! CORE — START TOUR
function startTour(guideIndex) {
  if (guideIndex !== undefined) state.currentGuide = guideIndex;

  state.isActive = true;

  const guide = guides[state.currentGuide];
  const savedStep = getProgress()[guide.id] || 0;

  // If previously completed, restart from 0
  const startFrom = savedStep >= guide.steps.length ? 0 : savedStep;

  showStep(startFrom);
}

//! CORE — END TOUR
function endTour(completed = false) {
  clearHighlight();
  overlay.classList.remove("active");
  tooltip.classList.remove("active");
  state.isActive = false;

  if (completed) {
    clearProgress(guides[state.currentGuide].id);
    showToast("🎉 Tour complete! You're all set.");
  }

  // Notify app.js to reset the button
  document.dispatchEvent(
    new CustomEvent("tourEnded", { detail: { completed } }),
  );
}

//! TOOLTIP BUTTON EVENTS
ttNext.addEventListener("click", () => showStep(state.currentStep + 1));
ttPrev.addEventListener("click", () => showStep(state.currentStep - 1));
ttSkip.addEventListener("click", () => endTour(false));
overlay.addEventListener("click", () => endTour(false));

//! KEYBOARD NAVIGATION
document.addEventListener("keydown", (e) => {
  if (!state.isActive) return;

  if (e.key === "ArrowRight" || e.key === "Enter") {
    e.preventDefault();
    showStep(state.currentStep + 1);
  }
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    showStep(state.currentStep - 1);
  }
  if (e.key === "Escape") {
    e.preventDefault();
    endTour(false);
  }
});

//! PUBLIC API (used by app.js)
window.guideEngine = {
  startTour,
  endTour,
  getState: () => state,
  getGuides: () => guides,
};
