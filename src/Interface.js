/* eslint-disable class-methods-use-this */
import { ArrayCoords } from 'rocket-utility-belt';

const POOL_NAMES = ['hp', 'willpower', 'stamina', 'balance'];
const POOL_ABBREV = {
	hp: 'HP', willpower: 'WP', balance: 'Ba', stamina: 'St',
};
const POOL_CLASS = {
	hp: 'hp', willpower: 'wp', balance: 'ba', stamina: 'st',
};

const $ = (selector, warn = true) => {
	const elt = window.document.querySelector(selector);
	if (!elt && warn) console.warn('Could not find', selector);
	return elt;
};
// const $all = (selector) => {
// 	const elt = window.document.querySelectorAll(selector);
// 	if (!elt) console.warn('Could not find', selector);
// 	return elt;
// };

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

class Interface {
	constructor({ titleHtml, abilities }) {
		this.abilities = abilities;
		this.titleHtml = titleHtml || '';
		this.OPTIONS_VIEWS = ['combat', 'talk', 'inventory'];
		this.optionsView = 'closed'; // 'closed', 'combat', 'talk', 'inventory'
		this.FULL_VIEWS = ['character', 'abilities', 'spells', 'menu', 'dead'];
		this.fullView = 'closed'; // 'closed', 'character', 'abilities', 'spells', 'menu'
		this.DUNGEONEER_VIEWS = ['engage', 'explore']; // or 'closed'
		this.dungeoneerView = 'explore';
		this.staticRow = 'open'; // or 'closed'
		this.miniMapOn = false;
		this.talkOptions = [];
	}

	view(what) {
		// this.reset();
		if (what === 'title') {
			this.reset();
			this.viewTitleScreen = true;
			return this;
		}
		if (this.FULL_VIEWS.includes(what)) {
			this.optionsView = 'closed';
			this.fullView = (this.fullView === what) ? 'closed' : what;
			this.dungeoneerView = 'explore';
		} else if (this.OPTIONS_VIEWS.includes(what)) {
			this.fullView = 'closed';
			this.dungeoneerView = 'explore';
			this.optionsView = (this.optionsView === what) ? 'closed' : what;
		} else if (this.DUNGEONEER_VIEWS.includes(what)) {
			this.fullView = 'closed';
			this.dungeoneerView = what;
		}
		this.staticRow = 'open';
		this.viewTitleScreen = false;
		if (what === 'closed') {
			this.fullView = 'closed';
			this.optionsView = 'closed';
		}
		return this;
	}

	goBack() {
		if (this.fullView === 'closed') {
			// TODO: Open title screen
		} else {
			this.view('closed');
		}
		return this;
	}

	closeAll() {
		this.optionsView = 'closed';
		this.dungeoneerView = 'closed';
		this.fullView = 'closed';
		this.staticRow = 'closed';
		this.viewTitleScreen = false;
		return this;
	}

	reset() {
		this.optionsView = 'closed';
		this.dungeoneerView = 'explore';
		this.fullView = 'closed';
		this.staticRow = 'open';
		this.viewTitleScreen = false;
		return this;
	}

	flashBorder(color = '#f00', duration = 1500) {
		const elt = $('#main');
		const keyFrames = [ // Keyframes
			{ borderColor: color },
			{ borderColor: '#000' },
		];
		const keyFrameSettings = { duration, direction: 'alternate', easing: 'linear' };
		const effect = new KeyframeEffect(elt, keyFrames, keyFrameSettings);
		const animation = new Animation(effect, document.timeline);
		animation.play();
	}

	renderMiniMap() {
		if (!this.miniMapOn) return;
		const mapHtml = this.getWorldTextRows().join('<br>');
		$('#mini-map').innerHTML = mapHtml;
	}

	static getPoolObjHtml(poolObj) {
		if (!poolObj) return '---';
		return Object.keys(poolObj).map((poolKey) => {
			let value = poolObj[poolKey];
			if (value instanceof Array) value = value.join('-');
			return `${value}
				<span class="pool-unit-${POOL_CLASS[poolKey]}">
					${POOL_ABBREV[poolKey]}
				</span>`;
		}).join(', ');
	}

	static getAbilityStatsHtml(abil, canAfford = true) {
		return (
			`<div class="ability-details ${(canAfford) ? '' : 'ability-cannot-afford'}">
				<div class="ability-range">
					${(abil.range && abil.range > 1) ? `Range: ${abil.range}` : 'Melee'}
				</div>
				<div class="ability-cost">Use: ${Interface.getPoolObjHtml(abil.cost)}</div>
				<div class="ability-replenish">Gain: ${Interface.getPoolObjHtml(abil.replenish)}</div>
				<div class="ability-damage">Damage: ${Interface.getPoolObjHtml(abil.damage)}</div>
			</div>`
		);
	}

