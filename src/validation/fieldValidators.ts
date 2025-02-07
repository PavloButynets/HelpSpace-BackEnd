import { errors } from "../consts/errors";
import { createError } from "../utils/errorsHelper";
import { checkAreTypesValid } from "./typeHelpers";

const {
    FIELD_IS_NOT_DEFINED,
    FIELD_IS_NOT_OF_PROPER_TYPE,
    FIELD_IS_NOT_OF_PROPER_LENGTH,
    FIELD_IS_NOT_IN_RANGE,
    FIELD_IS_NOT_OF_PROPER_FORMAT,
    FIELD_IS_NOT_OF_PROPER_ENUM_VALUE,
    OBJECT_MUST_HAVE_PROPERTY
} = errors;

type Range = {
    min: number;
    max: number;
};

type Length = {
    min: number;
    max: number;
};


export const validateRequired = (schemaFieldKey: string, required: boolean, field: unknown): void => {
    if (required && !field) {
        throw createError(422, FIELD_IS_NOT_DEFINED(schemaFieldKey));
    }
};

export const validateTypes = (schemaFieldKey: string, typeOrTypes: string | string[], field: unknown): void => {
    const isTypeValid = checkAreTypesValid(typeOrTypes, field);

    if (!isTypeValid) {
        throw createError(422, FIELD_IS_NOT_OF_PROPER_TYPE(schemaFieldKey, typeOrTypes));
    }
};

export const validateLength = (schemaFieldKey: string, length: Length, field: { length: number }): void => {
    if (field.length < length.min || field.length > length.max) {
        throw createError(422, FIELD_IS_NOT_OF_PROPER_LENGTH(schemaFieldKey, length.min, length.max));
    }
};

export const validateNonEmptyObject = (fieldName: Record<string, unknown>, schemaFieldKey: string): void => {
    if (Object.keys(fieldName).length === 0) {
        throw createError(422, OBJECT_MUST_HAVE_PROPERTY(schemaFieldKey));
    }
};

export const validateRange = (schemaFieldKey: string, range: Range, field: number): void => {
    if (field < range.min || field > range.max) {
        throw createError(422, FIELD_IS_NOT_IN_RANGE(schemaFieldKey, range.min, range.max));
    }
};

export const validateRegex = (schemaFieldKey: string, regex: RegExp, field: string): void => {
    if (!regex.test(field)) {
        throw createError(422, FIELD_IS_NOT_OF_PROPER_FORMAT(schemaFieldKey));
    }
};

export const validateEnum = (schemaFieldKey: string, enumSet: string[], field: string | number): void => {
    const isEnumValue = enumSet.some((value) => value === field);
    if (!isEnumValue) {
        throw createError(422, FIELD_IS_NOT_OF_PROPER_ENUM_VALUE(schemaFieldKey, enumSet));
    }
};

export const fieldValidator: Record<string, Function> = {
    type: validateTypes,
    length: validateLength,
    range: validateRange,
    regex: validateRegex,
    enum: validateEnum
};