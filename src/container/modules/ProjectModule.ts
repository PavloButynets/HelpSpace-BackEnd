import {ContainerModule, interfaces} from 'inversify';
import {ProjectRepository} from "../../infrastructure/repositories/ProjectRepository";
import {PROJECT_TYPES} from "../types/ProjectTypes.";
import {ProjectService} from "../../application/services/ProjectService";
import {ProjectController} from "../../presentation/controllers/ProjectController";

const projectModuleContainer = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<ProjectRepository>(PROJECT_TYPES.IProjectRepository).to(ProjectRepository)
    bind<ProjectService>(PROJECT_TYPES.ProjectService).to(ProjectService)
    bind<ProjectController>(PROJECT_TYPES.ProjectController).to(ProjectController)
});

export default projectModuleContainer;
