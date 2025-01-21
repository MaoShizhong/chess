import { describe, it, expect } from 'vitest';
import { Chessboard, FILE, RANK } from './board';
import { Colour, Square } from '../types';
import { King } from '../pieces/king';
import { Rook } from '../pieces/rook';
import { Pawn } from '../pieces/pawn';

// https://lichess.org/analysis/standard/rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR
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
        // https://lichess.org/analysis/fromPosition/rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R
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
        // https://lichess.org/analysis/fromPosition/r1b1kb1r/ppp2ppp/3q4/8/P2Q4/8/1PP2PPP/RNB2RK1
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

describe('Checks', () => {
    it('Reports if a square can be seen by black (playing as white)', () => {
        // https://lichess.org/analysis/fromPosition/rnb1kbnr/pppp1ppp/8/4P3/5p1q/1PN5/P1PP2PP/R1BQKBNR
        const chessboard = new Chessboard(
            'rnb1kbnr/pppp1ppp/8/4P3/5p1q/1PN5/P1PP2PP/R1BQKBNR'
        );

        // active player colour passed in (white)
        expect(chessboard.isSquareInCheck('w', RANK[4], FILE.a)).toBe(false);
        expect(chessboard.isSquareInCheck('w', RANK[1], FILE.e)).toBe(true);
        expect(chessboard.isSquareInCheck('w', RANK[3], FILE.g)).toBe(true);
    });

    it('Reports if a square can be seen by white (playing as black)', () => {
        // https://lichess.org/analysis/fromPosition/r1bqk1nr/pppp2pp/2n5/2b1pp1Q/2B1P3/2N5/PPPP1PPP/R1B1K1NR
        const chessboard = new Chessboard(
            'r1bqk1nr/pppp2pp/2n5/2b1pp1Q/2B1P3/2N5/PPPP1PPP/R1B1K1NR'
        );

        expect(chessboard.isSquareInCheck('b', RANK[8], FILE.f)).toBe(false);
        expect(chessboard.isSquareInCheck('b', RANK[8], FILE.e)).toBe(true);
        expect(chessboard.isSquareInCheck('b', RANK[7], FILE.f)).toBe(true);
    });
});

