import Glicko2 from "./Glicko2";
import { TournamentMatch } from "./TournamentMatch";
import { TournamentPlayer } from "./TournamentPlayer";

const player1 = new TournamentPlayer("Jim", 1500, 200, 0.06);
const player2 = new TournamentPlayer("Michael", 1400, 30);
const player3 = new TournamentPlayer("Toby", 1550, 100);
const player4 = new TournamentPlayer("Dwight", 1700, 300);

const match1 = new TournamentMatch(player1, player2, 1);
const match2 = new TournamentMatch(player1, player3, 0);
const match3 = new TournamentMatch(player1, player4, 0);

Glicko2.executeTournament([match1, match2, match3]);
console.log("players", player1, player2, player3, player4);
