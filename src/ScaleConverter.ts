import { Player } from "./Player";

export class ScaleConverter {
  private static readonly SCALE = 173.7178;

  static toGlicko2Scale(rating: number, ratingDeviation: number) {
    const newRating = (rating - 1500) / this.SCALE;
    const newRatingDeviation = ratingDeviation / this.SCALE;
    return {
      rating: newRating,
      ratingDeviation: newRatingDeviation,
    };
  }

  static getRatingfromGlicko2Scale(rating: number) {
    return this.SCALE * rating + 1500;
  }

  static getRatingDeviationfromGlicko2Scale(ratingDeviation: number) {
    return this.SCALE * ratingDeviation;
  }

  static scalePlayerToGlicko2(player: Player) {
    const { rating, ratingDeviation } = this.toGlicko2Scale(
      player.rating,
      player.ratingDeviation
    );
    const scaledPlayer = new Player(rating, ratingDeviation, player.volatility);
    return scaledPlayer;
  }
}
