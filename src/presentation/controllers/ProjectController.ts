import { Request, Response } from 'express';
import {inject, injectable} from "inversify";
import {PROJECT_TYPES} from "../../container/types/ProjectTypes.";
import {plainToInstance} from 'class-transformer';
import {ProjectService} from "../../application/services/ProjectService";
import {CreateProjectDTO} from "../../application/dto/request/CreateProjectDTO";

@injectable()
export class ProjectController {
    constructor(@inject(PROJECT_TYPES.ProjectService) private projectService: ProjectService) {}

    async createProject  (req: Request, res: Response) {
        try{
            const dto = plainToInstance(CreateProjectDTO, req.body);

            const project = await this.projectService.createProject(dto);
            res.status(200).json(project);
        }
        catch(err){
            console.log(err);
            res.status(500).json({message: err.message});
        }
    }
}