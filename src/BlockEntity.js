import { PseudoRandomizer, Random, clamp } from 'rocket-utility-belt';
// import PseudoRandomizer from './PseudoRandomizer.js';
// import Random from './Random.js';

const clone = (value) => JSON.parse(JSON.stringify(value));
const objEqual = (o1, o2) => {
	const value1 = (typeof o1 === 'object') ? JSON.stringify(o1) : o1;
	const value2 = (typeof o2 === 'object') ? JSON.stringify(o2) : o2;
	return value1 === value2;
};

/** A block entity is jjust something that exists at a space in the grid/voxel world */
class BlockEntity {
	constructor(startAt = [], blockLegend = {}) {
		const [mapKey, x, y, z] = startAt;
		this.mapKey = mapKey;
		this.coords = [x, y, z];
		this.tags = [];
		this.size = [1, 1, 1];
		this.blockId = Random.uniqueString();
		this.addPropertiesFromLegend(blockLegend); // Add all properties from legend
		// this.name = blockLegend.name;
		// this.renderAs = blockLegend.renderAs;
		// this.texture = blockLegend.texture;
		// this.textureRange = blockLegend.textureRange;
		// this.npc = blockLegend.npc;
		// Add properties from legend that have a default value
		this.blocked = blockLegend.blocked || 0;

		// Procedural (seed-based) randomness
		this.pRand = new PseudoRandomizer([this.name || 'dude', ...this.coords]);
		// Modify color
		if (this.color) {
			const i = this.pRand.random(3);
			const alterColor = (this.pRand.random() / 15) - (this.pRand.random() / 15);
			this.color[i] = clamp(this.color[i] + alterColor, 0, 1);
			this.originalColor = [...this.color];
		}
		// Modify texture for texture range
		if (this.texture && this.textureRange) {
			const n = this.textureRange[1] - this.textureRange[0] + 1;
			const textureNum = this.textureRange[0] + this.pRand.random(n);
			this.texture = this.texture.replace('.', `${textureNum}.`);
			// this.color = '#ffffff';
		}
		this.dna = Object.freeze([this.pRand.random(), this.pRand.random(), this.pRand.random()]);
		// We want a small offset amount to stop overlaps when two blocks are on the same location
		this.wiggle = [this.pRand.random(), this.pRand.random(), 0];
		this.redraw = false; // Do we need to redraw the thing (likely due to a texture change)
		this.sceneUUID = null; // Used to connect to the three.js mesh
		this.remove = false; // a trigger to tell the renderer or game to remove this block
		// Standardize the interact object (if it exists)
		this.standardizeInteractObject();
	}

	standardizeInteractObject() {
		if (typeof this.interact === 'string') {
			this.interact = {
				text: this.interact,
				command: this.interact,
			};
		}
		if (typeof this.interact !== 'object' || !this.interact) return;
		const { range, actions, action, command } = this.interact;
		if (typeof range !== 'number') this.interact.range = 1;
		if (!actions) this.interact.actions = [];
		if (action) this.interact.actions.push(action);
		if (command) this.interact.actions.push(['command', command]);
	}

	switchMap(mapKey) {
		this.mapKey = mapKey;
	}

	getMapKey() {
		return this.mapKey;
	}

	getCoords() {
		return [...this.coords];
	}

	moveTo(coords) {
		const [x, y, z] = coords;
		if (typeof x === 'number') this.coords[0] = x;
		if (typeof y === 'number') this.coords[1] = y;
		if (typeof z === 'number') this.coords[2] = z;
	}

	move(relativeCoords) {
		const newCoords = [0, 1, 2].forEach((i) => this.coords[i] + relativeCoords[i]);
		this.moveTo(newCoords);
	}

	changeRendering(changes = { /* texture, onGround, renderAs */ }) {
		let changeCount = 0;
		Object.keys(changes).forEach((changeKey) => {
			if (objEqual(this[changeKey], changes[changeKey])) return;
			this[changeKey] = changes[changeKey];
			changeCount += 1;
		});
		if (changeCount > 0) this.redraw = true;
	}

	getTags() {
		return this.tags;
	}

	hasTag(tag) {
		const blobTags = this.getTags();
		return blobTags.includes(tag);
	}

	hasOneOfTags(tags = []) {
		const blobTags = this.getTags();
		const matchingTags = blobTags.filter((tag) => tags.includes(tag));
		return (matchingTags.length > 0);
	}

	getVisibilityTo(lookerBlob) {
		if (!this.invisible) return true;
		if (this.invisible instanceof Array) {
			return lookerBlob.hasOneOfTags(this.invisible);
		}
		return false;
	}

	addPropertiesFromLegend(blockLegend) {
		Object.keys(blockLegend).forEach((key) => {
			if (typeof blockLegend[key] === 'object') {
				this[key] = clone(blockLegend[key]);
				return;
			}
			this[key] = blockLegend[key];
		});
	}

	change(blockLegend = {}) {
		this.addPropertiesFromLegend(blockLegend);
		this.redraw = true;
	}
}

export default BlockEntity;
