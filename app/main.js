import {Position} from './modules/class/Position.js';
import {ConnectFourField} from './modules/class/gameObject/field/ConnectFourField.js';
import {TicTacToeField} from './modules/class/gameObject/field/squareField/TicTacToeField.js';
import {TextButton} from './modules/class/gameObject/Button/TextButton.js';
import {MouseData} from './modules/class/MouseData.js';

(function(canvas, context) {
	// LIST OF ALL OBJECTS
	let gameObjectList = [];

	// METHODS

	/**
	 * Get the center position of the canvas
	 *
	 * @returns {Position}
	 */
	function getCanvasCenterPosition() {
		return new Position(canvas.clientWidth / 2, canvas.clientHeight / 2);
	}

	// INPUT LISTENERS

	let mouseData = new MouseData();

	function mouseListener(e) {
		switch (e.type) {
			case 'mousedown':
				mouseData.events[e.button] = true;
				break;
			case 'mouseup':
				for (let i = 0; i < gameObjectList.length; i++) {
					let cur = gameObjectList[i];
					if (cur.hasArea && cur.isVisible) {
						if (mouseData.position.isWithin(cur.getArea())) {
							cur.click(mouseData);
						}
					}
				}
				mouseData.events[e.button] = false;
				break;
			case 'mousemove':
				mouseData.position = new Position(e.clientX, e.clientY);
				break;
		}
	}

	// GAME LOOP AND SETUP

	let tttField;
	let c4Field;

	function gameLoop() {
		// necessary for chrome devtools
		gameObjectList = gameObjectList;
		// UPDATE ALL
		for (let i = 0; i < gameObjectList.length; i++) {
			let cur = gameObjectList[i];
			cur.update(mouseData);
		}

		// CLEAR FRAME
		context.clearRect(0, 0, canvas.width, canvas.height);

		// DRAW ALL
		for (let i = 0; i < gameObjectList.length; i++) {
			let cur = gameObjectList[i];
			cur.draw(context);
		}

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
		tttField = new TicTacToeField(getCanvasCenterPosition(), 100, 10, true);
		c4Field = new ConnectFourField(getCanvasCenterPosition(), 100, 5, true);
		gameObjectList.push(tttField);
		gameObjectList.push(c4Field);

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
			tttField.reset();
			c4Field.reset();
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