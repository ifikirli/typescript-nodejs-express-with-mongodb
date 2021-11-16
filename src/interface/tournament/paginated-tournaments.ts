import TournamentModel from "../../db/model/tournament.model";

export default interface PaginatedTournaments {
    
    tournaments: TournamentModel[];
    skip: number;
    limit: number;
    totalCount: number;
}