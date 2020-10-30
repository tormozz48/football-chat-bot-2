import {Injectable, Logger} from '@nestjs/common';

import * as statuses from './statuses';
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
export class PlayerAddAction extends BaseAction {
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
        this.event = this.appEmitter.PLAYER_ADD;
    }

    protected async doAction(chat: Chat, message: IMessage): Promise<IMessage> {
        const activeEvent: Event = await this.storageService.findChatActiveEvent(
            chat,
        );

        if (!activeEvent) {
            this.logger.warn(`No active events for chat with id=${chat.id} were found`);
            return message.setStatus(statuses.STATUS_NO_EVENT);
        }

        const name: string = this.playerHelper.getPlayerName(message);
        const existedPlayer: Player = await this.storageService.findPlayer(
            activeEvent,
            name,
        );

        if (existedPlayer) {
            return message
                .setStatus(statuses.STATUS_ALREADY_ADDED)
                .withData({name});
        }

        const newPlayer: Player = await this.storageService.addPlayer(
            activeEvent,
            name,
        );

        this.logger.log(`Player with id=${newPlayer.id} name=${newPlayer.name} has been added to event ${activeEvent.id}`);

        return message.setStatus(statuses.STATUS_SUCCESS).withData({
            name: newPlayer.name,
            ...(await this.playerHelper.getPlayersList(activeEvent)),
        });
    }
}
