import { Colour, Moves } from '../types';
import { Piece } from './piece';

export class Knight extends Piece {
    constructor(colour: Colour) {
        super('N', colour);
    }

    get maximumMoves(): Moves {
        return [
            [[1, 2]],
            [[2, 1]],
            [[2, -1]],
            [[1, -2]],
            [[-1, -2]],
            [[-2, -1]],
            [[-2, 1]],
            [[-1, 2]],
        ];
    }
}
