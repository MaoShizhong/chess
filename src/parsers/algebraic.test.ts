import { describe, expect, it } from 'vitest';
import * as algebraic from './algebraic';
import { RANK, FILE } from '../board/board';

describe('Parsing algebraic notation', () => {
    describe('Non-captures', () => {
        it('Parses pawn moves (missing piece letter)', () => {
            expect(algebraic.parse('a4')).toEqual({
                isCapture: false,
                piecesToMove: [
                    {
                        piece: { letter: 'P' },
                        destination: [RANK[4], FILE.a],
                    },
                ],
            });
            expect(algebraic.parse('h6')).toEqual({
                isCapture: false,
                piecesToMove: [
                    {
                        piece: { letter: 'P' },
                        destination: [RANK[6], FILE.h],
                    },
                ],
            });
        });

        it('Parses unambiguous piece moves', () => {
            expect(algebraic.parse('Ke2')).toEqual({
                isCapture: false,
                piecesToMove: [
                    {
                        piece: { letter: 'K' },
                        destination: [RANK[2], FILE.e],
                    },
                ],
            });
            expect(algebraic.parse('Rh5')).toEqual({
                isCapture: false,
                piecesToMove: [
                    {
                        piece: { letter: 'R' },
                        destination: [RANK[5], FILE.h],
                    },
                ],
            });
            expect(algebraic.parse('Bg7')).toEqual({
                isCapture: false,
                piecesToMove: [
                    {
                        piece: { letter: 'B' },
                        destination: [RANK[7], FILE.g],
                    },
                ],
            });
            expect(algebraic.parse('Nc6')).toEqual({
                isCapture: false,
                piecesToMove: [
                    {
                        piece: { letter: 'N' },
                        destination: [RANK[6], FILE.c],
                    },
                ],
            });
        });

        it('Disambiguates ambiguous piece moves', () => {
            expect(algebraic.parse('Nge2')).toEqual({
                isCapture: false,
                piecesToMove: [
                    {
                        piece: { letter: 'N', file: FILE.g },
                        destination: [RANK[2], FILE.e],
                    },
                ],
            });
            expect(algebraic.parse('R2f3')).toEqual({
                isCapture: false,
                piecesToMove: [
                    {
                        piece: { letter: 'R', rank: RANK[2] },
                        destination: [RANK[3], FILE.f],
                    },
                ],
            });
            expect(algebraic.parse('Qh1e1')).toEqual({
                isCapture: false,
                piecesToMove: [
                    {
                        piece: { letter: 'Q', rank: RANK[1], file: FILE.h },
                        destination: [RANK[1], FILE.e],
                    },
                ],
            });
        });
    });

    describe('Castling', () => {
        it('Parses castling as moving 2 pieces', () => {
            expect(algebraic.parse('O-O')).toEqual({
                isCapture: false,
                piecesToMove: [
                    {
                        piece: { letter: 'K' },
                        destination: [0, FILE.g],
                    },
                    {
                        piece: { letter: 'R', file: FILE.h },
                        destination: [0, FILE.f],
                    },
                ],
            });

            expect(algebraic.parse('O-O-O')).toEqual({
                isCapture: false,
                piecesToMove: [
                    {
                        piece: { letter: 'K' },
                        destination: [0, FILE.c],
                    },
                    {
                        piece: { letter: 'R', file: FILE.a },
                        destination: [0, FILE.d],
                    },
                ],
            });
        });
    });

    describe('Captures', () => {
        it('Parses pawn captures (missing piece letter)', () => {
            expect(algebraic.parse('axb4')).toEqual({
                isCapture: true,
                piecesToMove: [
                    {
                        piece: { letter: 'P', file: FILE.a },
                        destination: [RANK[4], FILE.b],
                    },
                ],
            });
            expect(algebraic.parse('hxg6')).toEqual({
                isCapture: true,
                piecesToMove: [
                    {
                        piece: { letter: 'P', file: FILE.h },
                        destination: [RANK[6], FILE.g],
                    },
                ],
            });
        });

        it('Parses unambiguous piece captures', () => {
            expect(algebraic.parse('Kxe2')).toEqual({
                isCapture: true,
                piecesToMove: [
                    {
                        piece: { letter: 'K' },
                        destination: [RANK[2], FILE.e],
                    },
                ],
            });
            expect(algebraic.parse('Rxh5')).toEqual({
                isCapture: true,
                piecesToMove: [
                    {
                        piece: { letter: 'R' },
                        destination: [RANK[5], FILE.h],
                    },
                ],
            });
            expect(algebraic.parse('Bxg7')).toEqual({
                isCapture: true,
                piecesToMove: [
                    {
                        piece: { letter: 'B' },
                        destination: [RANK[7], FILE.g],
                    },
                ],
            });
            expect(algebraic.parse('Nxc6')).toEqual({
                isCapture: true,
                piecesToMove: [
                    {
                        piece: { letter: 'N' },
                        destination: [RANK[6], FILE.c],
                    },
                ],
            });
        });

        it('Disambiguates ambiguous piece moves', () => {
            expect(algebraic.parse('Ngxe2')).toEqual({
                isCapture: true,
                piecesToMove: [
                    {
                        piece: { letter: 'N', file: FILE.g },
                        destination: [RANK[2], FILE.e],
                    },
                ],
            });
            expect(algebraic.parse('R2xf3')).toEqual({
                isCapture: true,
                piecesToMove: [
                    {
                        piece: { letter: 'R', rank: RANK[2] },
                        destination: [RANK[3], FILE.f],
                    },
                ],
            });
            expect(algebraic.parse('Qh1xe1')).toEqual({
                isCapture: true,
                piecesToMove: [
                    {
                        piece: { letter: 'Q', rank: RANK[1], file: FILE.h },
                        destination: [RANK[1], FILE.e],
                    },
                ],
            });
        });
    });
});
