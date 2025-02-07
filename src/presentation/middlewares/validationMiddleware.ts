import {NextFunction, Request, Response} from "express";
import {errors} from "../../consts/errors";
import {validateEntity} from "../../validation/shemaValidator";
import {createError} from "../../utils/errorsHelper";

export const validationMiddleware = (entity: Record<string, any>, source: 'body' | 'query' = 'body') => {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (source === 'body' && !req[source]) {
            throw createError(422, errors.BODY_IS_NOT_DEFINED)
        }

        const data = req[source]
        validateEntity(entity, data)

        next()
    }
}


