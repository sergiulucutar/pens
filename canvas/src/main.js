import './main.scss';
import * as THREE from 'three';

var camera, scene, renderer;
function setup() {
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
  scene = new THREE.Scene();

  // camera.position.y = 20;
  camera.position.z = 100;
  camera.rotation.z = Math.PI / 4;

  renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.querySelector('#app').appendChild( renderer.domElement );
}

var planeMesh, boxMesh;
function createScene() {
  const planeGeom = new THREE.PlaneGeometry(400, 200, 20);
  const planeMat = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide
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

setup();
createScene();

function loop() {
  requestAnimationFrame(loop);

  boxMesh.rotation.y += 0.01;
  renderer.render(scene, camera);
}

loop();
