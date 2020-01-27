import "./main.scss";

const headerEl = document.querySelector("header");
const speechBubbleTextEl = document.querySelector(".speech-bubble_text");
const speechBubbleButtonsEl = document.querySelector(".speech-bubble_buttons");

function deliverLine(node) {
  speechBubbleButtonsEl.classList.remove("show");
  if (node.q) {
    speechBubbleTextEl.innerText = node.q;
    speechBubbleButtonsEl.classList.add("show");
    speechBubbleButtonsEl.children[0].addEventListener("click", node.a1);
    speechBubbleButtonsEl.children[1].addEventListener("click", node.a2);
  } else {
    speechBubbleTextEl.innerText = node.t;
  }
}

// TEXT
var text = {
  intro: {
    q: "Hei! Hei! am I... am I a boring header?",
    a1: () => {
      // Become angry
      deliverLine(text.introAngry);
    },
    a2: () => {
      console.log("a2");
    }
  },
  introAngry: {
    t: "HOW DARE YOU!!!"
  }
};

deliverLine(text.intro);
