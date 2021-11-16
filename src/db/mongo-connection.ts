import mongoose from "mongoose";
import config from "../config";
import logger from "../logger/logger";

async function connectDB () : Promise<void> {
    
    return new Promise((resolve, reject) => {
        
        mongoose.connect(config.MONGO_DB_URL, { maxPoolSize : 10 })
            .then(() => {
        
                logger.info("[MongoDB] connected.");
                resolve();

            }).catch((error) => {

                reject(error);
            });
    });
}

const connection = mongoose.connection;

connection.on("error", function () {
    
    logger.error("Database connection error occured.");
});

export { connectDB };
