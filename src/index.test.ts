import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { Chess } from './index';
import { Chessboard, FILE, RANK } from './board/board';

beforeEach(vi.clearAllMocks);

// https://lichess.org/analysis/fromPosition/rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR_w_KQkq_-_0_1
const STARTING_POSITION =
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

describe('Players', () => {
    it('Starts with 1 white and 1 black player', () => {
        const chess = new Chess(STARTING_POSITION);
        expect(Object.values(chess.players).length).toBe(2);
        expect(chess.players.w.colour).toBe('w');
        expect(chess.players.b.colour).toBe('b');
    });

    it("Starts on white's turn if no FEN passed in", () => {
        const chess = new Chess();
        expect(chess.activePlayer).toBe(chess.players.w);
    });

    it('Uses FEN to determine active player', () => {
        // https://lichess.org/analysis/fromPosition/r1b1kb1r/ppp2ppp/3q4/8/P2Q4/8/1PP2PPP/RNB2RK1_w_kq_-_0_11
        const chess = new Chess(
            'r1b1kb1r/ppp2ppp/3q4/8/P2Q4/8/1PP2PPP/RNB2RK1 w kq - 0 11'
        );
        expect(chess.activePlayer).toBe(chess.players.w);

        // https://lichess.org/analysis/fromPosition/r1b1k1nr/pppp1ppp/2n5/2bNp3/2B1P1Q1/8/PPPP1qPP/R1BK2NR_b_kq_-_1_6
        const chess2 = new Chess(
            'r1b1k1nr/pppp1ppp/2n5/2bNp3/2B1P1Q1/8/PPPP1qPP/R1BK2NR b kq - 1 6'
        );
        expect(chess2.activePlayer).toBe(chess2.players.b);
    });
});

describe('Move counts', () => {
    describe('Fullmoves', () => {
        it('Initialises with full move count from input FEN', () => {
            const chess1 = new Chess(STARTING_POSITION);
            expect(chess1.fullMoves).toBe(1);

            const chess2 = new Chess(
                '5r2/3kb2r/1Bpp1p2/5P2/2P1N1nP/1P6/P1P3P1/1K2R2R b - - 0 26'
            );
            expect(chess2.fullMoves).toBe(26);
        });

        it('Fullmove counter increases by 1 after a black move', () => {
            const fullMoves = 26;
            const chess = new Chess(
                `5r2/3kb2r/1Bpp1p2/5P2/2P1N1nP/1P6/P1P3P1/1K2R2R b - - 0 ${fullMoves}`
            );
            expect(chess.fullMoves).toBe(fullMoves);

            chess.playMove('Rb8');
            expect(chess.fullMoves).toBe(fullMoves + 1);
        });

        it('Does not increase fullmove counter after a white move', () => {
            const fullMoves = 57;
            const chess = new Chess(
                `4Q3/1K6/5Q2/8/6pp/7k/8/8 w - - 0 ${fullMoves}`
            );
            expect(chess.fullMoves).toBe(fullMoves);

            chess.playMove('Qc1');
            expect(chess.fullMoves).toBe(fullMoves);
        });
    });

    describe('Halfmoves', () => {
        it('Initialises with half move count from input FEN', () => {
            const chess1 = new Chess(STARTING_POSITION);
            expect(chess1.halfMoves).toBe(0);

            const chess2 = new Chess(
                'r1bqkb1r/pppppppp/2n2n2/8/8/2N2N2/PPPPPPPP/R1BQKB1R w KQkq - 4 3'
            );
            expect(chess2.halfMoves).toBe(4);
        });

        it('Halfmove counter increases by 1 after a non-capture or non-pawn move', () => {
            const halfMoves = 4;
            const chess = new Chess(
                `r1bqkb1r/pppppppp/2n2n2/8/8/2N2N2/PPPPPPPP/R1BQKB1R w KQkq - ${halfMoves} 3`
            );
            expect(chess.halfMoves).toBe(halfMoves);

            chess.playMove('Ne5');
            expect(chess.halfMoves).toBe(halfMoves + 1);
        });

        it('Resets halfmove counter after a capture or pawn move', () => {
            const halfMoves = 5;
            // pawn move
            const chess = new Chess(
                `r1bqkb1r/pppppppp/2n2n2/4N3/8/2N5/PPPPPPPP/R1BQKB1R b KQkq - ${halfMoves} 3`
            );
            expect(chess.halfMoves).toBe(halfMoves);

            chess.playMove('d5');
            expect(chess.halfMoves).toBe(0);

            // capture
            const chess2 = new Chess(
                `r1bqkb1r/pppppppp/2n2n2/4N3/8/2N5/PPPPPPPP/R1BQKB1R b KQkq - ${halfMoves} 3`
            );
            expect(chess2.halfMoves).toBe(halfMoves);

            chess2.playMove('Nxe5');
            expect(chess2.halfMoves).toBe(0);
        });
    });
});

