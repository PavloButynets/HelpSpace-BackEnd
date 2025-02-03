import { createLogger, transports, format } from "winston";
import { LogEntity } from "../entities/LogEntity.js";
import { myDataSource } from "../core/config/database.js";
import { Writable } from "stream";

const { combine, timestamp, json, errors, prettyPrint } = format;

const saveLogToDB = async (level: string, message: string, meta?: any) => {
  try {
    const logRepository = myDataSource.getRepository(LogEntity);
    const logEntry = logRepository.create({
      level,
      message,
      meta: JSON.stringify(meta),
      timestamp: new Date(),
    });
    await logRepository.save(logEntry);
  } catch (error) {
    console.error("Помилка збереження логів у БД:", error);
  }
};

const databaseStream = new Writable({
    write(chunk, encoding, callback) {
      try {
        // Перевіряємо, чи є дані правильним JSON
        let logData;
        try {
          logData = JSON.parse(chunk.toString());
        } catch (err) {
          console.error("Invalid JSON format in log data:", chunk.toString());
          return callback(err); // Повертаємо помилку у callback, не обробляючи дані
        }
  
        saveLogToDB(logData.level, logData.message, logData).finally(callback);
      } catch (err) {
        console.error("Error processing log data:", err);
        callback(err);
      }
    },
  });
  

export const logger = createLogger({
  format: combine(
    errors({ stack: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    json(),
    prettyPrint()
  ),
  transports: [
    new transports.Console({
      handleExceptions: true,
    }),
  ],
});

if (process.env.NODE_ENV !== "test") {
  logger.add(new transports.Stream({ stream: databaseStream }));
}


