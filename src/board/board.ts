import { Move, Row, SameDirectionMoves } from '../types';
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

    getValidMoves(rank: number, file: number): Move[] | null {
        const piece = this.board[rank][file];
        if (!piece) {
            return null;
        }
        const movingKing = piece instanceof King;
        const canCastle = movingKing && !piece.hasMoved;

        const validMoves: Move[] = [];
        piece.maximumMoves.forEach((direction, i, arr) => {
            const isCastlingMove = canCastle && i >= arr.length - 2;

            if (
                isCastlingMove &&
                this.#isValidCastlingMove(rank, file, direction[0])
            ) {
                const fileShift = direction[0][1];
                validMoves.push([rank, file + fileShift]);
            } else if (!isCastlingMove) {
                validMoves.push(
                    ...this.#getValidNormalMoves(piece, rank, file, direction)
                );
            }
        });
        return validMoves;
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
        direction: SameDirectionMoves
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

            const isCapture =
                (movingPiece && isEnemyPieceBlocking) ||
                (movingPawn &&
                    destinationFile !== file &&
                    isEnemyPieceBlocking);
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

    #isValidCastlingMove(rank: number, file: number, move: Move): boolean {
        const castlingRank = this.board[rank];
        const isShort = move[1] > 0;
        const pairedRook = isShort
            ? castlingRank[FILE.h]
            : castlingRank[FILE.a];

        if (!pairedRook) {
            return false;
        }

        const isBlocked =
            castlingRank[file + move[1] / 2] instanceof Piece ||
            castlingRank[file + move[1]] instanceof Piece;

        return !(pairedRook as Rook).hasMoved && !isBlocked;
    }
}
