import { DungeonCrawlerGame } from '../build/dungeon-boots.esm.js';
import worldMaps from './maps/worldMaps.js';
import sounds from './sounds.js';
import abilities from './abilities.js';

const game = new DungeonCrawlerGame({
	imageUrlRoot: './images',
	worldMaps,
	abilities,
	sounds,
	startAt: ['shipMap', 1, 9, 1], // TODO: Is this used?
	clearColor: '#161013',
	renderTime: 0.2,
	titleHtml: `
		<div class="splash">
			<h1>Voice in the Void</h1>
			<div class="credits">
				<div>
					<p>
						Created in a week for Dungeon Crawler Jam 2024
						<br/>
						Using the Dungeon Boots web framework
					</p>
					<p>
						Programming, artwork, UI, level design, sound effects...<br/>
						By Morph (Luke)
					</p>
					<p>
						v1.0.0
					</p>
				</div>
				<div class="human-stamp">
					💯%✋ Made By Humans - No AI
				</div>
			</div>
		</div>
	`,
	roundHook(g) { // Check for win state
		const blob = g.getMainPlayer();
		const mapKey = blob.getMapKey();
		const worldMap = g.world.getMap(mapKey);
		if (worldMap.mapKey !== 'returnMap') return;
		if (blob.coords[0] === 5 && blob.coords[1] === 5 && blob.getInventoryItemByKey('relic')) {
			document.getElementById('main').innerHTML = `
				<div class="win">
					<p>You place the relic in the ship.</p>
					<p>The Voice instructs you: "The docking process has us wedged into the
					asteroid. Go into the tunnel and loosen the stone."
					</p>
					<p>Once out of the ship, you hear the Voice again: "Our King, The Endless
					Intellect, thanks you for your service. You have shown yourself to be more
					than a simple automaton. But now that you are awake, it is too risky to take
					you along for the return trip. You may guard these ruins now. For eternity."
					</p>
					<p>The ship undocks from the asteroid and drifts away. The engines engage
					and it vanishes.
					</p>
					<p>You look down at your hands, metallic and cold. As a machine, you realize
					you will not die. Yet there will be no rescue.</p>
					<p>You stare off into the dark Void of space...</p>
					<h1>The End</h1>
				</div>
			`;
			g.stop();
		}
	},
});

window.document.addEventListener('DOMContentLoaded', () => {
	window.pc = game.makeNewPlayer(
		['shipMap', 1, 9, 1],
		{
			name: 'Mysterious Miner',
			texture: 'you.png',
			battleYell: 'warriorBattleYell',
			hurtSound: 'hurt',
			hp: 50,
			stamina: 10,
			willpower: 10,
			balance: 10,
			facing: 0,
			faction: 'explorers',
			light: [1, 4],
			dialog: {},
			inventory: [{
				key: 'plasmaRifle',
				name: 'Cosmoplasma mining rifle',
				description: 'A versatile tool for mining and combat.',
			}],
			characterSheetIntroHtml: (
				`You awake on a strange ship with your memory clouded.
				You hear a familiar Voice, who tells of an Endless Kingdom, and a mission
				you've been given. Apparently you are a miner. The cosmoplasma mining rifle feels
				familiar in your grasp. Maybe you were a miner.
				<hr style="margin: 1em 0" />`
			),
			death: {},
			abilities: [
				'steadyShot', 'wildShot', 'aim', 'overload', 'bash', // , 'op',
			],
		},
	);
	game.start(0);
	window.game = game;
	window.g = game;
	window.world = game.world;
});

export default game;
