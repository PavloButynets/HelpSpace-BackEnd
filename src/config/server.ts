import { Application } from "express";
import { initialization } from "./initialization.js"; 
import { logger } from "../utils/logger.js";
import { config } from "./envConfig.js";

export const serverSetup = async (app: Application): Promise<void> => {
  initialization(app);   
  app.listen(config.SERVER_PORT, () => {
    logger.info(`Server is running on port ${config.SERVER_PORT}`);
  });
};

