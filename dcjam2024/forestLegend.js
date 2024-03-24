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
		renderAs: 'billboard',
		texture: 'statue_archer.png',
	},
	'c': {
		name: 'statue_centaur',
		blocked: 1,
		color: [0.8, 0.8, 0.7],
		renderAs: 'billboard',
		texture: 'statue_centaur.png',
	},
	'f': {
		name: 'dry_fountain',
		blocked: 1,
		color: [0.8, 0.8, 0.7],
		renderAs: 'billboard',
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
		name: 'wandering mushroom',
		blocked: 1,
		renderAs: 'billboard',
		texture: '/monsters/forest/wandering_mushroom.png',
		npc: 'monster',
	},
	'H': {
		name: 'deathcap',
		blocked: 1,
		renderAs: 'billboard',
		texture: '/monsters/forest/death_cap.png',
		npc: 'monster',
	},
	'F': {
		name: 'blink frog',
		blocked: 1,
		renderAs: 'billboard',
		texture: '/monsters/forest/wandering_mushroom.png',
		npc: 'monster',
	},
	'B': {
		name: 'Butterfly',
		blocked: 1,
		renderAs: 'billboard',
		texture: '/monsters/forest/butterfly_green.png',
		hp: 5,
		npc: 'monster',
	},
	'V': {
		name: 'Butterfly',
		blocked: 1,
		renderAs: 'billboard',
		texture: '/monsters/forest/butterfly_violet.png',
		hp: 5,
		npc: 'monster',
	},
	'J': {
		name: 'jumping spider',
		blocked: 1,
		renderAs: 'billboard',
		texture: '/monsters/forest/jumping_spider.png',
		npc: 'monster',
	},
	'S': {
		name: 'spider',
		blocked: 1,
		renderAs: 'billboard',
		texture: '/monsters/forest/spider.png',
		npc: 'monster',
		aggro: 1,
	},
	'T': {
		name: 'trapdoor spider',
		blocked: 1,
		renderAs: 'billboard',
		texture: '/monsters/forest/trapdoor_spider.png',
		npc: 'monster',
	},
	'Y': {
		name: 'yellow wasp',
		blocked: 1,
		renderAs: 'billboard',
		texture: 'yellow_wasp.png',
		npc: 'monster',
		aggro: 1,
	},
	'P': {
		name: 'vampire mosquito',
		blocked: 1,
		renderAs: 'billboard',
		texture: '/monsters/forest/vampire_mosquito.png',
		damageScale: 2,
		npc: 'monster',
		aggro: 1,
	},
};
