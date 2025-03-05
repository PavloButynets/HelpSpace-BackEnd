import {ContainerModule, interfaces} from 'inversify';
import {EMAIL_TYPES} from "../types/EmailTypes";
import {EmailService} from "../../application/services/EmailService";

const emailModuleContainer = new ContainerModule((bind: interfaces.Bind) => {
    bind<EmailService>(EMAIL_TYPES.EmailService).to(EmailService)
});

export default emailModuleContainer;
