import { Chessboard, FILE, RANK } from '../board/board';
import {
    Colour,
    Coordinate,
    Move,
    MoveInfo,
    PieceLetter,
    PlayerCastlingRights,
    PromotionPieceLetter,
} from '../types';
import * as algebraic from '../parsers/algebraic';

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

    move(
        destination: string
    ): [false] | [boolean, boolean, Coordinate | null, boolean] {
        if (
            (destination === 'O-O' && !this.castlingRights.short) ||
            (destination === 'O-O-O' && !this.castlingRights.long)
        ) {
            return [false];
        }

        let isPawnMove = false;
        let enPassantTarget: Coordinate | null = null;
        const { isCapture, piecesToMove } = algebraic.parse(destination);
        const isCastling = piecesToMove.length === 2;
        const movesToMake = [];

        for (const pieceToMove of piecesToMove) {
            if (isCastling) {
                pieceToMove.destination[0] =
                    this.colour === 'w' ? RANK[1] : RANK[8];
            }

            if (this.colour === 'b') {
                pieceToMove.piece.letter = <PieceLetter>(
                    pieceToMove.piece.letter.toLowerCase()
                );
                pieceToMove.promoteTo = <PromotionPieceLetter>(
                    pieceToMove.promoteTo?.toLowerCase()
                );
            }

            const [validPiece, fromRank, fromFile] = this.#findFromSquare(
                pieceToMove,
                isCapture
            );

            if (!validPiece) {
                return [false];
            }

            if (pieceToMove.piece.letter.toUpperCase() === 'P') {
                isPawnMove = true;
                const [rank, file] = pieceToMove.destination;
                const isSameFile = file === FILE[destination[0]];
                const movesTwoSquares = Math.abs(rank - fromRank) === 2;

                switch (this.colour) {
                    case 'w':
                        if (rank === RANK[4] && isSameFile && movesTwoSquares) {
                            enPassantTarget = [RANK[3], file];
                        }
                        break;
                    case 'b':
                        if (rank === RANK[5] && isSameFile && movesTwoSquares) {
                            enPassantTarget = [RANK[6], file];
                        }
                        break;
                }
            }

            const moveInfo = {
                from: [fromRank, fromFile] as Move,
                to: pieceToMove.destination,
                promoteTo: pieceToMove.promoteTo,
            };
            const boardAfterMove = this.#board.simulateMove(moveInfo);

            if (boardAfterMove.isKingInCheck(this.colour)) {
                return [false];
            }

            movesToMake.push(moveInfo);

            // don't want to mess with castling rights if a move wasn't valid to play!
            this.#handleCastlingRights(pieceToMove.piece.letter, fromFile);
        }

        for (const move of movesToMake) {
            this.#board.move(move);
        }

        return [
            piecesToMove.length > 0,
            isCapture || isPawnMove,
            enPassantTarget,
            this.#board.isKingInCheck(this.colour === 'w' ? 'b' : 'w'),
        ];
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

    #handleCastlingRights(pieceLetter: PieceLetter, fromFile: number): void {
        const upperCasePieceLetter = pieceLetter.toUpperCase();
        if (!'KR'.includes(upperCasePieceLetter)) {
            return;
        }

        if (upperCasePieceLetter === 'K') {
            this.castlingRights.short = false;
            this.castlingRights.long = false;
        } else if (fromFile === FILE.h) {
            this.castlingRights.short = false;
        } else if (fromFile === FILE.a) {
            this.castlingRights.long = false;
        }
    }
}
