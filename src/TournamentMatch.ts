import { Score } from "./types";
import { TournamentPlayer } from "./TournamentPlayer";

export class TournamentMatch {
  player1: TournamentPlayer;
  player2: TournamentPlayer;
  score: Score;

  constructor(
    player1: TournamentPlayer,
    player2: TournamentPlayer,
    score: Score
  ) {
    this.player1 = player1;
    this.player2 = player2;
    this.score = score;
  }
}
