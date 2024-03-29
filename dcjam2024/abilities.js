const abilities = {
	// --- Non-Spells ---
	// --- Ranged ---
	steadyShot: {
		name: 'Steady Shot',
		combat: true,
		range: 3,
		cost: { stamina: 6 },
		chance: 100,
		damage: { hp: [6, 8] },
	},
	aim: {
		name: 'Aimed Shot',
		combat: true,
		range: 5,
		cost: { willpower: 7 },
		chance: 100,
		damage: { hp: [6, 8] },
	},
	wildShot: {
		name: 'Wild Shot',
		combat: true,
		range: 3,
		cost: { balance: 6 },
		chance: 50,
		damage: { hp: [4, 12] },
	},
	overload: {
		name: 'Overloaded Shot',
		combat: true,
		range: 3,
		cost: { stamina: 4, hp: [1, 4] },
		chance: 90,
		damage: { hp: [10, 12] },
	},
	op: {
		name: 'dev shot',
		combat: true,
		range: 5,
		cost: { stamina: 0 },
		damage: { hp: [20, 30] },
	},
	// --- Melee ---
	hack: {
		name: 'Hack',
		combat: true,
		cost: { stamina: 2 },
		damage: { hp: [4, 8] },
	},
	slash: {
		name: 'Slash',
		combat: true,
		cost: { stamina: 2, balance: 4 },
		damage: { hp: [8, 10] },
	},
	bash: {
		name: 'Bash',
		combat: true,
		cost: { stamina: 2, hp: 2 },
		damage: { hp: [4, 14] },
	},
	rally: {
		name: 'Rally',
		combat: true,
		cost: { willpower: 10 },
		replenish: { hp: [2, 8], stamina: [2, 10] },
	},
	// rally: {
	// 	name: 'Rally',
	// 	combat: true,
	// 	replenish: { willpower: [1, 5], stamina: [1, 5] },
	// },
	// dodge: {
	// 	name: 'Dodge',
	// 	combat: true,
	// 	cost: { balance: 2 },
	// 	effect: { evasion: 0.75, rounds: 1 },
	// },
	tactics: {
		name: 'Tactics',
		combat: true,
		cost: { willpower: 4 },
		replenish: { health: [1, 2], stamina: [1, 5], balance: [2, 6] },
	},
	lunge: {
		name: 'Lunge',
		combat: true,
		cost: { balance: 2, stamina: 1 },
		damage: { hp: [4, 8] },
	},
	swift: {
		name: 'Swift Attack',
		combat: true,
		cost: { balance: 3 },
		damage: { hp: [5, 7] },
	},
	spin: {
		name: 'Spin Attack',
		combat: true,
		cost: { balance: 4 },
		damage: { hp: [5, 12] },
	},
	// feint: {
	// 	name: 'Feint',
	// 	combat: true,
	// 	cost: { balance: 5 },
	// 	damage: { balance: [1, 5] },
	// 	replenish: { balance: [0, 4] },
	// 	effect: { evasion: 0.25, rounds: 1 },
	// },
	// parry: {
	// 	name: 'Parry',
	// 	combat: true,
	// 	cost: { stamina: 1, balance: 1 },
	// 	effect: { evasion: 0.5, rounds: 1 },
	// },
	reprise: {
		name: 'Reprise',
		combat: true,
		damage: { hp: [1, 4] },
		cost: { stamina: 1 },
		replenish: { balance: [1, 5] },
	},
	push: {
		name: 'Push',
		combat: true,
		cost: { stamina: 1 },
		damage: { hp: 1, balance: [4, 8] },
	},
	insistence: {
		name: 'Insistence',
		cost: { willpower: 2 },
		replenish: { stamina: [5, 8] },
	},
	sweep: {
		name: 'Sweep',
		cost: { stamina: 3 },
		damage: { hp: [2, 6] },
	},
	berserk: {
		name: 'Berserk',
		cost: { willpower: 10, stamina: 8 },
		damage: { hp: [4, 12], stamina: [1, 4] },
		replenish: { hp: [2, 6] },
	},
	rage: {
		name: 'Rage',
		cost: { willpower: 4, stamina: 4, hp: 1 },
		replenish: { willpower: [1, 4], stamina: [1, 4] },
	},
	counterStrike: {
		name: 'Counter-strike',
		cost: { willpower: 1, stamina: 1, balance: 1 },
		damage: { hp: [4, 5] },
	},
	endure: {
		name: 'Endure',
		cost: { willpower: 1 },
		replenish: { stamina: 1, hp: 1 },
	},
	// --- Spells ---
	// light: {
	// 	name: 'Light',
	// 	spell: true,
	// 	cost: { willpower: 1 },
	// 	effect: { brightness: 10, rounds: 20 },
	// },
	focus: {
		name: 'Mental Focus',
		spell: true,
		cost: { stamina: 1 },
		replenish: { willpower: 5 },
	},
	heal: {
		name: 'Heal I',
		spell: true,
		cost: { willpower: 2 },
		replenish: { hp: [5, 10] },
	},
	heal2: {
		name: 'Heal II',
		spell: true,
		cost: { willpower: 5 },
		replenish: { hp: [10, 16] },
	},
};
Object.keys(abilities).forEach((key) => {
	const ability = abilities[key];
	ability.key = key;
	if (ability.combat && ability.range === undefined) ability.range = 1; // Melee range is default
});
export default Object.freeze(abilities);
