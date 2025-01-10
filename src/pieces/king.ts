import { Colour, Move } from '../types';
import { Piece } from './piece';

export class King extends Piece {
    constructor(colour: Colour) {
        super('K', colour);
    }

    getMaximumMoves({
        canCastleShort = false,
        canCastleLong = false,
    } = {}): Move[] {
        const moves: Move[] = [
            [0, 1],
            [1, 1],
            [1, 0],
            [1, -1],
            [0, -1],
            [-1, -1],
            [-1, 0],
            [-1, 1],
        ];

        if (canCastleShort) moves.push([2, 0]);
        if (canCastleLong) moves.push([-3, 0]);

        return moves;
    }
}
