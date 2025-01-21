import { describe, expect, it } from 'vitest';
import { Chess } from './index';

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
});
