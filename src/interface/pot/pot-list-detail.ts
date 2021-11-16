import PotModel from "../../db/model/pot.model";
import TournamentModel from "../../db/model/tournament.model";

export default interface PotListDetail {
    
    pots: PotModel[];
    tournament: TournamentModel;
}