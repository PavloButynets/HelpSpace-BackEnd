import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {OrganizationMembership} from "./OrganizationMembership";

@Entity('organizations')
export class Organization {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', unique: true })
    name: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @OneToMany(() => OrganizationMembership, (membership) => membership.organization)
    members: OrganizationMembership[];

    // @OneToMany(() => Project, (project) => project.assignedOrganization)
    // projects: Project[];
}
