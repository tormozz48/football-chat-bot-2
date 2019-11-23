import { StorageService } from '../../src/storage/storage.service';
import { Chat } from '../../src/storage/models/chat';
import { Event } from '../../src/storage/models/event';
import { Player } from '../../src/storage/models/player';

export const clearDatabase = async (
    storageService: StorageService,
): Promise<void> => {
    await storageService.connection.getRepository(Player).clear();
    await storageService.connection.getRepository(Event).clear();
    await storageService.connection.getRepository(Chat).clear();
};
