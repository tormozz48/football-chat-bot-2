import {Injectable} from '@nestjs/common';

import * as statuses from './statuses';
import {PlayerAction} from './player.action';
import {Chat} from '../storage/models/chat';
import {Event} from '../storage/models/event';
import {Player} from 'src/storage/models/player';
import {IMessage} from 'src/message/i-message';

@Injectable()
export class PlayerAddAction extends PlayerAction {
    protected setEvent(): void {
        this.event = this.appEmitter.PERSON_ADD;
    }

    protected async doAction(chat: Chat, message: IMessage): Promise<IMessage> {
        const activeEvent: Event = await this.storageService.findChatActiveEvent(chat);

        if (!activeEvent) {
            return message.setStatus(statuses.STATUS_NO_EVENT);
        }

        const name: string = message.name;
        const existedPlayer: Player = await this.storageService.findPlayer(activeEvent, name);

        if (existedPlayer) {
            return message
                .setStatus(statuses.STATUS_ALREADY_ADDED)
                .withData({name});
        }

        const newPlayer: Player = await this.storageService.addPlayer(activeEvent, name);

        return message
            .setStatus(statuses.STATUS_SUCCESS)
            .withData({
                name: newPlayer.name,
                ...(await this.getPlayersList(activeEvent)),
            });
    }
}
