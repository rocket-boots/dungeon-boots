import ArrayCoords from './ArrayCoords.js';
import BlockEntity from './BlockEntity.js';
import NpcBlob from './NpcBlob.js';

class VoxelWorldMap {
	constructor(mapKey, world, sourceMap = []) {
		this.mapKey = mapKey;
		this.world = world; // parent
		this.sourceMap = sourceMap || world.sourceMaps[mapKey];
		// console.log('Making', mapKey, 'from', this.sourceMap);
		const { map, legend } = this.sourceMap;
		this.originalMap = map;
		this.legend = legend;
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

	getNpcs() {
		return this.blocks.filter((block) => block.isNpcBlob);
	}
}

export default VoxelWorldMap;