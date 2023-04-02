import ActorBlob from './ActorBlob.js';
import Actor from './Actor.js';

/** A blob of NPCs */
class NpcBlob extends ActorBlob {
	constructor(startAt = [], blockLegend = {}) {
		super(Actor, startAt, blockLegend);
		this.isNpcBlob = true;
	}
}

export default NpcBlob;
