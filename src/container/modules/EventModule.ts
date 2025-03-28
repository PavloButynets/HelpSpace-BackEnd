import {ContainerModule, interfaces} from 'inversify';
import {EventRepository} from "../../infrastructure/repositories/EventRepository";
import {EVENT_TYPES} from "../types/EventTypes.";
import {EventService} from "../../application/services/EventService";
import {EventController} from "../../presentation/controllers/EventController";

const eventModuleContainer = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<EventRepository>(EVENT_TYPES.IEventRepository).to(EventRepository).inSingletonScope()
    bind<EventService>(EVENT_TYPES.EventService).to(EventService).inRequestScope()
    bind<EventController>(EVENT_TYPES.EventController).to(EventController).inRequestScope()
});

export default eventModuleContainer;
