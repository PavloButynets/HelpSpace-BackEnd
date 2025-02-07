import {ContainerModule, interfaces} from 'inversify';
import {AUTH_TYPES} from "../types/AuthTypes";
import {AuthService} from "../../application/services/AuthService";
import {AuthController} from "../../presentation/controllers/AuthController";

const authModuleContainer = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {

    bind<AuthService>(AUTH_TYPES.AuthService).to(AuthService)

    bind<AuthController>(AUTH_TYPES.AuthController).to(AuthController)
});

export default authModuleContainer;
