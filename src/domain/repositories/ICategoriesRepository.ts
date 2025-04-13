import {IBaseRepository} from "./IBaseRepository";
import {Category} from "../entities/CategoryEntity";

export interface ICategoryRepository extends IBaseRepository<Category>{
    findByNames(categoryNames: string[]): Promise<Category[]>
}