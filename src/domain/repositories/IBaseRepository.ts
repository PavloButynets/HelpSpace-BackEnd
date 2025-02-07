export interface IBaseRepository<T> {
    findById(id: string): Promise<T | null>;
    save(entity: T): Promise<T>;
    getAll(): Promise<T[]>;
    deleteById(id: string): Promise<void>;
}