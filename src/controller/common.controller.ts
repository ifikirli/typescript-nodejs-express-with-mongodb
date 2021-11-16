/* eslint-disable @typescript-eslint/no-unused-vars */
import * as express from "express";
import { Countries } from "../enum/countries";
import ResponseStatusCodes from "../response/response-status-codes";
import BaseController from "./base.controller";

class CommonController extends BaseController {
  
  router: express.Router;

  constructor () {

      super();
      this.router = express.Router();
      this.routes();
  }

  async listResponseStatuses (request: express.Request, response: express.Response, next: express.NextFunction) {
      
      return this.renderGetDetail(response, Object.values(ResponseStatusCodes));
  }

  async listCountries (request: express.Request, response: express.Response, next: express.NextFunction) {
      
      return this.renderList(response, Object.values(Countries).sort());
  }

  routes (): void {
      
      this.router.get("/response_statuses", this.listResponseStatuses.bind(this));
      this.router.get("/countries", this.listCountries.bind(this));
  }
}

const commonController = new CommonController();
export default commonController.router;
