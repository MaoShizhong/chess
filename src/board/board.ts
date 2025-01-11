import { Row } from '../types';
import * as FEN from '../parsers/FEN';

// Infinity to make ranks 1-indexed
export const RANK = [Infinity, 7, 6, 5, 4, 3, 2, 1, 0];
export const FILE: {
    [key: string]: number;
} = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 };

export class Chessboard {
    board: Row[];

    constructor(FENPosition: string) {
        this.board = this.#createBoard(FENPosition);
    }

    move(): void {}

    flip(): void {
        this.board.reverse();
        this.board.forEach((row) => row.reverse());
    }

    #createBoard(position: string): Row[] {
        const FENRows = position.split('/');
        return FENRows.map((FENRow) => FEN.toChessRow(FENRow));
    }
}
