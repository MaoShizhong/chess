import { History, HistorySegments, HistoryState, Result } from '../types';
import * as FEN from '../parsers/FEN';
import * as PGN from '../parsers/PGN';
import { Chessboard } from '../board/board';

export class ChessHistory {
    #currentIndex: number;
    #history: History;
    #positionCounts: { [key: string]: number };

    constructor(FENState: string) {
        this.#currentIndex = 0;
        this.#history = [{ FEN: FENState }];
        this.#positionCounts = { [FENState.split(' ')[0]]: 1 };
    }

    get length(): number {
        return this.#history.length;
    }

    get currentState(): HistoryState {
        return this.getState(this.#currentIndex);
    }

    get currentFEN(): string {
        return this.#history[this.#currentIndex].FEN;
    }

    getState(index: number): HistoryState {
        const [
            FENPosition,
            activeColour,
            castlingRights,
            enPassantTarget,
            halfMoves,
            fullMoves,
        ] = FEN.split(this.#history[index].FEN);
        const board = new Chessboard(FENPosition, castlingRights).board;

        return {
            board,
            activeColour,
            castlingRights,
            enPassantTarget,
            halfMoves,
            fullMoves,
        };
    }

    toPreviousState(): HistoryState {
        const hasPreviousState = this.#currentIndex > 0;
        if (hasPreviousState) {
            this.#currentIndex--;
        }

        return this.currentState;
    }

    toNextState(): HistoryState {
        const hasNextGridState = this.#currentIndex < this.#history.length - 1;
        if (hasNextGridState) {
            this.#currentIndex++;
        }

        return this.currentState;
    }

    record(move: string, toSerialise: HistorySegments, result?: Result): void {
        const FENState = FEN.serialise(...toSerialise);
        const FENPosition = FENState.split(' ')[0];
        this.#positionCounts[FENPosition] =
            (this.#positionCounts[FENPosition] ?? 0) + 1;
        this.#currentIndex++;

        // If gone back some states and recording new state, overwrite "future" states
        this.#history.splice(this.#currentIndex, Infinity, {
            FEN: FENState,
            move: move,
            result: result,
        });
    }

    isThreefoldRepetition(): boolean {
        return Object.values(this.#positionCounts).some((count) => count === 3);
    }

    toPGN(): string {
        return PGN.serialise(this.#history);
    }
}
