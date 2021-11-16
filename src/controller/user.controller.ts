import * as express from "express";
import Joi from "joi";
import TokenDto from "../dto/token/token.dto";
import { BadRequestException } from "../exception/custom.exception";
import TokenDetail from "../interface/token/token-detail";
import BaseUserRequest from "../interface/user/base-user-request";
import UserRequest from "../interface/user/user-request";
import userService from "../service/user.service";
import * as userValidationSchemas from "../validation/user.validation";
import BaseController from "./base.controller";

class UserController extends BaseController {
  
  router: express.Router;
  userService: typeof userService;

  constructor () {

      super();
      this.router = express.Router();
      this.userService = userService;
      this.routes();
  }

  async register (request: express.Request, response: express.Response, next: express.NextFunction) {
      
      const requestBody = request.body;
      userValidationSchemas.default.register.validateAsync(requestBody)
          .then((userRequest: UserRequest) => {
              this.userService.register(userRequest)
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
  }

  async login (request: express.Request, response: express.Response, next: express.NextFunction) {
      
      const requestBody = request.body;
      userValidationSchemas.default.login.validateAsync(requestBody)
          .then((baseUserRequest: BaseUserRequest) => {
              this.userService.login(baseUserRequest)
                  .then((tokenDetail: TokenDetail) => {
                      return this.renderGetDetail(response, new TokenDto(tokenDetail));
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
      
      this.router.post("/register", this.register.bind(this));
      this.router.post("/login", this.login.bind(this));
  }
}

const userController = new UserController();
export default userController.router;
