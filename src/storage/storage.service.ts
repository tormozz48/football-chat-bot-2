import {Injectable} from '@nestjs/common';
import {InjectConnection} from '@nestjs/typeorm';
import {Connection, Repository, UpdateResult} from 'typeorm';

import {Chat} from './models/chat';
import {Event} from './models/event';
import {Player} from './models/player';

@Injectable()
export class StorageService {
    private chatRepository: Repository<Chat>;
    private eventRepository: Repository<Event>;
    private playerRepository: Repository<Player>;

    constructor(@InjectConnection() private readonly dbConnection: Connection) {
        this.chatRepository = this.dbConnection.getRepository(Chat);
        this.eventRepository = this.dbConnection.getRepository(Event);
        this.playerRepository = this.dbConnection.getRepository(Player);
    }

    public get connection() {
        return this.dbConnection;
    }

    /**
     * Finds chat for given chatId
     * If chat is not exists then creates it and returns it
     * @param {number} chatId
     * @returns {Promise<Chat>}
     * @memberOf StorageService
     */
    public async ensureChat(chatId: number): Promise<Chat> {
        let chat: Chat = await this.chatRepository.findOne({chatId});

        if (chat) {
            return chat;
        }

        chat = new Chat();
        chat.chatId = chatId;

        return this.chatRepository.save(chat);
    }

    /**
     * Updates all chat events. Makes them inactive
     * @param {number} chatId
     * @returns {Promise<UpdateResult>}
     * @memberOf StorageService
     */
    public markChatEventsInactive(chatId: number): Promise<UpdateResult> {
        return this.dbConnection
            .createQueryBuilder()
            .update(Event)
            .set({active: false})
            .where('chatId = :chatId', {chatId})
            .execute();
    }

    /**
     * Creates new active event and append it to chat
     * @param {Chat} chat
     * @param {Date} date
     * @returns {Promise<Event>}
     * @memberOf StorageService
     */
    public appendChatActiveEvent(chat: Chat, date: Date): Promise<Event> {
        const event: Event = new Event();
        event.chat = chat;
        event.active = true;
        event.date = date;

        return this.eventRepository.save(event);
    }

    /**
     * Finds active event for given chat and returns it
     * @param {Chat} chat
     * @returns {(Promise<Event|null>)}
     * @memberOf StorageService
     */
    public findChatActiveEvent(chat: Chat): Promise<Event | null> {
        return this.eventRepository.findOne({
            where: {
                chatId: chat.chatId,
                active: true,
            },
        });
    }

    /**
     * Returns list of players for given event
     * @param {Event} event
     * @returns {Promise<Player[]>}
     * @memberOf StorageService
     */
    public getPlayers(event: Event): Promise<Player[]> {
        return this.playerRepository.find({
            where: {
                eventId: event.id,
            },
        });
    }

    /**
     * Finds player by his name for given event
     * @param {Event} event
     * @param {string} name
     * @returns {(Promise<Player|null>)}
     * @memberOf StorageService
     */
    public findPlayer(event: Event, name: string): Promise<Player | null> {
        return this.playerRepository.findOne({
            where: {
                eventId: event.id,
                name,
            },
        });
    }

    /**
     * Creates new player with given name for event
     * @param {Event} event
     * @param {string} name
     * @returns {Promise<Player>}
     * @memberOf StorageService
     */
    public addPlayer(event: Event, name: string): Promise<Player> {
        const player: Player = new Player();
        player.event = event;
        player.name = name;

        return this.playerRepository.save(player);
    }

    /**
     * Removes given player
     * @param {Player} player
     * @returns {Promise<Player>}
     * @memberOf StorageService
     */
    public removePlayer(player: Player): Promise<Player> {
        return this.playerRepository.remove(player);
    }
}
