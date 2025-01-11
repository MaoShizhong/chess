import { MoveInfo, PieceLetter } from '../types';
import { RANK, FILE } from '../board/board';

const CASTLE = { SHORT: 'O-O', LONG: 'O-O-O' };

export function parse(move: string): MoveInfo[] {
    const moves: MoveInfo[] = [];

    if (move === CASTLE.SHORT || move === CASTLE.LONG) {
        moves.push(...parseCastling(move));
    } else {
        moves.push(parseSimple(move.split('')));
    }

    return moves;
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
