import { ErrorDictionary } from "../utils/errors.interface.js";

export const errors: ErrorDictionary = {
    UNAUTHORIZED: {
        code: 'UNAUTHORIZED',
        message: 'The requested URL requires user authorization.'
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
    FIELD_IS_NOT_OF_PROPER_TYPE: (field: string) => ({
        code: 'FIELD_IS_NOT_OF_PROPER_TYPE',
        message: `The field "${field}" is not of the expected type.`
    }),
    DUPLICATE_RECORD_ERROR: (fields: string) => ({
        code: "DUPLICATE_RECORD",
        message: `Значення для полів ${fields} вже існує.`
    }),
    VALIDATION_ERROR: (message: string) => ({
        code: 'VALIDATION_ERROR',
        message
    }),
    FIELD_IS_NOT_DEFINED: (field: string) => ({
        code: 'FIELD_IS_NOT_DEFINED',
        message: `${field} field should be defined.`
    })
} as const;
