import {Module} from '@nestjs/common';
import {CommonModule} from '../common/common.module';
import {VKService} from './vk.service';

@Module({
    imports: [CommonModule],
    providers: [VKService],
    exports: [VKService],
})
export class VKModule {
    constructor(vkService: VKService) {
        vkService.launch();
    }
}
