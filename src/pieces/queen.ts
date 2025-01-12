import { Colour, Moves } from '../types';
import { Piece } from './piece';

export class Queen extends Piece {
    constructor(colour: Colour) {
        super('Q', colour);
    }

    get maximumMoves(): Moves {
        // prettier-ignore
        return [
            // rook moves (orthogonal)
            [ [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0] ], // forwards as white
            [ [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7] ], // right as white
            [ [-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0] ], // backwards as white
            [ [0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7] ], // left as white

            // bishop moves (diagonal)
            [ [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7] ], // a1-h8 diagonal as white
            [ [1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7] ], // h1-a8 diagonal as white
            [ [-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7] ], // a8-h1 diagonal as white
            [ [-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7] ], // h8-a1 diagonal as white
        ];
    }
}
