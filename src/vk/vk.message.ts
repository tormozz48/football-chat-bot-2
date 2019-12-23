import {BaseMessage} from '../message/base.message';
import {IMessage} from '../message/i-message';

export class VKMessage extends BaseMessage implements IMessage {
    private ctx: any;

    constructor(ctx) {
        super();

        this.ctx = ctx;

        const {message} = this.ctx;
        this.chatId = this.getChatId(this.ctx);
        this.text = message.text;
        this.lang = 'ru';
        this.firstName = message.from.first_name;
        this.lastName = message.from.last_name;
    }

    public answer(args: any) {
        const answer: string = `${args}`.replace(/<\/?(strong|i)>/gm, '');
        this.ctx.reply(answer);
    }

    private getChatId({message, bot}): number {
        const peerId: number = +(`${message.peer_id}`.replace(/[0-9]0+/, ''));
        const groupId: number = bot.settings.group_id;
        return peerId + groupId;
    }
}
