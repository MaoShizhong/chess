import { Colour, Moves } from '../types';
import { Piece } from './piece';

export class Rook extends Piece {
    constructor(colour: Colour) {
        super('R', colour);
    }

    get maximumMoves(): Moves {
        // prettier-ignore
        return [
            [ [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0] ], // forwards as white
            [ [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7] ], // right as white
            [ [-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0] ], // backwards as white
            [ [0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7] ], // left as white
        ];
    }
}
