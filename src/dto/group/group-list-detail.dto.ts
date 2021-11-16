import GroupListDetail from "../../interface/group/group-list-detail";
import GroupDto from "./group.dto";

export default class GroupListDetailDto {
    
    tournament: string;
    groups: GroupDto[];

    constructor (groupListDetail: GroupListDetail) {

        this.tournament = groupListDetail.tournament.name;
        this.groups = groupListDetail.groups.map(group => 
            new GroupDto(group));
    }
}