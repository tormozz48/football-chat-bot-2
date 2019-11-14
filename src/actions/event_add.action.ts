import { Injectable} from '@nestjs/common';

import { getEventDate } from '../common/utils';
import { BaseAction } from './base.action';
import { Chat } from 'src/storage/models/chat';
import { Event } from 'src/storage/models/event';

@Injectable()
export class EventAddAction extends BaseAction {
    protected setEvent(): void {
        this.event = this.appEmitter.EVENT_ADD;
    }

    protected async doAction(ctx) {
        const chatId: number = ctx.update.message.chat.id;

        const chat: Chat = await this.storageService.ensureChat(chatId);

        await this.storageService.markChatEventsInactive(chat.id);
        const eventDate: Date = getEventDate();
        const event: Event = await this.storageService.appendChatActiveEvent(chat, eventDate);

        const answer: string = this.templateService.apply({
            action: 'event_add',
            status: this.STATUS_SUCCESS,
        }, {date: event.date});

        ctx.replyWithHTML(answer);
    }
}
