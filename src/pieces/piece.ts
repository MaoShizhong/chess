import { Colour, Moves, PieceLetter } from '../types';

/**
 * Abstract class instead of interface
 * `instanceof Piece` required in Board valid move checks
 */
export abstract class Piece {
    letter: PieceLetter;
    colour: Colour;

    constructor(letter: PieceLetter, colour: Colour) {
        // FEN has lowercase signifying black
        this.letter =
            colour === 'w' ? letter : <PieceLetter>letter.toLowerCase();
        this.colour = colour;
    }

    abstract get maximumMoves(): Moves;
}
