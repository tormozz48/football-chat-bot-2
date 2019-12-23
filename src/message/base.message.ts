import {IMessage} from '../message/i-message';

export class BaseMessage implements IMessage {
    public chatId: number;
    public lang: string;
    public text: string;

    protected firstName: string;
    protected lastName: string;

    protected replyStatus: string;
    protected replyData: any;

    /**
     * Retunrn name of player
     * @readonly
     * @type {string}
     * @memberOf BaseMessage
     */
    get name(): string {
        const targetName: string = this.text.replace(/^\/(add|remove)\S*/, '').trim();

        return targetName.length > 0
            ? targetName
            : this.composeOwnName();
    }

    /**
     * Returns status of answer (reply)
     * @returns {string}
     * @memberOf BaseMessage
     */
    public getReplyStatus(): string {
        return this.replyStatus;
    }

    /**
     * Returns data for answer (reply)
     * @returns {string}
     * @memberOf BaseMessage
     */
    public getReplyData(): any {
        return this.replyData;
    }

    /**
     * Sets status of answer
     * @param {string} status
     * @returns {IMessage}
     *
     * @memberOf BaseMessage
     */
    public setStatus(status: string): IMessage {
        this.replyStatus = status;
        return this;
    }

    /**
     * Attaches data for answer
     * @param {*} data
     * @returns {IMessage}
     * @memberOf BaseMessage
     */
    public withData(data: any): IMessage {
        this.replyData = data;
        return this;
    }

    /**
     * @param {*} args
     * @returns {string}
     * @memberOf BaseMessage
     */
    public answer(args: any): string|void {
        throw new Error('not implemented');
    }

    private composeOwnName() {
        const firstName: string = this.firstName || '';
        const lastName: string = this.lastName || '';

        return `${firstName} ${lastName}`.trim();
    }
}
