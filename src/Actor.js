import { Pool } from 'rocket-utility-belt';

const DEFAULT_POOL_MAX = 10;

class Actor {
	constructor(blob) {
		this.isActor = true;
		this.statPools = ['hp', 'stamina', 'willpower', 'balance'];
		const poolMaxes = this.statPools.map((poolName) => (
			blob[poolName] || DEFAULT_POOL_MAX
		));
		this.statPools.forEach((poolName, i) => {
			this[poolName] = new Pool(poolMaxes[i]);
		});
		// this.hp = new Pool(10, 10);
		// this.willpower = new Pool(10, 10);
		// this.stamina = new Pool(10, 10);
		// this.balance = new Pool(10, 10);
		this.xp = 0;
		this.knownAbilities = ['hack', 'slash', 'bash'];
	}

	clearLastRound() {
		this.statPools.forEach((statName) => {
			this[statName].clearLastDelta();
		});
	}

	hurt(dmg = 0) {
		return this.hp.subtract(dmg);
	}

	heal(healing = 0, poolType = 'hp') {
		return this[poolType].add(healing);
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
