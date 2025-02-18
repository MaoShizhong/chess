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
});
