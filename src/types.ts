import { Bishop } from './pieces/bishop';
import { King } from './pieces/king';
import { Knight } from './pieces/knight';
import { Pawn } from './pieces/pawn';
import { Queen } from './pieces/queen';
import { Rook } from './pieces/rook';

export type Colour = 'w' | 'b';

type CoordinateNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Coordinate = [CoordinateNumber, CoordinateNumber];

export type PieceLetter = 'P' | 'N' | 'B' | 'R' | 'Q' | 'K';
type Piece = Pawn | Knight | Bishop | Rook | Queen | King;
export type Square = Piece | null;
export type Row = Square[];

export type Move = [number, number];
