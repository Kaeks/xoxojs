import {Position} from '../../../../Position.js';
import {GameObject} from '../../../../GameObject.js';

export class CellObject extends GameObject {
	cell;
	cellPosition;

	constructor(cell, cellPosition) {
		super(new Position(cell.position.x + cellPosition.x, cell.position.y + cellPosition.y));
		this.cell = cell;
		this.cellPosition = cellPosition;
	}

	setCell(cell) {
		this.cell = cell;
		this.adjustToCell();
	}

	adjustToCell() {
		this.position = new Position(this.cell.position.x + this.cellPosition.x, this.cell.position.y + this.cellPosition.y);
	}
}
