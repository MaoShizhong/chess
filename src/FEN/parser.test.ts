import { describe, expect, it } from 'vitest';
import { FEN } from './parser';

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
