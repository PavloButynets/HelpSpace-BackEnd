import { lengths } from "../../consts/validation";
import {EventCategory, ProjectStatus} from "../../consts/enums";

const { MAX_TITLE_LENGTH, MAX_PROJECT_DESCRIPTION_LENGTH } = lengths;

export const createProjectValidationEntity = {
    title: {
        type: 'string',
        required: true,
        length: {
            max: MAX_TITLE_LENGTH
        }
    },
    description: {
        type: 'string',
        required: false,
        length: {
            max: MAX_PROJECT_DESCRIPTION_LENGTH
        }
    },
    photos: {
        type: 'array',
        required: false,
        items: {
            type: 'string',
            regex: /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/
        }
    },
    status: {
        type: 'enum',
        required: false,
        values: Object.values(ProjectStatus)
    },
    location: {
        type: 'string',
        required: false,
    },
    category: {
        type: 'enum',
        required: false,
        values: Object.values(EventCategory)
    },
    deadline: {
        type: 'date',
        required: false
    },
    maxVolunteers: {
        type: 'number',
        required: false,
        min: 1
    },
    rewardPoints: {
        type: 'number',
        required: false,
        min: 0
    },
    creatorId: {
        type: 'string',
        required: true
    }
};
