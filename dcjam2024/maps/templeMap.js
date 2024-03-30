/* eslint-disable quote-props */
import { teleportDoor, voice, baseLegend } from './baseLegend.js';

export default {
	// music: 'forest',
	// ambience: 'darkForest',
	ambientLightIntensity: 0.4,
	legend: {
		...baseLegend,
		'1': {
			...voice,
			dialog: {
				feeling: {
					q: 'Strange feeling',
					a: 'I feel an immense power. Sickness, Infinity, Life. The relic is nearby!',
					unlocks: ['relic'],
				},
				relic: {
					locked: true,
					q: 'Relic',
					a: 'Whatever it is, it holds such ancient secrets and powers that even Our Endless King does not possess.',
					unlocks: ['take', 'deliver', 'avoid'],
				},
				take: {
					locked: true,
					q: 'I will take the relic and its power for myself!',
					a: 'I knew you were acting strangely, against your nature. You\'ll regret such defiance.',
				},
				deliver: {
					locked: true,
					q: 'Let\'s make sure we deliver the relic to Our King',
					a: 'I thought an abberation in you was growing, but perhaps not. Smart. Get the relic!',
				},
				avoid: {
					locked: true,
					q: 'We shouldn\'t disturb the relic',
					a: 'We have not traveled eons to come to this rock, just to retreat now. Get the relic!',
				},
				exit: {
					q: 'Exit',
					a: 'When you\'re done in there, a cave entrance in the North West will take us back to the ship.',
				},
			},
		},
		'2': {
			...voice,
			dialog: {},
		},
		'<': {
			...teleportDoor,
			name: 'Door (Previous Level)',
			teleport: ['mazeMap', 7, 1, 1, 2],
		},
		'>': {
			...teleportDoor,
			texture: 'cavehole.png',
			name: 'Cave (back to the ship)',
			teleport: ['returnMap', 17, 12, 1, 3],
		},
	},
	map: [
		[
			'%%%%%%%%%%%%%%%',
			'%%%%%#%%%%%#%%%',
			'%%%%%%     %%%%',
			'%%%%%% ### %%%%',
			'%%%%%% ### %%%%',
			'%%%### ### ###%',
			'%%%%%%  %  %%%%',
			'%%%%%#%%#%%#%%%',
			'%%%%%%%%%%%%%%%',
			'%%%%%%%%%%%%%%%',
			'%%%%&%%%#%%&&%%',
			'%%%%%%%%%%%%&&%',
			'%%%%&%%%%%%%&%%',
			'%%%%%%%%%%%%%%%',
		],
		[
			'%%%%###########',
			'% X           #',
			'& %  #.....#  #',
			'& #   .   .   #',
			'& #   . P .   #',
			'& #   . b .   #',
			'&x#  C.. ..C  #',
			'&X#  #v   v#  #',
			'& #           #',
			'& #           #',
			'& ###### ######',
			'& #   1       #',
			'> #           #',
			'&%#####<#######',
		],
		[
			'%%%############',
			'% %           #',
			'& #  #v   v#  #',
			'& #           #',
			'& #           #',
			'& #           #',
			'& #           #',
			'&&#  #v   v#  #',
			'& #           #',
			'& #           #',
			'& ###### ######',
			'& #           #',
			'& #           #',
			'&%#############',
		],
		[
			'%%%############',
			'%&%           #',
			'&&#  #v   v#  #',
			'&&#           #',
			'&&#           #',
			'&&#           #',
			'&&#           #',
			'&&#  #v   v#  #',
			'&&#           #',
			'&&#           #',
			'&&##  #####  ##',
			'&&#           #',
			'&&#           #',
			'&%#############',
		],
		[
			'  &&&&&&&&%%&&&',
			'  &&&&&&&&&##%&',
			'  %%%&&&&%###%&',
			'  ##%&&& %%##%&',
			'  %&&&X   XXX&&',
			'  &&&%&& %%&&&&',
			'  &%##%&&%&&&&&',
			'  &&%%%%%&&&&&&',
			'  &&&&&&&&&&&&&',
			'  &&&&&%%&&%&&&',
			'  &&&&&&&&&%&&&',
			'  &&&&&&&%#&&&&',
			'  &&&&&&&&&&&&&',
			'  &&&&&&&&&&&&&',
		],
	],
};
