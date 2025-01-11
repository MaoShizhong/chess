import { describe, expect, it } from 'vitest';
import { Chess } from './index';

describe('Players', () => {
    it('Starts with 1 white and 1 black player', () => {
        const chess = new Chess(
            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
        );
        expect(Object.values(chess.players).length).toBe(2);
        expect(chess.players.w.colour).toBe('w');
        expect(chess.players.b.colour).toBe('b');
    });

    it("Starts on white's turn if no FEN passed in", () => {
        const chess = new Chess(
            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
        );
        expect(chess.activePlayer).toBe(chess.players.w);
    });

    it('Uses FEN to determine active player', () => {
        const chess = new Chess(
            'r1b1kb1r/ppp2ppp/3q4/8/P2Q4/8/1PP2PPP/RNB2RK1 w kq - 0 11'
        );
        expect(chess.activePlayer).toBe(chess.players.w);

        const chess2 = new Chess(
            'r1b1k1nr/pppp1ppp/2n5/2bNp3/2B1P1Q1/8/PPPP1qPP/R1BK2NR b kq - 1 6'
        );
        expect(chess2.activePlayer).toBe(chess2.players.b);
    });
});
