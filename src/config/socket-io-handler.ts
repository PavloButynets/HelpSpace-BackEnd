import { Server, Socket } from "socket.io";
import { logger } from "../utils/logger";
import { myDataSource } from "./database";
import { Message } from "../domain/entities/MessageEntity";
import { User } from "../domain/entities/UserEntity";
import { Conversation } from "../domain/entities/ConversationEntity";
import { Attachment } from "../domain/entities/AttachmentEntity";

interface ClientToServerEvents {
  auth: (
    data: { userId: string },
    callback: (response: { success: boolean }) => void
  ) => void;
  chat_message: (message: any) => void;
  ping: () => void;
}

interface ServerToClientEvents {
  connection_status: (data: { connected: boolean; message: string }) => void;
  auth_response: (data: { success: boolean; message?: string }) => void;
  pong: (data: { timestamp: number }) => void;
  chat_message: (message: any) => void;
}

export class SocketIOHandler {
  private static clients: Map<
    string,
    Socket<ClientToServerEvents, ServerToClientEvents>
  > = new Map();

  constructor(io: Server<ClientToServerEvents, ServerToClientEvents>) {
    logger.info("Setting up Socket.IO server");

    // Connection handler
    io.on("connection", (socket) => {
      logger.info(`New Socket.IO connection established: ${socket.id}`);

      // Send initial connection confirmation
      socket.emit("connection_status", {
        connected: true,
        message: "Socket.IO connected. Send auth to identify yourself.",
      });

      // Handle authentication
      socket.on("auth", (data, callback) => {
        const userId = data.userId;
        logger.info(`Auth request from user: ${userId}`);

        // Store user information
        SocketIOHandler.clients.set(userId, socket);
        socket.data.userId = userId;

        // Send success response via callback
        callback({ success: true });

        // Also emit event for consistency with previous implementation
        socket.emit("auth_response", { success: true });

        logger.info(`User ${userId} authenticated`);
      });

      // Handle chat message
      socket.on("chat_message", async (messageData) => {
        try {
          const senderId = socket.data.userId;
          if (!senderId) {
            logger.error("Unauthorized message attempt");
            return;
          }

          logger.info(`Received chat message from ${senderId}:`, messageData);

          // Get repositories
          const userRepository = myDataSource.getRepository(User);
          const conversationRepository =
            myDataSource.getRepository(Conversation);
          const messageRepository = myDataSource.getRepository(Message);
          const attachmentRepository = myDataSource.getRepository(Attachment);

          // Get sender
          const sender = await userRepository.findOne({
            where: { id: senderId },
          });

          if (!sender) {
            logger.error(`Sender with ID ${senderId} not found`);
            return;
          }

          // Handle conversation
          let conversation: Conversation | null = null;
          let receiverId = messageData.receiverId;

          // If conversationId is provided, use existing conversation
          if (messageData.conversationId) {
            conversation = await conversationRepository.findOne({
              where: { id: messageData.conversationId },
              relations: ["participants"],
            });

            if (!conversation) {
              logger.error(
                `Conversation with ID ${messageData.conversationId} not found`
              );
              return;
            }
          }
          // Otherwise create a new conversation between sender and receiver
          else if (receiverId) {
            // Get receiver
            const receiver = await userRepository.findOne({
              where: { id: receiverId },
            });

            if (!receiver) {
              logger.error(`Receiver with ID ${receiverId} not found`);
              return;
            }

            // Check if conversation already exists between these users
            const existingConversation = await conversationRepository
              .createQueryBuilder("conversation")
              .innerJoin("conversation.participants", "user")
              .where("user.id IN (:...userIds)", {
                userIds: [senderId, receiverId],
              })
              .groupBy("conversation.id")
              .having("COUNT(DISTINCT user.id) = 2")
              .andWhere("conversation.isGroup = false")
              .getOne();

            if (existingConversation) {
              conversation = existingConversation;
            } else {
              // Create new conversation
              conversation = conversationRepository.create({
                isGroup: false,
                participants: [sender, receiver],
              });
              await conversationRepository.save(conversation);
            }
          } else {
            logger.error("Either conversationId or receiverId is required");
            return;
          }

          // Create message
          const message = messageRepository.create({
            content: messageData.content || "",
            sender,
            senderId,
            receiverId: receiverId,
            conversation,
            conversationId: conversation.id,
          });

          await messageRepository.save(message);

          // Process attachments if any
          if (messageData.attachments && messageData.attachments.length > 0) {
            const savedAttachments = [];

            for (const attachment of messageData.attachments) {
              const { name, type, url, size } = attachment;

              const newAttachment = attachmentRepository.create({
                name,
                type,
                url,
                size,
                message,
                messageId: message.id,
              });

              await attachmentRepository.save(newAttachment);
              savedAttachments.push(newAttachment);
            }

            message.attachments = savedAttachments;
          }

          // Format message for sending
          const messageToSend = {
            id: message.id,
            content: message.content,
            senderId: message.senderId,
            receiverId: message.receiverId,
            conversationId: message.conversationId,
            attachments: message.attachments || [],
            isRead: message.isRead,
            createdAt: message.createdAt,
            timestamp: message.createdAt,
          };

          // Send to sender for confirmation
          socket.emit("chat_message", {
            type: "new_message",
            payload: messageToSend,
          });

          // Send to participants
          if (conversation) {
            // For group chats, send to all participants except sender
            if (conversation.isGroup && conversation.participants) {
              for (const participant of conversation.participants) {
                if (participant.id !== senderId) {
                  SocketIOHandler.sendToUser(participant.id, "chat_message", {
                    type: "new_message",
                    payload: messageToSend,
                  });
                }
              }
            }
            // For direct chats, just send to the receiver
            else if (receiverId) {
              SocketIOHandler.sendToUser(receiverId, "chat_message", {
                type: "new_message",
                payload: messageToSend,
              });
            }
          }

          logger.info(`Message processed and delivered, ID: ${message.id}`);
        } catch (error) {
          logger.error("Error processing chat message:", error);
          socket.emit("chat_message", {
            type: "error",
            error: "Failed to process message",
            timestamp: new Date(),
          });
        }
      });

      // Handle ping (though Socket.IO has built-in ping/pong)
      socket.on("ping", () => {
        socket.emit("pong", { timestamp: Date.now() });
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        if (socket.data.userId) {
          SocketIOHandler.clients.delete(socket.data.userId);
          logger.info(`User ${socket.data.userId} disconnected`);
        }
      });
    });
  }

