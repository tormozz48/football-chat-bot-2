import {Injectable} from '@nestjs/common';

import * as statuses from './statuses';
import {parseEventDate, formatEventDate} from '../common/utils';
import {BaseAction} from './base.action';
import {Chat} from '../storage/models/chat';
import {Event} from '../storage/models/event';
import {IMessage} from '../message/i-message';

@Injectable()
export class EventAddAction extends BaseAction {
    protected setEvent(): void {
        this.event = this.appEmitter.EVENT_ADD;
    }

    protected async doAction(chat: Chat, message: IMessage): Promise<IMessage> {
        await this.storageService.markChatEventsInactive(chat.id);

        const eventDate: Date = this.getEventDate(message);

        if (!eventDate) {
            return message.setStatus(statuses.STATUS_INVALID_DATE);
        }

        const event: Event = await this.storageService.appendChatActiveEvent(chat, eventDate);

        return message
            .setStatus(statuses.STATUS_SUCCESS)
            .withData({
                date: formatEventDate(event.date),
            });
    }

    private getEventDate(message: IMessage): Date {
        const [, ...dateText] = message.text.split(' ');
        return parseEventDate(dateText.join(' '));
    }
}
