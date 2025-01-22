import { describe, expect, it } from 'vitest';
import { ChessHistory } from './history';
import { Chessboard, FILE, RANK } from '../board/board';

describe('State', () => {
    const STARTING_STATE =
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const startingState = [
        new Chessboard(STARTING_STATE.split(' ')[0]).board,
        'w',
        { w: { short: true, long: true }, b: { short: true, long: true } },
    ];
    const stateAfterE4 = [
        new Chessboard('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR').board,
        'b',
        { w: { short: true, long: true }, b: { short: true, long: true } },
    ];
    const stateAfterNf3 = [
        new Chessboard('rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R').board,
        'b',
        { w: { short: true, long: true }, b: { short: true, long: true } },
    ];
    const stateAfterE4D6 = [
        new Chessboard('rnbqkbnr/ppp1pppp/3p4/8/4P3/8/PPPP1PPP/RNBQKBNR').board,
        'w',
        { w: { short: true, long: true }, b: { short: true, long: true } },
    ];

    it('Gets current history state', () => {
        const history = new ChessHistory(STARTING_STATE);
        expect(history.currentState).toEqual(startingState);
    });

    it('Appends a new history state when currently at latest state', () => {
        const history = new ChessHistory(STARTING_STATE);
        const board = history.currentState[0];
        const e2Pawn = board[RANK[2]][FILE.e];
        board[RANK[4]][FILE.e] = e2Pawn;
        board[RANK[2]][FILE.e] = null;

        history.record(board, 'b', {
            w: { short: true, long: true },
            b: { short: true, long: true },
        });

        expect(history.currentState).toEqual(stateAfterE4);

        const d7Pawn = board[RANK[7]][FILE.d];
        board[RANK[6]][FILE.d] = d7Pawn;
        board[RANK[7]][FILE.d] = null;
        history.record(board, 'w', {
            w: { short: true, long: true },
            b: { short: true, long: true },
        });

        expect(history.currentState).toEqual(stateAfterE4D6);
    });

    it('Moves to and returns previous history state if available', () => {
        const history = new ChessHistory(STARTING_STATE);
        const board = history.currentState[0];
        const e2Pawn = board[RANK[2]][FILE.e];
        board[RANK[4]][FILE.e] = e2Pawn;
        board[RANK[2]][FILE.e] = null;

        history.record(board, 'b', {
            w: { short: true, long: true },
            b: { short: true, long: true },
        });

        expect(history.toPreviousState()).toEqual(startingState);
    });

    it('Returns current history state if already at first state', () => {
        const history = new ChessHistory(STARTING_STATE);
        expect(history.toPreviousState()).toEqual(startingState);
    });

    it('Moves to and returns next history state if available', () => {
        const history = new ChessHistory(STARTING_STATE);
        const board = history.currentState[0];
        const e2Pawn = board[RANK[2]][FILE.e];
        board[RANK[4]][FILE.e] = e2Pawn;
        board[RANK[2]][FILE.e] = null;

        history.record(board, 'b', {
            w: { short: true, long: true },
            b: { short: true, long: true },
        });

        history.toPreviousState();

        expect(history.toNextState()).toEqual(stateAfterE4);
    });

    it('Returns current history state if already at last state', () => {
        const history = new ChessHistory(STARTING_STATE);
        expect(history.toNextState()).toEqual(startingState);
    });

    it('Overwrites any future states when recording after moving to previous state', () => {
        const history = new ChessHistory(STARTING_STATE);
        const board = history.currentState[0];
        const boardCopy = history.currentState[0];
        const e2Pawn = board[RANK[2]][FILE.e];
        board[RANK[4]][FILE.e] = e2Pawn;
        board[RANK[2]][FILE.e] = null;

        history.record(board, 'b', {
            w: { short: true, long: true },
            b: { short: true, long: true },
        });

        expect(history.currentState).toEqual(stateAfterE4);
        history.toPreviousState();
        expect(history.currentState).toEqual(startingState);

        const g1Knight = boardCopy[RANK[1]][FILE.g];
        boardCopy[RANK[3]][FILE.f] = g1Knight;
        boardCopy[RANK[1]][FILE.g] = null;

        history.record(boardCopy, 'b', {
            w: { short: true, long: true },
            b: { short: true, long: true },
        });

        expect(history.currentState).toEqual(stateAfterNf3);
        expect(history.toPreviousState()).toEqual(startingState);
    });
});
