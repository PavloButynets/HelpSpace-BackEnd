import {FindOptionsOrder, FindOptionsWhere} from "typeorm";

export interface IBaseRepository<T> {
  deleteById(id: string): Promise<void>;

  findById(id: string): Promise<T | null>;

  findAll(): Promise<T[]>;

  //findItemsByParams(filter: FindOptionsWhere<T>): Promise<IFindItemsDataSet<T>>;

  findWithPagination(
    page: number,
    pageSize: number,
    where?: FindOptionsWhere<T>,
    order?: FindOptionsOrder<T>
  ): Promise<{
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>;

  save(entity: T): Promise<T>;
}
