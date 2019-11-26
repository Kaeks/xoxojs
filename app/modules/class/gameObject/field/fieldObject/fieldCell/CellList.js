export class CellList {
	cells;

	constructor(cells) {
		this.cells = cells;
	}

	attemptMove(index) {
		if (index >= this.cells.length - 1) return false;
		let oldCell = this.cells[index];
		let newCell = this.cells[index + 1];
		if (oldCell.symbol === undefined) return false;
		if (newCell.symbol !== undefined) return false;
		newCell.symbol = oldCell.symbol;
		oldCell.symbol = undefined;
		newCell.symbol.setCell(newCell);
		return true;
	}

	hasWinner() {
		let first;
		for (let i = 0; i < this.cells.length; i++) {
			if (this.cells[i].symbol === undefined) return false;
			let cur = this.cells[i].symbol.type;
			//if (cur === undefined) return false;
			if (i === 0) first = cur;
			if (cur !== first) return false;
		}
		// We've established that this row is a winning row
		for (let i = 0; i < this.cells.length; i++) {
			this.cells[i].hasWin = true;
		}
		return true;
	}

	drawLine(context) {
		context.strokeStyle = '#000';
		context.beginPath();
		for (let i = 0; i < this.cells.length; i++) {
			if (i === 0) {
				context.moveTo(this.cells[i].position.x, this.cells[i].position.y);
			} else {
				context.lineTo(this.cells[i].position.x, this.cells[i].position.y);
			}
		}
		context.stroke();
	}

}
