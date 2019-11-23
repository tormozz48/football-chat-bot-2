import {createContextStub} from '../stubs/context.stub';
import {createModuleStub} from '../stubs/actions.module.stub';
import {clearDatabase} from '../helpers/db-helper';

import {AppEmitter} from '../../src/common/event-bus.service';
import {StorageService} from '../../src/storage/storage.service';
import * as statuses from '../../src/actions/statuses';
import {Chat} from '../../src/storage/models/chat';
import {IParams} from '../../src/common/template.service';

describe('PlayerRemoveAction', () => {
    let appEmitter: AppEmitter;
    let storageService: StorageService;

    beforeAll(async () => {
        const module = await createModuleStub();

        appEmitter = module.get<AppEmitter>(AppEmitter);
        storageService = module.get<StorageService>(StorageService);
    });

    beforeEach(async () => {
        await clearDatabase(storageService);
    });

    describe('handle event', () => {
        it('should create chat if it does not exist yet', async () => {
            const chatCountBefore: number = await storageService.connection
                .getRepository(Chat)
                .count();
            expect(chatCountBefore).toBe(0);

            await new Promise(resolve => {
                const ctx = createContextStub({lang: 'en', chatId: 1}, resolve);
                appEmitter.emit(appEmitter.PERSON_REMOVE, ctx);
            });

            const chatCountAfter: number = await storageService.connection
                .getRepository(Chat)
                .count();
            expect(chatCountAfter).toBe(1);
        });

        it('should return no_event response if active event was not found', async () => {
            const jsonRes: string = await new Promise(resolve => {
                const ctx = createContextStub({lang: 'en', chatId: 1}, resolve);
                appEmitter.emit(appEmitter.PERSON_REMOVE, ctx);
            });

            const {params}: {params: IParams} = JSON.parse(jsonRes);
            expect(params.status).toBe(statuses.STATUS_NO_EVENT);
        });

        describe('active event exists', () => {
            beforeEach(async () => {
                await new Promise(resolve => {
                    const ctx = createContextStub(
                        {lang: 'en', chatId: 1},
                        resolve,
                    );
                    appEmitter.emit(appEmitter.EVENT_ADD, ctx);
                });
            });
        });
    });
});
