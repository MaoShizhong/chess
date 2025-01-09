import { describe, it, expect } from 'vitest';
import { Chessboard } from './index';
import { Colour, Square } from './types';
import { start } from 'repl';

describe('Chessboard instance', () => {
    it('Instantiates', () => {
        expect(typeof new Chessboard()).toBe('object');
    });
});

describe('Board', () => {
    it('Is 8x8', () => {
        const chessboard = new Chessboard();
        expect(chessboard.board.length).toBe(8);
        expect(chessboard.board.every((row) => row.length === 8)).toBe(true);
    });

    it.skip('Starts with standard piece count', () => {
        const piecesPerPlayer = { p: 8, N: 2, B: 2, R: 2, Q: 1, K: 1 };
        const pieceCounts = {
            w: piecesPerPlayer,
            b: piecesPerPlayer,
        };

        const board = new Chessboard().board;
        board.forEach((row) => {
            row.forEach((square: Square) => {
                if (square === null) return;
                const piece = square;
                pieceCounts[piece.colour][piece.letter]--;
            });
        });

        function checkPieceCount(colour: Colour) {
            return Object.values(pieceCounts[colour]).every(
                (count) => count === 0
            );
        }
        expect(checkPieceCount('w')).toBe(true);
        expect(checkPieceCount('b')).toBe(true);
    });

    it.skip('Starts with standard piece placement', () => {
        const startingBoard = [
            ['R-b', 'N-b', 'B-b', 'Q-b', 'K-b', 'B-b', 'N-b', 'R-b'],
            ['P-b', 'P-b', 'P-b', 'P-b', 'P-b', 'P-b', 'P-b', 'P-b'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            ['P-w', 'P-w', 'P-w', 'P-w', 'P-w', 'P-w', 'P-w', 'P-w'],
            ['R-w', 'N-w', 'B-w', 'Q-w', 'K-w', 'B-w', 'N-w', 'R-w'],
        ];
        const actualBoard = new Chessboard().board.map((row) =>
            row.map(
                (square: Square) =>
                    square && `${square.letter}-${square.colour}`
            )
        );

        expect(actualBoard).toEqual(startingBoard);
    });

    it.skip('Can flip board orientation', () => {
        const board = new Chessboard().board;
        const whiteKing = board[7][4];
        const blackLightBishop = board[0][2];

        board.flip();
        expect(whiteKing).toBe(board[0][3]);
        expect(blackLightBishop).toBe(board[7][5]);
    });
});