describe('History', () => {
    it('Records played moves in history', () => {
        const chess = new Chess(STARTING_POSITION);
        chess.playMove('e4');
        expect(chess.history.currentState.board).toEqual(
            new Chess(
                'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'
            ).board.board
        );

        chess.playMove('d5');
        expect(chess.history.currentState.board).toEqual(
            new Chess(
                'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 2'
            ).board.board
        );
    });

    it('Records check move with trailing +', () => {
        // https://lichess.org/analysis/standard/8/8/8/8/8/1QK5/8/k7_w_-_-_0_1
        const chess = new Chess('8/8/8/8/8/1QK5/8/k7 w - - 0 1');
        chess.history.record = vi.fn();

        chess.playMove('Qa3');
        expect((chess.history.record as Mock).mock.calls[0][0]).toBe('Qa3+');
    });

    it('Records checkmate move with trailing #', () => {
        // https://lichess.org/analysis/standard/8/8/8/8/8/1QK5/8/k7_w_-_-_0_1
        const chess = new Chess('8/8/8/8/8/1QK5/8/k7 w - - 0 1');
        chess.history.record = vi.fn();

        chess.playMove('Qb2');
        expect((chess.history.record as Mock).mock.calls[0][0]).toBe('Qb2#');
    });

    it('Passes win result to record method if game has ended with checkmate', () => {
        // https://lichess.org/analysis/standard/8/8/8/8/8/1QK5/8/k7_w_-_-_0_1
        const chess = new Chess('8/8/8/8/8/1QK5/8/k7 w - - 0 1');
        chess.history.record = vi.fn();

        chess.playMove('Qb2');
        expect((chess.history.record as Mock).mock.calls[0][2]).toBe('1-0');
    });

    it('Passes draw result to record method if game has ended with stalemate', () => {
        // https://lichess.org/analysis/standard/8/8/8/8/8/1QK5/8/k7_w_-_-_0_1
        const chess = new Chess('8/8/8/8/8/1QK5/8/k7 w - - 0 1');
        chess.history.record = vi.fn();

        chess.playMove('Kc2');
        expect((chess.history.record as Mock).mock.calls[0][2]).toBe('1/2-1/2');
    });

    it('Does not record new history state if move not played (invalid)', () => {
        const chess = new Chess(STARTING_POSITION);
        chess.history.record = vi.fn();
        chess.playMove('Ke2');
        expect(chess.history.record).not.toHaveBeenCalled();

        chess.playMove('Rc1');
        expect(chess.history.record).not.toHaveBeenCalled();
    });

    it('Loads previous position if available', () => {
        const chess = new Chess(STARTING_POSITION);
        chess.playMove('e4');
        chess.playMove('d5');
        chess.toPreviousPosition();
        expect(chess.board).toEqual(
            new Chess(
                'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'
            ).board
        );
    });

    it('Loads next position if available', () => {
        const chess = new Chess(STARTING_POSITION);
        chess.playMove('e4');
        chess.toPreviousPosition();
        chess.toNextPosition();
        expect(chess.board).toEqual(
            new Chess(
                'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'
            ).board
        );
    });
});

describe('En passant', () => {
    it('Passes board object en passant coordinate if available', () => {
        const chess = new Chess(STARTING_POSITION);
        chess.playMove('e4');
        expect(chess.board.enPassant).toEqual([RANK[3], FILE.e]);

        chess.playMove('d5');
        expect(chess.board.enPassant).toEqual([RANK[6], FILE.d]);
    });

    it('Passes null to board object if no available en passant coordinate', () => {
        const chess = new Chess(STARTING_POSITION);
        chess.playMove('Nf3');
        expect(chess.board.enPassant).toBeNull();

        chess.playMove('g6');
        expect(chess.board.enPassant).toBeNull();
    });
});

