import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity({ name: "logs" })
export class LogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  level: string;

  @Column()
  message: string;

  @Column({ type: "text", nullable: true })
  meta?: string;

  @CreateDateColumn()
  timestamp: Date;
}
