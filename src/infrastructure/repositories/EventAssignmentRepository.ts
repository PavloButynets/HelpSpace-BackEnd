import { inject, injectable } from "inversify";
import { DataSource } from "typeorm";
import { DATABASE_TYPES } from "../../container/types/DatabaseTypes";
import { BaseRepository } from "./BaseRepository";
import { EventAssignment } from "../../domain/entities/EventAssignmentEntity";
import { IEventAssignmentRepository } from "../../domain/repositories/IEventAssignmentRepository";
import { EventAssignmentStatus } from "../../consts/enums";
import { Event } from "../../domain/entities/EventEntity";

@injectable()
export class EventAssignmentRepository
  extends BaseRepository<EventAssignment>
  implements IEventAssignmentRepository
{
  constructor(@inject(DATABASE_TYPES.DataSource) dataSource: DataSource) {
    super(dataSource, EventAssignment);
  }

  async findByUserId(userId: string): Promise<EventAssignment[]> {
    return this.repository.find({
      where: { user: { id: userId } },
    });
  }

  async findByEventId(eventId: string): Promise<EventAssignment[]> {
    return this.repository.find({
      where: { event: { id: eventId } },
    });
  }

  async findPendingByEventId(eventId: string): Promise<EventAssignment[]> {
    return this.repository.find({
      where: {
        event: { id: eventId },
        status: EventAssignmentStatus.PENDING,
      },
    });
  }

  async findByEventIdAndUserId(
    eventId: string,
    userId: string
  ): Promise<EventAssignment | null> {
    return this.repository.findOne({
      where: {
        event: { id: eventId },
        user: { id: userId },
      },
    });
  }

  async updateStatus(
    id: number,
    status: EventAssignmentStatus
  ): Promise<EventAssignment | null> {
    await this.repository.update(id, { status });
    return this.repository.findOneBy({ id });
  }

  async getUserParticipatedEvents(userId: string): Promise<Event[]> {
    const assignments = await this.repository.find({
      where: {
        user: { id: userId },
      },
      relations: ["event.categories", "event.location", "event.creator"],
    });

    const events = assignments.map((assignment) => assignment.event);
    const uniqueEvents = Array.from(
      new Map(events.map((event) => [event.id, event])).values()
    );

    return uniqueEvents;
  }
}
