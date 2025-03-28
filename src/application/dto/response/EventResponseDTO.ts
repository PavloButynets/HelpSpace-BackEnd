import { ProjectStatus} from "../../../consts/enums";
import {Category} from "../../../domain/entities/CategoryEntity";

export class EventResponseDTO {
    id: string;
    title: string;
    description: string;
    maxVolunteers?: number;
    deadline?: Date;
    photos?: string[];
    status?: ProjectStatus;
    location: string;
    categories: Category[];
    rewardPoints?: number;
    author: {
        id: string;
        photo?: string;
        firstName: string;
        lastName: string;
    }
    startDate: Date;
    endDate: Date;
}
