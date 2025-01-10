import { describe, it, expect } from 'vitest';
import { Chessboard } from './index';
import { Colour, Square } from './types';

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
        const pieceCounts: {
            w: { [key: string]: number };
            b: { [key: string]: number };
        } = {
            w: { P: 8, N: 2, B: 2, R: 2, Q: 1, K: 1 },
            b: { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1 },
        };

        const board = new Chessboard().board;
        board.forEach((row) => {
            row.forEach((square: Square) => {
                if (square === null) return;
                pieceCounts[square.colour][square.letter]--;
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
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
        ];
        const actualBoard = new Chessboard().board.map((row) =>
            row.map((square: Square) => square && square.letter)
        );

        expect(actualBoard).toEqual(startingBoard);
    });

    it.skip('Can flip board orientation', () => {
        const board = new Chessboard().board;
        expect(board[7][3]?.letter).toBe('Q');
        expect(board[0][3]?.letter).toBe('q');
        expect(board[7][4]?.letter).toBe('K');
        expect(board[0][4]?.letter).toBe('k');

        board.flip();
        expect(board[7][3]?.letter).toBe('k');
        expect(board[0][3]?.letter).toBe('K');
        expect(board[7][4]?.letter).toBe('q');
        expect(board[0][4]?.letter).toBe('Q');

        board.flip();
        expect(board[7][3]?.letter).toBe('Q');
        expect(board[0][3]?.letter).toBe('q');
        expect(board[7][4]?.letter).toBe('K');
        expect(board[0][4]?.letter).toBe('k');
    });
});
