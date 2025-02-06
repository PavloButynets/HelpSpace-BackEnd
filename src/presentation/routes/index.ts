import { Router } from "express";
import { userRoutes } from "./user";


export class AppRoutes {

    static get routes(): Router {

        const router = Router();

        //router.use("/auth", authRoutes());

        router.use("/user", userRoutes());



        return router;
    }
}