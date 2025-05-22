import express from "express";
import { AppContainer } from "../../container";
import { asyncWrapper } from "../middlewares/asyncWrapper";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import { EVENT_TYPES } from "../../container/types/EventTypes.";
import { EventController } from "../controllers/EventController";
import { CreateEventDTO } from "../../application/dto/request/CreateEventDTO";
import { AUTH_TYPES } from "../../container/types/AuthTypes";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { eventUpload } from "../../utils/awsS3Service";

export const event = () => {
  const container = AppContainer.getInstance().getContainer();

  const router = express.Router();
  const eventController = container.get<EventController>(
    EVENT_TYPES.EventController
  );
  const authMiddleware = container.get<AuthMiddleware>(
    AUTH_TYPES.AuthMiddleware
  );
  router.get(
    "/categories",
    asyncWrapper(eventController.getCategories.bind(eventController))
  );
  router.use(authMiddleware.authMiddleware);
  router.post(
    "/create",
    eventUpload.single("imageFile"),
    asyncWrapper(eventController.createEvent.bind(eventController))
  );

  router.get(
    "/",
    asyncWrapper(eventController.getEvents.bind(eventController))
  );

  router.get(
    "/user",
    authMiddleware.authMiddleware,
    asyncWrapper(eventController.getUserEvents.bind(eventController))
  );
  router.get(
    "/user/joined",
    asyncWrapper(eventController.getUserJoinedEvents.bind(eventController))
  );
  router.get(
    "/user/created",
    authMiddleware.authMiddleware,
    asyncWrapper(eventController.getUserCreatedEvents.bind(eventController))
  );

  router.get(
    "/:id",
    asyncWrapper(eventController.getEventById.bind(eventController))
  );

  router.get(
    "/:id/applicants",
    asyncWrapper(eventController.getEventApplicants.bind(eventController))
  );

  router.post(
    "/:id/apply",
    asyncWrapper(eventController.applyForEvent.bind(eventController))
  );

  router.put(
    "/:eventId/applicants/:userId/action",
    asyncWrapper(eventController.rejectOrAcceptApplicant.bind(eventController))
  );

  return router;
};
