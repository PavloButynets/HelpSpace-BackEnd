export class TokensResponseDTO {
    constructor(
        public accessToken: string,
        public refreshToken: string,
    ) {}
}
