import {FieldObject} from '../../../FieldObject.js';
import {Area} from '../../../../../position/Area.js';
import {Position} from '../../../../../Position.js';

export class FieldCell extends FieldObject {
	width;
	height;
	symbol;
	isHighlighted;
	hasWin;

	constructor(field, fieldPosition, width, height) {
		super(field, fieldPosition);
		this.width = width;
		this.height = height;
		this.isHighlighted = false;
		this.hasWin = false;

		this.hasArea = true;
	}

	getArea() {
		return new Area(
			new Position(
				this.position.x - this.width * 0.5,
				this.position.y - this.height * 0.5
			),
			new Position(
				this.position.x + this.width * 0.5,
				this.position.y + this.height * 0.5
			)
		);
	}

	setSymbol(symbol) {
		this.symbol = symbol;
	}

	determineColor() {
		if (this.isHighlighted) {
			if (this.hasWin) {
				return this.symbol.highlightColor;
			}
			return '#777';
		} else {
			if (this.hasWin) {
				return this.symbol.winColor;
			}
		}
		return '#555';
	}

	click(mouseData) {
		super.click(mouseData);
	}

	update(mouseData) {
		super.update(mouseData);
	}

	draw(context) {
		super.draw(context);
		let style = this.determineColor();
		this.getArea().fill(context, style);
		if (this.symbol !== undefined) this.symbol.draw(context);
	}
}