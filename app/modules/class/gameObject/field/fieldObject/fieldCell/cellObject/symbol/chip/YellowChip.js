import {Chip} from '../Chip.js';
import {SYMBOL_TYPE} from '../../../../../../../../enum/SymbolTypeEnum.js';

export class YellowChip extends Chip {
	constructor(cell, cellPosition, size) {
		super(cell, cellPosition, size, SYMBOL_TYPE.YELLOW, '#dd4', '#664', '#775');
	}
}