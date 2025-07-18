import {
    History,
    HistoryEntry,
    HistorySegments,
    HistoryState,
    Result,
} from '../types';
import * as FEN from '../parsers/FEN';
import * as PGN from '../parsers/PGN';
import { Chessboard } from '../board/board';

export class ChessHistory {
    #currentIndex: number;
    #history: History;

    constructor(FENState: string) {
        this.#currentIndex = 0;
        this.#history = [{ FEN: FENState }];
    }

    get length(): number {
        return this.#history.length;
    }

    get isAtLatest(): boolean {
        return this.#currentIndex === this.length - 1;
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

    toNthState(n: number): HistoryState {
        if (0 <= n && n < this.length) {
            this.#currentIndex = n;
        } else if (n < 0) {
            this.#currentIndex = 0;
        } else {
            this.#currentIndex = this.length - 1;
        }

        return this.currentState;
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
        this.#currentIndex++;

        // If gone back some states and recording new state, overwrite "future" states
        this.#history.splice(this.#currentIndex, Infinity, {
            FEN: FENState,
            move: move,
            result: result,
        });
    }

    markAsDraw(): void {
        (this.#history[this.length - 1] as HistoryEntry).result = '1/2-1/2';
    }

    isThreefoldRepetition(): boolean {
        return Object.values(this.#positionCounts).some((count) => count === 3);
    }

    toPGN(movesOnly: boolean): string {
        return PGN.serialise(this.#history, movesOnly);
    }

    get #positionCounts(): Record<string, number> {
        const counts: Record<string, number> = {};

        this.#history.forEach((entry) => {
            const FENPosition = entry.FEN.split(' ')[0];
            counts[FENPosition] = counts[FENPosition] + 1 || 1;
        });

        return counts;
    }
}
