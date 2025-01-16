import { Bishop } from '../pieces/bishop';
import { King } from '../pieces/king';
import { Knight } from '../pieces/knight';
import { Pawn } from '../pieces/pawn';
import { Queen } from '../pieces/queen';
import { Rook } from '../pieces/rook';
import { CastlingRights, Colour, PieceLetter, Row } from '../types';
import { Piece } from '../pieces/piece';

const PIECES = {
    P: Pawn,
    p: Pawn,
    R: Rook,
    r: Rook,
    N: Knight,
    n: Knight,
    B: Bishop,
    b: Bishop,
    Q: Queen,
    q: Queen,
    K: King,
    k: King,
};

export function toChessRow(FENRow: string): Row {
    const chars = FENRow.split('');
    const row = chars.map((char) => {
        const colour = isWhite(char) ? 'w' : 'b';
        return Number(char)
            ? Array(Number(char)).fill(null)
            : new PIECES[char as PieceLetter](colour);
    });
    return row.flat();
}

export function serialise(
    board: Row[],
    activePlayer: Colour,
    castlingRights: CastlingRights
): string {
    const FENPosition = serialisePosition(board);
    let FENCastling = '';
    if (castlingRights.w.short) FENCastling += 'K';
    if (castlingRights.w.long) FENCastling += 'Q';
    if (castlingRights.b.short) FENCastling += 'k';
    if (castlingRights.b.long) FENCastling += 'q';
    if (!FENCastling) FENCastling = '-';

    const FENSegments = [FENPosition, activePlayer, FENCastling];

    // TODO: Handle EP and moves segments later
    return `${FENSegments.join(' ')} - 0 1`;
}

export function serialisePosition(board: Row[]) {
    return board
        .map((row) => {
            let FENRow = '';
            let emptyCounter = 0;
            for (const square of row) {
                if (square instanceof Piece) {
                    FENRow += emptyCounter;
                    emptyCounter = 0;
                    FENRow += square.letter;
                } else {
                    emptyCounter++;
                }
            }
            FENRow += emptyCounter;
            return FENRow.replaceAll('0', '');
        })
        .join('/');
}

export function split(FENString: string): [string, Colour, CastlingRights] {
    const segments = FENString.split(' ');

    // throws if invalid FEN
    validate(FENString, segments);

    const [position, activePlayer, castling] = segments;
    const castlingRights = {
        w: { short: castling.includes('K'), long: castling.includes('Q') },
        b: { short: castling.includes('k'), long: castling.includes('q') },
    };

    return [position, activePlayer as Colour, castlingRights];
}

function validate(
    FENString: string,
    [position, activePlayer, castling]: string[]
): void {
    const ValidityError = new TypeError(
        `${FENString} is not a valid FEN string.`
    );

    // https://regexr.com/8at8b to test position regex
    const isPositionSegment = /^([rnbqkp1-8]{1,8}\/){7}[rnbqkp1-8]{1,8}$/i.test(
        position
    );
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

function isWhite(char: string): boolean {
    return char === char.toUpperCase();
}
