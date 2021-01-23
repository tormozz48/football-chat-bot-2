import {Logger, Module, OnModuleInit} from '@nestjs/common';
import { ConfigService } from 'src/common/config.service';
import { VK_MODES } from 'src/common/constants';
import {CommonModule} from '../common/common.module';
import { VKCallbackController } from './vk-callback.controller';
import {VKService} from './vk.service';

@Module({
    imports: [CommonModule],
    controllers: [VKCallbackController],
    providers: [VKService],
    exports: [VKService],
})
export class VKModule implements OnModuleInit {
    constructor(
        private readonly logger: Logger,
        private readonly config: ConfigService,
        private readonly vkService: VKService
    ) {}

    onModuleInit() {
        if (this.config.get('VK_MODE') === VK_MODES.LONG_POLLING) {
            this.vkService.launch();
        } else {
            this.logger.warn('Long-Polling API disabled. Only callbacks allowed')
        }
    }
}
