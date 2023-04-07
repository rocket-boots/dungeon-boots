import ArrayCoords from './ArrayCoords.js';
import Actor from './Actor.js';
import BlockEntity from './BlockEntity.js';

const MAX_COMMAND_QUEUE_SIZE = 3;
const BASE_INV_ITEM = {
	key: '?unknown_item?',
	name: '?unknown_item?',
	quantity: 1,
	description: '',
};

/** A blob of characters that can interact with the world */
class ActorBlob extends BlockEntity {
	constructor(ActorClass, startAt = [], blockLegend = {}) {
		super(startAt, blockLegend);
		this.isActorBlob = true;
		this.damageScale = (typeof this.damageScale !== 'number') ? 1 : this.damageScale;
		this.facing = blockLegend.facing || 0;
		this.active = true; // Inactive characters don't need to be ready
		this.ready = false; // Ready for next turn?
		this.commandQueue = [];
		this.blobId = Number(new Date()).toString(36) + Math.round(Math.random() * 99999).toString(36);
		this.inventory = [null, null, null, null, null, null];
		if (blockLegend.inventory) this.setInventory(blockLegend.inventory);
		// Update defaults for some actor-specific legend properties
		if (typeof this.aggro !== 'number') this.aggro = 0;
		this.dead = false;
		this.interactions = {};
		this.lastSpoken = '';
		this.blob = [
			new (ActorClass || Actor)(this),
		];
	}

	clearLastRound() {
		this.blob.forEach((actor) => {
			actor.clearLastRound();
		});
		this.lastSpoken = '';
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
		if (!this.active) return true;
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
		const actorsAhead = blocksAhead.filter((block) => (
			block.isActorBlob && block.getVisibilityTo(this)
		));
		if (actorsAhead.length > 1) console.warn('More than 1 actor ahead of', this.name, '. that probably should not happen', actorsAhead);
		// TODO:
		// put living actors at the front of the list
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
		const pickAnswer = (dialogOption) => {
			const dialogOptObj = (typeof dialogOption === 'object') ? dialogOption : {};
			const answer = (
				dialogOptObj.answer
				|| dialogOptObj.a
				|| ((typeof dialogOption === 'string') ? dialogOption : '???')
			);
			if (answer instanceof Array) {
				const i = Math.floor(answer.length * actor.dna[0]);
				return answer[i];
			}
			return answer;
		};
		// Filter the dialog keys then standardize the dialog format
		const talkableDialogOptions = dialogKeys.filter(
			(key) => !actor.dialog[key].locked || unlockedDialogKeys.includes(key),
		).map((key) => {
			const dialogOption = actor.dialog[key];
			const dialogOptObj = (typeof dialogOption === 'object') ? dialogOption : {};
			let { unlocks = [] } = dialogOptObj;
			if (typeof unlocks === 'string') unlocks = [unlocks];
			let { locks = [] } = dialogOptObj;
			if (typeof locks === 'string') locks = [locks];
			const answer = pickAnswer(dialogOptObj);
			const { questionAudio, answerAudio, cost, requires, aggro } = dialogOptObj;
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
				aggro,
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
		// console.log(actorInteractions.unlockedDialogKeys);
	}

	speakDialog(dialogOption) {
		this.lastSpoken = dialogOption.answer;
		if (typeof dialogOption.aggro === 'number') this.aggro = dialogOption.aggro;
	}

	waitHeal(rounds = 1) {
		this.blob.forEach((character) => {
			character.waitHeal(rounds);
		});
	}

	getDamage() {
		const baseDmg = (this.isPlayerBlob) ? 8 : 2;
		const dmg = Math.floor(Math.random() * baseDmg * this.damageScale) + 1;
		return dmg;
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
		if (this.dead) return;
		this.dead = true;
		this.blocked = 0;
		if (this.death) {
			if (this.death.spawn) {
				this.queueCommand(`spawn ${JSON.stringify(this.death.spawn)}`);
			}
		}
		this.changeRendering({
			texture: this.deadTexture || this.texture,
			onGround: true,
			renderAs: 'plane',
			// TODO: set rotation based on facing value
			opacity: 0.5,
			color: [1, 0, 0],
		});
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

	/** Overwrite block entity's method so we dynamically create the tags */
	getTags() {
		const invTags = this.inventory.filter((invItem) => invItem)
			.map((invItem) => `item:${invItem.key}`);
		this.tags = invTags; // cache it
		return invTags;
	}

	setInventory(inv = []) {
		inv.forEach((invItem, i) => {
			if (i > this.inventory.length - 1) {
				console.warn('Item', invItem, 'could not fit in inventory');
				return;
			}
			if (typeof invItem === 'string') {
				this.inventory[i] = { ...BASE_INV_ITEM, key: invItem, name: invItem };
				// TODO: ^ set this based on looking up an item from a legend of items
				// based on the invItem being a key
				return;
			}
			if (typeof invItem !== 'object') throw new Error('Bad invItem type');
			this.inventory[i] = { ...BASE_INV_ITEM, ...invItem };
		});
	}

	getInventoryItem(i) {
		return this.inventory[i];
	}
}

export default ActorBlob;
