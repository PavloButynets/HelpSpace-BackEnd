import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./UserEntity";
import { Conversation } from "./ConversationEntity";
import { Attachment } from "./AttachmentEntity";

@Entity("messages")
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  content: string;

  @ManyToOne(() => User, (user) => user.sentMessages)
  @JoinColumn({ name: "senderId" })
  sender: User;

  @Column()
  senderId: string;

  @ManyToOne(() => User, (user) => user.receivedMessages)
  @JoinColumn({ name: "receiverId" })
  receiver: User;

  @Column()
  receiverId: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  @JoinColumn({ name: "conversationId" })
  conversation: Conversation;

  @Column()
  conversationId: string;

  @Column({ default: false })
  isRead: boolean;

  @OneToMany(() => Attachment, (attachment) => attachment.message, {
    cascade: true,
  })
  attachments: Attachment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
