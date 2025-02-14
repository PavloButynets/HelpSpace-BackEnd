import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";

export const validationMiddleware = (dto: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const instance = plainToInstance(dto, req.body);

        const errors = await validate(instance);
        if (errors.length > 0) {
            return res.status(422).json({
                message: "Validation failed",
                errors: errors.map(err => ({
                    field: err.property,
                    constraints: err.constraints
                }))
            });
        }

        req.body = instance;
        return next();
    };
};
