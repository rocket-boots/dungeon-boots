import DungeonCrawlerGame from '../DungeonCrawlerGame.js';
import worldMaps from './worldMaps.js';

const game = new DungeonCrawlerGame({
	worldMaps,
	startAt: ['forest', 8, 4, 1],
	clearColor: '#044019',
});
window.document.addEventListener('DOMContentLoaded', () => {
	window.pc = game.makeNewPlayer();
	game.start();
	window.game = game;
	window.g = game;
	window.world = game.world;
});

export default game;
