import {ITokenRepository} from "../../domain/repositories/ITokenRepository";
import {inject, injectable} from "inversify";
import {DataSource} from "typeorm";
import {DATABASE_TYPES} from "../../container/types/DatabaseTypes";
import {BaseRepository} from "./BaseRepository";
import {Token} from "../../domain/entities/TokenEntity";

@injectable()
export class TokenRepository extends BaseRepository<Token> implements ITokenRepository {
    constructor(@inject(DATABASE_TYPES.DataSource) dataSource: DataSource) {
        super(dataSource, Token);
    }

    async findTokenByUserId(userId: string): Promise<Token | null> {
        return this.repository.findOne({
            where: { userId }
        });
    }

    async findTokenByValue(value: string): Promise<Token> {
        let token = await this.repository.findOne({
            where: [
                {refreshToken: value},
                {resetToken: value},
                {confirmToken: value},
            ],
        });
        if (!token) {
            throw new Error('Token not found');
        }
        return token;
    }
}