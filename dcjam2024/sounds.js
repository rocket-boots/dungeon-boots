import { SoundController } from '../build/dungeon-boots.esm.js';

const ROOT = './audio';
const SOUNDS_ROOT = `${ROOT}/sounds`;
const DIALOGUE_ROOT = `${ROOT}/dialogue`;
// const MUSIC_ROOT = `${ROOT}/music`;
// const AMB_ROOT = `${ROOT}/ambience`;

let i;
const warriorBattleYell = [];
for (i = 1; i <= 44; i += 1) {
	warriorBattleYell.push(`${DIALOGUE_ROOT}/Warrior Dialogue-0${i < 10 ? '0' : ''}${i}.wav`);
}

const soundsListing = {
	shipDoor: [
		`${SOUNDS_ROOT}/ship-door0.mp3`,
		`${SOUNDS_ROOT}/ship-door1.mp3`,
	],
	hit: [
		`${SOUNDS_ROOT}/plasma0.mp3`,
		`${SOUNDS_ROOT}/plasma1.mp3`,
		`${SOUNDS_ROOT}/plasma2.mp3`,
	],
	dud: [
		`${SOUNDS_ROOT}/dud0.mp3`,
		`${SOUNDS_ROOT}/dud1.mp3`,
	],
	walk: [
		`${SOUNDS_ROOT}/step0.mp3`,
		`${SOUNDS_ROOT}/step1.mp3`,
		`${SOUNDS_ROOT}/step2.mp3`,
		`${SOUNDS_ROOT}/step3.mp3`,
	],
	monsterHurt: [
		`${SOUNDS_ROOT}/monster0.mp3`,
		`${SOUNDS_ROOT}/monster1.mp3`,
		`${SOUNDS_ROOT}/monster2.mp3`,
	],
	wormHurt: [
		`${SOUNDS_ROOT}/worm0.mp3`,
		`${SOUNDS_ROOT}/worm1.mp3`,
	],
	wormDead: [
		`${SOUNDS_ROOT}/worm-dead0.mp3`,
		`${SOUNDS_ROOT}/worm-dead1.mp3`,
	],
	/*
		`${SOUNDS_ROOT}/Main Weapon impact (axe or sword).wav`,
		`${SOUNDS_ROOT}/Main Weapon impact (axe or sword)-001.wav`,
		`${SOUNDS_ROOT}/Main Weapon impact (axe or sword)-002.wav`,
		`${SOUNDS_ROOT}/Main Weapon impact (axe or sword)-003.wav`,
		`${SOUNDS_ROOT}/Main Weapon impact (axe or sword)-004.wav`,
		`${SOUNDS_ROOT}/Main Weapon impact (axe or sword)-005.wav`,
		`${SOUNDS_ROOT}/Main Weapon impact (axe or sword)-006.wav`,
		`${SOUNDS_ROOT}/Main Weapon impact (axe or sword)-007.wav`,
		`${SOUNDS_ROOT}/Main Weapon impact (axe or sword)-008.wav`,
		`${SOUNDS_ROOT}/Main Weapon impact (axe or sword)-009.wav`,
		`${SOUNDS_ROOT}/Main Weapon impact (axe or sword)-010.wav`,
	],
	button: `${SOUNDS_ROOT}/menu_inventory selection 2.wav`,
	hurt: [
		`${SOUNDS_ROOT}/Warrior grunt-001.wav`,
		`${SOUNDS_ROOT}/Warrior grunt-002.wav`,
		`${SOUNDS_ROOT}/Warrior grunt-003.wav`,
		`${SOUNDS_ROOT}/Warrior grunt-004.wav`,
		`${SOUNDS_ROOT}/Warrior grunt-005.wav`,
		`${SOUNDS_ROOT}/Warrior grunt-006.wav`,
		`${SOUNDS_ROOT}/Warrior grunt-007.wav`,
		`${SOUNDS_ROOT}/Warrior grunt-008.wav`,
	],
	death: `${SOUNDS_ROOT}/Warrior Death Grunt.wav`,
	woosh: [
		`${SOUNDS_ROOT}/woosh-001.wav`,
		`${SOUNDS_ROOT}/woosh-002.wav`,
		`${SOUNDS_ROOT}/woosh-003.wav`,
	],
	door: [
		`${SOUNDS_ROOT}/Door.wav`,
	],
	walk: [
		`${SOUNDS_ROOT}/Steps-001.wav`,
		`${SOUNDS_ROOT}/Steps-002.wav`,
		`${SOUNDS_ROOT}/Steps-003.wav`,
		`${SOUNDS_ROOT}/Steps-004.wav`,
		`${SOUNDS_ROOT}/Steps-005.wav`,
		`${SOUNDS_ROOT}/Steps-006.wav`,
		`${SOUNDS_ROOT}/Steps-007.wav`,
		`${SOUNDS_ROOT}/Steps-008.wav`,
		`${SOUNDS_ROOT}/Steps-009.wav`,
	],
	dud: `${SOUNDS_ROOT}/menu_inventory selection Wrong.wav`,
	drink: [
		`${SOUNDS_ROOT}/Potion Drinking.wav`,
		`${SOUNDS_ROOT}/Potion Drinking 2.wav`,
		`${SOUNDS_ROOT}/Potion Drinking 5.wav`,
	],
	warriorBattleYell,
	goblinBattleYell: [
		`${SOUNDS_ROOT}/Goblin Attack_01.mp3`,
		`${SOUNDS_ROOT}/Goblin Attack_2.mp3`,
		`${SOUNDS_ROOT}/Goblin Attack_03.mp3`,
	],
	goblinDamaged: [
		`${SOUNDS_ROOT}/Goblin Damaged_01.mp3`,
		`${SOUNDS_ROOT}/Goblin Damaged_02.mp3`,
		`${SOUNDS_ROOT}/Goblin Damaged_03.mp3`,
	],
	goblinDeath: [
		`${SOUNDS_ROOT}/Goblin Death_01.mp3`,
		`${SOUNDS_ROOT}/Goblin Death_02.mp3`,
		`${SOUNDS_ROOT}/Goblin Death_03.mp3`,
	],
	*/
};

const musicListing = {
	// songA: `${MUSIC_ROOT}/songA.wav`,
	// death: `${MUSIC_ROOT}/Dungeon_Crawler_Player_Death_Music.wav`,
	// forest: `${MUSIC_ROOT}/Dungeon_Crawler_Forest_Exploration(Done).wav`,
	// dungeon: `${MUSIC_ROOT}/Dungeo_Crawler_Dungeon_Music(Done).wav`,
	// tavern: `${MUSIC_ROOT}/Dungeon_Crawler_Tavern.wav`,
	// boss: `${MUSIC_ROOT}/Dungeo_Crawler_Boss.wav`,
	// darkForest: `${AMB_ROOT}/Dark Forest Ambience Loop.wav`,
	// spooky: `${AMB_ROOT}/Spooky Ambience Loop.wav`,
};

const sounds = new SoundController(soundsListing, musicListing);

export default sounds;
