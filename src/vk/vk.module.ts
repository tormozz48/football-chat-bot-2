import {Module, OnModuleInit} from '@nestjs/common';
import {CommonModule} from '../common/common.module';
import {VKPollingService} from './vk-polling.service';

@Module({
    imports: [CommonModule],
    providers: [VKPollingService],
    exports: [VKPollingService],
})
export class VKModule implements OnModuleInit {
    constructor(private readonly vkPollingService: VKPollingService) {}

    onModuleInit() {
        this.vkPollingService.launch();
    }
}
