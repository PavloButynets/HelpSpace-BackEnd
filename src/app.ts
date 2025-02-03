import express from "express"
import { myDataSource } from "./core/config/database.js"
import { serverSetup } from "./core/config/server.js";
import { logger } from "./utils/logger.js";

myDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

const app = express();

const start = async (): Promise<void> => {
    try {
        await serverSetup(app); 
    } catch (err) {
        logger.error(err);
    }
};

start();