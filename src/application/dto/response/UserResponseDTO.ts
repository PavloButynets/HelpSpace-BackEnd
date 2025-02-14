export class UserResponseDTO {
    constructor(
        public firstName: string,
        public lastName: string,
        public email: string,
        public lastLogin: Date
    ) {}
}
