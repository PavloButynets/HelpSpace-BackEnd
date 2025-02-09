import {IUserRepository} from "../../domain/repositories/IUserRepository";
import {inject, injectable} from "inversify";
import {USER_TYPES} from "../../container/types/UserTypes";
import {User} from "../../domain/entities/UserEntity";
import {RegisterUserDTO} from "../dto/RegisterUserDTO";
import {hashPassword} from "../../utils/passwordHelper";
import {UserResponseDTO} from "../dto/UserResponseDTO";

@injectable()
export class UserService {
    constructor(@inject(USER_TYPES.IUserRepository) private userRepository: IUserRepository) {
    }

    async createUser(user: RegisterUserDTO): Promise<UserResponseDTO> {
        const hashedPassword = await hashPassword(user.password)
        const newUser = Object.assign(new User(), {
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            password: hashedPassword
        })

        const savedUser: User = await this.userRepository.save(newUser);
        return {
            firstName: savedUser.first_name,
            lastName: savedUser.last_name,
            email: savedUser.email,
            lastLogin: savedUser.lastLogin,
        }
    }
}