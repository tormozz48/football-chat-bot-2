import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import {Chat} from './chat';
import {Player} from './player';

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: Date;

    @Column()
    active: boolean;

    @ManyToOne(type => Chat, chat => chat.events)
    @JoinColumn()
    chat: Chat;

    @OneToMany(type => Player, player => player.event)
    @JoinColumn()
    players: Player[];
}
