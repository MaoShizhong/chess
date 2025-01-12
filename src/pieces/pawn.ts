import { Colour, Moves } from '../types';
import { Piece } from './piece';

export class Pawn extends Piece {
    hasMoved = false;

    constructor(colour: Colour) {
        super('P', colour);
    }

    get maximumMoves(): Moves {
        // Captures are in separate directions - no blocking pieces interfering with others
        const maxMoves: Moves = [
            [
                [1, 0],
                [2, 0],
            ],
            [[1, -1]],
            [[1, 1]],
        ];

        // Double forward move only possible on first move
        if (this.hasMoved) {
            maxMoves[0].splice(-1, 1);
        }

        return this.colour === 'w'
            ? maxMoves
            : this.#invertMovesDirection(maxMoves);
    }

    #invertMovesDirection(moves: Moves): Moves {
        return moves.map((direction) =>
            direction.map(([horizontal, vertical]) => [
                horizontal * -1,
                vertical * -1,
            ])
        );
    }
}
