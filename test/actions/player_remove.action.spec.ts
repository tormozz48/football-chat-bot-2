import { Test } from '@nestjs/testing';
import { CommonModule } from '../../src/common/common.module';
import { StorageModule } from '../../src/storage/storage.module';
import { AppEmitter } from '../../src/common/event-bus.service';
import { TemplateService } from '../../src/common/template.service';
import { TemplateServiceStub } from '../stubs/template.service.stub';

import { PlayerRemoveAction } from '../../src/actions/player_remove.action';

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
