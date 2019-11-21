import { Injectable, Inject} from '@nestjs/common';
import { Connection, Repository, UpdateResult } from 'typeorm';

import { Chat } from './models/chat';
import { Event } from './models/event';
import { Player } from './models/player';

@Injectable()
export class StorageService {
    private dbConnection: Connection;

    private chatRepository: Repository<Chat>;
    private eventRepository: Repository<Event>;
    private playerRepository: Repository<Player>;

    constructor(@Inject('dbConnection') dbConnection: Connection) {
        this.dbConnection = dbConnection;

        this.chatRepository = this.dbConnection.getRepository(Chat);
        this.eventRepository = this.dbConnection.getRepository(Event);
        this.playerRepository = this.dbConnection.getRepository(Player);
    }

    public get connection() {
        return this.dbConnection;
    }

    public async ensureChat(chatId: number): Promise<Chat> {
        let chat: Chat = await this.chatRepository.findOne({chatId});

        if (chat) {
            return chat;
        }

        chat = new Chat();
        chat.chatId = chatId;

        return this.chatRepository.save(chat);
    }

    public markChatEventsInactive(chatId: number): Promise<UpdateResult> {
        return this.dbConnection
            .createQueryBuilder()
            .update(Event)
            .set({active: false})
            .where('chatId = :chatId', { chatId })
            .execute();
    }

    public appendChatActiveEvent(chat: Chat, date: Date): Promise<Event> {
        const event: Event = new Event();
        event.chat = chat;
        event.active = true;
        event.date = date;

        return this.eventRepository.save(event);
    }

    public findChatActiveEvent(chat: Chat): Promise<Event|null> {
        return this.eventRepository.findOne({
            where: {
                chatId: chat.chatId,
                active: true,
            },
        });
    }

    public getPlayers(event: Event): Promise<Player[]> {
        return this.playerRepository.find({
            where: {
                eventId: event.id,
            },
        });
    }

    public findPlayer(event: Event, name: string): Promise<Player|null> {
        return this.playerRepository.findOne({
            where: {
                eventId: event.id,
                name,
            },
        });
    }

    public addPlayer(event: Event, name: string): Promise<Player> {
        const player: Player = new Player();
        player.event = event;
        player.name = name;

        return this.playerRepository.save(player);
    }

    public removePlayer(player: Player): Promise<Player> {
        return this.playerRepository.remove(player);
    }
}
