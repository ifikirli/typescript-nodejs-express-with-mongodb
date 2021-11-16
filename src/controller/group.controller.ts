import * as express from "express";
import Joi from "joi";
import mongoose from "mongoose";
import GroupListDetailDto from "../dto/group/group-list-detail.dto";
import { BadRequestException, InvalidParamsException } from "../exception/custom.exception";
import { BaseRequestParameter } from "../interface/base-request-parameter";
import GroupListDetail from "../interface/group/group-list-detail";
import handleToken from "../middleware/token-handler.middleware";
import ResponseStatusCodes from "../response/response-status-codes";
import groupService from "../service/group.service";
import * as tournamentValidationSchemas from "../validation/tournament.validation";
import BaseController from "./base.controller";

class GroupController extends BaseController {
  
  router: express.Router;
  groupService: typeof groupService;

  constructor () {

      super();
      this.router = express.Router();
      this.groupService = groupService;
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
              this.groupService.recreate(tournamentId)
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
              this.groupService.list(tournamentId)
                  .then((groupListDetail: GroupListDetail) => {
                      return this.renderGetDetail(response, new GroupListDetailDto(groupListDetail))
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
      
      this.router.post("/:id", handleToken, this.recreate.bind(this));
      this.router.get("/:id", this.list.bind(this));
  }
}

const potController = new GroupController();
export default potController.router;
