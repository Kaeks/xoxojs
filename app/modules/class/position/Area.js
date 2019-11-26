import {Position} from '../Position.js';

export class Area {
	x1;
	x2;
	y1;
	y2;

	constructor(x1, x2, y1, y2) {
		if (x1 instanceof Position && x2 instanceof Position) {
			this.x1 = x1.x;
			this.x2 = x2.x;
			this.y1 = x1.y;
			this.y2 = x2.y;
		} else {
			if (x2 < x1 || y2 < y1) throw 'wrong';
			this.x1 = x1;
			this.x2 = x2;
			this.y1 = y1;
			this.y2 = y2;
		}
	}

	getWidth() {
		return this.x2 - this.x1;
	}

	getHeight() {
		return this.y2 - this.y1;
	}

	getSize() {
		return this.getWidth() * this.getHeight();
	}

	contains(position) {
		return position.isWithin(this);
	}

	fill(context, style) {
		context.fillStyle = style;
		context.fillRect(this.x1, this.y1, this.getWidth(), this.getHeight());
	}

	stroke(context, style) {
		context.strokeStyle = style;
		context.strokeRect(this.x1, this.y1, this.getWidth(), this.getHeight());
	}
}
