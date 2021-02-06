import {BaseMessage} from '../message/base.message';
import {IMessage} from '../message/i-message';

export class TelegramMessage extends BaseMessage implements IMessage {
    private ctx: any;

    constructor(ctx) {
        super();

        this.ctx = ctx;

        const {message} = this.ctx.update;
        this.chatId = this.adjustChatId(message.chat.id);
        this.fullText = message.text;
        this.command = this.ctx.command;
        this.text = this.fullText.replace(`/${this.command}`, '');
        this.lang = message.from.language_code;
        this.firstName = message.from.first_name;
        this.lastName = message.from.last_name;
    }

    public answer(args: any): string | void {
        return this.ctx.replyWithHTML(args);
    }

    private adjustChatId(chatId: number): number {
        if (Math.abs(chatId) < 2147483648) {
            return chatId;
        }

        return this.adjustChatId(chatId >>> 1)
    }
}
