import { Injectable} from '@nestjs/common';
import { BaseAction } from './base.action';

@Injectable()
export class EventRemoveAction extends BaseAction {
    protected setEvent(): void {
        this.event = this.appEmitter.EVENT_REMOVE;
    }

    protected async doAction(ctx) {
        throw new Error('not implemented');
    }
}
