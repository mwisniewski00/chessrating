import { Match } from "./Match";
import { Player } from "./Player";
import { ScaleConverter } from "./ScaleConverter";
import { E, g } from "./glicko2Functions";

export class MatchCalculationData {
  match: Match;
  gResult: number;
  EResult: number;

  constructor(match: Match, player: Player) {
    const opponent = ScaleConverter.scalePlayerToGlicko2(match.opponent);
    this.match = new Match(opponent, match.score);
    this.gResult = g(opponent.ratingDeviation);
    this.EResult = E(
      player.rating,
      opponent.rating,
      opponent.ratingDeviation,
      this.gResult
    );
  }
}
