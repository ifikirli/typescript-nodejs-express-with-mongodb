import mongoose from "mongoose";
import config from "../config";
import { Countries } from "../enum/countries";
import { BusinessException } from "../exception/custom.exception";
import GroupListDetail from "../interface/group/group-list-detail";
import GroupRequest from "../interface/group/group-request";
import groupRepository from "../repository/group.repository";
import potRepository from "../repository/pot.repository";
import tournamentRepository from "../repository/tournament.repository";
import ResponseStatusCodes from "../response/response-status-codes";

class GroupService {

    groupRepository: typeof groupRepository;

    constructor () {

        this.groupRepository = groupRepository;
    }

    async recreate (tournamentId: mongoose.Types.ObjectId): Promise<void> {
        
        return new Promise(async (resolve, reject) => {

            try {
                const tournament = await tournamentRepository.getById(tournamentId);
                if (!tournament)
                    throw new BusinessException(ResponseStatusCodes.NO_TOURNAMENT_RECORD.code);
                const pots = await potRepository.findByTournament(tournament);
                if (!pots || pots.length != config.POT_COUNT)
                    throw new BusinessException(ResponseStatusCodes.INVALID_POT_COUNT.code);
                if (pots.filter(pot => 
                    !pot.teams || pot.teams.length != config.POT_TEAM_COUNT).length > 0)
                    throw new BusinessException(ResponseStatusCodes.INVALID_POT_TEAM_COUNT.code);
                
                const groups : GroupRequest[] = [];
                for (let groupIndex = 0; groupIndex < config.POT_TEAM_COUNT; groupIndex++) {
                
                    groups.push({ tournament : tournament, name : `Group ${String.fromCharCode(97 + groupIndex)}`, teams : [] });
                    const group = groups[groupIndex];
                    const existingCountries: Countries[] = [];
                    
                    for (let potIndex = 0; potIndex < pots.length; potIndex++) {
                    
                        const pot = pots[potIndex];
                        const addableTeams = pot.teams.filter(team => 
                            !existingCountries.includes(team.country));
                        const addedableTeam = addableTeams[Math.floor(Math.random()*addableTeams.length)];
                        pot.teams.splice(pot.teams.indexOf(addedableTeam), 1);
                        existingCountries.push(addedableTeam.country);
                        group.teams.push(addedableTeam);
                    }
                }
                await this.groupRepository.deleteAllByTournament(tournament);
                await this.groupRepository.insertGroups(groups);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    async list (tournamentId: mongoose.Types.ObjectId): Promise<GroupListDetail> {
        
        return new Promise(async (resolve, reject) => {

            try {
                const tournament = await tournamentRepository.getById(tournamentId);
                if (!tournament)
                    throw new BusinessException(ResponseStatusCodes.NO_TOURNAMENT_RECORD.code);
                const groups = await this.groupRepository.list(tournament);
                resolve({ tournament : tournament, groups : groups });
            } catch (error) {
                reject(error);
            }
        });
    }
}

const groupService = new GroupService();
export default groupService;