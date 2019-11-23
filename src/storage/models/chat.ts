import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    JoinColumn,
    Index,
} from 'typeorm';
import {Event} from './event';

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({unique: true})
    @Column()
    chatId: number;

    @OneToMany(type => Event, event => event.chat)
    @JoinColumn()
    events: Event[];
}
