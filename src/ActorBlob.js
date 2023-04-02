import ArrayCoords from './ArrayCoords.js';
import Actor from './Actor.js';
import BlockEntity from './BlockEntity.js';

const MAX_COMMAND_QUEUE_SIZE = 3;

/** A blob of characters that can interact with the world */
class ActorBlob extends BlockEntity {
	constructor(ActorClass, startAt = [], blockLegend = {}) {
		super(startAt, blockLegend);
		this.blob = [
			new (ActorClass || Actor)(this),
		];
		this.isActorBlob = true;
		this.facing = 0;
		// Ready for next turn?
		this.ready = false;
		this.commandQueue = [];
		this.blobId = Number(new Date()).toString(36) + Math.round(Math.random() * 99999).toString(36);
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

	checkReady() {
		return (this.commandQueue.length > 0);
	}
}

export default ActorBlob;
