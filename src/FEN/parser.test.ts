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
});
