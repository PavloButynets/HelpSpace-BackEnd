import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Event } from './EventEntity';
@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    name: string ;
    
    @Column({ type: 'text', nullable: true })
    description: string;
    
    @Column({ type: 'varchar', length: 50, nullable: true })
    color: string;
    
    @ManyToMany(() => Event, event => event.categories)
    events: Event[];
}