import { Router } from "express";
import { ConversationController } from "../controllers/ConversationController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { AUTH_TYPES } from "../../container/types/AuthTypes";
import { AppContainer } from "../../container";

export const conversation = () => {
  const router = Router();
  const container = AppContainer.getInstance().getContainer();

  const authMiddleware = container.get<AuthMiddleware>(
    AUTH_TYPES.AuthMiddleware
  );
  router.use(authMiddleware.authMiddleware);

  router.get(
    "/",
    ConversationController.getUserConversations.bind(ConversationController)
  );
  router.post("/group", ConversationController.createGroupConversation);
  router.post(
    "/group/:conversationId/users",
    ConversationController.addUsersToGroup
  );
  router.delete(
    "/group/:conversationId/leave",
    ConversationController.leaveGroup
  );

  return router;
};
