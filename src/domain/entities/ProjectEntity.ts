import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany, JoinColumn
} from 'typeorm';
import { User } from './UserEntity';
import {ProjectCategory, ProjectStatus} from "../../consts/enums";
import {ProjectAssignment} from "./ProjectAssignmentEntity";

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text', nullable: false })
    description: string;

    @Column({ type: 'text', nullable: true })
    photos: string[];

    @Column({ type: 'varchar', enum: ProjectStatus, default: ProjectStatus.NEW })
    status: ProjectStatus;

    @Column({ type: 'varchar', length: 255, nullable: true })
    location: string;

    @Column({ type: 'varchar', enum: ProjectCategory, default: ProjectCategory.OTHER })
    category: ProjectCategory;

    @Column({ type: 'timestamp', nullable: true })
    deadline: Date;

    @Column({ type: 'int', nullable: true })
    maxVolunteers: number;

    @Column({ type: 'int', default: 0 })
    rewardPoints: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.assignedProjects, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'creator_id' })
    creator: User;

    // @ManyToOne(() => Organization, (organization) => organization.projects, { nullable: true, onDelete: 'SET NULL' })
    // @JoinColumn({ name: 'organization_id' })
    // assignedOrganization?: Organization;

    @OneToMany(() => ProjectAssignment, (assignment) => assignment.project)
    assignedVolunteers: ProjectAssignment[];

}
