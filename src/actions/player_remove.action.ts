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
export class PlayerRemoveAction extends BaseAction {
    private playerHelper: PlayerHelper;

    constructor(
        config: ConfigService,
        appEmitter: AppEmitter,
        logger: Logger,
        templateService: TemplateService,
        playerHelper: PlayerHelper,
        storageService: StorageService,
    ) {
        super(config,
            appEmitter,
            logger,
            templateService,
            storageService,
        );

        this.playerHelper = playerHelper;
    }

    protected setEvent(): void {
        this.event = this.appEmitter.PLAYER_REMOVE;
    }

    protected async doAction(chat: Chat, message: IMessage): Promise<IMessage> {
        const activeEvent: Event = await this.storageService.findChatActiveEvent(chat);

        if (!activeEvent) {
            return message.setStatus(statuses.STATUS_NO_EVENT);
        }

        const name: string = message.name;
        const existedPlayer: Player = await this.storageService.findPlayer(activeEvent, name);

        if (!existedPlayer) {
            return message
                .setStatus(statuses.STATUS_NO_PLAYER)
                .withData({name});
        }

        await this.storageService.removePlayer(existedPlayer);

        return message
            .setStatus(statuses.STATUS_SUCCESS)
            .withData({
                name,
                ...(await this.playerHelper.getPlayersList(activeEvent)),
            });
    }
}
