import { Colour, Row, Square } from './types';

export class Chessboard {
    static size = 8 as const;
    board: Row[];

    constructor(playerColour: Colour = 'white') {
        this.board = this.#createBoard(playerColour);
    }

    #createBoard(playerColour: Colour): Row[] {
        const board: Row[] = [];
        for (let i = 0; i < Chessboard.size; i++) {
            const row: Row = Array<Square>(Chessboard.size).fill(null);
            board.push(row);
        }
        return board;
    }
}
