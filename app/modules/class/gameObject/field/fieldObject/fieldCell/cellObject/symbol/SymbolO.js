import {Symbol} from '../Symbol.js';
import {SYMBOL_TYPE} from '../../../../../../../enum/SymbolTypeEnum.js';
import {Circle} from '../../../../../../shape/Circle.js';

export class SymbolO extends Symbol {
	constructor(cell, cellPosition, size) {
		super(cell, cellPosition, size, SYMBOL_TYPE.O, '#44b', '#447', '#558');
		this.shape = new Circle(1);
		let width = this.shape.getWidth();
		this.shape = this.shape.scale(size / width);
	}

	draw(context) {
		super.draw(context);
		this.shape.drawAt(context, this.position, false, true, 15);
	}
}
