import {createContextStub} from '../stubs/context.stub';
import {createModuleStub} from '../stubs/actions.module.stub';
import {clearDatabase} from '../helpers/db-helper';

import {AppEmitter} from '../../src/common/event-bus.service';
import {StorageService} from '../../src/storage/storage.service';
import {Chat} from '../../src/storage/models/chat';
import {Event} from '../../src/storage/models/event';

describe('EventAddAction', () => {
    let appEmitter: AppEmitter;
    let storageService: StorageService;

    beforeAll(async () => {
        const testModule = await createModuleStub();

        appEmitter = testModule.get<AppEmitter>(AppEmitter);
        storageService = testModule.get<StorageService>(StorageService);
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
                const ctx = createContextStub({}, resolve);
                appEmitter.emit(appEmitter.EVENT_ADD, ctx);
            });

            const chatCountAfter: number = await storageService.connection
                .getRepository(Chat)
                .count();
            expect(chatCountAfter).toBe(1);
        });

        it('should create new event and mark it as active', async () => {
            const eventsBefore: number = await storageService.connection
                .getRepository(Event)
                .count();
            expect(eventsBefore).toBe(0);

            await new Promise(resolve => {
                const ctx = createContextStub({}, resolve);
                appEmitter.emit(appEmitter.EVENT_ADD, ctx);
            });

            const events: Event[] = await storageService.connection
                .getRepository(Event)
                .find({});

            expect(events).toHaveLength(1);
            expect(events[0].active).toBe(true);
        });

        it('should make all existed events inactive', async () => {
            const eventsBefore: number = await storageService.connection
                .getRepository(Event)
                .count();
            expect(eventsBefore).toBe(0);

            let events: Event[];

            await new Promise(resolve => {
                const ctx = createContextStub({}, resolve);
                appEmitter.emit(appEmitter.EVENT_ADD, ctx);
            });

            events = await storageService.connection
                .getRepository(Event)
                .find({});
            expect(events[0].active).toBe(true);

            await new Promise(resolve => {
                const ctx = createContextStub({}, resolve);
                appEmitter.emit(appEmitter.EVENT_ADD, ctx);
            });

            events = await storageService.connection
                .getRepository(Event)
                .find({});
            expect(events[0].active).toBe(false);
            expect(events[1].active).toBe(true);
        });

        it('should return information about created event', async () => {
            const jsonRes: string = await new Promise(resolve => {
                const ctx = createContextStub({}, resolve);
                appEmitter.emit(appEmitter.EVENT_ADD, ctx);
            });

            const {data} = JSON.parse(jsonRes);
            expect(data.date).toMatch(/^\d{2}-\d{2}-\d{4}\s\d{2}:\d{2}$/);
        });
    });
});
