import {AppContainer} from "./container";
import express from "express"
import { myDataSource } from "./config/database"
import { serverSetup } from "./config/server";
import { logger } from "./utils/logger";
import dotenv from "dotenv";

const appContainer = AppContainer.getInstance();
appContainer.loadModules();
dotenv.config();
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