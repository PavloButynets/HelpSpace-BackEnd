import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { inject, injectable } from "inversify";
import { User } from "../../domain/entities/UserEntity";
import { DataSource } from "typeorm";
import { DATABASE_TYPES } from "../../container/types/DatabaseTypes";
import { BaseRepository } from "./BaseRepository";
import { EventAssignment } from "../../domain/entities/EventAssignmentEntity";

@injectable()
export class UserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  constructor(@inject(DATABASE_TYPES.DataSource) dataSource: DataSource) {
    super(dataSource, User);
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }
  async getUserFeedbacks(userId: string): Promise<
    Array<{
      feedback: string;
      stars: number;
      joinedAt: Date;
      eventId: number;
      eventTitle: string;
    }>
  > {
    return this.repository.manager
      .getRepository(EventAssignment)
      .createQueryBuilder("assignment")
      .leftJoinAndSelect("assignment.event", "event")
      .where("assignment.user_id = :userId", { userId })
      .andWhere("assignment.feedback IS NOT NULL")
      .select([
        "assignment.feedback AS feedback",
        "assignment.stars AS stars",
        "assignment.joinedAt AS joinedAt",
        "event.id AS eventId",
        "event.title AS eventTitle",
      ])
      .getRawMany();
  }
  async findById(userId: string): Promise<User | null> {
    return this.repository.findOne({
      where: { id: userId },
      relations: [
        "eventsCreated",
        "assignedEvents",
        "assignedEvents.event",
        "assignedEvents.event.categories",
      ],
    });
  }
}
