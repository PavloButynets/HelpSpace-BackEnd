import type { Request, Response } from "express";
import { Message } from "../../domain/entities/MessageEntity";
import { myDataSource } from "../../config/database";
import { User } from "../../domain/entities/UserEntity";
import { Conversation } from "../../domain/entities/ConversationEntity";
import { Attachment } from "../../domain/entities/AttachmentEntity";
import { SocketIOHandler } from "../../config/socket-io-handler";

export class MessageController {
  // Get messages for a conversation
  static getConversationMessages = async (req: Request, res: Response) => {
    try {
      const { conversationId } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      const messageRepository = myDataSource.getRepository(Message);

      const messages = await messageRepository.find({
        where: { conversationId },
        relations: ["sender", "attachments"],
        order: { createdAt: "DESC" },
        take: Number(limit),
        skip: Number(offset),
      });

      return res.status(200).json(messages);
    } catch (error) {
      console.error("Error getting messages:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Send a message
  static sendMessage = async (req: Request, res: Response) => {
    try {
      const { content, receiverId, conversationId, attachments } = req.body;
      const senderId = (req as any).userId;

      if (!content && (!attachments || attachments.length === 0)) {
        return res
          .status(400)
          .json({ message: "Message content or attachments are required" });
      }

      const userRepository = myDataSource.getRepository(User);
      const conversationRepository = myDataSource.getRepository(Conversation);
      const messageRepository = myDataSource.getRepository(Message);
      const attachmentRepository = myDataSource.getRepository(Attachment);

      // Get sender
      const sender = await userRepository.findOne(senderId);
      if (!sender) {
        return res.status(404).json({ message: "Sender not found" });
      }

      let conversation: Conversation | null = null;

      // If conversationId is provided, use existing conversation
      if (conversationId) {
        conversation = await conversationRepository.findOne({
          where: { id: conversationId },
          relations: ["participants"],
        });

        if (!conversation) {
          return res.status(404).json({ message: "Conversation not found" });
        }

        // Check if sender is part of the conversation
        const isParticipant = conversation.participants.some(
          (p) => p.id === senderId
        );
        if (!isParticipant) {
          return res
            .status(403)
            .json({ message: "You are not part of this conversation" });
        }
      }
      // Otherwise create a new conversation between sender and receiver
      else if (receiverId) {
        // Get receiver
        const receiver = await userRepository.findOne(receiverId);
        if (!receiver) {
          return res.status(404).json({ message: "Receiver not found" });
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
        return res
          .status(400)
          .json({ message: "Either conversationId or receiverId is required" });
      }

      // Create message
      const message = messageRepository.create({
        content: content || "",
        sender,
        senderId,
        receiver: receiverId ? ({ id: receiverId } as User) : undefined,
        receiverId,
        conversation,
        conversationId: conversation.id,
      });

      await messageRepository.save(message);

      // Process attachments if any
      if (attachments && attachments.length > 0) {
        const savedAttachments = [];

        for (const attachment of attachments) {
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

      // Notify connected clients via WebSocket
      SocketIOHandler.notifyNewMessage(message);

      return res.status(201).json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Mark messages as read
  static markAsRead = async (req: Request, res: Response) => {
    try {
      const { messageIds } = req.body;
      const userId = (req as any).userId;

      if (!messageIds || !Array.isArray(messageIds)) {
        return res
          .status(400)
          .json({ message: "Message IDs array is required" });
      }

      const messageRepository = myDataSource.getRepository(Message);

      // Update messages where user is the receiver
      await messageRepository
        .createQueryBuilder()
        .update(Message)
        .set({ isRead: true })
        .where("id IN (:...messageIds)", { messageIds })
        .andWhere("receiverId = :userId", { userId })
        .execute();

      return res.status(200).json({ message: "Messages marked as read" });
    } catch (error) {
      console.error("Error marking messages as read:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}
