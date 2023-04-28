import { Player } from "./Player";

export type Score = 0 | 0.5 | 1;

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
