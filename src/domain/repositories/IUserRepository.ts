import { User } from '../entities/UserEntity'
import {IBaseRepository} from "./IBaseRepository";

export interface IUserRepository extends IBaseRepository<User>{
    findByEmail(email: string): Promise<User | null>;
}