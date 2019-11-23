import { Injectable} from '@nestjs/common';

import * as statuses from './statuses';
import { formatEventDate } from '../common/utils';
import { BaseAction, IDoActionParams, IActionResult } from './base.action';
import { Event } from '../storage/models/event';
import { Player } from 'src/storage/models/player';

@Injectable()
export class EventInfoAction extends BaseAction {
    protected setEvent(): void {
        this.event = this.appEmitter.EVENT_INFO;
    }

    protected async doAction(params: IDoActionParams): Promise<IActionResult> {
        const activeEvent: Event = await this.storageService.findChatActiveEvent(params.chat);

        if (!activeEvent) {
            return this.createActionResult(statuses.STATUS_NO_EVENT);
        }

        const players: Player[] = await this.storageService.getPlayers(activeEvent);

        return this.createActionResult(statuses.STATUS_SUCCESS, {
            date: formatEventDate(activeEvent.date),
            total: players.length,
            players: players.map((player, index) => ({
                index: index + 1,
                name: player.name,
            })),
        });
    }
}
