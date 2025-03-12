import { describe, expect, it } from 'vitest';
import * as algebraic from './algebraic';
import { RANK, FILE, Chessboard } from '../board/board';

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

    describe('Promotion', () => {
        it('Parses non-capture promotion', () => {
            expect(algebraic.parse('e8=Q')).toEqual({
                isCapture: false,
                piecesToMove: [
                    {
                        piece: { letter: 'P' },
                        destination: [RANK[8], FILE.e],
                        promoteTo: 'Q',
                    },
                ],
            });

            expect(algebraic.parse('c1=R')).toEqual({
                isCapture: false,
                piecesToMove: [
                    {
                        piece: { letter: 'P' },
                        destination: [RANK[1], FILE.c],
                        promoteTo: 'R',
                    },
                ],
            });
        });

        it('Parses capture promotion', () => {
            expect(algebraic.parse('dxe1=Q')).toEqual({
                isCapture: true,
                piecesToMove: [
                    {
                        piece: { letter: 'P', file: FILE.d },
                        destination: [RANK[1], FILE.e],
                        promoteTo: 'Q',
                    },
                ],
            });

            expect(algebraic.parse('bxc8=R')).toEqual({
                isCapture: true,
                piecesToMove: [
                    {
                        piece: { letter: 'P', file: FILE.b },
                        destination: [RANK[8], FILE.c],
                        promoteTo: 'R',
                    },
                ],
            });
        });
    });
});

describe.only('Converting to algebraic notation', () => {
    it.each([
        [4, 'a', 'a4'],
        [7, 'c', 'c7'],
        [1, 'b', 'b1'],
        [3, 'h', 'h3'],
    ])(
        'Converts rank %i and file %s to %s',
        (rank, file, algebraicNotation) => {
            expect(algebraic.toAlgebraic([RANK[rank], FILE[file]])).toBe(
                algebraicNotation
            );
        }
    );

    describe('Converting move coordinates to algebraic move when given a board', () => {
        const boards: { [key: string]: Chessboard } = {
            'starting board': new Chessboard(
                'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
            ),
            // https://lichess.org/analysis/r3k3/8/8/8/8/8/8/4K2R_w_Kq_-_0_1
            'castling board': new Chessboard('r3k3/8/8/8/8/8/8/4K2R'),
            // https://lichess.org/analysis/r3k3/1q6/1N6/8/5p2/6P1/8/2B1K2R_w_Kq_-_0_1
            'open board': new Chessboard('r3k3/1q6/1N6/8/5p2/6P1/8/2B1K2R'),
            // https://lichess.org/analysis/2r1k3/8/8/4p3/2N1Q1NQ/2r5/8/3K3Q_w_-_-_0_1
            'disambiguating board': new Chessboard(
                '2r1k3/8/8/4p3/2N1Q1NQ/2r5/8/3K3Q'
            ),
        };

        it.each([
            ['g1', 'f3', 'Nf3', 'starting board'],
            ['a2', 'a3', 'a3', 'starting board'],
            ['e1', 'g1', 'O-O', 'castling board'],
            ['e8', 'c8', 'O-O-O', 'castling board'],
            ['e1', 'e2', 'Ke2', 'open board'],
            ['c1', 'f4', 'Bxf4', 'open board'],
            ['f4', 'g3', 'fxg3', 'open board'],
            ['b7', 'b6', 'Qxb6', 'open board'],
            ['c4', 'e5', 'Ncxe5', 'disambiguating board'],
            ['c3', 'c4', 'R3xc4', 'disambiguating board'],
            ['h4', 'e1', 'Qh4e1', 'disambiguating board'],
        ])('Converts %s->%s to %s on the %s', (from, to, result, board) => {
            expect(
                algebraic.toFullAlgebraicMove({ from, to }, boards[board])
            ).toEqual([true, result]);
        });
    });
});
