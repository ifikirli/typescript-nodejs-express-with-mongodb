import mongoose from "mongoose";
import TeamModel from "../db/model/team.model";
import { BusinessException } from "../exception/custom.exception";
import PaginationOptions from "../helper/pagnination-options";
import PaginatedTeams from "../interface/team/paginated-teams";
import TeamRequest from "../interface/team/team-request";
import teamRepository from "../repository/team.repository";
import ResponseStatusCodes from "../response/response-status-codes";

class TeamService {

    teamRepository: typeof teamRepository;

    constructor () {

        this.teamRepository = teamRepository;
    }

    async list (paginationOptions: PaginationOptions, name: string): Promise<PaginatedTeams> {
        
        return new Promise(async (resolve, reject) => {

            try {
                resolve(await this.teamRepository.list(paginationOptions, name));
            } catch (error) {
                reject(error);
            }
        });
    }

    async add (teamRequest: TeamRequest): Promise<mongoose.Types.ObjectId> {
        
        return new Promise(async (resolve, reject) => {

            try {
                if (await this.teamRepository.existNameOrLogoUrl(undefined, teamRequest.name, teamRequest.logo_url))
                    throw new BusinessException(ResponseStatusCodes.EXIST_TEAM_NAME_OR_LOGO.code);
                const teamModel = await this.teamRepository.add(teamRequest);
                resolve(teamModel._id);
            } catch (error) {
                reject(error);
            }
        });
    }

    async update (teamId: mongoose.Types.ObjectId, teamRequest: TeamRequest): Promise<void> {
        
        return new Promise(async (resolve, reject) => {

            try {
                const team = await this.teamRepository.getById(teamId);
                if (!team)
                    throw new BusinessException(ResponseStatusCodes.NO_TEAM_RECORD.code);
                if (await this.teamRepository.existNameOrLogoUrl(teamId, teamRequest.name, teamRequest.logo_url))
                    throw new BusinessException(ResponseStatusCodes.EXIST_TEAM_NAME_OR_LOGO.code);
                resolve(this.teamRepository.update(teamId, teamRequest));
            } catch (error) {
                reject(error);
            }
        });
    }

    async get (teamId: mongoose.Types.ObjectId): Promise<TeamModel | null> {
        
        return new Promise(async (resolve, reject) => {

            try {
                resolve(await this.teamRepository.getById(teamId));
            } catch (error) {
                reject(error);
            }
        });
    }
}

const teamService = new TeamService();
export default teamService;