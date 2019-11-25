import {Injectable} from '@nestjs/common';
import {BaseAction} from './base.action';
import {Event} from '../storage/models/event';
import {Player} from 'src/storage/models/player';

@Injectable()
export class PlayerAction extends BaseAction {
    protected async getPlayersList(event: Event) {
        const players: Player[] = await this.storageService.getPlayers(event);

        return {
            total: players.length,
            players: players.map((player, index) => ({
                index: index + 1,
                name: player.name,
            })),
        };
    }
}
