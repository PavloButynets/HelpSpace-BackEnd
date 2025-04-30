import { inject, injectable } from "inversify";
import { DataSource } from "typeorm";
import { DATABASE_TYPES } from "../../container/types/DatabaseTypes";
import { BaseRepository } from "./BaseRepository";
import { Event } from "../../domain/entities/EventEntity";
import { IEventRepository } from "../../domain/repositories/IEventRepository";
import { EventAssignment } from "../../domain/entities/EventAssignmentEntity";

@injectable()
export class EventRepository
  extends BaseRepository<Event>
  implements IEventRepository
{
  constructor(@inject(DATABASE_TYPES.DataSource) dataSource: DataSource) {
    super(dataSource, Event);
  }
  async findByCreatorId(creatorId: string): Promise<Event[]> {
    return this.repository.find({ where: { creator: { id: creatorId } } });
  }

  async findByParticipantId(userId: string): Promise<Event[]> {
    const assignments = await this.repository.manager.find(EventAssignment, {
      where: { user: { id: userId } },
      order: { joinedAt: "DESC" },
    });
    return assignments.map((assignment) => assignment.event);
  }
}
