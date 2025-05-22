import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Token } from "./TokenEntity";
import { Event } from "./EventEntity";
import { EventAssignment } from "./EventAssignmentEntity";
import { OrganizationMembership } from "./OrganizationMembership";
import { UserSkill } from "./UserSkills";
import { Message } from "./MessageEntity";
import { Conversation } from "./ConversationEntity";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  MODERATOR = "moderator",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  first_name: string;

  @Column({ type: "varchar", length: 255 })
  last_name: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  country: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  city: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  photo: string;

  @Column({ type: "boolean", default: false })
  isEmailConfirmed: boolean;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: "boolean", default: false })
  isBlocked: boolean;

  @Column({ type: "timestamp", nullable: true })
  lastLogin: Date;

  @Column({ type: "varchar", length: 255, nullable: true })
  bio: string;

  @Column({ type: "int", default: 0 })
  totalHoursWorked: number;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;

  @OneToOne(() => Token, (token) => token.user)
  tokens: Token[];

  @OneToMany(() => Event, (event) => event.creator)
  eventsCreated: Event[];

  @OneToMany(() => EventAssignment, (eventAssignment) => eventAssignment.user)
  assignedEvents: EventAssignment[];

  @OneToMany(() => UserSkill, (userSkill) => userSkill.user)
  userSkills: UserSkill[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages: Message[];

  @ManyToMany(() => Conversation, (conversation) => conversation.participants)
  @JoinTable()
  conversations: Conversation[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastSeen: Date;

  @OneToMany(
    () => OrganizationMembership,
    (organizationMember) => organizationMember.user
  )
  organizations: OrganizationMembership[];
}
