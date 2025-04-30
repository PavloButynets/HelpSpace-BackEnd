import { inject, injectable } from "inversify";
import { EVENT_TYPES } from "../../container/types/EventTypes.";
import { IEventRepository } from "../../domain/repositories/IEventRepository";
import { Event } from "../../domain/entities/EventEntity";
import { CreateEventDTO } from "../dto/request/CreateEventDTO";
import { EventResponseDTO } from "../dto/response/EventResponseDTO";
import { plainToInstance } from "class-transformer";
import { PaginatedResponse } from "../../types";
import { CATEGORY_TYPES } from "../../container/types/CategoryTypes";
import { ICategoryRepository } from "../../domain/repositories/ICategoriesRepository";
import { ILike, In, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { EventFilters } from "../../types";
import { Category } from "../../domain/entities/CategoryEntity";
import { S3File } from "../../types/common";
import { EVENT_ASSIGNMENT_TYPES } from "../../container/types/EventAssignmentTypes";
import { IEventAssignmentRepository } from "../../domain/repositories/IEventAssignmentRepository";
import { EventAssignment } from "../../domain/entities/EventAssignmentEntity";
import { EventAssignmentStatus } from "../../consts/enums";

@injectable()
export class EventService {
  constructor(
    @inject(EVENT_TYPES.IEventRepository)
    private _eventRepository: IEventRepository,
    @inject(CATEGORY_TYPES.ICategoryRepository)
    private _categoryRepository: ICategoryRepository,
    @inject(EVENT_ASSIGNMENT_TYPES.IEventAssignmentRepository)
    private _eventAssignmentRepository: IEventAssignmentRepository
  ) {}
  async createEvent(
    event: CreateEventDTO,
    userId: string,
    photoUrl?: string
  ): Promise<EventResponseDTO> {
    event.creator = userId;
    event.coverImage = photoUrl;

    const newEvent = Object.assign(new Event(), event) as Event;
    console.log(newEvent);
    const savedEvent: Event = await this._eventRepository.save(newEvent);

    return {
      id: savedEvent.id,
      title: savedEvent.title,
      description: savedEvent.description,
      registrationDeadline: savedEvent.registrationDeadline,
      location: savedEvent.city,
      status: savedEvent.status,
      coverImage: savedEvent.coverImage,
      categories: savedEvent.categories,
      creator: {
        id: savedEvent.creator.id,
        photo: savedEvent.creator.photo,
        firstName: savedEvent.creator.first_name,
        lastName: savedEvent.creator.last_name,
      },
      startDate: savedEvent.startDate,
      endDate: savedEvent.endDate,
    };
  }

  async uploadFiles(file: S3File): Promise<string> {
    try {
      if (!file.location) {
        throw new Error(
          `Не вдалось отримати URL для файлу: ${file.originalname}`
        );
      }

      return file.location;
    } catch (error) {
      console.error("Помилка при завантаженні файлів:", error);
      throw new Error("Не вдалось завантажити файли");
    }
  }
  async getAllEvents(
    page: number = 1,
    limit: number = 10,
    filters?: EventFilters
  ): Promise<PaginatedResponse<EventResponseDTO>> {
    if (limit > 100) limit = 100;

    const whereConditions: Record<string, any> = {};

    if (filters?.city) {
      whereConditions.city = ILike(`%${filters.city.split(",")[0]}%`);
    }

    if (filters?.categories) {
      const categoryNames = Array.isArray(filters.categories)
        ? filters.categories
        : [filters.categories];

      if (categoryNames.length > 0) {
        const categories =
          await this._categoryRepository.findByNames(categoryNames);
        if (categories && categories.length > 0) {
          whereConditions.categories = {
            id: In(categories.map((category) => category.id)),
          };
        }
      }
    }

    if (filters?.eventDate) {
      const selectedDate = new Date(filters.eventDate);

      const startDate = new Date(selectedDate);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(selectedDate);
      endDate.setHours(23, 59, 59, 999);

      whereConditions.startDate = LessThanOrEqual(endDate);
      whereConditions.endDate = MoreThanOrEqual(startDate);
    }

    if (filters?.showCompleted) {
      whereConditions.status = In(["UPCOMING", "ACTIVE", "COMPLETED"]);
    } else {
      whereConditions.status = In(["UPCOMING", "ACTIVE"]);
    }
    const result = await this._eventRepository.findWithPagination(
      page,
      limit,
      whereConditions,
      { startDate: "DESC" }
    );
    const { data: events, total } = result;
    const totalPages = Math.ceil(total / limit);

    const items = events.map((event) => {
      const plainEvent = {
        ...event,
        creator: {
          id: event.creator.id,
          photo: event.creator.photo,
          firstName: event.creator.first_name,
          lastName: event.creator.last_name,
        },
      };
      return plainToInstance(EventResponseDTO, plainEvent);
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getEventById(id: string): Promise<EventResponseDTO> {
    const event = await this._eventRepository.findById(id);
    if (!event) {
      throw new Error("Event not found");
    }
    const plainEvent = {
      ...event,
      creator: {
        id: event.creator.id,
        photo: event.creator.photo,
        firstName: event.creator.first_name,
        lastName: event.creator.last_name,
        email: event.creator.email,
      },
    };
    return plainToInstance(EventResponseDTO, plainEvent);
  }
  async getCategories(): Promise<Category[]> {
    return await this._categoryRepository.findAll();
  }

  async getUserCreatedEvents(userId: string): Promise<EventResponseDTO[]> {
    const events = await this._eventRepository.findByCreatorId(userId);
    return events.map((event) => {
      const plainEvent = {
        ...event,
        creator: {
          id: event.creator.id,
          photo: event.creator.photo,
          firstName: event.creator.first_name,
          lastName: event.creator.last_name,
        },
      };
      return plainToInstance(EventResponseDTO, plainEvent);
    });
  }
  async getUserJoinedEvents(userId: string): Promise<EventResponseDTO[]> {
    const assignments =
      await this._eventAssignmentRepository.findByUserId(userId);

    const eventsWithStatus = assignments.map((assignment) => {
      const event = assignment.event;
      const plainEvent = {
        ...event,
        applicationStatus: assignment.status,
        hoursWorked: assignment.hoursWorked,
        stars: assignment.stars,
        feedback: assignment.feedback,
        joinedAt: assignment.joinedAt,
        creator: {
          id: event.creator.id,
          photo: event.creator.photo,
          firstName: event.creator.first_name,
          lastName: event.creator.last_name,
        },
      };

      return plainToInstance(EventResponseDTO, plainEvent);
    });

    return eventsWithStatus;
  }

  async getApplicantsByEventId(eventId: string): Promise<EventAssignment[]> {
    return this._eventAssignmentRepository.findPendingByEventId(eventId);
  }

  async rejectOrAcceptApplicant(
    eventId: string,
    userId: string,
    action: string
  ): Promise<EventAssignment | null> {
    const assignment =
      await this._eventAssignmentRepository.findByEventIdAndUserId(
        eventId,
        userId
      );

    if (!assignment) {
      throw new Error("Заявка не знайдена");
    }

    if (assignment.status !== EventAssignmentStatus.PENDING) {
      throw new Error("Заявка вже оброблена");
    }

    const updatedAssignment =
      await this._eventAssignmentRepository.updateStatus(
        assignment.id,
        action === EventAssignmentStatus.ACCEPTED
          ? EventAssignmentStatus.ACCEPTED
          : EventAssignmentStatus.REJECTED
      );

    if (action === EventAssignmentStatus.ACCEPTED) {
      const event = await this._eventRepository.findById(eventId);
      if (event && event.participantsCount !== undefined) {
        event.participantsCount += 1;
        await this._eventRepository.save(event);
      }
    }

    return updatedAssignment;
  }
  async applyForEvent(
    eventId: string,
    userId: string
  ): Promise<EventAssignment> {
    const existingAssignment =
      await this._eventAssignmentRepository.findByEventIdAndUserId(
        eventId,
        userId
      );

    if (existingAssignment) {
      throw new Error("Ви вже подали заявку на цю подію");
    }

    const event = await this._eventRepository.findById(eventId);
    if (!event) {
      throw new Error("Подію не знайдено");
    }

    if (event.participantsCount >= event.volunteerSlots) {
      throw new Error("Немає вільних місць для цієї події");
    }

    const newAssignment = new EventAssignment();
    newAssignment.event = event;
    newAssignment.user = { id: userId } as any;
    newAssignment.status = EventAssignmentStatus.PENDING;

    return this._eventAssignmentRepository.save(newAssignment);
  }

  async getEventsByParticipantId(userId: string): Promise<Event[]> {
    const assignments =
      await this._eventAssignmentRepository.findByUserId(userId);
    return assignments.map((assignment) => assignment.event);
  }
  async getEventMembers(eventId: string): Promise<EventAssignment[]> {
    return this._eventAssignmentRepository.findByEventId(eventId);
  }
}
