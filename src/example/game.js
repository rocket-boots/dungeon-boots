import DungeonCrawlerGame from '../DungeonCrawlerGame.js';
import worldMaps from './worldMaps.js';
import sounds from './sounds.js';

const customEvents = {
	switch() {
		console.log('DO CHARACTER SWITCH');
	},
};

const potionBelt = {
	key: 'potionBelt',
	name: 'Belt of Potions',
	description: 'These small vials are filled with a tasty beverage that heals a small amount.',
};

const game = new DungeonCrawlerGame({
	worldMaps,
	customEvents,
	sounds,
	startAt: ['town', 1, 1, 1],
	clearColor: '#161013',
});

window.document.addEventListener('DOMContentLoaded', () => {
	window.pc = game.makeNewPlayer(
		['town', 3, 2, 1],
		{
			name: 'Barrett Boulderfist',
			texture: 'rupert_new.png',
			battleYell: 'warriorBattleYell',
			hurtSound: 'hurt',
			hp: 20,
			stamina: 20,
			facing: 2,
			faction: 'slayers',
			dialog: {
				hi: 'Stay out of my way while I crush all these vile vermin!',
			},
			inventory: [{
				key: 'giantAxe',
				name: 'Giant Battleaxe',
				description: 'It is well-balanced, sharp, and good for beheading.',
			}, potionBelt],
			characterSheetIntroHtml: (
				`<img src="./images/Slayer_Portrait.jpeg" class="character-sheet-portrait" />
				Barret Boulderfist is the bane of all monsters, an axe-wielding one man army who
				fights without mercy. He's purged a hundred dungeons full of vile horrors, and has no fear that
				any enemy can match his brutal prowess in combat. A consummate professional, he takes great
				pride in his work, and he enjoys it too - after all, these dungeons need to be cleared,
				and nobody can do it better than him.
				<hr style="margin: 1em 0" />`
			),
			abilities: ['hack', 'slash', 'bash', 'rally', 'berserk'],
		},
	);
	window.pc = game.makeNewPlayer(
		['town', 17, 9, 1],
		{
			name: 'Warmthistle',
			texture: 'human_new.png',
			hurtSound: 'hurt',
			willpower: 20,
			facing: 3,
			faction: 'neutral',
			dialog: {
				hi: { a: 'I came to Wretchhold because I sensed violence was near.', unlocks: 'wretchhold' },
				name: 'I am known as Warmthistle.',
				wretchhold: { a: 'Do the people of Wretchhold deserve to die?', locked: true },
			},
			inventory: [{
				key: 'ghostMask',
				name: 'Ghost Mask',
				description: 'It allows you to see and speak with ghosts.',
			}, potionBelt],
			characterSheetIntroHtml: (
				`<img src="./images/Druid_Portrait.jpeg" class="character-sheet-portrait" />
				Warmthistle, a young man in appearance, is a
				fragment of the great and ancient pattern of the forest, a song whispered by the
				wind in the leaves.
				This druid watches, with benevolent but detched curiosity,
				the comings and goings of the hot-blooded short-lived things - and sometimes, if the
				moment seems worthy, chooses to play a part in their stories.
				<hr style="margin: 1em 0" />`
			),
			abilities: ['hack', 'swift', 'reprise', 'heal', 'heal2'],
		},
	);
	game.start(0);
	window.game = game;
	window.g = game;
	window.world = game.world;
});

export default game;
