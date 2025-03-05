import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { USER_TYPES } from "../../container/types/UserTypes";
import { inject, injectable } from "inversify";
import { RegisterUserDTO } from "../dto/request/RegisterUserDTO";
import { UserService } from "./UserService";
import { createError } from "../../utils/errorsHelper";
import { errors } from "../../consts/errors";
import { comparePasswords } from "../../utils/passwordHelper";
import { LoginResponseDTO } from "../dto/response/LoginResponseDTO";
import { TokenService } from "./TokenService";
import { TOKEN_TYPES } from "../../container/types/TokenTypes";
import { tokenNames } from "../../consts/auth";
import { LoginRequestDTO } from "../dto/request/LoginRequest";
import { User } from "../../domain/entities/UserEntity";
import { EmailService } from "./EmailService";
import { EMAIL_TYPES } from "../../container/types/EmailTypes";
import { emailType } from "../../consts/emails";

@injectable()
export class AuthService {
  private _userRepository: UserRepository;
  private _userService: UserService;
  private _tokenService: TokenService;
  private _emailService: EmailService;

  constructor(
    @inject(USER_TYPES.IUserRepository) userRepository: UserRepository,
    @inject(USER_TYPES.UserService) userService: UserService,
    @inject(TOKEN_TYPES.TokenService) tokenService: TokenService,
    @inject(EMAIL_TYPES.EmailService) emailService: EmailService,
  ) {
    this._userRepository = userRepository;
    this._userService = userService;
    this._tokenService = tokenService;
    this._emailService = emailService;
  }

  async register(userDto: RegisterUserDTO): Promise<string> {
    const user = await this._userService.createUser(userDto);
    const confirmToken = this._tokenService.generateConfirmToken({
      id: user.id,
      email: user.email,
    });
    await this._tokenService.saveToken(
      user.id,
      confirmToken,
      tokenNames.CONFIRM_TOKEN,
    );
    await this._emailService.sendEmail(
      user.email,
      emailType.EMAIL_CONFIRMATION,
      "uk",
      {
        confirmToken,
        email: user.email,
        id: user.id,
      },
    );

    return user.email;
  }

  async login(loginDto: LoginRequestDTO): Promise<LoginResponseDTO> {
    const { email, password, rememberMe } = loginDto;

    const user: User | null = await this._userRepository.findByEmail(email);
    if (!user) {
      throw createError(401, errors.USER_NOT_FOUND);
    }
    const checkedPassword = await comparePasswords(password, user.password);

    if (!checkedPassword) {
      throw createError(401, errors.INCORRECT_CREDENTIALS);
    }

    const { isEmailConfirmed } = user

    if (!isEmailConfirmed) {
      throw createError(401, errors.EMAIL_NOT_CONFIRMED)
    }
    const tokens = this._tokenService.generateTokens({
      email,
      rememberMe,
      id: user.id,
      role: user.role,
    });

    await this._tokenService.saveToken(
      user.id,
      tokens.refreshToken,
      tokenNames.REFRESH_TOKEN,
    );

    return new LoginResponseDTO(tokens.accessToken, tokens.refreshToken);
  }
  async confirmEmail(confirmToken: string): Promise<void> {
    const tokenData = this._tokenService.validateConfirmToken(confirmToken);
    const tokenFromDB = await this._tokenService.findTokenByValue(confirmToken, tokenNames.CONFIRM_TOKEN);
    if (!tokenData || !tokenFromDB) {
      throw createError(401, errors.BAD_REFRESH_TOKEN);
    }

    const user = await this._userRepository.findById(tokenData.id);
    if(!user){
        throw createError(401, errors.USER_NOT_FOUND);
    }

    if (user.isEmailConfirmed) {
      throw createError(401, errors.EMAIL_ALREADY_CONFIRMED);
    }

    await this._userRepository.update(user.id, { isEmailConfirmed: true });
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenData = this._tokenService.validateRefreshToken(refreshToken);
    if (!tokenData) {
      throw createError(401, errors.BAD_REFRESH_TOKEN);
    }
    await this._tokenService.removeRefreshToken(refreshToken);
  }

  async refreshAccessToken(refreshToken: string): Promise<LoginResponseDTO> {
    const tokenData = this._tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await this._tokenService.findTokenByValue(refreshToken, tokenNames.REFRESH_TOKEN);
    if (!tokenFromDB || !tokenData) {
      throw createError(401, errors.BAD_REFRESH_TOKEN);
    }

    const { id, email, role } = tokenData;
    const newTokens = this._tokenService.generateTokens({ id, email, role });
    await this._tokenService.saveToken(
      id,
      newTokens.refreshToken,
      tokenNames.REFRESH_TOKEN,
    );

    return new LoginResponseDTO(newTokens.accessToken, newTokens.refreshToken);
  }
}
