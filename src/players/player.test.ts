import { beforeEach, describe, expect, it, test, vi } from 'vitest';
import { Chess } from '..';
import { RANK, FILE } from '../board/board';

beforeEach(vi.clearAllMocks);

describe('Move', () => {
    // https://lichess.org/analysis/standard/r2qkb1r/ppp2ppp/2n2n2/1B2pb2/3P1B2/2N2N2/PPP1Q1PP/R3K2R_w_KQkq_-_1_10
    const chess = new Chess(
        'r2qkb1r/ppp2ppp/2n2n2/1B2pb2/3P1B2/2N2N2/PPP1Q1PP/R3K2R w KQkq - 1 10'
    );
    chess.board.move = vi.fn();

    describe('Number of pieces moved', () => {
        it('Calls chess.board.move once if piece is movable and not castling', () => {
            chess.players.w.move('a3');
            expect(chess.board.move).toHaveBeenCalledTimes(1);

            chess.players.w.move('Nh4');
            expect(chess.board.move).toHaveBeenCalledTimes(2);

            chess.players.w.move('g4');
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
                destination: [RANK[3], FILE.a],
            });
        });

        test('Bc4 tells board to move a bishop to c4', () => {
            chess.players.w.move('Bc4');
            expect(chess.board.move).toHaveBeenCalledWith({
                piece: { letter: 'B' },
                destination: [RANK[4], FILE.c],
            });
        });

        test('Nge2 tells board to move a g-file knight to e2', () => {
            chess.players.w.move('Nge2');
            expect(chess.board.move).toHaveBeenCalledWith({
                piece: { letter: 'N', file: FILE.g },
                destination: [RANK[2], FILE.e],
            });
        });

        test('Qh4e1 tells board to move an h-file 4th rank queen to e1', () => {
            chess.players.w.move('Qh4e1');
            expect(chess.board.move).toHaveBeenCalledWith({
                piece: { letter: 'Q', file: FILE.h, rank: RANK[4] },
                destination: [RANK[1], FILE.e],
            });
        });
    });

    describe('Call details (Black)', () => {
        test('d5 tells board to move a pawn to d5', () => {
            chess.players.b.move('d5');
            expect(chess.board.move).toHaveBeenCalledWith({
                piece: { letter: 'p' },
                destination: [RANK[5], FILE.d],
            });
        });

        test('O-O tells board to castle short', () => {
            chess.players.b.move('O-O');
            expect(chess.board.move).toHaveBeenNthCalledWith(1, {
                piece: { letter: 'k' },
                destination: [RANK[8], FILE.g],
            });
            expect(chess.board.move).toHaveBeenNthCalledWith(2, {
                piece: { letter: 'r', file: FILE.h },
                destination: [RANK[8], FILE.f],
            });
        });

        test('O-O-O tells board to castle short', () => {
            chess.players.b.move('O-O-O');
            expect(chess.board.move).toHaveBeenNthCalledWith(1, {
                piece: { letter: 'k' },
                destination: [RANK[8], FILE.c],
            });
            expect(chess.board.move).toHaveBeenNthCalledWith(2, {
                piece: { letter: 'r', file: FILE.a },
                destination: [RANK[8], FILE.d],
            });
        });
    });
});
