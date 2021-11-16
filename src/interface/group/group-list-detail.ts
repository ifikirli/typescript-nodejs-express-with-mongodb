import GroupModel from "../../db/model/group.model";
import TournamentModel from "../../db/model/tournament.model";

export default interface GroupListDetail {
    
    tournament: TournamentModel;
    groups: GroupModel[];
}