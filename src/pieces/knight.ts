import { Colour, Moves } from '../types';
import { Piece } from './piece';

export class Knight extends Piece {
    maximumMoves: Moves = [
        [[1, 2]],
        [[2, 1]],
        [[2, -1]],
        [[1, -2]],
        [[-1, -2]],
        [[-2, -1]],
        [[-2, 1]],
        [[-1, 2]],
    ];

    constructor(colour: Colour) {
        super('N', colour);
    }
}
