import {FieldCell} from './field/fieldObject/fieldCell/cellList/FieldCell.js';
import {FieldPosition} from './field/FieldPosition.js';
import {Row} from './field/fieldObject/fieldCell/Row.js';
import {Position} from '../Position.js';
import {CellList} from './field/fieldObject/fieldCell/CellList.js';
import {Area} from '../position/Area.js';
import {GameObject} from '../GameObject.js';

export class Field extends GameObject {
	width;
	height;
	rows;
	cellWidth;
	cellHeight;
	cellGap;
	drawBorder;
	playerPool;
	currentPlayerIndex;

	wins;

	constructor(position, width, height, cellWidth, cellHeight, cellGap, drawBorder) {
		super(position);
		this.width = width;
		this.height = height;
		this.rows = [];
		this.cellWidth = cellWidth;
		this.cellHeight = cellHeight;
		this.cellGap = cellGap ? cellGap : 0;
		this.drawBorder = drawBorder === true;
		this.constructField();

		this.hasArea = true;
	}

	constructField() {
		let rows = [];
		for (let i = 0; i < this.height; i++) {
			let cells = [];
			for (let j = 0; j < this.width; j++) {
				cells.push(new FieldCell(this, new FieldPosition(j, i), this.cellWidth, this.cellHeight));
			}
			rows.push(new Row(cells));
		}
		this.rows = rows;
		this.currentPlayerIndex = 0;
		this.wins = [];
	}

	getPositionFromFieldPosition(fieldPosition) {
		return new Position(
			this.position.x + (this.cellGap + this.cellWidth) * (fieldPosition.x - (this.width- 1) / 2),
			this.position.y + (this.cellGap + this.cellHeight) * (fieldPosition.y - (this.height - 1) / 2),
		);
	}

	getArea() {
		let addGap = this.drawBorder ? this.cellGap : 0;
		let xFactor = 0.5 * (this.width * (this.cellWidth + this.cellGap) - this.cellGap) + addGap;
		let yFactor = 0.5 * (this.height * (this.cellHeight + this.cellGap) - this.cellGap) + addGap;
		return new Area(
			new Position(
				this.position.x - xFactor,
				this.position.y - yFactor
			),
			new Position(
				this.position.x + xFactor,
				this.position.y + yFactor
			)
		);
	}

	getColumn(col) {
		let list = [];

		for (let i = 0; i < this.rows.length; i++) {
			list.push(this.rows[i].cells[col]);
		}

		return new CellList(list);
	}

	getFieldPositionAtPosition(position) {
		if (!position.isWithin(this.getArea())) return undefined;
		for (let i = 0; i < this.rows.length; i++) {
			for (let j = 0; j < this.rows[i].cells.length; j++) {
				let cur = this.rows[i].cells[j];
				if (position.isWithin(cur.getArea())) return new FieldPosition(j, i);
			}
		}
	}

	getCellAtPosition(position) {
		return this.getCellAtFieldPosition(this.getFieldPositionAtPosition(position));
	}

	getCellAtFieldPosition(fieldPosition) {
		return this.rows[fieldPosition.y].cells[fieldPosition.x];
	}

	/**
	 *
	 * @param {FieldPosition} from
	 * @param {int} length
	 * @param {String} method <l|r|u|d|dl|dr>
	 * @returns {CellList|undefined}
	 */
	getLine(from, length, method) {
		let list = [];
		switch (method) {
			case 'l':
				if (from.x < length - 1) return undefined;
				for (let i = 0; i < length; i++) {
					list.push(this.getCellAtFieldPosition(new FieldPosition(from.x - i, from.y)));
				}
				break;
			case 'r':
				if (from.x + length > this.width) return undefined;
				for (let i = 0; i < length; i++) {
					list.push(this.getCellAtFieldPosition(new FieldPosition(from.x + i, from.y)));
				}
				break;
			case 'u':
				if (from.y < length - 1) return undefined;
				for (let i = 0; i < length; i++) {
					list.push(this.getCellAtFieldPosition(new FieldPosition(from.x, from.y - i)));
				}
				break;
			case 'd':
				if (from.y + length > this.height) return undefined;
				for (let i = 0; i < length; i++) {
					list.push(this.getCellAtFieldPosition(new FieldPosition(from.x, from.y + i)));
				}
				break;
			case 'dl':
				if (from.x < length - 1 || from.y + length > this.height) return undefined;
				for (let i = 0; i < length; i++) {
					list.push(this.getCellAtFieldPosition(new FieldPosition(from.x - i, from.y + i)));
				}
				break;
			case 'dr':
				if (from.x + length > this.width || from.y + length > this.height) return undefined;
				for (let i = 0; i < length; i++) {
					list.push(this.getCellAtFieldPosition(new FieldPosition(from.x + i, from.y + i)));
				}
		}
		return new CellList(list);
	}

	getPlayerFromIndex(index) {
		return this.playerPool[index];
	}

	cyclePlayer() {
		this.currentPlayerIndex = this.currentPlayerIndex === this.playerPool.length - 1 ? 0 : this.currentPlayerIndex + 1;
	}

	attemptPlaceSymbol(position) {
		if (!position.isWithin(this.getArea())) return false;
		let fieldPos = this.getFieldPositionAtPosition(position);
		if (fieldPos === undefined) return false;
		return this.attemptPlaceSymbolAtFieldPosition(fieldPos);
	}

	attemptPlaceSymbolAtFieldPosition(fieldPosition) {
	}

	analyzeWins() {
		this.wins = this.determineWins();
	}

	determineWins() {

	}

	reset() {
		this.constructField();
	}

	click(mouseData) {
		super.click(mouseData);
		if (mouseData.events[0] !== true) return false;
		this.attemptPlaceSymbol(mouseData.position);
	}

	update(mouseData) {
		super.update(mouseData);
		for (let i = 0; i < this.rows.length; i++) {
			let row = this.rows[i];
			for (let j = 0; j < row.cells.length; j++) {
				let cell = row.cells[j];
				cell.isHighlighted = mouseData.position.isWithin(cell.getArea()) && mouseData.events[0] === true;
			}
		}
	}

	draw(context) {
		super.draw(context);
		this.getArea().fill(context, '#222');
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				this.rows[i].cells[j].draw(context);
			}
		}
		for (let i = 0; i < this.wins.length; i++) {
			this.wins[i].drawLine(context);
		}
	}
}
