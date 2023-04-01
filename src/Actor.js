class Actor {
	constructor(blob, startAt = []) {
		this.blob = blob;
		const [mapKey, x, y, z] = startAt;
		this.mapKey = mapKey;
		this.coords = [x, y, z];
	}

	switchMap(mapKey) {
		this.mapKey = mapKey;
	}

	moveTo(coords) {
		const [x, y, z] = coords;
		if (typeof x === 'number') this.coords[0] = x;
		if (typeof y === 'number') this.coords[1] = y;
		if (typeof z === 'number') this.coords[2] = z;
	}
}

export default Actor;
