import { Match } from "./Match";
import { Player } from "./Player";
import { TournamentMatch } from "./TournamentMatch";
import { Score } from "./types";

export const revertScore = (score: Score): Score => {
  if (score == 0.5) return score;
  return (1 - score) as Score;
};

export const getPlayerMatches = (
  playerId: string,
  matches: TournamentMatch[]
) =>
  matches.reduce((playerMatches, match) => {
    if (match.player1.id === playerId) {
      playerMatches.push(
        new Match(
          new Player(
            match.player2.rating,
            match.player2.ratingDeviation,
            match.player2.volatility
          ),
          match.score
        )
      );
    }
    if (match.player2.id === playerId) {
      playerMatches.push(
        new Match(
          new Player(
            match.player1.rating,
            match.player1.ratingDeviation,
            match.player1.volatility
          ),
          revertScore(match.score)
        )
      );
    }

    return playerMatches;
  }, []);
