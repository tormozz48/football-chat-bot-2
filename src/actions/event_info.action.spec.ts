import { Test } from '@nestjs/testing';
import { CommonModule } from '../common/common.module';
import { StorageModule } from '../storage/storage.module';
import { AppEmitter } from '../common/event-bus.service';
import { TemplateService } from '../common/template.service';
import { TemplateServiceStub } from '../../test/stubs/template.service.stub';

import { EventInfoAction } from './event_info.action';

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
