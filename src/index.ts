import { Player } from './players/player';
import {
    CastlingRights,
    HistorySegments,
    HistoryState,
    Players,
    Result,
} from './types';
import { Chessboard } from './board/board';
import * as FEN from './parsers/FEN';
import * as PGN from './parsers/PGN';
import { ChessHistory } from './history/history';

export class Chess {
    history: ChessHistory;
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
        startingState: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        { isPGN } = { isPGN: false }
    ) {
        const FENString = isPGN
            ? PGN.getStartingFEN(startingState)
            : startingState;
        const [
            position,
            activePlayer,
            castlingRights,
            enPassantTarget,
            halfMoves,
            fullMoves,
        ] = FEN.split(FENString);

        this.history = new ChessHistory(FENString);
        this.board = new Chessboard(position, castlingRights, enPassantTarget);
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

        if (isPGN) {
            this.#constructFromPGN(startingState);
        }
    }

    get halfMoves(): number {
        return this.#halfMoves;
    }

    get fullMoves(): number {
        return this.#fullMoves;
    }

    get castlingRights(): CastlingRights {
        return {
            w: this.players.w.castlingRights,
            b: this.players.b.castlingRights,
        };
    }

    playMove(algebraicMove: string): void {
        if (!this.isGameInPlay) {
            return;
        }

        const [
            moveWasPlayed,
            isCaptureOrPawnMove,
            enPassantTarget,
            checksOpponent,
        ] = this.activePlayer.move(algebraicMove);
        if (!moveWasPlayed) {
            return;
        }

        this.#halfMoves = isCaptureOrPawnMove ? 0 : this.#halfMoves + 1;
        this.#fullMoves += Number(this.activePlayer.colour === 'b');
        this.board.enPassant = enPassantTarget;
        this.#swapActivePlayer();

        const historyToSerialiseToFEN: HistorySegments = [
            this.board.board,
            this.activePlayer.colour,
            this.castlingRights,
            enPassantTarget,
            this.#halfMoves,
            this.#fullMoves,
        ];

        let isThreefoldRepetition = false;
        const [canStillPlay, gameEndReason] = this.board.canPlayContinue(
            this.activePlayer.colour
        );
        if (canStillPlay) {
            this.history.record(
                checksOpponent ? `${algebraicMove}+` : algebraicMove,
                historyToSerialiseToFEN
            );

            isThreefoldRepetition = this.history.isThreefoldRepetition();
            if (this.#halfMoves < 100 && !isThreefoldRepetition) {
                return;
            }
        }

        this.isGameInPlay = false;
        if (
            gameEndReason === 'stalemate' ||
            this.#halfMoves >= 100 ||
            isThreefoldRepetition
        ) {
            this.result = '1/2-1/2';
        } else if (gameEndReason === 'checkmate') {
            this.result = this.activePlayer.colour === 'w' ? '0-1' : '1-0';
        }

        // Move that led to draw by 50-move rule or threefold rep already recorded
        if (!canStillPlay) {
            this.history.record(
                gameEndReason === 'checkmate'
                    ? `${algebraicMove}#`
                    : algebraicMove,
                historyToSerialiseToFEN,
                this.result
            );
        }
    }

    toPreviousPosition(): Chess {
        this.#loadPosition(this.history.toPreviousState());
        return this;
    }

    toNextPosition(): Chess {
        this.#loadPosition(this.history.toNextState());
        return this;
    }

    #loadPosition({
        board,
        activeColour,
        castlingRights,
        enPassantTarget,
        halfMoves,
        fullMoves,
    }: HistoryState): void {
        this.board.board.length = 0;
        this.board.board.push(...board);
        this.board.enPassant = enPassantTarget;
        this.players.w.castlingRights = castlingRights.w;
        this.players.b.castlingRights = castlingRights.b;
        this.activePlayer = this.players[activeColour];
        this.#halfMoves = halfMoves;
        this.#fullMoves = fullMoves;
    }

    #swapActivePlayer(): void {
        this.activePlayer =
            this.activePlayer.colour === 'w' ? this.players.b : this.players.w;
    }

    #constructFromPGN(PGNString: string): void {
        const moves = PGN.getMoves(PGNString);
        for (const move of moves) {
            this.playMove(move);
        }
    }
}
