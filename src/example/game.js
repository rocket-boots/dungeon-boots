import DungeonCrawlerGame from '../DungeonCrawlerGame.js';
import worldMaps from './worldMaps.js';
import sounds from './sounds.js';

const customEvents = {
	switch() {
		console.log('DO CHARACTER SWITCH');
	},
};

const game = new DungeonCrawlerGame({
	worldMaps,
	startAt: ['forest', 20, 38, 1],
	clearColor: '#467ee0',
	customEvents,
	sounds,

	// startAt: ['town', 1, 1, 1],
	// clearColor: '#161013',
});
// window.document.addEventListener('DOMContentLoaded', () => {
// 	window.pc = game.makeNewPlayer(
// 		['town', 3, 2, 1],
// });
window.document.addEventListener('DOMContentLoaded', () => {
	window.pc = game.makeNewPlayer(
		['forest_outside', 21, 38, 1],
		{
			name: 'Barrett Boulderfist',
			texture: 'rupert_new.png',
			hp: 20,
			stamina: 20,
			facing: 2,
			dialog: {
				hi: 'Stay out of my way while I crush all these vile vermin!',
			},
			inventory: [{
				key: 'giantAxe',
				name: 'Giant Battleaxe',
				description: 'It is well-balanced, sharp, and good for beheading.',
			}],
			characterSheetIntroHtml: (
				`<img src="./images/Slayer_portrait.jpeg" class="character-sheet-portrait" />
				Barret Boulderfist is a hyper-competent one man army in his prime. He has cleared
				a hundred dungeons full of violent creatures, and is unperturbed by facing another one.
				He is known to be brutal but intelligent, a combat obsessive who takes pride in his
				work and enjoys it too. After all, the dungeons need to be cleared, and nobody can do it
				better.<hr style="margin: 1em 0" />`
			),
		},
	);
	window.pc = game.makeNewPlayer(
		['town', 17, 9, 1],
		{
			name: 'Druid McDruidface',
			texture: 'human_new.png',
			willpower: 20,
			facing: 3,
			dialog: {
				hi: { a: 'I came to Wretchhold because I sensed violence.', unlocks: 'wretchhold' },
				wretchhold: { a: 'Do the people of Wretchhold deserve to die?', locked: true },
			},
			inventory: [{
				key: 'ghostMask',
				name: 'Ghost Mask',
				description: 'It allows you to see and speak with ghosts.',
			}],
			characterSheetIntroHtml: (
				`<img src="./images/Druid_portrait.jpeg" class="character-sheet-portrait" />
				Druid McDruidface is a junior druid who's rapidly becoming disillusioned.
				He entered the vocation as a naive idealist, thinking he would be able to do
				some good for all the creatures who live in the land, but he's been disturbed
				by what he's seen so far: unnecessary suffering is a moral wrong, and so many of
				the battles seem unnecessary. He never meant to get involved here, but he
				heard cries for help, and couldn't turn away from that.
				<hr style="margin: 1em 0" />`
			),
		},
	);
	game.start(0);
	window.game = game;
	window.g = game;
	window.world = game.world;
});

export default game;
