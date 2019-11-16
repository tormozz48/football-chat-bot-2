import { Injectable} from '@nestjs/common';
import { formatEventDate } from '../common/utils';
import { BaseAction, IDoActionParams } from './base.action';
import { Event } from 'src/storage/models/event';

@Injectable()
export class EventRemoveAction extends BaseAction {
    protected setEvent(): void {
        this.event = this.appEmitter.EVENT_REMOVE;
    }

    protected async doAction(ctx, params: IDoActionParams) {
        const activeEvent: Event = await this.storageService.findChatActiveEvent(params.chat);
        await this.storageService.markChatEventsInactive(params.chat.id);

        const templateParams = {
            action: 'event_remove',
            lang: params.lang,
        };

        const answer = activeEvent
            ? this.templateService.apply({
                status: this.STATUS_SUCCESS,
                ...templateParams,
            }, {date: formatEventDate(activeEvent.date)})
            : this.templateService.apply({
                status: this.STATUS_FAIL,
                ...templateParams,
            }, {});

        ctx.replyWithHTML(answer);
    }
}
