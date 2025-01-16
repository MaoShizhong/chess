import { beforeEach, describe, expect, it, test, vi } from 'vitest';
import { Chess } from '..';
import { RANK, FILE } from '../board/board';

beforeEach(vi.clearAllMocks);

describe('Move', () => {
    describe('Number of pieces moved', () => {
        // https://lichess.org/analysis/standard/r2qkb1r/ppp2ppp/2n2n2/1B2pb2/3P1B2/2N2N2/PPP1Q1PP/R3K2R_w_KQkq_-_1_10
        const chess = new Chess(
            'r2qkb1r/ppp2ppp/2n2n2/1B2pb2/3P1B2/2N2N2/PPP1Q1PP/R3K2R w KQkq - 1 10'
        );
        chess.board.move = vi.fn();

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

    describe('Valid move call details (White)', () => {
        // https://lichess.org/analysis/standard/1nkr2n1/2ppp3/8/2b5/2N1Q2Q/8/PPB5/1N1K3Q_w_-_-_0_1
        const chess = new Chess(
            '1nkr2n1/2ppp3/8/2b5/2N1Q2Q/8/PPB5/1N1K3Q w - - 0 1'
        );
        chess.board.move = vi.fn();

        test('a3 tells board to move piece on a2 to a3', () => {
            chess.players.w.move('a3');
            expect(chess.board.move).toHaveBeenCalledWith({
                from: [RANK[2], FILE.a],
                to: [RANK[3], FILE.a],
            });
        });

        test('a4 tells board to move piece on a2 to a4', () => {
            chess.players.w.move('a4');
            expect(chess.board.move).toHaveBeenCalledWith({
                from: [RANK[2], FILE.a],
                to: [RANK[4], FILE.a],
            });
        });

        test('Bc4 tells board to move piece on c2 to b3', () => {
            chess.players.w.move('Bb3');
            expect(chess.board.move).toHaveBeenCalledWith({
                from: [RANK[2], FILE.c],
                to: [RANK[3], FILE.b],
            });
        });

        test('Ncd2 tells board to move piece on c4 to d2', () => {
            chess.players.w.move('Ncd2');
            expect(chess.board.move).toHaveBeenCalledWith({
                from: [RANK[4], FILE.c],
                to: [RANK[2], FILE.d],
            });
        });

        test('Qh4e1 tells board to move piece on h4 to e1', () => {
            chess.players.w.move('Qh4e1');
            expect(chess.board.move).toHaveBeenCalledWith({
                from: [RANK[4], FILE.h],
                to: [RANK[1], FILE.e],
            });
        });
    });

    describe('Valid move call details (Black)', () => {
        // https://lichess.org/analysis/standard/r3k2r/3p4/8/8/8/8/8/R3K3_w_Qkq_-_0_1
        const chess = new Chess('r3k2r/3p4/8/8/8/8/8/R3K3 w Qkq - 0 1');
        chess.board.move = vi.fn();

        test('d5 tells board to move piece on d7 to d5', () => {
            chess.players.b.move('d5');
            expect(chess.board.move).toHaveBeenCalledWith({
                from: [RANK[7], FILE.d],
                to: [RANK[5], FILE.d],
            });
        });

        test('O-O tells board to move piece on e8 to g8, then on h8 to f8', () => {
            chess.players.b.move('O-O');
            expect(chess.board.move).toHaveBeenNthCalledWith(1, {
                from: [RANK[8], FILE.e],
                to: [RANK[8], FILE.g],
            });
            expect(chess.board.move).toHaveBeenNthCalledWith(2, {
                from: [RANK[8], FILE.h],
                to: [RANK[8], FILE.f],
            });
        });

        test('O-O-O tells board to move piece on e8 to c8, then on a8 to d8', () => {
            chess.players.b.move('O-O-O');
            expect(chess.board.move).toHaveBeenNthCalledWith(1, {
                from: [RANK[8], FILE.e],
                to: [RANK[8], FILE.c],
            });
            expect(chess.board.move).toHaveBeenNthCalledWith(2, {
                from: [RANK[8], FILE.a],
                to: [RANK[8], FILE.d],
            });
        });
    });
});
