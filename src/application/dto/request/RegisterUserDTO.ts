import {lengths, regex} from "../../../consts/validation";
import {IsEmail, IsString, Matches, MaxLength, MinLength} from "class-validator";

export enum UserRole {
    ADMIN = "admin",
    USER = "user",
    MODERATOR = "moderator"
}

export class RegisterUserDTO {

    @IsString()
    @MinLength(lengths.MIN_NAME_LENGTH)
    @MaxLength(lengths.MAX_NAME_LENGTH)
    @Matches(regex.NAME_PATTERN, {
        message: 'First name must contain only letters.'
    })
    firstName: string;

    @IsString()
    @MinLength(lengths.MIN_NAME_LENGTH)
    @MaxLength(lengths.MAX_NAME_LENGTH)
    @Matches(regex.NAME_PATTERN, {
        message: 'Last name must contain only letters.'
    })
    lastName: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(lengths.MIN_PASSWORD_LENGTH)
    @Matches(regex.PASSWORD_PATTERN, {
        message: 'Password must contain at least one digit, one lowercase letter, and no spaces.',
    })
    password: string;

    constructor(
        firstName: string,
        lastName: string,
        email: string,
        password: string
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }
}
