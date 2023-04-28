import { MatchCalculationData } from "./MatchCalculationData";

export const g = (ratingDeviation: number) => {
  const sqrtResult = Math.sqrt(
    1 + (3 * Math.pow(ratingDeviation, 2)) / Math.pow(Math.PI, 2)
  );
  return 1 / sqrtResult;
};

export const E = (
  rating: number,
  opponentRating: number,
  opponentRatingDeviation: number,
  gResult?: number
) => {
  const expResult = Math.exp(
    -(gResult || g(opponentRatingDeviation)) * (rating - opponentRating)
  );
  return 1 / (1 + expResult);
};

export const h = (matches: MatchCalculationData[]) =>
  matches.reduce((accumulatedSum, matchCalculationData) => {
    const currentResult =
      matchCalculationData.gResult *
      (matchCalculationData.match.score - matchCalculationData.EResult);
    return accumulatedSum + currentResult;
  }, 0);

export const calculateV = (matches: MatchCalculationData[]) => {
  const sum = matches.reduce((accumulatedSum, matchCalculationData) => {
    const gResultSquared = Math.pow(matchCalculationData.gResult, 2);
    const matchCalculationResult =
      gResultSquared *
      matchCalculationData.EResult *
      (1 - matchCalculationData.EResult);
    return accumulatedSum + matchCalculationResult;
  }, 0);
  return 1 / sum;
};

export const calculateDelta = (
  matches: MatchCalculationData[],
  vResult?: number,
  hResult?: number
) => {
  const v = vResult || calculateV(matches);
  const sum = hResult || h(matches);
  return v * sum;
};
