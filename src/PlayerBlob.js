import ActorBlob from './ActorBlob.js';
import PlayerCharacter from './PlayerCharacter.js';

/** A Player and the blob of characters they control */
class PlayerBlob extends ActorBlob {
	constructor(startAt = []) {
		const playerBlockLegend = {
			blocked: 1,
			//
		};
		super(PlayerCharacter, startAt, playerBlockLegend);
		this.isPlayerBlob = true;
	}
}

export default PlayerBlob;
