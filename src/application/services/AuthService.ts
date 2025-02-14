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

        const user = await this._userRepository.findByEmail(email);
        if (!user) {
            throw createError(401, errors.USER_NOT_FOUND)
        }
        const checkedPassword = await comparePasswords(password, user.password)

        if (!checkedPassword) {
            throw createError(401, errors.INCORRECT_CREDENTIALS)
        }
        const tokens = this._tokenService.generateTokens({email, rememberMe, id: user.id})

        await this._tokenService.saveToken(user.id, tokens.refreshToken, tokenNames.REFRESH_TOKEN)


        return new LoginResponseDTO(user.first_name, user.last_name, user.email, user.lastLogin, tokens.accessToken, tokens.refreshToken)
    }
}