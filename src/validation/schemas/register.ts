import { lengths, regex } from "../../consts/validation";

 const { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, MAX_NAME_LENGTH, MIN_NAME_LENGTH } =  lengths;
 const { EMAIL_PATTERN, PASSWORD_PATTERN, NAME_PATTERN } = regex;


export const registerValidationEntity = {
    firstName: {
        type: 'string',
        required: true,
        regex: NAME_PATTERN,
        length: {
            min: MIN_NAME_LENGTH,
            max: MAX_NAME_LENGTH
        }
    },
    lastName: {
        type: 'string',
        required: true,
        regex: NAME_PATTERN,
        length: {
            min: MIN_NAME_LENGTH,
            max: MAX_NAME_LENGTH
        }
    },
    email: {
        type: 'string',
        required: true,
        regex: EMAIL_PATTERN
    },
    password: {
        type: 'string',
        required: true,
        length: {
            min: MIN_PASSWORD_LENGTH,
            max: MAX_PASSWORD_LENGTH
        },
        regex: PASSWORD_PATTERN
    }
}

