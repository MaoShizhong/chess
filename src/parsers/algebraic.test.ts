import { describe, expect, it } from 'vitest';
import * as algebraic from './algebraic';

const RANK = [null, 7, 6, 5, 4, 3, 2, 1, 0];
const FILE = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7 };

describe('Parsing algebraic notation', () => {
    describe('Non-captures', () => {
        it('Parses pawn moves (missing piece letter)', () => {
            expect(algebraic.parse('a4')).toEqual({
                piece: { letter: 'P' },
                destination: [RANK[4], FILE.A],
            });
            expect(algebraic.parse('h6')).toEqual({
                piece: { letter: 'P' },
                destination: [RANK[6], FILE.H],
            });
        });

        it('Parses unambiguous piece moves', () => {
            expect(algebraic.parse('Ke2')).toEqual({
                piece: { letter: 'K' },
                destination: [RANK[2], FILE.E],
            });
            expect(algebraic.parse('Rh5')).toEqual({
                piece: { letter: 'R' },
                destination: [RANK[5], FILE.H],
            });
            expect(algebraic.parse('Bg7')).toEqual({
                piece: { letter: 'B' },
                destination: [RANK[7], FILE.G],
            });
            expect(algebraic.parse('Nc6')).toEqual({
                piece: { letter: 'N' },
                destination: [RANK[6], FILE.C],
            });
        });

        it('Disambiguates ambiguous piece moves', () => {
            expect(algebraic.parse('Nge2')).toEqual({
                piece: { letter: 'N', file: FILE.G },
                destination: [RANK[2], FILE.E],
            });
            expect(algebraic.parse('R2f3')).toEqual({
                piece: { letter: 'R', rank: RANK[2] },
                destination: [RANK[3], FILE.F],
            });
            expect(algebraic.parse('Qh1e1')).toEqual({
                piece: { letter: 'Q', rank: RANK[1], file: FILE.H },
                destination: [RANK[1], FILE.E],
            });
        });
    });

    describe('Castling', () => {
        it('Parses castling as moving 2 pieces', () => {
            expect(algebraic.parse('O-O')).toEqual([
                {
                    piece: { letter: 'K' },
                    destination: [null, FILE.G],
                },
                {
                    piece: { letter: 'R', file: FILE.H },
                    destination: [null, FILE.F],
                },
            ]);
            expect(algebraic.parse('O-O-O')).toEqual([
                {
                    piece: { letter: 'K' },
                    destination: [null, FILE.G],
                },
                {
                    piece: { letter: 'R', file: FILE.A },
                    destination: [null, FILE.F],
                },
            ]);
        });
    });
});
