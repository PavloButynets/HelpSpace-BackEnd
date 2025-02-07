import {inject, injectable} from "inversify";
import {Request, Response} from "express";
import {AuthService} from "../../application/services/AuthService";
import {RegisterUserDTO} from "../../application/dto/RegisterUserDTO";
import {AUTH_TYPES} from "../../container/types/AuthTypes";

@injectable()
export class AuthController {
    private authService: AuthService;
    constructor(@inject(AUTH_TYPES.AuthService) authService: AuthService) {
        this.authService = authService;
    }
    async register (req: Request, res: Response): Promise<void> {
        const newUser: RegisterUserDTO = Object.assign(new RegisterUserDTO(), req.body);
        const user = await this.authService.register(newUser);
        res.status(201).json(user);
    }
}