import { describe, it, expect } from 'vitest';
import { Chessboard, FILE, RANK } from './board';
import { Colour, Square } from '../types';
import { King } from '../pieces/king';
import { Rook } from '../pieces/rook';

const STARTING_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

describe('Board', () => {
    it('Is 8x8', () => {
        const chessboard = new Chessboard(STARTING_POSITION);
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

        const board = new Chessboard(STARTING_POSITION).board;
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
        const actualBoard = new Chessboard(STARTING_POSITION).board.map((row) =>
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
            'rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R'
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
            'r1b1kb1r/ppp2ppp/3q4/8/P2Q4/8/1PP2PPP/RNB2RK1'
        ).board.map((row) =>
            row.map((square: Square) => square && square.letter)
        );
        expect(actualBoard2).toEqual(berlinDraw);
    });

    it('Can flip board orientation', () => {
        const chessboard = new Chessboard(STARTING_POSITION);
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

describe('Valid moves', () => {
    describe('Non-castling', () => {
        it('Returns null if no piece on target square', () => {
            const chessboard = new Chessboard(STARTING_POSITION);
            expect(chessboard.getValidMoves(RANK[4], FILE.b)).toBe(null);
            expect(chessboard.getValidMoves(RANK[6], FILE.c)).toBe(null);
        });

        it('Reports valid moves for piece if not blocked by anything', () => {
            const chessboard = new Chessboard('k7/8/8/8/4N3/8/P7/K7');

            const pawnMoves = chessboard.getValidMoves(RANK[2], FILE.a);
            expect(pawnMoves).toEqual([
                [RANK[3], FILE.a],
                [RANK[4], FILE.a],
            ]);

            const knightMoves = chessboard.getValidMoves(RANK[4], FILE.e);
            expect(knightMoves).toEqual([
                [RANK[5], FILE.c],
                [RANK[6], FILE.d],
                [RANK[6], FILE.f],
                [RANK[5], FILE.g],
                [RANK[3], FILE.g],
                [RANK[2], FILE.f],
                [RANK[2], FILE.d],
                [RANK[3], FILE.c],
            ]);
        });

        it('Filters out squares off the board', () => {
            const chessboard = new Chessboard(STARTING_POSITION);

            const e1KingMoves = chessboard.getValidMoves(RANK[1], FILE.e);
            [
                [8, FILE.d],
                [8, FILE.e],
                [8, FILE.f],
            ].forEach((square) => {
                expect(e1KingMoves).not.toContainEqual(square);
            });

            const g1KnightMoves = chessboard.getValidMoves(RANK[1], FILE.e);
            [
                [9, FILE.f], // f-1
                [9, FILE.h], // h-1
                [8, FILE.e], // e0
                [8, 8], // i0
                [RANK[2], 8], // i2
            ].forEach((square) => {
                expect(g1KnightMoves).not.toContainEqual(square);
            });
        });

        it('Filters out squares occupied by piece of same colour', () => {
            const chessboard = new Chessboard(
                '2b1k3/1p1p4/8/8/8/4P3/3P3P/4K1NR'
            );

            const c8BishopMoves = chessboard.getValidMoves(RANK[8], FILE.c);
            [
                [RANK[7], FILE.b],
                [RANK[7], FILE.d],
            ].forEach((square) => {
                expect(c8BishopMoves).not.toContainEqual(square);
            });

            const h1RookMoves = chessboard.getValidMoves(RANK[1], FILE.h);
            [
                [RANK[1], FILE.g],
                [RANK[2], FILE.h],
            ].forEach((square) => {
                expect(h1RookMoves).not.toContainEqual(square);
            });

            const d2PawnMoves = chessboard.getValidMoves(RANK[2], FILE.d);
            expect(d2PawnMoves).not.toContainEqual([RANK[3], FILE.e]);
        });

        it('Does not filter out squares occupied by piece of opposite colour (capture available)', () => {
            const chessboard = new Chessboard(
                'rnbqkbnr/1ppp1ppR/p7/6N1/8/4p3/PPPPPP2/RNBQKB2'
            );

            const rookMoves = chessboard.getValidMoves(RANK[7], FILE.h);
            [
                [RANK[7], FILE.g], // black g7 pawn
                [RANK[8], FILE.h], // black h8 rook
            ].forEach((square) => {
                expect(rookMoves).toContainEqual(square);
            });

            const d2PawnMoves = chessboard.getValidMoves(RANK[2], FILE.d);
            expect(d2PawnMoves).toContainEqual([RANK[3], FILE.e]);
        });
    });

    describe('Castling', () => {
        it('Includes any available castling move if allowed', () => {
            // short castling only
            const chessboard = new Chessboard(
                'r1bqkbnr/pp2pppp/2np4/1Bp5/4P3/5N2/PPPP1PPP/RNBQK2R'
            );

            const kingMoves1 = chessboard.getValidMoves(RANK[1], FILE.e);
            expect(kingMoves1).toContainEqual([RANK[1], FILE.g]);

            // long castling only
            const chessboard2 = new Chessboard(
                'r1bqk2r/ppp2ppp/2np1n2/2b1p3/4P3/2NP4/PPPBQPPP/R3KBNR'
            );

            const kingMoves2 = chessboard2.getValidMoves(RANK[1], FILE.e);
            expect(kingMoves2).toContainEqual([RANK[1], FILE.c]);

            const chessboard3 = new Chessboard(
                'r3k2r/pppq1ppp/2np1n2/2b1p3/2B1P1b1/2NP1N1P/PPPB1PP1/R2Q1RK1'
            );

            // castling both ways
            const kingMoves3 = chessboard3.getValidMoves(RANK[8], FILE.e);
            [
                [RANK[8], FILE.c],
                [RANK[8], FILE.g],
            ].forEach((square) => {
                expect(kingMoves3).toContainEqual(square);
            });
        });

        it('Filters out castling if movement blocked', () => {
            const chessboard = new Chessboard(
                'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R'
            );

            const kingMoves = chessboard.getValidMoves(RANK[1], FILE.e);
            expect(kingMoves).not.toContainEqual([RANK[1], FILE.g]);
        });

        it('Filters out castling if king has already moved', () => {
            const chessboard = new Chessboard(
                'r1bqkb1r/pppp1pp1/2n2n1p/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R'
            );
            const king = chessboard.board[RANK[1]][FILE.e] as King;
            king.hasMoved = true;

            const kingMoves = chessboard.getValidMoves(RANK[1], FILE.e);
            expect(kingMoves).not.toContainEqual([RANK[1], FILE.g]);
        });

        it('Filters out castling if paired rook has already moved', () => {
            // Rook moved but back in right square
            const chessboard = new Chessboard(
                'rnbqk2r/pp2ppbp/5np1/2pp4/8/5NP1/PPPPPPBP/RNBQK2R'
            );
            const rook = chessboard.board[RANK[1]][FILE.h] as Rook;
            rook.hasMoved = true;

            const kingMoves = chessboard.getValidMoves(RANK[1], FILE.e);
            expect(kingMoves).not.toContainEqual([RANK[1], FILE.g]);

            // Rook not in right square
            const chessboard2 = new Chessboard(
                'r2qkb1r/1pp1ppp1/p1n2n1p/3p4/3P1Bb1/P1NQ4/RPP1PPPP/4KBNR'
            );

            const kingMoves2 = chessboard2.getValidMoves(RANK[1], FILE.e);
            expect(kingMoves2).not.toContainEqual([RANK[1], FILE.c]);
        });

        it.skip('Filters out castling if king is in or will pass through check', () => {
            // is in check
            const chessboard = new Chessboard(
                'r3kbnr/1pp1ppp1/p1B4p/q7/3P2Q1/2N5/PPP2PPP/R1B1K1NR'
            );

            const blackKingMoves = chessboard.getValidMoves(RANK[8], FILE.e);
            expect(blackKingMoves).not.toContainEqual([RANK[8], FILE.c]);

            // passing through check
            const chessboard2 = new Chessboard(
                'r3kbnr/ppp1pppp/2n5/q7/3P2Q1/2N5/PPP2PPP/R1B1KBNR'
            );

            const blackKingMoves2 = chessboard2.getValidMoves(RANK[8], FILE.e);
            expect(blackKingMoves2).not.toContainEqual([RANK[8], FILE.c]);
        });
    });
});
