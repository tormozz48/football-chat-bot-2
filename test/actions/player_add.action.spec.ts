import { Test } from '@nestjs/testing';
import { CommonModule } from '../../src/common/common.module';
import { StorageModule } from '../../src/storage/storage.module';
import { AppEmitter } from '../../src/common/event-bus.service';
import { TemplateService } from '../../src/common/template.service';
import { TemplateServiceStub } from '../stubs/template.service.stub';

import { PlayerAddAction } from '../../src/actions/player_add.action';

describe('PlayerAddAction', () => {
    let playerAddAction: PlayerAddAction;
    let appEmitter: AppEmitter;

    beforeEach(async () => {
        const module = await Test
            .createTestingModule({
                imports: [CommonModule, StorageModule],
                providers: [
                    PlayerAddAction,
                ],
            })
            .overrideProvider(TemplateService)
            .useClass(TemplateServiceStub)
            .compile();

        playerAddAction = module.get<PlayerAddAction>(PlayerAddAction);
        appEmitter = module.get<AppEmitter>(AppEmitter);
    });

    describe('handle event', () => {
        it('should create chat if it does not exist yet', async () => {
            // return appEmitter.emit(appEmitter.PERSON_ADD, {});
        });
    });
});
