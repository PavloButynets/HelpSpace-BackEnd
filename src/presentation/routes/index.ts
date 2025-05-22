import { Router } from "express";
import { userRoutes } from "./user";
import { authRoutes } from "./auth";
import { event } from "./event";
import { locationRoutes } from "./location";
import { conversation } from "./conversation";
import { message } from "./message";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();
    router.use("/users", userRoutes());
    router.use("/auth", authRoutes());
    router.use("/events", event());
    router.use("/location", locationRoutes());
    router.use("/conversations", conversation());
    router.use("/messages", message());
    return router;
  }
}
