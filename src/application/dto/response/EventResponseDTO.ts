import { EventStatus } from "../../../consts/enums";
import { Category } from "../../../domain/entities/CategoryEntity";
import { Expose } from "class-transformer";
import { EventAssignmentStatus } from "../../../consts/enums";

export class EventResponseDTO {
  id: string;
  title: string;
  description: string;
  maxVolunteers?: number;
  registrationDeadline?: Date;
  coverImage?: string;
  status?: EventStatus;
  location: string;
  categories: Category[];
  rewardPoints?: number;
  creator: {
    id: string;
    photo?: string;
    firstName: string;
    lastName: string;
  };

  @Expose()
  applicationStatus?: EventAssignmentStatus;

  // Опціонально можна додати інші поля з EventAssignment
  @Expose()
  hoursWorked?: number;

  @Expose()
  stars?: number;

  @Expose()
  feedback?: string;

  @Expose()
  joinedAt?: Date;
  startDate: Date;
  endDate: Date;
}
