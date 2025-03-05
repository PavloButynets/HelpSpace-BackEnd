import {ITokenRepository} from "../../domain/repositories/ITokenRepository";
import {inject, injectable} from "inversify";
import {DataSource} from "typeorm";
import {DATABASE_TYPES} from "../../container/types/DatabaseTypes";
import {BaseRepository} from "./BaseRepository";
import {Token} from "../../domain/entities/TokenEntity";
import {TokenName} from "../../consts/auth";

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

    async findTokenByValue(value: string, tokenName: TokenName): Promise<Token> {
        let token = await this.repository.findOne({
            where: {[tokenName]: value},
        });
        if (!token) {
            throw new Error('Token not found');
        }
        return token;
    }

}