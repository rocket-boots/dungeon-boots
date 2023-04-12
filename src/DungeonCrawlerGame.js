// External modules
import { ArrayCoords } from 'rocket-utility-belt';
import { KeyboardCommander } from 'keyboard-commander';
// Local modules
import PlayerBlob from './PlayerBlob.js';
import VoxelWorld from './VoxelWorld.js';
import NpcBlob from './NpcBlob.js';
import Interface from './Interface.js';
import BlockScene from './BlockScene.js';

const DEFAULT_ABILITY_KEY = 'hack';
const WORLD_VOXEL_LIMITS = [64, 64, 12];

const KB_MAPPING = {
	w: 'forward',
	s: 'back',
	a: 'strafeLeft',
	d: 'strafeRight',
	q: 'turnLeft',
	e: 'turnRight',
	' ': 'wait',
	m: 'map',
	f: 'combat',
	t: 'talk',
	i: 'inventory',
	v: 'view character',
	b: 'view abilities',
	g: 'view spells',
	Tab: 'inventory',
	'\\': 'switch next-player',
	1: 'option 1',
	2: 'option 2',
	3: 'option 3',
	4: 'option 4',
	5: 'option 5',
	6: 'option 6',
	7: 'option 7',
	8: 'option 8',
	9: 'option 9',
	Esc: 'menu back',
	Backspace: 'menu back',
	Enter: 'view character',
};

const TURN_COMMANDS = ['turnLeft', 'turnRight'];
const MOVE_COMMANDS = ['forward', 'back', 'strafeLeft', 'strafeRight'];
const DEFAULT_SOUNDS = {
	// TODO
};

const $ = (selector) => {
	const elt = window.document.querySelector(selector);
	if (!elt) console.warn('Could not find', selector);
	return elt;
};
window.$ = $;

class DungeonCrawlerGame {
	constructor(options = {}) {
		this.abilities = options.abilities;
		this.worldSourceMaps = options.worldMaps;
		this.titleHtml = options.titleHtml;
		this.startAt = options.startAt;
		this.sounds = options.sounds || DEFAULT_SOUNDS;
		this.world = new VoxelWorld(this.worldSourceMaps);
		this.players = [];
		this.mainPlayerIndex = 0;
		this.kbCommander = new KeyboardCommander(KB_MAPPING);
		this.round = 0;
		this.isStopped = true;
		this.interface = new Interface({
			titleHtml: this.titleHtml,
			abilities: this.abilities,
		});
		this.dungeonScene = new BlockScene({
			clearColor: options.clearColor,
		});
	}

	/** The main player is the active player (allows ability to pass-and-play and multiple player) */
	getMainPlayer() {
		return this.players[this.mainPlayerIndex];
	}

	getNpcs() {
		return this.getMainPlayerMap().getNpcs();
	}

	getMainPlayerMap() {
		const p = this.getMainPlayer();
		const mapKey = p.getMapKey();
		return this.world.getMap(mapKey);
	}

	playMusic() {
		const map = this.getMainPlayerMap();
		const { music, ambience } = map;
		this.sounds.playMusic(music);
		this.sounds.playAmbience(ambience);
	}

	// ----------------------------------- Rendering

	setupScene() {
		const p = this.getMainPlayer();
		const coords = p.getCoords();
		const mapBlocks = this.getMainPlayerMap().getNearbyBlocks(coords, WORLD_VOXEL_LIMITS);
		// TODO: Fix this ^ - bigger range? until we load/unload blocks dynamically
		this.dungeonScene.setup(mapBlocks, p);
	}

	renderUI() {
		const blob = this.getMainPlayer();
		const mapKey = blob.getMapKey();
		const worldMap = this.world.getMap(mapKey);
		const facingActorBlob = blob.getFacingActor(worldMap);
		this.interface.render(blob, facingActorBlob);
	}

	animate() {
		if (this.isStopped) return;
		const mainBlob = this.getMainPlayer();
		const focus = mainBlob.getCoords();
		const { facing } = mainBlob;
		const blocks = [ // Blocks to update the position of
			...this.getNpcs(),
			mainBlob,
		];
		this.dungeonScene.render({ focus, facing, blocks });
		requestAnimationFrame(() => this.animate());
	}

