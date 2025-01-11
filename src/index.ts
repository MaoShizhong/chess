import { Player } from './players/player';
import { Players, Row } from './types';
import * as FEN from './FEN/parser';

export class Chessboard {
    board: Row[];
    activePlayer: Player;
    players: Players;

    /**
     * @throws {TypeError} If invalid FEN given
     */
    constructor(
        FENString: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq'
    ) {
        const [position, activePlayer, castlingRights] = FEN.split(FENString);

        this.players = {
            w: new Player('w', castlingRights['w']),
            b: new Player('b', castlingRights['b']),
        };
        this.activePlayer = this.players[activePlayer];
        this.board = this.#createBoard(position);
    }

    flip(): void {
        this.board.reverse();
        this.board.forEach((row) => row.reverse());
    }

    #createBoard(position: string): Row[] {
        const FENRows = position.split('/');
        return FENRows.map((FENRow) => FEN.toChessRow(FENRow));
    }
}
