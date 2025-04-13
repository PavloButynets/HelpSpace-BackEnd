import express from "express";
import { AppContainer} from "../../container";
import {asyncWrapper} from "../middlewares/asyncWrapper";
import {LocationController} from "../controllers/LocationController";
import {LOCATION_TYPES} from "../../container/types/LocationTypes";


export const locationRoutes = () => {
    const container = AppContainer.getInstance().getContainer();

    const router = express.Router();
    const locationController = container.get<LocationController>(LOCATION_TYPES.LocationController);


    router.get('/cities', asyncWrapper(locationController.getCities.bind(locationController)));
    return router
}