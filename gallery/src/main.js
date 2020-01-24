import "./style.scss";

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

const photoContainers = [...document.querySelectorAll(".photo")];

for (let pc of photoContainers) {
  pc.addEventListener("mouseenter", event => handleMouseEnter(event));
  pc.addEventListener("mousemove", event => handleMouseMove(event));
  pc.addEventListener("mouseout", event => handleMouseOut(event));

  pc.addEventListener("touchstart", event => handleMouseEnter(event));
  pc.addEventListener("touchmove", event => handleMouseMove(event));
  pc.addEventListener("touchend", event => handleMouseOut(event));
}
