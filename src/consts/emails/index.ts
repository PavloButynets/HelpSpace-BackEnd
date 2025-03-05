export const emailType = {
  EMAIL_CONFIRMATION: 'EMAIL_CONFIRMATION',
  RESET_PASSWORD: 'RESET_PASSWORD',
  SUCCESSFUL_PASSWORD_RESET: 'SUCCESSFUL_PASSWORD_RESET',
  LONG_TIME_WITHOUT_LOGIN: 'LONG_TIME_WITHOUT_LOGIN',
  ADMIN_INVITATION: 'ADMIN_INVITATION'
}

const path = __dirname
export const templateList = {
  [emailType.EMAIL_CONFIRMATION]: {
    en: {
      type: 'Please confirm your email',
      template: path + '/en/confirm-email'
    },
    uk: {
      type: 'Будь ласка, підтвердіть свою електронну адресу',
      template: path + '/uk/confirm-email'
    }
  },
  [emailType.RESET_PASSWORD]: {
    en: {
      type: 'Reset your account password',
      template: path + '/en/reset-password'
    },
    uk: {
      type: 'Скиньте пароль для свого акаунту',
      template: path + '/uk/reset-password'
    }
  },
  [emailType.SUCCESSFUL_PASSWORD_RESET]: {
    en: {
      type: 'Your password was changed',
      template: path + '/en/sucessful-password-reset'
    },
    uk: {
      type: 'Ваш пароль було змінено',
      template: path + '/uk/sucessful-password-reset'
    }
  },
  [emailType.ADMIN_INVITATION]: {
    en: {
      type: 'Admin invitation',
      template: path + '/en/invite-admin'
    },
    uk: {
      type: 'Запрошення адміна',
      template: path + '/uk/invite-admin'
    }
  }
}

