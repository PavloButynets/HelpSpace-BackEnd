import {inject, injectable} from "inversify";
import {Request, Response} from "express";
import {AuthService} from "../../application/services/AuthService";
import {RegisterUserDTO} from "../../application/dto/RegisterUserDTO";
import {AUTH_TYPES} from "../../container/types/AuthTypes";
import {LoginResponseDTO} from "../../application/dto/LoginResponseDTO";
import { config } from "../../config/envConfig";
import {tokenNames} from "../../consts/auth";

type CookieOptions = {
    maxAge: number,
    httpOnly: boolean,
    secure: boolean,
    sameSite: 'none' | 'lax' | 'strict' | 'none',
    domain: string
}

@injectable()
export class AuthController {
    private authService: AuthService;
    constructor(@inject(AUTH_TYPES.AuthService) authService: AuthService) {
        this.authService = authService;
    }
    async register (req: Request, res: Response): Promise<void> {
        const {email, password, firstName, lastName } = req.body;
        const newUser: RegisterUserDTO = new RegisterUserDTO(firstName, lastName, email, password);
        const user = await this.authService.register(newUser);
        res.status(201).json(user);
    }

    async login (req: Request, res: Response): Promise<void> {
        const {email, password, rememberMe} = req.body;
        const user: LoginResponseDTO = await this.authService.login(email, password, rememberMe);

        const oneDayInMs = 24 * 60 * 60 * 1000;
        const thirtyDaysInMs = 30 * oneDayInMs;

        const COOKIE_OPTIONS: CookieOptions = {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            domain: config.COOKIE_DOMAIN
        }

        const refreshTokenCookieOptions = {
            ...COOKIE_OPTIONS,
            maxAge: rememberMe ? thirtyDaysInMs : oneDayInMs
        }

        res.cookie(tokenNames.ACCESS_TOKEN, user.accessToken, COOKIE_OPTIONS)
        res.cookie(tokenNames.REFRESH_TOKEN, user.refreshToken, refreshTokenCookieOptions)

        const { refreshToken, ...userWithoutRefreshToken } = user;
        res.status(200).json(userWithoutRefreshToken);
    }
}