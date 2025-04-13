import {ContainerModule, interfaces} from 'inversify';
import {LocationService} from "../../application/services/LocationService";
import {LOCATION_TYPES} from "../types/LocationTypes";
import {LocationController} from "../../presentation/controllers/LocationController";

const locationModuleContainer = new ContainerModule((bind: interfaces.Bind) => {
    bind<LocationService>(LOCATION_TYPES.LocationService).to(LocationService)
    bind(LOCATION_TYPES.LocationController).to(LocationController)
});

export default locationModuleContainer;
