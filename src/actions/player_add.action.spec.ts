import { Test } from '@nestjs/testing';
import { CommonModule } from '../common/common.module';
import { StorageModule } from '../storage/storage.module';
import { AppEmitter } from '../common/event-bus.service';
import { TemplateService } from '../common/template.service';
import { TemplateServiceStub } from '../../test/stubs/template.service.stub';

import { PlayerAddAction } from './player_add.action';

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
