import TeamModel from "../../db/model/team.model";

export default interface PaginatedTeams {
    
    teams: TeamModel[];
    skip: number;
    limit: number;
    totalCount: number;
}