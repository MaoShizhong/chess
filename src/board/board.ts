import {
    Board,
    CastlingRights,
    Colour,
    Coordinate,
    Move,
    SameDirectionMoves,
} from '../types';
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
    board: Board;
    enPassant: Coordinate | null;

    constructor(
        FENPosition: string,
        castlingRights: CastlingRights = {
            w: { short: true, long: true },
            b: { short: true, long: true },
        },
        enPassantTarget: Coordinate | null = null
    ) {
        this.board = this.#createBoard(FENPosition, castlingRights);
        this.enPassant = enPassantTarget;
    }

    getValidMoves({
        rank,
        file,
        isCapture = true,
        isForFindingChecks = false,
    }: {
        rank: number;
        file: number;
        isCapture?: boolean;
        isForFindingChecks?: boolean;
    }): Move[] | null {
        const piece = this.board[rank][file];
        if (!piece) {
            return null;
        }
        const movingKing = piece instanceof King;
        const canCastle = movingKing && !piece.hasMoved;

        const validMoves: Move[] = [];
        piece.maximumMoves.forEach((direction, i, arr) => {
            // Castling moves not necessary to check when seeing if a square is currently in check
            // Including these leads to maximum call stack error
            const isCastlingMove =
                canCastle && i >= arr.length - 2 && !isForFindingChecks;
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
                        isCapture,
                        isForFindingChecks
                    )
                );
            }
        });
        return validMoves;
    }

    isSquareInCheck(
        activeColour: Colour,
        targetRank: number,
        targetFile: number
    ): boolean {
        return this.board.some((row, rank) => {
            return row.some((square, file) => {
                if (square === null || square.colour === activeColour) {
                    return false;
                }

                const enemyValidMoves = this.getValidMoves({
                    rank,
                    file,
                    isCapture: true,
                    isForFindingChecks: true,
                });
                const isTargetSquareSeen = enemyValidMoves?.find(
                    (move) => move[0] === targetRank && move[1] === targetFile
                );
                return isTargetSquareSeen;
            });
        });
    }

    isKingInCheck(colour: Colour): boolean {
        const kingRank = this.board.findIndex((row) =>
            row.find(
                (square) => square instanceof King && square.colour === colour
            )
        );
        const kingFile = this.board[kingRank].findIndex(
            (square) => square instanceof King && square.colour === colour
        );
        return this.isSquareInCheck(colour, kingRank, kingFile);
    }

    canPlayContinue(
        activeColour: Colour
    ): [boolean, 'checkmate' | 'stalemate' | undefined] {
        const inCheck = this.isKingInCheck(activeColour);
        const movesAvailable: { from: Move; to: Move }[] = [];

        this.board.forEach((row, rank) => {
            row.forEach((square, file) => {
                if (square === null || square.colour !== activeColour) {
                    return;
                }

                const moves = this.getValidMoves({
                    rank: rank,
                    file: file,
                });

                if (moves?.length) {
                    movesAvailable.push(
                        ...moves.map((move) => ({
                            from: [rank, file] as Move,
                            to: move,
                        }))
                    );
                }
            });
        });

        const validMovesAvailable = movesAvailable.filter((move) => {
            const boardAfterMove = this.simulateMove(move);
            return !boardAfterMove.isKingInCheck(activeColour);
        });

        if (inCheck && !validMovesAvailable.length) {
            return [false, 'checkmate'];
        } else if (!inCheck && !validMovesAvailable.length) {
            return [false, 'stalemate'];
        } else {
            return [true, undefined];
        }
    }

    move({ from, to }: { from: Move; to: Move }): void {
        const [fromRank, fromFile] = from;
        const [toRank, toFile] = to;

        const movedPiece = this.board[fromRank][fromFile];

        this.board[toRank][toFile] = movedPiece;
        this.board[fromRank][fromFile] = null;

        if (movedPiece instanceof King || movedPiece instanceof Pawn) {
            movedPiece.hasMoved = true;
        }
    }

    simulateMove(moveInfo: { from: Move; to: Move }): Chessboard {
        const board = new Chessboard(FEN.serialisePosition(this.board));
        board.move(moveInfo);
        return board;
    }

    flip(): void {
        this.board.reverse();
        this.board.forEach((row) => row.reverse());
    }

    #createBoard(position: string, castlingRights: CastlingRights): Board {
        const FENRows = position.split('/');
        const board = FENRows.map((FENRow) => FEN.toChessRow(FENRow));

        board.forEach((row, rank) => {
            row.forEach((square, file) => {
                if (
                    !(square instanceof Rook) &&
                    !(square instanceof King) &&
                    !(square instanceof Pawn)
                ) {
                    return;
                }

                square.hasMoved = (() => {
                    switch (square.constructor) {
                        case Pawn:
                            return (
                                (square.colour === 'w' && rank !== RANK[2]) ||
                                (square.colour === 'b' && rank !== RANK[7])
                            );
                        case King:
                            return (
                                !castlingRights[square.colour].short &&
                                !castlingRights[square.colour].long
                            );
                        case Rook:
                            return (
                                (file === FILE.a &&
                                    !castlingRights[square.colour].long) ||
                                (file === FILE.h &&
                                    !castlingRights[square.colour].short)
                            );
                        default:
                            return false;
                    }
                })();
            });
        });

        return board;
    }

    #getValidNormalMoves(
        piece: Piece,
        rank: number,
        file: number,
        direction: SameDirectionMoves,
        isCaptureAttempt: boolean,
        isForFindingChecks: boolean
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

            const isNormalCapture = movingPiece && isEnemyPieceBlocking;
            // Pawns normally can move diagonally only if an enemy piece is actually there to be captured.
            // But empty capture squares must still be counted when determining checks
            // e.g. castling through checked square, or if position is checkmate/stalemate. Annoying edge cases :(
            // They should also only be allowed to do so if a capture attempt e.g. axb3 and not just b3
            const isPawnCapture =
                movingPawn &&
                destinationFile !== file &&
                isCaptureAttempt &&
                (isEnemyPieceBlocking || isForFindingChecks);
            const isCapture = isNormalCapture || isPawnCapture;
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
                this.isSquareInCheck(pairedRook.colour, squareRank, squareFile)
        );

        return !pairedRook.hasMoved && !isBlocked && !isCastlingThroughCheck;
    }
}
