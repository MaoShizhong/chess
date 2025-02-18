import * as algebraic from './algebraic';
import { Bishop } from '../pieces/bishop';
import { King } from '../pieces/king';
import { Knight } from '../pieces/knight';
import { Pawn } from '../pieces/pawn';
import { Queen } from '../pieces/queen';
import { Rook } from '../pieces/rook';
import { Piece } from '../pieces/piece';
import {
    Board,
    CastlingRights,
    Colour,
    Coordinate,
    FENSegments,
    PieceLetter,
    Row,
} from '../types';

export const PIECES = {
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
    board: Board,
    activePlayer: Colour,
    castlingRights: CastlingRights,
    enPassantTarget: Coordinate | null,
    halfMoves: number,
    fullMoves: number
): string {
    const FENPosition = serialisePosition(board);

    let FENCastling = '';
    if (castlingRights.w.short) FENCastling += 'K';
    if (castlingRights.w.long) FENCastling += 'Q';
    if (castlingRights.b.short) FENCastling += 'k';
    if (castlingRights.b.long) FENCastling += 'q';
    if (!FENCastling) FENCastling = '-';

    const FENSegments = [
        FENPosition,
        activePlayer,
        FENCastling,
        enPassantTarget ? algebraic.toAlgebraic(enPassantTarget) : '-',
        halfMoves,
        fullMoves,
    ];

    return FENSegments.join(' ');
}

export function serialisePosition(board: Board) {
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

export function split(FENString: string): FENSegments {
    const segments = FENString.split(' ');

    // throws if invalid FEN
    validate(FENString, segments);

    const [
        position,
        activePlayer,
        castling,
        enPassantTarget,
        halfMoves,
        fullMoves,
    ] = segments;
    const castlingRights = {
        w: { short: castling.includes('K'), long: castling.includes('Q') },
        b: { short: castling.includes('k'), long: castling.includes('q') },
    };
    const enPassant =
        enPassantTarget === '-'
            ? null
            : algebraic.getCoordinate(enPassantTarget);

    return [
        position,
        activePlayer as Colour,
        castlingRights,
        enPassant,
        Number(halfMoves),
        Number(fullMoves),
    ];
}

function validate(
    FENString: string,
    [
        position,
        activePlayer,
        castling,
        enPassantTargets,
        halfMoves,
        fullMoves,
    ]: string[]
): void {
    const ValidityError = new TypeError(
        `${FENString} is not a valid FEN string.`
    );

    // https://regexr.com/8at8b to test position regex
    const hasPositionSegment =
        /^([rnbqkp1-8]{1,8}\/){7}[rnbqkp1-8]{1,8}$/i.test(position);
    // https://regexr.com/8at9u to test active player regex
    const hasActivePlayer = /^(w|b)$/.test(activePlayer);
    // https://regexr.com/8at90 to test castling regex
    const hasCastlingSegment = /^(-|K?Q?k?q?)$/.test(castling);
    // https://regexr.com/8bavo to test en passant regex
    const hasEnPassantSegment = /^(-|[a-h](3|6))$/.test(enPassantTargets);
    // https://regexr.com/8bb01 to test halfmoves regex
    const hasHalfmoveSegment = /^(\d{1,2}|100)$/.test(halfMoves);
    // https://regexr.com/8bb07 to test fullmoves regex
    const hasFullmoveSegment = /^\d+$/.test(fullMoves);

    if (
        !hasPositionSegment ||
        !hasActivePlayer ||
        !hasCastlingSegment ||
        !hasEnPassantSegment ||
        !hasHalfmoveSegment ||
        !hasFullmoveSegment
    ) {
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
