import PotListDetail from "../../interface/pot/pot-list-detail";
import PotDto from "./pot.dto";

export default class PotListDetailDto {
    
    tournament: string;
    pots: PotDto[];

    constructor (potListDetail: PotListDetail) {

        this.tournament = potListDetail.tournament.name;
        this.pots = potListDetail.pots.map(pot => 
            new PotDto(pot));
    }
}