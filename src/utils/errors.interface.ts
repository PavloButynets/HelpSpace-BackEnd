export interface ErrorMessage {
    name: string;
    message: string;
}

export type ErrorGenerator<T extends any[]> = (...args: T) => ErrorMessage;

export interface ErrorDictionary {
    // Статичні помилки
    readonly UNAUTHORIZED: ErrorMessage;
    readonly FORBIDDEN: ErrorMessage;
    readonly NOT_FOUND: ErrorMessage;
    readonly BAD_REQUEST: ErrorMessage;
    readonly INTERNAL_SERVER_ERROR: ErrorMessage;
    readonly BODY_IS_NOT_DEFINED: ErrorMessage;

    // Генератори помилок
    readonly DUPLICATE_RECORD_ERROR: ErrorGenerator<[string]>;
    readonly VALIDATION_ERROR: ErrorGenerator<[string]>;
    readonly FIELD_IS_NOT_DEFINED: ErrorGenerator<[string]>;
    readonly FIELD_IS_NOT_OF_PROPER_TYPE: ErrorGenerator<[string, string|string[]]>;
    readonly FIELD_IS_NOT_OF_PROPER_LENGTH: ErrorGenerator<[string, number, number ]>;
    readonly FIELD_IS_NOT_IN_RANGE: ErrorGenerator<[string, number, number]>;
    readonly FIELD_IS_NOT_OF_PROPER_FORMAT: ErrorGenerator<[string]>;
    readonly FIELD_IS_NOT_OF_PROPER_ENUM_VALUE: ErrorGenerator<[string, string[]]>;
    readonly OBJECT_MUST_HAVE_PROPERTY: ErrorGenerator<[string]>;
}