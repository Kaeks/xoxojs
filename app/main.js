(function(canvas, context) {

	// CONSTANTS

	const SYMBOL_TYPE = {
		X : 'X',
		O : 'O',
		RED : 'RED',
		YELLOW : 'YELLOW'

	};

	// LIST OF ALL OBJECTS

	let gameObjectList = [];

	// CLASSES

	class Position {
		x;
		y;

		constructor(x, y) {
			this.x = x;
			this.y = y;
		}

		isWithin(area) {
			return this.x >= area.x1 && this.x <= area.x2 && this.y >= area.y1 && this.y <= area.y2;
		}

	}

	class Area {
		x1;
		x2;
		y1;
		y2;

		constructor(x1, x2, y1, y2) {
			if (x1 instanceof Position && x2 instanceof Position) {
				this.x1 = x1.x;
				this.x2 = x2.x;
				this.y1 = x1.y;
				this.y2 = x2.y;
			} else {
				if (x2 < x1 || y2 < y1) throw 'wrong';
				this.x1 = x1;
				this.x2 = x2;
				this.y1 = y1;
				this.y2 = y2;
			}
		}

		getWidth() {
			return this.x2 - this.x1;
		}

		getHeight() {
			return this.y2 - this.y1;
		}

		getSize() {
			return this.getWidth() * this.getHeight();
		}

		contains(position) {
			return position.isWithin(this);
		}

		fill(style) {
			context.fillStyle = style;
			context.fillRect(this.x1, this.y1, this.getWidth(), this.getHeight());
		}

		stroke(style) {
			context.strokeStyle = style;
			context.strokeRect(this.x1, this.y1, this.getWidth(), this.getHeight());
		}
	}

	class FieldPosition extends Position {
		constructor(x, y) {
			if (x !== Math.floor(x) || y !== Math.floor(y) || x < 0 || y < 0) {
				throw 'wrong';
			}
			super(x, y);
		}
	}

	function getMinPropertyOf(list, property) {
		let smallest;
		for (let i = 0; i < list.length; i++) {
			if (i === 0 || list[i][property] < smallest) {
				smallest = list[i][property];
			}
		}
		return smallest;
	}

	function getMaxPropertyOf(list, property) {
		let largest;
		for (let i = 0; i < list.length; i++) {
			if (i === 0 || list[i][property] > largest) {
				largest = list[i][property];
			}
		}
		return largest;
	}

	class Shape {
		minX;
		maxX;
		minY;
		maxY;

		width;
		height;

		constructor() {
		}

		getMinX() {return this.minX}
		getMaxX() {return this.maxX}
		getMinY() {return this.minY}
		getMaxY() {return this.maxY}
		getWidth() {return this.width}
		getHeight() {return this.height}

		calcSpace() {
			this.width = this.getMaxX() - this.getMinX();
			this.height = this.getMaxY() - this.getMinY();
		}

		scale() {
		}

		drawAt(position, fill, stroke, thickness) {
			if (fill) context.fill();
			if (stroke) {
				if (thickness) {
					context.save();
					context.lineWidth = thickness;
				}
				context.stroke();
				if (thickness) {
					context.restore()
				}
			}
		}
	}

	class Circle extends Shape {
		radius;

		constructor(radius) {
			super();
			this.radius = radius;
			this.calcSpace();
		}

		calcSpace() {
			this.minX = -this.radius;
			this.maxX = this.radius;
			this.minY = -this.radius;
			this.maxY = this.radius;
			super.calcSpace();
		}

		scale(factor) {
			return new Circle(this.radius * factor);
		}

		drawAt(position, fill, stroke, thickness) {
			context.beginPath();
			context.arc(position.x, position.y, this.radius, 0, 2 * Math.PI);
			context.closePath();
			super.drawAt(position, fill, stroke, thickness);
		}
	}

	class Polygon extends Shape {
		points;

		constructor(points) {
			super();
			this.points = points;
			this.calcSpace();
		}

		addPoint(point, index) {
			if (index !== undefined) {
				this.points.splice(index, 0, point);
			} else {
				this.points.push(point);
			}
			this.calcSpace();
		}

		calcSpace() {
			this.minX = getMinPropertyOf(this.points, 0);
			this.maxX = getMaxPropertyOf(this.points, 0);
			this.minY = getMinPropertyOf(this.points, 1);
			this.maxY = getMaxPropertyOf(this.points, 1);
			super.calcSpace();
		}

		scale(factor, factor2) {
			let points = [];
			factor2 = factor2 !== undefined ? factor2 : factor;
			for (let i = 0; i < this.points.length; i++) {
				points.push([ this.points[i][0] * factor, this.points[i][1] * factor2 ]);
			}
			return new Polygon(points);
		}

		drawAt(position, fill, stroke, thickness) {
			context.beginPath();
			for (let i = 0; i < this.points.length; i++) {
				if (i === 0) {
					context.moveTo(position.x + this.points[i][0], position.y + this.points[i][1]);
				} else {
					context.lineTo(position.x + this.points[i][0], position.y + this.points[i][1]);
				}
			}
			context.closePath();
			super.drawAt(position, fill, stroke, thickness);
		}
	}

	class GameObject {
		position;
		hasArea;

		constructor(position) {
			this.position = position;
		}

		moveTo(position) {
			this.position = position;
		}

		click(mousePosition) {
		}

		update() {

		}

		draw() {

		}

	}

	class Button extends GameObject {
		action;
		width;
		height;
		color;
		hover;
		hoverColor;

		constructor(position, width, height, color, hoverColor) {
			super(position);
			this.width = width;
			this.height = height;
			this.color = color !== undefined ? color : '#eee';
			this.hoverColor = hoverColor !== undefined ? hoverColor : '#fff';

			this.hasArea = true;
		}

		getArea() {
			return new Area(
				new Position(this.position.x - this.width / 2, this.position.y - this.height / 2),
				new Position(this.position.x + this.width / 2, this.position.y + this.height / 2)
			);
		}

		call() {
			if (this.action === undefined) return false;
			this.action();
		}

		click(mousePosition) {
			super.click(mousePosition);
			if (mouseEvents[0] !== true) return false;
			this.call();
		}

		update() {
			super.update();
			this.hover = mousePosition.isWithin(this.getArea());
		}

		draw() {
			super.draw();
			let style = this.hover ? this.hoverColor : this.color;
			this.getArea().fill(style);
		}
	}

	class TextButton extends Button {
		text;
		textColor;

		constructor(position, width, height, text, color, hoverColor, textColor) {
			super(position, width, height, color, hoverColor);
			this.text = text !== undefined ? text : 'Button';
			this.textColor = textColor !== undefined ? textColor : '#000';
		}

		update() {
			super.update();
		}

		draw() {
			super.draw();
			context.font = '30px Arial';
			context.textAlign = 'center';
			context.fillStyle = this.textColor;
			context.fillText(this.text, this.position.x, this.position.y + 10);
		}
	}


	class CellList {
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

		getWinner() {
			if (this.hasWinner()) return this.cells[0].type;
		}

		drawLine() {
			context.strokeStyle = '#000';
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

	class Row extends CellList {
		constructor(cells) {
			super(cells);
		}
	}

	class Field extends GameObject {
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

		click(mousePosition) {
			super.click(mousePosition);
			if (mouseEvents[0] !== true) return false;
			this.attemptPlaceSymbol(mousePosition);
		}

		update() {
			super.update();
			for (let i = 0; i < this.rows.length; i++) {
				let row = this.rows[i];
				for (let j = 0; j < row.cells.length; j++) {
					let cell = row.cells[j];
					cell.isHighlighted = mousePosition.isWithin(cell.getArea()) && mouseEvents[0] === true;
				}
			}
		}

		draw() {
			super.draw();
			this.getArea().fill('#222');
			for (let i = 0; i < this.height; i++) {
				for (let j = 0; j < this.width; j++) {
					this.rows[i].cells[j].draw();
				}
			}
			for (let i = 0; i < this.wins.length; i++) {
				this.wins[i].drawLine();
			}
		}
	}

	class SquareField extends Field {
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

		update() {
			super.update();
		}

		draw() {
			super.draw();
			this.getArea().fill('#222');
		}

	}

	class TicTacToeField extends SquareField {
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

		update() {
			super.update();
		}

		draw() {
			super.draw();
		}
	}

	class ConnectFourField extends Field {
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

	class FieldObject extends GameObject {
		field;
		fieldPosition;

		constructor(field, fieldPosition) {
			super(field.getPositionFromFieldPosition(fieldPosition));
			this.field = field;
			this.fieldPosition = fieldPosition;
		}
	}

	class FieldCell extends FieldObject {
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

		click(mousePosition) {
			super.click(mousePosition);
		}

		update() {
			super.update();
		}

		draw() {
			super.draw();
			let style = this.determineColor();
			this.getArea().fill(style);
			if (this.symbol !== undefined) this.symbol.draw();
		}
	}

	class CellObject extends GameObject {
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

	class Symbol extends CellObject {
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

		click(mousePosition) {
			super.click(mousePosition);
		}

		update() {
			super.update();
		}

		draw() {
			super.draw();
			context.fillStyle = this.color;
			context.strokeStyle = this.color;
		}

	}

	class SymbolX extends Symbol {
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

		draw() {
			super.draw();
			this.shape.drawAt(this.position, true, false);
		}
	}

	class SymbolO extends Symbol {
		constructor(cell, cellPosition, size) {
			super(cell, cellPosition, size, SYMBOL_TYPE.O, '#44b', '#447', '#558');
			this.shape = new Circle(1);
			let width = this.shape.getWidth();
			this.shape = this.shape.scale(size / width);
		}

		draw() {
			super.draw();
			this.shape.drawAt(this.position, false, true, 15);
		}
	}

	class Chip extends Symbol {
		constructor(cell, cellPosition, size, type, color, winColor, highlightColor) {
			super(cell, cellPosition, size, type, color, winColor, highlightColor);
			this.shape = new Circle(1);
			let width = this.shape.getWidth();
			this.shape = this.shape.scale(size / width);
		}

		draw() {
			super.draw();
			this.shape.drawAt(this.position, true, false);
		}
	}

	class RedChip extends Chip {
		constructor(cell, cellPosition, size) {
			super(cell, cellPosition, size, SYMBOL_TYPE.RED, '#d44', '#644', '#755');
		}
	}

	class YellowChip extends Chip {
		constructor(cell, cellPosition, size) {
			super(cell, cellPosition, size, SYMBOL_TYPE.YELLOW, '#dd4', '#664', '#775');
		}
	}

	// END CLASS DECLARATIONS

	// METHODS

	/**
	 * Get the center position of the canvas
	 *
	 * @returns {Position}
	 */
	function getCanvasCenterPosition() {
		return new Position(canvas.clientWidth / 2, canvas.clientHeight / 2);
	}

	/**
	 * Runs a function for all entries of a list of objects
	 *
	 * @param {function}  func The function to run
	 * @param {Array} inside The list of entries
	 * @param {boolean} [reverse=false] Whether the list should be processed from its end
	 * @param {Array} [args] A List of arguments
	 */
	function runForAllIn(func, inside, reverse, args) {
		if (inside === undefined) return;
		if (reverse === true) {
			for (let i = inside.length - 1; i >= 0; i--) {
				func(inside[i], args);
			}
		} else {
			for (let i = 0; i < inside.length; i++) {
				func(inside[i], args);
			}
		}
	}

	/**
	 * Runs a function for all entries of a list of objects that match a specific type
	 *
	 * @param {function}  func The function to run
	 * @param {Object} type The type to filter
	 * @param {Array} inside The list of entries
	 * @param {boolean} [reverse=false] Whether the list should be processed from its end
	 * @param {Array} [args] A List of arguments
	 */
	function runForSpecificIn(func, type, inside, reverse, args) {
		if (reverse === true) {
			for (let i = inside.length - 1; i >= 0; i--) {
				if (!(inside[i] instanceof type)) continue;
				func(inside[i], args);
			}
		} else {
			for (let i = 0; i < inside.length; i++) {
				if (!(inside[i] instanceof type)) continue;
				func(inside[i], args);
			}
		}
	}

	/**
	 * Runs a function for all entries of the gameObjectList
	 *
	 * @param {function}  func The function to run
	 * @param {boolean} [reverse=false] Whether the list should be processed from its end
	 * @param {Array} [args] A List of arguments
	 */
	function runForAll(func, reverse, args) {
		runForAllIn(func, gameObjectList, reverse, args);
	}

	/**
	 * Runs a function for all entries that match a specific type inside gameObjectList
	 *
	 * @param {function}  func The function to run
	 * @param {Object} type The type to filter
	 * @param {boolean} [reverse=false] Whether the list should be processed from its end
	 * @param {Array} [args] A List of arguments
	 */
	function runForSpecific(func, type, reverse, args) {
		runForSpecificIn(func, type, gameObjectList, reverse, args);
	}

	// INPUT LISTENERS

	let mouseEvents = {};
	let mousePosition = new Position(0, 0);

	function mouseListener(e) {
		switch (e.type) {
			case 'mousedown':
				mouseEvents[e.button] = true;
				break;
			case 'mouseup':
				for (let i = 0; i < gameObjectList.length; i++) {
					let cur = gameObjectList[i];
					if (cur.hasArea) {
						if (mousePosition.isWithin(cur.getArea())) {
							cur.click(mousePosition);
						}
					}
				}
				mouseEvents[e.button] = false;
				break;
			case 'mousemove':
				mousePosition = new Position(e.clientX, e.clientY);
				break;
		}
	}

	// GAME LOOP AND SETUP

	let mainField;

	function gameLoop() {
		// necessary for chrome devtools
		gameObjectList = gameObjectList;
		// UPDATE ALL
		runForAll(function(cur) {
			cur.update();
		});

		// CLEAR FRAME

		context.clearRect(0, 0, canvas.width, canvas.height);

		// DRAW ALL
		runForAll(function(cur) {
			cur.draw();
		});

		requestAnimationFrame(gameLoop);
	}

	function setup() {
		// CANVAS SETUP
		window.addEventListener("resize", function() {
			canvas.width = canvas.clientWidth;
			canvas.height = canvas.clientHeight;
			context.imageSmoothingEnabled = false;
		});
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
		context.imageSmoothingEnabled = false;

		// OBJECT SETUP
		//mainField = new TicTacToeField(getCanvasCenterPosition(), 100, 10, true);
		mainField = new ConnectFourField(getCanvasCenterPosition(), 100, 5, true);
		gameObjectList.push(mainField);

		// BUTTON SETUP

		let resetButton = new TextButton(
			new Position(
				100,
				canvas.clientHeight / 2
			),
			100,
			30,
			'Reset',
			'#ccc',
			'#ddd',
			'#000'
		);
		resetButton.action = function () {
			mainField.reset();
		};
		gameObjectList.push(resetButton);

		// LISTENER SETUP
		addEventListener('mousedown', mouseListener);
		addEventListener('mouseup', mouseListener);
		addEventListener('mousemove', mouseListener);
		addEventListener('contextmenu', function(e) {
			e.preventDefault();
		}, false);

		// GAME START
		gameLoop();
	}

	// Entry point
	setup();
}(document.querySelector('canvas'), document.querySelector('canvas').getContext('2d')));