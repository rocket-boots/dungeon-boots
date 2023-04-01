import ActorBlob from './ActorBlob.js';
import Actor from './Actor.js';

/** A blob of NPCs */
class NpcBlob extends ActorBlob {
	constructor(startAt = []) {
		super(Actor, startAt);
	}
}

export default NpcBlob;
