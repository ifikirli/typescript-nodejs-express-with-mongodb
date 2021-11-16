/* eslint-disable @typescript-eslint/no-namespace */
import express, { NextFunction, Request, Response } from "express";
import http from "http";
import config from "./config";
import logger from "./logger/logger";
import cors from "cors";
import handleCustomException from "./middleware/exception/exception-handler.middleware";
import { connectDB } from "./db/mongo-connection";
import { StatusCodes } from "http-status-codes";
import tournamentController from "./controller/tournament.controller";
import handleNotFoundException from "./middleware/exception/not-found-handler.middleware";
import PaginationOptions from "./helper/pagnination-options";
import commonController from "./controller/common.controller";
import teamController from "./controller/team.controller";
import potController from "./controller/pot.controller";
import groupController from "./controller/group.controller";
import userController from "./controller/user.controller";

declare global {
    namespace Express {
        export interface Request {
    
            userId: string;
            requestTime: Date;
            paginationOptions: PaginationOptions;
        }
    }
}

class ApiGateway {

    app: express.Application;
    appRouter: express.Router;
    server: http.Server;

    constructor () {

        this.app = express();
        this.appRouter = express.Router();
        this.server = new http.Server;
    }

    init (): Promise<void> {
        
        return new Promise(async (resolve, reject) => {

            try {

                this.setRequestTime();
                await connectDB();
                this.initializeMiddlewares();
                this.initializeLoggingFilter();
                this.initializeAppRouters();
                this.registerExceptionHandlers();
                logger.info("[App initialization] was completed.");
                resolve();
    
            } catch (error) {
                
                reject(error);
            }
        });
    }

    private setRequestTime () {

        this.app.use(function (request: Request, response: Response, next: NextFunction) {
    
            request.requestTime = new Date();
            next();
        });
    }

    private initializeMiddlewares () {
        
        this.app.use(cors());
        this.app.use(express.json({ limit : "5mb" }));
        this.app.use(express.urlencoded({ extended : false, limit : "5mb" }));
        logger.info("[Middlewares] were initialized.");
    }

    private initializeLoggingFilter () {
        
        this.app.use(function (request: Request, response: Response, next: NextFunction) {
        
            response.on("finish", function () {
    
                const duration = new Date().getTime() - request.requestTime.getTime();
                const userId = request.userId ? request.userId : "Anonim";
                const logContext = `${userId} | ${request.method} | ${request.originalUrl} | ${response.statusCode} | ${duration} ms`;
    
                if (response.statusCode == StatusCodes.OK || response.statusCode == StatusCodes.CREATED || response.statusCode == StatusCodes.NOT_MODIFIED)
                    logger.info(logContext);
                else
                    logger.error(logContext);
            });
            next();
        });
    }
    
    private initializeAppRouters () {
        
        const apiPath = "/api";
        this.app.use(apiPath, this.appRouter);
        this.appRouter.use("/common", commonController);
        this.appRouter.use("/user", userController);
        this.appRouter.use("/tournament", tournamentController);
        this.appRouter.use("/team", teamController);
        this.appRouter.use("/pot", potController);
        this.appRouter.use("/group", groupController);
        logger.info("[AppRouters] were initialized.");
    }

    private registerExceptionHandlers () {
        
        this.app.use(handleCustomException);
        this.app.use(handleNotFoundException);
    }

    listen (): Promise<void> {

        return new Promise((resolve, reject) => {

            this.server = http.createServer(this.app);
            this.server.on("error", (error: Error) => {

                reject(error);
                process.exit(2);
            });

            this.server.listen(config.PORT, () => {

                logger.info(`[App] was started at port: ${config.PORT}`);
                resolve();
            });
        });
    }
}

const app = new ApiGateway();
export default app;