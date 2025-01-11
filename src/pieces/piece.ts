import { Colour, PieceLetter } from '../types';

export class Piece {
    letter: PieceLetter;
    colour: Colour;

    constructor(letter: PieceLetter, colour: Colour) {
        // FEN has lowercase signifying black
        this.letter =
            colour === 'w' ? letter : (letter.toLowerCase() as PieceLetter);
        this.colour = colour;
    }
}
