import { describe, it, expect } from 'vitest';
import { Chessboard } from './index';

describe('Chessboard instance', () => {
    it('Instantiates', () => {
        expect(typeof new Chessboard()).toBe('object');
    });
});

describe('Board', () => {
    it('Is 8x8', () => {
        const chessboard = new Chessboard();
        expect(chessboard.board.length).toBe(8);
        expect(chessboard.board.every((row) => (row.length = 8))).toBe(true);
    });

    // TODO
    it('Starts with standard piece count', () => {
        expect(true).toBe(false);
    });

    // TODO
    it('Starts with standard piece placement', () => {
        expect(true).toBe(false);
    });

    // TODO
    it('Orientates board based on starting colour', () => {
        expect(true).toBe(false);
    });

    // TODO
    it('Can flip board orientation', () => {
        expect(true).toBe(false);
    });
});
