import {createContextStub} from '../stubs/context.stub';
import {createModuleStub} from '../stubs/actions.module.stub';
import {clearDatabase} from '../helpers/db-helper';

import {AppEmitter} from '../../src/common/event-bus.service';
import {StorageService} from '../../src/storage/storage.service';
import * as statuses from '../../src/actions/statuses';
import {Chat} from '../../src/storage/models/chat';
import {IParams} from '../../src/common/template.service';
import {Player} from '../../src/storage/models/player';

describe('PlayerAddAction', () => {
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
                appEmitter.emit(appEmitter.PERSON_ADD, ctx);
            });

            const chatCountAfter: number = await storageService.connection
                .getRepository(Chat)
                .count();
            expect(chatCountAfter).toBe(1);
        });

        it('should return no_event response if active event was not found', async () => {
            const jsonRes: string = await new Promise(resolve => {
                const ctx = createContextStub({}, resolve);
                appEmitter.emit(appEmitter.PERSON_ADD, ctx);
            });

            const {params}: {params: IParams} = JSON.parse(jsonRes);
            expect(params.status).toBe(statuses.STATUS_NO_EVENT);
        });

        describe('active event exists', () => {
            beforeEach(async () => {
                await new Promise(resolve => {
                    const ctx = createContextStub({}, resolve);
                    appEmitter.emit(appEmitter.EVENT_ADD, ctx);
                });
            });

            it('should add player with given name', async () => {
                await new Promise(resolve => {
                    const ctx = createContextStub(
                        {text: 'John Smith'},
                        resolve,
                    );
                    appEmitter.emit(appEmitter.PERSON_ADD, ctx);
                });

                const players: Player[] = await storageService.connection
                    .getRepository(Player)
                    .find();
                expect(players[0].name).toBe('John Smith');
            });

            it('should add message owner as player if name was not set', async () => {
                await new Promise(resolve => {
                    const ctx = createContextStub(
                        {firstName: 'John', lastName: 'Smith'},
                        resolve,
                    );
                    appEmitter.emit(appEmitter.PERSON_ADD, ctx);
                });

                const players: Player[] = await storageService.connection
                    .getRepository(Player)
                    .find();
                expect(players[0].name).toBe('John Smith');
            });

            it('should return success result', async () => {
                const jsonRes: string = await new Promise(resolve => {
                    const ctx = createContextStub(
                        {firstName: 'John', lastName: 'Smith'},
                        resolve,
                    );
                    appEmitter.emit(appEmitter.PERSON_ADD, ctx);
                });

                const {params}: {params: IParams} = JSON.parse(jsonRes);
                expect(params.status).toBe(statuses.STATUS_SUCCESS);
            });

            it('should include name of added player into result', async () => {
                const jsonRes: string = await new Promise(resolve => {
                    const ctx = createContextStub(
                        {firstName: 'John', lastName: 'Smith'},
                        resolve,
                    );
                    appEmitter.emit(appEmitter.PERSON_ADD, ctx);
                });

                const {data} = JSON.parse(jsonRes);
                expect(data.name).toBe('John Smith');
            });

            it('should include list of players into result', async () => {
                const jsonRes: string = await new Promise(resolve => {
                    const ctx = createContextStub(
                        {firstName: 'John', lastName: 'Smith'},
                        resolve,
                    );
                    appEmitter.emit(appEmitter.PERSON_ADD, ctx);
                });

                const {data} = JSON.parse(jsonRes);
                expect(data.total).toBe(1);
                expect(data.players[0].index).toBe(1);
                expect(data.players[0].name).toBe('John Smith');
            });

            it('should return already added response if player with given name has already been added', async () => {
                await new Promise(resolve => {
                    const ctx = createContextStub(
                        {firstName: 'John', lastName: 'Smith'},
                        resolve,
                    );
                    appEmitter.emit(appEmitter.PERSON_ADD, ctx);
                });

                const jsonRes: string = await new Promise(resolve => {
                    const ctx = createContextStub(
                        {firstName: 'John', lastName: 'Smith'},
                        resolve,
                    );
                    appEmitter.emit(appEmitter.PERSON_ADD, ctx);
                });

                const {params}: {params: IParams} = JSON.parse(jsonRes);
                expect(params.status).toBe(statuses.STATUS_ALREADY_ADDED);
            });
        });
    });
});
