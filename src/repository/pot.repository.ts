import PotModel from "../db/model/pot.model";
import TournamentModel from "../db/model/tournament.model";
import { Pot } from "../db/schema/pot.schema";
import { SortTypes } from "../enum/sort-types";
import { DatabaseException } from "../exception/custom.exception";
import PotRequest from "../interface/pot/pot-request";
import mongoose from "mongoose";

class PotRepository {

    async deleteAllByTournament (tournament: TournamentModel): Promise<void> {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                await Pot.deleteMany({ tournament : tournament });
                resolve();
            } catch (error) {
                reject(new DatabaseException(error));
            }
        });
    }

    async insertPots (pots: PotRequest[]): Promise<void> {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                await Pot.insertMany(pots);
                resolve();
            } catch (error) {
                reject(new DatabaseException(error));
            }
        });
    }

    async list (tournament: TournamentModel): Promise<PotModel[]> {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                resolve(await Pot.find({ tournament : tournament })
                    .sort([["name", SortTypes.ASCENDING]])
                    .populate("teams", "name"));
            } catch (error) {
                reject(new DatabaseException(error));
            }
        });
    }

    async existsByTournamentAndId (tournament: TournamentModel, potId: mongoose.Types.ObjectId): Promise<boolean> {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                resolve(await Pot.exists({ tournament : tournament, _id : potId }));
            } catch (error) {
                reject(new DatabaseException(error));
            }
        });
    }

    async existsByTeams (teams: TournamentModel[]): Promise<boolean> {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                resolve(await Pot.findOne().where("teams").in(teams) != null);
            } catch (error) {
                reject(new DatabaseException(error));
            }
        });
    }

    async updateByTeams (potId: mongoose.Types.ObjectId, teams: TournamentModel[]): Promise<void> {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                await Pot.findByIdAndUpdate(potId, { $set : { teams : teams } });
                resolve();
            } catch (error) {
                reject(new DatabaseException(error));
            }
        });
    }

    async findByTournament (tournament: TournamentModel): Promise<PotModel[]> {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                resolve(await Pot.find({ tournament : tournament }).populate("teams"));
            } catch (error) {
                reject(new DatabaseException(error));
            }
        });
    }
}

const potRepository = new PotRepository();
export default potRepository;