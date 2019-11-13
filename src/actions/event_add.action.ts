import { Injectable} from '@nestjs/common';
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
        const event: Event = await this.storageService.appendChatActiveEvent(chat, new Date());
    }
}
