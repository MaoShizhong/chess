import { Colour, Move } from '../types';
import { Piece } from './piece';

export class Pawn extends Piece {
    hasMoved: Boolean;

    constructor(colour: Colour) {
        super('P', colour);
        this.hasMoved = false;
    }

    getMaximumMoves({ canCaptureLeft = false, canCaptureRight = false } = {}): Move[] {
        const moves: Move[] = [[0, 1]];

        if (!this.hasMoved) moves.push([0, 2]);
        if (canCaptureLeft) moves.push([-1, 1]);
        if (canCaptureRight) moves.push([1, 1]);

        return this.colour === 'w' ? moves : this.#invertMovesDirection(moves);
    }

    #invertMovesDirection(moves: Move[]): Move[] {
        return moves.map(([horizontal, vertical]) => [
            horizontal * -1,
            vertical * -1,
        ]);
    }
}
