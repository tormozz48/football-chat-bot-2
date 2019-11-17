import { Injectable} from '@nestjs/common';
import { formatEventDate } from '../common/utils';
import { BaseAction, IDoActionParams, IActionResult } from './base.action';
import { Event } from 'src/storage/models/event';

@Injectable()
export class EventRemoveAction extends BaseAction {
    protected setEvent(): void {
        this.event = this.appEmitter.EVENT_REMOVE;
    }

    protected async doAction(params: IDoActionParams): Promise<IActionResult> {
        const activeEvent: Event = await this.storageService.findChatActiveEvent(params.chat);
        await this.storageService.markChatEventsInactive(params.chat.id);

        return activeEvent
            ? { status: this.STATUS_SUCCESS, data: {date: formatEventDate(activeEvent.date)} }
            : { status: this.STATUS_FAIL };
    }
}