describe('Valid moves', () => {
    describe('Non-castling', () => {
        it('Returns null if no piece on target square', () => {
            const chessboard = new Chessboard(STARTING_POSITION);
            expect(
                chessboard.getValidMoves({ rank: RANK[4], file: FILE.b })
            ).toBe(null);
            expect(
                chessboard.getValidMoves({ rank: RANK[6], file: FILE.c })
            ).toBe(null);
        });

        it('Reports valid moves for piece if not blocked by anything', () => {
            // https://lichess.org/analysis/fromPosition/k7/8/8/8/4N3/8/P7/K7
            const chessboard = new Chessboard('k7/8/8/8/4N3/8/P7/K7');

            const pawnMoves = chessboard.getValidMoves({
                rank: RANK[2],
                file: FILE.a,
            });
            expect(pawnMoves).toEqual([
                [RANK[3], FILE.a],
                [RANK[4], FILE.a],
            ]);

            const knightMoves = chessboard.getValidMoves({
                rank: RANK[4],
                file: FILE.e,
            });
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

            const e1KingMoves = chessboard.getValidMoves({
                rank: RANK[1],
                file: FILE.e,
            });
            [
                [8, FILE.d],
                [8, FILE.e],
                [8, FILE.f],
            ].forEach((square) => {
                expect(e1KingMoves).not.toContainEqual(square);
            });

            const g1KnightMoves = chessboard.getValidMoves({
                rank: RANK[1],
                file: FILE.e,
            });
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
            // https://lichess.org/analysis/fromPosition/2b1k3/1p1p4/8/8/8/4P3/3P3P/4K1NR
            const chessboard = new Chessboard(
                '2b1k3/1p1p4/8/8/8/4P3/3P3P/4K1NR'
            );

            const c8BishopMoves = chessboard.getValidMoves({
                rank: RANK[8],
                file: FILE.c,
            });
            [
                [RANK[7], FILE.b],
                [RANK[7], FILE.d],
            ].forEach((square) => {
                expect(c8BishopMoves).not.toContainEqual(square);
            });

            const h1RookMoves = chessboard.getValidMoves({
                rank: RANK[1],
                file: FILE.h,
            });
            [
                [RANK[1], FILE.g],
                [RANK[2], FILE.h],
            ].forEach((square) => {
                expect(h1RookMoves).not.toContainEqual(square);
            });

            const d2PawnMoves = chessboard.getValidMoves({
                rank: RANK[2],
                file: FILE.d,
            });
            expect(d2PawnMoves).not.toContainEqual([RANK[3], FILE.e]);
        });

        it('Does not filter out squares occupied by piece of opposite colour (capture available)', () => {
            // https://lichess.org/analysis/fromPosition/rnbqkbnr/1ppp1ppR/p7/6N1/8/4p3/PPPPPP2/RNBQKB2
            const chessboard = new Chessboard(
                'rnbqkbnr/1ppp1ppR/p7/6N1/8/4p3/PPPPPP2/RNBQKB2'
            );

            const rookMoves = chessboard.getValidMoves({
                rank: RANK[7],
                file: FILE.h,
            });
            [
                [RANK[7], FILE.g], // black g7 pawn
                [RANK[8], FILE.h], // black h8 rook
            ].forEach((square) => {
                expect(rookMoves).toContainEqual(square);
            });

            const d2PawnMoves = chessboard.getValidMoves({
                rank: RANK[2],
                file: FILE.d,
            });
            expect(d2PawnMoves).toContainEqual([RANK[3], FILE.e]);
        });
    });

    describe('Castling', () => {
        it('Includes any available castling move if allowed', () => {
            // short castling only
            // https://lichess.org/analysis/fromPosition/r1bqkbnr/pp2pppp/2np4/1Bp5/4P3/5N2/PPPP1PPP/RNBQK2R
            const chessboard = new Chessboard(
                'r1bqkbnr/pp2pppp/2np4/1Bp5/4P3/5N2/PPPP1PPP/RNBQK2R'
            );

            const kingMoves1 = chessboard.getValidMoves({
                rank: RANK[1],
                file: FILE.e,
            });
            expect(kingMoves1).toContainEqual([RANK[1], FILE.g]);

            // long castling only
            // https://lichess.org/analysis/fromPosition/r1bqk2r/ppp2ppp/2np1n2/2b1p3/4P3/2NP4/PPPBQPPP/R3KBNR
            const chessboard2 = new Chessboard(
                'r1bqk2r/ppp2ppp/2np1n2/2b1p3/4P3/2NP4/PPPBQPPP/R3KBNR'
            );

            const kingMoves2 = chessboard2.getValidMoves({
                rank: RANK[1],
                file: FILE.e,
            });
            expect(kingMoves2).toContainEqual([RANK[1], FILE.c]);

            // https://lichess.org/analysis/fromPosition/r3k2r/pppq1ppp/2np1n2/2b1p3/2B1P1b1/2NP1N1P/PPPB1PP1/R2Q1RK1
            const chessboard3 = new Chessboard(
                'r3k2r/pppq1ppp/2np1n2/2b1p3/2B1P1b1/2NP1N1P/PPPB1PP1/R2Q1RK1'
            );

            // castling both ways
            const kingMoves3 = chessboard3.getValidMoves({
                rank: RANK[8],
                file: FILE.e,
            });
            [
                [RANK[8], FILE.c],
                [RANK[8], FILE.g],
            ].forEach((square) => {
                expect(kingMoves3).toContainEqual(square);
            });
        });

        it('Filters out castling if movement blocked', () => {
            // https://lichess.org/analysis/fromPosition/r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R
            const chessboard = new Chessboard(
                'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R'
            );

            const kingMoves = chessboard.getValidMoves({
                rank: RANK[1],
                file: FILE.e,
            });
            expect(kingMoves).not.toContainEqual([RANK[1], FILE.g]);
        });

        it('Filters out castling if king has already moved', () => {
            // https://lichess.org/analysis/fromPosition/r1bqkb1r/pppp1pp1/2n2n1p/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R
            const chessboard = new Chessboard(
                'r1bqkb1r/pppp1pp1/2n2n1p/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R'
            );
            const king = chessboard.board[RANK[1]][FILE.e] as King;
            king.hasMoved = true;

            const kingMoves = chessboard.getValidMoves({
                rank: RANK[1],
                file: FILE.e,
            });
            expect(kingMoves).not.toContainEqual([RANK[1], FILE.g]);
        });

        it('Filters out castling if paired rook has already moved', () => {
            // Rook moved but back in right square
            // https://lichess.org/analysis/fromPosition/rnbqk2r/pp2ppbp/5np1/2pp4/8/5NP1/PPPPPPBP/RNBQK2R
            const chessboard = new Chessboard(
                'rnbqk2r/pp2ppbp/5np1/2pp4/8/5NP1/PPPPPPBP/RNBQK2R'
            );
            const rook = chessboard.board[RANK[1]][FILE.h] as Rook;
            rook.hasMoved = true;

            const kingMoves = chessboard.getValidMoves({
                rank: RANK[1],
                file: FILE.e,
            });
            expect(kingMoves).not.toContainEqual([RANK[1], FILE.g]);

            // Rook not in right square
            // https://lichess.org/analysis/fromPosition/r2qkb1r/1pp1ppp1/p1n2n1p/3p4/3P1Bb1/P1NQ4/RPP1PPPP/4KBNR
            const chessboard2 = new Chessboard(
                'r2qkb1r/1pp1ppp1/p1n2n1p/3p4/3P1Bb1/P1NQ4/RPP1PPPP/4KBNR'
            );

            const kingMoves2 = chessboard2.getValidMoves({
                rank: RANK[1],
                file: FILE.e,
            });
            expect(kingMoves2).not.toContainEqual([RANK[1], FILE.c]);
        });

        it('Filters out castling if king is in or will pass through check', () => {
            // is in check
            // https://lichess.org/analysis/fromPosition/r3kbnr/1pp1ppp1/p1B4p/q7/3P2Q1/2N5/PPP2PPP/R1B1K1NR
            const chessboard = new Chessboard(
                'r3kbnr/1pp1ppp1/p1B4p/q7/3P2Q1/2N5/PPP2PPP/R1B1K1NR'
            );

            const blackKingMoves = chessboard.getValidMoves({
                rank: RANK[8],
                file: FILE.e,
            });
            expect(blackKingMoves).not.toContainEqual([RANK[8], FILE.c]);

            // passing through check
            // https://lichess.org/analysis/fromPosition/r3kbnr/ppp1pppp/2n5/q7/3P2Q1/2N5/PPP2PPP/R1B1KBNR
            const chessboard2 = new Chessboard(
                'r3kbnr/ppp1pppp/2n5/q7/3P2Q1/2N5/PPP2PPP/R1B1KBNR'
            );

            const blackKingMoves2 = chessboard2.getValidMoves({
                rank: RANK[8],
                file: FILE.e,
            });
            expect(blackKingMoves2).not.toContainEqual([RANK[8], FILE.c]);
        });
    });
});

