// all the guide steps are stored here
const guides = [
  {
    id: "onboarding",
    name: "Onboarding",
    steps: [
      {
        element: "#startTourBtn",
        title: "Welcome to AppDash!",
        description:
          "This button starts the guided tour. You can click it anytime to restart the walkthrough.",
      },
      {
        element: "#stat-active",
        title: "Your live stats",
        description:
          "These cards show real-time numbers like active users, adoption rate, and tasks completed.",
      },
      {
        element: "#nav-users",
        title: "Manage users here",
        description:
          "Click this to go to the Users section where you can add or remove team members.",
      },
      {
        element: "#inp-email",
        title: "Enter user email",
        description:
          "Type the new user's work email here. This will be their login ID on the platform.",
      },
      {
        element: "#btn-submit",
        title: "Create the user",
        description:
          "Click this button to add the user. They will get an invite email right away.",
      },
    ],
  },
  {
    id: "profile-setup",
    name: "Profile Setup",
    steps: [
      {
        element: "#inp-first",
        title: "Your first name",
        description:
          "Start by entering your first name to set up your profile.",
      },
      {
        element: "#inp-last",
        title: "Your last name",
        description: "Add your last name so teammates can find you easily.",
      },
      {
        element: "#inp-role",
        title: "Your role",
        description:
          "Enter your job title. This helps assign the right tasks and permissions to you.",
      },
      {
        element: "#btn-submit",
        title: "Save profile",
        description:
          "Click here to save. Your changes will apply immediately across the platform.",
      },
    ],
  },
];

// keeping track of where we are in the tour
let currentGuide = 0;
let currentStep = 0;
let tourActive = false;
let highlightedEl = null;

// grabbing all the tooltip elements from the DOM
const overlay = document.getElementById("guide-overlay");
const tooltip = document.getElementById("guide-tooltip");
const stepLabel = document.getElementById("tt-step");
const guideName = document.getElementById("tt-guide-name");
const titleEl = document.getElementById("tt-title");
const descEl = document.getElementById("tt-desc");
const dotsEl = document.getElementById("tt-dots");
const nextBtn = document.getElementById("tt-next");
const prevBtn = document.getElementById("tt-prev");
const skipBtn = document.getElementById("tt-skip");
const toast = document.getElementById("toast");

// save and load progress from localStorage
function saveProgress(guideId, step) {
  let progress = JSON.parse(localStorage.getItem("guideProgress") || "{}");
  progress[guideId] = step;
  localStorage.setItem("guideProgress", JSON.stringify(progress));
}

function loadProgress(guideId) {
  let progress = JSON.parse(localStorage.getItem("guideProgress") || "{}");
  return progress[guideId] || 0;
}

function clearProgress(guideId) {
  let progress = JSON.parse(localStorage.getItem("guideProgress") || "{}");
  delete progress[guideId];
  localStorage.setItem("guideProgress", JSON.stringify(progress));
}

// show a small toast message at the bottom
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2800);
}

// remove highlight from the previous element
function removeHighlight() {
  if (highlightedEl) {
    highlightedEl.classList.remove("guide-highlight");
    highlightedEl = null;
  }
}

// draw the progress dots at the bottom of tooltip
function renderDots(total, active) {
  dotsEl.innerHTML = "";
  for (let i = 0; i < total; i++) {
    let dot = document.createElement("div");
    dot.className = "dot" + (i <= active ? " done" : "");
    dotsEl.appendChild(dot);
  }
}

// position the tooltip near the highlighted element
function positionTooltip(el) {
  setTimeout(() => {
    let rect = el.getBoundingClientRect();
    let tipWidth = 290;
    let tipHeight = 210;
    let gap = 14;

    // place it below the element by default
    let top = rect.bottom + gap;
    let left = rect.left + rect.width / 2 - tipWidth / 2;

    // if it goes off the bottom, show it above instead
    if (top + tipHeight > window.innerHeight - 16) {
      top = rect.top - tipHeight - gap;
    }

    // make sure it doesn't go off screen horizontally
    if (left + tipWidth > window.innerWidth - 16)
      left = window.innerWidth - tipWidth - 16;
    if (left < 16) left = 16;

    tooltip.style.top = top + "px";
    tooltip.style.left = left + "px";
  }, 130);
}

// this is the main function - shows a specific step
function showStep(index) {
  let guide = guides[currentGuide];
  let steps = guide.steps;

  // if we've gone past the last step, end the tour
  if (index >= steps.length) {
    endTour(true);
    return;
  }

  if (index < 0) return;

  currentStep = index;
  saveProgress(guide.id, index);

  let step = steps[index];
  let el = document.querySelector(step.element);

  // if element doesn't exist just skip to the next step
  if (!el) {
    console.warn("Element not found:", step.element);
    setTimeout(() => showStep(index + 1), 800);
    return;
  }

  // highlight the element and scroll to it
  removeHighlight();
  el.classList.add("guide-highlight");
  highlightedEl = el;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  positionTooltip(el);

  // update the tooltip content
  stepLabel.textContent = "Step " + (index + 1) + " of " + steps.length;
  guideName.textContent = guide.name;
  titleEl.textContent = step.title;
  descEl.textContent = step.description;

  // hide prev button on first step
  prevBtn.style.visibility = index === 0 ? "hidden" : "visible";

  // change next button text on last step
  nextBtn.textContent = index === steps.length - 1 ? "Finish ✓" : "Next →";

  renderDots(steps.length, index);

  // show the overlay and tooltip
  overlay.classList.add("active");
  tooltip.classList.add("active");
}

// start a tour from the beginning (or resume if saved)
function startTour(guideIndex) {
  if (guideIndex !== undefined) currentGuide = guideIndex;
  tourActive = true;

  let guide = guides[currentGuide];
  let savedStep = loadProgress(guide.id);

  // if they finished before, start fresh
  let startFrom = savedStep >= guide.steps.length ? 0 : savedStep;
  showStep(startFrom);
}

// end the tour and clean everything up
function endTour(finished) {
  removeHighlight();
  overlay.classList.remove("active");
  tooltip.classList.remove("active");
  tourActive = false;

  if (finished) {
    clearProgress(guides[currentGuide].id);
    showToast("🎉 Tour complete! You're all set.");
  }

  // tell app.js the tour ended so it can reset the button
  document.dispatchEvent(new CustomEvent("tourEnded"));
}

// button click events
nextBtn.addEventListener("click", () => showStep(currentStep + 1));
prevBtn.addEventListener("click", () => showStep(currentStep - 1));
skipBtn.addEventListener("click", () => endTour(false));
overlay.addEventListener("click", () => endTour(false));

// keyboard shortcuts for navigating
document.addEventListener("keydown", (e) => {
  if (!tourActive) return;

  if (e.key === "ArrowRight" || e.key === "Enter") {
    e.preventDefault();
    showStep(currentStep + 1);
  }
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    showStep(currentStep - 1);
  }
  if (e.key === "Escape") {
    endTour(false);
  }
});

// expose functions so app.js can use them
window.guideEngine = {
  startTour,
  endTour,
  getState: () => ({ currentGuide, currentStep, tourActive }),
};
