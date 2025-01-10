import { Colour, PlayerCastlingRights } from '../types';

export class Player {
    colour: Colour;
    castlingRights: PlayerCastlingRights;

    constructor(colour: Colour, castlingRights: PlayerCastlingRights) {
        this.colour = colour;
        this.castlingRights = castlingRights;
    }
}
