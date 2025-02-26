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
  logger.error(err);

  if (isQueryFailedError(err)) {
    handleQueryFailedError(err, res);
    return;
  }

  if (isValidationError(err)) {
    handleValidationError(err, res);
    return;
  }

  if (!err.status || !err.code) {
    res.status(500).json({
      status: 500,
      ...errors.INTERNAL_SERVER_ERROR
    });
    return;
  }

  res.status(err.status).json({
    status: err.status,
    code: err.code,
    message: err.message
  });
};

const isQueryFailedError = (err: CustomError): boolean =>
    err.code === "23505";

const isValidationError = (err: CustomError): boolean =>
    err.name === "ValidationError";

const handleQueryFailedError = (err: CustomError, res: Response): void => {
  const uniqueFields = getUniqueFields(err);
  res.status(409).json({
    status: 409,
    ...errors.ALREADY_REGISTERED(uniqueFields)
  });
};

const handleValidationError = (err: CustomError, res: Response): void => {
  res.status(400).json({
    status: 400,
    ...errors.VALIDATION_ERROR(err.message)
  });
};