import {ContainerModule, interfaces} from 'inversify';
import {USER_TYPES} from "../types/UserTypes";
import {IUserRepository} from "../../domain/repositories/IUserRepository";
import {UserRepository} from "../../infrastructure/repositories/UserRepository";
import {UserController} from "../../presentation/controllers/UserСontroller";
import {UserService} from "../../application/services/UserService";

const userModuleContainer = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<IUserRepository>(USER_TYPES.IUserRepository).to(UserRepository)

    bind<UserService>(USER_TYPES.UserService).to(UserService)

    bind<UserController>(USER_TYPES.UserController).to(UserController)
});

export default userModuleContainer;
