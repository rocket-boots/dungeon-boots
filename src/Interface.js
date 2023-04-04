import abilities from './abilities.js';

const $ = (selector) => {
	const elt = window.document.querySelector(selector);
	if (!elt) console.warn('Could not find', selector);
	return elt;
};

class Interface {
	constructor() {
		this.OPTIONS_VIEWS = ['combat', 'talk', 'inventory'];
		this.optionsView = 'closed'; // 'closed', 'combat', 'talk', 'inventory'
		this.FULL_VIEWS = ['character', 'abilities', 'spells', 'menu'];
		this.fullView = 'closed'; // 'closed', 'character', 'abilities', 'spells', 'menu'
	}

	view(what) {
		if (this.FULL_VIEWS.includes(what)) {
			this.optionsView = 'closed';
			this.fullView = (this.fullView === what) ? 'closed' : what;
		} else if (this.OPTIONS_VIEWS.includes(what)) {
			this.fullView = 'closed';
			this.optionsView = (this.optionsView === what) ? 'closed' : what;
		}
		if (what === 'closed') {
			this.fullView = 'closed';
			this.optionsView = 'closed';
		}
	}

	renderOptions(blob) {
		const uiOptionsRow = $('#ui-options-row');
		uiOptionsRow.classList.remove(...uiOptionsRow.classList);
		uiOptionsRow.classList.add(`ui-options-row--${this.optionsView}`);
		let html = '';
		if (this.optionsView === 'combat') {
			html = ['Hack', 'Slash', 'Smash'].map((ability, i) => (
				`<li>
					<button type="button">
						${ability}
						<i class="key" data-command="attack ${i + 1}">${i + 1}</i>
					</button>
				</li>`
			)).join('');
		} else if (this.optionsView === 'talk') {
			html = ['Insult', 'Shout', 'Ignore'].map((ability, i) => (
				`<li>
					<button type="button">
						${ability}
						<i class="key" data-command="option ${i + 1}">${i + 1}</i>
					</button>
				</li>`
			)).join('');
		} else if (this.optionsView === 'inventory') {
			html = blob.inventory.map((inventoryItem, i) => {
				if (!inventoryItem) return '<li class="inventory-item inventory-item--empty">Empty</li>';
				return `<li class="inventory-item">
					<button type="button">
						${inventoryItem.name}
						<i class="key" data-command="option ${i + 1}">${i + 1}</i>
					</button>
				</li>`;
			}).join('');
		}
		$('#ui-options-list').innerHTML = html;
	}

	static getAbilityItemHtml(blob, ability) {
		const knownAbilities = blob.getKnownAbilities();
		const isKnown = knownAbilities.includes(ability.key);
		const rows = [isKnown ? 'Known' : 'Not known'];
		if (ability.cost) rows.push(`Cost: ${JSON.stringify(ability.cost, null, ' ')}`);
		if (ability.replenish) rows.push(`Replenish: ${JSON.stringify(ability.replenish, null, ' ')}`);
		if (ability.damage) rows.push(`Damage: ${JSON.stringify(ability.damage, null, ' ')}`);
		if (ability.effect) rows.push(`Effect: ${JSON.stringify(ability.effect, null, ' ')}`);
		return (
			`<li class="ability-item ${isKnown ? 'ability-item--known' : 'ability-item--unknown'}">
				${ability.name || ability.key}
				${rows.map((row) => `<div>${row}</div>`).join('')}
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
			html = Object.keys(abilities)
				.map((abilityKey) => abilities[abilityKey])
				.filter((ability) => !ability.spell)
				.map((ability) => Interface.getAbilityItemHtml(blob, ability))
				.join('');
			html = `<h1>Abilities</h1>${html}`;
		} else if (this.fullView === 'spells') {
			html = Object.keys(abilities)
				.map((abilityKey) => abilities[abilityKey])
				.filter((ability) => ability.spell)
				.map((ability) => Interface.getAbilityItemHtml(blob, ability))
				.join('');
			html = `<h1>Spells</h1>${html}`;
		} else if (this.fullView === 'character') {
			html = `<h1>Character</h1> ${JSON.stringify(blob, null, ' ')}`;
		} else if (this.fullView === 'menu') {
			html = 'Menu - Not implemented yet';
		}
		view.innerHTML = html;
	}
}

export default Interface;
