import { CastlingRights, Colour } from '../types';

export class FEN {
    static split(FENString: string): [string, Colour, CastlingRights] {
        const segments = FENString.split(' ');

        // throws if invalid FEN
        FEN.#validate(FENString, segments);

        const [position, activePlayer, castling] = segments;
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

    static #validate(
        FENString: string,
        [position, activePlayer, castling]: string[]
    ): void {
        const ValidityError = new TypeError(
            `${FENString} is not a valid FEN string.`
        );

        // https://regexr.com/8at8b to test position regex
        const isPositionSegment =
            /^([rnbqkp1-8]{1,8}\/){7}[rnbqkp1-8]{1,8}$/i.test(position);
        // https://regexr.com/8at9u to test active player regex
        const isActivePlayer = /^(w|b)$/.test(activePlayer);
        // https://regexr.com/8at90 to test castling regex
        const isCastlingSegment = /^(-|K?Q?k?q?)$/.test(castling);

        if (!isPositionSegment || !isActivePlayer || !isCastlingSegment) {
            throw ValidityError;
        }

        // Checking if every row accounts for 8 squares exactly
        const rows = position.split('/');
        for (const row of rows) {
            const squares = row
                .split('')
                .map((char) =>
                    // convert single number to actual spaces
                    Number(char) ? Array(Number(char)).fill('') : char
                )
                .flat();

            if (squares.length !== 8) {
                throw ValidityError;
            }
        }
    }
}
