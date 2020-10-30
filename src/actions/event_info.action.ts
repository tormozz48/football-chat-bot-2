import {Injectable, Logger} from '@nestjs/common';

import * as statuses from './statuses';
import {formatEventDate} from '../common/utils';
import {ConfigService} from '../common/config.service';
import {AppEmitter} from '../common/event-bus.service';
import {TemplateService} from '../common/template.service';
import {StorageService} from '../storage/storage.service';
import {BaseAction} from './base.action';
import {PlayerHelper} from './player.helper';
import {Chat} from '../storage/models/chat';
import {Event} from '../storage/models/event';
import {Player} from '../storage/models/player';
import {IMessage} from '../message/i-message';

@Injectable()
export class EventInfoAction extends BaseAction {
    private playerHelper: PlayerHelper;

    constructor(
        config: ConfigService,
        appEmitter: AppEmitter,
        logger: Logger,
        templateService: TemplateService,
        playerHelper: PlayerHelper,
        storageService: StorageService,
    ) {
        super(config, appEmitter, logger, templateService, storageService);

        this.playerHelper = playerHelper;
    }

    protected setEvent(): void {
        this.event = this.appEmitter.EVENT_INFO;
    }

    protected async doAction(chat: Chat, message: IMessage): Promise<IMessage> {
        const activeEvent: Event = await this.storageService.findChatActiveEvent(
            chat,
        );

        if (!activeEvent) {
            this.logger.warn(`No active events for chat with id=${chat.id} were found`);
            return message.setStatus(statuses.STATUS_NO_EVENT);
        }

        const players: Player[] = await this.storageService.getPlayers(
            activeEvent,
        );

        return message.setStatus(statuses.STATUS_SUCCESS).withData({
            date: formatEventDate(activeEvent.date),
            ...(await this.playerHelper.getPlayersList(activeEvent)),
        });
    }
}
