import {inject, injectable} from "inversify";
import {EVENT_TYPES} from "../../container/types/EventTypes.";
import {IEventRepository} from "../../domain/repositories/IEventRepository";
import {Event} from "../../domain/entities/EventEntity";
import { CreateEventDTO } from "../dto/request/CreateEventDTO";
import {EventResponseDTO} from "../dto/response/EventResponseDTO";
import {plainToInstance} from "class-transformer";
import {PaginatedResponse} from "../../types";

@injectable()
export class EventService {
    constructor(
        @inject(EVENT_TYPES.IEventRepository) private _eventRepository: IEventRepository) {
    }
    async createEvent(event: CreateEventDTO): Promise<EventResponseDTO> {
        const newEvent = Object.assign(new Event(), event)

        const savedEvent: Event = await this._eventRepository.save(newEvent);
        return {
            id: savedEvent.id,
            title: savedEvent.title,
            description: savedEvent.description,
            deadline: savedEvent.deadline,
            location: savedEvent.location,
            status: savedEvent.status,
            categories: savedEvent.categories,
            author: {
                id: savedEvent.creator.id,
                photo: savedEvent.creator.photo,
                firstName: savedEvent.creator.first_name,
                lastName: savedEvent.creator.last_name
            },
            startDate: savedEvent.startDate,
            endDate: savedEvent.endDate,
        }
    }

    async getAllEvents(page: number = 1, limit: number = 10): Promise<PaginatedResponse<EventResponseDTO>> {
        if (limit > 100) limit = 100

        const result = await this._eventRepository.findWithPagination(
            page,
            limit, 
            {},
            { startDate: 'DESC' },
        );
        
        const { data: events, total } = result;

        const totalPages = Math.ceil(total / limit);

        const items = events.map(event => {
            const plainEvent = {
                ...event,
                creator: {
                    id: event.creator.id,
                    photo: event.creator.photo,
                    firstName: event.creator.first_name,
                    lastName: event.creator.last_name
                }
            };
            return plainToInstance(EventResponseDTO, plainEvent);
        });

        return {
            items,
            total,
            page,
            limit,
            totalPages
        };
    }
}