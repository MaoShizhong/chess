import { Row } from '../types';
import * as FEN from '../parsers/FEN';

export class Chessboard {
    board: Row[];

    constructor(FENPosition: string) {
        this.board = this.#createBoard(FENPosition);
    }

    flip(): void {
        this.board.reverse();
        this.board.forEach((row) => row.reverse());
    }

    #createBoard(position: string): Row[] {
        const FENRows = position.split('/');
        return FENRows.map((FENRow) => FEN.toChessRow(FENRow));
    }
}
