import { Injectable, Logger} from '@nestjs/common';
import { ConfigService } from '../common/config.service';
import { AppEmitter } from '../common/event-bus.service';

@Injectable()
export class BaseAction {
    protected appEmitter: AppEmitter;
    protected config: ConfigService;
    protected logger: Logger;

    constructor(config: ConfigService, appEmitter: AppEmitter, logger: Logger) {
        this.config = config;
        this.logger = logger;

        this.appEmitter = appEmitter;

        this.initialize();
    }

    protected initialize() {
        throw new Error('not implemented');
    }

    protected handleEvent(ctx) {
        throw new Error('not implemented');
    }
}
