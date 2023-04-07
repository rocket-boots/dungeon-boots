/* eslint-disable quote-props, object-curly-newline, max-lines */
export default {
	// Forest Floor Tiles
	// ----------------------------------------------
	'd': {
		name: 'dirt',
		blocked: 1,
		renderAs: 'box',
		color: [0.8, 0.8, 0.7],
		texture: '/level_objects/floor/dirt0.png',
	},
	'+': {
		name: 'stairs_up',
		blocked: 1,
		renderAs: 'box',
		color: [0.8, 0.8, 0.7],
		texture: 'stairs_up.png',
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
	'H': {
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
	'P': {
		name: 'vampire_mosquito',
		blocked: 1,
		renderAs: 'plane',
		texture: '/monsters/forest/vampire_mosquito.png',
		npc: 'monster',
	},
	'[': {
		name: 'crumbled_column_2',
		blocked: 1,
		color: [0.8, 0.8, 0.7],
		renderAs: 'billboard',
		texture: 'crumbled_column_2.png',
	},
	']': {
		name: 'crumbled_column_3',
		blocked: 1,
		color: [0.8, 0.8, 0.7],
		renderAs: 'billboard',
		texture: 'crumbled_column_3.png',
	},
	'}': {
		name: 'crumbled_column_4',
		blocked: 1,
		color: [0.8, 0.8, 0.7],
		renderAs: 'billboard',
		texture: 'crumbled_column_4.png',
	},
	'{': {
		name: 'crumbled_column_6',
		blocked: 1,
		color: [0.8, 0.8, 0.7],
		renderAs: 'billboard',
		texture: 'crumbled_column_6.png',
	},
};
