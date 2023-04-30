import { Player } from "./Player";
import { Match } from "./Match";
import { calculateDelta, calculateV, h } from "./glicko2Functions";
import { MatchCalculationData } from "./MatchCalculationData";
import { getPlayerMatches, revertScore } from "./utils";
import { TournamentMatch } from "./TournamentMatch";
import * as _ from "lodash";
import { Score } from "./types";

export default class Glicko2 {
  private tau: number;
  private v: number;
  private delta: number;
  private matches: MatchCalculationData[];
  private player: Player;
  private h: number;

  constructor(player: Player, matches: Match[], tau: number = 0.5) {
    this.tau = tau;
    this.player = player;
    this.matches = matches.map(
      (match) => new MatchCalculationData(match, player)
    );
    if (this.matches.length) {
      this.v = calculateV(this.matches);
      this.h = h(this.matches);
      this.delta = calculateDelta(this.matches, this.v, this.h);
    }
  }

  private calculateNewVolatility() {
    const a = Math.log(Math.pow(this.player.volatility, 2));
    const ratingDevationToSquare = Math.pow(this.player.ratingDeviation, 2);
    const deltaToSquare = Math.pow(this.delta, 2);
    const f = (x: number) => {
      const eToX = Math.exp(x);
      const firstNumerator =
        eToX * (deltaToSquare - ratingDevationToSquare - this.v - eToX);
      const firstDenominator =
        2 * Math.pow(ratingDevationToSquare + this.v + eToX, 2);
      const secondNumerator = x - a;
      const secondDenominator = Math.pow(this.tau, 2);
      const firstDivision = firstNumerator / firstDenominator;
      const secondDivision = secondNumerator / secondDenominator;
      return firstDivision - secondDivision;
    };
    let A = a;
    let B: number;
    if (deltaToSquare > ratingDevationToSquare + this.v) {
      B = Math.log(deltaToSquare - ratingDevationToSquare - this.v);
    } else {
      let k = 1;
      while (f(A - k * this.tau) < 0) {
        k = k + 1;
      }
      B = A - k * this.tau;
    }
    let fA = f(A);
    let fB = f(B);
    const epsilon = 0.000001;
    while (Math.abs(B - A) > epsilon) {
      const C = A + ((A - B) * fA) / (fB - fA);
      const fC = f(C);
      if (fC * fB <= 0) {
        A = B;
        fA = fB;
      } else {
        fA = fA / 2;
      }
      B = C;
      fB = fC;
    }
    return Math.exp(A / 2);
  }

  private calculatePreRatingPeriodValue(newVolatility: number) {
    return Math.sqrt(
      Math.pow(this.player.ratingDeviation, 2) + Math.pow(newVolatility, 2)
    );
  }

  private calculateNewRatingDeviation(newVolatility: number) {
    const preRatingPeriodValue =
      this.calculatePreRatingPeriodValue(newVolatility);
    return 1 / Math.sqrt(1 / Math.pow(preRatingPeriodValue, 2) + 1 / this.v);
  }

  private calculateNewRating(newRatingDeviation: number) {
    return this.player.rating + Math.pow(newRatingDeviation, 2) * this.h;
  }

  getNewValues() {
    if (!this.matches.length) {
      return {
        rating: this.player.rating,
        ratingDeviation: this.calculatePreRatingPeriodValue(
          this.player.volatility
        ),
        volatility: this.player.volatility,
      };
    }
    const newVolatility = this.calculateNewVolatility();
    const newRatingDeviation = this.calculateNewRatingDeviation(newVolatility);
    const newRating = this.calculateNewRating(newRatingDeviation);
    return {
      rating: newRating,
      ratingDeviation: newRatingDeviation,
      volatility: newVolatility,
    };
  }

  static executeMatch(player1: Player, player2: Player, result: Score) {
    const player1Match = new Match(player2, result);
    const player2Match = new Match(player1, revertScore(result));
    player1.executeMatches([player1Match]);
    player2.executeMatches([player2Match]);
  }

  static executeTournament(matches: TournamentMatch[]) {
    const matchesPlayers = matches.reduce(
      (allPlayers, match) => allPlayers.concat([match.player1, match.player2]),
      []
    );
    const allPlayers = _.uniqBy(matchesPlayers, "id");
    const playersWithMatches = allPlayers.map((player) => {
      const playerMatches = getPlayerMatches(player.id, matches);
      return {
        player,
        matches: playerMatches,
      };
    });
    playersWithMatches.forEach(({ player, matches }) =>
      player.executeMatches(matches)
    );
  }
}
