import {Symbol} from '../Symbol.js';
import {Circle} from '../../../../../../shape/Circle.js';

export class Chip extends Symbol {
	constructor(cell, cellPosition, size, type, color, winColor, highlightColor) {
		super(cell, cellPosition, size, type, color, winColor, highlightColor);
		this.shape = new Circle(1);
		let width = this.shape.getWidth();
		this.shape = this.shape.scale(size / width);
	}

	draw(context) {
		super.draw(context);
		this.shape.drawAt(context, this.position, true, false);
	}
}