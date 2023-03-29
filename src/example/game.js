import DungeonCrawlerGame from '../DungeonCrawlerGame.js';
import blockTypes from './blockTypes.js';

const game = new DungeonCrawlerGame({
	blockTypes,
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
