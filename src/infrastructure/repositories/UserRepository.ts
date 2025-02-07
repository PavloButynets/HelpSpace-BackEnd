import {IUserRepository} from "../../domain/repositories/IUserRepository";
import {inject, injectable} from "inversify";
import {User} from "../../domain/entities/UserEntity";
import {DataSource} from "typeorm";
import {DATABASE_TYPES} from "../../container/types/DatabaseTypes";
import {BaseRepository} from "./BaseRepository";

@injectable()
export class UserRepository extends BaseRepository<User> implements IUserRepository{

    constructor(@inject(DATABASE_TYPES.DataSource) dataSource: DataSource) {
        super(dataSource, User);
    }
    async findByEmail(email: string): Promise<User | null> {
        return this.repository.findOne({where: {email}})
    }
}