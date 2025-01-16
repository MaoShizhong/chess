import { Chessboard, RANK } from '../board/board';
import {
    Colour,
    Move,
    MoveInfo,
    PieceLetter,
    PlayerCastlingRights,
} from '../types';
import * as algebraic from '../parsers/algebraic';
import * as FEN from '../parsers/FEN';

export class Player {
    colour: Colour;
    castlingRights: PlayerCastlingRights;
    #board: Chessboard;

    constructor(
        colour: Colour,
        castlingRights: PlayerCastlingRights,
        board: Chessboard
    ) {
        this.colour = colour;
        this.castlingRights = castlingRights;
        this.#board = board;
    }

    move(destination: string): void {
        const { isCapture, piecesToMove } = algebraic.parse(destination);
        const isCastling = piecesToMove.length === 2;

        for (const pieceToMove of piecesToMove) {
            if (isCastling) {
                pieceToMove.destination[0] =
                    this.colour === 'w' ? RANK[1] : RANK[8];
            }
            if (this.colour === 'b') {
                pieceToMove.piece.letter = <PieceLetter>(
                    pieceToMove.piece.letter.toLowerCase()
                );
            }

            const [validPiece, fromRank, fromFile] = this.#findFromSquare(
                pieceToMove,
                isCapture
            );

            if (!validPiece) {
                return;
            }

            const moveInfo = {
                from: [fromRank, fromFile] as Move,
                to: pieceToMove.destination,
            };
            const willPutKingInCheck = this.#simulateMove(
                FEN.serialisePosition(this.#board.board),
                moveInfo
            );

            if (willPutKingInCheck) {
                return;
            }

            this.#board.move(moveInfo);
        }
    }

    #findFromSquare(
        { piece, destination }: MoveInfo,
        isCapture: boolean
    ): [boolean, ...Move] {
        const squares: Move[] = [];
        this.#board.board.forEach((row, rank) => {
            row.forEach((square, file) => {
                if (square === null || square.letter !== piece.letter) {
                    return;
                }

                const pieceValidMoves = this.#board.getValidMoves({
                    rank,
                    file,
                    isCapture,
                });
                const pieceCanSeeDestination = pieceValidMoves?.some(
                    (validMove) =>
                        validMove[0] === destination[0] &&
                        validMove[1] === destination[1]
                );

                if (pieceCanSeeDestination) {
                    squares.push([rank, file]);
                }
            });
        });

        if (squares.length === 1) {
            return [true, ...squares[0]];
        }

        const fromSquare = squares.find((square) => {
            if (piece.rank && piece.file) {
                return square[0] === piece.rank && square[1] === piece.file;
            }
            return square[0] === piece?.rank || square[1] === piece?.file;
        });

        return fromSquare ? [true, ...fromSquare] : [false, 0, 0];
    }

    #simulateMove(
        FENPosition: string,
        moveInfo: { from: Move; to: Move }
    ): boolean {
        const board = new Chessboard(FENPosition);
        board.move(moveInfo);
        return board.isKingInCheck(this.colour);
    }
}
