// Constants
const NORTH = 0;
const EAST = 1;
const SOUTH = 2;
const WEST = 3;
const X = 0;
const Y = 1;
const Z = 2;
const DIRECTION_NAMES = Object.freeze(['North', 'East', 'South', 'West']);
const DIRECTIONS = Object.freeze([NORTH, EAST, SOUTH, WEST]);
const RADIANS = Object.freeze([0, Math.PI * 0.5, Math.PI, Math.PI * 1.5]);

//       /^\ -y North
// West   |
// -x <---o---> +x East
//        |
//       \./ +y South

class ArrayCoords {
	static getRelativeCoordsInDirection(coords, facing, forward = 0, strafe = 0, up = 0) {
		const newCoords = [...coords];
		const facingEastWest = (facing % 2);
		const forwardAxis = facingEastWest ? X : Y;
		const strafeAxis = facingEastWest ? Y : X;
		const forwardDirection = (facing === NORTH || facing === WEST) ? -1 : 1;
		const strafeDirection = (facing === NORTH || facing === EAST) ? 1 : -1;
		newCoords[forwardAxis] += (forward * forwardDirection);
		newCoords[strafeAxis] += (strafe * strafeDirection);
		newCoords[Z] += up;
		return newCoords;
	}

	static normalizeDirection(facing) {
		const fixedFacing = facing % DIRECTIONS.length;
		return (fixedFacing < 0) ? (DIRECTIONS.length + fixedFacing) : fixedFacing;
	}

	static getDirectionName(facingParam) {
		const facing = ArrayCoords.normalizeDirection(facingParam);
		return DIRECTION_NAMES[facing];
	}

	static getDirectionRadians(facingParam) {
		const facing = ArrayCoords.normalizeDirection(facingParam);
		return RADIANS[facing];
	}

	static getDistance(coords1, coords2) {
		return Math.sqrt(
			(coords2[X] - coords1[X]) ** 2
			+ (coords2[Y] - coords1[Y]) ** 2
			+ (coords2[Z] - coords1[Z]) ** 2,
		);
	}

	static checkEqual(coords1, coords2) {
		return (coords1[X] === coords2[X] && coords1[Y] === coords2[Y] && coords1[Z] === coords2[Z]);
	}

	static subtract(coords1, coords2) {
		return [coords1[X] - coords2[X], coords1[Y] - coords2[Y], coords1[Z] - coords2[Z]];
	}

	static add(coords1, coords2) {
		return [coords1[X] + coords2[X], coords1[Y] + coords2[Y], coords1[Z] + coords2[Z]];
	}
}

// Indices
ArrayCoords.X = X;
ArrayCoords.Y = Y;
ArrayCoords.Z = Z;
ArrayCoords.NORTH = NORTH;
ArrayCoords.EAST = EAST;
ArrayCoords.SOUTH = SOUTH;
ArrayCoords.WEST = WEST;
ArrayCoords.DIRECTIONS = DIRECTIONS;
window.ArrayCoords = ArrayCoords;

export default ArrayCoords;
