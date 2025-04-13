import {inject, injectable} from "inversify";
import {DataSource, In} from "typeorm";
import {DATABASE_TYPES} from "../../container/types/DatabaseTypes";
import {BaseRepository} from "./BaseRepository";
import {ICategoryRepository} from "../../domain/repositories/ICategoriesRepository";
import {Category} from "../../domain/entities/CategoryEntity";

@injectable()
export class CategoryRepository extends BaseRepository<Category> implements ICategoryRepository{

    constructor(@inject(DATABASE_TYPES.DataSource) dataSource: DataSource) {
        super(dataSource, Category);
    }
    findByNames(categoryNames: string[]): Promise<Category[]> {
        return this.repository.find({
            where: {
                name: In(categoryNames)
            }
        });
    }
}