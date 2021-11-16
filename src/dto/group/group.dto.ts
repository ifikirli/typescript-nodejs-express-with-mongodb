import GroupModel from "../../db/model/group.model";

export default class GroupDto {
    
    id: string;
    name: string;
    teams: string[];

    constructor (group: GroupModel) {

        this.id = group._id.toString();
        this.name = group.name;
        this.teams = group.teams.map(team => 
            team.name);
    }
}