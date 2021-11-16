import mongoose from "mongoose";
import TournamentModel from "../db/model/tournament.model";
import { Tournament } from "../db/schema/tournament.schema";
import { DatabaseException } from "../exception/custom.exception";
import PaginationOptions from "../helper/pagnination-options";
import KeyValueFilter from "../interface/filter/key-value-filter";
import PaginatedTournaments from "../interface/tournament/paginated-tournaments";
import TournamentRequest from "../interface/tournament/tournament-request";

class TournamentRepository {

    async list (paginationOptions: PaginationOptions, name: string): Promise<PaginatedTournaments> {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                const listFilter = this.prepareListFilter(name);
                const tournaments = await Tournament.find(listFilter)
                    .limit(paginationOptions.limit)
                    .skip(paginationOptions.skip)
                    .sort([[paginationOptions.order_by, paginationOptions.sort_by]])
                    .exec();
                resolve({ tournaments : tournaments, limit : paginationOptions.limit, skip : paginationOptions.skip, totalCount : await this.getTotalCountByFilter(listFilter) });
            } catch (error) {
                reject(new DatabaseException(error));
            }
        });
    }

    async getTotalCountByFilter (tournamentFilter: KeyValueFilter): Promise<number> {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                resolve(await Tournament.count(tournamentFilter).exec());
            } catch (error) {
                reject(new DatabaseException(error));
            }
        });
    }

    prepareListFilter (name: string): KeyValueFilter {
        
        const tournamentFilter: KeyValueFilter = {};
        if (name)
            tournamentFilter.name = { $regex : name, $options : "i" };
        return tournamentFilter;
    }

    async existName (_id: mongoose.Types.ObjectId | undefined, name: string): Promise<boolean> {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                resolve(await Tournament.exists(this.prepareNameFilter(_id, name)));
            } catch (error) {
                reject(new DatabaseException(error));
            }
        });
    }

    prepareNameFilter (_id: mongoose.Types.ObjectId | undefined, name: string): KeyValueFilter {
        
        const tournamentNameFilter: KeyValueFilter = { name : name };
        if (_id)
            tournamentNameFilter._id = { $ne : _id };
        return tournamentNameFilter;
    }

    async add (tournamentRequest: TournamentRequest): Promise<TournamentModel> {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                const tournament = new Tournament(tournamentRequest); 
                resolve(await tournament.save());
            } catch (error) {
                reject(new DatabaseException(error));
            }
        });
    }

    async getById (_id: mongoose.Types.ObjectId): Promise<TournamentModel | null> {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                resolve(await Tournament.findOne({ _id : _id }));
            } catch (error) {
                reject(new DatabaseException(error));
            }
        });
    }

    async update (_id: mongoose.Types.ObjectId, tournamentRequest: TournamentRequest): Promise<void> {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                await Tournament.findByIdAndUpdate(_id, tournamentRequest); 
                resolve();
            } catch (error) {
                reject(new DatabaseException(error));
            }
        });
    }
}

const tournamentRepository = new TournamentRepository();
export default tournamentRepository;