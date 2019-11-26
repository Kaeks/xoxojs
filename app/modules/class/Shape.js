export class Shape {
	minX;
	maxX;
	minY;
	maxY;

	width;
	height;

	constructor() {
	}

	getMinX() {return this.minX}
	getMaxX() {return this.maxX}
	getMinY() {return this.minY}
	getMaxY() {return this.maxY}
	getWidth() {return this.width}
	getHeight() {return this.height}

	calcSpace() {
		this.width = this.getMaxX() - this.getMinX();
		this.height = this.getMaxY() - this.getMinY();
	}

	scale() {
	}

	drawAt(context, position, fill, stroke, thickness) {
		if (fill) context.fill();
		if (stroke) {
			if (thickness) {
				context.save();
				context.lineWidth = thickness;
			}
			context.stroke();
			if (thickness) {
				context.restore()
			}
		}
	}
}
