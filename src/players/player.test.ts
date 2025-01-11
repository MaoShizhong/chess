import { beforeEach, describe, expect, it, test, vi } from 'vitest';
import { Chess } from '..';

const RANK = [null, 7, 6, 5, 4, 3, 2, 1, 0];
const FILE = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7 };

beforeEach(vi.clearAllMocks);

describe('Move', () => {
    const chess = new Chess();
    chess.board.move = vi.fn();

    describe('Number of pieces moved', () => {
        it('Calls chess.board.move once if not castling', () => {
            chess.players.w.move('a3');
            expect(chess.board.move).toHaveBeenCalledTimes(1);

            chess.players.w.move('Nf3');
            expect(chess.board.move).toHaveBeenCalledTimes(2);

            chess.players.w.move('Kg1');
            expect(chess.board.move).toHaveBeenCalledTimes(3);
        });

        it('Calls chess.board.move twice if castling', () => {
            chess.players.w.move('O-O');
            expect(chess.board.move).toHaveBeenCalledTimes(2);

            chess.players.w.move('O-O-O');
            expect(chess.board.move).toHaveBeenCalledTimes(4);
        });
    });

    describe('Call details (White)', () => {
        test('a3 tells board to move a pawn to a3', () => {
            chess.players.w.move('a3');
            expect(chess.board.move).toHaveBeenCalledWith({
                piece: { letter: 'P' },
                colour: 'w',
                destination: [RANK[3], FILE.A],
            });
        });

        test('Bc4 tells board to move a bishop to c4', () => {
            chess.players.w.move('Bc4');
            expect(chess.board.move).toHaveBeenCalledWith({
                piece: { letter: 'B' },
                colour: 'w',
                destination: [RANK[4], FILE.C],
            });
        });

        test('Nge2 tells board to move a g-file knight to e2', () => {
            chess.players.w.move('Nge2');
            expect(chess.board.move).toHaveBeenCalledWith({
                piece: { letter: 'N', file: FILE.G },
                colour: 'w',
                destination: [RANK[2], FILE.E],
            });
        });

        test('Qh4e1 tells board to move an h-file 4th rank queen to e1', () => {
            chess.players.w.move('Qh4e1');
            expect(chess.board.move).toHaveBeenCalledWith({
                piece: { letter: 'Q', file: FILE.H, rank: RANK[1] },
                colour: 'w',
                destination: [RANK[1], FILE.E],
            });
        });
    });

    describe('Call details (Black)', () => {
        test('d5 tells board to move a pawn to d5', () => {
            chess.players.b.move('d5');
            expect(chess.board.move).toHaveBeenCalledWith({
                piece: { letter: 'P' },
                colour: 'b',
                destination: [RANK[5], FILE.D],
            });
        });

        test('O-O tells board to castle short', () => {
            chess.players.b.move('O-O');
            expect(chess.board.move).toHaveBeenNthCalledWith(1, {
                piece: { letter: 'K' },
                colour: 'b',
                destination: [RANK[8], FILE.G],
            });
            expect(chess.board.move).toHaveBeenNthCalledWith(2, {
                piece: { letter: 'R', file: FILE.H },
                colour: 'b',
                destination: [RANK[8], FILE.F],
            });
        });

        test('O-O-O tells board to castle short', () => {
            chess.players.b.move('O-O-O');
            expect(chess.board.move).toHaveBeenNthCalledWith(2, {
                piece: { letter: 'K' },
                colour: 'b',
                destination: [RANK[8], FILE.C],
            });
            expect(chess.board.move).toHaveBeenNthCalledWith(1, {
                piece: { letter: 'R', file: FILE.A },
                colour: 'b',
                destination: [RANK[8], FILE.D],
            });
        });
    });
});
