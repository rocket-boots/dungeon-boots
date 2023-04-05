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
		name: 'cobble',
		blocked: 1,
		renderAs: 'box',
		color: [0.8, 0.8, 0.7],
		texture: 'catacombs_.png',
		textureRange: [1, 11],
	},
	'&': {
		name: 'cave',
		blocked: 1,
		renderAs: 'box',
		color: [0.9, 0.9, 0.9],
		texture: 'lair_new_.png',
		textureRange: [0, 3],
	},
	'|': {
		name: 'crumbled_column',
		blocked: 1,
		color: [0.8, 0.8, 0.7],
		renderAs: 'plane',
		texture: 'crumbled_column_.png',
		textureRange: [1, 6],
	},
	// 'X': {
	// name: 'cyclops', blocked: 1, renderAs: 'sprite', texture: 'cyclops_new.png',
	// },
	'C': {
		name: 'cyclops',
		blocked: 1,
		renderAs: 'plane',
		// color: [0.1, 0.1, 0.1],
		texture: 'cyclops_new.png',
		npc: 'monster',
		aggro: 1,
	},
	'O': {
		name: 'ogre',
		blocked: 1,
		renderAs: 'plane',
		texture: 'ogre_new.png',
		npc: 'monster',
		aggro: 1,
	},
	'p': {
		name: 'orc priest',
		blocked: 1,
		renderAs: 'plane',
		texture: 'orc_priest_new.png',
		npc: 'still',
		aggro: 0,
		dialog: {
			hello: 'I have not seen you in Wretchold before.',
			name: 'I am Zogrod.',
			job: { a: 'I keep an eye out for intruders.', unlocks: 'intruders' },
			intruders: { a: 'Intruders like you!', locked: true },
		},
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
};

export default legend;
