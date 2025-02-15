import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Chess } from './index';
import { ChessHistory } from './history/history';

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
                'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1'
            ).board.board
        );

        chess.playMove('d5');
        expect(chess.history.currentState.board).toEqual(
            new Chess(
                'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2'
            ).board.board
        );
    });

    it('Does not record new history state if move not played (invalid)', () => {
        const chess = new Chess(STARTING_POSITION);
        chess.history.record = vi.fn();
        chess.playMove('Ke2');
        expect(chess.history.record).not.toHaveBeenCalled();

        chess.playMove('Rc1');
        expect(chess.history.record).not.toHaveBeenCalled();
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
        expect(chess.result).toBe('0.5 - 0.5');
    });
});
