import DungeonCrawlerGame from '../DungeonCrawlerGame.js';
import worldMaps from './worldMaps.js';

const game = new DungeonCrawlerGame({
	worldMaps,
	startAt: ['forest', 10, 10, 1],
	clearColor: '#467ee0',
});
window.document.addEventListener('DOMContentLoaded', () => {
	window.pc = game.makeNewPlayer();
	game.start();
	window.game = game;
	window.g = game;
	window.world = game.world;
});

export default game;
