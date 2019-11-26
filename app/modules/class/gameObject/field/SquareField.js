import {Field} from '../Field.js';
import {CellList} from './fieldObject/fieldCell/CellList.js';

export class SquareField extends Field {
	constructor(position, size, cellSize, cellGap, drawBorder) {
		super(position, size, size, cellSize, cellSize, cellGap, drawBorder);
	}

	getDiagonal(whichOneHuh) {
		let list = [];
		for (let i = 0; i < this.rows.length; i++) {
			if (whichOneHuh === 0) {
				list.push(this.rows[i].cells[i]);
			} else if (whichOneHuh === 1) {
				list.push(this.rows[i].cells[this.rows.length - 1 - i]);
			}
		}
		return new CellList(list);
	}

	update(mouseData) {
		super.update(mouseData);
	}

	draw(context) {
		super.draw(context);
	}

}
