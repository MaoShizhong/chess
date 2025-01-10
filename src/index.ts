import { Bishop } from './pieces/bishop';
import { King } from './pieces/king';
import { Knight } from './pieces/knight';
import { Pawn } from './pieces/pawn';
import { Queen } from './pieces/queen';
import { Rook } from './pieces/rook';
import { Row, Square } from './types';

export class Chessboard {
    static size = 8 as const;
    board: Row[];

    constructor() {
        this.board = this.#createBoard();
    }

    flip(): void {
        this.board.reverse();
        this.board.forEach((row) => row.reverse());
    }

    #createBoard(): Row[] {
        return [
            [
                new Rook('b'),
                new Knight('b'),
                new Bishop('b'),
                new Queen('b'),
                new King('b'),
                new Bishop('b'),
                new Knight('b'),
                new Rook('b'),
            ],
            Array.from({ length: Chessboard.size }, () => new Pawn('b')),
            Array(Chessboard.size).fill(null),
            Array(Chessboard.size).fill(null),
            Array(Chessboard.size).fill(null),
            Array(Chessboard.size).fill(null),
            Array.from({ length: Chessboard.size }, () => new Pawn('w')),
            [
                new Rook('w'),
                new Knight('w'),
                new Bishop('w'),
                new Queen('w'),
                new King('w'),
                new Bishop('w'),
                new Knight('w'),
                new Rook('w'),
            ],
        ];
    }
}
