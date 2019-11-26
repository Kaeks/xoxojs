import {Chip} from '../Chip.js';
import {SYMBOL_TYPE} from '../../../../../../../../enum/SymbolTypeEnum.js';

export class RedChip extends Chip {
	constructor(cell, cellPosition, size) {
		super(cell, cellPosition, size, SYMBOL_TYPE.RED, '#d44', '#644', '#755');
	}
}
