export class Position {
	x;
	y;

	/**
	 * Constructor
	 * @param {Number} x
	 * @param {Number} y
	 */
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	isWithin(area) {
		return this.x >= area.x1 && this.x <= area.x2 && this.y >= area.y1 && this.y <= area.y2;
	}

}
