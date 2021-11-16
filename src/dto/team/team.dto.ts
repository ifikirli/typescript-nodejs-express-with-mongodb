import TeamModel from "../../db/model/team.model";
import { Countries } from "../../enum/countries";

export default class TeamDto {
    
    id: string;
    name: string;
    country: Countries;
    logo_url: string;

    constructor (teamModel: TeamModel) {

        this.id = teamModel._id.toString();
        this.name = teamModel.name;
        this.country = teamModel.country;
        this.logo_url = teamModel.logo_url;
    }
}