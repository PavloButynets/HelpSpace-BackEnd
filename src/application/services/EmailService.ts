import EmailTemplates from 'email-templates';
import {injectable} from "inversify";
import {templateList} from "../../consts/emails";
import {createError} from "../../utils/errorsHelper";
import {errors} from "../../consts/errors";
import {sendMail} from "../../utils/mailer";
import {gmailCredentials} from "../../config/envConfig";

export type EmailType = keyof typeof templateList;
export type EmailLanguage = keyof (typeof templateList)[EmailType];

@injectable()
export class EmailService {
    constructor() {
    }

    async sendEmail(email: string, type: EmailType, language: EmailLanguage, text: Object): Promise<void> {
        const templateEmail = templateList[type]

        if (!templateEmail) {
            throw createError(404, errors.TEMPLATE_NOT_FOUND)
        }
        const eventTemplates = new EmailTemplates()
        const langTemplate = templateEmail[language]
        const html = await eventTemplates.render(langTemplate.template, text)
        await sendMail({
            from: `HelpSpace <${gmailCredentials.user}>`,
            to: email,
            subject: langTemplate.type,
            html
        })
    }
}