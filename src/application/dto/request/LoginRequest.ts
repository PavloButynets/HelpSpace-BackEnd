
import { lengths, regex } from "../../../consts/validation";
import {IsBoolean, IsEmail, IsOptional, IsString, Matches, MinLength} from "class-validator";

const { MIN_PASSWORD_LENGTH } = lengths;
const { PASSWORD_PATTERN } = regex;
export class LoginRequestDTO {
    @IsEmail()
    @IsString()
    public email: string

    @IsString()
    @MinLength(MIN_PASSWORD_LENGTH)
    @Matches(PASSWORD_PATTERN, {
        message: 'Password must contain at least one digit, one lowercase letter, and no spaces.',
    })
    public password: string

    @IsBoolean()
    @IsOptional()
    public rememberMe: boolean
}