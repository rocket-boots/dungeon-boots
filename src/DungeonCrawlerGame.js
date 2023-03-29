// External modules
import * as THREE from 'three';
import { Scene, PerspectiveCamera, Euler, Quaternion } from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { KeyboardCommander } from 'keyboard-commander';
import Renderer from 'rocket-boots-three-toolbox/src/Renderer.js';
// Local modules
import ArrayCoords from './ArrayCoords.js';
import PlayerBlob from './PlayerBlob.js';
import VoxelWorld from './VoxelWorld.js';
// import Renderer from './Renderer.js';

window.THREE = THREE;
const { Vector3, Object3D } = THREE;
const { Z } = ArrayCoords;
const { PI } = Math;
const TAU = PI * 2;

const VISUAL_BLOCK_SIZE = 20;
const HALF_BLOCK_SIZE = VISUAL_BLOCK_SIZE / 2;

const KB_MAPPING = {
	w: 'forward',
	s: 'back',
	a: 'strafeLeft',
	d: 'strafeRight',
	q: 'turnLeft',
	e: 'turnRight',
};

const TURN_COMMANDS = ['turnLeft', 'turnRight'];
const MOVE_COMMANDS = ['forward', 'back', 'strafeLeft', 'strafeRight'];

class DungeonCrawlerGame {
	constructor(options = {}) {
		this.world = new VoxelWorld({}, options.blockTypes);
		this.players = [];
		this.mainPlayerIndex = 0;
		this.kbCommander = new KeyboardCommander(KB_MAPPING);
		this.round = 0;
		this.isStopped = true;
		// Rendering properties
		this.clearColor = options.clearColor || '#77bbff';
		this.renderer = null;
		this.scene = null;
		this.eyeLight = null;
		this.autoFacingObjects = []; // Things (like sprite planes) that need to auto-face the camera
		// this.mainPlayerPositionCurrent = new Vector3();
		// this.mainPlayerPositionGoal = new Vector3();
		this.camera = null;
		this.cameraZOffset = 0; // TODO: why negative for "above"?
		this.cameraGoal = new Object3D();
		this.cameraCurrent = new Object3D();
		this.lookGoal = new Vector3();
		this.lookCurrent = new Vector3();
	}

	// ----------------------------------- Rendering

	convertMapToRenderingVector3(mapCoords) {
		const [x = 0, y = 0, z = 0] = mapCoords;
		return new Vector3(
			x * VISUAL_BLOCK_SIZE,
			y * VISUAL_BLOCK_SIZE,
			-z * VISUAL_BLOCK_SIZE,
		);
	}

	getMainPlayerRenderingVector3() {
		const coords = this.getMainPlayer().getCoords();
		const vec3 = this.convertMapToRenderingVector3(coords);
		// vec3.add(new Vector3(HALF_BLOCK_SIZE, HALF_BLOCK_SIZE, HALF_BLOCK_SIZE));
		return vec3;
	}

	setupRendering() {
		this.renderer = new Renderer();
		this.renderer.setClearColor(this.clearColor);
		this.scene = new Scene();
		this.camera = this.makeCamera();
		this.makeLight();
		// this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);

		// Test code
		// const geometry = new THREE.BoxGeometry(VISUAL_BLOCK_SIZE, VISUAL_BLOCK_SIZE, VISUAL_BLOCK_SIZE);
		// const material = new THREE.MeshPhongMaterial({ color: '#433F81' }); // 0x44aa88 });
		// const mesh = new THREE.Mesh(geometry, material);
		// this.scene.add(mesh);
		// const axesHelper = new THREE.AxesHelper(5);
		// this.scene.add(axesHelper);

		this.addMapBlocks();
	}

	addMapBlocks() {
		const p = this.getMainPlayer();
		const coords = p.getCoords();
		const [pX, pY, pZ] = coords;
		const floorBlocks = this.world.getFloorBlocks(pZ)
			.concat(this.world.getFloorBlocks(pZ - 1))
			.concat(this.world.getFloorBlocks(pZ + 1));
		floorBlocks.forEach((block) => this.addMapBlock(block));
	}

