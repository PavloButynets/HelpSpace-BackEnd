import {ProjectCategory, ProjectStatus} from "../../../consts/enums";

export class ProjectResponseDTO {
    title: string;
    description: string;
    maxVolunteers?: number;
    deadline?: Date;
    photos?: string[];
    status?: ProjectStatus;
    location: string;
    category: ProjectCategory;
    rewardPoints?: number;
    creator: string;
}
