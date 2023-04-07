import Actor from './Actor.js';

class PlayerCharacter extends Actor {
	constructor(playerBlob, startAt = []) {
		super(playerBlob, startAt);
		this.knownAbilities = ['hack', 'slash', 'bash', 'rally'];
	}
}

export default PlayerCharacter;
