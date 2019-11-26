import {GameObject} from '../../GameObject.js';

export class FieldObject extends GameObject {
	field;
	fieldPosition;

	constructor(field, fieldPosition) {
		super(field.getPositionFromFieldPosition(fieldPosition));
		this.field = field;
		this.fieldPosition = fieldPosition;
	}
}