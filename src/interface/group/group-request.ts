import TeamModel from "../../db/model/team.model";
import TournamentModel from "../../db/model/tournament.model";

export default interface GroupRequest {
    
    name: string;
    tournament: TournamentModel;
    teams: TeamModel[];
}