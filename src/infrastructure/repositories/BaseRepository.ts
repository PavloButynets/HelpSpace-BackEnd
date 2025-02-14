import {Repository, DataSource, EntityTarget} from "typeorm";
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

    async findAll(): Promise<T[]> {
        return this.repository.find();
    }

    async deleteById(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    // async findItemsByParams(filter: FindOptionsWhere<T>): Promise<IFindItemsDataSet<T>> {
    //     return this.repository.find({ where: filter });
    // }

}
