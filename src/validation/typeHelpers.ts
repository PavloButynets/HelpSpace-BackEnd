const isExpectedType = (expectedType: string | string[], valueToCheck: string): boolean => {
    return Array.isArray(valueToCheck) ? valueToCheck.includes(expectedType) : valueToCheck === expectedType;
};

const castValueToType = (value: any, type: string): any => {
    if (type === "boolean") return value === "true";
    if (type === "number") return isNaN(Number(value)) ? value : Number(value);
    return value;
};

const checkAreTypesValid = (typeOrTypes: string | string[], field: any): boolean => {
    const allowedTypes = Array.isArray(typeOrTypes) ? typeOrTypes : [typeOrTypes];
    return allowedTypes.includes(typeof castValueToType(field, allowedTypes[0]));
};

export { isExpectedType, castValueToType, checkAreTypesValid };
