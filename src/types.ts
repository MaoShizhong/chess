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

export type Move = [number, number];

export type MoveInfo = {
    piece: {
        letter: PieceLetter;
        file?: number;
        rank?: number;
    };
    destination: Move;
};
export type PlayerMoveInfo = MoveInfo & { colour: Colour };
