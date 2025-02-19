import { Bishop } from './pieces/bishop';
import { King } from './pieces/king';
import { Knight } from './pieces/knight';
import { Pawn } from './pieces/pawn';
import { Queen } from './pieces/queen';
import { Rook } from './pieces/rook';
import { Player } from './players/player';

export type Players = {
    w: Player;
    b: Player;
};

export type Colour = 'w' | 'b';

export type Coordinate = [number, number];

export type PlayerCastlingRights = {
    short: boolean;
    long: boolean;
};
export type CastlingRights = {
    w: PlayerCastlingRights;
    b: PlayerCastlingRights;
};

export type PieceLetter =
    | 'P'
    | 'N'
    | 'B'
    | 'R'
    | 'Q'
    | 'K'
    | 'p'
    | 'n'
    | 'b'
    | 'r'
    | 'q'
    | 'k';
export type PromotionPieceLetter = Exclude<PieceLetter, 'P' | 'p' | 'K' | 'k'>;
type Piece = Pawn | Knight | Bishop | Rook | Queen | King;
export type Square = Piece | null;
export type Row = Square[];
export type Board = Row[];

export type Result = '1-0' | '0-1' | '1/2-1/2';
type StartingHistoryEntry = { FEN: string };
export type HistoryEntry = StartingHistoryEntry & {
    move: string;
    result?: Result;
};
export type History = [StartingHistoryEntry, ...HistoryEntry[]];

type FENSegmentsWithoutPosition = [
    Colour,
    CastlingRights,
    enPassantTarget: Coordinate | null,
    halfMoves: number,
    fullMoves: number,
];

export type FENSegments = [string, ...FENSegmentsWithoutPosition];
export type HistorySegments = [Board, ...FENSegmentsWithoutPosition];

export type HistoryState = {
    board: Board;
    activeColour: Colour;
    castlingRights: CastlingRights;
    enPassantTarget: Coordinate | null;
    halfMoves: number;
    fullMoves: number;
};

// Number relative to current position, not the same as CoordinateNumber
export type Move = [number, number];
// Moves organised by blockable direction to facilitate valid move filtering
export type SameDirectionMoves = Move[];
export type Moves = SameDirectionMoves[];

export type MoveInfo = {
    piece: {
        letter: PieceLetter;
        file?: number;
        rank?: number;
    };
    destination: Move;
    promoteTo?: PromotionPieceLetter;
};
export type PlayerMoveInfo = MoveInfo & { colour: Colour };
