import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';

let camera, scene, renderer, controls, composer;
let geometry, material, mesh;
let boundingBoxes = [];

function init() {

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.01, 10 );
	camera.position.z = 1;
	camera.position.x = 1;
	camera.position.y = 1;

	scene = new THREE.Scene();

	geometry = new THREE.BoxGeometry( 1, 0.25, 1 );
	material = new THREE.MeshPhysicalMaterial({color: 0xcccccc});

	mesh = new THREE.Mesh( geometry, material );
	mesh.receiveShadow = true;
	mesh.position.y = -0.125;
	scene.add( mesh );

	const hemLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
	scene.add( hemLight );
	const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
	light.position.set(1,2,1);
	light.castShadow = true;
	scene.add( light );
	scene.background = new THREE.Color(0x34d8eb);

		//Set up shadow properties for the light
	light.shadow.mapSize.width = 5120; // default
	light.shadow.mapSize.height = 5120; // default
	light.shadow.camera.near = 0.5; // default
	light.shadow.camera.far = 500; // default

	renderer = new THREE.WebGLRenderer( { antialias: true } );

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setAnimationLoop( animation );
	document.body.appendChild( renderer.domElement );



	controls = new OrbitControls( camera, renderer.domElement );
	controls.update();

}

function addBox() {
	let width = Math.random()/5+0.1;
	let height = Math.floor(Math.random()*5)*0.1 + 0.1;
	let depth = Math.random()/5+0.1;
	let x = Math.random()/2 - 0.25;
	let y = Math.floor(Math.random() * 5)*0.1;
	let z = Math.random()/2 - 0.25;
	console.log('added', width, height, depth);
	console.log('positions', x, y, z);
	let randBox = new THREE.BoxGeometry(width, height, depth);
	var randomColor = parseInt(Math.floor(Math.random()*16777215).toString(16), 16);
	console.log(randomColor);
	let randMaterial1 = new THREE.MeshPhysicalMaterial({ color: randomColor });
	let randMesh = new THREE.Mesh( randBox, randMaterial1 );
	randMesh.outlineParameters = {
		thickness: 1,
		color: 0xcccccc,
		visible: true,
		keepAlive: true,
	}
	randMesh.castShadow = true;
	randMesh.receiveShadow = true;
	randMesh.position.x = x;
	randMesh.position.y = y;
	randMesh.position.z = z;
	if (Math.random() < 0.4) {
		randMesh.rotation.y = Math.random()*3;
	}
	randMesh.geometry.computeBoundingBox();
	// if (!collides(randMesh)) {
		scene.add( randMesh );
		boundingBoxes.push(randMesh);
	// }

}

function collides(mesh) {
	for (let box of boundingBoxes) {
		if (mesh.geometry.boundingBox.intersect(box.geometry.boundingBox)) {
			return true;
		}
	}
	return false;
}

function animation( time ) {
	//
	// mesh.rotation.x = time / 2000;
	// mesh.rotation.y = time / 1000;

	controls.update();

	renderer.render( scene, camera );

}

export default {init, addBox};
