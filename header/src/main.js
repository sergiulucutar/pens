import "./main.scss";

var headerState = {
  elastic: false
};

const headerEl = document.querySelector("header");
const speechBubbleEl = document.querySelector(".speech-bubble");
const speechBubbleTextEl = document.querySelector(".speech-bubble_text");
const speechBubbleButtonsEl = document.querySelector(".speech-bubble_buttons");

let speechBubbleNextAction = null;

speechBubbleEl.addEventListener("click", () => {
  if (speechBubbleNextAction) {
    speechBubbleNextAction();
  } else {
    speechBubbleEl.classList.remove("show");
  }
});

const writeToScreen = (text, index = 0) => {
  if (index >= text.length) return;
  speechBubbleTextEl.textContent += text[index++];
  setTimeout(() => writeToScreen(text, index), 40);
};

function deliverLine(node) {
  speechBubbleEl.classList.add("show");
  speechBubbleButtonsEl.classList.remove("show");
  speechBubbleTextEl.innerText = "";
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

function cb_handleElasticHeader() {
  headerEl.style = `height: ${window.scrollY}px; transform: translateY(${window.scrollY}px)`;

  if (headerEl.offsetHeight > window.innerHeight * 0.7) {
    deliverLine(text.invisible);
    headerEl.classList.remove("elastic");
    document.removeEventListener("scroll", cb_handleElasticHeader);
  }
}

// Header states
function handleElasticHeader() {
  headerEl.classList.add("elastic");
  document.addEventListener("scroll", cb_handleElasticHeader);
}

// TEXT
var text = {
  intro: {
    q: "Hei! Hei! am I... am I a boring header?",
    a1: () => {
      // Become angry
      deliverLine(text.introAngry);
      headerEl.classList.add("angry");
    },
    a2: () => {
      console.log("a2");
    }
  },
  introAngry: {
    t:
      "Ooh ooh, ok, I've been sitting here all day helping people get around, and this is the awenser that I get.",
    cb: () => {
      deliverLine(text.anger);
    }
  },
  anger: {
    t: "HOW DARE YOU!!!",
    cb: () => {
      deliverLine(text.cool);
      headerEl.classList.remove("angry");
    }
  },
  cool: {
    t: "*heavy breathing* fine, fine... I'm cool, I'm fine.",
    cb: () => {
      deliverLine({
        t: "Well, don't mind me.",
        cb: () =>
          deliverLine({
            t:
              "After all, it shouldn't be that hard, since I'm so boring, I guess.",
            cb: () =>
              deliverLine({
                t:
                  "Go ahead, continue, do your stuff. I won't be bothering you.",
                cb: () => {
                  speechBubbleNextAction = null;
                  handleElasticHeader();
                }
              })
          })
      });
    }
  },
  invisible: {
    t: "What?",
    cb: () =>
      deliverLine({
        t: "You cannot see the content? I'm sorry",
        cb: () =>
          deliverLine({
            t: "I just wanted to be more, you know...",
            cb: () =>
              deliverLine({
                t: '"...entertaining!"',
                cb: () =>
                  deliverLine({
                    t: "But fine.",
                    cb: () =>
                      deliverLine({
                        t: "I'll use my power of invisibility.",
                        cb: () =>
                          deliverLine({
                            t: "You'll never see me again.",
                            cb: () => {
                              headerEl.style = "";
                              headerEl.classList.add("invisible");
                              deliverLine({
                                t: "Goob bye."
                              });
                            }
                          })
                      })
                  })
              })
          })
      })
  }
};

deliverLine(text.intro);
