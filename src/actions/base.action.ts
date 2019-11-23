import { Injectable, Logger} from '@nestjs/common';
import { ConfigService } from '../common/config.service';
import { AppEmitter } from '../common/event-bus.service';
import { TemplateService } from '../common/template.service';
import { StorageService } from '../storage/storage.service';
import { Chat } from '../storage/models/chat';

export interface IDoActionParams {
    chat: Chat;
    lang: string;
    message?: any;
}

export interface IActionResult {
    status: string;
    data?: any;
}

@Injectable()
export class BaseAction {
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

    /**
     * Set event for action.
     * This method must be overrided in child class
     * @protected
     * @memberOf BaseAction
     */
    protected setEvent(): void {
        throw new Error('not implemented');
    }

    /**
     * Implements action logic.
     * This method must be overrided in child class
     * @protected
     * @param {IDoActionParams} params
     * @returns {Promise<IActionResult>}
     * @memberOf BaseAction
     */
    protected async doAction(params: IDoActionParams): Promise<IActionResult> {
        throw new Error('not implemented');
    }

    /**
     * Creates action result by status and attached data
     * @protected
     * @param {string} status
     * @param {*} [data]
     * @returns {IActionResult}
     * @memberOf BaseAction
     */
    protected createActionResult(status: string, data?: any): IActionResult {
        return {status, data} as IActionResult;
    }

    private async handleEvent(ctx) {
        try {
            this.logger.log(`"${this.event}" event received`);

            const message = ctx.update.message;
            const lang: string = message.from.language_code;
            const chatId: number = message.chat.id;
            const chat: Chat = await this.storageService.ensureChat(chatId);

            const result: IActionResult = await this.doAction({chat, lang, message});

            ctx.replyWithHTML(this.templateService.apply({
                action: this.event,
                status: result.status,
                lang,
            }, result.data || {}));
        } catch (error) {
            this.logger.error(error);
            ctx.replyWithHTML(error.message);
        }
    }
}
