import {Repository, DataSource, EntityTarget, FindOptionsOrder, FindOptionsWhere} from "typeorm";
import {IBaseRepository} from "../../domain/repositories/IBaseRepository";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";

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

    async update(id: string, entity: QueryDeepPartialEntity<T>): Promise<T> {
        await this.repository.update(id, entity);
        const updatedEntity = await this.findById(id);

        if (!updatedEntity) {
            throw new Error("Entity not found after update");
        }

        return updatedEntity;
    }

    async findWithPagination(
        page: number,
        pageSize: number,
        where?: FindOptionsWhere<T>,
        order?: FindOptionsOrder<T>
    ): Promise<{ data: T[]; total: number; page: number; pageSize: number; totalPages: number }> {
        const [data, total] = await this.repository.findAndCount({
            skip: (page - 1) * pageSize,
            take: pageSize,
            where,
            order,
        });
        return {
            data,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    }
    // async findItemsByParams(filter: FindOptionsWhere<T>): Promise<IFindItemsDataSet<T>> {
    //     return this.repository.find({ where: filter });
    // }

}
