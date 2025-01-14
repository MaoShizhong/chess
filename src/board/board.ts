import { Colour, Move, Row, SameDirectionMoves } from '../types';
import * as FEN from '../parsers/FEN';
import { Piece } from '../pieces/piece';
import { Pawn } from '../pieces/pawn';
import { King } from '../pieces/king';
import { Rook } from '../pieces/rook';

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

    getValidMoves(
        rank: number,
        file: number,
        isForCheckCount: boolean = false
    ): Move[] | null {
        const piece = this.board[rank][file];
        if (!piece) {
            return null;
        }
        const movingKing = piece instanceof King;
        const canCastle = movingKing && !piece.hasMoved;

        const validMoves: Move[] = [];
        piece.maximumMoves.forEach((direction, i, arr) => {
            // Castling moves not necessary to check for counting current checks
            // Including these leads to maximum call stack error
            const isCastlingMove =
                canCastle && i >= arr.length - 2 && !isForCheckCount;
            const isValidCastling =
                isCastlingMove &&
                this.#isValidCastlingMove(rank, file, direction[0]);

            if (isValidCastling) {
                const fileShift = direction[0][1];
                validMoves.push([rank, file + fileShift]);
            } else if (!isCastlingMove) {
                validMoves.push(
                    ...this.#getValidNormalMoves(
                        piece,
                        rank,
                        file,
                        direction,
                        isForCheckCount
                    )
                );
            }
        });
        return validMoves;
    }

    countChecks(
        activeColour: Colour,
        targetRank: number,
        targetFile: number
    ): number {
        let checks = 0;

        this.board.forEach((row, rank) => {
            row.forEach((square, file) => {
                if (square === null || square.colour === activeColour) {
                    return;
                }

                const enemyValidMoves = this.getValidMoves(rank, file, true);
                const targetSquareSeen = enemyValidMoves?.find(
                    (move) => move[0] === targetRank && move[1] === targetFile
                );

                if (targetSquareSeen) {
                    checks++;
                }
            });
        });

        return checks;
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

    #getValidNormalMoves(
        piece: Piece,
        rank: number,
        file: number,
        direction: SameDirectionMoves,
        isForCheckCount: boolean
    ): Move[] {
        const movingPawn = piece instanceof Pawn;
        const movingPiece = piece instanceof Piece && !(piece instanceof Pawn);

        const validMoves: Move[] = [];

        for (const [rankShift, fileShift] of direction) {
            const destinationRank = rank - rankShift;
            const destinationFile = file - fileShift;
            const square = this.board[destinationRank]?.[destinationFile];

            const isOwnPieceBlocking =
                square instanceof Piece && square.colour === piece.colour;
            const isEnemyPieceBlocking =
                square instanceof Piece && square.colour !== piece.colour;

            // Pawns normally can move diagonally only if an enemy piece is actually there to be captured.
            // But empty capture squares must still be counted when determining if a castling king
            // would pass through a checked square. Annoying edge cases :(
            const isCapture =
                (movingPiece && isEnemyPieceBlocking) ||
                (movingPawn &&
                    destinationFile !== file &&
                    (isEnemyPieceBlocking || isForCheckCount));
            const isJustMovement =
                (movingPiece && square === null) ||
                (movingPawn && destinationFile === file && square === null);

            // discard square and those behind in same direction
            if (isOwnPieceBlocking) {
                break;
            } else if (isJustMovement || isCapture) {
                validMoves.push([destinationRank, destinationFile]);
            }

            // piece blocking so disscard behind but still include capturable square
            if (isCapture) {
                break;
            }
        }

        return validMoves;
    }

    #isValidCastlingMove(
        rank: number,
        file: number,
        [_, fileShift]: Move
    ): boolean {
        const castlingRank = this.board[rank];
        const isShort = fileShift > 0;
        const pairedRook = isShort
            ? castlingRank[FILE.h]
            : castlingRank[FILE.a];

        if (!pairedRook || !(pairedRook instanceof Rook)) {
            return false;
        }

        const castlingSquaresCoordinates = [
            [rank, file],
            [rank, file + fileShift / 2],
            [rank, file + fileShift],
        ];
        const blockableSquares = [
            castlingRank[castlingSquaresCoordinates[1][1]],
            castlingRank[castlingSquaresCoordinates[2][1]],
        ];

        const isBlocked = blockableSquares.some(
            (square) => square instanceof Piece
        );
        const isCastlingThroughCheck = castlingSquaresCoordinates.some(
            ([squareRank, squareFile]) =>
                this.countChecks(pairedRook.colour, squareRank, squareFile) > 0
        );

        return !pairedRook.hasMoved && !isBlocked && !isCastlingThroughCheck;
    }
}
