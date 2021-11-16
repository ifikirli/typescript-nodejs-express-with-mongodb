import * as express from "express";
import Joi from "joi";
import mongoose from "mongoose";
import PotListDetailDto from "../dto/pot/pot-list-detail.dto";
import { BadRequestException, InvalidParamsException } from "../exception/custom.exception";
import { BaseRequestParameter } from "../interface/base-request-parameter";
import PotListDetail from "../interface/pot/pot-list-detail";
import PotTeamParams from "../interface/pot/pot-team-params";
import PotTeamRequest from "../interface/pot/pot-team-request";
import handleToken from "../middleware/token-handler.middleware";
import ResponseStatusCodes from "../response/response-status-codes";
import potService from "../service/pot.service";
import * as potValidationSchemas from "../validation/pot.validation";
import * as tournamentValidationSchemas from "../validation/tournament.validation";
import BaseController from "./base.controller";

class PotController extends BaseController {
  
  router: express.Router;
  potService: typeof potService;

  constructor () {

      super();
      this.router = express.Router();
      this.potService = potService;
      this.routes();
  }

  async recreate (request: express.Request, response: express.Response, next: express.NextFunction) {
      
      const requestParams = request.params;
      tournamentValidationSchemas.default.get.validateAsync(requestParams)
          .then((baseRequestParameter: BaseRequestParameter) => {
              let tournamentId : mongoose.Types.ObjectId;
              try {
                  tournamentId = new mongoose.Types.ObjectId(baseRequestParameter.id);
              } catch (error) {
                  return next(new InvalidParamsException(ResponseStatusCodes.INVALID_TOURNAMENT_ID_PARAM.code));
              }
              this.potService.recreate(tournamentId)
                  .then(() => {
                      return this.renderOk(response)
                  })
                  .catch(error => {
                      next(error);
                  });
          })
          .catch((error: Joi.ValidationError) => {
              next(new BadRequestException(error));
          });
  }

  async list (request: express.Request, response: express.Response, next: express.NextFunction) {
      
      const requestParams = request.params;
      tournamentValidationSchemas.default.get.validateAsync(requestParams)
          .then((baseRequestParameter: BaseRequestParameter) => {
              let tournamentId : mongoose.Types.ObjectId;
              try {
                  tournamentId = new mongoose.Types.ObjectId(baseRequestParameter.id);
              } catch (error) {
                  return next(new InvalidParamsException(ResponseStatusCodes.INVALID_TOURNAMENT_ID_PARAM.code));
              }
              this.potService.list(tournamentId)
                  .then((potListDetail: PotListDetail) => {
                      return this.renderGetDetail(response, new PotListDetailDto(potListDetail));
                  })
                  .catch(error => {
                      next(error);
                  });
          })
          .catch((error: Joi.ValidationError) => {
              next(new BadRequestException(error));
          });
  }

  async updateTeams (request: express.Request, response: express.Response, next: express.NextFunction) {
      
      const requestParams = request.params;
      potValidationSchemas.default.updateTeamsParams.validateAsync(requestParams)
          .then((potTeamParams: PotTeamParams) => {
              let tournamentId: mongoose.Types.ObjectId, potId : mongoose.Types.ObjectId;
              try {
                  tournamentId = new mongoose.Types.ObjectId(potTeamParams.tournamentId);
                  potId = new mongoose.Types.ObjectId(potTeamParams.id);
              } catch (error) {
                  return next(new InvalidParamsException(ResponseStatusCodes.INVALID_TOURNAMENT_ID__POT_ID_PARAM.code));
              }
              const requestBody = request.body;
              potValidationSchemas.default.updateTeamsBody.validateAsync(requestBody)
                  .then((potTeamRequest: PotTeamRequest) => {
                      let teamIds: mongoose.Types.ObjectId[];
                      try {
                          teamIds = potTeamRequest.team_ids.map(teamId => 
                              new mongoose.Types.ObjectId(teamId));
                      } catch (error) {
                          return next(new InvalidParamsException(ResponseStatusCodes.INVALID_TEAM_ID_PARAM.code));
                      }
                      this.potService.updateTeams(tournamentId, potId, teamIds)
                          .then(() => {
                              return this.renderOk(response);
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

  routes (): void {
      
      this.router.post("/:id", handleToken, this.recreate.bind(this));
      this.router.get("/:id", this.list.bind(this));
      this.router.put("/:tournamentId/:id/teams", handleToken, this.updateTeams.bind(this));
  }
}

const potController = new PotController();
export default potController.router;
