import { Test } from '@nestjs/testing';

import { CommonModule } from '../../src/common/common.module';
import { StorageModule } from '../../src/storage/storage.module';
import { TemplateService } from '../../src/common/template.service';
import { TemplateServiceStub } from './template.service.stub';

import { EventAddAction } from '../../src/actions/event_add.action';
import { EventRemoveAction } from '../../src/actions/event_remove.action';
import { EventInfoAction } from '../../src/actions/event_info.action';
import { PlayerAddAction } from '../../src/actions/player_add.action';
import { PlayerRemoveAction } from '../../src/actions/player_remove.action';

export const createModuleStub = () => {
    return Test
        .createTestingModule({
            imports: [CommonModule, StorageModule],
            providers: [
                EventAddAction,
                EventRemoveAction,
                EventInfoAction,
                PlayerAddAction,
                PlayerRemoveAction,
            ],
        })
        .overrideProvider(TemplateService)
        .useClass(TemplateServiceStub)
        .compile();
};
