import { Test } from '@nestjs/testing';
import { CommonModule } from '../../src/common/common.module';
import { StorageModule } from '../../src/storage/storage.module';
import { AppEmitter } from '../../src/common/event-bus.service';
import { TemplateService } from '../../src/common/template.service';
import { TemplateServiceStub } from '../stubs/template.service.stub';

import { EventInfoAction } from '../../src/actions/event_info.action';

describe('EventAddAction', () => {
    let eventInfoAction: EventInfoAction;
    let appEmitter: AppEmitter;

    beforeEach(async () => {
        const module = await Test
            .createTestingModule({
                imports: [CommonModule, StorageModule],
                providers: [
                    EventInfoAction,
                ],
            })
            .overrideProvider(TemplateService)
            .useClass(TemplateServiceStub)
            .compile();

        eventInfoAction = module.get<EventInfoAction>(EventInfoAction);
        appEmitter = module.get<AppEmitter>(AppEmitter);
    });

    describe('handle event', () => {
        it('should create chat if it does not exist yet', async () => {
            // return appEmitter.emit(appEmitter.EVENT_INFO, {});
        });
    });
});
