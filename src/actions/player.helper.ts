import {Injectable} from '@nestjs/common';
import {StorageService} from '../storage/storage.service';
import {Event} from '../storage/models/event';
import {Player} from '../storage/models/player';

@Injectable()
export class PlayerHelper {
    protected storageService: StorageService;

    constructor(
        storageService: StorageService,
    ) {
        this.storageService = storageService;
    }

    public async getPlayersList(event: Event) {
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
