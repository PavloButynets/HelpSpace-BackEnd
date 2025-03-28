import {
    IsString,
    IsOptional,
    MaxLength,
    IsEnum,
    IsInt,
    Min,
    IsArray,
    IsUrl,
    IsUUID,
    IsDate, MinLength
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectCategory, ProjectStatus } from "../../../consts/enums";
import { lengths } from "../../../consts/validation";

const { MAX_TITLE_LENGTH, MAX_PROJECT_DESCRIPTION_LENGTH, MIN_DESCRIPTION_LENGTH } = lengths;

export class CreateEventDTO {
    @IsString()
    @MaxLength(MAX_TITLE_LENGTH)
    title: string;

    @IsOptional()
    @IsString()
    @MinLength(MIN_DESCRIPTION_LENGTH)
    @MaxLength(MAX_PROJECT_DESCRIPTION_LENGTH)
    description?: string;

    @IsOptional()
    @IsArray()
    @IsUrl({}, { each: true })
    photos?: string[];

    @IsOptional()
    @IsEnum(ProjectStatus)
    status?: ProjectStatus;

    @IsOptional()
    @IsString()
    location: string;

    @IsOptional()
    @IsEnum(ProjectCategory)
    category?: ProjectCategory;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    deadline?: Date;

    @IsOptional()
    @IsInt()
    @Min(1)
    maxVolunteers?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    rewardPoints?: number;

    @IsUUID()
    creator: string;
}
