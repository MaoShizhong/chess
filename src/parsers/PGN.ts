import { History, HistoryEntry } from '../types';
import * as FEN from './FEN';

export function serialise(history: History): string {
    const [{ FEN: startingFEN }, ...moves] = history;
    const isStandardStart =
        startingFEN ===
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    let PGN = isStandardStart ? '' : `[SetUp "1"]\n[FEN "${startingFEN}"]\n\n`;

    moves.forEach((move, i) => {
        const [_, nextPlayer] = FEN.split(move.FEN);
        if (nextPlayer === 'b') {
            const moveNumber = i / 2 + 1;
            PGN += `${moveNumber}. `;
        }

        PGN += `${move.move} `;

        if (move.result) {
            PGN += move.result;
        }
    });

    return PGN.trim();
}
