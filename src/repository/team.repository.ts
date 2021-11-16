import mongoose from "mongoose";
import TeamModel from "../db/model/team.model";
import { Team } from "../db/schema/team.schema";
import { DatabaseException } from "../exception/custom.exception";
import PaginationOptions from "../helper/pagnination-options";
import KeyValueFilter from "../interface/filter/key-value-filter";
import PaginatedTeams from "../interface/team/paginated-teams";
import TeamRequest from "../interface/team/team-request";

class TeamRepository {

    async list (paginationOptions: PaginationOptions, name: string): Promise<PaginatedTeams> {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                const listFilter = this.prepareListFilter(name);
                const teams = await Team.find(listFilter)
                    .limit(paginationOptions.limit)
                    .skip(paginationOptions.skip)
                    .sort([[paginationOptions.order_by, paginationOptions.sort_by]])
                    .exec();
                resolve({ teams : teams, limit : paginationOptions.limit, skip : paginationOptions.skip, totalCount : await this.getTotalCountByFilter(listFilter) });
            } catch (error) {
                reject(new DatabaseException(error));
            }
        });
    }

    async getTotalCountByFilter (teamFilter: KeyValueFilter): Promise<number> {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                resolve(await Team.count(teamFilter).exec());
            } catch (error) {
                reject(new DatabaseException(error));
            }
        });
    }

    prepareListFilter (name: string): KeyValueFilter {
        
        const teamFilter: KeyValueFilter = {};
        if (name)
            teamFilter.name = { $regex : name, $options : "i" };
        return teamFilter;
    }

    async existNameOrLogoUrl (_id: mongoose.Types.ObjectId | undefined, name: string, logoUrl: string): Promise<boolean> {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                resolve(await Team.exists(this.prepareNameLogoFilter(_id, name, logoUrl)));
            } catch (error) {
                reject(new DatabaseException(error));
            }
        });
    }

    prepareNameLogoFilter (_id: mongoose.Types.ObjectId | undefined, name: string, logoUrl: string): KeyValueFilter {
        
        const teamNameLogoFilter: KeyValueFilter = { $and : [] };
        if (_id)
            teamNameLogoFilter.$and.push({ _id : { $ne : _id } });
        teamNameLogoFilter.$and.push({ $or : [{ name : name }, { logo_url : logoUrl }] });
        return teamNameLogoFilter;
    }

    async add (teamRequest: TeamRequest): Promise<TeamModel> {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                const team = new Team(teamRequest); 
                resolve(await team.save());
            } catch (error) {
                reject(new DatabaseException(error));
            }
        });
    }

    async getById (_id: mongoose.Types.ObjectId): Promise<TeamModel | null> {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                resolve(await Team.findOne({ _id : _id }));
            } catch (error) {
                reject(new DatabaseException(error));
            }
        });
    }

    async update (_id: mongoose.Types.ObjectId, teamRequest: TeamRequest): Promise<void> {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                await Team.findByIdAndUpdate(_id, teamRequest); 
                resolve();
            } catch (error) {
                reject(new DatabaseException(error));
            }
        });
    }

    async findByIds (ids: mongoose.Types.ObjectId[]): Promise<TeamModel[]> {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                resolve(await Team.find({ _id : { $in : ids } }));
            } catch (error) {
                reject(new DatabaseException(error));
            }
        });
    }
}

const teamRepository = new TeamRepository();
export default teamRepository;