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

		fill() {
			context.fillRect(this.x1, this.y1, this.getWidth(), this.getHeight());
		}

		stroke() {
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

	class Field extends GameObject {
		cellSize;
		cells;
		cellGap;
		drawBorder;

		constructor(position, cellSize, cellGap, drawBorder) {
			super(position);
			this.cellSize = cellSize;
			this.cells = [];
			this.cellGap = cellGap ? cellGap : 0;
			this.drawBorder = drawBorder === true;
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					this.cells.push(new FieldCell(this, new FieldPosition(i, j), cellSize));
				}
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

		draw() {
			super.draw();
			context.save();
			context.fillStyle = '#222';
			this.getArea().fill();
			context.restore();
		}
	}

	class FieldCell extends GameObject {
		field;
		fieldPosition;
		size;

		constructor(field, fieldPosition, size) {
			super(field.getPositionFromFieldPosition(fieldPosition));
			this.field = field;
			this.fieldPosition = fieldPosition;
			this.size = size;
		}

		getArea() {
			return new Area(
				new Position(
					this.position.x - this.size * 0.5,
					this.position.y - this.size * 0.5
				),
				new Position(
					this.position.x + this.size * 0.5,
					this.position.y + this.size * 0.5
				)
			);
		}

		draw() {
			super.draw();
			super.draw();
			context.save();
			context.fillStyle = '#555';
			this.getArea().fill();
			context.restore();
		}

		highlight() {
			let area = this.getArea();
			context.fillStyle = '#777';
			area.fill();
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

	class Symbol extends FieldObject {
		size;

		constructor(field, fieldPosition, size) {
			super(field, fieldPosition);
			this.size = size;
		}

	}

	class SymbolX extends Symbol {
		constructor(field, fieldPosition, size) {
			super(field, fieldPosition, size);
		}
	}

	class SymbolO extends Symbol {
		constructor(field, fieldPosition, size) {
			super(field, fieldPosition, size);
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
	function determineCellsPressed() {
		if (mousePosition === undefined) return undefined;
		if (mouseEvents[0] !== true) return undefined;
		let list = [];
		for (let i = 0; i < gameObjectList.length; i++) {
			let cur = gameObjectList[i];
			if (!(cur instanceof Field)) continue;
			if (mousePosition.isWithin(cur.getArea())) {
				for (let j = 0; j < cur.cells.length; j++) {
					let cell = cur.cells[j];
					if (mousePosition.isWithin(cell.getArea())) {
						list.push(cell);
					}
				}
			}
		}
		return list;
	}

	// INPUT LISTENERS

	let mouseEvents = {};
	let mousePosition = new Position(0,0);

	function mouseListener(e) {
		switch (e.type) {
			case 'mousedown':
				mouseEvents[e.button] = true;
				break;
			case 'mouseup':
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
		runForAll(function(cur) {
			cur.update();
		});

		runForAll(function(cur) {
			cur.draw();
			if (cur instanceof Field) {
				runForAllIn(function(cur) {
					cur.draw();
					}, cur.cells
				);
			}
		});

		runForAllIn(
			function(cur) {
				cur.highlight();
			}, determineCellsPressed(), false
		);

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

		addEventListener('mousedown', mouseListener);
		addEventListener('mouseup', mouseListener);
		addEventListener('mousemove', mouseListener);
		addEventListener('contextmenu', function(e){e.preventDefault();}, false);

		gameLoop();
	}

	// Entry point
	setup();
}(document.querySelector('canvas'), document.querySelector('canvas').getContext('2d')));