	/** Render everything */
	render() {
		const focus = this.getMainPlayer().getCoords();
		const { facing } = this.getMainPlayer();
		this.dungeonScene.render({ focus, facing });
		this.renderUI();
	}

	// ----------------------------------- Gameplay

	/** Make a new player blob, which arrives in the middle of the map */
	makeNewPlayer(startAt = this.startAt, playerBlockLegend = {}) {
		const p = new PlayerBlob(startAt, playerBlockLegend);
		if (playerBlockLegend.abilities) {
			p.getLeader().knownAbilities = [...playerBlockLegend.abilities];
		}
		this.players.push(p);
		const map = this.getMainPlayerMap();
		map.addBlock(p);
		return p;
	}

	makeNewNpc(startAt = this.startAt, blockLegend = {}) {
		const n = new NpcBlob(startAt, blockLegend);
		const map = this.getMainPlayerMap();
		map.addBlock(n);
		return n;
	}

	calculateTalkOptions(blob) {
		const mapKey = blob.getMapKey();
		const worldMap = this.world.getMap(mapKey);
		const talkTo = blob.getFacingActor(worldMap);
		if (!talkTo) return [];
		return blob.getDialogOptions(talkTo);
	}

	switchMainPlayer(indexParam = 0, doRender = true) {
		this.mainPlayerIndex = indexParam % this.players.length;
		this.players.forEach((blob, i) => {
			// eslint-disable-next-line no-param-reassign
			blob.active = (i === this.mainPlayerIndex);
		});
		this.interface.reset().view('character');
		if (!doRender) return;
		this.setupScene();
		this.render();
	}

	/** Take inputs commands and queue them for the main player */
	handleInputCommand(command) {
		console.log('Command:', command);
		// this.sounds.play('button');
		const p = this.getMainPlayer();
		const commandWords = command.split(' ');
		const firstCommandWord = commandWords[0];
		if (command === 'reload page') {
			window.location.reload();
			return;
		}
		if (command === 'menu back') {
			this.interface.goBack();
			this.render();
			return;
		}
		if (command === 'switch next-player') {
			this.switchMainPlayer(this.mainPlayerIndex + 1, true);
			return;
		}
		if (firstCommandWord === 'view') {
			const [, page] = commandWords;
			this.interface.view(page);
			this.render();
			return;
		}
		if (command === 'talk') {
			this.interface.talkOptions = this.calculateTalkOptions(p);
			if (!this.interface.talkOptions.length) {
				this.sounds.play('dud');
				this.interface.flashBorder('#111');
				this.interface.view('closed');
				this.render();
				return;
			}
		}
		if (this.interface.OPTIONS_VIEWS.includes(command)) {
			this.interface.view(command);
			this.render();
			return;
		}
		if (firstCommandWord === 'option') {
			/* eslint-disable no-param-reassign */
			if (this.interface.optionsView === 'combat') command = `attack ${commandWords[1]}`;
			if (this.interface.optionsView === 'talk') command = `dialog ${commandWords[1]}`;
			if (this.interface.optionsView === 'inventory') command = `inventory ${commandWords[1]}`;
			/* eslint-enable no-param-reassign */
		}
		if (command === 'map') {
			this.dungeonScene.mapView = !this.dungeonScene.mapView;
			const playerSceneObject = this.dungeonScene.blockSceneObjectMapping[p.blockId];
			playerSceneObject.visible = this.dungeonScene.mapView;
			this.render();
			return;
		}
		this.render();
		this.dungeonScene.mapView = false;
		this.getMainPlayer().queueCommand(command);
	}

