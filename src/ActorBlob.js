import ArrayCoords from './ArrayCoords.js';
import Actor from './Actor.js';
import BlockEntity from './BlockEntity.js';

const MAX_COMMAND_QUEUE_SIZE = 3;
const GHOST_TEXTURE = 'ghost_new.png';

/** A blob of characters that can interact with the world */
class ActorBlob extends BlockEntity {
	constructor(ActorClass, startAt = [], blockLegend = {}) {
		super(startAt, blockLegend);
		this.blob = [
			new (ActorClass || Actor)(this),
		];
		this.isActorBlob = true;
		this.facing = 0;
		this.ready = false; // Ready for next turn?
		this.commandQueue = [];
		this.blobId = Number(new Date()).toString(36) + Math.round(Math.random() * 99999).toString(36);
		this.inventory = [null, null, null, null, null, null];
		// Update defaults for some actor-specific legend properties
		if (typeof this.aggro !== 'number') this.aggro = 0;
		this.dead = false;
		this.interactions = {};
	}

	clearLastRound() {
		this.blob.forEach((actor) => {
			actor.clearLastRound();
		});
	}

	getMoodEmoji() {
		if (this.dead) return '💀';
		if (this.aggro) return '😡';
		return '☮';
	}

	turn(n = 0) {
		this.facing = ArrayCoords.normalizeDirection(this.facing + n);
	}

	turnTo(f) {
		if (typeof f === 'number') {
			this.facing = ArrayCoords.normalizeDirection(f);
		}
	}

	turnTowards(coords = []) {
		const [deltaX, deltaY] = ArrayCoords.subtract(this.coords, coords);
		let { facing } = this;
		if (deltaX < 0) facing = 1;
		else if (deltaX > 0) facing = 3;
		if (deltaY < 0) facing = 2;
		else if (deltaY > 0) facing = 0;
		// TODO: This could be improved so that it doesn't favor Y direction if the target
		// is at a diagnol angle
		this.turnTo(facing);
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

	getRandomMember() {
		const i = Math.floor(this.blob.length * Math.random());
		return this.blob[i];
	}

	checkReady() {
		return (this.commandQueue.length > 0);
	}

	getAheadCoords() {
		return ArrayCoords.getRelativeCoordsInDirection(this.coords, this.facing, 1, 0, 0);
	}

	getFacingBlocks(worldMap) {
		const aheadCoords = this.getAheadCoords();
		return worldMap.getBlocksAtCoords(aheadCoords);
	}

	checkFacingWall(worldMap) {
		const aheadCoords = this.getAheadCoords();
		return worldMap.isBlockedAtCoords(aheadCoords);
	}

	getFacingActor(worldMap) {
		const blocksAhead = this.getFacingBlocks(worldMap);
		const actorsAhead = blocksAhead.filter((block) => block.isActorBlob);
		if (actorsAhead.length > 1) console.warn('More than 1 actor ahead of', this.name, '. that probably should not happen', actorsAhead);
		if (actorsAhead.length) return actorsAhead[0];
		return null;
	}

	getKnownAbilities() {
		const allBlobAbilitiesSet = new Set();
		this.blob.forEach((character) => {
			character.knownAbilities.forEach((abilityName) => {
				allBlobAbilitiesSet.add(abilityName);
			});
		});
		return Array.from(allBlobAbilitiesSet);
	}

	getDialogOptions(actor) {
		if (!actor || !actor.dialog) return [];
		const dialogKeys = Object.keys(actor.dialog);
		const actorInteractions = this.interactions[actor.blobId] || {};
		const { unlockedDialogKeys = [] } = actorInteractions;
		const talkableDialogOptions = dialogKeys.filter(
			(key) => !actor.dialog[key].locked || unlockedDialogKeys.includes(key),
		).map((key) => {
			const dialogOption = actor.dialog[key];
			const dialogOptObj = (typeof dialogOption === 'object') ? dialogOption : {};
			let { unlocks = [] } = dialogOptObj;
			if (typeof unlocks === 'string') unlocks = [unlocks];
			let { locks = [] } = dialogOptObj;
			if (typeof locks === 'string') locks = [locks];
			const answer = (
				dialogOptObj.answer
				|| dialogOptObj.a
				|| ((typeof dialogOption === 'string') ? dialogOption : '???')
			);
			const { questionAudio, answerAudio, cost, requires } = dialogOptObj;
			return {
				// ...dialogOptObj,
				key,
				question: dialogOptObj.question || dialogOptObj.q || key,
				answer,
				locks,
				unlocks,
				questionAudio,
				answerAudio,
				cost,
				requires,
			};
		});
		return talkableDialogOptions;
	}

	listenToDialog(dialogOption, actor) {
		if (!dialogOption) throw new Error('Missing dialog option');
		if (!this.interactions[actor.blobId]) this.interactions[actor.blobId] = {};
		const actorInteractions = this.interactions[actor.blobId];
		actorInteractions.unlockedDialogKeys = (actorInteractions.unlockedDialogKeys || [])
			.concat(dialogOption.unlocks || []);
		console.log(actorInteractions.unlockedDialogKeys);
	}

	waitHeal(rounds = 1) {
		this.blob.forEach((character) => {
			character.waitHeal(rounds);
		});
	}

	damage(dmg = 0, poolType = 'hp') {
		const whoIsHit = this.getRandomMember();
		if (dmg) this.aggro = 1;
		return whoIsHit.damage(dmg, poolType);
	}

	kill() {
		this.blob.forEach((character) => {
			character.damage(Infinity, 'hp');
		});
		this.dead = true;
		this.blocked = 0;
		this.changeTexture(this.deadTexture || this.ghostTexture || GHOST_TEXTURE);
	}

	checkDeath() {
		const totalHp = this.blob.map((character) => character.hp.get())
			.reduce((sum, hp) => sum + hp, 0);
		if (totalHp <= 0) {
			this.kill();
			return true;
		}
		return false;
	}
}

export default ActorBlob;
