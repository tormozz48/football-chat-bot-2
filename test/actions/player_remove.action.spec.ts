import 'mocha';
import {expect} from 'chai';

import {createContextStub} from '../stubs/context.stub';
import {createModuleStub} from '../stubs/actions.module.stub';
import {clearDatabase} from '../helpers/db-helper';

import {AppEmitter} from '../../src/common/event-bus.service';
import {StorageService} from '../../src/storage/storage.service';
import * as statuses from '../../src/actions/statuses';
import {Chat} from '../../src/storage/models/chat';
import {Player} from '../../src/storage/models/player';
import {IParams} from '../../src/common/template.service';

describe('PlayerRemoveAction', () => {
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
                const ctx = createContextStub({lang: 'en', chatId: 1}, resolve);
                appEmitter.emit(appEmitter.PERSON_REMOVE, ctx);
            });

            const chatCountAfter: number = await storageService.connection
                .getRepository(Chat)
                .count();
            expect(chatCountAfter).to.equal(1);
        });

        it('should return no_event response if active event was not found', async () => {
            const jsonRes: string = await new Promise(resolve => {
                const ctx = createContextStub({lang: 'en', chatId: 1}, resolve);
                appEmitter.emit(appEmitter.PERSON_REMOVE, ctx);
            });

            const {params}: {params: IParams} = JSON.parse(jsonRes);
            expect(params.status).to.equal(statuses.STATUS_NO_EVENT);
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

            it('should return no_player response if player was not found by given name', async () => {
                const jsonRes: string = await new Promise(resolve => {
                    const ctx = createContextStub({text: 'John Smith'}, resolve);
                    appEmitter.emit(appEmitter.PERSON_REMOVE, ctx);
                });

                const {params}: {params: IParams} = JSON.parse(jsonRes);
                expect(params.status).to.equal(statuses.STATUS_NO_PLAYER);
            });

            describe('player exist', () => {
                async function assertExistedPlayer_() {
                    const players: Player[] = await storageService.connection
                        .getRepository(Player)
                        .find();
                    expect(players[0].name).to.equal('John Smith');
                }

                async function assertNotExistedPlayer_() {
                    const playersCount: number = await storageService.connection
                        .getRepository(Player)
                        .count();

                    expect(playersCount).to.equal(0);
                }

                beforeEach(async () => {
                    await new Promise(resolve => {
                        const ctx = createContextStub({text: 'John Smith'}, resolve);
                        appEmitter.emit(appEmitter.PERSON_ADD, ctx);
                    });
                });

                it('should remove player with given name', async () => {
                    await assertExistedPlayer_();

                    await new Promise(resolve => {
                        const ctx = createContextStub({text: 'John Smith'}, resolve);
                        appEmitter.emit(appEmitter.PERSON_REMOVE, ctx);
                    });

                    await assertNotExistedPlayer_();
                });

                it('should remove message owner as player if name was not set', async () => {
                    await assertExistedPlayer_();

                    await new Promise(resolve => {
                        const ctx = createContextStub({firstName: 'John', lastName: 'Smith'}, resolve);
                        appEmitter.emit(appEmitter.PERSON_REMOVE, ctx);
                    });

                    await assertNotExistedPlayer_();
                });

                it('should return success result', async () => {
                    const jsonRes: string = await new Promise(resolve => {
                        const ctx = createContextStub({text: 'John Smith'}, resolve);
                        appEmitter.emit(appEmitter.PERSON_REMOVE, ctx);
                    });

                    const {params}: {params: IParams} = JSON.parse(jsonRes);
                    expect(params.status).to.equal(statuses.STATUS_SUCCESS);
                });

                it('should inlude name of removed player into result', async () => {
                    const jsonRes: string = await new Promise(resolve => {
                        const ctx = createContextStub({text: 'John Smith'}, resolve);
                        appEmitter.emit(appEmitter.PERSON_REMOVE, ctx);
                    });

                    const {data} = JSON.parse(jsonRes);
                    expect(data.name).to.equal('John Smith');
                });

                it('should include list of players into result', async () => {
                    await new Promise(resolve => {
                        const ctx = createContextStub({text: 'Jack Wayne'}, resolve);
                        appEmitter.emit(appEmitter.PERSON_ADD, ctx);
                    });

                    const jsonRes: string = await new Promise(resolve => {
                        const ctx = createContextStub({text: 'John Smith'}, resolve);
                        appEmitter.emit(appEmitter.PERSON_REMOVE, ctx);
                    });

                    const {data} = JSON.parse(jsonRes);
                    expect(data.total).to.equal(1);
                    expect(data.players[0].index).to.equal(1);
                    expect(data.players[0].name).to.equal('Jack Wayne');
                });
            });
        });
    });
});
