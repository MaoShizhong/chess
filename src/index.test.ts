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

    it('Starts with standard piece count', () => {
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

    it('Starts with standard piece placement if no FEN passed in', () => {
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

    it('Constructs board from FEN', () => {
        const najdorf = [
            ['r', 'n', 'b', 'q', 'k', 'b', null, 'r'],
            [null, 'p', null, null, 'p', 'p', 'p', 'p'],
            ['p', null, null, 'p', null, 'n', null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, 'N', 'P', null, null, null],
            [null, null, 'N', null, null, null, null, null],
            ['P', 'P', 'P', null, null, 'P', 'P', 'P'],
            ['R', null, 'B', 'Q', 'K', 'B', null, 'R'],
        ];
        const actualBoard1 = new Chessboard(
            'rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6'
        ).board.map((row) =>
            row.map((square: Square) => square && square.letter)
        );
        expect(actualBoard1).toEqual(najdorf);

        const berlinDraw = [
            ['r', null, 'b', null, 'k', 'b', null, 'r'],
            ['p', 'p', 'p', null, null, 'p', 'p', 'p'],
            [null, null, null, 'q', null, null, null, null],
            [null, null, null, null, null, null, null, null],
            ['P', null, null, 'Q', null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, 'P', 'P', null, null, 'P', 'P', 'P'],
            ['R', 'N', 'B', null, null, 'R', 'K', null],
        ];
        const actualBoard2 = new Chessboard(
            'r1b1kb1r/ppp2ppp/3q4/8/P2Q4/8/1PP2PPP/RNB2RK1 w kq - 0 11'
        ).board.map((row) =>
            row.map((square: Square) => square && square.letter)
        );
        expect(actualBoard2).toEqual(berlinDraw);
    });

    it('Can flip board orientation', () => {
        const chessboard = new Chessboard();
        expect(chessboard.board[7][3]?.letter).toBe('Q');
        expect(chessboard.board[0][3]?.letter).toBe('q');
        expect(chessboard.board[7][4]?.letter).toBe('K');
        expect(chessboard.board[0][4]?.letter).toBe('k');

        chessboard.flip();
        expect(chessboard.board[7][3]?.letter).toBe('k');
        expect(chessboard.board[0][3]?.letter).toBe('K');
        expect(chessboard.board[7][4]?.letter).toBe('q');
        expect(chessboard.board[0][4]?.letter).toBe('Q');

        chessboard.flip();
        expect(chessboard.board[7][3]?.letter).toBe('Q');
        expect(chessboard.board[0][3]?.letter).toBe('q');
        expect(chessboard.board[7][4]?.letter).toBe('K');
        expect(chessboard.board[0][4]?.letter).toBe('k');
    });
});
