import clamp from 'rocket-boots-three-toolbox/src/clamp.js';
import PseudoRandomizer from './PseudoRandomizer.js';

const clone = (value) => JSON.parse(JSON.stringify(value));

/** A block entity is jjust something that exists at a space in the grid/voxel world */
class BlockEntity {
	constructor(startAt = [], blockLegend = {}) {
		const [mapKey, x, y, z] = startAt;
		this.mapKey = mapKey;
		this.coords = [x, y, z];
		this.blockId = Number(new Date()).toString(36) + Math.round(Math.random() * 99999).toString(36);
		// Add all properties from legend
		Object.keys(blockLegend).forEach((key) => {
			if (typeof blockLegend[key] === 'object') {
				this[key] = clone(blockLegend[key]);
				return;
			}
			this[key] = blockLegend[key];
		});
		// this.name = blockLegend.name;
		// this.renderAs = blockLegend.renderAs;
		// this.texture = blockLegend.texture;
		// this.textureRange = blockLegend.textureRange;
		// this.npc = blockLegend.npc;
		// Add properties from legend that have a default value
		this.blocked = blockLegend.blocked || 0;

		// Procedural (seed-based) randomness
		this.seed = parseInt(this.name, 32) + this.coords[0] + this.coords[1] + this.coords[2];
		// Modify color
		if (this.color) {
			const i = Math.floor(this.getBlockRand() * 3);
			const alterColor = (this.getBlockRand() / 15) - (this.getBlockRand() / 15);
			this.color[i] = clamp(this.color[i] + alterColor, 0, 1);
			this.originalColor = [...this.color];
		}
		// Modify texture for texture range
		if (this.texture && this.textureRange) {
			const n = this.textureRange[1] - this.textureRange[0];
			const textureNum = this.textureRange[0] + Math.floor(this.getBlockRand() * n);
			this.texture = this.texture.replace('.', `${textureNum}.`);
			// this.color = '#ffffff';
		}
	}

	getBlockRand() {
		this.seed += 1;
		return PseudoRandomizer.getPseudoRand(this.seed);
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
}

export default BlockEntity;
