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
});
window.document.addEventListener('DOMContentLoaded', () => {
	window.pc = game.makeNewPlayer(
		['forest', 20, 38, 1],
		{
			name: 'Barrett Boulderfist',
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
	game.start();
	window.game = game;
	window.g = game;
	window.world = game.world;
});

export default game;