describe('Game flow', () => {
    it('Swaps active player after a valid move is played', () => {
        const chess = new Chess(STARTING_POSITION);

        chess.playMove('e4');
        expect(chess.activePlayer).toBe(chess.players.b);

        chess.playMove('e5');
        expect(chess.activePlayer).toBe(chess.players.w);
    });

    it('Does not swap active player if an invalid move is attempted', () => {
        const chess = new Chess(STARTING_POSITION);

        chess.playMove('Ke2');
        expect(chess.activePlayer).toBe(chess.players.w);

        // still white's turn! this move isn't possible for white yet!
        chess.playMove('e5');
        expect(chess.activePlayer).toBe(chess.players.w);
    });

    it('Prevents playing moves if game has ended', () => {
        // https://lichess.org/analysis/8/8/8/8/8/1q6/2k5/K7_b_-_-_0_1
        const chess = new Chess('8/8/8/8/8/1q6/2k5/K7 b - - 0 1');
        chess.players.w.move = vi.fn();

        chess.playMove('Qb1');
        expect(chess.isGameInPlay).toBe(false);

        chess.playMove('Ka2');
        expect(chess.players.w.move).not.toHaveBeenCalled();
    });
});

describe('Results', () => {
    it('Recognises white win by checkmate', () => {
        // https://lichess.org/analysis/standard/r1bqkbnr/1ppp1ppp/p1n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR_w_KQkq_-_0_4
        const chess = new Chess(
            'r1bqkbnr/1ppp1ppp/p1n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 4'
        );
        expect(chess.result).not.toBeDefined();

        chess.playMove('Qxf7');
        expect(chess.result).toBe('1-0');
    });

    it('Recognises black win by checkmate', () => {
        // https://lichess.org/analysis/8/8/8/8/8/1q6/2k5/K7_b_-_-_0_1
        const chess = new Chess('8/8/8/8/8/1q6/2k5/K7 b - - 0 1');
        expect(chess.result).not.toBeDefined();

        chess.playMove('Qb1');
        expect(chess.result).toBe('0-1');
    });

    it('Recognises draw by stalemate', () => {
        // https://lichess.org/analysis/8/8/8/8/8/1q6/2k5/K7_b_-_-_0_1
        const chess = new Chess('8/8/8/8/8/1q6/2k5/K7 b - - 0 1');
        expect(chess.result).not.toBeDefined();

        chess.playMove('Qc4');
        expect(chess.result).toBe('1/2-1/2');
    });

    it('Recognises draw by threefold repetition', () => {
        // https://lichess.org/analysis/7k/7p/7P/7K/8/8/8/8_w_-_-_0_1
        const chess = new Chess('7k/7p/7P/7K/8/8/8/8 w - - 0 1');
        chess.playMove('Kg5');
        chess.playMove('Kg8');
        chess.playMove('Kh5');
        chess.playMove('Kh8');
        chess.playMove('Kg5');
        chess.playMove('Kg8');
        chess.playMove('Kh5');
        expect(chess.result).not.toBeDefined();
        chess.playMove('Kh8');
        expect(chess.result).toBe('1/2-1/2');
    });

    // ensures position counts are calculated only from current history
    // prevents bug where you go to previous move then replay the same move yet still end up with threefold rep
    it('Does not trigger threefold repetition when positions are repeated via overwriting moves', () => {
        // https://lichess.org/analysis/7k/7p/7P/7K/8/8/8/8_w_-_-_0_1
        const chess = new Chess('7k/7p/7P/7K/8/8/8/8 w - - 0 1');
        chess.playMove('Kg5');
        chess.playMove('Kg8');
        chess.toPreviousPosition();
        chess.playMove('Kg8');
        chess.toPreviousPosition();
        chess.playMove('Kg8');
        chess.toPreviousPosition();
        chess.playMove('Kg8');
        chess.toPreviousPosition();
        chess.playMove('Kg8');
        chess.toPreviousPosition();
        chess.playMove('Kg8');
        chess.toPreviousPosition();
        expect(chess.result).not.toBeDefined();
    });
    it('Recognises draw by reaching 100 half moves (50-move rule)', () => {
        // https://lichess.org/analysis/fromPosition/8/8/8/3R4/2r4k/5K2/5B2/8_b_-_-_98_127
        const chess = new Chess('8/8/8/3R4/2r4k/5K2/5B2/8 b - - 98 127');
        chess.playMove('Kh3');
        expect(chess.result).not.toBeDefined();
        chess.playMove('Rh5');
        expect(chess.result).toBe('1/2-1/2');
    });
});

