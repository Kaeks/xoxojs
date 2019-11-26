import {Symbol} from '../Symbol.js';
import {SYMBOL_TYPE} from '../../../../../../../enum/SymbolTypeEnum.js';
import {Polygon} from '../../../../../../shape/Polygon.js';

export class SymbolX extends Symbol {
	constructor(cell, cellPosition, size) {
		super(cell, cellPosition, size, SYMBOL_TYPE.X, '#b44', '#744', '#855');
		this.shape = new Polygon([
			[ -3, -3 ], [ -2, -3 ], [ 0, -1 ], [ 2, -3 ],
			[ 3, -3 ], [ 3, -2 ], [ 1, 0 ], [ 3, 2 ],
			[ 3, 3 ], [ 2, 3 ], [ 0, 1 ], [ -2, 3 ],
			[ -3, 3 ], [ -3, 2 ], [ -1, 0 ], [ -3, -2 ]
		]);
		let width = this.shape.getWidth();
		this.shape = this.shape.scale(size / width);
	}

	draw(context) {
		super.draw(context);
		this.shape.drawAt(context, this.position, true, false);
	}
}
