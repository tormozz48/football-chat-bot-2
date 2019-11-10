import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { TelegramService } from './telegram.service';

@Module({
    imports: [CommonModule],
    providers: [TelegramService],
    exports: [TelegramService],
})
export class TelegramModule {
    constructor(telegramService: TelegramService) {
        telegramService.launch();
    }
}
