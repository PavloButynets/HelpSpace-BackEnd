import {inject, injectable} from "inversify";
import {Request, Response} from "express";
import {AuthService} from "../../application/services/AuthService";
import {RegisterUserDTO} from "../../application/dto/request/RegisterUserDTO";
import {AUTH_TYPES} from "../../container/types/AuthTypes";
import {LoginResponseDTO} from "../../application/dto/response/LoginResponseDTO";
import {tokenNames} from "../../consts/auth";
import {plainToInstance} from "class-transformer";
import {LoginRequestDTO} from "../../application/dto/request/LoginRequest";
import {COOKIE_OPTIONS} from "../../config/initialization";

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

        const loginDto: LoginRequestDTO = plainToInstance(LoginRequestDTO, req.body);
        const user: LoginResponseDTO = await this.authService.login(loginDto);

        const oneDayInMs = 24 * 60 * 60 * 1000;
        const thirtyDaysInMs = 30 * oneDayInMs;

        const refreshTokenCookieOptions = {
            ...COOKIE_OPTIONS,
            maxAge: loginDto.rememberMe ? thirtyDaysInMs : oneDayInMs
        }

        res.cookie(tokenNames.ACCESS_TOKEN, user.accessToken, COOKIE_OPTIONS)
        res.cookie(tokenNames.REFRESH_TOKEN, user.refreshToken, refreshTokenCookieOptions)

        const { refreshToken, ...userWithoutRefreshToken } = user;
        res.status(200).json(userWithoutRefreshToken);
    }
}