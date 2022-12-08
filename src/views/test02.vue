<template>
	
</template>

<script  setup>
import * as THREE from 'three'
import gsap from 'gsap'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import * as dat from "dat.gui"
import { OBJLoader } from "three/addons/loaders/OBJLoader"

console.log(gsap)
const gui = new dat.GUI()



const cursor = {
	x:0,
	y:0
}

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight
}

// const image = new Image()
// const texture = new THREE.Texture(image)

const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () => {
	console.log("OnStart")
}

loadingManager.onLoad = () =>{
	console.log("OnLoad")
}

loadingManager.onStop = () => {
	console.log("OnStop")
}


const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load('color.png')


const canvas = document.querySelector("canvas.webgl")

window.addEventListener("resize", ()=>{
	sizes.width = window.innerWidth,
	sizes.height = window.innerHeight

	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	renderer.setSize(sizes.width, sizes.height)

})

window.addEventListener('mousemove',(event) =>{
	cursor.x = event.clientX / sizes.width - 0.5,
	cursor.y = - (event.clientY / sizes.height - 0.5)

})


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);



const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio)
// const controls = new OrbitControls(camera, renderer.domElement)
document.body.appendChild(renderer.domElement);

const geometry = new THREE.TorusBufferGeometry(1, 0.35, 32, 100);
const material = new THREE.MeshBasicMaterial({ map:colorTexture });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const parameters = {
	color: 0xff0000,
	spin: ()=>{
		gsap.to(cube.rotation, {duration:1, y:cube.position.y + 10})
	}
}

camera.position.z = 5;

gui.add(cube.position, 'x', -3, 3, 0.01)
gui.add(cube.position, 'y', -3, 3, 0.01)
gui.add(cube.position, 'z', -3, 3, 0.01)
gui
	.addColor(parameters,'color')
	.onChange(()=>{
		material.color.set(parameters.color)
	})

gui
	.add(parameters, 'spin')




// 双击全屏
window.addEventListener("dblclick", ()=>{
	const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
	
	if(!fullscreenElement){
		console.log("enter full screen")
	}else{
		console.log("exit full screen")
	}
})


// image.onload = () => {
// 	texture.needsUpdate = true
// }
// image.src = 'color.png'

const loader = new OBJLoader()
loader.load(
    'models/01.obj',
    function (object) {
		
        scene.add(object)
        console.log(object)
    },

    function (xhr) {
        console.log((xhr.load / xhr.total * 100) + '% loaded')
    },

    function (error) {
        console.log("an err happend")
        console.log(error)
    }
)



const clock = new THREE.Clock()
function tick() {
    
    const elapsedTime = clock.getElapsedTime()

    camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
	camera.position.y = cursor.y * 5
	camera.lookAt(cube.position)


    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
};

tick();


</script>

<style lang='scss'>
body {
	padding: 0;
	margin: 0;
}
</style>