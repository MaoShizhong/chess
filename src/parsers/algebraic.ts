import {
    Coordinate,
    MoveInfo,
    PieceLetter,
    PromotionPieceLetter,
} from '../types';
import { RANK, FILE } from '../board/board';

const CASTLE = { SHORT: 'O-O', LONG: 'O-O-O' };

export function getCoordinate(coordinate: string): Coordinate {
    const [file, rank] = coordinate.split('');
    return [RANK[Number(rank)], FILE[file]];
}

export function toAlgebraic([rank, file]: Coordinate): string {
    const files = 'abcdefgh';
    return `${files[file]}${RANK[rank]}`;
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
