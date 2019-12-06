import {Injectable} from '@nestjs/common';

import * as statuses from './statuses';
import {PlayerAction} from './player.action';
import {Chat} from '../storage/models/chat';
import {Event} from '../storage/models/event';
import {Player} from '../storage/models/player';
import {IMessage} from '../message/i-message';

@Injectable()
export class PlayerRemoveAction extends PlayerAction {
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
                ...(await this.getPlayersList(activeEvent)),
            });
    }
}
