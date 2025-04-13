import { Application } from "express";
import { initialization } from "./initialization";
import { logger } from "../utils/logger";
import { config } from "./envConfig";

export const serverSetup = async (app: Application): Promise<void> => {
  initialization(app);

  const ports = [config.SERVER_PORT]; // Три порти для сервера

  ports.forEach((port) => {
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  });
};
