import express from "express";
import { AppContainer } from "../../container";
import { UserController } from "../controllers/UserСontroller";
import { USER_TYPES } from "../../container/types/UserTypes";
import { asyncWrapper } from "../middlewares/asyncWrapper";

export const userRoutes = () => {
  const container = AppContainer.getInstance().getContainer();

  const router = express.Router();
  const userController = container.get<UserController>(
    USER_TYPES.UserController
  );

  router.get("/", asyncWrapper(userController.getUsers.bind(userController)));
  router.get(
    "/:id",
    asyncWrapper(userController.getUserById.bind(userController))
  );
  router.get(
    "/:id/feedbacks",
    asyncWrapper(userController.getUserFeedbacks.bind(userController))
  );
  return router;
};
