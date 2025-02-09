import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne} from 'typeorm';
import { User } from './UserEntity';

export interface IToken {
    refreshToken: string;
    resetToken: string;
    confirmToken: string;
}

@Entity('tokens')
export class Token {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, user => user.tokens, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({name: 'user_id'})
    userId: string;


    @Column({ type: 'varchar', nullable: true })
    refreshToken: string | null;

    @Column({ type: 'varchar', nullable: true, default: null })
    resetToken: string | null;

    @Column({ type: 'varchar', nullable: true })
    confirmToken: string | null;

    [key: string]: any;
}
