import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { User } from "./UserEntity";
import { Category } from "./CategoryEntity";
import { EventStatus } from "../../consts/enums";
import { EventAssignment } from "./EventAssignmentEntity";
import { IsOptional } from "class-validator";

@Entity("events")
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "text", nullable: false })
  description: string;

  @IsOptional()
  @Column({ type: "text", nullable: true })
  coverImage: string;

  @Column({ type: "varchar", enum: EventStatus, default: EventStatus.UPCOMING })
  status: EventStatus;

  @Column({ type: "varchar", length: 255, nullable: true })
  city: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  address: string;

  @Column({ type: "timestamp" })
  startDate: Date;

  @Column({ type: "timestamp" })
  endDate: Date;

  @Column({ type: "timestamp", nullable: true })
  registrationDeadline: Date;

  @Column({ type: "int", nullable: true })
  volunteerSlots: number;

  @Column({ type: "int", default: 0 })
  participantsCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.assignedEvents, {
    nullable: false,
    onDelete: "CASCADE",
    eager: true,
  })
  @JoinColumn({ name: "creator_id" })
  creator: User;

  // @ManyToOne(() => Organization, (organization) => organization.projects, { nullable: true, onDelete: 'SET NULL' })
  // @JoinColumn({ name: 'organization_id' })
  // assignedOrganization?: Organization;

  @ManyToMany(() => Category, (category) => category.events, {
    eager: true,
    cascade: true,
  })
  @JoinTable({
    name: "event_categories",
    joinColumn: { name: "event_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "category_id", referencedColumnName: "id" },
  })
  categories: Category[];

  @OneToMany(() => EventAssignment, (assignment) => assignment.event)
  assignedVolunteers: EventAssignment[];
}
