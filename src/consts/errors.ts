import { ErrorDictionary } from "../utils/errors.interface";

export const errors: ErrorDictionary = {
    UNAUTHORIZED: {
        code: 'UNAUTHORIZED',
        message: 'The requested URL requires user authorization.'
    },
    BAD_REFRESH_TOKEN: {
        code: 'BAD_REFRESH_TOKEN',
        message: 'The refresh token is either invalid or has expired.'
    },
    FORBIDDEN: {
        code: 'FORBIDDEN',
        message: 'You do not have permission to perform this action.'
    },
    NOT_FOUND: {
        code: 'NOT_FOUND',
        message: 'The requested resource was not found.'
    },
    BAD_REQUEST: {
        code: 'BAD_REQUEST',
        message: 'The request could not be understood or was missing required parameters.'
    },
    INTERNAL_SERVER_ERROR: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred on the server.'
    },
    BODY_IS_NOT_DEFINED: {
        code: 'BODY_IS_NOT_DEFINED',
        message: 'The body of the request must be determined.'
    },
    USER_NOT_FOUND: {
        code: 'USER_NOT_FOUND',
        message: 'User with the specified email was not found.'
    },
    INCORRECT_CREDENTIALS: {
        code: 'INCORRECT_CREDENTIALS',
        message: 'The password you entered is incorrect.'
    },
    USER_ALREADY_EXISTS: {
        code: 'USER_ALREADY_EXISTS',
        message: 'User with the specified email already exists.'
    },
    INVALID_TOKEN_NAME: {
        code: 'INVALID_TOKEN_NAME',
        message: 'The token name you used is invalid.'
    },
    FIELD_IS_NOT_OF_PROPER_TYPE: (field: string | string[]) => ({
        code: 'FIELD_IS_NOT_OF_PROPER_TYPE',
        message: `The field "${field}" is not of the expected type.`
    }),
    ALREADY_REGISTERED: (fields: string) => ({
        code: "ALREADY_REGISTERED",
        message: `Значення для поля ${fields} вже існує.`
    }),
    VALIDATION_ERROR: (message: string) => ({
        code: 'VALIDATION_ERROR',
        message
    }),
    FIELD_IS_NOT_DEFINED: (field: string) => ({
        code: 'FIELD_IS_NOT_DEFINED',
        message: `${field} field should be defined.`
    }),

    FIELD_IS_NOT_OF_PROPER_LENGTH: (field: string, min: number, max: number) => ({
        code: 'FIELD_IS_NOT_OF_PROPER_LENGTH',
        message: `The field "${field}" must be between ${min} and ${max} characters.`
    }),
    FIELD_IS_NOT_IN_RANGE: (field: string, min: number, max: number) => ({
        code: 'FIELD_IS_NOT_IN_RANGE',
        message: `The field "${field}" must be in the range [${min}, ${max}].`
    }),
    FIELD_IS_NOT_OF_PROPER_FORMAT: (field: string) => ({
        code: 'FIELD_IS_NOT_OF_PROPER_FORMAT',
        message: `The field ${field} does not match the expected format.`
    }),
    FIELD_IS_NOT_OF_PROPER_ENUM_VALUE: (field: string, allowedValues: string[]) => ({
        code: 'FIELD_IS_NOT_OF_PROPER_ENUM_VALUE',
        message: `The field "${field}" must be one of the following values: ${allowedValues.join(", ")}.`
    }),
    OBJECT_MUST_HAVE_PROPERTY: (property: string) => ({
        code: 'OBJECT_MUST_HAVE_PROPERTY',
        message: `The object must have the property "${property}".`
    })
} as const;