import {Response, Request, NextFunction} from "express";

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>;


export const asyncWrapper = (fn: AsyncFunction) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        }
    };
}