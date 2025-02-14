import { Router } from "express";
import { userRoutes } from "./user";
import {authRoutes} from "./auth";
import {projectRoutes} from "./project";


export class AppRoutes {

    static get routes(): Router {
        const router = Router();
        router.use("/user", userRoutes());
        router.use("/auth", authRoutes());
        router.use("/project", projectRoutes());
        return router;
    }
}