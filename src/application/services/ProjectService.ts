import {inject, injectable} from "inversify";
import {PROJECT_TYPES} from "../../container/types/ProjectTypes.";
import {IProjectRepository} from "../../domain/repositories/IProjectRepository";
import {Project} from "../../domain/entities/ProjectEntity";
import { CreateProjectDTO } from "../dto/request/CreateProjectDTO";
import {ProjectResponseDTO} from "../dto/response/ProjectResponseDTO";

@injectable()
export class ProjectService {
    constructor(@inject(PROJECT_TYPES.IProjectRepository) private projectRepository: IProjectRepository) {
    }
    async createProject(project: CreateProjectDTO): Promise<ProjectResponseDTO> {
        const newProject = Object.assign(new Project(), project)

        const savedProject: Project = await this.projectRepository.save(newProject);
        return {
            title: savedProject.title,
            description: savedProject.description,
            deadline: savedProject.deadline,
            location: savedProject.location,
            status: savedProject.status,
            category: savedProject.category,
            creator: savedProject.creator.id
        }
    }
}