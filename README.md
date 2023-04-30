# chessrating

## Description

chessrating is a TypeScript library designed to calculate, update, and manage chess(or other game) rating based on [Glicko-2](http://www.glicko.net/glicko/glicko2.pdf) rating system by Professor Mark E. Glickman.
It is designed to provide more accurate ratings for players by taking into account not only their rating but also the rating's uncertainty (termed as rating deviation) and the system's volatility.

## Installation

```
npm i chessrating
```

## How to use

You can import all usable classes this way:

```
import { Player, Glicko2, Match, TournamentMatch, TournamentPlayer } from "chessrating";
```

You can initialize player with default values, if that player never had any game. You can also pass rating, ratingDeviation and volatility of player if you have executed rating calculation for this player before.

```
const player1 = new Player();
const player2 = new Player(1400, 30, 0.058);
```

This is recommended way to execute match between 2 players:

```
Glicko2.executeMatch(player1, player2, 1);
```

The last attribute called `score` can have one of those values: `0 | 0.5 | 1`.

- `1` means that player1 has won.
- `0.5` means there was a tie.
- `0` means player2 has won.

Glicko-2 rating system works best for tournaments when, single player played 10-15 matches. This is how you can execute tournament:

```
const player1 = new TournamentPlayer("Jim", 1500, 200);
const player2 = new TournamentPlayer("Michael", 1400, 30);
const player3 = new TournamentPlayer("Toby", 1550, 100);
const player4 = new TournamentPlayer("Dwight", 1700, 300);

const match1 = new TournamentMatch(player1, player2, 1);
const match2 = new TournamentMatch(player1, player3, 0);
const match3 = new TournamentMatch(player1, player4, 0);

Glicko2.executeTournament([match1, match2, match3]);
```

Both `executeMatch` and `executeTournament` will updates `rating`, `ratingDeviation` and `volatility` fields for each player according to played games. Those values should be saved and used whenever player plays another game.

You can also execute some matches only for one player:

```
const player1 = new Player(1500, 200, 0.06);
const player2 = new Player(1400, 30, 0.06);
const player3 = new Player(1550, 100, 0.06);
const player4 = new Player(1700, 300, 0.06);

const match1 = new Match(player2, 1);
const match2 = new Match(player3, 0);
const match3 = new Match(player4, 0);
player1.executeMatches([match1, match2, match3]);
```

## Player

### constructor attributes

- `rating: number = 1500`
- `ratingDeviation: number = 350`
- `volatility: number = 0.06`

### methods

- `executeMatches(matches: Match[]): void` - Updates Player fields according to played matches.

## Match

### constructor attributes

- `opponent: Player`
- `score: Score`

## TournamentPlayer

Used when you want to use `executeTournament` method from `Glicko2`. Child of `Player` class with additional `id` field.

### constructor attributes

- `id: string`
- `rating: number = 1500`
- `ratingDeviation: number = 350`
- `volatility: number = 0.06`

## TournamentMatch

Used when you want to use `executeTournament` method from `Glicko2`.

### constructor attributes

- `player1: TournamentPlayer`
- `player2: TournamentPlayer`,
- `score: Score`

## Glicko2

### constructor attributes

- `player: Player`
- `matches: Match[]`
- `tau: number = 0.5` - The system constant, τ , which constrains the change in volatility over time.

### methods

- `getNewValues(): {
    rating: number;
    ratingDeviation: number;
    volatility: number;
}`- generates Glicko2 values based on played matches for provided player

## static methods

- `executeMatch(player1: Player, player2: Player, result: Score)` - takes two players and result of their match, and updates Glicko2 values for both of them.

- `executeTournament(matches: TournamentMatch[])` - takes an array of matches and updates Glicko2 values for every player that took part in any of those matches based on all results.

## Types

- ```
  type Score = 0 | 0.5 | 1;
  ```

## Example

If you want to see an example how this package can be used, you can see this chess app, that uses this package on backend: https://github.com/mwisniewski00/Chess
