import { Router } from "express";
import { userRoutes } from "./user";
import {authRoutes} from "./auth";


export class AppRoutes {

    static get routes(): Router {
        const router = Router();
        router.use("/user", userRoutes());
        router.use("/auth", authRoutes());
        return router;
    }
}