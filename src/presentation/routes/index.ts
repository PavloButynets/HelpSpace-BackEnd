import { Router } from "express";
//import { userRoutes } from "./user";
import {authRoutes} from "./auth";
import {event} from "./event";
import {locationRoutes} from "./location";


export class AppRoutes {

    static get routes(): Router {
        const router = Router();
        //router.use("/user", userRoutes());
        router.use("/auth", authRoutes());
        router.use("/events", event());
        router.use("/location", locationRoutes());
        return router;
    }
}