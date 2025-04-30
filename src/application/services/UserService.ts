import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { inject, injectable } from "inversify";
import { USER_TYPES } from "../../container/types/UserTypes";
import { User } from "../../domain/entities/UserEntity";
import { RegisterUserDTO } from "../dto/request/RegisterUserDTO";
import { hashPassword } from "../../utils/passwordHelper";
import { UserResponseDTO } from "../dto/response/UserResponseDTO";

@injectable()
export class UserService {
  constructor(
    @inject(USER_TYPES.IUserRepository) private userRepository: IUserRepository
  ) {}

  async createUser(user: RegisterUserDTO): Promise<User> {
    const hashedPassword = await hashPassword(user.password);
    const newUser = Object.assign(new User(), {
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      password: hashedPassword,
    });
    return await this.userRepository.save(newUser);
  }
  async getUsers(): Promise<UserResponseDTO[]> {
    const users: User[] = await this.userRepository.findAll();
    return users.map((user) => {
      return {
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        lastLogin: user.lastLogin,
      };
    });
  }
  async getUserById(userId: string): Promise<any | null> {
    const user: User | null = await this.userRepository.findById(userId);
    if (!user) {
      return null;
    }
    // add user's feedbacks to the response
    const feedbacks = user.assignedEvents
      ?.map((assignment) => {
        return {
          feedback: assignment.feedback,
          stars: assignment.stars,
          joinedAt: assignment.joinedAt,
          eventId: assignment.event?.id,
          eventTitle: assignment.event?.title,
          author: {
            id: assignment.event.creator.id,
            firstName: assignment.event.creator.first_name,
            lastName: assignment.event.creator.last_name,
            photo: assignment.event.creator.photo,
          },
        };
      })
      .filter((feedback) => feedback.feedback !== null);

    const createdEvents = user.eventsCreated?.map((event) => ({
      id: event.id,
      title: event.title,
      startDate: event.startDate,
      endDate: event.endDate,

      status: event.status,
      description: event.description,
      city: event.city,
      creator: {
        id: event.creator.id,
        firstName: event.creator.first_name,
        lastName: event.creator.last_name,
        photo: event.creator.photo,
      },
      categories: event.categories?.map((category) => ({
        id: category.id,
        name: category.name,
      })),
    }));

    const attendedEvents = user.assignedEvents?.map((assignment) => ({
      id: assignment.event?.id,
      title: assignment.event?.title,
      startDate: assignment.event?.startDate,
      description: assignment.event?.description,
      endDate: assignment.event?.endDate,
      status: assignment.event?.status,
      city: assignment.event?.city,
      creator: {
        id: assignment.event?.creator.id,
        firstName: assignment.event?.creator.first_name,
        lastName: assignment.event?.creator.last_name,
        photo: assignment.event?.creator.photo,
      },

      categories: (assignment.event?.categories || []).map((category) => ({
        id: category.id,
        name: category.name,
      })),
    }));

    return {
      ...user,

      eventsCreated: createdEvents,
      assignedEvents: attendedEvents,
      feedbacks: feedbacks,
    };
  }

  async getUserFeedbacks(userId: string): Promise<any[]> {
    const user: User | null = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user.assignedEvents
      ?.map((assignment) => {
        return {
          feedback: assignment.feedback,
          stars: assignment.stars,
          joinedAt: assignment.joinedAt,
          eventId: assignment.event?.id,
          eventTitle: assignment.event?.title,
          author: {
            id: assignment.event.creator.id,
            firstName: assignment.event.creator.first_name,
            lastName: assignment.event.creator.last_name,
            photo: assignment.event.creator.photo,
          },
        };
      })
      .filter((feedback) => feedback.feedback !== null);
  }
}
