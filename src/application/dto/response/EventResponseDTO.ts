import { ProjectStatus} from "../../../consts/enums";
import {Category} from "../../../domain/entities/CategoryEntity";

export class EventResponseDTO {
    id: string;
    title: string;
    description: string;
    maxVolunteers?: number;
    registrationDeadline?: Date;
    coverImage?: string;
    status?: ProjectStatus;
    location: string;
    categories: Category[];
    rewardPoints?: number;
    creator: {
        id: string;
        photo?: string;
        firstName: string;
        lastName: string;
    }
    startDate: Date;
    endDate: Date;
}
