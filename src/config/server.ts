import { Application } from "express";
import { initialization } from "./initialization";
import { logger } from "../utils/logger";
import { config } from "./envConfig";

export const serverSetup = async (app: Application): Promise<void> => {
  initialization(app);
  app.listen(config.SERVER_PORT, () => {
    logger.info(`Server is running on port ${config.SERVER_PORT}`);
  });
};