	doActorCommand(blob, command) {
		if (!command) return;
		const mainBlob = this.getMainPlayer();
		const isMain = (b) => mainBlob.blockId === b.blockId;
		const mapKey = blob.getMapKey();
		const worldMap = this.world.getMap(mapKey);
		const commandWords = command.split(' ');
		const remainderCommandWords = [...commandWords];
		const firstCommandWord = remainderCommandWords.shift(); // remove the first word
		const commandIndex = (Number(commandWords[1]) || 0) - 1;
		const target = blob.getFacingActor(worldMap);
		if (firstCommandWord === 'spawn') {
			const blockLegendStr = remainderCommandWords.join(' ');
			const blockLegend = JSON.parse(blockLegendStr);
			const [x, y, z] = blob.coords;
			const npc = this.makeNewNpc([mapKey, x, y, z], blockLegend);
			console.log(command, blockLegend, npc);
		}
		if (blob.dead) return;
		// ----- Below here are all things that can only be done by living blobs
		if (firstCommandWord === 'attack') {
			const abils = blob.getKnownAbilities().map((key) => this.abilities[key]);
			const attackAbility = abils[commandIndex] || this.abilities[DEFAULT_ABILITY_KEY];
			if (target) {
				const effectiveness = blob.useAbility(attackAbility);
				target.applyAbility(attackAbility, effectiveness, blob.damageScale);
				const isMainPlayerGettingHit = target.isPlayerBlob && isMain(target);
				if (isMainPlayerGettingHit) {
					this.interface.flashBorder('#f00');
				} else {
					this.sounds.play('hit');
				}
				this.sounds.play(blob.battleYell, { delay: 500, random: 0.4 });
				// const dmg = blob.getDamage();
				// target.damage(dmg, 'hp');

				const died = target.checkDeath();
				const hurtSoundChance = (isMainPlayerGettingHit) ? 1 : 0.2;
				if (died) this.sounds.play(target.deathSound, { delay: 100 });
				else {
					this.sounds.play(
						target.hurtSound,
						{ delay: Math.random() * 100, random: hurtSoundChance },
					);
				}
			} else {
				if (!attackAbility.combat) blob.useAbility(attackAbility);
				this.sounds.play('dud');
				this.interface.flashBorder('#111');
				console.warn('Nothing to attack');
			}
			return;
		}
		if (firstCommandWord === 'inventory') {
			const invItem = mainBlob.getInventoryItem(commandIndex);
			alert(`This is a ${invItem.name}. You have ${invItem.quantity} of these. ${invItem.description}`);
		}
		if (firstCommandWord === 'dialog') {
			const dialogOptions = this.calculateTalkOptions(blob);
			if (!dialogOptions.length) {
				this.sounds.play('dud');
				return;
			}
			// const { answer = '...' } = dialogOptions[index];
			target.speakDialog(dialogOptions[commandIndex]);
			blob.listenToDialog(dialogOptions[commandIndex], target);
			this.interface.talkOptions = this.calculateTalkOptions(blob);
			return;
		}
		if (command === 'wait') {
			if (blob.isPlayerBlob && isMain(blob)) {
				if (blob.getLeader().hp.belowMax()) {
					this.sounds.play('drink');
				}
				blob.waitHeal(2);
			} else {
				blob.waitHeal(1);
			}
			return;
		}
		if (TURN_COMMANDS.includes(command)) {
			blob.turn((command === 'turnLeft') ? -1 : 1);
			return;
		}
		if (MOVE_COMMANDS.includes(command)) {
			let forward = 0;
			let strafe = 0;
			let up = 0;
			if (command === 'forward') forward = 1;
			else if (command === 'back') forward = -1;
			else if (command === 'strafeLeft') strafe = -1;
			else if (command === 'strafeRight') strafe = 1;
			else if (command === 'ascend') up = 1;
			else if (command === 'descend') up = -1;
			// console.log(blob.name, 'Desired Move:', mapKey, 'facing', blob.facing,
			// 'forward', forward, 'strafe', strafe, 'up', up);
			const newCoords = ArrayCoords.getRelativeCoordsInDirection(
				blob.getCoords(),
				blob.facing,
				forward,
				strafe,
				up,
			);
			const blocks = worldMap.getBlocksAtCoords(newCoords);
			const block = blocks[0]; // just look at first block in case there are multiple
			if (block && block.blocked) {
				console.log('\t', blob.name, 'blocked at', JSON.stringify(block.coords), 'Desired Move:', mapKey, 'facing', blob.facing, 'forward', forward, 'strafe', strafe, 'up', up);
				if (blob.isPlayerBlob) {
					this.sounds.play('dud');
					this.interface.flashBorder('#333');
				}
				// console.log('\tBlocked at', JSON.stringify(block.coords), block);
				return;
			}
			let moveToCoords = newCoords;
			if (block && block.teleport) {
				const [destMapKey, x, y, z, turn] = block.teleport;
				this.sounds.play(block.soundTeleport || block.soundOn || block.sound);
				moveToCoords = [x, y, z];
				blob.turnTo(turn);
				if (destMapKey !== mapKey) {
					this.switchBlobMap(blob, mapKey, destMapKey);
				}
			}
			console.log('\t', blob.name, 'moving to', JSON.stringify(moveToCoords), block);
			blob.moveTo(moveToCoords);
			if (blob.isPlayerBlob) this.sounds.play('walk');
			return;
		}
		console.log('Unknown command', command, 'from', blob.name || blob.blockId);
	}

