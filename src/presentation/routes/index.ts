import { Router } from "express";
//import { userRoutes } from "./user";
import {authRoutes} from "./auth";
import {event} from "./event";


export class AppRoutes {

    static get routes(): Router {
        const router = Router();
        //router.use("/user", userRoutes());
        router.use("/auth", authRoutes());
        router.use("/events", event());
        return router;
    }
}