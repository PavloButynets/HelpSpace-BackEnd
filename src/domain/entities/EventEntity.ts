import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany, JoinColumn, ManyToMany, JoinTable
} from 'typeorm';
import { User } from './UserEntity';
import { Category } from './CategoryEntity';
import {ProjectStatus} from "../../consts/enums";
import {EventAssignment} from "./EventAssignmentEntity";

@Entity('events')
export class Event {
    @PrimaryGeneratedColumn('uuid')
    id: string;

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

    @Column({ type: 'timestamp' })
    startDate: Date;

    @Column({ type: 'timestamp' })
    endDate: Date;

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

    @ManyToOne(() => User, (user) => user.assignedEvents, { nullable: false, onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'creator_id' })
    creator: User;

    // @ManyToOne(() => Organization, (organization) => organization.projects, { nullable: true, onDelete: 'SET NULL' })
    // @JoinColumn({ name: 'organization_id' })
    // assignedOrganization?: Organization;

    @ManyToMany(() => Category, category => category.events, { eager: true })
    @JoinTable({
        name: 'event_categories',
        joinColumn: { name: 'event_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
    })
    categories: Category[];

    @OneToMany(() => EventAssignment, (assignment) => assignment.event)
    assignedVolunteers: EventAssignment[];

}
