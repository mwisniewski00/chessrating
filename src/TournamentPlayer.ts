import { Match } from "./Match";
import { Player } from "./Player";

export class TournamentPlayer extends Player {
  id: string;
  matches?: Match[] = [];
  constructor(
    id: string,
    rating: number = 1500,
    ratingDeviation: number = 350,
    volatility: number = 0.06
  ) {
    super(rating, ratingDeviation, volatility);
    this.id = id;
  }
}
