import Glicko2 from "./Glicko2";
import { Match } from "./Match";
import { ScaleConverter } from "./ScaleConverter";

export class Player {
  rating: number;
  ratingDeviation: number;
  volatility: number;

  constructor(
    rating: number = 1500,
    ratingDeviation: number = 350,
    volatility: number = 0.06
  ) {
    this.rating = rating;
    this.ratingDeviation = ratingDeviation;
    this.volatility = volatility;
  }

  executeMatches(matches: Match[]) {
    const glicko2 = new Glicko2(
      ScaleConverter.scalePlayerToGlicko2(this),
      matches
    );
    const { rating, ratingDeviation, volatility } = glicko2.getNewValues();
    this.rating = ScaleConverter.getRatingfromGlicko2Scale(rating);
    this.ratingDeviation =
      ScaleConverter.getRatingDeviationfromGlicko2Scale(ratingDeviation);
    this.volatility = volatility;
  }
}
