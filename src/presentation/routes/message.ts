import { Router } from "express";
import { MessageController } from "../controllers/MessageController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { AUTH_TYPES } from "../../container/types/AuthTypes";
import { AppContainer } from "../../container";

export const message = () => {
  const router = Router();
  const container = AppContainer.getInstance().getContainer();

  const authMiddleware = container.get<AuthMiddleware>(
    AUTH_TYPES.AuthMiddleware
  );

  router.use(authMiddleware.authMiddleware);

  router.get(
    "/conversation/:conversationId",
    MessageController.getConversationMessages.bind(MessageController)
  );
  router.post("/", MessageController.sendMessage);
  router.post("/read", MessageController.markAsRead);

  return router;
};
