import {SquareField} from '../SquareField.js';
import {SymbolX} from '../fieldObject/fieldCell/cellObject/symbol/SymbolX.js';
import {Position} from '../../../Position.js';
import {SymbolO} from '../fieldObject/fieldCell/cellObject/symbol/SymbolO.js';
import {SYMBOL_TYPE} from '../../../../enum/SymbolTypeEnum.js';

export class TicTacToeField extends SquareField {
	constructor(position, cellSize, cellGap, drawBorder) {
		super(position, 3, cellSize, cellGap, drawBorder);
		this.playerPool = [
			SYMBOL_TYPE.X,
			SYMBOL_TYPE.O
		];
	}

	attemptPlaceSymbolAtFieldPosition(fieldPosition) {
		let cell = this.getCellAtFieldPosition(fieldPosition);
		if (cell.symbol !== undefined) return false;
		let symbol;
		let type = this.playerPool[this.currentPlayerIndex];
		switch (type) {
			case SYMBOL_TYPE.X:
				symbol = new SymbolX(cell, new Position(0, 0), 90);
				break;
			case SYMBOL_TYPE.O:
				symbol = new SymbolO(cell, new Position(0, 0), 75);
				break;
			default:
				return false;
		}
		cell.setSymbol(symbol);
		this.analyzeWins();
		this.cyclePlayer();
		return true;
	}

	determineWins() {
		let wins = [];

		for (let i = 0; i < this.rows.length; i++) {
			let curRow = this.rows[i];
			let curCol = this.getColumn(i);
			if (i <= 1) {
				let curDiag = this.getDiagonal(i);
				if (curDiag.hasWinner()) wins.push(curDiag);
			}
			if (curRow.hasWinner()) wins.push(curRow);
			if (curCol.hasWinner()) wins.push(curCol);
		}

		return wins;
	}

	update(mouseData) {
		super.update(mouseData);
	}

	draw(context) {
		super.draw(context);
	}
}
