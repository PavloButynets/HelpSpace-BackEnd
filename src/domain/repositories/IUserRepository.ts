import { User } from "../entities/UserEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  getUserFeedbacks(userId: string): Promise<
    Array<{
      feedback: string;
      stars: number;
      joinedAt: Date;
      eventId: number;
      eventTitle: string;
    }>
  >;
  findById(id: string): Promise<User | null>;
}
