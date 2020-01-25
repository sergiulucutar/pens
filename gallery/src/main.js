import "./style.scss";

import { Power4, TweenLite, TimelineLite } from "gsap";

const animationState = {
  counter: 0,
  updateRate: 10,
  origin: [],
  isTimeToUpdate: () => {
    return animationState.counter++ % animationState.updateRate === 0;
  }
};

function handleMouseEnter(event) {
  const targetBounds = event.target.getBoundingClientRect();
  animationState.origin = [
    targetBounds.x + Math.floor(targetBounds.width / 2),
    targetBounds.y + Math.floor(targetBounds.height / 2)
  ];
}

let offsetX, offsetY;
function handleMouseMove(event) {
  if (!animationState.isTimeToUpdate()) {
    return;
  }

  offsetX = Math.floor((event.clientX - animationState.origin[0]) / 2);
  offsetY = Math.floor((event.clientY - animationState.origin[1]) / 2);

  event.target.children[0].style["transform"] = `rotate(${-offsetX /
    10}deg) translate3d(${offsetX}px, ${offsetY}px, 0)`;
  event.target.children[2].style[
    "transform"
  ] = `translate3d(${-offsetX}px, ${-offsetY}px, 0)`;
  event.target.children[1].style["transform"] = `rotate(${-offsetX /
    2}deg) translate3d(${offsetX}px, ${offsetY}px, 0)`;
}

function handleMouseOut(event) {
  event.target.children[0].style.transform = "";
  event.target.children[1].style.transform = "";
  event.target.children[2].style.transform = "";
  animationState.counter = 0;
}

const pictureAnimationState = {
  filter: 0,
  tweenObj: null,
  lettersTweenObj: null
};
function takeAPicture(event) {
  if (pictureAnimationState.tweenObj) {
    return;
  }

  pictureAnimationState.filter = 20;
  pictureAnimationState.tweenObj = TweenLite.to(pictureAnimationState, 1, {
    filter: 1,
    ease: Power4.easeOut,
    onUpdate: () =>
      (event.target.children[0].style[
        "filter"
      ] = `brightness(${pictureAnimationState.filter})`),
    onComplete: () => {
      pictureAnimationState.tweenObj = null;
    }
  });

  setText(event.target.children[3]);
}

const photoContainers = [...document.querySelectorAll(".photo")];
for (let pc of photoContainers) {
  pc.addEventListener("mouseenter", event => handleMouseEnter(event));
  pc.addEventListener("mousemove", event => handleMouseMove(event));
  pc.addEventListener("mouseout", event => handleMouseOut(event));

  pc.addEventListener("touchstart", event => handleMouseEnter(event));
  pc.addEventListener("touchmove", event => handleMouseMove(event));
  pc.addEventListener("touchend", event => handleMouseOut(event));

  pc.addEventListener("click", event => takeAPicture(event));
}

/**
 * Comic text
 */
const texts = ["KA-CHAAa!!!", "BaZinnggg!!!", "BAAAMMmm!!!"];
const colors = ["#3772FF", "#DF2935", "#FFE66D"];

function setText(el) {
  if (pictureAnimationState.lettersTweenObj) {
    return;
  }

  const text = texts[random(0, 2)];
  let template = "";
  for (let letter of text) {
    template += `<span>${letter}</span>`;
  }

  el.innerHTML = template;
  el.style["color"] = colors[random(0, 2)];

  pictureAnimationState.lettersTweenObj = new TimelineLite({
    onComplete: () => {
      pictureAnimationState.lettersTweenObj = null;
    }
  });
  pictureAnimationState.lettersTweenObj
    .set(el, { classList: "+=show" })
    .set(el, { classList: "" }, 1);
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) - min);
}
