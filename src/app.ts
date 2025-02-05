import express from "express"
import { myDataSource } from "./config/database.js"
import { serverSetup } from "./config/server.js";
import { logger } from "./utils/logger.js";
import dotenv from "dotenv";
import {AppContainer} from "./container/index.js";

dotenv.config();
myDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

const appContainer = AppContainer.getInstance();
appContainer.loadModules();

const app = express();

const start = async (): Promise<void> => {
    try {
        await serverSetup(app);
    } catch (err) {
        logger.error(err);
    }
};

start();