	addMapBlock(block) {
		if (!block.renderAs) return;
		const [x, y, z] = block.coords;
		let texture;
		let thing; // mesh, plane, sprite, etc.
		let color;
		if (block.texture) {
			const imageUrl = `/images/${block.texture || 'zero.png'}`;
			texture = new THREE.TextureLoader().load(imageUrl);
			texture.magFilter = THREE.NearestFilter;
			texture.minFilter = THREE.LinearMipMapLinearFilter;
		}
		if (block.color) {
			const [r, g, b] = block.color;
			color = new THREE.Color(r, g, b);
		}
		if (block.renderAs === 'box') {
			const geometry = new THREE.BoxGeometry(VISUAL_BLOCK_SIZE, VISUAL_BLOCK_SIZE, VISUAL_BLOCK_SIZE);
			const materialOptions = { color };
			if (block.texture) materialOptions.map = texture;
			const material = new THREE.MeshStandardMaterial(materialOptions);
			thing = new THREE.Mesh(geometry, material);
		} else if (block.renderAs === 'sprite') {
			const material = new THREE.SpriteMaterial({ map: texture });
			const sprite = new THREE.Sprite(material);
			sprite.scale.set(VISUAL_BLOCK_SIZE, VISUAL_BLOCK_SIZE, VISUAL_BLOCK_SIZE);
			thing = sprite;
		} else if (block.renderAs === 'plane') {
			const geometry = new THREE.PlaneGeometry(18, 18);
			const material = new THREE.MeshStandardMaterial({
				color: 0xffffff,
				side: THREE.DoubleSide,
				map: texture,
				transparent: true,
			});
			const plane = new THREE.Mesh(geometry, material);
			this.autoFacingObjects.push(plane);
			thing = plane;
		}
		if (thing) {
			thing.position.set(x * VISUAL_BLOCK_SIZE, y * VISUAL_BLOCK_SIZE, -z * VISUAL_BLOCK_SIZE);
			this.scene.add(thing);
		}
	}

	getWorldTextRows() {
		const p = this.getMainPlayer();
		const coords = p.getCoords();
		const [x, y, z] = coords;
		const floor = this.world.getFloorClone(z);
		const row = floor[y];
		if (row) {
			const rowArray = row.split('');
			rowArray.splice(x, 1, '@');
			floor[y] = rowArray.join('');
		}
		floor.push(`Direction: ${ArrayCoords.getDirectionName(p.facing)}`);
		return floor;
	}

	setCameraGoals() {
		// Set the camera goal
		const playerVec3 = this.getMainPlayerRenderingVector3();
		this.cameraGoal.position.copy(playerVec3);
		this.cameraGoal.position.add(new Vector3(0, 0, this.cameraZOffset));
		const rotX = PI * 0.5;
		const rotY = PI;
		const rotZ = PI - ArrayCoords.getDirectionRadians(this.getMainPlayer().facing);
		this.cameraGoal.rotation.setFromVector3(new THREE.Vector3(rotX, rotY, rotZ), 'YZX');
		// this.cameraGoal.rotation.copy(new Euler(PI, PI, PI));

		// this.eyeLight.position.copy(playerVec3);

		// Set the looking goal
		// const rad = ArrayCoords.getDirectionRadians(this.getMainPlayer().facing);
		// const look = new Vector3(0, 20, 0);
		// const axis = new Vector3(0, 0, 1);
		// look.applyAxisAngle(axis, rad);
		// look.add(playerVec3);
		// this.lookGoal.copy(look);
	}

	updateCamera(t = 0.1) {
		this.setCameraGoals();

		// This q & lerp logic is from simondev but needs some tweaking
		const q = 1.0 - (0.24 ** t);
		this.cameraCurrent.position.lerp(this.cameraGoal.position, q);
		this.lookCurrent.lerp(this.lookGoal, q);
		// TODO: Add slerp-like changes
		// this.cameraCurrent.quaternion.copy(this.cameraGoal.quaternion);
		this.cameraCurrent.quaternion.slerp(this.cameraGoal.quaternion, q);
		// Set the current camera position and look
		this.camera.position.copy(this.cameraCurrent.position);
		this.camera.quaternion.copy(this.cameraCurrent.quaternion);
		this.eyeLight.position.copy(this.cameraCurrent.position);
		// this.camera.lookAt(this.lookCurrent);
	}

	renderMap() {
		const mapHtml = this.getWorldTextRows().join('<br>');
		window.document.getElementById('map').innerHTML = mapHtml;
	}

	renderScene() { // Just render the three js scene
		this.renderer.render(this.scene, this.camera);
		this.autoFacingObjects.forEach((obj) => {
			obj.quaternion.copy(this.camera.quaternion);
		});
	}

	animate() {
		if (this.isStopped) return;
		requestAnimationFrame(() => this.animate());
		// this.orbitControls.update();
		this.renderScene();
		this.updateCamera();
	}

