import Pool from './Pool.js';

class Actor {
	constructor(/* blob */) {
		// this.blob = blob;
		this.isActor = true;
		this.hp = new Pool(10, 10);
		this.willpower = new Pool(10, 10);
		this.stamina = new Pool(10, 10);
		this.balance = new Pool(10, 10);
		this.xp = 0;
		this.knownAbilities = ['hack', 'slash', 'dodge'];
	}

	hurt(dmg = 0) {
		return this.hp.subtract(dmg);
	}

	heal(healing = 0) {
		return this.hp.add(healing);
	}

	waitHeal(rounds = 1) {
		this.hp.add(1 * rounds);
		this.willpower.add(1 * rounds);
		this.stamina.add(2 * rounds);
		this.balance.add(3 * rounds);
	}

	damage(dmg = 0, poolType = 'hp') {
		// if (dmg) this.blob.aggro = 1;
		return this[poolType].subtract(dmg);
	}
}

export default Actor;
