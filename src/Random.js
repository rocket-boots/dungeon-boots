const MAGIC = 999999;
const RADIX = 36;

class Random {
	constructor(n = 1) {
		this.n = Math.random() * n;
	}

	get() {
		return this.n;
	}

	static get() {
		return Math.random();
	}

	static randomInt(n = 0) {
		return Math.floor(Math.random() * n);
	}

	static pickRandom(arr = []) {
		return arr[Random.randomInt(arr.length)];
	}

	static randomString(n = MAGIC) {
		return Math.round(Math.random() * n).toString(RADIX);
	}

	static uniqueString() {
		return Number(new Date()).toString(RADIX) + Random.randomString();
	}

	// alias
	static pick(arr = []) {
		return arr[Random.randomInt(arr.length)];
	}

	/**
	 * Chance of random event based on 0-1 odds
	 * @param {Number} odds - float 0-1 for chance of true
	 * @returns Boolean
	 */
	static chance(odds = 0) {
		return Math.random() > odds;
	}
}

export default Random;