	renderOptions(blob) {
		const uiOptionsRow = $('#ui-options-row');
		uiOptionsRow.classList.remove(...uiOptionsRow.classList);
		uiOptionsRow.classList.add(`ui-options-row--${this.optionsView}`);
		let html = '';
		if (this.optionsView === 'combat') {
			const abils = blob.getKnownAbilities().map((key) => this.abilities[key]);
			html = abils.map((ability, i) => (
				`<li>
					<button type="button" data-command="attack ${i + 1}">
						${ability.name}
						${Interface.getAbilityStatsHtml(ability, blob.canAffordAbility(ability))}
						<i class="key">${i + 1}</i>
					</button>
				</li>`
			)).join('');
		} else if (this.optionsView === 'talk') {
			html = this.talkOptions.map((dialogItem, i) => (
				`<li ${dialogItem.heard ? 'class="dialog-heard"' : ''}>
					<button type="button" data-command="dialog ${i + 1}">
						${capitalizeFirstLetter(dialogItem.question)}
						<i class="key">${i + 1}</i>
					</button>
				</li>`
			)).join('');
		} else if (this.optionsView === 'inventory') {
			html = blob.inventory.map((inventoryItem, i) => {
				if (!inventoryItem) return '<li class="inventory-item inventory-item--empty">Empty</li>';
				return `<li class="inventory-item">
					<button type="button" data-command="option ${i + 1}">
						${inventoryItem.name}
						<i class="key">${i + 1}</i>
					</button>
				</li>`;
			}).join('');
		}
		$('#ui-options-list').innerHTML = html;
	}

	static getAbilityItemHtml(blob, ability) {
		const knownAbilities = blob.getKnownAbilities();
		const isKnown = knownAbilities.includes(ability.key);
		return (
			`<li class="ability-item ${isKnown ? 'ability-item--known' : 'ability-item--unknown'}">
				${ability.name || ability.key}
				${isKnown ? 'Known' : 'Not known'}
				${Interface.getAbilityStatsHtml(ability)}
			</li>`
		);
	}

	renderFullView(blob) {
		const view = $('#ui-full-view');
		view.classList.remove(...view.classList);
		view.classList.add(`ui-full-view--${this.fullView}`);
		// const knownAbilities = p.getKnownAbilities();
		let html = '';
		if (this.fullView === 'abilities') {
			html = Object.keys(this.abilities)
				.map((abilityKey) => this.abilities[abilityKey])
				.filter((ability) => !ability.spell)
				.map((ability) => Interface.getAbilityItemHtml(blob, ability))
				.join('');
			html = `<h1>Abilities</h1>${html}`;
		} else if (this.fullView === 'spells') {
			html = Object.keys(this.abilities)
				.map((abilityKey) => this.abilities[abilityKey])
				.filter((ability) => ability.spell)
				.map((ability) => Interface.getAbilityItemHtml(blob, ability))
				.join('');
			html = `<h1>Spells</h1>${html}`;
		} else if (this.fullView === 'character') {
			html = (
				`<h1>${blob.name || 'Character'}</h1>
				<div class="character-sheet-intro">
					${blob.characterSheetIntroHtml || ''}
				</div>
				<ul class="stats-list">
					<li>
						<span style="background: var(--hp-color)">(HP)</span> Health
						<span id="hp-value"></span>
					</li>
					<li>
						<span style="background: var(--st-color)">(S)</span> Stamina
						<span id="stamina-value"></span>
					</li>
					<li>
						<span style="background: var(--wp-color)">(W)</span> Willpower
						<span id="willpower-value"></span>
					</li>
					<li>
						<span style="background: var(--ba-color)">(B)</span> Balance
						<span id="balance-value"></span>
					</li>
				</ul>
				<div>
					<button type="button" data-command="inventory">Inventory <i class="key">i</i></button>
					<button type="button" data-command="map">Map <i class="key">m</i></button>
					<button type="button" class="ui-close-button" data-command="view character">
						Close <i class="key">v</i>
					</button>
				</div>
				`
				// ${JSON.stringify(blob, null, ' ')}`
			);
		} else if (this.fullView === 'menu') {
			html = 'Menu - Not implemented yet';
		} else if (this.fullView === 'dead') {
			html = `<div class="you-died">YOU DIED</div><p>💀</p>
				Refresh the page to start over.
				<div class="dead-options">
					<!-- <button type="button" data-command="switch next-player">Switch</button> -->
					<button type="button" data-command="reload page">Restart</button>
				</div>
			`;
		}
		view.innerHTML = html;
	}

	renderStats(blob) {
		const leader = blob.getLeader();
		POOL_NAMES.forEach((key) => {
			const elt = $(`#${key}-value`, false);
			if (!elt) return;
			elt.innerText = leader[key].getText();
		});
	}

	getBarPercents(pool = {}) {
		const deltaDownPercent = (pool.lastDelta < 0) ? 100 * (Math.abs(pool.lastDelta) / pool.max) : 0;
		const deltaUpPercent = (pool.lastDelta > 0) ? 100 * (pool.lastDelta / pool.max) : 0;
		const valuePercent = (100 * (pool.value / pool.max)) - deltaUpPercent;
		const spacerPercent = 100 - valuePercent - deltaDownPercent - deltaUpPercent;
		return { deltaDownPercent, deltaUpPercent, valuePercent, spacerPercent };
	}

