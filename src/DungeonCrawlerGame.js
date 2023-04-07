// External modules
import * as THREE from 'three';
import { Scene, PerspectiveCamera } from 'three';
// import { Scene, PerspectiveCamera, Euler, Quaternion } from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { KeyboardCommander } from 'keyboard-commander';
import Renderer from 'rocket-boots-three-toolbox/src/Renderer.js';
// Local modules
import ArrayCoords from './ArrayCoords.js';
import PlayerBlob from './PlayerBlob.js';
import VoxelWorld from './VoxelWorld.js';
// import NpcBlob from './NpcBlob.js';
// import abilities from './abilities.js';
import Interface from './Interface.js';
// import Renderer from './Renderer.js';

window.THREE = THREE;
const { Vector3, Object3D } = THREE;
const { Z } = ArrayCoords;
const { PI } = Math;

const TAU = PI * 2;
const NOOP = () => {};

const WORLD_VOXEL_LIMITS = [64, 64, 12];
const VISUAL_BLOCK_SIZE = 20;
const VISUAL_PLANE_SIZE = 19;
// const HALF_BLOCK_SIZE = VISUAL_BLOCK_SIZE / 2;

const KB_MAPPING = {
	w: 'forward',
	s: 'back',
	a: 'strafeLeft',
	d: 'strafeRight',
	q: 'turnLeft',
	e: 'turnRight',
	' ': 'wait',
	m: 'map',
	f: 'combat',
	t: 'talk',
	i: 'inventory',
	v: 'view character',
	b: 'view abilities',
	g: 'view spells',
	Tab: 'inventory',
	'\\': 'switch next-player',
	1: 'option 1',
	2: 'option 2',
	3: 'option 3',
	4: 'option 4',
	5: 'option 5',
	6: 'option 6',
	7: 'option 7',
	8: 'option 8',
	9: 'option 9',
	Esc: 'menu back',
	Backspace: 'menu back',
};

const BACKGROUND_COLOR = '#77bbff';
const TURN_COMMANDS = ['turnLeft', 'turnRight'];
const MOVE_COMMANDS = ['forward', 'back', 'strafeLeft', 'strafeRight'];
const DEFAULT_SOUNDS = {
	// TODO
};

const $ = (selector) => {
	const elt = window.document.querySelector(selector);
	if (!elt) console.warn('Could not find', selector);
	return elt;
};
window.$ = $;

class DungeonCrawlerGame {
	constructor(options = {}) {
		this.worldSourceMaps = options.worldMaps;
		this.startAt = options.startAt;
		this.customEvents = options.customEvents || {};
		this.sounds = options.sounds || DEFAULT_SOUNDS;
		this.world = new VoxelWorld(this.worldSourceMaps);
		this.players = [];
		this.mainPlayerIndex = 0;
		this.kbCommander = new KeyboardCommander(KB_MAPPING);
		this.round = 0;
		this.isStopped = true;
		this.mapView = false;
		// Rendering properties
		this.interface = new Interface();
		this.clearColor = options.clearColor || BACKGROUND_COLOR;
		this.renderer = null;
		this.scene = null;
		this.eyeLight = null;
		this.autoFacingObjects = []; // Things (like sprite planes) that need to auto-face the camera
		this.camera = null;
		this.cameraZOffset = -1; // TODO: why negative for "above"?
		this.cameraZMapBaseOffset = -80;
		this.cameraZMapMaxOffset = -800;
		this.cameraZMapOffset = this.cameraZMapBaseOffset;
		this.cameraGoal = new Object3D();
		this.cameraCurrent = new Object3D();
		this.lookGoal = new Vector3();
		this.lookCurrent = new Vector3();
		this.blocksAboveGroup = new THREE.Group();
		this.blocksAtOrBelowGroup = new THREE.Group();
		this.blockSceneObjectMapping = {};
	}

	/** The main player is the active player (allows ability to pass-and-play and multiple player) */
	getMainPlayer() {
		return this.players[this.mainPlayerIndex];
	}

	getNpcs() {
		return this.getMainPlayerMap().getNpcs();
	}

	getMainPlayerMap() {
		const p = this.getMainPlayer();
		const mapKey = p.getMapKey();
		return this.world.getMap(mapKey);
	}

	playMusic() {
		const map = this.getMainPlayerMap();
		const { music, ambience } = map;
		this.sounds.playMusic(music);
		this.sounds.playAmbience(ambience);
	}

	// ----------------------------------- Rendering

