import {
    IsString,
    IsOptional,
    MaxLength,
    IsInt,
    Min,
    IsArray,
    IsUUID,
    IsDate, MinLength
} from 'class-validator';
import { Type } from 'class-transformer';
import { lengths } from "../../../consts/validation";
import {Category} from "../../../domain/entities/CategoryEntity";

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
    coverImage?: string;

    @IsString()
    location: string;

    @IsString()
    city: string;

    @IsOptional()
    categories?: Category[];

    @Type(() => Date)
    @IsDate()
    startDate: Date;

    @Type(() => Date)
    @IsDate()
    endDate: Date;

    @Type(() => Date)
    @IsDate()
    deadline?: Date;

    @IsOptional()
    @IsInt()
    @Min(1)
    volunteerSlots?: number;


    @IsUUID()
    creator: string;
}
