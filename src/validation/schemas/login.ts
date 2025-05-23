export const loginValidationSchema = {
    email: {
        type: 'string',
        required: true
    },
    password: {
        type: 'string',
        required: true
    },
    rememberMe: {
        type: 'boolean',
        required: false
    }
}

export const googleAuthValidationSchema = {
    token: {
        type: 'object',
        required: true
    },
    role: {
        type: 'string'
    }
}