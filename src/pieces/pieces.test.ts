import { describe, expect, it } from 'vitest';
import { Pawn } from './pawn';
import { Piece } from './piece';
import { Rook } from './rook';
import { Knight } from './knight';
import { Bishop } from './bishop';
import { Queen } from './queen';
import { King } from './king';
import { Move } from '../types';

describe('All piece types', () => {
    it('extends Piece', () => {
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
    let rookMaximumMoves: Move[];
    let bishopMaximumMoves: Move[];

    describe('Pawn', () => {
        describe('White', () => {
            it('Can move one or two squares forward if not yet moved', () => {
                const pawn = new Pawn('w');
                expect(pawn.getMaximumMoves()).toEqual([
                    [0, 1],
                    [0, 2],
                ]);
            });

            it('Can move only one square forward if already moved', () => {
                const pawn = new Pawn('w');
                pawn.hasMoved = true;
                expect(pawn.getMaximumMoves()).toEqual([[0, 1]]);
            });

            it('Can also move one square diagonally left if it can capture left', () => {
                const pawn = new Pawn('w');
                expect(pawn.getMaximumMoves({ canCaptureLeft: true })).toEqual([
                    [0, 1],
                    [0, 2],
                    [-1, 1],
                ]);
            });

            it('Can also move one square diagonally right if it can capture right', () => {
                const pawn = new Pawn('w');
                expect(pawn.getMaximumMoves({ canCaptureRight: true })).toEqual(
                    [
                        [0, 1],
                        [0, 2],
                        [1, 1],
                    ]
                );
            });

            it('Can also move one square diagonally both ways if can capture either direction', () => {
                const pawn = new Pawn('w');
                expect(
                    pawn.getMaximumMoves({
                        canCaptureLeft: true,
                        canCaptureRight: true,
                    })
                ).toEqual([
                    [0, 1],
                    [0, 2],
                    [-1, 1],
                    [1, 1],
                ]);
            });
        });

        describe('Black (inverted direction)', () => {
            it('Can move one or two squares forward if not yet moved', () => {
                const pawn = new Pawn('b');
                expect(pawn.getMaximumMoves()).toEqual([
                    [-0, -1],
                    [-0, -2],
                ]);
            });

            it('Can move only one square forward if already moved', () => {
                const pawn = new Pawn('b');
                pawn.hasMoved = true;
                expect(pawn.getMaximumMoves()).toEqual([[-0, -1]]);
            });

            it('Can also move one square diagonally left if it can capture left', () => {
                const pawn = new Pawn('b');
                expect(pawn.getMaximumMoves({ canCaptureLeft: true })).toEqual([
                    [-0, -1],
                    [-0, -2],
                    [1, -1],
                ]);
            });

            it('Can also move one square diagonally right if it can capture right', () => {
                const pawn = new Pawn('b');
                expect(pawn.getMaximumMoves({ canCaptureRight: true })).toEqual(
                    [
                        [-0, -1],
                        [-0, -2],
                        [-1, -1],
                    ]
                );
            });

            it('Can also move one square diagonally both ways if can capture either direction', () => {
                const pawn = new Pawn('b');
                expect(
                    pawn.getMaximumMoves({
                        canCaptureLeft: true,
                        canCaptureRight: true,
                    })
                ).toEqual([
                    [-0, -1],
                    [-0, -2],
                    [1, -1],
                    [-1, -1],
                ]);
            });
        });
    });

    describe('Rook', () => {
        // prettier-ignore
        rookMaximumMoves = [
            [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7],
            [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0],
            [0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7],
            [-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0],
        ];

        it('Can move up to 7 squares orthogonally', () => {
            const rook = new Rook('w');
            expect(rook.getMaximumMoves()).toEqual(rookMaximumMoves);
        });
    });

    describe('Bishop', () => {
        // prettier-ignore
        bishopMaximumMoves = [
            [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7],
            [1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7],
            [-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7],
            [-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7],
        ];

        it('Can move up to 7 squares diagonally', () => {
            const bishop = new Bishop('w');
            expect(bishop.getMaximumMoves()).toEqual(bishopMaximumMoves);
        });
    });

    describe('Knight', () => {
        const knightMaximumMoves = [
            [1, 2],
            [2, 1],
            [2, -1],
            [1, -2],
            [-1, -2],
            [-2, -1],
            [-2, 1],
            [-1, 2],
        ];

        it('Can move to all 8 squares 2x1 L-shapes away', () => {
            const knight = new Knight('w');
            expect(knight.getMaximumMoves()).toEqual(knightMaximumMoves);
        });
    });

    describe('Queen', () => {
        it('Can move up to 7 squares orthogonally and diagonally', () => {
            const queen = new Queen('w');
            expect(queen.getMaximumMoves()).toEqual([
                ...rookMaximumMoves,
                ...bishopMaximumMoves,
            ]);
        });
    });

    describe('King', () => {
        const baseKingMovements = [
            [0, 1],
            [1, 1],
            [1, 0],
            [1, -1],
            [0, -1],
            [-1, -1],
            [-1, 0],
            [-1, 1],
        ];

        it('Can move one square orthogonally and diagonally if it cannot castle', () => {
            const king = new King('w');
            expect(king.getMaximumMoves()).toEqual(baseKingMovements);
        });

        it('Can also move two squares towards the h-file if it can castle short', () => {
            const king = new King('w');
            expect(king.getMaximumMoves({ canCastleShort: true })).toEqual([
                ...baseKingMovements,
                [2, 0],
            ]);
        });

        it('Can also move three squares towards the a-file if it can castle long', () => {
            const king = new King('w');
            expect(king.getMaximumMoves({ canCastleLong: true })).toEqual([
                ...baseKingMovements,
                [-3, 0],
            ]);
        });

        it('Can make both castling movements if it can castle both ways', () => {
            const king = new King('w');
            expect(
                king.getMaximumMoves({
                    canCastleShort: true,
                    canCastleLong: true,
                })
            ).toEqual([...baseKingMovements, [2, 0], [-3, 0]]);
        });
    });
});
