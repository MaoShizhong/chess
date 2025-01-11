import { describe, expect, it } from 'vitest';
import * as algebraic from './algebraic';
import { RANK, FILE } from '../board/board';

describe('Parsing algebraic notation', () => {
    describe('Non-captures', () => {
        it('Parses pawn moves (missing piece letter)', () => {
            expect(algebraic.parse('a4')).toEqual({
                piece: { letter: 'P' },
                destination: [RANK[4], FILE.a],
            });
            expect(algebraic.parse('h6')).toEqual({
                piece: { letter: 'P' },
                destination: [RANK[6], FILE.h],
            });
        });

        it('Parses unambiguous piece moves', () => {
            expect(algebraic.parse('Ke2')).toEqual({
                piece: { letter: 'K' },
                destination: [RANK[2], FILE.e],
            });
            expect(algebraic.parse('Rh5')).toEqual({
                piece: { letter: 'R' },
                destination: [RANK[5], FILE.h],
            });
            expect(algebraic.parse('Bg7')).toEqual({
                piece: { letter: 'B' },
                destination: [RANK[7], FILE.g],
            });
            expect(algebraic.parse('Nc6')).toEqual({
                piece: { letter: 'N' },
                destination: [RANK[6], FILE.c],
            });
        });

        it('Disambiguates ambiguous piece moves', () => {
            expect(algebraic.parse('Nge2')).toEqual({
                piece: { letter: 'N', file: FILE.g },
                destination: [RANK[2], FILE.e],
            });
            expect(algebraic.parse('R2f3')).toEqual({
                piece: { letter: 'R', rank: RANK[2] },
                destination: [RANK[3], FILE.f],
            });
            expect(algebraic.parse('Qh1e1')).toEqual({
                piece: { letter: 'Q', rank: RANK[1], file: FILE.h },
                destination: [RANK[1], FILE.e],
            });
        });
    });

    describe('Castling', () => {
        it('Parses castling as moving 2 pieces', () => {
            expect(algebraic.parse('O-O')).toEqual([
                {
                    piece: { letter: 'K' },
                    destination: [null, FILE.g],
                },
                {
                    piece: { letter: 'R', file: FILE.h },
                    destination: [null, FILE.f],
                },
            ]);
            expect(algebraic.parse('O-O-O')).toEqual([
                {
                    piece: { letter: 'K' },
                    destination: [null, FILE.g],
                },
                {
                    piece: { letter: 'R', file: FILE.a },
                    destination: [null, FILE.f],
                },
            ]);
        });
    });
});
