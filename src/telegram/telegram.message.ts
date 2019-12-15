import {BaseMessage} from '../message/base.message';
import {IMessage} from '../message/i-message';

export class TelegramMessage extends BaseMessage implements IMessage {
    private firstName: string;
    private lastName: string;

    private ctx: any;

    constructor(ctx) {
        super();

        this.ctx = ctx;

        const {message} = this.ctx.update;
        this.chatId = message.chat.id;
        this.text = message.text;
        this.lang = message.from.language_code;
        this.firstName = message.from.first_name;
        this.lastName = message.from.last_name;
    }

    get name(): string {
        const targetName: string = this.text.replace(/^\/(add|remove)\S*/, '').trim();

        return targetName.length > 0
            ? targetName
            : this.composeOwnName();
    }

    public answer(args: any): string|void {
        return this.ctx.replyWithHTML(args);
    }

    private composeOwnName() {
        const firstName: string = this.firstName || '';
        const lastName: string = this.lastName || '';

        return `${firstName} ${lastName}`.trim();
    }
}
