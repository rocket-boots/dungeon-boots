class PseudoRandomizer {
	constructor(seed) {
		this.seed = seed || Math.round(Math.random() * 9999);
	}

	static getPseudoRand(seed) {
		// http://stackoverflow.com/a/19303725/1766230
		const x = Math.sin(seed) * 10000;
		return x - Math.floor(x);
	}

	random(n) {
		this.seed += 1;
		const r = PseudoRandomizer.getPseudoRand(this.seed);
		if (n) return Math.floor(r * n);
		return r;
	}
}

export default PseudoRandomizer;
