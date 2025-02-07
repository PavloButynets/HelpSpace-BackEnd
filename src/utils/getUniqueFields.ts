import {CustomError, extractErrorDetails} from "./errorsHelper";

export const getUniqueFields = (err: CustomError): string => {
    const errorDetails = extractErrorDetails(err);

    if (errorDetails.detail) {
        const match = errorDetails.detail.match(/\((.*?)\)=\(/);
        if (match && match[1]) {
            return match[1].split(",").map((field: string) => field.trim()).join(", ");
        }
    }

    return "";
};