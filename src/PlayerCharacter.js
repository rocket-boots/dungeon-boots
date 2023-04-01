import Actor from './Actor.js';

class PlayerCharacter extends Actor {
	constructor(playerBlob, startAt = []) {
		super(playerBlob, startAt);
	}
}

export default PlayerCharacter;
