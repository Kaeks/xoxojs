import {Shape} from '../Shape.js';

export class Circle extends Shape {
	radius;

	constructor(radius) {
		super();
		this.radius = radius;
		this.calcSpace();
	}

	calcSpace() {
		this.minX = -this.radius;
		this.maxX = this.radius;
		this.minY = -this.radius;
		this.maxY = this.radius;
		super.calcSpace();
	}

	scale(factor) {
		return new Circle(this.radius * factor);
	}

	drawAt(context, position, fill, stroke, thickness) {
		context.beginPath();
		context.arc(position.x, position.y, this.radius, 0, 2 * Math.PI);
		context.closePath();
		super.drawAt(context, position, fill, stroke, thickness);
	}
}
