import {
    Coordinate,
    MoveCoordinates,
    MoveInfo,
    PieceLetter,
    PromotionPieceLetter,
} from '../types';
import { RANK, FILE, Chessboard } from '../board/board';
import { Piece } from '../pieces/piece';

const CASTLE = { SHORT: 'O-O', LONG: 'O-O-O' };

export function getCoordinate(coordinate: string): Coordinate {
    const [file, rank] = coordinate.split('');
    return [RANK[Number(rank)], FILE[file]];
}

export function toAlgebraic([rank, file]: Coordinate): string {
    const files = 'abcdefgh';
    return `${files[file]}${RANK[rank]}`;
}

export function toFullAlgebraicMove(
    { from, to, promoteTo }: MoveCoordinates,
    board: Chessboard
): [boolean, string] {
    const [fromRank, fromFile] = getCoordinate(from);
    const [toRank, toFile] = getCoordinate(to);

    const pieceToMove = board.board[fromRank][fromFile];
    if (!pieceToMove) {
        return [false, ''];
    }

    const pieceLetter = pieceToMove.letter.toUpperCase();
    const isWhite = pieceToMove.letter === pieceLetter;
    let isCapture = board.board[toRank][toFile] instanceof Piece;

    if (pieceLetter === 'P') {
        // check for valid en passant capture since the target square will be empty
        if (!isCapture && board.enPassant) {
            const [enPassantRank, enPassantFile] = board.enPassant;
            isCapture = enPassantRank === toRank && enPassantFile === toFile;
        }

        const promotionRank = isWhite ? RANK[8] : RANK[1];
        let destination = isCapture ? `${from[0]}x${to}` : to;

        if (promoteTo && toRank === promotionRank) {
            destination += `=${promoteTo}`;
        }

        // Without this check, e2->f4 will be converted to f4, but that move is never possible
        // Captures will still convert but will fail in the player move validation
        // But non-capture nonsensical pawn moves should never be converted due to lack of disambiguators
        return fromFile === toFile || isCapture
            ? [true, destination]
            : [false, ''];
    } else if (pieceLetter === 'K' && fromFile - toFile === 2) {
        return [true, 'O-O-O'];
    } else if (pieceLetter === 'K' && fromFile - toFile === -2) {
        return [true, 'O-O'];
    }

    let rankDisambiguator = '';
    let fileDisambiguator = '';
    const isTargetSquare = (coordinate: Coordinate) =>
        toRank === coordinate[0] && toFile === coordinate[1];

    board.board.forEach((row, rank) => {
        row.forEach((square, file) => {
            if (
                square !== pieceToMove &&
                square?.letter === pieceToMove.letter
            ) {
                const needsDisambiguating = board
                    .getValidMoves({
                        rank,
                        file,
                        isCapture,
                    })
                    ?.some(isTargetSquare);

                if (!needsDisambiguating) {
                    return;
                }
                if (fromRank === rank) {
                    fileDisambiguator = from[0];
                }
                if (fromFile === file) {
                    rankDisambiguator = from[1];
                }
            }
        });
    });

    return [
        true,
        `${pieceLetter}${fileDisambiguator}${rankDisambiguator}${isCapture ? 'x' : ''}${to}`,
    ];
}

export function parse(move: string): {
    isCapture: boolean;
    piecesToMove: MoveInfo[];
} {
    const isCapture = move.includes('x');
    const isPawnCapture = isCapture && move[0] === move[0].toLowerCase();

    const moveWithoutX = move.replace('x', '');
    const piecesToMove: MoveInfo[] = [];

    if (move === CASTLE.SHORT || move === CASTLE.LONG) {
        piecesToMove.push(...parseCastling(moveWithoutX));
    } else if (isPawnCapture) {
        const pawnToMove = parseSimple(moveWithoutX.substring(1).split(''));
        pawnToMove.piece.file = FILE[move[0]];
        piecesToMove.push(pawnToMove);
    } else {
        piecesToMove.push(parseSimple(moveWithoutX.split('')));
    }

    return { isCapture, piecesToMove };
}

function parseCastling(move: string): [MoveInfo, MoveInfo] {
    const kingMove: MoveInfo = {
        piece: { letter: 'K' },
        destination: [0, 0],
    };
    const rookMove: MoveInfo = {
        piece: { letter: 'R' },
        destination: [0, 0],
    };

    if (move === CASTLE.SHORT) {
        kingMove.destination[1] = FILE.g;
        rookMove.destination[1] = FILE.f;
        rookMove.piece.file = FILE.h;
    } else {
        kingMove.destination[1] = FILE.c;
        rookMove.destination[1] = FILE.d;
        rookMove.piece.file = FILE.a;
    }

    return [kingMove, rookMove];
}

function parseSimple(notationParts: string[]): MoveInfo {
    const moveInfo: MoveInfo = {
        piece: { letter: 'P' },
        destination: [0, 0],
    };

    if (notationParts.includes('=')) {
        moveInfo.promoteTo = <PromotionPieceLetter>notationParts.at(-1);
        // remove promotion details
        notationParts.splice(-2, 2);
    }

    switch (notationParts.length) {
        case 2: {
            const [toFile, toRank] = notationParts;

            moveInfo.piece.letter = 'P';
            moveInfo.destination[0] = RANK[Number(toRank)];
            moveInfo.destination[1] = FILE[toFile];
            break;
        }
        case 3: {
            const [piece, toFile, toRank] = notationParts;

            moveInfo.piece.letter = piece as PieceLetter;
            moveInfo.destination[0] = RANK[Number(toRank)];
            moveInfo.destination[1] = FILE[toFile];
            break;
        }
        case 4: {
            const [piece, specifier, toFile, toRank] = notationParts;

            moveInfo.piece.letter = piece as PieceLetter;
            if (Number(specifier)) {
                moveInfo.piece.rank = RANK[Number(specifier)];
            } else {
                moveInfo.piece.file = FILE[specifier];
            }
            moveInfo.destination[0] = RANK[Number(toRank)];
            moveInfo.destination[1] = FILE[toFile];
            break;
        }
        case 5: {
            const [piece, fileSpecifier, rankSpecifier, toFile, toRank] =
                notationParts;

            moveInfo.piece.letter = piece as PieceLetter;
            moveInfo.piece.rank = RANK[Number(rankSpecifier)];
            moveInfo.piece.file = FILE[fileSpecifier];
            moveInfo.destination[0] = RANK[Number(toRank)];
            moveInfo.destination[1] = FILE[toFile];
            break;
        }
    }
    return moveInfo;
}
