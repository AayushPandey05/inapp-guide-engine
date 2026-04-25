//! DOM REFERENCES
const startTourBtn = document.getElementById("startTourBtn");
const guideChips = document.querySelectorAll(".guide-chip");
const sidebarItems = document.querySelectorAll(".sidebar-item");
const exportBtn = document.getElementById("btn-export");
const submitBtn = document.getElementById("btn-submit");

const inputs = {
  first: document.getElementById("inp-first"),
  last: document.getElementById("inp-last"),
  email: document.getElementById("inp-email"),
  role: document.getElementById("inp-role"),
};

//! HELPERS
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2800);
}

function setTourBtnActive(active) {
  if (active) {
    startTourBtn.classList.add("active");
    startTourBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.5"/>
        <path d="M5 5l4 4M9 5l-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      Exit tour
    `;
  } else {
    startTourBtn.classList.remove("active");
    startTourBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.5"/>
        <path d="M7 4v3l2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      Start tour
    `;
  }
}

//! START TOUR BUTTON
startTourBtn.addEventListener("click", () => {
  const { isActive, currentGuide } = window.guideEngine.getState();

  if (isActive) {
    window.guideEngine.endTour(false);
    setTourBtnActive(false);
  } else {
    window.guideEngine.startTour(currentGuide);
    setTourBtnActive(true);
  }
});

//! Reset button when tour ends from tooltip (skip / finish / overlay click)
document.addEventListener("tourEnded", () => {
  setTourBtnActive(false);
});

//! GUIDE CHIP SELECTOR
guideChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const guideIndex = parseInt(chip.getAttribute("data-guide"), 10);
    const state = window.guideEngine.getState();

    // Update chip UI
    guideChips.forEach((c) => c.classList.remove("selected"));
    chip.classList.add("selected");

    // Update state
    state.currentGuide = guideIndex;

    // If tour already running, switch to new guide immediately
    if (state.isActive) {
      window.guideEngine.startTour(guideIndex);
    }
  });
});

//! SIDEBAR NAVIGATION
sidebarItems.forEach((item) => {
  item.addEventListener("click", () => {
    sidebarItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
  });
});

//! EXPORT BUTTON
exportBtn.addEventListener("click", () => {
  showToast("📄 Report exported successfully!");
});

//! CREATE USER FORM
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clearForm() {
  Object.values(inputs).forEach((inp) => (inp.value = ""));
}

function highlightError(input) {
  input.style.borderColor = "#dc2626";
  input.style.boxShadow = "0 0 0 3px rgba(220, 38, 38, 0.1)";
  setTimeout(() => {
    input.style.borderColor = "";
    input.style.boxShadow = "";
  }, 2000);
}

submitBtn.addEventListener("click", () => {
  const first = inputs.first.value.trim();
  const last = inputs.last.value.trim();
  const email = inputs.email.value.trim();
  const role = inputs.role.value.trim();

  // Validate — highlight offending field
  if (!first) {
    highlightError(inputs.first);
    showToast("⚠️ First name is required.");
    return;
  }
  if (!last) {
    highlightError(inputs.last);
    showToast("⚠️ Last name is required.");
    return;
  }
  if (!email) {
    highlightError(inputs.email);
    showToast("⚠️ Email is required.");
    return;
  }
  if (!validateEmail(email)) {
    highlightError(inputs.email);
    showToast("⚠️ Enter a valid email address.");
    return;
  }
  if (!role) {
    highlightError(inputs.role);
    showToast("⚠️ Role is required.");
    return;
  }

  // Success
  console.log("New user created:", { first, last, email, role });
  clearForm();
  showToast(`✓ ${first} ${last} added successfully!`);
});

//! INIT
console.log(
  "%c inapp-guide-engine ",
  "background:#16a34a;color:#fff;font-weight:600;border-radius:4px;padding:2px 6px;",
);
console.log("Guide engine ready. Click 'Start tour' to begin.");
