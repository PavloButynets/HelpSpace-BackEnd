import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne} from "typeorm";
import {Token} from "./TokenEntity";

export enum UserRole {
    ADMIN = "admin",
    USER = "user",
    MODERATOR = "moderator"
}

@Entity("users")
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: "varchar", length: 255 })
    first_name: string;

    @Column({ type: "varchar", length: 255 })
    last_name: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    country: string;

    @Column({ type: "varchar", length: 255, nullable: true})
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

    @Column({type: "timestamp", nullable: true})
    lastLogin: Date


    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at: Date;



    @OneToOne(() => Token, token => token.user)
    tokens: Token[];
}
