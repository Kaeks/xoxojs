import {RedChip} from './fieldObject/fieldCell/cellObject/symbol/chip/RedChip.js';
import {Position} from '../../Position.js';
import {YellowChip} from './fieldObject/fieldCell/cellObject/symbol/chip/YellowChip.js';
import {FieldPosition} from './FieldPosition.js';
import {Field} from '../Field.js';
import {SYMBOL_TYPE} from '../../../enum/SymbolTypeEnum.js';

export class ConnectFourField extends Field {
	constructor(position, cellSize, cellGap, drawBorder) {
		super(position, 7, 6, cellSize, cellSize, cellGap, drawBorder);
		this.playerPool = [
			SYMBOL_TYPE.RED,
			SYMBOL_TYPE.YELLOW
		];
	}

	attemptPlaceSymbolAtFieldPosition(fieldPosition) {
		let cell = this.getCellAtFieldPosition(fieldPosition);
		if (cell.symbol !== undefined) return false;
		let symbol;
		let type = this.playerPool[this.currentPlayerIndex];
		switch (type) {
			case SYMBOL_TYPE.RED:
				symbol = new RedChip(cell, new Position(0, 0), 100);
				break;
			case SYMBOL_TYPE.YELLOW:
				symbol = new YellowChip(cell, new Position(0, 0), 100);
				break;
			default:
				return false;
		}
		cell.setSymbol(symbol);
		this.applyGravity();
		this.analyzeWins();
		this.cyclePlayer();
		return true;
	}

	applyGravity() {
		for (let i = 0; i < this.width; i++) {
			let list = this.getColumn(i);
			for (let j = list.cells.length - 2; j >= 0; j--) {
				for (let k = j; k < list.cells.length; k++) {
					list.attemptMove(k)
				}
			}
		}
	}

	determineWins() {
		let wins = [];
		let winLen = 4;
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				let rLine = this.getLine(new FieldPosition(j, i), winLen, 'r');
				let dLine = this.getLine(new FieldPosition(j, i), winLen, 'd');
				let dlLine = this.getLine(new FieldPosition(j, i), winLen, 'dl');
				let drLine = this.getLine(new FieldPosition(j, i), winLen, 'dr');

				if (rLine !== undefined) if (rLine.hasWinner()) wins.push(rLine);
				if (dLine !== undefined) if (dLine.hasWinner()) wins.push(dLine);
				if (dlLine !== undefined) if (dlLine.hasWinner()) wins.push(dlLine);
				if (drLine !== undefined) if (drLine.hasWinner()) wins.push(drLine);
			}
		}
		return wins;
	}
}
