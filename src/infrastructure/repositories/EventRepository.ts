import {inject, injectable} from "inversify";
import {DataSource} from "typeorm";
import {DATABASE_TYPES} from "../../container/types/DatabaseTypes";
import {BaseRepository} from "./BaseRepository";
import {Event} from "../../domain/entities/EventEntity";
import {IEventRepository} from "../../domain/repositories/IEventRepository";

@injectable()
export class EventRepository extends BaseRepository<Event> implements IEventRepository{

    constructor(@inject(DATABASE_TYPES.DataSource) dataSource: DataSource) {
        super(dataSource, Event);
    }

}