import {UserRepository} from "../../infrastructure/repositories/UserRepository";
import {USER_TYPES} from "../../container/types/UserTypes";
import {inject, injectable} from "inversify";
import {RegisterUserDTO} from "../dto/request/RegisterUserDTO";
import {UserService} from "./UserService";
import {UserResponseDTO} from "../dto/response/UserResponseDTO";
import {createError} from "../../utils/errorsHelper";
import { errors } from "../../consts/errors";
import {comparePasswords} from "../../utils/passwordHelper";
import {LoginResponseDTO} from "../dto/response/LoginResponseDTO";
import {TokenService} from "./TokenService";
import {TOKEN_TYPES} from "../../container/types/TokenTypes";
import {tokenNames} from "../../consts/auth";
import {LoginRequestDTO} from "../dto/request/LoginRequest";
import {User} from "../../domain/entities/UserEntity";

@injectable()
export class AuthService {
    private _userRepository: UserRepository;
    private _userService: UserService;
    private _tokenService: TokenService;
constructor(
        @inject(USER_TYPES.IUserRepository) userRepository: UserRepository,
        @inject(USER_TYPES.UserService) userService: UserService,
        @inject(TOKEN_TYPES.TokenService) tokenService: TokenService
    ) {
        this._userRepository = userRepository;
        this._userService = userService;
        this._tokenService = tokenService;
    }

    async register(userDto: RegisterUserDTO): Promise<UserResponseDTO> {
        const user = await this._userService.createUser(userDto);

        //const confirmToken = this._tokenService.generateConfirmToken({id: user.id})

        return user
    }

    async login(loginDto: LoginRequestDTO): Promise<LoginResponseDTO> {

        const {email, password, rememberMe} = loginDto;

        const user: User | null = await this._userRepository.findByEmail(email);
        if (!user) {
            throw createError(401, errors.USER_NOT_FOUND)
        }
        const checkedPassword = await comparePasswords(password, user.password)

        if (!checkedPassword) {
            throw createError(401, errors.INCORRECT_CREDENTIALS)
        }
        const tokens = this._tokenService.generateTokens({email, rememberMe, id: user.id, role: user.role})

        await this._tokenService.saveToken(user.id, tokens.refreshToken, tokenNames.REFRESH_TOKEN)


        return new LoginResponseDTO(tokens.accessToken, tokens.refreshToken)
    }

    async logout(refreshToken: string): Promise<void> {
        const tokenData = this._tokenService.validateRefreshToken(refreshToken)
        if (!tokenData) {
            throw createError(401, errors.BAD_REFRESH_TOKEN)
        }
        await this._tokenService.removeRefreshToken(refreshToken)
    }
    async refreshAccessToken(refreshToken: string): Promise<LoginResponseDTO> {
        const tokenData = this._tokenService.validateRefreshToken(refreshToken)
        const tokenFromDB = await this._tokenService.findTokenByValue(refreshToken)
        if(!tokenFromDB || !tokenData) {
            console.log('tokenData', refreshToken)
            throw createError(401, errors.BAD_REFRESH_TOKEN)
        }

        const { id, email, role } = tokenData
        const newTokens = this._tokenService.generateTokens({id, email, role})
        await this._tokenService.saveToken(id, newTokens.refreshToken, tokenNames.REFRESH_TOKEN)

        return new LoginResponseDTO(newTokens.accessToken, newTokens.refreshToken)
    }
}