import { Player } from "./Player";
import { Score } from "./types";

export class Match {
  opponent: Player;
  score: Score;
  g: number;
  E: number;

  constructor(opponent: Player, score: Score) {
    this.opponent = opponent;
    this.score = score;
  }
}
