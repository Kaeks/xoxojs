import {Shape} from '../Shape.js';

export class Polygon extends Shape {
	points;

	constructor(points) {
		super();
		this.points = points;
		this.calcSpace();
	}

	addPoint(point, index) {
		if (index !== undefined) {
			this.points.splice(index, 0, point);
		} else {
			this.points.push(point);
		}
		this.calcSpace();
	}

	calcSpace() {
		this.minX = getMinPropertyOf(this.points, 0);
		this.maxX = getMaxPropertyOf(this.points, 0);
		this.minY = getMinPropertyOf(this.points, 1);
		this.maxY = getMaxPropertyOf(this.points, 1);
		super.calcSpace();
	}

	scale(factor, factor2) {
		let points = [];
		factor2 = factor2 !== undefined ? factor2 : factor;
		for (let i = 0; i < this.points.length; i++) {
			points.push([ this.points[i][0] * factor, this.points[i][1] * factor2 ]);
		}
		return new Polygon(points);
	}

	drawAt(context, position, fill, stroke, thickness) {
		context.beginPath();
		for (let i = 0; i < this.points.length; i++) {
			if (i === 0) {
				context.moveTo(position.x + this.points[i][0], position.y + this.points[i][1]);
			} else {
				context.lineTo(position.x + this.points[i][0], position.y + this.points[i][1]);
			}
		}
		context.closePath();
		super.drawAt(context, position, fill, stroke, thickness);
	}
}

function getMinPropertyOf(list, property) {
	let smallest;
	for (let i = 0; i < list.length; i++) {
		if (i === 0 || list[i][property] < smallest) {
			smallest = list[i][property];
		}
	}
	return smallest;
}

function getMaxPropertyOf(list, property) {
	let largest;
	for (let i = 0; i < list.length; i++) {
		if (i === 0 || list[i][property] > largest) {
			largest = list[i][property];
		}
	}
	return largest;
}

