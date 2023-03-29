/* eslint-disable quote-props, object-curly-newline */
const teleportDoor = {
	name: 'teleport door',
	blocked: 0,
	renderAs: 'box',
	texture: 'runed_door.png',
};
const BLOCK_TYPES = {
	' ': {
		name: 'clear', blocked: 0, renderAs: false,
	},
	'#': {
		name: 'stone',
		blocked: 1,
		renderAs: 'box',
		color: [0.8, 0.8, 0.7],
		texture: 'catacombs_.png',
		textureRange: [1, 11],
	},
	'|': {
		name: 'crumbled_column',
		blocked: 1,
		color: [0.8, 0.8, 0.7],
		renderAs: 'plane',
		texture: 'crumbled_column_.png',
		textureRange: [1, 6],
	},
	'S': {
		name: 'cyclops', blocked: 1, renderAs: 'sprite', texture: 'cyclops_new.png',
	},
	'C': { name: 'cyclops', blocked: 1, renderAs: 'plane', texture: 'cyclops_new.png' },
	'1': {
		...teleportDoor,
		teleport: ['cells', 11, 0, 2, 1],
	},
	'2': {
		...teleportDoor,
		teleport: ['cells', 10, 1, 1, 2],
	},
};

export default BLOCK_TYPES;
