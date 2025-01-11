import { describe, expect, it } from 'vitest';
import { FEN } from './parser';
import { Rook } from '../pieces/rook';
import { Bishop } from '../pieces/bishop';
import { Knight } from '../pieces/knight';
import { Queen } from '../pieces/queen';
import { King } from '../pieces/king';
import { Pawn } from '../pieces/pawn';

describe('Parsing FEN', () => {
    describe('Split', () => {
        it('Extracts the board position segment', () => {
            expect(FEN.split('8/8/8/4p1K1/2k1P3/8/8/8 b - - 0 1')[0]).toBe(
                '8/8/8/4p1K1/2k1P3/8/8/8'
            );
        });

        it('Extracts the active player colour', () => {
            expect(FEN.split('8/8/8/4p1K1/2k1P3/8/8/8 b - - 0 1')[1]).toBe('b');
        });

        it('Extracts castling rights information', () => {
            expect(FEN.split('8/8/8/4p1K1/2k1P3/8/8/8 b - - 0 1')[2]).toEqual({
                w: { short: false, long: false },
                b: { short: false, long: false },
            });

            expect(
                FEN.split(
                    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w Kkq - 0 1'
                )[2]
            ).toEqual({
                w: { short: true, long: false },
                b: { short: true, long: true },
            });
        });

        it('Ignores all other FEN segments', () => {
            expect(FEN.split('8/8/8/4p1K1/2k1P3/8/8/8 b - - 0 1')).toHaveLength(
                3
            );
        });
    });

    describe('Validate', () => {
        const ERROR_MESSAGE = 'not a valid FEN string.';

        it('Accepts valid FEN with position, active player, and castling segments', () => {
            expect(() =>
                FEN.split('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w Kkq')
            ).not.toThrow();
        });

        it('Also accepts full valid FEN strings', () => {
            expect(() =>
                FEN.split(
                    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w Kkq - 0 1'
                )
            ).not.toThrow();
        });

        describe('Position info', () => {
            it('Throws TypeError if position segment is missing', () => {
                expect(() => FEN.split('w Kkq')).toThrow(ERROR_MESSAGE);
            });

            it('Throws TypeError if position segment does not correspond to an 8x8 board', () => {
                expect(() =>
                    FEN.split('8/8/7/4p1K1/2k1P3/8/8/8 b - - 0 1')
                ).toThrow(ERROR_MESSAGE);
                expect(() =>
                    FEN.split('8/8/8/4p1KQR1/2k1P3/8/8/8 b - - 0 1')
                ).toThrow(ERROR_MESSAGE);
            });
        });

        describe('Active player info', () => {
            it('Throws TypeError if active player segment is missing', () => {
                expect(() => FEN.split('8/8/8/4p1K1/2k1P3/8/8/8 -')).toThrow(
                    ERROR_MESSAGE
                );
            });

            it("Throws TypeError if active player is not 'w' or 'b'", () => {
                expect(() =>
                    FEN.split('8/8/8/4p1K1/2k1P3/8/8/8 q - - 0 1')
                ).toThrow(ERROR_MESSAGE);
            });
        });

        describe('Castling info', () => {
            it('Throws TypeError if castling segment is missing', () => {
                expect(() => FEN.split('8/8/8/4p1K1/2k1P3/8/8/8 w')).toThrow(
                    ERROR_MESSAGE
                );
            });

            it('Throws TypeError if castling segment does not match valid FEN castling patterns', () => {
                expect(() => FEN.split('8/8/8/4p1K1/2k1P3/8/8/8 w 2h')).toThrow(
                    ERROR_MESSAGE
                );
                expect(() =>
                    FEN.split('8/8/8/4p1K1/2k1P3/8/8/8 w KKQk')
                ).toThrow(ERROR_MESSAGE);
            });
        });
    });
});

describe('Serialising to FEN', () => {
    it('Serialises board state to FEN', () => {
        // prettier-ignore
        const najdorf = [
            [new Rook('b'), new Knight('b'), new Bishop('b'), new Queen('b'), new King('b'), new Bishop('b'), null, new Rook('b')],
            [null, new Pawn('b'), null, null, new Pawn('b'), new Pawn('b'), new Pawn('b'), new Pawn('b')],
            [new Pawn('b'), null, null, new Pawn('b'), null, new Knight('b'), null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, new Knight('w'), new Pawn('w'), null, null, null],
            [null, null, new Knight('w'), null, null, null, null, null],
            [new Pawn('w'), new Pawn('w'), new Pawn('w'), null, null, new Pawn('w'), new Pawn('w'), new Pawn('w')],
            [new Rook('w'), null, new Bishop('w'), new Queen('w'), new King('w'), new Bishop('w'), null, new Rook('w')],
        ];
        const castlingRights = {
            w: { short: true, long: true },
            b: { short: true, long: true },
        };
        expect(FEN.serialise(najdorf, 'w', castlingRights)).toBe(
            'rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 1'
        );

        // prettier-ignore
        const berlinDraw = [
            [new Rook('b'), null, new Bishop('b'), null, new King('b'), new Bishop('b'), null, new Rook('b')],
            [new Pawn('b'), new Pawn('b'), new Pawn('b'), null, null, new Pawn('b'), new Pawn('b'), new Pawn('b')],
            [null, null, null, new Queen('b'), null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [new Pawn('w'), null, null, new Queen('w'), null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, new Pawn('w'), new Pawn('w'), null, null, new Pawn('w'), new Pawn('w'), new Pawn('w')],
            [new Rook('w'), new Knight('w'), new Bishop('w'), null, null, new Rook('w'), new King('w'), null],
        ];
        const berlinCastlingRights = {
            w: { short: false, long: false },
            b: { short: true, long: true },
        };
        expect(FEN.serialise(berlinDraw, 'w', berlinCastlingRights)).toEqual(
            'r1b1kb1r/ppp2ppp/3q4/8/P2Q4/8/1PP2PPP/RNB2RK1 w kq - 0 1'
        );
    });
});
