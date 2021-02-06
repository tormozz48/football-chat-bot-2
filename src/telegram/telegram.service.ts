import Telegraf from 'telegraf';

import {Injectable} from '@nestjs/common';
import * as SocksAgent from 'socks5-https-client/lib/Agent';
import {ConfigService} from '../common/config.service';
import {AppEmitter} from '../common/event-bus.service';
import {TelegramMessage} from './telegram.message';
import { User } from 'telegraf/typings/telegram-types';
import { TelegrafContext } from 'telegraf/typings/context';

@Injectable()
export class TelegramService {
    private bot: Telegraf<any>;

    constructor(config: ConfigService, appEmitter: AppEmitter) {
        const botToken: string = config.get('TELEGRAM_BOT_TOKEN');

        this.bot = config.get('TELEGRAM_USE_PROXY')
            ? new Telegraf(botToken, {
                  telegram: {agent: this.getProxy(config)},
              })
            : new Telegraf(botToken);

        this.getCommandEventMapping(appEmitter).forEach(([command, event]) => {
            this.bot.command(command, (ctx: TelegrafContext & {command?: string}) => {
                ctx.command = command;
                appEmitter.emit(event, new TelegramMessage(ctx));
            });
        });
    }

    public async launch(): Promise<void> {
        const botInfo: User = await this.bot.telegram.getMe();
        if (botInfo) {
            this.bot.options.username = botInfo.username
        }

        this.bot.launch();
    }

    /**
     * Returns proxy instance for telegram bot
     * @private
     * @param {ConfigService} config
     * @returns {SocksAgent}
     * @memberOf TelegramService
     */
    private getProxy(config: ConfigService): SocksAgent {
        return new SocksAgent({
            socksHost: config.get('TELEGRAM_PROXY_HOST'),
            socksPort: config.get('TELEGRAM_PROXY_PORT'),
            socksUsername: config.get('TELEGRAM_PROXY_LOGIN'),
            socksPassword: config.get('TELEGRAM_PROXY_PASSWORD'),
        });
    }

    /**
     * Returns mapping structure that links commands and corresponded events
     * @private
     * @param {AppEmitter} appEmitter
     * @returns {Array<[string, string]>}
     * @memberOf TelegramService
     */
    private getCommandEventMapping(
        appEmitter: AppEmitter,
    ): [string, string][] {
        return [
            ['event_add', appEmitter.EVENT_ADD],
            ['event_remove', appEmitter.EVENT_REMOVE],
            ['info', appEmitter.EVENT_INFO],
            ['add', appEmitter.PLAYER_ADD],
            ['remove', appEmitter.PLAYER_REMOVE],
        ];
    }
}
