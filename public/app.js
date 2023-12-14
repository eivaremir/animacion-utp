import * as THREE from 'three';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
import { EffectComposer } from './jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './jsm/postprocessing/RenderPass.js';


let renderer, scene, camera, skyboxGeo, skybox, controls, composer;

init();
animate();

function init() {
	renderer = new THREE.WebGLRenderer({
		antialias: true,
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.shadowMap.enabled = true;
	renderer.capabilities.logarithmicDepthBuffer = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.physicallyCorrectLights = true;
	renderer.toneMappingExposure = Math.pow(0.9, 4.0);
	renderer.toneMapping = THREE.ReinhardToneMapping;
	document.body.appendChild(renderer.domElement);

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(
		40,
		window.innerWidth / window.innerHeight,
		0.05,
		10000
	);
	camera.position.set(0, 0, 15);
	camera.lookAt(0, 0, 0);

	controls = new OrbitControls(camera, renderer.domElement);

	composer = new EffectComposer(renderer);
	composer.addPass(new RenderPass(scene, camera));


	const ambientLight = new THREE.AmbientLight(0xffffff, 3);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
	directionalLight.position.set(0, 1, 0);
	scene.add(directionalLight);

	//Skybox
	const skyboxImage1 = '';
	const basePath = './img/';
	const fileType = '.png';
	const sides = ['right', 'left', 'top', 'bottom', 'front', 'back'];

	function createMaterialArray(filename) {
		const materialArray = sides.map((side) => {
			const imagePath = basePath + filename + side + fileType;
			let texture = new THREE.TextureLoader().load(imagePath);
			return new THREE.MeshBasicMaterial({
				map: texture,
				side: THREE.BackSide,
			});
		});
		return materialArray;
	}
	const materialArray = createMaterialArray(skyboxImage1);
	skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
	skybox = new THREE.Mesh(skyboxGeo, materialArray);
	scene.add(skybox);

	const loader = new GLTFLoader();

	

	//rocks
	loader.load(
		'DungeonUnion.gltf',
		function (gltf) {
			gltf.scene.traverse(function (child) {
				if (child.isMesh) {
					child.castShadow = true;
					child.receiveShadow = true;
				}
			});

			gltf.scene.scale.set(1.5, 1.5, 1.5);
			gltf.scene.rotation.y = THREE.MathUtils.degToRad(-90);
			gltf.scene.position.set(0.5, 2.75, -5.75);

			scene.add(gltf.scene);
		},
		undefined,
		function (error) {
			console.error(error);
		}
	);
}

function animate() {
	requestAnimationFrame(animate);
	composer.render();
}
