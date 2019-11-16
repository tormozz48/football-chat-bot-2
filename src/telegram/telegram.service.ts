import Telegraf from 'telegraf';

import { Injectable } from '@nestjs/common';
import * as SocksAgent from 'socks5-https-client/lib/Agent';
import { ConfigService } from '../common/config.service';
import { AppEmitter } from '../common/event-bus.service';

@Injectable()
export class TelegramService {
    private bot: Telegraf<any>;

    constructor(config: ConfigService, appEmitter: AppEmitter) {
        const botToken: string = config.get('BOT_TOKEN');

        const socksAgent = new SocksAgent({
            socksHost: config.get('TELEGRAM_PROXY_HOST'),
            socksPort: config.get('TELEGRAM_PROXY_PORT'),
            socksUsername: config.get('TELEGRAM_PROXY_LOGIN'),
            socksPassword: config.get('TELEGRAM_PROXY_PASSWORD'),
        });

        this.bot = new Telegraf(botToken, {
            telegram: {
                agent: socksAgent,
            },
        });

        this.bot.command('event_add', (...args) => appEmitter.emit(appEmitter.EVENT_ADD, ...args));
        this.bot.command('info', (...args) => appEmitter.emit(appEmitter.EVENT_INFO, ...args));
        this.bot.command('event_remove', (...args) => appEmitter.emit(appEmitter.EVENT_REMOVE, ...args));
        this.bot.command('add', (...args) => appEmitter.emit(appEmitter.PERSON_ADD, ...args));
        this.bot.command('remove', (...args) => appEmitter.emit(appEmitter.PERSON_REMOVE, ...args));
    }

    public launch(): void {
        this.bot.launch();
    }
}
