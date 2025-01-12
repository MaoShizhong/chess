import { describe, expect, it } from 'vitest';
import { Pawn } from './pawn';
import { Piece } from './piece';
import { Rook } from './rook';
import { Knight } from './knight';
import { Bishop } from './bishop';
import { Queen } from './queen';
import { King } from './king';
import { Moves } from '../types';

describe('All piece types', () => {
    it('Extends Piece', () => {
        expect(new Pawn('w') instanceof Piece).toBe(true);
        expect(new Rook('w') instanceof Piece).toBe(true);
        expect(new Knight('w') instanceof Piece).toBe(true);
        expect(new Bishop('w') instanceof Piece).toBe(true);
        expect(new Queen('w') instanceof Piece).toBe(true);
        expect(new King('w') instanceof Piece).toBe(true);
    });

    it('Reports colour-based piece letter', () => {
        expect(new Pawn('w').letter).toBe('P');
        expect(new Pawn('b').letter).toBe('p');
        expect(new Rook('w').letter).toBe('R');
        expect(new Rook('b').letter).toBe('r');
        expect(new Knight('w').letter).toBe('N');
        expect(new Knight('b').letter).toBe('n');
        expect(new Bishop('w').letter).toBe('B');
        expect(new Bishop('b').letter).toBe('b');
        expect(new Queen('w').letter).toBe('Q');
        expect(new Queen('b').letter).toBe('q');
        expect(new King('w').letter).toBe('K');
        expect(new King('b').letter).toBe('k');
    });
});

describe('Movement', () => {
    // Queen test scope needs access to these
    // Moves defined inside respective piece test blocks
    let rookMaximumMoves: Moves;
    let bishopMaximumMoves: Moves;

    describe('Pawn', () => {
        describe('White', () => {
            it('If not yet moved, all pawn moves possible (inc. captures and double move)', () => {
                const pawn = new Pawn('w');
                expect(pawn.maximumMoves).toEqual([
                    [
                        [1, 0],
                        [2, 0],
                    ],
                    [[1, -1]],
                    [[1, 1]],
                ]);
            });

            it('Can move only one square forward if already moved', () => {
                const pawn = new Pawn('w');
                pawn.hasMoved = true;
                expect(pawn.maximumMoves).toEqual([
                    [[1, 0]],
                    [[1, -1]],
                    [[1, 1]],
                ]);
            });
        });

        describe('Black (inverted direction)', () => {
            it('If not yet moved, all pawn moves possible (inc. captures and double move)', () => {
                const pawn = new Pawn('b');
                expect(pawn.maximumMoves).toEqual([
                    [
                        [-1, -0],
                        [-2, -0],
                    ],
                    [[-1, 1]],
                    [[-1, -1]],
                ]);
            });

            it('Can move only one square forward if already moved', () => {
                const pawn = new Pawn('b');
                pawn.hasMoved = true;
                expect(pawn.maximumMoves).toEqual([
                    [[-1, -0]],
                    [[-1, 1]],
                    [[-1, -1]],
                ]);
            });
        });
    });

    describe('Rook', () => {
        // prettier-ignore
        rookMaximumMoves = [
            [ [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0] ], // forwards as white
            [ [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7] ], // right as white
            [ [-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0] ], // backwards as white
            [ [0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7] ], // left as white
        ];

        it('Can move up to 7 squares orthogonally, each direction sorted by increasing distance', () => {
            const rook = new Rook('w');
            expect(rook.maximumMoves).toEqual(rookMaximumMoves);
        });
    });

    describe('Bishop', () => {
        // prettier-ignore
        bishopMaximumMoves = [
            [ [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7] ], // a1-h8 diagonal as white
            [ [1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7] ], // h1-a8 diagonal as white
            [ [-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7] ], // a8-h1 diagonal as white
            [ [-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7] ], // h8-a1 diagonal as white
        ];

        it('Can move up to 7 squares diagonally, each direction sorted by increasing distance', () => {
            const bishop = new Bishop('w');
            expect(bishop.maximumMoves).toEqual(bishopMaximumMoves);
        });
    });

    describe('Knight', () => {
        const knightMaximumMoves = [
            [[1, 2]],
            [[2, 1]],
            [[2, -1]],
            [[1, -2]],
            [[-1, -2]],
            [[-2, -1]],
            [[-2, 1]],
            [[-1, 2]],
        ];

        it('Can move to all 8 squares 2x1 L-shapes away', () => {
            const knight = new Knight('w');
            expect(knight.maximumMoves).toEqual(knightMaximumMoves);
        });
    });

    describe('Queen', () => {
        it('Can move up to 7 squares orthogonally and diagonally, each direction sorted by increasing distance', () => {
            const queen = new Queen('w');
            expect(queen.maximumMoves).toEqual([
                ...rookMaximumMoves,
                ...bishopMaximumMoves,
            ]);
        });
    });

    describe('King', () => {
        const baseKingMovements = [
            [[0, 1]],
            [[1, 1]],
            [[1, 0]],
            [[1, -1]],
            [[0, -1]],
            [[-1, -1]],
            [[-1, 0]],
            [[-1, 1]],
            [[0, 2]],
            [[0, -2]],
        ];

        it('Can move one square orthogonally and diagonally and castle both ways if not yet moved', () => {
            const king = new King('w');
            expect(king.maximumMoves).toEqual(baseKingMovements);
        });

        it('Cannot make castling movement if already moved', () => {
            const king = new King('w');
            king.hasMoved = true;
            expect(king.maximumMoves).toEqual(baseKingMovements.slice(0, -2));
        });
    });
});
