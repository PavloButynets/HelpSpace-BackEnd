import { IBaseRepository } from "./IBaseRepository";
import { Event } from "../entities/EventEntity";

export interface IEventRepository extends IBaseRepository<Event> {
  findByCreatorId(creatorId: string): Promise<Event[]>;
  findByParticipantId(userId: string): Promise<Event[]>;
}
