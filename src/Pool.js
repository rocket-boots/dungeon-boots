class Pool {
	constructor(max = 0, value = undefined) {
		this.max = max;
		this.min = 0;
		this.value = (typeof value === 'undefined') ? max : value;
		if (typeof this.max !== 'number' || typeof this.value !== 'number') {
			throw new Error('Need numbers for max and value');
		}
		this.lastDelta = 0; // track the last change for display purposes
	}

	get() {
		return this.value;
	}

	set(v) {
		if (typeof v !== 'number') throw new Error('Cannot set to a non-number');
		const ogValue = this.value;
		this.value = Math.max(Math.min(this.max, v), this.min);
		this.lastDelta = this.value - ogValue;
		return this.value;
	}

	getText() {
		return `${this.value} / ${this.max}`;
	}

	add(n = 0) {
		if (n < 0) return -1 * this.subtract(-n);
		const maxToAdd = Math.min(this.max - this.value, n);
		this.set(this.value + maxToAdd);
		return maxToAdd;
	}

	subtract(n = 0) {
		if (n < 0) return -1 * this.add(-n);
		const maxToSubtract = Math.min(this.value, n);
		this.set(this.value - maxToSubtract);
		return maxToSubtract;
	}

	belowMax() { return this.value < this.max; }

	atMax() { return this.value === this.max; }

	atMin() { return this.value === this.min; }

	aboveMin() { return this.value > this.min; }

	clearLastDelta() {
		this.lastDelta = 0;
	}
}

export default Pool;
