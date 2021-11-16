import TournamentModel from "../../db/model/tournament.model";

export default interface PotRequest {
    
    name: string;
    tournament: TournamentModel;
}