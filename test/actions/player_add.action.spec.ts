import { createContextStub } from '../stubs/context.stub';
import { createModuleStub } from '../stubs/actions.module.stub';

import { AppEmitter } from '../../src/common/event-bus.service';
import { StorageService } from '../../src/storage/storage.service';
import { Chat } from '../../src/storage/models/chat';
import { Event } from '../../src/storage/models/event';

describe('PlayerAddAction', () => {
    let appEmitter: AppEmitter;
    let storageService: StorageService;

    beforeAll(async () => {
        const module = await createModuleStub();

        appEmitter = module.get<AppEmitter>(AppEmitter);
        storageService = module.get<StorageService>(StorageService);
    });

    beforeEach(async () => {
        await storageService.connection.getRepository(Event).clear();
        await storageService.connection.getRepository(Chat).clear();
    });

    describe('handle event', () => {
        it('should create chat if it does not exist yet', async () => {
            // return appEmitter.emit(appEmitter.PERSON_ADD, {});
        });
    });
});
