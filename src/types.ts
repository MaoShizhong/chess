export type Colour = 'white' | 'black';

type CoordinateNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Coordinate = [CoordinateNumber, CoordinateNumber];

type Piece = {};
export type Square = Piece | null;
export type Row = Square[];
