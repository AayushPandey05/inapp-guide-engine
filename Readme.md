# inapp-guide-engine

A lightweight **Digital Adoption Platform (DAP)** built with vanilla HTML, CSS, and JavaScript — inspired by tools like Whatfix and Appcues. It guides users through any web application using step-by-step interactive walkthroughs, contextual tooltips, and element highlighting — with zero dependencies.

---

## Live Demo

[View Live →](https://inapp-guide-engine.heyitsaayush.me/)

---

## Features

- **Guided Walkthroughs** — Step-by-step tours that highlight UI elements and display contextual instructions
- **Dynamic Tooltip Engine** — Tooltips are positioned dynamically using `getBoundingClientRect()` and adapt to screen layout
- **Element Highlighting** — Overlay dims the background and focuses the user on the active element
- **Multi-Flow Support** — Multiple independent onboarding guides (e.g. Onboarding Tour, Profile Setup)
- **Progress Persistence** — User progress is saved via LocalStorage so tours can be resumed across sessions
- **Navigation Controls** — Next, Previous, and Skip buttons for full user control
- **Auto Scroll** — Automatically scrolls to the target element using smooth scrolling
- **Error Handling** — Safely skips steps if the target element is not found in the DOM

---

## Tech Stack

| Technology        | Usage                                        |
| ----------------- | -------------------------------------------- |
| HTML5             | App structure and markup                     |
| CSS3              | Styling, overlay, tooltip layout             |
| JavaScript (ES6+) | Guide engine, DOM manipulation, LocalStorage |

---

## Project Structure

```
inapp-guide-engine/
├── index.html       # Host app UI (dashboard, form, sidebar)
├── style.css        # App styles + overlay + tooltip styles
├── app.js           # App logic, guide selector, navigation
└── guide.js         # Core guide engine (tooltip, highlight, steps)
```

---

## How It Works

1. User opens the app and clicks **Start Tour**
2. The guide engine reads the step definitions from `guide.js`
3. Each step targets a DOM element using a CSS selector
4. The engine highlights the element, scrolls it into view, and renders a tooltip
5. User navigates with Next / Previous / Skip
6. Progress is saved to LocalStorage after every step
7. Tour ends with a completion message

---

## Guide Configuration

Guides are defined as plain JavaScript arrays — easy to extend:

```js
const guides = [
  {
    id: "onboarding",
    name: "Onboarding Tour",
    steps: [
      {
        element: "#startTourBtn",
        title: "Welcome!",
        description: "Click this button anytime to restart a walkthrough."
      },
      {
        element: "#inp-email",
        title: "Email field",
        description: "Enter the user's work email. This will be their login ID."
      }
    ]
  }
];
```

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/AayushPandey05/inapp-guide-engine.git

# Open in browser
cd inapp-guide-engine
open index.html
```

No build steps. No dependencies. Just open and run.

---

## Key Concepts Demonstrated

- Raw DOM manipulation without any framework
- Dynamic element positioning with `getBoundingClientRect()`
- CSS overlay and z-index stacking for focus management
- LocalStorage for client-side state persistence
- Modular JavaScript with separation of concerns

---

## Inspiration

Built as a learning project inspired by enterprise digital adoption platforms like **Whatfix**, **Appcues**, and **WalkMe** — which help users navigate complex software through in-app guidance.

---

## Author

**Aayush Pandey**
[LinkedIn](https://linkedin.com/in/aayushpandey05)