	convertMapToRenderingVector3(mapCoords) { // eslint-disable-line class-methods-use-this
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

	setupScene() {
		this.scene = new Scene();
		this.camera = this.makeCamera();
		this.makeLight();

		// Test code
		// const geometry = new THREE.BoxGeometry(
		// VISUAL_BLOCK_SIZE, VISUAL_BLOCK_SIZE, VISUAL_BLOCK_SIZE);
		// const material = new THREE.MeshPhongMaterial({ color: '#433F81' }); // 0x44aa88 });
		// const mesh = new THREE.Mesh(geometry, material);
		// this.scene.add(mesh);
		// const axesHelper = new THREE.AxesHelper(5);
		// this.scene.add(axesHelper);

		this.blockSceneObjectMapping = {};
		this.addMapBlocks();
	}

	setupRendering() {
		this.renderer = new Renderer();
		this.renderer.setClearColor(this.clearColor);
		this.setupScene();
	}

	addMapBlocks() {
		const p = this.getMainPlayer();
		const coords = p.getCoords();
		const [, , pZ] = coords;
		const floorBlocks = this.getMainPlayerMap().getNearbyBlocks(coords, WORLD_VOXEL_LIMITS);
		// TODO: Fix this ^ - bigger range? until we load/unload blocks dynamically
		this.blocksAboveGroup = new THREE.Group();
		this.blocksAtOrBelowGroup = new THREE.Group();
		this.scene.add(this.blocksAboveGroup);
		this.scene.add(this.blocksAtOrBelowGroup);
		floorBlocks.forEach((block) => {
			const group = (block.coords[Z] > pZ) ? this.blocksAboveGroup : this.blocksAtOrBelowGroup;
			this.addMapBlock(block, group);
		});
	}

	getBlockGoalPosition(block) { // eslint-disable-line class-methods-use-this
		const [x, y, z] = block.coords;
		return new Vector3(
			x * VISUAL_BLOCK_SIZE,
			y * VISUAL_BLOCK_SIZE,
			-z * VISUAL_BLOCK_SIZE + ((block.onGround) ? VISUAL_BLOCK_SIZE * 0.4 : 0),
			// ^ 0.4 instead of 0.5 so that it is slightly above the ground
		);
	}

	addMapBlock(block, group) {
		if (!block.renderAs) return;
		let texture;
		let sceneObj; // mesh, plane, sprite, etc.
		let color;
		if (block.texture) {
			const imageUrl = `./images/${block.texture || 'zero.png'}`;
			texture = new THREE.TextureLoader().load(imageUrl);
			texture.magFilter = THREE.NearestFilter;
			texture.minFilter = THREE.LinearMipMapLinearFilter;
		}
		if (block.color) {
			const [r, g, b] = block.color;
			color = new THREE.Color(r, g, b);
		}
		if (block.renderAs === 'box') {
			const geometry = new THREE.BoxGeometry(
				VISUAL_BLOCK_SIZE,
				VISUAL_BLOCK_SIZE,
				VISUAL_BLOCK_SIZE,
			);
			const materialOptions = {};
			if (color) materialOptions.color = color;
			if (block.texture) materialOptions.map = texture;
			const material = new THREE.MeshStandardMaterial(materialOptions);
			sceneObj = new THREE.Mesh(geometry, material);
		} else if (block.renderAs === 'sprite') {
			const material = new THREE.SpriteMaterial({ map: texture });
			const sprite = new THREE.Sprite(material);
			sprite.scale.set(VISUAL_BLOCK_SIZE, VISUAL_BLOCK_SIZE, VISUAL_BLOCK_SIZE);
			sceneObj = sprite;
		} else if (block.renderAs === 'billboard' || block.renderAs === 'plane') {
			// TODO: render a plane differently without auto-facing
			const geometry = new THREE.PlaneGeometry(VISUAL_PLANE_SIZE, VISUAL_PLANE_SIZE);
			const material = new THREE.MeshStandardMaterial({
				color: 0xffffff,
				side: THREE.DoubleSide,
				map: texture,
				transparent: true,
			});
			if (typeof block.opacity === 'number') material.opacity = block.opacity;
			const plane = new THREE.Mesh(geometry, material);
			if (block.renderAs === 'billboard') {
				this.autoFacingObjects.push(plane);
			} else { // plane
				let { rotateX = 0, rotateY = 0, rotateZ = 0 } = block;
				rotateX += -0.25;
				rotateY += 0;
				rotateZ += 0;
				if (block.onGround) {
					rotateX += 0.25;
					rotateY += 0;
					rotateZ += 0;
				}
				plane.rotation.setFromVector3(new THREE.Vector3(0, 0, 0), 'YZX');
				plane.rotateY(rotateY * TAU);
				plane.rotateZ(rotateZ * TAU);
				plane.rotateX(rotateX * TAU);
			}
			sceneObj = plane;
		}
		if (sceneObj) {
			this.blockSceneObjectMapping[block.blockId] = sceneObj;
			sceneObj.position.copy(this.getBlockGoalPosition(block));
			// Hide the current main character
			const mainBlob = this.getMainPlayer();
			if (block.isPlayerBlob && mainBlob.blockId === block.blockId) {
				sceneObj.visible = this.mapView;
			}
			// Check for block invisibility
			if (block.invisible) {
				sceneObj.visible = block.getVisibilityTo(mainBlob);
			}
			if (block.light) {
				const [intensity, distance] = block.light;
				const pointLight = new THREE.PointLight(0xb4b0dd, intensity, distance * VISUAL_BLOCK_SIZE);
				sceneObj.add(pointLight);
				window.torch = sceneObj;
			}
			if (group) group.add(sceneObj);
			else this.scene.add(sceneObj);
		} else {
			console.warn('No scene object to render');
		}
	}

	updateBlockPosition(block, t = 0.1) {
		const sceneObject = this.blockSceneObjectMapping[block.blockId];
		if (!sceneObject) {
			// console.warn(`Cannot find sceneObject in blockSceneObjectMapping with blockId ${block.blockId}`);
			// TODO: Investigate and fix this error
			return;
		}
		// sceneObject.iterimPos = new Vector3();
		const goalPos = this.getBlockGoalPosition(block);
		const q = 1.0 - (0.24 ** t); // This q & lerp logic is from simondev
		// sceneObject.iterimPos.lerp(goalPos, q);
		// sceneObject.position.copy(sceneObject.iterimPos);
		sceneObject.position.lerp(goalPos, q);
		// To do it instantly:
		// sceneObject.position.copy(goalPos);
	}

	getWorldTextRows() {
		const p = this.getMainPlayer();
		const coords = p.getCoords();
		const [x, y, z] = coords;
		const mapKey = p.getMapKey();
		const floor = this.world.getFloorClone(mapKey, z);
		const row = floor[y];
		if (row) {
			const rowArray = row.split('');
			rowArray.splice(x, 1, '@');
			floor[y] = rowArray.join('');
		}
		return floor;
	}

	setCameraGoals() {
		// Set the camera goal
		const playerVec3 = this.getMainPlayerRenderingVector3();
		this.cameraGoal.position.copy(playerVec3);
		const cameraZ = (this.mapView) ? this.cameraZMapOffset : this.cameraZOffset;
		this.cameraGoal.position.add(new Vector3(0, 0, cameraZ));
		const rotX = (this.mapView) ? (PI * 0.1) : (PI * 0.5);
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
		if (!this.mapView) {
			this.eyeLight.position.copy(this.cameraCurrent.position);
		}
		// this.camera.lookAt(this.lookCurrent);
	}

	renderUI() {
		const blob = this.getMainPlayer();
		const mapKey = blob.getMapKey();
		const worldMap = this.world.getMap(mapKey);
		const facingActorBlob = blob.getFacingActor(worldMap);
		this.interface.render(blob, facingActorBlob);
	}

	renderScene() { // Just render the three js scene
		this.blocksAboveGroup.visible = !this.mapView;
		this.renderer.render(this.scene, this.camera);
		this.autoFacingObjects.forEach((obj) => {
			obj.quaternion.copy(this.camera.quaternion);
		});
	}

	renderActors() {
		const npcs = this.getNpcs();
		npcs.forEach((block) => this.updateBlockPosition(block));
		const p = this.getMainPlayer();
		this.updateBlockPosition(p);
	}

	animate() {
		if (this.isStopped) return;
		this.renderScene();
		this.updateCamera();
		this.renderActors();
		requestAnimationFrame(() => this.animate());
	}

	/** Render everything */
	render() {
		this.updateCamera();
		this.renderScene();
		this.renderUI();
		// Update camera
		// const { x, y, z } = this.convertMapToRenderingVector3(this.getMainPlayer().getCoords());
		// this.camera.position.x = x;
		// this.camera.position.y = y;
		// blocksToUpdate.forEach((block) => this.updateBlockPosition(block));
	}

	makeCamera() { // eslint-disable-line class-methods-use-this
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
		this.eyeLight = new THREE.PointLight(0xffffff, 0.9, VISUAL_BLOCK_SIZE * 6);
		this.scene.add(this.eyeLight);

		// const pointLight = new THREE.PointLight(0xffffff, 0.15, 1000);
		// pointLight.position.set(-100, -100, -100);
		// this.scene.add(pointLight);

		const ambientLight = new THREE.AmbientLight(0x404040, 0.25);
		this.scene.add(ambientLight);

		// const sphereSize = 1;
		// const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
		// this.scene.add(pointLightHelper);
	}

	// ----------------------------------- Gameplay

	/** Make a new player blob, which arrives in the middle of the map */
	makeNewPlayer(startAt = this.startAt, playerBlockLegend = {}) {
		const p = new PlayerBlob(startAt, playerBlockLegend);
		// const coords = this.world.getFloorCenter(mapKey, 1);
		// coords[Z] = 1;
		// p.moveTo(coords);
		this.players.push(p);
		const mapKey = p.getMapKey();
		const map = this.world.getMap(mapKey);
		map.addBlock(p);
		return p;
	}

	// makeNewNpc(startAt = this.startAt) {
	// 	const n = new NpcBlob(startAt);
	// 	this.npcs.push(n);
	// 	return n;
	// }

	calculateTalkOptions(blob) {
		const mapKey = blob.getMapKey();
		const worldMap = this.world.getMap(mapKey);
		const talkTo = blob.getFacingActor(worldMap);
		if (!talkTo) return [];
		return blob.getDialogOptions(talkTo);
	}

	switchMainPlayer(indexParam = 0, doRender = true) {
		this.mainPlayerIndex = indexParam % this.players.length;
		this.players.forEach((blob, i) => {
			// eslint-disable-next-line no-param-reassign
			blob.active = (i === this.mainPlayerIndex);
		});
		this.interface.reset().view('character');
		if (!doRender) return;
		this.setupScene();
		this.render();
	}

	/** Take inputs commands and queue them for the main player */
	handleInputCommand(command) {
		console.log('Command:', command);
		// this.sounds.play('button');
		const p = this.getMainPlayer();
		const commandWords = command.split(' ');
		if (command === 'menu back') {
			this.interface.goBack();
			this.render();
			return;
		}
		if (command === 'switch next-player') {
			this.switchMainPlayer(this.mainPlayerIndex + 1, true);
			return;
		}
		if (commandWords[0] === 'view') {
			const [, page] = commandWords;
			this.interface.view(page);
			this.render();
			return;
		}
		if (command === 'talk') {
			this.interface.talkOptions = this.calculateTalkOptions(p);
			if (!this.interface.talkOptions.length) {
				this.sounds.play('dud');
				this.interface.flashBorder('#111');
				this.interface.view('closed');
				this.render();
				return;
			}
		}
		if (this.interface.OPTIONS_VIEWS.includes(command)) {
			this.interface.view(command);
			this.render();
			return;
		}
		if (commandWords[0] === 'option') {
			if (this.interface.optionsView === 'combat') command = `attack ${commandWords[1]}`;
			if (this.interface.optionsView === 'talk') command = `dialog ${commandWords[1]}`;
			if (this.interface.optionsView === 'inventory') command = `inventory ${commandWords[1]}`;
		}
		if (command === 'map') {
			this.mapView = !this.mapView;
			const playerSceneObject = this.blockSceneObjectMapping[p.blockId];
			playerSceneObject.visible = this.mapView;
			this.render();
			return;
		}
		this.render();
		this.mapView = false;
		this.getMainPlayer().queueCommand(command);
	}

	doActorCommand(blob, command) {
		if (!command) return;
		const mainBlob = this.getMainPlayer();
		const isMain = (b) => mainBlob.blockId === b.blockId;
		const mapKey = blob.getMapKey();
		const worldMap = this.world.getMap(mapKey);
		const commandWords = command.split(' ');
		const target = blob.getFacingActor(worldMap);
		if (commandWords[0] === 'attack') {
			if (target) {
				if (target.isPlayerBlob && isMain(target)) {
					this.interface.flashBorder('#f00');
					this.sounds.play('hurt');
				} else {
					this.sounds.play('hit');
				}
				const dmg = Math.floor(Math.random() * ((blob.isPlayerBlob) ? 8 : 2)) + 1;
				target.damage(dmg, 'hp');
				// TODO
				target.checkDeath();
			} else {
				this.sounds.play('dud');
				this.interface.flashBorder('#111');
				console.warn('Nothing to attack');
			}
			return;
		}
		if (commandWords[0] === 'inventory') {
			const index = (Number(commandWords[1]) || 0) - 1;
			const invItem = mainBlob.getInventoryItem(index);
			alert(`This is a ${invItem.name}. You have ${invItem.quantity} of these. ${invItem.description}`);
		}
		if (commandWords[0] === 'dialog') {
			const dialogOptions = this.calculateTalkOptions(blob);
			if (!dialogOptions.length) {
				this.sounds.play('dud');
				return;
			}
			const index = (Number(commandWords[1]) || 0) - 1;
			const { answer = '...' } = dialogOptions[index];
			target.speakDialog(answer);
			blob.listenToDialog(dialogOptions[index], target);
			this.interface.talkOptions = this.calculateTalkOptions(blob);
			return;
		}
		if (command === 'wait') {
			if (blob.isPlayerBlob && isMain(blob)) {
				if (blob.getLeader().hp.belowMax()) {
					this.sounds.play('drink');
				}
				blob.waitHeal(2);
			} else {
				blob.waitHeal(1);
			}
			return;
		}
		if (TURN_COMMANDS.includes(command)) {
			blob.turn((command === 'turnLeft') ? -1 : 1);
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
			// console.log(blob.name, 'Desired Move:', mapKey, 'facing', blob.facing,
			// 'forward', forward, 'strafe', strafe, 'up', up);
			const newCoords = ArrayCoords.getRelativeCoordsInDirection(
				blob.getCoords(),
				blob.facing,
				forward,
				strafe,
				up,
			);
			const blocks = worldMap.getBlocksAtCoords(newCoords);
			const block = blocks[0]; // just look at first block in case there are multiple
			if (block && block.blocked) {
				console.log('\t', blob.name, 'blocked at', JSON.stringify(block.coords), 'Desired Move:', mapKey, 'facing', blob.facing, 'forward', forward, 'strafe', strafe, 'up', up);
				if (blob.isPlayerBlob) {
					this.sounds.play('dud');
					this.interface.flashBorder('#333');
				}
				// console.log('\tBlocked at', JSON.stringify(block.coords), block);
				return;
			}
			let moveToCoords = newCoords;
			if (block && block.teleport) {
				const [destMapKey, x, y, z, turn] = block.teleport;
				this.sounds.play(block.soundTeleport || block.soundOn || block.sound);
				moveToCoords = [x, y, z];
				blob.turnTo(turn);
				if (destMapKey !== mapKey) {
					this.switchBlobMap(blob, mapKey, destMapKey);
				}
			}
			console.log('\t', blob.name, 'moving to', JSON.stringify(moveToCoords), block);
			blob.moveTo(moveToCoords);
			if (blob.isPlayerBlob) this.sounds.play('walk');
			return;
		}
		console.log('Unknown command', command, 'from', blob.name || blob.blockId);
	}

	switchBlobMap(blob, currentMapKey, destMapKey) {
		if (currentMapKey === destMapKey) return;
		const currentMap = this.world.getMap(currentMapKey);
		const destMap = this.world.getMap(destMapKey);
		if (!destMap) throw new Error(`No destination map of ${destMapKey}`);
		currentMap.removeBlock(blob);
		blob.switchMap(destMapKey);
		destMap.addBlock(blob);
		this.setupScene();
		this.playMusic();
	}

	checkDeath() {
		if (!this.getMainPlayer().checkDeath()) return;
		this.sounds.playMusic('death'); // dead
		this.sounds.play('death');
		this.interface.view('dead');
		this.render();
	}

	doActorsCommands(actors = []) {
		actors.forEach((a) => {
			const command = a.dequeueCommand();
			if (!command || a.dead) return;
			this.doActorCommand(a, command);
		});
	}

	doRound() {
		this.round += 1;
		console.log('Round', this.round);
		const npcs = this.getNpcs();
		[...this.players, ...npcs].forEach((blob) => {
			blob.clearLastRound();
		});
		this.doActorsCommands(this.players);
		npcs.forEach((a) => a.plan(this.players, this.getMainPlayerMap()));
		// ^ TODO: More efficient to do the planning while waiting for player input
		this.doActorsCommands(npcs);
		this.checkDeath();
		let redraws = 0;
		npcs.forEach((a) => {
			a.checkDeath();
			if (a.redraw) {
				redraws += 1;
				a.redraw = false;
			}
		});
		if (redraws > 0) this.setupScene();
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
	start(playerIndex = 0) {
		this.switchMainPlayer(playerIndex, false);
		this.isStopped = false;
		// this.makeNewPlayer();
		this.kbCommander.on('command', (cmd) => this.handleInputCommand(cmd));
		window.document.addEventListener('click', (event) => {
			const commandElt = event.target.closest('[data-command]');
			if (commandElt && commandElt.dataset.command) {
				this.handleInputCommand(commandElt.dataset.command);
				event.preventDefault();
			}
		});
		this.setupRendering();
		this.render();
		this.tick();
		this.animate();
		this.playMusic();
	}

	stop() {
		this.isStopped = true;
	}
}

export default DungeonCrawlerGame;