	switchBlobMap(blob, currentMapKey, destMapKey) {
		if (currentMapKey === destMapKey) return;
		const currentMap = this.world.getMap(currentMapKey);
		const destMap = this.world.getMap(destMapKey);
		if (!destMap) throw new Error(`No destination map of ${destMapKey}`);
		currentMap.removeBlock(blob);
		blob.switchMap(destMapKey);
		destMap.addBlock(blob);
		this.setupScene();
		this.playMusic();
	}

	checkDeath() {
		if (!this.getMainPlayer().checkDeath()) return;
		this.sounds.playMusic('death'); // dead
		this.sounds.play('death');
		this.interface.view('dead');
		this.render();
	}

	doActorsCommands(actors = []) {
		actors.forEach((a) => {
			const command = a.dequeueCommand();
			if (!command) return;
			this.doActorCommand(a, command);
		});
	}

	doRound() {
		this.round += 1;
		console.log('Round', this.round);
		const npcs = this.getNpcs();
		[...this.players, ...npcs].forEach((blob) => {
			blob.clearLastRound();
		});
		this.doActorsCommands(this.players);
		npcs.forEach((a) => a.plan(this.players, this.getMainPlayerMap()));
		// ^ TODO: More efficient to do the planning while waiting for player input
		this.doActorsCommands(npcs);
		this.checkDeath();
		let redraws = 0;
		npcs.forEach((a) => {
			a.checkDeath();
			if (a.redraw) {
				redraws += 1;
				a.redraw = false; // eslint-disable-line no-param-reassign
			}
		});
		if (redraws > 0) this.setupScene();
		this.render();
	}

	/** Tick fires periodically to see if it's time to advance the round */
	tick() {
		if (this.isStopped) return;
		try {
			const readyPlayers = this.players.reduce((sum, p) => sum + (p.checkReady() ? 1 : 0), 0);
			// console.log(readyPlayers, this.players.length);
			if (readyPlayers >= this.players.length) {
				this.doRound();
			}
		} catch (err) { // We want to catch errors so that we don't stop the next tick from happening
			console.error(err);
		}
		// console.log(readyPlayers);
		window.setTimeout(() => this.tick(), 200);
	}

	/** Only run this once */
	start(playerIndex = 0) {
		this.switchMainPlayer(playerIndex, false);
		this.isStopped = false;
		this.kbCommander.on('command', (cmd) => this.handleInputCommand(cmd));
		window.document.addEventListener('click', (event) => {
			const commandElt = event.target.closest('[data-command]');
			if (commandElt && commandElt.dataset.command) {
				this.handleInputCommand(commandElt.dataset.command);
				event.preventDefault();
			}
		});
		if (this.titleHtml) this.interface.view('title');
		this.setupScene();
		// this.dungeonScene.setup();
		this.render();
		this.tick();
		this.animate();
		this.playMusic();
	}

	stop() {
		this.isStopped = true;
	}
}

export default DungeonCrawlerGame;
