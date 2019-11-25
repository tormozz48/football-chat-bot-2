import {Injectable} from '@nestjs/common';

import * as statuses from './statuses';
import {formatEventDate} from '../common/utils';
import {BaseAction} from './base.action';
import {Chat} from '../storage/models/chat';
import {Event} from '../storage/models/event';
import {Player} from '../storage/models/player';
import {IMessage} from '../message/i-message';

@Injectable()
export class EventInfoAction extends BaseAction {
    protected setEvent(): void {
        this.event = this.appEmitter.EVENT_INFO;
    }

    protected async doAction(chat: Chat, message: IMessage): Promise<IMessage> {
        const activeEvent: Event = await this.storageService.findChatActiveEvent(chat);

        if (!activeEvent) {
            return message.setStatus(statuses.STATUS_NO_EVENT);
        }

        const players: Player[] = await this.storageService.getPlayers(activeEvent);

        return message
            .setStatus(statuses.STATUS_SUCCESS)
            .withData({
                date: formatEventDate(activeEvent.date),
                total: players.length,
                players: players.map((player, index) => ({
                    index: index + 1,
                    name: player.name,
                })),
            });
    }
}
