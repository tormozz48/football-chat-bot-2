import {Injectable} from '@nestjs/common';

import * as statuses from './statuses';
import {formatEventDate} from '../common/utils';
import {BaseAction} from './base.action';
import {Chat} from '../storage/models/chat';
import {Event} from '../storage/models/event';
import {IMessage} from '../message/i-message';

@Injectable()
export class EventRemoveAction extends BaseAction {
    protected setEvent(): void {
        this.event = this.appEmitter.EVENT_REMOVE;
    }

    protected async doAction(chat: Chat, message: IMessage): Promise<IMessage> {
        const activeEvent: Event = await this.storageService.findChatActiveEvent(chat);
        await this.storageService.markChatEventsInactive(chat.id);

        if (activeEvent) {
            return message
                .setStatus(statuses.STATUS_SUCCESS)
                .withData({
                    date: formatEventDate(activeEvent.date),
                });
        } else {
            return message.setStatus(statuses.STATUS_NO_EVENT);
        }
    }
}
