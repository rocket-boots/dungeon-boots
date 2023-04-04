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
		this.blocked = 1;
		this.color = [1, 1, 1];
		this.renderAs = 'plane';
		this.texture = 'human_male.png';
	}
}

export default PlayerBlob;
