import { Colour, Move } from '../types';
import { Piece } from './piece';

export class Rook extends Piece {
    constructor(colour: Colour) {
        super('R', colour);
    }

    getMaximumMoves(): Move[] {
        // prettier-ignore
        return [
            [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], // forwards as white
            [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], // right as white
            [0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7], // left as white
            [-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0], // backwards as white
        ];
    }
}
