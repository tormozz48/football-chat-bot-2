import {Module} from '@nestjs/common';
import {PingController} from './ping.controller';
import {TelegramModule} from './telegram/telegram.module';
import {ActionsModule} from './actions/actions.module';

@Module({
    imports: [TelegramModule, ActionsModule],
    controllers: [PingController],
    providers: [],
})
export class AppModule {}
