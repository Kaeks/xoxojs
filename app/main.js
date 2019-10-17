(function(canvas, context) {

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
			if (x !== Math.floor(x) || y !== Math.floor(y) || x < 0 || x > 2 || y < 0 || x > 2) {
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

		drawAt(position) {
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

		scale(factor) {
			let points = [];
			for (let i = 0; i < this.points.length; i++) {
				points.push([ this.points[i][0] * factor, this.points[i][1] * factor ]);
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

	class GameObject {
		position;

		constructor(position) {
			this.position = position;
		}

		update() {

		}

		draw() {

		}

	}

	class CellList {
		cells;

		constructor(cells) {
			this.cells = cells;
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

	}

	class Row extends CellList {
		constructor(cells) {
			super(cells);
		}
	}

	class Field extends GameObject {
		cellSize;
		rows;
		cellGap;
		drawBorder;

		constructor(position, cellSize, cellGap, drawBorder) {
			super(position);
			this.cellSize = cellSize;
			this.rows = [];
			this.cellGap = cellGap ? cellGap : 0;
			this.drawBorder = drawBorder === true;

			for (let i = 0; i < 3; i++) {
				let cells = [];
				for (let j = 0; j < 3; j++) {
					cells.push(new FieldCell(this, new FieldPosition(j, i), cellSize));
				}
				this.rows.push(new Row(cells));
			}
		}

		getPositionFromFieldPosition(fieldPosition) {
			return new Position(
				this.position.x + (this.cellGap + this.cellSize) * (fieldPosition.x - 1),
				this.position.y + (this.cellGap + this.cellSize) * (fieldPosition.y - 1),
			);
		}

		getArea() {
			let totalGap = this.drawBorder ? this.cellGap * 2 : this.cellGap;
			return new Area(
				new Position(
					this.position.x - this.cellSize * 1.5 - totalGap,
					this.position.y - this.cellSize * 1.5 - totalGap
				),
				new Position(
					this.position.x + this.cellSize * 1.5 + totalGap,
					this.position.y + this.cellSize * 1.5 + totalGap
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

		analyzeWins() {
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

		determineWinner(wins) {
			let list = [];
			for (let i = 0; i < wins.length; i++) {
				list.push(wins[i].getWinner());
			}
			return list;
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
		size;
		symbol;
		isHighlighted;
		hasWin;

		constructor(field, fieldPosition, size) {
			super(field, fieldPosition);
			this.size = size;
			this.isHighlighted = false;
			this.hasWin = false;
		}

		getArea() {
			return new Area(new Position(this.position.x - this.size * 0.5, this.position.y - this.size * 0.5), new Position(this.position.x + this.size * 0.5, this.position.y + this.size * 0.5));
		}

		setSymbol(symbol) {
			this.symbol = symbol;
		}

		determineColor() {
			if (this.isHighlighted) {
				if (this.hasWin) {
					if (this.symbol.type === 'X') {
						return '#855';
					} else if (this.symbol.type === 'O') {
						return '#558';
					}
				}
				return '#777';
			} else {
				if (this.hasWin) {
					if (this.symbol.type === 'X') {
						return '#744';
					} else if (this.symbol.type === 'O') {
						return '#447';
					}
				}
			}
			return '#555';
		}

		draw() {
			super.draw();
			let style = this.determineColor();
			this.getArea().fill(style);
			if (this.symbol !== undefined) this.symbol.draw();
		}
	}

	class CellObject extends GameObject {
		constructor(cell, cellPosition) {
			super(new Position(cell.position.x + cellPosition.x, cell.position.y + cellPosition.y));
		}
	}

	class Symbol extends CellObject {
		size;
		type;

		constructor(cell, cellPosition, size, type) {
			super(cell, cellPosition);
			this.size = size;
			this.type = type;
		}

		draw() {
			super.draw();
			// can't draw this abstract object
		}

	}

	class SymbolX extends Symbol {
		shape;

		constructor(cell, cellPosition, size) {
			super(cell, cellPosition, size, 'X');
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
			context.fillStyle = '#b44';
			this.shape.drawAt(this.position, true, false);
		}
	}

	class SymbolO extends Symbol {
		constructor(cell, cellPosition, size) {
			super(cell, cellPosition, size, 'O');
			this.shape = new Circle(1);
			let width = this.shape.getWidth();
			this.shape = this.shape.scale(size / width);
		}

		draw() {
			super.draw();
			context.strokeStyle = '#44b';
			this.shape.drawAt(this.position, false, true, 15);
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

	/**
	 * Get a list of the FieldCells that are currently being pressed
	 *
	 * @returns {[]}
	 */

	function getCellsAt(position) {
		if (position === undefined) return undefined;
		let list = [];
		for (let i = 0; i < gameObjectList.length; i++) {
			let cur = gameObjectList[i];
			if (!(cur instanceof Field)) continue;
			if (position.isWithin(cur.getArea())) {
				for (let j = 0; j < cur.rows.length; j++) {
					let row = cur.rows[j];
					for (let k = 0; k < row.cells.length; k++) {
						let cell = row.cells[k];
						if (position.isWithin(cell.getArea())) {
							list.push(cell);
						}
					}
				}
			}
		}
		return list;
	}

	function attemptPlaceSymbol(position, type) {
		let list = getCellsAt(position);
		if (list.length === 0) return false;
		let cell = list[0];
		if (cell.symbol !== undefined) return false;
		let symbol;
		switch (type) {
			case 'X':
				symbol = new SymbolX(cell, new Position(0, 0), 90);
				break;
			case 'O':
				symbol = new SymbolO(cell, new Position(0, 0), 80);
				break;
			default:
				return false;
		}
		cell.setSymbol(symbol);
		cell.field.analyzeWins();
		return true;
	}

	// INPUT LISTENERS

	let mouseEvents = {};
	let mousePosition = new Position(0, 0);
	let currentPlaying;

	function mouseListener(e) {
		switch (e.type) {
			case 'mousedown':
				mouseEvents[e.button] = true;
				break;
			case 'mouseup':
				mouseEvents[e.button] = false;
				if (attemptPlaceSymbol(mousePosition, currentPlaying)) {
					let previousPlaying = currentPlaying;
					currentPlaying = undefined;
					switch (previousPlaying) {
						case 'X':
							currentPlaying = 'O';
							break;
						case 'O':
							currentPlaying = 'X';
							break;
					}
				}
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

		// DRAW ALL
		runForAll(function(cur) {
			cur.draw();
			if (cur instanceof Field) {
				runForAllIn(function(cur) {
					runForAllIn(function(cur) {
						cur.draw();
					}, cur.cells);
				}, cur.rows);
			}
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
		mainField = new Field(getCanvasCenterPosition(), 100, 10, true);
		gameObjectList.push(mainField);

		// LOGIC SETUP
		currentPlaying = 'X';

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