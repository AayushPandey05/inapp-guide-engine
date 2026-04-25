// grabbing all the elements i need
const startTourBtn = document.getElementById("startTourBtn");
const guideChips = document.querySelectorAll(".guide-chip");
const sidebarItems = document.querySelectorAll(".sidebar-item");
const exportBtn = document.getElementById("btn-export");
const submitBtn = document.getElementById("btn-submit");

const firstInput = document.getElementById("inp-first");
const lastInput = document.getElementById("inp-last");
const emailInput = document.getElementById("inp-email");
const roleInput = document.getElementById("inp-role");

// show toast (reusing the same one from guide.js)
function showToast(msg) {
  let toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2800);
}

// update the start tour button look
function setTourBtn(active) {
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

// start or stop the tour when button is clicked
startTourBtn.addEventListener("click", () => {
  let state = window.guideEngine.getState();

  if (state.tourActive) {
    window.guideEngine.endTour(false);
    setTourBtn(false);
  } else {
    window.guideEngine.startTour(state.currentGuide);
    setTourBtn(true);
  }
});

// reset button when tour ends from inside guide.js
document.addEventListener("tourEnded", () => {
  setTourBtn(false);
});

// switching between guides using the chips
guideChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    let guideIndex = parseInt(chip.getAttribute("data-guide"));
    let state = window.guideEngine.getState();

    // update which chip looks selected
    guideChips.forEach((c) => c.classList.remove("selected"));
    chip.classList.add("selected");

    // update current guide in the engine
    state.currentGuide = guideIndex;

    // if tour is running, switch to new guide right away
    if (state.tourActive) {
      window.guideEngine.startTour(guideIndex);
    }
  });
});

// sidebar active item switching
sidebarItems.forEach((item) => {
  item.addEventListener("click", () => {
    sidebarItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
  });
});

// export button just shows a toast for now
exportBtn.addEventListener("click", () => {
  showToast("📄 Report exported successfully!");
});

// highlight an input red if validation fails
function showError(input) {
  input.style.borderColor = "#dc2626";
  input.style.boxShadow = "0 0 0 3px rgba(220, 38, 38, 0.1)";
  setTimeout(() => {
    input.style.borderColor = "";
    input.style.boxShadow = "";
  }, 2000);
}

// basic email format check
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// form submit
submitBtn.addEventListener("click", () => {
  let first = firstInput.value.trim();
  let last = lastInput.value.trim();
  let email = emailInput.value.trim();
  let role = roleInput.value.trim();

  // check each field one by one
  if (!first) {
    showError(firstInput);
    showToast("⚠️ First name is required.");
    return;
  }
  if (!last) {
    showError(lastInput);
    showToast("⚠️ Last name is required.");
    return;
  }
  if (!email) {
    showError(emailInput);
    showToast("⚠️ Email is required.");
    return;
  }
  if (!isValidEmail(email)) {
    showError(emailInput);
    showToast("⚠️ Enter a valid email.");
    return;
  }
  if (!role) {
    showError(roleInput);
    showToast("⚠️ Role is required.");
    return;
  }

  // all good, clear the form and show success
  firstInput.value = "";
  lastInput.value = "";
  emailInput.value = "";
  roleInput.value = "";

  showToast("✓ " + first + " " + last + " added successfully!");
});
