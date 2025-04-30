import { IBaseRepository } from "./IBaseRepository";
import { EventAssignment } from "../entities/EventAssignmentEntity";
import { EventAssignmentStatus } from "../../consts/enums";
import { Event } from "../entities/EventEntity";

export interface IEventAssignmentRepository
  extends IBaseRepository<EventAssignment> {
  findByUserId(userId: string): Promise<EventAssignment[]>;

  findByEventId(eventId: string): Promise<EventAssignment[]>;

  findPendingByEventId(eventId: string): Promise<EventAssignment[]>;

  findByEventIdAndUserId(
    eventId: string,
    userId: string
  ): Promise<EventAssignment | null>;

  updateStatus(
    id: number,
    status: EventAssignmentStatus
  ): Promise<EventAssignment | null>;
  getUserParticipatedEvents(userId: string): Promise<Event[]>;
}