describe('Moving pieces', () => {
    it('Moves a piece to an empty square', () => {
        const chessboard = new Chessboard(STARTING_POSITION);

        const e2Pawn = chessboard.board[RANK[2]][FILE.e];
        chessboard.move({ from: [RANK[2], FILE.e], to: [RANK[4], FILE.e] });

        expect(chessboard.board[RANK[2]][FILE.e]).toBe(null);
        expect(chessboard.board[RANK[4]][FILE.e]).toBe(e2Pawn);

        const g8Knight = chessboard.board[RANK[8]][FILE.g];
        chessboard.move({ from: [RANK[8], FILE.g], to: [RANK[6], FILE.f] });

        expect(chessboard.board[RANK[8]][FILE.g]).toBe(null);
        expect(chessboard.board[RANK[6]][FILE.f]).toBe(g8Knight);
    });

    it('Replaces piece with new piece if moving onto an occupied square', () => {
        // https://lichess.org/analysis/standard/rn1q1rk1/pp3ppp/2pb1p2/8/2BP2b1/4BN2/PPP2PPP/R2QK2R
        const chessboard = new Chessboard(
            'rn1q1rk1/pp3ppp/2pb1p2/8/2BP2b1/4BN2/PPP2PPP/R2QK2R'
        );

        const f7Pawn = chessboard.board[RANK[7]][FILE.f];
        const c4Bishop = chessboard.board[RANK[4]][FILE.c];
        chessboard.move({ from: [RANK[4], FILE.c], to: [RANK[7], FILE.f] });

        expect(chessboard.board[RANK[4]][FILE.c]).toBe(null);
        expect(chessboard.board[RANK[7]][FILE.f]).toBe(c4Bishop);
        expect(
            chessboard.board.find((row) =>
                row.find((square) => square === f7Pawn)
            )
        ).toBeFalsy();

        const f3Knight = chessboard.board[RANK[3]][FILE.f];
        const g4Bishop = chessboard.board[RANK[4]][FILE.g];
        chessboard.move({ from: [RANK[4], FILE.g], to: [RANK[3], FILE.f] });

        expect(chessboard.board[RANK[4]][FILE.g]).toBe(null);
        expect(chessboard.board[RANK[3]][FILE.f]).toBe(g4Bishop);
        expect(
            chessboard.board.find((row) =>
                row.find((square) => square === f3Knight)
            )
        ).toBeFalsy();
    });

    it('Marks pawns and kings as moved when moved', () => {
        const chessboard = new Chessboard(STARTING_POSITION);

        const e2Pawn = chessboard.board[RANK[2]][FILE.e] as Pawn;
        const whiteKing = chessboard.board[RANK[1]][FILE.e] as King;

        expect(e2Pawn.hasMoved).toBe(false);
        expect(whiteKing.hasMoved).toBe(false);

        chessboard.move({ from: [RANK[2], FILE.e], to: [RANK[4], FILE.e] });
        expect(e2Pawn.hasMoved).toBe(true);

        chessboard.move({ from: [RANK[1], FILE.e], to: [RANK[2], FILE.e] });
        expect(whiteKing.hasMoved).toBe(true);
    });
});

