import { Colour, Move, PieceLetter } from '../types';

export abstract class Piece {
    letter: PieceLetter;
    colour: Colour;
    #canBeBlocked: boolean;

    constructor(
        letter: PieceLetter,
        colour: Colour,
        canBeBlocked: boolean = true
    ) {
        // FEN has lowercase signifying black
        this.letter =
            colour === 'w' ? letter : (letter.toLowerCase() as PieceLetter);
        this.colour = colour;
        this.#canBeBlocked = canBeBlocked;
    }

    abstract getMaximumMoves(): Move[];

    get canBeBlocked(): boolean {
        return this.#canBeBlocked;
    }
}
