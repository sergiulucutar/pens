import './main.scss';
import * as THREE from 'three';
import { TimelineLite } from 'gsap';
import { Power4 } from 'gsap/gsap-core';

var camera, scene, renderer;
function setup() {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  scene = new THREE.Scene();

  // camera.position.y = 20;
  camera.position.z = 100;
  camera.rotation.z = Math.PI / 4;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.querySelector('#app').appendChild(renderer.domElement);
}

var planeMesh, boxMesh, planeTexture;
var planeGeomSize = [400, 200];
function createScene() {
  const planeGeom = new THREE.PlaneGeometry(400, 200, 20);
  planeTexture = new THREE.CanvasTexture(canvas);
  planeTexture.minFilter = THREE.LinearFilter;
  const planeMat = new THREE.MeshBasicMaterial({
    map: planeTexture,
    side: THREE.BackSide
  });
  planeMesh = new THREE.Mesh(planeGeom, planeMat);

  planeMesh.position.x = 0;
  planeMesh.position.y = -10;
  planeMesh.position.z = 0;

  planeMesh.rotation.x = Math.PI / 2;

  scene.add(planeMesh);


  const boxGeom = new THREE.BoxGeometry(20, 20, 20);
  const boxMat = new THREE.MeshBasicMaterial({
    color: 'black'
  });
  boxMesh = new THREE.Mesh(boxGeom, boxMat);
  scene.add(boxMesh);
}

// Animations
var a_state = {
  radius: 0,
  height: 0,
  rotation: 0
};

// Canvas drawing
var canvas = document.createElement('canvas');
canvas.width = planeGeomSize[0];
canvas.height = planeGeomSize[1];
var ctx = canvas.getContext('2d');

function drawOnCanvas() {
  ctx.clearRect(0, 0, planeGeomSize[0], planeGeomSize[1]);

  ctx.beginPath();
  ctx.arc(planeGeomSize[0] / 2, planeGeomSize[1] / 2, a_state.radius, 0, 2 * Math.PI);
  ctx.fillStyle = 'blue';
  ctx.fill();
  ctx.strokeStyle = 'white';
  ctx.stroke();
}

// Loop functions
function draw() {
  drawOnCanvas();
  renderer.render(scene, camera);
}

function update() {
  boxMesh.position.y = a_state.height;
  boxMesh.rotation.y = a_state.rotation * 2 * Math.PI;
}

function loop() {
  requestAnimationFrame(loop);
  update();
  draw();
}


window.onload = function () {
  setup();
  createScene();
  loop();

  const timeline = new TimelineLite({ repeat: -1, repeatDelay: 1 });
  timeline
    .to(a_state, .5, { height: 80, ease: Power4.easeOut })
    .to(a_state, .5, { rotation: 1 }, 0)
    .to(a_state, .5, { height: 0, ease: Power4.easeIn })
    .to(a_state, 2, { radius: 200, onUpdate: () => planeTexture.needsUpdate = true });
}