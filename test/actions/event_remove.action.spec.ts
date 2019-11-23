import { Test } from '@nestjs/testing';
import { CommonModule } from '../../src/common/common.module';
import { StorageModule } from '../../src/storage/storage.module';
import { AppEmitter } from '../../src/common/event-bus.service';
import { TemplateService } from '../../src/common/template.service';
import { TemplateServiceStub } from '../stubs/template.service.stub';

import { EventRemoveAction } from '../../src/actions/event_remove.action';

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
