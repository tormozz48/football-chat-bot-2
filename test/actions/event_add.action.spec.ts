import 'mocha';
import {expect} from 'chai';

import {createContextStub, createEventAddContextStub} from '../stubs/context.stub';
import {createModuleStub} from '../stubs/actions.module.stub';
import {clearDatabase} from '../helpers/db-helper';

import {AppEmitter} from '../../src/common/event-bus.service';
import {StorageService} from '../../src/storage/storage.service';
import {Chat} from '../../src/storage/models/chat';
import {Event} from '../../src/storage/models/event';

describe('EventAddAction', () => {
    let appEmitter: AppEmitter;
    let storageService: StorageService;

    before(async () => {
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
            expect(chatCountBefore).to.equal(0);

            await new Promise(resolve => {
                const ctx = createEventAddContextStub({}, resolve);
                appEmitter.emit(appEmitter.EVENT_ADD, ctx);
            });

            const chatCountAfter: number = await storageService.connection
                .getRepository(Chat)
                .count();
            expect(chatCountAfter).to.equal(1);
        });

        it('should create new event and mark it as active', async () => {
            const eventsBefore: number = await storageService.connection
                .getRepository(Event)
                .count();
            expect(eventsBefore).to.equal(0);

            await new Promise(resolve => {
                const ctx = createEventAddContextStub({}, resolve);
                appEmitter.emit(appEmitter.EVENT_ADD, ctx);
            });

            const events: Event[] = await storageService.connection
                .getRepository(Event)
                .find({});

            expect(events).to.be.lengthOf(1);
            expect(events[0].active).to.equal(true);
        });

        it('should make all existed events inactive', async () => {
            const eventsBefore: number = await storageService.connection
                .getRepository(Event)
                .count();
            expect(eventsBefore).to.equal(0);

            let events: Event[];

            await new Promise(resolve => {
                const ctx = createEventAddContextStub({}, resolve);
                appEmitter.emit(appEmitter.EVENT_ADD, ctx);
            });

            events = await storageService.connection
                .getRepository(Event)
                .find({});
            expect(events[0].active).to.equal(true);

            await new Promise(resolve => {
                const ctx = createEventAddContextStub({}, resolve);
                appEmitter.emit(appEmitter.EVENT_ADD, ctx);
            });

            events = await storageService.connection
                .getRepository(Event)
                .find({});
            expect(events[0].active).to.equal(false);
            expect(events[1].active).to.equal(true);
        });

        it('should return information about created event', async () => {
            const jsonRes: string = await new Promise(resolve => {
                const ctx = createEventAddContextStub({}, resolve);
                appEmitter.emit(appEmitter.EVENT_ADD, ctx);
            });

            const {data} = JSON.parse(jsonRes);
            expect(data.date).to.match(/^\d{2}-\d{2}-\d{4}\s\d{2}:\d{2}$/);
        });
    });
});
