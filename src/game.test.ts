import { expect, it } from 'vitest';
import { Chess } from '.';

it('Plays a full game', () => {
    const chess = new Chess();
    chess.playMove('e4');
    chess.playMove('e5');
    chess.playMove('Bc4');
    chess.playMove('Nc6');

    expect(chess.toPGN()).toBe('1. e4 e5 2. Bc4 Nc6');
    expect(chess.toFEN()).toBe(
        'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3'
    );

    chess.playMove('Qh5');
    chess.playMove('a6');
    chess.playMove('Qxf7'); // checkmate, white wins

    expect(chess.toPGN()).toBe('1. e4 e5 2. Bc4 Nc6 3. Qh5 a6 4. Qxf7# 1-0');
    expect(chess.toFEN()).toBe(
        'r1bqkbnr/1ppp1Qpp/p1n5/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4'
    );
});

it('Prevents post-game-end moves being played', () => {
    const chess = new Chess();
    chess.playMove('e4');
    chess.playMove('e5');
    chess.playMove('Bc4');
    chess.playMove({ from: 'b8', to: 'c6' });
    chess.playMove('Qh5');
    chess.playMove('a6');
    chess.playMove('Qxf7'); // checkmate, white wins

    chess.playMove('Ke7');
    chess.playMove({ from: 'f2', to: 'f4' });

    expect(chess.toPGN()).toBe('1. e4 e5 2. Bc4 Nc6 3. Qh5 a6 4. Qxf7# 1-0');
    expect(chess.toFEN()).toBe(
        'r1bqkbnr/1ppp1Qpp/p1n5/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4'
    );
});

it('Allows post-game-end moves to be played only if overwriting past moves', () => {
    // https://lichess.org/analysis/8/7k/5KQ1/8/8/8/8/8_b_-_-_0_1
    const chess = new Chess('8/7k/5KQ1/8/8/8/8/8 b - - 0 1');
    chess.playMove('Kh8');
    chess.playMove('Qg7'); // checkmate - white wins
    expect(chess.result).toBe('1-0');
    expect(chess.toPGN()).toBe(
        '[SetUp "1"]\n[FEN "8/7k/5KQ1/8/8/8/8/8 b - - 0 1"]\n\n1... Kh8 2. Qg7# 1-0'
    );
    expect(chess.toFEN()).toBe('7k/6Q1/5K2/8/8/8/8/8 b - - 2 2');

    chess.toPreviousPosition();
    chess.playMove('Kf7'); // stalemate!
    expect(chess.result).toBe('1/2-1/2');
    expect(chess.toPGN()).toBe(
        '[SetUp "1"]\n[FEN "8/7k/5KQ1/8/8/8/8/8 b - - 0 1"]\n\n1... Kh8 2. Kf7 1/2-1/2'
    );
    expect(chess.toFEN()).toBe('7k/5K2/6Q1/8/8/8/8/8 b - - 2 2');

    chess.toPreviousPosition();
    chess.playMove('Qg5');
    expect(chess.result).not.toBeDefined();
    expect(chess.toPGN()).toBe(
        '[SetUp "1"]\n[FEN "8/7k/5KQ1/8/8/8/8/8 b - - 0 1"]\n\n1... Kh8 2. Qg5'
    );
    expect(chess.toFEN()).toBe('7k/8/5K2/6Q1/8/8/8/8 b - - 2 2');
});

it('Continues from a game midway', () => {
    // https://lichess.org/analysis/fromPosition/rnbqk1nr/ppp2ppp/8/4P3/1bP5/4p3/PP1B1PPP/RN1QKBNR_w_KQkq_-_0_6
    const chess = new Chess(
        'rnbqk1nr/ppp2ppp/8/4P3/1bP5/4p3/PP1B1PPP/RN1QKBNR w KQkq - 0 6'
    );

    chess.playMove({ from: 'd2', to: 'b4' });
    chess.playMove({ from: 'f7', to: 'f5' }); // test en passant
    chess.playMove({ from: 'e5', to: 'f6' });
    chess.playMove({ from: 'e3', to: 'f2' });
    chess.playMove('Ke2');
    chess.playMove({ from: 'f2', to: 'g1', promoteTo: 'N' });
    chess.playMove('Kf2');
    chess.playMove({ from: 'd8', to: 'd1' });
    chess.playMove('Kxg1');
    chess.playMove({ from: 'd1', to: 'd4' }); // checkmate, black wins

    expect(chess.toPGN()).toBe(
        '[SetUp "1"]\n[FEN "rnbqk1nr/ppp2ppp/8/4P3/1bP5/4p3/PP1B1PPP/RN1QKBNR w KQkq - 0 6"]\n\n6. Bxb4 f5 7. exf6 exf2+ 8. Ke2 fxg1=N+ 9. Kf2 Qxd1 10. Kxg1 Qd4# 0-1'
    );
    expect(chess.toFEN()).toBe(
        'rnb1k1nr/ppp3pp/5P2/8/1BPq4/8/PP4PP/RN3BKR w kq - 1 11'
    );
});

it('Plays an amazing game', () => {
    const chess = new Chess();
    chess.playMove('e4');
    chess.playMove('e5');
    chess.playMove('Ke2');
    chess.playMove('Ke7');
    chess.playMove('Ke1');
    chess.playMove('Ke8');
    chess.playMove('Ke2');
    chess.playMove('Ke7');
    chess.playMove('Ke1');
    chess.playMove('Ke8'); // threefold repetition!
    chess.playMove('Ke2'); // threefold repetition!

    expect(chess.toPGN()).toBe(
        '1. e4 e5 2. Ke2 Ke7 3. Ke1 Ke8 4. Ke2 Ke7 5. Ke1 Ke8 1/2-1/2'
    );
    expect(chess.toFEN()).toBe(
        'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w - - 8 6'
    );
});
