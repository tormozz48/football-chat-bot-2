import { Module } from '@nestjs/common';
import { TelegramModule } from './telegram/telegram.module';
import { VKModule } from './vk/vk.module';
import { ActionsModule } from './actions/actions.module';
import { PingController } from './ping.controller';

@Module({
    imports: [
        TelegramModule,
        VKModule,
        ActionsModule
    ],
    controllers: [PingController],
    providers: [],
})
export class AppModule { }
