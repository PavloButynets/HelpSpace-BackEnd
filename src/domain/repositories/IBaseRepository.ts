import {FindOptionsWhere} from "typeorm";

export interface IBaseRepository<T> {
    deleteById(id: string): Promise<void>;

    findById(id: string): Promise<T | null>;

    getAll(): Promise<T[]>;

    getByFilter(filter: FindOptionsWhere<T>): Promise<T[]>;

    save(entity: T): Promise<T>;
}