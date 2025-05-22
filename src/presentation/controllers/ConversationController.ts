//TODO: temporary solution, divide layers by the principles of clean architecture in the future
import type { Request, Response } from "express";
import { myDataSource } from "../../config/database";
import { Conversation } from "../../domain/entities/ConversationEntity";
import { User } from "../../domain/entities/UserEntity";
import { Message } from "../../domain/entities/MessageEntity";
export class ConversationController {
  static getUserConversations = async (req: Request, res: Response) => {
    try {
      console.log("Getting user conversations");
      const userId = (req as any).userId;
      console.log("User ID:", userId);

      // Спочатку перевіримо, що користувач існує
      const userRepository = myDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: userId } });

      if (!user) {
        console.log(`User with ID ${userId} not found`);
        return res.status(404).json({ message: "User not found" });
      }

      console.log(`Found user: ${user.firstName} ${user.lastName}`);

      // Використаємо find замість createQueryBuilder для спрощення запиту
      const conversationRepository = myDataSource.getRepository(Conversation);

      try {
        // Прямий SQL запит для перевірки
        const rawConversations = await myDataSource.query(
          `
        SELECT c.* FROM conversations c
        JOIN users_conversations_conversations uc ON c.id = uc."conversationsId"
        WHERE uc."usersId" = $1
      `,
          [userId]
        );

        console.log(`Raw SQL found ${rawConversations.length} conversations`);

        // Якщо SQL працює, але TypeORM запит - ні, можемо використати прямий SQL
        if (rawConversations.length > 0 && rawConversations[0].id) {
          // Отримуємо повідомлення і учасників
          const conversationsWithDetails = await Promise.all(
            rawConversations.map(async (conv) => {
              // Отримуємо учасників бесіди
              const participants = await myDataSource.query(
                `
              SELECT u.* FROM users u
              JOIN users_conversations_conversations uc ON u.id = uc."usersId"
              WHERE uc."conversationsId" = $1
            `,
                [conv.id]
              );

              // Отримуємо останнє повідомлення
              const lastMessages = await myDataSource.query(
                `
              SELECT m.*, u.id as "senderId", u."firstName", u."lastName"
              FROM messages m
              LEFT JOIN users u ON m."senderId" = u.id
              WHERE m."conversationId" = $1
              ORDER BY m."createdAt" DESC
              LIMIT 1
            `,
                [conv.id]
              );

              const lastMessage =
                lastMessages.length > 0 ? lastMessages[0] : null;

              // Отримуємо кількість непрочитаних
              const unreadCount = await myDataSource.query(
                `
              SELECT COUNT(*) AS count
              FROM messages
              WHERE "conversationId" = $1 AND "receiverId" = $2 AND "isRead" = false
            `,
                [conv.id, userId]
              );

              return {
                ...conv,
                participants: participants.filter((p) => p.id !== userId),
                lastMessage,
                unreadCount: parseInt(unreadCount[0].count, 10),
              };
            })
          );

          console.log(
            `Returning ${conversationsWithDetails.length} conversations with details`
          );
          return res.status(200).json(conversationsWithDetails);
        }
      } catch (sqlError) {
        console.error("Error executing raw SQL:", sqlError);
      }

      // Спробуємо через TypeORM знову, якщо прямий SQL не допоміг
      const conversations = await conversationRepository.find({
        relations: {
          participants: true,
        },
        where: {
          participants: {
            id: userId,
          },
        },
      });

      console.log(`TypeORM find found ${conversations.length} conversations`);

      const messageRepository = myDataSource.getRepository(Message);

      const conversationsWithDetails = await Promise.all(
        conversations.map(async (conversation) => {
          console.log(`Processing conversation ${conversation.id}`);

          // Отримуємо останнє повідомлення
          const lastMessage = await messageRepository.findOne({
            where: { conversationId: conversation.id },
            relations: ["sender", "attachments"],
            order: { createdAt: "DESC" },
          });

          console.log(`Last message found: ${lastMessage?.id || "none"}`);

          // Рахуємо непрочитані
          const unreadCount = await messageRepository.count({
            where: {
              conversationId: conversation.id,
              receiverId: userId,
              isRead: false,
            },
          });

          console.log(`Unread count: ${unreadCount}`);

          return {
            ...conversation,
            participants: conversation.participants.filter(
              (p) => p.id !== userId
            ),
            lastMessage,
            unreadCount,
          };
        })
      );

      console.log(
        `Returning ${conversationsWithDetails.length} conversations with details`
      );
      return res.status(200).json(conversationsWithDetails);
    } catch (error) {
      console.error("Error getting conversations:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  // Create a new group conversation
  static createGroupConversation = async (req: Request, res: Response) => {
    try {
      const { name, participantIds } = req.body;
      const creatorId = (req as any).userId;

      if (!name || !participantIds || !Array.isArray(participantIds)) {
        return res
          .status(400)
          .json({ message: "Group name and participant IDs are required" });
      }

      // Ensure creator is included in participants
      if (!participantIds.includes(creatorId)) {
        participantIds.push(creatorId);
      }

      const userRepository = myDataSource.getRepository(User);
      const conversationRepository = myDataSource.getRepository(Conversation);

      // Get all participants
      const participants = await userRepository.findByIds(participantIds);

      if (participants.length !== participantIds.length) {
        return res.status(400).json({ message: "Some users were not found" });
      }

      // Create new group conversation
      const conversation = conversationRepository.create({
        name,
        isGroup: true,
        participants,
      });

      await conversationRepository.save(conversation);

      return res.status(201).json(conversation);
    } catch (error) {
      console.error("Error creating group conversation:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Add users to a group conversation
  static addUsersToGroup = async (req: Request, res: Response) => {
    try {
      const { conversationId } = req.params;
      const { userIds } = req.body;
      const userId = (req as any).userId;

      if (!userIds || !Array.isArray(userIds)) {
        return res.status(400).json({ message: "User IDs array is required" });
      }

      const conversationRepository = myDataSource.getRepository(Conversation);
      const userRepository = myDataSource.getRepository(User);

      // Get conversation with participants
      const conversation = await conversationRepository.findOne({
        where: { id: conversationId },
        relations: ["participants"],
      });

      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      if (!conversation.isGroup) {
        return res
          .status(400)
          .json({ message: "Cannot add users to a non-group conversation" });
      }

      // Check if user is part of the group
      const isParticipant = conversation.participants.some(
        (p) => p.id === userId
      );
      if (!isParticipant) {
        return res
          .status(403)
          .json({ message: "You are not part of this conversation" });
      }

      // Get users to add
      const usersToAdd = await userRepository.findByIds(userIds);

      // Add new users to participants
      const currentParticipantIds = conversation.participants.map((p) => p.id);
      for (const user of usersToAdd) {
        if (!currentParticipantIds.includes(user.id)) {
          conversation.participants.push(user);
        }
      }

      await conversationRepository.save(conversation);

      return res.status(200).json(conversation);
    } catch (error) {
      console.error("Error adding users to group:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Leave a group conversation
  static leaveGroup = async (req: Request, res: Response) => {
    try {
      const { conversationId } = req.params;
      const userId = (req as any).userId;

      const conversationRepository = myDataSource.getRepository(Conversation);

      // Get conversation with participants
      const conversation = await conversationRepository.findOne({
        where: { id: conversationId },
        relations: ["participants"],
      });

      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      if (!conversation.isGroup) {
        return res
          .status(400)
          .json({ message: "Cannot leave a non-group conversation" });
      }

      // Remove user from participants
      conversation.participants = conversation.participants.filter(
        (p) => p.id !== userId
      );

      await conversationRepository.save(conversation);

      return res.status(200).json({ message: "Left the group successfully" });
    } catch (error) {
      console.error("Error leaving group:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}
