export interface IFindItemsDataSet<T> {
    count: number;
    rows: T[]
}

export interface IBaseRepository<T> {
    deleteById(id: string): Promise<void>;

    findById(id: string): Promise<T | null>;

    findAll(): Promise<T[]>;

    //findItemsByParams(filter: FindOptionsWhere<T>): Promise<IFindItemsDataSet<T>>;

    save(entity: T): Promise<T>;
}