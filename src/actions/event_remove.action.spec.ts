import { Test } from '@nestjs/testing';
import { CommonModule } from '../common/common.module';
import { StorageModule } from '../storage/storage.module';
import { AppEmitter } from '../common/event-bus.service';
import { TemplateService } from '../common/template.service';
import { TemplateServiceStub } from '../../test/stubs/template.service.stub';

import { EventRemoveAction } from './event_remove.action';

describe('EventRemoveAction', () => {
    let eventRemoveAction: EventRemoveAction;
    let appEmitter: AppEmitter;

    beforeEach(async () => {
        const module = await Test
            .createTestingModule({
                imports: [CommonModule, StorageModule],
                providers: [
                    EventRemoveAction,
                ],
            })
            .overrideProvider(TemplateService)
            .useClass(TemplateServiceStub)
            .compile();

        eventRemoveAction = module.get<EventRemoveAction>(EventRemoveAction);
        appEmitter = module.get<AppEmitter>(AppEmitter);
    });

    describe('handle event', () => {
        it('should create chat if it does not exist yet', async () => {
            // return appEmitter.emit(appEmitter.EVENT_REMOVE, {});
        });
    });
});
