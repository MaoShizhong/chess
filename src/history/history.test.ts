import { describe, expect, it } from 'vitest';
import { ChessHistory } from './history';
import { Chessboard, FILE, RANK } from '../board/board';

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const STARTING_CASTLING = {
    w: { short: true, long: true },
    b: { short: true, long: true },
};
const startingState = {
    board: new Chessboard(STARTING_FEN.split(' ')[0]).board,
    activeColour: 'w',
    castlingRights: STARTING_CASTLING,
    enPassantTarget: null,
    halfMoves: 0,
    fullMoves: 1,
};
const stateAfterE4 = {
    board: new Chessboard('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR')
        .board,
    activeColour: 'b',
    castlingRights: STARTING_CASTLING,
    enPassantTarget: null,
    halfMoves: 0,
    fullMoves: 1,
};
const stateAfterNf3 = {
    board: new Chessboard('rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R')
        .board,
    activeColour: 'b',
    castlingRights: STARTING_CASTLING,
    enPassantTarget: null,
    halfMoves: 1,
    fullMoves: 1,
};
const stateAfterE4D6 = {
    board: new Chessboard('rnbqkbnr/ppp1pppp/3p4/8/4P3/8/PPPP1PPP/RNBQKBNR')
        .board,
    activeColour: 'w',
    castlingRights: STARTING_CASTLING,
    enPassantTarget: null,
    halfMoves: 0,
    fullMoves: 2,
};

describe('State', () => {
    it('Gets current history state', () => {
        const history = new ChessHistory(STARTING_FEN);
        expect(history.currentState).toEqual(startingState);
    });

    it('Appends a new history state when currently at latest state', () => {
        const history = new ChessHistory(STARTING_FEN);
        const { board } = history.currentState;
        const e2Pawn = board[RANK[2]][FILE.e];
        board[RANK[4]][FILE.e] = e2Pawn;
        board[RANK[2]][FILE.e] = null;

        history.record(
            board,
            'b',
            {
                w: { short: true, long: true },
                b: { short: true, long: true },
            },
            null,
            0,
            1
        );

        expect(history.currentState).toEqual(stateAfterE4);
        expect(history.length).toBe(2);

        const d7Pawn = board[RANK[7]][FILE.d];
        board[RANK[6]][FILE.d] = d7Pawn;
        board[RANK[7]][FILE.d] = null;
        history.record(
            board,
            'w',
            {
                w: { short: true, long: true },
                b: { short: true, long: true },
            },
            null,
            0,
            2
        );

        expect(history.currentState).toEqual(stateAfterE4D6);
        expect(history.length).toBe(3);
    });

    it('Moves to and returns previous history state if available', () => {
        const history = new ChessHistory(STARTING_FEN);
        const { board } = history.currentState;
        const e2Pawn = board[RANK[2]][FILE.e];
        board[RANK[4]][FILE.e] = e2Pawn;
        board[RANK[2]][FILE.e] = null;

        history.record(
            board,
            'b',
            {
                w: { short: true, long: true },
                b: { short: true, long: true },
            },
            null,
            0,
            1
        );

        expect(history.toPreviousState()).toEqual(startingState);
    });

    it('Returns current history state if already at first state', () => {
        const history = new ChessHistory(STARTING_FEN);
        expect(history.toPreviousState()).toEqual(startingState);
    });

    it('Moves to and returns next history state if available', () => {
        const history = new ChessHistory(STARTING_FEN);
        const { board } = history.currentState;
        const e2Pawn = board[RANK[2]][FILE.e];
        board[RANK[4]][FILE.e] = e2Pawn;
        board[RANK[2]][FILE.e] = null;

        history.record(
            board,
            'b',
            {
                w: { short: true, long: true },
                b: { short: true, long: true },
            },
            null,
            0,
            1
        );

        history.toPreviousState();

        expect(history.toNextState()).toEqual(stateAfterE4);
    });

    it('Returns current history state if already at last state', () => {
        const history = new ChessHistory(STARTING_FEN);
        expect(history.toNextState()).toEqual(startingState);
    });

    it('Overwrites any future states when recording after moving to previous state', () => {
        const history = new ChessHistory(STARTING_FEN);
        const { board } = history.currentState;
        const { board: boardCopy } = history.currentState;
        const e2Pawn = board[RANK[2]][FILE.e];
        board[RANK[4]][FILE.e] = e2Pawn;
        board[RANK[2]][FILE.e] = null;

        history.record(
            board,
            'b',
            {
                w: { short: true, long: true },
                b: { short: true, long: true },
            },
            null,
            0,
            1
        );

        expect(history.currentState).toEqual(stateAfterE4);
        expect(history.length).toBe(2);

        history.toPreviousState();
        expect(history.currentState).toEqual(startingState);

        const g1Knight = boardCopy[RANK[1]][FILE.g];
        boardCopy[RANK[3]][FILE.f] = g1Knight;
        boardCopy[RANK[1]][FILE.g] = null;

        history.record(
            boardCopy,
            'b',
            {
                w: { short: true, long: true },
                b: { short: true, long: true },
            },
            null,
            1,
            1
        );

        expect(history.currentState).toEqual(stateAfterNf3);
        expect(history.toPreviousState()).toEqual(startingState);
        expect(history.length).toBe(2);
    });
});
