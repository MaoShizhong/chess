import { Player } from './players/player';
import { Players } from './types';
import { Chessboard } from './board/board';
import * as FEN from './parsers/FEN';

export class Chess {
    board: Chessboard;
    players: Players;
    activePlayer: Player;

    /**
     * @throws {TypeError} If invalid FEN given
     */
    constructor(
        FENString: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq'
    ) {
        const [position, activePlayer, castlingRights] = FEN.split(FENString);

        this.board = new Chessboard(position);
        this.players = {
            w: new Player('w', castlingRights['w'], this.board),
            b: new Player('b', castlingRights['b'], this.board),
        };
        this.activePlayer = this.players[activePlayer];
    }

    playMove(algebraicMove: string): void {
        const moveWasPlayed = this.activePlayer.move(algebraicMove);
        if (moveWasPlayed) {
            this.#swapActivePlayer();
        }
    }

    #swapActivePlayer(): void {
        this.activePlayer =
            this.activePlayer.colour === 'w' ? this.players.b : this.players.w;
    }
}
