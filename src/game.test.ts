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

it('Continues from a game midway', () => {
    // https://lichess.org/analysis/standard/r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR_b_KQkq_-_3_3
    const chess = new Chess(
        'r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 3 3'
    );
    chess.playMove({ from: 'g7', to: 'g6' });
    chess.playMove({ from: 'h5', to: 'f3' });
    chess.playMove('Nf6');
    chess.playMove('Ne2');
    chess.playMove('Bc5');
    chess.playMove({ from: 'e1', to: 'g1' });
    chess.playMove({ from: 'f6', to: 'e4' });
    chess.playMove({ from: 'f3', to: 'f7' }); // checkmate, white wins

    expect(chess.toPGN()).toBe(
        '[SetUp "1"]\n[FEN "r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 3 3"]\n\n3... g6 4. Qf3 Nf6 5. Ne2 Bc5 6. O-O Nxe4 7. Qxf7# 1-0'
    );
    expect(chess.toFEN()).toBe(
        'r1bqk2r/pppp1Q1p/2n3p1/2b1p3/2B1n3/8/PPPPNPPP/RNB2RK1 b kq - 0 7'
    );
});
