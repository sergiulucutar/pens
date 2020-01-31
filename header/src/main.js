import "./main.scss";

const headerEl = document.querySelector("header");
const speechBubbleEl = document.querySelector(".speech-bubble");
const speechBubbleTextEl = document.querySelector(".speech-bubble_text");
const speechBubbleButtonsEl = document.querySelector(".speech-bubble_buttons");

const emergencyEl = document.querySelector(".emergency");

let speechBubbleNextAction = null;
let isWriting = false;

speechBubbleEl.addEventListener("click", () => {
  if (isWriting) {
    return;
  }
  if (speechBubbleNextAction) {
    speechBubbleNextAction();
  } else {
    speechBubbleEl.classList.remove("show");
  }
});

function closeSpeechBubble() {
  speechBubbleNextAction = null;
  speechBubbleEl.classList.remove("show");
}

const writeToScreen = (text, index = 0, interval = 40) => {
  if (index >= text.length) {
    isWriting = false;
    return;
  };
  if (text[index] === ',') {
    interval = 200;
  } else {
    interval = 40;
  }
  speechBubbleTextEl.textContent += text[index++];

  setTimeout(() => writeToScreen(text, index), interval);
};

function deliverLine(node) {
  speechBubbleEl.classList.add("show");
  speechBubbleButtonsEl.classList.remove("show");
  speechBubbleTextEl.innerText = "";
  isWriting = true;
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
  headerEl.style = `height: ${window.scrollY}px; transform: translateY(${
    window.scrollY
    }px); background-color: hsl(${random(0, 360)}, 70%, 40%)`;

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

function triggerHeaderStuck() {
  headerEl.classList.remove("invisible");
  headerEl.classList.add("stuck");
  headerEl.onclick = () => {
    deliverLine(text.stuck);
    headerEl.onclick = undefined;
    // setTimeout(() => delete, 0);
  };
}

function unstuck() {
  headerEl.classList.remove("stuck");
  emergencyEl.classList.remove("show");
  deliverLine(text.unstack);
}

document.querySelector(".emergency button").addEventListener("click", unstuck);

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
    t:
      "Ooh oh ",
    cb: () => deliverLine({
      t: 'Ok',
      cb: () => {
        headerEl.classList.add("angry");
        deliverLine({
          t: 'I\'ve been sitting here all day helping people get around, and this is the awenser that I get.',
          cb: () => {
            deliverLine(text.anger);
            headerEl.classList.add("shake");
          }
        })
      }
    })
  },
  anger: {
    t: "HOW DARE YOU!!!",
    cb: () => {
      deliverLine(text.cool);
      headerEl.classList.remove("shake");
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
              "After all, it shouldn't be that hard, since I'm so boooooring, I guess.",
            cb: () =>
              deliverLine({
                t:
                  "Go ahead, continue, do your stuff. I won't be bothering you.",
                cb: () => {
                  closeSpeechBubble()
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
        t: "You cannot see the content?",
        cb: () =>
          deliverLine({
            t: "I'm sorry",
            cb: () => deliverLine({
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
                                  t: "Good bye."
                                });
                                setTimeout(() => closeSpeechBubble(), 2000);
                                setTimeout(() => {
                                  triggerHeaderStuck();
                                }, 5000);
                              }
                            })
                        })
                    })
                })
            })
          })
      })
  },
  stuck: {
    t: "I'm stuck.",
    cb: () =>
      deliverLine({
        t: "God, this is embarrassing...",
        cb: () => {
          emergencyEl.classList.add("show");
          deliverLine({
            t: "Will you press the EMERGENCY button?",
            cb: () => {
              deliverLine({
                t: "Please?",
                cb: () => closeSpeechBubble()
              });
            }
          })
        }
      })
  },
  unstack: {
    t: "oh...",
    cb: () =>
      deliverLine({
        t: "thanks, for helping me",
        cb: () =>
          deliverLine({
            t: "and, yeah, i know",
            cb: () =>
              deliverLine({
                t: "I've been a rude <header>.",
                cb: () => closeSpeechBubble()
              })
          })
      })
  }
};

deliverLine(text.intro);

function random(min = 0, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
