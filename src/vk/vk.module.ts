import {Module, OnModuleInit} from '@nestjs/common';
import {CommonModule} from '../common/common.module';
import {VKService} from './vk.service';

@Module({
    imports: [CommonModule],
    providers: [VKService],
    exports: [VKService],
})
export class VKModule implements OnModuleInit {
    constructor(private readonly vkService: VKService) {}

    onModuleInit() {
        this.vkService.launch();
    }
}
