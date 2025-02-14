import { Request, Response, NextFunction } from "express";
import { TokenService } from "../../application/services/TokenService";
import {  createUnauthorizedError } from "../../utils/errorsHelper";
import { ITokenPayload } from "../../application/services/TokenService";
import {inject, injectable} from "inversify";
import {TOKEN_TYPES} from "../../container/types/TokenTypes";

export interface AuthenticatedRequest extends Request {
    user?: ITokenPayload;
}

@injectable()
export class AuthMiddleware {
    private tokenService: TokenService;

    constructor(@inject(TOKEN_TYPES.TokenService) tokenService: TokenService) {
        this.tokenService = tokenService;
    }

    authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        console.log(req.cookies)
        const { accessToken } = req.cookies;

        if (!accessToken) {
            return next(createUnauthorizedError());
        }

        const userData = this.tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(createUnauthorizedError());
        }

        req.user = userData as ITokenPayload;
        next();
    };

}

