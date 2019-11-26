import {CellObject} from '../CellObject.js';

export class Symbol extends CellObject {
	size;
	type;
	shape;
	color;
	highlightColor;
	winColor;

	constructor(cell, cellPosition, size, type, color, winColor, highlightColor) {
		super(cell, cellPosition);
		this.size = size;
		this.type = type;
		this.color = color;
		this.winColor = winColor;
		this.highlightColor = highlightColor;

		this.hasArea = true;
	}

	click(mouseData) {
		super.click(mouseData);
	}

	update(mouseData) {
		super.update(mouseData);
	}

	draw(context) {
		super.draw(context);
		context.fillStyle = this.color;
		context.strokeStyle = this.color;
	}

}
