import { Application } from "express";
import { initialization } from "./initialization";
import { logger } from "../utils/logger";
import { config } from "./envConfig";
import { Server } from "socket.io";
import http from "http";
import { SocketIOHandler } from "./socket-io-handler";
export const serverSetup = async (app: Application): Promise<void> => {
  initialization(app);

  const port = config.SERVER_PORT; // Три порти для сервера
  const server = http.createServer(app);

  const io = new Server(server, {
    path: "/socket.io",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  new SocketIOHandler(io);

  server.listen(Number(port), "0.0.0.0", () => {
    logger.info(`Server is running on port ${port}`);
    logger.info(`WebSocket server available at ws://localhost:${port}/ws`);
  });
  server.on("error", (error) => {
    logger.error(`Server error: ${error.message}`);
  });
};
