import { ArrayCoords, Random } from 'rocket-utility-belt';

import Actor from './Actor.js';
import BlockEntity from './BlockEntity.js';

const MAX_COMMAND_QUEUE_SIZE = 1;
const BASE_INV_ITEM = {
	key: '?unknown_item?',
	name: '?unknown_item?',
	quantity: 1,
	description: '',
};

/** A blob of characters that can interact with the world */
class ActorBlob extends BlockEntity {
	constructor(startAt = [], blockLegend = {}) {
		super(startAt, blockLegend);
		this.isActorBlob = true;
		this.damageScale = (typeof this.damageScale !== 'number') ? 1 : this.damageScale;
		this.facing = blockLegend.facing || 0;
		this.active = true; // Inactive characters don't need to be ready
		this.ready = false; // Ready for next turn?
		this.commandQueue = [];
		this.blobId = Random.uniqueString();
		this.inventory = []; // [null, null, null, null, null, null];
		if (blockLegend.inventory) this.setInventory(blockLegend.inventory);
		// Update defaults for some actor-specific legend properties
		if (typeof this.aggro !== 'number') this.aggro = 0;
		this.dead = false;
		this.interactions = {};
		this.lastSpoken = '';
		this.blob = [
			new Actor(this),
		];
		this.maxCombatRange = 5;
		this.maxInteractRange = 5;
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

	getMoodText() {
		if (this.dead) return 'Dead';
		if (this.aggro) return 'Hostile';
		return 'Nonhostile';
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
		return Random.pick(this.blob);
	}

	checkReady() {
		if (!this.active) return true;
		return (this.commandQueue.length > 0);
	}

	getAheadCoords(forward = 1) {
		return ArrayCoords.getRelativeCoordsInDirection(this.coords, this.facing, forward, 0, 0);
	}

	getFacingBlocks(worldMap, forward = 1) {
		const aheadCoords = this.getAheadCoords(forward);
		return worldMap.getBlocksAtCoords(aheadCoords);
	}

	checkFacingWall(worldMap) {
		const aheadCoords = this.getAheadCoords(1);
		return worldMap.isBlockedAtCoords(aheadCoords);
	}

	getFacingActor(worldMap, range = 1) {
		for (let i = 1; i <= range; i += 1) {
			const blocksAhead = this.getFacingBlocks(worldMap, i);
			const actorsAhead = blocksAhead
				.filter((block) => (
					block.isActorBlob
					&& block.getVisibilityTo(this)
					&& !block.remove
				))
				// put living actors at the front of the list
				// otherwise we can end up attacking corpses
				.sort((a, b) => ((a.dead && !b.dead) ? 1 : -1));
			// if (actorsAhead.length > 1)
			// console.warn('More than 1 actor ahead of', this.name,
			// '. that probably should not happen', actorsAhead);
			if (actorsAhead.length) return actorsAhead[0];
			// If we ran into a blocked block that isn't air, then don't look further
			const blockedBlock = blocksAhead.find((b) => b.blocked && !b.air);
			if (blockedBlock) return null;
		}
		return null;
	}

	getFacingBlockWithRange(worldMap, range = 3) {
		for (let i = 1; i <= range; i += 1) {
			const blocksAhead = this.getFacingBlocks(worldMap, i)
				.filter((block) => (
					block.getVisibilityTo(this)
					&& !block.remove
				))
				// put living actors at the front of the list
				// otherwise we can end up attacking corpses
				.sort((a, b) => ((a.dead && !b.dead) ? 1 : -1));
			// if (actorsAhead.length > 1)
			// console.warn('More than 1 actor ahead of', this.name,
			// '. that probably should not happen', actorsAhead);
			// If we ran into a blocked block, then don't look further
			const blockedBlock = blocksAhead.find((b) => b.blocked && !b.air);
			if (blocksAhead.length || blockedBlock) return [blocksAhead[0], i];
		}
		return [null, range];
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

	static getPoolAmount(numOrArray, special) {
		if (typeof numOrArray === 'number') return numOrArray;
		if (numOrArray instanceof Array) {
			const [min, max] = numOrArray;
			const spread = max - min;
			const rand = (special === 'max') ? 1 : Math.random();
			return Math.floor(rand * spread) + Math.round(min);
		}
		throw new Error('bad numOrarray');
	}

	static getDamageAmount(numOrArray, effectiveness = 1, scale = 1) {
		if (typeof numOrArray === 'number') {
			return Math.floor(numOrArray * scale * effectiveness);
		}
		if (numOrArray instanceof Array) {
			let [min, max] = numOrArray;
			min *= scale;
			max *= scale;
			const spread = max - min;
			return Math.floor(((Math.random() * spread) + min) * effectiveness);
		}
		throw new Error('bad numOrarray');
	}

	payAbilityCost(cost = {}) {
		let effectiveness = 1;
		const who = this.getLeader();
		Object.keys(cost).forEach((poolKey) => {
			const costAmount = ActorBlob.getPoolAmount(cost[poolKey]);
			const actualCostSpent = who.damage(costAmount, poolKey);
			const diff = costAmount - actualCostSpent;
			if (diff > 0) effectiveness = 1 - (diff / costAmount);
		});
		return effectiveness;
	}

	canAffordAbility(ability) {
		const { cost } = ability;
		if (!cost) return true;
		const who = this.getLeader();
		let canAfford = true;
		Object.keys(cost).forEach((poolKey) => {
			const costAmount = ActorBlob.getPoolAmount(cost[poolKey], 'max');
			if (costAmount > who[poolKey].get()) canAfford = false;
		});
		return canAfford;
	}

	replenish(replenish = {}, effectiveness = 1) {
		Object.keys(replenish).forEach((poolKey) => {
			const healAmount = Math.floor(ActorBlob.getPoolAmount(replenish[poolKey]) * effectiveness);
			this.getLeader().heal(healAmount, poolKey);
		});
	}

	/** Uses an ability for the blob, paying the cost, and returning the effectiveness 0-1 */
	useAbility(ability = {}) {
		const { cost, replenish } = ability;
		const effectiveness = (cost) ? this.payAbilityCost(cost) : 1;
		if (replenish) this.replenish(replenish, effectiveness);
		return effectiveness;
	}

	applyAbility(ability = {}, effectiveness = 1, damageScale = 1) {
		const { damage } = ability;
		if (!damage) return 0;
		const whoIsHit = this.getRandomMember();
		Object.keys(damage).forEach((poolKey) => {
			const dmgAmount = ActorBlob.getDamageAmount(damage[poolKey], effectiveness, damageScale);
			const finalDamage = whoIsHit.damage(dmgAmount, poolKey);
			if (finalDamage > 0) this.aggro = 1;
		});
		return 1;
	}

	getDialogOptions(actor) {
		if (!actor || !actor.dialog) return [];
		const dialogKeys = Object.keys(actor.dialog);
		const actorInteractions = this.interactions[actor.blobId] || {};
		const { unlockedDialogKeys = [], heardDialogKeys } = actorInteractions;
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
			const answer = pickAnswer(dialogOption);
			const { questionAudio, answerAudio, cost, requires, aggro } = dialogOptObj;
			const heard = (heardDialogKeys && heardDialogKeys.has(key));
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
				heard,
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
		if (!actorInteractions.heardDialogKeys) {
			actorInteractions.heardDialogKeys = new Set();
		}
		actorInteractions.heardDialogKeys.add(dialogOption.key);
	}

	speakDialog(dialogOption) {
		if (!dialogOption) {
			console.error(this.name, 'cannot speak blank dialog option', dialogOption);
			return;
		}
		this.lastSpoken = dialogOption.answer;
		if (typeof dialogOption.aggro === 'number') this.aggro = dialogOption.aggro;
	}

	waitHeal(rounds = 1) {
		this.blob.forEach((character) => {
			character.waitHeal(rounds);
		});
	}

	passiveHeal(rounds = 1) {
		this.blob.forEach((character) => {
			character.passiveHeal(rounds);
		});
	}

	getDamage() {
		const baseDmg = (this.isPlayerBlob) ? 8 : 2;
		const dmg = Math.floor(Math.random() * baseDmg * this.damageScale) + 1;
		return dmg;
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
			if (this.death.dialog) {
				this.dialog = this.death.dialog;
			}
		}
		this.changeRendering({
			texture: this.deadTexture || this.texture,
			onGround: true,
			renderAs: 'plane',
			// TODO: set rotation based on facing value
			opacity: 0.5,
			color: [1, 0, 0],
			remove: true, // TODO: Don't remove, instead provide a corpse for some blobs
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

	addInventoryItem(obj) {
		if (!obj) return;
		this.inventory.push({
			key: Number(new Date()), // Fallback
			name: 'Thing', // Default
			...obj,
		});
	}

	getInventoryItemByKey(key) {
		return this.inventory.find((item) => item.key === key);
	}
}

export default ActorBlob;
