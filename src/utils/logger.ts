import { createLogger, transports, format } from "winston";

const { combine, timestamp, simple } = format;

export const logger = createLogger({
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), 
    simple() 
  ),
  transports: [
    new transports.Console({
      handleExceptions: true,
    }),
  ],
});
