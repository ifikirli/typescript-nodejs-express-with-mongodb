import * as express from "express";
import Joi from "joi";
import { BadRequestException, InvalidParamsException } from "../exception/custom.exception";
import TournamentListRequest from "../helper/tournament/tournament-list-request";
import PaginatedTournaments from "../interface/tournament/paginated-tournaments";
import TournamentRequest from "../interface/tournament/tournament-request";
import handlePagination from "../middleware/pagination-handler.middleware";
import tournamentService from "../service/tournament.service";
import * as tournamentValidationSchemas from "../validation/tournament.validation";
import BaseController from "./base.controller";
import mongoose from "mongoose";
import { BaseRequestParameter } from "../interface/base-request-parameter";
import ResponseStatusCodes from "../response/response-status-codes";
import BaseDto from "../dto/base.dto";
import TournamentModel from "../db/model/tournament.model";
import handleToken from "../middleware/token-handler.middleware";

class TournamentController extends BaseController {
  
  router: express.Router;
  tournamentService: typeof tournamentService;

  constructor () {

      super();
      this.router = express.Router();
      this.tournamentService = tournamentService;
      this.routes();
  }

  async list (request: express.Request, response: express.Response, next: express.NextFunction) {
      
      const requestQuery = request.query;
      tournamentValidationSchemas.default.list.validateAsync(requestQuery)
          .then((tournamentListRequest: TournamentListRequest) => {
              this.tournamentService.list(request.paginationOptions, tournamentListRequest.name)
                  .then((paginatedTournaments: PaginatedTournaments) => {
                      return this.renderPaginatedList(response, paginatedTournaments.tournaments.map(tournament => 
                          new BaseDto(tournament._id.toString(), tournament.name)), paginatedTournaments.totalCount, paginatedTournaments.limit, paginatedTournaments.skip);
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
      tournamentValidationSchemas.default.add.validateAsync(requestBody)
          .then((tournamentRequest: TournamentRequest) => {
              this.tournamentService.add(tournamentRequest)
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
      tournamentValidationSchemas.default.get.validateAsync(requestParams)
          .then((baseRequestParameter: BaseRequestParameter) => {
              let tournamentId : mongoose.Types.ObjectId;
              try {
                  tournamentId = new mongoose.Types.ObjectId(baseRequestParameter.id);
              } catch (error) {
                  return next(new InvalidParamsException(ResponseStatusCodes.INVALID_TOURNAMENT_ID_PARAM.code));
              }
              const requestBody = request.body;
              tournamentValidationSchemas.default.add.validateAsync(requestBody)
                  .then((tournamentRequest: TournamentRequest) => {
                      this.tournamentService.update(tournamentId, tournamentRequest)
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
      tournamentValidationSchemas.default.get.validateAsync(requestParams)
          .then((baseRequestParameter: BaseRequestParameter) => {
              let tournamentId : mongoose.Types.ObjectId;
              try {
                  tournamentId = new mongoose.Types.ObjectId(baseRequestParameter.id);
              } catch (error) {
                  return next(new InvalidParamsException(ResponseStatusCodes.INVALID_TOURNAMENT_ID_PARAM.code));
              }
              this.tournamentService.get(tournamentId)
                  .then((tournament: TournamentModel | null) => {
                      return this.renderGetDetail(response, tournament ? new BaseDto(tournament._id.toString(), tournament.name) : null)
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
      this.router.post("", handleToken, this.add.bind(this));
      this.router.get("/:id", this.get.bind(this));
      this.router.put("/:id", handleToken, this.update.bind(this));
  }
}

const tournamentController = new TournamentController();
export default tournamentController.router;
