import {UserRepository} from "../../infrastructure/repositories/UserRepository";
import {USER_TYPES} from "../../container/types/UserTypes";
import {inject, injectable} from "inversify";
import {RegisterUserDTO} from "../dto/RegisterUserDTO";
import {User} from "../../domain/entities/UserEntity";

@injectable()
export class AuthService {
    private userRepository: UserRepository;
    constructor(@inject(USER_TYPES.IUserRepository) userRepository: UserRepository) {
        this.userRepository = userRepository;
    }
    async register(userDto: RegisterUserDTO): Promise<User> {

        const newUser = Object.assign(new User(), {
            first_name: userDto.firstName,
            last_name: userDto.lastName,
            country: userDto.country,
            city: userDto.city,
            email: userDto.email,
            password: userDto.password,
            role: userDto.role
        });


        return this.userRepository.save(newUser)
    }
}