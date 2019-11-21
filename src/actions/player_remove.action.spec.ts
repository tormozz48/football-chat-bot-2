import { Test } from '@nestjs/testing';
import { CommonModule } from '../common/common.module';
import { StorageModule } from '../storage/storage.module';
import { AppEmitter } from '../common/event-bus.service';
import { TemplateService } from '../common/template.service';
import { TemplateServiceStub } from '../../test/stubs/template.service.stub';

import { PlayerRemoveAction } from './player_remove.action';

describe('PlayerRemoveAction', () => {
    let playerRemoveAction: PlayerRemoveAction;
    let appEmitter: AppEmitter;

    beforeEach(async () => {
        const module = await Test
            .createTestingModule({
                imports: [CommonModule, StorageModule],
                providers: [
                    PlayerRemoveAction,
                ],
            })
            .overrideProvider(TemplateService)
            .useClass(TemplateServiceStub)
            .compile();

        playerRemoveAction = module.get<PlayerRemoveAction>(PlayerRemoveAction);
        appEmitter = module.get<AppEmitter>(AppEmitter);
    });

    describe('handle event', () => {
        it('should create chat if it does not exist yet', async () => {
            // return appEmitter.emit(appEmitter.PERSON_REMOVE, {});
        });
    });
});
