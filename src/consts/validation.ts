export const lengths = {
    MIN_PASSWORD_LENGTH: 8,
    MAX_PASSWORD_LENGTH: 25,
    MIN_NAME_LENGTH: 1,
    MAX_NAME_LENGTH: 30,
    MAX_TITLE_LENGTH: 100,
    MIN_TITLE_LENGTH: 3,
    MAX_PROJECT_DESCRIPTION_LENGTH: 512,
    MIN_DESCRIPTION_LENGTH: 16,
}

export const regex = {
    EMAIL_PATTERN: /^([a-z\d]+([._-][a-z\d]+)*)@([a-z\d]+([.-][a-z\d]+)*\.[a-z]{2,})$/i,
    PASSWORD_PATTERN: /^(?=.*\d)(?=.*[a-zа-яєії])\S+$/i,
    NAME_PATTERN: /^[a-zа-яєії' -]+$/i,
}

export const enums = {
    APP_LANG_ENUM: ['en', 'uk'],
    ROLE_ENUM: ['user', 'admin', 'moderator'],
    STATUS_ENUM: ['active', 'blocked', 'deactivated'],
    NOTIFICATION_TYPE_ENUM: [
        'new',
        'requested',
        'active',
        'declined',
        'updated',
        'closed',
        'deleted',
        'request to close'
    ],
}


