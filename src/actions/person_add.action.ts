import { Injectable} from '@nestjs/common';
import { BaseAction, IDoActionParams } from './base.action';
import { Event } from '../storage/models/event';
import { Player } from 'src/storage/models/player';

@Injectable()
export class PersonAddAction extends BaseAction {
    protected setEvent(): void {
        this.event = this.appEmitter.PERSON_ADD;
    }

    protected async doAction(ctx, params: IDoActionParams) {
        const activeEvent: Event = await this.storageService.findChatActiveEvent(params.chat);

        if (!activeEvent) {
            return this.replyWithNoEvent(ctx, params);
        }

        const name: string = this.resolveName(ctx.update.message);
        const existedPlayer: Player = await this.storageService.findPlayer(activeEvent, name);

        if (existedPlayer) {
            return this.replyExistedPlayer(ctx, params, name);
        }

        const newPlayer: Player = await this.storageService.addPlayer(activeEvent, name);
        const players: Player[] = await this.storageService.getPlayers(activeEvent);

        return ctx.replyWithHTML(this.templateService.apply({
            action: 'person_add',
            status: this.STATUS_SUCCESS,
            lang: params.lang,
        }, {
            name: newPlayer.name,
            total: players.length,
            players: players.map((player, index) => ({
                index: index + 1,
                name: player.name,
            })),
        }));
    }

    private replyWithNoEvent(ctx, params: IDoActionParams) {
        return ctx.replyWithHTML(this.templateService.apply({
            action: 'person_add',
            status: 'no_event',
            lang: params.lang,
        }, {}));
    }

    private replyExistedPlayer(ctx, params: IDoActionParams, name) {
        return ctx.replyWithHTML(this.templateService.apply({
            action: 'person_add',
            status: 'already_added',
            lang: params.lang,
        }, {name}));
    }

    private resolveName(message): string {
        const targetName: string = message.text.replace(/^\/add\S*/, '').trim();
        const {first_name: firstName, last_name: lastName} = message.from;

        return targetName.length > 0
            ? targetName
            : `${firstName} ${lastName}`;
    }
}
