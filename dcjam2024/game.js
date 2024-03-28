import { DungeonCrawlerGame } from '../build/dungeon-boots.esm.js';
import worldMaps from './worldMaps.js';
import sounds from './sounds.js';
import abilities from './abilities.js';

const game = new DungeonCrawlerGame({
	imageUrlRoot: '../images/cosmic',
	worldMaps,
	abilities,
	sounds,
	startAt: ['shipMap', 1, 9, 1], // TODO: Is this used?
	clearColor: '#161013',
	renderTime: 0.2,
	titleHtml: `
		<h1 class="title-text" style="color: #363033">
			Cosmic Horror Placeholder Title
			<span style="font-size: 1rem">v1.0.0</span>
		</h1>
		<div class="title-credits">
			<p>
				Created in a week for Dungeon Crawler Jam 2024
			</p>
			<p>
				By Luke (programming, artwork, UI, level design, voice acting)
			</p>
			<p>
				💯%✋ Made By Humans - No AI
			</p>
		</div>
	`,
});

window.document.addEventListener('DOMContentLoaded', () => {
	window.pc = game.makeNewPlayer(
		['shipMap', 1, 9, 1],
		{
			name: 'Mysterious Miner',
			texture: 'you.png',
			battleYell: 'warriorBattleYell',
			hurtSound: 'hurt',
			hp: 30,
			stamina: 20,
			facing: 0,
			faction: 'explorers',
			light: [1, 4],
			dialog: {
				// hi: 'Stay out of my way while I crush all these vile vermin!',
			},
			inventory: [{
				key: 'plasmaRifle',
				name: 'Cosmoplasma mining rifle',
				description: 'A versatile tool for mining and combat.',
			}],
			characterSheetIntroHtml: (
				`Barret Boulderfist is the bane of all monsters, an axe-wielding one man army who
				fights without mercy. He's purged a hundred dungeons full of vile horrors, and has no fear that
				any enemy can match his brutal prowess in combat. A consummate professional, he takes great
				pride in his work, and he enjoys it too - after all, these dungeons need to be cleared,
				and nobody can do it better than him.
				<hr style="margin: 1em 0" />`
			),
			death: { // TODO: This is not making it onto the character's blob
				// dialog: {
				// 	hi: {
				// 		q: 'You still survive?',
				// 		a: 'Save me! Heal me... I need to kill more...',
				// 	},
				// },
			},
			abilities: [
				'aim', 'wildShot', 'overload', 'bash',
			],
		},
	);
	// window.pc = game.makeNewPlayer(
	// 	['town', 17, 9, 1],
	// 	{
	// 		name: 'Warmthistle',
	// 		texture: 'human_new.png',
	// 		hurtSound: 'hurt',
	// 		willpower: 20,
	// 		facing: 3,
	// 		faction: 'neutral',
	// 		dialog: {
	// 			hi: { a: 'I came to Wretchhold because I sensed violence was near.', unlocks: 'wretchhold' },
	// 			name: 'I am known as Warmthistle.',
	// 			wretchhold: { a: 'Do the people of Wretchhold deserve to die?', locked: true },
	// 		},
	// 		inventory: [{
	// 			key: 'ghostMask',
	// 			name: 'Ghost Mask',
	// 			description: 'It allows you to see and speak with ghosts.',
	// 		}],
	// 		characterSheetIntroHtml: (
	// 			`<img src="./images/Druid_Portrait.jpeg" class="character-sheet-portrait" />
	// 			Warmthistle, a young man in appearance, is a
	// 			fragment of the great and ancient pattern of the forest, a song whispered by the
	// 			wind in the leaves.
	// 			This druid watches, with benevolent but detched curiosity,
	// 			the comings and goings of the hot-blooded short-lived things - and sometimes, if the
	// 			moment seems worthy, chooses to play a part in their stories.
	// 			<hr style="margin: 1em 0" />`
	// 		),
	// 		abilities: ['hack', 'swift', 'reprise', 'heal', 'heal2'],
	// 	},
	// );
	game.start(0);
	window.game = game;
	window.g = game;
	window.world = game.world;
});

export default game;
