/* eslint-disable quote-props */

export const shipColor = [0.97, 0.98, 1];
export const caveColor = [0.9, 0.9, 0.9];

export const teleportDoor = {
	name: 'Door',
	blocked: 0,
	renderAs: 'box',
	texture: 'door0.png',
	// soundOn: 'door',
};

export const returnTeleportDoor = {
	...teleportDoor,
	name: 'Door (Previous Level)',
	texture: 'door1.png',
};

export const monster = {
	blocked: 1,
	renderAs: 'billboard',
	npc: 'monster',
	faction: 'monsters',
	aggro: 1,
	hurtSound: 'monsterHurt',
	deathSound: 'monsterHurt',
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
	hp: 100,
	damageScale: 0.15,
	// trigger: { talk: true },
};

export const obstacle = {
	blocked: 1,
	renderAs: 'billboard',
	npc: 'mindless',
	aggro: 0,
	hp: 10,
	stamina: 0,
	willpower: 0,
	balance: 0,
};

export const baseLegend = {
	' ': {
		name: 'empty',
		air: 1,
		blocked: 0,
		renderAs: false,
	},
	'.': {
		name: 'void',
		air: 1,
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
	'(': {
		name: 'cave-in rubble',
		blocked: 1,
		renderAs: 'box',
		color: caveColor,
		texture: 'cave_crack.png',
		// textureRange: [0, 3],
	},
	'X': {
		name: 'destructible cave wall',
		blocked: 1,
		renderAs: 'box',
		npc: 'mindless',
		color: caveColor,
		texture: 'cave_crack.png',
		// textureRange: [0, 3],
		hp: 14,
		stamina: 0,
		willpower: 0,
		balance: 0,
	},
	'x': {
		name: 'destructible rubble',
		blocked: 1,
		renderAs: 'box',
		npc: 'mindless',
		color: caveColor,
		texture: 'cave_crack.png',
		// textureRange: [0, 3],
		hp: 10,
		stamina: 0,
		willpower: 0,
		balance: 0,
	},
	'r': {
		name: 'Empty Reliqaury',
		blocked: 1,
		renderAs: 'billboard',
		texture: 'pillar.png',
	},
	'R': {
		name: 'Reliqaury',
		blocked: 1,
		renderAs: 'billboard',
		texture: 'pillar_relic.png',
		light: [1, 4],
		interact: {
			text: 'Take relic',
			// once: true,
			actions: [
				['give', { key: 'relic', name: 'The Codex of Humanity' }],
				['change', {
					name: 'Empty Reliquary',
					texture: 'pillar.png',
					interact: null,
					light: null,
				}],
				// ['replace', 'r'],
			],
		},
	},
	'v': {
		...obstacle,
		name: 'Tentacle Vines',
		texture: 'vines.png',
		textureRange: [0, 1],
		light: [0.5, 2],
		hp: 5,
	},
	'W': {
		...monster,
		name: 'Star Worm',
		texture: 'worm.png',
		textureRange: [0, 1],
		hurtSound: 'wormHurt',
		deathSound: 'wormDead',
	},
	'B': {
		...monster,
		name: 'Monstrosity',
		texture: 'skull_blob.png',
		npc: 'still',
		aggro: 1,
		textureRange: [0, 1],
	},
	'b': {
		...monster,
		name: 'Monstrosity',
		texture: 'skull_blob.png',
		npc: 'still',
		aggro: 0,
		textureRange: [0, 1],
	},
	'C': {
		...monster,
		name: 'Foul Chomper',
		texture: 'chomper.png',
		// textureRange: [0, 3],
	},
};
