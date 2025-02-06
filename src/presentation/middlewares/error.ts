import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../utils/errorsHelper";
import { errors } from "../../consts/errors";
import { logger } from "../../utils/logger";
import { getUniqueFields } from "../../utils/getUniqueFields";

export const errorMiddleware = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const { name, status, code, message } = err;
  logger.error(err);

  const dataErrors = {
    QueryFailedError: (message: string, statusCode?: number) => {
      if (statusCode === 23505) {
        const uniqueFields = getUniqueFields(message);
        res.status(409).json({
          status: 409,
          ...errors.DUPLICATE_RECORD_ERROR(uniqueFields)
        });
      }
      res.status(500).json({
        status: 500,
        ...errors.INTERNAL_SERVER_ERROR
      });
    },
    ValidationError: (message: string) => {
      res.status(400).json({
        status: 400,
        ...errors.VALIDATION_ERROR(message)
      });
    }
  } as const;

  if (name in dataErrors) {
    const handleDataError = dataErrors[name as keyof typeof dataErrors];
    handleDataError(message, status);
    return;
  }

  if (!status || !code) {
    res.status(500).json({
      status: 500,
      ...errors.INTERNAL_SERVER_ERROR
    });
    return;
  }

  res.status(status).json({
    status,
    code,
    message
  });
};
