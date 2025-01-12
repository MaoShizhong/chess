import { Colour, Moves } from '../types';
import { Piece } from './piece';

export class Bishop extends Piece {
    constructor(colour: Colour) {
        super('B', colour);
    }

    get maximumMoves(): Moves {
        // prettier-ignore
        return [
            [ [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7] ], // a1-h8 diagonal as white
            [ [1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7] ], // h1-a8 diagonal as white
            [ [-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7] ], // a8-h1 diagonal as white
            [ [-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7] ], // h8-a1 diagonal as white
        ];
    }
}
