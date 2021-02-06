import { TelegrafContext } from 'telegraf/typings/context';
import { Message } from 'telegraf/typings/telegram-types';
import {BaseMessage} from '../message/base.message';
import {IMessage} from '../message/i-message';

export class TelegramMessage extends BaseMessage implements IMessage {
    private ctx: any;

    constructor(ctx: any) {
        super();

        this.ctx = ctx;

        const {message} = this.ctx.update;
        this.chatId = this.adjustChatId(message.chat.id);
        this.fullText = message.text;
        this.command = this.ctx.command;
        this.text = this.extractText(this.fullText);

        this.lang = message.from.language_code;
        this.firstName = message.from.first_name;
        this.lastName = message.from.last_name;
    }

    public answer(args: any): Promise<Message> {
        return this.ctx.replyWithHTML(args);
    }

    /**
     * Telegram chat identifier may be greater or less then max 4 byte integer value
     * which is used as type for related column in postgresql
     * @private
     * @param  {number} chatId 
     * @return number 
     * @memberof TelegramMessage
     */
    private adjustChatId(chatId: number): number {
        if (Math.abs(chatId) < 2147483648) {
            return chatId;
        }

        return this.adjustChatId(chatId >>> 1)
    }

    /**
     * Trim command name and bot name e.g @MyBot which can be appear on some devices
     * @param fullText
     */
    private extractText(fullText: string): string {
        let text: string = fullText.replace(`/${this.command}`, '');

        if (this.ctx.botInfo && this.ctx.botInfo.username) {
            text = text.replace(this.ctx.botInfo.username, '');
        }

        return text;
    }
}