  // Static method for sending messages to specific users
  public static sendToUser(userId: string, event: string, data: any): boolean {
    const socket = this.clients.get(userId);

    if (socket && socket.connected) {
      socket.emit(event as keyof ServerToClientEvents, data);
      logger.info(`Message sent to user ${userId}`);
      return true;
    }

    logger.warn(`User ${userId} not connected, message not delivered`);
    return false;
  }

  // Method to notify about new messages (can be used from controllers)
  public static notifyNewMessage(message: any): void {
    try {
      const messageToSend = {
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        receiverId: message.receiverId,
        conversationId: message.conversationId,
        attachments: message.attachments || [],
        isRead: message.isRead,
        createdAt: message.createdAt,
        timestamp: message.createdAt,
      };

      // Send to receiver if it's a direct message
      if (message.receiverId) {
        this.sendToUser(message.receiverId, "chat_message", {
          type: "new_message",
          payload: messageToSend,
        });
      }

      // Send to conversation participants if it's a group message
      if (message.conversation && message.conversation.participants) {
        for (const participant of message.conversation.participants) {
          if (participant.id !== message.senderId) {
            this.sendToUser(participant.id, "chat_message", {
              type: "new_message",
              payload: messageToSend,
            });
          }
        }
      }
    } catch (error) {
      logger.error("Error notifying about new message:", error);
    }
  }
}
