export class LoginResponseDTO {
    constructor(
        public firstName: string,
        public lastName: string,
        public email: string,
        public lastLogin: Date,
        public accessToken: string,
        public refreshToken: string,
    ) {
    }
}
