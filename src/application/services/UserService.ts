import {IUserRepository} from "../../domain/repositories/IUserRepository";

export class UserService {
    constructor(private userRepository: IUserRepository) {
    }
    async findById(id: string) {
        return this.userRepository.findById(id);
    }
    async save(user: any) {
        return this.userRepository.save(user);
    }
    async getUsers() {
        return this.userRepository.getUsers();
    }

}