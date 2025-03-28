import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Event} from "./EventEntity";
import {User} from "./UserEntity";

@Entity('project_assignments')
export class EventAssignment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Event, (project) => project.assignedVolunteers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    event: Event;

    @ManyToOne(() => User, (user) => user.assignedEvents, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
    hoursWorked: number;

    @Column({ type: 'text', nullable: true })
    feedback?: string;

    @CreateDateColumn({ name: 'joined_at' })
    joinedAt: Date;
}
