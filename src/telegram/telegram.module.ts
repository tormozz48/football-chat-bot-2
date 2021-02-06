import {Module, OnModuleInit} from '@nestjs/common';
import {CommonModule} from '../common/common.module';
import {TelegramService} from './telegram.service';

@Module({
    imports: [CommonModule],
    providers: [TelegramService],
    exports: [TelegramService],
})
export class TelegramModule implements OnModuleInit {
    constructor(private readonly telegramService: TelegramService) {}

    async onModuleInit() {
        await this.telegramService.launch();
    }
}