describe('Game end state', () => {
    it('Reports when position is a checkmate', () => {
        // https://lichess.org/analysis/standard/rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR_w_KQkq_-_1_3
        const foolsMate = new Chessboard(
            'rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR'
        );
        expect(foolsMate.canPlayContinue('w')).toEqual([false, 'checkmate']);

        // https://lichess.org/analysis/4k3/8/8/8/8/q7/8/KR6_w_-_-_0_1
        const queenMate = new Chessboard('4k3/8/8/8/8/q7/8/KR6');
        expect(queenMate.canPlayContinue('w')).toEqual([false, 'checkmate']);

        // https://lichess.org/analysis/standard/1nbqkb1r/r1pppp1p/5Np1/pp2Q3/8/4P3/PPPP1PPP/R1B1KBNR_b_KQk_-_0_7
        const smotheredMate = new Chessboard(
            '1nbqkb1r/r1pppp1p/5Np1/pp2Q3/8/4P3/PPPP1PPP/R1B1KBNR'
        );
        expect(smotheredMate.canPlayContinue('b')).toEqual([
            false,
            'checkmate',
        ]);
    });

    it('Reports when position is a stalemate', () => {
        // https://lichess.org/analysis/8/5KBk/8/8/p7/P7/8/8_b_-_-_0_1
        const stalemate1 = new Chessboard('8/5KBk/8/8/p7/P7/8/8');

        const whiteKing = stalemate1.board[1][5] as King;
        // static position so need to manually set these to prevent invalid moves contaminating test
        whiteKing.hasMoved = true;
        expect(stalemate1.canPlayContinue('b')).toEqual([false, 'stalemate']);

        // https://lichess.org/analysis/6k1/b7/8/8/5p2/5P1p/7P/7K_w_-_-_0_1
        const stalemate2 = new Chessboard('6k1/b7/8/8/5p2/5P1p/7P/7K');

        const f3Pawn = stalemate2.board[RANK[3]][FILE.f] as Pawn;
        const h2Pawn = stalemate2.board[RANK[2]][FILE.h] as Pawn;
        f3Pawn.hasMoved = true;
        h2Pawn.hasMoved = true;
        expect(stalemate2.canPlayContinue('w')).toEqual([false, 'stalemate']);

        // https://lichess.org/analysis/N1r5/1pP5/1P6/8/8/5q1k/8/6K1_w_-_-_0_1
        const stalemate3 = new Chessboard('N1r5/1pP5/1P6/8/8/5q1k/8/6K1');

        const blackKing = stalemate3.board[RANK[3]][FILE.h] as King;
        const b6Pawn = stalemate3.board[RANK[6]][FILE.b] as Pawn;
        const c7Pawn = stalemate3.board[RANK[7]][FILE.c] as Pawn;
        blackKing.hasMoved = true;
        b6Pawn.hasMoved = true;
        c7Pawn.hasMoved = true;
        expect(stalemate3.canPlayContinue('w')).toEqual([false, 'stalemate']);
    });

    it('Reports false when position is still playable', () => {
        const playable1 = new Chessboard(STARTING_POSITION);
        expect(playable1.canPlayContinue('b')).toEqual([true, undefined]);

        // https://lichess.org/analysis/standard/r3kb1r/ppp1pppp/2n2n2/q4b2/3P4/2N1BN2/PPP2PPP/R2QKB1R_w_KQkq_-_5_7
        const playable2 = new Chessboard(
            'r3kb1r/ppp1pppp/2n2n2/q4b2/3P4/2N1BN2/PPP2PPP/R2QKB1R'
        );
        expect(playable2.canPlayContinue('w')).toEqual([true, undefined]);

        // https://lichess.org/analysis/8/8/8/8/8/qr6/1Pk5/K7_w_-_-_0_1
        const playable3 = new Chessboard('8/8/8/8/8/qr6/1Pk5/K7');
        expect(playable3.canPlayContinue('w')).toEqual([true, undefined]);

        // https://lichess.org/analysis/8/8/8/8/8/q7/2k5/K1N5_w_-_-_0_1
        const playable4 = new Chessboard('8/8/8/8/8/q7/2k5/K1N5');
        expect(playable4.canPlayContinue('w')).toEqual([true, undefined]);
    });
});
