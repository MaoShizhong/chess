import { History } from '../types';
import * as FEN from './FEN';

export function serialise(history: History): string {
    const [{ FEN: startingFEN }, ...moves] = history;
    const isStandardStart =
        startingFEN ===
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    let PGN = isStandardStart ? '' : `[SetUp "1"]\n[FEN "${startingFEN}"]\n\n`;

    const startingFullMoves = Number(startingFEN.split(' ').at(-1)) - 1;

    moves.forEach((move, i) => {
        const [_, nextPlayer] = FEN.split(move.FEN);

        if (i === 0 && nextPlayer === 'w') {
            PGN += `${startingFullMoves + 1}... `;
        } else if (nextPlayer === 'b') {
            // Without Math.ceil, if first move is by black then the next move is numbered with .5
            const moveNumber = Math.ceil(i / 2 + 1 + startingFullMoves);
            PGN += `${moveNumber}. `;
        }

        PGN += `${move.move} `;

        if (move.result) {
            PGN += move.result;
        }
    });

    return PGN.trim();
}

export function getStartingFEN(PGN: string): string {
    // https://regexr.com/8c9ig to test this regex
    const providedStartingFEN = PGN.match(/(?<=\[FEN ").+(?="\])/)?.[0];
    return (
        providedStartingFEN ??
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    );
}

export function getMoves(PGN: string): string[] {
    // https://regexr.com/8c9j5 to test this regex
    const movesString = PGN.match(/\d+\.+ .+/)?.[0] ?? '';
    return movesString
        .split(' ')
        .filter((move) => !/\.|1-0|0-1|1\/2-1\/2/.test(move))
        .map((move) =>
            move.endsWith('#') || move.endsWith('+') ? move.slice(0, -1) : move
        );
}
