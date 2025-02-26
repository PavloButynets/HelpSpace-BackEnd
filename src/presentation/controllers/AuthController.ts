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
import {errors} from "../../consts/errors";

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


        res.cookie(tokenNames.ACCESS_TOKEN, user.accessToken, COOKIE_OPTIONS)
        res.cookie(tokenNames.REFRESH_TOKEN, user.refreshToken, COOKIE_OPTIONS)

        const { accessToken } = user;
        res.status(201).json({ accessToken: accessToken});
    }

    async logout (req: Request, res: Response): Promise<void> {
        const refreshToken = req.cookies[tokenNames.REFRESH_TOKEN];
        await this.authService.logout(refreshToken);

        res.clearCookie(tokenNames.ACCESS_TOKEN)
        res.clearCookie(tokenNames.REFRESH_TOKEN)

        res.status(200).json({ message: "Logged out successfully" });
    }
    async refreshAccessToken (req: Request, res: Response): Promise<void> {
        const refreshToken = req.cookies[tokenNames.REFRESH_TOKEN];
        if(!refreshToken) {
            res.clearCookie(tokenNames.ACCESS_TOKEN)

            res.status(401).json({ message: errors.UNAUTHORIZED });
        }
        const user: LoginResponseDTO = await this.authService.refreshAccessToken(refreshToken);

        res.cookie(tokenNames.ACCESS_TOKEN, user.accessToken, COOKIE_OPTIONS)
        res.cookie(tokenNames.REFRESH_TOKEN, user.refreshToken, COOKIE_OPTIONS)

        res.status(201).json({ accessToken: user.accessToken});
    }
}