import { Player } from './players/player';
import { Players, Result } from './types';
import { Chessboard } from './board/board';
import * as FEN from './parsers/FEN';

export class Chess {
    board: Chessboard;
    players: Players;
    activePlayer: Player;
    isGameInPlay: boolean;
    result?: Result;
    #halfMoves: number;
    #fullMoves: number;

    /**
     * @throws {TypeError} If invalid FEN given
     */
    constructor(
        FENString: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    ) {
        const [
            position,
            activePlayer,
            castlingRights,
            enPassantTarget,
            halfMoves,
            fullMoves,
        ] = FEN.split(FENString);

        this.board = new Chessboard(position);
        this.players = {
            w: new Player('w', castlingRights['w'], this.board),
            b: new Player('b', castlingRights['b'], this.board),
        };
        this.activePlayer = this.players[activePlayer];
        this.isGameInPlay = this.board.canPlayContinue(
            this.activePlayer.colour
        )[0];
        this.#halfMoves = halfMoves;
        this.#fullMoves = fullMoves;
    }

    get halfMoves(): number {
        return this.#halfMoves;
    }

    get fullMoves(): number {
        return this.#fullMoves;
    }

    playMove(algebraicMove: string): void {
        if (!this.isGameInPlay) {
            return;
        }

        const [moveWasPlayed, isCaptureOrPawnMove] =
            this.activePlayer.move(algebraicMove);
        if (!moveWasPlayed) {
            return;
        }

        this.#halfMoves = isCaptureOrPawnMove ? 0 : this.#halfMoves + 1;
        this.#fullMoves += Number(this.activePlayer.colour === 'b');
        this.#swapActivePlayer();

        const [canStillPlay, gameEndReason] = this.board.canPlayContinue(
            this.activePlayer.colour
        );
        if (canStillPlay) {
            return;
        }

        this.isGameInPlay = false;
        if (gameEndReason === 'stalemate') {
            this.result = '0.5 - 0.5';
        } else if (gameEndReason === 'checkmate') {
            this.result = this.activePlayer.colour === 'w' ? '0-1' : '1-0';
        }
    }

    #swapActivePlayer(): void {
        this.activePlayer =
            this.activePlayer.colour === 'w' ? this.players.b : this.players.w;
    }
}
