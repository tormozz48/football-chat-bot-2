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
import {Event} from '../../src/storage/models/event';
import {Player} from '../../src/storage/models/player';

describe('complex cases', () => {
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

    function addPlayer_(name, chatId = 1) {
        return new Promise(resolve => {
            appEmitter.emit(
                appEmitter.PLAYER_ADD,
                createContextStub({text: name, chatId}, resolve),
            );
        });
    }

    let events: Event[];
    let players: Player[];

    beforeEach(async () => {
        await new Promise(resolve => {
            appEmitter.emit(
                appEmitter.EVENT_ADD,
                createEventAddContextStub({}, resolve),
            );
        });

        await addPlayer_('player-1-1');
        await addPlayer_('player-1-2');

        events = await storageService.connection
            .getRepository(Event)
            .find({where: {active: true}});
        expect(events).to.be.lengthOf(1);

        players = await storageService.connection
            .getRepository(Player)
            .find({where: {event: events[0]}});

        expect(players).to.be.lengthOf(2);
        expect(players[0].name).to.equal('player-1-1');
        expect(players[1].name).to.equal('player-1-2');
    });

    it('should create empty players set for each created event', async () => {
        await new Promise(resolve => {
            appEmitter.emit(
                appEmitter.EVENT_ADD,
                createEventAddContextStub({}, resolve),
            );
        });

        await addPlayer_('player-2-1');

        events = await storageService.connection
            .getRepository(Event)
            .find({where: {active: true}});
        expect(events).to.be.lengthOf(1);

        players = await storageService.connection
            .getRepository(Player)
            .find({where: {event: events[0]}});

        expect(players).to.be.lengthOf(1);
        expect(players[0].name).to.equal('player-2-1');

        players = await storageService.getPlayers(events[0]);

        expect(players).to.be.lengthOf(1);
        expect(players[0].name).to.equal('player-2-1');
    });

    it('should add players with same names to different events', async () => {
        await new Promise(resolve => {
            appEmitter.emit(
                appEmitter.EVENT_ADD,
                createEventAddContextStub({}, resolve),
            );
        });

        await addPlayer_('player-1-1');
        await addPlayer_('player-1-2');

        events = await storageService.connection
            .getRepository(Event)
            .find({where: {active: true}});

        players = await storageService.getPlayers(events[0]);

        expect(players).to.be.lengthOf(2);
        expect(players[0].name).to.equal('player-1-1');
        expect(players[1].name).to.equal('player-1-2');
    });

    it('should have own active event for different chats', async () => {
        await new Promise(resolve => {
            const ctx = createEventAddContextStub({chatId: 2}, resolve);
            appEmitter.emit(appEmitter.EVENT_ADD, ctx);
        });

        events = await storageService.connection
            .getRepository(Event)
            .find({relations: ['chat']});

        expect(events[0].chat.chatId).to.equal(1);
        expect(events[0].active).to.equal(true);
        expect(events[1].chat.chatId).to.equal(2);
        expect(events[1].active).to.equal(true);

        await addPlayer_('player-2-1', 2);
        await addPlayer_('player-2-2', 2);

        const jsonRes1: string = await new Promise(resolve => {
            const ctx = createContextStub({chatId: 1}, resolve);
            appEmitter.emit(appEmitter.EVENT_INFO, ctx);
        });
        const data1: any = JSON.parse(jsonRes1).data;

        const jsonRes2: string = await new Promise(resolve => {
            const ctx = createContextStub({chatId: 2}, resolve);
            appEmitter.emit(appEmitter.EVENT_INFO, ctx);
        });
        const data2: any = JSON.parse(jsonRes2).data;

        expect(data1.players).to.eql([
            {index: 1, name: 'player-1-1'},
            {index: 2, name: 'player-1-2'},
        ]);
        expect(data2.players).to.eql([
            {index: 1, name: 'player-2-1'},
            {index: 2, name: 'player-2-2'},
        ]);
    });
});
