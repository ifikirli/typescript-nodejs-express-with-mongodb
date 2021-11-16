import BaseModel from "./base.model";
import TeamModel from "./team.model";
import TournamentModel from "./tournament.model";

export default interface PotModel extends BaseModel {
    
    name: string;
    teams: TeamModel[];
    tournament: TournamentModel;
}