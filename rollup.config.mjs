// import nodeResolve from 'rollup-plugin-node-resolve';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

// This is needed for Howler ^
// See https://github.com/goldfire/howler.js/issues/688#issuecomment-792357729

// import copy from 'rollup-plugin-copy';

// External can avoid some warnings but later builds will need to either have these
// dependencies, or pull them in somehow.
const external = [];
const plugins = [
	nodeResolve(),
	commonjs(),
	// copy({
	// 	targets: [
	// 		{
	// 			src: './node_modules/roguelike-fonts/AppleII.ttf',
	// 			dest: './static/fonts/',
	// 		}
	// 	],
	// }),
];
const watch = {
	exclude: ['node_modules/**'],
};

export default [
	{
		input: './src/index.js',
		output: {
			file: './build/dungeon-boots.esm.js',
			format: 'esm',
		},
		plugins,
		external,
		watch,
	},
];
