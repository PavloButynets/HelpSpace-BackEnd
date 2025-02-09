import { Token } from '../entities/TokenEntity'
import {IBaseRepository} from "./IBaseRepository";

export interface ITokenRepository extends IBaseRepository<Token>{
    findTokenByUserId(userId: string): Promise<Token | null>;
    findTokenByValue(value: string): Promise<Token>;
    //removeToken(tokenName: string): Promise<void>;
}