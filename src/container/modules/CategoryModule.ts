import {ContainerModule, interfaces} from 'inversify';
import {CATEGORY_TYPES} from "../types/CategoryTypes";
import {CategoryRepository} from "../../infrastructure/repositories/CategoryRepository";

const categoryModuleContainer = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<CategoryRepository>(CATEGORY_TYPES.ICategoryRepository).to(CategoryRepository).inSingletonScope()
});

export default categoryModuleContainer;
