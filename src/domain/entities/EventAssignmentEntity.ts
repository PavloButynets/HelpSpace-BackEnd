import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Max, Min } from "class-validator";
import { Event } from "./EventEntity";
import { User } from "./UserEntity";
import { EventAssignmentStatus } from "../../consts/enums";

@Entity("event_assignments")
export class EventAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Event, (event) => event.assignedVolunteers, {
    onDelete: "CASCADE",
    eager: true,
  })
  @JoinColumn({ name: "event_id" })
  event: Event;

  @ManyToOne(() => User, (user) => user.assignedEvents, {
    onDelete: "CASCADE",
    eager: true,
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({
    type: "varchar",
    enum: EventAssignmentStatus,
    default: EventAssignmentStatus.PENDING,
  })
  status: EventAssignmentStatus;

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  hoursWorked: number;

  @Min(0)
  @Max(5)
  @Column({ type: "int", default: 0 })
  stars?: number;
  @Column({ type: "text", nullable: true })
  feedback?: string;

  @CreateDateColumn({ name: "joined_at" })
  joinedAt: Date;
}
