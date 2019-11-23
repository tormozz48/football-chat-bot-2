import { createContextStub } from '../stubs/context.stub';
import { createModuleStub } from '../stubs/actions.module.stub';

import { AppEmitter } from '../../src/common/event-bus.service';
import { StorageService } from '../../src/storage/storage.service';
import * as statuses from '../../src/actions/statuses';
import { Chat } from '../../src/storage/models/chat';
import { Event } from '../../src/storage/models/event';
import { IParams } from 'src/common/template.service';

describe('EventAddAction', () => {
    let appEmitter: AppEmitter;
    let storageService: StorageService;

    beforeAll(async () => {
        const testModule = await createModuleStub();

        appEmitter = testModule.get<AppEmitter>(AppEmitter);
        storageService = testModule.get<StorageService>(StorageService);
    });

    beforeEach(async () => {
        await storageService.connection.getRepository(Event).clear();
        await storageService.connection.getRepository(Chat).clear();
    });

    describe('handle event', () => {
        it('should create chat if it does not exist yet', async () => {
            const chatCountBefore: number = await storageService.connection.getRepository(Chat).count();
            expect(chatCountBefore).toBe(0);

            await new Promise((resolve) => {
                const ctx = createContextStub({lang: 'en', chatId: 1}, resolve);
                appEmitter.emit(appEmitter.EVENT_INFO, ctx);
            });

            const chatCountAfter: number = await storageService.connection.getRepository(Chat).count();
            expect(chatCountAfter).toBe(1);
        });

        it('should return no_event response if active event was not found', async () => {
            const jsonRes: string = await new Promise((resolve) => {
                const ctx = createContextStub({lang: 'en', chatId: 1}, resolve);
                appEmitter.emit(appEmitter.EVENT_INFO, ctx);
            });

            const {params}: {params: IParams} = JSON.parse(jsonRes);
            expect(params.status).toBe(statuses.STATUS_NO_EVENT);
        });

        describe('active event exists', () => {
            beforeEach(async () => {
                await new Promise((resolve) => {
                    const ctx = createContextStub({lang: 'en', chatId: 1}, resolve);
                    appEmitter.emit(appEmitter.EVENT_ADD, ctx);
                });
            });

            it('should return success result if active event was found', async () => {
                const jsonRes: string = await new Promise((resolve) => {
                    const ctx = createContextStub({lang: 'en', chatId: 1}, resolve);
                    appEmitter.emit(appEmitter.EVENT_INFO, ctx);
                });

                const {params}: {params: IParams} = JSON.parse(jsonRes);
                expect(params.status).toBe(statuses.STATUS_SUCCESS);
            });

            it('should include date of event into response', async () => {
                const jsonRes: string = await new Promise((resolve) => {
                    const ctx = createContextStub({lang: 'en', chatId: 1}, resolve);
                    appEmitter.emit(appEmitter.EVENT_INFO, ctx);
                });

                const {data}: any = JSON.parse(jsonRes);
                expect(data.date).toMatch(/^\d{2}-\d{2}-\d{4}\s\d{2}:\d{2}$/);
            });

            it('should include list of event members', async () => {
                const jsonRes: string = await new Promise((resolve) => {
                    const ctx = createContextStub({lang: 'en', chatId: 1}, resolve);
                    appEmitter.emit(appEmitter.EVENT_INFO, ctx);
                });

                const {data}: any = JSON.parse(jsonRes);
                expect(data.total).toBe(0);
                expect(data.players).toStrictEqual([]);
            });
        });
    });
});
