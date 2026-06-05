//? INTERVIEW QUESTION 1: “Can you highlight the Start Tour button dynamically using JS?”
//? Do: select button, change bgColor, add border, maybe scale/padding

// let btn = document.querySelector("#startTourBtn");
// btn.style.backgroundColor = "#111111";
// btn.style.border = "2px solid red";
// btn.style.scale = "1.1";
// btn.style.padding = "5px";
// btn.style.paddingTop = "10px";
// btn.style.paddingLeft = "10px";

//? INTERVIEW QUESTION 2: Can you dynamically create a new button using JavaScript, set its text to ‘Next Step’,
//? style it with black background and white text, and append it inside the hero section?
//? Use only: createElement, textContent, style, append/appendChild, selectors
// let btn = document.createElement("button");
// btn.textContent = "Next Step";
// btn.style.color = "red";
// btn.style.backgroundColor = "#111111";
// btn.style.position = "relative";
// btn.style.left = "20px";
// document.querySelector(".test").append(btn);

//? INTERVIEW QUESTION 3: “Create a new notification message dynamically saying: ‘Tour Started Successfully ✅’ and
//? append it at the TOP of navbar with:

// let msg = document.createElement("span");
// msg.textContent = "Tour Started Successfully ✅";
// msg.style.color = "#111111";
// msg.style.marginLeft = "200px";
// document.querySelector(".breadcrumb").append(msg);

//? INTERVIEW QUESTION 4: “Create a new paragraph dynamically below: ‘Welcome back, Aayush...’ with text: ‘Complete your onboarding to unlock all features.’

// let msg = document.createElement("p");
// msg.textContent = "Complete your onboarding to unlock all features.";
// msg.style.color = "grey";
// msg.style.fontSize = "10px";
// msg.style.marginTop = "5px";
// document.querySelector(".para").append(msg);

//? INTERVIEW QUESTION 5: We want to visually highlight dashboard insights for users.

// let card = document.querySelector("#stat-active");
// first card styling
// card.style.backgroundColor = "#111111";
// card.style.color = "#ffffff";

// all labels uppercase
// let labels = document.querySelectorAll(".stat-label");
// labels.forEach(function (elem) {
//   elem.textContent = elem.textContent.toLowerCase();
// });

// guides launched count update
// let guidesCard = document.querySelector("#stat-guides");
// let count = guidesCard.querySelector(".stat-num");
// count.textContent = "40";

//? INTERVIEW QUESTION 6: change the color of main page
// let d = document.querySelector(".main");
// d.addEventListener("click", function () {
//   d.style.background = "red";
// });
// d.addEventListener("dblclick", function () {
//   d.style.background = "";
// });

//? INTERVIEW QUESTION 7: Chnge the tex and color of Create User when clicked
// let btn = document.querySelector("#btn-submit");
// btn.addEventListener("click", function () {
//   btn.textContent = "Creating....";
//   btn.style.color = "Yellow";
//   btn.style.backgroundColor = "Grey";
// });

//? INTERVIEW QUESTION 8: When the Start Tour button is clicked: Change its text to: Tour Running...
// let btn = document.querySelector("#startTourBtn");
// btn.addEventListener("click", function () {
//   btn.textContent = "Tour Running...";
//   btn.style.color = "#ffffff";
//   btn.style.backgroundColor = "blue";
// });
// btn.addEventListener("dblclick", function () {
//   btn.textContent = "Start Tour";
//   btn.style.color = "";
//   btn.style.backgroundColor = "";
// });
