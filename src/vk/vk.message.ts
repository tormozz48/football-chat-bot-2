import {BaseMessage} from '../message/base.message';
import {IMessage} from '../message/i-message';

export class VKMessage extends BaseMessage implements IMessage {
    private firstName: string;
    private lastName: string;

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

    get name(): string {
        const targetName: string = this.text.replace(/^\/(add|remove)\S*/, '').trim();

        return targetName.length > 0
            ? targetName
            : this.composeOwnName();
    }

    public answer(args: any) {
        const answer: string = `${args}`.replace(/<\/?(strong|i)>/gm, '');
        this.ctx.reply(answer);
    }

    private composeOwnName() {
        const firstName: string = this.firstName || '';
        const lastName: string = this.lastName || '';

        return `${firstName} ${lastName}`.trim();
    }

    private getChatId({message, bot}): number {
        const peerId: number = message.peer_id;
        const groupId: number = bot.settings.group_id;
        return peerId + groupId;
    }
}
