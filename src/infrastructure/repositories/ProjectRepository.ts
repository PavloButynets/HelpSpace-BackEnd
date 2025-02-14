import {inject, injectable} from "inversify";
import {DataSource} from "typeorm";
import {DATABASE_TYPES} from "../../container/types/DatabaseTypes";
import {BaseRepository} from "./BaseRepository";
import {Project} from "../../domain/entities/ProjectEntity";
import {IProjectRepository} from "../../domain/repositories/IProjectRepository";

@injectable()
export class ProjectRepository extends BaseRepository<Project> implements IProjectRepository{

    constructor(@inject(DATABASE_TYPES.DataSource) dataSource: DataSource) {
        super(dataSource, Project);
    }

}