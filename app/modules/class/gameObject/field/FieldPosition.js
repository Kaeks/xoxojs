import {Position} from '../../Position.js';

export class FieldPosition extends Position {
	constructor(x, y) {
		if (x !== Math.floor(x) || y !== Math.floor(y) || x < 0 || y < 0) {
			throw 'wrong';
		}
		super(x, y);
	}
}
