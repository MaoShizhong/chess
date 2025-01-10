import { CastlingRights, Colour } from '../types';

export class FEN {
    static split(FENString: string): [string, Colour, CastlingRights] {
        const [position, activePlayer, castling] = FENString.split(' ');
        const castlingRights = {
            w: { short: false, long: false },
            b: { short: false, long: false },
        };

        if (castling.includes('K')) castlingRights.w.short = true;
        if (castling.includes('Q')) castlingRights.w.long = true;
        if (castling.includes('k')) castlingRights.b.short = true;
        if (castling.includes('q')) castlingRights.b.long = true;

        return [position, activePlayer as Colour, castlingRights];
    }
}
