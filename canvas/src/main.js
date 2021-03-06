import './main.scss';
import * as THREE from 'three';
import { TimelineLite } from 'gsap';
import { Power4 } from 'gsap/gsap-core';
import { wrap, TweenLite } from 'gsap/src/all';

var camera, scene, renderer;
function setup() {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  scene = new THREE.Scene();

  camera.position.z = 0;
  camera.position.y = 150;
  camera.rotation.x = -Math.PI / 2;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMapEnabled = true;
  renderer.shadowMapSoft = true;

  renderer.shadowMapBias = 0.0039;
  renderer.shadowMapDarkness = 0.5;
  renderer.shadowMapWidth = 2048;
  renderer.shadowMapHeight = 2048;

  document.querySelector('#app').appendChild(renderer.domElement);
}

var planeMesh, boxMesh, planeTexture, object, wrapper;
var planeGeomSize = [400, 200];
function createScene() {
  wrapper = new THREE.Object3D();

  const planeGeom = new THREE.PlaneBufferGeometry(planeGeomSize[0], planeGeomSize[1], 20, 20);
  planeTexture = new THREE.CanvasTexture(canvas);
  planeTexture.minFilter = THREE.LinearFilter;
  const planeMat = new THREE.MeshStandardMaterial({
    map: planeTexture,
    side: THREE.BackSide,
    roughness: 0.4
  });
  planeMesh = new THREE.Mesh(planeGeom, planeMat);

  planeMesh.position.x = 0;
  planeMesh.position.y = -15;
  planeMesh.position.z = 0;
  planeMesh.rotation.x = Math.PI / 2;

  planeMesh.receiveShadow = true;

  // scene.add(planeMesh);
  wrapper.add(planeMesh);

  const boxGeom = new THREE.BoxBufferGeometry(30, 30, 30);
  const boxMat = new THREE.MeshStandardMaterial({
    roughness: 0,
  });
  boxMesh = new THREE.Mesh(boxGeom, boxMat);
  boxMesh.castShadow = true;
  // scene.add(boxMesh);
  wrapper.add(boxMesh);
  scene.add(wrapper);

  //light
  scene.add(new THREE.AmbientLight('white', 0.2));

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);

  directionalLight.position.x = 50;
  directionalLight.position.y = 100;
  directionalLight.position.z = 20;

  directionalLight.castShadow = true;

  directionalLight.shadowCameraLeft = -80;
  directionalLight.shadowCameraRight = 80;
  directionalLight.shadowCameraTop = 80;
  directionalLight.shadowCameraBottom = -80;

  scene.add(directionalLight);
}

// Animations
var a_state = {
  radius: 0,
  height: 0,
  rotation: 0,
  c_circle: 120,
  c_oldHue: 0,
  c_newHue: 0,
  w_scale: 1
};

var box_state = {
  position: [0, 0]
}

// Canvas drawing
var canvas = document.createElement('canvas');
canvas.width = planeGeomSize[0];
canvas.height = planeGeomSize[1];
var ctx = canvas.getContext('2d');

function drawOnCanvas() {
  ctx.clearRect(0, 0, planeGeomSize[0], planeGeomSize[1]);

  ctx.fillStyle = toHSLString(a_state.c_oldHue);
  ctx.beginPath();
  ctx.fillRect(0, 0, planeGeomSize[0], planeGeomSize[1]);

  ctx.beginPath();
  ctx.arc(planeGeomSize[0] / 2, planeGeomSize[1] / 2, a_state.radius, 0, 2 * Math.PI);
  ctx.fillStyle = toHSLString(a_state.c_newHue);
  ctx.fill();
}

// Loop functions
function draw() {
  drawOnCanvas();
  renderer.render(scene, camera);
}

function update() {
  // Jump animation
  boxMesh.position.y = a_state.height;

  if (mouseHolded) {
    const targetX = normalize(box_state.position[0], -1, 1, -50, 50);
    const targetZ = normalize(box_state.position[1], -1, 1, 20, -20);

    boxMesh.position.x += (targetX - boxMesh.position.x) * 0.5;
    boxMesh.position.z += (targetZ - boxMesh.position.z) * 0.5;

    boxMesh.rotation.x += .05;
    boxMesh.rotation.y += .05;
    boxMesh.rotation.z += .05;
  } else {
    boxMesh.rotation.y = a_state.rotation * Math.PI;
    boxMesh.rotation.x = a_state.rotation * Math.PI;
    boxMesh.material.color.setHSL((a_state.c_newHue + (a_state.c_oldHue - a_state.c_newHue) * (1 - a_state.rotation)) / 360, 1, 0.5);
    wrapper.position.y = -(1 - a_state.w_scale) * 20;
  }
}

function loop() {
  requestAnimationFrame(loop);
  update();
  draw();
}

var timeline;
window.onload = function () {
  setup();
  createScene();
  loop();

  timeline = new TimelineLite({ repeat: -1, repeatDelay: 1 });
  timeline
    .set(a_state, {
      onComplete: () => {
        a_state.c_oldHue = a_state.c_newHue;
        a_state.c_newHue = getRandomColor();
      }
    })
    .to(a_state, .5, { height: 100, ease: Power4.easeOut }, 0)
    .to(a_state, .5, { rotation: 1 }, 0)
    .to(a_state, .5, { rotation: 1 }, 0)
    .to(a_state, .5, { height: 0, ease: Power4.easeIn })
    .set(a_state, { w_scale: 0 })
    .to(a_state, .5, { w_scale: 1 })
    .to(a_state, 1, { radius: 300, onUpdate: () => planeTexture.needsUpdate = true }, "-=0.51");
}


function getRandomColor() {
  return Math.floor(Math.random() * 360);
}

function toHSLString(color) {
  return `hsl(${color}, 75%, 50%)`;
}

var mouseHolded = false;
document.addEventListener("mousedown", event => {
  mouseHolded = true;
  if (!timeline.paused()) {
    timeline.pause();
    TweenLite.to(a_state, .5, { height: 100 });
  }

  normalize();
});

document.addEventListener("mouseup", () => {
  mouseHolded = false;
  TweenLite.to(a_state, .5, { height: 0, ease: Power4.easeIn, onComplete: () => timeline.restart() });
});

document.addEventListener("mousemove", event => {
  if (mouseHolded) {
    box_state.position = [-1 + (event.clientX / window.innerWidth) * 2, 1 - (event.clientY / window.innerHeight) * 2];
  }
});

function normalize(v, vmin, vmax, tmin, tmax) {
  var nv = Math.max(Math.min(v, vmax), vmin);
  var dv = vmax - vmin;
  var pc = (nv - vmin) / dv;
  var dt = tmax - tmin;
  var tv = tmin + (pc * dt);
  return tv;

}