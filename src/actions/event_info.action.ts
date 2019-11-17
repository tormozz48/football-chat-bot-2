import { Injectable} from '@nestjs/common';
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
            return { status: 'no_event' } as IActionResult;
        }

        const players: Player[] = await this.storageService.getPlayers(activeEvent);

        return {
            status: this.STATUS_SUCCESS,
            data: {
                date: formatEventDate(activeEvent.date),
                total: players.length,
                players: players.map((player, index) => ({
                    index: index + 1,
                    name: player.name,
                })),
            },
        } as IActionResult;
    }
}
