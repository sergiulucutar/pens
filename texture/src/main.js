import "./main.scss";

function drawPattern(el, pattern, color) {
  const canvas = el.querySelector("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = el.offsetWidth;
  canvas.height = el.offsetHeight;

  ctx.font = "42px Arial";
  ctx.fillStyle = color;

  for (let i = 0; i <= el.offsetWidth + 200; i += 100) {
    for (let j = -100; j <= el.offsetHeight + 100; j += 40) {
      ctx.fillText(pattern, i, j);
    }
  }
}

// Screem #1
drawPattern(
  document.querySelector(
    "body > section:nth-of-type(1) .bubble:nth-of-type(1)"
  ),
  "vvv",
  "#101010"
);

// Screen #2
drawPattern(
  document.querySelector(
    "body > section:nth-of-type(2) .bubble:nth-of-type(1)"
  ),
  "vvv",
  "white"
);

// Screen #4
drawPattern(
  document.querySelector(
    "body > section:nth-of-type(4) .bubble:nth-of-type(1)"
  ),
  "_-_",
  "yellow"
);
