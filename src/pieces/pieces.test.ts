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
    it('Inverts direction of moves', () => {
        const moves: Move[][] = [
            [
                [0, 1],
                [1, 1],
                [2, 2],
                [1, -2],
            ],
            [
                [1, -2],
                [3, 3],
                [2, -4],
            ],
        ];

        expect(Piece.invertMovesDirection(moves[0])).toEqual([
            [0, -1],
            [1, -1],
            [2, -2],
            [1, 2],
        ]);
        expect(Piece.invertMovesDirection(moves[1])).toEqual([
            [1, 2],
            [3, -3],
            [2, 4],
        ]);
    });
});
