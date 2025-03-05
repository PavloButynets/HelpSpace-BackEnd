export const tokenNames = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    RESET_TOKEN: 'resetToken',
    CONFIRM_TOKEN: 'confirmToken'
} as const;
export type TokenName = typeof tokenNames[keyof typeof tokenNames];
