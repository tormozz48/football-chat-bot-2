import { Injectable, Inject, Logger } from '@nestjs/common';
import { Connection, Repository, UpdateResult } from 'typeorm';

import { Chat } from './models/chat';
import { Event } from './models/event';
import { Player } from './models/player';

@Injectable()
export class StorageService {
    private logger: Logger;
    private dbConnection: Connection;

    private chatRepository: Repository<Chat>;
    private eventRepository: Repository<Event>;
    private playerRepository: Repository<Player>;

    constructor(@Inject('dbConnection') dbConnection: Connection, logger: Logger) {
        this.dbConnection = dbConnection;
        this.logger = logger;

        this.chatRepository = this.dbConnection.getRepository(Chat);
        this.eventRepository = this.dbConnection.getRepository(Event);
        this.playerRepository = this.dbConnection.getRepository(Player);
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
}
