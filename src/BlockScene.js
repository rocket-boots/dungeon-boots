// External modules
import * as THREE from 'three';
import { Object3D, Vector3, Group, Scene, PerspectiveCamera } from 'three';
import Renderer from 'rocket-boots-three-toolbox/src/Renderer.js';
import { ArrayCoords } from 'rocket-utility-belt';

const { X, Y, Z } = ArrayCoords;
const { PI } = Math;
const TAU = PI * 2;
const EYE_LIGHT_BLOCK_DISTANCE = 6;
const EYE_LIGHT_INTENSITY = 0;
const BACKGROUND_COLOR = '#77bbff';
const DEFAULT_BLOCK_SIZE = 20;
const LIGHT_OFFSET = DEFAULT_BLOCK_SIZE / 4;

window.THREE = THREE; // expose for testing in console

class BlockScene {
	constructor(options = {}) {
		this.blockSize = DEFAULT_BLOCK_SIZE;
		this.planeSize = this.blockSize; // - 1; // Slightly smaller is good for some characters
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
		this.blocksAboveGroup = new Group();
		this.blocksAtOrBelowGroup = new Group();
		this.blockSceneObjectMapping = {};
		this.mapView = false;
		this.imageUrlRoot = options.imageUrlRoot || './images';
	}

	convertMapToRenderingVector3(mapCoords) {
		const [x = 0, y = 0, z = 0] = mapCoords;
		return new Vector3(
			x * this.blockSize,
			y * this.blockSize,
			-z * this.blockSize,
		);
	}

	getBlockGoalPosition(block) {
		const [x, y, z] = block.coords;
		const wiggleOffsetX = (block.isActorBlob) ? block.wiggle[X] * 2 : 0;
		const wiggleOffsetY = (block.isActorBlob) ? block.wiggle[Y] * 2 : 0;
		return new Vector3(
			(x * this.blockSize) + wiggleOffsetX,
			(y * this.blockSize) + wiggleOffsetY,
			-z * this.blockSize + ((block.onGround) ? this.blockSize * 0.4 : 0),
			// ^ 0.4 instead of 0.5 so that it is slightly above the ground
		);
	}

	setup(blocks = [], viewingBlob = null, mapSceneOptions = {}) {
		if (!this.renderer) this.setupRenderer();
		this.scene = new Scene();
		this.camera = this.makeCamera();
		const { ambientLightIntensity } = mapSceneOptions;
		this.makeLight(ambientLightIntensity);

		// Test code
		// const geometry = new THREE.BoxGeometry(
		// VISUAL_BLOCK_SIZE, VISUAL_BLOCK_SIZE, VISUAL_BLOCK_SIZE);
		// const material = new THREE.MeshPhongMaterial({ color: '#433F81' }); // 0x44aa88 });
		// const mesh = new THREE.Mesh(geometry, material);
		// this.scene.add(mesh);
		// const axesHelper = new THREE.AxesHelper(5);
		// this.scene.add(axesHelper);

		this.blockSceneObjectMapping = {};
		if (!viewingBlob) throw new Error('Need viewingBlob');
		this.blocksAboveGroup = new Group();
		this.blocksAtOrBelowGroup = new Group();
		this.scene.add(this.blocksAboveGroup);
		this.scene.add(this.blocksAtOrBelowGroup);
		this.addMapBlocks(blocks, viewingBlob);
	}

	setupRenderer() {
		this.renderer = new Renderer();
		this.renderer.setClearColor(this.clearColor);
	}

	setPlayerVisibility(sceneObj) {
		// sceneObj.visible = this.mapView;
		sceneObj.material.opacity = this.mapView ? 1 : 0;
	}

	addMapBlocks(blocks = [], viewingBlob = null) {
		const [,, viewZ] = viewingBlob.coords;
		blocks.forEach((block) => {
			this.addMapBlock(block, viewingBlob, viewZ);
		});
	}

	getBlockGroup(block, viewZ) {
		const group = (block.coords[Z] > viewZ) ? this.blocksAboveGroup : this.blocksAtOrBelowGroup;
		return group || this.scene;
	}

	removeMapBlock(block, viewZ) {
		if (!block.sceneUUID) {
			// console.warn('Cannot remove block', block, 'because of missing uuid');
			return; // This is probably ok
		}
		const group = this.getBlockGroup(block, viewZ);
		const sceneObj = group.getObjectByProperty('uuid', block.sceneUUID);
		// sceneObj.geometry.dispose();
		// sceneObj.material.dispose();
		group.remove(sceneObj);
		block.sceneUUID = null;
	}

