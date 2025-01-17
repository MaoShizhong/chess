import { afterEach, beforeEach, describe, expect, it, test, vi } from 'vitest';
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

    describe('Non-captures', () => {
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

            test('Ncd2 tells board to move piece on c4 to d2 (disambiguates by file)', () => {
                chess.players.w.move('Ncd2');
                expect(chess.board.move).toHaveBeenCalledWith({
                    from: [RANK[4], FILE.c],
                    to: [RANK[2], FILE.d],
                });
            });

            test('Q4h3 tells board to move piece on h4 to h3 (disambiguates by rank)', () => {
                chess.players.w.move('Q4h3');
                expect(chess.board.move).toHaveBeenCalledWith({
                    from: [RANK[4], FILE.h],
                    to: [RANK[3], FILE.h],
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

        describe('Invalid moves', () => {
            // https://lichess.org/analysis/standard/rnbqk2r/2ppp1p1/1p2P2p/1B6/8/pP3p2/P1PP1PPP/R3K1NR_w_KQkq_-_0_6
            const chess = new Chess(
                'rnbqk2r/2ppp1p1/1p2P2p/1B6/8/pP3p2/P1PP1PPP/R3K1NR w KQkq - 0 6'
            );
            chess.board.move = vi.fn();

            it('Does not call Board.prototype.move if no valid piece moves available', () => {
                // destination blocked
                chess.players.w.move('a3');
                expect(chess.board.move).not.toHaveBeenCalled();

                // piece doesn't exist
                chess.players.w.move('Qc1');
                expect(chess.board.move).not.toHaveBeenCalled();

                // castling not available
                chess.players.b.move('O-O-O');
                expect(chess.board.move).not.toHaveBeenCalled();
            });

            it('Does not consider diagonal pawn moves as valid if non-capturing move', () => {
                chess.players.w.move('f3');
                expect(chess.board.move).not.toHaveBeenCalled();
            });

            it('Does not allow a move if it would put own king in check', () => {
                // white's pawn on e6 sees f7
                chess.players.b.move('Kf7');
                expect(chess.board.move).not.toHaveBeenCalled();

                // d7 pawn pinned by white's b5 bishop
                chess.players.b.move('d6');
                expect(chess.board.move).not.toHaveBeenCalled();
            });
        });

        describe('Under check', () => {
            // https://lichess.org/analysis/3k4/8/4q3/8/8/8/2N5/4K3_w_-_-_0_1
            const chess = new Chess('3k4/8/4q3/8/8/8/2N5/4K3 w - - 0 1');
            chess.board.move = vi.fn();

            it('Allows king move if it will stop check', () => {
                chess.players.w.move('Kf1');
                expect(chess.board.move).toHaveBeenCalled();
            });

            it('Allows non-king move if it will stop check (blocking single check)', () => {
                chess.players.w.move('Ne3');
                expect(chess.board.move).toHaveBeenCalled();
            });
        });
    });

    describe('Captures', () => {
        describe('Valid captures', () => {
            // https://lichess.org/analysis/standard/1rb1k3/p2ppp2/B1n2n2/2p4p/N3N3/1p2PQ2/P4P2/R3K2R_w_KQ_-_0_1
            const chess = new Chess(
                '1rb1k3/p2ppp2/B1n2n2/2p4p/N3N3/1p2PQ2/P4P2/R3K2R w KQ - 0 1'
            );
            chess.board.move = vi.fn();

            test('axb3 tells pawn on a2 to capture on b3', () => {
                chess.players.w.move('axb3');
                expect(chess.board.move).toHaveBeenCalledWith({
                    from: [RANK[2], FILE.a],
                    to: [RANK[3], FILE.b],
                });
            });

            test('Bxc8 tells bishop on a6 to capture on c8', () => {
                chess.players.w.move('Bxc8');
                expect(chess.board.move).toHaveBeenCalledWith({
                    from: [RANK[6], FILE.a],
                    to: [RANK[8], FILE.c],
                });
            });

            it('Disambiguates between multiple piece types if multiple can capture', () => {
                chess.players.w.move('Qxf6');
                expect(chess.board.move).toHaveBeenCalledWith({
                    from: [RANK[3], FILE.f],
                    to: [RANK[6], FILE.f],
                });
            });

            it('Disambiguates between two pieces of same type if both can capture', () => {
                chess.players.w.move('Naxc5');
                expect(chess.board.move).toHaveBeenCalledWith({
                    from: [RANK[4], FILE.a],
                    to: [RANK[5], FILE.c],
                });
            });
        });

        describe('Invalid captures', () => {
            // https://lichess.org/analysis/standard/1rb2k2/p2pp1R1/B1n2n1P/2p5/N2br1N1/1p2PQ2/P4P2/4K2R_w_K_-_0_1
            const chess = new Chess(
                '1rb2k2/p2pp1R1/B1n2n1P/2p5/N2br1N1/1p2PQ2/P4P2/4K2R w K - 0 1'
            );
            chess.board.move = vi.fn();

            it('Does not call Board.prototype.move if capture is not valid', () => {
                // No knight can take on b3
                chess.players.w.move('Nxb3');
                expect(chess.board.move).not.toHaveBeenCalled();

                // No piece to capture on b7
                chess.players.w.move('Bxc7');
                expect(chess.board.move).not.toHaveBeenCalled();

                // Can't capture own colour piece
                chess.players.b.move('Kxe7');
                expect(chess.board.move).not.toHaveBeenCalled();
            });

            it('Does not allow a capture if it would put own king in check', () => {
                // pawn pinned by black rook on e4
                chess.players.w.move('exd4');
                expect(chess.board.move).not.toHaveBeenCalled();

                // knight pinned by white's queen on f3
                chess.players.b.move('Nxg4');
                expect(chess.board.move).not.toHaveBeenCalled();

                // white h6 pawn protects g7 rook
                chess.players.b.move('Kxg7');
                expect(chess.board.move).not.toHaveBeenCalled();
            });
        });

        describe('Under check', () => {
            it('Allows non-king capture if it will stop check (capturing single check)', () => {
                // https://lichess.org/analysis/3k4/8/8/8/1b6/8/2N5/4K3_w_-_-_0_1
                const chess = new Chess('3k4/8/8/8/1b6/8/2N5/4K3 w - - 0 1');
                chess.board.move = vi.fn();

                chess.players.w.move('Nxb4');
                expect(chess.board.move).toHaveBeenCalled();
            });

            it('Prevents non-king capture if it will not stop check (under double check)', () => {
                // https://lichess.org/analysis/3k4/8/4q3/8/8/8/2N5/4K3_w_-_-_0_1
                const chess = new Chess('3k4/8/4q3/8/1b6/8/2N5/4K3 w - - 0 1');
                chess.board.move = vi.fn();

                chess.players.w.move('Nxb4');
                expect(chess.board.move).not.toHaveBeenCalled();
            });
        });
    });
});

describe('Castling rights', () => {
    // https://lichess.org/analysis/standard/r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R_w_KQkq_-_0_1
    const chess = new Chess(
        'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1'
    );
    chess.board.move = vi.fn();

    afterEach(() => {
        for (const player of Object.values(chess.players)) {
            player.castlingRights = { short: true, long: true };
            expect(player.castlingRights).toEqual({ short: true, long: true });
        }
    });

    it('Permits castling for both players both ways at the start of a normal game', () => {
        for (const player of Object.values(chess.players)) {
            expect(player.castlingRights).toEqual({ short: true, long: true });
        }
    });

    it("Removes a player's castling rights both ways after castling", () => {
        chess.players.w.move('O-O');
        expect(chess.players.w.castlingRights).toEqual({
            short: false,
            long: false,
        });

        chess.players.b.move('O-O-O');
        expect(chess.players.b.castlingRights).toEqual({
            short: false,
            long: false,
        });
    });

    it("Removes a player's castling rights both ways after moving king normally", () => {
        chess.players.w.move('Kf1');
        expect(chess.players.w.castlingRights).toEqual({
            short: false,
            long: false,
        });

        chess.players.b.move('Kd8');
        expect(chess.players.b.castlingRights).toEqual({
            short: false,
            long: false,
        });
    });

    it("Removes a player's short castling rights after a moving h-rook", () => {
        chess.players.w.move('Rg1');
        expect(chess.players.w.castlingRights).toEqual({
            short: false,
            long: true,
        });

        chess.players.b.move('Rg8');
        expect(chess.players.b.castlingRights).toEqual({
            short: false,
            long: true,
        });
    });

    it("Removes a player's long castling rights after a moving a-rook", () => {
        chess.players.w.move('Rd1');
        expect(chess.players.w.castlingRights).toEqual({
            short: true,
            long: false,
        });

        chess.players.b.move('Rc8');
        expect(chess.players.b.castlingRights).toEqual({
            short: true,
            long: false,
        });
    });

    it('Only changes castling rights if the move was actually played (valid moves only)', () => {
        // blocked by pawn
        chess.players.w.move('Ke2');
        expect(chess.players.w.castlingRights).toEqual({
            short: true,
            long: true,
        });

        // king on e8
        chess.players.b.move('Re8');
        expect(chess.players.b.castlingRights).toEqual({
            short: true,
            long: true,
        });
    });
});
