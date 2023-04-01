import ActorBlob from './ActorBlob.js';
import PlayerCharacter from './PlayerCharacter.js';

/** A Player and the blob of characters they control */
class PlayerBlob extends ActorBlob {
	constructor(startAt = []) {
		super(PlayerCharacter, startAt);
	}
}

export default PlayerBlob;
