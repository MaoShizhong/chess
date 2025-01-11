import { MoveInfo, PieceLetter } from '../types';
import { RANK, FILE } from '../board/board';

export function parse(move: string): MoveInfo {
    const moveInfo: MoveInfo = {
        piece: { letter: 'P' },
        destination: [0, 0],
    };

    const notationParts = move.split('');
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
