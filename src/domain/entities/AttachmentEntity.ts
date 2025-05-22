import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Message } from "./MessageEntity";

@Entity("attachments")
export class Attachment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  url: string;

  @Column()
  size: number;

  @ManyToOne(() => Message, (message) => message.attachments)
  @JoinColumn({ name: "messageId" })
  message: Message;

  @Column()
  messageId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
