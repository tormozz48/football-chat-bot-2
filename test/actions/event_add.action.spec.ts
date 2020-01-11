import 'mocha';
import {expect} from 'chai';

import {
    createContextStub,
    createEventAddContextStub,
} from '../stubs/context.stub';
import {createModuleStub} from '../stubs/actions.module.stub';
import {clearDatabase} from '../helpers/db-helper';

import {AppEmitter} from '../../src/common/event-bus.service';
import {StorageService} from '../../src/storage/storage.service';
import {Chat} from '../../src/storage/models/chat';
import {Event} from '../../src/storage/models/event';

describe('EventAddAction', () => {
    let appEmitter: AppEmitter;
    let storageService: StorageService;

    async function assertNoEvents_() {
        const eventsAmount = await storageService.connection
            .getRepository(Event)
            .count();

        expect(eventsAmount).to.equal(0);
    }

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
            await assertNoEvents_();

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
            await assertNoEvents_();

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

        it('should return information about created event', async () => {
            const jsonRes: string = await new Promise(resolve => {
                const ctx = createEventAddContextStub({}, resolve);
                appEmitter.emit(appEmitter.EVENT_ADD, ctx);
            });

            const {data} = JSON.parse(jsonRes);
            expect(data.date).to.match(/^\d{2}-\d{2}-\d{4}\s\d{2}:\d{2}$/);
        });

        describe('it should not allow to create event', () => {
            it('without date', async () => {
                const jsonRes: string = await new Promise(resolve => {
                    const ctx = createEventAddContextStub({
                        text: '/event_add',
                    }, resolve);
                    appEmitter.emit(appEmitter.EVENT_ADD, ctx);
                });

                const {params} = JSON.parse(jsonRes);
                expect(params.status).to.equal('invalid_date');
                await assertNoEvents_();
            });

            it('with date given in invalid format', async () => {
                const jsonRes: string = await new Promise(resolve => {
                    const ctx = createEventAddContextStub({
                        text: '/event_add aa-2a-b',
                    }, resolve);
                    appEmitter.emit(appEmitter.EVENT_ADD, ctx);
                });

                const {params} = JSON.parse(jsonRes);
                expect(params.status).to.equal('invalid_date');
                await assertNoEvents_();
            });

            it('with date in past', async () => {
                const jsonRes: string = await new Promise(resolve => {
                    const ctx = createEventAddContextStub({
                        text: '/event_add 01-01-1970 00:01',
                    }, resolve);
                    appEmitter.emit(appEmitter.EVENT_ADD, ctx);
                });

                const {params} = JSON.parse(jsonRes);
                expect(params.status).to.equal('invalid_date_past');
                await assertNoEvents_();
            });
        });

        describe('existed events', () => {
            let events: Event[];

            beforeEach(async () => {
                await assertNoEvents_();

                await new Promise(resolve => {
                    const ctx = createEventAddContextStub({}, resolve);
                    appEmitter.emit(appEmitter.EVENT_ADD, ctx);
                });

                events = await storageService.connection
                    .getRepository(Event)
                    .find({});
                expect(events.length).to.equal(1);
                expect(events[0].active).to.equal(true);
            });

            it('should make all existed events inactive', async () => {
                await new Promise(resolve => {
                    const ctx = createEventAddContextStub({}, resolve);
                    appEmitter.emit(appEmitter.EVENT_ADD, ctx);
                });

                events = await storageService.connection
                    .getRepository(Event)
                    .find({});
                expect(events.length).to.equal(2);
                expect(events[0].active).to.equal(false);
                expect(events[1].active).to.equal(true);
            });

            it('should not deactivate existed event if current event date is invalid', async () => {
                await new Promise(resolve => {
                    const ctx = createEventAddContextStub({
                        text: '/event_add',
                    }, resolve);
                    appEmitter.emit(appEmitter.EVENT_ADD, ctx);
                });

                events = await storageService.connection
                    .getRepository(Event)
                    .find({});
                expect(events.length).to.equal(1);
                expect(events[0].active).to.equal(true);
            });
        });
    });
});