	getBlobBars(blob) {
		if (!blob || !blob.isActorBlob) return [];
		const leader = blob.getLeader();
		const STYLE_KEYS = {
			hp: 'hp',
			stamina: 'st',
			willpower: 'wp',
			balance: 'ba',
		};
		const bars = leader.statPools.map((statName) => {
			const pool = leader[statName];
			const { value, max, lastDelta } = pool;
			const {
				deltaDownPercent, deltaUpPercent, valuePercent, spacerPercent,
			} = this.getBarPercents(pool);
			return {
				value,
				max,
				lastDelta,
				styleKey: STYLE_KEYS[statName],
				deltaDownPercent,
				deltaUpPercent,
				valuePercent,
				spacerPercent,
			};
		});
		return bars;
	}

	renderBars(uiName, bars = []) {
		const container = $(`#ui-${uiName}`);
		const noBars = (bars.length === 0);
		container.style.display = (noBars) ? 'none' : 'block';
		if (noBars) return;
		container.querySelector('.bar-numbers').innerHTML = bars.filter((bar) => bar.lastDelta !== 0)
			.map((bar) => `<span class="bar-number bar-number-${bar.styleKey}">${bar.lastDelta}</span>`)
			.join('');
		const barSections = [
			['.bar-spacer', 'spacerPercent'],
			['.bar-delta-down', 'deltaDownPercent'],
			['.bar-delta-up', 'deltaUpPercent'],
			['.bar-value', 'valuePercent'],
		];
		bars.forEach((bar) => {
			container.querySelectorAll(`.bar-list-item-${bar.styleKey}`).forEach((li) => {
				// eslint-disable-next-line no-param-reassign
				li.style.visibility = (bar.max > 0) ? 'visible' : 'hidden';
				barSections.forEach(([selector, barPropName]) => {
					// eslint-disable-next-line no-param-reassign
					li.querySelector(selector).style.height = `${bar[barPropName]}%`;
				});
			});
		});
	}

	renderDungeoneerRow(blob, facingBlock) {
		let { dungeoneerView } = this;
		if (this.fullView !== 'closed') dungeoneerView = 'closed';
		const view = $('#ui-dungeoneer-row');
		view.classList.remove(...view.classList);
		view.classList.add(`ui-view--${dungeoneerView}`);
		if (dungeoneerView === 'closed') return;
		$('#ui-direction-value').innerText = ArrayCoords.getDirectionName(blob.facing);
		this.renderBars('target-stats', this.getBlobBars(facingBlock));
		this.renderBars('player-stats', this.getBlobBars(blob));
		$('#ui-target-name').innerText = (facingBlock) ? facingBlock.name : '';
		$('#ui-target-mood').innerHTML = (facingBlock && facingBlock.isActorBlob) ? (
			`<span class="mood-emoji">${facingBlock.getMoodEmoji()}</span>
			<span class="mood-text">${facingBlock.getMoodText()}</span>`
		) : '';
	}

	renderInteract(blob, facingActorBlob, range) {
		let className = '';
		if (this.fullView === 'closed') className = 'closed';
		let interactHtml = '';
		if (facingActorBlob) {
			const { lastSpoken, interact } = facingActorBlob;
			if (lastSpoken) {
				className = 'dialog';
				interactHtml = `<div class="dialog-bubble">${lastSpoken}</div>`;
			} else if (interact) {
				const interactText = interact.text || 'Interact';
				className = 'interact';
				if (range > interact.range) {
					interactHtml = `(Too far to ${interactText})`;
				} else {
					interactHtml = `<button type="button" data-command="interact">
							${interactText}
							<span class="key">r</span>
						</button>`;
				}
			}
		}
		const elt = $('#ui-interact-view');
		elt.innerHTML = interactHtml;
		elt.className = className;
	}

	renderStaticRow() {
		const view = $('#ui-static-row');
		view.classList.remove(...view.classList);
		view.classList.add(`ui-view--${this.staticRow}`);
	}

	renderTitle() {
		const view = $('#title-screen');
		view.classList.remove(...view.classList);
		view.classList.add(`ui-view--${this.viewTitleScreen ? 'open' : 'closed'}`);
		view.innerHTML = `${this.titleHtml}
			<div class="title-next">
				<button type="button" data-command="talk">
					Begin Game 
					<span class="key">Enter</span>
				</button>
			</div>`;
	}

	render(blob, facingBlock, range) {
		this.renderTitle();
		if (blob.dead) {
			this.view('dead');
		}
		this.renderStaticRow();
		this.renderInteract(blob, facingBlock, range);
		this.renderDungeoneerRow(blob, facingBlock);
		this.renderOptions(blob);
		this.renderFullView(blob);
		this.renderStats(blob);
	}
}

export default Interface;
