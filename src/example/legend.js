/* eslint-disable quote-props, object-curly-newline */
const teleportDoor = {
	name: 'teleport door',
	blocked: 0,
	renderAs: 'box',
	texture: 'runed_door.png',
};
const legend = {
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
	'&': {
		name: 'brick',
		blocked: 1,
		renderAs: 'box',
		color: [0.8, 0.8, 0.7],
		texture: 'bricks.png',
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
	'C': {
		name: 'cyclops',
		blocked: 1,
		renderAs: 'plane',
		texture: '/monster/cyclops_new.png',
		npc: 'monster',
	},
	'1': {
		...teleportDoor,
		teleport: ['temple', 11, 0, 2, 1],
	},
	'2': {
		...teleportDoor,
		teleport: ['temple', 10, 1, 1, 2],
	},
	'3': {
		...teleportDoor,
		teleport: ['arena', 10, 1, 1, 2],
	},
	'4': {
		...teleportDoor,
		teleport: ['temple', 10, 5, 1, 0],
	},
	// Forest Tiles
	'd': {
		name: 'dirt',
		blocked: 1,
		renderAs: 'box',
		color: [0.8, 0.8, 0.7],
		texture: '/level_objects/floor/dirt0.png',
	},
	'M': {
		name: 'mangrove',
		blocked: 1,
		renderAs: 'box',
		color: [0, 0, 0],
		texture: '/level_objects/trees/mangrove1.png',
	},
	'N': {
		name: 'mangrove2',
		blocked: 1,
		renderAs: 'box',
		color: [0, 0, 0],
		texture: '/level_objects/trees/mangrove2.png',
	},
	'T': {
		name: 'tree_yellow',
		blocked: 1,
		renderAs: 'box',
		color: [0, 0, 0],
		texture: '/level_objects/trees/tree1_yellow.png',
	},
	'W': {
		name: 'wandering_mushroom',
		blocked: 1,
		renderAs: 'plane',
		texture: '/monsters/fungi_plants/wandering_mushroom.png',
		npc: 'monster',
	},
};

export default legend;
