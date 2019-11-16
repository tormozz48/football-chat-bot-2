import { Injectable} from '@nestjs/common';
import { BaseAction, IDoActionParams } from './base.action';
import { Event } from '../storage/models/event';

@Injectable()
export class PersonAddAction extends BaseAction {
    protected setEvent(): void {
        this.event = this.appEmitter.PERSON_ADD;
    }

    protected async doAction(ctx, params: IDoActionParams) {
        const activeEvent: Event = await this.storageService.findChatActiveEvent(params.chat);

        if (!activeEvent) {
            
        }
    }
}
