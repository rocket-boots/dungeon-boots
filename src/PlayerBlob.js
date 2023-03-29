import ArrayCoords from './ArrayCoords.js';
import PlayerCharacter from './PlayerCharacter.js';

const MAX_COMMAND_QUEUE_SIZE = 3;

/** A Player and the blob of characters they control */
class PlayerBlob {
	constructor() {
		this.blob = [
			new PlayerCharacter(this),
		];
		this.facing = 0;
		// Ready for next turn?
		this.ready = false;
		this.commandQueue = [];
	}

	getCoords() {
		return [...this.getLeader().coords];
	}

	turn(n = 0) {
		this.facing = ArrayCoords.normalizeDirection(this.facing + n);
	}

	turnTo(f) {
		if (typeof f === 'number') {
			this.facing = ArrayCoords.normalizeDirection(f);
		}
	}

	queueCommand(command) {
		if (this.commandQueue > MAX_COMMAND_QUEUE_SIZE) return false;
		this.commandQueue.push(command);
		return true;
	}

	dequeueCommand() {
		// TODO: Remove command if it's not possible to do?
		return this.commandQueue.shift();
	}

	getLeader() {
		return this.blob[0];
	}

	moveTo(coords) {
		this.blob.forEach((pc) => {
			pc.moveTo(coords);
		});
	}

	move(relativeCoords) {
		const currentCoords = this.getLeader.coords;
		const newCoords = [0, 1, 2].forEach((i) => currentCoords[i] + relativeCoords[i]);
		this.moveTo(newCoords);
	}

	checkReady() {
		return (this.commandQueue.length > 0);
	}
}

export default PlayerBlob;
