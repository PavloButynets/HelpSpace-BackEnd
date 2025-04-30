import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
} from "typeorm";
import { User } from "./UserEntity";
import { Skill } from "./SkillEntity";

@Entity("user_skills")
export class UserSkill {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.userSkills)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Skill, (skill) => skill.userSkills)
  @JoinColumn({ name: "skill_id" })
  skill: Skill;

  @Column({ type: "boolean", default: false })
  isVerified: boolean;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;
}
