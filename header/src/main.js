import "./main.scss";

var headerState = {
  elastic: false
}


const headerEl = document.querySelector("header");
const speechBubbleEl = document.querySelector('.speech-bubble');
const speechBubbleTextEl = document.querySelector(".speech-bubble_text");
const speechBubbleButtonsEl = document.querySelector(".speech-bubble_buttons");

let speechBubbleNextAction = null;

speechBubbleEl.addEventListener('click', () => {
  if (speechBubbleNextAction) {
    speechBubbleNextAction();
  } else {
    speechBubbleEl.classList.remove('show');
  }
});

const writeToScreen = (text, index = 0) => {
  if (index >= text.length) return;
  speechBubbleTextEl.textContent += text[index++]
  setTimeout(() => writeToScreen(text, index), 40);
}

function deliverLine(node) {
  speechBubbleEl.classList.add('show');
  speechBubbleButtonsEl.classList.remove("show");
  speechBubbleTextEl.innerText = '';
  if (node.q) {
    writeToScreen(node.q);
    speechBubbleButtonsEl.classList.add("show");
    speechBubbleButtonsEl.children[0].addEventListener("click", event => {
      event.stopPropagation();
      node.a1();
    });
    speechBubbleButtonsEl.children[1].addEventListener("click", node.a2);
  } else {
    writeToScreen(node.t);
    if (node.cb) {
      speechBubbleNextAction = node.cb;
    }
  }
}

// TEXT
var text = {
  intro: {
    q: "Hei! Hei! am I... am I a boring header?",
    a1: () => {
      // Become angry
      deliverLine(text.introAngry);
      headerEl.classList.add('angry');
    },
    a2: () => {
      console.log("a2");
    }
  },
  introAngry: {
    t: "Ooh ooh, ok, I've been sitting here all day helping people get around, and this is the awenser that I get.",
    cb: () => {
      deliverLine(text.anger);
    }
  },
  anger: {
    t: 'HOW DARE YOU!!!',
    cb: () => {
      deliverLine(text.cool);
      headerEl.classList.remove('angry');
    }
  },
  cool: {
    t: '*heavy breathing* fine, fine... I\'m cool, I\'m fine.',
    cb: () => {
      deliverLine({
        t: 'Well, don\'t mind me.',
        cb: () => deliverLine({
          t: 'After all, it shouldn\'t be that hard, since I\'m so boring, I guess.',
          cb: () => deliverLine({
            t: 'Go ahead, continue, do your stuff. I won\'t be bothering you.',
            cb: () => {
              speechBubbleNextAction = null;
            }
          })
        })
      })
    }
  }
};

deliverLine(text.intro);
