<template>
  <div></div>
</template>

<script setup>
import { defineComponent, onMounted, ref } from "vue";
import {
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  AxesHelper,
  MeshLambertMaterial,
  PlaneGeometry,
  Mesh,
  BoxGeometry,
  SphereGeometry,
  SpotLight,
  AmbientLight,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import * as THREE from "three";

import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import console from "console";


const api = { state: "Walking" };

let container, stats, clock, gui, mixer, actions, activeAction, previousAction;
let camera, scene, renderer, model, face;

// 监听键盘是否按下,控制人物移动
let keyCodeW = false;
let keyCodeS = false;
let keyCodeA = false;
let keyCodeD = false;
let keyCodeK = false; // 攻击


function init() {

  document.addEventListener(
    "keydown",
    (e) => {
      var ev = e || window.event;
      switch (ev.keyCode) {
        case 87:
          keyCodeW = true;
          frontMove()
          break;
        case 83:
          keyCodeS = true;
          backMove()
          break;
        case 65:
          keyCodeA = true;
          leftMove()
          break;
        case 68:
          keyCodeD = true;
          break;
        case 75:
          keyCodeK = true;
          attack();
          break;
        default:
          break;
      }
    },
    false
  );
  document.addEventListener(
    "keyup",
    (e) => {
      var ev = e || window.event;
      switch (ev.keyCode) {
        case 87:
          keyCodeW = false;
          stopMove()
          break;
        case 83:
          keyCodeS = false;
          break;
        case 65:
          keyCodeA = false;
          break;
        case 68:
          keyCodeD = false;
          break;
        default:
          break;
      }
    },
    false
  );

  container = document.createElement("div");
  document.body.appendChild(container);

  camera = new PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(-5, 50, 10);

  clock = new THREE.Clock();

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe0e0e0);
  scene.fog = new THREE.Fog(0xe0e0e0, 20, 100);

  //光源效果
  let sptLight = new SpotLight(0xffffff);
  sptLight.position.set(0, 40, 40);
  //sptLight.shadow.camera.near=40,
  //sptLight.shadow.camera.far=-40,
  //开启阴影
  sptLight.castShadow = true;
  scene.add(sptLight);
  const ambientLight = new AmbientLight(0xcccccc);
  // scene.add(ambientLight)

  // 地板
  const planeGeometry = new PlaneGeometry(1000, 1000);
  const planeMaterial = new MeshLambertMaterial({ color: 0x77777ff });
  const plane = new Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -0.5 * Math.PI;

  //地面接受阴影
  plane.receiveShadow = true;
  scene.add(plane);
  const grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000);
  grid.material.opacity = 0.2;
  grid.material.transparent = true;
  scene.add(grid);

  // model
  const loader = new GLTFLoader();
  loader.load(
    "/RobotExpressive.glb",
    function (gltf) {
      model = gltf.scene;
      scene.add(model);

      createGUI(model, gltf.animations);
    },
    undefined,
    function (e) {
      console.error(e);
    }
  );

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = true;
  controls.enableZoom = true;
  controls.target.set(0, 1, 0);
  controls.update();
  camera.lookAt(0, 2, 0);

  container.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize);


  let time = Date.now()
  function frontMove() {
    const delta = clock.getDelta();
    console.log(api.state)
    if(api.state != "Walking") {
      fadeToAction('Walking',0.2)
      api.state = 'Walking'
    }
    const currentTime = Date.now()
    const deltaTime = currentTime - time
    time = currentTime
    model.position.z += 0.001 * deltaTime
  }
  function stopMove() {
    fadeToAction('Standing',0.2)
    api.state= 'Standing'
  }

  function backMove() {
    const currentTime = Date.now()
    const deltaTime = currentTime - time
    time = currentTime

    model.position.z -= 0.01 * deltaTime
  }
  function leftMove() {
    const currentTime = Date.now()
    const deltaTime = currentTime - time
    time = currentTime
    model.rotation.y += 0.01 * deltaTime
  }
  function rightMove() {
    const currentTime = Date.now()
    const deltaTime = currentTime - time
    time = currentTime
    model.position.z += 0.01 * deltaTime
  }



}

function createGUI(model, animations) {
  const states = [
    "Idle",
    "Walking",
    "Running",
    "Dance",
    "Death",
    "Sitting",
    "Standing",
  ];
  const emotes = ["Jump", "Yes", "No", "Wave", "Punch", "ThumbsUp"];

  gui = new GUI();

  mixer = new THREE.AnimationMixer(model);

  actions = {};

  for (let i = 0; i < animations.length; i++) {
    const clip = animations[i];
    const action = mixer.clipAction(clip);
    actions[clip.name] = action;
    if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {
      action.clampWhenFinished = true;
      action.loop = THREE.LoopOnce;
    }
  }

  // states

  const statesFolder = gui.addFolder("States");

  const clipCtrl = statesFolder.add(api, "state").options(states);

  clipCtrl.onChange(function () {
    fadeToAction(api.state, 0.5);
  });

  statesFolder.open();

  // emotes

  const emoteFolder = gui.addFolder("Emotes");

  function createEmoteCallback(name) {
    api[name] = function () {
      fadeToAction(name, 0.2);

      mixer.addEventListener("finished", restoreState);
    };

    emoteFolder.add(api, name);
  }

  function restoreState() {
    mixer.removeEventListener("finished", restoreState);

    fadeToAction(api.state, 0.2);
  }

  for (let i = 0; i < emotes.length; i++) {
    createEmoteCallback(emotes[i]);
  }

  emoteFolder.open();

  // expressions

  face = model.getObjectByName("Head_4");

  const expressions = Object.keys(face.morphTargetDictionary);
  const expressionFolder = gui.addFolder("Expressions");

  for (let i = 0; i < expressions.length; i++) {
    expressionFolder
      .add(face.morphTargetInfluences, i, 0, 1, 0.01)
      .name(expressions[i]);
  }

  activeAction = actions["Walking"];
  activeAction.play();

  expressionFolder.open();

  let time = Date.now()


}

function fadeToAction(name, duration) {
  previousAction = activeAction;
  activeAction = actions[name];

  if (previousAction !== activeAction) {
    previousAction.fadeOut(duration);
  }

  activeAction
    .reset()
    .setEffectiveTimeScale(1)
    .setEffectiveWeight(1)
    .fadeIn(duration)
    .play();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  const dt = clock.getDelta();

  if (mixer) mixer.update(dt);

  requestAnimationFrame(animate);

  renderer.render(scene, camera);

  // stats.update();
}


onMounted(() => {
  init();
  animate();
})

</script>
