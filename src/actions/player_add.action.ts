import { Injectable} from '@nestjs/common';
import { IDoActionParams, IActionResult } from './base.action';
import { PlayerAction } from './player.action';
import { Event } from '../storage/models/event';
import { Player } from 'src/storage/models/player';

@Injectable()
export class PlayerAddAction extends PlayerAction {
    protected setEvent(): void {
        this.event = this.appEmitter.PERSON_ADD;
    }

    protected async doAction(params: IDoActionParams): Promise<IActionResult> {
        const activeEvent: Event = await this.storageService.findChatActiveEvent(params.chat);

        if (!activeEvent) {
            return { status: 'no_event'} as IActionResult;
        }

        const name: string = this.resolveName(params.message);
        const existedPlayer: Player = await this.storageService.findPlayer(activeEvent, name);

        if (existedPlayer) {
            return { status: 'already_added', data: {name}} as IActionResult;
        }

        const newPlayer: Player = await this.storageService.addPlayer(activeEvent, name);

        return {
            status: this.STATUS_SUCCESS,
            data: {
                name: newPlayer.name,
                ...await this.getPlayersList(activeEvent),
            },
        };
    }
}
