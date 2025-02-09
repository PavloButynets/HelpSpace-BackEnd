import {ContainerModule, interfaces} from 'inversify';
import {TOKEN_TYPES} from "../types/TokenTypes";
import {TokenRepository} from "../../infrastructure/repositories/TokenRepository";
import {TokenService} from "../../application/services/TokenService";

const tokenModuleContainer = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<TokenRepository>(TOKEN_TYPES.ITokenRepository).to(TokenRepository)
    bind<TokenService>(TOKEN_TYPES.TokenService).to(TokenService)
});

export default tokenModuleContainer;
