import legend from './legend.js';

export default {
	temple: {
			legend,
			map: [
				[
					'###################',
					'###################',
					'###### #&&#########',
					'###################',
					'###################',
					'###################',
					'########## ########',
				],
				[
					'##########1########',
					'###    &&| | #    #',
					'#   #         && # ',
					'# # #       && &#C#',
					'### ###C    && &  #',
					'###   ###         #',
					'#########&3&&######',
				],
				[
					'##########2       #',
					'################# #',
					'######&&&& ########',
					'########## ########',
					'###        ## #### ',
					'###   ####     ####',
					'#########& ########',
				],
			],
		},
	forest: {
		legend,
		map: [
			[
				'ddddddddddddddddddd',
				'ddddddddddddddddddd',
				'ddddddddddddddddddd',
				'ddddddddddddddddddd',
				'ddddddddddddddddddd',
				'ddddddddddddddddddd',
				'ddddddddddddddddddd',
			],
			[
				'MMMMMMMMMMMMMMMMMMM',
				'M                 M',
				'M                 M',
				'M                 M',
				'M         W       M',
				'M                 M',
				'MMMMMMMMMMMMMMMMMMM',
			],
			[
				'                   ',
				'                   ',
				'                   ',
				'                   ',
				'                   ',
				'                   ',
				'                   ',
			],
		],
	},
	arena: {
		legend, // Note that not all maps need to use the same legend, they can be different
		map: [
			[ // Right now its best to have the "floor" levels be completely filled in
				'###################',
				'###################',
				'###################',
				'###################',
				'###################',
				'###################',
				'###################',
			],
			[
				' #########4####### ',
				'##|             |##',
				'#   C             #',
				'# # C          ##C#',
				'### C          #  #',
				'###      C   C   ##',
				' ################# ',
			],
			[
				' ################# ',
				'###################',
				'#                 #',
				'#                 #',
				'#                 #',
				'#                 #',
				' ################# ',
			],
		],
	},
};
