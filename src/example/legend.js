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
		name: 'crumbled_column_1',
		blocked: 1,
		color: [0.8, 0.8, 0.7],
		renderAs: 'plane',
		texture: 'crumbled_column_1.png',
	},
	'[': {
		name: 'crumbled_column_2',
		blocked: 1,
		color: [0.8, 0.8, 0.7],
		renderAs: 'plane',
		texture: 'crumbled_column_2.png',
	},
	']': {
		name: 'crumbled_column_3',
		blocked: 1,
		color: [0.8, 0.8, 0.7],
		renderAs: 'plane',
		texture: 'crumbled_column_3.png',
	},
	'}': {
		name: 'crumbled_column_4',
		blocked: 1,
		color: [0.8, 0.8, 0.7],
		renderAs: 'plane',
		texture: 'crumbled_column_4.png',
	},
	'{': {
		name: 'crumbled_column_6',
		blocked: 1,
		color: [0.8, 0.8, 0.7],
		renderAs: 'plane',
		texture: 'crumbled_column_6.png',
	},	
	'C': {
		name: 'cyclops',
		blocked: 1,
		renderAs: 'plane',
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
	
	// Forest Floor Tiles
	// ----------------------------------------------
	'd': {
		name: 'dirt',
		blocked: 1,
		renderAs: 'box',
		color: [0.8, 0.8, 0.7],
		texture: '/level_objects/floor/dirt0.png',
	},

	'O': {
		name: 'deep_water',
		blocked: 1,
		renderAs: 'box',
		color: [0.8, 0.8, 0.7],
		texture: '/level_objects/water/deep_water.png',
	},
	'o': {
		name: 'shallow_water',
		blocked: 1,
		renderAs: 'box',
		color: [0.8, 0.8, 0.7],
		texture: '/level_objects/water/shallow_water.png',
	},

	// Forest Architecture
	// ----------------------------------------------
	'a': {
		name: 'statue_archer',
		blocked: 1,
		color: [0.8, 0.8, 0.7],
		renderAs: 'plane',
		texture: 'statue_archer.png',
	},
	'c': {
		name: 'statue_centaur',
		blocked: 1,
		color: [0.8, 0.8, 0.7],
		renderAs: 'plane',
		texture: 'statue_centaur.png',
	},
	'f': {
		name: 'dry_fountain',
		blocked: 1,
		color: [0.8, 0.8, 0.7],
		renderAs: 'plane',
		texture: 'dry_fountain.png',
	},

	// Forest Trees
	// ----------------------------------------------
	'm': {
		name: 'mangrove_1',
		blocked: 1,
		renderAs: 'box',
		color: [0.8, 0.8, 0.7],
		texture: '/level_objects/trees/mangrove1.png',
	},
	't': {
		name: 'mangrove_2',
		blocked: 1,
		renderAs: 'sprite',
		color: [0.8, 0.8, 0.7],
		texture: '/level_objects/trees/mangrove2.png',
	},
	'n': {
		name: 'mangrove_3',
		blocked: 1,
		renderAs: 'sprite',
		color: [0.8, 0.8, 0.7],
		texture: '/level_objects/trees/mangrove3.png',
	},
	'y': {
		name: 'tree_yellow',
		blocked: 1,
		renderAs: 'sprite',
		color: [0.8, 0.8, 0.7],
		texture: '/level_objects/trees/tree1_yellow.png',
	},
	'r': {
		name: 'tree_red',
		blocked: 1,
		renderAs: 'sprite',
		color: [0.8, 0.8, 0.7],
		texture: '/level_objects/trees/tree1_red.png',
	},

	// Forest Monsters
	// ----------------------------------------------
	'W': {
		name: 'wandering_mushroom',
		blocked: 1,
		renderAs: 'plane',
		texture: '/monsters/forest/wandering_mushroom.png',
		npc: 'monster',
	},
	'D': {
		name: 'deathcap',
		blocked: 1,
		renderAs: 'plane',
		texture: '/monsters/forest/death_cap.png',
		npc: 'monster',
	},
	'F': {
		name: 'blink_frog',
		blocked: 1,
		renderAs: 'plane',
		texture: '/monsters/forest/wandering_mushroom.png',
		npc: 'monster',
	},
	'B': {
		name: 'butterfly_green',
		blocked: 1,
		renderAs: 'plane',
		texture: '/monsters/forest/butterfly_green.png',
		npc: 'monster',
	},
	'V': {
		name: 'butterfly_violet',
		blocked: 1,
		renderAs: 'plane',
		texture: '/monsters/forest/butterfly_violet.png',
		npc: 'monster',
	},
	'J': {
		name: 'jumping_spider',
		blocked: 1,
		renderAs: 'plane',
		texture: '/monsters/forest/jumping_spider.png',
		npc: 'monster',
	},
	'S': {
		name: 'spider',
		blocked: 1,
		renderAs: 'plane',
		texture: '/monsters/forest/spider.png',
		npc: 'monster',
	},
	'T': {
		name: 'trapdoor_spider',
		blocked: 1,
		renderAs: 'plane',
		texture: '/monsters/forest/trapdoor_spider.png',
		npc: 'monster',
	},
	'Y': {
		name: 'yellow_wasp',
		blocked: 1,
		renderAs: 'plane',
		texture: '/monsters/forest/yellow_wasp.png',
		npc: 'monster',
	},
	'V': {
		name: 'vampire_mosquito',
		blocked: 1,
		renderAs: 'plane',
		texture: '/monsters/forest/vampire_mosquito.png',
		npc: 'monster',
	},

};

export default legend;
