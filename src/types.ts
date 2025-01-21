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

export type Result = '1-0' | '0-1' | '0.5 - 0.5';

type CoordinateNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Coordinate = [CoordinateNumber, CoordinateNumber];

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
type Piece = Pawn | Knight | Bishop | Rook | Queen | King;
export type Square = Piece | null;
export type Row = Square[];
export type Board = Row[];

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
};
export type PlayerMoveInfo = MoveInfo & { colour: Colour };
