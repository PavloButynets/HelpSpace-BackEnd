import {IUserRepository} from "../../domain/repositories/IUserRepository";
import {inject, injectable} from "inversify";
import {USER_TYPES} from "../../container/types/UserTypes";

@injectable()
export class UserService {
    constructor(@inject(USER_TYPES.IUserRepository) private userRepository: IUserRepository) {
    }
    async findById(id: string) {
        return this.userRepository.findById(id);
    }
    async save(user: any) {
        return this.userRepository.save(user);
    }
    async getUsers() {
        return this.userRepository.getAll();
    }

}