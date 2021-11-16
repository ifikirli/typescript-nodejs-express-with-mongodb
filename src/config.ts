import dotenv from "dotenv";
import logger from "./logger/logger";

dotenv.config();

class Config {
    
    public NODE_ENV: string;
    public PORT: number;
    public MONGO_DB_URL: string;
    public POT_COUNT: number;
    public POT_TEAM_COUNT: number;
    public SALT_ROUND: number;
    public JWT_SECRET: string;
    public JWT_TOKEN_ALGORITHM: string;
    public JWT_ISSUER: string;
    public JWT_AUDIENCE: string;
    public JWT_EXPIRES_IN_AS_MINUTE: number;

    constructor () {

        this.NODE_ENV = process.env.NODE_ENV || "development";
        this.PORT = parseInt(process.env.PORT as string) || 3000;
        this.MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://localhost:27017/uefadb";
        this.POT_COUNT = parseInt(process.env.POT_COUNT as string) || 4;
        this.POT_TEAM_COUNT = parseInt(process.env.POT_TEAM_COUNT as string) || 8;
        this.SALT_ROUND = parseInt(process.env.SALT_ROUND as string) || 8;
        this.JWT_SECRET = process.env.JWT_SECRET || "LtKXw23p";
        this.JWT_TOKEN_ALGORITHM = process.env.JWT_TOKEN_ALGORITHM || "HS256";
        this.JWT_ISSUER = process.env.JWT_ISSUER || "hdyq8KhB";
        this.JWT_AUDIENCE = process.env.JWT_ISSUER || "vdVk9Djm";
        this.JWT_EXPIRES_IN_AS_MINUTE = parseInt(process.env.JWT_EXPIRES_IN_AS_MINUTE as string) || 60;
        logger.info(`NODE_ENV :: ${this.NODE_ENV}`);
        logger.info(`PORT :: ${this.PORT}`);
        logger.info(`MONGO_DB_URL :: ${this.MONGO_DB_URL}`);
        logger.info(`POT_COUNT :: ${this.POT_COUNT}`);
        logger.info(`POT_TEAM_COUNT :: ${this.POT_TEAM_COUNT}`);
        logger.info(`SALT_ROUND :: ${this.SALT_ROUND}`);
        logger.info(`JWT_SECRET :: ${this.JWT_SECRET}`);
        logger.info(`JWT_TOKEN_ALGORITHM :: ${this.JWT_TOKEN_ALGORITHM}`);
        logger.info(`JWT_ISSUER :: ${this.JWT_ISSUER}`);
        logger.info(`JWT_AUDIENCE :: ${this.JWT_AUDIENCE}`);
        logger.info(`JWT_EXPIRES_IN_AS_MINUTE :: ${this.JWT_EXPIRES_IN_AS_MINUTE}`);
        logger.info("[Config] loaded.");
    }
}

const config = new Config();
export default config;