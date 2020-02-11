import "./main.scss";

// Screem #1
// const sc1 = document.querySelector("body > div:nth-of-type(1)");
// const sc1_canvas = document.createElement("canvas");
// const sc1_ctx = sc1_canvas.getContext("2d");
// sc1_canvas.width = 200;
// sc1_canvas.height = 200;
// sc1_ctx.fillStyle = "#071E22";
// sc1_ctx.fillRect(0, 0, 200, 200);
// sc1_ctx.fillStyle = "#212121";
// for (let i = 0; i < 100; i++) {
//   sc1_ctx.beginPath();
//   sc1_ctx.arc(
//     Math.floor(Math.random() * 200),
//     Math.floor(Math.random() * 200),
//     Math.random() * 1.5,
//     0,
//     2 * Math.PI
//   );
//   sc1_ctx.fill();
// }
// sc1.style.background = `url(${sc1_canvas.toDataURL()})`;

// Screen #3
const sc3_canvas = document.querySelector("body > div:nth-of-type(3) canvas");
const sc3_ctx = sc3_canvas.getContext("2d");

function sc1_draw() {
  sc3_ctx.font = "30px Arial";
  sc3_ctx.fillStyle = "white";
  // sc3_ctx.fillText("texture", 0, 30);
  // sc3_ctx.fillText("texture", 116, 30);

  for (let i = 0; i <= window.innerWidth; i += 92) {
    for (let j = 0; j <= window.innerHeight; j += 30) {
      sc3_ctx.fillText("texture", i, j);
    }
  }
}

function resize() {
  sc3_canvas.width = window.innerWidth;
  sc3_canvas.height = window.innerHeight;
}

resize();
sc1_draw();
