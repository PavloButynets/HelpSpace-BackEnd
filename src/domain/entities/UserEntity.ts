import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export enum UserRole {
    ADMIN = "admin",
    USER = "user",
    MODERATOR = "moderator"
}

@Entity("users")
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column({ type: "varchar", length: 255 })
    first_name: string;

    @Column({ type: "varchar", length: 255 })
    last_name: string;

    @Column({ type: "varchar", length: 255 })
    country: string;

    @Column({ type: "varchar", length: 255 }) // Місто
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

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at: Date;
}
