import { describe, expect, it } from 'vitest';
import * as PGN from './PGN';
import { History } from '../types';

const e4: History = [
    { FEN: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' },
    {
        FEN: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
        move: 'e4',
    },
];
const e4e5: History = [
    ...e4,
    {
        FEN: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
        move: 'e5',
    },
];
const e4e5_d4: History = [
    ...e4e5,
    {
        FEN: 'rnbqkbnr/pppp1ppp/8/4p3/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2',
        move: 'd4',
    },
];
const e4e5_d4exd4_c3dxc3_Nxc3: History = [
    ...e4e5_d4,
    {
        FEN: 'rnbqkbnr/pppp1ppp/8/8/3pP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3',
        move: 'exd4',
    },
    {
        FEN: 'rnbqkbnr/pppp1ppp/8/8/3pP3/2P5/PP3PPP/RNBQKBNR b KQkq - 0 3',
        move: 'c3',
    },
    {
        FEN: 'rnbqkbnr/pppp1ppp/8/8/4P3/2p5/PP3PPP/RNBQKBNR w KQkq - 0 4',
        move: 'dxc3',
    },
    {
        FEN: 'rnbqkbnr/pppp1ppp/8/8/4P3/2N5/PP3PPP/R1BQKBNR b KQkq - 0 4',
        move: 'Nxc3',
    },
];
const midGameStart: History = [
    {
        FEN: 'rn1qkbnr/pp2ppp1/2p5/3pPb1p/3P3P/8/PPP2PP1/RNBQKBNR w KQkq - 0 5',
    },
];
const midGameStart_Bg5Qb6: History = [
    ...midGameStart,
    {
        FEN: 'rn1qkbnr/pp2ppp1/2p5/3pPbBp/3P3P/8/PPP2PP1/RN1QKBNR b KQkq - 1 5',
        move: 'Bg5',
    },
    {
        FEN: 'rn2kbnr/pp2ppp1/1qp5/3pPbBp/3P3P/8/PPP2PP1/RN1QKBNR w KQkq - 2 6',
        move: 'Qb6',
    },
];
const checksMoves: History = [
    { FEN: '8/8/8/8/3b4/2k5/8/K1N5 w - - 0 1' },
    { FEN: '8/8/8/8/3b4/2k5/N7/K7 b - - 1 1', move: 'Na2+' },
    { FEN: '8/8/8/8/3b4/3k4/N7/K7 w - - 2 2', move: 'Kd3+' },
];
const lastMovePosition: History = [
    {
        FEN: '8/8/8/8/8/1QK5/8/k7 w - - 0 1',
    },
];
const checkmate: History = [
    ...lastMovePosition,
    { FEN: '8/8/8/8/8/2K5/1Q6/k7 b - - 1 1', move: 'Qb2#', result: '1-0' },
];
const stalemate: History = [
    ...lastMovePosition,
    { FEN: '8/8/8/8/8/1Q6/2K5/k7 b - - 1 1', move: 'Kc2', result: '1/2-1/2' },
];

describe('Serialising', () => {
    it('Serialises single move from white', () => {
        expect(PGN.serialise(e4)).toBe('1. e4');
    });

    it('Serialises black move in same full move number as white', () => {
        expect(PGN.serialise(e4e5)).toBe('1. e4 e5');
    });

    it('Increments move number for each new white move', () => {
        expect(PGN.serialise(e4e5_d4)).toBe('1. e4 e5 2. d4');
    });

    it('Serialises multiple moves', () => {
        expect(PGN.serialise(e4e5_d4exd4_c3dxc3_Nxc3)).toBe(
            '1. e4 e5 2. d4 exd4 3. c3 dxc3 4. Nxc3'
        );
    });

    it('Includes setup and FEN tag pairs when history starts with non-standard FEN', () => {
        expect(
            PGN.serialise(midGameStart).startsWith(
                '[SetUp "1"]\n[FEN "rn1qkbnr/pp2ppp1/2p5/3pPb1p/3P3P/8/PPP2PP1/RNBQKBNR w KQkq - 0 5"]'
            )
        ).toBe(true);
    });

    it('Serialises moves following a non-standard starting FEN', () => {
        expect(PGN.serialise(midGameStart_Bg5Qb6).split('\n').at(-1)).toBe(
            '1. Bg5 Qb6'
        );
    });

    it('Serialises check moves with a trailing +', () => {
        expect(PGN.serialise(checksMoves).split('\n').at(-1)).toBe(
            '1. Na2+ Kd3+'
        );
    });

    it('Serialises checkmate move with a trailing #', () => {
        expect(PGN.serialise(checkmate).split('\n').at(-1)).toContain(
            '1. Qb2#'
        );
    });

    it('Appends result if game is over', () => {
        expect(PGN.serialise(checkmate).endsWith('1-0')).toBe(true);
        expect(PGN.serialise(stalemate).endsWith('1/2-1/2')).toBe(true);
    });
});

describe('Starting position', () => {
    it('Extracts starting FEN position if tag pair present', () => {
        expect(
            PGN.getStartingFEN(
                '[FEN "8/8/8/8/8/1QK5/8/k7 w - - 0 1"]\n\n1. Qb4 Ka2 2. Qb5 Ka1'
            )
        ).toBe('8/8/8/8/8/1QK5/8/k7 w - - 0 1');

        expect(
            PGN.getStartingFEN(
                '[FEN "rnbqkbnr/pp2pppp/2p5/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3"]\n\n3... c5 4. dxc5 Nc6 5. Bb5 e6'
            )
        ).toBe('rnbqkbnr/pp2pppp/2p5/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3');
    });

    it('Returns standard starting FEN position if no FEN tag pair present', () => {
        expect(PGN.getStartingFEN('1. e4 e5 2. Nc3 Nc6')).toBe(
            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
        );
    });
});

describe('Extracting moves', () => {
    it('Gets moves from PGN string', () => {
        expect(
            PGN.getMoves(
                '[FEN "8/8/8/8/8/1QK5/8/k7 w - - 0 1"]\n\n1. Qb4 Ka2 2. Qb5 Ka1'
            )
        ).toEqual(['Qb4', 'Ka2', 'Qb5', 'Ka1']);

        expect(
            PGN.getMoves(
                '[FEN "rnbqkbnr/pp2pppp/2p5/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3"]\n\n3... c5 4. dxc5 Nc6 5. Bb5 e6'
            )
        ).toEqual(['c5', 'dxc5', 'Nc6', 'Bb5', 'e6']);
    });
});
