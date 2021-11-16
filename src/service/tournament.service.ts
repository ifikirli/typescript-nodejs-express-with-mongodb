import PaginationOptions from "../helper/pagnination-options";
import PaginatedTournaments from "../interface/tournament/paginated-tournaments";
import TournamentRequest from "../interface/tournament/tournament-request";
import tournamentRepository from "../repository/tournament.repository";
import mongoose from "mongoose";
import { BusinessException } from "../exception/custom.exception";
import ResponseStatusCodes from "../response/response-status-codes";
import TournamentModel from "../db/model/tournament.model";

class TournamentService {

    tournamentRepository: typeof tournamentRepository;

    constructor () {

        this.tournamentRepository = tournamentRepository;
    }

    async list (paginationOptions: PaginationOptions, name: string): Promise<PaginatedTournaments> {
        
        return new Promise(async (resolve, reject) => {

            try {
                resolve(await this.tournamentRepository.list(paginationOptions, name));
            } catch (error) {
                reject(error);
            }
        });
    }

    async add (tournamentRequest: TournamentRequest): Promise<mongoose.Types.ObjectId> {
        
        return new Promise(async (resolve, reject) => {

            try {
                if (await this.tournamentRepository.existName(undefined, tournamentRequest.name))
                    throw new BusinessException(ResponseStatusCodes.EXIST_TOURNAMENT_NAME.code);
                const tournamentModel = await this.tournamentRepository.add(tournamentRequest);
                resolve(tournamentModel._id);
            } catch (error) {
                reject(error);
            }
        });
    }

    async update (tournamentId: mongoose.Types.ObjectId, tournamentRequest: TournamentRequest): Promise<void> {
        
        return new Promise(async (resolve, reject) => {

            try {
                const tournament = await this.tournamentRepository.getById(tournamentId);
                if (!tournament)
                    throw new BusinessException(ResponseStatusCodes.NO_TOURNAMENT_RECORD.code);
                if (await this.tournamentRepository.existName(tournamentId, tournamentRequest.name))
                    throw new BusinessException(ResponseStatusCodes.EXIST_TOURNAMENT_NAME.code);
                resolve(this.tournamentRepository.update(tournamentId, tournamentRequest));
            } catch (error) {
                reject(error);
            }
        });
    }

    async get (tournamentId: mongoose.Types.ObjectId): Promise<TournamentModel | null> {
        
        return new Promise(async (resolve, reject) => {

            try {
                resolve(await this.tournamentRepository.getById(tournamentId));
            } catch (error) {
                reject(error);
            }
        });
    }
}

const tournamentService = new TournamentService();
export default tournamentService;