import { Colour, Moves } from '../types';
import { Piece } from './piece';

export class King extends Piece {
    hasMoved = false;

    constructor(colour: Colour) {
        super('K', colour);
    }

    get maximumMoves(): Moves {
        const moves: Moves = [
            [[0, 1]],
            [[1, 1]],
            [[1, 0]],
            [[1, -1]],
            [[0, -1]],
            [[-1, -1]],
            [[-1, 0]],
            [[-1, 1]],
            [[0, 2]],
            [[0, -3]],
        ];
        return this.hasMoved
            ? moves.slice(0, -2) // can't castle
            : moves;
    }
}
