# Chess

A Node-playable chessboard written in TypeScript. Can be created from a FEN or PGN string, and can be serialised to FEN or PGN.

## Install

```bash
npm install @maoshizhong/chess
```

## Usage

```javascript
// CJS
const { Chess } = require('@maoshizhong/chess');

// ESM
import { Chess } from '@maoshizhong/chess';

// Start with standard chessboard
const chess = new Chess();

// Start from specified position via FEN
const chessFromFEN = new Chess(
    'rnb1kbnr/pp2pppp/8/2pq4/3P4/2P5/PP3PPP/RNBQKBNR b KQkq - 0 4'
);

// Construct from PGN (with full history)
const chessFromPGN = new Chess(
    `
    [FEN "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 2 3"]

    3. Bc4 Bc5 4. Qg4 Kf8 5. Qf3 Nf6 6. Nge2 d6 7. h3
    `,
    { isPGN: true }
);

// Play moves - player switching/castling rights handled automatically
chess.playMove('e4');
chess.playMove('e5');
chess.playMove('d4');
chess.playMove('exd4');

// Instead of algebraic moves, moves can be passed as "from" coordinate and "to" coordinate
chess.playMove({ from: 'g1', to: 'f3' });
chess.playMove({ from: 'b8', to: 'c6' });
chess.playMove({ from: 'b1', to: 'd2' });

// Get the PGN
console.log(chess.toPGN()); // 1. e4 e5 2. d4 exd4 3. Nf3 Nc6 4. Nbd2
// Get the current position's FEN
console.log(chess.toFEN()); // r1bqkbnr/pppp1ppp/2n5/8/3pP3/5N2/PPPN1PPP/R1BQKB1R b KQkq - 3 4
```

## Methods

### constructor(startingState?: string, opts?: { isPGN: boolean })

Will throw if given PGN and it contains an invalid move, or the resulting starting FEN string is invalid (e.g. not a 8x8 board position, missing segments etc.).

#### startingState (optional)

FEN or PGN string. If omitted, will start with a standard starting position.

#### opts.isPGN (optional; default = false)

A boolean - if true, will parse the provided string as PGN. Otherwise, will parse it as FEN.

### (get) halfMoves: number

Returns half move count for current position.

### (get) fullMoves: number

Returns full move count for current position.

### (get) castlingRights: { w: { short: boolean, long: boolean }, b: { short: boolean, long: boolean } }

Returns current castling rights for each player.

### result: '1-0' | '0-1' | '1/2-1/2' | undefined

Returns the game's current result (based on the latest position).

### playMove(move: string | { from: string, to: string, promoteTo?: string }): \[Error | null, string\]

Makes the active player play the provided move if possible. Returns an array with an Error object and empty string if unsuccessful, or null and played algebraic move if successful.

Moves can be provided as a full algebraic move as a string (e.g. 'e4' / 'Nf3' / 'Bxc6' / 'O-O') or as an object with a "from" coordinate and "to" coordinate, given in algebraic notation (e.g. { from: 'e1', to: 'g1' }), with an optional promotion letter (only Q/R/B/N are accepted). If given as an object, the resulting algebraic move will automatically include any castling, capture or disambiguating information. If a promotion letter is provided, it will only be used for pawn moves to the corresponding promotion rank.

### toNthPosition(n: number): Chess

Moves to specified history state (0-indexed) if available, and loads all position details (e.g. active player, half moves etc.) of that position. Sets latest position if n is greater or equal to the history length, and sets first position if n is less than 0. Mutates instance and returns `this`.

### toPreviousPosition(): Chess

Moves history back one position if available, and loads all position details (e.g. active player, half moves etc.) of that position. Mutates instance and returns `this`.

### toNextPosition(): Chess

Moves history forward one position if available, and loads all position details (e.g. active player, half moves etc.) of that position. Mutates instance and returns `this`.

### toPGN(opts: { movesOnly: boolean }): string

Serialises full game history to a string in PGN format.

#### opts.movesOnly (optional; default: false)

A boolean - if true, will omit tag pairs from the PGN. If there is a game result, it will not be omitted.

### toFEN(): string

Serialises current (not necessarily latest) position to a string in FEN format.
