import ActorBlob from './ActorBlob.js';
import Actor from './Actor.js';
import ArrayCoords from './ArrayCoords.js';

const BRAINS = {
	monster: {
		wander: 0.8,
		huntPlayers: 1,
		sight: 10,
	},
};

/** A blob of NPCs */
class NpcBlob extends ActorBlob {
	constructor(startAt = [], blockLegend = {}) {
		super(Actor, startAt, blockLegend);
		this.isNpcBlob = true;
		if (blockLegend.npc && BRAINS[blockLegend.npc]) {
			this.brain = BRAINS[blockLegend.npc];
		}
	}

	facingWall(worldMap) {
		const aheadCoords = ArrayCoords.getRelativeCoordsInDirection(this.coords, this.facing, 1, 0, 0);
		const blocksAhead = worldMap.getBlocksAtCoords(aheadCoords);
		const blockedSum = blocksAhead.reduce((sum, block) => sum + (block.blocked || 0), 0);
		return (blockedSum >= 1);
	}

	plan(players = [], worldMap = {}) {
		const roll = Math.random();
		// If facing a wall, do a free turn
		if (this.facingWall(worldMap)) {
			console.log(this.name, 'facing wall so turning');
			this.turn((roll < 0.2) ? 1 : -1); // turning is free for NPCs
		}
		// Hunters
		if (this.brain.huntPlayers && roll < this.brain.huntPlayers) {
			const isHunting = this.planHunt(players, worldMap);
			if (isHunting) return;
		}
		// Wanderers
		if (this.brain.wander && roll < this.brain.wander) {
			this.planWander();
			return;
		}
		this.queueCommand('wait');
	}

	planHunt(prey = [], worldMap = {}) {
		let nearestPrey;
		let nearestDist = Infinity;
		const nearPrey = prey.filter((a) => {
			if (!a.isPlayerBlob) return false;
			const dist = ArrayCoords.getDistance(a.coords, this.coords);
			if (dist > this.sight) return false;
			if (dist < nearestDist) {
				nearestDist = dist;
				nearestPrey = a;
			}
			return true;
		});
		if (!nearPrey.length) return false; // No one to hunt within sight
		// TODO: Do A-star path finding to get to nearestPrey
		// TODO: Turn towards nearestPreye
		console.log(this.name, 'planning to hunt', nearPrey);
		this.queueCommand('forward');
		return true;
	}

	planWander() {
		const roll = Math.random();
		if (roll < 0.5) {
			// const turnCommand = (roll < 0.1) ? 'turnRight' : 'turnLeft';
			// this.queueCommand(turnCommand);
			this.turn((roll < 0.1) ? 1 : -1); // turning is free for NPCs
			this.queueCommand('forward');
		} else {
			this.queueCommand('forward');
		}
	}
}

export default NpcBlob;
