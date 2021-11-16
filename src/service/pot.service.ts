import mongoose from "mongoose";
import config from "../config";
import { BusinessException } from "../exception/custom.exception";
import PotListDetail from "../interface/pot/pot-list-detail";
import PotRequest from "../interface/pot/pot-request";
import potRepository from "../repository/pot.repository";
import teamRepository from "../repository/team.repository";
import tournamentRepository from "../repository/tournament.repository";
import ResponseStatusCodes from "../response/response-status-codes";

class PotService {

    potRepository: typeof potRepository;

    constructor () {

        this.potRepository = potRepository;
    }

    async recreate (tournamentId: mongoose.Types.ObjectId): Promise<void> {
        
        return new Promise(async (resolve, reject) => {

            try {
                const tournament = await tournamentRepository.getById(tournamentId);
                if (!tournament)
                    throw new BusinessException(ResponseStatusCodes.NO_TOURNAMENT_RECORD.code);
                await this.potRepository.deleteAllByTournament(tournament);
                const pots: PotRequest[] = [];
                for (let index = 1; index <= config.POT_COUNT; index++) {
                    pots.push({ name : `Pot ${index}`, tournament : tournament });                    
                }
                await this.potRepository.insertPots(pots);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    async list (tournamentId: mongoose.Types.ObjectId): Promise<PotListDetail> {
        
        return new Promise(async (resolve, reject) => {

            try {
                const tournament = await tournamentRepository.getById(tournamentId);
                if (!tournament)
                    throw new BusinessException(ResponseStatusCodes.NO_TOURNAMENT_RECORD.code);
                resolve({ tournament : tournament, pots : await this.potRepository.list(tournament) });
            } catch (error) {
                reject(error);
            }
        });
    }

    async updateTeams (tournamentId: mongoose.Types.ObjectId, potId: mongoose.Types.ObjectId, teamIds: mongoose.Types.ObjectId[]): Promise<void> {
        
        return new Promise(async (resolve, reject) => {

            try {
                const tournament = await tournamentRepository.getById(tournamentId);
                if (!tournament)
                    throw new BusinessException(ResponseStatusCodes.NO_TOURNAMENT_RECORD.code);
                if (!await this.potRepository.existsByTournamentAndId(tournament, potId))
                    throw new BusinessException(ResponseStatusCodes.NO_POT_RECORD.code);
                const teams = await teamRepository.findByIds(teamIds);
                if (!teams || teams.length != config.POT_TEAM_COUNT)
                    throw new BusinessException(ResponseStatusCodes.INVALID_POT_TEAM_COUNT.code);
                if (await this.potRepository.existsByTeams(teams))
                    throw new BusinessException(ResponseStatusCodes.EXISTING_POT_TEAMS.code);
                await this.potRepository.updateByTeams(potId, teams);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
}

const potService = new PotService();
export default potService;