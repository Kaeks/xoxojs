import {GameObject} from '../GameObject.js';
import {Position} from '../Position.js';
import {Area} from '../position/Area.js';

export class Button extends GameObject {
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

	click(mouseData) {
		super.click(mouseData);
		if (mouseData.events[0] !== true) return false;
		this.call();
	}

	update(mouseData) {
		super.update(mouseData);
		this.hover = mouseData.position.isWithin(this.getArea());
	}

	draw(context) {
		super.draw(context);
		let style = this.hover ? this.hoverColor : this.color;
		this.getArea().fill(context, style);
	}
}
