import {Repository, DataSource, EntityTarget, FindOptionsWhere} from "typeorm";
import {IBaseRepository} from "../../domain/repositories/IBaseRepository";

export abstract class BaseRepository<T extends Object> implements IBaseRepository<T> {
    protected repository: Repository<T>;

    protected constructor(dataSource: DataSource, entity: EntityTarget<T>) {
        this.repository = dataSource.getRepository(entity);
    }


    async findById(id: string): Promise<T | null> {
        return this.repository.findOne({ where: { id } as any });
    }

    async save(entity: T): Promise<T> {
        return this.repository.save(entity);
    }

    async getAll(): Promise<T[]> {
        return this.repository.find();
    }

    async deleteById(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async getByFilter(filter: FindOptionsWhere<T>): Promise<T[]> {
        return this.repository.find({ where: filter });
    }

}
