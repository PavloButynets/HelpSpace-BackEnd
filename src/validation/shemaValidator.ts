import { validateRequired, validateNonEmptyObject, fieldValidator } from "./fieldValidators";
import { isExpectedType } from "./typeHelpers";

const validatePrimitiveEntityField = (
    entityFieldKey: string,
    entityFieldValue: any,
    reqSourceField: any
): void => {
    Object.entries(entityFieldValue).forEach(([validationType, validationValue]) => {
        if (fieldValidator[validationType]) {
            fieldValidator[validationType](entityFieldKey, validationValue, reqSourceField);
        }
    });
};

const validateEntityField = (
    entityFieldKey: string,
    entityFieldValue: any,
    reqSourceField: any
): void => {
    if (reqSourceField === null && entityFieldValue.canBeNull) {
        return;
    }

    if (
        typeof reqSourceField === "object" &&
        isExpectedType("object", entityFieldValue.type) &&
        entityFieldValue.properties
    ) {
        validateNonEmptyObject(reqSourceField, entityFieldKey);
        validateEntity(entityFieldValue.properties, reqSourceField);
        return;
    }

    validatePrimitiveEntityField(entityFieldKey, entityFieldValue, reqSourceField);
};

const validateEntity = (entitySchema: Record<string, any>, data: Record<string, any>): void => {
    Object.entries(entitySchema).forEach(([fieldName, fieldRules]) => {
        const requestSourceField = data[fieldName];

        if (fieldRules.required !== undefined) {
            validateRequired(fieldName, fieldRules.required, requestSourceField);
        }

        if (requestSourceField === undefined) {
            return;
        }

        validateEntityField(fieldName, fieldRules, requestSourceField);
    });
};

export { validateEntity };