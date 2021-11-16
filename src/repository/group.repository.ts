import GroupModel from "../db/model/group.model";
import TournamentModel from "../db/model/tournament.model";
import { Group } from "../db/schema/group.schema";
import { SortTypes } from "../enum/sort-types";
import { DatabaseException } from "../exception/custom.exception";
import GroupRequest from "../interface/group/group-request";

class GroupRepository {
    
    async deleteAllByTournament (tournament: TournamentModel): Promise<void> {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                await Group.deleteMany({ tournament : tournament });
                resolve();
            } catch (error) {
                reject(new DatabaseException(error));
            }
        });
    }

    async insertGroups (groups: GroupRequest[]): Promise<void> {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                await Group.insertMany(groups);
                resolve();
            } catch (error) {
                reject(new DatabaseException(error));
            }
        });
    }

    async list (tournament: TournamentModel): Promise<GroupModel[]> {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                resolve(await Group.find({ tournament : tournament })
                    .sort([["name", SortTypes.ASCENDING]])
                    .populate("teams", "name"));
            } catch (error) {
                reject(new DatabaseException(error));
            }
        });
    }
}

const groupRepository = new GroupRepository();
export default groupRepository;