	/** Render everything */
	render() {
		this.updateCamera();
		this.renderScene();
		this.renderMap();
		// Update camera
		// const { x, y, z } = this.convertMapToRenderingVector3(this.getMainPlayer().getCoords());
		// this.camera.position.x = x;
		// this.camera.position.y = y;
	}

	makeCamera() {
		// const FOV = 75;
		const FOV = 105;
		const camera = new PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.z = 300;
		camera.position.x = 200;
		camera.position.y = 200;
		return camera;
	}

	makeLight() {
		// const color = 0xFFFFFF;
		// const intensity = .005;
		// const light = new THREE.DirectionalLight(color, intensity);
		// light.position.set(-1, 2, 4);
		// grid.scene.add(light);
		this.eyeLight = new THREE.PointLight(0xffffff, 0.9, VISUAL_BLOCK_SIZE * 5);
		this.scene.add(this.eyeLight);

		const pointLight = new THREE.PointLight(0xffffff, 0.15, 1000);
		pointLight.position.set(-100, -100, -100);
		this.scene.add(pointLight);

		// const sphereSize = 1;
		// const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
		// this.scene.add(pointLightHelper);
	}

	// ----------------------------------- Gameplay

	/** The main player is the active player (allows ability to pass-and-play and multiple player) */
	getMainPlayer() {
		return this.players[this.mainPlayerIndex];
	}

	/** Make a new player blob, which arrives in the middle of the map */
	makeNewPlayer() {
		const p = new PlayerBlob();
		const coords = this.world.getFloorCenter(1);
		coords[Z] = 1;
		p.moveTo(coords);
		this.players.push(p);
		return p;
	}

	/** Take inputs commands and queue them for the main player */
	handleInputCommand(command) {
		console.log('Command:', command);
		this.getMainPlayer().queueCommand(command);
	}

	doPlayerCommand(playerBlob, command) {
		if (!command) return;
		if (TURN_COMMANDS.includes(command)) {
			playerBlob.turn((command === 'turnLeft') ? -1 : 1);
			return;
		}
		if (MOVE_COMMANDS.includes(command)) {
			let forward = 0;
			let strafe = 0;
			let up = 0;
			if (command === 'forward') forward = 1;
			else if (command === 'back') forward = -1;
			else if (command === 'strafeLeft') strafe = -1;
			else if (command === 'strafeRight') strafe = 1;
			else if (command === 'ascend') up = 1;
			else if (command === 'descend') up = -1;
			console.log('Desired Move', playerBlob.facing, forward, strafe, up);
			const block = this.world.getBlockAtMoveCoordinates(
				playerBlob.getCoords(), playerBlob.facing, forward, strafe, up,
			);
			if (block.blocked) {
				console.log('\tBlocked at', JSON.stringify(block.coords), block);
				return;
			}
			let moveToCoords = block.coords;
			if (block.teleport) {
				moveToCoords = [block.teleport[1], block.teleport[2], block.teleport[3]];
				playerBlob.turnTo(block.teleport[4]);
			}
			console.log('\tMoving to', JSON.stringify(moveToCoords), block);
			playerBlob.moveTo(moveToCoords);
			return;
		}
		console.log('Unknown', command, playerBlob);
	}

	doPlayerCommands() {
		this.players.forEach((p) => {
			const command = p.dequeueCommand(p);
			this.doPlayerCommand(p, command);
		});
	}

	doRound() {
		this.players.forEach((p) => {
			const command = p.dequeueCommand();
			if (!command) return;
			this.doPlayerCommand(p, command);
		});
		this.round += 1;
		this.render();
	}

	/** Tick fires periodically to see if it's time to advance the round */
	tick() {
		if (this.isStopped) return;
		const readyPlayers = this.players.reduce((sum, p) => sum + (p.checkReady() ? 1 : 0), 0);
		// console.log(readyPlayers, this.players.length);
		if (readyPlayers >= this.players.length) {
			this.doRound();
		}
		// console.log(readyPlayers);
		window.setTimeout(() => this.tick(), 200);
	}

	/** Only run this once */
	start() {
		this.isStopped = false;
		// this.makeNewPlayer();
		this.kbCommander.on('command', (cmd) => this.handleInputCommand(cmd));
		this.setupRendering();
		this.render();
		this.tick();
		this.animate();
	}

	stop() {
		this.isStopped = true;
	}
}

export default DungeonCrawlerGame;
