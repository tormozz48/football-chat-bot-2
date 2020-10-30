import {Injectable, Logger} from '@nestjs/common';
import {IMessage} from '../message/i-message';
import {ConfigService} from '../common/config.service';
import {AppEmitter} from '../common/event-bus.service';
import {TemplateService} from '../common/template.service';
import {StorageService} from '../storage/storage.service';
import {Chat} from '../storage/models/chat';

@Injectable()
export class BaseAction {
    protected readonly appEmitter: AppEmitter;
    protected readonly config: ConfigService;
    protected readonly logger: Logger;

    protected readonly templateService: TemplateService;
    protected readonly storageService: StorageService;

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
     * @param {Chat} chat
     * @param {IMessage} message
     * @returns {Promise<IMessage>}
     * @memberOf BaseAction
     */
    protected async doAction(chat: Chat, message: IMessage): Promise<IMessage> {
        throw new Error('not implemented');
    }

    private async handleEvent(message: IMessage) {
        try {
            this.logger.log(`"${this.event}" event received`);

            const chatId: number = message.chatId;
            const chat: Chat = await this.storageService.ensureChat(chatId);
            message = await this.doAction(chat, message);

            message.answer(
                this.templateService.apply(
                    {
                        action: this.event,
                        status: message.getReplyStatus(),
                        lang: message.lang,
                    },
                    message.getReplyData(),
                ),
            );
        } catch (error) {
            this.logger.error(error);
            message.answer(error.message);
        }
    }
}
