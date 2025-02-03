// Базовий інтерфейс для статичних помилок
export interface ErrorMessage {
    code: string;
    message: string;
}

// Тип для функцій-генераторів помилок
export type ErrorGenerator<T extends any[]> = (...args: T) => ErrorMessage;

// Розділяємо статичні помилки і генератори
export interface ErrorDictionary {
    // Статичні помилки
    readonly UNAUTHORIZED: ErrorMessage;
    readonly FORBIDDEN: ErrorMessage;
    readonly NOT_FOUND: ErrorMessage;
    readonly BAD_REQUEST: ErrorMessage;
    readonly INTERNAL_SERVER_ERROR: ErrorMessage;
    // і т.д.

    // Генератори помилок
    readonly DUPLICATE_RECORD_ERROR: ErrorGenerator<[string]>;
    readonly VALIDATION_ERROR: ErrorGenerator<[string]>;
    readonly FIELD_IS_NOT_DEFINED: ErrorGenerator<[string]>;
    readonly FIELD_IS_NOT_OF_PROPER_TYPE: ErrorGenerator<[string, string]>;
    // і т.д.
}