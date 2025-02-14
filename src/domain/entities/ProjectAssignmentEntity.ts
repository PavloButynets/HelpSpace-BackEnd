import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Project} from "./ProjectEntity";
import {User} from "./UserEntity";

@Entity('project_assignments')
export class ProjectAssignment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Project, (project) => project.assignedVolunteers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @ManyToOne(() => User, (user) => user.assignedProjects, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
    hoursWorked: number;

    @Column({ type: 'text', nullable: true })
    feedback?: string;

    @CreateDateColumn({ name: 'joined_at' })
    joinedAt: Date;
}
