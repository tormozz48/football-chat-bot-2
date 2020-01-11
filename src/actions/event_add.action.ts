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
        const eventDate: Date = parseEventDate(message.text.trim());

        if (!eventDate) {
            return message.setStatus(statuses.STATUS_INVALID_DATE);
        }

        await this.storageService.markChatEventsInactive(chat);
        const event: Event = await this.storageService.appendChatActiveEvent(
            chat,
            eventDate,
        );

        return message.setStatus(statuses.STATUS_SUCCESS).withData({
            date: formatEventDate(event.date),
        });
    }
}