describe('Constructing from PGN', () => {
    it('Constructs full game state inc. history from PGN string', () => {
        // https://lichess.org/analysis/standard/8/8/8/8/8/1QK5/8/k7
        const chess = new Chess(
            '[FEN "8/8/8/8/8/1QK5/8/k7 w - - 0 1"]\n\n1. Qb4 Ka2 2. Qb5 Ka1',
            { isPGN: true }
        );
        // https://lichess.org/analysis/standard/8/8/8/1Q6/8/2K5/8/k7_w_-_-_4_3
        expect(chess.board.board).toEqual(
            new Chessboard('8/8/8/1Q6/8/2K5/8/k7', {
                w: { short: false, long: false },
                b: { short: false, long: false },
            }).board
        );
        expect(chess.activePlayer.colour).toBe('w');
        expect(chess.halfMoves).toBe(4);
        expect(chess.history.length).toBe(5);

        // https://lichess.org/analysis/standard/r1bq1knr/pppp1ppp/2n5/2b1p3/2B1P1Q1/2N5/PPPP1PPP/R1B1K1NR_w_KQ_-_6_5
        const chess2 = new Chess(
            '[FEN "r1bq1knr/pppp1ppp/2n5/2b1p3/2B1P1Q1/2N5/PPPP1PPP/R1B1K1NR w KQ - 6 5"]\n\n5. Qf3',
            { isPGN: true }
        );
        // https://lichess.org/analysis/fromPosition/r1bq1knr/pppp1ppp/2n5/2b1p3/2B1P3/2N2Q2/PPPP1PPP/R1B1K1NR
        expect(chess2.board.board).toEqual(
            new Chessboard(
                'r1bq1knr/pppp1ppp/2n5/2b1p3/2B1P3/2N2Q2/PPPP1PPP/R1B1K1NR',
                {
                    w: { short: true, long: true },
                    b: { short: false, long: false },
                }
            ).board
        );
        expect(chess2.activePlayer.colour).toBe('b');
        expect(chess2.halfMoves).toBe(7);
        expect(chess2.history.length).toBe(2);
    });
});

describe('Serialising to PGN', () => {
    it('Serialises full game to PGN', () => {
        const chess = new Chess(STARTING_POSITION);
        chess.playMove('e4');
        chess.playMove('e5');
        chess.playMove('d4');
        expect(chess.toPGN()).toBe('1. e4 e5 2. d4');

        const chess2 = new Chess(
            'rnb1kbnr/ppp1pppp/8/3q4/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 3'
        );
        chess2.playMove('Nf3');
        chess2.playMove('Bg4');
        chess2.playMove('Be2');
        expect(chess2.toPGN()).toBe(
            '[SetUp "1"]\n[FEN "rnb1kbnr/ppp1pppp/8/3q4/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 3"]\n\n3. Nf3 Bg4 4. Be2'
        );
    });

    it('Omits tag pairs from PGN if requested', () => {
        const chess = new Chess(
            'rnb1kbnr/ppp1pppp/8/3q4/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 3'
        );
        chess.playMove('Nf3');
        chess.playMove('Bg4');
        chess.playMove('Be2');
        expect(chess.toPGN({ movesOnly: true })).toBe('3. Nf3 Bg4 4. Be2');

        const chess2 = new Chess(
            'rnbqkbnr/ppp1pppp/8/3P4/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2'
        );
        chess2.playMove('Qxd5');
        chess2.playMove('Nf3');
        chess2.playMove('Bg4');
        expect(chess2.toPGN({ movesOnly: true })).toBe('2... Qxd5 3. Nf3 Bg4');
    });
});

describe('Error reporting', () => {
    it('Throws if provided PGN contains invalid moves', () => {
        expect(() => new Chess('1. e4 e5 2. e5', { isPGN: true })).toThrow(
            'Invalid PGN - could not play e5'
        );

        expect(() => new Chess('1. e7', { isPGN: true })).toThrow(
            'Invalid PGN - could not play e7'
        );
    });

    it('Returns null and played moved if move successfully played', () => {
        const chess = new Chess(STARTING_POSITION);
        const e4Result = chess.playMove('e4');
        expect(e4Result).toEqual([null, 'e4']);

        const e5Result = chess.playMove('e5');
        expect(e5Result).toEqual([null, 'e5']);
    });

    it('Returns error if move not played', () => {
        const chess = new Chess(STARTING_POSITION);
        const [Kd1Error] = chess.playMove('Kd1');
        expect(Kd1Error?.message).toBe('Kd1 is not a valid move');

        // https://lichess.org/analysis/8/8/8/8/2k5/1q6/8/K7_w_-_-_0_1
        const chess2 = new Chess('8/8/8/8/2k5/1q6/8/K7 w - - 0 1');
        const [Kb1Error] = chess2.playMove('Kb1');
        expect(Kb1Error?.message).toBe('Kb1 is not a valid move');
    });
});
