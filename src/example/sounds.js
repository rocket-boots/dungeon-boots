import SoundController from '../SoundController.js';

const SOUNDS_ROOT = './audio/sounds';
const MUSIC_ROOT = './audio/music';

const soundsListing = {
	hit: [
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
};

const musicListing = {
	death: `${MUSIC_ROOT}/Dungeon_Crawler_Player_Death_Music.wav`,
	explore: `${MUSIC_ROOT}/Dungeon_Crawler_Forest_Exploration(Done).wav`,
};

const sounds = new SoundController(soundsListing, musicListing);

export default sounds;
