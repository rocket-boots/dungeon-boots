import Pool from './Pool.js';

class Actor {
	constructor(blob) {
		this.blob = blob;
		this.isActor = true;
		this.hp = new Pool(10, 10);
		this.willpower = new Pool(10, 10);
		this.stamina = new Pool(10, 10);
		this.balance = new Pool(10, 10);
		this.xp = 0;
	}

	hurt(dmg = 0) {
		return this.hp.subtract(dmg);
	}

	heal(healing = 0) {
		return this.hp.add(healing);
	}
}

export default Actor;