	addMapBlock(block, viewingBlob, viewZ) {
		if (!block.renderAs) return;
		const { blockSize } = this;
		let texture;
		let sceneObj; // mesh, plane, sprite, etc.
		let color;
		if (block.texture) {
			const imageUrl = [this.imageUrlRoot, (block.texture || 'zero.png')].join('/');
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
				blockSize * block.size[0],
				blockSize * block.size[1],
				blockSize * block.size[2],
			);
			const materialOptions = {};
			if (color) materialOptions.color = color;
			if (block.texture) materialOptions.map = texture;
			const material = new THREE.MeshStandardMaterial(materialOptions);
			sceneObj = new THREE.Mesh(geometry, material);
		} else if (block.renderAs === 'sprite') {
			const material = new THREE.SpriteMaterial({ map: texture });
			const sprite = new THREE.Sprite(material);
			sprite.scale.set(blockSize, blockSize, blockSize);
			sceneObj = sprite;
		} else if (block.renderAs === 'billboard' || block.renderAs === 'plane') {
			// TODO: render a plane differently without auto-facing
			const geometry = new THREE.PlaneGeometry(this.planeSize, this.planeSize);
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
				plane.rotation.setFromVector3(new Vector3(0, 0, 0), 'YZX');
				plane.rotateY(rotateY * TAU);
				plane.rotateZ(rotateZ * TAU);
				plane.rotateX(rotateX * TAU);
			}
			sceneObj = plane;
		}
		if (!sceneObj) {
			console.warn('No scene object to add!');
			return;
		}
		sceneObj.name = block.name || block.texture || block.renderAs;
		this.blockSceneObjectMapping[block.blockId] = sceneObj;
		sceneObj.position.copy(this.getBlockGoalPosition(block));
		// Hide the current main character
		// const viewingBlob = this.getMainPlayer();
		if (block.isPlayerBlob && viewingBlob.blockId === block.blockId) {
			this.setPlayerVisibility(sceneObj);
		}
		// Check for block invisibility
		if (block.invisible) {
			sceneObj.visible = block.getVisibilityTo(viewingBlob);
		}
		if (block.light) {
			const [intensity, distance] = block.light;
			const pointLight = new THREE.PointLight(0xb4b0dd, intensity, distance * blockSize);
			pointLight.translateZ(LIGHT_OFFSET);
			sceneObj.add(pointLight);
			window.torch = sceneObj;
		}
		// Add the block to the scene (via a group)
		block.sceneUUID = sceneObj.uuid;
		this.getBlockGroup(block, viewZ).add(sceneObj);
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

	makeLight(ambientLightIntensity = 0.25) {
		// const color = 0xFFFFFF;
		// const intensity = .005;
		// const light = new THREE.DirectionalLight(color, intensity);
		// light.position.set(-1, 2, 4);
		// grid.scene.add(light);

		const eyeLightDecay = this.blockSize * EYE_LIGHT_BLOCK_DISTANCE;
		this.eyeLight = new THREE.PointLight(0xffffff, EYE_LIGHT_INTENSITY, eyeLightDecay);
		this.scene.add(this.eyeLight);

		// const pointLight = new THREE.PointLight(0xffffff, 0.15, 1000);
		// pointLight.position.set(-100, -100, -100);
		// this.scene.add(pointLight);

		const ambientLight = new THREE.AmbientLight(0x404040, ambientLightIntensity);
		this.scene.add(ambientLight);

		// const sphereSize = 1;
		// const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
		// this.scene.add(pointLightHelper);
	}

	updateBlock(block, viewZ, t = 0.1) {
		if (block.remove) {
			this.removeMapBlock(block, viewZ);
		}
		if (block.redraw) {
			this.removeMapBlock(block, viewZ);
			this.addMapBlock(block, null, viewZ);
			block.redraw = false; // eslint-disable-line no-param-reassign
		}
		this.updateBlockPosition(block, t);
	}

	updateBlockPosition(block, t = 0.1) {
		const sceneObject = this.blockSceneObjectMapping[block.blockId];
		if (!sceneObject) {
			// console.warn(`Cannot find sceneObject
			// in blockSceneObjectMapping with blockId ${block.blockId}`);
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

	setCameraGoals(focusVec3, facing) {
		// Set the camera goal
		// const playerVec3 = this.getMainPlayerRenderingVector3();
		this.cameraGoal.position.copy(focusVec3);
		const cameraZ = (this.mapView) ? this.cameraZMapOffset : this.cameraZOffset;
		this.cameraGoal.position.add(new Vector3(0, 0, cameraZ));
		const rotX = (this.mapView) ? (PI * 0.1) : (PI * 0.5);
		const rotY = PI;
		const rotZ = PI - ArrayCoords.getDirectionRadians(facing);
		this.cameraGoal.rotation.setFromVector3(new THREE.Vector3(rotX, rotY, rotZ), 'YZX');
		// this.cameraGoal.rotation.copy(new Euler(PI, PI, PI));

		// Set the looking goal
		// const rad = ArrayCoords.getDirectionRadians(this.getMainPlayer().facing);
		// const look = new Vector3(0, 20, 0);
		// const axis = new Vector3(0, 0, 1);
		// look.applyAxisAngle(axis, rad);
		// look.add(playerVec3);
		// this.lookGoal.copy(look);
	}

	updateCamera(focusVec3, facing, t = 0.1) {
		this.setCameraGoals(focusVec3, facing);

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
		const eyeLightPos = (this.mapView) ? this.eyeLight.position : this.cameraCurrent.position;
		this.eyeLight.position.copy(eyeLightPos);
		// this.camera.lookAt(this.lookCurrent);
	}

	render({ focus, facing, t = 0.1, blocks, viewZ }) { // Just render the three js scene
		if (focus instanceof Vector3) {
			this.updateCamera(focus, facing, t);
		} else if (focus instanceof Array) {
			const focusVec3 = this.convertMapToRenderingVector3(focus);
			this.updateCamera(focusVec3, facing, t);
		}
		if (blocks) {
			blocks.forEach((block) => this.updateBlock(block, viewZ, t));
		}
		this.blocksAboveGroup.visible = !this.mapView;
		this.renderer.render(this.scene, this.camera);
		this.autoFacingObjects.forEach((obj) => {
			obj.quaternion.copy(this.camera.quaternion);
		});
	}
}

export default BlockScene;
