import { Token } from '../entities/TokenEntity'
import {IBaseRepository} from "./IBaseRepository";
import {TokenName} from "../../consts/auth";

export interface ITokenRepository extends IBaseRepository<Token>{
    findTokenByUserId(userId: string): Promise<Token | null>;
    findTokenByValue(value: string, tokenName: TokenName): Promise<Token>;
    //removeToken(tokenName: string): Promise<void>;
}