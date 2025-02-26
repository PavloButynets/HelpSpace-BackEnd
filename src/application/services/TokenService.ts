import jwt, {JwtPayload} from 'jsonwebtoken';
import {Token} from '../../domain/entities/TokenEntity';
import {config} from '../../config/envConfig';
import {errors} from '../../consts/errors';
import {tokenNames} from '../../consts/auth';
import {createError} from '../../utils/errorsHelper';
import {TOKEN_TYPES} from "../../container/types/TokenTypes";
import {inject, injectable} from "inversify";
import {ITokenRepository} from "../../domain/repositories/ITokenRepository";

export interface ITokenPayload extends JwtPayload {
    id: string;
    email: string;
    rememberMe?: boolean;

    [key: string]: any;
}

const {
    JWT_ACCESS_SECRET,
    JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES_IN,
    JWT_REFRESH_LONG_TERM_EXPIRES_IN,
    JWT_RESET_SECRET,
    JWT_RESET_EXPIRES_IN,
    JWT_CONFIRM_SECRET,
    JWT_CONFIRM_EXPIRES_IN
} = config;

const {INVALID_TOKEN_NAME} = errors;

@injectable()
export class TokenService {
    private _tokenRepository: ITokenRepository;

    constructor(@inject(TOKEN_TYPES.ITokenRepository) tokenRepository: ITokenRepository) {
        this._tokenRepository = tokenRepository;
    }

    generateTokens(payload: ITokenPayload) {
        const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
            expiresIn: JWT_ACCESS_EXPIRES_IN,
        });

        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
            expiresIn: payload.rememberMe ? JWT_REFRESH_LONG_TERM_EXPIRES_IN : JWT_REFRESH_EXPIRES_IN,
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    generateResetToken(payload: ITokenPayload) {
        return jwt.sign(payload, JWT_RESET_SECRET, {
            expiresIn: JWT_RESET_EXPIRES_IN,
        });
    }

    generateConfirmToken(payload: ITokenPayload) {
        return jwt.sign(payload, JWT_CONFIRM_SECRET, {
            expiresIn: JWT_CONFIRM_EXPIRES_IN,
        });
    }

    validateToken(token: string, secret: string): JwtPayload | null {
        try {
            return jwt.verify(token, secret) as JwtPayload;
        } catch (e) {
            return null;
        }
    }

    validateAccessToken(token: string) {
        return this.validateToken(token, JWT_ACCESS_SECRET);
    }

    validateRefreshToken(token: string) {
        return this.validateToken(token, JWT_REFRESH_SECRET);
    }

    validateResetToken(token: string) {
        return this.validateToken(token, JWT_RESET_SECRET);
    }

    validateConfirmToken(token: string) {
        return this.validateToken(token, JWT_CONFIRM_SECRET);
    }

    async saveToken(userId: string, tokenValue: string, tokenName: string): Promise<Token | null> {
        if (!Object.values(tokenNames).includes(tokenName)) {
            throw createError(404, INVALID_TOKEN_NAME);
        }

        try {
            let tokenData: Token | null = await this._tokenRepository.findTokenByUserId(userId)
            if (tokenData) {
                tokenData[tokenName] = tokenValue;
                return await this._tokenRepository.save(tokenData);
            }

            const newToken = new Token();
            newToken.userId = userId;
            newToken[tokenName] = tokenValue;

            console.log(newToken)

            tokenData = await this._tokenRepository.save(newToken)

            return tokenData;
        } catch (error) {
            throw new Error(`Failed to save token: ${error}`);
        }
    }

    async findTokenByValue(tokenValue: string): Promise<Token | null> {
        try {
            return await this._tokenRepository.findTokenByValue(tokenValue);
        } catch (error) {
            return null;
        }
    }


    async removeRefreshToken(refreshToken: string): Promise<void> {
        const token = await this._tokenRepository.findTokenByValue(refreshToken)
        token.refreshToken = null;
        await this._tokenRepository.save(token);
    }

    async removeResetToken(userId: string) {
        const token = await this._tokenRepository.findTokenByUserId(userId)
        if (token) {
            token.resetToken = null;
            await this._tokenRepository.save(token);
        }
    }

    async removeConfirmToken(confirmToken: string) {
        const token = await this._tokenRepository.findTokenByValue(confirmToken)
        token.confirmToken = null;
        await this._tokenRepository.save(token);
    }
}

