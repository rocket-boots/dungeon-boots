/* eslint-disable quote-props, object-curly-newline, max-lines */
const teleportDoor = {
	name: 'teleport door',
	blocked: 0,
	renderAs: 'box',
	texture: 'runed_door.png',
};
const forestDoor = {
	name: 'forest path (door)',
	blocked: 0,
	renderAs: 'box',
	texture: 'stone_arch.png',
	soundOn: 'steps',
};
const ghost = {
	name: 'ghost',
	blocked: 0,
	renderAs: 'billboard',
	texture: 'shadow_new.png',
	aggro: 0,
	npc: 'wanderer',
	opacity: 0.7,
	hp: 1,
	invisible: ['item:ghostMask'],
	dialog: {
		hi: {
			q: 'Hello?',
			answer: [
				'I did not deserve to die.',
				'Humans are cruel',
				'Who WAS that?',
				'I\'m going to haunt the village.',
				'I feel cold... so cold...',
				'I was too young for this.',
				'Will you avenge me?',
				'Is this the spirit world?',
				'How do I move on?',
				'I miss my body, the pleasant stink.',
			],
			unlocks: 'die',
		},
		die: {
			q: 'Why did you fight to the death?',
			answer: [
				'To save my only home, Wretchhold.',
				'The people of Wretchhold were my only friends.',
				'Wretchhold was the only place I felt safe.',
				'All my belongings are buried in a hole here in Wretchhold',
				'Wretchhold tavern fed me.',
			],
		},
	},
};
const townFolk = {
	name: 'Townfolk',
	blocked: 1,
	renderAs: 'billboard',
	faction: 'townfolk',
	npc: 'villager',
	damageScale: 0.5,
};
const monster = {
	name: 'monster',
	blocked: 1,
	renderAs: 'billboard',
	// texture: 'cyclops_new.png',
	npc: 'monster',
	faction: 'wretch',
	battleYell: 'goblinBattleYell',
	hurtSound: 'goblinDamaged',
	deathSound: 'goblinDeath',
	aggro: 1,
	damageScale: 1,
	death: {
		spawn: { ...ghost },
	},
};
const goblin = {
	...monster,
	name: 'Goblin',
	texture: 'goblin_new.png',
	npc: 'wanderer',
	damageScale: 0.8,
	aggro: 0,
	hp: 8,
	dialog: {
		die: {
			q: 'Time to die!',
			a: 'AAHhh! mutilator!',
			aggro: 1,
		},
	},
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
		texture: 'cosmic/wall-test.png',
		// textureRange: [1, 11],
	},
	'&': {
		name: 'cave',
		blocked: 1,
		renderAs: 'box',
		color: [0.9, 0.9, 0.9],
		texture: 'lair_new_.png',
		textureRange: [0, 3],
	},
	'G': {
		name: 'grass',
		blocked: 1,
		renderAs: 'box',
		color: [0.9, 0.9, 0.9],
		texture: 'grass_.png',
		textureRange: [0, 2],
	},
	'D': {
		name: 'door',
		blocked: 1,
		renderAs: 'box',
		texture: 'runed_door.png',
		sound: 'door',
	},
	'+': {
		name: 'unlocked door',
		blocked: 0,
		renderAs: 'box',
		texture: 'runed_door.png',
		soundOn: 'door',
	},
	'T': {
		name: 'tree',
		blocked: 1,
		renderAs: 'billboard',
		texture: 'tree_.png',
		textureRange: [0, 8],
	},
	'|': {
		name: 'crumbled_column_1',
		blocked: 1,
		color: [0.8, 0.8, 0.7],
		renderAs: 'billboard',
		texture: 'crumbled_column_.png',
		textureRange: [1, 6],
	},
	'^': {
		name: 'torch',
		blocked: 0,
		color: [1, 1, 1],
		light: [1, 6],
		renderAs: 'billboard',
		texture: 'torch_.png',
		textureRange: [1, 4],
	},
	'a': {
		...townFolk,
		name: 'Townfolk',
		texture: 'human_slave.png',
		dialog: {
			hello: 'Please help us!',
			help: 'There are too many beasts at nearby Wretchhold in the south.',
			goblins: 'When I was a kid, I wanted to be a goblin one day. I know better now.',
		},
	},
	'b': {
		...townFolk,
		name: 'Townfolk',
		texture: 'cosmic/chomper.png',
		dialog: {
			goblins: 'Goblins are ruining this neighbourhood!',
			taxes: 'The Mayor said the goblins are why taxes are so high.',
			hero: {
				answer: ['Your jawline is incredible!'],
			},
		},
	},
	'c': {
		...townFolk,
		name: 'Townfolk',
		texture: 'halfling_new.png',
		dialog: {
			'sheep': 'A goblin stole one of my sheep, and shaved it weird.',
			goblin: 'I saw the goblin fortress in the woods. It looked scary.',
			axe: 'Can I "axe" you a question? Just kidding!',
		},
	},
	'd': {
		...townFolk,
		name: 'Townfolk',
		texture: 'dwarf_new.png',
		dialog: {
			attacks: 'They haven\'t attacked yet... must be planning something big.',
			arms: 'Can I feel your arm? It\'s rock solid!',
			axe: 'Nice axe! Is it heavy?',
		},
	},
	'e': {
		...townFolk,
		name: 'Townfolk',
		texture: 'elf_new.png',
		dialog: {
			goblins: 'I killed a goblin once... I think. It might have been a frog.',
			hero: 'What\'s the biggest monster you ever killed?',
			fortress: 'Wretchhold is south along the path. That\'s where the beasts are gathering.',
		},
	},
	'f': {
		...townFolk,
		name: 'Townfolk',
		texture: 'gnome.png',
		dialog: {
			fear: 'I\'m living in fear!',
			goblins: 'Goblins are so ugly. And short. And they smell bad. Right?',
			doors: {
				q: 'Why are the doors rotated?',
				a: 'I have reason to believe some dark magic from Wretchhold has warped all our doors.',
			},
		},
	},
	'g': {
		...ghost,
	},
	'h': {
		...monster,
		name: 'Goblin Guard',
		texture: 'hobgoblin_new.png',
		npc: 'still',
		aggro: 0,
		dialog: {
			hello: {
				a: 'Who goes there?',
				unlocks: 'me',
			},
			me: {
				locked: true,
				q: 'I do!',
				a: 'A human! Sound the alarm!',
				unlocks: 'alarm',
			},
		},
	},
	'i': {
		...goblin,
	},
	'j': {
		...goblin,
		texture: 'orc_wizard_new.png',
	},
	'k': {
		...monster,
		name: 'Kobold',
		texture: 'kobold_new.png',
		damageScale: 0.5,
		hp: 6,
	},
	'C': {
		...monster,
		name: 'cyclops',
		blocked: 1,
		renderAs: 'billboard',
		texture: 'cyclops_new.png',
		hp: 20,
	},
	'O': {
		...monster,
		name: 'ogre',
		texture: 'ogre_new.png',
		hp: 15,
	},
	'p': {
		name: 'orc priest',
		blocked: 1,
		renderAs: 'billboard',
		texture: 'orc_priest_new.png',
		npc: 'still',
		aggro: 0,
		dialog: {
			hello: 'I have not seen you in Wretchhold before.',
			name: 'I am Zogrod. Though people say I look more like a Zagtor.',
			job: { a: 'I keep an eye out for intruders.', unlocks: 'intruders' },
			intruders: { a: 'Intruders like you!', locked: true },
		},
	},
	'w': {
		...monster,
		name: 'orc warrior',
		texture: 'orc_warrior_new.png',
	},
	'Y': {
		...monster,
		name: 'Midboss Yugerdenyuu',
		texture: 'two_headed_ogre_new.png',
		npc: 'still',
		damageScale: 1.5,
		hp: 30,
		aggro: 0,
		dialog: {
			hi: {
				q: 'Hello there',
				a: 'You dinnit suprise me. Im da biggest \'ere.',
				unlocks: 'big',
			},
			big: {
				locked: true,
				q: 'I\'ve killed bigger, but never uglier. Ready to join your friends?',
				a: 'AAAAH! I brew yer bits an\' blood intah mead!',
				aggro: 1,
			},
		},
	},
	'Z': {
		...monster,
		name: 'Boss Tanxfergetended',
		texture: 'juggernaut.png',
		damageScale: 3,
		hp: 50,
		npc: 'still',
		aggro: 0,
		dialog: {
			hi: {
				q: 'The last one!',
				a: 'All... dead?',
				unlocks: 'dead',
			},
			dead: {
				locked: true,
				q: 'Dead? Not quite all. But soon.',
				a: 'No need... fer ... talk den. Killin\' time.',
				aggro: 1,
			},
		},
	},
	'1': {
		...teleportDoor,
		teleport: ['forest', 5, 1, 1, 2],
	},
	'2': {
		...teleportDoor,
		teleport: ['town', 7, 11, 1, 0],
	},
	'3': {
		...teleportDoor,
		teleport: ['fortress', 16, 1, 1, 2],
	},
	'4': {
		...teleportDoor,
		teleport: ['forest', 5, 13, 1, 0],
	},
	'5': {
		...teleportDoor,
		teleport: ['tavern', 15, 5, 1, 0],
	},
	'6': {
		...teleportDoor,
		teleport: ['fortress', 10, 1, 1, 2],
	},
	'7': {
		...teleportDoor,
		teleport: ['tower1', 4, 1, 1, 2],
	},
	'8': {
		...teleportDoor,
		teleport: ['tavern', 2, 5, 1, 2],
	},
	'9': {
		...teleportDoor,
		teleport: ['tower2', 14, 1, 1, 2],
	},
	'0': {
		...teleportDoor,
		teleport: ['tower1', 13, 1, 1, 2],
	},
	'[': {
		...forestDoor,
		teleport: ['forestOutside', 30, 2, 1, 3],
	},
	']': {
		...forestDoor,
		teleport: ['forest', 1, 4, 1, 1],
	},
	'{': {
		...forestDoor,
		teleport: ['forestOutside', 30, 31, 1, 3],
	},
	'}': {
		...forestDoor,
		teleport: ['forest', 1, 11, 1, 1],
	},
};

export default legend;
