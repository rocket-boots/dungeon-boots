const MAGIC_NUMBER = 10000;
const SEED_MAGIC_INT = 9999999;
const SEED_MAGIC_BOOL_TRUE = 93759;
const SEED_MAGIC_BOOL_FALSE = 1012638;
const RADIX = 36;

class PseudoRandomizer {
	constructor(seed) {
		if (typeof seed === 'number') {
			this.seed = seed;
		} else if (seed instanceof Array) {
			this.seed = PseudoRandomizer.makeSeed(seed);
		} else {
			this.seed = Math.round(Math.random() * SEED_MAGIC_INT);
		}
		if (Number.isNaN(this.seed)) {
			this.seed = Math.round(Math.random() * SEED_MAGIC_INT);
		}
		this.initialSeed = this.seed;
	}

	static convertStringToRadixSafeString(str = '') {
		return String(str).split('').map((char) => {
			const int = parseInt(char, RADIX);
			return (Number.isNaN(int)) ? char.charCodeAt(0).toString(RADIX) : char;
		}).join('');
	}

	static convertStringToNumber(str = '') {
		return parseInt(PseudoRandomizer.convertStringToRadixSafeString(str), RADIX);
	}

	static makeSeed(arr = []) {
		const seed = arr.reduce((sum, value) => {
			const typeOfValue = typeof value;
			let num = 1;
			if (typeOfValue === 'number') {
				num = value;
			} else if (typeOfValue === 'object') {
				num = parseInt(JSON.stringify(value), RADIX);
			} else if (typeOfValue === 'string') {
				num = parseInt(value, RADIX);
			} else if (typeOfValue === 'boolean') {
				num = (value ? SEED_MAGIC_BOOL_TRUE : SEED_MAGIC_BOOL_FALSE);
			}
			return PseudoRandomizer.getPseudoRandInt(sum, SEED_MAGIC_INT) + num;
		}, 0);
		return seed;
	}

	static getPseudoRand(seed) {
		// http://stackoverflow.com/a/19303725/1766230
		const x = Math.sin(seed) * MAGIC_NUMBER;
		return x - Math.floor(x);
	}

	static getPseudoRandInt(seed, n) {
		const r = PseudoRandomizer.getPseudoRand(seed);
		return Math.floor(r * n);
	}

	makeArray(length = 1) {
		const arr = [];
		for (let i = 0; i < length; i += 1) {
			arr.push(this.random());
		}
		return arr;
	}

	random(n) {
		this.seed += 1;
		const r = PseudoRandomizer.getPseudoRand(this.seed);
		if (typeof n === 'number') return Math.floor(r * n);
		return r;
	}

	getSeedString() {
		return this.seed.toString(RADIX);
	}

	reset() {
		this.seed = this.initialSeed;
	}
}

// window.PseudoRandomizer = PseudoRandomizer;

export default PseudoRandomizer;
