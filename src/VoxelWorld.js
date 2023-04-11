import clamp from 'rocket-boots-three-toolbox/src/clamp.js';

import VoxelWorldMap from './VoxelWorldMap.js';
// import BlockEntity from './BlockEntity.js';
// import NpcBlob from './NpcBlob.js';
import PseudoRandomizer from './PseudoRandomizer.js';
// import ArrayCoords from './ArrayCoords.js';

// const DEFAULT_BLOCK_TYPES = {
// ' ': { name: 'clear', blocked: 0, renderAs: false },
// '#': { name: 'stone', blocked: 1, renderAs: 'box', color: [0.8, 0.8, 0.7] },
// };

class VoxelWorld {
	constructor(worldSourceMaps = {}) {
		this.worldMaps = worldSourceMaps;
		this.maps = VoxelWorld.parseSourceMapsToWorldMaps(worldSourceMaps, this);
		// this.blocks = VoxelWorld.parseWorldMapsToBlocks(worldSourceMaps);
		// this.blocksByMap = this.makeBlocksByMap();
		this.beyondAbove = '#';
		this.beyondBelow = '#';
	}

	static parseSourceMapsToWorldMaps(worldSourceMaps, world) {
		const maps = {};
		Object.keys(worldSourceMaps).forEach((mapKey) => {
			maps[mapKey] = new VoxelWorldMap(mapKey, world, worldSourceMaps[mapKey]);
		});
		return maps;
	}

	/*
	static parseWorldMapsToBlocks(worldMaps) {
		const blocks = [];
		Object.keys(worldMaps).forEach((mapKey) => {
			const { map, legend } = worldMaps[mapKey];
			map.forEach((floor, z) => {
				floor.forEach((row, y) => {
					row.split('').forEach((char, x) => {
						const startAt = [mapKey, x, y, z];
						const blockLegend = legend[char];
						// If it is called "clear", or it is not blocking and not being rendered,
						// then it's not really a block.
						if (blockLegend.name === 'clear' || (!blockLegend.renderAs && !blockLegend.blocked)) {
							return;
						}
						const BlockClass = (blockLegend.npc) ? NpcBlob : BlockEntity;
						const block = new BlockClass(startAt, blockLegend);
						blocks.push(block);
					});
				});
			});
		});
		return blocks;
	}

	makeBlocksByMap() {
		const maps = {};
		this.blocks.forEach((block) => {
			const { mapKey } = block;
			if (!maps[mapKey]) maps[mapKey] = [];
			maps[mapKey].push(block);
		});
		return maps;
	}
	*/

	getMap(mapKey) {
		return this.maps[mapKey];
	}

	getWorldMap(mapKey) {
		const worldMap = this.worldMaps[mapKey];
		if (!worldMap) throw new Error(`No world map: ${mapKey}`);
		// if (!(worldMap.map instanceof Array)) {
		// throw new Error(`World map ${mapKey} does not contain 'map' array`);
		// }
		return worldMap;
	}

	getFloor(mapKey, z = 0) {
		const isBelow = (z < 0);
		// One array for +z, one for -z
		const worldMap = this.getWorldMap(mapKey);
		if (worldMap.below) {
			const obj = (isBelow) ? worldMap.below : worldMap.above || worldMap.map;
			const zIndex = Math.abs(z);
			return obj[zIndex];
		}
		const obj = worldMap.above || worldMap.map;
		if (z < 0) throw new Error(`Map ${mapKey} does not support below 0 z`);
		return obj[z];
	}

	getFloorClone(mapKey, z = 0) {
		return JSON.parse(JSON.stringify(this.getFloor(mapKey, z)));
	}

	getFloorSize(mapKey, z = 0) {
		const floor = this.getFloor(mapKey, z);
		return [
			floor[0].length, // Just look at the first row; assumes they're all the same
			floor.length,
		];
	}

	getFloorCenter(mapKey, z = 0) {
		const [maxX, maxY] = this.getFloorSize(mapKey, z);
		return [Math.floor(maxX / 2), Math.floor(maxY / 2)];
	}

	/*
	getFloorBlocks(mapKey, z = 0) {
		const floor = this.getFloor(mapKey, z);
		if (!floor) return [];
		const blocks = [];
		floor.forEach((row, y) => {
			row.split('').forEach((char, x) => {
				const coords = [x, y, z];
				const block = this.getBlockByType(mapKey, char, coords);
				blocks.push(block);
			});
		});
		return blocks;
	}

	getBlockByType(mapKey, char, coords) {
		// Look up the basic block type and copy it
		const worldMap = this.getWorldMap(mapKey);
		const { legend } = worldMap;
		const block = { ...legend[char] };
		// If provided coords, then copy those
		if (coords) block.coords = [...coords];
		// And then figure out some procedural values
		let seed = block.coords[0] + block.coords[1] + block.coords[2];
		const getBlockRand = () => {
			seed += 1;
			return PseudoRandomizer.getPseudoRand(seed);
		};
		if (block.color) {
			block.color = [...block.color];
			const i = Math.floor(getBlockRand() * 3);
			const alterColor = (getBlockRand() / 15) - (getBlockRand() / 15);
			block.color[i] = clamp(block.color[i] + alterColor, 0, 1);
		}
		if (block.texture && block.textureRange) {
			const n = block.textureRange[1] - block.textureRange[0];
			const textureNum = block.textureRange[0] + Math.floor(getBlockRand() * n);
			block.texture = block.texture.replace('.', `${textureNum}.`);
			// block.color = '#ffffff';
		}
		return block;
	}
	*/

	getBeyondBlock(mapKey, isBelow, coords) {
		const block = this.getBlockByType(
			mapKey,
			isBelow ? this.beyondBelow : this.beyondAbove,
			coords,
		);
		block.beyond = true;
		return block;
	}

	// getBlock(mapKey, coords) {
	// 	const [x = 0, y = 0, z = 0] = coords;
	// 	const isBelow = (z < 0);
	// 	// x and y are effectively indices in an array, so they can't be negative
	// 	if (x < 0 || y < 0) {
	// 		return this.getBeyondBlock(mapKey, isBelow, coords);
	// 	}
	// 	const floor = this.getFloor(mapKey, z);
	// 	if (!floor) { // If nothing defined for that z level
	// 		return this.getBeyondBlock(mapKey, isBelow, coords);
	// 	}
	// 	const row = floor[y];
	// 	if (!row) {
	// 		return this.getBeyondBlock(mapKey, isBelow, coords);
	// 	}
	// 	const blockChar = row.charAt(x);
	// 	if (!blockChar) {
	// 		return this.getBeyondBlock(mapKey, isBelow, coords);
	// 	}
	// 	return this.getBlockByType(mapKey, blockChar, coords);
	// }
}

export default VoxelWorld;
