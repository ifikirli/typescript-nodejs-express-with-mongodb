import * as express from "express";
import Joi from "joi";
import mongoose from "mongoose";
import TeamModel from "../db/model/team.model";
import TeamDto from "../dto/team/team.dto";
import { BadRequestException, InvalidParamsException } from "../exception/custom.exception";
import TeamListRequest from "../helper/team/team-list-request";
import { BaseRequestParameter } from "../interface/base-request-parameter";
import PaginatedTeams from "../interface/team/paginated-teams";
import TeamRequest from "../interface/team/team-request";
import handlePagination from "../middleware/pagination-handler.middleware";
import handleToken from "../middleware/token-handler.middleware";
import ResponseStatusCodes from "../response/response-status-codes";
import teamService from "../service/team.service";
import * as teamValidationSchemas from "../validation/team.validation";
import BaseController from "./base.controller";

class TeamController extends BaseController {
  
  router: express.Router;
  teamService: typeof teamService;

  constructor () {

      super();
      this.router = express.Router();
      this.teamService = teamService;
      this.routes();
  }

  async list (request: express.Request, response: express.Response, next: express.NextFunction) {
      
      const requestQuery = request.query;
      teamValidationSchemas.default.list.validateAsync(requestQuery)
          .then((teamListRequest: TeamListRequest) => {
              this.teamService.list(request.paginationOptions, teamListRequest.name)
                  .then((paginatedTeams: PaginatedTeams) => {
                      return this.renderPaginatedList(response, paginatedTeams.teams.map(team => 
                          new TeamDto(team)), paginatedTeams.totalCount, paginatedTeams.limit, paginatedTeams.skip);
                  })
                  .catch(error => {
                      next(error);
                  });
          })
          .catch((error: Joi.ValidationError) => {
              next(new BadRequestException(error));
          });
  }

  async add (request: express.Request, response: express.Response, next: express.NextFunction) {
      
      const requestBody = request.body;
      teamValidationSchemas.default.add.validateAsync(requestBody)
          .then((teamRequest: TeamRequest) => {
              this.teamService.add(teamRequest)
                  .then((id: mongoose.Types.ObjectId) => {
                      return this.renderInsert(response, id)
                  })
                  .catch(error => {
                      next(error);
                  });
          })
          .catch((error: Joi.ValidationError) => {
              next(new BadRequestException(error));
          });
  }

  async update (request: express.Request, response: express.Response, next: express.NextFunction) {
      
      const requestParams = request.params;
      teamValidationSchemas.default.get.validateAsync(requestParams)
          .then((baseRequestParameter: BaseRequestParameter) => {
              let teamId : mongoose.Types.ObjectId;
              try {
                  teamId = new mongoose.Types.ObjectId(baseRequestParameter.id);
              } catch (error) {
                  return next(new InvalidParamsException(ResponseStatusCodes.INVALID_TEAM_ID_PARAM.code));
              }
              const requestBody = request.body;
              teamValidationSchemas.default.add.validateAsync(requestBody)
                  .then((teamRequest: TeamRequest) => {
                      this.teamService.update(teamId, teamRequest)
                          .then(() => {
                              return this.renderUpdate(response)
                          })
                          .catch(error => {
                              next(error);
                          });
                  })
                  .catch((error: Joi.ValidationError) => {
                      next(new BadRequestException(error));
                  }); 
          })
          .catch((error: Joi.ValidationError) => {
              next(new BadRequestException(error));
          });
  }

  async get (request: express.Request, response: express.Response, next: express.NextFunction) {
      
      const requestParams = request.params;
      teamValidationSchemas.default.get.validateAsync(requestParams)
          .then((baseRequestParameter: BaseRequestParameter) => {
              let teamId : mongoose.Types.ObjectId;
              try {
                  teamId = new mongoose.Types.ObjectId(baseRequestParameter.id);
              } catch (error) {
                  return next(new InvalidParamsException(ResponseStatusCodes.INVALID_TEAM_ID_PARAM.code));
              }
              this.teamService.get(teamId)
                  .then((team: TeamModel | null) => {
                      return this.renderGetDetail(response, team ? new TeamDto(team) : null)
                  })
                  .catch(error => {
                      next(error);
                  });
          })
          .catch((error: Joi.ValidationError) => {
              next(new BadRequestException(error));
          });
  }

  routes (): void {
      
      this.router.get("", handlePagination, this.list.bind(this));
      this.router.get("/:id", this.get.bind(this));
      this.router.post("", handleToken, this.add.bind(this));
      this.router.put("/:id", handleToken, this.update.bind(this));
  }
}

const teamController = new TeamController();
export default teamController.router;
