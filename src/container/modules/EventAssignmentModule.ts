import { ContainerModule, interfaces } from "inversify";

import { EVENT_ASSIGNMENT_TYPES } from "../../container/types/EventAssignmentTypes";
import { EventAssignmentRepository } from "../../infrastructure/repositories/EventAssignmentRepository";
import { IEventAssignmentRepository } from "../../domain/repositories/IEventAssignmentRepository";
const eventAssignmentModuleContainer = new ContainerModule(
  (bind: interfaces.Bind) => {
    bind<IEventAssignmentRepository>(
      EVENT_ASSIGNMENT_TYPES.IEventAssignmentRepository
    ).to(EventAssignmentRepository);
  }
);

export default eventAssignmentModuleContainer;
