import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {OrganizationMemberEnum} from "../../consts/enums";
import {Organization} from "./Organization";
import {User} from "./UserEntity";

@Entity('organization_members')
export class OrganizationMembership {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Organization, (organization) => organization.members, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'organization_id' })
    organization: Organization;

    @ManyToOne(() => User, (user) => user.organizations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'varchar' })
    role: OrganizationMemberEnum;

    @CreateDateColumn({ name: 'joined_at' })
    joinedAt: Date;
}
