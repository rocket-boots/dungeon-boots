import { ArrayCoords } from 'rocket-utility-belt';

import BlockEntity from './BlockEntity.js';
import NpcBlob from './NpcBlob.js';

class VoxelWorldMap {
	constructor(mapKey, world, sourceMap = []) {
		this.mapKey = mapKey;
		this.world = world; // parent
		this.sourceMap = sourceMap || world.sourceMaps[mapKey];
		this.music = this.sourceMap.music || null;
		// console.log('Making', mapKey, 'from', this.sourceMap);
		const {
			map = [],
			legend = {},
			ambientLightIntensity = 0.25,
		} = this.sourceMap;
		this.originalMap = map;
		this.legend = legend;
		this.ambientLightIntensity = ambientLightIntensity;
		this.blocks = VoxelWorldMap.parseWorldMapToBlocks(mapKey, map, legend);
		this.npcBlobs = this.blocks.filter((block) => block instanceof NpcBlob);
	}

	static parseWorldMapToBlocks(mapKey, map, legend) {
		const blocks = [];
		map.forEach((floor, z) => {
			floor.forEach((row, y) => {
				row.split('').forEach((char, x) => {
					const startAt = [mapKey, x, y, z];
					const blockLegend = legend[char];
					if (!blockLegend) console.error(char, 'not found in legend', legend);
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
		return blocks;
	}

	getNearbyBlocks(coords = [], distance = []) {
		const [nearX, nearY, nearZ] = coords;
		const [dX, dY, dZ] = distance;
		return this.blocks.filter((block) => {
			if (block.mapKey !== this.mapKey) console.error('block has wrong mapKey', block, 'expecting', this.mapKey);
			const [x, y, z] = block.coords;
			return (
				Math.abs(x - nearX) <= dX
				&& Math.abs(y - nearY) <= dY
				&& Math.abs(z - nearZ) <= dZ
			);
		});
	}

	getBlocksAtCoords(coords = []) {
		return this.blocks.filter((block) => ArrayCoords.checkEqual(block.coords, coords));
	}

	getBlocksAtMoveCoordinates(coords, facing, forward = 0, strafe = 0, up = 0) {
		const newCoords = ArrayCoords.getRelativeCoordsInDirection(coords, facing, forward, strafe, up);
		return this.getBlocksAtCoords(newCoords);
	}

	getBlockedSumAtCoords(coords = []) {
		const blocks = this.getBlocksAtCoords(coords);
		const blockedSum = blocks.reduce((sum, block) => sum + (block.blocked || 0), 0);
		return blockedSum;
	}

	isBlockedAtCoords(coords = []) {
		return (this.getBlockedSumAtCoords(coords) >= 1);
	}

	getNpcs() {
		return this.blocks.filter((block) => block.isNpcBlob);
	}

	getPlayerBlobs() {
		return this.blocks.filter((block) => block.isPlayerBlob);
	}

	findBlock(block) {
		const i = this.foundBlockIndex(block);
		return (i === -1) ? null : this.blocks[i];
	}

	findBlockIndex(block) {
		let foundIndex = -1;
		for (let i = this.blocks.length - 1; i >= 0; i -= 1) {
			if (this.blocks[i].blockId === block.blockId) {
				foundIndex = i;
				i = -1;
			}
		}
		return foundIndex;
	}

	addBlock(block) {
		const i = this.findBlockIndex(block);
		if (i > -1) {
			console.warn('Cannot add duplicate block', block);
			return false;
		}
		this.blocks.push(block);
		return true;
	}

	removeBlock(block) {
		const i = this.findBlockIndex(block);
		if (i === -1) return false;
		this.blocks.splice(i, 1);
		return true;
	}
}

export default VoxelWorldMap;
