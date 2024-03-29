/* eslint-disable quote-props */

export const shipColor = [0.97, 0.98, 1];
export const caveColor = [0.9, 0.9, 0.9];

export const baseLegend = {
	' ': {
		name: 'empty',
		blocked: 0,
		renderAs: false,
	},
	'.': {
		name: 'void',
		blocked: 1,
		renderAs: false,
	},
	'#': {
		name: 'temple stone',
		blocked: 1,
		renderAs: 'box',
		color: shipColor,
		texture: 'stone.png',
		textureRange: [0, 7],
	},
	'%': {
		name: 'cave with stones',
		blocked: 1,
		renderAs: 'box',
		color: shipColor,
		texture: 'floor.png',
		textureRange: [0, 7],
	},
	'&': {
		name: 'cave',
		blocked: 1,
		renderAs: 'box',
		color: caveColor,
		texture: 'cave.png',
		// textureRange: [0, 3],
	},
	'X': {
		name: 'destrucible cave wall',
		blocked: 1,
		renderAs: 'box',
		npc: 'mindless',
		color: caveColor,
		texture: 'cave_crack.png',
		// textureRange: [0, 3],
	},
};

export const teleportDoor = {
	name: 'teleport door',
	blocked: 0,
	renderAs: 'box',
	texture: 'ship_door.png',
	soundOn: 'door',
};

export const monster = {
	blocked: 1,
	renderAs: 'billboard',
	npc: 'monster',
	faction: 'monsters',
	aggro: 1,
};

export const voice = {
	name: 'The Voice',
	blocked: 0,
	renderAs: 'billboard',
	faction: 'loyalist',
	texture: 'voice.png',
	light: [1, 2],
	npc: 'still',
	aggro: 0,
	hp: 1000,
	trigger: {
		talk: true,
	},
};
