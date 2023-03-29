class PlayerCharacter {
	constructor(player) {
		this.player = player;
		this.coords = [0, 0, 0];
	}

	moveTo(coords) {
		const [x, y, z] = coords;
		if (typeof x === 'number') this.coords[0] = x;
		if (typeof y === 'number') this.coords[1] = y;
		if (typeof z === 'number') this.coords[2] = z;
	}
}

export default PlayerCharacter;
