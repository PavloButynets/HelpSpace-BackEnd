import { errors } from '../consts/errors.js';
import { ErrorMessage } from 'utils/errors.interface.js';

const { UNAUTHORIZED, NOT_FOUND, FORBIDDEN, BAD_REQUEST } = errors

export class CustomError extends Error {
    status: number;
    code: string;

    constructor(message: string, status: number, code: string) {
        super(message);
        this.status = status;
        this.code = code;
    }
}


export const createError = (status: number, errorInfo: ErrorMessage): CustomError => {
    const err = new CustomError(errorInfo.message, status, errorInfo.code)

    return err
}

export const createUnauthorizedError = () => {
    return createError(401, UNAUTHORIZED as ErrorMessage)
}

export const createForbiddenError = () => {
    return createError(403, FORBIDDEN as ErrorMessage)
}

export const createNotFoundError = () => {
    return createError(404, NOT_FOUND as ErrorMessage)
}

export const createBadRequestError = () => {
    return createError(400, BAD_REQUEST as ErrorMessage)
}
