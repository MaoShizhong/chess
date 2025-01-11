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
            w: new Player('w', castlingRights['w']),
            b: new Player('b', castlingRights['b']),
        };
        this.activePlayer = this.players[activePlayer];
    }
}
