import {Button} from '../Button.js';

export class TextButton extends Button {
	text;
	textColor;

	constructor(position, width, height, text, color, hoverColor, textColor) {
		super(position, width, height, color, hoverColor);
		this.text = text !== undefined ? text : 'Button';
		this.textColor = textColor !== undefined ? textColor : '#000';
	}

	update(mouseData) {
		super.update(mouseData);
	}

	draw(context) {
		super.draw(context);
		context.font = '30px Arial';
		context.textAlign = 'center';
		context.fillStyle = this.textColor;
		context.fillText(this.text, this.position.x, this.position.y + 10);
	}
}
