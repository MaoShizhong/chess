# Chess

A Node-playable chessboard written in TypeScript. Can be created from a FEN or PGN string, and can be serialised to FEN or PGN.

## Install

```bash
npm install chess-ts
```

## Usage

```javascript
// CJS
const { Chess } = require('chess-ts');

// ESM
import { Chess } from 'chess-ts';

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
```

## Methods

### constructor(startingState?: string, opts?: { isPGN: boolean })

Will throw if the resulting FEN string is invalid (e.g. not a 8x8 board position, missing segments etc.).

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

### playMove(move: string): void

Makes the active player play the provided algebraic notation move if possible.

### toPreviousPosition(): Chess

Moves history back one position if available, and loads all position details (e.g. active player, half moves etc.) of that position. Mutates instance and returns `this`.

### toNextPosition(): Chess

Moves history forward one position if available, and loads all position details (e.g. active player, half moves etc.) of that position. Mutates instance and returns `this`.

### toPGN(): string

Serialises full game history to a string in PGN format.

### toFEN(): string

Serialises current position to a string in FEN format.
