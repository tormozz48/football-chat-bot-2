import { Injectable, Logger} from '@nestjs/common';
import { ConfigService } from '../common/config.service';
import { AppEmitter } from '../common/event-bus.service';
import { TemplateService } from '../common/template.service';
import { StorageService } from '../storage/storage.service';
import { Chat } from '../storage/models/chat';

export interface IDoActionParams {
    chat: Chat;
    lang: string;
}

@Injectable()
export class BaseAction {
    protected readonly STATUS_SUCCESS: string = 'success';
    protected readonly STATUS_FAIL: string = 'fail';

    protected appEmitter: AppEmitter;
    protected config: ConfigService;
    protected logger: Logger;

    protected templateService: TemplateService;
    protected storageService: StorageService;

    protected event: string;

    constructor(
        config: ConfigService,
        appEmitter: AppEmitter,
        logger: Logger,
        templateService: TemplateService,
        storageService: StorageService,
    ) {
        this.config = config;
        this.logger = logger;

        this.appEmitter = appEmitter;
        this.templateService = templateService;
        this.storageService = storageService;

        this.setEvent();

        this.logger.log(`subscribe on "${this.event}" event`);
        this.appEmitter.on(this.event, this.handleEvent.bind(this));
    }

    protected setEvent(): void {
        throw new Error('not implemented');
    }

    protected async doAction(ctx, params: IDoActionParams) {
        throw new Error('not implemented');
    }

    private async handleEvent(ctx) {
        try {
            this.logger.log(`"${this.event}" event received`);

            const lang: string = ctx.update.message.from.language_code;
            const chatId: number = ctx.update.message.chat.id;
            const chat: Chat = await this.storageService.ensureChat(chatId);

            return await this.doAction(ctx, {chat, lang});
        } catch (error) {
            this.logger.error(error);
        }
    }
}
