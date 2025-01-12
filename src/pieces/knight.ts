import { Colour, Move } from '../types';
import { Piece } from './piece';

export class Knight extends Piece {
    constructor(colour: Colour) {
        super('N', colour, false);
    }

    getMaximumMoves(): Move[] {
        return [
            [1, 2],
            [2, 1],
            [2, -1],
            [1, -2],
            [-1, -2],
            [-2, -1],
            [-2, 1],
            [-1, 2],
        ];
    }
}
