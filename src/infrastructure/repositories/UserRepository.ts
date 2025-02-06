import {IUserRepository} from "../../domain/repositories/IUserRepository";

export class UserRepository implements IUserRepository{
    async findById(id: string): Promise<any> {
        return null;
    }
    async save(user: any): Promise<void> {

    }
    async getUsers(): Promise<any> {
        return null;
    }
}