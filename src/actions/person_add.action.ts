import { Injectable} from '@nestjs/common';
import { BaseAction } from './base.action';

@Injectable()
export class PersonAddAction extends BaseAction {
    private event: string;

    protected initialize() {
        this.event = this.appEmitter.PERSON_ADD;
        this.logger.log(`subscribe on "${this.event}" event`);
        this.appEmitter.on(this.event, this.handleEvent.bind(this));
    }

    protected handleEvent(ctx) {
        this.logger.log(`"${this.event}" event received`);
    }
}
