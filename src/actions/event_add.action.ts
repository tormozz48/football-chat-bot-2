import { Injectable} from '@nestjs/common';

import { getEventDate, formatEventDate } from '../common/utils';
import { BaseAction, IDoActionParams } from './base.action';
import { Event } from 'src/storage/models/event';

@Injectable()
export class EventAddAction extends BaseAction {
    protected setEvent(): void {
        this.event = this.appEmitter.EVENT_ADD;
    }

    protected async doAction(ctx, params: IDoActionParams) {
        await this.storageService.markChatEventsInactive(params.chat.id);
        const eventDate: Date = getEventDate();
        const event: Event = await this.storageService.appendChatActiveEvent(params.chat, eventDate);

        const answer: string = this.templateService.apply({
            action: 'event_add',
            status: this.STATUS_SUCCESS,
            lang: params.lang,
        }, {date: formatEventDate(event.date)});

        ctx.replyWithHTML(answer);
    }
}
