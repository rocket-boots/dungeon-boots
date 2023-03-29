import clamp from 'rocket-boots-three-toolbox/src/clamp.js';
import PseudoRandomizer from './PseudoRandomizer.js';
import ArrayCoords from './ArrayCoords.js';

const DEFAULT_BLOCK_TYPES = {
	' ': { name: 'clear', blocked: 0, renderAs: false },
	'#': { name: 'stone', blocked: 1, renderAs: 'box', color: [0.8, 0.8, 0.7] },
};

class VoxelWorld {
	constructor(world = {}, blockTypes) {
		this.above = [
			[
				'###################',
				'###################',
				'###### ############',
				'###################',
				'###################',
				'###################',
				'########## ########',
			],
			[
				'##########1########',
				'###    ##| | #    #',
				'#   #         ## #',
				'# # #       ## ##C#',
				'### ###C    ## #  #',
				'###   ####        #',
				'###################',
			],
			[
				'##########2       #',
				'################# #',
				'########## ########',
				'########## ########',
				'###        ## ####',
				'###   ####     ####',
				'########## ########',
			],
		];
		this.below = [
			null,
			[
				'###################',
				'###################',
				'###### ############',
				'###################',
				'###################',
				'###################',
				'########## ########',
			],
		];
		this.beyondAbove = '#';
		this.beyondBelow = '#';
		this.blockTypes = blockTypes || DEFAULT_BLOCK_TYPES;
	}

	getFloor(z = 0) {
		const isBelow = (z < 0);
		// One array for +z, one for -z
		const obj = (isBelow) ? this.below : this.above;
		const zIndex = Math.abs(z);
		return obj[zIndex];
	}

	getFloorClone(z = 0) {
		return JSON.parse(JSON.stringify(this.getFloor(z)));
	}

	getFloorSize(z = 0) {
		const floor = this.getFloor(z);
		return [
			floor[0].length, // Just look at the first row; assumes they're all the same
			floor.length,
		];
	}

	getFloorCenter(z = 0) {
		const [maxX, maxY] = this.getFloorSize(z);
		return [Math.floor(maxX / 2), Math.floor(maxY / 2)];
	}

	getFloorBlocks(z = 0) {
		const floor = this.getFloor(z);
		if (!floor) return [];
		const blocks = [];
		floor.forEach((row, y) => {
			row.split('').forEach((char, x) => {
				const coords = [x, y, z];
				const block = this.getBlockByType(char, coords);
				blocks.push(block);
			});
		});
		return blocks;
	}

	getBlockByType(char, coords) {
		// Look up the basic block type and copy it
		const block = { ...this.blockTypes[char] };
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

	getBeyondBlock(isBelow, coords) {
		const block = this.getBlockByType(
			isBelow ? this.beyondBelow : this.beyondAbove,
			coords,
		);
		block.beyond = true;
		return block;
	}

	getBlock(coords) {
		const [x = 0, y = 0, z = 0] = coords;
		const isBelow = (z < 0);
		// x and y are effectively indices in an array, so they can't be negative
		if (x < 0 || y < 0) {
			return this.getBeyondBlock(isBelow, coords);
		}
		const floor = this.getFloor(z);
		if (!floor) { // If nothing defined for that z level
			return this.getBeyondBlock(isBelow, coords);
		}
		const row = floor[y];
		if (!row) {
			return this.getBeyondBlock(isBelow, coords);
		}
		const blockChar = row.charAt(x);
		if (!blockChar) {
			return this.getBeyondBlock(isBelow, coords);
		}
		return this.getBlockByType(blockChar, coords);
	}

	getBlockAtMoveCoordinates(coords, facing, forward = 0, strafe = 0, up = 0) {
		const newCoords = ArrayCoords.getRelativeCoordsInDirection(coords, facing, forward, strafe, up);
		return this.getBlock(newCoords);
	}
}

export default VoxelWorld;
