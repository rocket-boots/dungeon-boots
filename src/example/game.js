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
	customEvents,
	sounds,
	startAt: ['temple', 8, 4, 1],
	clearColor: '#221100',
});
window.document.addEventListener('DOMContentLoaded', () => {
	window.pc = game.makeNewPlayer();
	game.start();
	window.game = game;
	window.g = game;
	window.world = game.world;
});

export default game;
