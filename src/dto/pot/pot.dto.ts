import PotModel from "../../db/model/pot.model";

export default class PotDto {
    
    id: string;
    name: string;
    teams: string[];

    constructor (pot: PotModel) {

        this.id = pot._id.toString();
        this.name = pot.name;
        this.teams = pot.teams.map(team => 
            team.name);
    }
}