import { Board, CastlingRights, Colour, HistoryState } from '../types';
import * as FEN from '../parsers/FEN';
import { Chessboard } from '../board/board';

export class ChessHistory {
    #currentIndex: number;
    #history: string[];

    constructor(FENState: string) {
        this.#currentIndex = 0;
        this.#history = [FENState];
    }

    get currentState(): HistoryState {
        const [FENPosition, activePlayer, castlingRights] = FEN.split(
            this.#history[this.#currentIndex]
        );
        return [
            new Chessboard(FENPosition).board,
            activePlayer,
            castlingRights,
        ];
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

    record(
        board: Board,
        activeColour: Colour,
        castlingRights: CastlingRights
    ): void {
        const FENState = FEN.serialise(board, activeColour, castlingRights);
        this.#currentIndex++;

        // If gone back some states and recording new state, overwrite "future" states
        this.#history.splice(this.#currentIndex, Infinity, FENState);
    }
}
