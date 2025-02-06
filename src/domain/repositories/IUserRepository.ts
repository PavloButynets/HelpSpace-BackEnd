import { User } from '../entities/UserEntity'

export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    save(user: User): Promise<void>;
    getUsers(): Promise<User[]>;
}