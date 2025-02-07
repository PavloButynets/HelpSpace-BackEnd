export enum UserRole {
    ADMIN = "admin",
    USER = "user",
    MODERATOR = "moderator"
}

export class RegisterUserDTO {
    firstName: string;

    lastName: string;

    email: string;

    password: string;

}
