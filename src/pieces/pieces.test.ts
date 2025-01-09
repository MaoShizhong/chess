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

    it('Reports piece information', () => {
        expect(new Pawn('w').info).toBe('P-w');
        expect(new Rook('b').info).toBe('R-b');
        expect(new Knight('w').info).toBe('N-w');
        expect(new Bishop('w').info).toBe('B-w');
        expect(new Queen('b').info).toBe('Q-b');
        expect(new King('w').info).toBe('K-w');
    });
});

describe('Movement', () => {
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
});
